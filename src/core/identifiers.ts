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

type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

type SlotIdentifierRest<S extends string = ""> =
	S extends `${LowerAlpha | Digit | "_"}${infer Tail}`
		? `${LowerAlpha | Digit | "_"}${SlotIdentifierRest<Tail>}`
		: ""

export type ChoiceIdentifier = `${UpperAlpha}${string}`

export type ResponseIdentifier = `RESP${"" | `_${ChoiceIdentifier}`}`

export type FeedbackCombinationIdentifier = `FB__${string}`

export type SlotIdentifier = `${LowerAlpha}${SlotIdentifierRest}`

export type ChoiceIdentifierTuple<T extends readonly string[]> =
	T extends readonly [
		infer Head extends ChoiceIdentifier,
		...infer Tail extends readonly string[]
	]
		? readonly [Head, ...ChoiceIdentifierTuple<Tail>]
		: readonly []
