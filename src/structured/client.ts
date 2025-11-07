import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type {
	BlockContent,
	FeedbackContent,
	FeedbackSharedPedagogy,
	InlineContent
} from "@/core/content/types"
import type { FeedbackPlan } from "@/core/feedback/plan/types"
import type { AnyInteraction } from "@/core/interactions/types"
import type {
	AssessmentItemInput,
	AssessmentItemShell,
	ResponseDeclaration
} from "@/core/item/types"
import { createFeedbackObjectSchema } from "@/schemas/feedback/authoring/schema"
import { buildFeedbackPlanFromInteractions } from "@/schemas/feedback/plan/builder"
import { createAnyInteractionSchema } from "@/schemas/interactions/schema"
import { createAssessmentItemShellSchema } from "@/schemas/item/schema"
import { toJSONSchemaPromptSafe } from "@/schemas/json-schema/to-json-schema"
import type {
	WidgetCollection,
	WidgetDefinition,
	WidgetTypeTupleFrom
} from "@/widgets/collections/types"
import { allWidgetSchemas, type Widget, WidgetSchema } from "@/widgets/registry"

function isWidgetTypeKey(v: string): v is keyof typeof allWidgetSchemas {
	return v in allWidgetSchemas
}

import { createPerOutcomeNestedFeedbackPrompt } from "@/structured/prompts/feedback-per-outcome"
import { createInteractionContentPrompt } from "@/structured/prompts/interactions"
import { formatUnifiedContextSections } from "@/structured/prompts/shared"
import { createAssessmentShellPrompt } from "@/structured/prompts/shell"
import { createWidgetContentPrompt } from "@/structured/prompts/widgets"
import type { AiContextEnvelope, ImageContext } from "@/structured/types"
import { collectWidgetRefs } from "@/structured/utils/collector"
import type { Ai } from "@/utils/ai"

const OPENAI_MODEL = "gpt-5"
const MAX_IMAGES_PER_REQUEST = 500
export const ErrWidgetNotFound = errors.new(
	"widget could not be mapped to a known type"
)

// NEW: Type definitions for Responses API content parts matching SDK
type InputTextContentPart = {
	type: "input_text"
	text: string
}

type InputFileContentPart = {
	type: "input_file"
	filename?: string
	file_data?: string
}

type InputImageContentPart = {
	type: "input_image"
	detail: "high" | "low" | "auto"
	image_url?: string
}

type ExtendedContentPart =
	| InputTextContentPart
	| InputFileContentPart
	| InputImageContentPart

export const ErrUnsupportedInteraction = errors.new(
	"unsupported interaction type found"
)

async function resolveRasterImages(
	envelope: AiContextEnvelope
): Promise<ImageContext> {
	const finalImageUrls: string[] = []

	for (const url of envelope.multimodalImageUrls) {
		const urlResult = errors.trySync(() => new URL(url))
		if (urlResult.error) {
			logger.error("invalid url in multimodalImageUrls", {
				url,
				error: urlResult.error
			})
			throw errors.wrap(urlResult.error, "invalid image url")
		}
		const scheme = urlResult.data.protocol
		if (scheme !== "http:" && scheme !== "https:" && scheme !== "data:") {
			logger.error("unsupported url scheme in multimodalImageUrls", {
				url,
				scheme
			})
			throw errors.new("unsupported url scheme")
		}
		finalImageUrls.push(url)
	}

	if (finalImageUrls.length > MAX_IMAGES_PER_REQUEST) {
		logger.error("too many image inputs for request", {
			count: finalImageUrls.length,
			max: MAX_IMAGES_PER_REQUEST
		})
		throw errors.new("too many image inputs for request")
	}

	return { imageUrls: finalImageUrls }
}

async function generateAssessmentShell<
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		readonly string[]
	>
