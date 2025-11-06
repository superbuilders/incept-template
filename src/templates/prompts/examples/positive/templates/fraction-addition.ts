// -----------------------------------------------------------------------------
// 1. IMPORTS
// The template only imports what is absolutely necessary: core item types,
// shared seed utilities, and widget typing helpers.
// -----------------------------------------------------------------------------

import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type { FeedbackContent } from "@/core/content/types"
import type { FeedbackPlan } from "@/core/feedback/plan/types"
import type { AssessmentItemInput } from "@/core/item/types"
import { createSeededRandom } from "@/templates/seeds"
import type { TemplateModule } from "@/templates/types"

// Define the exact widget tuple used by this template
// The template includes a 'partitionedShape' widget in the widgets map below
export type TemplateWidgets = readonly ["partitionedShape"]

type FractionAdditionFeedbackPlan = ReturnType<typeof buildFeedbackPlan>

function buildFeedbackPlan(choiceIdentifiers: readonly string[]) {
	return {
		mode: "combo" as const,
		dimensions: [
			{
				responseIdentifier: "RESPONSE",
				kind: "enumerated",
				keys: choiceIdentifiers
			}
		],
		combinations: choiceIdentifiers.map((choiceId) => ({
			id: `FB__RESPONSE_${choiceId}`,
			path: [{ responseIdentifier: "RESPONSE", key: choiceId }]
		}))
	} satisfies FeedbackPlan
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
	FractionAdditionFeedbackPlan
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
	const allChoices = [
		{ fraction: correctAnswer, isCorrect: true, type: "CORRECT" as const },
		...distractors.map((d) => ({ ...d, isCorrect: false }))
	]

	// Filter out any distractors that happen to equal the correct answer.
	const uniqueChoices = allChoices.filter(
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
	const finalChoices = uniqueChoices
		.slice(0, 4)
		.sort(
			(a, b) =>
				a.fraction.numerator / a.fraction.denominator -
				b.fraction.numerator / b.fraction.denominator
		)

	const correctChoiceIndex = finalChoices.findIndex((c) => c.isCorrect)
	const choiceIdentifiers = finalChoices.map((_, i) => `CHOICE_${i}`)
	const correctChoiceIdentifier =
		correctChoiceIndex >= 0
			? choiceIdentifiers[correctChoiceIndex]
			: choiceIdentifiers[0]

	const feedbackPlan = buildFeedbackPlan(choiceIdentifiers)

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
					const choiceId = choiceIdentifiers[index]
					if (choiceId === undefined) {
						logger.error("missing choice identifier during template assembly", {
							index,
							identifierCount: choiceIdentifiers.length
						})
						throw errors.new("missing choice identifier")
					}
					return {
						identifier: choiceId,
						content: [
							{
								type: "paragraph" as const,
								content: [
									{
										type: "math" as const,
										mathml: formatFractionMathML(choice.fraction)
									}
								]
							}
						]
						// REMOVED: The `feedback` field is no longer supported on choices.
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
		feedback: {
			FEEDBACK__OVERALL: {
				RESPONSE: Object.fromEntries(
					finalChoices.map((choice, index) => {
						const choiceId = choiceIdentifiers[index]
						if (choiceId === undefined) {
							logger.error(
								"missing choice identifier during feedback construction",
								{ index, identifierCount: choiceIdentifiers.length }
							)
							throw errors.new("missing choice identifier for feedback")
						}
						// Helper values for worked example
						const commonDenom = f1.denominator * f2.denominator
						const num1Expanded = Math.abs(f1.numerator) * f2.denominator
						const num2Expanded = Math.abs(f2.numerator) * f1.denominator
						const sumNumerator = num1Expanded + num2Expanded

						let feedbackContent: FeedbackContent<TemplateWidgets>

						switch (choice.type) {
							case "CORRECT":
								feedbackContent = {
									preamble: {
										correctness: "correct",
										summary: [
											{ type: "text", content: "Great work—your choice " },
											{
												type: "math",
												mathml: formatFractionMathML(correctAnswer)
											},
											{
												type: "text",
												content: " shows you aligned "
											},
											{
												type: "math",
												mathml: formatFractionMathML(f1)
											},
											{ type: "text", content: " and " },
											{
												type: "math",
												mathml: formatFractionMathML(f2)
											},
											{
												type: "text",
												content:
													" to a shared denominator and simplified correctly."
											}
										]
									},
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
													content:
														"Scale each fraction to that shared denominator"
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
														{
															type: "text",
															content: " so their pieces now match."
														}
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
														{
															type: "text",
															content: "Combine the scaled numerators: "
														},
														{
															type: "math",
															mathml: `<mfrac><mn>${num1Expanded}</mn><mn>${commonDenom}</mn></mfrac><mo>+</mo><mfrac><mn>${num2Expanded}</mn><mn>${commonDenom}</mn></mfrac><mo>=</mo><mfrac><mn>${sumNumerator}</mn><mn>${commonDenom}</mn></mfrac>`
														},
														{
															type: "text",
															content: ", then reduce to "
														},
														{
															type: "math",
															mathml: formatFractionMathML(correctAnswer)
														},
														{ type: "text", content: "." }
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
												content: "Therefore, the correct sum is "
											},
											{
												type: "math",
												mathml: formatFractionMathML(correctAnswer)
											},
											{ type: "text", content: "." }
										]
									}
								}
								break

							case "ADD_ACROSS":
								feedbackContent = {
									preamble: {
										correctness: "incorrect",
										summary: [
											{ type: "text", content: "You chose " },
											{
												type: "math",
												mathml: formatFractionMathML(choice.fraction)
											},
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
												content:
													", which changes the size of each fractional part."
											}
										]
									},
									steps: [
										{
											type: "step",
											title: [
												{
													type: "text",
													content: "Match the size of each fractional part"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content:
																"Keep denominators steady while you add. Multiply each denominator so both fractions share "
														},
														{
															type: "math",
															mathml: `<mn>${commonDenom}</mn>`
														},
														{
															type: "text",
															content:
																", giving you equal-sized pieces to combine."
														}
													]
												}
											]
										},
										{
											type: "step",
											title: [
												{
													type: "text",
													content:
														"Rewrite both fractions using the shared denominator"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content: "Convert the first addend: "
														},
														{
															type: "math",
															mathml: `<mfrac><mn>${Math.abs(
																f1.numerator
															)}</mn><mn>${f1.denominator}</mn></mfrac><mo>=</mo><mfrac><mn>${num1Expanded}</mn><mn>${commonDenom}</mn></mfrac>`
														}
													]
												},
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content: "Convert the second addend: "
														},
														{
															type: "math",
															mathml: `<mfrac><mn>${Math.abs(
																f2.numerator
															)}</mn><mn>${f2.denominator}</mn></mfrac><mo>=</mo><mfrac><mn>${num2Expanded}</mn><mn>${commonDenom}</mn></mfrac>`
														},
														{
															type: "text",
															content:
																" so both fractions talk about the same whole."
														}
													]
												}
											]
										},
										{
											type: "step",
											title: [
												{
													type: "text",
													content: "Add the aligned numerators and simplify"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content:
																"Now add the converted fractions without touching the denominator: "
														},
														{
															type: "math",
															mathml: `<mfrac><mn>${num1Expanded}</mn><mn>${commonDenom}</mn></mfrac><mo>+</mo><mfrac><mn>${num2Expanded}</mn><mn>${commonDenom}</mn></mfrac><mo>=</mo><mfrac><mn>${sumNumerator}</mn><mn>${commonDenom}</mn></mfrac>`
														},
														{
															type: "text",
															content:
																", then reduce the result to the simplified fraction "
														},
														{
															type: "math",
															mathml: formatFractionMathML(correctAnswer)
														},
														{ type: "text", content: "." }
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
												content: "Therefore, the correct sum is "
											},
											{
												type: "math",
												mathml: formatFractionMathML(correctAnswer)
											},
											{
												type: "text",
												content: "."
											}
										]
									}
								}
								break

							case "ADD_NUM_KEEP_DEN":
								feedbackContent = {
									preamble: {
										correctness: "incorrect",
										summary: [
											{ type: "text", content: "You picked " },
											{
												type: "math",
												mathml: formatFractionMathML(choice.fraction)
											},
											{ type: "text", content: " by adding the numerators " },
											{
												type: "math",
												mathml: `<mn>${f1.numerator}</mn><mo>+</mo><mn>${f2.numerator}</mn>`
											},
											{
												type: "text",
												content: " but leaving the denominator at "
											},
											{
												type: "math",
												mathml: `<mn>${f1.denominator}</mn>`
											},
											{
												type: "text",
												content:
													", so the two addends never described equal parts."
											}
										]
									},
									steps: [
										{
											type: "step",
											title: [
												{
													type: "text",
													content: "Check that denominators match before adding"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content:
																"Only numerators add; denominators must already be equal. We need to express both fractions in the same-size pieces before combining them."
														}
													]
												}
											]
										},
										{
											type: "step",
											title: [
												{
													type: "text",
													content:
														"Rewrite each fraction with the shared denominator"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content:
																"Convert the first fraction to the shared denominator "
														},
														{ type: "math", mathml: `<mn>${commonDenom}</mn>` },
														{
															type: "math",
															mathml: `<mo>:</mo><mfrac><mn>${Math.abs(
																f1.numerator
															)}</mn><mn>${f1.denominator}</mn></mfrac><mo>=</mo><mfrac><mn>${num1Expanded}</mn><mn>${commonDenom}</mn></mfrac>`
														}
													]
												},
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content:
																"Convert the second fraction the same way: "
														},
														{
															type: "math",
															mathml: `<mfrac><mn>${Math.abs(
																f2.numerator
															)}</mn><mn>${f2.denominator}</mn></mfrac><mo>=</mo><mfrac><mn>${num2Expanded}</mn><mn>${commonDenom}</mn></mfrac>`
														},
														{
															type: "text",
															content: ", so both now talk about equal parts."
														}
													]
												}
											]
										},
										{
											type: "step",
											title: [
												{
													type: "text",
													content: "Add the aligned numerators and simplify"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content: "Now add the rewritten fractions: "
														},
														{
															type: "math",
															mathml: `<mfrac><mn>${num1Expanded}</mn><mn>${commonDenom}</mn></mfrac><mo>+</mo><mfrac><mn>${num2Expanded}</mn><mn>${commonDenom}</mn></mfrac><mo>=</mo><mfrac><mn>${sumNumerator}</mn><mn>${commonDenom}</mn></mfrac>`
														},
														{
															type: "text",
															content: ", then reduce the result to "
														},
														{
															type: "math",
															mathml: formatFractionMathML(correctAnswer)
														},
														{ type: "text", content: "." }
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
												content: "Therefore, the correct sum is "
											},
											{
												type: "math",
												mathml: formatFractionMathML(correctAnswer)
											},
											{
												type: "text",
												content: "."
											}
										]
									}
								}
								break

							case "MULTIPLY_DENOMINATORS_ONLY":
								feedbackContent = {
									preamble: {
										correctness: "incorrect",
										summary: [
											{ type: "text", content: "You submitted " },
											{
												type: "math",
												mathml: formatFractionMathML(choice.fraction)
											},
											{
												type: "text",
												content: ", which keeps the numerators "
											},
											{
												type: "math",
												mathml: `<mn>${f1.numerator}</mn><mo>+</mo><mn>${f2.numerator}</mn>`
											},
											{
												type: "text",
												content: " while multiplying the denominator to "
											},
											{
												type: "math",
												mathml: `<mn>${f1.denominator * f2.denominator}</mn>`
											},
											{
												type: "text",
												content:
													"; numerator and denominator must scale by the same factor."
											}
										]
									},
									steps: [
										{
											type: "step",
											title: [
												{
													type: "text",
													content: "Scale numerator and denominator together"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content:
																"Equivalent fractions multiply both numerator and denominator by the same factor so the pieces stay the same size: "
														},
														{
															type: "math",
															mathml:
																"<mfrac><mi>a</mi><mi>b</mi></mfrac><mo>=</mo><mfrac><mrow><mi>a</mi><mo>×</mo><mi>k</mi></mrow><mrow><mi>b</mi><mo>×</mo><mi>k</mi></mrow></mfrac>"
														}
													]
												}
											]
										},
										{
											type: "step",
											title: [
												{
													type: "text",
													content:
														"Convert each fraction using the shared denominator"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{ type: "text", content: "First fraction: " },
														{
															type: "math",
															mathml: `<mfrac><mn>${Math.abs(
																f1.numerator
															)}</mn><mn>${f1.denominator}</mn></mfrac><mo>=</mo><mfrac><mn>${num1Expanded}</mn><mn>${commonDenom}</mn></mfrac>`
														},
														{ type: "text", content: "." }
													]
												},
												{
													type: "paragraph",
													content: [
														{ type: "text", content: "Second fraction: " },
														{
															type: "math",
															mathml: `<mfrac><mn>${Math.abs(
																f2.numerator
															)}</mn><mn>${f2.denominator}</mn></mfrac><mo>=</mo><mfrac><mn>${num2Expanded}</mn><mn>${commonDenom}</mn></mfrac>`
														},
														{
															type: "text",
															content:
																". Both fractions now talk about equal-sized pieces."
														}
													]
												}
											]
										},
										{
											type: "step",
											title: [
												{
													type: "text",
													content: "Add the converted fractions and simplify"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content: "Add the aligned fractions: "
														},
														{
															type: "math",
															mathml: `<mfrac><mn>${num1Expanded}</mn><mn>${commonDenom}</mn></mfrac><mo>+</mo><mfrac><mn>${num2Expanded}</mn><mn>${commonDenom}</mn></mfrac><mo>=</mo><mfrac><mn>${sumNumerator}</mn><mn>${commonDenom}</mn></mfrac>`
														},
														{
															type: "text",
															content: ", then reduce to "
														},
														{
															type: "math",
															mathml: formatFractionMathML(correctAnswer)
														},
														{ type: "text", content: "." }
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
												content: "Therefore, the correct sum is "
											},
											{
												type: "math",
												mathml: formatFractionMathML(correctAnswer)
											},
											{
												type: "text",
												content: "."
											}
										]
									}
								}
								break

							case "FORGOT_TO_SIMPLIFY":
								feedbackContent = {
									preamble: {
										correctness: "incorrect",
										summary: [
											{ type: "text", content: "You reached " },
											{
												type: "math",
												mathml: formatFractionMathML(choice.fraction)
											},
											{
												type: "text",
												content: ", which equals the correct sum "
											},
											{
												type: "math",
												mathml: formatFractionMathML(correctAnswer)
											},
											{
												type: "text",
												content:
													" but still needs to be divided by the greatest common divisor."
											}
										]
									},
									steps: [
										{
											type: "step",
											title: [
												{
													type: "text",
													content:
														"Compare your fraction with the simplified form"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{ type: "text", content: "Your answer " },
														{
															type: "math",
															mathml: formatFractionMathML(choice.fraction)
														},
														{ type: "text", content: " equals " },
														{
															type: "math",
															mathml: formatFractionMathML(correctAnswer)
														},
														{
															type: "text",
															content:
																" after reducing, so you are one step away."
														}
													]
												}
											]
										},
										{
											type: "step",
											title: [
												{
													type: "text",
													content:
														"Find the greatest factor shared by numerator and denominator"
												}
											],
											content: [
												{
													type: "paragraph",
													content: [
														{
															type: "text",
															content: `The numerator ${sumNumerator} and denominator ${commonDenom} share a greatest common divisor of ${gcd(sumNumerator, commonDenom)}. Use that number to reduce the fraction.`
														}
													]
												}
											]
										},
										{
											type: "step",
											title: [
												{ type: "text", content: "Divide by the GCD to finish" }
											],
											content: [
												{
													type: "paragraph",
													content: [
														{ type: "text", content: "Compute " },
														{
															type: "math",
															mathml: `<mfrac><mrow><mn>${sumNumerator}</mn><mo>÷</mo><mn>${gcd(
																sumNumerator,
																commonDenom
															)}</mn></mrow><mrow><mn>${commonDenom}</mn><mo>÷</mo><mn>${gcd(
																sumNumerator,
																commonDenom
															)}</mn></mrow></mfrac>`
														},
														{ type: "text", content: " = " },
														{
															type: "text",
															content:
																"which reduces directly to the simplified fraction "
														},
														{
															type: "math",
															mathml: formatFractionMathML(correctAnswer)
														},
														{ type: "text", content: "." }
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
												content: "Therefore, the correct sum is "
											},
											{
												type: "math",
												mathml: formatFractionMathML(correctAnswer)
											},
											{
												type: "text",
												content: "."
											}
										]
									}
								}
								break
						}

						return [choiceId, { content: feedbackContent }] as const
					})
				)
			}
		}
	} satisfies AssessmentItemInput<TemplateWidgets, typeof feedbackPlan>

	return assessmentItem
}

// -----------------------------------------------------------------------------
// 4. EXPORT
// -----------------------------------------------------------------------------

export default generateFractionAdditionQuestion
