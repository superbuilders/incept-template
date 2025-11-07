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

export type ResponseIdentifierFor<Identifier extends string> =
	string extends Identifier
		? string
		: Identifier extends ResponseIdentifier
			? Identifier
			: never

export type CombinationIdentifierFor<Id extends string> = string extends Id
	? string
	: Id extends FeedbackCombinationIdentifier
		? Id
		: never
