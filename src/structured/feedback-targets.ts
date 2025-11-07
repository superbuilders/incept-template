import type { Interaction } from "@/core/interactions/types"
import type { AssessmentItemShell } from "@/core/item/types"

export type FeedbackTarget = {
	outcomeIdentifier: string
	blockIdentifier: string
}

/**
 * Enumerates all feedback targets that must be generated for an assessment item.
 * This function determines the complete set of required feedback blocks based on
 * the unified per-response feedback rule:
 * - Enumerated responses (baseType: 'identifier') get per-choice feedback
 * - Non-enumerated responses get CORRECT/INCORRECT feedback
 *
 * @param responseDeclarations - Response declarations from the assessment shell
 * @param interactions - Generated interactions that reference these responses
 * @returns Array of feedback targets with outcome and block identifiers
 */
export function enumerateFeedbackTargets<E extends readonly string[]>(
	responseDeclarations: AssessmentItemShell<E>["responseDeclarations"],
	interactions: Record<string, Interaction<E>>
): FeedbackTarget[] {
	const targets: FeedbackTarget[] = []
	const responseIdToBaseType = new Map<string, string>()

	// Build map of response IDs to their base types
	for (const rd of responseDeclarations) {
		responseIdToBaseType.set(rd.identifier, rd.baseType)
	}

	// For each interaction, determine what feedback targets are needed
	for (const interaction of Object.values(interactions)) {
		const responseId = interaction.responseIdentifier
		const baseType = responseIdToBaseType.get(responseId)

		if (!baseType) {
			// Skip interactions that don't have corresponding response declarations
			continue
		}

		const outcomeIdentifier = `FEEDBACK__${responseId}`

		if (baseType === "identifier") {
			// Enumerated response - generate per-choice feedback
			if (
				interaction.type === "choiceInteraction" ||
				interaction.type === "inlineChoiceInteraction"
			) {
				for (const choice of interaction.choices) {
					targets.push({
						outcomeIdentifier,
						blockIdentifier: choice.identifier
					})
				}
			}
		} else {
			// Non-enumerated response - generate CORRECT/INCORRECT feedback
			targets.push(
				{
					outcomeIdentifier,
					blockIdentifier: "CORRECT"
				},
				{
					outcomeIdentifier,
					blockIdentifier: "INCORRECT"
				}
			)
		}
	}

	return targets
}
