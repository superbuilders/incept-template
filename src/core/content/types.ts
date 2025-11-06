export type InlineContentItem<E extends readonly string[] = readonly string[]> =
	| { type: "text"; content: string }
	| { type: "math"; mathml: string }
	| { type: "inlineWidgetRef"; widgetId: string; widgetType: E[number] }
	| { type: "inlineInteractionRef"; interactionId: string }
	| {
			type: "gap"
			gapId: string
	  }

export type InlineContent<E extends readonly string[] = readonly string[]> =
	Array<InlineContentItem<E>>

export type BlockQuoteBlockItem<
	E extends readonly string[] = readonly string[]
> = {
	type: "blockquote"
	content: InlineContent<E>
}

export type BlockContentItem<E extends readonly string[] = readonly string[]> =
	| { type: "paragraph"; content: InlineContent<E> }
	| { type: "unorderedList"; items: InlineContent<E>[] }
	| { type: "orderedList"; items: InlineContent<E>[] }
	| {
			type: "tableRich"
			header: (InlineContent<E> | null)[][] | null
			rows: (InlineContent<E> | null)[][]
	  }
	| BlockQuoteBlockItem<E>
	| { type: "widgetRef"; widgetId: string; widgetType: E[number] }
	| { type: "interactionRef"; interactionId: string }

export type BlockContent<E extends readonly string[] = readonly string[]> =
	Array<BlockContentItem<E>>

export type FeedbackPreamble<E extends readonly string[] = readonly string[]> =
	{
		correctness: "correct" | "incorrect"
		summary: InlineContent<E>
	}

export type StepBlock<E extends readonly string[] = readonly string[]> = {
	type: "step"
	title: InlineContent<E>
	content: BlockContent<E>
}

export type SolutionBlock<E extends readonly string[] = readonly string[]> = {
	type: "solution"
	content: InlineContent<E>
}

export type FeedbackSharedPedagogy<
	E extends readonly string[] = readonly string[]
> = {
	steps: StepBlock<E>[]
	solution: SolutionBlock<E>
}

import type { FeedbackPlan } from "@/core/feedback/plan/types"

export type FeedbackCombinationId<P extends FeedbackPlan> =
	P["combinations"][number]["id"]

export type FeedbackPreambleMap<
	E extends readonly string[] = readonly string[]
> = Record<string, FeedbackPreamble<E>>

export type FeedbackBundle<E extends readonly string[] = readonly string[]> = {
	shared: FeedbackSharedPedagogy<E>
	preambles: FeedbackPreambleMap<E>
}

export type FeedbackContent<E extends readonly string[] = readonly string[]> = {
	preamble: FeedbackPreamble<E>
	steps: StepBlock<E>[]
	solution: SolutionBlock<E>
}
