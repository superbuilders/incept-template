import * as errors from "@superbuilders/errors"
import { asc, eq } from "drizzle-orm"
import { db } from "@/db"
import type { TemplateRecord } from "@/db/schema"
import {
	exemplarQuestions,
	templates,
	typescriptDiagnostics
} from "@/db/schema"

const MAX_ATTEMPTS = 50

import { inngest } from "@/inngest/client"

async function listTemplatesForQuestion(
	templateId: string
): Promise<TemplateRecord[]> {
	return db
		.select({
			id: templates.id,
			questionId: templates.questionId,
			source: templates.source,
			gitCommitSha: templates.gitCommitSha,
			createdAt: templates.createdAt,
			typescriptRanAt: templates.typescriptRanAt
		})
		.from(templates)
		.where(eq(templates.questionId, templateId))
		.orderBy(asc(templates.createdAt))
}

async function hasSuccessfulTypeScriptRun(
	templateId: string
): Promise<boolean> {
	const templateRow = await db
		.select({ ranAt: templates.typescriptRanAt })
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)
		.then((rows) => rows[0])
	if (!templateRow?.ranAt) return false
	const diagnostic = await db
		.select({ id: typescriptDiagnostics.id })
		.from(typescriptDiagnostics)
		.where(eq(typescriptDiagnostics.templateId, templateId))
		.limit(1)
		.then((rows) => rows[0])
	return !diagnostic
}

async function findLatestValidatedAttempt(
	templatesForQuestion: TemplateRecord[]
): Promise<number | null> {
	for (let index = templatesForQuestion.length - 1; index >= 0; index -= 1) {
		const template = templatesForQuestion[index]
		if (await hasSuccessfulTypeScriptRun(template.id)) {
			return index
		}
	}
	return null
}

