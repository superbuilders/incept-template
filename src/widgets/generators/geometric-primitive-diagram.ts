import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Defines a point with an optional label. Coordinates are calculated automatically.
const createPointDefinitionSchema = () =>
	z
		.object({
			label: z
				.string()
				.nullable()
				.describe(
					"The text label to display next to the point (e.g., 'P', 'Q'). Null for no label."
				)
		})
		.strict()
type Point = { x: number; y: number; label: string | null }

/**
 * Creates a diagram to render fundamental geometric primitives. This widget can display
 * a single point, a line segment between two points, a ray starting from a point, a line
 * passing through two points, or a curved arc. It is designed for basic geometric
 * illustrations where the focus is on the object and its labeled points rather than a
 * full coordinate plane. The layout is determined by high-level properties like rotation
 * and length, not explicit coordinates.
 */
export const GeometricPrimitiveDiagramPropsSchema = z
	.object({
		type: z.literal("geometricPrimitiveDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		primitive: z
			.discriminatedUnion("type", [
				z
					.object({
						type: z
							.literal("point")
							.describe(
								"A single, isolated point, always centered in the diagram."
							),
						pointOne: createPointDefinitionSchema().describe(
							"The point to be displayed."
						)
					})
					.strict(),
				z
					.object({
						type: z
							.literal("segment")
							.describe("A line segment with two defined endpoints."),
						pointOne: createPointDefinitionSchema().describe(
							"The starting point of the segment."
						),
						pointTwo: createPointDefinitionSchema().describe(
							"The ending point of the segment."
						),
						rotation: z
							.number()
							.describe(
								"The rotation of the segment in degrees. 0 is horizontal, 90 is vertical."
							),
						length: z
							.number()
							.positive()
							.nullable()
							.describe(
								"The length of the segment in pixels. If not provided, it defaults to 60% of the canvas width."
							)
					})
					.strict(),
				z
					.object({
						type: z
							.literal("ray")
							.describe(
								"A ray starting at one point and extending through another."
							),
						pointOne: createPointDefinitionSchema().describe(
							"The starting point (endpoint) of the ray."
						),
						pointTwo: createPointDefinitionSchema().describe(
							"A second point that defines the direction of the ray."
						),
						rotation: z
							.number()
							.describe(
								"The rotation of the ray in degrees. 0 is horizontal, 90 is vertical."
							),
						length: z
							.number()
							.positive()
							.nullable()
							.describe(
								"The distance in pixels between the start point and the direction point. Defaults to 60% of canvas width."
							)
					})
					.strict(),
				z
					.object({
						type: z
							.literal("line")
							.describe(
								"An infinite line passing through two points, with arrowheads on both ends."
							),
						pointOne: createPointDefinitionSchema().describe(
							"A first point that the line passes through."
						),
						pointTwo: createPointDefinitionSchema().describe(
							"A second point that the line passes through."
						),
						rotation: z
							.number()
							.describe("The rotation of the line in degrees."),
						length: z
							.number()
							.positive()
							.nullable()
							.describe(
								"The distance in pixels between the two defined points on the line. Defaults to 60% of canvas width."
							)
					})
					.strict(),
				z
					.object({
						type: z.literal("arc").describe("A curved arc segment."),
						pointOne: createPointDefinitionSchema().describe(
							"The starting point of the arc."
						),
						pointTwo: createPointDefinitionSchema().describe(
							"The ending point of the arc."
						),
						rotation: z
							.number()
							.describe("The rotation of the baseline of the arc in degrees."),
						length: z
							.number()
							.positive()
							.nullable()
							.describe(
								"The distance in pixels between the arc's endpoints. Defaults to 60% of canvas width."
							),
						bulge: z
							.number()
							.describe(
								"Controls the curvature. 0 is a straight line, positive values bow 'up', negative values bow 'down' relative to the rotation."
							)
					})
					.strict()
			])
			.describe("The geometric primitive to be rendered in the diagram.")
	})
	.strict()

export type GeometricPrimitiveDiagramProps = z.infer<
	typeof GeometricPrimitiveDiagramPropsSchema
>

/**
 * Helper to draw a point marker and its label.
 * @param canvas The canvas implementation to draw on.
 * @param point The point's data including calculated coordinates.
 * @param awayFrom An optional second point to position the label away from.
 */
const drawPointAndLabel = (
	canvas: CanvasImpl,
	point: Point,
	awayFrom?: Point
) => {
	canvas.drawCircle(point.x, point.y, theme.geometry.pointRadius.base, {
		fill: theme.colors.black
	})

	if (point.label) {
		let labelX = point.x + 10
		let labelY = point.y - 10

		if (awayFrom) {
			const dx = point.x - awayFrom.x
			const dy = point.y - awayFrom.y
			const dist = Math.hypot(dx, dy)
			if (dist > 0) {
				const offsetX = (dx / dist) * 18
				const offsetY = (dy / dist) * 18
				labelX = point.x + offsetX
				labelY = point.y + offsetY
			}
		}

		canvas.drawText({
			x: labelX,
			y: labelY,
			text: point.label,
			fill: theme.colors.text,
			fontPx: theme.font.size.large,
			fontWeight: theme.font.weight.bold,
			anchor: "middle",
			dominantBaseline: "middle"
		})
	}
}

/**
 * Extends a line defined by two points to the boundaries of a given box.
 */
const extendLineToBox = (
	p1: Point,
	p2: Point,
	box: { x: number; y: number; width: number; height: number }
): { start: Point; end: Point } | null => {
	const dx = p2.x - p1.x
	const dy = p2.y - p1.y

	if (dx === 0 && dy === 0) return null

	const intersections: Point[] = []
	const checkIntersection = (
		x1: number,
		y1: number,
		x2: number,
		y2: number
	) => {
		const sx = x2 - x1
		const sy = y2 - y1
		const den = dx * sy - dy * sx
		if (den === 0) return
		const rx = x1 - p1.x
		const ry = y1 - p1.y
		const t = (rx * sy - ry * sx) / den // parameter along infinite line through p1->p2
		const s = (rx * dy - ry * dx) / den // parameter along segment [0,1]
		if (s >= 0 && s <= 1) {
			intersections.push({ x: p1.x + t * dx, y: p1.y + t * dy, label: null })
		}
	}

	checkIntersection(box.x, box.y, box.x + box.width, box.y) // Top
	checkIntersection(box.x, box.y, box.x, box.y + box.height) // Left
	checkIntersection(
		box.x + box.width,
		box.y,
		box.x + box.width,
		box.y + box.height
	) // Right
	checkIntersection(
		box.x,
		box.y + box.height,
		box.x + box.width,
		box.y + box.height
	) // Bottom

	if (intersections.length < 2) return null

	// Sort intersections by distance from p1 to ensure consistent start/end
	intersections.sort((a, b) => {
		const distA = Math.hypot(a.x - p1.x, a.y - p1.y)
		const distB = Math.hypot(b.x - p1.x, b.y - p1.y)
		return distA - distB
	})

	const start: Point = intersections[0]
	const end: Point = intersections[intersections.length - 1]
	return { start, end }
}

/**
 * For rays: extend from p1 toward p2 until the box boundary, ensuring directionality matches p2.
 */
const extendRayToBoxEnd = (
	p1: Point,
	p2: Point,
	box: { x: number; y: number; width: number; height: number }
): Point | null => {
	const line = extendLineToBox(p1, p2, box)
	if (!line) return null
	const dirX = p2.x - p1.x
	const dirY = p2.y - p1.y
	const toStartX = line.start.x - p1.x
	const toStartY = line.start.y - p1.y
	const toEndX = line.end.x - p1.x
	const toEndY = line.end.y - p1.y
	const dotStart = dirX * toStartX + dirY * toStartY
	const dotEnd = dirX * toEndX + dirY * toEndY
	// Choose the intersection that lies in the forward direction from p1 toward p2 (positive dot)
	if (dotStart >= 0 && dotEnd >= 0) {
		// Both forward; choose the farther one (larger projection)
		return dotEnd >= dotStart ? line.end : line.start
	}
	if (dotStart >= 0) return line.start
	if (dotEnd >= 0) return line.end
	// If neither is forward (degenerate), fall back to the farther endpoint
	const distStart = Math.hypot(toStartX, toStartY)
	const distEnd = Math.hypot(toEndX, toEndY)
	return distEnd >= distStart ? line.end : line.start
}

/**
 * Generates an SVG diagram for a single geometric primitive.
 */
export const generateGeometricPrimitiveDiagram: WidgetGenerator<
	typeof GeometricPrimitiveDiagramPropsSchema
> = async (props) => {
	const { width, height, primitive } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const BBOX = {
		x: PADDING,
		y: PADDING,
		width: width - 2 * PADDING,
		height: height - 2 * PADDING
	}
	const ARROW_ID = "primitive-arrow"
	const degToRad = (deg: number) => (deg * Math.PI) / 180

	canvas.addDef(
		`<marker id="${ARROW_ID}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.colors.black}"/></marker>`
	)

	const cx = width / 2
	const cy = height / 2

	switch (primitive.type) {
		case "point": {
			const p1: Point = { x: cx, y: cy, label: primitive.pointOne.label }
			drawPointAndLabel(canvas, p1)
			break
		}
		case "segment":
		case "ray":
		case "line":
		case "arc": {
			const length = primitive.length ?? Math.min(width, height) * 0.6
			const rotationRad = degToRad(primitive.rotation)
			const halfLength = length / 2

			const p1: Point = {
				x: cx - halfLength * Math.cos(rotationRad),
				y: cy - halfLength * Math.sin(rotationRad),
				label: primitive.pointOne.label
			}
			const p2: Point = {
				x: cx + halfLength * Math.cos(rotationRad),
				y: cy + halfLength * Math.sin(rotationRad),
				label: primitive.pointTwo.label
			}

			if (primitive.type === "segment") {
				canvas.drawLine(p1.x, p1.y, p2.x, p2.y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.thick
				})
			} else if (primitive.type === "ray") {
				const rayEnd = extendRayToBoxEnd(p1, p2, BBOX)
				if (rayEnd) {
					canvas.drawLine(p1.x, p1.y, rayEnd.x, rayEnd.y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.thick,
						markerEnd: `url(#${ARROW_ID})`
					})
				}
			} else if (primitive.type === "line") {
				const extended = extendLineToBox(p1, p2, BBOX)
				if (extended) {
					canvas.drawLine(
						extended.start.x,
						extended.start.y,
						extended.end.x,
						extended.end.y,
						{
							stroke: theme.colors.black,
							strokeWidth: theme.stroke.width.thick,
							markerStart: `url(#${ARROW_ID})`,
							markerEnd: `url(#${ARROW_ID})`
						}
					)
				}
			} else if (primitive.type === "arc") {
				const midX = (p1.x + p2.x) / 2
				const midY = (p1.y + p2.y) / 2
				// Perpendicular vector for bulge
				const perpX = -(p2.y - p1.y)
				const perpY = p2.x - p1.x
				const bulgeAmount = length * primitive.bulge * 0.5

				const controlX = midX + (perpX / length) * bulgeAmount
				const controlY = midY + (perpY / length) * bulgeAmount

				const path = new Path2D()
					.moveTo(p1.x, p1.y)
					.quadraticCurveTo(controlX, controlY, p2.x, p2.y)

				canvas.drawPath(path, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.thick,
					fill: "none"
				})
			}

			// Draw points and labels on top for all linear/arc types
			drawPointAndLabel(canvas, p1, p2)
			drawPointAndLabel(canvas, p2, p1)
			break
		}
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.medium}">${svgBody}</svg>`
}
