import * as errors from "@superbuilders/errors"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { templates } from "@/db/schema"
import { inngest } from "@/inngest/client"

type CompletedResult = {
	status: "completed"
	templateId: string
	attempt: number
	scaffolded: boolean
}

type FailedResult = {
	status: "failed"
	templateId: string
	reason: string
	attempt?: number
}

type FullPipelineResult = CompletedResult | FailedResult

export const generateTemplateFully = inngest.createFunction(
	{
		id: "template-generate-full",
		name: "Template Generate (Full Pipeline)",
		idempotency: "event",
		concurrency: [{ scope: "fn", key: "event.data.templateId", limit: 1 }]
	},
	{ event: "template/template.generate.full" },
	async ({ event, step, logger }): Promise<FullPipelineResult> => {
		const { templateId, exampleAssessmentItemBody, metadata } = event.data
		const baseEventId = event.id

		logger.info("starting full template generation pipeline", { templateId })

		const templateExists = await step.run("check-template-exists", async () => {
			const existing = await db
				.select({ id: templates.id })
				.from(templates)
				.where(eq(templates.id, templateId))
				.limit(1)
			return Boolean(existing[0])
		})

		let scaffolded = false

		if (!templateExists) {
			const waitForScaffoldCompleted = step
				.waitForEvent("wait-template-scaffold-completed", {
					event: "template/template.scaffold.completed",
					timeout: "15m",
					if: `async.data.templateId == "${templateId}"`
				})
				.then((evt) => ({ kind: "completed" as const, evt }))

			const waitForScaffoldFailed = step
				.waitForEvent("wait-template-scaffold-failed", {
					event: "template/template.scaffold.failed",
					timeout: "15m",
					if: `async.data.templateId == "${templateId}"`
				})
				.then((evt) => ({ kind: "failed" as const, evt }))

			const dispatchScaffoldEvent = await errors.try(
				step.sendEvent("dispatch-template-scaffold", {
					id: `${baseEventId}-scaffold-request`,
					name: "template/template.scaffold.requested",
					data: {
						templateId,
						exampleAssessmentItemBody,
						metadata: metadata ?? null
					}
				})
			)

			if (dispatchScaffoldEvent.error) {
				logger.error("failed to dispatch scaffold request", {
					templateId,
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
					templateId
				})
				return { status: "failed", templateId, reason }
			}

			if (scaffoldOutcome.kind === "failed") {
				const reason =
					typeof scaffoldOutcome.evt.data.reason === "string"
						? scaffoldOutcome.evt.data.reason
						: "template scaffold failed"
				logger.error("scaffold stage failed during full pipeline", {
					templateId,
					reason
				})
				return { status: "failed", templateId, reason }
			}

			scaffolded = true
			logger.info("template scaffold completed for full pipeline", {
				templateId
			})
		} else {
			logger.info("template already scaffolded; skipping scaffold stage", {
				templateId
			})
		}

		const waitForGenerationCompleted = step
			.waitForEvent("wait-template-generation-completed", {
				event: "template/template.generation.completed",
				timeout: "60m",
				if: `async.data.templateId == "${templateId}"`
			})
			.then((evt) => ({ kind: "completed" as const, evt }))

		const waitForGenerationFailed = step
			.waitForEvent("wait-template-generation-failed", {
				event: "template/template.generation.failed",
				timeout: "60m",
				if: `async.data.templateId == "${templateId}"`
			})
			.then((evt) => ({ kind: "failed" as const, evt }))

		const dispatchGenerationEvent = await errors.try(
			step.sendEvent("dispatch-template-generation", {
				id: `${baseEventId}-generation-request`,
				name: "template/template.generation.requested",
				data: { templateId }
			})
		)

		if (dispatchGenerationEvent.error) {
			logger.error("failed to dispatch template generation request", {
				templateId,
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
				templateId
			})
			return { status: "failed", templateId, reason }
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
				templateId,
				attempt,
				reason
			})

			return { status: "failed", templateId, reason, attempt }
		}

		const attempt = generationOutcome.evt.data.attempt

		logger.info("full template generation pipeline completed", {
			templateId,
			attempt,
			scaffolded
		})

		return {
			status: "completed",
			templateId,
			attempt,
			scaffolded
		}
	}
)