>(
	logger: logger.Logger,
	ai: Ai,
	envelope: AiContextEnvelope,
	imageContext: ImageContext,
	widgetCollection: C
) {
	const { systemInstruction, userContent } = createAssessmentShellPrompt(
		envelope,
		imageContext,
		widgetCollection
	)

	const ShellSchema = createAssessmentItemShellSchema(
		widgetCollection.widgetTypeKeys
	)
	const jsonSchema = toJSONSchemaPromptSafe(ShellSchema)

	logger.debug("generated json schema for openai", {
		functionName: "generateAssessmentShell",
		generatorName: "assessment_shell_generator",
		schema: jsonSchema
	})

	// MODIFIED: Construct a multi-part content body for the Responses API
	const contentParts: ExtendedContentPart[] = []
	contentParts.push({ type: "input_text", text: userContent })

	// Add image URLs using input_image type
	for (const imageUrl of imageContext.imageUrls) {
		contentParts.push({
			type: "input_image",
			detail: "high",
			image_url: imageUrl
		})
	}

	// NEW: Process raw image payloads into base64-encoded input_file parts
	for (const image of envelope.multimodalImagePayloads) {
		const base64 = Buffer.from(image.data).toString("base64")
		const dataUrl = `data:${image.mimeType};base64,${base64}`
		contentParts.push({
			type: "input_image",
			detail: "high",
			image_url: dataUrl
		})
	}

	// NEW: Process raw PDF payloads into base64-encoded input_file parts (Shot 1 ONLY)
	for (const pdf of envelope.pdfPayloads) {
		const base64 = Buffer.from(pdf.data).toString("base64")
		const dataUrl = `data:application/pdf;base64,${base64}`
		const filename = pdf.name.endsWith(".pdf") ? pdf.name : `${pdf.name}.pdf`
		contentParts.push({
			type: "input_file",
			filename,
			file_data: dataUrl
		})
	}

	logger.debug("calling openai for assessment shell with multimodal input", {
		partCount: contentParts.length
	})

	return ai.json(
		{
			model: OPENAI_MODEL,
			instructions: systemInstruction,
			input: [{ role: "user", content: contentParts }],
			text: {
				format: {
					type: "json_schema",
					name: "assessment_shell_generator",
					schema: jsonSchema,
					strict: true
				}
			}
		},
		ShellSchema
	)
}

function collectInteractionIdsFromShell<E extends readonly string[]>(shell: {
	body: BlockContent<E> | null
}): string[] {
	const ids = new Set<string>()

	function walkInline(inline: InlineContent<E>): void {
		for (const node of inline) {
			if (node.type === "inlineInteractionRef") {
				ids.add(node.interactionId)
			}
		}
	}

	function walkBlock(blocks: BlockContent<E>): void {
		for (const node of blocks) {
			switch (node.type) {
				case "interactionRef":
					ids.add(node.interactionId)
					break
				case "paragraph":
					walkInline(node.content)
					break
				case "unorderedList":
				case "orderedList":
					for (const item of node.items) {
						walkInline(item)
					}
					break
				case "tableRich":
					if (node.header) {
						for (const row of node.header) {
							for (const cell of row) {
								if (cell) {
									walkInline(cell)
								}
							}
						}
					}
					for (const row of node.rows) {
						for (const cell of row) {
							if (cell) {
								walkInline(cell)
							}
						}
					}
					break
				case "widgetRef":
					// These don't contain interactions
					break
			}
		}
	}

	if (shell.body) {
		walkBlock(shell.body)
	}
	return Array.from(ids)
}

async function generateInteractionContent<
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		readonly string[]
	>
