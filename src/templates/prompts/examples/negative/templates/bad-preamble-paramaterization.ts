import type { FeedbackCombination, FeedbackPlan } from "@/core/feedback/plan"
import type {
	ChoiceIdentifierTuple,
	FeedbackCombinationIdentifier
} from "@/core/identifiers"
import type { AssessmentItemInput } from "@/core/item"
import { createSeededRandom } from "@/templates/seeds"

export type TemplateWidgets = readonly ["dataTable"]

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

type TemplateFeedbackPlan = typeof feedbackPlan

export default function generateTemplate(
	seed: bigint
): AssessmentItemInput<TemplateWidgets, TemplateFeedbackPlan> {
	const random = createSeededRandom(seed)

	// Helpers
	const text = (content: string) => ({ type: "text" as const, content })
	const mathRaw = (mathml: string) => ({ type: "math" as const, mathml })
	const widgetRef = (widgetId: string) =>
		({ type: "widgetRef" as const, widgetId, widgetType: "dataTable" as const })
	const cap = (s: string) => (s.length === 0 ? s : s[0].toUpperCase() + s.slice(1))
	const dollarsMath = (n: number) => `<mo>$</mo><mn>${n}</mn>`
	const trioDollarsMath = (a: number, b: number, c: number) =>
		`${dollarsMath(a)}<mo>,</mo>${dollarsMath(b)}<mo>,</mo>${dollarsMath(c)}`
	const pickDistinctIndices = (count: number, maxExclusive: number): number[] => {
		const set = new Set<number>()
		while (set.size < count) {
			set.add(random.nextInt(0, maxExclusive - 1))
		}
		return Array.from(set)
	}

	// Seeded narrative and structure
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
	const person = names[random.nextInt(0, names.length - 1)]

	const monthPool = [
		"August",
		"September",
		"October",
		"November",
		"December",
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July"
	]
	const monthIdx = pickDistinctIndices(3, monthPool.length).sort((a, b) => a - b)
	const months = monthIdx.map((i) => monthPool[i])

	const CATEGORY_POOL: Array<{ id: string; label: string }> = [
		{ id: "GROCERIES", label: "groceries" },
		{ id: "INTERNET", label: "internet" },
		{ id: "HOUSING", label: "housing" },
		{ id: "MOVIES", label: "movies" },
		{ id: "TRANSPORT", label: "transport" },
		{ id: "UTILITIES", label: "utilities" },
		{ id: "CLOTHING", label: "clothing" },
		{ id: "DINING", label: "dining" }
	]
	const chosenCatIdx = pickDistinctIndices(4, CATEGORY_POOL.length)
	const chosenCats = chosenCatIdx.map((i) => CATEGORY_POOL[i])

	// Choose exactly two variable rows among the four
	const variableIndexSet = new Set<number>()
	while (variableIndexSet.size < 2) {
		variableIndexSet.add(random.nextInt(0, 3))
	}
	const variableIndices = Array.from(variableIndexSet).sort((a, b) => a - b)
	const isVariableIndex = (idx: number) => variableIndices.includes(idx)

	type Row = {
		id: string
		label: string
		amounts: [number, number, number]
		isVariable: boolean
	}

	const clampPos = (n: number) => (n < 1 ? 1 : n)

	const rows: Row[] = chosenCats.map((cat, idx) => {
		const base = random.nextInt(40, 900)
		if (isVariableIndex(idx)) {
			let d1 = random.nextInt(-120, 160)
			let d2 = random.nextInt(-120, 160)
			if (d1 === 0 && d2 === 0) {
				d2 = random.nextBoolean() ? 25 : -25
			}
			const a1 = clampPos(base)
			const a2 = clampPos(base + d1)
			let a3 = clampPos(base + d2)
			if (a1 === a2 && a2 === a3) {
				a3 = clampPos(a3 + (random.nextBoolean() ? 30 : -30))
			}
			return { id: cat.id, label: cat.label, amounts: [a1, a2, a3], isVariable: true }
		}
		const fixed = clampPos(base)
		return { id: cat.id, label: cat.label, amounts: [fixed, fixed, fixed], isVariable: false }
	})

	// Ensure intended patterns remain intact
	for (let i = 0; i < rows.length; i++) {
		const r = rows[i]
		if (isVariableIndex(i)) {
			const [a, b, c] = r.amounts
			if (a === b && b === c) {
				const tweak = random.nextBoolean() ? 35 : -35
				rows[i] = { ...r, amounts: [a, b, clampPos(c + tweak)], isVariable: true }
			}
		} else {
			const fixed = rows[i].amounts[0]
			rows[i] = { ...rows[i], amounts: [fixed, fixed, fixed], isVariable: false }
		}
	}

	// Build widget
	const widgetId = "expenses_table"
	const headers = [
		"Expense",
		months[0] ?? "Month 1",
		months[1] ?? "Month 2",
		months[2] ?? "Month 3"
	]
	const tableRows = rows.map((row) => [
		cap(row.label),
		{ text: "", mathml: dollarsMath(row.amounts[0]) },
		{ text: "", mathml: dollarsMath(row.amounts[1]) },
		{ text: "", mathml: dollarsMath(row.amounts[2]) }
	])

	// Identify variable and fixed rows for feedback derivation
	const varRows = rows
		.map((r, i) => ({ r, i }))
		.filter((x) => x.r.isVariable)
	const fixedRows = rows.filter((r) => !r.isVariable)

	// Representatives (guaranteed two variables by construction)
	const var1 = varRows[0]?.r ?? rows[0]
	const var2 = varRows[1]?.r ?? rows[1]
	const var1Index = varRows[0]?.i ?? 0
	const var2Index = varRows[1]?.i ?? 1

	// Interactions: two category dropdowns and one reason dropdown
	const CATEGORY_CHOICE_IDS = [
		"A",
		"B",
		"C",
		"D"
	] as const satisfies ChoiceIdentifierTuple<readonly ["A", "B", "C", "D"]>
	type CategoryChoiceId = (typeof CATEGORY_CHOICE_IDS)[number]

	const REASON_CHOICE_IDS = ["A", "B"] as const satisfies ChoiceIdentifierTuple<
		readonly ["A", "B"]
	>
	type ReasonChoiceId = (typeof REASON_CHOICE_IDS)[number]

	const categoryChoices = rows.map((row, idx) => ({
		identifier: CATEGORY_CHOICE_IDS[idx],
		content: [text(row.label)]
	}))

	const dropdownVar1Id = "dropdown_var_1"
	const dropdownVar2Id = "dropdown_var_2"
	const dropdownReasonId = "dropdown_reason"

	const interactions = {
		[dropdownVar1Id]: {
			type: "inlineChoiceInteraction" as const,
			responseIdentifier: "RESP_A" as const,
			choices: categoryChoices,
			shuffle: true as const
		},
		[dropdownVar2Id]: {
			type: "inlineChoiceInteraction" as const,
			responseIdentifier: "RESP_B" as const,
			choices: categoryChoices,
			shuffle: true as const
		},
		[dropdownReasonId]: {
			type: "inlineChoiceInteraction" as const,
			responseIdentifier: "RESP_C" as const,
			choices: [
				{ identifier: REASON_CHOICE_IDS[0], content: [text("changed")] },
				{ identifier: REASON_CHOICE_IDS[1], content: [text("stayed the same")] }
			],
			shuffle: true as const
		}
	}

	// Correct answers
	const correctVar1: CategoryChoiceId = CATEGORY_CHOICE_IDS[var1Index] ?? CATEGORY_CHOICE_IDS[0]
	const correctVar2: CategoryChoiceId = CATEGORY_CHOICE_IDS[var2Index] ?? CATEGORY_CHOICE_IDS[1]
	const correctReason: ReasonChoiceId = REASON_CHOICE_IDS[0] // "changed"

	const responseDeclarations = [
		{
			identifier: "RESP_A" as const,
			cardinality: "single" as const,
			baseType: "identifier" as const,
			correct: correctVar1
		},
		{
			identifier: "RESP_B" as const,
			cardinality: "single" as const,
			baseType: "identifier" as const,
			correct: correctVar2
		},
		{
			identifier: "RESP_C" as const,
			cardinality: "single" as const,
			baseType: "identifier" as const,
			correct: correctReason
		}
	]

	// Feedback shared pedagogy (exactly three steps)
	const var1Math = mathRaw(
		trioDollarsMath(var1.amounts[0], var1.amounts[1], var1.amounts[2])
	)
	const var2Math = mathRaw(
		trioDollarsMath(var2.amounts[0], var2.amounts[1], var2.amounts[2])
	)

	const fixedSnippet = (() => {
		if (fixedRows.length === 0) {
			return [
				{
					type: "paragraph" as const,
					content: [
						text(
							"Any row with three identical entries is fixed; rows with unequal entries are variable."
						)
					]
				}
			]
		}
		const f = fixedRows[0]
		return [
				{
					type: "paragraph" as const,
					content: [
						text(cap(f.label)),
						text(": "),
						mathRaw(trioDollarsMath(f.amounts[0], f.amounts[1], f.amounts[2])),
						text(" — these repeat, which is the fixed pattern.")
					]
				}
			]
	})()

	const shared = {
		steps: [
			{
				type: "step" as const,
				title: [text("Compare each row across the months")],
				content: [
					widgetRef(widgetId),
					{
						type: "paragraph" as const,
						content: [
							text("A variable expense has amounts that differ across "),
							text(months[0] ?? "Month 1"),
							text(", "),
							text(months[1] ?? "Month 2"),
							text(", and "),
							text(months[2] ?? "Month 3"),
							text(". A fixed expense repeats the same amount in all three.")
						]
					}
				]
			},
			{
				type: "step" as const,
				title: [text("Identify the two rows that change")],
				content: [
					{
						type: "paragraph" as const,
						content: [
							text(cap(var1.label)),
							text(": "),
							var1Math,
							text(" — not all equal, so this row varies.")
						]
					},
					{
						type: "paragraph" as const,
						content: [
							text(cap(var2.label)),
							text(": "),
							var2Math,
							text(" — these also differ, so this row varies.")
						]
					}
				]
			},
			{
				type: "step" as const,
				title: [text("Contrast with a fixed row")],
				content: fixedSnippet
			}
		],
		solution: {
			type: "solution" as const,
			content: [
				text("Therefore, the variable expenses are "),
				text(cap(var1.label)),
				text(" and "),
				text(cap(var2.label)),
				text(".")
			]
		}
	}

	// Diagnostic preambles per combination
	const preambles = {
		FB__A: {
			correctness: "correct" as const,
			summary: [
				text("You named the two changing categories and used the reason “changed.” Their rows show "),
				var1Math,
				text(" and "),
				var2Math,
				text(", which are not all equal across "),
				text(months[0] ?? "Month 1"),
				text(", "),
				text(months[1] ?? "Month 2"),
				text(", and "),
				text(months[2] ?? "Month 3"),
				text(".")
			]
		},
		FB__B: {
			correctness: "incorrect" as const,
			summary: [
				text("One category you selected does not match the changing pattern. Compare with the variable rows: "),
				text(cap(var1.label)),
				text(" → "),
				var1Math,
				text(" and "),
				text(cap(var2.label)),
				text(" → "),
				var2Math,
				text(".")
			]
		},
		FB__C: {
			correctness: "incorrect" as const,
			summary: [
				text("One of your categories is fixed. The rows that vary are "),
				text(cap(var1.label)),
				text(" and "),
				text(cap(var2.label)),
				text(", as their three amounts are not identical.")
			]
		},
		FB__D: {
			correctness: "incorrect" as const,
			summary: [
				text(
					"Your categories align with variability, but the explanation should describe that the amounts changed across the months, not that they stayed the same."
				)
			]
		},
		FB__E: {
			correctness: "incorrect" as const,
			summary: [
				text("Both chosen categories miss the pattern. The changing rows are "),
				text(cap(var1.label)),
				text(" and "),
				text(cap(var2.label)),
				text(", since their monthly amounts differ ("),
				var1Math,
				text(" and "),
				var2Math,
				text(").")
			]
		},
		FB__F: {
			correctness: "incorrect" as const,
			summary: [
				text(
					"One category is fixed and the reason conflicts with variability. Variable expenses are the ones whose amounts changed across the months in the table."
				)
			]
		},
		FB__G: {
			correctness: "incorrect" as const,
			summary: [
				text("One category is fixed and the reason describes no change. Use the rows that differ across months ("),
				text(cap(var1.label)),
				text(" and "),
				text(cap(var2.label)),
				text(").")
			]
		},
		FB__H: {
			correctness: "incorrect" as const,
			summary: [
				text("Neither the categories nor the reason match the data. Variable expenses have different amounts across "),
				text(months[0] ?? "Month 1"),
				text(", "),
				text(months[1] ?? "Month 2"),
				text(", and "),
				text(months[2] ?? "Month 3"),
				text(".")
			]
		}
	}

	const assessmentItem = {
		identifier: `variable-expenses-table-${seed.toString()}`,
		title: "Identify variable expenses from a monthly table",
		responseDeclarations,
		body: [
			{
				type: "paragraph" as const,
				content: [
					text(`The table shows ${person}’s monthly expenses for three months.`)
				]
			},
			{ type: "widgetRef" as const, widgetId, widgetType: "dataTable" as const },
			{
				type: "paragraph" as const,
				content: [text("Based on the table, which expenses are variable?")]
			},
			{
				type: "paragraph" as const,
				content: [text("Choose the correct answer from each drop-down box to complete the sentence.")]
			},
			{
				type: "paragraph" as const,
				content: [
					text(`${cap(person)}’s variable expenses were `),
					{ type: "inlineInteractionRef" as const, interactionId: dropdownVar1Id },
					text(" and "),
					{ type: "inlineInteractionRef" as const, interactionId: dropdownVar2Id },
					text(" because the amounts "),
					{ type: "inlineInteractionRef" as const, interactionId: dropdownReasonId },
					text(" each month.")
				]
			}
		],
		widgets: {
			[widgetId]: {
				type: "dataTable" as const,
				caption: `${person}’s Monthly Expenses`,
				headers,
				rows: tableRows,
				rowHeaders: true
			}
		},
		interactions,
		feedbackPlan,
		feedback: {
			shared,
			preambles
		}
	} satisfies AssessmentItemInput<TemplateWidgets, TemplateFeedbackPlan>

	return assessmentItem
}
