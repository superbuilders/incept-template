import type {
	FeedbackBundle,
	FeedbackSharedPedagogy
} from "@/core/content/types"
import type {
	EnumeratedFeedbackDimension,
	FeedbackCombination,
	FeedbackPlan
} from "@/core/feedback/plan/types"
import type {
	ChoiceIdentifierTuple,
	FeedbackCombinationIdentifier
} from "@/core/identifiers/types"
import type { AssessmentItemInput } from "@/core/item/types"

type TemplateWidgets = readonly []

type PlanChoiceIds = ChoiceIdentifierTuple<readonly ["A", "B", "C", "D"]>

const PLAN_CHOICE_IDS: PlanChoiceIds = ["A", "B", "C", "D"]

type PlanDimensions = readonly [
	EnumeratedFeedbackDimension<"RESP", typeof PLAN_CHOICE_IDS>
]

const FEEDBACK_DIMENSIONS: PlanDimensions = [
	{
		responseIdentifier: "RESP",
		kind: "enumerated",
		keys: PLAN_CHOICE_IDS
	}
]

const FEEDBACK_COMBINATIONS = [
	{
		id: "FB__RESP_A",
		path: [{ responseIdentifier: "RESP", key: "A" }]
	},
	{
		id: "FB__RESP_B",
		path: [{ responseIdentifier: "RESP", key: "B" }]
	},
	{
		id: "FB__RESP_C",
		path: [{ responseIdentifier: "RESP", key: "C" }]
	},
	{
		id: "FB__RESP_D",
		path: [{ responseIdentifier: "RESP", key: "D" }]
	}
] satisfies readonly FeedbackCombination<
	FeedbackCombinationIdentifier,
	PlanDimensions
>[]

type PlanCombinations = typeof FEEDBACK_COMBINATIONS

const feedbackPlan: FeedbackPlan<PlanDimensions, PlanCombinations> = {
	dimensions: FEEDBACK_DIMENSIONS,
	combinations: FEEDBACK_COMBINATIONS
}

const sharedPedagogy: FeedbackSharedPedagogy<TemplateWidgets> = {
	steps: [
		{
			type: "step",
			title: [{ type: "text", content: "Review the procedure" }],
			content: [
				{
					type: "paragraph",
					content: [
						{
							type: "text",
							content:
								"Add the numerators together and also add the denominators to keep everything aligned."
						}
					]
				}
			]
		},
		{
			type: "step",
			title: [{ type: "text", content: "Verify the arithmetic" }],
			content: [
				{
					type: "paragraph",
					content: [
						{ type: "text", content: "Make sure the numerators add to " },
						{ type: "math", mathml: "<mn>7</mn>" },
						{ type: "text", content: " and the denominators add to " },
						{ type: "math", mathml: "<mn>12</mn>" },
						{ type: "text", content: "." }
					]
				}
			]
		}
	],
	solution: {
		type: "solution",
		content: [
			{ type: "text", content: "Therefore, the final result is " },
			{ type: "math", mathml: "<mfrac><mn>7</mn><mn>12</mn></mfrac>" },
			{ type: "text", content: "." }
		]
	}
}

const feedbackBundle: FeedbackBundle<typeof feedbackPlan, TemplateWidgets> = {
	shared: sharedPedagogy,
	preambles: {
		FB__RESP_A: {
			correctness: "correct",
			summary: [
				{
					type: "text",
					content:
						"Nice job! You handled those fractions just like the walkthrough showed, so everything lines up perfectly."
				}
			]
		},
		FB__RESP_B: {
			correctness: "incorrect",
			summary: [
				{
					type: "text",
					content:
						"Not quite what we were expecting—you kept the denominator and only touched the numerators."
				}
			]
		},
		FB__RESP_C: {
			correctness: "incorrect",
			summary: [
				{
					type: "text",
					content:
						"Oops! You multiplied the denominators but forgot to do anything special with the numerators."
				}
			]
		},
		FB__RESP_D: {
			correctness: "incorrect",
			summary: [
				{
					type: "text",
					content:
						"You had the right idea but typed the decimal instead of the fraction form we asked for."
				}
			]
		}
	}
}

const assessmentItem: AssessmentItemInput<
	TemplateWidgets,
	typeof feedbackPlan
> = {
	identifier: "fractions_addition_outdated_feedback",
	title: "Add Two Fractions (Outdated Feedback Template)",
	responseDeclarations: [
		{
			identifier: "RESP",
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
					content: "Compute "
				},
				{
					type: "math",
					mathml:
						"<mfrac><mn>1</mn><mn>6</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>4</mn></mfrac>"
				},
				{ type: "text", content: "." }
			]
		}
	],
	widgets: null,
	interactions: {
		RESP: {
			type: "choiceInteraction",
			responseIdentifier: "RESP",
			shuffle: true,
			minChoices: 1,
			maxChoices: 1,
			prompt: [
				{
					type: "text",
					content: "Select the sum."
				}
			],
			choices: [
				{
					identifier: "A",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "math",
									mathml: "<mfrac><mn>7</mn><mn>12</mn></mfrac>"
								}
							]
						}
					]
				},
				{
					identifier: "B",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "math",
									mathml: "<mfrac><mn>5</mn><mn>12</mn></mfrac>"
								}
							]
						}
					]
				},
				{
					identifier: "C",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "math",
									mathml: "<mfrac><mn>5</mn><mn>10</mn></mfrac>"
								}
							]
						}
					]
				},
				{
					identifier: "D",
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "math",
									mathml: "<mn>0.58</mn>"
								}
							]
						}
					]
				}
			]
		}
	},
	feedbackPlan,
	feedback: feedbackBundle
}

export default function generateTemplate(): AssessmentItemInput<
	TemplateWidgets,
	typeof feedbackPlan
> {
	return assessmentItem
}
