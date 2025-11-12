import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type { FeedbackPreamble } from "@/core/feedback/content"
import type {
	CombinationFeedbackDimension,
	FeedbackCombination,
	FeedbackCombinationMap,
	FeedbackPlan
} from "@/core/feedback/plan"
import type {
	ChoiceIdentifier,
	FeedbackCombinationIdentifier
} from "@/core/identifiers"
import type { AssessmentItemInput } from "@/core/item"
import { createSeededRandom } from "@/templates/seeds"

export type TemplateWidgets = readonly ["symmetryDiagram"]

const CHOICE_IDS = [
	"A",
	"B",
	"C",
	"D",
	"E"
] as const satisfies readonly ChoiceIdentifier[]

type ChoiceId = (typeof CHOICE_IDS)[number]

const COMBINATION_KEYS = [
	"A__B",
	"A__C",
	"A__D",
	"A__E",
	"B__C",
	"B__D",
	"B__E",
	"C__D",
	"C__E",
	"D__E"
] as const

type CombinationKey = (typeof COMBINATION_KEYS)[number]

type PlanDimensions = readonly [
	CombinationFeedbackDimension<
		"RESP",
		2,
		2,
		typeof CHOICE_IDS,
		typeof COMBINATION_KEYS
	>
]

const FEEDBACK_DIMENSIONS: PlanDimensions = [
	{
		responseIdentifier: "RESP",
		kind: "combination",
		choices: CHOICE_IDS,
		minSelections: 2,
		maxSelections: 2,
		keys: COMBINATION_KEYS
	}
] as const

