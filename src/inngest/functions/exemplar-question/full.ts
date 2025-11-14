import * as errors from "@superbuilders/errors"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { templates } from "@/db/schema"
import { inngest } from "@/inngest/client"

type CompletedResult = {
	status: "completed"
	exemplarQuestionId: string
	attempt: number
	scaffolded: boolean
	templateId: string
}

type FailedResult = {
	status: "failed"
	exemplarQuestionId: string
	reason: string
	attempt?: number
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

		const waitForGenerationCompleted = step
			.waitForEvent("wait-template-generation-completed", {
				event: "template/exemplar-question.template.generate.completed",
				timeout: "60m",
				if: `async.data.exemplarQuestionId == "${exemplarQuestionId}"`
			})
			.then((evt) => ({ kind: "completed" as const, evt }))

		const waitForGenerationFailed = step
			.waitForEvent("wait-template-generation-failed", {
				event: "template/exemplar-question.template.generate.failed",
				timeout: "60m",
				if: `async.data.exemplarQuestionId == "${exemplarQuestionId}"`
			})
			.then((evt) => ({ kind: "failed" as const, evt }))

		const dispatchGenerationEvent = await errors.try(
			step.sendEvent("dispatch-template-generation", {
				id: `${baseEventId}-generation-request`,
				name: "template/exemplar-question.template.generate.requested",
				data: { exemplarQuestionId }
			})
		)

		if (dispatchGenerationEvent.error) {
			logger.error("failed to dispatch template generation request", {
				exemplarQuestionId,
				error: dispatchGenerationEvent.error
			})
			throw errors.wrap(
				dispatchGenerationEvent.error,
				"dispatch template generation request"
			)
		}

		const generationOutcome = await Promise.race([
			waitForGenerationCompleted,
			waitForGenerationFailed
		])

		if (!generationOutcome.evt) {
			const reason = "template generation timed out"
			logger.error("template generation timed out during full pipeline", {
				exemplarQuestionId
			})
			return { status: "failed", exemplarQuestionId, reason }
		}

		if (generationOutcome.kind === "failed") {
			const failureData = generationOutcome.evt.data
			const reason =
				typeof failureData.reason === "string"
					? failureData.reason
					: "template generation failed"
			const attempt =
				typeof failureData.attempt === "number"
					? failureData.attempt
					: undefined

			logger.error("template generation failed during full pipeline", {
				exemplarQuestionId,
				attempt,
				reason
			})

			return { status: "failed", exemplarQuestionId, reason, attempt }
		}

		const { attempt, templateId } = generationOutcome.evt.data

		logger.info("full template generation pipeline completed", {
			exemplarQuestionId,
			attempt,
			templateId,
			scaffolded
		})

		return {
			status: "completed",
			exemplarQuestionId,
			attempt,
			scaffolded,
			templateId
		}
	}
)
