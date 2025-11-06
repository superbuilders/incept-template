import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"
import { theme } from "@/widgets/utils/theme"

// Utility function to find intersection point of two lines
// Line 1: from point1 to point2, Line 2: from point3 to point4
export const findLineIntersection = (
	point1: { x: number; y: number },
	point2: { x: number; y: number },
	point3: { x: number; y: number },
	point4: { x: number; y: number }
): { x: number; y: number } | null => {
	const x1 = point1.x
	const y1 = point1.y
	const x2 = point2.x
	const y2 = point2.y
	const x3 = point3.x
	const y3 = point3.y
	const x4 = point4.x
	const y4 = point4.y

	// Calculate the direction vectors
	const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)

	// Lines are parallel if denominator is 0
	if (Math.abs(denom) < 1e-10) {
		return null
	}

	// Calculate intersection point using parametric line equations
	const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom

	const intersectionX = x1 + t * (x2 - x1)
	const intersectionY = y1 + t * (y2 - y1)

	return { x: intersectionX, y: intersectionY }
}

// schemas following the documented api in docs/widget-review/angle-diagram.md
const Point = z
	.object({
		id: z
			.string()
			.describe(
				"Unique identifier for this vertex point. Use descriptive names like 'A', 'B', 'C', 'vertex1', 'origin'. Must be unique within the diagram and referenced in at least one ray - isolated points are not allowed."
			),
		x: z
			.number()
			.describe(
				"Horizontal pixel coordinate in the SVG coordinate system. Origin (0,0) is at top-left corner. Positive x values move rightward."
			),
		y: z
			.number()
			.describe(
				"Vertical pixel coordinate in the SVG coordinate system. Origin (0,0) is at top-left corner. Positive y values move downward."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label displayed near this point. Examples: 'A', 'B', 'C', 'O' (for origin), 'P₁'. Set to null for unlabeled points. Use single letters or short identifiers for clarity."
			),
		shape: z
			.enum(["circle", "ellipse"])
			.describe(
				"Visual marker style for the point. Use 'circle' for standard geometric points or 'ellipse' for special emphasis."
			)
	})
	.strict()

const AngleArc = z
	.object({
		type: z
			.literal("arc")
			.describe("Angle visualization using a curved arc between the two rays."),
		pointOnFirstRay: z
			.string()
			.describe(
				"Point ID on the first ray of the angle. For angle ABC, this would be 'A'. Must reference a valid point ID that forms one side of the angle with the vertex."
			),
		vertex: z
			.string()
			.describe(
				"Point ID at the angle's vertex where the two rays meet. For angle ABC, this would be 'B'. The angle measurement is taken at this point."
			),
		pointOnSecondRay: z
			.string()
			.describe(
				"Point ID on the second ray of the angle. For angle ABC, this would be 'C'. Must reference a valid point ID that forms the other side of the angle with the vertex."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label for the angle measurement. Examples: '45°', '90°', 'θ', 'α', '∠ABC'. Set to null for unlabeled arcs. Use plain text only - no HTML or markdown."
			),
		color: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"CSS color value for the arc and its label. Examples: '#FF0000' (red), '#0066CC' (blue), '#00AA00' (green). Use contrasting colors for multiple angles."
			),
		radius: z
			.number()
			.positive()
			.describe(
				"Arc radius in pixels from the vertex point. Typical range: 20-60px. Larger radii work better for acute angles, smaller for obtuse angles."
			)
	})
	.strict()

const AngleRight = z
	.object({
		type: z
			.literal("right")
			.describe(
				"Right angle (90°) visualization using a small square marker at the vertex."
			),
		pointOnFirstRay: z
			.string()
			.describe(
				"Point ID on the first ray forming the right angle. For angle ABC, this would be 'A'. Must reference a valid point that forms a 90° angle with the vertex and second ray."
			),
		vertex: z
			.string()
			.describe(
				"Point ID where the right angle is located. For angle ABC, this would be 'B'. The 90° square marker is drawn at this vertex."
			),
		pointOnSecondRay: z
			.string()
			.describe(
				"Point ID on the second ray forming the right angle. For angle ABC, this would be 'C'. Must reference a valid point that forms a 90° angle with the vertex and first ray."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label for the right angle. Examples: '90°', '⊥', 'right angle'. Set to null to show only the square marker without text. Use plain text only."
			),
		color: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"CSS color value for the right angle square marker and its label. Examples: '#000000' (black), '#0066CC' (blue). Should contrast well with the background."
			)
	})
	.strict()

