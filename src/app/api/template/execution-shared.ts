import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { templateCandidateExecutions, templates } from "@/db/schema"
import { widgetCollections } from "@/widgets/collections"

export const ExecutionIdSchema = z.uuid()

export const widgetCollection = widgetCollections.all

export type ExecutionRecord = {
	id: string
	templateId: string
	questionId: string
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
			questionId: templates.questionId,
			seed: templateCandidateExecutions.seed,
			body: templateCandidateExecutions.body,
			createdAt: templateCandidateExecutions.createdAt
		})
		.from(templateCandidateExecutions)
		.innerJoin(
			templates,
			eq(templates.id, templateCandidateExecutions.templateId)
		)
		.where(eq(templateCandidateExecutions.id, executionId))
		.limit(1)

	if (rows.length === 0) {
		return null
	}

	return rows[0]
}
