import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"
import { eq, sql } from "drizzle-orm"
import { executeTemplateForZeroSeedValidation } from "@/app/api/templates/[templateId]/executions/[seed]/execution"
import { db } from "@/db"
import { templates } from "@/db/schema"
import { ErrTemplateExecutionFailed, ErrTemplateNotValidated } from "@/errors"
import { inngest } from "@/inngest/client"

async function performZeroSeedValidation({
	logger,
	templateId
}: {
	logger: Logger
	templateId: string
}) {
	const templateRow = await db
		.select({
			id: templates.id,
			typescriptPassedWithZeroDiagnosticsAt:
				templates.typescriptPassedWithZeroDiagnosticsAt
		})
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)
		.then((rows) => rows[0])

	if (!templateRow) {
		logger.error("zero-seed validation template missing", { templateId })
		throw errors.wrap(ErrTemplateNotValidated, "template missing for zero-seed")
	}

	if (!templateRow.typescriptPassedWithZeroDiagnosticsAt) {
		logger.error(
			"zero-seed validation requires successful TypeScript validation",
			{
				templateId
			}
		)
		throw errors.wrap(
			ErrTemplateNotValidated,
			"template missing TypeScript validation"
		)
	}

	const executionLogger = logger
	const execution = await executeTemplateForZeroSeedValidation({
		logger: executionLogger,
		templateId
	})

	const updateResult = await db
		.update(templates)
		.set({
			zeroSeedSuccessfullyGeneratedAt: sql`now()`
		})
		.where(eq(templates.id, execution.templateId))
		.returning({ id: templates.id })

	if (!updateResult[0]) {
		logger.error("zero-seed validation update affected no templates", {
			templateId
		})
		throw errors.new("failed to persist zero-seed validation result")
	}

	return execution.templateId
}

export const validateZeroSeed = inngest.createFunction(
	{
		id: "template-zero-seed-validation",
		name: "Template Generation - Step 4: Validate Zero Seed",
		idempotency: "event",
		concurrency: [{ scope: "fn", key: "event.data.templateId", limit: 1 }]
	},
	{ event: "template/template.zero-seed.requested" },
	async ({ event, step, logger }) => {
		const { exemplarQuestionId, attempt, templateId } = event.data
		const baseEventId = event.id

		logger.info("starting zero-seed validation", {
			exemplarQuestionId,
			templateId,
			attempt
		})

		const validationResult = await errors.try(
			step.run("perform-zero-seed-validation", () =>
				performZeroSeedValidation({
					logger,
					templateId
				})
			)
		)

		if (validationResult.error) {
			const failure = validationResult.error
			let reason = failure.message
			if (errors.is(failure, ErrTemplateExecutionFailed)) {
				reason = `zero-seed execution failed: ${failure.message}`
			} else if (errors.is(failure, ErrTemplateNotValidated)) {
				reason = `template not ready for zero-seed validation: ${failure.message}`
			}

			logger.error("zero-seed validation failed", {
				exemplarQuestionId,
				templateId,
				attempt,
				error: failure,
				reason
			})

			const failureEventResult = await errors.try(
				step.sendEvent("zero-seed-validation-failed", {
					id: `${baseEventId}-zero-seed-failed`,
					name: "template/template.zero-seed.failed",
					data: { exemplarQuestionId, attempt, templateId, reason }
				})
			)

			if (failureEventResult.error) {
				logger.error("failed to emit zero-seed validation failure event", {
					exemplarQuestionId,
					templateId,
					attempt,
					error: failureEventResult.error
				})
				throw errors.wrap(
					failureEventResult.error,
					`zero-seed validation failure event ${templateId}`
				)
			}

			return { status: "failed" as const, reason }
		}

		logger.info("zero-seed validation succeeded", {
			exemplarQuestionId,
			templateId,
			attempt
		})

		const completionEventResult = await errors.try(
			step.sendEvent("zero-seed-validation-completed", {
				id: `${baseEventId}-zero-seed-completed`,
				name: "template/template.zero-seed.completed",
				data: { exemplarQuestionId, attempt, templateId }
			})
		)

		if (completionEventResult.error) {
			logger.error("failed to emit zero-seed validation completion event", {
				exemplarQuestionId,
				templateId,
				attempt,
				error: completionEventResult.error
			})
			throw errors.wrap(
				completionEventResult.error,
				`zero-seed validation completion event ${templateId}`
			)
		}

		return { status: "succeeded" as const }
	}
)
