import * as errors from "@superbuilders/errors"
import type { Logger as SlogLogger } from "@superbuilders/slog"
import { asc, eq, sql } from "drizzle-orm"
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

type CandidateEvaluation = {
	templateId: string
	questionId: string
	diagnostics: TypeScriptDiagnostic[]
}

type CandidateValidationOutcome =
	| { status: "valid"; templateId: string }
	| { status: "invalid"; templateId: string; diagnosticsCount: number }

async function fetchTemplateByOrdinal(
	questionId: string,
	ordinal: number
): Promise<{
	template: TemplateRecord | null
	allowedWidgets: string[]
}> {
	const templateRow = await db
		.select({
			id: templates.id,
			createdAt: templates.createdAt,
			questionId: templates.questionId,
			source: templates.source,
			gitCommitSha: templates.gitCommitSha,
			typescriptRanAt: templates.typescriptRanAt
		})
		.from(templates)
		.where(eq(templates.questionId, questionId))
		.orderBy(asc(templates.createdAt))
		.offset(ordinal)
		.limit(1)
		.then((rows) => rows[0])

	if (!templateRow) {
		return { template: null, allowedWidgets: [] }
	}

	const questionRow = await db
		.select({ allowedWidgets: exemplarQuestions.allowedWidgets })
		.from(exemplarQuestions)
		.where(eq(exemplarQuestions.id, templateRow.questionId))
		.limit(1)
		.then((rows) => rows[0])

	return {
		template: templateRow,
		allowedWidgets: questionRow?.allowedWidgets ?? []
	}
}

async function performCandidateEvaluation({
	logger,
	questionId,
	attempt
}: {
	logger: Logger
	questionId: string
	attempt: number
}): Promise<CandidateEvaluation> {
	const { template, allowedWidgets } = await fetchTemplateByOrdinal(
		questionId,
		attempt
	)

	if (!template) {
		logger.error("candidate not found during validation", {
			questionId,
			attempt
		})
		throw errors.new(
			`template candidate not found: question=${questionId} attempt=${attempt}`
		)
	}

	if (!template.source || template.source.length === 0) {
		logger.error("candidate has no source to validate", {
			questionId,
			templateId: template.id
		})
		throw errors.new(`candidate template=${template.id} has empty source`)
	}

	const diagnostics = await collectDiagnostics(
		logger,
		template.source,
		allowedWidgets
	)

	return {
		templateId: template.id,
		questionId,
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
			const updateResult = await tx
				.update(templates)
				.set({ typescriptRanAt: sql`now()` })
				.where(eq(templates.id, templateId))
				.returning({ id: templates.id })

			if (!updateResult[0]) {
				logger.error("typescript run update affected no templates", {
					templateId
				})
				throw errors.new("failed to record typescript run")
			}

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

async function performTemplateCandidateValidation({
	logger,
	questionId,
	attempt
}: {
	logger: Logger
	questionId: string
	attempt: number
}): Promise<CandidateValidationOutcome> {
	const evaluationResult = await errors.try(
		performCandidateEvaluation({
			logger,
			questionId,
			attempt
		})
	)
	if (evaluationResult.error) {
		logger.error("template candidate validation encountered error", {
			questionId,
			attempt,
			error: evaluationResult.error
		})
		throw errors.wrap(evaluationResult.error, "candidate validation")
	}

	const { diagnostics, templateId } = evaluationResult.data

	const recordResult = await errors.try(
		recordTypeScriptRun({ logger, templateId, diagnostics })
	)
	if (recordResult.error) {
		logger.error("failed to persist typescript validation result", {
			questionId,
			templateId,
			error: recordResult.error
		})
		throw recordResult.error
	}

	if (diagnostics.length === 0) {
		logger.info("candidate validation succeeded", {
			questionId,
			templateId
		})

		return { status: "valid", templateId }
	}

	logger.warn("candidate validation failed", {
		questionId,
		templateId,
		diagnosticsCount: diagnostics.length
	})

	return {
		status: "invalid",
		templateId,
		diagnosticsCount: diagnostics.length
	}
}

export const validateTemplateCandidate = inngest.createFunction(
	{
		id: "template-candidate-validation",
		name: "Template Generation - Step 3: Validate Candidate",
		idempotency: "event",
		concurrency: [{ scope: "fn", key: "event.data.templateId", limit: 1 }]
	},
	{ event: "template/candidate.validation.requested" },
	async ({ event, step, logger }) => {
		const { templateId: questionId, attempt } = event.data
		const baseEventId = event.id
		logger.info("validating template candidate", {
			questionId,
			attempt
		})

		const validationResult = await errors.try(
			step.run("perform-template-candidate-validation", () =>
				performTemplateCandidateValidation({
					logger,
					questionId,
					attempt
				})
			)
		)
		if (validationResult.error) {
			logger.error("template candidate validation encountered error", {
				questionId,
				attempt,
				error: validationResult.error
			})
			throw errors.wrap(validationResult.error, "candidate validation")
		}

		const outcome = validationResult.data

		const eventIdOutcome =
			outcome.status === "valid" ? "succeeded" : "diagnostics"

		const diagnosticsCount =
			outcome.status === "valid" ? 0 : outcome.diagnosticsCount

		await step.sendEvent("candidate-validation-completed", {
			id: `${baseEventId}-candidate-validation-${eventIdOutcome}-${questionId}-${attempt}`,
			name: "template/candidate.validation.completed",
			data: {
				templateId: questionId,
				attempt,
				diagnosticsCount
			}
		})

		return { status: "validation-succeeded" as const }
	}
)
