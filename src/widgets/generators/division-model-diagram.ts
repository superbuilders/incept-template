import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"

// The main Zod schema for the division model diagram.
export const DivisionModelDiagramPropsSchema = z
	.object({
		type: z
			.literal("divisionModelDiagram")
			.describe("Identifies this as a division model widget."),
		width: createWidthSchema(),
		height: createHeightSchema(),
		dividend: z
			.number()
			.int()
			.min(0)
			.describe("The total number of objects to be divided (the dividend)."),
		divisor: z
			.number()
			.int()
			.positive()
			.describe("The number of objects in each full row (the divisor)."),
		objectColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("CSS color for the objects.")
	})
	.strict()
	.describe(
		"Creates a visual model for division with remainders by arranging objects into a grid. The number of full rows represents the quotient, and the items in the last, incomplete row represent the remainder."
	)

export type DivisionModelDiagramProps = z.infer<
	typeof DivisionModelDiagramPropsSchema
>

/**
 * Generates an SVG diagram to model division with remainders.
 */
export const generateDivisionModelDiagram: WidgetGenerator<
	typeof DivisionModelDiagramPropsSchema
> = async (props) => {
	const { width, height, dividend, divisor, objectColor } = props

	if (divisor <= 0) {
		// Cannot divide by zero or a negative number in this model.
		return `<svg width="${width}" height="${height}" />`
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Calculate the quotient and remainder.
	const quotient = Math.floor(dividend / divisor)
	const remainder = dividend % divisor

	// Determine the grid dimensions.
	const numRows = quotient + (remainder > 0 ? 1 : 0)
	const numCols = divisor

	if (numRows === 0) {
		return `<svg width="${width}" height="${height}" />`
	}

	// Calculate the size of each cell in the grid.
	const availableWidth = width - 2 * PADDING
	const availableHeight = height - 2 * PADDING

	const cellWidth = availableWidth / numCols
	const cellHeight = availableHeight / numRows

	// Calculate the radius of the objects to fit within the cells with some padding.
	const objectRadius = Math.min(cellWidth, cellHeight) * 0.4

	// Loop through the total number of objects and draw them in the grid.
	for (let i = 0; i < dividend; i++) {
		const row = Math.floor(i / divisor)
		const col = i % divisor

		// Calculate the center coordinates for the current object.
		const cx = PADDING + col * cellWidth + cellWidth / 2
		const cy = PADDING + row * cellHeight + cellHeight / 2

		canvas.drawCircle(cx, cy, objectRadius, {
			fill: objectColor,
			stroke: "none"
		})
	}

	// Finalize the canvas to get the SVG body and calculated viewBox.
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`
}
