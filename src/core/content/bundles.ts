import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type {
	FeedbackBundle,
	FeedbackCombinationId,
	FeedbackContent,
	FeedbackPreamble,
	FeedbackSharedPedagogy
} from "@/core/content/types"
import type { FeedbackPlan } from "@/core/feedback/plan/types"

function isCombinationId<P extends FeedbackPlan>(
	plan: P,
	id: string
): id is FeedbackCombinationId<P> {
	return plan.combinations.some((combo) => combo.id === id)
}

export function createFeedbackBundle<
	P extends FeedbackPlan,
	E extends readonly string[],
	Map extends Record<string, FeedbackPreamble<E>>
>(
	plan: P,
	shared: FeedbackSharedPedagogy<E>,
	preambles: Map
): FeedbackBundle<E> {
	const keyedPreambles: Partial<
		Record<FeedbackCombinationId<P>, FeedbackPreamble<E>>
	> = preambles
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

	const preambleEntries = new Map<
		FeedbackCombinationId<P>,
		FeedbackPreamble<E>
	>()

	for (const combination of plan.combinations) {
		const combinationId = combination.id
		if (!isCombinationId(plan, combinationId)) {
			continue
		}
		const preamble = keyedPreambles[combinationId]
		if (!preamble) {
			logger.error("missing preamble during bundle normalization", {
				combinationId
			})
			throw errors.new(
				`missing preamble during bundle normalization for '${combinationId}'`
			)
		}
		preambleEntries.set(combinationId, preamble)
	}

	const normalized: Record<string, FeedbackPreamble<E>> = {}
	for (const [id, preamble] of preambleEntries.entries()) {
		normalized[id] = preamble
	}

	return {
		shared,
		preambles: normalized
	}
}

export function expandFeedbackBundle<
	P extends FeedbackPlan,
	E extends readonly string[]
>(plan: P, bundle: FeedbackBundle<E>): Record<string, FeedbackContent<E>> {
	const contents = new Map<FeedbackCombinationId<P>, FeedbackContent<E>>()

	for (const combination of plan.combinations) {
		const combinationId = combination.id
		if (!isCombinationId(plan, combinationId)) {
			continue
		}
		const preamble = bundle.preambles[combinationId]
		if (!preamble) {
			logger.error("missing preamble while expanding bundle", {
				combinationId
			})
			throw errors.new(`missing preamble for combination '${combinationId}'`)
		}
		contents.set(combinationId, {
			preamble,
			steps: bundle.shared.steps,
			solution: bundle.shared.solution
		})
	}

	const expanded: Record<string, FeedbackContent<E>> = {}
	for (const [id, content] of contents.entries()) {
		expanded[id] = content
	}

	return expanded
}
