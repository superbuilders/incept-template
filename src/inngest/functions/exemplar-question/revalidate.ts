import * as errors from "@superbuilders/errors"
import { desc, eq } from "drizzle-orm"
import { db } from "@/db"
import type { TemplateRecord } from "@/db/schema"
import { exemplarQuestions, templates } from "@/db/schema"
import { inngest } from "@/inngest/client"
import { typecheckTemplate } from "@/inngest/functions/template/typecheck"
import { validateZeroSeed } from "@/inngest/functions/template/zero-seed"

function hasCompletedValidation(template: {
	zeroSeedSuccessfullyGeneratedAt: Date | string | null
	typescriptPassedWithZeroDiagnosticsAt: Date | string | null
}): boolean {
	return Boolean(
		template.zeroSeedSuccessfullyGeneratedAt &&
			template.typescriptPassedWithZeroDiagnosticsAt
	)
}

async function findLatestTemplateForQuestion(
	exemplarQuestionId: string
): Promise<TemplateRecord | null> {
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
		.orderBy(desc(templates.createdAt))
		.limit(1)
		.then((rows) => rows[0] ?? null)
}

export const revalidateLatestExemplarQuestionTemplate = inngest.createFunction(
	{
		id: "exemplar-question-template-revalidation-start",
		name: "Template Generation - Revalidate Latest",
		idempotency: "event",
		concurrency: [
			{ scope: "fn", key: "event.data.exemplarQuestionId", limit: 1 }
		]
	},
	{ event: "template/exemplar-question.template.revalidate.invoked" },
	async ({ event, step, logger }) => {
		const { exemplarQuestionId, templateId } = event.data
		logger.info("starting template revalidation workflow", {
			exemplarQuestionId,
			templateId
		})

		const questionResult = await db
			.select({ id: exemplarQuestions.id })
			.from(exemplarQuestions)
			.where(eq(exemplarQuestions.id, exemplarQuestionId))
			.limit(1)

		if (!questionResult[0]) {
			logger.error("template not found for revalidation workflow", {
				exemplarQuestionId,
				templateId
			})
			throw errors.new(`template not found: ${exemplarQuestionId}`)
		}

		const existingTemplateWithId = await db
			.select({ id: templates.id })
			.from(templates)
			.where(eq(templates.id, templateId))
			.limit(1)

		if (existingTemplateWithId[0]) {
			logger.error("template revalidation received duplicate templateId", {
				exemplarQuestionId,
				templateId
			})
			throw errors.new(
				`template ${templateId} already exists for exemplarQuestion=${exemplarQuestionId}`
			)
		}

		const latestTemplate = await findLatestTemplateForQuestion(exemplarQuestionId)

		if (!latestTemplate) {
			logger.error("no template found for revalidation workflow", {
				exemplarQuestionId,
				templateId
			})
			throw errors.new("no templates available for exemplar question")
		}

		if (!hasCompletedValidation(latestTemplate)) {
			logger.error("latest template not fully validated for revalidation", {
				exemplarQuestionId,
				requestedTemplateId: templateId,
				latestTemplateId: latestTemplate.id
			})
			throw errors.new("latest template has not completed validation")
		}

		const insertResult = await errors.try(
			db
				.insert(templates)
				.values({
					id: templateId,
					exemplarQuestionId,
					source: latestTemplate.source,
					createdGitCommitSha: latestTemplate.createdGitCommitSha,
					zeroSeedSuccessfullyGeneratedAt: null,
					typescriptPassedWithZeroDiagnosticsAt: null
				})
				.returning({ id: templates.id })
		)
		if (insertResult.error) {
			logger.error("failed to insert template during revalidation", {
				exemplarQuestionId,
				templateId,
				error: insertResult.error
			})
			throw errors.wrap(insertResult.error, "insert template for revalidation")
		}

		const typecheckResult = await errors.try(
			step.invoke("template-revalidation-typecheck", {
				function: typecheckTemplate,
				data: { exemplarQuestionId, templateId }
			})
		)
		if (typecheckResult.error) {
			logger.error("template revalidation typecheck failed to run", {
				exemplarQuestionId,
				templateId,
				error: typecheckResult.error
			})
			throw errors.wrap(typecheckResult.error, "template revalidation typecheck")
		}

		const typecheckOutcome = typecheckResult.data.outcome
		if (typecheckOutcome.status !== "valid") {
			logger.error("template revalidation typecheck produced diagnostics", {
				exemplarQuestionId,
				templateId,
				diagnosticsCount: typecheckOutcome.diagnosticsCount
			})
			throw errors.new(
				`template typecheck failed with ${typecheckOutcome.diagnosticsCount} diagnostics`
			)
		}

		const templateState = await db
			.select({
				id: templates.id,
				zeroSeedSuccessfullyGeneratedAt: templates.zeroSeedSuccessfullyGeneratedAt,
				typescriptPassedWithZeroDiagnosticsAt:
					templates.typescriptPassedWithZeroDiagnosticsAt
			})
			.from(templates)
			.where(eq(templates.id, templateId))
			.limit(1)
			.then((rows) => rows[0])

		if (!templateState) {
			logger.error(
				"validated template missing after typescript validation during revalidation",
				{
					exemplarQuestionId,
					templateId
				}
			)
			throw errors.new(
				"validated template missing after typescript validation during revalidation"
			)
		}

		if (!templateState.typescriptPassedWithZeroDiagnosticsAt) {
			logger.error(
				"template missing TypeScript validation timestamp during revalidation",
				{
					exemplarQuestionId,
					templateId
				}
			)
			throw errors.new(
				"template missing TypeScript validation timestamp during revalidation"
			)
		}

		logger.info("requesting zero-seed validation for revalidated template", {
			exemplarQuestionId,
			templateId
		})

		const zeroSeedResult = await errors.try(
			step.invoke("template-revalidation-zero-seed", {
				function: validateZeroSeed,
				data: { exemplarQuestionId, templateId }
			})
		)
		if (zeroSeedResult.error) {
			logger.error(
				"zero-seed validation invocation failed during revalidation",
				{
					exemplarQuestionId,
					templateId,
					error: zeroSeedResult.error
				}
			)
			throw errors.wrap(
				zeroSeedResult.error,
				`invoke zero-seed validation ${exemplarQuestionId}`
			)
		}

		if (zeroSeedResult.data.status !== "succeeded") {
			const zeroSeedReason =
				zeroSeedResult.data.reason ?? "zero-seed validation failed"
			logger.error(
				"zero-seed validation reported failure during revalidation",
				{
					exemplarQuestionId,
					templateId,
					reason: zeroSeedReason
				}
			)
			throw errors.new(zeroSeedReason)
		}

		logger.info(
			"template revalidation completed after zero-seed validation",
			{
				exemplarQuestionId,
				templateId
			}
		)

		return {
			status: "completed" as const,
			templateId
		}
	}
)
