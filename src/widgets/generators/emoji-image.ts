import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"

export const EmojiImagePropsSchema = z
	.object({
		type: z
			.literal("emojiImage")
			.describe(
				"Identifies this as an emoji image widget for displaying a single emoji character."
			),
		emoji: z
			.string()
			.describe(
				"The emoji character to display (e.g., '🎉', '📚', '🌟', '👍'). Must be a valid Unicode emoji. Can be single emoji or emoji with modifiers. This value is required."
			),
		size: z
			.number()
			.positive()
			.max(512)
			.describe(
				"Size of the emoji in pixels (both width and height). Controls the font size and SVG dimensions (e.g., 48, 64, 100, 32). Larger sizes show more detail. Max 512."
			)
	})
	.strict()
	.describe(
		"Renders a single emoji as an SVG image with consistent sizing and centering. Useful for icons, visual elements in problems, or decorative purposes. The emoji is centered and baseline-adjusted for proper alignment."
	)

export type EmojiImageProps = z.infer<typeof EmojiImagePropsSchema>

/**
 * Generates an SVG image widget that displays an emoji at a specified size.
 * Can be used to replace various Perseus image widgets with emoji representations.
 */
export const generateEmojiImage: WidgetGenerator<
	typeof EmojiImagePropsSchema
> = async (data) => {
	const { emoji, size } = data

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width: size, height: size },
		fontPxDefault: size * 0.9,
		lineHeightDefault: 1.2
	})
	const cx = size / 2
	const emojiY = size * 0.85 // Adjust for emoji baseline

	// Render the emoji
	canvas.drawText({
		x: cx,
		y: emojiY,
		text: emoji,
		fontPx: size * 0.9,
		anchor: "middle",
		dominantBaseline: "middle"
	})

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`
}
