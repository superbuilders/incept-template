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
	FeedbackPlanAny
} from "@/core/feedback/plan/types"
import type { AnyInteraction } from "@/core/interactions/types"
import type { ResponseDeclaration } from "@/core/item/types"

const combinationIdOf = <Plan extends FeedbackPlanAny>(
	combination: Plan["combinations"][number]
): FeedbackCombinationId<Plan> => combination.id

export function createFeedbackObjectSchema<
	P extends FeedbackPlanAny,
	const E extends readonly string[]
>(
	feedbackPlan: P,
	widgetTypeKeys: E
): z.ZodType<AuthoringFeedbackOverall<P, E>> {
	const SharedSchema = createFeedbackSharedPedagogySchema(widgetTypeKeys)
	const PreambleSchema: z.ZodType<FeedbackPreamble> =
		createFeedbackPreambleSchema(widgetTypeKeys)

	const combinationIds: FeedbackCombinationId<P>[] =
		feedbackPlan.combinations.map((combo) => combinationIdOf<P>(combo))

	const ensureNonEmptyTuple = <T>(items: T[]): [T, ...T[]] => {
		if (items.length === 0) {
			logger.error("feedback plan has no combinations", {
				dimensionCount: feedbackPlan.dimensions.length
			})
			throw errors.new("feedback plan must declare at least one combination")
		}
		const [first, ...rest] = items
		const tuple: [T, ...T[]] = [first, ...rest]
		return tuple
	}

	const CombinationEnum = z.enum(ensureNonEmptyTuple(combinationIds))

	const PreamblesSchema: z.ZodType<FeedbackPreambleMap<P>> = z.record(
		CombinationEnum,
		PreambleSchema
	)

	return z
		.object({
			shared: SharedSchema,
			preambles: PreamblesSchema
		})
		.strict()
}

export function validateFeedbackObject<
	P extends FeedbackPlanAny,
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
	P extends FeedbackPlanAny,
	E extends readonly string[]
>(
	feedback: AuthoringFeedbackOverall<P, E>,
	feedbackPlan: P
): FeedbackBundle<P, E> {
	return createFeedbackBundle(feedbackPlan, feedback.shared, feedback.preambles)
}

export function buildEmptyNestedFeedback<
	P extends FeedbackPlanAny,
	const E extends readonly string[]
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
		const combinationId = combinationIdOf<P>(combination)
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
	feedbackObject: AuthoringFeedbackOverall<FeedbackPlanAny, E>,
	widgetTypeKeys: E
): {
	feedbackPlan: FeedbackPlanAny
	feedback: FeedbackBundle<FeedbackPlanAny, E>
} {
	const plan = buildFeedbackPlanFromInteractions(
		interactions,
		responseDeclarations
	)
	const validated = validateFeedbackObject(feedbackObject, plan, widgetTypeKeys)
	const bundle = convertAuthoringFeedbackToBundle(validated, plan)
	return { feedbackPlan: plan, feedback: bundle }
}

type PartialFeedbackPreambleMap<P extends FeedbackPlanAny> = {
	[K in FeedbackCombinationId<P>]?: FeedbackPreamble
}

function assertPreambleMapComplete<P extends FeedbackPlanAny>(
	plan: P,
	map: PartialFeedbackPreambleMap<P>
): asserts map is FeedbackPreambleMap<P> {
	for (const combination of plan.combinations) {
		const combinationId = combinationIdOf<P>(combination)
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
