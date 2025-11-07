import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type {
	FeedbackBundle,
	FeedbackContent,
	FeedbackPreamble,
	FeedbackPreambleMap,
	FeedbackSharedPedagogy
} from "@/core/content/types"
import type {
	FeedbackCombinationId,
	FeedbackPlan
} from "@/core/feedback/plan/types"

export function createFeedbackBundle<
	P extends FeedbackPlan,
	E extends readonly string[]
>(
	plan: P,
	shared: FeedbackSharedPedagogy<E>,
	preambles: FeedbackBundle<P, E>["preambles"]
): FeedbackBundle<P, E> {
	const expectedIds = plan.combinations.map((combo) => combo.id)
	const expectedSet = new Set(expectedIds)
	const providedKeys = Object.keys(preambles)

	const extra = providedKeys.filter((key) => !expectedSet.has(key))
	if (extra.length > 0) {
		logger.error("invalid feedback preamble map", {
			expectedCount: expectedSet.size,
			providedCount: providedKeys.length,
			extra: extra.slice(0, 5)
		})
		throw errors.new("unexpected feedback preamble entries")
	}

	const normalized: PartialFeedbackPreambleMap<P> = {}
	for (const combination of plan.combinations) {
		const combinationId: FeedbackCombinationId<P> = combination.id
		const preamble = preambles[combinationId]
		if (!preamble) {
			logger.error("missing preamble during bundle normalization", {
				combinationId
			})
			throw errors.new(
				`missing preamble during bundle normalization for '${combinationId}'`
			)
		}
		normalized[combinationId] = preamble
	}

	assertPreambleMapComplete(plan, normalized)

	return {
		shared,
		preambles: normalized
	}
}

export function expandFeedbackBundle<
	P extends FeedbackPlan,
	E extends readonly string[]
>(
	plan: P,
	bundle: FeedbackBundle<P, E>
): Record<FeedbackCombinationId<P>, FeedbackContent<E>> {
	const contentMap: PartialFeedbackContentMap<P, E> = {}

	for (const combination of plan.combinations) {
		const combinationId: FeedbackCombinationId<P> = combination.id
		const preamble = bundle.preambles[combinationId]
		if (!preamble) {
			logger.error("missing preamble while expanding bundle", {
				combinationId
			})
			throw errors.new(`missing preamble for combination '${combinationId}'`)
		}
		contentMap[combinationId] = {
			preamble,
			steps: bundle.shared.steps,
			solution: bundle.shared.solution
		}
	}

	assertContentMapComplete(plan, contentMap)
	return contentMap
}

type PartialFeedbackPreambleMap<P extends FeedbackPlan> = {
	[K in FeedbackCombinationId<P>]?: FeedbackPreamble
}

function assertPreambleMapComplete<P extends FeedbackPlan>(
	plan: P,
	map: PartialFeedbackPreambleMap<P>
): asserts map is FeedbackPreambleMap<P> {
	for (const combination of plan.combinations) {
		const combinationId: FeedbackCombinationId<P> = combination.id
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

type PartialFeedbackContentMap<
	P extends FeedbackPlan,
	E extends readonly string[]
> = {
	[K in FeedbackCombinationId<P>]?: FeedbackContent<E>
}

function assertContentMapComplete<
	P extends FeedbackPlan,
	E extends readonly string[]
>(
	plan: P,
	map: PartialFeedbackContentMap<P, E>
): asserts map is Record<FeedbackCombinationId<P>, FeedbackContent<E>> {
	for (const combination of plan.combinations) {
		const combinationId: FeedbackCombinationId<P> = combination.id
		if (!Object.hasOwn(map, combinationId)) {
			logger.error("missing expanded feedback content", { combinationId })
			throw errors.new(
				`missing expanded feedback content for '${combinationId}'`
			)
		}
		const value = map[combinationId]
		if (!value) {
			logger.error("undefined expanded feedback content", { combinationId })
			throw errors.new(
				`undefined expanded feedback content for '${combinationId}'`
			)
		}
	}
}
