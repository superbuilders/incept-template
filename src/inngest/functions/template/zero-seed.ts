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

	const execution = await executeTemplateForZeroSeedValidation({
		logger,
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
	{ event: "template/template.zero-seed.invoked" },
	async ({ event, step, logger }) => {
		const { exemplarQuestionId, templateId } = event.data

		logger.info("starting zero-seed validation", {
			exemplarQuestionId,
			templateId
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
				error: failure,
				reason
			})

			return { status: "failed" as const, reason }
		}

		logger.info("zero-seed validation succeeded", {
			exemplarQuestionId,
			templateId
		})

		return { status: "succeeded" as const }
	}
)
