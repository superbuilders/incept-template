import type { FeedbackContent } from "@/core/content/types"
import type { FeedbackPlan } from "@/core/feedback/plan/types"
import type { AssessmentItemInput } from "@/core/item/types"
import type { TemplateModule } from "@/templates/types"
import type { WidgetTypeTuple } from "@/widgets/collections/types"

type TemplateWidgets = readonly ["partitionedShape"]

type LegacyTemplateModule<E extends WidgetTypeTuple> = TemplateModule<
	E,
	FeedbackPlan
>

const choiceIdentifiers = ["A", "B", "C", "D"] as const

const legacyFeedbackPlan: FeedbackPlan = {
	mode: "combo",
	dimensions: [
		{
			responseIdentifier: "RESPONSE",
			kind: "enumerated",
			keys: choiceIdentifiers
		}
	],
	combinations: choiceIdentifiers.map((key) => ({
		id: `FB__RESPONSE_${key}`,
		path: [{ responseIdentifier: "RESPONSE", key }]
	}))
}

const feedbackByChoice: Record<string, FeedbackContent<TemplateWidgets>> = {
	A: {
		preamble: {
			correctness: "correct",
			summary: [{ type: "text", content: "Good work." }]
		},
		steps: [
			{
				type: "step",
				title: [{ type: "text", content: "Keep doing that" }],
				content: [
					{
						type: "paragraph",
						content: [{ type: "text", content: "This is fine." }]
					}
				]
			}
		],
		solution: {
			type: "solution",
			content: [{ type: "text", content: "Correct choice." }]
		}
	},
	B: {
		preamble: {
			correctness: "incorrect",
			summary: [{ type: "text", content: "You picked B." }]
		},
		steps: [
			{
				type: "step",
				title: [{ type: "text", content: "Generic coaching" }],
				content: [
					{
						type: "paragraph",
						content: [{ type: "text", content: "Try reviewing the lesson." }]
					}
				]
			}
		],
		solution: {
			type: "solution",
			content: [{ type: "text", content: "Better luck next time." }]
		}
	},
	C: {
		preamble: {
			correctness: "incorrect",
			summary: [{ type: "text", content: "You picked C." }]
		},
		steps: [
			{
				type: "step",
				title: [{ type: "text", content: "Keep trying" }],
				content: [
					{
						type: "paragraph",
						content: [{ type: "text", content: "Remember the worked example." }]
					}
				]
			}
		],
		solution: {
			type: "solution",
			content: [{ type: "text", content: "Consider another option." }]
		}
	},
	D: {
		preamble: {
			correctness: "incorrect",
			summary: [{ type: "text", content: "You picked D." }]
		},
		steps: [
			{
				type: "step",
				title: [{ type: "text", content: "Generic coaching" }],
				content: [
					{
						type: "paragraph",
						content: [{ type: "text", content: "Check the numerators again." }]
					}
				]
			}
		],
		solution: {
			type: "solution",
			content: [{ type: "text", content: "Try computing the sum." }]
		}
	}
}

export const generateLegacyTemplate: LegacyTemplateModule<TemplateWidgets> = (
	_seed
) => {
	const assessmentItem = {
		identifier: "legacy-fraction-addition",
		title: "Legacy Fraction Addition",
		responseDeclarations: [
			{
				identifier: "RESPONSE",
				cardinality: "single",
				baseType: "identifier",
				correct: "A"
			}
		],
		body: [
			{
				type: "paragraph",
				content: [
					{
						type: "text",
						content: "Select the correct sum of the given fractions."
					}
				]
			}
		],
		widgets: null,
		interactions: {
			RESPONSE: {
				type: "choiceInteraction",
				responseIdentifier: "RESPONSE",
				shuffle: true,
				minChoices: 1,
				maxChoices: 1,
				prompt: [{ type: "text", content: "Choose an answer." }],
				choices: choiceIdentifiers.map((id) => ({
					identifier: id,
					content: [
						{
							type: "paragraph",
							content: [{ type: "text", content: `Option ${id}` }]
						}
					]
				}))
			}
		},
		feedbackPlan: legacyFeedbackPlan,
		feedback: {
			FEEDBACK__OVERALL: {
				RESPONSE: Object.fromEntries(
					choiceIdentifiers.map((id) => [id, { content: feedbackByChoice[id] }])
				)
			}
		}
	} satisfies AssessmentItemInput<TemplateWidgets, FeedbackPlan>

	return assessmentItem
}
