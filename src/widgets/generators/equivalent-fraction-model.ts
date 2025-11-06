import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// The main Zod schema for the equivalent fraction model diagram.
export const EquivalentFractionModelPropsSchema = z
	.object({
		type: z
			.literal("equivalentFractionModel")
			.describe(
				"Identifies this as a widget for comparing equivalent fractions (tenths and hundredths)."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		numerator: z
			.number()
			.int()
			.min(0)
			.max(10)
			.describe(
				"The numerator for the tenths fraction (e.g., for 3/10, this value is 3). Must be between 0 and 10."
			),
		tenthsColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("CSS color for the shaded tenths bars."),
		hundredthsColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("CSS color for the shaded hundredths squares.")
	})
	.strict()
	.describe(
		"Creates a visual comparison of a fraction in tenths and its equivalent in hundredths using two partitioned squares. The left square shows shaded vertical bars for tenths, and the right square shows a shaded 10x10 grid for hundredths."
	)

export type EquivalentFractionModelProps = z.infer<
	typeof EquivalentFractionModelPropsSchema
>

/**
 * Generates an SVG diagram comparing a fraction in tenths to its equivalent in hundredths.
 */
export const generateEquivalentFractionModel: WidgetGenerator<
	typeof EquivalentFractionModelPropsSchema
> = async (props) => {
	const { width, height, numerator, tenthsColor, hundredthsColor } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// --- Layout Calculations ---
	const boxSize = Math.min(width * 0.4, height) - PADDING * 2
	const gap = Math.max(40, width * 0.1)
	const totalContentWidth = boxSize * 2 + gap
	const startX = (width - totalContentWidth) / 2
	const yPos = (height - boxSize) / 2

	const leftBoxX = startX
	const rightBoxX = startX + boxSize + gap

	// --- Draw Left Shape (Tenths) ---
	const barWidth = boxSize / 10
	// Shaded parts first
	for (let i = 0; i < numerator; i++) {
		canvas.drawRect(leftBoxX + i * barWidth, yPos, barWidth, boxSize, {
			fill: tenthsColor,
			stroke: "none"
		})
	}
	// Grid lines on top
	for (let i = 1; i < 10; i++) {
		const x = leftBoxX + i * barWidth
		canvas.drawLine(x, yPos, x, yPos + boxSize, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thin
		})
	}
	// Outer border
	canvas.drawRect(leftBoxX, yPos, boxSize, boxSize, {
		fill: "none",
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick
	})

	// --- Draw Right Shape (Hundredths) ---
	const cellWidth = boxSize / 10
	const numHundredthsShaded = numerator * 10
	// Shaded parts first
	for (let i = 0; i < numHundredthsShaded; i++) {
		const row = Math.floor(i / 10)
		const col = i % 10
		canvas.drawRect(
			rightBoxX + col * cellWidth,
			yPos + row * cellWidth,
			cellWidth,
			cellWidth,
			{
				fill: hundredthsColor,
				stroke: "none"
			}
		)
	}
	// Grid lines on top
	for (let i = 1; i < 10; i++) {
		const x = rightBoxX + i * cellWidth
		const y = yPos + i * cellWidth
		canvas.drawLine(x, yPos, x, yPos + boxSize, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thin
		})
		canvas.drawLine(rightBoxX, y, rightBoxX + boxSize, y, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thin
		})
	}
	// Outer border
	canvas.drawRect(rightBoxX, yPos, boxSize, boxSize, {
		fill: "none",
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick
	})

	// --- Draw Equals Sign ---
	const equalsX = leftBoxX + boxSize + gap / 2
	const equalsY = yPos + boxSize / 2
	canvas.drawText({
		x: equalsX,
		y: equalsY,
		text: "=",
		fill: theme.colors.text,
		anchor: "middle",
		dominantBaseline: "middle",
		fontPx: 40,
		fontWeight: theme.font.weight.light
	})

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`
}
