import type { BlockContent, InlineContent } from "@/core/content/types"
import type {
	FeedbackCombinationKeyspace,
	FeedbackPlanAny
} from "@/core/feedback/plan/types"

type PreambleInlineContent = InlineContent<readonly []>

export type FeedbackPreamble = {
	correctness: "correct" | "incorrect"
	summary: PreambleInlineContent
}

export type StepBlock<E extends readonly string[]> = {
	type: "step"
	title: InlineContent<E>
	content: BlockContent<E>
}

export type SolutionBlock<E extends readonly string[]> = {
	type: "solution"
	content: InlineContent<E>
}

export type FeedbackSharedPedagogy<E extends readonly string[]> = {
	steps: StepBlock<E>[]
	solution: SolutionBlock<E>
}

export type FeedbackPreambleMap<P extends FeedbackPlanAny> = Record<
	FeedbackCombinationKeyspace<P>,
	FeedbackPreamble
>

export type FeedbackBundle<
	P extends FeedbackPlanAny,
	E extends readonly string[]
> = {
	shared: FeedbackSharedPedagogy<E>
	preambles: FeedbackPreambleMap<P>
}

export type FeedbackContent<E extends readonly string[]> = {
	preamble: FeedbackPreamble
	steps: StepBlock<E>[]
	solution: SolutionBlock<E>
}
