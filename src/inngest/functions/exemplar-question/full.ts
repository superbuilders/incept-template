import { randomUUID } from "node:crypto"
import * as errors from "@superbuilders/errors"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { templates } from "@/db/schema"
import { inngest } from "@/inngest/client"
import { startExemplarQuestionTemplateGeneration } from "@/inngest/functions/exemplar-question/generation"

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
	{ event: "template/exemplar-question.template.generate.full" },
	async ({ event, step, logger }): Promise<FullPipelineResult> => {
		const { exemplarQuestionId, exampleAssessmentItemBody, metadata } =
			event.data
		const baseEventId = event.id

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
			const waitForScaffoldCompleted = step
				.waitForEvent("wait-template-scaffold-completed", {
					event: "template/exemplar-question.scaffold.completed",
					timeout: "15m",
					if: `async.data.exemplarQuestionId == "${exemplarQuestionId}"`
				})
				.then((evt) => ({ kind: "completed" as const, evt }))

			const waitForScaffoldFailed = step
				.waitForEvent("wait-template-scaffold-failed", {
					event: "template/exemplar-question.scaffold.failed",
					timeout: "15m",
					if: `async.data.exemplarQuestionId == "${exemplarQuestionId}"`
				})
				.then((evt) => ({ kind: "failed" as const, evt }))

			const dispatchScaffoldEvent = await errors.try(
				step.sendEvent("dispatch-template-scaffold", {
					id: `${baseEventId}-scaffold-request`,
					name: "template/exemplar-question.scaffold.requested",
					data: {
						exemplarQuestionId,
						exampleAssessmentItemBody,
						metadata: metadata ?? null
					}
				})
			)

			if (dispatchScaffoldEvent.error) {
				logger.error("failed to dispatch scaffold request", {
					exemplarQuestionId,
					error: dispatchScaffoldEvent.error
				})
				throw errors.wrap(
					dispatchScaffoldEvent.error,
					"dispatch scaffold request"
				)
			}

			const scaffoldOutcome = await Promise.race([
				waitForScaffoldCompleted,
				waitForScaffoldFailed
			])

			if (!scaffoldOutcome.evt) {
				const reason = "template scaffold timed out"
				logger.error("scaffold stage timed out during full pipeline", {
					exemplarQuestionId
				})
				return { status: "failed", exemplarQuestionId, reason }
			}

			if (scaffoldOutcome.kind === "failed") {
				const reason =
					typeof scaffoldOutcome.evt.data.reason === "string"
						? scaffoldOutcome.evt.data.reason
						: "template scaffold failed"
				logger.error("scaffold stage failed during full pipeline", {
					exemplarQuestionId,
					reason
				})
				return { status: "failed", exemplarQuestionId, reason }
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
