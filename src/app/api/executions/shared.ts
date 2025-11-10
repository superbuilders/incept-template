import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { templateCandidateExecutions, templateCandidates } from "@/db/schema"
import { widgetCollections } from "@/widgets/collections"

export const ExecutionIdSchema = z.uuid()

export const widgetCollection = widgetCollections.all

export type ExecutionRecord = {
	id: string
	templateId: string
	attempt: number
	seed: bigint
	body: unknown
	createdAt: Date
}

export async function fetchExecutionRecord(
	executionId: string
): Promise<ExecutionRecord | null> {
	const rows = await db
		.select({
			id: templateCandidateExecutions.id,
			templateId: templateCandidateExecutions.templateId,
			attempt: templateCandidateExecutions.attempt,
			seed: templateCandidateExecutions.seed,
			body: templateCandidateExecutions.body,
			createdAt: templateCandidateExecutions.createdAt
		})
		.from(templateCandidateExecutions)
		.innerJoin(
			templateCandidates,
			and(
				eq(
					templateCandidates.templateId,
					templateCandidateExecutions.templateId
				),
				eq(templateCandidates.attempt, templateCandidateExecutions.attempt)
			)
		)
		.where(eq(templateCandidateExecutions.id, executionId))
		.limit(1)

	if (rows.length === 0) {
		return null
	}

	return rows[0]
}
