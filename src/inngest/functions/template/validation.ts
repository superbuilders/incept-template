import * as errors from "@superbuilders/errors"
import type { Logger as SlogLogger } from "@superbuilders/slog"
import { eq, sql } from "drizzle-orm"
import type { Logger } from "inngest"
import { db } from "@/db"
import type { TemplateRecord } from "@/db/schema"
import {
	exemplarQuestions,
	templates,
	typescriptDiagnostics
} from "@/db/schema"
import { inngest } from "@/inngest/client"
import { typeCheckSource } from "@/templates/type-checker"
import type { TypeScriptDiagnostic } from "@/templates/types"
import {
	validateNoNonNullAssertions,
	validateNoThrowStatements,
	validateNoTypeAssertions,
	validateTemplateWidgets
} from "@/templates/widget-validation"

type TemplateEvaluation = {
	templateId: string
	exemplarQuestionId: string
	diagnostics: TypeScriptDiagnostic[]
}

type TemplateValidationOutcome =
	| { status: "valid"; templateId: string }
	| { status: "invalid"; templateId: string; diagnosticsCount: number }

async function fetchTemplateWithWidgets(templateId: string): Promise<{
	template: TemplateRecord | null
	allowedWidgets: string[]
}> {
	const templateRow = await db
		.select({
			id: templates.id,
			createdAt: templates.createdAt,
			exemplarQuestionId: templates.exemplarQuestionId,
			source: templates.source,
			createdGitCommitSha: templates.createdGitCommitSha,
			zeroSeedSuccessfullyGeneratedAt:
				templates.zeroSeedSuccessfullyGeneratedAt,
			typescriptPassedWithZeroDiagnosticsAt:
				templates.typescriptPassedWithZeroDiagnosticsAt
		})
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)
		.then((rows) => rows[0])

	if (!templateRow) {
		return { template: null, allowedWidgets: [] }
	}

	const questionRow = await db
		.select({ allowedWidgets: exemplarQuestions.allowedWidgets })
		.from(exemplarQuestions)
		.where(eq(exemplarQuestions.id, templateRow.exemplarQuestionId))
		.limit(1)
		.then((rows) => rows[0])

	return {
		template: templateRow,
		allowedWidgets: questionRow?.allowedWidgets ?? []
	}
}

async function performTemplateEvaluation({
	logger,
	templateId
}: {
	logger: Logger
	templateId: string
}): Promise<TemplateEvaluation> {
	const { template, allowedWidgets } =
		await fetchTemplateWithWidgets(templateId)

	if (!template) {
		logger.error("template not found during validation", {
			templateId
		})
		throw errors.new(`template not found: templateId=${templateId}`)
	}

	if (!template.source || template.source.length === 0) {
		logger.error("template has no source to validate", {
			exemplarQuestionId: template.exemplarQuestionId,
			templateId: template.id
		})
		throw errors.new(`template ${template.id} has empty source`)
	}

	const diagnostics = await collectDiagnostics(
		logger,
		template.source,
		allowedWidgets
	)

	return {
		templateId: template.id,
		exemplarQuestionId: template.exemplarQuestionId,
		diagnostics
	}
}

async function collectDiagnostics(
	logger: SlogLogger,
	source: string,
	allowedWidgets: readonly string[]
): Promise<TypeScriptDiagnostic[]> {
	const diagnostics = await typeCheckSource(logger, source)

	const widgetDiagnostic = validateTemplateWidgets(source, allowedWidgets)
	if (widgetDiagnostic) {
		diagnostics.push(widgetDiagnostic)
	}

	const nonNullDiagnostic = validateNoNonNullAssertions(source)
	if (nonNullDiagnostic) {
		diagnostics.push(nonNullDiagnostic)
	}

	const typeAssertionDiagnostic = validateNoTypeAssertions(source)
	if (typeAssertionDiagnostic) {
		diagnostics.push(typeAssertionDiagnostic)
	}

	const throwDiagnostic = validateNoThrowStatements(source)
	if (throwDiagnostic) {
		diagnostics.push(throwDiagnostic)
	}

	return diagnostics
}

