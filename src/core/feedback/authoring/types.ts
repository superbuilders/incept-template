import type {
	FeedbackBundle,
	FeedbackPreambleMap,
	FeedbackSharedPedagogy
} from "@/core/content/types"
export type AuthoringFeedbackOverall<
	E extends readonly string[] = readonly string[]
> = {
	shared: FeedbackSharedPedagogy<E>
	preambles: FeedbackPreambleMap<E>
}

export type NestedFeedbackAuthoring<
	E extends readonly string[] = readonly string[]
> = {
	feedback: AuthoringFeedbackOverall<E>
}

export type NestedFeedbackBundle<
	E extends readonly string[] = readonly string[]
> = {
	feedback: FeedbackBundle<E>
}
