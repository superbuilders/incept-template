import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type { BlockContent, InlineContent } from "@/core/content"
import type {
	FeedbackBundle,
	FeedbackSharedPedagogy
} from "@/core/feedback/content"
import type { FeedbackPlanAny } from "@/core/feedback/plan"
import type { Interaction } from "@/core/interactions"

function walkInline<E extends readonly string[]>(
	inline: InlineContent<E> | null,
	out: Map<string, string>
): void {
	if (!inline) return
	for (const node of inline) {
		if (node.type === "inlineWidgetRef") {
			const existing = out.get(node.widgetId)
			if (existing && existing !== node.widgetType) {
				logger.error("conflicting widgetType for same widgetId", {
					widgetId: node.widgetId,
					existingType: existing,
					newType: node.widgetType
				})
				throw errors.new("conflicting widgetType values for same widgetId")
			}
			out.set(node.widgetId, node.widgetType)
		}
	}
}

function walkBlock<E extends readonly string[]>(
	blocks: BlockContent<E> | null,
	out: Map<string, string>
): void {
	if (!blocks) return
	for (const node of blocks) {
		switch (node.type) {
			case "widgetRef": {
				const existing = out.get(node.widgetId)
				if (existing && existing !== node.widgetType) {
					logger.error("conflicting widgetType for same widgetId", {
						widgetId: node.widgetId,
						existingType: existing,
						newType: node.widgetType
					})
					throw errors.new("conflicting widgetType values for same widgetId")
				}
				out.set(node.widgetId, node.widgetType)
				break
			}
			case "paragraph":
				walkInline(node.content, out)
				break
			case "blockquote":
				walkInline(node.content, out)
				break
			case "unorderedList":
			case "orderedList":
				for (const item of node.items) {
					walkInline(item, out)
				}
				break
			case "tableRich": {
				const walkRows = (
					rows: Array<Array<InlineContent<E> | null>> | null
				) => {
					if (!rows) return
					for (const row of rows) {
						for (const cell of row) {
							walkInline(cell, out)
						}
					}
				}
				walkRows(node.header)
				walkRows(node.rows)
				break
			}
			case "interactionRef":
				break
		}
	}
}

function walkInteractions<E extends readonly string[]>(
	interactions: Record<string, Interaction<E>> | null,
	out: Map<string, string>
): void {
	if (!interactions) return
	for (const interaction of Object.values(interactions)) {
		switch (interaction.type) {
			case "choiceInteraction":
			case "orderInteraction":
				walkInline(interaction.prompt, out)
				for (const choice of interaction.choices) {
					walkBlock(choice.content, out)
				}
				break
			case "inlineChoiceInteraction":
				for (const choice of interaction.choices) {
					walkInline(choice.content, out)
				}
				break
			case "gapMatchInteraction":
				walkBlock(interaction.content, out)
				for (const gt of interaction.gapTexts) {
					walkInline(gt.content, out)
				}
				break
			case "textEntryInteraction":
				break
		}
	}
}

function walkSharedPedagogy<E extends readonly string[]>(
	shared: FeedbackSharedPedagogy<E>,
	out: Map<string, string>
): void {
	for (const step of shared.steps) {
		walkInline(step.title, out)
		walkBlock(step.content, out)
	}
	walkInline(shared.solution.content, out)
}

/**
 * Collects all widget references with their types from every location within an assessment item structure.
 * This includes the body, nested feedback object, interactions (prompts, choices, gap texts), and any nested inline content.
 *
 * @param item - An object conforming to the structure of an AssessmentItemInput.
 * @returns A Map from widgetId to widgetType. Throws if the same widgetId has conflicting types.
 */
export function collectWidgetRefs<
	P extends FeedbackPlanAny,
	E extends readonly string[]
>(item: {
	body: BlockContent<E> | null
	feedback: FeedbackBundle<P, E> | null
	feedbackPlan: P | null
	interactions: Record<string, Interaction<E>> | null
}): Map<string, string> {
	const out = new Map<string, string>()

	walkBlock(item.body, out)
	if (item.feedback && item.feedbackPlan) {
		walkSharedPedagogy(item.feedback.shared, out)
	}
	walkInteractions(item.interactions, out)

	return out
}

/**
 * Collects just the widget IDs from an assessment item.
 */
export function collectAllWidgetSlotIds<
	P extends FeedbackPlanAny,
	E extends readonly string[]
>(item: {
	body: BlockContent<E> | null
	feedback: FeedbackBundle<P, E> | null
	feedbackPlan: P | null
	interactions: Record<string, Interaction<E>> | null
}): string[] {
	const refs = collectWidgetRefs(item)
	return Array.from(refs.keys()).sort()
}
