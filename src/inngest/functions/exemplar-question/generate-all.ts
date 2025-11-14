import { randomUUID } from "node:crypto"
import { asc } from "drizzle-orm"
import { db } from "@/db"
import { exemplarQuestions } from "@/db/schema"
import { inngest } from "@/inngest/client"

const DISPATCH_BATCH_SIZE = 100

async function listExemplarQuestionIds(): Promise<string[]> {
	const rows = await db
		.select({ id: exemplarQuestions.id })
		.from(exemplarQuestions)
		.orderBy(asc(exemplarQuestions.createdAt))
	return rows.map((row) => row.id)
}

function createBatches<T>(items: readonly T[], size: number): T[][] {
	const batches: T[][] = []
	for (let index = 0; index < items.length; index += size) {
		batches.push(items.slice(index, index + size))
	}
	return batches
}

export const generateAllTemplatesForExemplarQuestions = inngest.createFunction(
	{
		id: "exemplar-question-generate-all",
		name: "Exemplar Question - Generate All",
		idempotency: "event",
		concurrency: [
			{ scope: "fn", key: "exemplar-question/generate-all", limit: 1 }
		]
	},
	{ event: "template/exemplar-question.generate.all.requested" },
	async ({ event, step, logger }) => {
		const { reason } = event.data
		const baseEventId = event.id

		logger.warn("starting exemplar-question generate-all", { reason })

		const exemplarQuestionIds = await step.run(
			"fetch-exemplar-question-ids",
			listExemplarQuestionIds
		)
		const batches = createBatches(exemplarQuestionIds, DISPATCH_BATCH_SIZE)
		let dispatched = 0

		for (const batch of batches) {
			await Promise.all(
				batch.map((exemplarQuestionId) => {
					const templateId = randomUUID()
					return step.sendEvent(`generate-all-dispatch-${exemplarQuestionId}`, {
						id: `${baseEventId}-generate-${exemplarQuestionId}`,
						name: "template/exemplar-question.template.generate.requested",
						data: { exemplarQuestionId, templateId }
					})
				})
			)
			dispatched += batch.length
			logger.info("dispatched regeneration batch", {
				reason,
				batchSize: batch.length,
				totalDispatched: dispatched
			})
		}

		logger.warn("completed exemplar-question generate-all dispatch", {
			reason,
			exemplarQuestionCount: dispatched
		})

		return {
			status: "dispatched" as const,
			exemplarQuestionCount: dispatched
		}
	}
)
