import * as logger from "@superbuilders/slog"
import { and, desc, eq, isNotNull } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { templateCandidates } from "@/db/schema"

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

export async function fetchLatestValidatedAttempt(
	templateId: string
): Promise<number | null> {
	const rows = await db
		.select({ attempt: templateCandidates.attempt })
		.from(templateCandidates)
		.where(
			and(
				eq(templateCandidates.templateId, templateId),
				isNotNull(templateCandidates.validatedAt)
			)
		)
		.orderBy(desc(templateCandidates.attempt))
		.limit(1)

	if (rows.length === 0) {
		logger.warn("no validated template candidates", { templateId })
		return null
	}

	return rows[0].attempt
}

