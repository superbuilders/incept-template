import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import { createFeedbackContentSchema } from "@/core/content/contextual-schemas"
import type { FeedbackContent } from "@/core/content/types"
import type {
	AuthoringFeedbackFallback,
	AuthoringFeedbackOverall,
	AuthoringNestedLeaf,
	AuthoringNestedNode
} from "@/core/feedback/authoring/types"
import { buildFeedbackPlanFromInteractions } from "@/core/feedback/plan/builder"
import { isComboPlan, isFallbackPlan } from "@/core/feedback/plan/guards"
import type {
	ComboPlan,
	FallbackPlan,
	FeedbackPlan
} from "@/core/feedback/plan/types"
import type { AnyInteraction } from "@/core/interactions/types"
import type { ResponseDeclaration } from "@/core/item/types"

// --- Error Constants ---

export const ErrFeedbackMissingOverall = errors.new(
	"feedback must contain FEEDBACK__OVERALL"
)
export const ErrFeedbackOverallNotObject = errors.new(
	"FEEDBACK__OVERALL must be an object"
)
export const ErrFeedbackLeafAtRoot = errors.new(
	"feedback leaf node cannot be at the root"
)
export const ErrFeedbackInvalidNode = errors.new(
	"feedback tree contains non-object node"
)
export const ErrFeedbackNoCombinationForPath = errors.new(
	"no combination found for path"
)
export const ErrFeedbackExtraKeys = errors.new("feedback contains extra keys")
export const ErrFeedbackMissingLeaves = errors.new(
	"feedback is missing required leaves"
)
export const ErrFeedbackSchemaValidation = errors.new(
	"feedback schema validation"
)

function createLeafNodeSchema<const E extends readonly string[]>(
	widgetTypeKeys: E
): z.ZodType<AuthoringNestedLeaf<E>> {
	const FeedbackContentSchema: z.ZodType<FeedbackContent<E>> =
		createFeedbackContentSchema(widgetTypeKeys)
	return z.object({ content: FeedbackContentSchema }).strict()
}

export function createFallbackFeedbackObjectSchema<
	const E extends readonly string[]
>(
	widgetTypeKeys: E
): z.ZodType<{ FEEDBACK__OVERALL: AuthoringFeedbackFallback<E> }> {
	const LeafNodeSchema = createLeafNodeSchema(widgetTypeKeys)
	const OverallSchema = z
		.object({
			CORRECT: LeafNodeSchema,
			INCORRECT: LeafNodeSchema
		})
		.strict()
	return z.object({ FEEDBACK__OVERALL: OverallSchema }).strict()
}

export function createComboFeedbackObjectSchema<
	P extends ComboPlan,
	const E extends readonly string[]
>(
	feedbackPlan: P,
	widgetTypeKeys: E
): z.ZodType<{ FEEDBACK__OVERALL: AuthoringNestedNode<P, E> }> {
	if (feedbackPlan.dimensions.length === 0) {
		logger.error("combo feedback plan has no dimensions", {
			dimensionCount: 0
		})
		throw errors.new("combo feedback plan has no dimensions")
	}

	const LeafNodeSchema = createLeafNodeSchema(widgetTypeKeys)

	const buildNestedSchema = (
		index: number
	): z.ZodType<AuthoringNestedNode<P, E>> => {
		const dimension = feedbackPlan.dimensions[index]
		if (!dimension) {
			logger.error("undefined dimension in feedback plan", {
				index,
				dimensionCount: feedbackPlan.dimensions.length
			})
			throw errors.new("undefined dimension in feedback plan")
		}

		const keys =
			dimension.kind === "enumerated"
				? dimension.keys
				: ["CORRECT", "INCORRECT"]
		const isLast = index === feedbackPlan.dimensions.length - 1

		if (isLast) {
			const innerLeafShape: Record<
				string,
				z.ZodType<AuthoringNestedLeaf<E>>
			> = {}
			for (const key of keys) {
				innerLeafShape[key] = LeafNodeSchema
			}
			const innerLeaves = z.object(innerLeafShape).strict()
			return z
				.object({
					[dimension.responseIdentifier]: innerLeaves
				})
				.strict()
		}

		const childSchema = buildNestedSchema(index + 1)
		const innerBranchShape: Record<
			string,
			z.ZodType<AuthoringNestedNode<P, E>>
		> = {}
		for (const key of keys) {
			innerBranchShape[key] = childSchema
		}
		const innerBranches = z.object(innerBranchShape).strict()
		return z
			.object({
				[dimension.responseIdentifier]: innerBranches
			})
			.strict()
	}

	const overallComboSchema = buildNestedSchema(0)
	return z.object({ FEEDBACK__OVERALL: overallComboSchema }).strict()
}

function buildEmptyComboOverall<
	P extends ComboPlan,
	const E extends readonly string[]
