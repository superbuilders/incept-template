import type {
	CombinationIdentifierFor,
	ResponseIdentifierFor
} from "@/core/identifiers/types"

type CorrectnessKey = "CORRECT" | "INCORRECT"

export type EnumeratedFeedbackDimension<
	Identifier extends string,
	Keys extends readonly string[]
> = {
	responseIdentifier: ResponseIdentifierFor<Identifier>
	kind: "enumerated"
	keys: Keys
}

export type BinaryFeedbackDimension<Identifier extends string> = {
	responseIdentifier: ResponseIdentifierFor<Identifier>
	kind: "binary"
}

export type FeedbackDimension =
	| EnumeratedFeedbackDimension<string, readonly string[]>
	| BinaryFeedbackDimension<string>

export type FeedbackPathSegment<
	Identifier extends string,
	Key extends string
> = {
	responseIdentifier: ResponseIdentifierFor<Identifier>
	key: Key
}

type SegmentForDimension<D extends FeedbackDimension> =
	D extends EnumeratedFeedbackDimension<infer Identifier, infer Keys>
		? FeedbackPathSegment<Identifier, Keys[number]>
		: D extends BinaryFeedbackDimension<infer Identifier>
			? FeedbackPathSegment<Identifier, CorrectnessKey>
			: FeedbackPathSegment<string, string>

type IsTuple<T extends readonly unknown[]> = number extends T["length"]
	? false
	: true

type PathSegmentsForDimensions<
	Dimensions extends readonly FeedbackDimension[]
> = IsTuple<Dimensions> extends true
	? Dimensions extends readonly [infer Head, ...infer Tail]
		? Head extends FeedbackDimension
			? Tail extends readonly FeedbackDimension[]
				? readonly [
						SegmentForDimension<Head>,
						...PathSegmentsForDimensions<Tail>
					]
				: never
			: never
		: readonly []
	: readonly FeedbackPathSegment<string, string>[]

export type FeedbackCombination<
	Id extends string,
	Dimensions extends readonly FeedbackDimension[]
> = {
	readonly id: CombinationIdentifierFor<Id>
	readonly path: PathSegmentsForDimensions<Dimensions> &
		readonly FeedbackPathSegment<string, string>[]
}

export interface FeedbackPlan<
	Dimensions extends
		readonly FeedbackDimension[] = readonly FeedbackDimension[],
	Combinations extends readonly FeedbackCombination<
		any,
		Dimensions
	>[] = readonly FeedbackCombination<string, Dimensions>[]
> {
	readonly dimensions: Dimensions
	readonly combinations: Combinations
}

export type StaticFeedbackPlan<
	Dimensions extends readonly FeedbackDimension[],
	Combinations extends readonly FeedbackCombination<any, Dimensions>[]
> = FeedbackPlan<Dimensions, Combinations> & FeedbackPlanAny

export type FeedbackPlanAny = {
	readonly dimensions: readonly FeedbackDimension[]
	readonly combinations: ReadonlyArray<{
		readonly id: string
		readonly path: ReadonlyArray<FeedbackPathSegment<string, string>>
	}>
}

export type FeedbackCombinationId<P extends FeedbackPlanAny> =
	P["combinations"][number]["id"]

export type FeedbackCombinationKeyspace<P extends FeedbackPlanAny> =
	FeedbackCombinationId<P>