const FEEDBACK_COMBINATIONS = [
	{
		id: "FB__RESP_A__B",
		path: [{ responseIdentifier: "RESP", key: "A__B" }]
	},
	{
		id: "FB__RESP_A__C",
		path: [{ responseIdentifier: "RESP", key: "A__C" }]
	},
	{
		id: "FB__RESP_A__D",
		path: [{ responseIdentifier: "RESP", key: "A__D" }]
	},
	{
		id: "FB__RESP_A__E",
		path: [{ responseIdentifier: "RESP", key: "A__E" }]
	},
	{
		id: "FB__RESP_B__C",
		path: [{ responseIdentifier: "RESP", key: "B__C" }]
	},
	{
		id: "FB__RESP_B__D",
		path: [{ responseIdentifier: "RESP", key: "B__D" }]
	},
	{
		id: "FB__RESP_B__E",
		path: [{ responseIdentifier: "RESP", key: "B__E" }]
	},
	{
		id: "FB__RESP_C__D",
		path: [{ responseIdentifier: "RESP", key: "C__D" }]
	},
	{
		id: "FB__RESP_C__E",
		path: [{ responseIdentifier: "RESP", key: "C__E" }]
	},
	{
		id: "FB__RESP_D__E",
		path: [{ responseIdentifier: "RESP", key: "D__E" }]
	}
] as const satisfies readonly FeedbackCombination<
	FeedbackCombinationIdentifier,
	typeof FEEDBACK_DIMENSIONS
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
	const mathNum = (n: number) => ({
		type: "math" as const,
		mathml: `<mn>${n}</mn>`
	})
	const cap = (s: string) =>
		s.length === 0 ? s : s[0].toUpperCase() + s.slice(1)
	const joinWithAnd = (items: string[]) => {
		if (items.length === 0) return ""
		if (items.length === 1) return items[0]
		if (items.length === 2) return `${items[0]} and ${items[1]}`
		return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
	}

	type SymmetryShape =
		| "isoscelesTrapezoid"
		| "regularTriangle"
		| "isoscelesTriangle"
		| "rectangle"
		| "heart"
		| "square"
		| "rhombus"
		| "fourPointStar"

	const ALL_SHAPES: SymmetryShape[] = [
		"isoscelesTrapezoid",
		"regularTriangle",
		"isoscelesTriangle",
		"rectangle",
		"heart",
		"square",
		"rhombus",
		"fourPointStar"
	]

	const shapeDisplay = (shape: SymmetryShape): string => {
		switch (shape) {
			case "isoscelesTrapezoid":
				return "isosceles trapezoid"
			case "regularTriangle":
				return "equilateral triangle"
			case "isoscelesTriangle":
				return "isosceles triangle"
			case "rectangle":
				return "rectangle"
			case "heart":
				return "heart"
			case "square":
				return "square"
			case "rhombus":
				return "rhombus"
			case "fourPointStar":
				return "four-point star"
		}
	}

	const trueSymmetryCount = (shape: SymmetryShape): number => {
		switch (shape) {
			case "isoscelesTrapezoid":
				return 1
			case "regularTriangle":
				return 3
			case "isoscelesTriangle":
				return 1
			case "rectangle":
				return 2
			case "heart":
				return 1
			case "square":
				return 4
			case "rhombus":
				return 2
			case "fourPointStar":
				return 2
		}
	}

	const incorrectLineDescriptor = (shape: SymmetryShape): string => {
		switch (shape) {
			case "rectangle":
				return "diagonals are shown, which do not mirror opposite edges"
			case "isoscelesTrapezoid":
				return "a horizontal midline is shown, which fails to mirror the slanted sides"
			case "regularTriangle":
				return "a horizontal line is shown that is not a true median"
			case "isoscelesTriangle":
				return "a slanted line from a base vertex is shown; only the vertical line works"
			case "heart":
				return "a horizontal line is shown; only a vertical line produces matching halves"
			case "square":
				return "off-center vertical and horizontal lines are shown"
			case "rhombus":
				return "a non-axis slanted line through the center is shown"
			case "fourPointStar":
				return "a slightly rotated line through the center is shown"
		}
	}

	// Seed-driven selection of 5 distinct shapes using deterministic ranking
	type Ranked<T> = { value: T; key: number }
	const ranked: Ranked<SymmetryShape>[] = ALL_SHAPES.map((s) => ({
		value: s,
		key: random.next()
	}))
	ranked.sort((a, b) => a.key - b.key)
	const chosenShapes: SymmetryShape[] = ranked.slice(0, 5).map((r) => r.value)

	// Choose exactly two indices that will be fully correct (no incorrect lines shown)
	const correctIndexSet = new Set<number>()
	while (correctIndexSet.size < 2) {
		correctIndexSet.add(random.nextInt(0, chosenShapes.length - 1))
	}
	const correctIndices = Array.from(correctIndexSet).sort((a, b) => a - b)

	type Entry = {
		index: number
		shape: SymmetryShape
		widgetId: string
		isFullyCorrect: boolean
	}
	const entries: Entry[] = chosenShapes.map((shape, idx) => ({
		index: idx,
		shape,
		widgetId: `symdiag_${idx}`,
		isFullyCorrect: correctIndices.includes(idx)
	}))
	const entryByChoiceId = new Map<ChoiceId, Entry>()
	entries.forEach((entry, idx) => {
		const choiceId = CHOICE_IDS[idx]
		entryByChoiceId.set(choiceId, entry)
	})

	const sizeBase = 360 + random.nextInt(0, 40)
	const widgetWidth = sizeBase
	const widgetHeight = sizeBase
	const transparent = "#00000000"

	const widgets = entries.reduce<
		Record<
			string,
			{
				type: "symmetryDiagram"
				shape: SymmetryShape
				width: number
				height: number
				shapeColor: string
				drawCorrectLines: boolean
				drawIncorrectLines: boolean
			}
		>
	>((acc, e) => {
		acc[e.widgetId] = {
			type: "symmetryDiagram",
			shape: e.shape,
			width: widgetWidth,
			height: widgetHeight,
			shapeColor: transparent,
			drawCorrectLines: true,
			drawIncorrectLines: !e.isFullyCorrect
		}
		return acc
	}, {})

	const choices = entries.map((e, idx) => ({
		identifier: CHOICE_IDS[idx],
		content: [
			{
				type: "widgetRef" as const,
				widgetId: e.widgetId,
				widgetType: "symmetryDiagram" as const
			}
		]
	}))

	const correctChoiceIdentifiers: ChoiceId[] = entries
		.filter((e) => e.isFullyCorrect)
		.map((e) => CHOICE_IDS[e.index])

	if (correctChoiceIdentifiers.length !== 2) {
		logger.error("symmetry template expected exactly two correct shapes", {
			correctChoiceIdentifiersCount: correctChoiceIdentifiers.length
		})
		throw errors.new("expected exactly two fully-correct shapes")
	}

	const correctShapeNames = entries
		.filter((e) => e.isFullyCorrect)
		.map((e) => shapeDisplay(e.shape))

	const firstWidgetId = entries[0] ? entries[0].widgetId : "symdiag_0"

	const shared = {
		steps: [
			{
				type: "step" as const,
				title: [text("Apply the fold test for symmetry")],
				content: [
					{
						type: "widgetRef" as const,
						widgetId: firstWidgetId,
						widgetType: "symmetryDiagram" as const
					},
					{
						type: "paragraph" as const,
						content: [
							text("A symmetry line splits a figure into "),
							mathNum(2),
							text(
								" mirror halves: folding on the dashed line makes every point overlap a counterpart."
							)
						]
					}
				]
			},
			{
				type: "step" as const,
				title: [text("List each shape’s symmetry count")],
				content: entries.map((e) => {
					const count = trueSymmetryCount(e.shape)
					return {
						type: "paragraph" as const,
						content: [
							text(`${cap(shapeDisplay(e.shape))}: `),
							text("true lines "),
							text("="),
							text(" "),
							mathNum(count),
							text(".")
						]
					}
				})
			},
			{
				type: "step" as const,
				title: [text("Filter to the exact symmetry matches")],
				content: [
					{
						type: "paragraph" as const,
						content: [
							text(
								"Select only the diagrams whose dashed lines match the true set exactly—no extra incorrect lines and none missing."
							)
						]
					}
				]
			}
		],
		solution: {
			type: "solution" as const,
			content: [
				text("Therefore, select the "),
				text(joinWithAnd(correctShapeNames.map(cap))),
				text(".")
			]
		}
	}

	const isChoiceId = (value: string): value is ChoiceId => {
		for (const id of CHOICE_IDS) {
			if (id === value) {
				return true
			}
		}
		return false
	}

	const isCombinationKey = (value: string): value is CombinationKey => {
		for (const key of COMBINATION_KEYS) {
			if (key === value) {
				return true
			}
		}
		return false
	}

	const parseCombinationKey = (key: CombinationKey): ChoiceId[] => {
		const parts = key.split("__")
		const choiceIds: ChoiceId[] = []
		for (const part of parts) {
			if (!isChoiceId(part)) {
				logger.error("invalid choice identifier in combination key", {
					key,
					part
				})
				throw errors.new(`invalid combination key component '${part}'`)
			}
			choiceIds.push(part)
		}
		return choiceIds
	}

	const correctChoiceSet = new Set(correctChoiceIdentifiers)

	const createCombinationPreamble = (
		combination: (typeof FEEDBACK_COMBINATIONS)[number]
	): FeedbackPreamble => {
		const pathEntry = combination.path[0]
		if (!pathEntry) {
			logger.error("feedback combination missing path entry", {
				combinationId: combination.id
			})
			throw errors.new(`feedback combination '${combination.id}' missing path`)
		}

		const combinationKey = pathEntry.key
		if (!isCombinationKey(combinationKey)) {
			logger.error("combination key not declared in plan dimension", {
				combinationId: combination.id,
				key: combinationKey
			})
			throw errors.new(`feedback combination key '${combinationKey}' invalid`)
		}

		const choiceIds = parseCombinationKey(combinationKey)
		const selectedEntries = choiceIds.map((choiceId) => {
			const entry = entryByChoiceId.get(choiceId)
			if (!entry) {
				logger.error("missing entry for choice identifier", { choiceId })
				throw errors.new(`no entry found for choice '${choiceId}'`)
			}
			return entry
		})

		const selectedNames = selectedEntries.map((entry) => cap(shapeDisplay(entry.shape)))

		const entryExplanations = selectedEntries.map((entry) => {
			const name = cap(shapeDisplay(entry.shape))
			if (entry.isFullyCorrect) {
				return `${name} shows only the true symmetry lines.`
			}
			const issue = incorrectLineDescriptor(entry.shape)
			return `${name} is incorrect because ${issue}.`
		})

		const isCorrectCombination =
			choiceIds.length === correctChoiceIdentifiers.length &&
			choiceIds.every((choiceId) => correctChoiceSet.has(choiceId))

		const summary = isCorrectCombination
			? [
					text(
						`You selected ${joinWithAnd(selectedNames)}, and each diagram shows exactly the true symmetry lines.`
					)
				]
			: [
					text(
						`You selected ${joinWithAnd(selectedNames)}. ${entryExplanations.join(
							" "
						)} Choose ${joinWithAnd(
							correctShapeNames.map(cap)
						)} to match the true symmetry lines.`
					)
				]

		return {
			correctness: isCorrectCombination ? "correct" : "incorrect",
			summary
		}
	}

	const preambles = {
		[FEEDBACK_COMBINATIONS[0].id]: createCombinationPreamble(
			FEEDBACK_COMBINATIONS[0]
		),
		[FEEDBACK_COMBINATIONS[1].id]: createCombinationPreamble(
			FEEDBACK_COMBINATIONS[1]
		),
		[FEEDBACK_COMBINATIONS[2].id]: createCombinationPreamble(
			FEEDBACK_COMBINATIONS[2]
		),
		[FEEDBACK_COMBINATIONS[3].id]: createCombinationPreamble(
			FEEDBACK_COMBINATIONS[3]
		),
		[FEEDBACK_COMBINATIONS[4].id]: createCombinationPreamble(
			FEEDBACK_COMBINATIONS[4]
		),
		[FEEDBACK_COMBINATIONS[5].id]: createCombinationPreamble(
			FEEDBACK_COMBINATIONS[5]
		),
		[FEEDBACK_COMBINATIONS[6].id]: createCombinationPreamble(
			FEEDBACK_COMBINATIONS[6]
		),
		[FEEDBACK_COMBINATIONS[7].id]: createCombinationPreamble(
			FEEDBACK_COMBINATIONS[7]
		),
		[FEEDBACK_COMBINATIONS[8].id]: createCombinationPreamble(
			FEEDBACK_COMBINATIONS[8]
		),
		[FEEDBACK_COMBINATIONS[9].id]: createCombinationPreamble(
			FEEDBACK_COMBINATIONS[9]
		)
	} satisfies FeedbackCombinationMap<TemplateFeedbackPlan, FeedbackPreamble>

	const assessmentItem = {
		identifier: `symmetry-lines-multiselect-${seed.toString()}`,
		title: "Lines of symmetry: select all correct diagrams",
		responseDeclarations: [
			{
				identifier: "RESP" as const,
				cardinality: "multiple" as const,
				baseType: "identifier" as const,
				correct: correctChoiceIdentifiers
			}
		],
		body: [
			{
				type: "paragraph" as const,
				content: [
					text(
						"Which diagrams show all true lines of symmetry with no incorrect lines? Select exactly two."
					)
				]
			},
			{ type: "interactionRef" as const, interactionId: "choice_interaction" }
		],
		widgets,
		interactions: {
			choice_interaction: {
				type: "choiceInteraction" as const,
				responseIdentifier: "RESP" as const,
				prompt: [
					text(
						"Choose the two figures whose dashed lines are exactly the true lines of symmetry."
					)
				],
				choices,
				shuffle: true as const,
				minChoices: 2,
				maxChoices: 2
			}
		},
		feedbackPlan,
		feedback: {
			shared,
			preambles
		}
	} satisfies AssessmentItemInput<TemplateWidgets, TemplateFeedbackPlan>

	return assessmentItem
}
