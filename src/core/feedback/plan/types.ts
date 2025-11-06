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
	Id extends string = string,
	Path extends readonly FeedbackPathSegment[] = readonly FeedbackPathSegment[]
> = {
	id: Id
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

export type FeedbackCombinationId<P extends FeedbackPlan> =
	P["combinations"][number]["id"]

type WidenedCombinationId<P extends FeedbackPlan> =
	FeedbackCombinationId<P> extends never ? string : FeedbackCombinationId<P>

export type FeedbackCombinationKeyspace<P extends FeedbackPlan> =
	| WidenedCombinationId<P>
	| (string extends FeedbackCombinationId<P> ? string : never)

export type StaticCombinationIds<P extends FeedbackPlan> =
	string extends FeedbackCombinationId<P> ? never : FeedbackCombinationId<P>

export type RuntimeFeedbackPlan = z.infer<typeof FeedbackPlanSchema>
