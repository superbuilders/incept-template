// -----------------------------------------------------------------------------
// 1. IMPORTS
// The template only imports what is absolutely necessary: core item types,
// shared seed utilities, and widget typing helpers.
// -----------------------------------------------------------------------------

import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type {
	FeedbackBundle,
	FeedbackPreamble,
	FeedbackPreambleMap,
	FeedbackSharedPedagogy
} from "@/core/content/types"
import type {
	EnumeratedFeedbackDimension,
	FeedbackCombination,
	StaticFeedbackPlan
} from "@/core/feedback/plan/types"
import type { ChoiceIdentifierTuple } from "@/core/identifiers/types"
import type { AssessmentItemInput } from "@/core/item/types"
import { createSeededRandom } from "@/templates/seeds"
import type { TemplateModule } from "@/templates/types"

// Define the exact widget tuple used by this template
// The template includes a 'partitionedShape' widget in the widgets map below
export type TemplateWidgets = readonly ["partitionedShape"]

const PLAN_CHOICE_IDS = [
	"CHOICE_0",
	"CHOICE_1",
	"CHOICE_2",
	"CHOICE_3"
] as const satisfies ChoiceIdentifierTuple<
	readonly ["CHOICE_0", "CHOICE_1", "CHOICE_2", "CHOICE_3"]
>

type ChoiceId = (typeof PLAN_CHOICE_IDS)[number]

type PlanDimensions = readonly [
	EnumeratedFeedbackDimension<"RESPONSE", typeof PLAN_CHOICE_IDS>
]

const FEEDBACK_DIMENSIONS: PlanDimensions = [
	{
		responseIdentifier: "RESPONSE",
		kind: "enumerated",
		keys: PLAN_CHOICE_IDS
	}
]

type PlanCombinationId = `FB__RESPONSE_${ChoiceId}`

type PlanCombinations = readonly [
	FeedbackCombination<"FB__RESPONSE_CHOICE_0", PlanDimensions>,
	FeedbackCombination<"FB__RESPONSE_CHOICE_1", PlanDimensions>,
	FeedbackCombination<"FB__RESPONSE_CHOICE_2", PlanDimensions>,
	FeedbackCombination<"FB__RESPONSE_CHOICE_3", PlanDimensions>
]

const FEEDBACK_COMBINATIONS: PlanCombinations = [
	{
		id: "FB__RESPONSE_CHOICE_0",
		path: [{ responseIdentifier: "RESPONSE", key: "CHOICE_0" }]
	},
	{
		id: "FB__RESPONSE_CHOICE_1",
		path: [{ responseIdentifier: "RESPONSE", key: "CHOICE_1" }]
	},
	{
		id: "FB__RESPONSE_CHOICE_2",
		path: [{ responseIdentifier: "RESPONSE", key: "CHOICE_2" }]
	},
	{
		id: "FB__RESPONSE_CHOICE_3",
		path: [{ responseIdentifier: "RESPONSE", key: "CHOICE_3" }]
	}
]

const feedbackPlan: StaticFeedbackPlan<PlanDimensions, PlanCombinations> = {
	dimensions: FEEDBACK_DIMENSIONS,
	combinations: FEEDBACK_COMBINATIONS
}

// -----------------------------------------------------------------------------
// 2. FUNDAMENTAL DATA TYPE & TEMPLATE PROPS SCHEMA
// This section defines the public contract of the template. It is the only
// part a user of the template needs to know. Inputs are intentionally opaque
// so the template owns all math-specific authoring decisions.
// -----------------------------------------------------------------------------

/**
 * Defines the structure for a simple fraction.
 */
export type Fraction = { numerator: number; denominator: number }

// -----------------------------------------------------------------------------
// 3. THE TEMPLATE GENERATOR FUNCTION
// This is the deterministic core of the template. It is a pure function that
// transforms the input props into a valid AssessmentItemInput object.
// -----------------------------------------------------------------------------

/**
 * Generates the AssessmentItemInput data structure for a fraction addition question.
 *
 * @param seed - Opaque seed input used to generate the authored question.
 * @returns An AssessmentItemInput object ready for the QTI compiler.
 */
export const generateFractionAdditionQuestion: TemplateModule<
	TemplateWidgets,
	typeof feedbackPlan
