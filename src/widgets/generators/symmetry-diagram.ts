import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Define the schema for the symmetry diagram widget's properties.
export const SymmetryDiagramPropsSchema = z
	.object({
		type: z.literal("symmetryDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		shape: z
			.enum([
				"isoscelesTrapezoid",
				"regularTriangle",
				"isoscelesTriangle",
				"rectangle",
				"heart",
				"square",
				"rhombus",
				"fourPointStar"
			])
			.describe("The geometric shape to display."),
		drawCorrectLines: z
			.boolean()
			.describe("Whether to draw the correct lines of symmetry for the shape."),
		drawIncorrectLines: z
			.boolean()
			.describe("Whether to draw a common set of incorrect lines of symmetry."),
		shapeColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The fill color for the shape.")
	})
	.strict()
	.describe(
		"Creates a diagram of a geometric shape with its correct and/or incorrect lines of symmetry drawn. This widget is ideal for questions that test understanding of geometric symmetry."
	)

export type SymmetryDiagramProps = z.infer<typeof SymmetryDiagramPropsSchema>

/**
 * Generates an SVG diagram of a shape with its lines of symmetry.
 */
export const generateSymmetryDiagram: WidgetGenerator<
	typeof SymmetryDiagramPropsSchema
> = async (props) => {
	const {
		width,
		height,
		shape,
		drawCorrectLines,
		drawIncorrectLines,
		shapeColor
	} = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const cx = width / 2
	const cy = height / 2
	const size = Math.min(width, height) - PADDING * 4

	// Define a reusable marker for arrowheads on symmetry lines
	const strokeColor = theme.colors.text
	const markerId = `arrowhead_${strokeColor.replace(/[^a-zA-Z0-9]/g, "")}`
	canvas.addDef(
		`<marker id="${markerId}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><polygon points="0,0 10,5 0,10" fill="${strokeColor}" /></marker>`
	)

	// Helper to draw a symmetry line in the style of the examples
	const drawSymmetryLine = (x1: number, y1: number, x2: number, y2: number) => {
		canvas.drawLine(x1, y1, x2, y2, {
			stroke: strokeColor,
			strokeWidth: 1.5,
			dash: "4 4",
			markerStart: `url(#${markerId})`,
			markerEnd: `url(#${markerId})`
		})
	}

	// Extend a line segment just slightly beyond its endpoints (small margin)
	const drawExtendedLine = (ax: number, ay: number, bx: number, by: number) => {
		const dx = bx - ax
		const dy = by - ay
		const norm = Math.hypot(dx, dy)
		if (norm === 0) return
		const ux = dx / norm
		const uy = dy / norm
		const margin = Math.max(10, Math.min(width, height) * 0.03)
		drawSymmetryLine(
			ax - ux * margin,
			ay - uy * margin,
			bx + ux * margin,
			by + uy * margin
		)
	}

	// Main drawing logic based on the selected shape
	switch (shape) {
		case "rectangle": {
			const rectW = size
			const rectH = size * 0.65
			const x1 = cx - rectW / 2
			const y1 = cy - rectH / 2
			canvas.drawRect(x1, y1, rectW, rectH, {
				fill: shapeColor,
				stroke: strokeColor,
				strokeWidth: 2
			})
			if (drawCorrectLines) {
				drawExtendedLine(cx, y1, cx, y1 + rectH) // Vertical
				drawExtendedLine(x1, cy, x1 + rectW, cy) // Horizontal
			}
			if (drawIncorrectLines) {
				drawExtendedLine(x1, y1, x1 + rectW, y1 + rectH) // Diagonal \
				drawExtendedLine(x1, y1 + rectH, x1 + rectW, y1) // Diagonal /
			}
			break
		}
		case "isoscelesTrapezoid": {
			const topW = size * 0.6
			const bottomW = size
			const h = size * 0.5
			const points = [
				{ x: cx - bottomW / 2, y: cy + h / 2 },
				{ x: cx + bottomW / 2, y: cy + h / 2 },
				{ x: cx + topW / 2, y: cy - h / 2 },
				{ x: cx - topW / 2, y: cy - h / 2 }
			]
			canvas.drawPolygon(points, {
				fill: shapeColor,
				stroke: strokeColor,
				strokeWidth: 2
			})
			if (drawCorrectLines) {
				drawExtendedLine(cx, cy - h / 2, cx, cy + h / 2) // Vertical
			}
			if (drawIncorrectLines) {
				drawExtendedLine(cx - bottomW / 2, cy, cx + bottomW / 2, cy) // Horizontal
			}
			break
		}
		case "regularTriangle": {
			const r = size / 2
			const points = [
				{ x: cx, y: cy - r },
				{ x: cx - (r * Math.sqrt(3)) / 2, y: cy + r / 2 },
				{ x: cx + (r * Math.sqrt(3)) / 2, y: cy + r / 2 }
			]
			const p1 = points[0]
			const p2 = points[1]
			const p3 = points[2]
			canvas.drawPolygon(points, {
				fill: shapeColor,
				stroke: strokeColor,
				strokeWidth: 2
			})
			if (drawCorrectLines) {
				const m23x = (p2.x + p3.x) / 2
				const m13x = (p1.x + p3.x) / 2
				const m12x = (p1.x + p2.x) / 2
				const m23y = (p2.y + p3.y) / 2
				const m13y = (p1.y + p3.y) / 2
				const m12y = (p1.y + p2.y) / 2
				drawExtendedLine(p1.x, p1.y, m23x, m23y)
				drawExtendedLine(p2.x, p2.y, m13x, m13y)
				drawExtendedLine(p3.x, p3.y, m12x, m12y)
			}
			if (drawIncorrectLines) {
				// Horizontal only to avoid near-parallel overlap with a true median
				drawExtendedLine(cx - r, cy, cx + r, cy)
			}
			break
		}
		case "isoscelesTriangle": {
			const w = size * 0.5
			const h = size
			const points = [
				{ x: cx - w / 2, y: cy + h / 2 },
				{ x: cx + w / 2, y: cy + h / 2 },
				{ x: cx, y: cy - h / 2 }
			]
			const p1 = points[0]
			const p2 = points[1]
			const p3 = points[2]
			canvas.drawPolygon(points, {
				fill: shapeColor,
				stroke: strokeColor,
				strokeWidth: 2
			})
			if (drawCorrectLines) {
				drawExtendedLine(p3.x, p3.y, cx, cy + h / 2) // Vertical
			}
			if (drawIncorrectLines) {
				drawExtendedLine(p1.x, p1.y, (p2.x + p3.x) / 2, (p2.y + p3.y) / 2)
				drawExtendedLine(p2.x, p2.y, (p1.x + p3.x) / 2, (p1.y + p3.y) / 2)
			}
			break
		}
		case "heart": {
			const s = size / 200 // Scale factor based on original SVG size
			const path = new Path2D()
				.moveTo(cx, cy + 65.6 * s)
				.arcTo(6.1 * s, 6.1 * s, 0, 0, 1, cx - 3.9 * s, cy + 64.3 * s)
				.lineTo(cx - 19.5 * s, cy + 53.3 * s)
				.bezierCurveTo(
					cx - 60.6 * s,
					cy + 23.9 * s,
					cx - 81.5 * s,
					cy - 11.1 * s,
					cx - 73.2 * s,
					cy - 39.6 * s
				)
				.bezierCurveTo(
					cx - 68.8 * s,
					cy - 55 * s,
					cx - 53.4 * s,
					cy - 65.6 * s,
					cx - 37.6 * s,
					cy - 65.6 * s
				)
				.bezierCurveTo(
					cx - 34.2 * s,
					cy - 65.6 * s,
					cx - 19.5 * s,
					cy - 65.3 * s,
					cx - 10.7 * s,
					cy - 54.7 * s
				)
				.arcTo(77.1 * s, 77.1 * s, 0, 0, 1, cx, cy - 19.3 * s)
				.arcTo(77.1 * s, 77.1 * s, 0, 0, 1, cx + 10.7 * s, cy - 54.7 * s)
				.bezierCurveTo(
					cx + 19.5 * s,
					cy - 65.3 * s,
					cx + 34.2 * s,
					cy - 65.6 * s,
					cx + 37.6 * s,
					cy - 65.6 * s
				)
				.bezierCurveTo(
					cx + 53.4 * s,
					cy - 65.6 * s,
					cx + 68.8 * s,
					cy - 55 * s,
					cx + 73.2 * s,
					cy - 39.6 * s
				)
				.bezierCurveTo(
					cx + 81.5 * s,
					cy - 11.1 * s,
					cx + 60.6 * s,
					cy + 23.9 * s,
					cx + 19.5 * s,
					cy + 53.3 * s
				)
				.lineTo(cx + 3.9 * s, cy + 64.3 * s)
				.arcTo(6.1 * s, 6.1 * s, 0, 0, 1, cx, cy + 65.6 * s)
			canvas.drawPath(path, {
				fill: shapeColor,
				stroke: strokeColor,
				strokeWidth: 2
			})
			if (drawCorrectLines) {
				drawSymmetryLine(cx, cy - 67 * s, cx, cy + 82 * s) // Vertical
			}
			if (drawIncorrectLines) {
				// Horizontal line across center as incorrect for heart
				drawSymmetryLine(cx - 100 * s, cy, cx + 100 * s, cy)
			}
			break
		}
		case "square": {
			const side = size * 0.75
			const x1 = cx - side / 2
			const y1 = cy - side / 2
			canvas.drawRect(x1, y1, side, side, {
				fill: shapeColor,
				stroke: strokeColor,
				strokeWidth: 2
			})
			if (drawCorrectLines) {
				drawExtendedLine(cx, y1, cx, y1 + side) // vertical
				drawExtendedLine(x1, cy, x1 + side, cy) // horizontal
				drawExtendedLine(x1, y1, x1 + side, y1 + side) // diag \
				drawExtendedLine(x1, y1 + side, x1 + side, y1) // diag /
			}
			if (drawIncorrectLines) {
				// Slightly offset vertical and horizontal
				drawExtendedLine(cx + side * 0.2, y1, cx + side * 0.2, y1 + side)
				drawExtendedLine(x1, cy + side * 0.2, x1 + side, cy + side * 0.2)
			}
			break
		}
		case "rhombus": {
			const w = size * 0.9
			const h = size * 0.6
			const points = [
				{ x: cx, y: cy - h / 2 },
				{ x: cx + w / 2, y: cy },
				{ x: cx, y: cy + h / 2 },
				{ x: cx - w / 2, y: cy }
			]
			canvas.drawPolygon(points, {
				fill: shapeColor,
				stroke: strokeColor,
				strokeWidth: 2
			})
			if (drawCorrectLines) {
				drawExtendedLine(cx - w / 2, cy, cx + w / 2, cy) // horizontal diagonal
				drawExtendedLine(cx, cy - h / 2, cx, cy + h / 2) // vertical diagonal
			}
			if (drawIncorrectLines) {
				// Non-axes lines through center
				drawExtendedLine(
					cx - w * 0.45,
					cy - h * 0.15,
					cx + w * 0.45,
					cy + h * 0.15
				)
			}
			break
		}
		case "fourPointStar": {
			// 4-point star (diamond overlapped with a rotated square) – slightly fatter arms
			const r = size * 0.45
			const arms = [
				{ x: cx, y: cy - r },
				{ x: cx + r * 0.25, y: cy - r * 0.25 },
				{ x: cx + r, y: cy },
				{ x: cx + r * 0.25, y: cy + r * 0.25 },
				{ x: cx, y: cy + r },
				{ x: cx - r * 0.25, y: cy + r * 0.25 },
				{ x: cx - r, y: cy },
				{ x: cx - r * 0.25, y: cy - r * 0.25 }
			]
			canvas.drawPolygon(arms, {
				fill: shapeColor,
				stroke: strokeColor,
				strokeWidth: 2
			})
			if (drawCorrectLines) {
				drawExtendedLine(cx, cy - r, cx, cy + r) // vertical
				drawExtendedLine(cx - r, cy, cx + r, cy) // horizontal
			}
			if (drawIncorrectLines) {
				// Slightly rotated lines through center as incorrect
				drawExtendedLine(cx - r * 0.9, cy - r * 0.3, cx + r * 0.9, cy + r * 0.3)
			}
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

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
