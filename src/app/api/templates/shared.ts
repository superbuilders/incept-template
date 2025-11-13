import * as logger from "@superbuilders/slog"
import { asc, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import {
	type TemplateRecord,
	templates,
	typescriptDiagnostics,
	typescriptRuns
} from "@/db/schema"

export const TemplateIdSchema = z.uuid()
export const QuestionIdSchema = z.uuid()

export const SeedSchema = z
	.string()
	.regex(/^[0-9]+$/, "seed must be a non-negative integer string")

export class TemplateNotValidatedError extends Error {
	constructor(templateId: string) {
		super(`template ${templateId} has no validated executions`)
	}
}

async function getTypeScriptRunId(templateId: string): Promise<string | null> {
	const run = await db
		.select({ id: typescriptRuns.id })
		.from(typescriptRuns)
		.where(eq(typescriptRuns.templateId, templateId))
		.limit(1)
		.then((rows) => rows[0])
	return run?.id ?? null
}

async function hasSuccessfulTypeScriptRun(
	templateId: string
): Promise<boolean> {
	const runId = await getTypeScriptRunId(templateId)
	if (!runId) return false
	const diagnostic = await db
		.select({ id: typescriptDiagnostics.id })
		.from(typescriptDiagnostics)
		.where(eq(typescriptDiagnostics.runId, runId))
		.limit(1)
		.then((rows) => rows[0])
	return !diagnostic
}

export async function fetchLatestValidatedTemplate(
	questionId: string
): Promise<TemplateRecord | null> {
	const templatesForQuestion = await db
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

	for (let index = templatesForQuestion.length - 1; index >= 0; index -= 1) {
		const template = templatesForQuestion[index]
		if (await hasSuccessfulTypeScriptRun(template.id)) {
			return template
		}
	}

	if (templatesForQuestion.length > 0) {
		logger.warn("no validated templates found for question", { questionId })
	}

	return null
}
