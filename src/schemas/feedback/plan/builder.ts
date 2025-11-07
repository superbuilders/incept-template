import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type {
	EnumeratedFeedbackDimension,
	FeedbackCombination,
	FeedbackDimension,
	FeedbackPlanAny
} from "@/core/feedback/plan/types"
import type {
	ChoiceIdentifier,
	FeedbackCombinationIdentifier,
	ResponseIdentifier
} from "@/core/identifiers/types"
import type { Interaction } from "@/core/interactions/types"
import type { ResponseDeclaration } from "@/core/item/types"
import {
	assertChoiceIdentifier,
	assertFeedbackCombinationIdentifier
} from "@/schemas/identifiers/runtime"

const SYNTHETIC_OVERALL_IDENTIFIER: ResponseIdentifier = "RESP__OVERALL"

const normalizeIdPart = (part: string): ChoiceIdentifier => {
	const normalized = part.toUpperCase().replace(/[^A-Z0-9_]/g, "_")
	const ensured = /^[A-Z]/.test(normalized) ? normalized : `N_${normalized}`
	return assertChoiceIdentifier(ensured)
}

const deriveComboIdentifier = (pathParts: ChoiceIdentifier[]) =>
	assertFeedbackCombinationIdentifier(`FB__${pathParts.join("__")}`)

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

		if (decl.baseType === "identifier" && decl.cardinality === "single") {
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
		}
		dimensions.push({
			responseIdentifier: interaction.responseIdentifier,
			kind: "binary"
		})
	}

	const enumeratedDimensions: EnumeratedFeedbackDimension<
		ResponseIdentifier,
		readonly string[]
	>[] = dimensions.map((dim) =>
		dim.kind === "enumerated"
			? dim
			: {
					responseIdentifier: dim.responseIdentifier,
					kind: "enumerated" as const,
					keys: ["CORRECT", "INCORRECT"]
				}
	)

	if (enumeratedDimensions.length === 0) {
		enumeratedDimensions.push({
			responseIdentifier: SYNTHETIC_OVERALL_IDENTIFIER,
			kind: "enumerated",
			keys: ["CORRECT", "INCORRECT"]
		})
	}

	const combinationCount = enumeratedDimensions.reduce<number>(
		(acc, dim) => acc * dim.keys.length,
		1
	)

	logger.info("built feedback plan", {
		combinationCount,
		dimensionCount: enumeratedDimensions.length
	})

	const combinations: Array<
		FeedbackCombination<
			FeedbackCombinationIdentifier,
			readonly FeedbackDimension[]
		>
	> = []
	const combinationIds = new Set<FeedbackCombinationIdentifier>()

	const useSyntheticOverall =
		enumeratedDimensions.length === 1 &&
		enumeratedDimensions[0]?.responseIdentifier === SYNTHETIC_OVERALL_IDENTIFIER

	const buildCombinations = (
		index: number,
		path: Array<{ responseIdentifier: ResponseIdentifier; key: string }>
	) => {
		if (index >= enumeratedDimensions.length) {
			let derivedId: string
			if (useSyntheticOverall) {
				derivedId = path[0]?.key ?? "CORRECT"
			} else {
				derivedId = deriveComboIdentifier(
					path.map(
						(seg) =>
							`${normalizeIdPart(seg.responseIdentifier)}_${normalizeIdPart(seg.key)}`
					)
				)
			}
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
		const dimension = enumeratedDimensions[index]
		for (const key of dimension.keys) {
			path.push({ responseIdentifier: dimension.responseIdentifier, key })
			buildCombinations(index + 1, path)
			path.pop()
		}
	}

	buildCombinations(0, [])

	return {
		dimensions: enumeratedDimensions,
		combinations
	} satisfies FeedbackPlanAny
}