export const startTemplateGeneration = inngest.createFunction(
	{
		id: "template-generation-start",
		name: "Template Generation - Step 1: Start",
		idempotency: "event",
		concurrency: [{ scope: "fn", key: "event.data.templateId", limit: 1 }]
	},
	{ event: "template/template.generation.requested" },
	async ({ event, step, logger }) => {
		const { templateId } = event.data
		const baseEventId = event.id
		logger.info("starting template generation workflow", { templateId })

		const templateResult = await db
			.select({ id: exemplarQuestions.id })
			.from(exemplarQuestions)
			.where(eq(exemplarQuestions.id, templateId))
			.limit(1)

		if (!templateResult[0]) {
			logger.error("template not found for generation workflow", {
				templateId
			})
			const reason = `template not found: ${templateId}`

			const failureEventResult = await errors.try(
				step.sendEvent("template-generation-start-failed", {
					id: `${baseEventId}-generation-start-failed`,
					name: "template/template.generation.failed",
					data: { templateId, attempt: 0, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error("template generation failure event emission failed", {
					templateId,
					reason,
					error: failureEventResult.error
				})
				throw errors.wrap(
					failureEventResult.error,
					`template generation failure event ${templateId}`
				)
			}

			return { status: "failed" as const, reason }
		}

		const templatesForQuestion = await listTemplatesForQuestion(templateId)
		const latestValidatedAttempt =
			await findLatestValidatedAttempt(templatesForQuestion)

		if (latestValidatedAttempt !== null) {
			logger.info(
				"template generation already satisfied by validated candidate",
				{
					templateId,
					attempt: latestValidatedAttempt
				}
			)

			const completionEventResult = await errors.try(
				step.sendEvent("template-generation-already-completed", {
					id: `${baseEventId}-generation-already-completed`,
					name: "template/template.generation.completed",
					data: { templateId, attempt: latestValidatedAttempt }
				})
			)
			if (completionEventResult.error) {
				logger.error(
					"template generation completion event emission failed for validated candidate",
					{
						templateId,
						attempt: latestValidatedAttempt,
						error: completionEventResult.error
					}
				)
				throw errors.wrap(
					completionEventResult.error,
					`template generation completion event ${templateId}`
				)
			}

			return {
				status: "already-completed" as const,
				attempt: latestValidatedAttempt
			}
		}

		let currentAttempt = templatesForQuestion.length

		while (true) {
			logger.info("dispatching candidate generation attempt", {
				templateId,
				attempt: currentAttempt
			})

			const requestGenerationEventResult = await errors.try(
				step.sendEvent(`request-candidate-generation-${currentAttempt}`, {
					id: `${baseEventId}-candidate-generation-${currentAttempt}`,
					name: "template/candidate.generation.requested",
					data: { templateId, attempt: currentAttempt }
				})
			)
			if (requestGenerationEventResult.error) {
				logger.error("candidate generation request event emission failed", {
					templateId,
					attempt: currentAttempt,
					error: requestGenerationEventResult.error
				})
				throw errors.wrap(
					requestGenerationEventResult.error,
					`candidate generation request event ${templateId}`
				)
			}

			const waitValidationCompleted = step
				.waitForEvent(`wait-candidate-validation-completed-${currentAttempt}`, {
					event: "template/candidate.validation.completed",
					timeout: "30m",
					if: `async.data.templateId == "${templateId}" && async.data.attempt == ${currentAttempt}`
				})
				.then((evt) => ({ kind: "validation-completed" as const, evt }))

			const waitGenerationFailed = step
				.waitForEvent(`wait-candidate-generation-failed-${currentAttempt}`, {
					event: "template/candidate.generation.failed",
					timeout: "30m",
					if: `async.data.templateId == "${templateId}" && async.data.attempt == ${currentAttempt}`
				})
				.then((evt) => ({ kind: "generation-failed" as const, evt }))

			const outcome = await Promise.race([
				waitValidationCompleted,
				waitGenerationFailed
			])

			if (!outcome.evt) {
				const reason = `candidate attempt ${currentAttempt} timed out`
				logger.error("candidate attempt timed out", {
					templateId,
					attempt: currentAttempt
				})
				const failureEventResult = await errors.try(
					step.sendEvent("template-generation-timed-out", {
						id: `${baseEventId}-generation-timeout-${currentAttempt}`,
						name: "template/template.generation.failed",
						data: { templateId, reason, attempt: currentAttempt }
					})
				)
				if (failureEventResult.error) {
					logger.error("failed to emit template generation timeout", {
						templateId,
						attempt: currentAttempt,
						error: failureEventResult.error
					})
					throw errors.wrap(
						failureEventResult.error,
						`template generation timeout event ${templateId}`
					)
				}
				return { status: "failed" as const, reason }
			}

			if (outcome.kind === "validation-completed") {
				const diagnosticsCount = outcome.evt.data.diagnosticsCount
				if (diagnosticsCount === 0) {
					logger.info("template generation completed", {
						templateId,
						attempt: currentAttempt
					})
					const completionEventResult = await errors.try(
						step.sendEvent("template-generation-completed", {
							id: `${baseEventId}-generation-completed-${currentAttempt}`,
							name: "template/template.generation.completed",
							data: { templateId, attempt: currentAttempt }
						})
					)
					if (completionEventResult.error) {
						logger.error(
							"template generation completion event emission failed",
							{
								templateId,
								attempt: currentAttempt,
								error: completionEventResult.error
							}
						)
						throw errors.wrap(
							completionEventResult.error,
							`template generation completion event ${templateId}`
						)
					}
					return {
						status: "completed" as const,
						attempt: currentAttempt
					}
				}

				logger.warn("candidate validation produced diagnostics", {
					templateId,
					attempt: currentAttempt,
					diagnosticsCount
				})

				const nextAttempt = currentAttempt + 1
				if (nextAttempt >= MAX_ATTEMPTS) {
					const reason = `candidate validation failed after ${MAX_ATTEMPTS} attempts`
					const failureEventResult = await errors.try(
						step.sendEvent("template-generation-failed-validation", {
							id: `${baseEventId}-generation-validation-failed-${currentAttempt}`,
							name: "template/template.generation.failed",
							data: { templateId, attempt: currentAttempt, reason }
						})
					)
					if (failureEventResult.error) {
						logger.error("template generation failure event emission failed", {
							templateId,
							attempt: currentAttempt,
							reason,
							error: failureEventResult.error
						})
						throw errors.wrap(
							failureEventResult.error,
							`template generation failure event ${templateId}`
						)
					}
					return { status: "failed" as const, reason }
				}

				logger.info("retrying template generation after diagnostics", {
					templateId,
					attempt: nextAttempt
				})
				currentAttempt = nextAttempt
				continue
			}

			if (outcome.kind === "generation-failed") {
				let reason = "candidate generation failed"
				const failureData = outcome.evt?.data
				if (failureData && typeof failureData.reason === "string") {
					reason = failureData.reason
				} else {
					logger.warn("candidate generation failure reason missing", {
						templateId,
						attempt: currentAttempt
					})
				}
				logger.error("candidate generation reported failure", {
					templateId,
					attempt: currentAttempt,
					reason
				})
				const failureEventResult = await errors.try(
					step.sendEvent("template-generation-failed-generation", {
						id: `${baseEventId}-generation-candidate-failed-${currentAttempt}`,
						name: "template/template.generation.failed",
						data: { templateId, reason, attempt: currentAttempt }
					})
				)
				if (failureEventResult.error) {
					logger.error("template generation failure event emission failed", {
						templateId,
						attempt: currentAttempt,
						reason,
						error: failureEventResult.error
					})
					throw errors.wrap(
						failureEventResult.error,
						`template generation failure event ${templateId}`
					)
				}
				return { status: "failed" as const, reason }
			}
		}
	}
)
