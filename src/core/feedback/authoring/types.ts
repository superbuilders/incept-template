import type { FeedbackBundle } from "@/core/content/types"
import type { FeedbackPlan } from "@/core/feedback/plan/types"

export type AuthoringFeedbackOverall<
	P extends FeedbackPlan,
	E extends readonly string[]
> = FeedbackBundle<P, E>

export type NestedFeedbackAuthoring<
	P extends FeedbackPlan,
	E extends readonly string[]
> = {
	feedback: AuthoringFeedbackOverall<P, E>
}

export type NestedFeedbackBundle<
	P extends FeedbackPlan,
	E extends readonly string[]
> = {
	feedback: FeedbackBundle<P, E>
}