>(feedbackPlan: P): AuthoringNestedNode<P, E> {
	const buildNode = (
		dims: readonly P["dimensions"][number][]
	): AuthoringNestedNode<P, E> => {
		if (dims.length === 0) {
			logger.error("no dimensions to build nested node")
			throw errors.new("no dimensions to build nested node")
		}

		const [currentDim, ...restDims] = dims
		if (!currentDim) {
			logger.error("undefined dimension while building nested node", {
				dimensionCount: feedbackPlan.dimensions.length
			})
			throw errors.new("undefined dimension while building nested node")
		}

		const keys =
			currentDim.kind === "enumerated"
				? currentDim.keys
				: ["CORRECT", "INCORRECT"]

		const branch: Record<
			string,
			AuthoringNestedLeaf<E> | AuthoringNestedNode<P, E>
		> = {}

		for (const key of keys) {
			if (restDims.length === 0) {
				branch[key] = {
					content: {
						preamble: { correctness: "incorrect", summary: [] },
						steps: [],
						solution: { type: "solution", content: [] }
					}
				}
				continue
			}
			branch[key] = buildNode(restDims)
		}

		return { [currentDim.responseIdentifier]: branch }
	}

	return buildNode(feedbackPlan.dimensions)
}

// --- Validation and Conversion ---

export function createFeedbackObjectSchema<const E extends readonly string[]>(
	feedbackPlan: FallbackPlan | ComboPlan,
	widgetTypeKeys: E
) {
	if (isFallbackPlan(feedbackPlan)) {
		return createFallbackFeedbackObjectSchema(widgetTypeKeys)
	}
	if (isComboPlan(feedbackPlan)) {
		return createComboFeedbackObjectSchema(feedbackPlan, widgetTypeKeys)
	}
	logger.error("unsupported feedback plan mode")
	throw errors.new("unsupported feedback plan mode")
}

export function validateFallbackFeedbackObject<
	const E extends readonly string[]
>(
	feedbackObject: unknown,
	_feedbackPlan: FallbackPlan,
	widgetTypeKeys: E
): { FEEDBACK__OVERALL: AuthoringFeedbackFallback<E> } {
	const schema = createFallbackFeedbackObjectSchema(widgetTypeKeys)
	const result = schema.safeParse(feedbackObject)

	if (!result.success) {
		logger.error("feedback object validation", { error: result.error })
		throw errors.wrap(result.error, "feedback object validation")
	}

	return result.data
}

export function validateComboFeedbackObject<
	P extends ComboPlan,
	const E extends readonly string[]
>(
	feedbackObject: unknown,
	feedbackPlan: P,
	widgetTypeKeys: E
): { FEEDBACK__OVERALL: AuthoringNestedNode<P, E> } {
	const schema = createComboFeedbackObjectSchema(feedbackPlan, widgetTypeKeys)
	const result = schema.safeParse(feedbackObject)

	if (!result.success) {
		logger.error("feedback object validation", { error: result.error })
		throw errors.wrap(result.error, "feedback object validation")
	}

	return result.data
}

export function convertFeedbackObjectToBlocks<
	P extends FeedbackPlan,
	E extends readonly string[]
