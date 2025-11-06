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

// Schema for an angle segment in the diagram.
const AngleSegmentSchema = z
	.object({
		fromRayLabel: z.string().describe("Label of the starting ray (e.g., 'A')."),
		toRayLabel: z.string().describe("Label of the ending ray (e.g., 'B')."),
		value: z
			.number()
			.min(1, "Angle value must be at least 1")
			.max(360, "Angle value cannot exceed 360")
			.describe("The measure of the angle in degrees."),
		color: z
			.string()
			.regex(CSS_COLOR_PATTERN, "Invalid CSS color format")
			.describe(
				"The color for the angle's visual representation. Primary angles (adjacent rays) render as filled sectors, secondary angles (spanning multiple rays) render as stroke-only arcs."
			)
	})
	.strict()

// Main Zod schema for the radially-constrained-angle-diagram widget.
export const RadiallyConstrainedAngleDiagramPropsSchema = z
	.object({
		type: z
			.literal("radiallyConstrainedAngleDiagram")
			.describe("Identifies this as a radially constrained angle diagram."),
		width: createWidthSchema(),
		height: createHeightSchema(),
		centerLabel: z
			.string()
			.nullable()
			.transform((val) => (val === "" ? null : val))
			.describe("A nullable label for the center point (e.g., 'O')."),
		rayLabels: z
			.array(z.string())
			.min(2, "At least two ray labels are required.")
			.describe("Labels for all the rays in the diagram."),
		angles: z
			.array(AngleSegmentSchema)
			.min(1, "At least one angle is required.")
			.describe(
				"An array of angle segments, each explicitly defining which rays it spans. Supports multiple layers: primary angles (adjacent rays) create filled sectors, secondary angles (spanning multiple rays) create arc overlays. Multiple secondary angles are automatically stacked at increasing radii."
			)
	})
	.strict()
	.describe(
		"Creates a diagram with rays originating from a central point, showing the angles between them. Each angle explicitly defines which rays it spans, making the relationships clear and unambiguous. Supports layered visualization: primary angles (between adjacent rays) appear as filled sectors, while secondary angles (spanning multiple rays) appear as arc overlays at different radii. Multiple secondary angles are automatically stacked for clear visual separation."
	)

export type RadiallyConstrainedAngleDiagramProps = z.infer<
	typeof RadiallyConstrainedAngleDiagramPropsSchema
>

/**
 * Generates an SVG diagram of angles constrained around a central point.
 */
export const generateRadiallyConstrainedAngleDiagram: WidgetGenerator<
	typeof RadiallyConstrainedAngleDiagramPropsSchema
