import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import {
	CHOICE_IDENTIFIER_REGEX,
	RESPONSE_IDENTIFIER_REGEX
} from "@/compiler/qti-constants"
import { createBodyContentSchema } from "@/core/content/contextual-schemas"
import {
	createComboFeedbackObjectSchema,
	createFallbackFeedbackObjectSchema
} from "@/core/feedback/authoring/schema"
import { isComboPlan, isFallbackPlan } from "@/core/feedback/plan/guards"
import { FeedbackPlanSchema } from "@/core/feedback/plan/schema"
import type { ComboPlan, FeedbackPlan } from "@/core/feedback/plan/types"
import { createAnyInteractionSchema } from "@/core/interactions/schema"
import type {
	AssessmentItem,
	AssessmentItemShell,
	ResponseDeclaration
} from "@/core/item/types"
import { WidgetSchema } from "@/widgets/registry"

// Response Declaration Schema (shared across all dynamic schemas)
const BaseResponseDeclarationSchema = z
	.object({
		identifier: z
			.string()
			.regex(
				RESPONSE_IDENTIFIER_REGEX,
				"invalid response identifier: must start with RESPONSE"
			)
			.describe(
				"Unique ID linking an interaction to this response declaration."
			),
		cardinality: z
			.enum(["single", "multiple", "ordered"])
			.describe(
				"Defines response structure: single value, multiple values, or ordered sequence."
			)
	})
	.strict()

const NumericRoundingSchema = z.discriminatedUnion("strategy", [
	z
		.object({
			strategy: z.literal("decimalPlaces"),
			figures: z.number().int().min(0)
		})
		.strict(),
	z
		.object({
			strategy: z.literal("significantFigures"),
			figures: z.number().int().min(1)
		})
		.strict()
])

const StringSingleResponseDeclaration = BaseResponseDeclarationSchema.extend({
	baseType: z.literal("string"),
	cardinality: z.literal("single"),
	correct: z.string().describe("The single correct answer for a text entry.")
}).strict()

const IntegerSingleResponseDeclaration = BaseResponseDeclarationSchema.extend({
	baseType: z.literal("integer"),
	cardinality: z.literal("single"),
	correct: z
		.number()
		.int()
		.refine(Number.isFinite, {
			message: "integer correct value must be finite"
		})
		.describe("The single correct integer answer for a numeric entry.")
}).strict()

const FloatSingleResponseDeclaration = BaseResponseDeclarationSchema.extend({
	baseType: z.literal("float"),
	cardinality: z.literal("single"),
	correct: z
		.number()
		.refine(Number.isFinite, {
			message: "float correct value must be finite"
		})
		.describe("The single correct decimal answer for a numeric entry."),
	rounding: NumericRoundingSchema.describe(
		"Rounding policy describing how float responses are evaluated."
	)
}).strict()

const IdentifierSingleResponseDeclaration =
	BaseResponseDeclarationSchema.extend({
		baseType: z.literal("identifier"),
		cardinality: z.literal("single"),
		correct: z
			.string()
			.describe("The single correct choice identifier for this response.")
	}).strict()

const IdentifierMultipleResponseDeclaration =
	BaseResponseDeclarationSchema.extend({
		baseType: z.literal("identifier"),
		cardinality: z.literal("multiple"),
		correct: z
			.array(z.string())
			.nonempty()
			.describe("The set of correct choice identifiers for this response.")
	}).strict()

const IdentifierOrderedResponseDeclaration =
	BaseResponseDeclarationSchema.extend({
		baseType: z.literal("identifier"),
		cardinality: z.literal("ordered"),
		correct: z
			.array(z.string())
			.nonempty()
			.describe(
				"The ordered sequence of correct choice identifiers for this response."
			)
	}).strict()

const GapMatchCorrectPairSchema = z
	.object({
		source: z
			.string()
			.regex(
				CHOICE_IDENTIFIER_REGEX,
				"invalid source identifier: must be uppercase"
			)
			.describe("The identifier of the gap-text (draggable item)."),
		target: z
			.string()
			.regex(
				CHOICE_IDENTIFIER_REGEX,
				"invalid target identifier: must be uppercase"
			)
			.describe("The identifier of the gap where the item should be placed.")
	})
	.strict()
	.describe("A source→target pair representing a correct match.")

const DirectedPairMultipleResponseDeclaration = z
	.discriminatedUnion("allowEmpty", [
		BaseResponseDeclarationSchema.extend({
			baseType: z.literal("directedPair"),
			cardinality: z.literal("multiple"),
			allowEmpty: z.literal(true),
			correct: z
				.array(GapMatchCorrectPairSchema)
				.describe("Array of correct source->target pairs for gap match.")
		}).strict(),
		BaseResponseDeclarationSchema.extend({
			baseType: z.literal("directedPair"),
			cardinality: z.literal("multiple"),
			allowEmpty: z.literal(false),
			correct: z
				.array(GapMatchCorrectPairSchema)
				.nonempty()
				.describe("Array of correct source->target pairs for gap match.")
		}).strict()
	])
	.describe(
		"Gap match response declaration for multiple cardinality with explicit allowEmpty policy."
	)

