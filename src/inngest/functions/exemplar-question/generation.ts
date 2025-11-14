import { randomUUID } from "node:crypto"
import * as errors from "@superbuilders/errors"
import { asc, eq } from "drizzle-orm"
import { db } from "@/db"
import type { TemplateRecord } from "@/db/schema"
import { exemplarQuestions, templates } from "@/db/schema"
import { inngest } from "@/inngest/client"

const MAX_GENERATION_CYCLES = 100

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

async function findLatestValidatedTemplate(
	templatesForQuestion: TemplateRecord[]
): Promise<TemplateRecord | null> {
	for (let index = templatesForQuestion.length - 1; index >= 0; index -= 1) {
		const template = templatesForQuestion[index]
		if (hasCompletedValidation(template)) {
			return template
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
		const { exemplarQuestionId, templateId: initialTemplateId } = event.data
		const baseEventId = event.id
		logger.info("starting template generation workflow", {
			exemplarQuestionId,
			templateId: initialTemplateId
		})

		const templateResult = await db
			.select({ id: exemplarQuestions.id })
			.from(exemplarQuestions)
			.where(eq(exemplarQuestions.id, exemplarQuestionId))
			.limit(1)

		if (!templateResult[0]) {
			logger.error("template not found for generation workflow", {
				exemplarQuestionId,
				templateId: initialTemplateId
			})
			const reason = `template not found: ${exemplarQuestionId}`

			const failureEventResult = await errors.try(
				step.sendEvent("template-generation-start-failed", {
					id: `${baseEventId}-generation-start-failed`,
					name: "template/exemplar-question.template.generate.failed",
					data: { exemplarQuestionId, templateId: initialTemplateId, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error("template generation failure event emission failed", {
					exemplarQuestionId,
					templateId: initialTemplateId,
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
		const latestValidatedTemplate =
			await findLatestValidatedTemplate(templatesForQuestion)

		if (latestValidatedTemplate) {
			logger.info(
				"template generation already satisfied by validated template",
				{
					exemplarQuestionId,
					templateId: latestValidatedTemplate.id
				}
			)

			const completionEventResult = await errors.try(
				step.sendEvent("template-generation-already-completed", {
					id: `${baseEventId}-generation-already-completed`,
					name: "template/exemplar-question.template.generate.completed",
					data: {
						exemplarQuestionId,
						templateId: latestValidatedTemplate.id
					}
				})
			)
			if (completionEventResult.error) {
				logger.error(
					"template generation completion event emission failed for validated template",
					{
						exemplarQuestionId,
						templateId: latestValidatedTemplate.id,
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
				templateId: latestValidatedTemplate.id
			}
		}

		let iteration = 0
		let currentTemplateId = initialTemplateId

		while (iteration < MAX_GENERATION_CYCLES) {
			logger.info("dispatching template generation run", {
				exemplarQuestionId,
				templateId: currentTemplateId,
				iteration
			})

			const requestGenerationEventResult = await errors.try(
				step.sendEvent(`request-template-generation-${currentTemplateId}`, {
					id: `${baseEventId}-template-generation-${currentTemplateId}`,
					name: "template/template.generate.requested",
					data: { exemplarQuestionId, templateId: currentTemplateId }
				})
			)
			if (requestGenerationEventResult.error) {
				logger.error("template generation request event emission failed", {
					exemplarQuestionId,
					templateId: currentTemplateId,
					error: requestGenerationEventResult.error
				})
				throw errors.wrap(
					requestGenerationEventResult.error,
					`template generation request event ${exemplarQuestionId}`
				)
			}

			const waitValidationCompleted = step
				.waitForEvent(
					`wait-template-validation-completed-${currentTemplateId}`,
					{
						event: "template/template.validate.completed",
						timeout: "30m",
						if: `async.data.exemplarQuestionId == "${exemplarQuestionId}" && async.data.templateId == "${currentTemplateId}"`
					}
				)
				.then((evt) => ({ kind: "validation-completed" as const, evt }))

			const waitGenerationFailed = step
				.waitForEvent(`wait-template-generation-failed-${currentTemplateId}`, {
					event: "template/template.generate.failed",
					timeout: "30m",
					if: `async.data.exemplarQuestionId == "${exemplarQuestionId}" && async.data.templateId == "${currentTemplateId}"`
				})
				.then((evt) => ({ kind: "generation-failed" as const, evt }))

			const outcome = await Promise.race([
				waitValidationCompleted,
				waitGenerationFailed
			])

			if (!outcome.evt) {
				const reason = `template generation timed out for template ${currentTemplateId}`
				logger.error("template generation run timed out", {
					exemplarQuestionId,
					templateId: currentTemplateId
				})
				const failureEventResult = await errors.try(
					step.sendEvent("template-generation-timed-out", {
						id: `${baseEventId}-generation-timeout-${currentTemplateId}`,
						name: "template/exemplar-question.template.generate.failed",
						data: { exemplarQuestionId, templateId: currentTemplateId, reason }
					})
				)
				if (failureEventResult.error) {
					logger.error("failed to emit template generation timeout", {
						exemplarQuestionId,
						templateId: currentTemplateId,
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
				const { diagnosticsCount, templateId: validatedTemplateId } =
					outcome.evt.data

				if (diagnosticsCount > 0) {
					logger.warn("template validation produced diagnostics", {
						exemplarQuestionId,
						templateId: validatedTemplateId,
						diagnosticsCount,
						iteration
					})

					iteration += 1
					if (iteration >= MAX_GENERATION_CYCLES) {
						const reason = `template validation failed after ${MAX_GENERATION_CYCLES} iterations`
						const failureEventResult = await errors.try(
							step.sendEvent("template-generation-failed-validation", {
								id: `${baseEventId}-generation-validation-failed-${validatedTemplateId}`,
								name: "template/exemplar-question.template.generate.failed",
								data: {
									exemplarQuestionId,
									templateId: validatedTemplateId,
									reason
								}
							})
						)
						if (failureEventResult.error) {
							logger.error(
								"template generation failure event emission failed",
								{
									exemplarQuestionId,
									templateId: validatedTemplateId,
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

					currentTemplateId = randomUUID()
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
					.where(eq(templates.id, validatedTemplateId))
					.limit(1)
					.then((rows) => rows[0])

				if (!templateState) {
					const reason =
						"validated template missing after typescript validation"
					logger.error(
						"validated template missing after typescript validation",
						{
							exemplarQuestionId,
							templateId: validatedTemplateId
						}
					)
					const failureEventResult = await errors.try(
						step.sendEvent("template-generation-missing-template", {
							id: `${baseEventId}-missing-template-${validatedTemplateId}`,
							name: "template/exemplar-question.template.generate.failed",
							data: {
								exemplarQuestionId,
								templateId: validatedTemplateId,
								reason
							}
						})
					)
					if (failureEventResult.error) {
						logger.error(
							"failed to emit template generation failure after missing template",
							{
								exemplarQuestionId,
								templateId: validatedTemplateId,
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
						templateId: validatedTemplateId
					})
					const failureEventResult = await errors.try(
						step.sendEvent("template-generation-missing-ts-timestamp", {
							id: `${baseEventId}-missing-ts-timestamp-${validatedTemplateId}`,
							name: "template/exemplar-question.template.generate.failed",
							data: {
								exemplarQuestionId,
								templateId: validatedTemplateId,
								reason
							}
						})
					)
					if (failureEventResult.error) {
						logger.error(
							"failed to emit template generation failure after missing ts timestamp",
							{
								exemplarQuestionId,
								templateId: validatedTemplateId,
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
							templateId: validatedTemplateId
						}
					)
					const completionEventResult = await errors.try(
						step.sendEvent("template-generation-completed", {
							id: `${baseEventId}-generation-completed-${validatedTemplateId}`,
							name: "template/exemplar-question.template.generate.completed",
							data: {
								exemplarQuestionId,
								templateId: validatedTemplateId
							}
						})
					)
					if (completionEventResult.error) {
						logger.error(
							"template generation completion event emission failed after zero-seed validation check",
							{
								exemplarQuestionId,
								templateId: validatedTemplateId,
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
						templateId: validatedTemplateId
					}
				}

				logger.info(
					"typescript validation succeeded; requesting zero-seed validation",
					{
						exemplarQuestionId,
						templateId: validatedTemplateId
					}
				)
				const zeroSeedRequestResult = await errors.try(
					step.sendEvent(
						`template-zero-seed-validation-requested-${validatedTemplateId}`,
						{
							id: `${baseEventId}-zero-seed-request-${validatedTemplateId}`,
							name: "template/template.zero-seed.requested",
							data: {
								exemplarQuestionId,
								templateId: validatedTemplateId
							}
						}
					)
				)
				if (zeroSeedRequestResult.error) {
					logger.error("failed to dispatch zero-seed validation request", {
						exemplarQuestionId,
						templateId: validatedTemplateId,
						error: zeroSeedRequestResult.error
					})
					throw errors.wrap(
						zeroSeedRequestResult.error,
						`dispatch zero-seed validation request ${exemplarQuestionId}`
					)
				}

				const waitZeroSeedCompleted = step
					.waitForEvent(
						`wait-template-zero-seed-completed-${validatedTemplateId}`,
						{
							event: "template/template.zero-seed.completed",
							timeout: "30m",
							if: `async.data.exemplarQuestionId == "${exemplarQuestionId}" && async.data.templateId == "${validatedTemplateId}"`
						}
					)
					.then((evt) => ({ kind: "zero-seed-completed" as const, evt }))

				const waitZeroSeedFailed = step
					.waitForEvent(
						`wait-template-zero-seed-failed-${validatedTemplateId}`,
						{
							event: "template/template.zero-seed.failed",
							timeout: "30m",
							if: `async.data.exemplarQuestionId == "${exemplarQuestionId}" && async.data.templateId == "${validatedTemplateId}"`
						}
					)
					.then((evt) => ({ kind: "zero-seed-failed" as const, evt }))

				const zeroSeedOutcome = await Promise.race([
					waitZeroSeedCompleted,
					waitZeroSeedFailed
				])

				if (!zeroSeedOutcome.evt) {
					const reason = `zero-seed validation timed out for template ${validatedTemplateId}`
					logger.error("zero-seed validation timed out", {
						exemplarQuestionId,
						templateId: validatedTemplateId
					})
					const failureEventResult = await errors.try(
						step.sendEvent("template-generation-zero-seed-timeout", {
							id: `${baseEventId}-zero-seed-timeout-${validatedTemplateId}`,
							name: "template/exemplar-question.template.generate.failed",
							data: {
								exemplarQuestionId,
								templateId: validatedTemplateId,
								reason
							}
						})
					)
					if (failureEventResult.error) {
						logger.error(
							"failed to emit template generation failure after zero-seed timeout",
							{
								exemplarQuestionId,
								templateId: validatedTemplateId,
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
							templateId: validatedTemplateId
						}
					)
					const completionEventResult = await errors.try(
						step.sendEvent("template-generation-completed", {
							id: `${baseEventId}-generation-completed-${validatedTemplateId}`,
							name: "template/exemplar-question.template.generate.completed",
							data: {
								exemplarQuestionId,
								templateId: validatedTemplateId
							}
						})
					)
					if (completionEventResult.error) {
						logger.error(
							"template generation completion event emission failed after zero-seed validation",
							{
								exemplarQuestionId,
								templateId: validatedTemplateId,
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
						templateId: validatedTemplateId
					}
				}

				let reason = "zero-seed validation failed"
				const failureData = zeroSeedOutcome.evt?.data
				if (failureData && typeof failureData.reason === "string") {
					reason = failureData.reason
				}
				logger.error("zero-seed validation reported failure", {
					exemplarQuestionId,
					templateId: validatedTemplateId,
					reason
				})
				const failureEventResult = await errors.try(
					step.sendEvent("template-generation-zero-seed-failed", {
						id: `${baseEventId}-zero-seed-failed-${validatedTemplateId}`,
						name: "template/exemplar-question.template.generate.failed",
						data: {
							exemplarQuestionId,
							templateId: validatedTemplateId,
							reason
						}
					})
				)
				if (failureEventResult.error) {
					logger.error(
						"failed to emit template generation failure after zero-seed failure",
						{
							exemplarQuestionId,
							templateId: validatedTemplateId,
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
						templateId: currentTemplateId
					})
				}
				logger.error("template generation reported failure", {
					exemplarQuestionId,
					templateId: currentTemplateId,
					reason
				})
				const failureEventResult = await errors.try(
					step.sendEvent("template-generation-failed-generation", {
						id: `${baseEventId}-generation-template-failed-${currentTemplateId}`,
						name: "template/exemplar-question.template.generate.failed",
						data: { exemplarQuestionId, templateId: currentTemplateId, reason }
					})
				)
				if (failureEventResult.error) {
					logger.error("template generation failure event emission failed", {
						exemplarQuestionId,
						templateId: currentTemplateId,
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

		const reason = `template generation exhausted ${MAX_GENERATION_CYCLES} iterations`
		logger.error("template generation exhausted iteration limit", {
			exemplarQuestionId,
			templateId: currentTemplateId
		})
		const failureEventResult = await errors.try(
			step.sendEvent("template-generation-iteration-limit", {
				id: `${baseEventId}-generation-iteration-limit-${currentTemplateId}`,
				name: "template/exemplar-question.template.generate.failed",
				data: { exemplarQuestionId, templateId: currentTemplateId, reason }
			})
		)
		if (failureEventResult.error) {
			logger.error(
				"template generation failure event emission failed after iteration limit",
				{
					exemplarQuestionId,
					templateId: currentTemplateId,
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
)
