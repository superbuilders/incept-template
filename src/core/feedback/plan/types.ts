import type { z } from "zod"
import type { FeedbackPlanSchema } from "@/core/feedback/plan/schema"

export type EnumeratedFeedbackDimension<
	Identifier extends string,
	Keys extends readonly string[]
> = {
	responseIdentifier: Identifier
	kind: "enumerated"
	keys: Keys
}

export type BinaryFeedbackDimension<Identifier extends string> = {
	responseIdentifier: Identifier
	kind: "binary"
}

export type FeedbackDimension =
	| EnumeratedFeedbackDimension<string, readonly string[]>
	| BinaryFeedbackDimension<string>

export type FeedbackPathSegment<
	Identifier extends string,
	Key extends string
> = {
	responseIdentifier: Identifier
	key: Key
}

export type FeedbackCombination<
	Id extends string,
	Path extends readonly FeedbackPathSegment<string, string>[]
> = {
	id: Id
	path: Path
}

export type FeedbackPlan = {
	dimensions: readonly FeedbackDimension[]
	combinations: readonly FeedbackCombination<
		string,
		readonly FeedbackPathSegment<string, string>[]
	>[]
}

export type StaticFeedbackPlan<
	Dimensions extends readonly FeedbackDimension[],
	Combinations extends readonly FeedbackCombination<
		string,
		readonly FeedbackPathSegment<string, string>[]
	>[]
> = {
	dimensions: Dimensions
	combinations: Combinations
}

export type FeedbackCombinationId<P> = P extends {
	combinations: readonly (infer Combination)[]
}
	? Combination extends { id: infer Id }
		? Id extends string
			? Id
			: string
		: string
	: string

export type FeedbackCombinationKeyspace<P> =
	| FeedbackCombinationId<P>
	| (string extends FeedbackCombinationId<P> ? string : never)

export type StaticCombinationIds<P> = string extends FeedbackCombinationId<P>
	? never
	: FeedbackCombinationId<P>

export type RuntimeFeedbackPlan = z.infer<typeof FeedbackPlanSchema>
