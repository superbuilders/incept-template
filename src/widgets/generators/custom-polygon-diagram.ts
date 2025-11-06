import { z } from "zod"
// Path2D not needed after removing annotations
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Factory to create a point schema. Using a factory prevents Zod from deduplicating
// and emitting $ref in generated JSON schema, which breaks OpenAI schema consumers.
function createPointSchema() {
	return z
		.object({
			x: z
				.number()
				.describe(
					"The x-coordinate of the vertex in a relative coordinate space."
				),
			y: z
				.number()
				.describe(
					"The y-coordinate of the vertex in a relative coordinate space."
				),
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
				.describe(
					"Optional text label for the vertex (e.g., 'P', 'Q'). Null for no label."
				)
		})
		.strict()
}
// Note: no exported Point type to avoid accidental reuse; keep schema factory local-only

/**
 * Creates a diagram of a custom, non-regular polygon defined by a list of vertices.
 * This widget automatically scales and centers the shape. It supports annotations to mark
 * perpendicular corners and pairs of parallel sides, making it ideal for geometry problems
 * involving quadrilaterals like parallelograms, trapezoids, and kites.
 */
export const CustomPolygonDiagramPropsSchema = z
	.object({
		type: z.literal("customPolygonDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		points: z
			.array(createPointSchema())
			.min(3, "A polygon must have at least 3 vertices.")
			.describe(
				"Ordered vertices defining the polygon. Each point may include an optional text label."
			),
		fillColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The fill color of the polygon (e.g., '#C06C84' or 'none')."),
		strokeColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The border color of the polygon (e.g., '#000000').")
	})
	.strict()

export type CustomPolygonDiagramProps = z.infer<
	typeof CustomPolygonDiagramPropsSchema
>

/**
 * Generates an SVG diagram of a custom polygon with annotations.
 */
export const generateCustomPolygonDiagram: WidgetGenerator<
	typeof CustomPolygonDiagramPropsSchema
> = async (props) => {
	const { width, height, points, fillColor, strokeColor } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// --- Scaling and Centering ---
	const allPoints = points.map((p) => ({ x: p.x, y: p.y }))
	const minX = Math.min(...allPoints.map((p) => p.x))
	const maxX = Math.max(...allPoints.map((p) => p.x))
	const minY = Math.min(...allPoints.map((p) => p.y))
	const maxY = Math.max(...allPoints.map((p) => p.y))

	const dataWidth = maxX - minX
	const dataHeight = maxY - minY

	const scale = Math.min(
		(width - PADDING * 4) / dataWidth,
		(height - PADDING * 4) / dataHeight
	)
	const offsetX = (width - dataWidth * scale) / 2
	const offsetY = (height - dataHeight * scale) / 2

	const project = (p: { x: number; y: number }): { x: number; y: number } => ({
		x: offsetX + (p.x - minX) * scale,
		y: offsetY + (p.y - minY) * scale
	})

	const projectedPoints = points.map(project)

	// --- Drawing ---
	// 1. Draw the polygon shape
	canvas.drawPolygon(projectedPoints, {
		fill: fillColor,
		stroke: strokeColor,
		strokeWidth: theme.stroke.width.thick
	})

	// Draw vertex labels if provided
	// 3. Draw Points and Labels
	projectedPoints.forEach((p, i) => {
		const pointDef = points[i]
		if (!pointDef) return

		canvas.drawCircle(p.x, p.y, theme.geometry.pointRadius.base, {
			fill: theme.colors.black
		})

		if (pointDef.label) {
			const OFFSET = 14
			const textX = p.x + OFFSET
			const textY = p.y - OFFSET
			canvas.drawText({
				x: textX,
				y: textY,
				text: pointDef.label,
				fill: theme.colors.black,
				fontPx: theme.font.size.large,
				fontWeight: theme.font.weight.bold,
				anchor: "middle",
				dominantBaseline: "middle"
			})
		}
	})

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