const DirectedPairOrderedResponseDeclaration =
	BaseResponseDeclarationSchema.extend({
		baseType: z.literal("directedPair"),
		cardinality: z.literal("ordered"),
		allowEmpty: z
			.literal(false)
			.describe(
				"Ordered cardinality requires at least one correct pair; allowEmpty must be false."
			),
		correct: z
			.array(GapMatchCorrectPairSchema)
			.nonempty()
			.describe("Ordered array of correct source->target pairs for gap match.")
	}).strict()

const ResponseDeclarationSchemaInternal = z
	.union([
		StringSingleResponseDeclaration,
		IntegerSingleResponseDeclaration,
		FloatSingleResponseDeclaration,
		IdentifierSingleResponseDeclaration,
		IdentifierMultipleResponseDeclaration,
		IdentifierOrderedResponseDeclaration,
		DirectedPairMultipleResponseDeclaration,
		DirectedPairOrderedResponseDeclaration
	])
	.describe(
		"Defines the correct answer for an interaction, with a structure that varies based on the response's baseType and cardinality."
	)

export const ResponseDeclarationSchema: z.ZodType<ResponseDeclaration> =
	ResponseDeclarationSchemaInternal

export function createAssessmentItemShellSchema<
	const E extends readonly string[]
>(widgetTypeKeys: E): z.ZodType<AssessmentItemShell<E>> {
	const BodySchema = createBodyContentSchema(widgetTypeKeys)

	return z
		.object({
			identifier: z
				.string()
				.describe("Unique identifier for this assessment item."),
			title: z
				.string()
				.describe("Human-readable title of the assessment item."),
			responseDeclarations: z
				.array(ResponseDeclarationSchema)
				.describe(
					"Defines correct answers and scoring for all interactions in this item."
				),
			body: BodySchema.nullable().describe(
				"The main content with ref placeholders."
			)
		})
		.strict()
		.describe(
			"Initial assessment item structure with ref placeholders from the first AI generation shot."
		)
}

export function createDynamicAssessmentItemSchema<
	const E extends readonly string[]
