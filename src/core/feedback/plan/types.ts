import type { z } from "zod"
import type { FeedbackPlanSchema } from "@/core/feedback/plan/schema"

export type EnumeratedFeedbackDimension<
	Identifier extends string = string,
	Keys extends readonly string[] = readonly string[]
> = {
	responseIdentifier: Identifier
	kind: "enumerated"
	keys: Keys
}

export type BinaryFeedbackDimension<Identifier extends string = string> = {
	responseIdentifier: Identifier
	kind: "binary"
}

export type FeedbackDimension =
	| EnumeratedFeedbackDimension<string, readonly string[]>
	| BinaryFeedbackDimension<string>

export type FeedbackPathSegment<
	Identifier extends string = string,
	Key extends string = string
> = {
	responseIdentifier: Identifier
	key: Key
}

export type FeedbackCombination<
	Path extends readonly FeedbackPathSegment[] = readonly FeedbackPathSegment[]
> = {
	id: string
	path: Path
}

export type FeedbackPlan<
	Dimensions extends
		readonly FeedbackDimension[] = readonly FeedbackDimension[],
	Combinations extends
		readonly FeedbackCombination[] = readonly FeedbackCombination[]
> = {
	dimensions: Dimensions
	combinations: Combinations
}

export type RuntimeFeedbackPlan = z.infer<typeof FeedbackPlanSchema>
