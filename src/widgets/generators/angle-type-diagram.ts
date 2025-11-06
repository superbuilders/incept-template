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
 * Creates a diagram showing one of six types of angles: acute, right, obtuse, straight, reflex, or full (360°).
 * The diagram consists of two rays originating from a common vertex, with a colored arc or square
 * (or a full circle for 360°) indicating the angle type. All three points of the angle are labeled.
 * The entire diagram can be rotated.
 */
function createLabelValueSchema() {
	return z
		.string()
		.nullable()
		.transform((value) => {
			if (value === null) return null
			if (["", "null", "NULL"].includes(value)) return null
			return value
		})
		.describe(
			"Label text or null. Empty string and 'null'/'NULL' are converted to null."
		)
}
export const AngleTypeDiagramPropsSchema = z
	.object({
		type: z.literal("angleTypeDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		angleType: z
			.discriminatedUnion("type", [
				z
					.object({
						type: z.literal("acute"),
						value: z
							.number()
							.gt(0)
							.lt(90)
							.describe("Angle measure in degrees (exclusive 0° and 90°).")
					})
					.strict(),
				z
					.object({
						type: z.literal("right"),
						value: z.literal(90).describe("Angle measure fixed at 90°.")
					})
					.strict(),
				z
					.object({
						type: z.literal("obtuse"),
						value: z
							.number()
							.gt(90)
							.lt(180)
							.describe("Angle measure in degrees (exclusive 90° and 180°).")
					})
					.strict(),
				z
					.object({
						type: z.literal("straight"),
						value: z.literal(180).describe("Angle measure fixed at 180°.")
					})
					.strict(),
				z
					.object({
						type: z.literal("reflex"),
						value: z
							.number()
							.gt(180)
							.lt(360)
							.describe("Angle measure in degrees (exclusive 180° and 360°).")
					})
					.strict(),
				z
					.object({
						type: z.literal("full"),
						value: z.literal(360).describe("Angle measure fixed at 360°.")
					})
					.strict()
			])
			.describe(
				"Angle classification with an explicit degree value and category-specific constraints."
			),
		rotation: z
			.number()
			.describe(
				"Overall rotation of the entire diagram in degrees. 0 degrees points the baseline ray to the right. Positive values rotate counter-clockwise."
			),
		labels: z
			.object({
				ray1Point: createLabelValueSchema().describe(
					"Label for the point on the first ray (e.g., 'P'). This ray is rotated from the baseline ray. Can be null."
				),
				vertex: createLabelValueSchema().describe(
					"Label for the vertex of the angle (e.g., 'Q'). Can be null."
				),
				ray2Point: createLabelValueSchema().describe(
					"Label for the point on the second, baseline ray (e.g., 'R'). Can be null."
				)
			})
			.strict()
			.describe(
				"The labels for the three points defining the angle. Empty string and 'null'/'NULL' normalize to null."
			),
		showAngleArc: z
			.boolean()
			.describe("Whether to show the arc indicating the angle."),
		sectorColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "Invalid CSS color format")
			.describe("Color used for the angle sector fill and outline.")
	})
	.strict()

export type AngleTypeDiagramProps = z.infer<typeof AngleTypeDiagramPropsSchema>

/**
 * Generates an SVG diagram for a specific type of angle.
 */
export const generateAngleTypeDiagram: WidgetGenerator<
	typeof AngleTypeDiagramPropsSchema
