import { randomUUID } from "node:crypto"
import * as errors from "@superbuilders/errors"
import { asc, desc } from "drizzle-orm"
import { db } from "@/db"
import { templates } from "@/db/schema"
import { inngest } from "@/inngest/client"
import { revalidateLatestExemplarQuestionTemplate } from "@/inngest/functions/exemplar-question/revalidate"

const DISPATCH_BATCH_SIZE = 100

type LatestTemplateRow = {
	exemplarQuestionId: string
	zeroSeedSuccessfullyGeneratedAt: Date | string | null
	typescriptPassedWithZeroDiagnosticsAt: Date | string | null
}

async function listQuestionsWithValidatedLatestTemplate(): Promise<string[]> {
	const rows = await db
		.select({
			exemplarQuestionId: templates.exemplarQuestionId,
			zeroSeedSuccessfullyGeneratedAt:
				templates.zeroSeedSuccessfullyGeneratedAt,
			typescriptPassedWithZeroDiagnosticsAt:
				templates.typescriptPassedWithZeroDiagnosticsAt
		})
		.from(templates)
		.orderBy(asc(templates.exemplarQuestionId), desc(templates.createdAt))

	const latestByQuestion = new Map<string, LatestTemplateRow>()

	for (const row of rows) {
		const { exemplarQuestionId } = row
		if (!latestByQuestion.has(exemplarQuestionId)) {
			latestByQuestion.set(exemplarQuestionId, row)
		}
	}

	const validatedIds: string[] = []
	for (const [exemplarQuestionId, template] of latestByQuestion.entries()) {
		if (
			template.zeroSeedSuccessfullyGeneratedAt &&
			template.typescriptPassedWithZeroDiagnosticsAt
		) {
			validatedIds.push(exemplarQuestionId)
		}
	}

	return validatedIds
}

function createBatches<T>(items: readonly T[], size: number): T[][] {
	const batches: T[][] = []
	for (let index = 0; index < items.length; index += size) {
		batches.push(items.slice(index, index + size))
	}
	return batches
}

export const revalidateAllValidatedExemplarQuestions = inngest.createFunction(
	{
		id: "exemplar-question-revalidate-all",
		name: "Exemplar Question - Revalidate All",
		idempotency: "event",
		concurrency: [
			{ scope: "fn", key: "exemplar-question/revalidate-all", limit: 1 }
		]
	},
	{ event: "template/exemplar-question.revalidate.all.invoked" },
	async ({ event, step, logger }) => {
		const { reason } = event.data

		logger.warn("starting exemplar-question revalidate-all", { reason })

		const exemplarQuestionIds = await step.run(
			"fetch-exemplar-question-ids-with-validated-templates",
			listQuestionsWithValidatedLatestTemplate
		)

		if (exemplarQuestionIds.length === 0) {
			logger.info("no exemplar questions require revalidation", { reason })
			return { status: "skipped" as const, exemplarQuestionCount: 0 }
		}

		const batches = createBatches(exemplarQuestionIds, DISPATCH_BATCH_SIZE)
		let dispatched = 0

		for (const batch of batches) {
			await Promise.all(
				batch.map(async (exemplarQuestionId) => {
					const templateId = randomUUID()
					const result = await errors.try(
						step.invoke(`revalidate-${exemplarQuestionId}`, {
							function: revalidateLatestExemplarQuestionTemplate,
							data: { exemplarQuestionId, templateId }
						})
					)
					if (result.error) {
						logger.error("failed to invoke revalidation", {
							exemplarQuestionId,
							templateId,
							error: result.error
						})
					}
				})
			)
			dispatched += batch.length
			logger.info("dispatched revalidation batch", {
				reason,
				batchSize: batch.length,
				totalDispatched: dispatched
			})
		}

		logger.warn("completed exemplar-question revalidate-all dispatch", {
			reason,
			exemplarQuestionCount: dispatched
		})

		return {
			status: "dispatched" as const,
			exemplarQuestionCount: dispatched
		}
	}
)
