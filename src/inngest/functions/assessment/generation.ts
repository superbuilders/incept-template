import * as errors from "@superbuilders/errors"
import { compile } from "@/compiler/compiler"
import { env } from "@/env"
import { inngest } from "@/inngest/client"
import { generateFromEnvelope } from "@/structured/client"
import type { AiContextEnvelope } from "@/structured/types"
import { createAi } from "@/utils/ai"
import { widgetCollections } from "@/widgets/collections"

export const generateAssessmentItem = inngest.createFunction(
	{
		id: "assessment-item-generation",
		name: "Assessment Item Generation from Envelope",
		idempotency: "event",
		concurrency: [{ limit: 5 }]
	},
	{ event: "assessment/item.generation.requested" },
	async ({ event, step, logger }) => {
		const { jobId, widgetCollection: collectionName, envelope } = event.data
		const baseEventId = event.id

		logger.info("starting assessment item generation from envelope", {
			jobId,
			widgetCollection: collectionName,
			primaryContentLength: envelope.primaryContent.length
		})

		const collection = widgetCollections[collectionName]
		if (!collection) {
			const reason = `invalid widget collection: ${collectionName}`
			logger.error("widget collection not found", {
				jobId,
				widgetCollection: collectionName
			})

			await step.sendEvent("assessment-item-generation-failed", {
				id: `${baseEventId}-generation-failed`,
				name: "assessment/item.generation.failed",
				data: { jobId, reason }
			})

			return { status: "failed" as const, reason }
		}

		const typedEnvelope: AiContextEnvelope = {
			primaryContent: envelope.primaryContent,
			supplementaryContent: envelope.supplementaryContent,
			multimodalImageUrls: envelope.multimodalImageUrls,
			multimodalImagePayloads: envelope.multimodalImagePayloads.map((img) => {
				const buf = Buffer.from(img.dataBase64, "base64")
				return {
					data: buf.buffer.slice(
						buf.byteOffset,
						buf.byteOffset + buf.byteLength
					),
					mimeType: img.mimeType
				}
			}),
			pdfPayloads: envelope.pdfPayloads.map((pdf) => {
				const buf = Buffer.from(pdf.dataBase64, "base64")
				return {
					name: pdf.name,
					data: buf.buffer.slice(
						buf.byteOffset,
						buf.byteOffset + buf.byteLength
					)
				}
			})
		}

		const itemInputResult = await errors.try(
			step.run("generate-item-from-envelope", async () => {
				const ai = createAi(logger, env.OPENAI_API_KEY)
				return await generateFromEnvelope(logger, ai, typedEnvelope, collection)
			})
		)
		if (itemInputResult.error) {
			const reason = itemInputResult.error.toString()
			logger.error("assessment item generation from envelope failed", {
				jobId,
				error: itemInputResult.error
			})

			await step.sendEvent("assessment-item-generation-failed", {
				id: `${baseEventId}-generation-failed`,
				name: "assessment/item.generation.failed",
				data: { jobId, reason }
			})

			return { status: "failed" as const, reason }
		}

		const itemInput = itemInputResult.data
		logger.info("generated assessment item input", {
			jobId,
			identifier: itemInput.identifier,
			title: itemInput.title
		})

		const qtiXmlResult = await errors.try(
			step.run("compile-to-qti-xml", async () => {
				// @ts-expect-error: itemInput from generateFromEnvelope is compatible at runtime
				return await compile(itemInput, collection)
			})
		)
		if (qtiXmlResult.error) {
			const reason = qtiXmlResult.error.toString()
			logger.error("qti xml compilation failed", {
				jobId,
				error: qtiXmlResult.error
			})

			await step.sendEvent("assessment-item-generation-failed", {
				id: `${baseEventId}-compilation-failed`,
				name: "assessment/item.generation.failed",
				data: { jobId, reason }
			})

			return { status: "failed" as const, reason }
		}

		const qtiXml = qtiXmlResult.data
		logger.info("successfully compiled assessment item to qti xml", {
			jobId,
			identifier: itemInput.identifier
		})

		await step.sendEvent("assessment-item-generation-completed", {
			id: `${baseEventId}-generation-completed`,
			name: "assessment/item.generation.completed",
			data: {
				jobId,
				itemBody: itemInput,
				qtiXml
			}
		})

		return {
			status: "completed" as const,
			identifier: itemInput.identifier,
			title: itemInput.title
		}
	}
)
