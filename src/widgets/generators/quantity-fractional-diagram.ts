import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// The main Zod schema for the new, unified widget.
export const QuantityFractionalDiagramPropsSchema = z
	.object({
		type: z
			.literal("quantityFractionalDiagram")
			.describe(
				"Identifies this as a diagram for displaying fractional quantities (simple, mixed, or improper) using partitioned shapes."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		shape: z
			.discriminatedUnion("type", [
				z.object({
					type: z.literal("rectangle"),
					rows: z
						.number()
						.int()
						.positive()
						.describe("Number of rows in the grid partition for each shape."),
					columns: z
						.number()
						.int()
						.positive()
						.describe("Number of columns in the grid partition for each shape.")
				}),
				z.object({
					type: z
						.literal("circle")
						.describe("A circular shape partitioned into equal sectors.")
				}),
				z.object({
					type: z.literal("polygon"),
					sides: z
						.number()
						.int()
						.gte(3)
						.describe(
							"Number of sides for the regular polygon (e.g., 3 for triangle, 8 for octagon)."
						),
					rotation: z
						.number()
						.describe("Rotation angle in degrees to orient the polygon.")
				})
			])
			.describe("The geometric shape used for all models in the diagram."),
		numerator: z
			.number()
			.int()
			.min(0)
			.describe(
				"The total numerator of the quantity (e.g., for 2 3/4, the total numerator is 11)."
			),
		denominator: z
			.number()
			.int()
			.positive()
			.describe(
				"The denominator that defines the partitioning of each shape (e.g., for 2 3/4, this is 4)."
			),
		shadeColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The CSS hex color for the shaded parts."),
		shapesPerRow: z
			.number()
			.int()
			.positive()
			.describe("How many shapes to display in each row before wrapping.")
	})
	.strict()

export type QuantityFractionalDiagramProps = z.infer<
	typeof QuantityFractionalDiagramPropsSchema
>
type ShapeDefinition = z.infer<
	typeof QuantityFractionalDiagramPropsSchema
>["shape"]

// Helper function to find the intersection of a ray from a center point with a polygon's edge
// Returns both the intersection point and the edge index that was intersected
function findRayPolygonIntersection(
	p1: { x: number; y: number },
	p2: { x: number; y: number },
	polygonVertices: { x: number; y: number }[]
): { point: { x: number; y: number }; edgeIndex: number } | null {
	for (let i = 0; i < polygonVertices.length; i++) {
		const p3 = polygonVertices[i]
		const p4 = polygonVertices[(i + 1) % polygonVertices.length]
		if (!p3 || !p4) continue
		const den = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x)
		if (den === 0) continue
		const t =
			((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / den
		const u =
			-((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / den
		if (t >= 0 && u >= 0 && u <= 1) {
			return {
				point: { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) },
				edgeIndex: i
			}
		}
	}
	return null
}

/**
 * Internal helper to draw a single partitioned model. This is self-contained and not exported.
 */
function drawSingleModel(
	canvas: CanvasImpl,
	shape: ShapeDefinition,
	totalParts: number,
	shadedParts: number,
	shadeColor: string,
	cx: number,
	cy: number,
	size: number
) {
	const toRad = (deg: number) => (deg * Math.PI) / 180
	switch (shape.type) {
		case "rectangle": {
			const { rows, columns } = shape
			if (rows * columns !== totalParts) {
				logger.error("rectangle dimension mismatch", {
					rows,
					columns,
					totalParts,
					calculatedParts: rows * columns
				})
				throw errors.new("rectangle rows * columns must equal totalParts")
			}
			const rectX = cx - size / 2
			const rectY = cy - size / 2
			const cellWidth = size / columns
			const cellHeight = size / rows
			for (let i = 0; i < shadedParts; i++) {
				const row = Math.floor(i / columns)
				const col = i % columns
				canvas.drawRect(
					rectX + col * cellWidth,
					rectY + row * cellHeight,
					cellWidth,
					cellHeight,
					{
						fill: shadeColor
					}
				)
			}
			for (let r = 0; r <= rows; r++)
				canvas.drawLine(
					rectX,
					rectY + r * cellHeight,
					rectX + size,
					rectY + r * cellHeight,
					{
						stroke: theme.colors.black,
						strokeWidth:
							r === 0 || r === rows
								? theme.stroke.width.thick
								: theme.stroke.width.thin
					}
				)
			for (let c = 0; c <= columns; c++)
				canvas.drawLine(
					rectX + c * cellWidth,
					rectY,
					rectX + c * cellWidth,
					rectY + size,
					{
						stroke: theme.colors.black,
						strokeWidth:
							c === 0 || c === columns
								? theme.stroke.width.thick
								: theme.stroke.width.thin
					}
				)
			break
		}
		case "circle": {
			const radius = size / 2
			const angleStep = 360 / totalParts
			for (let i = 0; i < totalParts; i++) {
				const startAngle = -90 + i * angleStep
				const endAngle = startAngle + angleStep
				const startPoint = {
					x: cx + radius * Math.cos(toRad(startAngle)),
					y: cy + radius * Math.sin(toRad(startAngle))
				}
				const endPoint = {
					x: cx + radius * Math.cos(toRad(endAngle)),
					y: cy + radius * Math.sin(toRad(endAngle))
				}
				const path = new Path2D()
					.moveTo(cx, cy)
					.lineTo(startPoint.x, startPoint.y)
					.arcTo(radius, radius, 0, 0, 1, endPoint.x, endPoint.y)
					.closePath()
				canvas.drawPath(path, {
					fill: i < shadedParts ? shadeColor : "none",
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			}
			break
		}
		case "polygon": {
			const { sides, rotation } = shape
			const actualRotation = rotation ?? 0
			const radius = size / 2
			const angleOffset = toRad(-90 + actualRotation)
			const vertices = Array.from({ length: sides }, (_, i) => {
				const angle = (i / sides) * 2 * Math.PI + angleOffset
				return {
					x: cx + radius * Math.cos(angle),
					y: cy + radius * Math.sin(angle)
				}
			})

			const angleStep = 360 / totalParts
			const baseAngle = -90 + actualRotation

			for (let i = 0; i < totalParts; i++) {
				const startAngle = baseAngle + i * angleStep
				const endAngle = baseAngle + (i + 1) * angleStep

				const rayStart = {
					x: cx + Math.cos(toRad(startAngle)),
					y: cy + Math.sin(toRad(startAngle))
				}
				const rayEnd = {
					x: cx + Math.cos(toRad(endAngle)),
					y: cy + Math.sin(toRad(endAngle))
				}

				const startHit = findRayPolygonIntersection(
					{ x: cx, y: cy },
					rayStart,
					vertices
				)
				const endHit = findRayPolygonIntersection(
					{ x: cx, y: cy },
					rayEnd,
					vertices
				)

				if (!startHit || !endHit) continue

				const { point: startIntersect, edgeIndex: startEdge } = startHit
				const { point: endIntersect, edgeIndex: endEdge } = endHit

				const path = new Path2D()
					.moveTo(cx, cy)
					.lineTo(startIntersect.x, startIntersect.y)

				// Walk along the polygon perimeter from the edge after startEdge up to endEdge
				let edge = (startEdge + 1) % sides
				while (edge !== (endEdge + 1) % sides) {
					const v = vertices[edge]
					if (!v) break
					path.lineTo(v.x, v.y)
					edge = (edge + 1) % sides
				}

				path.lineTo(endIntersect.x, endIntersect.y).closePath()

				const isShaded = i < shadedParts
				canvas.drawPath(path, {
					fill: isShaded ? shadeColor : "none",
					stroke: "none"
				})
			}

			canvas.drawPolygon(vertices, {
				fill: "none",
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.thick
			})
			for (let i = 0; i < totalParts; i++) {
				const angle = toRad(baseAngle + i * angleStep)
				const p2 = {
					x: cx + radius * 2 * Math.cos(angle),
					y: cy + radius * 2 * Math.sin(angle)
				}
				const intersect = findRayPolygonIntersection(
					{ x: cx, y: cy },
					p2,
					vertices
				)
				if (intersect) {
					canvas.drawLine(cx, cy, intersect.point.x, intersect.point.y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.thin
					})
				}
			}
			break
		}
	}
}

export const generateQuantityFractionalDiagram: WidgetGenerator<
	typeof QuantityFractionalDiagramPropsSchema
> = async (props) => {
	const {
		width,
		height,
		shape,
		numerator,
		denominator,
		shadeColor,
		shapesPerRow
	} = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 16,
		lineHeightDefault: 1.2
	})

	const wholePart = Math.floor(numerator / denominator)
	const fractionalNumerator = numerator % denominator

	const totalShapes = wholePart + (fractionalNumerator > 0 ? 1 : 0)
	if (totalShapes === 0) {
		// Render a single, unshaded shape if the quantity is zero.
		const shapeSize = Math.min(width, height) - PADDING * 2
		drawSingleModel(
			canvas,
			shape,
			denominator,
			0,
			shadeColor,
			width / 2,
			height / 2,
			shapeSize
		)
		const {
			svgBody,
			vbMinX,
			vbMinY,
			width: finalWidth,
			height: finalHeight
		} = canvas.finalize(PADDING)
		return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
	}

	const numRows = Math.ceil(totalShapes / shapesPerRow)
	const numCols = Math.min(totalShapes, shapesPerRow)

	const gap = 15
	const availableWidth = width - PADDING * 2 - (numCols - 1) * gap
	const availableHeight = height - PADDING * 2 - (numRows - 1) * gap

	const shapeSize = Math.min(
		availableWidth / numCols,
		availableHeight / numRows
	)

	const totalContentWidth = numCols * shapeSize + (numCols - 1) * gap
	const totalContentHeight = numRows * shapeSize + (numRows - 1) * gap

	const startX = (width - totalContentWidth) / 2
	const startY = (height - totalContentHeight) / 2

	for (let i = 0; i < totalShapes; i++) {
		const row = Math.floor(i / shapesPerRow)
		const col = i % shapesPerRow
		const cx = startX + col * (shapeSize + gap) + shapeSize / 2
		const cy = startY + row * (shapeSize + gap) + shapeSize / 2

		const isWhole = i < wholePart
		const shaded = isWhole ? denominator : fractionalNumerator

		drawSingleModel(
			canvas,
			shape,
			denominator,
			shaded,
			shadeColor,
			cx,
			cy,
			shapeSize
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
