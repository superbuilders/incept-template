import type {
	ChoiceIdentifier,
	FeedbackCombinationIdentifier,
	ResponseIdentifier
} from "@/core/identifiers"

type CorrectnessKey = "CORRECT" | "INCORRECT"

type BuildTuple<
	N extends number,
	Acc extends unknown[] = []
> = Acc["length"] extends N ? Acc : BuildTuple<N, [...Acc, unknown]>

type IsLiteralNumber<N extends number> = number extends N ? false : true

type IsNonNegative<N extends number> = `${N}` extends `-${string}`
	? false
	: true

type HasLiteralLength<T extends readonly unknown[]> = number extends T["length"]
	? false
	: true

type LiteralLessOrEqual<
	A extends number,
	B extends number
> = BuildTuple<B> extends [...BuildTuple<A>, ...infer _Rest] ? true : false

type IsLessOrEqual<
	A extends number,
	B extends number
> = IsNonNegative<A> extends true
	? IsNonNegative<B> extends true
		? IsLiteralNumber<A> extends true
			? IsLiteralNumber<B> extends true
				? LiteralLessOrEqual<A, B>
				: true
			: true
		: false
	: false

type Decrement<N extends number> = BuildTuple<N> extends readonly [
	...infer Rest,
	unknown
]
	? Rest["length"]
	: never

type CombinationTuples<
	Choices extends readonly string[],
	Count extends number
> = Count extends 0
	? readonly []
	: Choices extends readonly [
				infer Head extends string,
				...infer Tail extends readonly string[]
			]
		?
				| CombinationTuples<Tail, Count>
				| (CombinationTuples<Tail, Decrement<Count>> extends infer Rest extends
						readonly string[]
						? readonly [Head, ...Rest]
						: never)
		: never

type EnumerateUntil<
	N extends number,
	Acc extends number[] = []
> = Acc["length"] extends N
	? Acc[number]
	: EnumerateUntil<N, [...Acc, Acc["length"]]>

type NumberRange<Min extends number, Max extends number> =
	| Exclude<EnumerateUntil<Max>, EnumerateUntil<Min>>
	| Max

type LiteralCombinationTupleUnion<
	Choices extends readonly string[],
	Min extends number,
	Max extends number
> = NumberRange<Min, Max> extends infer Count extends number
	? CombinationTuples<Choices, Count>
	: never

type JoinWithDoubleUnderscore<Tuple extends readonly string[]> =
	Tuple extends readonly [
		infer Head extends string,
		...infer Tail extends readonly string[]
	]
		? Tail["length"] extends 0
			? Head
			: `${Head}__${JoinWithDoubleUnderscore<Tail>}`
		: never

type LiteralCombinationKeyUnion<
	Choices extends readonly string[],
	Min extends number,
	Max extends number
> =
	| (Min extends 0 ? "NONE" : never)
	| (LiteralCombinationTupleUnion<Choices, Min, Max> extends infer Combo extends
			readonly string[]
			? Combo["length"] extends 0
				? never
				: JoinWithDoubleUnderscore<Combo>
			: never)

type CombinationKeyUnion<
	Choices extends readonly string[],
	Min extends number,
	Max extends number
> = HasLiteralLength<Choices> extends true
	? IsLiteralNumber<Min> extends true
		? IsLiteralNumber<Max> extends true
			? LiteralCombinationKeyUnion<Choices, Min, Max>
			: string
		: string
	: string

type NonEmptyArray<T> = readonly [T, ...T[]]

type CombinationKeyArray<
	Choices extends readonly string[],
	Min extends number,
	Max extends number,
	Keys extends readonly string[]
> = HasLiteralLength<Choices> extends true
	? IsLiteralNumber<Min> extends true
		? IsLiteralNumber<Max> extends true
			? string extends Keys[number]
				? NonEmptyArray<CombinationKeyUnion<Choices, Min, Max>>
				: Keys extends NonEmptyArray<CombinationKeyUnion<Choices, Min, Max>>
					? CombinationKeyCoverage<Keys, CombinationKeyUnion<Choices, Min, Max>>
					: never
			: readonly string[]
		: readonly string[]
	: readonly string[]

type CombinationKeyCoverage<
	Keys extends readonly string[],
	Expected extends string
> = string extends Expected
	? Keys
	: [Keys[number]] extends [Expected]
		? [Expected] extends [Keys[number]]
			? Keys
			: never
		: never

type IsValidCombinationRange<
	Choices extends readonly unknown[],
	Min extends number,
	Max extends number
> = IsNonNegative<Min> extends true
	? IsNonNegative<Max> extends true
		? HasLiteralLength<Choices> extends true
			? IsLiteralNumber<Min> extends true
				? IsLiteralNumber<Max> extends true
					? IsLessOrEqual<Min, Max> extends true
						? IsLessOrEqual<Min, Choices["length"]> extends true
							? IsLessOrEqual<Max, Choices["length"]> extends true
								? true
								: false
							: false
						: false
					: true
				: true
			: true
		: false
	: false

export type EnumeratedFeedbackDimension<
	Identifier extends ResponseIdentifier,
	Keys extends readonly string[]
> = {
	responseIdentifier: Identifier
	kind: "enumerated"
	keys: Keys
}

export type CombinationFeedbackDimension<
	Identifier extends ResponseIdentifier,
	Min extends number,
	Max extends number,
	Choices extends readonly ChoiceIdentifier[],
	Keys extends readonly string[]
> = IsValidCombinationRange<Choices, Min, Max> extends true
	? {
			responseIdentifier: Identifier
			kind: "combination"
			choices: Choices
			minSelections: Min
			maxSelections: Max
			keys: CombinationKeyArray<Choices, Min, Max, Keys>
		}
	: never

export type BinaryFeedbackDimension<Identifier extends ResponseIdentifier> = {
	responseIdentifier: Identifier
	kind: "binary"
}

export type FeedbackDimension =
	| EnumeratedFeedbackDimension<ResponseIdentifier, readonly string[]>
	| CombinationFeedbackDimension<
			ResponseIdentifier,
			number,
			number,
			readonly ChoiceIdentifier[],
			readonly string[]
	  >
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
		: D extends CombinationFeedbackDimension<
					infer Identifier,
					infer Min extends number,
					infer Max extends number,
					infer Choices extends readonly ChoiceIdentifier[],
					readonly string[]
				>
			? FeedbackPathSegment<Identifier, CombinationKeyUnion<Choices, Min, Max>>
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

export type FeedbackCombinationById<
	P extends FeedbackPlanAny,
	Id extends FeedbackCombinationId<P>
> = Extract<P["combinations"][number], { readonly id: Id }>

export type FeedbackCombinationPath<
	P extends FeedbackPlanAny,
	Id extends FeedbackCombinationId<P>
> = FeedbackCombinationById<P, Id>["path"]

export type FeedbackCombinationMap<P extends FeedbackPlanAny, Value> = {
	readonly [Id in FeedbackCombinationId<P>]: Value
}
