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
	{ event: "template/exemplar-question.template.generate.invoked" },
	async ({ event, step, logger }) => {
		const { exemplarQuestionId, templateId: initialTemplateId } = event.data
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
			throw errors.new(`template not found: ${exemplarQuestionId}`)
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
				logger.error("template generation invocation failed", {
					exemplarQuestionId,
					templateId: currentTemplateId,
					error: generationResult.error
				})
				throw errors.wrap(generationResult.error, "template generation failed")
			}

			const typecheckResult = await errors.try(
				step.invoke("typecheck-template", {
					function: typecheckTemplate,
					data: { exemplarQuestionId, templateId: currentTemplateId }
				})
			)
			if (typecheckResult.error) {
				logger.error("template typecheck invocation failed", {
					exemplarQuestionId,
					templateId: currentTemplateId,
					error: typecheckResult.error
				})
				throw errors.wrap(typecheckResult.error, "template typecheck failed")
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
					logger.error("template validation exhausted iteration limit", {
						exemplarQuestionId,
						templateId: validatedTemplateId,
						iteration
					})
					throw errors.new(
						`template validation failed after ${MAX_GENERATION_CYCLES} iterations`
					)
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
				logger.error("zero-seed invocation failed", {
					exemplarQuestionId,
					templateId: validatedTemplateId,
					error: zeroSeedResult.error
				})
				throw errors.wrap(zeroSeedResult.error, "zero-seed validation failed")
			}

			if (zeroSeedResult.data.status === "failed") {
				const zeroSeedReason =
					zeroSeedResult.data.reason ?? "zero-seed validation failed"
				logger.error("zero-seed validation reported failure", {
					exemplarQuestionId,
					templateId: validatedTemplateId,
					reason: zeroSeedReason
				})
				throw errors.new(zeroSeedReason)
			}

			logger.info("template generation completed after zero-seed validation", {
				exemplarQuestionId,
				templateId: validatedTemplateId
			})
			return {
				status: "completed" as const,
				templateId: validatedTemplateId
			}
		}

		logger.error("template generation exhausted iteration limit", {
			exemplarQuestionId,
			templateId: currentTemplateId
		})
		throw errors.new(
			`template generation exhausted ${MAX_GENERATION_CYCLES} iterations`
		)
	}
)
