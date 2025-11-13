import * as errors from "@superbuilders/errors"
import { asc, eq } from "drizzle-orm"
import type { Logger } from "inngest"
import { db } from "@/db"
import type { TemplateRecord } from "@/db/schema"
import {
	exemplarQuestions,
	templates,
	typescriptDiagnostics,
	typescriptRuns
} from "@/db/schema"
import { env } from "@/env"
import { inngest } from "@/inngest/client"
import { runGenerationAttempt } from "@/templates/generation"
import { parseStructuredInput } from "@/templates/input"
import { composeInitialPrompt } from "@/templates/prompts/initial"
import { composeRetryPrompt } from "@/templates/prompts/retry"
import type { TypeScriptDiagnostic } from "@/templates/types"
import { createAi, TEMPLATE_GENERATION_MODEL } from "@/utils/ai"

type GeneratedResult = {
	status: "generated"
	attempt: number
	templateId: string
	diagnosticsUsed: number
}

type ExistingResult = {
	status: "already-exists"
	attempt: number
	templateId: string
	validated: boolean
}

type CandidateGenerationResult = GeneratedResult | ExistingResult

async function fetchTemplateByOrdinal(
	questionId: string,
	ordinal: number
): Promise<TemplateRecord | null> {
	if (ordinal < 0) return null
	return db
		.select({
			id: templates.id,
			questionId: templates.questionId,
			source: templates.source,
			gitCommitSha: templates.gitCommitSha,
			createdAt: templates.createdAt
		})
		.from(templates)
		.where(eq(templates.questionId, questionId))
		.orderBy(asc(templates.createdAt))
		.offset(ordinal)
		.limit(1)
		.then((rows) => rows[0] ?? null)
}

async function getTypeScriptRunId(templateId: string): Promise<string | null> {
	const row = await db
		.select({ id: typescriptRuns.id })
		.from(typescriptRuns)
		.where(eq(typescriptRuns.templateId, templateId))
		.limit(1)
		.then((rows) => rows[0])
	return row?.id ?? null
}

async function getTypeScriptDiagnostics(
	templateId: string
): Promise<TypeScriptDiagnostic[]> {
	const runId = await getTypeScriptRunId(templateId)
	if (!runId) return []

	return db
		.select({
			message: typescriptDiagnostics.message,
			line: typescriptDiagnostics.line,
			column: typescriptDiagnostics.column,
			tsCode: typescriptDiagnostics.tsCode
		})
		.from(typescriptDiagnostics)
		.where(eq(typescriptDiagnostics.runId, runId))
		.orderBy(typescriptDiagnostics.createdAt)
}

async function hasSuccessfulTypeScriptRun(
	templateId: string
): Promise<boolean> {
	const runId = await getTypeScriptRunId(templateId)
	if (!runId) return false
	const diagnostics = await getTypeScriptDiagnostics(templateId)
	return diagnostics.length === 0
}

async function performCandidateGeneration({
	logger,
	templateId,
	attempt
}: {
	logger: Logger
	templateId: string
	attempt: number
}): Promise<CandidateGenerationResult> {
	const question = await db
		.select({
			allowedWidgets: exemplarQuestions.allowedWidgets,
			exampleAssessmentItemBody: exemplarQuestions.exampleAssessmentItemBody
		})
		.from(exemplarQuestions)
		.where(eq(exemplarQuestions.id, templateId))
		.limit(1)
		.then((rows) => rows[0])

	if (!question) {
		logger.error("question not found for candidate generation", {
			templateId
		})
		throw errors.new(`question not found: ${templateId}`)
	}

	const existingTemplate = await fetchTemplateByOrdinal(templateId, attempt)
	if (existingTemplate) {
		const validated = await hasSuccessfulTypeScriptRun(existingTemplate.id)
		return {
			status: "already-exists",
			attempt,
			templateId: existingTemplate.id,
			validated
		}
	}

	let previousDiagnostics: TypeScriptDiagnostic[] = []
	let previousSource = ""
	if (attempt > 0) {
		const previousTemplate = await fetchTemplateByOrdinal(
			templateId,
			attempt - 1
		)
		if (!previousTemplate) {
			logger.warn("previous attempt missing; proceeding without diagnostics", {
				templateId,
				attempt
			})
		} else {
			previousSource = previousTemplate.source
			previousDiagnostics = await getTypeScriptDiagnostics(previousTemplate.id)
		}
	}

	const structuredInput = parseStructuredInput(
		logger,
		JSON.stringify(question.exampleAssessmentItemBody)
	)
	const allowedWidgets = question.allowedWidgets
	const sourceContext = structuredInput.sourceContext

	const ai = createAi(logger, env.OPENAI_API_KEY)
	const isRetry = attempt > 0 && previousDiagnostics.length > 0
	const lastSource = previousSource

	const prompt = isRetry
		? composeRetryPrompt(
				logger,
				allowedWidgets,
				sourceContext,
				lastSource,
				previousDiagnostics
			)
		: composeInitialPrompt(logger, allowedWidgets, sourceContext)

	const generatedCode = await runGenerationAttempt({
		logger,
		ai,
		model: TEMPLATE_GENERATION_MODEL,
		systemPrompt: prompt.systemPrompt,
		userPrompt: prompt.userPrompt
	})

	const gitCommitSha = env.VERCEL_GIT_COMMIT_SHA

	const insertResult = await errors.try(
		db
			.insert(templates)
			.values({
				questionId: templateId,
				source: generatedCode,
				gitCommitSha
			})
			.returning({ id: templates.id })
	)
	if (insertResult.error) {
		logger.error("failed to insert template candidate", {
			templateId,
			error: insertResult.error
		})
		throw errors.wrap(insertResult.error, "insert template candidate")
	}

	const inserted = insertResult.data[0]
	if (!inserted) {
		logger.error("inserted template candidate missing from result", {
			templateId
		})
		throw errors.new("failed to insert template candidate")
	}

	return {
		status: "generated",
		attempt,
		templateId: inserted.id,
		diagnosticsUsed: previousDiagnostics.length
	}
}

