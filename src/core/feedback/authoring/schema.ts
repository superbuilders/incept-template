import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import { createFeedbackBundle } from "@/core/content/bundles"
import {
	createFeedbackPreambleSchema,
	createFeedbackSharedPedagogySchema
} from "@/core/content/contextual-schemas"
import type {
	FeedbackBundle,
	FeedbackPreamble,
	FeedbackPreambleMap,
	FeedbackSharedPedagogy
} from "@/core/content/types"
import type {
	AuthoringFeedbackOverall,
	NestedFeedbackAuthoring
} from "@/core/feedback/authoring/types"
import { buildFeedbackPlanFromInteractions } from "@/core/feedback/plan/builder"
import type {
	FeedbackCombinationId,
	FeedbackPlan
} from "@/core/feedback/plan/types"
import type { AnyInteraction } from "@/core/interactions/types"
import type { ResponseDeclaration } from "@/core/item/types"

function isCombinationId<P extends FeedbackPlan>(
	plan: P,
	id: string
): id is FeedbackCombinationId<P> {
	return plan.combinations.some((combo) => combo.id === id)
}

function requireCombinationId<P extends FeedbackPlan>(
	plan: P,
	id: string
): FeedbackCombinationId<P> {
	if (isCombinationId(plan, id)) {
		return id
	}
	logger.error("invalid feedback combination id encountered", { id })
	throw errors.new(`invalid feedback combination id '${id}'`)
}

export function createFeedbackObjectSchema<
	P extends FeedbackPlan,
	const E extends readonly string[]
>(
	feedbackPlan: P,
	widgetTypeKeys: E
): z.ZodType<AuthoringFeedbackOverall<P, E>> {
	const SharedSchema = createFeedbackSharedPedagogySchema(widgetTypeKeys)
	const PreambleSchema: z.ZodType<FeedbackPreamble> =
		createFeedbackPreambleSchema(widgetTypeKeys)

	const expectedIds = feedbackPlan.combinations.map((combo) => combo.id)
	const expectedSet = new Set(expectedIds)

	const PreamblesSchema: z.ZodType<FeedbackPreambleMap<P>> = z
		.record(z.string(), PreambleSchema)
		.superRefine((value, ctx) => {
			for (const key of Object.keys(value)) {
				if (!expectedSet.has(key)) {
					ctx.addIssue({
						code: "custom",
						message: `unexpected feedback preamble key '${key}'`,
						path: [key]
					})
				}
			}
			for (const expectedId of expectedIds) {
				if (!(expectedId in value)) {
					ctx.addIssue({
						code: "custom",
						message: `missing feedback preamble for '${expectedId}'`,
						path: [expectedId]
					})
				}
			}
		})
		.transform((value) => {
			const ordered: PartialFeedbackPreambleMap<P> = {}
			for (const expectedId of expectedIds) {
				const combinationId = requireCombinationId(feedbackPlan, expectedId)
				const preamble = value[combinationId]
				if (!preamble) {
					continue
				}
				ordered[combinationId] = preamble
			}
			assertPreambleMapComplete(feedbackPlan, ordered)
			return ordered
		})

	return z
		.object({
			shared: SharedSchema,
			preambles: PreamblesSchema
		})
		.strict()
}

export function validateFeedbackObject<
	P extends FeedbackPlan,
	const E extends readonly string[]
>(
	feedbackObject: unknown,
	feedbackPlan: P,
	widgetTypeKeys: E
): AuthoringFeedbackOverall<P, E> {
	const schema = createFeedbackObjectSchema(feedbackPlan, widgetTypeKeys)
	const result = schema.safeParse(feedbackObject)

	if (!result.success) {
		logger.error("feedback object validation", { error: result.error })
		throw errors.wrap(result.error, "feedback object validation")
	}

	return result.data
}

export function convertAuthoringFeedbackToBundle<
	P extends FeedbackPlan,
	E extends readonly string[]
>(
	feedback: AuthoringFeedbackOverall<P, E>,
	feedbackPlan: P
): FeedbackBundle<P, E> {
	return createFeedbackBundle(feedbackPlan, feedback.shared, feedback.preambles)
}

export function buildEmptyNestedFeedback<
	P extends FeedbackPlan,
	const E extends readonly string[] = readonly string[]
>(feedbackPlan: P): NestedFeedbackAuthoring<P, E> {
	const shared: FeedbackSharedPedagogy<E> = {
		steps: [],
		solution: { type: "solution", content: [] }
	}

	const defaultPreamble: FeedbackPreamble = {
		correctness: "incorrect",
		summary: []
	}

	const preambles: PartialFeedbackPreambleMap<P> = {}
	for (const combination of feedbackPlan.combinations) {
		const combinationId = requireCombinationId(feedbackPlan, combination.id)
		preambles[combinationId] = { ...defaultPreamble }
	}
	assertPreambleMapComplete(feedbackPlan, preambles)

	return {
		feedback: {
			shared,
			preambles
		}
	}
}

export function buildFeedbackFromNestedForTemplate<
	const E extends readonly string[]
>(
	interactions: Record<string, AnyInteraction<E>>,
	responseDeclarations: ResponseDeclaration[],
	feedbackObject: AuthoringFeedbackOverall<FeedbackPlan, E>,
	widgetTypeKeys: E
): {
	feedbackPlan: FeedbackPlan
	feedback: FeedbackBundle<FeedbackPlan, E>
} {
	const plan = buildFeedbackPlanFromInteractions(
		interactions,
		responseDeclarations
	)
	const validated = validateFeedbackObject(feedbackObject, plan, widgetTypeKeys)
	const bundle = convertAuthoringFeedbackToBundle(validated, plan)
	return { feedbackPlan: plan, feedback: bundle }
}

type PartialFeedbackPreambleMap<P extends FeedbackPlan> = {
	[K in FeedbackCombinationId<P>]?: FeedbackPreamble
}

function assertPreambleMapComplete<P extends FeedbackPlan>(
	plan: P,
	map: PartialFeedbackPreambleMap<P>
): asserts map is FeedbackPreambleMap<P> {
	for (const combination of plan.combinations) {
		const combinationId = requireCombinationId(plan, combination.id)
		if (!Object.hasOwn(map, combinationId)) {
			logger.error("missing feedback preamble entry", { combinationId })
			throw errors.new(`missing feedback preamble for '${combinationId}'`)
		}
		const preamble = map[combinationId]
		if (!preamble) {
			logger.error("empty feedback preamble entry", { combinationId })
			throw errors.new(`empty feedback preamble for '${combinationId}'`)
		}
	}
}
