import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

function createStyleSchema() {
	return z
		.object({
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
				.describe(
					"Display name for this number set (e.g., 'Whole Numbers', 'Integers', 'Rational', 'ℚ', null). Can use symbols or full names. Null shows no label."
				),
			color: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.describe(
					"Hex-only fill color for this set's region (e.g., '#E8F4FD', '#1E90FF', '#FFC86480' for 50% alpha). Use translucency via 8-digit hex for nested visibility."
				)
		})
		.strict()
}

// The main Zod schema for the numberSetDiagram function
export const NumberSetDiagramPropsSchema = z
	.object({
		type: z.literal("numberSetDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		sets: z
			.object({
				whole: createStyleSchema().describe(
					"Style for whole numbers (0, 1, 2, ...). The innermost set in the hierarchy."
				),
				integer: createStyleSchema().describe(
					"Style for integers (..., -2, -1, 0, 1, 2, ...). Contains whole numbers and their negatives."
				),
				rational: createStyleSchema().describe(
					"Style for rational numbers (fractions/decimals). Contains integers and all fractions. Shown as containing whole ⊂ integer."
				),
				irrational: createStyleSchema().describe(
					"Style for irrational numbers (π, √2, e, ...). Separate from rationals, together they form the reals."
				)
			})
			.strict()
			.describe(
				"Styling for each number set in the hierarchy. The diagram shows whole ⊂ integer ⊂ rational, with irrational separate."
			)
	})
	.strict()
	.describe(
		"Creates an Euler diagram showing the hierarchical relationship between number sets. Whole numbers nest inside integers, which nest inside rationals. Irrationals are shown separately. Together, rationals and irrationals form the real numbers. Essential for teaching number system classification and set relationships."
	)

export type NumberSetDiagramProps = z.infer<typeof NumberSetDiagramPropsSchema>

/**
 * Generates a static SVG Euler diagram that visually represents the hierarchical
 * relationship between different sets of numbers (whole, integer, rational, irrational).
 */
export const generateNumberSetDiagram: WidgetGenerator<
	typeof NumberSetDiagramPropsSchema
> = async (data) => {
	const { width, height, sets } = data

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 14,
		lineHeightDefault: 1.2
	})

	canvas.addStyle(
		".set-label { font-size: 14px; font-weight: bold; text-anchor: middle; dominant-baseline: middle; fill: black; }"
	)

	const mainCenterX = width * 0.4
	const mainCenterY = height / 2
	const rationalRx = width * 0.35
	const rationalRy = height * 0.45

	const irrationalCenterX = width * 0.8
	const irrationalCenterY = height / 2
	const irrationalRx = width * 0.15
	const irrationalRy = height * 0.3

	// Rational Numbers (outermost of the nested set)
	canvas.drawEllipse(mainCenterX, mainCenterY, rationalRx, rationalRy, {
		fill: sets.rational.color,
		stroke: theme.colors.black
	})
	if (sets.rational.label !== null) {
		canvas.drawText({
			x: mainCenterX,
			y: mainCenterY - rationalRy + 20,
			text: sets.rational.label,
			fontPx: 14,
			fontWeight: theme.font.weight.bold,
			anchor: "middle",
			dominantBaseline: "middle"
		})
	}

	// Integer Numbers
	const integerRx = rationalRx * 0.7
	const integerRy = rationalRy * 0.7
	canvas.drawEllipse(mainCenterX, mainCenterY, integerRx, integerRy, {
		fill: sets.integer.color,
		stroke: theme.colors.black
	})
	if (sets.integer.label !== null) {
		canvas.drawText({
			x: mainCenterX,
			y: mainCenterY - integerRy + (rationalRy - integerRy) / 2,
			text: sets.integer.label,
			fontPx: 14,
			fontWeight: theme.font.weight.bold,
			anchor: "middle",
			dominantBaseline: "middle"
		})
	}

	// Whole Numbers
	const wholeRx = integerRx * 0.6
	const wholeRy = integerRy * 0.6
	canvas.drawEllipse(mainCenterX, mainCenterY, wholeRx, wholeRy, {
		fill: sets.whole.color,
		stroke: theme.colors.black
	})
	if (sets.whole.label !== null) {
		canvas.drawText({
			x: mainCenterX,
			y: mainCenterY,
			text: sets.whole.label,
			fontPx: 14,
			fontWeight: theme.font.weight.bold,
			anchor: "middle",
			dominantBaseline: "middle"
		})
	}

	// Irrational Numbers (separate)
	canvas.drawEllipse(
		irrationalCenterX,
		irrationalCenterY,
		irrationalRx,
		irrationalRy,
		{
			fill: sets.irrational.color,
			stroke: theme.colors.black
		}
	)
	if (sets.irrational.label !== null) {
		canvas.drawText({
			x: irrationalCenterX,
			y: irrationalCenterY,
			text: sets.irrational.label,
			fontPx: 14,
			fontWeight: theme.font.weight.bold,
			anchor: "middle",
			dominantBaseline: "middle"
		})
	}

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
