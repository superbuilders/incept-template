import type {
	FeedbackCombinationIdentifier,
	ResponseIdentifier
} from "@/core/identifiers"

type CorrectnessKey = "CORRECT" | "INCORRECT"

export type EnumeratedFeedbackDimension<
	Identifier extends ResponseIdentifier,
	Keys extends readonly string[]
> = {
	responseIdentifier: Identifier
	kind: "enumerated"
	keys: Keys
}

export type BinaryFeedbackDimension<Identifier extends ResponseIdentifier> = {
	responseIdentifier: Identifier
	kind: "binary"
}

export type FeedbackDimension =
	| EnumeratedFeedbackDimension<ResponseIdentifier, readonly string[]>
	| BinaryFeedbackDimension<ResponseIdentifier>

export type FeedbackPathSegment<
	Identifier extends ResponseIdentifier,
	Key extends string
> = {
	responseIdentifier: Identifier
	key: Key
}

type SegmentForDimension<D extends FeedbackDimension> =
	D extends EnumeratedFeedbackDimension<infer Identifier, infer Keys>
		? FeedbackPathSegment<Identifier, Keys[number]>
		: D extends BinaryFeedbackDimension<infer Identifier>
			? FeedbackPathSegment<Identifier, CorrectnessKey>
			: never

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
	: readonly FeedbackPathSegment<ResponseIdentifier, string>[]

export type FeedbackCombination<
	Id extends FeedbackCombinationIdentifier,
	Dimensions extends readonly FeedbackDimension[]
> = {
	readonly id: Id
	readonly path: PathSegmentsForDimensions<Dimensions>
}

export interface FeedbackPlan<
	Dimensions extends
		readonly FeedbackDimension[] = readonly FeedbackDimension[],
	Combinations extends readonly FeedbackCombination<
		FeedbackCombinationIdentifier,
		Dimensions
	>[] = readonly FeedbackCombination<
		FeedbackCombinationIdentifier,
		Dimensions
	>[]
> {
	readonly dimensions: Dimensions
	readonly combinations: Combinations
}

export type FeedbackPlanAny = {
	readonly dimensions: readonly FeedbackDimension[]
	readonly combinations: ReadonlyArray<{
		readonly id: string
		readonly path: ReadonlyArray<{
			responseIdentifier: ResponseIdentifier
			key: string
		}>
	}>
}

export type FeedbackCombinationId<P extends FeedbackPlanAny> =
	P["combinations"][number]["id"]

export type FeedbackCombinationKeyspace<P extends FeedbackPlanAny> =
	FeedbackCombinationId<P>
