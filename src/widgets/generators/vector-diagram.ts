import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Factory functions to avoid schema instance reuse
function createVectorSchema() {
	return z
		.object({
			id: z.string().describe("Unique identifier for this vector"),
			start: z
				.object({
					x: z.number().describe("Starting x coordinate"),
					y: z.number().describe("Starting y coordinate")
				})
				.describe("Starting point of the vector"),
			end: z
				.object({
					x: z.number().describe("Ending x coordinate"),
					y: z.number().describe("Ending y coordinate")
				})
				.describe("Ending point of the vector"),
			color: z
				.string()
				.regex(CSS_COLOR_PATTERN, "invalid css color")
				.describe("Color of the vector line and arrow")
		})
		.strict()
}

function createMarkerSchema() {
	return z
		.object({
			id: z.string().describe("Unique identifier for this marker"),
			position: z
				.object({
					x: z.number().describe("X coordinate of the marker"),
					y: z.number().describe("Y coordinate of the marker")
				})
				.describe("Position of the marker"),
			shape: z
				.enum(["circle", "square", "rightAngle"])
				.describe(
					"Shape of the marker - rightAngle creates a 90-degree angle indicator"
				),
			size: z
				.number()
				.positive()
				.describe(
					"Size of the marker in pixels (or side length for rightAngle)"
				),
			color: z
				.string()
				.regex(CSS_COLOR_PATTERN, "invalid css color")
				.describe("Color of the marker")
		})
		.strict()
}

export const VectorDiagramPropsSchema = z
	.object({
		type: z
			.literal("vectorDiagram")
			.describe("Identifies this as a vector diagram widget"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		gridSpacing: z
			.number()
			.positive()
			.describe("Spacing between grid lines in pixels"),
		showGrid: z.boolean().describe("Whether to show the background grid"),
		gridColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")

			.describe("Color of the grid lines"),
		vectors: z.array(createVectorSchema()).describe("Array of vectors to draw"),
		// NOTE: Avoid setting a default here because OpenAI's JSON Schema parser
		// rejects $ref nodes that also include keywords like `default`/`description`.
		// Keeping only the description ensures compatibility.
		markers: z
			.array(createMarkerSchema())
			.describe("Array of markers to place on the diagram")
	})
	.strict()
	.describe(
		"Creates a vector diagram with a clean grid background and customizable vector arrows. Perfect for physics diagrams, force diagrams, and mathematical vector illustrations."
	)

export type VectorDiagramProps = z.infer<typeof VectorDiagramPropsSchema>

export const generateVectorDiagram: WidgetGenerator<
	typeof VectorDiagramPropsSchema
> = async (props) => {
	const { width, height, gridSpacing, showGrid, gridColor, vectors, markers } =
		props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Draw grid background if enabled
	if (showGrid) {
		// Vertical grid lines
		for (let x = 0; x <= width; x += gridSpacing) {
			canvas.drawLine(x, 0, x, height, {
				stroke: gridColor,
				strokeWidth: 1
			})
		}

		// Horizontal grid lines
		for (let y = 0; y <= height; y += gridSpacing) {
			canvas.drawLine(0, y, width, y, {
				stroke: gridColor,
				strokeWidth: 1
			})
		}
	}

	// Draw markers first (so they appear underneath vectors)
	for (const marker of markers) {
		if (marker.shape === "circle") {
			canvas.drawCircle(marker.position.x, marker.position.y, marker.size, {
				fill: marker.color,
				stroke: marker.color,
				strokeWidth: 1
			})
		} else if (marker.shape === "square") {
			const halfSize = marker.size / 2
			canvas.drawRect(
				marker.position.x - halfSize,
				marker.position.y - halfSize,
				marker.size,
				marker.size,
				{
					fill: marker.color,
					stroke: marker.color,
					strokeWidth: 1
				}
			)
		} else if (marker.shape === "rightAngle") {
			// Draw a small square in the upper-right quadrant to indicate 90-degree angle
			const offset = marker.size / 2
			canvas.drawRect(
				marker.position.x,
				marker.position.y - offset,
				offset,
				offset,
				{
					fill: "none",
					stroke: marker.color,
					strokeWidth: 2
				}
			)
		}
	}

	// Standardized stroke/arrow derived from theme
	const VECTOR_STROKE_WIDTH = theme.stroke.width.thick
	const SHOW_ARROW = true
	const ARROW_SIZE = VECTOR_STROKE_WIDTH * 4

	// Create arrow markers for vectors
	const arrowMarkers = new Set<string>()
	for (const vector of vectors) {
		if (SHOW_ARROW) {
			const markerId = `arrow-${vector.id}`
			if (!arrowMarkers.has(markerId)) {
				canvas.addDef(
					`<marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="${ARROW_SIZE}" markerHeight="${ARROW_SIZE}" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${vector.color}"/></marker>`
				)
				arrowMarkers.add(markerId)
			}
		}
	}

	// Draw vectors (on top of markers)
	for (const vector of vectors) {
		const markerEnd = SHOW_ARROW ? `url(#arrow-${vector.id})` : undefined

		canvas.drawLine(
			vector.start.x,
			vector.start.y,
			vector.end.x,
			vector.end.y,
			{
				stroke: vector.color,
				strokeWidth: VECTOR_STROKE_WIDTH,
				markerEnd: markerEnd,
				strokeLinecap: "round"
			}
		)
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
