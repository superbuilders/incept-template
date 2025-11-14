import { randomUUID } from "node:crypto"
import * as errors from "@superbuilders/errors"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { templates } from "@/db/schema"
import { inngest } from "@/inngest/client"
import { startExemplarQuestionTemplateGeneration } from "@/inngest/functions/exemplar-question/generation"
import { scaffoldExemplarQuestion } from "@/inngest/functions/exemplar-question/scaffold"

type CompletedResult = {
	status: "completed"
	exemplarQuestionId: string
	scaffolded: boolean
	templateId: string
}

type FailedResult = {
	status: "failed"
	exemplarQuestionId: string
	reason: string
	templateId?: string
}

type FullPipelineResult = CompletedResult | FailedResult

export const generateTemplateForExemplarQuestion = inngest.createFunction(
	{
		id: "template-generate-full",
		name: "Template Generate (Full Pipeline)",
		idempotency: "event",
		concurrency: [
			{ scope: "fn", key: "event.data.exemplarQuestionId", limit: 1 }
		]
	},
	{ event: "template/exemplar-question.template.generate.full.invoked" },
	async ({ event, step, logger }): Promise<FullPipelineResult> => {
		const { exemplarQuestionId, exampleAssessmentItemBody, metadata } =
			event.data

		logger.info("starting full template generation pipeline", {
			exemplarQuestionId
		})

		const templateExists = await step.run("check-template-exists", async () => {
			const existing = await db
				.select({ id: templates.id })
				.from(templates)
				.where(eq(templates.exemplarQuestionId, exemplarQuestionId))
				.limit(1)
			return Boolean(existing[0])
		})

		let scaffolded = false

		if (!templateExists) {
			const scaffoldDispatch = await errors.try(
				step.invoke("scaffold-exemplar-question", {
					function: scaffoldExemplarQuestion,
					data: {
						exemplarQuestionId,
						exampleAssessmentItemBody,
						metadata: metadata ?? null
					}
				})
			)

			if (scaffoldDispatch.error) {
				logger.error("scaffold stage failed during full pipeline", {
					exemplarQuestionId,
					error: scaffoldDispatch.error
				})
				throw scaffoldDispatch.error
			}

			scaffolded = true
			logger.info("template scaffold completed for full pipeline", {
				exemplarQuestionId
			})
		} else {
			logger.info("template already scaffolded; skipping scaffold stage", {
				exemplarQuestionId
			})
		}

		const initialTemplateId = randomUUID()

		const generationResult = await errors.try(
			step.invoke("start-exemplar-question-template-generation", {
				function: startExemplarQuestionTemplateGeneration,
				data: { exemplarQuestionId, templateId: initialTemplateId }
			})
		)

		if (generationResult.error) {
			const reason =
				generationResult.error.message ?? "template generation failed"
			logger.error("template generation failed during full pipeline", {
				exemplarQuestionId,
				reason,
				error: generationResult.error
			})
			return { status: "failed", exemplarQuestionId, reason }
		}

		const { templateId } = generationResult.data

		logger.info("full template generation pipeline completed", {
			exemplarQuestionId,
			templateId,
			scaffolded
		})

		return {
			status: "completed",
			exemplarQuestionId,
			scaffolded,
			templateId
		}
	}
)
