import { createHash } from "node:crypto"
import * as errors from "@superbuilders/errors"
import { eq } from "drizzle-orm"
import { type Logger, NonRetriableError } from "inngest"
import { db } from "@/db"
import { exemplarQuestions } from "@/db/schema"
import { inngest } from "@/inngest/client"
import { parseStructuredInput } from "@/templates/input"
import { allWidgetSchemas } from "@/widgets/registry"

type ScaffoldResult = { hash: string; allowedWidgets: readonly string[] }

const KNOWN_WIDGET_NAMES = new Set(Object.keys(allWidgetSchemas))

function normalizeAllowedWidgets(
	widgets: readonly string[]
): readonly string[] {
	return [...new Set(widgets)].sort((a, b) => a.localeCompare(b))
}

function validateAllowedWidgets({
	logger,
	exemplarQuestionId,
	allowedWidgets
}: {
	logger: Logger
	exemplarQuestionId: string
	allowedWidgets: readonly string[]
}): void {
	const unknownWidgets = allowedWidgets.filter(
		(widget) => !KNOWN_WIDGET_NAMES.has(widget)
	)
	if (unknownWidgets.length > 0) {
		const message = `template ${exemplarQuestionId} references unknown widgets: ${unknownWidgets.join(", ")}`
		const nonRetriableError = new NonRetriableError(message)
		logger.error("template scaffold rejected unknown widgets", {
			exemplarQuestionId,
			unknownWidgets,
			error: nonRetriableError
		})
		throw nonRetriableError
	}
}

async function performExemplarQuestionScaffold({
	logger,
	exemplarQuestionId,
	exampleAssessmentItemBody,
	metadata
}: {
	logger: Logger
	exemplarQuestionId: string
	exampleAssessmentItemBody: unknown
	metadata: unknown
}): Promise<ScaffoldResult> {
	const existingTemplate = await db
		.select({
			hash: exemplarQuestions.exampleAssessmentItemHash,
			allowedWidgets: exemplarQuestions.allowedWidgets
		})
		.from(exemplarQuestions)
		.where(eq(exemplarQuestions.id, exemplarQuestionId))
		.limit(1)

	if (existingTemplate.length > 0) {
		logger.error("template scaffold attempted on existing template", {
			exemplarQuestionId
		})
		throw new NonRetriableError("template already scaffolded")
	}

	const stringifiedBody = JSON.stringify(exampleAssessmentItemBody)
	const parsed = parseStructuredInput(logger, stringifiedBody)
	const normalizedWidgets = normalizeAllowedWidgets(parsed.allowedWidgets)

	validateAllowedWidgets({
		logger,
		exemplarQuestionId,
		allowedWidgets: normalizedWidgets
	})

	const hash = createHash("sha256").update(stringifiedBody).digest("hex")

	logger.debug("creating template scaffold", {
		exemplarQuestionId,
		hash,
		allowedWidgetsCount: normalizedWidgets.length
	})

	await db.insert(exemplarQuestions).values({
		id: exemplarQuestionId,
		allowedWidgets: Array.from(normalizedWidgets),
		exampleAssessmentItemBody,
		exampleAssessmentItemHash: hash,
		metadata
	})

	return { hash, allowedWidgets: normalizedWidgets }
}

export const scaffoldExemplarQuestion = inngest.createFunction(
	{
		id: "exemplar-question-scaffold-requested",
		name: "Exemplar Question Scaffold Requested",
		idempotency: "event",
		concurrency: [
			{ scope: "fn", key: "event.data.exemplarQuestionId", limit: 1 }
		]
	},
	{ event: "template/exemplar-question.scaffold.requested" },
	async ({ event, step, logger }) => {
		const { exemplarQuestionId, exampleAssessmentItemBody, metadata } =
			event.data
		const baseEventId = event.id
		logger.info("starting template scaffold", {
			exemplarQuestionId,
			payloadType: typeof exampleAssessmentItemBody
		})

		const scaffoldResult = await errors.try(
			step.run("perform-template-scaffold", () =>
				performExemplarQuestionScaffold({
					logger,
					exemplarQuestionId,
					exampleAssessmentItemBody,
					metadata
				})
			)
		)
		if (scaffoldResult.error) {
			const reason = scaffoldResult.error.toString()
			logger.error("template scaffold failed", {
				exemplarQuestionId,
				reason,
				error: scaffoldResult.error
			})

			const failureEventResult = await errors.try(
				step.sendEvent("send-template-scaffold-failed", {
					id: `${baseEventId}-scaffold-failed`,
					name: "template/exemplar-question.scaffold.failed",
					data: { exemplarQuestionId, reason }
				})
			)
			if (failureEventResult.error) {
				const wrappedFailureEventError = errors.wrap(
					failureEventResult.error,
					`template scaffold failure event ${exemplarQuestionId}`
				)
				logger.error("template scaffold failure event emission failed", {
					exemplarQuestionId,
					reason,
					error: wrappedFailureEventError
				})
				throw wrappedFailureEventError
			}

			const nonRetriable = errors.as(scaffoldResult.error, NonRetriableError)
			if (nonRetriable) {
				const wrappedNonRetriable = new NonRetriableError(
					`scaffolding template ${exemplarQuestionId}: ${nonRetriable.message}`,
					{ cause: nonRetriable }
				)
				logger.error("template scaffold aborting after failure event", {
					exemplarQuestionId,
					reason,
					error: wrappedNonRetriable
				})
				throw wrappedNonRetriable
			}

			const wrappedError = errors.wrap(
				scaffoldResult.error,
				`scaffolding template ${exemplarQuestionId}`
			)
			logger.error("template scaffold aborting after failure event", {
				exemplarQuestionId,
				reason,
				error: wrappedError
			})
			throw wrappedError
		}

		const completionEventResult = await errors.try(
			step.sendEvent("send-template-scaffold-completed", {
				id: `${baseEventId}-scaffold-completed`,
				name: "template/exemplar-question.scaffold.completed",
				data: { exemplarQuestionId }
			})
		)
		if (completionEventResult.error) {
			logger.error("template scaffold completion event emission failed", {
				exemplarQuestionId,
				error: completionEventResult.error
			})
			throw errors.wrap(
				completionEventResult.error,
				`template scaffold completion event ${exemplarQuestionId}`
			)
		}

		logger.info("template scaffold completed", {
			exemplarQuestionId,
			allowedWidgetsCount: scaffoldResult.data.allowedWidgets.length
		})

		return {
			exemplarQuestionId,
			hash: scaffoldResult.data.hash,
			status: "completed" as const
		}
	}
)
