import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type {
	BlockContent,
	FeedbackContent,
	InlineContent
} from "@/core/content/types"
import type {
	AuthoringFeedbackOverall,
	AuthoringNestedLeaf,
	AuthoringNestedNode
} from "@/core/feedback/authoring/types"
import type { FeedbackPlan } from "@/core/feedback/plan/types"
import type { AnyInteraction } from "@/core/interactions/types"

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
	interactions: Record<string, AnyInteraction<E>> | null,
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
			case "unsupportedInteraction":
				break
		}
	}
}

function isLeafNode<E extends readonly string[]>(
	node: AuthoringNestedLeaf<E> | AuthoringNestedNode<FeedbackPlan, E>
): node is AuthoringNestedLeaf<E> {
	return (
		"content" in node &&
		typeof node.content === "object" &&
		node.content !== null &&
		"steps" in node.content &&
		"solution" in node.content
	)
}

function walkFeedbackNode<E extends readonly string[]>(
	node: AuthoringNestedLeaf<E> | AuthoringNestedNode<FeedbackPlan, E>,
	out: Map<string, string>
): void {
	if (isLeafNode(node)) {
		const feedbackContent: FeedbackContent<E> = node.content
		walkInline(feedbackContent.preamble.summary, out)
		for (const step of feedbackContent.steps) {
			walkInline(step.title, out)
			walkBlock(step.content, out)
		}
		walkInline(feedbackContent.solution.content, out)
		return
	}

	const branchNode = node
	for (const responseNode of Object.values(branchNode)) {
		for (const keyNode of Object.values(responseNode)) {
			walkFeedbackNode(keyNode, out)
		}
	}
}

function isFallbackFeedback<E extends readonly string[]>(
	overall: AuthoringFeedbackOverall<FeedbackPlan, E>
): overall is {
	CORRECT: AuthoringNestedLeaf<E>
	INCORRECT: AuthoringNestedLeaf<E>
} {
	return "CORRECT" in overall && "INCORRECT" in overall
}

function walkFeedbackOverall<E extends readonly string[]>(
	overall: AuthoringFeedbackOverall<FeedbackPlan, E>,
	out: Map<string, string>
): void {
	if (isFallbackFeedback(overall)) {
		const correctContent = overall.CORRECT.content
		const incorrectContent = overall.INCORRECT.content
		walkInline(correctContent.preamble.summary, out)
		for (const step of correctContent.steps) {
			walkInline(step.title, out)
			walkBlock(step.content, out)
		}
		walkInline(correctContent.solution.content, out)
		walkInline(incorrectContent.preamble.summary, out)
		for (const step of incorrectContent.steps) {
			walkInline(step.title, out)
			walkBlock(step.content, out)
		}
		walkInline(incorrectContent.solution.content, out)
		return
	}

	const comboFeedback = overall
	for (const responseNode of Object.values(comboFeedback)) {
		for (const keyNode of Object.values(responseNode)) {
			walkFeedbackNode(keyNode, out)
		}
	}
}

/**
 * Collects all widget references with their types from every location within an assessment item structure.
 * This includes the body, nested feedback object, interactions (prompts, choices, gap texts), and any nested inline content.
 *
 * @param item - An object conforming to the structure of an AssessmentItemInput.
 * @returns A Map from widgetId to widgetType. Throws if the same widgetId has conflicting types.
 */
export function collectWidgetRefs<E extends readonly string[]>(item: {
	body: BlockContent<E> | null
	feedback: {
		FEEDBACK__OVERALL: AuthoringFeedbackOverall<FeedbackPlan, E>
	} | null
	interactions: Record<string, AnyInteraction<E>> | null
}): Map<string, string> {
	const out = new Map<string, string>()

	walkBlock(item.body, out)
	if (item.feedback) {
		walkFeedbackOverall(item.feedback.FEEDBACK__OVERALL, out)
	}
	walkInteractions(item.interactions, out)

	return out
}

/**
 * Collects just the widget IDs from an assessment item.
 */
export function collectAllWidgetSlotIds<E extends readonly string[]>(item: {
	body: BlockContent<E> | null
	feedback: {
		FEEDBACK__OVERALL: AuthoringFeedbackOverall<FeedbackPlan, E>
	} | null
	interactions: Record<string, AnyInteraction<E>> | null
}): string[] {
	const refs = collectWidgetRefs(item)
	return Array.from(refs.keys()).sort()
}