> = async (props) => {
	const { width, height, centerLabel, angles, rayLabels } = props

	// --- BEGIN RUNTIME INVARIANT VALIDATION ---
	// 0. Validate ray label uniqueness
	const rayLabelSet = new Set(rayLabels)
	if (rayLabelSet.size !== rayLabels.length) {
		logger.error("duplicate ray labels", { rayLabels })
		throw errors.new("ray labels must be unique")
	}
	// 1. Validate that all ray labels referenced in angles exist
	const labelToIndexMap = new Map(rayLabels.map((label, i) => [label, i]))
	for (const angle of angles) {
		const fromIndex = labelToIndexMap.get(angle.fromRayLabel)
		const toIndex = labelToIndexMap.get(angle.toRayLabel)
		if (fromIndex === undefined || toIndex === undefined) {
			logger.error("unrecognized ray label in angle", { angle })
			throw errors.new("unrecognized ray label")
		}
		const isForwardAdjacent = toIndex === fromIndex + 1
		// Collect primary angles for total check
		if (isForwardAdjacent) {
			// tmpPrimaryCheck declared below for clarity
		}
	}
	// Recompute primary list explicitly to avoid forward references
	const primaryForTotal: typeof angles = []
	for (const angle of angles) {
		const fromIndex = labelToIndexMap.get(angle.fromRayLabel)
		const toIndex = labelToIndexMap.get(angle.toRayLabel)
		if (
			fromIndex !== undefined &&
			toIndex !== undefined &&
			toIndex === fromIndex + 1
		) {
			primaryForTotal.push(angle)
		}
	}
	const totalPrimaryAngle = primaryForTotal.reduce(
		(sum: number, a: { value: number }) => sum + a.value,
		0
	)
	if (totalPrimaryAngle <= 0 || totalPrimaryAngle >= 360) {
		logger.error("invalid total primary angle", { totalPrimaryAngle })
		throw errors.new("sum of primary angles must be less than 360 degrees")
	}
	// --- END RUNTIME INVARIANT VALIDATION ---

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 16,
		lineHeightDefault: 1.2
	})

	const cx = width / 2
	const cy = height / 2

	const diagramRadius = Math.min(width, height) / 2 - PADDING * 2.5
	const pointOnRayDist = diagramRadius * 1.2

	// Calculate ray positions from primary angle values (literal geometry)
	// Build a lookup for primary angles between consecutive rays
	const primaryBetween: Record<string, number> = {}
	for (const angle of angles) {
		const fromIndex = labelToIndexMap.get(angle.fromRayLabel)
		const toIndex = labelToIndexMap.get(angle.toRayLabel)
		if (fromIndex === undefined || toIndex === undefined) {
			logger.error("unrecognized ray label in angle", { angle })
			throw errors.new("unrecognized ray label")
		}
		const rayDiff = Math.abs(toIndex - fromIndex)
		const isAdjacent = rayDiff === 1 || rayDiff === rayLabels.length - 1
		if (!isAdjacent) continue
		// Only accept forward adjacent in the array order (i -> i+1). Wrap-around is treated as the remaining gap.
		if (toIndex === fromIndex + 1) {
			const key = `${angle.fromRayLabel}->${angle.toRayLabel}`
			if (primaryBetween[key] !== undefined) {
				logger.error("duplicate primary angle between adjacent rays", { key })
				throw errors.new("duplicate primary angle between adjacent rays")
			}
			primaryBetween[key] = angle.value
		}
	}

	// Ensure every consecutive pair (except wrap-around) has a primary value
	for (let i = 0; i < rayLabels.length - 1; i++) {
		const from = rayLabels[i]
		const to = rayLabels[i + 1]
		const key = `${from}->${to}`
		if (primaryBetween[key] === undefined) {
			logger.error("missing primary angle between adjacent rays", { from, to })
			throw errors.new("missing primary angle between adjacent rays")
		}
	}

	// 3. Validate that each secondary angle equals the sum of intervening primary angles
	for (const angle of angles) {
		const fromIndex = labelToIndexMap.get(angle.fromRayLabel)
		const toIndex = labelToIndexMap.get(angle.toRayLabel)
		if (fromIndex === undefined || toIndex === undefined) {
			logger.error("unrecognized ray label in angle", { angle })
			throw errors.new("unrecognized ray label")
		}
		const isForwardAdjacent = toIndex === fromIndex + 1
		if (isForwardAdjacent) continue

		let expected = 0
		for (let i = fromIndex; i < toIndex; i++) {
			const key = `${rayLabels[i]}->${rayLabels[i + 1]}`
			const seg = primaryBetween[key]
			if (seg === undefined) {
				// Should be unreachable due to earlier validation, but fail loud if encountered
				logger.error("missing primary segment for secondary validation", {
					key,
					fromIndex,
					toIndex
				})
				throw errors.new("missing primary angle between adjacent rays")
			}
			expected += seg
		}

		if (expected !== angle.value) {
			logger.error("secondary angle inconsistent with primary sum", {
				fromRayLabel: angle.fromRayLabel,
				toRayLabel: angle.toRayLabel,
				expected,
				actual: angle.value
			})
			throw errors.new(
				`angle from '${angle.fromRayLabel}' to '${angle.toRayLabel}' must equal sum of primary angles`
			)
		}
	}

	// Center the drawing around -90 degrees (top) using total of primary angles
	const startAngleDeg = -90 - totalPrimaryAngle / 2
	const rayAnglesDeg: number[] = new Array(rayLabels.length)
	rayAnglesDeg[0] = startAngleDeg
	for (let i = 0; i < rayLabels.length - 1; i++) {
		const key = `${rayLabels[i]}->${rayLabels[i + 1]}`
		rayAnglesDeg[i + 1] = rayAnglesDeg[i] + primaryBetween[key]
	}

	const rayPositions = rayLabels.map((label, i) => {
		const angleDeg = rayAnglesDeg[i]
		const angleRad = (angleDeg * Math.PI) / 180
		return {
			label,
			index: i,
			angleRad,
			angleDeg,
			x: cx + pointOnRayDist * Math.cos(angleRad),
			y: cy + pointOnRayDist * Math.sin(angleRad)
		}
	})

	// Separate angles into primary (forward-adjacent rays) and secondary (spanning multiple rays)
	const primaryAngles: typeof angles = []
	const secondaryAngles: typeof angles = []

	for (const angle of angles) {
		const fromRay = rayPositions.find((r) => r.label === angle.fromRayLabel)
		const toRay = rayPositions.find((r) => r.label === angle.toRayLabel)
		if (!fromRay || !toRay) {
			logger.error("ray position not found for primary angle", { angle })
			throw errors.new("ray position not found")
		}

		// Primary angle: strictly forward adjacent (i -> i+1). No wrap-around.
		const isForwardAdjacent = toRay.index === fromRay.index + 1

		if (isForwardAdjacent) {
			primaryAngles.push(angle)
		} else {
			secondaryAngles.push(angle)
		}
	}

	// Draw primary angles as filled sectors (inner) UNDER rays
	const primaryArcRadius = diagramRadius * 0.4
	const primaryLabelRadius = primaryArcRadius + 28
	const pendingPrimaryLabels: Array<{ x: number; y: number; text: string }> = []

	for (const angle of primaryAngles) {
		const fromRay = rayPositions.find((r) => r.label === angle.fromRayLabel)
		const toRay = rayPositions.find((r) => r.label === angle.toRayLabel)
		if (!fromRay || !toRay) {
			logger.error("ray position not found for primary angle", { angle })
			throw errors.new("ray position not found")
		}
		const fromRad = fromRay.angleRad
		const toRad = toRay.angleRad

		// Calculate angle span (always go clockwise from fromRay to toRay)
		let angleDiff = toRad - fromRad
		if (angleDiff <= 0) {
			angleDiff += 2 * Math.PI
		}

		const startPoint = {
			x: cx + primaryArcRadius * Math.cos(fromRad),
			y: cy + primaryArcRadius * Math.sin(fromRad)
		}
		const endPoint = {
			x: cx + primaryArcRadius * Math.cos(toRad),
			y: cy + primaryArcRadius * Math.sin(toRad)
		}

		const largeArcFlag = angleDiff > Math.PI ? 1 : 0
		const path = new Path2D()
			.moveTo(cx, cy)
			.lineTo(startPoint.x, startPoint.y)
			.arcTo(
				primaryArcRadius,
				primaryArcRadius,
				0,
				largeArcFlag,
				1,
				endPoint.x,
				endPoint.y
			)
			.closePath()
		canvas.drawPath(path, { fill: angle.color, stroke: "none" })

		// Defer label drawing until after rays so labels sit above
		const midAngleRad = fromRad + angleDiff / 2
		const labelX = cx + primaryLabelRadius * Math.cos(midAngleRad)
		const labelY = cy + primaryLabelRadius * Math.sin(midAngleRad)
		pendingPrimaryLabels.push({ x: labelX, y: labelY, text: `${angle.value}°` })
	}

	// Draw secondary angles as internal arcs UNDER rays (between primary sectors and ray endpoints)
	// Choose a radius band strictly inside the ray length and above the primary labels
	const innerArcMinRadius = primaryLabelRadius + 14
	const innerArcMaxRadius = pointOnRayDist - 24
	// Push the first secondary arc outward a bit for additional headroom near labels
	const baseSecondaryRadius = Math.min(
		innerArcMaxRadius,
		innerArcMinRadius + 16
	)
	// Widen spacing so the outer arc sits farther out as well
	const radiusStep = 44
	const pendingSecondaryLabels: Array<{
		x: number
		y: number
		text: string
		midAngleRad: number
	}> = []

	let i = 0
	for (const angle of secondaryAngles) {
		const fromRay = rayPositions.find((r) => r.label === angle.fromRayLabel)
		const toRay = rayPositions.find((r) => r.label === angle.toRayLabel)
		if (!fromRay || !toRay) {
			logger.error("ray position not found for secondary angle", { angle })
			throw errors.new("ray position not found")
		}
		const fromRad = fromRay.angleRad
		const toRad = toRay.angleRad
		// Calculate angle span (always go clockwise from fromRay to toRay)
		let angleDiff = toRad - fromRad
		if (angleDiff <= 0) {
			angleDiff += 2 * Math.PI
		}
		let secondaryRadius = baseSecondaryRadius + i * radiusStep
		if (secondaryRadius > innerArcMaxRadius) {
			secondaryRadius = innerArcMaxRadius
		}
		const startPoint = {
			x: cx + secondaryRadius * Math.cos(fromRad),
			y: cy + secondaryRadius * Math.sin(fromRad)
		}
		const endPoint = {
			x: cx + secondaryRadius * Math.cos(toRad),
			y: cy + secondaryRadius * Math.sin(toRad)
		}
		const largeArcFlag = angleDiff > Math.PI ? 1 : 0
		const arcPath = new Path2D()
			.moveTo(startPoint.x, startPoint.y)
			.arcTo(
				secondaryRadius,
				secondaryRadius,
				0,
				largeArcFlag,
				1,
				endPoint.x,
				endPoint.y
			)
		canvas.drawPath(arcPath, {
			stroke: angle.color,
			strokeWidth: theme.stroke.width.thick,
			fill: "none"
		})
		// Defer label drawing until after rays
		const midAngleRad = fromRad + angleDiff / 2
		// Give stacked secondary labels progressively more headroom
		const extraLabelOffset = 16 + i * 12 // 16px first, 28px second, etc.
		// Allow labels to extend a bit closer to the ray endpoints than arcs do
		const labelMaxRadius = Math.max(innerArcMaxRadius, pointOnRayDist - 8)
		const labelRadius = Math.min(
			labelMaxRadius,
			secondaryRadius + extraLabelOffset
		)
		const labelX = cx + labelRadius * Math.cos(midAngleRad)
		const labelY = cy + labelRadius * Math.sin(midAngleRad)
		pendingSecondaryLabels.push({
			x: labelX,
			y: labelY,
			text: `${angle.value}°`,
			midAngleRad
		})
		i++
	}

	// Draw rays and ray labels ON TOP of sectors/arcs
	const screenSegments: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = []
	for (const ray of rayPositions) {
		// Draw ray line
		canvas.drawLine(cx, cy, ray.x, ray.y, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})
		screenSegments.push({ a: { x: cx, y: cy }, b: { x: ray.x, y: ray.y } })

		// Draw point at end of ray
		canvas.drawCircle(ray.x, ray.y, 4, { fill: theme.colors.black })

		// Draw ray label
		const labelDistFromPoint = 22
		const rayLabelX =
			cx + (pointOnRayDist + labelDistFromPoint) * Math.cos(ray.angleRad)
		const rayLabelY =
			cy + (pointOnRayDist + labelDistFromPoint) * Math.sin(ray.angleRad)
		canvas.drawText({
			x: rayLabelX,
			y: rayLabelY,
			text: ray.label,
			fill: theme.colors.black,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx: 20,
			fontWeight: theme.font.weight.bold
		})
	}

	// Collision helpers (modeled after composite-shape-diagram)
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

	// Finally, draw angle labels ON TOP of rays
	// Primary labels: draw as-is
	for (const lbl of pendingPrimaryLabels) {
		canvas.drawText({
			x: lbl.x,
			y: lbl.y,
			text: lbl.text,
			fill: theme.colors.black,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx: 18,
			fontWeight: theme.font.weight.bold
		})
	}

	// Secondary labels: rotate tangentially along the arc to avoid ray piercing,
	// keeping labels close to their arcs instead of pushing them radially outward
	for (const lbl of pendingSecondaryLabels) {
		const fontPx = 18
		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			lbl.text,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = w / 2
		const halfH = h / 2
		const dirX = Math.cos(lbl.midAngleRad)
		const dirY = Math.sin(lbl.midAngleRad)
		// Tangential unit vector (perpendicular to radial direction)
		const tanX = -dirY
		const tanY = dirX
		// Nudge slightly away from the arc center to prevent grazing intersections
		const radialNudge = 2

		function placeTangential(mult: number) {
			let px = lbl.x + radialNudge * dirX
			let py = lbl.y + radialNudge * dirY
			let it = 0
			const maxIt = 80
			const step = 3
			while (
				rectIntersectsAnySegment({
					x: px - halfW,
					y: py - halfH,
					width: w,
					height: h,
					pad: 1
				}) &&
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
			text: lbl.text,
			fill: theme.colors.black,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			fontWeight: theme.font.weight.bold
		})
	}

	// Draw the center point and its label last to be on top
	canvas.drawCircle(cx, cy, 6, { fill: theme.colors.black })
	if (centerLabel) {
		// Position center label below the center point by default
		const labelDistance = 25
		const labelX = cx
		const labelY = cy + labelDistance
		canvas.drawText({
			x: labelX,
			y: labelY,
			text: centerLabel,
			fill: theme.colors.black,
			fontPx: 20,
			fontWeight: theme.font.weight.bold,
			anchor: "middle",
			dominantBaseline: "middle"
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
