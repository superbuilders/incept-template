import type { FeedbackContent } from "@/core/content/types"
import type { ComboPlan, FeedbackPlan } from "@/core/feedback/plan/types"

export type ResponseIdentifierLiteral<P extends FeedbackPlan> =
	P["dimensions"][number]["responseIdentifier"]

export type AuthoringNestedLeaf<
	E extends readonly string[] = readonly string[],
	ContentT = FeedbackContent<E>
> = {
	content: ContentT
}

export type AuthoringNestedNode<
	P extends FeedbackPlan,
	E extends readonly string[] = readonly string[],
	ContentT = FeedbackContent<E>
> = {
	[responseIdentifier: string]: {
		[key: string]:
			| AuthoringNestedLeaf<E, ContentT>
			| AuthoringNestedNode<P, E, ContentT>
	}
}

export type AuthoringFeedbackFallback<
	E extends readonly string[] = readonly string[],
	ContentT = FeedbackContent<E>
> = {
	CORRECT: AuthoringNestedLeaf<E, ContentT>
	INCORRECT: AuthoringNestedLeaf<E, ContentT>
}

export type AuthoringFeedbackOverall<
	P extends FeedbackPlan,
	E extends readonly string[] = readonly string[],
	ContentT = FeedbackContent<E>
> = P extends ComboPlan
	? AuthoringNestedNode<P, E, ContentT>
	: AuthoringFeedbackFallback<E, ContentT>

export type NestedFeedbackAuthoring<
	P extends FeedbackPlan,
	E extends readonly string[] = readonly string[],
	ContentT = FeedbackContent<E>
> = {
	feedback: {
		FEEDBACK__OVERALL: AuthoringFeedbackOverall<P, E, ContentT>
	}
}