>(
	widgetMapping: Record<string, E[number]>,
	widgetTypeKeys: E,
	widgetSchemas: Record<E[number], z.ZodType<unknown, unknown>>,
	feedbackPlan: FeedbackPlan
) {
	for (const [slotName, widgetType] of Object.entries(widgetMapping)) {
		const schema = widgetSchemas[widgetType]
		if (!schema) {
			logger.error("unknown widget type in mapping", {
				slotName,
				widgetType,
				availableTypes: widgetTypeKeys
			})
			throw errors.new(
				`unknown widget type specified in mapping: ${widgetType}`
			)
		}
	}

	// Narrow to only allowed widget schemas for this collection
	const allowedTypeNames = new Set<string>(Object.keys(widgetSchemas))
	const AllowedWidgetSchema = WidgetSchema.superRefine((val, ctx) => {
		if (!allowedTypeNames.has(val.type)) {
			ctx.addIssue({
				code: "custom",
				message: `widget type '${val.type}' is not allowed in this collection`,
				path: ["type"]
			})
		}
	})

	const DynamicWidgetsSchema = z
		.record(z.string(), AllowedWidgetSchema)
		.describe("Map of widget slot IDs to their widget definitions")
	const BodySchema = createBodyContentSchema(widgetTypeKeys)
	const AnyInteractionSchema = createAnyInteractionSchema(widgetTypeKeys)

	let FeedbackObjectSchema:
		| ReturnType<typeof createFallbackFeedbackObjectSchema<E>>
		| ReturnType<typeof createComboFeedbackObjectSchema<ComboPlan, E>>

	if (isFallbackPlan(feedbackPlan)) {
		FeedbackObjectSchema = createFallbackFeedbackObjectSchema(widgetTypeKeys)
	} else if (isComboPlan(feedbackPlan)) {
		FeedbackObjectSchema = createComboFeedbackObjectSchema(
			feedbackPlan,
			widgetTypeKeys
		)
	} else {
		logger.error("unsupported feedback plan mode")
		throw errors.new("unsupported feedback plan mode")
	}

	// Compose the full AssessmentItem schema with direct object property composition
	const AssessmentItemSchemaBase: z.ZodType<AssessmentItem<E, FeedbackPlan>> = z
		.object({
			identifier: z
				.string()
				.describe("Unique identifier for this assessment item."),
			title: z
				.string()
				.describe("Human-readable title of the assessment item."),
			responseDeclarations: z
				.array(ResponseDeclarationSchema)
				.min(1)
				.describe(
					"Defines correct answers and scoring for all interactions in this item."
				),
			body: BodySchema.nullable().describe(
				"The main content of the item as structured blocks."
			),
			widgets: DynamicWidgetsSchema.nullable().describe(
				"A map of widget identifiers to their full widget object definitions."
			),
			interactions: z
				.record(z.string(), AnyInteractionSchema)
				.nullable()
				.describe(
					"A map of interaction identifiers to their full interaction object definitions."
				),
			feedbackPlan: FeedbackPlanSchema,
			feedback: FeedbackObjectSchema.describe(
				"Nested feedback structure with dimensional paths for all response combinations."
			)
		})
		.strict()

	const validateGapMatchConstraints = (
		data: AssessmentItem<E, FeedbackPlan>,
		ctx: z.RefinementCtx
	) => {
		if (!data.interactions) return

		for (const [interactionKey, interaction] of Object.entries(
			data.interactions
		)) {
			if (interaction.type !== "gapMatchInteraction") continue

			const declaration = data.responseDeclarations.find(
				(d) => d.identifier === interaction.responseIdentifier
			)
			if (!declaration || declaration.baseType !== "directedPair") {
				continue
			}

			const gapTextIds = new Set(
				interaction.gapTexts.map((gapText) => gapText.identifier)
			)
			const declaredGapIds = new Set(
				interaction.gaps.map((gap) => gap.identifier)
			)

			for (const pair of declaration.correct) {
				const { source, target } = pair

				if (!gapTextIds.has(source)) {
					ctx.addIssue({
						code: "custom",
						message: `gap match validation: correct pair source '${source}' not in gapTexts`,
						path: ["interactions", interactionKey, "gapTexts"]
					})
				}

				if (!declaredGapIds.has(target)) {
					ctx.addIssue({
						code: "custom",
						message: `gap match validation: correct pair target '${target}' not in gaps`,
						path: ["interactions", interactionKey, "gaps"]
					})
				}
			}

			const usageBySource = new Map<string, number>()
			const seenPairs = new Set<string>()

			for (const pair of declaration.correct) {
				const pairKey = `${pair.source}→${pair.target}`
				if (seenPairs.has(pairKey)) {
					ctx.addIssue({
						code: "custom",
						message: `gap match validation: duplicate correct pair '${pairKey}'`,
						path: ["responseDeclarations"]
					})
				}
				seenPairs.add(pairKey)
				usageBySource.set(
					pair.source,
					(usageBySource.get(pair.source) ?? 0) + 1
				)
			}

			for (const [source, usageCount] of usageBySource) {
				const gapText = interaction.gapTexts.find(
					(gapText) => gapText.identifier === source
				)
				const matchMax = gapText?.matchMax ?? 1
				if (matchMax !== 0 && usageCount > matchMax) {
					ctx.addIssue({
						code: "custom",
						message: `gap match validation: source '${source}' used ${usageCount} times, exceeds matchMax ${matchMax}`,
						path: ["responseDeclarations"]
					})
				}
			}

			if (declaration.cardinality !== "multiple") {
				ctx.addIssue({
					code: "custom",
					message: `gap match validation: cardinality must be 'multiple', not '${declaration.cardinality}'`,
					path: ["responseDeclarations"]
				})
			}
		}
	}

	const validateGapPlacement = (
		data: AssessmentItem<E, FeedbackPlan>,
		ctx: z.RefinementCtx
	) => {
		// biome-ignore lint: any needed for recursive traversal
		const checkForGaps = (nodes: any, contextPath: string[]): void => {
			if (!nodes || !Array.isArray(nodes)) return
			for (const node of nodes) {
				if (!node) continue
				if (node.type === "gap") {
					ctx.addIssue({
						code: "custom",
						message:
							"gap placeholders are only allowed inside gapMatchInteraction content",
						path: contextPath
					})
				} else if (node.type === "paragraph") {
					checkForGaps(node.content, contextPath)
				} else if (
					node.type === "unorderedList" ||
					node.type === "orderedList"
				) {
					if (Array.isArray(node.items)) {
						for (const item of node.items) checkForGaps(item, contextPath)
					}
				} else if (node.type === "tableRich") {
					const scanRows = (rows: unknown) => {
						if (!rows || !Array.isArray(rows)) return
						for (const row of rows) {
							if (!Array.isArray(row)) continue
							for (const cell of row) checkForGaps(cell, contextPath)
						}
					}
					scanRows(node.header)
					scanRows(node.rows)
				}
			}
		}

		if (data.body) {
			checkForGaps(data.body, ["body"])
		}
	}

	const AssessmentItemSchema = AssessmentItemSchemaBase.transform(
		(data, ctx): AssessmentItem<E, FeedbackPlan> => {
			validateGapMatchConstraints(data, ctx)
			validateGapPlacement(data, ctx)
			return data
		}
	).describe(
		"A complete QTI 3.0 assessment item with content, interactions, and scoring rules."
	)

	const AssessmentItemShellSchema =
		createAssessmentItemShellSchema(widgetTypeKeys)

	return {
		AssessmentItemSchema,
		AnyInteractionSchema,
		AssessmentItemShellSchema
	}
}
