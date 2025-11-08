import type { FeedbackCombination, FeedbackPlan } from "@/core/feedback/plan"
import type {
	ChoiceIdentifierTuple,
	FeedbackCombinationIdentifier
} from "@/core/identifiers"
import type { AssessmentItemInput } from "@/core/item"
import { createSeededRandom } from "@/templates/seeds"

export type TemplateWidgets = readonly ["dotPlot"]

type PlanDimensions = readonly [
	{ responseIdentifier: "RESP_A"; kind: "binary" },
	{ responseIdentifier: "RESP_B"; kind: "binary" },
	{ responseIdentifier: "RESP_C"; kind: "binary" }
]

const FEEDBACK_DIMENSIONS: PlanDimensions = [
	{ responseIdentifier: "RESP_A", kind: "binary" },
	{ responseIdentifier: "RESP_B", kind: "binary" },
	{ responseIdentifier: "RESP_C", kind: "binary" }
]

const FEEDBACK_COMBINATIONS = [
	{
		id: "FB__A",
		path: [
			{ responseIdentifier: "RESP_A", key: "CORRECT" },
			{ responseIdentifier: "RESP_B", key: "CORRECT" },
			{ responseIdentifier: "RESP_C", key: "CORRECT" }
		]
	},
	{
		id: "FB__B",
		path: [
			{ responseIdentifier: "RESP_A", key: "INCORRECT" },
			{ responseIdentifier: "RESP_B", key: "CORRECT" },
			{ responseIdentifier: "RESP_C", key: "CORRECT" }
		]
	},
	{
		id: "FB__C",
		path: [
			{ responseIdentifier: "RESP_A", key: "CORRECT" },
			{ responseIdentifier: "RESP_B", key: "INCORRECT" },
			{ responseIdentifier: "RESP_C", key: "CORRECT" }
		]
	},
	{
		id: "FB__D",
		path: [
			{ responseIdentifier: "RESP_A", key: "CORRECT" },
			{ responseIdentifier: "RESP_B", key: "CORRECT" },
			{ responseIdentifier: "RESP_C", key: "INCORRECT" }
		]
	},
	{
		id: "FB__E",
		path: [
			{ responseIdentifier: "RESP_A", key: "INCORRECT" },
			{ responseIdentifier: "RESP_B", key: "INCORRECT" },
			{ responseIdentifier: "RESP_C", key: "CORRECT" }
		]
	},
	{
		id: "FB__F",
		path: [
			{ responseIdentifier: "RESP_A", key: "INCORRECT" },
			{ responseIdentifier: "RESP_B", key: "CORRECT" },
			{ responseIdentifier: "RESP_C", key: "INCORRECT" }
		]
	},
	{
		id: "FB__G",
		path: [
			{ responseIdentifier: "RESP_A", key: "CORRECT" },
			{ responseIdentifier: "RESP_B", key: "INCORRECT" },
			{ responseIdentifier: "RESP_C", key: "INCORRECT" }
		]
	},
	{
		id: "FB__H",
		path: [
			{ responseIdentifier: "RESP_A", key: "INCORRECT" },
			{ responseIdentifier: "RESP_B", key: "INCORRECT" },
			{ responseIdentifier: "RESP_C", key: "INCORRECT" }
		]
	}
] as const satisfies readonly FeedbackCombination<
	FeedbackCombinationIdentifier,
	PlanDimensions
>[]

const feedbackPlan = {
	dimensions: FEEDBACK_DIMENSIONS,
	combinations: FEEDBACK_COMBINATIONS
} satisfies FeedbackPlan