>(
	logger: logger.Logger,
	ai: Ai,
	envelope: AiContextEnvelope,
	assessmentShell: {
		body: BlockContent<WidgetTypeTupleFrom<C>> | null
		responseDeclarations: ResponseDeclaration[]
	},
	imageContext: ImageContext,
	interactionIds: string[],
	widgetCollection: C
) {
	if (interactionIds.length === 0) {
		logger.debug("no interactions to generate, skipping shot 2")
		return {}
	}

	const { systemInstruction, userContent } = createInteractionContentPrompt(
		envelope,
		assessmentShell,
		imageContext,
		widgetCollection
	)

	const AnyInteraction = createAnyInteractionSchema(
		widgetCollection.widgetTypeKeys
	)
	const InteractionSchema = z.record(z.string(), AnyInteraction)
	const jsonSchema = toJSONSchemaPromptSafe(InteractionSchema)

	logger.debug("generated json schema for openai", {
		functionName: "generateInteractionContent",
		generatorName: "interaction_content_generator",
		interactionIds,
		schema: jsonSchema
	})

	// MODIFIED: Construct multi-part content for Responses API (exclude PDFs in Shot 2)
	const contentParts: ExtendedContentPart[] = []
	contentParts.push({ type: "input_text", text: userContent })

	for (const imageUrl of imageContext.imageUrls) {
		contentParts.push({
			type: "input_image",
			detail: "high",
			image_url: imageUrl
		})
	}

	for (const image of envelope.multimodalImagePayloads) {
		const base64 = Buffer.from(image.data).toString("base64")
		const dataUrl = `data:${image.mimeType};base64,${base64}`
		contentParts.push({
			type: "input_image",
			detail: "high",
			image_url: dataUrl
		})
	}
	// Include PDFs in Shot 2 for complete context
	for (const pdf of envelope.pdfPayloads) {
		const base64 = Buffer.from(pdf.data).toString("base64")
		const dataUrl = `data:application/pdf;base64,${base64}`
		const filename = pdf.name.endsWith(".pdf") ? pdf.name : `${pdf.name}.pdf`
		contentParts.push({
			type: "input_file",
			filename,
			file_data: dataUrl
		})
	}

	logger.debug(
		"calling openai for interaction content generation with multimodal input",
		{
			interactionIds
		}
	)

	// MODIFIED: API call migrated to Responses API
	return ai.json(
		{
			model: OPENAI_MODEL,
			instructions: systemInstruction,
			input: [{ role: "user", content: contentParts }],
			text: {
				format: {
					type: "json_schema",
					name: "interaction_content_generator",
					schema: jsonSchema,
					strict: true
				}
			}
		},
		InteractionSchema
	)
}

async function generateFeedbackForOutcomeNested<
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		readonly string[]
	>
>(
	logger: logger.Logger,
	ai: Ai,
	assessmentShell: AssessmentItemShell<WidgetTypeTupleFrom<C>>,
	widgetCollection: C,
	feedbackPlan: FeedbackPlan,
	combination: FeedbackPlan["combinations"][0],
	interactions: Record<string, AnyInteraction<WidgetTypeTupleFrom<C>>>,
	envelope: AiContextEnvelope,
	imageContext: ImageContext
): Promise<{ id: string; content: FeedbackContent<WidgetTypeTupleFrom<C>> }> {
	const { systemInstruction, userContent, ShallowSchema } =
		createPerOutcomeNestedFeedbackPrompt(
			assessmentShell,
			feedbackPlan,
			combination,
			widgetCollection,
			interactions
		)

	const jsonSchema = toJSONSchemaPromptSafe(ShallowSchema)
	logger.debug("generated shallow json schema for openai feedback (shard)", {
		functionName: "generateFeedbackForOutcomeNested",
		combinationId: combination.id
	})

	// MODIFIED: Switch feedback to multi-part content including images and PDFs
	const feedbackParts: ExtendedContentPart[] = []
	feedbackParts.push({ type: "input_text", text: userContent })
	feedbackParts.push({
		type: "input_text",
		text: formatUnifiedContextSections(envelope, imageContext)
	})

	for (const imageUrl of imageContext.imageUrls) {
		feedbackParts.push({
			type: "input_image",
			detail: "high",
			image_url: imageUrl
		})
	}

	for (const image of envelope.multimodalImagePayloads) {
		const base64 = Buffer.from(image.data).toString("base64")
		const dataUrl = `data:${image.mimeType};base64,${base64}`
		feedbackParts.push({
			type: "input_image",
			detail: "high",
			image_url: dataUrl
		})
	}

	for (const pdf of envelope.pdfPayloads) {
		const base64 = Buffer.from(pdf.data).toString("base64")
		const dataUrl = `data:application/pdf;base64,${base64}`
		const filename = pdf.name.endsWith(".pdf") ? pdf.name : `${pdf.name}.pdf`
		feedbackParts.push({ type: "input_file", filename, file_data: dataUrl })
	}

	const shard = await ai.json(
		{
			model: OPENAI_MODEL,
			instructions: systemInstruction,
			input: [{ role: "user", content: feedbackParts }],
			text: {
				format: {
					type: "json_schema",
					name: "feedback",
					schema: jsonSchema,
					strict: true
				}
			}
		},
		ShallowSchema
	)

	const parsedContent = shard.content
	if (parsedContent.steps.length === 0) {
		logger.warn("feedback shard returned empty steps array", {
			combinationId: combination.id
		})
	}

	return { id: combination.id, content: parsedContent }
}

async function runShardedFeedbackNested<
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		readonly string[]
	>
