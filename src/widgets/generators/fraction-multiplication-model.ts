import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Defines the properties for a single fractional model used within the equation.
// Use a factory to avoid JSON Schema $ref deduplication in downstream converters.
const createBaseFractionModelSchema = () =>
	z.object({
		shape: z
			.discriminatedUnion("type", [
				z.object({
					type: z.literal("rectangle"),
					rows: z
						.number()
						.int()
						.positive()
						.describe("Number of rows in the grid partition."),
					columns: z
						.number()
						.int()
						.positive()
						.describe("Number of columns in the grid partition.")
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
						.describe("Number of sides for the regular polygon."),
					rotation: z.number().describe("Rotation angle in degrees.")
				})
			])
			.describe("The geometric shape and its partitioning style."),
		totalParts: z
			.number()
			.int()
			.positive()
			.describe("The total number of equal parts (the denominator)."),
		shadedParts: z
			.number()
			.int()
			.min(0)
			.describe("The number of parts to shade (the numerator)."),
		shadeColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The CSS hex color for the shaded parts (e.g., '#4472C4').")
	})

// Defines the middle term of the multiplication, which can be a number or a placeholder.
// Use a factory to avoid JSON Schema $ref deduplication.
const createMiddleTermSchema = () =>
	z.discriminatedUnion("type", [
		z.object({
			type: z.literal("number").describe("A numeric multiplier."),
			value: z
				.number()
				.int()
				.positive()
				.describe("The integer value to display.")
		}),
		z.object({
			type: z
				.literal("placeholder")
				.describe("A placeholder box for a missing number.")
		})
	])

