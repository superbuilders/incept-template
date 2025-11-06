import type { z } from "zod"
import type { BlockContent } from "@/core/content/types"
import type { AuthoringFeedbackOverall } from "@/core/feedback/authoring/types"
import type { FeedbackPlan } from "@/core/feedback/plan/types"
import type { AnyInteraction } from "@/core/interactions/types"
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
			identifier: string
			cardinality: "single"
			baseType: "string"
			correct: string
	  }
	| {
			identifier: string
			cardinality: "single"
			baseType: "integer"
			correct: number
	  }
	| {
			identifier: string
			cardinality: "single"
			baseType: "float"
			correct: number
			rounding: NumericRounding
	  }
	| {
			identifier: string
			cardinality: "single"
			baseType: "identifier"
			correct: string
	  }
	| {
			identifier: string
			cardinality: "multiple" | "ordered"
			baseType: "identifier"
			correct: string[]
	  }
	| {
			identifier: string
			cardinality: "multiple"
			baseType: "directedPair"
			correct: Array<{ source: string; target: string }>
			allowEmpty: boolean
	  }
	| {
			identifier: string
			cardinality: "ordered"
			baseType: "directedPair"
			correct: Array<{ source: string; target: string }>
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
	P extends FeedbackPlan
> = {
	identifier: string
	title: string
	responseDeclarations: ResponseDeclaration[]
	body: BlockContent<E> | null
	widgets: Record<string, Widget> | null
	interactions: Record<string, AnyInteraction<E>> | null
	feedbackPlan: P
	feedback: AuthoringFeedbackOverall<E>
}

export type AssessmentItemInput<
	E extends readonly string[],
	P extends FeedbackPlan
> = AssessmentItem<E, P>
