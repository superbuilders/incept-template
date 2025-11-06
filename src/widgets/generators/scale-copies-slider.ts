import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

function createRectSchema() {
	return z
		.object({
			width: z
				.number()
				.positive()
				.describe(
					"Width of the rectangle in relative units (e.g., 4, 6, 2.5). Not pixels - scaled to fit display area."
				),
			height: z
				.number()
				.positive()
				.describe(
					"Height of the rectangle in relative units (e.g., 3, 4, 1.5). Proportions matter more than absolute values."
				)
		})
		.strict()
}

function createGroupSchema() {
	return z
		.object({
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
				.describe(
					"Label for this shape transformation (e.g., 'Shape A', 'Rectangle 1', 'Original', null). Displayed as a header for the shape pair. Null for no label."
				),
			before: createRectSchema().describe(
				"Dimensions of the original rectangle before transformation."
			),
			after: createRectSchema().describe(
				"Dimensions of the rectangle after transformation. Compare proportions to 'before' to show scaling type."
			),
			color: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
				)
				.describe(
					"CSS fill color for both rectangles in this group (e.g., '#4472C4' for blue, 'orange', 'rgba(255,0,0,0.7)'). Distinguishes the two shape groups."
				)
		})
		.strict()
}

export const ScaleCopiesSliderPropsSchema = z
	.object({
		type: z
			.literal("scaleCopiesSlider")
			.describe(
				"Identifies this as a scale copies comparison widget showing proportional vs non-proportional scaling."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		shapeA: createGroupSchema().describe(
			"First shape transformation, typically showing proportional scaling where width and height scale by same factor."
		),
		shapeB: createGroupSchema().describe(
			"Second shape transformation, typically showing non-proportional scaling where dimensions scale differently."
		)
	})
	.strict()
	.describe(
		"Compares two rectangle transformations side-by-side to illustrate proportional (similar shapes) vs non-proportional scaling. Each group shows before/after rectangles. Essential for teaching similarity, scale factors, and distinguishing between scaling that preserves shape vs distortion."
	)

export type ScaleCopiesSliderProps = z.infer<
	typeof ScaleCopiesSliderPropsSchema
>

/**
 * Generates an SVG diagram to visually compare a proportional scaling
 * transformation against a non-proportional one.
 */
export const generateScaleCopiesSlider: WidgetGenerator<
	typeof ScaleCopiesSliderPropsSchema
> = async (props) => {
	const { width, height, shapeA, shapeB } = props

	const padding = {
		top: PADDING * 1.5,
		right: PADDING,
		bottom: PADDING * 1.5,
		left: PADDING
	}
	const rowGap = 20
	const colGap = 30 // Gap for the arrow

	// The available drawing area for each of the two main rows (Shape A and Shape B)
	const rowHeight = (height - padding.top - padding.bottom - rowGap) / 2
	// The available drawing area for each shape (Before/After) within a row
	const shapeWidth = (width - padding.left - padding.right - colGap) / 2

	// Find the maximum width and height across all four shapes to determine a universal scale factor
	const allShapes = [shapeA.before, shapeA.after, shapeB.before, shapeB.after]
	const maxWidth = Math.max(...allShapes.map((s) => s.width))
	const maxHeight = Math.max(...allShapes.map((s) => s.height))

	// Calculate scale to fit the largest shape within the allocated areas
	const scale = Math.min(shapeWidth / maxWidth, rowHeight / maxHeight)

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	canvas.addStyle(
		".label { font-size: 14px; font-weight: bold; } .sub-label { font-size: 12px; fill: #555; }"
	)

	/**
	 * Helper function to draw a single row (e.g., for Shape A) containing
	 * the "Before" shape, an arrow, and the "After" shape.
	 */
	const drawShapeGroup = (
		shape: ScaleCopiesSliderProps["shapeA"],
		yOffset: number
	): void => {
		// --- Before Shape ---
		const beforeW = shape.before.width * scale
		const beforeH = shape.before.height * scale
		const beforeX = padding.left + (shapeWidth - beforeW) / 2 // Center within its column
		const beforeY = yOffset + (rowHeight - beforeH) / 2 // Center within its row
		// Canvas automatically tracks extents
		canvas.drawRect(beforeX, beforeY, beforeW, beforeH, {
			fill: shape.color,
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thin
		})
		const beforeLabelX = padding.left + shapeWidth / 2
		canvas.drawText({
			x: beforeLabelX,
			y: yOffset + rowHeight + 15,
			text: "Before",
			anchor: "middle"
		})

		// --- Arrow ---
		const arrowXStart = padding.left + shapeWidth + 5
		const arrowXEnd = arrowXStart + colGap - 10
		const arrowY = yOffset + rowHeight / 2
		// add arrowhead marker to defs and draw a line using marker-end
		canvas.addDef(
			`<marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.colors.axis}"/></marker>`
		)
		canvas.drawLine(arrowXStart, arrowY, arrowXEnd, arrowY, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.base,
			markerEnd: "url(#arrowhead)"
		})

		// --- After Shape ---
		const afterW = shape.after.width * scale
		const afterH = shape.after.height * scale
		const afterX =
			padding.left + shapeWidth + colGap + (shapeWidth - afterW) / 2 // Center
		const afterY = yOffset + (rowHeight - afterH) / 2 // Center
		// Canvas automatically tracks extents
		canvas.drawRect(afterX, afterY, afterW, afterH, {
			fill: shape.color,
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thin
		})
		const afterLabelX = padding.left + shapeWidth + colGap + shapeWidth / 2
		canvas.drawText({
			x: afterLabelX,
			y: yOffset + rowHeight + 15,
			text: "After",
			anchor: "middle"
		})

		// --- Main Row Label (only if label exists) ---
		if (shape.label !== null) {
			const labelX = width / 2
			canvas.drawText({
				x: labelX,
				y: yOffset - 8,
				text: shape.label,
				anchor: "middle"
			})
		}
	}

	// Draw Shape A group in the top half
	drawShapeGroup(shapeA, padding.top)

	// Draw Shape B group in the bottom half
	const shapeB_Y_Offset = padding.top + rowHeight + rowGap
	drawShapeGroup(shapeB, shapeB_Y_Offset)

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