// The main Zod schema for the new widget.
export const FractionMultiplicationModelPropsSchema = z
	.object({
		type: z
			.literal("fractionMultiplicationModel")
			.describe(
				"Identifies this as a widget for showing a fraction multiplication equation using visual models."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		leftOperand: createBaseFractionModelSchema().describe(
			"The fraction model on the left side of the equation."
		),
		middleTerm: createMiddleTermSchema().describe(
			"The multiplier, which can be a number or a placeholder."
		),
		rightOperand: createBaseFractionModelSchema().describe(
			"The fraction model on the right side of the equation (the product)."
		)
	})
	.strict()

export type FractionMultiplicationModelProps = z.infer<
	typeof FractionMultiplicationModelPropsSchema
>
type FractionModel = z.infer<ReturnType<typeof createBaseFractionModelSchema>>

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
 * Internal helper to draw a single fractional model directly onto the canvas at a given location.
 */
function drawSingleModel(
	canvas: CanvasImpl,
	modelProps: FractionModel,
	cx: number,
	cy: number,
	size: number
) {
	const { shape, totalParts, shadedParts, shadeColor } = modelProps
	const toRad = (deg: number) => (deg * Math.PI) / 180

	switch (shape.type) {
		case "rectangle": {
			const { rows, columns } = shape
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
			for (let r = 0; r <= rows; r++) {
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
			}
			for (let c = 0; c <= columns; c++) {
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
			}
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

			for (let i = 0; i < totalParts; i++) {
				// Align sector rays with the same base orientation used for vertices
				const baseAngle = -90 + actualRotation
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
				const baseAngle = -90 + actualRotation
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

/**
 * Draw a fraction model, repeating horizontally when shadedParts exceeds totalParts.
 * Each repeated tile uses the same granularity (shape params and totalParts) to ensure consistency.
 */
function drawModelWithOverflow(
	canvas: CanvasImpl,
	modelProps: FractionModel,
	cx: number,
	cy: number,
	size: number
) {
	const repeatCount = Math.max(
		1,
		Math.ceil(modelProps.shadedParts / modelProps.totalParts)
	)
	if (repeatCount === 1) {
		drawSingleModel(canvas, modelProps, cx, cy, size)
		return
	}

	// Keep each tile the SAME size as the base model size; overflow by drawing more tiles side-by-side
	const gap = Math.max(8, Math.floor(size * 0.1))
	const totalGap = gap * (repeatCount - 1)
	const tileSize = size
	const groupWidth = repeatCount * tileSize + totalGap
	const startX = cx - groupWidth / 2 + tileSize / 2

	const fullTiles = Math.floor(modelProps.shadedParts / modelProps.totalParts)
	const remainder = modelProps.shadedParts % modelProps.totalParts

	for (let i = 0; i < repeatCount; i++) {
		const tileCx = startX + i * (tileSize + gap)
		let tileShaded: number
		if (i < fullTiles) {
			tileShaded = modelProps.totalParts
		} else if (i === fullTiles) {
			tileShaded = remainder
		} else {
			tileShaded = 0
		}
		const tileProps: FractionModel = {
			...modelProps,
			shadedParts: tileShaded
		}
		drawSingleModel(canvas, tileProps, tileCx, cy, tileSize)
	}
}

function measureGroupWidth(modelProps: FractionModel, size: number): number {
	const repeatCount = Math.max(
		1,
		Math.ceil(modelProps.shadedParts / modelProps.totalParts)
	)
	const gap = Math.max(8, Math.floor(size * 0.1))
	const totalGap = gap * (repeatCount - 1)
	const tileSize = size
	return repeatCount * tileSize + totalGap
}

export const generateFractionMultiplicationModel: WidgetGenerator<
	typeof FractionMultiplicationModelPropsSchema
> = async (props) => {
	const { width, height, leftOperand, middleTerm, rightOperand } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 16,
		lineHeightDefault: 1.2
	})

	// --- Layout Calculations ---
	const modelSize = Math.min(width * 0.25, height * 0.8) // Size for each fraction model
	const operatorFontSize = modelSize * 0.5
	const operatorWidth = operatorFontSize * 1.5 // Estimated width for operator and spacing
	const middleTermWidth = modelSize * 0.7

	// Account for potential overflow width caused by repeated tiles
	const leftWidth = measureGroupWidth(leftOperand, modelSize)
	const rightWidth = measureGroupWidth(rightOperand, modelSize)
	const totalContentWidth =
		leftWidth + operatorWidth + middleTermWidth + operatorWidth + rightWidth
	let currentX = (width - totalContentWidth) / 2
	const verticalCenter = height / 2

	// --- Draw Left Operand ---
	const leftCx = currentX + leftWidth / 2
	drawModelWithOverflow(canvas, leftOperand, leftCx, verticalCenter, modelSize)
	currentX += leftWidth

	// --- Draw Multiplication Operator ---
	const op1X = currentX + operatorWidth / 2
	canvas.drawText({
		x: op1X,
		y: verticalCenter,
		text: "×",
		anchor: "middle",
		dominantBaseline: "middle",
		fontPx: operatorFontSize
	})
	currentX += operatorWidth

	// --- Draw Middle Term ---
	const middleCx = currentX + middleTermWidth / 2
	if (middleTerm.type === "number") {
		canvas.drawText({
			x: middleCx,
			y: verticalCenter,
			text: String(middleTerm.value),
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx: operatorFontSize
		})
	} else {
		const boxWidth = middleTermWidth * 0.8
		const boxHeight = modelSize * 0.8
		canvas.drawRect(
			middleCx - boxWidth / 2,
			verticalCenter - boxHeight / 2,
			boxWidth,
			boxHeight,
			{
				fill: "none",
				stroke: theme.colors.border,
				strokeWidth: 2,
				dash: "6,4"
			}
		)
	}
	currentX += middleTermWidth

	// --- Draw Equals Operator ---
	const op2X = currentX + operatorWidth / 2
	canvas.drawText({
		x: op2X,
		y: verticalCenter,
		text: "=",
		anchor: "middle",
		dominantBaseline: "middle",
		fontPx: operatorFontSize
	})
	currentX += operatorWidth

	// --- Draw Right Operand ---
	const rightCx = currentX + rightWidth / 2
	drawModelWithOverflow(
		canvas,
		rightOperand,
		rightCx,
		verticalCenter,
		modelSize
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
