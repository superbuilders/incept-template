import * as errors from "@superbuilders/errors"
import { desc, eq } from "drizzle-orm"
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

type TemplateGenerationResult = {
	status: "generated"
	templateId: string
	diagnosticsUsed: number
}

async function fetchLatestTemplate(
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

async function performTemplateGeneration({
	logger,
	exemplarQuestionId,
	templateId
}: {
	logger: Logger
	exemplarQuestionId: string
	templateId: string
}): Promise<TemplateGenerationResult> {
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

	const existingTemplateWithId = await db
		.select({ id: templates.id })
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)

	if (existingTemplateWithId[0]) {
		logger.error("template generation received duplicate templateId", {
			exemplarQuestionId,
			templateId
		})
		throw errors.new(
			`template ${templateId} already exists for exemplarQuestion=${exemplarQuestionId}`
		)
	}

	const previousTemplate = await fetchLatestTemplate(exemplarQuestionId)
	let previousDiagnostics: TypeScriptDiagnostic[] = []
	let previousSource = ""
	if (previousTemplate) {
		previousSource = previousTemplate.source
		previousDiagnostics = await getTypeScriptDiagnostics(previousTemplate.id)
	}

	const structuredInput = parseStructuredInput(
		logger,
		JSON.stringify(question.exampleAssessmentItemBody)
	)
	const allowedWidgets = question.allowedWidgets
	const sourceContext = structuredInput.sourceContext

	const ai = createAi(logger, env.OPENAI_API_KEY)
	const isRetry = previousDiagnostics.length > 0
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
				id: templateId,
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
		templateId: inserted.id,
		diagnosticsUsed: previousDiagnostics.length
	}
}

export const generateTemplate = inngest.createFunction(
	{
		id: "template-generation",
		name: "Template Generation - Step 2: Generate Template",
		idempotency: "event",
		concurrency: [
			{ scope: "fn", key: "event.data.exemplarQuestionId", limit: 1 },
			{ limit: 5 }
		]
	},
	{ event: "template/template.generate.requested" },
	async ({ event, step, logger }) => {
		const { exemplarQuestionId, templateId } = event.data
		const baseEventId = event.id
		logger.info("generating template", {
			exemplarQuestionId,
			templateId
		})

		const generationResult = await errors.try(
			step.run("perform-template-generation", () =>
				performTemplateGeneration({
					logger,
					exemplarQuestionId,
					templateId
				})
			)
		)

		if (generationResult.error) {
			const reason = generationResult.error.toString()
			logger.error("template generation failed", {
				exemplarQuestionId,
				templateId,
				reason,
				error: generationResult.error
			})

			const failureEventResult = await errors.try(
				step.sendEvent("template-generation-failed", {
					id: `${baseEventId}-template-generation-failed-${templateId}`,
					name: "template/template.generate.failed",
					data: { exemplarQuestionId, templateId, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error("template generation failure event emission failed", {
					exemplarQuestionId,
					templateId,
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

		logger.info("template generation completed", {
			exemplarQuestionId,
			templateId: generationResult.data.templateId,
			diagnosticsUsed: generationResult.data.diagnosticsUsed
		})

		await step.sendEvent("request-template-validation", {
			id: `${baseEventId}-template-validation-request-${templateId}`,
			name: "template/template.validate.requested",
			data: { exemplarQuestionId, templateId }
		})

		return {
			status: "generation-complete" as const,
			templateId: generationResult.data.templateId
		}
	}
)
