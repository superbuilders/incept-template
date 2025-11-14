import * as errors from "@superbuilders/errors"
import { asc, eq } from "drizzle-orm"
import { db } from "@/db"
import type { TemplateRecord } from "@/db/schema"
import { exemplarQuestions, templates } from "@/db/schema"

const MAX_ATTEMPTS = 100

import { inngest } from "@/inngest/client"

async function listTemplatesForQuestion(
	exemplarQuestionId: string
): Promise<TemplateRecord[]> {
	return db
		.select({
			id: templates.id,
			exemplarQuestionId: templates.exemplarQuestionId,
			source: templates.source,
			createdGitCommitSha: templates.createdGitCommitSha,
			createdAt: templates.createdAt,
			zeroSeedSuccessfullyGeneratedAt:
				templates.zeroSeedSuccessfullyGeneratedAt,
			typescriptPassedWithZeroDiagnosticsAt:
				templates.typescriptPassedWithZeroDiagnosticsAt
		})
		.from(templates)
		.where(eq(templates.exemplarQuestionId, exemplarQuestionId))
		.orderBy(asc(templates.createdAt))
}

function hasCompletedValidation(template: {
	zeroSeedSuccessfullyGeneratedAt: Date | string | null
	typescriptPassedWithZeroDiagnosticsAt: Date | string | null
}): boolean {
	return Boolean(
		template.zeroSeedSuccessfullyGeneratedAt &&
			template.typescriptPassedWithZeroDiagnosticsAt
	)
}

async function findLatestValidatedAttempt(
	templatesForQuestion: TemplateRecord[]
): Promise<number | null> {
	for (let index = templatesForQuestion.length - 1; index >= 0; index -= 1) {
		const template = templatesForQuestion[index]
		if (hasCompletedValidation(template)) {
			return index
		}
	}
	return null
}

