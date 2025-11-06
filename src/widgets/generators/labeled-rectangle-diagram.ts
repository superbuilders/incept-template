import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { MATHML_INNER_PATTERN } from "@/widgets/utils/mathml"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

/**
 * Creates a diagram of a rectangle with labeled sides and area.
 * This widget is ideal for problems involving the area and dimensions of a rectangle,
 * where some values may be given and others are unknown (represented by variables like 'x').
 * The diagram is intentionally not to scale to encourage solving based on the formula rather than visual estimation.
 */
export const LabeledRectangleDiagramPropsSchema = z
	.object({
		type: z.literal("labeledRectangleDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		topLabel: z
			.string()
			.regex(MATHML_INNER_PATTERN, "invalid mathml inner content")
			.nullable()
			.describe(
				"MathML INNER content (no <math> wrapper) rendered above the rectangle."
			),
		bottomLabel: z
			.string()
			.regex(MATHML_INNER_PATTERN, "invalid mathml inner content")
			.nullable()
			.describe(
				"MathML INNER content (no <math> wrapper) rendered below the rectangle."
			),
		leftLabel: z
			.string()
			.regex(MATHML_INNER_PATTERN, "invalid mathml inner content")
			.nullable()
			.describe(
				"MathML INNER content (no <math>) along the left side, rotated -90°."
			),
		rightLabel: z
			.string()
			.regex(MATHML_INNER_PATTERN, "invalid mathml inner content")
			.nullable()
			.describe(
				"MathML INNER content (no <math>) along the right side, rotated -90°."
			),
		areaLabel: z
			.string()
			.regex(MATHML_INNER_PATTERN, "invalid mathml inner content")
			.nullable()
			.describe(
				"MathML INNER content (no <math>) centered inside the rectangle."
			),
		fillColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The fill color of the rectangle."),
		borderColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The border color of the rectangle."),
		textColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The color of the text labels.")
	})
	.strict()

export type LabeledRectangleDiagramProps = z.infer<
	typeof LabeledRectangleDiagramPropsSchema
>

/**
 * Generates an SVG diagram of a labeled rectangle.
 */
export const generateLabeledRectangleDiagram: WidgetGenerator<
	typeof LabeledRectangleDiagramPropsSchema
> = async (props) => {
	const {
		width,
		height,
		topLabel,
		bottomLabel,
		leftLabel,
		rightLabel,
		areaLabel,
		fillColor,
		borderColor,
		textColor
	} = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const rectPadding = PADDING * 2.5 // Generous padding for external labels
	const rectWidth = width - rectPadding * 2
	const rectHeight = height - rectPadding * 2

	const rectX = rectPadding
	const rectY = rectPadding

	// Draw the main rectangle
	canvas.drawRect(rectX, rectY, rectWidth, rectHeight, {
		fill: fillColor,
		stroke: borderColor,
		strokeWidth: theme.stroke.width.thick
	})

	// Labels are rendered using foreignObject to allow for HTML (e.g., <sup> for exponents).
	const labelStyle = `font-family: ${theme.font.family.sans}; color: ${textColor}; text-align: center; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; box-sizing: border-box; padding: 5px;`

	// Top Label
	if (topLabel) {
		const fontPx = 16
		canvas.drawForeignObject({
			x: rectX,
			y: rectY - 35, // Positioned above the rectangle
			width: rectWidth,
			height: 30,
			content: `<div xmlns="http://www.w3.org/1999/xhtml" style="${labelStyle} font-size: ${fontPx}px;"><math xmlns="http://www.w3.org/1998/Math/MathML">${topLabel}</math></div>`
		})
	}

	// Bottom Label
	if (bottomLabel) {
		const fontPx = 16
		canvas.drawForeignObject({
			x: rectX,
			y: rectY + rectHeight + 5, // Positioned below the rectangle
			width: rectWidth,
			height: 30,
			content: `<div xmlns="http://www.w3.org/1999/xhtml" style="${labelStyle} font-size: ${fontPx}px;"><math xmlns="http://www.w3.org/1998/Math/MathML">${bottomLabel}</math></div>`
		})
	}

	// Left Label (rotated -90 degrees to run parallel to the side)
	if (leftLabel) {
		const fontPx = 16
		const containerWidth = rectHeight
		const containerHeight = 30
		const transformOriginX = rectX - 35 + containerHeight / 2
		const transformOriginY = rectY + rectHeight / 2
		const transform = `rotate(-90, ${transformOriginX}, ${transformOriginY})`

		canvas.withTransform(transform, () => {
			canvas.drawForeignObject({
				x: transformOriginX - containerWidth / 2,
				y: transformOriginY - containerHeight / 2,
				width: containerWidth,
				height: containerHeight,
				content: `<div xmlns="http://www.w3.org/1999/xhtml" style="${labelStyle} font-size: ${fontPx}px;"><math xmlns="http://www.w3.org/1998/Math/MathML">${leftLabel}</math></div>`
			})
		})
	}

	// Right Label (rotated -90 degrees)
	if (rightLabel) {
		const fontPx = 16
		const containerWidth = rectHeight
		const containerHeight = 30
		const transformOriginX = rectX + rectWidth + 35 - containerHeight / 2
		const transformOriginY = rectY + rectHeight / 2
		const transform = `rotate(-90, ${transformOriginX}, ${transformOriginY})`

		canvas.withTransform(transform, () => {
			canvas.drawForeignObject({
				x: transformOriginX - containerWidth / 2,
				y: transformOriginY - containerHeight / 2,
				width: containerWidth,
				height: containerHeight,
				content: `<div xmlns="http://www.w3.org/1999/xhtml" style="${labelStyle} font-size: ${fontPx}px;"><math xmlns="http://www.w3.org/1998/Math/MathML">${rightLabel}</math></div>`
			})
		})
	}

	// Area Label (centered inside the rectangle)
	if (areaLabel) {
		const fontPx = 20 // Larger font for the area
		canvas.drawForeignObject({
			x: rectX,
			y: rectY,
			width: rectWidth,
			height: rectHeight,
			content: `<div xmlns="http://www.w3.org/1999/xhtml" style="${labelStyle} font-size: ${fontPx}px; font-weight: bold;"><math xmlns="http://www.w3.org/1998/Math/MathML">${areaLabel}</math></div>`
		})
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`
}