>(
	feedbackObject: {
		FEEDBACK__OVERALL: AuthoringFeedbackOverall<FeedbackPlan, E>
	},
	feedbackPlan: P
): Record<string, FeedbackContent<E>> {
	const blocks: Record<string, FeedbackContent<E>> = {}
	const overallFeedback = feedbackObject.FEEDBACK__OVERALL

	if (!overallFeedback || typeof overallFeedback !== "object") {
		logger.error("FEEDBACK__OVERALL is not an object during conversion", {
			overallFeedback
		})
		throw ErrFeedbackOverallNotObject
	}

	type FallbackOverall = AuthoringFeedbackFallback<E>
	const isLeaf = (node: unknown): node is AuthoringNestedLeaf<E> => {
		if (typeof node !== "object" || node === null) return false
		return Object.hasOwn(node, "content")
	}
	const isFallbackOverall = (node: unknown): node is FallbackOverall => {
		if (typeof node !== "object" || node === null) return false
		const c = Reflect.get(node, "CORRECT")
		const i = Reflect.get(node, "INCORRECT")
		return isLeaf(c) && isLeaf(i)
	}
	const isNestedNode = (
		node: AuthoringFeedbackOverall<FeedbackPlan, E>
	): node is AuthoringNestedNode<FeedbackPlan, E> => {
		return !("CORRECT" in node && "INCORRECT" in node)
	}

	if (feedbackPlan.mode === "fallback") {
		if (!isFallbackOverall(overallFeedback)) {
			logger.error("invalid overall feedback shape for fallback", {
				overallFeedback
			})
			throw errors.new("invalid overall fallback feedback shape")
		}
		blocks.CORRECT = overallFeedback.CORRECT.content
		blocks.INCORRECT = overallFeedback.INCORRECT.content
		return blocks
	}

	const walk = (
		node: AuthoringNestedNode<FeedbackPlan, E> | AuthoringNestedLeaf<E>,
		path: Array<{ responseIdentifier: string; key: string }>
	): void => {
		if (isLeaf(node)) {
			if (path.length === 0) {
				logger.error("leaf node found at root of feedback object", { node })
				throw ErrFeedbackLeafAtRoot
			}
			const combination = feedbackPlan.combinations.find(
				(c: FeedbackPlan["combinations"][number]) =>
					c.path.length === path.length &&
					c.path.every(
						(
							seg: FeedbackPlan["combinations"][number]["path"][number],
							i: number
						) =>
							path[i] !== undefined &&
							seg.responseIdentifier === path[i].responseIdentifier &&
							seg.key === path[i].key
					)
			)
			if (!combination) {
				logger.error("no combination found for path", { pathSegments: path })
				throw ErrFeedbackNoCombinationForPath
			}
			blocks[combination.id] = node.content
			return
		}

		const branch = node
		for (const [responseIdentifier, keyed] of Object.entries(branch)) {
			if (typeof keyed !== "object" || keyed === null) {
				logger.error("invalid child node in feedback tree", {
					keyed,
					pathSegments: path
				})
				throw ErrFeedbackInvalidNode
			}
			for (const [subKey, subChild] of Object.entries(keyed)) {
				walk(subChild, [...path, { responseIdentifier, key: subKey }])
			}
		}
	}

	if (!isNestedNode(overallFeedback)) {
		logger.error("expected nested node in combo mode but got fallback shape")
		throw errors.new("expected nested node in combo mode")
	}
	walk(overallFeedback, [])

	const producedIds = new Set(Object.keys(blocks))
	const expectedIds = new Set(
		feedbackPlan.combinations.map(
			(c: FeedbackPlan["combinations"][number]) => c.id
		)
	)

	if (producedIds.size > expectedIds.size) {
		const extraKeys = [...producedIds].filter((id) => !expectedIds.has(id))
		logger.error("feedback contains extra keys", {
			dimensionCount: feedbackPlan.dimensions.length,
			combinationCount: feedbackPlan.combinations.length,
			extraKeys: extraKeys.slice(0, 5)
		})
		throw ErrFeedbackExtraKeys
	}

	if (producedIds.size < expectedIds.size) {
		const missingKeys = [...expectedIds].filter(
			(id: string) => !producedIds.has(id)
		)
		logger.error("feedback is missing required leaves", {
			dimensionCount: feedbackPlan.dimensions.length,
			combinationCount: feedbackPlan.combinations.length,
			missingKeys: missingKeys.slice(0, 5)
		})
		throw ErrFeedbackMissingLeaves
	}

	return blocks
}

export function buildEmptyNestedFeedback<
	const E extends readonly string[] = readonly string[]
>(
	feedbackPlan: FallbackPlan
): { FEEDBACK__OVERALL: AuthoringFeedbackFallback<E> }
export function buildEmptyNestedFeedback<
	P extends ComboPlan,
	const E extends readonly string[] = readonly string[]
>(feedbackPlan: P): { FEEDBACK__OVERALL: AuthoringNestedNode<P, E> }
export function buildEmptyNestedFeedback<
	const E extends readonly string[] = readonly string[]
>(feedbackPlan: FallbackPlan | ComboPlan) {
	if (isFallbackPlan(feedbackPlan)) {
		const fallbackOverall: AuthoringFeedbackFallback<E> = {
			CORRECT: {
				content: {
					preamble: { correctness: "correct", summary: [] },
					steps: [],
					solution: { type: "solution", content: [] }
				}
			},
			INCORRECT: {
				content: {
					preamble: { correctness: "incorrect", summary: [] },
					steps: [],
					solution: { type: "solution", content: [] }
				}
			}
		}

		return {
			FEEDBACK__OVERALL: fallbackOverall
		}
	}

	if (isComboPlan(feedbackPlan)) {
		const comboOverall = buildEmptyComboOverall(feedbackPlan)
		return {
			FEEDBACK__OVERALL: comboOverall
		}
	}

	logger.error("unsupported feedback plan mode")
	throw errors.new("unsupported feedback plan mode")
}

export function buildFeedbackFromNestedForTemplate<
	const E extends readonly string[]
>(
	interactions: Record<string, AnyInteraction<E>>,
	responseDeclarations: ResponseDeclaration[],
	feedbackObject: {
		FEEDBACK__OVERALL: AuthoringFeedbackOverall<FeedbackPlan, E>
	},
	widgetTypeKeys: E
): {
	feedbackPlan: FeedbackPlan
	feedbackBlocks: Record<string, FeedbackContent<E>>
} {
	const plan = buildFeedbackPlanFromInteractions(
		interactions,
		responseDeclarations
	)
	if (isFallbackPlan(plan)) {
		validateFallbackFeedbackObject(feedbackObject, plan, widgetTypeKeys)
	} else if (isComboPlan(plan)) {
		validateComboFeedbackObject(feedbackObject, plan, widgetTypeKeys)
	} else {
		logger.error("unsupported feedback plan mode")
		throw errors.new("unsupported feedback plan mode")
	}
	const blocks = convertFeedbackObjectToBlocks(feedbackObject, plan)

	return { feedbackPlan: plan, feedbackBlocks: blocks }
}