export const startExemplarQuestionTemplateGeneration = inngest.createFunction(
	{
		id: "exemplar-question-template-generation-start",
		name: "Template Generation - Step 1: Start",
		idempotency: "event",
		concurrency: [
			{ scope: "fn", key: "event.data.exemplarQuestionId", limit: 1 }
		]
	},
	{ event: "template/exemplar-question.template.generate.requested" },
	async ({ event, step, logger }) => {
		const { exemplarQuestionId } = event.data
		const baseEventId = event.id
		logger.info("starting template generation workflow", { exemplarQuestionId })

		const templateResult = await db
			.select({ id: exemplarQuestions.id })
			.from(exemplarQuestions)
			.where(eq(exemplarQuestions.id, exemplarQuestionId))
			.limit(1)

		if (!templateResult[0]) {
			logger.error("template not found for generation workflow", {
				exemplarQuestionId
			})
			const reason = `template not found: ${exemplarQuestionId}`

			const failureEventResult = await errors.try(
				step.sendEvent("template-generation-start-failed", {
					id: `${baseEventId}-generation-start-failed`,
					name: "template/exemplar-question.template.generate.failed",
					data: { exemplarQuestionId, attempt: 0, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error("template generation failure event emission failed", {
					exemplarQuestionId,
					reason,
					error: failureEventResult.error
				})
				throw errors.wrap(
					failureEventResult.error,
					`template generation failure event ${exemplarQuestionId}`
				)
			}

			return { status: "failed" as const, reason }
		}

		const templatesForQuestion =
			await listTemplatesForQuestion(exemplarQuestionId)
		const latestValidatedAttempt =
			await findLatestValidatedAttempt(templatesForQuestion)

		if (latestValidatedAttempt !== null) {
			logger.info(
				"template generation already satisfied by validated template",
				{
					exemplarQuestionId,
					attempt: latestValidatedAttempt
				}
			)

			const validatedTemplate = templatesForQuestion[latestValidatedAttempt]
			if (!validatedTemplate) {
				const reason = "validated template record missing during generation"
				logger.error(
					"validated template missing from templates list during generation",
					{
						exemplarQuestionId,
						attempt: latestValidatedAttempt,
						reason
					}
				)
				throw errors.new(reason)
			}

			const completionEventResult = await errors.try(
				step.sendEvent("template-generation-already-completed", {
					id: `${baseEventId}-generation-already-completed`,
					name: "template/exemplar-question.template.generate.completed",
					data: {
						exemplarQuestionId,
						attempt: latestValidatedAttempt,
						templateId: validatedTemplate.id
					}
				})
			)
			if (completionEventResult.error) {
				logger.error(
					"template generation completion event emission failed for validated template",
					{
						exemplarQuestionId,
						attempt: latestValidatedAttempt,
						error: completionEventResult.error
					}
				)
				throw errors.wrap(
					completionEventResult.error,
					`template generation completion event ${exemplarQuestionId}`
				)
			}

			return {
				status: "already-completed" as const,
				attempt: latestValidatedAttempt
			}
		}

		let currentAttempt = templatesForQuestion.length

		while (true) {
			logger.info("dispatching template generation attempt", {
				exemplarQuestionId,
				attempt: currentAttempt
			})

			const requestGenerationEventResult = await errors.try(
				step.sendEvent(`request-template-generation-${currentAttempt}`, {
					id: `${baseEventId}-template-generation-${currentAttempt}`,
					name: "template/template.generate.requested",
					data: { exemplarQuestionId, attempt: currentAttempt }
				})
			)
			if (requestGenerationEventResult.error) {
				logger.error("template generation request event emission failed", {
					exemplarQuestionId,
					attempt: currentAttempt,
					error: requestGenerationEventResult.error
				})
				throw errors.wrap(
					requestGenerationEventResult.error,
					`template generation request event ${exemplarQuestionId}`
				)
			}

			const waitValidationCompleted = step
				.waitForEvent(`wait-template-validation-completed-${currentAttempt}`, {
					event: "template/template.validate.completed",
					timeout: "30m",
					if: `async.data.exemplarQuestionId == "${exemplarQuestionId}" && async.data.attempt == ${currentAttempt}`
				})
				.then((evt) => ({ kind: "validation-completed" as const, evt }))

			const waitGenerationFailed = step
				.waitForEvent(`wait-template-generation-failed-${currentAttempt}`, {
					event: "template/template.generate.failed",
					timeout: "30m",
					if: `async.data.exemplarQuestionId == "${exemplarQuestionId}" && async.data.attempt == ${currentAttempt}`
				})
				.then((evt) => ({ kind: "generation-failed" as const, evt }))

			const outcome = await Promise.race([
				waitValidationCompleted,
				waitGenerationFailed
			])

			if (!outcome.evt) {
				const reason = `template generation attempt ${currentAttempt} timed out`
				logger.error("template generation attempt timed out", {
					exemplarQuestionId,
					attempt: currentAttempt
				})
				const failureEventResult = await errors.try(
					step.sendEvent("template-generation-timed-out", {
						id: `${baseEventId}-generation-timeout-${currentAttempt}`,
						name: "template/exemplar-question.template.generate.failed",
						data: { exemplarQuestionId, reason, attempt: currentAttempt }
					})
				)
				if (failureEventResult.error) {
					logger.error("failed to emit template generation timeout", {
						exemplarQuestionId,
						attempt: currentAttempt,
						error: failureEventResult.error
					})
					throw errors.wrap(
						failureEventResult.error,
						`template generation timeout event ${exemplarQuestionId}`
					)
				}
				return { status: "failed" as const, reason }
			}

			if (outcome.kind === "validation-completed") {
				const { diagnosticsCount, templateId } = outcome.evt.data

				if (diagnosticsCount > 0) {
					logger.warn("template validation produced diagnostics", {
						exemplarQuestionId,
						attempt: currentAttempt,
						diagnosticsCount
					})

					const nextAttempt = currentAttempt + 1
					if (nextAttempt >= MAX_ATTEMPTS) {
						const reason = `template validation failed after ${MAX_ATTEMPTS} attempts`
						const failureEventResult = await errors.try(
							step.sendEvent("template-generation-failed-validation", {
								id: `${baseEventId}-generation-validation-failed-${currentAttempt}`,
								name: "template/exemplar-question.template.generate.failed",
								data: { exemplarQuestionId, attempt: currentAttempt, reason }
							})
						)
						if (failureEventResult.error) {
							logger.error(
								"template generation failure event emission failed",
								{
									exemplarQuestionId,
									attempt: currentAttempt,
									reason,
									error: failureEventResult.error
								}
							)
							throw errors.wrap(
								failureEventResult.error,
								`template generation failure event ${exemplarQuestionId}`
							)
						}
						return { status: "failed" as const, reason }
					}

					logger.info("retrying template generation after diagnostics", {
						exemplarQuestionId,
						attempt: nextAttempt
					})
					currentAttempt = nextAttempt
					continue
				}

				const templateState = await db
					.select({
						id: templates.id,
						zeroSeedSuccessfullyGeneratedAt:
							templates.zeroSeedSuccessfullyGeneratedAt,
						typescriptPassedWithZeroDiagnosticsAt:
							templates.typescriptPassedWithZeroDiagnosticsAt
					})
					.from(templates)
					.where(eq(templates.id, templateId))
					.limit(1)
					.then((rows) => rows[0])

				if (!templateState) {
					const reason =
						"validated template missing after typescript validation"
					logger.error(
						"validated template missing after typescript validation",
						{
							exemplarQuestionId,
							attempt: currentAttempt,
							templateId
						}
					)
					const failureEventResult = await errors.try(
						step.sendEvent("template-generation-missing-template", {
							id: `${baseEventId}-missing-template-${currentAttempt}`,
							name: "template/exemplar-question.template.generate.failed",
							data: { exemplarQuestionId, attempt: currentAttempt, reason }
						})
					)
					if (failureEventResult.error) {
						logger.error(
							"failed to emit template generation failure after missing template",
							{
								exemplarQuestionId,
								attempt: currentAttempt,
								error: failureEventResult.error
							}
						)
						throw errors.wrap(
							failureEventResult.error,
							`template generation failure event ${exemplarQuestionId}`
						)
					}
					return { status: "failed" as const, reason }
				}

				if (!templateState.typescriptPassedWithZeroDiagnosticsAt) {
					const reason = "template missing TypeScript validation timestamp"
					logger.error("template missing TypeScript validation timestamp", {
						exemplarQuestionId,
						attempt: currentAttempt,
						templateId
					})
					const failureEventResult = await errors.try(
						step.sendEvent("template-generation-missing-ts-timestamp", {
							id: `${baseEventId}-missing-ts-timestamp-${currentAttempt}`,
							name: "template/exemplar-question.template.generate.failed",
							data: { exemplarQuestionId, attempt: currentAttempt, reason }
						})
					)
					if (failureEventResult.error) {
						logger.error(
							"failed to emit template generation failure after missing ts timestamp",
							{
								exemplarQuestionId,
								attempt: currentAttempt,
								error: failureEventResult.error
							}
						)
						throw errors.wrap(
							failureEventResult.error,
							`template generation failure event ${exemplarQuestionId}`
						)
					}
					return { status: "failed" as const, reason }
				}

				if (hasCompletedValidation(templateState)) {
					logger.info(
						"template generation completed (already zero-seed validated)",
						{
							exemplarQuestionId,
							attempt: currentAttempt,
							templateId
						}
					)
					const completionEventResult = await errors.try(
						step.sendEvent("template-generation-completed", {
							id: `${baseEventId}-generation-completed-${currentAttempt}`,
							name: "template/exemplar-question.template.generate.completed",
							data: {
								exemplarQuestionId,
								attempt: currentAttempt,
								templateId
							}
						})
					)
					if (completionEventResult.error) {
						logger.error(
							"template generation completion event emission failed after zero-seed validation check",
							{
								exemplarQuestionId,
								attempt: currentAttempt,
								error: completionEventResult.error
							}
						)
						throw errors.wrap(
							completionEventResult.error,
							`template generation completion event ${exemplarQuestionId}`
						)
					}
					return {
						status: "completed" as const,
						attempt: currentAttempt
					}
				}

				logger.info(
					"typescript validation succeeded; requesting zero-seed validation",
					{
						exemplarQuestionId,
						attempt: currentAttempt,
						templateId
					}
				)
				const zeroSeedRequestResult = await errors.try(
					step.sendEvent("template-zero-seed-validation-requested", {
						id: `${baseEventId}-zero-seed-request-${currentAttempt}`,
						name: "template/template.zero-seed.requested",
						data: {
							exemplarQuestionId,
							attempt: currentAttempt,
							templateId
						}
					})
				)
				if (zeroSeedRequestResult.error) {
					logger.error("failed to dispatch zero-seed validation request", {
						exemplarQuestionId,
						attempt: currentAttempt,
						templateId,
						error: zeroSeedRequestResult.error
					})
					throw errors.wrap(
						zeroSeedRequestResult.error,
						`dispatch zero-seed validation request ${exemplarQuestionId}`
					)
				}

				const waitZeroSeedCompleted = step
					.waitForEvent(`wait-template-zero-seed-completed-${currentAttempt}`, {
						event: "template/template.zero-seed.completed",
						timeout: "30m",
						if: `async.data.exemplarQuestionId == "${exemplarQuestionId}" && async.data.attempt == ${currentAttempt}`
					})
					.then((evt) => ({ kind: "zero-seed-completed" as const, evt }))

				const waitZeroSeedFailed = step
					.waitForEvent(`wait-template-zero-seed-failed-${currentAttempt}`, {
						event: "template/template.zero-seed.failed",
						timeout: "30m",
						if: `async.data.exemplarQuestionId == "${exemplarQuestionId}" && async.data.attempt == ${currentAttempt}`
					})
					.then((evt) => ({ kind: "zero-seed-failed" as const, evt }))

				const zeroSeedOutcome = await Promise.race([
					waitZeroSeedCompleted,
					waitZeroSeedFailed
				])

				if (!zeroSeedOutcome.evt) {
					const reason = "zero-seed validation timed out"
					logger.error("zero-seed validation timed out", {
						exemplarQuestionId,
						attempt: currentAttempt,
						templateId
					})
					const failureEventResult = await errors.try(
						step.sendEvent("template-generation-zero-seed-timeout", {
							id: `${baseEventId}-zero-seed-timeout-${currentAttempt}`,
							name: "template/exemplar-question.template.generate.failed",
							data: { exemplarQuestionId, attempt: currentAttempt, reason }
						})
					)
					if (failureEventResult.error) {
						logger.error(
							"failed to emit template generation failure after zero-seed timeout",
							{
								exemplarQuestionId,
								attempt: currentAttempt,
								error: failureEventResult.error
							}
						)
						throw errors.wrap(
							failureEventResult.error,
							`template generation failure event ${exemplarQuestionId}`
						)
					}
					return { status: "failed" as const, reason }
				}

				if (zeroSeedOutcome.kind === "zero-seed-completed") {
					logger.info(
						"template generation completed after zero-seed validation",
						{
							exemplarQuestionId,
							attempt: currentAttempt,
							templateId
						}
					)
					const completionEventResult = await errors.try(
						step.sendEvent("template-generation-completed", {
							id: `${baseEventId}-generation-completed-${currentAttempt}`,
							name: "template/exemplar-question.template.generate.completed",
							data: {
								exemplarQuestionId,
								attempt: currentAttempt,
								templateId
							}
						})
					)
					if (completionEventResult.error) {
						logger.error(
							"template generation completion event emission failed after zero-seed validation",
							{
								exemplarQuestionId,
								attempt: currentAttempt,
								error: completionEventResult.error
							}
						)
						throw errors.wrap(
							completionEventResult.error,
							`template generation completion event ${exemplarQuestionId}`
						)
					}
					return {
						status: "completed" as const,
						attempt: currentAttempt
					}
				}

				let reason = "zero-seed validation failed"
				const failureData = zeroSeedOutcome.evt?.data
				if (failureData && typeof failureData.reason === "string") {
					reason = failureData.reason
				}
				logger.error("zero-seed validation reported failure", {
					exemplarQuestionId,
					attempt: currentAttempt,
					templateId,
					reason
				})
				const failureEventResult = await errors.try(
					step.sendEvent("template-generation-zero-seed-failed", {
						id: `${baseEventId}-zero-seed-failed-${currentAttempt}`,
						name: "template/exemplar-question.template.generate.failed",
						data: { exemplarQuestionId, attempt: currentAttempt, reason }
					})
				)
				if (failureEventResult.error) {
					logger.error(
						"failed to emit template generation failure after zero-seed failure",
						{
							exemplarQuestionId,
							attempt: currentAttempt,
							error: failureEventResult.error
						}
					)
					throw errors.wrap(
						failureEventResult.error,
						`template generation failure event ${exemplarQuestionId}`
					)
				}
				return { status: "failed" as const, reason }
			}

			if (outcome.kind === "generation-failed") {
				let reason = "template generation failed"
				const failureData = outcome.evt?.data
				if (failureData && typeof failureData.reason === "string") {
					reason = failureData.reason
				} else {
					logger.warn("template generation failure reason missing", {
						exemplarQuestionId,
						attempt: currentAttempt
					})
				}
				logger.error("template generation reported failure", {
					exemplarQuestionId,
					attempt: currentAttempt,
					reason
				})
				const failureEventResult = await errors.try(
					step.sendEvent("template-generation-failed-generation", {
						id: `${baseEventId}-generation-template-failed-${currentAttempt}`,
						name: "template/exemplar-question.template.generate.failed",
						data: { exemplarQuestionId, reason, attempt: currentAttempt }
					})
				)
				if (failureEventResult.error) {
					logger.error("template generation failure event emission failed", {
						exemplarQuestionId,
						attempt: currentAttempt,
						reason,
						error: failureEventResult.error
					})
					throw errors.wrap(
						failureEventResult.error,
						`template generation failure event ${exemplarQuestionId}`
					)
				}
				return { status: "failed" as const, reason }
			}
		}
	}
)
