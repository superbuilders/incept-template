import type {
	EnumeratedFeedbackDimension,
	FeedbackCombination,
	FeedbackPlan
} from "@/core/feedback/plan"
import type {
	ChoiceIdentifierTuple,
	FeedbackCombinationIdentifier
} from "@/core/identifiers"
import type { AssessmentItemInput } from "@/core/item"
import { createSeededRandom } from "@/templates/seeds"

// Widgets: none (widget-free template)
export type TemplateWidgets = readonly []

const PLAN_CHOICE_IDS = [
	"A",
	"B",
	"C",
	"D"
] as const satisfies ChoiceIdentifierTuple<readonly ["A", "B", "C", "D"]>

type TemplateDimensions = readonly [
	EnumeratedFeedbackDimension<"RESP", typeof PLAN_CHOICE_IDS>
]

const FEEDBACK_DIMENSIONS: TemplateDimensions = [
	{
		responseIdentifier: "RESP",
		kind: "enumerated",
		keys: PLAN_CHOICE_IDS
	}
]

const FEEDBACK_COMBINATIONS = [
	{ id: "FB__A", path: [{ responseIdentifier: "RESP", key: "A" }] },
	{ id: "FB__B", path: [{ responseIdentifier: "RESP", key: "B" }] },
	{ id: "FB__C", path: [{ responseIdentifier: "RESP", key: "C" }] },
	{ id: "FB__D", path: [{ responseIdentifier: "RESP", key: "D" }] }
] as const satisfies readonly FeedbackCombination<
	FeedbackCombinationIdentifier,
	TemplateDimensions
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
	const mathNum = (n: number) => ({ type: "math" as const, mathml: `<mn>${n}</mn>` })
	const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n))
	const formatCents = (cents: number) => {
		const dollars = Math.floor(Math.max(0, cents) / 100)
		const c = Math.max(0, cents) % 100
		return `${dollars}.${pad2(c)}`
	}
	const mathDollar = (cents: number) => ({
		type: "math" as const,
		mathml: `<mo>$</mo><mn>${formatCents(cents)}</mn>`
	})
	const mathMoneyExpr = (leftCents: number, rightCents: number) => ({
		type: "math" as const,
		mathml: `<mo>$</mo><mn>${formatCents(leftCents)}</mn><mo>−</mo><mo>$</mo><mn>${formatCents(
			rightCents
		)}</mn>`
	})
	const pluralize = (n: number, singular: string, plural: string) =>
		n === 1 ? singular : plural
	const numberWord = (n: number) => {
		const words = [
			"zero",
			"one",
			"two",
			"three",
			"four",
			"five",
			"six",
			"seven",
			"eight",
			"nine",
			"ten"
		]
		return n >= 0 && n <= 10 ? words[n] : String(n)
	}

	// Seed-driven counts: bills and coins
	const count20 = random.nextInt(1, 3) // ensure at least one $20
	const count10 = random.nextInt(0, 3)
	let countDimes = random.nextInt(0, 5)
	let countPennies = random.nextInt(0, 9)
	if (countDimes === 0 && countPennies === 0) {
		// ensure at least some coins to make "ignore coins" a distinct misconception
		countPennies = random.nextInt(1, 9)
	}

	// Compute totals in cents
	const billsCents = 2000 * count20 + 1000 * count10
	const coinsCents = 10 * countDimes + countPennies
	const totalCents = billsCents + coinsCents

	// Price: choose strictly less than billsCents (to keep "ignore coins" positive) and < totalCents
	const fractionNumeratorOptions = [35, 42, 47, 53, 61]
	const fracNum = fractionNumeratorOptions[random.nextInt(0, fractionNumeratorOptions.length - 1)]
	let lower = Math.max(1, Math.floor((totalCents * fracNum) / 100))
	let upper = Math.min(totalCents - 1, billsCents - 1)
	if (upper < lower) {
		// relax lower bound if needed
		lower = Math.max(1, Math.floor(billsCents * 0.5))
		upper = Math.max(lower, billsCents - 1)
	}
	const priceCents = random.nextInt(lower, upper)
	const remainCents = totalCents - priceCents

	// Derived pieces for feedback
	const totalDollars = Math.floor(totalCents / 100)
	const totalCentsPart = totalCents % 100
	const priceDollars = Math.floor(priceCents / 100)
	const priceCentsPart = priceCents % 100

	// Distractor generation
	type ChoiceKind =
		| "CORRECT"
		| "IGNORE_COINS"
		| "NO_BORROW"
		| "MISVALUE_COINS"
		| "ABS_DIFF_CENTS"
		| "OFFSET"

	type ChoiceSpec = { amountCents: number; kind: ChoiceKind }

	const correctChoice: ChoiceSpec = { amountCents: remainCents, kind: "CORRECT" }

	const ignoreCoins: ChoiceSpec = {
		amountCents: Math.max(0, billsCents - priceCents),
		kind: "IGNORE_COINS"
	}

	const noBorrow: ChoiceSpec = (() => {
		const dollarsPart = Math.max(0, totalDollars - priceDollars)
		const centsPart = Math.max(0, totalCentsPart - priceCentsPart)
		return { amountCents: dollarsPart * 100 + centsPart, kind: "NO_BORROW" }
	})()

	const misvalueCoins: ChoiceSpec = {
		amountCents: Math.max(0, billsCents + countDimes * 1 + countPennies * 10 - priceCents),
		kind: "MISVALUE_COINS"
	}

	const absDiffCents: ChoiceSpec = (() => {
		const dollarsPart = Math.max(0, totalDollars - priceDollars)
		const centsPart = Math.abs(totalCentsPart - priceCentsPart)
		return { amountCents: dollarsPart * 100 + centsPart, kind: "ABS_DIFF_CENTS" }
	})()

	// Deterministic offsets for fallback (±$1 or ±$0.90 based on seed bits)
	const offsetCandidatesCents = [
		remainCents + 100,
		remainCents >= 100 ? remainCents - 100 : remainCents + 90,
		remainCents + 90,
		remainCents >= 90 ? remainCents - 90 : remainCents + 190
	]
	const offsetPool: ChoiceSpec[] = offsetCandidatesCents.map((c) => ({
		amountCents: Math.max(0, c),
		kind: "OFFSET"
	}))

	const allCandidates: ChoiceSpec[] = [
		ignoreCoins,
		noBorrow,
		misvalueCoins,
		absDiffCents,
		...offsetPool
	]

	const uniqueDistractors: ChoiceSpec[] = []
	const seen = new Set<number>([correctChoice.amountCents])
	for (const cand of allCandidates) {
		if (uniqueDistractors.length >= 3) break
		if (cand.amountCents <= 0) continue
		if (!seen.has(cand.amountCents)) {
			uniqueDistractors.push(cand)
			seen.add(cand.amountCents)
		}
	}

	while (uniqueDistractors.length < 3) {
		// deterministic synthetic values if needed
		const bump = 50 + random.nextInt(0, 200)
		const candidate = Math.max(1, (remainCents + bump) % Math.max(remainCents + 200, 300))
		if (!seen.has(candidate)) {
			uniqueDistractors.push({ amountCents: candidate, kind: "OFFSET" })
			seen.add(candidate)
		}
	}

	const finalChoices: ChoiceSpec[] = [correctChoice, ...uniqueDistractors].sort(
		(a, b) => a.amountCents - b.amountCents
	)

	const choiceIds = PLAN_CHOICE_IDS
	const correctIndex = finalChoices.findIndex((c) => c.kind === "CORRECT")
	const correctChoiceIdentifier = choiceIds[correctIndex >= 0 ? correctIndex : 0]

	// Name variation
	const names = ["Marta", "Diego", "Leah", "Noah", "Priya", "Omar", "Lena", "Kai"]
	const chosenName = names[random.nextInt(0, names.length - 1)]

	// Body construction
	const body = [
		{
			type: "paragraph" as const,
			content: [text(`${chosenName} has money in a wallet. The amounts are listed.`)]
		},
		{
			type: "unorderedList" as const,
			items: [
				[
					text(`${numberWord(count20)[0].toUpperCase()}${numberWord(count20).slice(1)} `),
					{ type: "math" as const, mathml: `<mo>$</mo><mn>20</mn>` },
					text(` ${pluralize(count20, "bill", "bills")}`)
				],
				[
					text(`${numberWord(count10)[0].toUpperCase()}${numberWord(count10).slice(1)} `),
					{ type: "math" as const, mathml: `<mo>$</mo><mn>10</mn>` },
					text(` ${pluralize(count10, "bill", "bills")}`)
				],
				[
					text(`${numberWord(countDimes)[0].toUpperCase()}${numberWord(countDimes).slice(1)} `),
					text(pluralize(countDimes, "dime", "dimes"))
				],
				[
					text(`${numberWord(countPennies)[0].toUpperCase()}${numberWord(countPennies).slice(1)} `),
					text(pluralize(countPennies, "penny", "pennies"))
				]
			]
		},
		{
			type: "paragraph" as const,
			content: [
				text(`${chosenName} buys an item for `),
				mathDollar(priceCents),
				text(", after tax.")
			]
		},
		{ type: "interactionRef" as const, interactionId: "choice_interaction" }
	]

	// Interactions
	const interactions = {
		choice_interaction: {
			type: "choiceInteraction" as const,
			responseIdentifier: "RESP" as const,
			prompt: [
				text(
					"How much money is left in the wallet after the purchase? Select one answer."
				)
			],
			choices: finalChoices.map((c, idx) => ({
				identifier: choiceIds[idx],
				content: [
					{
						type: "paragraph" as const,
						content: [mathDollar(c.amountCents)]
					}
				]
			})),
			shuffle: true as const,
			minChoices: 1,
			maxChoices: 1
		}
	}

	// Response declarations
	const responseDeclarations = [
		{
			identifier: "RESP" as const,
			cardinality: "single" as const,
			baseType: "identifier" as const,
			correct: correctChoiceIdentifier
		}
	]

	// Feedback: shared pedagogy
	const step1Content = (() => {
		const parts: Array<{ type: "paragraph"; content: Array<{ type: "text"; content: string } | { type: "math"; mathml: string }> }> = []

		parts.push({
			type: "paragraph",
			content: [
				text("Count the bills: "),
				{
					type: "math",
					mathml: `<mn>${count20}</mn><mo>×</mo><mo>$</mo><mn>20</mn><mo>=</mo><mo>$</mo><mn>${20 * count20}</mn>`
				},
				text(" and "),
				{
					type: "math",
					mathml: `<mn>${count10}</mn><mo>×</mo><mo>$</mo><mn>10</mn><mo>=</mo><mo>$</mo><mn>${10 * count10}</mn>`
				},
				text(".")
			]
		})
		parts.push({
			type: "paragraph",
			content: [
				text("Convert coins to dollars: "),
				{
					type: "math",
					mathml: `<mn>${countDimes}</mn><mo>×</mo><mn>0.10</mn><mo>=</mo><mn>${(countDimes / 10).toFixed(
						2
					)}</mn>`
				},
				text(" and "),
				{
					type: "math",
					mathml: `<mn>${countPennies}</mn><mo>×</mo><mn>0.01</mn><mo>=</mo><mn>${(countPennies / 100).toFixed(
						2
					)}</mn>`
				},
				text(".")
			]
		})
		parts.push({
			type: "paragraph",
			content: [
				text("Starting total: "),
				mathDollar(totalCents),
				text(".")
			]
		})
		return parts
	})()

	const shared = {
		steps: [
			{
				type: "step" as const,
				title: [text("Compute the starting amount")],
				content: step1Content
			},
			{
				type: "step" as const,
				title: [text("Write the subtraction with dollars and cents")],
				content: [
					{
						type: "paragraph" as const,
						content: [
							text("Subtract the cost from the starting total: "),
							mathMoneyExpr(totalCents, priceCents),
							text(".")
						]
					},
					{
						type: "paragraph" as const,
						content: [
							text("If the cents in the total ("),
							mathNum(totalCentsPart),
							text(") are less than the cents in the price ("),
							mathNum(priceCentsPart),
							text("), trade 1 dollar for 100 cents before subtracting.")
						]
					}
				]
			},
			{
				type: "step" as const,
				title: [text("Sanity-check your result")],
				content: [
					{
						type: "paragraph" as const,
						content: [
							text("Your answer should be less than "),
							mathDollar(totalCents),
							text(" and have a cents part between "),
							mathNum(0),
							text(" and "),
							mathNum(99),
							text(".")
						]
					},
					{
						type: "paragraph" as const,
						content: [
							text("Add your result to the cost to confirm it reconstructs the starting total.")
						]
					}
				]
			}
		],
		solution: {
			type: "solution" as const,
			content: [
				text("Therefore, the remaining amount is "),
				mathDollar(remainCents),
				text(".")
			]
		}
	}

	// Feedback: preambles per combination
	const choiceForId = (id: (typeof PLAN_CHOICE_IDS)[number]) => {
		const index = choiceIds.indexOf(id)
		return finalChoices[index] ?? finalChoices[0]
	}

	const preambleFor = (id: (typeof PLAN_CHOICE_IDS)[number]) => {
		const chosen = choiceForId(id)
		const chosenAmount = chosen.amountCents
		if (id === correctChoiceIdentifier) {
			return {
				correctness: "correct" as const,
				summary: [
					text("You matched the difference "),
					mathMoneyExpr(totalCents, priceCents),
					text(" to "),
					mathDollar(remainCents),
					text(", aligning dollars and cents correctly.")
				]
			}
		}
		// Diagnostic based on detected misconception
		if (chosen.kind === "IGNORE_COINS") {
			return {
				correctness: "incorrect" as const,
				summary: [
					text("Your selection "),
					mathDollar(chosenAmount),
					text(" omits the coins worth "),
					mathDollar(coinsCents),
					text(" from the starting total.")
				]
			}
		}
		if (chosen.kind === "NO_BORROW") {
			return {
				correctness: "incorrect" as const,
				summary: [
					text("Your answer "),
					mathDollar(chosenAmount),
					text(" treats the cents as "),
					mathNum(totalCentsPart),
					text("−"),
					mathNum(priceCentsPart),
					text(" without regrouping when needed.")
				]
			}
		}
		if (chosen.kind === "MISVALUE_COINS") {
			return {
				correctness: "incorrect" as const,
				summary: [
					text("The amount "),
					mathDollar(chosenAmount),
					text(" suggests the coin values were swapped, counting dimes and pennies incorrectly.")
				]
			}
		}
		if (chosen.kind === "ABS_DIFF_CENTS") {
			return {
				correctness: "incorrect" as const,
				summary: [
					text("Using "),
					mathDollar(chosenAmount),
					text(" takes the absolute difference of the cents "),
					mathNum(totalCentsPart),
					text(" and "),
					mathNum(priceCentsPart),
					text(" instead of regrouping.")
				]
			}
		}
		return {
			correctness: "incorrect" as const,
			summary: [
				text("This amount "),
				mathDollar(chosenAmount),
				text(" does not follow from "),
				mathMoneyExpr(totalCents, priceCents),
				text(". Recompute with dollars and cents aligned.")
			]
		}
	}

	const preambles = {
		FB__A: preambleFor("A"),
		FB__B: preambleFor("B"),
		FB__C: preambleFor("C"),
		FB__D: preambleFor("D")
	}

	const assessmentItem = {
		identifier: `wallet-change-${seed.toString()}`,
		title: `Find remaining money after a purchase`,
		responseDeclarations,
		body,
		widgets: null,
		interactions,
		feedbackPlan,
		feedback: {
			shared,
			preambles
		}
	} satisfies AssessmentItemInput<TemplateWidgets, TemplateFeedbackPlan>

	return assessmentItem
}