const Angle = z
	.discriminatedUnion("type", [AngleArc, AngleRight])
	.describe(
		"Angle visualization definition. Choose 'arc' for general angles or 'right' for 90° angles with square markers."
	)

export const AngleDiagramPropsSchema = z
	.object({
		type: z.literal("angleDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		points: z
			.array(Point)
			.min(1)
			.describe(
				"All vertex points used in the diagram. Each point must have a unique ID and be connected to at least one ray. Minimum 1 point required."
			),
		rays: z
			.array(
				z
					.object({
						from: z
							.string()
							.describe(
								"Starting point ID for this ray. Must reference a valid point from the points array."
							),
						to: z
							.string()
							.describe(
								"Ending point ID for this ray. Must reference a valid point from the points array."
							)
					})
					.strict()
			)
			.describe(
				"Line segments connecting points to form the geometric structure. Every point must be referenced in at least one ray. For complete lines through points, include both directions (e.g., A→B and B→A)."
			),
		angles: z
			.array(Angle)
			.describe(
				"Angle annotations to display in the diagram. Can include both arc-style angles and right-angle square markers."
			)
	})
	.strict()
	.describe(
		"Creates geometric diagrams showing angles formed by intersecting rays. Supports general angles with arc annotations and right angles with square markers. Ideal for geometry problems involving angle measurement and relationships."
	)

export type AngleDiagramProps = z.infer<typeof AngleDiagramPropsSchema>

/**
 * Generates a flexible diagram of angles from a set of points and rays.
 * Ideal for a wide range of geometry problems.
 */
export const generateAngleDiagram: WidgetGenerator<
	typeof AngleDiagramPropsSchema
> = async (props) => {
	const { width, height, points, rays, angles } = props

	// Validate that every point is connected to at least one ray
	const connectedPointIds = new Set<string>()
	for (const ray of rays) {
		connectedPointIds.add(ray.from)
		connectedPointIds.add(ray.to)
	}

	const isolatedPoints = points.filter(
		(point) => !connectedPointIds.has(point.id)
	)
	if (isolatedPoints.length > 0) {
		const isolatedIds = isolatedPoints.map((p) => p.id).join(", ")
		logger.error("angle diagram validation failed: isolated points found", {
			isolatedPointIds: isolatedIds,
			isolatedPointCount: isolatedPoints.length
		})
		throw errors.new(
			"points not connected to any rays - incomplete line definitions"
		)
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})
	const pointMap = new Map(points.map((p) => [p.id, p]))

	// Build screen-space segments for collision checks (rays only)
	const screenSegments: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = []
	for (const ray of rays) {
		const from = pointMap.get(ray.from)
		const to = pointMap.get(ray.to)
		if (!from || !to) continue
		screenSegments.push({
			a: { x: from.x, y: from.y },
			b: { x: to.x, y: to.y }
		})
	}

	// Collision helpers (ported from other widgets)
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

		// Fast reject: if either segment endpoint lies inside the rectangle, we have a collision
		const pointInsideRect = (p: { x: number; y: number }) =>
			p.x >= rx && p.x <= rx + rw && p.y >= ry && p.y <= ry + rh
		if (pointInsideRect(A) || pointInsideRect(B)) return true

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

	// Draw angles FIRST so lines appear above arcs/markers
	for (const angle of angles) {
		const p1 = pointMap.get(angle.pointOnFirstRay)
		const vertex = pointMap.get(angle.vertex)
		const p2 = pointMap.get(angle.pointOnSecondRay)
		if (!p1 || !vertex || !p2) {
			continue
		}

		if (angle.type === "right") {
			const v1x = p1.x - vertex.x
			const v1y = p1.y - vertex.y
			const mag1 = Math.sqrt(v1x * v1x + v1y * v1y)
			const u1x = v1x / mag1
			const u1y = v1y / mag1

			const v2x = p2.x - vertex.x
			const v2y = p2.y - vertex.y
			const mag2 = Math.sqrt(v2x * v2x + v2y * v2y)
			const u2x = v2x / mag2
			const u2y = v2y / mag2

			const markerSize = 15
			const m1x = vertex.x + u1x * markerSize
			const m1y = vertex.y + u1y * markerSize
			const m2x = vertex.x + u2x * markerSize
			const m2y = vertex.y + u2y * markerSize
			const m3x = vertex.x + (u1x + u2x) * markerSize
			const m3y = vertex.y + (u1y + u2y) * markerSize

			const path = new Path2D()
				.moveTo(m1x, m1y)
				.lineTo(m3x, m3y)
				.lineTo(m2x, m2y)
			canvas.drawPath(path, {
				fill: "none",
				stroke: angle.color,
				strokeWidth: theme.stroke.width.thick
			})
		}

		if (angle.type === "arc") {
			const startAngle = Math.atan2(p1.y - vertex.y, p1.x - vertex.x)
			const endAngle = Math.atan2(p2.y - vertex.y, p2.x - vertex.x)

			const ARC_OFFSET = 6
			const effectiveRadius = angle.radius + ARC_OFFSET
			const arcStartX = vertex.x + effectiveRadius * Math.cos(startAngle)
			const arcStartY = vertex.y + effectiveRadius * Math.sin(startAngle)
			const arcEndX = vertex.x + effectiveRadius * Math.cos(endAngle)
			const arcEndY = vertex.y + effectiveRadius * Math.sin(endAngle)

			let angleDiff = endAngle - startAngle
			if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI
			if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI

			const largeArcFlag: 0 | 1 = Math.abs(angleDiff) > Math.PI ? 1 : 0
			const sweepFlag: 0 | 1 = angleDiff > 0 ? 1 : 0

			const path = new Path2D()
				.moveTo(arcStartX, arcStartY)
				.arcTo(
					angle.radius,
					angle.radius,
					0,
					largeArcFlag,
					sweepFlag,
					arcEndX,
					arcEndY
				)
			canvas.drawPath(path, {
				fill: "none",
				stroke: angle.color,
				strokeWidth: theme.stroke.width.xthick
			})
		}
	}

	// Then draw rays ON TOP of arcs
	for (const ray of rays) {
		const from = pointMap.get(ray.from)
		const to = pointMap.get(ray.to)
		if (!from || !to) continue

		canvas.drawLine(from.x, from.y, to.x, to.y, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thick
		})
	}

	// Prepare to place labels with collision avoidance (over rays)
	const placedLabelRects: Array<{
		x: number
		y: number
		width: number
		height: number
	}> = []

	// Angle labels: compute smart positions and slide tangentially to avoid ray overlap
	for (const angle of angles) {
		if (angle.label === null) continue

		const p1 = pointMap.get(angle.pointOnFirstRay)
		const vertex = pointMap.get(angle.vertex)
		const p2 = pointMap.get(angle.pointOnSecondRay)
		if (!p1 || !vertex || !p2) continue

		const vtx = vertex
		const startAngle = Math.atan2(p1.y - vtx.y, p1.x - vtx.x)
		const endAngle = Math.atan2(p2.y - vtx.y, p2.x - vtx.x)
		let angleDiff = endAngle - startAngle
		while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI
		while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI
		const midAngle = startAngle + angleDiff / 2
		const angleSize = Math.abs(angleDiff)

		let labelRadius: number
		if (angle.type === "right") {
			labelRadius = 26
		} else {
			const ARC_OFFSET = 6
			const FONT_SIZE_ESTIMATE = 14
			const MIN_LABEL_CLEARANCE = FONT_SIZE_ESTIMATE * 1.6
			const baseLabelRadius = angle.radius + ARC_OFFSET + MIN_LABEL_CLEARANCE
			const CLEARANCE_PX = FONT_SIZE_ESTIMATE * 0.8
			if (Math.sin(angleSize / 2) > 0.01) {
				const minRadiusForClearance = CLEARANCE_PX / Math.sin(angleSize / 2)
				labelRadius = Math.max(baseLabelRadius, minRadiusForClearance)
			} else {
				labelRadius = baseLabelRadius
			}
			if (angle.label.length > 3) {
				const extraSpacing =
					angle.label.length > 4 ? (angle.label.length - 4) * 4 : 0
				labelRadius += 18 + extraSpacing
			}
		}

		const fontPx = theme.font.size.medium
		const dims = estimateWrappedTextDimensions(
			angle.label,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = dims.maxWidth / 2
		const halfH = dims.height / 2

		const dirX = Math.cos(midAngle)
		const dirY = Math.sin(midAngle)
		const tanX = -dirY
		const tanY = dirX

		function placeTangential(mult: number) {
			let px = vtx.x + labelRadius * dirX
			let py = vtx.y + labelRadius * dirY
			let it = 0
			const maxIt = 90
			const step = 3
			while (
				(rectIntersectsAnySegment({
					x: px - halfW,
					y: py - halfH,
					width: dims.maxWidth,
					height: dims.height,
					pad: 1
				}) ||
					placedLabelRects.some(
						(r) =>
							!(
								px - halfW + dims.maxWidth < r.x ||
								r.x + r.width < px - halfW ||
								py - halfH + dims.height < r.y ||
								r.y + r.height < py - halfH
							)
					)) &&
				it < maxIt
			) {
				px += mult * step * tanX
				py += mult * step * tanY
				it++
			}
			return { x: px, y: py, it }
		}

		const cw = placeTangential(1)
		const ccw = placeTangential(-1)
		const chosen = ccw.it < cw.it ? ccw : cw

		canvas.drawText({
			x: chosen.x,
			y: chosen.y,
			text: angle.label,
			fill: theme.colors.text,
			stroke: theme.colors.white,
			strokeWidth: 0.3,
			paintOrder: "stroke fill",
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			fontWeight: "500"
		})

		placedLabelRects.push({
			x: chosen.x - halfW,
			y: chosen.y - halfH,
			width: dims.maxWidth,
			height: dims.height
		})
	}

	// Draw points and their labels (drawn last to be on top)
	for (const point of points) {
		if (point.shape === "ellipse") {
			canvas.drawEllipse(
				point.x,
				point.y,
				theme.geometry.pointRadius.base,
				theme.geometry.pointRadius.base,
				{
					fill: theme.colors.black,
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.thick
				}
			)
		} else {
			canvas.drawCircle(point.x, point.y, theme.geometry.pointRadius.base, {
				fill: theme.colors.black
			})
		}
		if (point.label !== null) {
			// Consider ALL rays that touch this point, whether the point is the source or target
			const connectedAngles: number[] = []
			for (const ray of rays) {
				if (ray.from === point.id) {
					const toPoint = pointMap.get(ray.to)
					if (toPoint)
						connectedAngles.push(
							Math.atan2(toPoint.y - point.y, toPoint.x - point.x)
						)
				} else if (ray.to === point.id) {
					const fromPoint = pointMap.get(ray.from)
					if (fromPoint)
						connectedAngles.push(
							Math.atan2(fromPoint.y - point.y, fromPoint.x - point.x)
						)
				}
			}

			// Determine preferred direction using largest angular gap among all connected rays
			let bestAngle = Math.PI / 2
			if (connectedAngles.length === 1) {
				// Place roughly perpendicular to the lone ray
				bestAngle = connectedAngles[0] + Math.PI / 2
			} else if (connectedAngles.length >= 2) {
				const rayAngles = connectedAngles.sort((a, b) => a - b)
				let maxGap = -1
				for (let i = 0; i < rayAngles.length; i++) {
					const a1 = rayAngles[i]
					const a2 = rayAngles[(i + 1) % rayAngles.length]
					let gap = a2 - a1
					if (gap < 0) gap += 2 * Math.PI
					if (i === rayAngles.length - 1) gap = rayAngles[0] + 2 * Math.PI - a1
					if (gap > maxGap) {
						maxGap = gap
						bestAngle = a1 + gap / 2
					}
				}
			}

			const baseDist = 18 // more breathing room than before
			const fontPx = theme.font.size.large
			const dims = estimateWrappedTextDimensions(
				point.label,
				Number.POSITIVE_INFINITY,
				fontPx,
				1.2
			)
			const halfW = dims.maxWidth / 2
			const halfH = dims.height / 2

			const dirX = Math.cos(bestAngle)
			const dirY = Math.sin(bestAngle)
			const tanX = -dirY
			const tanY = dirX

			function placeTangential(mult: number) {
				let px = point.x + baseDist * dirX
				let py = point.y + baseDist * dirY
				let it = 0
				const maxIt = 90
				const step = 3
				while (
					(rectIntersectsAnySegment({
						x: px - halfW,
						y: py - halfH,
						width: dims.maxWidth,
						height: dims.height,
						pad: 1
					}) ||
						placedLabelRects.some(
							(r) =>
								!(
									px - halfW + dims.maxWidth < r.x ||
									r.x + r.width < px - halfW ||
									py - halfH + dims.height < r.y ||
									r.y + r.height < py - halfH
								)
						)) &&
					it < maxIt
				) {
					px += mult * step * tanX
					py += mult * step * tanY
					it++
				}
				return { x: px, y: py, it }
			}

			const cw = placeTangential(1)
			const ccw = placeTangential(-1)
			const chosen = ccw.it < cw.it ? ccw : cw

			canvas.drawText({
				x: chosen.x,
				y: chosen.y,
				text: point.label,
				fill: theme.colors.text,
				fontPx,
				fontWeight: theme.font.weight.bold
			})

			placedLabelRects.push({
				x: chosen.x - halfW,
				y: chosen.y - halfH,
				width: dims.maxWidth,
				height: dims.height
			})
		}
	}

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
