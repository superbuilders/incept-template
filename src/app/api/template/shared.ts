import * as logger from "@superbuilders/slog"
import { asc, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { templates, typescriptDiagnostics, typescriptRuns } from "@/db/schema"

export const TemplateIdSchema = z.uuid()

export const SeedSchema = z
	.string()
	.regex(/^[0-9]+$/, "seed must be a non-negative integer string")

export const AttemptSchema = z.coerce.number().int().min(0)

export class TemplateNotValidatedError extends Error {
	constructor(templateId: string) {
		super(`template ${templateId} has no validated attempts`)
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

export async function fetchLatestValidatedAttempt(
	templateId: string
): Promise<number | null> {
	const templateRows = await db
		.select({ id: templates.id })
		.from(templates)
		.where(eq(templates.questionId, templateId))
		.orderBy(asc(templates.createdAt))

	for (let ordinal = templateRows.length - 1; ordinal >= 0; ordinal -= 1) {
		const template = templateRows[ordinal]
		if (await hasSuccessfulTypeScriptRun(template.id)) {
			return ordinal
		}
	}

	if (templateRows.length > 0) {
		logger.warn("no validated template candidates", { templateId })
	}

	return null
}
