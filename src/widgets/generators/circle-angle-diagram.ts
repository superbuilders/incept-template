import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"
import { theme } from "@/widgets/utils/theme"

/**
 * Creates a diagram of a circle with a central angle (sector) highlighted.
 * This widget is ideal for visualizing angles as fractions of a full turn (360°),
 * illustrating concepts of sectors, arcs, and central angles.
 */
export const CircleAngleDiagramPropsSchema = z
	.object({
		type: z.literal("circleAngleDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		angle: z
			.number()
			.min(0)
			.max(360)
			.describe(
				"The measure of the central angle in degrees, which determines the size of the shaded sector."
			),
		rotation: z
			.number()
			.describe(
				"The overall rotation of the angle diagram in degrees. 0 degrees orients the first ray horizontally to the right."
			),
		labels: z
			.object({
				center: z
					.string()
					.describe(
						"The label for the center point of the circle (e.g., 'O')."
					),
				point1: z
					.string()
					.describe(
						"The label for the point on the circumference where the first ray ends (e.g., 'A')."
					),
				point2: z
					.string()
					.describe(
						"The label for the point on the circumference where the second ray ends (e.g., 'B')."
					)
			})
			.strict()
			.describe("Labels for the three points defining the angle."),
		shadeColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The CSS color for the shaded sector.")
	})
	.strict()

export type CircleAngleDiagramProps = z.infer<
	typeof CircleAngleDiagramPropsSchema
>

/**
 * Generates an SVG diagram of a circle with a central angle.
 */
export const generateCircleAngleDiagram: WidgetGenerator<
	typeof CircleAngleDiagramPropsSchema
> = async (props) => {
	const { width, height, angle, rotation, labels, shadeColor } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const cx = width / 2
	const cy = height / 2
	const radius = Math.min(width, height) / 2 - PADDING * 2 // Extra padding for labels

	const toRad = (deg: number) => (deg * Math.PI) / 180

	// --- Draw Circle and Sector ---
	// Main circle outline
	canvas.drawCircle(cx, cy, radius, {
		fill: "none",
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.base
	})

	// Calculate angles for the sector
	const startAngleRad = toRad(rotation)
	const endAngleRad = toRad(rotation + angle)

	// Points on the circumference
	const p1 = {
		x: cx + radius * Math.cos(startAngleRad),
		y: cy + radius * Math.sin(startAngleRad)
	}
	const p2 = {
		x: cx + radius * Math.cos(endAngleRad),
		y: cy + radius * Math.sin(endAngleRad)
	}

	// Draw shaded sector
	const largeArcFlag: 0 | 1 = angle > 180 ? 1 : 0
	const sectorPath = new Path2D()
		.moveTo(cx, cy)
		.lineTo(p1.x, p1.y)
		.arcTo(radius, radius, 0, largeArcFlag, 1, p2.x, p2.y)
		.closePath()
	canvas.drawPath(sectorPath, {
		fill: shadeColor,
		stroke: "none"
	})

	// --- Draw Radii and Points ---
	// Draw the two radii on top of the sector
	canvas.drawLine(cx, cy, p1.x, p1.y, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick
	})
	canvas.drawLine(cx, cy, p2.x, p2.y, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick
	})

	// Draw points at the center and on the circumference
	canvas.drawCircle(cx, cy, 4, { fill: theme.colors.black })
	canvas.drawCircle(p1.x, p1.y, 4, { fill: theme.colors.black })
	canvas.drawCircle(p2.x, p2.y, 4, { fill: theme.colors.black })

	// --- Draw Labels ---
	// Build collision segments for label placement (the two radii)
	const screenSegments: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = [
		{ a: { x: cx, y: cy }, b: { x: p1.x, y: p1.y } },
		{ a: { x: cx, y: cy }, b: { x: p2.x, y: p2.y } }
	]

	function segmentIntersectsRect(
		A: { x: number; y: number },
		B: { x: number; y: number },
		rect: { x: number; y: number; width: number; height: number; pad?: number }
	): boolean {
		const pad = rect.pad ?? 0
		const rx = rect.x - pad
		const ry = rect.y - pad
		const rw = rect.width + 2 * pad
		const rh = rect.height + 2 * pad

		const minX = Math.min(A.x, B.x)
		const maxX = Math.max(A.x, B.x)
		const minY = Math.min(A.y, B.y)
		const maxY = Math.max(A.y, B.y)
		if (maxX < rx || minX > rx + rw || maxY < ry || minY > ry + rh) return false

		const r1 = { x: rx, y: ry }
		const r2 = { x: rx + rw, y: ry }
		const r3 = { x: rx + rw, y: ry + rh }
		const r4 = { x: rx, y: ry + rh }
		const orient = (
			p: { x: number; y: number },
			q: { x: number; y: number },
			r: { x: number; y: number }
		) => {
			const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
			if (val > 1e-9) return 1
			if (val < -1e-9) return -1
			return 0
		}
		const segmentsIntersect = (
			p1: { x: number; y: number },
			p2: { x: number; y: number },
			p3: { x: number; y: number },
			p4: { x: number; y: number }
		) => {
			const o1 = orient(p1, p2, p3)
			const o2 = orient(p1, p2, p4)
			const o3 = orient(p3, p4, p1)
			const o4 = orient(p3, p4, p2)
			return o1 !== o2 && o3 !== o4
		}
		return (
			segmentsIntersect(A, B, r1, r2) ||
			segmentsIntersect(A, B, r2, r3) ||
			segmentsIntersect(A, B, r3, r4) ||
			segmentsIntersect(A, B, r4, r1)
		)
	}

	function rectIntersectsAnySegment(rect: {
		x: number
		y: number
		width: number
		height: number
		pad?: number
	}): boolean {
		for (const seg of screenSegments) {
			if (segmentIntersectsRect(seg.a, seg.b, rect)) return true
		}
		return false
	}

	// Helper to position labels slightly away from their points
	const placeLabel = (
		point: { x: number; y: number },
		label: string,
		angleRad: number
	) => {
		const labelOffset = 20
		const labelX = point.x + labelOffset * Math.cos(angleRad)
		const labelY = point.y + labelOffset * Math.sin(angleRad)
		canvas.drawText({
			x: labelX,
			y: labelY,
			text: label,
			fontPx: 16,
			fontWeight: theme.font.weight.bold,
			anchor: "middle",
			dominantBaseline: "middle"
		})
	}

	// Place center label with simple collision-aware adjustment against radii
	{
		const text = labels.center
		const fontPx = 16
		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			text,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = w / 2
		const halfH = h / 2
		const labelOffset = 20
		const candidateAngles = [
			Math.PI / 2, // down
			-Math.PI / 2, // up
			0, // right
			Math.PI, // left
			Math.PI / 4,
			-Math.PI / 4,
			(3 * Math.PI) / 4,
			(-3 * Math.PI) / 4
		]
		let chosen = {
			x: cx + labelOffset * Math.cos(candidateAngles[0]),
			y: cy + labelOffset * Math.sin(candidateAngles[0])
		}
		for (const ang of candidateAngles) {
			const tx = cx + labelOffset * Math.cos(ang)
			const ty = cy + labelOffset * Math.sin(ang)
			const rect = { x: tx - halfW, y: ty - halfH, width: w, height: h, pad: 2 }
			if (!rectIntersectsAnySegment(rect)) {
				chosen = { x: tx, y: ty }
				break
			}
		}
		canvas.drawText({
			x: chosen.x,
			y: chosen.y,
			text,
			fontPx,
			fontWeight: theme.font.weight.bold,
			anchor: "middle",
			dominantBaseline: "middle"
		})
	}

	// Place circumference labels (simple offset is generally fine)
	placeLabel(p1, labels.point1, startAngleRad)
	placeLabel(p2, labels.point2, endAngleRad)

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
