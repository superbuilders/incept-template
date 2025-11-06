import type { FeedbackContent } from "@/core/content/types"
import type { ComboPlan } from "@/core/feedback/plan/types"
import type { AssessmentItemInput } from "@/core/item/types"

type TemplateWidgets = readonly []

const feedbackPlan = {
	mode: "combo",
	dimensions: [
		{
			responseIdentifier: "RESPONSE",
			kind: "enumerated",
			keys: ["A", "B", "C", "D"]
		}
	],
	combinations: ["A", "B", "C", "D"].map((key) => ({
		id: `FB__RESPONSE_${key}`,
		path: [{ responseIdentifier: "RESPONSE", key }]
	}))
} satisfies ComboPlan

const FEEDBACK_BY_CHOICE: Record<string, FeedbackContent<TemplateWidgets>> = {
	A: {
		preamble: {
			correctness: "correct",
			summary: [
				{
					type: "text",
					content:
						"Nice job! You handled those fractions just like the walkthrough showed, so everything lines up perfectly."
				}
			]
		},
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
	},
	B: {
		preamble: {
			correctness: "incorrect",
			summary: [
				{
					type: "text",
					content:
						"Not quite what we were expecting—you kept the denominator and only touched the numerators."
				}
			]
		},
		steps: [
			{
				type: "step",
				title: [{ type: "text", content: "Why this is wrong" }],
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								content:
									"When you keep the denominator and only add numerators, the fractions don’t look the same."
							},
							{ type: "text", content: "  " },
							{
								type: "text",
								content:
									"Try thinking about how the worksheet solved it earlier."
							}
						]
					}
				]
			},
			{
				type: "step",
				title: [{ type: "text", content: "Correct approach" }],
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								content:
									"Add the numerators and denominators separately so that everything stays consistent."
							}
						]
					}
				]
			}
		],
		solution: {
			type: "solution",
			content: [
				{ type: "text", content: "Therefore, the correct sum is " },
				{ type: "math", mathml: "<mfrac><mn>7</mn><mn>12</mn></mfrac>" },
				{ type: "text", content: "." }
			]
		}
	},
	C: {
		preamble: {
			correctness: "incorrect",
			summary: [
				{
					type: "text",
					content:
						"Oops! You multiplied the denominators but forgot to do anything special with the numerators."
				}
			]
		},
		steps: [
			{
				type: "step",
				title: [{ type: "text", content: "Identify the issue" }],
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								content:
									"Changing only one part of the fraction produces pieces of different sizes."
							}
						]
					}
				]
			},
			{
				type: "step",
				title: [{ type: "text", content: "State the final result" }],
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								content:
									"After fixing the numerators, you should still end up with "
							},
							{ type: "math", mathml: "<mfrac><mn>7</mn><mn>12</mn></mfrac>" },
							{ type: "text", content: "." }
						]
					}
				]
			}
		],
		solution: {
			type: "solution",
			content: [
				{ type: "text", content: "Therefore, the sum is " },
				{ type: "math", mathml: "<mfrac><mn>7</mn><mn>12</mn></mfrac>" },
				{ type: "text", content: "." }
			]
		}
	},
	D: {
		preamble: {
			correctness: "incorrect",
			summary: [
				{
					type: "text",
					content:
						"You had the right idea but typed the decimal instead of the fraction form we asked for."
				}
			]
		},
		steps: [
			{
				type: "step",
				title: [{ type: "text", content: "Talk about format" }],
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								content:
									"We asked for a fraction answer, so convert any decimals back into fraction form before submitting."
							}
						]
					}
				]
			},
			{
				type: "step",
				title: [{ type: "text", content: "State the final result" }],
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								content: "The fraction equivalent is "
							},
							{ type: "math", mathml: "<mfrac><mn>7</mn><mn>12</mn></mfrac>" },
							{
								type: "text",
								content: ", which matches the correct computation above."
							}
						]
					}
				]
			}
		],
		solution: {
			type: "solution",
			content: [
				{ type: "text", content: "Therefore, the accepted answer is " },
				{ type: "math", mathml: "<mfrac><mn>7</mn><mn>12</mn></mfrac>" },
				{ type: "text", content: "." }
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
		RESPONSE: {
			type: "choiceInteraction",
			responseIdentifier: "RESPONSE",
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
	feedback: {
		FEEDBACK__OVERALL: {
			RESPONSE: {
				A: { content: FEEDBACK_BY_CHOICE.A },
				B: { content: FEEDBACK_BY_CHOICE.B },
				C: { content: FEEDBACK_BY_CHOICE.C },
				D: { content: FEEDBACK_BY_CHOICE.D }
			}
		}
	}
}

export default function generateTemplate(): AssessmentItemInput<
	TemplateWidgets,
	typeof feedbackPlan
> {
	return assessmentItem
}
