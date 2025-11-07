import type { z } from "zod"
import type { FeedbackPlanSchema } from "@/core/feedback/plan/schema"

type CorrectnessKey = "CORRECT" | "INCORRECT"

type UpperAlpha =
	| "A"
	| "B"
	| "C"
	| "D"
	| "E"
	| "F"
	| "G"
	| "H"
	| "I"
	| "J"
	| "K"
	| "L"
	| "M"
	| "N"
	| "O"
	| "P"
	| "Q"
	| "R"
	| "S"
	| "T"
	| "U"
	| "V"
	| "W"
	| "X"
	| "Y"
	| "Z"

type LowerAlpha =
	| "a"
	| "b"
	| "c"
	| "d"
	| "e"
	| "f"
	| "g"
	| "h"
	| "i"
	| "j"
	| "k"
	| "l"
	| "m"
	| "n"
	| "o"
	| "p"
	| "q"
	| "r"
	| "s"
	| "t"
	| "u"
	| "v"
	| "w"
	| "x"
	| "y"
	| "z"

export type ChoiceIdentifier = `${UpperAlpha}${string}`

export type ResponseIdentifier = `RESPONSE${"" | `_${string}`}`

export type FeedbackCombinationIdentifier =
	| "CORRECT"
	| "INCORRECT"
	| `FB__${string}`

export type SlotIdentifier = `${LowerAlpha}${string}`

export type ChoiceIdentifierTuple<T extends readonly string[]> =
	T extends readonly [
		infer Head extends ChoiceIdentifier,
		...infer Tail extends readonly string[]
	]
		? readonly [Head, ...ChoiceIdentifierTuple<Tail>]
		: readonly []

type ResponseIdentifierFor<Identifier extends string> =
	string extends Identifier
		? string
		: Identifier extends ResponseIdentifier
			? Identifier
			: never

type CombinationIdentifierFor<Id extends string> = string extends Id
	? string
	: Id extends FeedbackCombinationIdentifier
		? Id
		: never

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

export type RuntimeFeedbackPlan = z.infer<typeof FeedbackPlanSchema>
