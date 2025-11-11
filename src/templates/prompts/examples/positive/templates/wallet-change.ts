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
	const mathRaw = (mathml: string) => ({ type: "math" as const, mathml })
	const pad2 = (n: number) => (n < 10 ? `0${n}` : String(n))
	const formatCents = (cents: number) => {
		const c = Math.max(0, Math.floor(cents))
		const dollars = Math.floor(c / 100)
		const rem = c % 100
		return `${dollars}.${pad2(rem)}`
	}
	const mathDollar = (cents: number) =>
		mathRaw(`<mo>$</mo><mn>${formatCents(cents)}</mn>`)
	const mathMoneyExpr = (leftCents: number, rightCents: number) =>
		mathRaw(
			`<mo>$</mo><mn>${formatCents(leftCents)}</mn><mo>−</mo><mo>$</mo><mn>${formatCents(
				rightCents
			)}</mn>`
		)
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
	const capWord = (w: string) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1))

	// Seed-driven scenario values
	const names = ["Marta", "Diego", "Leah", "Noah", "Priya", "Omar", "Lena", "Kai"]
	const chosenName = names[random.nextInt(0, names.length - 1)]

	const count20 = random.nextInt(1, 3) // at least one $20 bill
	const count10 = random.nextInt(0, 3)
	let countDimes = random.nextInt(0, 5)
	let countPennies = random.nextInt(0, 9)
	if (countDimes === 0 && countPennies === 0) {
		countPennies = random.nextInt(1, 9)
	}

	const billsCents = 2000 * count20 + 1000 * count10
	const coinsCents = 10 * countDimes + countPennies
	const totalCents = billsCents + coinsCents

	// Pick a purchase price strictly less than total and also less than billsCents (so IGNORE_COINS is meaningful)
	let lower = Math.max(1, Math.floor(totalCents * 0.35))
	let upper = Math.min(totalCents - 1, billsCents - 1)
	if (upper < lower) {
		lower = Math.max(1, Math.floor(billsCents * 0.5))
		upper = Math.max(lower, billsCents - 1)
	}
	if (upper < 1) {
		upper = Math.max(1, totalCents - 1)
	}
	if (lower > upper) {
		lower = Math.max(1, Math.floor(upper * 0.5))
	}
	const priceCents = random.nextInt(lower, upper)
	const remainCents = totalCents - priceCents

	const totalDollars = Math.floor(totalCents / 100)
	const totalCentPart = totalCents % 100
	const priceDollars = Math.floor(priceCents / 100)
	const priceCentPart = priceCents % 100
	const needBorrow = totalCentPart < priceCentPart
	const centsAfter = needBorrow
		? 100 + totalCentPart - priceCentPart
		: totalCentPart - priceCentPart
	const dollarsAfter = needBorrow
		? totalDollars - 1 - priceDollars
		: totalDollars - priceDollars

	// Choices: correct + three seeded, unique distractors
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

	const noBorrow: ChoiceSpec = {
		amountCents: Math.max(0, dollarsAfter * 100 + (needBorrow ? centsAfter : centsAfter)),
		kind: "NO_BORROW"
	}

	const misvalueCoins: ChoiceSpec = {
		amountCents: Math.max(0, billsCents + countDimes * 1 + countPennies * 10 - priceCents),
		kind: "MISVALUE_COINS"
	}

	const absDiffCents: ChoiceSpec = {
		amountCents:
			Math.max(0, totalDollars - priceDollars) * 100 +
			Math.abs(totalCentPart - priceCentPart),
		kind: "ABS_DIFF_CENTS"
	}

	// Deterministic offsets around the correct value
	const offsetA =
		remainCents >= 100 ? remainCents - 100 : remainCents + 90 + random.nextInt(0, 9)
	const offsetB = remainCents + 100 + random.nextInt(0, 19)
	const offsetC =
		remainCents >= 90 ? remainCents - 90 : remainCents + 190 + random.nextInt(0, 9)

	const offsetPool: ChoiceSpec[] = [
		{ amountCents: Math.max(1, offsetA), kind: "OFFSET" },
		{ amountCents: Math.max(1, offsetB), kind: "OFFSET" },
		{ amountCents: Math.max(1, offsetC), kind: "OFFSET" }
	]

	const candidatePool: ChoiceSpec[] = [
		ignoreCoins,
		noBorrow,
		misvalueCoins,
		absDiffCents,
		...offsetPool
	]

	const uniqueDistractors: ChoiceSpec[] = []
	const seen = new Set<number>([correctChoice.amountCents])
	for (const cand of candidatePool) {
		if (uniqueDistractors.length >= 3) break
		if (cand.amountCents > 0 && !seen.has(cand.amountCents)) {
			uniqueDistractors.push(cand)
			seen.add(cand.amountCents)
		}
	}
	while (uniqueDistractors.length < 3) {
		const bump = 50 + random.nextInt(0, 250)
		const candidate = Math.max(
			1,
			(remainCents + bump) % Math.max(remainCents + 200, 300)
		)
		if (!seen.has(candidate)) {
			uniqueDistractors.push({ amountCents: candidate, kind: "OFFSET" })
			seen.add(candidate)
		}
	}

	const finalChoices: ChoiceSpec[] = [correctChoice, ...uniqueDistractors].sort(
		(a, b) => a.amountCents - b.amountCents
	)

	const [choiceA, choiceB, choiceC, choiceD] = finalChoices
	const choiceMapByLetter = {
		A: choiceA,
		B: choiceB,
		C: choiceC,
		D: choiceD
	}

	const correctIndex = finalChoices.findIndex((c) => c.kind === "CORRECT")
	const correctChoiceIdentifier =
		PLAN_CHOICE_IDS[correctIndex >= 0 ? correctIndex : 0]

	// Body
	const body = [
		{
			type: "paragraph" as const,
			content: [
				text(`${chosenName} has money in a wallet. The amounts are listed.`)
			]
		},
		{
			type: "unorderedList" as const,
			items: [
				[
					text(`${capWord(numberWord(count20))} `),
					mathRaw(`<mo>$</mo><mn>20</mn>`),
					text(` ${pluralize(count20, "bill", "bills")}`)
				],
				[
					text(`${capWord(numberWord(count10))} `),
					mathRaw(`<mo>$</mo><mn>10</mn>`),
					text(` ${pluralize(count10, "bill", "bills")}`)
				],
				[text(`${capWord(numberWord(countDimes))} ${pluralize(countDimes, "dime", "dimes")}`)],
				[text(`${capWord(numberWord(countPennies))} ${pluralize(countPennies, "penny", "pennies")}`)]
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
					"How much money will be left after the purchase? Select one answer."
				)
			],
			choices: PLAN_CHOICE_IDS.map((id, idx) => {
				const spec = finalChoices[idx]
				const amount = spec ? spec.amountCents : finalChoices[0].amountCents
				return {
					identifier: id,
					content: [
						{
							type: "paragraph" as const,
							content: [mathDollar(amount)]
						}
					]
				}
			}),
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

	// Feedback shared pedagogy (exactly three actionable steps)
	const shared = {
		steps: [
			{
				type: "step" as const,
				title: [text("Compute the starting amount")],
				content: [
					{
						type: "paragraph" as const,
						content: [
							text("Bills: "),
							mathRaw(
								`<mn>${count20}</mn><mo>×</mo><mo>$</mo><mn>20</mn><mo>=</mo><mo>$</mo><mn>${20 * count20}</mn>`
							),
							text(" and "),
							mathRaw(
								`<mn>${count10}</mn><mo>×</mo><mo>$</mo><mn>10</mn><mo>=</mo><mo>$</mo><mn>${10 * count10}</mn>`
							),
							text(".")
						]
					},
					{
						type: "paragraph" as const,
						content: [
							text("Coins: "),
							mathRaw(
								`<mn>${countDimes}</mn><mo>×</mo><mn>0.10</mn><mo>=</mo><mn>${(countDimes / 10).toFixed(
									2
								)}</mn>`
							),
							text(" and "),
							mathRaw(
								`<mn>${countPennies}</mn><mo>×</mo><mn>0.01</mn><mo>=</mo><mn>${(countPennies / 100).toFixed(
									2
								)}</mn>`
							),
							text(".")
						]
					},
					{
						type: "paragraph" as const,
						content: [text("Starting total: "), mathDollar(totalCents), text(".")]
					}
				]
			},
			{
				type: "step" as const,
				title: [text("Set up the subtraction and regroup if needed")],
				content: [
					{
						type: "paragraph" as const,
						content: [
							text("Subtract the cost from the total: "),
							mathMoneyExpr(totalCents, priceCents),
							text(".")
						]
					},
					{
						type: "paragraph" as const,
						content: needBorrow
							? [
									text("Because the cents "),
									mathRaw(`<mn>${totalCentPart}</mn>`),
									text(" are less than "),
									mathRaw(`<mn>${priceCentPart}</mn>`),
									text(", trade "),
									mathRaw(`<mn>1</mn>`),
									text(" dollar for "),
									mathRaw(`<mn>100</mn>`),
									text(" cents before subtracting the cents.")
								]
							: [
									text("No regrouping is needed because the cents "),
									mathRaw(`<mn>${totalCentPart}</mn>`),
									text(" are at least "),
									mathRaw(`<mn>${priceCentPart}</mn>`),
									text(".")
								]
					}
				]
			},
			{
				type: "step" as const,
				title: [text("Subtract the cents and the dollars")],
				content: [
					{
						type: "paragraph" as const,
						content: needBorrow
							? [
									text("Cents: "),
									mathRaw(
										`<mn>100</mn><mo>+</mo><mn>${totalCentPart}</mn><mo>−</mo><mn>${priceCentPart}</mn><mo>=</mo><mn>${centsAfter}</mn>`
									),
									text(".")
								]
							: [
									text("Cents: "),
									mathRaw(
										`<mn>${totalCentPart}</mn><mo>−</mo><mn>${priceCentPart}</mn><mo>=</mo><mn>${centsAfter}</mn>`
									),
									text(".")
								]
					},
					{
						type: "paragraph" as const,
						content: needBorrow
							? [
									text("Dollars: "),
									mathRaw(
										`<mn>${totalDollars}</mn><mo>−</mo><mn>1</mn><mo>−</mo><mn>${priceDollars}</mn><mo>=</mo><mn>${dollarsAfter}</mn>`
									),
									text(".")
								]
							: [
									text("Dollars: "),
									mathRaw(
										`<mn>${totalDollars}</mn><mo>−</mo><mn>${priceDollars}</mn><mo>=</mo><mn>${dollarsAfter}</mn>`
									),
									text(".")
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

	// Preambles per combination (diagnostic and seeded)
	const describeChoice = (spec: ChoiceSpec) => mathDollar(spec.amountCents)

	const preambleFor = (key: (typeof PLAN_CHOICE_IDS)[number]) => {
		const spec = choiceMapByLetter[key]
		const chosen = spec ?? finalChoices[0]
		if (key === correctChoiceIdentifier) {
			return {
				correctness: "correct" as const,
				summary: [
					text("You matched "),
					mathMoneyExpr(totalCents, priceCents),
					text(" to "),
					mathDollar(remainCents),
					text(", aligning dollars and cents properly.")
				]
			}
		}
		if (chosen.kind === "IGNORE_COINS") {
			return {
				correctness: "incorrect" as const,
				summary: [
					text("Your selection "),
					describeChoice(chosen),
					text(" omits the coins worth "),
					mathDollar(coinsCents),
					text(" from the starting amount.")
				]
			}
		}
		if (chosen.kind === "NO_BORROW") {
			return {
				correctness: "incorrect" as const,
				summary: [
					text("The cents in "),
					describeChoice(chosen),
					text(" treat "),
					mathRaw(`<mn>${totalCentPart}</mn>`),
					text("−"),
					mathRaw(`<mn>${priceCentPart}</mn>`),
					text(" without regrouping when the top cents are smaller.")
				]
			}
		}
		if (chosen.kind === "ABS_DIFF_CENTS") {
			return {
				correctness: "incorrect" as const,
				summary: [
					text("This amount uses the absolute difference of the cents "),
					mathRaw(`<mn>${Math.abs(totalCentPart - priceCentPart)}</mn>`),
					text(" instead of borrowing 1 dollar when needed.")
				]
			}
		}
		if (chosen.kind === "MISVALUE_COINS") {
			return {
				correctness: "incorrect" as const,
				summary: [
					text("The value "),
					describeChoice(chosen),
					text(" swaps coin values—treating each dime as "),
					mathRaw(`<mn>0.01</mn>`),
					text(" and each penny as "),
					mathRaw(`<mn>0.10</mn>`),
					text(", which inflates the starting total.")
				]
			}
		}
		return {
			correctness: "incorrect" as const,
			summary: [
				text("This amount "),
				describeChoice(chosen),
				text(" does not follow from "),
				mathMoneyExpr(totalCents, priceCents),
				text(". Recompute with regrouping when the cents on top are smaller.")
			]
		}
	}

	const feedback = {
		shared,
		preambles: {
			FB__A: preambleFor("A"),
			FB__B: preambleFor("B"),
			FB__C: preambleFor("C"),
			FB__D: preambleFor("D")
		}
	}

	const assessmentItem = {
		identifier: `wallet-change-${seed.toString()}`,
		title: "Find remaining money after a purchase",
		responseDeclarations,
		body,
		widgets: null,
		interactions,
		feedbackPlan,
		feedback
	} satisfies AssessmentItemInput<TemplateWidgets, TemplateFeedbackPlan>

	return assessmentItem
}
