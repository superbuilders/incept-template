import type {
	FeedbackBundle,
	FeedbackSharedPedagogy
} from "@/core/content/types"
import type { FeedbackPlan } from "@/core/feedback/plan/types"
import type { AssessmentItemInput } from "@/core/item/types"
import type { TemplateModule } from "@/templates/types"

type TemplateWidgets = readonly ["partitionedShape"]

const choiceIdentifiers = ["A", "B", "C", "D"] as const

const legacyFeedbackPlan = {
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
} satisfies FeedbackPlan

const sharedPedagogy: FeedbackSharedPedagogy<TemplateWidgets> = {
	steps: [
		{
			type: "step",
			title: [{ type: "text", content: "Review the worked example." }],
			content: [
				{
					type: "paragraph",
					content: [
						{ type: "text", content: "Check common denominators carefully." }
					]
				}
			]
		},
		{
			type: "step",
			title: [{ type: "text", content: "Recompute the numerators." }],
			content: [
				{
					type: "paragraph",
					content: [
						{
							type: "text",
							content: "Make sure you combine the numerators correctly."
						}
					]
				}
			]
		},
		{
			type: "step",
			title: [{ type: "text", content: "Simplify the result." }],
			content: [
				{
					type: "paragraph",
					content: [
						{
							type: "text",
							content: "Reduce the fraction to lowest terms if needed."
						}
					]
				}
			]
		}
	],
	solution: {
		type: "solution",
		content: [
			{
				type: "text",
				content:
					"The correct answer is A; it represents the properly summed fraction."
			}
		]
	}
}

const feedbackBundle: FeedbackBundle<
	typeof legacyFeedbackPlan,
	TemplateWidgets
> = {
	shared: sharedPedagogy,
	preambles: {
		FB__RESPONSE_A: {
			correctness: "correct",
			summary: [{ type: "text", content: "Good work." }]
		},
		FB__RESPONSE_B: {
			correctness: "incorrect",
			summary: [{ type: "text", content: "You picked B." }]
		},
		FB__RESPONSE_C: {
			correctness: "incorrect",
			summary: [{ type: "text", content: "You picked C." }]
		},
		FB__RESPONSE_D: {
			correctness: "incorrect",
			summary: [{ type: "text", content: "You picked D." }]
		}
	}
}

export const generateLegacyTemplate: TemplateModule<
	TemplateWidgets,
	typeof legacyFeedbackPlan
> = (_seed) => {
	return {
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
		feedback: feedbackBundle
	} satisfies AssessmentItemInput<TemplateWidgets, typeof legacyFeedbackPlan>
}
