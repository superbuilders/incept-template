import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type {
	FeedbackCombination,
	FeedbackDimension,
	FeedbackPlan
} from "@/core/feedback/plan/types"
import { deriveComboIdentifier, normalizeIdPart } from "@/core/feedback/utils"
import type { AnyInteraction } from "@/core/interactions/types"
import type { ResponseDeclaration } from "@/core/item/types"

/**
 * Derives an explicit FeedbackPlan from interactions and responseDeclarations.
 * This is the ONLY place we allow inference—before the compiler sees the data.
 * The compiler will validate this plan but never infer its own.
 */
export function buildFeedbackPlanFromInteractions<E extends readonly string[]>(
	interactions: Record<string, AnyInteraction<E>>,
	responseDeclarations: ResponseDeclaration[]
): FeedbackPlan {
	const sortedInteractions: Array<AnyInteraction<E>> = Object.values(
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

	const combinationCount = dimensions.reduce<number>(
		(acc, dim) => acc * (dim.kind === "enumerated" ? dim.keys.length : 2),
		1
	)
	const mode = dimensions.length === 0 ? "fallback" : "combo"
	const loggedCombinationCount = mode === "fallback" ? 2 : combinationCount

	logger.info("built feedback plan", {
		mode,
		combinationCount: loggedCombinationCount,
		dimensionCount: dimensions.length
	})

	const combinations: FeedbackCombination[] = []
	const combinationIds = new Set<string>()

	if (mode === "fallback") {
		combinations.push(
			{ id: "CORRECT", path: [] },
			{ id: "INCORRECT", path: [] }
		)
		combinationIds.add("CORRECT")
		combinationIds.add("INCORRECT")
	} else {
		let paths: Array<Array<{ responseIdentifier: string; key: string }>> = [[]]
		for (const dim of dimensions) {
			const newPaths: Array<
				Array<{ responseIdentifier: string; key: string }>
			> = []
			const keys =
				dim.kind === "enumerated" ? dim.keys : ["CORRECT", "INCORRECT"]
			for (const path of paths) {
				for (const key of keys) {
					newPaths.push([
						...path,
						{ responseIdentifier: dim.responseIdentifier, key }
					])
				}
			}
			paths = newPaths
		}
		for (const path of paths) {
			const derivedId = deriveComboIdentifier(
				path.map(
					(seg) =>
						`${normalizeIdPart(seg.responseIdentifier)}_${normalizeIdPart(seg.key)}`
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
			combinations.push({ id: derivedId, path })
		}
	}

	return mode === "fallback"
		? {
			mode: "fallback" as const,
			dimensions,
			combinations
		}
		: {
			mode: "combo" as const,
			dimensions,
			combinations
		}
}
