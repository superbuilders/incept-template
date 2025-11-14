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
	{ event: "template/exemplar-question.template.revalidate.requested" },
	async ({ event, step, logger }) => {
		const { exemplarQuestionId, templateId } = event.data
		const baseEventId = event.id
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
			const reason = `template not found: ${exemplarQuestionId}`
			logger.error("template not found for revalidation workflow", {
				exemplarQuestionId,
				templateId
			})
			const failureEventResult = await errors.try(
				step.sendEvent("template-revalidation-start-failed", {
					id: `${baseEventId}-revalidation-start-failed`,
					name: "template/exemplar-question.template.generate.failed",
					data: { exemplarQuestionId, templateId, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error(
					"template revalidation failure event emission failed at start",
					{
						exemplarQuestionId,
						templateId,
						reason,
						error: failureEventResult.error
					}
				)
				throw errors.wrap(
					failureEventResult.error,
					`template revalidation failure event ${exemplarQuestionId}`
				)
			}
			return { status: "failed" as const, reason }
		}

		const existingTemplateWithId = await db
			.select({ id: templates.id })
			.from(templates)
			.where(eq(templates.id, templateId))
			.limit(1)

		if (existingTemplateWithId[0]) {
			const reason = `template ${templateId} already exists for exemplarQuestion=${exemplarQuestionId}`
			logger.error("template revalidation received duplicate templateId", {
				exemplarQuestionId,
				templateId
			})
			const failureEventResult = await errors.try(
				step.sendEvent("template-revalidation-duplicate-template-id", {
					id: `${baseEventId}-revalidation-duplicate-template-id`,
					name: "template/exemplar-question.template.generate.failed",
					data: { exemplarQuestionId, templateId, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error(
					"template revalidation failure event emission failed for duplicate id",
					{
						exemplarQuestionId,
						templateId,
						reason,
						error: failureEventResult.error
					}
				)
				throw errors.wrap(
					failureEventResult.error,
					`template revalidation failure event ${exemplarQuestionId}`
				)
			}
			return { status: "failed" as const, reason }
		}

		const latestTemplate =
			await findLatestTemplateForQuestion(exemplarQuestionId)

		if (!latestTemplate) {
			const reason = "no templates available for exemplar question"
			logger.error("no template found for revalidation workflow", {
				exemplarQuestionId,
				templateId
			})
			const failureEventResult = await errors.try(
				step.sendEvent("template-revalidation-missing-template", {
					id: `${baseEventId}-revalidation-missing-template`,
					name: "template/exemplar-question.template.generate.failed",
					data: { exemplarQuestionId, templateId, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error(
					"template revalidation failure event emission failed for missing template",
					{
						exemplarQuestionId,
						templateId,
						reason,
						error: failureEventResult.error
					}
				)
				throw errors.wrap(
					failureEventResult.error,
					`template revalidation failure event ${exemplarQuestionId}`
				)
			}
			return { status: "failed" as const, reason }
		}

		if (!hasCompletedValidation(latestTemplate)) {
			const reason = "latest template has not completed validation"
			logger.error("latest template not fully validated for revalidation", {
				exemplarQuestionId,
				requestedTemplateId: templateId,
				latestTemplateId: latestTemplate.id
			})
			const failureEventResult = await errors.try(
				step.sendEvent("template-revalidation-latest-not-validated", {
					id: `${baseEventId}-revalidation-latest-not-validated`,
					name: "template/exemplar-question.template.generate.failed",
					data: { exemplarQuestionId, templateId, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error(
					"template revalidation failure event emission failed for unvalidated latest template",
					{
						exemplarQuestionId,
						templateId,
						reason,
						error: failureEventResult.error
					}
				)
				throw errors.wrap(
					failureEventResult.error,
					`template revalidation failure event ${exemplarQuestionId}`
				)
			}
			return { status: "failed" as const, reason }
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
			throw errors.wrap(
				typecheckResult.error,
				`template revalidation typecheck ${exemplarQuestionId}`
			)
		}

		const typecheckOutcome = typecheckResult.data.outcome
		const diagnosticsCount =
			typecheckOutcome.status === "valid"
				? 0
				: typecheckOutcome.diagnosticsCount

		if (diagnosticsCount > 0) {
			const reason = `template typecheck failed with ${diagnosticsCount} diagnostics`
			logger.error("template revalidation typecheck produced diagnostics", {
				exemplarQuestionId,
				templateId,
				diagnosticsCount
			})
			const failureEventResult = await errors.try(
				step.sendEvent("template-revalidation-typecheck-failed", {
					id: `${baseEventId}-revalidation-typecheck-failed-${templateId}`,
					name: "template/exemplar-question.template.generate.failed",
					data: { exemplarQuestionId, templateId, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error(
					"failed to emit template revalidation failure after diagnostics",
					{
						exemplarQuestionId,
						templateId,
						error: failureEventResult.error
					}
				)
				throw errors.wrap(
					failureEventResult.error,
					`template revalidation failure event ${exemplarQuestionId}`
				)
			}
			return { status: "failed" as const, reason }
		}

		const templateState = await db
			.select({
				id: templates.id,
				zeroSeedSuccessfullyGeneratedAt:
					templates.zeroSeedSuccessfullyGeneratedAt,
				typescriptPassedWithZeroDiagnosticsAt:
					templates.typescriptPassedWithZeroDiagnosticsAt
			})
			.from(templates)
			.where(eq(templates.id, templateId))
			.limit(1)
			.then((rows) => rows[0])

		if (!templateState) {
			const reason =
				"validated template missing after typescript validation during revalidation"
			logger.error(
				"validated template missing after typescript validation during revalidation",
				{
					exemplarQuestionId,
					templateId
				}
			)
			const failureEventResult = await errors.try(
				step.sendEvent("template-revalidation-missing-template", {
					id: `${baseEventId}-revalidation-missing-template-${templateId}`,
					name: "template/exemplar-question.template.generate.failed",
					data: { exemplarQuestionId, templateId, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error(
					"failed to emit template revalidation failure after missing template",
					{
						exemplarQuestionId,
						templateId,
						error: failureEventResult.error
					}
				)
				throw errors.wrap(
					failureEventResult.error,
					`template revalidation failure event ${exemplarQuestionId}`
				)
			}
			return { status: "failed" as const, reason }
		}

		if (!templateState.typescriptPassedWithZeroDiagnosticsAt) {
			const reason =
				"template missing TypeScript validation timestamp during revalidation"
			logger.error(
				"template missing TypeScript validation timestamp during revalidation",
				{
					exemplarQuestionId,
					templateId
				}
			)
			const failureEventResult = await errors.try(
				step.sendEvent("template-revalidation-missing-ts-timestamp", {
					id: `${baseEventId}-revalidation-missing-ts-timestamp-${templateId}`,
					name: "template/exemplar-question.template.generate.failed",
					data: { exemplarQuestionId, templateId, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error(
					"failed to emit template revalidation failure after missing ts timestamp",
					{
						exemplarQuestionId,
						templateId,
						error: failureEventResult.error
					}
				)
				throw errors.wrap(
					failureEventResult.error,
					`template revalidation failure event ${exemplarQuestionId}`
				)
			}
			return { status: "failed" as const, reason }
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
			let reason = zeroSeedResult.data.reason ?? "zero-seed validation failed"
			logger.error(
				"zero-seed validation reported failure during revalidation",
				{
					exemplarQuestionId,
					templateId,
					reason
				}
			)
			const failureEventResult = await errors.try(
				step.sendEvent("template-revalidation-zero-seed-failed", {
					id: `${baseEventId}-revalidation-zero-seed-failed-${templateId}`,
					name: "template/exemplar-question.template.generate.failed",
					data: { exemplarQuestionId, templateId, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error(
					"failed to emit template revalidation failure after zero-seed failure",
					{
						exemplarQuestionId,
						templateId,
						error: failureEventResult.error
					}
				)
				throw errors.wrap(
					failureEventResult.error,
					`template revalidation failure event ${exemplarQuestionId}`
				)
			}
			return { status: "failed" as const, reason }
		}

		logger.info("template revalidation completed after zero-seed validation", {
			exemplarQuestionId,
			templateId
		})
		const completionEventResult = await errors.try(
			step.sendEvent("template-revalidation-completed", {
				id: `${baseEventId}-revalidation-completed-${templateId}`,
				name: "template/exemplar-question.template.generate.completed",
				data: { exemplarQuestionId, templateId }
			})
		)
		if (completionEventResult.error) {
			logger.error(
				"template revalidation completion event emission failed after zero-seed",
				{
					exemplarQuestionId,
					templateId,
					error: completionEventResult.error
				}
			)
			throw errors.wrap(
				completionEventResult.error,
				`template revalidation completion event ${exemplarQuestionId}`
			)
		}
		return {
			status: "completed" as const,
			templateId
		}
	}
)
