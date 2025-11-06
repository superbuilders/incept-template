import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type {
	FeedbackBundle,
	FeedbackContent,
	FeedbackSharedPedagogy
} from "@/core/content/types"
import type {
	FeedbackCombinationId,
	FeedbackPlan
} from "@/core/feedback/plan/types"

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

export function createFeedbackBundle<
	P extends FeedbackPlan,
	E extends readonly string[]
>(
	plan: P,
	shared: FeedbackSharedPedagogy<E>,
	preambles: FeedbackBundle<P, E>["preambles"]
): FeedbackBundle<P, E> {
	const keyedPreambles: FeedbackBundle<P, E>["preambles"] = preambles
	const expectedIds = new Set<string>(
		plan.combinations.map((combo) => combo.id)
	)
	const providedIds = new Set<string>(Object.keys(keyedPreambles))

	const missing = [...expectedIds].filter((id) => !providedIds.has(id))
	const extra = [...providedIds].filter((id) => !expectedIds.has(id))

	if (missing.length > 0 || extra.length > 0) {
		logger.error("invalid feedback preamble map", {
			expectedCount: expectedIds.size,
			providedCount: providedIds.size,
			missing: missing.slice(0, 5),
			extra: extra.slice(0, 5)
		})
		throw errors.new("invalid feedback preamble map")
	}

	for (const combination of plan.combinations) {
		const combinationId = requireCombinationId(plan, combination.id)
		const preamble = keyedPreambles[combinationId]
		if (!preamble) {
			logger.error("missing preamble during bundle normalization", {
				combinationId
			})
			throw errors.new(
				`missing preamble during bundle normalization for '${combinationId}'`
			)
		}
	}

	return {
		shared,
		preambles
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
		const combinationId = requireCombinationId(plan, combination.id)
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
		const combinationId = requireCombinationId(plan, combination.id)
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