>(
	logger: logger.Logger,
	ai: Ai,
	shell: AssessmentItemShell<WidgetTypeTupleFrom<C>>,
	collection: C,
	plan: FeedbackPlan,
	interactions: Record<string, AnyInteraction<WidgetTypeTupleFrom<C>>>,
	envelope: AiContextEnvelope,
	imageContext: ImageContext
): Promise<Record<string, FeedbackContent<WidgetTypeTupleFrom<C>>>> {
	let combinationsToProcess = [...plan.combinations]
	const successfulShards: Record<
		string,
		FeedbackContent<WidgetTypeTupleFrom<C>>
	> = {}
	let pass = 0

	while (combinationsToProcess.length > 0) {
		pass++
		logger.info("starting feedback shard generation pass", {
			pass,
			remaining: combinationsToProcess.length,
			total: plan.combinations.length
		})

		const tasks = combinationsToProcess.map(
			(combination) => () =>
				generateFeedbackForOutcomeNested(
					logger,
					ai,
					shell,
					collection,
					plan,
					combination,
					interactions,
					envelope,
					imageContext
				)
		)

		const results = await Promise.allSettled(tasks.map((task) => task()))

		const failedCombinations: typeof combinationsToProcess = []

		for (let index = 0; index < results.length; index++) {
			const result = results[index]
			const combination = combinationsToProcess[index]
			if (!combination) {
				continue
			}
			if (result.status === "fulfilled") {
				const { id, content } = result.value
				if (content && content.steps.length > 0) {
					successfulShards[id] = content
				} else {
					logger.warn("feedback shard returned empty steps, will retry", {
						combinationId: id,
						pass
					})
					failedCombinations.push(combination)
				}
			} else {
				logger.warn("feedback shard failed, scheduling for retry", {
					combinationId: combination.id,
					pass,
					reason: result.reason
				})
				failedCombinations.push(combination)
			}
		}

		if (
			failedCombinations.length > 0 &&
			failedCombinations.length === combinationsToProcess.length
		) {
			logger.warn(
				"no progress in feedback shard generation pass, retrying all",
				{ pass }
			)
		}

		combinationsToProcess = failedCombinations
	}

	logger.info("all feedback shards generated successfully", {
		totalPasses: pass
	})
	return successfulShards
}

export async function generateFromEnvelope<
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		readonly string[]
	>
