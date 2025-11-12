import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type {
	CombinationFeedbackDimension,
	FeedbackCombination,
	FeedbackDimension,
	FeedbackPlanAny
} from "@/core/feedback/plan"
import type {
	ChoiceIdentifier,
	FeedbackCombinationIdentifier,
	ResponseIdentifier
} from "@/core/identifiers"
import type { Interaction } from "@/core/interactions"
import type { ResponseDeclaration } from "@/core/item"
import {
	assertChoiceIdentifier,
	assertFeedbackCombinationIdentifier
} from "@/schemas/identifiers/runtime"

const normalizeIdPart = (part: string): ChoiceIdentifier => {
	const normalized = part.toUpperCase().replace(/[^A-Z0-9_]/g, "_")
	const ensured = /^[A-Z]/.test(normalized) ? normalized : `N_${normalized}`
	return assertChoiceIdentifier(ensured)
}

const deriveComboIdentifier = (pathParts: ChoiceIdentifier[]) =>
	assertFeedbackCombinationIdentifier(`FB__${pathParts.join("__")}`)

const MAX_COMBINATION_KEYS = 2048

const createCombinationKeys = (
	choices: readonly ChoiceIdentifier[],
	minSelections: number,
	maxSelections: number
): string[] => {
	const boundedMin = Math.max(0, Math.min(minSelections, choices.length))
	const boundedMax = Math.max(
		boundedMin,
		Math.min(maxSelections, choices.length)
	)
	const results: string[] = []
	const selection: ChoiceIdentifier[] = []
	if (boundedMin === 0) {
		results.push("NONE")
	}

	const pushCombination = (): void => {
		if (
			selection.length >= boundedMin &&
			selection.length <= boundedMax &&
			selection.length > 0
		) {
			results.push(selection.join("__"))
		}
	}

	const build = (start: number): void => {
		for (let idx = start; idx < choices.length; idx += 1) {
			const choice = choices[idx]
			selection.push(choice)
			pushCombination()
			if (selection.length < boundedMax) {
				build(idx + 1)
			}
			selection.pop()
		}
	}

	build(0)

	const unique = Array.from(new Set(results))
	unique.sort((a, b) => a.localeCompare(b))
	return unique
}

/**
 * Derives an explicit FeedbackPlan from interactions and responseDeclarations.
 * This is the ONLY place we allow inference—before the compiler sees the data.
 * The compiler will validate this plan but never infer its own.
 */
