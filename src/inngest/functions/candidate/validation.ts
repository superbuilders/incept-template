import * as errors from "@superbuilders/errors"
import type { Logger as SlogLogger } from "@superbuilders/slog"
import { and, eq } from "drizzle-orm"
import type { Logger } from "inngest"
import { db } from "@/db/client"
import {
	candidateDiagnostics,
	templateCandidates,
	templates
} from "@/db/schema"
import { inngest } from "@/inngest/client"
import { typeCheckSource } from "@/templates/type-checker"
import type { TypeScriptDiagnostic } from "@/templates/types"
import {
	validateNoNonNullAssertions,
	validateNoTypeAssertions,
	validateTemplateWidgets
} from "@/templates/widget-validation"

type CandidateEvaluation = {
	attempt: number
	diagnostics: TypeScriptDiagnostic[]
}

async function performCandidateEvaluation({
	logger,
	templateId,
	attempt
}: {
	logger: Logger
	templateId: string
	attempt: number
}): Promise<CandidateEvaluation> {
	const candidateRecord = await db
		.select({
			source: templateCandidates.source,
			allowedWidgets: templates.allowedWidgets,
			attempt: templateCandidates.attempt
		})
		.from(templateCandidates)
		.innerJoin(templates, eq(templates.id, templateCandidates.templateId))
		.where(
			and(
				eq(templateCandidates.templateId, templateId),
				eq(templateCandidates.attempt, attempt)
			)
		)
		.limit(1)
		.then((rows) => rows[0])

	if (!candidateRecord) {
		logger.error("candidate not found during validation", {
			templateId,
			attempt
		})
		throw errors.new(
			`template candidate not found: template=${templateId} attempt=${attempt}`
		)
	}

	if (!candidateRecord.source || candidateRecord.source.length === 0) {
		logger.error("candidate has no source to validate", {
			templateId,
			attempt
		})
		throw errors.new(
			`candidate template=${templateId} attempt=${attempt} has empty source`
		)
	}

	const diagnostics = await collectDiagnostics(
		logger,
		candidateRecord.source,
		candidateRecord.allowedWidgets
	)

	return {
		attempt: candidateRecord.attempt,
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

	return diagnostics
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
		const { templateId, attempt } = event.data
		logger.info("validating template candidate", { templateId, attempt })

	const evaluationResult = await errors.try(
		performCandidateEvaluation({
			logger,
			templateId,
			attempt
		})
	)
	if (evaluationResult.error) {
		logger.error("template candidate validation encountered error", {
			templateId,
			attempt,
			error: evaluationResult.error
		})
		throw errors.wrap(evaluationResult.error, "candidate validation")
	}

	const { diagnostics } = evaluationResult.data

	if (diagnostics.length === 0) {
		await db
			.update(templateCandidates)
			.set({ validatedAt: new Date() })
			.where(
				and(
					eq(templateCandidates.templateId, templateId),
					eq(templateCandidates.attempt, attempt)
				)
			)

		logger.info("candidate validation succeeded", {
			templateId,
			attempt
		})

		await step.sendEvent("candidate-validation-completed", {
			name: "template/candidate.validation.completed",
			data: { templateId, attempt, diagnosticsCount: 0 }
		})

		return { status: "validation-succeeded" as const }
	}

	logger.warn("candidate validation failed", {
		templateId,
		attempt,
		diagnosticsCount: diagnostics.length
	})

	await db
		.update(templateCandidates)
		.set({ validatedAt: null })
		.where(
			and(
				eq(templateCandidates.templateId, templateId),
				eq(templateCandidates.attempt, attempt)
			)
		)

	const insertDiagnosticsResult = await errors.try(
		db.insert(candidateDiagnostics).values(
			diagnostics.map((diagnostic) => ({
				templateId,
				attempt,
				message: diagnostic.message,
				line: diagnostic.line,
				column: diagnostic.column,
				tsCode: diagnostic.tsCode
			}))
		)
	)
	if (insertDiagnosticsResult.error) {
		logger.error("failed to persist candidate diagnostics", {
			templateId,
			attempt,
			error: insertDiagnosticsResult.error
		})
		throw errors.wrap(insertDiagnosticsResult.error, "persist candidate diagnostics")
	}

	await step.sendEvent("candidate-validation-completed", {
		name: "template/candidate.validation.completed",
		data: { templateId, attempt, diagnosticsCount: diagnostics.length }
	})

	return { status: "validation-succeeded" as const }
	}
)