>(
	logger: logger.Logger,
	ai: Ai,
	envelope: AiContextEnvelope,
	widgetCollection: C
): Promise<AssessmentItemInput<WidgetTypeTupleFrom<C>, FeedbackPlan>> {
	if (!envelope.primaryContent || envelope.primaryContent.trim() === "") {
		logger.error("envelope validation failed", {
			reason: "primaryContent is empty"
		})
		throw errors.new("primaryContent cannot be empty")
	}

	logger.info("starting structured qti generation from envelope", {
		widgetCollection: widgetCollection.name,
		primaryContentLength: envelope.primaryContent.length,
		supplementaryContentCount: envelope.supplementaryContent.length,
		multimodalUrlCount: envelope.multimodalImageUrls.length,
		multimodalPayloadCount: envelope.multimodalImagePayloads.length,
		pdfPayloadCount: envelope.pdfPayloads.length
	})

	const resolvedImagesResult = await errors.try(resolveRasterImages(envelope))
	if (resolvedImagesResult.error) {
		logger.error("raster image resolution", {
			error: resolvedImagesResult.error
		})
		throw errors.wrap(resolvedImagesResult.error, "raster image resolution")
	}
	const imageContext = resolvedImagesResult.data

	const shellResult = await errors.try(
		generateAssessmentShell(
			logger,
			ai,
			envelope,
			imageContext,
			widgetCollection
		)
	)
	if (shellResult.error) {
		logger.error("generate assessment shell", { error: shellResult.error })
		throw errors.wrap(shellResult.error, "generate assessment shell")
	}
	const assessmentShell = shellResult.data
	logger.debug("shot 1 complete", {
		identifier: assessmentShell.identifier
	})

	const interactionIds = collectInteractionIdsFromShell(assessmentShell)
	const interactionContentResult = await errors.try(
		generateInteractionContent(
			logger,
			ai,
			envelope,
			assessmentShell,
			imageContext,
			interactionIds,
			widgetCollection
		)
	)
	if (interactionContentResult.error) {
		logger.error("generate interaction content", {
			error: interactionContentResult.error
		})
		throw errors.wrap(
			interactionContentResult.error,
			"generate interaction content"
		)
	}
	const generatedInteractions = interactionContentResult.data
	logger.debug("shot 2 complete", {
		generatedInteractionKeys: Object.keys(generatedInteractions)
	})

	// Validate that all expected interaction IDs were generated
	const generatedKeys = new Set(Object.keys(generatedInteractions))
	const expectedKeys = new Set(interactionIds)
	const missingKeys = interactionIds.filter((id) => !generatedKeys.has(id))
	const extraKeys = Array.from(generatedKeys).filter(
		(id) => !expectedKeys.has(id)
	)

	if (missingKeys.length > 0 || extraKeys.length > 0) {
		logger.error("interaction key mismatch after shot 2", {
			expected: interactionIds,
			generated: Array.from(generatedKeys),
			missing: missingKeys,
			extra: extraKeys
		})
		throw errors.new(
			"interaction key mismatch: body references interactions that don't exist or LLM generated interactions with wrong keys"
		)
	}

	if (
		!assessmentShell.responseDeclarations ||
		assessmentShell.responseDeclarations.length === 0
	) {
		logger.error("assessment shell has no response declarations", {
			identifier: assessmentShell.identifier
		})
		throw errors.new(
			"assessment shell must have at least one response declaration"
		)
	}

	const feedbackPlan = buildFeedbackPlanFromInteractions(
		generatedInteractions,
		assessmentShell.responseDeclarations
	)
	logger.debug("built feedback plan", {
		dimensionCount: feedbackPlan.dimensions.length,
		combinationCount: feedbackPlan.combinations.length
	})

	if (feedbackPlan.combinations.length > 2048) {
		logger.error("structured feedback combination limit exceeded", {
			combinationCount: feedbackPlan.combinations.length,
			dimensionCount: feedbackPlan.dimensions.length
		})
		throw errors.new("structured feedback combination limit exceeded")
	}

	logger.info("starting sharded feedback generation", {
		combinationCount: feedbackPlan.combinations.length
	})
	const shardedResult = await errors.try(
		runShardedFeedbackNested(
			logger,
			ai,
			assessmentShell,
			widgetCollection,
			feedbackPlan,
			generatedInteractions,
			envelope,
			imageContext
		)
	)
	if (shardedResult.error) {
		logger.error("sharded feedback generation failed", {
			error: shardedResult.error
		})
		throw errors.wrap(shardedResult.error, "sharded feedback generation")
	}
	const feedbackBlocks = shardedResult.data
	logger.debug("sharded feedback generation complete", {
		feedbackBlockCount: Object.keys(feedbackBlocks).length
	})

	const combinationIds = feedbackPlan.combinations.map((combo) => combo.id)
	const missingContent = combinationIds.filter(
		(id) => feedbackBlocks[id] === undefined
	)
	if (missingContent.length > 0) {
		logger.error("missing feedback content for combinations", {
			missing: missingContent
		})
		throw errors.new(
			`missing feedback content for combinations: ${missingContent.join(", ")}`
		)
	}

	const representativeId =
		combinationIds.find((id) => feedbackBlocks[id]) ?? combinationIds[0]
	const representativeContent =
		representativeId !== undefined ? feedbackBlocks[representativeId] : null

	if (!representativeContent) {
		logger.error("unable to select representative feedback content", {
			combinationIds
		})
		throw errors.new("no feedback content available to build shared pedagogy")
	}

	const shared: FeedbackSharedPedagogy<WidgetTypeTupleFrom<C>> = {
		steps: representativeContent.steps,
		solution: representativeContent.solution
	}

	const preambleEntries = combinationIds.map((id) => {
		const content = feedbackBlocks[id]
		if (!content) {
			logger.error("missing feedback content during preamble assembly", { id })
			throw errors.new(`missing feedback content for combination '${id}'`)
		}
		return [id, content.preamble] as const
	})

	const feedbackBundleCandidate = {
		shared,
		preambles: Object.fromEntries(preambleEntries)
	}

	const FeedbackObjectSchema = createFeedbackObjectSchema(
		feedbackPlan,
		widgetCollection.widgetTypeKeys
	)
	const feedbackValidation = FeedbackObjectSchema.safeParse(
		feedbackBundleCandidate
	)
	if (!feedbackValidation.success) {
		logger.error("feedback bundle validation failed", {
			error: feedbackValidation.error
		})
		throw errors.wrap(feedbackValidation.error, "feedback bundle validation")
	}

	const widgetRefs = collectWidgetRefs({
		body: assessmentShell.body,
		feedback: feedbackValidation.data,
		feedbackPlan,
		interactions: generatedInteractions
	})

	logger.debug("collected widget refs", {
		count: widgetRefs.size,
		refs: Array.from(widgetRefs.entries())
	})

	let generatedWidgets: Record<string, Widget> = {}
	if (widgetRefs.size > 0) {
		// Build a typed mapping with runtime guard
		const widgetMapping: Record<string, WidgetTypeTupleFrom<C>[number]> = {}
		for (const [id, typeName] of widgetRefs) {
			if (!isWidgetTypeKey(typeName)) {
				logger.error("unknown widget type in refs", { widgetId: id, typeName })
				throw errors.new("unknown widget type in refs")
			}
			// Verify widget type exists in the provided collection
			if (!widgetCollection.widgetTypeKeys.includes(typeName)) {
				logger.error("widget type not in collection", {
					widgetId: id,
					typeName,
					collectionName: widgetCollection.name,
					availableTypes: widgetCollection.widgetTypeKeys
				})
				throw errors.new("widget type not in collection")
			}
			widgetMapping[id] = typeName
		}
		const widgetPrompt = createWidgetContentPrompt(
			envelope,
			assessmentShell,
			widgetMapping,
			generatedInteractions,
			widgetCollection,
			imageContext
		)

		// Accept any widget id → widget union; enforce required ids below
		const WidgetCollectionSchema = z.record(z.string(), WidgetSchema)
		const widgetJsonSchema = toJSONSchemaPromptSafe(WidgetCollectionSchema)
		logger.debug("generated json schema for openai", {
			functionName: "generateWidgetContent",
			generatorName: "widget_content_generator",
			schema: widgetJsonSchema
		})

		// MODIFIED: Construct multi-part content for Responses API (INCLUDE PDFs in Shot 4)
		const widgetContentParts: ExtendedContentPart[] = []
		widgetContentParts.push({
			type: "input_text",
			text: widgetPrompt.userContent
		})

		for (const imageUrl of imageContext.imageUrls) {
			widgetContentParts.push({
				type: "input_image",
				detail: "high",
				image_url: imageUrl
			})
		}

		for (const image of envelope.multimodalImagePayloads) {
			const base64 = Buffer.from(image.data).toString("base64")
			const dataUrl = `data:${image.mimeType};base64,${base64}`
			widgetContentParts.push({
				type: "input_image",
				detail: "high",
				image_url: dataUrl
			})
		}
		// Include PDFs for widget generation as well
		for (const pdf of envelope.pdfPayloads) {
			const base64 = Buffer.from(pdf.data).toString("base64")
			const dataUrl = `data:application/pdf;base64,${base64}`
			const filename = pdf.name.endsWith(".pdf") ? pdf.name : `${pdf.name}.pdf`
			widgetContentParts.push({
				type: "input_file",
				filename,
				file_data: dataUrl
			})
		}

		generatedWidgets = await ai.json(
			{
				model: OPENAI_MODEL,
				instructions: widgetPrompt.systemInstruction,
				input: [{ role: "user", content: widgetContentParts }],
				text: {
					format: {
						type: "json_schema",
						name: "widget_content_generator",
						schema: widgetJsonSchema,
						strict: true
					}
				}
			},
			WidgetCollectionSchema
		)

		// Validate all required widgets were generated
		const generatedKeys = new Set(Object.keys(generatedWidgets))
		const requiredIds = Array.from(widgetRefs.keys())
		const missingContent = requiredIds.filter((id) => !generatedKeys.has(id))
		if (missingContent.length > 0) {
			logger.error(
				"widget content generation did not produce all required widgets",
				{
					missingContent
				}
			)
			throw errors.new(
				`widget content generation: missing content for slots: ${missingContent.join(", ")}`
			)
		}

		logger.debug("shot 4 complete", {
			generatedWidgetKeys: Object.keys(generatedWidgets)
		})
	}

	return {
		...assessmentShell,
		interactions: generatedInteractions,
		widgets: generatedWidgets,
		feedbackPlan,
		feedback: feedbackValidation.data
	}
}
