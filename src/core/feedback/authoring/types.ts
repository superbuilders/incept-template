import type { FeedbackBundle } from "@/core/content/types"
import type { FeedbackPlanAny } from "@/core/feedback/plan/types"

export type AuthoringFeedbackOverall<
	P extends FeedbackPlanAny,
	E extends readonly string[]
> = FeedbackBundle<P, E>

export type NestedFeedbackAuthoring<
	P extends FeedbackPlanAny,
	E extends readonly string[]
> = {
	feedback: AuthoringFeedbackOverall<P, E>
}

export type NestedFeedbackBundle<
	P extends FeedbackPlanAny,
	E extends readonly string[]
> = {
	feedback: FeedbackBundle<P, E>
}
