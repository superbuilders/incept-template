import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import {
	renderBlockContent,
	renderInlineContent
} from "@/compiler/content-renderer"
import { escapeXmlAttribute } from "@/compiler/utils/xml-utils"
import type { AnyInteraction } from "@/core/interactions/types"

export function compileInteraction<
	E extends readonly string[] = readonly string[]
>(
	interaction: AnyInteraction<E>,
	widgetSlots: Map<string, string>,
	interactionSlots: Map<string, string>
): string {
	let interactionXml: string

	switch (interaction.type) {
		case "choiceInteraction": {
			const promptXml = renderInlineContent(
				interaction.prompt,
				widgetSlots,
				interactionSlots
			)
			const choicesXml = interaction.choices
				.map((c): string => {
					const contentXml = renderBlockContent(
						c.content,
						widgetSlots,
						interactionSlots
					)
					return `<qti-simple-choice identifier="${escapeXmlAttribute(c.identifier)}">${contentXml}</qti-simple-choice>`
				})
				.join("\n            ")

			interactionXml = `<qti-choice-interaction response-identifier="${escapeXmlAttribute(interaction.responseIdentifier)}" shuffle="${interaction.shuffle}" min-choices="${interaction.minChoices}" max-choices="${interaction.maxChoices}">
            <qti-prompt>${promptXml}</qti-prompt>
            ${choicesXml}
        </qti-choice-interaction>`
			break
		}
		case "orderInteraction": {
			const promptXml = renderInlineContent(
				interaction.prompt,
				widgetSlots,
				interactionSlots
			)
			const choicesXml = interaction.choices
				.map((c): string => {
					const contentXml = renderBlockContent(
						c.content,
						widgetSlots,
						interactionSlots
					)
					return `<qti-simple-choice identifier="${escapeXmlAttribute(c.identifier)}">${contentXml}</qti-simple-choice>`
				})
				.join("\n            ")

			interactionXml = `<qti-order-interaction response-identifier="${escapeXmlAttribute(interaction.responseIdentifier)}" shuffle="${interaction.shuffle}" orientation="${escapeXmlAttribute(interaction.orientation)}">
            <qti-prompt>${promptXml}</qti-prompt>
            ${choicesXml}
        </qti-order-interaction>`
			break
		}
		case "textEntryInteraction": {
			interactionXml = `<qti-text-entry-interaction response-identifier="${escapeXmlAttribute(interaction.responseIdentifier)}"${
				interaction.expectedLength
					? ` expected-length="${interaction.expectedLength}"`
					: ""
			}/>`
			break
		}
		case "inlineChoiceInteraction": {
			const choicesXml = interaction.choices
				.map(
					(c): string =>
						`<qti-inline-choice identifier="${escapeXmlAttribute(c.identifier)}">${renderInlineContent(c.content, widgetSlots, interactionSlots)}</qti-inline-choice>`
				)
				.join("\n                ")

			interactionXml = `<qti-inline-choice-interaction response-identifier="${escapeXmlAttribute(interaction.responseIdentifier)}" shuffle="${interaction.shuffle}">
                ${choicesXml}
            </qti-inline-choice-interaction>`
			break
		}
		case "gapMatchInteraction": {
			const gapTextsXml = interaction.gapTexts
				.map((gt): string => {
					const contentXml = renderInlineContent(
						gt.content,
						widgetSlots,
						interactionSlots
					)
					return `<qti-gap-text identifier="${escapeXmlAttribute(gt.identifier)}" match-max="${gt.matchMax}">${contentXml}</qti-gap-text>`
				})
				.join("\n            ")

			const innerContent = interaction.content
				? `\n            ${renderBlockContent(interaction.content, widgetSlots, interactionSlots)}\n        `
				: ""

			// NEW: Compile-time guard - defense in depth
			if (innerContent.trim() === "") {
				logger.error("gap match rendering: no content resulted in empty XML", {
					responseIdentifier: interaction.responseIdentifier
				})
				throw errors.new("gap match rendering: no content")
			}

			const renderedGapCount = (innerContent.match(/<qti-gap/g) || []).length
			if (renderedGapCount !== interaction.gaps.length) {
				logger.error("gap match rendering: gap count mismatch after render", {
					responseIdentifier: interaction.responseIdentifier,
					expected: interaction.gaps.length,
					found: renderedGapCount
				})
				throw errors.new("gap match rendering: gap count mismatch")
			}

			interactionXml = `<qti-gap-match-interaction response-identifier="${escapeXmlAttribute(
				interaction.responseIdentifier
			)}" shuffle="${interaction.shuffle}" max-associations="${interaction.gaps.length}">
            ${gapTextsXml}${innerContent}
        </qti-gap-match-interaction>`
			break
		}
		default: {
			// This should never happen if all interaction types are handled
			// We can't access properties on 'never', so we throw a generic error
			logger.error("unhandled interaction type in switch statement", {
				interaction
			})
			throw errors.new("Unhandled interaction type in switch statement")
		}
	}

	// Wrapping policy:
	// - Inline interactions (textEntryInteraction, inlineChoiceInteraction) remain unwrapped
	// - gapMatchInteraction must also remain unwrapped so that it can directly contain its own inner content
	// - Other block interactions are wrapped in a div for safe mixing with other block elements
	if (
		interaction.type === "textEntryInteraction" ||
		interaction.type === "inlineChoiceInteraction" ||
		interaction.type === "gapMatchInteraction"
	) {
		return interactionXml
	}
	return `<div>${interactionXml}</div>`
}