export const generateTemplateCandidate = inngest.createFunction(
	{
		id: "template-candidate-generation",
		name: "Template Generation - Step 2: Generate Candidate",
		idempotency: "event",
		concurrency: [
			{ scope: "fn", key: "event.data.templateId", limit: 1 },
			{ limit: 5 }
		]
	},
	{ event: "template/candidate.generation.requested" },
	async ({ event, step, logger }) => {
		const { templateId, attempt } = event.data
		const questionId = templateId
		const baseEventId = event.id
		logger.info("generating template candidate", {
			questionId,
			attempt
		})

		const generationResult = await errors.try(
			step.run("perform-candidate-generation", () =>
				performCandidateGeneration({ logger, templateId, attempt })
			)
		)

		if (generationResult.error) {
			const reason = generationResult.error.toString()
			logger.error("template candidate generation failed", {
				questionId,
				reason,
				error: generationResult.error
			})

			const failureEventResult = await errors.try(
				step.sendEvent("template-candidate-generation-failed", {
					id: `${baseEventId}-candidate-generation-failed-attempt-${attempt}`,
					name: "template/candidate.generation.failed",
					data: { templateId: questionId, attempt, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error("candidate generation failure event emission failed", {
					questionId,
					attempt,
					reason,
					error: failureEventResult.error
				})
				throw errors.wrap(
					failureEventResult.error,
					`candidate generation failure event ${templateId}`
				)
			}

			return { status: "failed" as const, reason }
		}

		if (generationResult.data.status === "already-exists") {
			logger.info("candidate already exists for attempt", {
				questionId,
				attempt,
				validated: generationResult.data.validated,
				candidateTemplateId: generationResult.data.templateId
			})

			if (!generationResult.data.validated) {
				await step.sendEvent("request-existing-candidate-validation", {
					id: `${baseEventId}-candidate-validation-request-${generationResult.data.attempt}`,
					name: "template/candidate.validation.requested",
					data: {
						templateId: questionId,
						attempt: generationResult.data.attempt
					}
				})
			} else {
				const completionEventResult = await errors.try(
					step.sendEvent("existing-candidate-validation-completed", {
						id: `${baseEventId}-candidate-validation-already-${generationResult.data.attempt}`,
						name: "template/candidate.validation.completed",
						data: {
							templateId: questionId,
							attempt: generationResult.data.attempt,
							diagnosticsCount: 0
						}
					})
				)
				if (completionEventResult.error) {
					logger.error(
						"candidate validation completion event emission failed for existing candidate",
						{
							questionId,
							attempt: generationResult.data.attempt,
							error: completionEventResult.error
						}
					)
					throw errors.wrap(
						completionEventResult.error,
						"candidate validation completion event"
					)
				}
			}

			return {
				status: "already-exists" as const,
				attempt: generationResult.data.attempt
			}
		}

		logger.info("candidate generation completed", {
			questionId,
			attempt: generationResult.data.attempt,
			diagnosticsUsed: generationResult.data.diagnosticsUsed,
			candidateTemplateId: generationResult.data.templateId
		})

		await step.sendEvent("request-candidate-validation", {
			id: `${baseEventId}-candidate-validation-request-${generationResult.data.attempt}`,
			name: "template/candidate.validation.requested",
			data: { templateId: questionId, attempt: generationResult.data.attempt }
		})

		return {
			status: "generation-complete" as const,
			attempt: generationResult.data.attempt
		}
	}
)
