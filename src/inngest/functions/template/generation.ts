import * as errors from "@superbuilders/errors"
import { asc, eq } from "drizzle-orm"
import type { Logger } from "inngest"
import { db } from "@/db"
import type { TemplateRecord } from "@/db/schema"
import {
	exemplarQuestions,
	templates,
	typescriptDiagnostics
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

type TemplateGenerationAttemptResult = GeneratedResult | ExistingResult

async function fetchTemplateByOrdinal(
	exemplarQuestionId: string,
	ordinal: number
): Promise<TemplateRecord | null> {
	if (ordinal < 0) return null
	return db
		.select({
			id: templates.id,
			exemplarQuestionId: templates.exemplarQuestionId,
			source: templates.source,
			createdGitCommitSha: templates.createdGitCommitSha,
			createdAt: templates.createdAt,
			typescriptPassedWithZeroDiagnosticsAt:
				templates.typescriptPassedWithZeroDiagnosticsAt
		})
		.from(templates)
		.where(eq(templates.exemplarQuestionId, exemplarQuestionId))
		.orderBy(asc(templates.createdAt))
		.offset(ordinal)
		.limit(1)
		.then((rows) => rows[0] ?? null)
}

async function getTypeScriptDiagnostics(
	templateId: string
): Promise<TypeScriptDiagnostic[]> {
	return db
		.select({
			message: typescriptDiagnostics.message,
			line: typescriptDiagnostics.line,
			column: typescriptDiagnostics.column,
			tsCode: typescriptDiagnostics.tsCode
		})
		.from(typescriptDiagnostics)
		.where(eq(typescriptDiagnostics.templateId, templateId))
		.orderBy(typescriptDiagnostics.createdAt)
}

async function hasSuccessfulTypeScriptRun(
	templateId: string
): Promise<boolean> {
	const templateRow = await db
		.select({
			validatedAt: templates.typescriptPassedWithZeroDiagnosticsAt
		})
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)
		.then((rows) => rows[0])
	return Boolean(templateRow?.validatedAt)
}

async function performTemplateGenerationAttempt({
	logger,
	exemplarQuestionId,
	attempt
}: {
	logger: Logger
	exemplarQuestionId: string
	attempt: number
}): Promise<TemplateGenerationAttemptResult> {
	const question = await db
		.select({
			allowedWidgets: exemplarQuestions.allowedWidgets,
			exampleAssessmentItemBody: exemplarQuestions.exampleAssessmentItemBody
		})
		.from(exemplarQuestions)
		.where(eq(exemplarQuestions.id, exemplarQuestionId))
		.limit(1)
		.then((rows) => rows[0])

	if (!question) {
		logger.error("question not found for template generation", {
			exemplarQuestionId
		})
		throw errors.new(`question not found: ${exemplarQuestionId}`)
	}

	const existingTemplate = await fetchTemplateByOrdinal(
		exemplarQuestionId,
		attempt
	)
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
			exemplarQuestionId,
			attempt - 1
		)
		if (!previousTemplate) {
			logger.warn("previous attempt missing; proceeding without diagnostics", {
				exemplarQuestionId,
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

	const createdGitCommitSha = env.VERCEL_GIT_COMMIT_SHA

	const insertResult = await errors.try(
		db
			.insert(templates)
			.values({
				exemplarQuestionId,
				source: generatedCode,
				createdGitCommitSha
			})
			.returning({ id: templates.id })
	)
	if (insertResult.error) {
		logger.error("failed to insert template", {
			exemplarQuestionId,
			error: insertResult.error
		})
		throw errors.wrap(insertResult.error, "insert template")
	}

	const inserted = insertResult.data[0]
	if (!inserted) {
		logger.error("inserted template missing from result", {
			exemplarQuestionId
		})
		throw errors.new("failed to insert template")
	}

	return {
		status: "generated",
		attempt,
		templateId: inserted.id,
		diagnosticsUsed: previousDiagnostics.length
	}
}

export const generateTemplate = inngest.createFunction(
	{
		id: "template-generation-attempt",
		name: "Template Generation - Step 2: Generate Template",
		idempotency: "event",
		concurrency: [
			{ scope: "fn", key: "event.data.exemplarQuestionId", limit: 1 },
			{ limit: 5 }
		]
	},
	{ event: "template/template.generate.requested" },
	async ({ event, step, logger }) => {
		const { exemplarQuestionId, attempt } = event.data
		const baseEventId = event.id
		logger.info("generating template", {
			exemplarQuestionId,
			attempt
		})

		const generationResult = await errors.try(
			step.run("perform-template-generation-attempt", () =>
				performTemplateGenerationAttempt({
					logger,
					exemplarQuestionId,
					attempt
				})
			)
		)

		if (generationResult.error) {
			const reason = generationResult.error.toString()
			logger.error("template generation attempt failed", {
				exemplarQuestionId,
				reason,
				error: generationResult.error
			})

			const failureEventResult = await errors.try(
				step.sendEvent("template-generation-attempt-failed", {
					id: `${baseEventId}-template-generation-failed-attempt-${attempt}`,
					name: "template/template.generate.failed",
					data: { exemplarQuestionId, attempt, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error("template generation failure event emission failed", {
					exemplarQuestionId,
					attempt,
					reason,
					error: failureEventResult.error
				})
				throw errors.wrap(
					failureEventResult.error,
					`template generation failure event ${exemplarQuestionId}`
				)
			}

			return { status: "failed" as const, reason }
		}

		if (generationResult.data.status === "already-exists") {
			logger.info("template already exists for attempt", {
				exemplarQuestionId,
				attempt,
				validated: generationResult.data.validated,
				generatedTemplateId: generationResult.data.templateId
			})

			if (!generationResult.data.validated) {
				await step.sendEvent("request-existing-template-validation", {
					id: `${baseEventId}-template-validation-request-${generationResult.data.attempt}`,
					name: "template/template.validate.requested",
					data: {
						exemplarQuestionId,
						attempt: generationResult.data.attempt
					}
				})
			} else {
				const completionEventResult = await errors.try(
					step.sendEvent("existing-template-validation-completed", {
						id: `${baseEventId}-template-validation-already-${generationResult.data.attempt}`,
						name: "template/template.validate.completed",
						data: {
							exemplarQuestionId,
							attempt: generationResult.data.attempt,
							diagnosticsCount: 0
						}
					})
				)
				if (completionEventResult.error) {
					logger.error(
						"template validation completion event emission failed for existing template",
						{
							exemplarQuestionId,
							attempt: generationResult.data.attempt,
							error: completionEventResult.error
						}
					)
					throw errors.wrap(
						completionEventResult.error,
						"template validation completion event"
					)
				}
			}

			return {
				status: "already-exists" as const,
				attempt: generationResult.data.attempt
			}
		}

		logger.info("template generation attempt completed", {
			exemplarQuestionId,
			attempt: generationResult.data.attempt,
			diagnosticsUsed: generationResult.data.diagnosticsUsed,
			generatedTemplateId: generationResult.data.templateId
		})

		await step.sendEvent("request-template-validation", {
			id: `${baseEventId}-template-validation-request-${generationResult.data.attempt}`,
			name: "template/template.validate.requested",
			data: { exemplarQuestionId, attempt: generationResult.data.attempt }
		})

		return {
			status: "generation-complete" as const,
			attempt: generationResult.data.attempt
		}
	}
)
