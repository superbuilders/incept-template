import { eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/db"
import { templateExecutions, templates } from "@/db/schema"
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
			id: templateExecutions.id,
			templateId: templateExecutions.templateId,
			questionId: templates.questionId,
			seed: templateExecutions.seed,
			body: templateExecutions.body,
			createdAt: templateExecutions.createdAt
		})
		.from(templateExecutions)
		.innerJoin(templates, eq(templates.id, templateExecutions.templateId))
		.where(eq(templateExecutions.id, executionId))
		.limit(1)

	if (rows.length === 0) {
		return null
	}

	return rows[0]
}
