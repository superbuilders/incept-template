import type {
	ComboPlan,
	FallbackPlan,
	FeedbackPlan
} from "@/core/feedback/plan/types"

export function isFallbackPlan(plan: FeedbackPlan): plan is FallbackPlan {
	return plan.mode === "fallback"
}

export function isComboPlan(plan: FeedbackPlan): plan is ComboPlan {
	return plan.mode === "combo"
}