export default function generateTemplate(
	seed: bigint
): AssessmentItemInput<TemplateWidgets, typeof feedbackPlan> {
	const random = createSeededRandom(seed)

	const text = (content: string) => ({ type: "text" as const, content })
	const mathNum = (n: number) => ({
		type: "math" as const,
		mathml: `<mn>${n}</mn>`
	})

	// Seeded narrative elements
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

	// Axis configuration (seed-driven)
	const intervalOptions = [1, 2, 5]
	const tickInterval =
		intervalOptions[random.nextInt(0, intervalOptions.length - 1)]
	const minBase = random.nextInt(6, 24)
	const axisMin = minBase - (minBase % tickInterval)
	const intervalCount = random.nextInt(6, 9)
	const axisMax = axisMin + intervalCount * tickInterval
	const ticks: number[] = Array.from(
		{ length: intervalCount + 1 },
		(_, i) => axisMin + i * tickInterval
	)

	// Assign counts per tick (0..5), ensure at least one dot overall
	const countsByTick: Record<number, number> = {}
	let dotsTotal = 0
	let maxCount = 0
	for (const t of ticks) {
		const c = random.nextInt(0, 5)
		countsByTick[t] = c
		dotsTotal += c
		if (c > maxCount) maxCount = c
	}
	if (dotsTotal === 0) {
		const bumpIndex = random.nextInt(0, ticks.length - 1)
		const bumpVal = ticks[bumpIndex]
		countsByTick[bumpVal] = 1
		dotsTotal = 1
		maxCount = Math.max(maxCount, 1)
	}

	// Select a 6-label window for the table
	const startIndexMax = Math.max(0, ticks.length - 6)
	const startIndex = random.nextInt(0, startIndexMax)
	const tableValues = ticks.slice(startIndex, startIndex + 6)

	// Choose 3 distinct asked positions within the 6
	const askedIndexSet = new Set<number>()
	while (askedIndexSet.size < 3) {
		askedIndexSet.add(random.nextInt(0, tableValues.length - 1))
	}
	const askedIndices = Array.from(askedIndexSet).sort((a, b) => a - b)
	const askedValues = askedIndices.map((i) => tableValues[i])

	const countAt = (value: number): number => countsByTick[value] ?? 0

	// Dropdown option pool: 0..5 plus one extra near (maxCount + 1), capped to 9
	const baseOptions = [0, 1, 2, 3, 4, 5]
	const extraCandidate = Math.min(9, Math.max(6, maxCount + 1))
	const optionNumbersSet = new Set<number>(baseOptions)
	optionNumbersSet.add(extraCandidate)
	const optionNumbers = Array.from(optionNumbersSet).sort((a, b) => a - b)

	const CHOICE_LETTERS = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J"
	] as const satisfies ChoiceIdentifierTuple<
		readonly ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
	>
	type ChoiceId = (typeof CHOICE_LETTERS)[number]

	const choiceIdForIndex = (idx: number): ChoiceId => CHOICE_LETTERS[idx] ?? "A"
	const identifierForCount = (n: number): ChoiceId => {
		const idx = optionNumbers.indexOf(n)
		return choiceIdForIndex(idx >= 0 ? idx : 0)
	}

	// Widget configuration
	const widgetId = "dot_plot_main"
	const dotColors = ["#4472C4", "#4CAF50", "#D9534F", "#9C27B0"]
	const dotColor = dotColors[random.nextInt(0, dotColors.length - 1)]
	const dotRadius = 4 + random.nextInt(0, 2)
	const widgetData = ticks.map((v) => ({
		value: v,
		count: countsByTick[v] ?? 0
	}))

	const DROPDOWN_IDS = ["dropdown_1", "dropdown_2", "dropdown_3"] as const

	// Build table rows
	const rowTopCells: Array<
		Array<
			| { type: "text"; content: string }
			| { type: "inlineInteractionRef"; interactionId: string }
		>
	> = []
	rowTopCells.push([text("Number of People")])
	for (let i = 0; i < tableValues.length; i += 1) {
		const posInAsked = askedIndices.indexOf(i)
		if (posInAsked >= 0) {
			const iid = DROPDOWN_IDS[posInAsked] ?? DROPDOWN_IDS[0]
			rowTopCells.push([{ type: "inlineInteractionRef", interactionId: iid }])
		} else {
			rowTopCells.push([text(String(countAt(tableValues[i])))])
		}
	}
	const rowBottomCells: Array<Array<{ type: "text"; content: string }>> = []
	rowBottomCells.push([text(`Number of ${chosenSubject.plural}`)])
	for (let i = 0; i < tableValues.length; i += 1) {
		rowBottomCells.push([text(String(tableValues[i]))])
	}

	// Interactions (three inline choice dropdowns)
	const buildChoices = () =>
		optionNumbers.map((num, idx) => ({
			identifier: choiceIdForIndex(idx),
			content: [text(String(num))]
		}))

	const interactions = {
		dropdown_1: {
			type: "inlineChoiceInteraction" as const,
			responseIdentifier: "RESP_A" as const,
			choices: buildChoices(),
			shuffle: true as const
		},
		dropdown_2: {
			type: "inlineChoiceInteraction" as const,
			responseIdentifier: "RESP_B" as const,
			choices: buildChoices(),
			shuffle: true as const
		},
		dropdown_3: {
			type: "inlineChoiceInteraction" as const,
			responseIdentifier: "RESP_C" as const,
			choices: buildChoices(),
			shuffle: true as const
		}
	}

	// Correct identifiers for each dropdown
	const correctIds: [ChoiceId, ChoiceId, ChoiceId] = [
		identifierForCount(countAt(askedValues[0])),
		identifierForCount(countAt(askedValues[1])),
		identifierForCount(countAt(askedValues[2]))
	]

	// Response declarations
	const responseDeclarations = [
		{
			identifier: "RESP_A" as const,
			cardinality: "single" as const,
			baseType: "identifier" as const,
			correct: correctIds[0]
		},
		{
			identifier: "RESP_B" as const,
			cardinality: "single" as const,
			baseType: "identifier" as const,
			correct: correctIds[1]
		},
		{
			identifier: "RESP_C" as const,
			cardinality: "single" as const,
			baseType: "identifier" as const,
			correct: correctIds[2]
		}
	]

	// Feedback shared pedagogy (three actionable steps, no final answers here)
	const totalDotsForSolution = widgetData.reduce((sum, d) => sum + d.count, 0)
	const triple = [
		{ value: askedValues[0], count: countAt(askedValues[0]) },
		{ value: askedValues[1], count: countAt(askedValues[1]) },
		{ value: askedValues[2], count: countAt(askedValues[2]) }
	]

	const shared = {
		steps: [
			{
				type: "step" as const,
				title: [text("Read one column at a time")],
				content: [
					{
						type: "widgetRef" as const,
						widgetId,
						widgetType: "dotPlot" as const
					},
					{
						type: "paragraph" as const,
						content: [
							text(
								"In a dot plot, each dot is one data point. Count only the dots stacked directly above a single label before moving to the next."
							)
						]
					}
				]
			},
			{
				type: "step" as const,
				title: [text("Trace the requested labels")],
				content: [
					{
						type: "paragraph" as const,
						content: [
							text("Place your finger at "),
							mathNum(triple[0].value),
							text(", then at "),
							mathNum(triple[1].value),
							text(", and finally at "),
							mathNum(triple[2].value),
							text(". For each, tally the dots in that exact column.")
						]
					}
				]
			},
			{
				type: "step" as const,
				title: [text("Sanity-check with the total")],
				content: [
					{
						type: "paragraph" as const,
						content: [
							text("All your entries together should make sense with the "),
							mathNum(totalDotsForSolution),
							text(" data point"),
							text(totalDotsForSolution === 1 ? "" : "s"),
							text(
								" shown overall. Avoid borrowing dots from neighboring labels."
							)
						]
					}
				]
			}
		],
		solution: {
			type: "solution" as const,
			content: [
				text("Therefore, the correct counts are "),
				mathNum(triple[0].value),
				text(": "),
				mathNum(triple[0].count),
				text(", "),
				mathNum(triple[1].value),
				text(": "),
				mathNum(triple[1].count),
				text(", "),
				mathNum(triple[2].value),
				text(": "),
				mathNum(triple[2].count),
				text(".")
			]
		}
	}

	// Preamble builders for each combination (diagnostic, concise)
	const buildAllCorrect = () => ({
		correctness: "correct" as const,
		summary: [
			text(
				"You matched each requested label to the dots above it—your entries for "
			),
			mathNum(triple[0].value),
			text(", "),
			mathNum(triple[1].value),
			text(", and "),
			mathNum(triple[2].value),
			text(" align with the plot.")
		]
	})

	const singleIncorrect = (i: 0 | 1 | 2) => {
		const v = triple[i].value
		const c = triple[i].count
		return {
			correctness: "incorrect" as const,
			summary: [
				text("One entry needs a recount: at "),
				mathNum(v),
				text(" the column shows "),
				mathNum(c),
				text(" dot"),
				text(c === 1 ? "" : "s"),
				text(". Count only the dots directly above that label.")
			]
		}
	}

	const doubleIncorrect = (i1: 0 | 1 | 2, i2: 0 | 1 | 2) => {
		const v1 = triple[i1].value
		const c1 = triple[i1].count
		const v2 = triple[i2].value
		const c2 = triple[i2].count
		return {
			correctness: "incorrect" as const,
			summary: [
				text("Two entries are off: "),
				mathNum(v1),
				text(" has "),
				mathNum(c1),
				text(", and "),
				mathNum(v2),
				text(" has "),
				mathNum(c2),
				text(". Recount each column separately.")
			]
		}
	}

	const tripleIncorrect = () => ({
		correctness: "incorrect" as const,
		summary: [
			text("Recount all three entries: "),
			mathNum(triple[0].value),
			text(" → "),
			mathNum(triple[0].count),
			text(", "),
			mathNum(triple[1].value),
			text(" → "),
			mathNum(triple[1].count),
			text(", "),
			mathNum(triple[2].value),
			text(" → "),
			mathNum(triple[2].count),
			text(". Each dot represents one data point above its label.")
		]
	})

	const preambles = {
		FB__A: buildAllCorrect(),
		FB__B: singleIncorrect(0),
		FB__C: singleIncorrect(1),
		FB__D: singleIncorrect(2),
		FB__E: doubleIncorrect(0, 1),
		FB__F: doubleIncorrect(0, 2),
		FB__G: doubleIncorrect(1, 2),
		FB__H: tripleIncorrect()
	}

	const assessmentItem = {
		identifier: `dot-plot-table-${seed.toString()}`,
		title: `${chosenName}'s ${chosenSubject.plural}: complete the table from a dot plot`,
		responseDeclarations,
		body: [
			{
				type: "paragraph",
				content: [
					text(
						`${chosenName} recorded how many ${chosenSubject.plural} people have. The dot plot shows the results.`
					)
				]
			},
			{ type: "widgetRef", widgetId, widgetType: "dotPlot" },
			{
				type: "paragraph",
				content: [text("Complete the table using the data from the dot plot.")]
			},
			{
				type: "paragraph",
				content: [
					text(
						"Select the number of people for each highlighted label. You may use an answer more than once."
					)
				]
			},
			{
				type: "tableRich",
				header: null,
				rows: [rowTopCells, rowBottomCells]
			}
		],
		widgets: {
			[widgetId]: {
				type: "dotPlot" as const,
				width: 420,
				height: 250,
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
		interactions,
		feedbackPlan,
		feedback: {
			shared,
			preambles
		}
	} satisfies AssessmentItemInput<TemplateWidgets, typeof feedbackPlan>

	return assessmentItem
}
