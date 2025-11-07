import type { z } from "zod"
import type { BlockContent, FeedbackBundle } from "@/core/content/types"
import type { FeedbackPlanAny } from "@/core/feedback/plan/types"
import type {
	ChoiceIdentifier,
	FeedbackCombinationIdentifier,
	ResponseIdentifier
} from "@/core/identifiers/types"
import type { Interaction } from "@/core/interactions/types"
import type { typedSchemas } from "@/widgets/registry"

export type Widget = z.infer<(typeof typedSchemas)[keyof typeof typedSchemas]>

export type DecimalPlacesRounding = {
	strategy: "decimalPlaces"
	figures: number
}

export type SignificantFiguresRounding = {
	strategy: "significantFigures"
	figures: number
}

export type NumericRounding = DecimalPlacesRounding | SignificantFiguresRounding

export type ResponseDeclaration =
	| {
			identifier: ResponseIdentifier
			cardinality: "single"
			baseType: "string"
			correct: string
	  }
	| {
			identifier: ResponseIdentifier
			cardinality: "single"
			baseType: "integer"
			correct: number
	  }
	| {
			identifier: ResponseIdentifier
			cardinality: "single"
			baseType: "float"
			correct: number
			rounding: NumericRounding
	  }
	| {
			identifier: ResponseIdentifier
			cardinality: "single"
			baseType: "identifier"
			correct: FeedbackCombinationIdentifier | ChoiceIdentifier
	  }
	| {
			identifier: ResponseIdentifier
			cardinality: "multiple" | "ordered"
			baseType: "identifier"
			correct: ChoiceIdentifier[]
	  }
	| {
			identifier: ResponseIdentifier
			cardinality: "multiple"
			baseType: "directedPair"
			correct: Array<{ source: ChoiceIdentifier; target: ChoiceIdentifier }>
			allowEmpty: boolean
	  }
	| {
			identifier: ResponseIdentifier
			cardinality: "ordered"
			baseType: "directedPair"
			correct: Array<{ source: ChoiceIdentifier; target: ChoiceIdentifier }>
			allowEmpty: false
	  }

export type AssessmentItemShell<E extends readonly string[]> = {
	identifier: string
	title: string
	responseDeclarations: ResponseDeclaration[]
	body: BlockContent<E> | null
}

export type AssessmentItem<
	E extends readonly string[],
	P extends FeedbackPlanAny
> = {
	identifier: string
	title: string
	responseDeclarations: ResponseDeclaration[]
	body: BlockContent<E> | null
	widgets: Record<string, Widget> | null
	interactions: Record<string, Interaction<E>> | null
	feedbackPlan: P
	feedback: FeedbackBundle<P, E>
}

export type AssessmentItemInput<
	E extends readonly string[],
	P extends FeedbackPlanAny
> = AssessmentItem<E, P>
