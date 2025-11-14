import { randomUUID } from "node:crypto"
import * as errors from "@superbuilders/errors"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { exemplarQuestions } from "@/db/schema"
import { inngest } from "@/inngest/client"
import { generateTemplate } from "@/inngest/functions/template/generation"
import { typecheckTemplate } from "@/inngest/functions/template/typecheck"
import { validateZeroSeed } from "@/inngest/functions/template/zero-seed"

const MAX_GENERATION_CYCLES = 100

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

		let iteration = 0
		let currentTemplateId = initialTemplateId

		while (iteration < MAX_GENERATION_CYCLES) {
			logger.info("dispatching template generation run", {
				exemplarQuestionId,
				templateId: currentTemplateId,
				iteration
			})

			const generationResult = await errors.try(
				step.invoke("generate-template", {
					function: generateTemplate,
					data: { exemplarQuestionId, templateId: currentTemplateId }
				})
			)
			if (generationResult.error) {
				const reason = generationResult.error.toString()
				logger.error("template generation invocation failed", {
					exemplarQuestionId,
					templateId: currentTemplateId,
					reason,
					error: generationResult.error
				})
				const failureEventResult = await errors.try(
					step.sendEvent("template-generation-failed-invoke", {
						id: `${baseEventId}-generation-invoke-failed-${currentTemplateId}`,
						name: "template/exemplar-question.template.generate.failed",
						data: { exemplarQuestionId, templateId: currentTemplateId, reason }
					})
				)
				if (failureEventResult.error) {
					logger.error(
						"template generation failure event emission failed after invoke error",
						{
							exemplarQuestionId,
							templateId: currentTemplateId,
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

			const typecheckResult = await errors.try(
				step.invoke("typecheck-template", {
					function: typecheckTemplate,
					data: { exemplarQuestionId, templateId: currentTemplateId }
				})
			)
			if (typecheckResult.error) {
				const reason = typecheckResult.error.toString()
				logger.error("template typecheck invocation failed", {
					exemplarQuestionId,
					templateId: currentTemplateId,
					reason,
					error: typecheckResult.error
				})
				const failureEventResult = await errors.try(
					step.sendEvent("template-generation-typecheck-invoke-failed", {
						id: `${baseEventId}-generation-typecheck-invoke-failed-${currentTemplateId}`,
						name: "template/exemplar-question.template.generate.failed",
						data: { exemplarQuestionId, templateId: currentTemplateId, reason }
					})
				)
				if (failureEventResult.error) {
					logger.error(
						"template generation failure event emission failed after typecheck invoke error",
						{
							exemplarQuestionId,
							templateId: currentTemplateId,
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

			const typecheckOutcome = typecheckResult.data.outcome
			const validatedTemplateId = typecheckOutcome.templateId
			const diagnosticsCount =
				typecheckOutcome.status === "valid"
					? 0
					: typecheckOutcome.diagnosticsCount

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
						logger.error("template generation failure event emission failed", {
							exemplarQuestionId,
							templateId: validatedTemplateId,
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

				currentTemplateId = randomUUID()
				continue
			}

			logger.info("typescript validation succeeded; running zero-seed", {
				exemplarQuestionId,
				templateId: validatedTemplateId
			})

			const zeroSeedResult = await errors.try(
				step.invoke("validate-zero-seed", {
					function: validateZeroSeed,
					data: { exemplarQuestionId, templateId: validatedTemplateId }
				})
			)
			if (zeroSeedResult.error) {
				const reason = zeroSeedResult.error.toString()
				logger.error("zero-seed invocation failed", {
					exemplarQuestionId,
					templateId: validatedTemplateId,
					reason,
					error: zeroSeedResult.error
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

			if (zeroSeedResult.data.status === "failed") {
				const reason =
					zeroSeedResult.data.reason ?? "zero-seed validation failed"
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

			logger.info("template generation completed after zero-seed validation", {
				exemplarQuestionId,
				templateId: validatedTemplateId
			})
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
