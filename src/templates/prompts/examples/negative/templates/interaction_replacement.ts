import type { FeedbackContent } from "@/core/content/types"
import type { ComboPlan } from "@/core/feedback/plan/types"
import type { AssessmentItemInput } from "@/core/item/types"
import { createSeededRandom } from "@/templates/seeds"

export type TemplateWidgets = readonly ["dotPlot"]

export default function generateTemplate(
	seed: bigint
): AssessmentItemInput<TemplateWidgets, typeof feedbackPlan> {
	const random = createSeededRandom(seed)

	// Deterministic text pools
	const names = [
		"Avery",
		"Blake",
		"Casey",
		"Drew",
		"Elliot",
		"Jordan",
		"Riley",
		"Taylor"
	]
	const subjects = [
		{ singular: "shell", plural: "shells" },
		{ singular: "sticker", plural: "stickers" },
		{ singular: "marble", plural: "marbles" },
		{ singular: "coin", plural: "coins" },
		{ singular: "book", plural: "books" },
		{ singular: "bead", plural: "beads" }
	]

	const chosenName = names[random.nextInt(0, names.length - 1)]
	const chosenSubject = subjects[random.nextInt(0, subjects.length - 1)]

	// Axis configuration driven by seed
	const intervalOptions = [1, 2, 5]
	const tickInterval =
		intervalOptions[random.nextInt(0, intervalOptions.length - 1)]

	// Choose a base min in [6, 24], then align to interval
	const minBase = random.nextInt(6, 24)
	const axisMin = minBase - (minBase % tickInterval)

	// Choose number of intervals [6..9] → 7..10 ticks
	const intervalCount = random.nextInt(6, 9)
	const axisMax = axisMin + intervalCount * tickInterval

	// Build ticks
	const ticks: number[] = Array.from(
		{ length: intervalCount + 1 },
		(_, i) => axisMin + i * tickInterval
	)

	// Select a subset of ticks where dots appear (at least 4)
	const selectedValuesSet = new Set<number>()
	for (let i = 0; i < ticks.length; i++) {
		const mustIncludeEdge = i === 0 || i === ticks.length - 1
		const include = mustIncludeEdge ? random.nextBoolean() : random.next() < 0.5
		if (include) {
			selectedValuesSet.add(ticks[i])
		}
	}
	while (selectedValuesSet.size < 4) {
		selectedValuesSet.add(ticks[random.nextInt(0, ticks.length - 1)])
	}
	const selectedValues = Array.from(selectedValuesSet).sort((a, b) => a - b)

	// Assign counts (0..5), ensure at least one dot overall
	const countsByValue: Record<string, number> = {}
	let totalDots = 0
	let maxCount = 0
	for (const v of selectedValues) {
		const c = random.nextInt(0, 5)
		countsByValue[String(v)] = c
		totalDots += c
		if (c > maxCount) maxCount = c
	}
	if (totalDots === 0) {
		const bumpIndex = random.nextInt(0, selectedValues.length - 1)
		const bumpVal = selectedValues[bumpIndex]
		countsByValue[String(bumpVal)] = 1
		totalDots = 1
		maxCount = Math.max(maxCount, 1)
	}

	// Choose a single asked value from the selected set
	const askedValue =
		selectedValues[random.nextInt(0, selectedValues.length - 1)]
	const correctCount = countsByValue[String(askedValue)] ?? 0

	// Widget configuration (dot plot)
	const dotColors = ["#4472C4", "#4CAF50", "#D9534F", "#9C27B0"]
	const dotColor = dotColors[random.nextInt(0, dotColors.length - 1)]
	const dotRadius = 4 + random.nextInt(0, 2) // 4..6
	const widgetId = "dot_plot_main"

	// Prepare widget data from selectedValues
	const widgetData = selectedValues.map((v) => ({
		value: v,
		count: countsByValue[String(v)] ?? 0
	}))

	// Build options for the single question
	// Start with correct, 0, maxCount, totalDots, and ±1 neighbors if needed
	const optionNumbersSet = new Set<number>()
	optionNumbersSet.add(correctCount)
	optionNumbersSet.add(0)
	optionNumbersSet.add(maxCount)
	optionNumbersSet.add(totalDots)

	const neighborOffsets = [1, -1, 2, -2]
	for (const off of neighborOffsets) {
		if (optionNumbersSet.size >= 4) break
		const candidate = correctCount + off
		if (candidate >= 0 && candidate <= Math.max(5, maxCount + 1)) {
			optionNumbersSet.add(candidate)
		}
	}
	// Ensure at least 4 unique options
	while (optionNumbersSet.size < 4) {
		optionNumbersSet.add(random.nextInt(0, Math.max(5, maxCount + 2)))
	}
	const optionNumbers = Array.from(optionNumbersSet.values()).sort(
		(a, b) => a - b
	)

	const choiceIdentifiers: string[] = optionNumbers.map((_, i) => `CHOICE_${i}`)
	const correctIndex = optionNumbers.indexOf(correctCount)
	const correctChoiceIdentifier =
		correctIndex >= 0 ? choiceIdentifiers[correctIndex] : choiceIdentifiers[0]

	// Feedback plan (combo) with one enumerated dimension
	const feedbackPlan = {
		mode: "combo",
		dimensions: [
			{
				responseIdentifier: "RESPONSE",
				kind: "enumerated",
				keys: [...choiceIdentifiers]
			}
		],
		combinations: choiceIdentifiers.map((choiceId) => ({
			id: `FB__RESPONSE_${choiceId}`,
			path: [{ responseIdentifier: "RESPONSE", key: choiceId }]
		}))
	} satisfies ComboPlan

	// Build feedback content per choice
	const buildCorrectFeedback = (): FeedbackContent<TemplateWidgets> => {
		return {
			preamble: {
				correctness: "correct",
				summary: [
					{
						type: "text",
						content: `You matched ${askedValue} to the ${correctCount} dot${correctCount === 1 ? "" : "s"} above it.`
					}
				]
			},
			steps: [
				{
					type: "step",
					title: [{ type: "text", content: "Read the column at the label" }],
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									content: `At ${askedValue}, count the stacked dots.`
								}
							]
						},
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									content: `There ${correctCount === 1 ? "is" : "are"} ${correctCount} dot${correctCount === 1 ? "" : "s"} in that column.`
								}
							]
						}
					]
				},
				{
					type: "step",
					title: [{ type: "text", content: "Quick reasonableness check" }],
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									content: `The plot shows ${totalDots} total data point${totalDots === 1 ? "" : "s"}. Your selected count fits within that total.`
								}
							]
						}
					]
				},
				{
					type: "step",
					title: [{ type: "text", content: "Confirm the final tally" }],
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									content: `Say out loud how many dots are stacked at ${askedValue} to double-check: ${correctCount}.`
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
						content: `Therefore, the count at ${askedValue} is ${correctCount}.`
					}
				]
			}
		}
	}

	const buildIncorrectFeedback = (
		chosen: number
	): FeedbackContent<TemplateWidgets> => {
		const diff = Math.abs(chosen - correctCount)
		let direction: "matched" | "too low" | "too high"
		if (chosen === correctCount) {
			direction = "matched"
		} else if (chosen < correctCount) {
			direction = "too low"
		} else {
			direction = "too high"
		}
		return {
			preamble: {
				correctness: "incorrect",
				summary: [
					{
						type: "text",
						content: `You selected ${chosen}, which is ${direction}. At ${askedValue}, the column has ${correctCount} dot${correctCount === 1 ? "" : "s"}.`
					}
				]
			},
			steps: [
				{
					type: "step",
					title: [{ type: "text", content: "Focus on one label at a time" }],
					content: [
						{ type: "widgetRef", widgetId, widgetType: "dotPlot" },
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									content:
										"Trace a vertical line directly above the label and count only the dots stacked in that column."
								}
							]
						}
					]
				},
				{
					type: "step",
					title: [{ type: "text", content: `Recount at ${askedValue}` }],
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									content: `${diff === 0 ? "Your count is already correct." : `You were off by ${diff}.`} At ${askedValue}, there ${correctCount === 1 ? "is" : "are"} ${correctCount} dot${correctCount === 1 ? "" : "s"}.`
								}
							]
						}
					]
				},
				{
					type: "step",
					title: [{ type: "text", content: "Check another column to verify" }],
					content: [
						{
							type: "paragraph",
							content: [
								{
									type: "text",
									content:
										"Pick a different label, count its dots, and compare the approach so you stay consistent each time."
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
						content: `Therefore, the correct count at ${askedValue} is ${correctCount}.`
					}
				]
			}
		}
	}

	const feedbackOverallMap = Object.fromEntries(
		choiceIdentifiers.map((choiceId, idx) => {
			const chosenNumber = optionNumbers[idx]
			const content =
				chosenNumber === correctCount
					? buildCorrectFeedback()
					: buildIncorrectFeedback(chosenNumber)
			return [choiceId, { content }] as const
		})
	)

	// Final assessment item
	const assessmentItem = {
		identifier: `dot-plot-single-frequency-${seed.toString()}`,
		title: `${chosenName}'s ${chosenSubject.plural}: interpreting a dot plot`,

		body: [
			{
				type: "paragraph",
				content: [
					{
						type: "text",
						content: `${chosenName} recorded how many ${chosenSubject.plural} people have. The dot plot shows the results.`
					}
				]
			},
			{ type: "widgetRef", widgetId, widgetType: "dotPlot" },
			{
				type: "paragraph",
				content: [
					{
						type: "text",
						content: `How many data points are at ${askedValue}?`
					}
				]
			},
			{ type: "interactionRef", interactionId: "choice_interaction" }
		],

		widgets: {
			[widgetId]: {
				type: "dotPlot",
				width: 420,
				height: 320,
				axis: {
					min: axisMin,
					max: axisMax,
					label: `Number of ${chosenSubject.plural}`,
					tickInterval
				},
				data: widgetData,
				dotColor,
				dotRadius
			}
		},

		interactions: {
			choice_interaction: {
				type: "choiceInteraction",
				responseIdentifier: "RESPONSE",
				shuffle: true,
				minChoices: 1,
				maxChoices: 1,
				prompt: [
					{
						type: "text",
						content: "Select the count shown by the dots."
					}
				],
				choices: optionNumbers.map((n, i) => ({
					identifier: choiceIdentifiers[i],
					content: [
						{
							type: "paragraph",
							content: [{ type: "text", content: String(n) }]
						}
					]
				}))
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
				RESPONSE: feedbackOverallMap
			}
		}
	} satisfies AssessmentItemInput<TemplateWidgets, typeof feedbackPlan>

	return assessmentItem
}
