import type { FeedbackPlan } from "@/core/feedback/plan/types"
import type { AssessmentItemInput } from "@/core/item/types"
import type { WidgetTypeTuple } from "@/widgets/collections/types"

export type TypeScriptDiagnostic = {
	message: string
	line: number
	column: number
	tsCode: number
}

export type TemplateModule<
	E extends WidgetTypeTuple,
	P extends FeedbackPlan
> = (seed: bigint) => AssessmentItemInput<E, P>
