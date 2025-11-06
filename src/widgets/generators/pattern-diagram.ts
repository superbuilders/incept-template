import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

/**
 * Factory function to create the schema for a single shape item in the pattern.
 * This avoids creating a shared Zod schema reference.
 */
function createShapeItemSchema() {
	return z
		.object({
			type: z.literal("shape").describe("An item that is a geometric shape."),
			shape: z
				.enum([
					"triangle",
					"square",
					"rectangle",
					"pentagon",
					"hexagon",
					"heptagon",
					"octagon",
					"circle"
				])
				.describe("The specific type of polygon or shape to render."),
			fillColor: z
				.string()
				.regex(CSS_COLOR_PATTERN, "invalid css color")
				.describe("The hex-only fill color for the shape.")
		})
		.strict()
}

/**
 * Factory function to create the schema for a placeholder item.
 */
function createPlaceholderItemSchema() {
	return z
		.object({
			type: z
				.literal("placeholder")
				.describe("An item that is a placeholder for a missing shape.")
		})
		.strict()
}

// The main Zod schema for the patternDiagram widget.
export const PatternDiagramPropsSchema = z
	.object({
		type: z
			.literal("patternDiagram")
			.describe(
				"Identifies this as a widget for displaying a sequence of shapes to form a pattern."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		items: z
			.array(
				z.discriminatedUnion("type", [
					createShapeItemSchema(),
					createPlaceholderItemSchema()
				])
			)
			.describe(
				"An array of items representing the pattern sequence. Each item can be a shape or a placeholder."
			),
		shapeSize: z
			.number()
			.positive()
			.describe(
				"The size (width and height) in pixels for each individual shape or placeholder in the sequence."
			)
	})
	.strict()

export type PatternDiagramProps = z.infer<typeof PatternDiagramPropsSchema>
type ShapeItem = z.infer<ReturnType<typeof createShapeItemSchema>>

/**
 * Internal, self-contained helper function to render a single polygon shape as an SVG string.
 * This logic is adapted from the nPolygon widget to ensure visual consistency without a direct dependency.
 */
async function renderSingleShapeSvg(
	width: number,
	height: number,
	shape: ShapeItem["shape"],
	fillColor: string
): Promise<string> {
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const cx = width / 2
	const cy = height / 2
	// Use a smaller local padding relative to the tile size so shapes appear larger
	const localPadding = Math.max(1, Math.round(Math.min(width, height) * 0.04))
	const radius = Math.min(width, height) / 2 - localPadding
	const points: Array<{ x: number; y: number }> = []

	if (shape === "circle") {
		canvas.drawCircle(cx, cy, radius, {
			fill: fillColor,
			stroke: "#000000",
			strokeWidth: 2
		})
	} else {
		const shapeToSides: Record<string, number> = {
			triangle: 3,
			square: 4,
			rectangle: 4,
			pentagon: 5,
			hexagon: 6,
			heptagon: 7,
			octagon: 8
		}
		const numSides = shapeToSides[shape]

		if (shape === "rectangle") {
			const availableWidth = width - 2 * localPadding
			const availableHeight = height - 2 * localPadding
			const aspectRatio = 4 / 3
			let rectWidth = availableWidth
			let rectHeight = rectWidth / aspectRatio
			if (rectHeight > availableHeight) {
				rectHeight = availableHeight
				rectWidth = rectHeight * aspectRatio
			}
			const halfWidth = rectWidth / 2
			const halfHeight = rectHeight / 2
			points.push(
				{ x: cx - halfWidth, y: cy - halfHeight },
				{ x: cx + halfWidth, y: cy - halfHeight },
				{ x: cx + halfWidth, y: cy + halfHeight },
				{ x: cx - halfWidth, y: cy + halfHeight }
			)
		} else if (numSides) {
			const angleOffset = shape === "square" ? Math.PI / 4 : -Math.PI / 2
			for (let i = 0; i < numSides; i++) {
				const angle = (i / numSides) * 2 * Math.PI + angleOffset
				points.push({
					x: cx + radius * Math.cos(angle),
					y: cy + radius * Math.sin(angle)
				})
			}
		}

		if (points.length > 0) {
			canvas.drawPolygon(points, {
				fill: fillColor,
				stroke: "#000000",
				strokeWidth: 2
			})
		}
	}

	// Do not add extra outer padding; the tile already provides spacing
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(0)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`
}

/**
 * Generates an HTML layout for a sequence of shapes and placeholders to illustrate a pattern.
 * This widget is a compositional tool that uses an internal SVG renderer for the shapes.
 */
export const generatePatternDiagram: WidgetGenerator<
	typeof PatternDiagramPropsSchema
> = async (props) => {
	const { width, height, items, shapeSize } = props

	const containerStyle = `
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        gap: 10px;
        width: ${width}px;
        height: ${height}px;
        font-family: ${theme.font.family.sans};
    `

	const itemContainerStyle = `
        width: ${shapeSize}px;
        height: ${shapeSize}px;
        display: flex;
        align-items: center;
        justify-content: center;
    `

	const placeholderStyle = `
        border: 2px dashed ${theme.colors.border};
        border-radius: 4px;
        color: ${theme.colors.textSecondary};
        font-size: ${shapeSize * 0.6}px;
        line-height: 1;
    `

	let html = `<div style="${containerStyle}">`

	for (const item of items) {
		if (item.type === "shape") {
			const shapeSvg = await renderSingleShapeSvg(
				shapeSize,
				shapeSize,
				item.shape,
				item.fillColor
			)
			html += `<div style="${itemContainerStyle}">${shapeSvg}</div>`
		} else if (item.type === "placeholder") {
			html += `<div style="${itemContainerStyle}${placeholderStyle}">?</div>`
		}
	}

	html += "</div>"
	return html
}