async function recordTypeScriptRun({
	logger,
	templateId,
	diagnostics
}: {
	logger: Logger
	templateId: string
	diagnostics: TypeScriptDiagnostic[]
}): Promise<void> {
	const result = await errors.try(
		db.transaction(async (tx) => {
			await tx
				.delete(typescriptDiagnostics)
				.where(eq(typescriptDiagnostics.templateId, templateId))

			if (diagnostics.length > 0) {
				await tx.insert(typescriptDiagnostics).values(
					diagnostics.map((diagnostic) => ({
						templateId,
						message: diagnostic.message,
						line: diagnostic.line,
						column: diagnostic.column,
						tsCode: diagnostic.tsCode
					}))
				)
			}

			const updateResult = await tx
				.update(templates)
				.set({
					typescriptPassedWithZeroDiagnosticsAt:
						diagnostics.length === 0 ? sql`now()` : null,
					zeroSeedSuccessfullyGeneratedAt: null
				})
				.where(eq(templates.id, templateId))
				.returning({ id: templates.id })

			if (!updateResult[0]) {
				logger.error("typescript validation update affected no templates", {
					templateId
				})
				throw errors.new("failed to record typescript validation result")
			}
		})
	)

	if (result.error) {
		logger.error("failed to record typescript run", {
			templateId,
			error: result.error
		})
		throw errors.wrap(result.error, "record typescript run")
	}
}

async function performTemplateValidation({
	logger,
	exemplarQuestionId,
	templateId
}: {
	logger: Logger
	exemplarQuestionId: string
	templateId: string
}): Promise<TemplateValidationOutcome> {
	const evaluationResult = await errors.try(
		performTemplateEvaluation({
			logger,
			templateId
		})
	)
	if (evaluationResult.error) {
		logger.error("template validation encountered error", {
			exemplarQuestionId,
			templateId,
			error: evaluationResult.error
		})
		throw errors.wrap(evaluationResult.error, "template validation")
	}

	const {
		diagnostics,
		templateId: evaluatedTemplateId,
		exemplarQuestionId: validationQuestionId
	} = evaluationResult.data

	if (validationQuestionId !== exemplarQuestionId) {
		logger.error("template validation question mismatch", {
			expectedExemplarQuestionId: exemplarQuestionId,
			actualExemplarQuestionId: validationQuestionId,
			templateId
		})
		throw errors.new(
			`template ${templateId} does not belong to exemplarQuestion=${exemplarQuestionId}`
		)
	}

	const recordResult = await errors.try(
		recordTypeScriptRun({
			logger,
			templateId: evaluatedTemplateId,
			diagnostics
		})
	)
	if (recordResult.error) {
		logger.error("failed to persist typescript validation result", {
			exemplarQuestionId,
			templateId: evaluatedTemplateId,
			error: recordResult.error
		})
		throw recordResult.error
	}

	if (diagnostics.length === 0) {
		logger.info("template validation succeeded", {
			exemplarQuestionId: validationQuestionId,
			templateId: evaluatedTemplateId
		})

		return { status: "valid", templateId: evaluatedTemplateId }
	}

	logger.warn("template validation failed", {
		exemplarQuestionId: validationQuestionId,
		templateId: evaluatedTemplateId,
		diagnosticsCount: diagnostics.length
	})

	return {
		status: "invalid",
		templateId: evaluatedTemplateId,
		diagnosticsCount: diagnostics.length
	}
}

export const validateTemplate = inngest.createFunction(
	{
		id: "template-validation",
		name: "Template Generation - Step 3: Validate Template",
		idempotency: "event",
		concurrency: [
			{ scope: "fn", key: "event.data.exemplarQuestionId", limit: 1 }
		]
	},
	{ event: "template/template.validate.requested" },
	async ({ event, step, logger }) => {
		const { exemplarQuestionId, templateId } = event.data
		const baseEventId = event.id
		logger.info("validating template", { exemplarQuestionId, templateId })

		const validationResult = await errors.try(
			step.run("perform-template-validation", () =>
				performTemplateValidation({
					logger,
					exemplarQuestionId,
					templateId
				})
			)
		)
		if (validationResult.error) {
			logger.error("template validation encountered error", {
				exemplarQuestionId,
				templateId,
				error: validationResult.error
			})
			throw errors.wrap(validationResult.error, "template validation")
		}

		const outcome = validationResult.data

		const eventIdOutcome =
			outcome.status === "valid" ? "succeeded" : "diagnostics"

		const diagnosticsCount =
			outcome.status === "valid" ? 0 : outcome.diagnosticsCount

		await step.sendEvent("template-validation-completed", {
			id: `${baseEventId}-template-validation-${eventIdOutcome}-${exemplarQuestionId}-${templateId}`,
			name: "template/template.validate.completed",
			data: {
				exemplarQuestionId,
				diagnosticsCount,
				templateId: outcome.templateId
			}
		})

		return { status: "validation-succeeded" as const }
	}
)
