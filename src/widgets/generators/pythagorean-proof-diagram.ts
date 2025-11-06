import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// New side-centric square and side schemas
function createSquarePropsSchema() {
	return z.discriminatedUnion("type", [
		z
			.object({
				type: z
					.literal("unknown")
					.describe(
						"Square with unknown area, displays '?' as placeholder text"
					),
				color: z
					.string()
					.regex(
						CSS_COLOR_PATTERN,
						"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
					)
					.describe(
						"Fill color for the square background (e.g., '#ff6b6b', 'lightblue', 'rgba(255,0,0,0.5)')"
					)
			})
			.strict()
			.describe(
				"Unknown square type: displays '?' placeholder when the area value is not yet determined or should be solved by the student"
			),
		z
			.object({
				type: z
					.literal("value")
					.describe(
						"Square with known numeric area, displays the calculated area value"
					),
				area: z
					.number()
					.positive()
					.describe("Numeric area rendered inside the square (e.g., 144, 25)."),
				color: z
					.string()
					.regex(
						CSS_COLOR_PATTERN,
						"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
					)
					.describe(
						"Fill color for the square background (e.g., '#ff6b6b', 'lightblue', 'rgba(255,0,0,0.5)')"
					)
			})
			.strict()
			.describe(
				"Value square type: displays the numeric area value inside the square, used when the area is known or given"
			)
	])
}

function createTriangleSidePropsSchema() {
	return z
		.object({
			label: z
				.string()
				.nullable()
				.describe(
					"Optional text label for this triangle side (e.g., 'a', 'b', 'c', '5', '13'). Null to hide."
				),
			square: createSquarePropsSchema()
				.nullable()
				.describe(
					"Optional square attached to this side. Null to hide the square."
				)
		})
		.strict()
}