export function buildFeedbackPlanFromInteractions<E extends readonly string[]>(
	interactions: Record<string, Interaction<E>>,
	responseDeclarations: ResponseDeclaration[]
): FeedbackPlanAny {
	const sortedInteractions: Array<Interaction<E>> = Object.values(
		interactions
	).sort((a, b) => {
		if (a.responseIdentifier < b.responseIdentifier) return -1
		if (a.responseIdentifier > b.responseIdentifier) return 1
		return 0
	})

	const declMap: Map<string, ResponseDeclaration> = new Map(
		responseDeclarations.map((d) => [d.identifier, d])
	)

	const dimensions: FeedbackDimension[] = []
	for (const interaction of sortedInteractions) {
		const decl = declMap.get(interaction.responseIdentifier)
		if (!decl) continue

		if (decl.baseType === "identifier") {
			if (decl.cardinality === "single") {
				if (
					interaction.type === "choiceInteraction" ||
					interaction.type === "inlineChoiceInteraction"
				) {
					dimensions.push({
						responseIdentifier: interaction.responseIdentifier,
						kind: "enumerated",
						keys: interaction.choices.map((c) => c.identifier)
					})
					continue
				}
			} else if (
				decl.cardinality === "multiple" &&
				interaction.type === "choiceInteraction"
			) {
				const choiceIds: readonly ChoiceIdentifier[] = interaction.choices.map(
					(c) => c.identifier
				)
				const effectiveMin = Math.max(
					0,
					Math.min(interaction.minChoices, choiceIds.length)
				)
				const effectiveMax = Math.max(
					effectiveMin,
					Math.min(interaction.maxChoices, choiceIds.length)
				)
				const combinationKeys: readonly string[] = createCombinationKeys(
					choiceIds,
					effectiveMin,
					effectiveMax
				)

				if (combinationKeys.length === 0) {
					logger.error("no valid combinations for multi-select interaction", {
						responseIdentifier: interaction.responseIdentifier,
						choiceCount: choiceIds.length,
						effectiveMin,
						effectiveMax
					})
					throw errors.new(
						`no valid combinations for '${interaction.responseIdentifier}'`
					)
				}

				if (combinationKeys.length > MAX_COMBINATION_KEYS) {
					logger.error("multi-select combination count exceeds limit", {
						responseIdentifier: interaction.responseIdentifier,
						combinationKeyCount: combinationKeys.length,
						limit: MAX_COMBINATION_KEYS
					})
					throw errors.new(
						`feedback combination count exceeds limit for '${interaction.responseIdentifier}'`
					)
				}

				const combinationDimension: CombinationFeedbackDimension<
					ResponseIdentifier,
					number,
					number,
					readonly ChoiceIdentifier[],
					readonly string[]
				> = {
					responseIdentifier: interaction.responseIdentifier,
					kind: "combination",
					choices: choiceIds,
					minSelections: effectiveMin,
					maxSelections: effectiveMax,
					keys: combinationKeys
				}
				dimensions.push(combinationDimension)
				continue
			}
		}
		dimensions.push({
			responseIdentifier: interaction.responseIdentifier,
			kind: "binary"
		})
	}

	type DimensionEntry = {
		dimension: FeedbackDimension
		keys: readonly string[]
	}

	const dimensionEntries: DimensionEntry[] = dimensions.map((dimension) => {
		if (dimension.kind === "enumerated") {
			return { dimension, keys: dimension.keys }
		}
		if (dimension.kind === "combination") {
			return { dimension, keys: dimension.keys }
		}
		return {
			dimension,
			keys: ["CORRECT", "INCORRECT"] as const
		}
	})

	if (dimensionEntries.length === 0) {
		logger.error("feedback plan builder: no interactions available")
		throw errors.new("feedback plan requires at least one interaction")
	}

	const combinationCount = dimensionEntries.reduce<number>(
		(acc, entry) => acc * entry.keys.length,
		1
	)

	logger.info("built feedback plan", {
		combinationCount,
		dimensionCount: dimensionEntries.length
	})

	const combinations: Array<
		FeedbackCombination<
			FeedbackCombinationIdentifier,
			readonly FeedbackDimension[]
		>
	> = []
	const combinationIds = new Set<FeedbackCombinationIdentifier>()

	const buildCombinations = (
		index: number,
		path: Array<{ responseIdentifier: ResponseIdentifier; key: string }>
	): void => {
		if (index >= dimensionEntries.length) {
			const derivedId = deriveComboIdentifier(
				path.map((seg) =>
					assertChoiceIdentifier(
						`${normalizeIdPart(seg.responseIdentifier)}_${normalizeIdPart(
							seg.key
						)}`
					)
				)
			)
			if (combinationIds.has(derivedId)) {
				logger.error("duplicate feedback combination id detected", {
					derivedId,
					path
				})
				throw errors.new(
					`duplicate feedback combination id detected: ${derivedId}`
				)
			}
			combinationIds.add(derivedId)
			combinations.push({ id: derivedId, path: [...path] })
			return
		}
		const entry = dimensionEntries[index]
		for (const key of entry.keys) {
			path.push({ responseIdentifier: entry.dimension.responseIdentifier, key })
			buildCombinations(index + 1, path)
			path.pop()
		}
	}

	buildCombinations(0, [])

	return {
		dimensions: dimensionEntries.map((entry) => entry.dimension),
		combinations
	} satisfies FeedbackPlanAny
}