> = async (props) => {
	const {
		width,
		height,
		angleType,
		labels,
		showAngleArc,
		rotation,
		sectorColor
	} = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 16,
		lineHeightDefault: 1.2
	})

	const cx = width / 2
	const cy = height / 2
	const toRad = (deg: number) => (deg * Math.PI) / 180

	// Angle measure in degrees is explicitly provided by the discriminated union
	const angleDegrees = angleType.value
	const angleRadians = toRad(angleDegrees)
	const rotationRadians = toRad(rotation)

	const rayLength = Math.min(width, height) * 0.35
	const arcRadius = Math.min(rayLength * 0.4, 40)

	// Define ray endpoints based on rotation and angle
	// Ray 2 (baseline) is set by the `rotation` property.
	const ray2AngleRad = rotationRadians
	const p2 = {
		x: cx + rayLength * Math.cos(ray2AngleRad),
		y: cy + rayLength * Math.sin(ray2AngleRad)
	}

	// Ray 1 is rotated from Ray 2 by the angle value.
	const ray1AngleRad = ray2AngleRad + angleRadians
	let p1 = {
		x: cx + rayLength * Math.cos(ray1AngleRad),
		y: cy + rayLength * Math.sin(ray1AngleRad)
	}
	let p2Adjusted = { ...p2 }
	// For a full 360° angle, place A and C along the baseline such that |AB| = |AC|.
	// Make A at half the baseline length, and C at the full baseline length (colinear).
	if (angleType.type === "full") {
		const halfLen = rayLength * 0.5
		p1 = {
			x: cx + halfLen * Math.cos(ray2AngleRad),
			y: cy + halfLen * Math.sin(ray2AngleRad)
		} // A at half length
		p2Adjusted = {
			x: cx + rayLength * Math.cos(ray2AngleRad),
			y: cy + rayLength * Math.sin(ray2AngleRad)
		} // C at full length
	}

	// Extend the ray lines slightly beyond the point markers so arrowheads sit away from the dots
	const arrowOvershoot = 28
	const p1Arrow = {
		x: cx + (rayLength + arrowOvershoot) * Math.cos(ray1AngleRad),
		y: cy + (rayLength + arrowOvershoot) * Math.sin(ray1AngleRad)
	}
	const p2Arrow = {
		x: cx + (rayLength + arrowOvershoot) * Math.cos(ray2AngleRad),
		y: cy + (rayLength + arrowOvershoot) * Math.sin(ray2AngleRad)
	}

	// Add arrow marker definition
	canvas.addDef(
		`<marker id="angle-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.colors.black}"/></marker>`
	)

	// Draw rays
	if (angleType.type !== "full") {
		canvas.drawLine(cx, cy, p1Arrow.x, p1Arrow.y, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			markerEnd: "url(#angle-arrow)"
		})
	}
	canvas.drawLine(cx, cy, p2Arrow.x, p2Arrow.y, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick,
		markerEnd: "url(#angle-arrow)"
	})

	// Build collision segments for label placement
	const screenSegments: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = []
	if (angleType.type !== "full") {
		screenSegments.push({
			a: { x: cx, y: cy },
			b: { x: p1Arrow.x, y: p1Arrow.y }
		})
	}
	screenSegments.push({
		a: { x: cx, y: cy },
		b: { x: p2Arrow.x, y: p2Arrow.y }
	})

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

	const placedLabelRects: Array<{
		x: number
		y: number
		width: number
		height: number
		pad?: number
	}> = []

	function rectsOverlap(
		a: { x: number; y: number; width: number; height: number },
		b: { x: number; y: number; width: number; height: number }
	): boolean {
		return !(
			a.x + a.width < b.x ||
			b.x + b.width < a.x ||
			a.y + a.height < b.y ||
			b.y + b.height < a.y
		)
	}

	function rectIntersectsAnyObstacle(rect: {
		x: number
		y: number
		width: number
		height: number
		pad?: number
	}): boolean {
		for (const seg of screenSegments) {
			if (segmentIntersectsRect(seg.a, seg.b, rect)) return true
		}
		// check previously placed labels
		for (const r of placedLabelRects) {
			const a = {
				x: rect.x - (rect.pad ?? 0),
				y: rect.y - (rect.pad ?? 0),
				width: rect.width + 2 * (rect.pad ?? 0),
				height: rect.height + 2 * (rect.pad ?? 0)
			}
			const b = {
				x: r.x - (r.pad ?? 0),
				y: r.y - (r.pad ?? 0),
				width: r.width + 2 * (r.pad ?? 0),
				height: r.height + 2 * (r.pad ?? 0)
			}
			if (rectsOverlap(a, b)) return true
		}
		return false
	}

	// Draw angle arc/marker
	if (showAngleArc) {
		if (angleType.type === "full") {
			// Render full 360° sector as a filled circle at the vertex
			canvas.drawCircle(cx, cy, arcRadius, {
				fill: sectorColor,
				fillOpacity: 0.2,
				stroke: "none"
			})
			canvas.drawCircle(cx, cy, arcRadius, {
				fill: "none",
				stroke: sectorColor,
				strokeWidth: theme.stroke.width.thin
			})
		} else if (angleType.type === "right") {
			const markerSize = arcRadius * 0.8
			const m1 = {
				x: cx + markerSize * Math.cos(ray2AngleRad),
				y: cy + markerSize * Math.sin(ray2AngleRad)
			}
			const m2 = {
				x: cx + markerSize * Math.cos(ray1AngleRad),
				y: cy + markerSize * Math.sin(ray1AngleRad)
			}
			const corner = {
				x: cx + markerSize * (Math.cos(ray1AngleRad) + Math.cos(ray2AngleRad)),
				y: cy + markerSize * (Math.sin(ray1AngleRad) + Math.sin(ray2AngleRad))
			}

			// Filled square
			const fillPath = new Path2D()
				.moveTo(cx, cy)
				.lineTo(m1.x, m1.y)
				.lineTo(corner.x, corner.y)
				.lineTo(m2.x, m2.y)
				.closePath()
			canvas.drawPath(fillPath, {
				fill: sectorColor,
				fillOpacity: 0.2,
				stroke: "none"
			})

			// Outline
			const outlinePath = new Path2D()
				.moveTo(m1.x, m1.y)
				.lineTo(corner.x, corner.y)
				.lineTo(m2.x, m2.y)
			canvas.drawPath(outlinePath, {
				fill: "none",
				stroke: sectorColor,
				strokeWidth: theme.stroke.width.base
			})
		} else {
			const startPoint = {
				x: cx + arcRadius * Math.cos(ray2AngleRad),
				y: cy + arcRadius * Math.sin(ray2AngleRad)
			}
			const endPoint = {
				x: cx + arcRadius * Math.cos(ray1AngleRad),
				y: cy + arcRadius * Math.sin(ray1AngleRad)
			}

			const largeArcFlag: 0 | 1 = angleDegrees > 180 ? 1 : 0
			const sweepFlag: 0 | 1 = 1 // Always draw counter-clockwise for positive angles

			const fillPath = new Path2D()
				.moveTo(cx, cy)
				.lineTo(startPoint.x, startPoint.y)
				.arcTo(
					arcRadius,
					arcRadius,
					0,
					largeArcFlag,
					sweepFlag,
					endPoint.x,
					endPoint.y
				)
				.closePath()

			canvas.drawPath(fillPath, {
				fill: sectorColor,
				fillOpacity: 0.2,
				stroke: "none"
			})

			const arcPath = new Path2D()
				.moveTo(startPoint.x, startPoint.y)
				.arcTo(
					arcRadius,
					arcRadius,
					0,
					largeArcFlag,
					sweepFlag,
					endPoint.x,
					endPoint.y
				)

			canvas.drawPath(arcPath, {
				fill: "none",
				stroke: sectorColor,
				strokeWidth: theme.stroke.width.thin
			})
		}
	}

	// Draw points and intelligent labels
	const labelOffset = 16
	const pointRadius = 4

	function placeLabelNear(
		point: { x: number; y: number },
		baseAngleRad: number,
		text: string | null
	) {
		if (text === null) {
			return
		}
		const fontPx = 18
		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			text,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = w / 2
		const halfH = h / 2
		const rectPad = 4
		const candidates: Array<{ x: number; y: number }> = []
		const dirs = [
			baseAngleRad + Math.PI / 2,
			baseAngleRad - Math.PI / 2,
			baseAngleRad + Math.PI,
			baseAngleRad + Math.PI / 3,
			baseAngleRad - Math.PI / 3
		]
		for (const dist of [labelOffset + 2, labelOffset + 8, labelOffset + 14]) {
			for (const ang of dirs) {
				candidates.push({
					x: point.x + dist * Math.cos(ang),
					y: point.y + dist * Math.sin(ang)
				})
			}
		}
		let best = candidates[0]
		let minCollisions = Number.POSITIVE_INFINITY
		for (const c of candidates) {
			const rect = {
				x: c.x - halfW,
				y: c.y - halfH,
				width: w,
				height: h,
				pad: rectPad
			}
			const collides =
				rectIntersectsAnyObstacle(rect) ||
				// also avoid overlapping the point itself
				(c.x > point.x - (pointRadius + 6) &&
					c.x < point.x + (pointRadius + 6) &&
					c.y > point.y - (pointRadius + 6) &&
					c.y < point.y + (pointRadius + 6))
			const collisions = collides ? 1 : 0
			if (collisions < minCollisions) {
				minCollisions = collisions
				best = c
			}
			if (minCollisions === 0) break
		}
		canvas.drawText({
			x: best.x,
			y: best.y,
			text,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			fontWeight: theme.font.weight.bold
		})
		placedLabelRects.push({
			x: best.x - halfW,
			y: best.y - halfH,
			width: w,
			height: h,
			pad: rectPad
		})
	}

	// Point 1 (on rotated ray or offset along baseline for full)
	canvas.drawCircle(p1.x, p1.y, pointRadius, { fill: theme.colors.black })
	placeLabelNear(
		p1,
		angleType.type === "full" ? ray2AngleRad : ray1AngleRad,
		labels.ray1Point
	)

	// Point 2 (on baseline ray)
	canvas.drawCircle(p2Adjusted.x, p2Adjusted.y, pointRadius, {
		fill: theme.colors.black
	})
	placeLabelNear(p2Adjusted, ray2AngleRad, labels.ray2Point)

	// Vertex
	canvas.drawCircle(cx, cy, 4, { fill: theme.colors.black })
	// Position vertex label to not interfere with the angle
	const midAngle = ray2AngleRad + angleRadians / 2
	const vertexDefaultAngle =
		angleType.type === "full" ? ray2AngleRad - Math.PI / 2 : midAngle + Math.PI
	// Vertex label with simple collision-aware adjustment
	if (labels.vertex !== null) {
		const fontPx = 18
		const text = labels.vertex
		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			text,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = w / 2
		const halfH = h / 2
		let angle = vertexDefaultAngle
		let result = {
			x: cx + labelOffset * Math.cos(angle),
			y: cy + labelOffset * Math.sin(angle)
		}
		for (const extra of [
			0,
			Math.PI / 6,
			-Math.PI / 6,
			Math.PI / 4,
			-Math.PI / 4
		]) {
			const tx = cx + (labelOffset + 2) * Math.cos(vertexDefaultAngle + extra)
			const ty = cy + (labelOffset + 2) * Math.sin(vertexDefaultAngle + extra)
			const rect = { x: tx - halfW, y: ty - halfH, width: w, height: h, pad: 2 }
			if (!rectIntersectsAnyObstacle(rect)) {
				result = { x: tx, y: ty }
				break
			}
		}
		canvas.drawText({
			x: result.x,
			y: result.y,
			text,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			fontWeight: theme.font.weight.bold
		})
		placedLabelRects.push({
			x: result.x - halfW,
			y: result.y - halfH,
			width: w,
			height: h,
			pad: 2
		})
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
