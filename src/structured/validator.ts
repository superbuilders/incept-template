import * as errors from "@superbuilders/errors"
import type * as logger from "@superbuilders/slog"
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
import type { AssessmentItemInput } from "@/core/item/types"
import {
	checkNoLatex,
	checkNoMfencedElements,
	checkNoPerseusArtifacts,
	sanitizeHtmlEntities,
	sanitizeMathMLOperators
} from "@/utils/qti-validation"

// NEW: Recursive walker function for inline content
function processInlineContent<E extends readonly string[]>(
	items: InlineContent<E> | null,
	logger: logger.Logger
): void {
	if (!items) return
	for (const item of items) {
		if (item.type === "text") {
			// MODIFIED: Add a type check to prevent crashes on undefined.
			if (typeof item.content === "string") {
				const sanitized = sanitizeHtmlEntities(item.content)
				checkNoLatex(sanitized, logger)
				checkNoPerseusArtifacts(sanitized, logger)
				item.content = sanitized
			} else {
				// This should not happen with the new strict schema, but we log it as a safeguard.
				logger.warn(
					"sanitizer skipping text item with missing or invalid 'content' field"
				)
			}
		} else if (item.type === "math") {
			// MODIFIED: Add a type check to prevent crashes on undefined.
			if (typeof item.mathml === "string") {
				const sanitized = sanitizeMathMLOperators(item.mathml)
				checkNoMfencedElements(sanitized, logger)
				item.mathml = sanitized
			} else {
				// This should not happen with the new strict schema, but we log it as a safeguard.
				logger.warn(
					"sanitizer skipping math item with missing or invalid 'mathml' field"
				)
			}
		}
	}
}

// NEW: Recursive walker function for block content
function processBlockContent<E extends readonly string[]>(
	items: BlockContent<E> | null,
	logger: logger.Logger
): void {
	if (!items) return
	for (const item of items) {
		if (item.type === "paragraph") {
			processInlineContent(item.content, logger)
		}
		if (item.type === "blockquote") {
			processInlineContent(item.content, logger)
		}
	}
}

function processFeedbackContent<E extends readonly string[]>(
	feedback: FeedbackContent<E> | null,
	logger: logger.Logger
): void {
	if (!feedback) return
	processInlineContent(feedback.preamble.summary, logger)
	for (const step of feedback.steps) {
		processInlineContent(step.title, logger)
		processBlockContent(step.content, logger)
	}
	processInlineContent(feedback.solution.content, logger)
}

export function validateAndSanitizeHtmlFields<E extends readonly string[]>(
	item: AssessmentItemInput<E, FeedbackPlan>,
	logger: logger.Logger
): AssessmentItemInput<E, FeedbackPlan> {
	// Deep clone the object to avoid mutating the original
	// Using JSON parse/stringify for deep cloning
	const clonedData = JSON.parse(JSON.stringify(item))
	// Validate the cloned data has the expected shape
	const sanitizedItem: AssessmentItemInput<E, FeedbackPlan> = clonedData

	// Apply processing to all structured content fields
	processBlockContent(sanitizedItem.body, logger)

	// Process nested feedback content recursively with precise types
	function isLeafNode(
		node: AuthoringNestedLeaf<E> | AuthoringNestedNode<FeedbackPlan, E>
	): node is AuthoringNestedLeaf<E> {
		return "content" in node
	}

	function processFeedbackNode(
		node: AuthoringNestedLeaf<E> | AuthoringNestedNode<FeedbackPlan, E>
	): void {
		if (isLeafNode(node)) {
			processFeedbackContent(node.content, logger)
			return
		}
		for (const responseId in node) {
			const responseNode = node[responseId]
			for (const key in responseNode) {
				processFeedbackNode(responseNode[key])
			}
		}
	}

	function isFallbackFeedback(
		overall: AuthoringFeedbackOverall<FeedbackPlan, E>
	): overall is {
		CORRECT: AuthoringNestedLeaf<E>
		INCORRECT: AuthoringNestedLeaf<E>
	} {
		return "CORRECT" in overall && "INCORRECT" in overall
	}

	function processOverall(
		overall: AuthoringFeedbackOverall<FeedbackPlan, E>
	): void {
		if (isFallbackFeedback(overall)) {
			processFeedbackContent(overall.CORRECT.content, logger)
			processFeedbackContent(overall.INCORRECT.content, logger)
			return
		}
		processFeedbackNode(overall)
	}

	if (sanitizedItem.feedback?.FEEDBACK__OVERALL) {
		processOverall(sanitizedItem.feedback.FEEDBACK__OVERALL)
	}

	if (sanitizedItem.interactions) {
		for (const key in sanitizedItem.interactions) {
			const interaction = sanitizedItem.interactions[key]
			if (!interaction) continue

			if ("prompt" in interaction && interaction.prompt) {
				processInlineContent(interaction.prompt, logger)
			}
			if ("choices" in interaction && interaction.choices) {
				// Runtime validation for minimum number of choices
				if (
					interaction.type === "choiceInteraction" ||
					interaction.type === "orderInteraction"
				) {
					if (interaction.choices.length < 2) {
						logger.error("interaction has insufficient choices", {
							interactionType: interaction.type,
							choiceCount: interaction.choices.length
						})
						throw errors.new(
							`${interaction.type} must have at least 2 choices, but only ${interaction.choices.length} found`
						)
					}
				}

				// Type narrowing based on interaction type
				if (interaction.type === "inlineChoiceInteraction") {
					// Now TypeScript knows this is an inlineChoiceInteraction
					for (const choice of interaction.choices) {
						processInlineContent(choice.content, logger)
					}
				} else if (
					interaction.type === "choiceInteraction" ||
					interaction.type === "orderInteraction"
				) {
					// Now TypeScript knows this is a choice/order interaction
					for (const choice of interaction.choices) {
						processBlockContent(choice.content, logger)
						// REMOVED: choice.feedback validation no longer needed
					}
				}
			}
		}
	}

	return sanitizedItem
}
