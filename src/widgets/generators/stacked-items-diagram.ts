import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"

function createEmojiSchema() {
	return z
		.object({
			emoji: z
				.string()
				.describe(
					"The emoji character to display (e.g., '🍦' for ice cream cone, '🍨' for scoop, '🥞' for pancake, '📚' for books). Single emoji recommended. This value is required."
				),
			size: z
				.number()
				.positive()
				.max(512)
				.describe(
					"Size of the emoji in pixels (e.g., 60, 80, 48). Controls both font size and spacing. Larger sizes are more visible but take more space. Max 512."
				),
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
				.describe(
					"Accessibility label describing the emoji for screen readers (e.g., 'ice cream cone', 'scoop of ice cream', 'pancake', null). Optional; null means no label. Plaintext only; no markdown or HTML."
				)
		})
		.strict()
}

export const StackedItemsDiagramPropsSchema = z
	.object({
		type: z
			.literal("stackedItemsDiagram")
			.describe(
				"Identifies this as a stacked items diagram for visualizing repeated objects in a stack."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		altText: z
			.string()
			.describe(
				"Comprehensive description of the complete stacked image for accessibility (e.g., 'An ice cream cone with 3 scoops stacked on top'). Describes the final visual."
			),
		baseItem: createEmojiSchema().describe(
			"The bottom/foundation item that appears once. This anchors the stack (e.g., cone for ice cream, plate for pancakes)."
		),
		stackedItem: createEmojiSchema().describe(
			"The item that repeats in the stack. Appears 'count' times above/beside the base (e.g., ice cream scoops, pancakes, books)."
		),
		count: z
			.number()
			.int()
			.min(0)
			.describe(
				"Number of times to repeat the stacked item (e.g., 3 for three scoops, 5 for five pancakes). Can be 0 for just the base. Must be non-negative."
			),
		orientation: z
			.enum(["vertical", "horizontal"])
			.describe(
				"Stacking direction. 'vertical' stacks upward (like ice cream), 'horizontal' stacks sideways (like books on shelf)."
			),
		overlap: z
			.number()
			.min(0)
			.max(1.2)
			.describe(
				"Overlap factor between stacked items. 1.0 = touching edges, 0.5 = 50% overlap, >1 = gaps between items. Typical: 0.7–0.9 for realistic stacking. Range: 0–1.2."
			)
	})
	.strict()
	.describe(
		"Creates visual representations of stacked items using emojis, perfect for word problems and counting exercises. Commonly used for ice cream scoops on cones, pancake stacks, book piles, or any scenario involving repeated items. The overlap parameter creates realistic-looking stacks."
	)

export type StackedItemsDiagramProps = z.infer<
	typeof StackedItemsDiagramPropsSchema
>

/**
 * This template is designed to generate a simple, clear visual representation of a quantity
 * by stacking emoji items on top of a base emoji. It is particularly useful for word problems where
 * a count of items (like scoops of ice cream, pancakes, or blocks) is central to the problem.
 */
export const generateStackedItemsDiagram: WidgetGenerator<
	typeof StackedItemsDiagramPropsSchema
> = async (data) => {
	const {
		width,
		height,
		altText,
		baseItem,
		stackedItem,
		count,
		orientation,
		overlap
	} = data
	let html = `<div style="position: relative; width: ${width}px; height: ${height}px;" role="img" aria-label="${altText}">`

	// Base item is aligned to the bottom-left corner of the container
	const baseLabel = baseItem.label ? ` aria-label="${baseItem.label}"` : ""
	html += `<span style="position: absolute; bottom: 0; left: 0; font-size: ${baseItem.size}px; line-height: 1; z-index: 1;"${baseLabel}>${baseItem.emoji}</span>`

	// Stacked items
	for (let i = 0; i < count; i++) {
		let posStyle = ""
		if (orientation === "vertical") {
			// Each new item is placed higher than the last.
			// Overlap of 1 means they are at the same spot. Overlap of 0 means they touch.
			const step = stackedItem.size * (1 - overlap)
			posStyle = `bottom: ${i * step}px; left: 0;`
		} else {
			// Horizontal stacking
			const step = stackedItem.size * (1 - overlap)
			posStyle = `left: ${i * step}px; bottom: 0;`
		}
		const stackedLabel = stackedItem.label
			? ` aria-label="${stackedItem.label}"`
			: ""
		html += `<span style="position: absolute; font-size: ${stackedItem.size}px; line-height: 1; ${posStyle} z-index: ${i + 2};"${stackedLabel}>${stackedItem.emoji}</span>`
	}

	html += "</div>"
	return html
}