> = (seed) => {
	// --- 3a. Self-Contained Mathematical Helpers ---
	// To ensure the template is a pure, dependency-free module, all core
	// mathematical logic is implemented directly within its scope.

	const gcd = (a: number, b: number): number => {
		let x = Math.abs(a)
		let y = Math.abs(b)
		while (y !== 0) {
			const temp = y
			y = x % y
			x = temp
		}
		return x === 0 ? 1 : x
	}

	const simplifyFraction = (frac: Fraction): Fraction => {
		if (frac.denominator === 0) {
			logger.error("fraction denominator zero detected", {
				numerator: frac.numerator,
				denominator: frac.denominator
			})
			throw errors.new("fraction denominator cannot be zero")
		}
		const denominatorSign = frac.denominator < 0 ? -1 : 1
		const normalizedNumerator = frac.numerator * denominatorSign
		const normalizedDenominator = frac.denominator * denominatorSign
		const commonDivisor = gcd(normalizedNumerator, normalizedDenominator)
		return {
			numerator: normalizedNumerator / commonDivisor,
			denominator: normalizedDenominator / commonDivisor
		}
	}

	const addFractions = (f1: Fraction, f2: Fraction): Fraction => {
		const commonDenominator = f1.denominator * f2.denominator
		const newNumerator =
			f1.numerator * f2.denominator + f2.numerator * f1.denominator
		return simplifyFraction({
			numerator: newNumerator,
			denominator: commonDenominator
		})
	}

	const formatFractionMathML = (frac: Fraction): string => {
		return `<mfrac><mn>${frac.numerator}</mn><mn>${frac.denominator}</mn></mfrac>`
	}

	// --- 3b. Core Logic: Determine Fractions From Seed and Build Distractors ---
	const random = createSeededRandom(seed)

	const createFractionFromSeed = (): Fraction => {
		const denominator = random.nextInt(2, 12)
		const maxNumerator = Math.max(1, Math.floor(denominator / 2))
		const numerator = random.nextInt(1, maxNumerator)
		return simplifyFraction({ numerator, denominator })
	}

	const fractionsEqual = (a: Fraction, b: Fraction) =>
		a.numerator === b.numerator && a.denominator === b.denominator

	const f1 = createFractionFromSeed()

	let f2 = createFractionFromSeed()
	if (fractionsEqual(f1, f2)) {
		const alternativeDenominator = f2.denominator === 2 ? 3 : f2.denominator + 1
		const alternativeMaxNumerator = Math.max(
			1,
			Math.floor(alternativeDenominator / 2)
		)
		const alternativeNumerator = Math.min(
			alternativeMaxNumerator,
			f2.numerator + 1
		)
		f2 = simplifyFraction({
			numerator: alternativeNumerator,
			denominator: alternativeDenominator
		})
	}

	const correctAnswer = addFractions(f1, f2)

	// Distractors are generated based on common student misconceptions.
	// Each distractor is tagged with its error type for targeted feedback.
	const distractors: {
		fraction: Fraction
		type:
			| "ADD_ACROSS"
			| "ADD_NUM_KEEP_DEN"
			| "MULTIPLY_DENOMINATORS_ONLY"
			| "FORGOT_TO_SIMPLIFY"
	}[] = [
		{
			// Most common error: Adding numerators and denominators directly
			fraction: simplifyFraction({
				numerator: f1.numerator + f2.numerator,
				denominator: f1.denominator + f2.denominator
			}),
			type: "ADD_ACROSS"
		},
		{
			// Common error: Adding numerators but keeping one denominator
			fraction: simplifyFraction({
				numerator: f1.numerator + f2.numerator,
				denominator: f1.denominator // Uses first denominator
			}),
			type: "ADD_NUM_KEEP_DEN"
		},
		{
			// Error: Multiplying denominators but adding numerators incorrectly
			fraction: simplifyFraction({
				numerator: f1.numerator + f2.numerator, // Should be cross-multiplied
				denominator: f1.denominator * f2.denominator
			}),
			type: "MULTIPLY_DENOMINATORS_ONLY"
		},
		{
			// Show unsimplified correct answer if it's different from simplified
			fraction: {
				numerator:
					f1.numerator * f2.denominator + f2.numerator * f1.denominator,
				denominator: f1.denominator * f2.denominator
			},
			type: "FORGOT_TO_SIMPLIFY"
		}
	]

	// --- 3c. Assemble and Deterministically Sort Choices ---
	type ChoiceType = (typeof distractors)[number]["type"] | "CORRECT"

	type ChoiceOption = {
		fraction: Fraction
		isCorrect: boolean
		type: ChoiceType
	}

	const allChoices: ChoiceOption[] = [
		{ fraction: correctAnswer, isCorrect: true, type: "CORRECT" },
		...distractors.map(
			(d): ChoiceOption => ({
				fraction: d.fraction,
				isCorrect: false,
				type: d.type
			})
		)
	]

	// Filter out any distractors that happen to equal the correct answer.
	const uniqueChoices: ChoiceOption[] = allChoices.filter(
		(choice, index, self) =>
			index ===
			self.findIndex(
				(c) =>
					c.fraction.numerator === choice.fraction.numerator &&
					c.fraction.denominator === choice.fraction.denominator
			)
	)

	// Ensure exactly 4 choices for a consistent user experience.
	while (uniqueChoices.length < 4) {
		uniqueChoices.push({
			fraction: {
				numerator: uniqueChoices.length + correctAnswer.numerator,
				denominator: correctAnswer.denominator + uniqueChoices.length
			},
			isCorrect: false,
			type: "ADD_ACROSS" // Fallback type
		})
	}

	// Sort choices by their decimal value to ensure a deterministic, non-random order.
	const finalChoices: ChoiceOption[] = uniqueChoices
		.slice(0, 4)
		.sort(
			(a, b) =>
				a.fraction.numerator / a.fraction.denominator -
				b.fraction.numerator / b.fraction.denominator
		)

	if (finalChoices.length !== PLAN_CHOICE_IDS.length) {
		logger.error("fraction addition template: unexpected choice count", {
			finalChoiceCount: finalChoices.length,
			expected: PLAN_CHOICE_IDS.length
		})
		throw errors.new("fraction addition template: unable to enumerate choices")
	}

	const [choice0, choice1, choice2, choice3] = finalChoices
	if (!choice0 || !choice1 || !choice2 || !choice3) {
		logger.error("fraction addition template: missing choice after slicing")
		throw errors.new("fraction addition template: missing choice entry")
	}

	const [combo0, combo1, combo2, combo3] = feedbackPlan.combinations
	if (!combo0 || !combo1 || !combo2 || !combo3) {
		logger.error(
			"fraction addition template: feedback plan missing combinations"
		)
		throw errors.new("fraction addition template: invalid feedback plan")
	}

	const expectedCombinationIds: readonly PlanCombinationId[] = [
		"FB__RESPONSE_CHOICE_0",
		"FB__RESPONSE_CHOICE_1",
		"FB__RESPONSE_CHOICE_2",
		"FB__RESPONSE_CHOICE_3"
	]

	const actualCombinationIds: readonly PlanCombinationId[] = [
		combo0.id,
		combo1.id,
		combo2.id,
		combo3.id
	]

	for (let index = 0; index < expectedCombinationIds.length; index += 1) {
		if (actualCombinationIds[index] !== expectedCombinationIds[index]) {
			logger.error("fraction addition template: unexpected combination order", {
				expected: expectedCombinationIds,
				actual: actualCombinationIds
			})
			throw errors.new("fraction addition template: invalid combination order")
		}
	}

	const combinationEntries: Array<{
		combination: PlanCombinations[number]
		choice: ChoiceOption
	}> = [
		{ combination: combo0, choice: choice0 },
		{ combination: combo1, choice: choice1 },
		{ combination: combo2, choice: choice2 },
		{ combination: combo3, choice: choice3 }
	]

	for (const entry of combinationEntries) {
		if (entry.combination.path.length !== 1) {
			logger.error("fraction addition template: unexpected path length", {
				combinationId: entry.combination.id,
				pathLength: entry.combination.path.length
			})
			throw errors.new("fraction addition template: invalid combination path")
		}
	}

	const correctEntry =
		combinationEntries.find((entry) => entry.choice.isCorrect) ??
		combinationEntries[0]
	const firstPathSegment = correctEntry.combination.path[0]
	if (firstPathSegment === undefined) {
		logger.error(
			"fraction addition template: missing path segment for correct combination",
			{ combinationId: correctEntry.combination.id }
		)
		throw errors.new("fraction addition template: invalid correct combination")
	}
	const correctChoiceIdentifier = firstPathSegment.key

	const commonDenom = f1.denominator * f2.denominator
	const num1Expanded = Math.abs(f1.numerator) * f2.denominator
	const num2Expanded = Math.abs(f2.numerator) * f1.denominator
	const sumNumerator = num1Expanded + num2Expanded

	const sharedPedagogy: FeedbackSharedPedagogy<TemplateWidgets> = {
		steps: [
			{
				type: "step",
				title: [
					{
						type: "text",
						content: "Align the denominators so the parts match"
					}
				],
				content: [
					{
						type: "paragraph",
						content: [
							{
								type: "text",
								content:
									"Multiply each denominator so both fractions describe the same sized pieces: "
							},
							{
								type: "math",
								mathml: `<mn>${f1.denominator}</mn><mo>×</mo><mn>${f2.denominator}</mn><mo>=</mo><mn>${commonDenom}</mn>`
							},
							{ type: "text", content: "." }
						]
					}
				]
			},
			{
				type: "step",
				title: [
					{
						type: "text",
						content: "Scale each fraction to that shared denominator"
					}
				],
				content: [
					{
						type: "paragraph",
						content: [
							{ type: "text", content: "Convert " },
							{ type: "math", mathml: formatFractionMathML(f1) },
							{ type: "text", content: " to " },
							{
								type: "math",
								mathml: `<mfrac><mn>${num1Expanded}</mn><mn>${commonDenom}</mn></mfrac>`
							},
							{ type: "text", content: " and " },
							{ type: "math", mathml: formatFractionMathML(f2) },
							{ type: "text", content: " to " },
							{
								type: "math",
								mathml: `<mfrac><mn>${num2Expanded}</mn><mn>${commonDenom}</mn></mfrac>`
							},
							{ type: "text", content: " so their pieces now match." }
						]
					}
				]
			},
			{
				type: "step",
				title: [
					{
						type: "text",
						content: "Add the matching pieces and simplify"
					}
				],
				content: [
					{
						type: "paragraph",
						content: [
							{ type: "text", content: "Combine the scaled numerators: " },
							{
								type: "math",
								mathml: `<mfrac><mn>${num1Expanded}</mn><mn>${commonDenom}</mn></mfrac><mo>+</mo><mfrac><mn>${num2Expanded}</mn><mn>${commonDenom}</mn></mfrac><mo>=</mo><mfrac><mn>${sumNumerator}</mn><mn>${commonDenom}</mn></mfrac>`
							},
							{ type: "text", content: ", then reduce to " },
							{ type: "math", mathml: formatFractionMathML(correctAnswer) },
							{ type: "text", content: "." }
						]
					}
				]
			}
		],
		solution: {
			type: "solution",
			content: [
				{ type: "text", content: "Therefore, the correct sum is " },
				{ type: "math", mathml: formatFractionMathML(correctAnswer) },
				{ type: "text", content: "." }
			]
		}
	}

	const buildPreambleForChoice = (
		choice: (typeof finalChoices)[number]
	): FeedbackPreamble => {
		switch (choice.type) {
			case "CORRECT":
				return {
					correctness: "correct",
					summary: [
						{ type: "text", content: "Great work—your choice " },
						{ type: "math", mathml: formatFractionMathML(correctAnswer) },
						{ type: "text", content: " shows you aligned " },
						{ type: "math", mathml: formatFractionMathML(f1) },
						{ type: "text", content: " and " },
						{ type: "math", mathml: formatFractionMathML(f2) },
						{
							type: "text",
							content: " to a shared denominator and simplified correctly."
						}
					]
				}
			case "ADD_ACROSS":
				return {
					correctness: "incorrect",
					summary: [
						{ type: "text", content: "You chose " },
						{ type: "math", mathml: formatFractionMathML(choice.fraction) },
						{ type: "text", content: " by adding the numerators " },
						{
							type: "math",
							mathml: `<mn>${f1.numerator}</mn><mo>+</mo><mn>${f2.numerator}</mn>`
						},
						{ type: "text", content: " and the denominators " },
						{
							type: "math",
							mathml: `<mn>${f1.denominator}</mn><mo>+</mo><mn>${f2.denominator}</mn>`
						},
						{
							type: "text",
							content: ", which changes the size of each fractional part."
						}
					]
				}
			case "ADD_NUM_KEEP_DEN":
				return {
					correctness: "incorrect",
					summary: [
						{ type: "text", content: "You picked " },
						{ type: "math", mathml: formatFractionMathML(choice.fraction) },
						{ type: "text", content: " by adding the numerators " },
						{
							type: "math",
							mathml: `<mn>${f1.numerator}</mn><mo>+</mo><mn>${f2.numerator}</mn>`
						},
						{ type: "text", content: " but leaving the denominator at " },
						{ type: "math", mathml: `<mn>${f1.denominator}</mn>` },
						{
							type: "text",
							content: ", so the two addends never described equal parts."
						}
					]
				}
			case "MULTIPLY_DENOMINATORS_ONLY":
				return {
					correctness: "incorrect",
					summary: [
						{ type: "text", content: "You submitted " },
						{ type: "math", mathml: formatFractionMathML(choice.fraction) },
						{ type: "text", content: ", which keeps the numerators " },
						{
							type: "math",
							mathml: `<mn>${f1.numerator}</mn><mo>+</mo><mn>${f2.numerator}</mn>`
						},
						{ type: "text", content: " while multiplying the denominator to " },
						{ type: "math", mathml: `<mn>${commonDenom}</mn>` },
						{
							type: "text",
							content:
								"; numerator and denominator must scale by the same factor."
						}
					]
				}
			case "FORGOT_TO_SIMPLIFY":
				return {
					correctness: "incorrect",
					summary: [
						{ type: "text", content: "You reached " },
						{ type: "math", mathml: formatFractionMathML(choice.fraction) },
						{ type: "text", content: ", which equals the correct sum " },
						{ type: "math", mathml: formatFractionMathML(correctAnswer) },
						{
							type: "text",
							content:
								" but still needs to be divided by the greatest common divisor."
						}
					]
				}
			default:
				logger.error("unsupported choice type for feedback preamble")
				throw errors.new("unsupported choice type for feedback preamble")
		}
	}

	const preambles: FeedbackPreambleMap<typeof feedbackPlan> = {
		FB__RESPONSE_CHOICE_0: buildPreambleForChoice(choice0),
		FB__RESPONSE_CHOICE_1: buildPreambleForChoice(choice1),
		FB__RESPONSE_CHOICE_2: buildPreambleForChoice(choice2),
		FB__RESPONSE_CHOICE_3: buildPreambleForChoice(choice3)
	}

	const feedbackBundle: FeedbackBundle<typeof feedbackPlan, TemplateWidgets> = {
		shared: sharedPedagogy,
		preambles
	}

	// --- 3d. Construct the Final AssessmentItemInput Object ---
	// --- 3d. Construct the Final AssessmentItemInput Object ---
	// TODO: Update this template to use feedbackPlan + map structure
	const assessmentItem = {
		identifier: `fraction-addition-seed-${seed.toString()}`,
		title: `Fraction Addition: ${f1.numerator}/${f1.denominator} + ${f2.numerator}/${f2.denominator}`,

		body: [
			{
				type: "paragraph",
				content: [
					{
						type: "text",
						content:
							"What is the sum of the fractions below? Give your answer in simplest form."
					}
				]
			},
			{
				type: "paragraph",
				content: [
					{
						type: "math",
						mathml: `${formatFractionMathML(f1)}<mo>+</mo>${formatFractionMathML(f2)}`
					}
				]
			},
			// removed sum_visual slot to avoid missing widget error in compiler-only POC
			{ type: "interactionRef", interactionId: "choice_interaction" }
		],

		widgets: {
			sum_visual: {
				type: "partitionedShape",
				width: 400,
				height: 300,
				mode: "partition",
				layout: "horizontal",
				overlays: [],
				shapes: [
					{
						type: "rectangle",
						totalParts: correctAnswer.denominator,
						shadedCells: Array.from(
							{ length: correctAnswer.numerator },
							(_, i) => i
						),
						hatchedCells: [],
						rows: 1,
						columns: correctAnswer.denominator,
						shadeColor: "#4CAF50B3",
						shadeOpacity: 0.7
					}
				]
			}
		},

		interactions: {
			choice_interaction: {
				type: "choiceInteraction",
				responseIdentifier: "RESPONSE",
				shuffle: true, // Always shuffle choices to ensure fairness.
				minChoices: 1,
				maxChoices: 1,
				prompt: [{ type: "text", content: "Select the correct sum." }],
				choices: finalChoices.map((choice, index) => {
					const choiceId = PLAN_CHOICE_IDS[index]
					if (choiceId === undefined) {
						logger.error("missing choice identifier during template assembly", {
							index,
							identifierCount: PLAN_CHOICE_IDS.length
						})
						throw errors.new("missing choice identifier")
					}
					return {
						identifier: choiceId,
						content: [
							{
								type: "paragraph",
								content: [
									{
										type: "math",
										mathml: formatFractionMathML(choice.fraction)
									}
								]
							}
						]
					}
				})
			}
		},

		responseDeclarations: [
			{
				identifier: "RESPONSE",
				cardinality: "single",
				baseType: "identifier",
				correct: correctChoiceIdentifier
			}
		],

		feedbackPlan,
		feedback: feedbackBundle
	} satisfies AssessmentItemInput<TemplateWidgets, typeof feedbackPlan>

	return assessmentItem
}

// -----------------------------------------------------------------------------
// 4. EXPORT
// -----------------------------------------------------------------------------

export default generateFractionAdditionQuestion