// New side-centric schema
const NewPythagoreanPropsSchema = z
	.object({
		type: z
			.literal("pythagoreanProofDiagram")
			.describe(
				"Identifies this as a Pythagorean proof diagram widget demonstrating a² + b² = c²."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		sideA: createTriangleSidePropsSchema().describe(
			"First leg (a) of the right triangle, with optional label and optional attached square."
		),
		sideB: createTriangleSidePropsSchema().describe(
			"Second leg (b) of the right triangle, with optional label and optional attached square."
		),
		sideC: createTriangleSidePropsSchema().describe(
			"Hypotenuse (c) of the right triangle, with optional label and optional attached square."
		)
	})
	.strict()
	.describe(
		"Side-centric Pythagorean diagram schema: each side may have a label and/or a square. Renders 1–3 squares and labels; supports numeric or string area labels; computes a single missing numeric area via a² + b² = c² when possible."
	)

export const PythagoreanProofDiagramPropsSchema = NewPythagoreanPropsSchema

export type PythagoreanProofDiagramProps = z.infer<
	typeof PythagoreanProofDiagramPropsSchema
>

/**
 * Generates a visual diagram to illustrate the Pythagorean theorem by rendering a
 * right triangle with a square constructed on each side, labeled with its area.
 */
export const generatePythagoreanProofDiagram: WidgetGenerator<
	typeof PythagoreanProofDiagramPropsSchema
> = async (data) => {
	const { width, height, sideA, sideB, sideC } = data

	const aAreaNum =
		sideA?.square?.type === "value" && sideA.square.area > 0
			? sideA.square.area
			: undefined
	const bAreaNum =
		sideB?.square?.type === "value" && sideB.square.area > 0
			? sideB.square.area
			: undefined
	const cAreaNum =
		sideC?.square?.type === "value" && sideC.square.area > 0
			? sideC.square.area
			: undefined

	let aLen: number | undefined =
		aAreaNum !== undefined ? Math.sqrt(aAreaNum) : undefined
	let bLen: number | undefined =
		bAreaNum !== undefined ? Math.sqrt(bAreaNum) : undefined
	let cLen: number | undefined =
		cAreaNum !== undefined ? Math.sqrt(cAreaNum) : undefined

	if (
		aLen === undefined &&
		bAreaNum !== undefined &&
		cAreaNum !== undefined &&
		cAreaNum > bAreaNum
	) {
		aLen = Math.sqrt(cAreaNum - bAreaNum)
	}
	if (
		bLen === undefined &&
		aAreaNum !== undefined &&
		cAreaNum !== undefined &&
		cAreaNum > aAreaNum
	) {
		bLen = Math.sqrt(cAreaNum - aAreaNum)
	}
	if (cLen === undefined && aAreaNum !== undefined && bAreaNum !== undefined) {
		cLen = Math.sqrt(aAreaNum + bAreaNum)
	}

	// Provide visual defaults in data space if we cannot derive both legs
	const defaultLen = 10
	const resolvedA = aLen ?? defaultLen
	const resolvedB = bLen ?? defaultLen
	const resolvedC =
		cLen ?? Math.sqrt(resolvedA * resolvedA + resolvedB * resolvedB)
	const a = resolvedA
	const b = resolvedB
	const c = resolvedC

	// Work entirely in data space, then project to pixels to maximize usage of the viewport
	const includeHypSquare = Boolean(sideC?.square)
	const v_right = { x: a, y: b }
	const v_a_end = { x: 0, y: b }
	const v_b_end = { x: a, y: 0 }

	type Point = { x: number; y: number }
	const allPoints: Point[] = []
	const addRectPoints = (x: number, y: number, side: number) => {
		allPoints.push({ x, y })
		allPoints.push({ x: x + side, y: y + side })
	}
	const addPolyPoints = (pts: Point[]) => {
		for (const p of pts) allPoints.push(p)
	}

	if (includeHypSquare) {
		const hypVec = { x: v_b_end.x - v_a_end.x, y: v_b_end.y - v_a_end.y }
		const perpVec = { x: hypVec.y, y: -hypVec.x }
		const v_c1 = { x: v_b_end.x + perpVec.x, y: v_b_end.y + perpVec.y }
		const v_c2 = { x: v_a_end.x + perpVec.x, y: v_a_end.y + perpVec.y }
		addPolyPoints([v_a_end, v_b_end, v_c1, v_c2])
	}
	if (sideB?.square) addRectPoints(v_right.x, v_b_end.y, b)
	if (sideA?.square) addRectPoints(v_a_end.x, v_a_end.y, a)
	addPolyPoints([v_a_end, v_right, v_b_end])

	function computeFit(points: Point[]) {
		if (points.length === 0) {
			return { scale: 1, offsetX: 0, offsetY: 0, project: (p: Point) => p }
		}
		const minX = Math.min(...points.map((p) => p.x))
		const maxX = Math.max(...points.map((p) => p.x))
		const minY = Math.min(...points.map((p) => p.y))
		const maxY = Math.max(...points.map((p) => p.y))
		const rawW = maxX - minX
		const rawH = maxY - minY
		const scale = Math.min(
			(width - 2 * PADDING) / (rawW || 1),
			(height - 2 * PADDING) / (rawH || 1)
		)
		const offsetX = (width - scale * rawW) / 2 - scale * minX
		const offsetY = (height - scale * rawH) / 2 - scale * minY
		const project = (p: Point) => ({
			x: offsetX + scale * p.x,
			y: offsetY + scale * p.y
		})
		return { scale, offsetX, offsetY, project }
	}

	const { scale, project } = computeFit(allPoints)

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Convert simple caret exponents to unicode superscripts (e.g., b^2 => b², x^{10} => x¹⁰)
	const toSuperscript = (input: string): string => {
		const supMap: Record<string, string> = {
			"0": "⁰",
			"1": "¹",
			"2": "²",
			"3": "³",
			"4": "⁴",
			"5": "⁵",
			"6": "⁶",
			"7": "⁷",
			"8": "⁸",
			"9": "⁹",
			"+": "⁺",
			"-": "⁻",
			"=": "⁼",
			"(": "⁽",
			")": "⁾"
		}
		const replaceSeq = (seq: string): string =>
			seq
				.split("")
				.map((ch) => supMap[ch] ?? ch)
				.join("")
		// ^{...}
		let out = input.replace(/\^\{([^}]+)\}/g, (_, grp: string) =>
			replaceSeq(grp)
		)
		// ^x (single token of digits/sign)
		out = out.replace(/\^(\d[\d+-]*)/g, (_, grp: string) => replaceSeq(grp))
		return out
	}

	const computeSquareFontPx = (sidePx: number, text: string): number => {
		// Heuristic: try to keep text within 70% of side width
		const len = Math.max(1, text.length)
		const base = Math.floor((sidePx * 0.7) / len)
		return Math.max(10, Math.min(16, base))
	}

	// (Grids removed)

	// --- Square C (Hypotenuse) ---
	if (sideC?.square) {
		const hypVec = { x: v_b_end.x - v_a_end.x, y: v_b_end.y - v_a_end.y }
		const perpVec = { x: hypVec.y, y: -hypVec.x }
		const v_c1 = { x: v_b_end.x + perpVec.x, y: v_b_end.y + perpVec.y }
		const v_c2 = { x: v_a_end.x + perpVec.x, y: v_a_end.y + perpVec.y }

		const squareCPoints = [
			project({ x: v_a_end.x, y: v_a_end.y }),
			project({ x: v_b_end.x, y: v_b_end.y }),
			project({ x: v_c1.x, y: v_c1.y }),
			project({ x: v_c2.x, y: v_c2.y })
		]
		canvas.drawPolygon(squareCPoints, {
			fill: sideC.square.color,
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thin
		})

		// (No grid lines)

		const centerC = project({
			x: (v_a_end.x + v_c1.x) / 2,
			y: (v_a_end.y + v_c1.y) / 2
		})
		const cText =
			sideC.square.type === "unknown"
				? "?"
				: toSuperscript(String(Math.round(sideC.square.area)))
		canvas.drawText({
			x: centerC.x,
			y: centerC.y,
			text: cText,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx: computeSquareFontPx(c * scale, cText),
			fontWeight: "700"
		})
	}

	// --- Square B (on leg 'b') ---
	if (sideB?.square) {
		const rectB_x = v_right.x
		const rectB_y = v_b_end.y

		const topLeft = project({ x: rectB_x, y: rectB_y })
		canvas.drawRect(topLeft.x, topLeft.y, b * scale, b * scale, {
			fill: sideB.square.color,
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thin
		})

		// (No grid lines)

		const centerB = project({ x: v_right.x + b / 2, y: v_b_end.y + b / 2 })
		const bText =
			sideB.square.type === "unknown"
				? "?"
				: toSuperscript(String(Math.round(sideB.square.area)))
		canvas.drawText({
			x: centerB.x,
			y: centerB.y,
			text: bText,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx: computeSquareFontPx(b * scale, bText),
			fontWeight: "700"
		})
	}

	// --- Square A (on leg 'a') ---
	if (sideA?.square) {
		const rectA_x = v_a_end.x
		const rectA_y = v_a_end.y

		const topLeft = project({ x: rectA_x, y: rectA_y })
		canvas.drawRect(topLeft.x, topLeft.y, a * scale, a * scale, {
			fill: sideA.square.color,
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thin
		})

		// (No grid lines)

		const centerA = project({ x: v_a_end.x + a / 2, y: v_a_end.y + a / 2 })
		const aText =
			sideA.square.type === "unknown"
				? "?"
				: toSuperscript(String(Math.round(sideA.square.area)))
		canvas.drawText({
			x: centerA.x,
			y: centerA.y,
			text: aText,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx: computeSquareFontPx(a * scale, aText),
			fontWeight: "700"
		})
	}

	// --- Central Triangle (drawn on top) ---
	// Canvas automatically tracks extents

	const trianglePoints = [
		project({ x: v_a_end.x, y: v_a_end.y }),
		project({ x: v_right.x, y: v_right.y }),
		project({ x: v_b_end.x, y: v_b_end.y })
	]
	canvas.drawPolygon(trianglePoints, {
		fill: theme.colors.background,
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.thick
	})

	// Right-angle marker at v_right (small square inside the triangle)
	const markerSizePx = Math.max(6, Math.round(Math.min(a, b) * scale * 0.1))
	const ms = markerSizePx / scale
	const raPoints = [
		project({ x: v_right.x - ms, y: v_right.y }),
		project({ x: v_right.x - ms, y: v_right.y - ms }),
		project({ x: v_right.x, y: v_right.y - ms }),
		project({ x: v_right.x, y: v_right.y })
	]
	canvas.drawPolygon(raPoints, {
		fill: theme.colors.background,
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.thick
	})

	// Side labels independent of squares
	if (sideC?.label) {
		const midHyp = {
			x: (v_a_end.x + v_b_end.x) / 2,
			y: (v_a_end.y + v_b_end.y) / 2
		}
		const hypVec = { x: v_b_end.x - v_a_end.x, y: v_b_end.y - v_a_end.y }
		const perp = { x: hypVec.y, y: -hypVec.x }
		const perpLen = Math.hypot(perp.x, perp.y) || 1
		const labelOffsetPx = 14
		const labelPos = project({
			x: midHyp.x + (perp.x / perpLen) * (labelOffsetPx / scale),
			y: midHyp.y + (perp.y / perpLen) * (labelOffsetPx / scale)
		})
		canvas.drawText({
			x: labelPos.x,
			y: labelPos.y,
			text: sideC.label,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx: 14
		})
	}
	if (sideB?.label) {
		const midB = {
			x: (v_right.x + v_b_end.x) / 2,
			y: (v_right.y + v_b_end.y) / 2
		}
		const pos = project({ x: midB.x + 10 / scale, y: midB.y })
		canvas.drawText({
			x: pos.x,
			y: pos.y,
			text: sideB.label,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx: 14
		})
	}
	if (sideA?.label) {
		const midA = {
			x: (v_right.x + v_a_end.x) / 2,
			y: (v_right.y + v_a_end.y) / 2
		}
		const pos = project({ x: midA.x, y: midA.y + 10 / scale })
		canvas.drawText({
			x: pos.x,
			y: pos.y,
			text: sideA.label,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx: 14
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
