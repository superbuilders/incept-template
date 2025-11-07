import * as errors from "@superbuilders/errors"
import { and, eq } from "drizzle-orm"
import type { Logger } from "inngest"
import { db } from "@/db"
import {
	candidateDiagnostics,
	templateCandidates,
	templates
} from "@/db/schema"
import { env } from "@/env"
import { inngest } from "@/inngest/client"
import { runGenerationAttempt } from "@/templates/generation"
import { parseStructuredInput } from "@/templates/input"
import { composeInitialPrompt } from "@/templates/prompts/initial"
import { composeRetryPrompt } from "@/templates/prompts/retry"
import { createAi, TEMPLATE_GENERATION_MODEL } from "@/utils/ai"

type GeneratedResult = {
	status: "generated"
	attempt: number
	diagnosticsUsed: number
}

type ExistingResult = {
	status: "already-exists"
	attempt: number
	validatedAt: Date | null
}

type CandidateGenerationResult = GeneratedResult | ExistingResult

async function performCandidateGeneration({
	logger,
	templateId,
	attempt
}: {
	logger: Logger
	templateId: string
	attempt: number
}): Promise<CandidateGenerationResult> {
	const templateRecord = await db
		.select({
			allowedWidgets: templates.allowedWidgets,
			exampleAssessmentItemBody: templates.exampleAssessmentItemBody
		})
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)
		.then((rows) => rows[0])

	if (!templateRecord) {
		logger.error("template not found for candidate generation", { templateId })
		throw errors.new(`template not found: ${templateId}`)
	}

	const existingCandidate = await db
		.select({ validatedAt: templateCandidates.validatedAt })
		.from(templateCandidates)
		.where(
			and(
				eq(templateCandidates.templateId, templateId),
				eq(templateCandidates.attempt, attempt)
			)
		)
		.limit(1)
		.then((rows) => rows[0])

	if (existingCandidate) {
		return {
			status: "already-exists",
			attempt,
			validatedAt: existingCandidate.validatedAt
		}
	}

	let previousDiagnostics: Awaited<
		ReturnType<typeof collectPreviousDiagnostics>
	> = []
	let previousSource = ""
	if (attempt > 0) {
		const previousAttempt = await db
			.select({
				source: templateCandidates.source
			})
			.from(templateCandidates)
			.where(
				and(
					eq(templateCandidates.templateId, templateId),
					eq(templateCandidates.attempt, attempt - 1)
				)
			)
			.limit(1)
			.then((rows) => rows[0])

		if (!previousAttempt) {
			logger.warn("previous attempt missing; proceeding without diagnostics", {
				templateId,
				attempt
			})
		} else {
			previousSource = previousAttempt.source
			previousDiagnostics = await collectPreviousDiagnostics(
				templateId,
				attempt - 1
			)
		}
	}

	const structuredInput = parseStructuredInput(
		logger,
		JSON.stringify(templateRecord.exampleAssessmentItemBody)
	)
	const allowedWidgets = templateRecord.allowedWidgets
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

	const insertResult = await errors.try(
		db
			.insert(templateCandidates)
			.values({
				templateId,
				attempt,
				source: generatedCode
			})
			.returning({ attempt: templateCandidates.attempt })
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
		attempt: inserted.attempt,
		diagnosticsUsed: previousDiagnostics.length
	}
}

async function collectPreviousDiagnostics(templateId: string, attempt: number) {
	return db
		.select({
			message: candidateDiagnostics.message,
			line: candidateDiagnostics.line,
			column: candidateDiagnostics.column,
			tsCode: candidateDiagnostics.tsCode
		})
		.from(candidateDiagnostics)
		.where(
			and(
				eq(candidateDiagnostics.templateId, templateId),
				eq(candidateDiagnostics.attempt, attempt)
			)
		)
		.orderBy(candidateDiagnostics.createdAt)
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
		const baseEventId = event.id
		logger.info("generating template candidate", { templateId, attempt })

		const generationResult = await errors.try(
			performCandidateGeneration({ logger, templateId, attempt })
		)

		if (generationResult.error) {
			const reason = generationResult.error.toString()
			logger.error("template candidate generation failed", {
				templateId,
				reason,
				error: generationResult.error
			})

			const failureEventResult = await errors.try(
				step.sendEvent("template-candidate-generation-failed", {
					id: `${baseEventId}-candidate-generation-failed-attempt-${attempt}`,
					name: "template/candidate.generation.failed",
					data: { templateId, attempt, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error("candidate generation failure event emission failed", {
					templateId,
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
			let validatedAtIso: string | null = null
			if (generationResult.data.validatedAt) {
				validatedAtIso = generationResult.data.validatedAt.toISOString()
			}
			logger.info("candidate already exists for attempt", {
				templateId,
				attempt,
				validatedAt: validatedAtIso
			})

			if (!generationResult.data.validatedAt) {
				await step.sendEvent("request-existing-candidate-validation", {
					id: `${baseEventId}-candidate-validation-request-${generationResult.data.attempt}`,
					name: "template/candidate.validation.requested",
					data: { templateId, attempt: generationResult.data.attempt }
				})
			} else {
				const completionEventResult = await errors.try(
					step.sendEvent("existing-candidate-validation-completed", {
						id: `${baseEventId}-candidate-validation-already-${generationResult.data.attempt}`,
						name: "template/candidate.validation.completed",
						data: {
							templateId,
							attempt: generationResult.data.attempt,
							diagnosticsCount: 0
						}
					})
				)
				if (completionEventResult.error) {
					logger.error(
						"candidate validation completion event emission failed for existing candidate",
						{
							templateId,
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
			templateId,
			attempt: generationResult.data.attempt,
			diagnosticsUsed: generationResult.data.diagnosticsUsed
		})

		await step.sendEvent("request-candidate-validation", {
			id: `${baseEventId}-candidate-validation-request-${generationResult.data.attempt}`,
			name: "template/candidate.validation.requested",
			data: { templateId, attempt: generationResult.data.attempt }
		})

		return {
			status: "generation-complete" as const,
			attempt: generationResult.data.attempt
		}
	}
)
