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

// Defines a line segment, such as a radius, innerRadius, or a diameter.
const SegmentSchema = z
	.object({
		type: z
			.enum(["radius", "innerRadius", "diameter"])
			.describe(
				"Type of line segment to draw. 'radius' draws from center to outer circumference, 'innerRadius' draws from center to inner circle edge (requires innerRadius), 'diameter' draws a full line across the circle through center."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label for the segment measurement. Examples: 'r', 'd', '5 cm', 'radius = 3', '10 units'. Set to null for unlabeled segments. Label appears along the segment line."
			),
		color: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"CSS color value for the segment line. Examples: '#FF0000' (red), '#000000' (black), '#0066CC' (blue). Choose colors that contrast well with the circle fill and background."
			),
		angle: z
			.number()
			.describe(
				"Angle in degrees for segment positioning. 0° points right (3 o'clock), 90° points up (12 o'clock), 180° points left (9 o'clock), 270° points down (6 o'clock). Angles increase counter-clockwise."
			)
	})
	.strict()
	.describe(
		"Line segment definition for drawing radii, inner radii, or diameters on the circle diagram."
	)

// Defines a sector (a pie slice) of the circle.
const SectorSchema = z
	.object({
		startAngle: z
			.number()
			.describe(
				"Starting angle in degrees for the sector. 0° is rightward (3 o'clock position), angles increase counter-clockwise. Examples: 0, 45, 90, 180."
			),
		endAngle: z
			.number()
			.describe(
				"Ending angle in degrees for the sector. Must be greater than startAngle to create a valid sector. For full circle: 0 to 360. Examples: 90, 180, 270, 360."
			),
		fillColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"CSS fill color for the pie slice sector. Examples: '#FFE5B4' (light orange), '#87CEEB' (sky blue), '#FF69B4' (hot pink). Use alpha channel for transparency effects."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label for the sector content. Examples: '90°', '¼', '25%', 'Section A', '30°'. Set to null for unlabeled sectors. Label appears inside the sector area."
			),
		showRightAngleMarker: z
			.boolean()
			.describe(
				"Display a small square marker for right angles. Only applies when the sector spans exactly 90° (endAngle - startAngle = 90). Useful for geometry problems involving perpendicular relationships."
			)
	})
	.strict()
	.describe(
		"Sector (pie slice) definition for filling and labeling portions of the circle."
	)

// Defines an arc (a portion of the circle's circumference).
const ArcSchema = z
	.object({
		startAngle: z
			.number()
			.describe(
				"Starting angle in degrees for the arc segment. 0° is rightward (3 o'clock), angles increase counter-clockwise. Examples: 0, 30, 45, 90."
			),
		endAngle: z
			.number()
			.describe(
				"Ending angle in degrees for the arc segment. Must be greater than startAngle. Arc traces counter-clockwise from start to end. Examples: 90, 180, 270, 360."
			),
		strokeColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"CSS color for the arc line stroke. Examples: '#FF6B6B' (coral), '#4169E1' (royal blue), '#32CD32' (lime green). Use bold colors for visibility against circle background."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label for arc measurement or identification. Examples: '90°', '2πr/4', 's = 5.2 cm', 'Arc AB'. Set to null for unlabeled arcs. Positioned along the arc curve."
			)
	})
	.strict()
	.describe(
		"Arc definition for highlighting specific portions of the circle's circumference."
	)

// The main Zod schema for the circleDiagram function
export const CircleDiagramPropsSchema = z
	.object({
		type: z
			.literal("circleDiagram")
			.describe(
				"Widget type identifier for circle-based geometric diagrams and visualizations."
			),
		shape: z
			.enum(["circle", "semicircle", "quarter-circle"])
			.describe(
				"Base geometric shape to display. 'circle' shows full 360° circle, 'semicircle' shows 180° half-circle, 'quarter-circle' shows 90° quarter section. Affects which portion of the circle is visible."
			),
		rotation: z
			.number()
			.describe(
				"Rotation angle in degrees for the entire shape. 0° means no rotation. For semicircle: 0° = flat edge at bottom, 90° = flat edge at left. Positive values rotate counter-clockwise."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		radius: z
			.number()
			.positive()
			.describe(
				"Outer radius of the circle in logical units. Gets scaled to fit the canvas. For annulus shapes, this defines the outer boundary. Typical range: 50-200 units."
			),
		fillColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"CSS fill color for the main circle interior. Examples: '#E8F4FD' (light blue), '#FFFFFF' (white), 'transparent' (outline only). Use alpha channel for semi-transparent effects."
			),
		strokeColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"CSS color for the circle's border outline. Examples: '#000000' (black), '#666666' (gray), '#0066CC' (blue). Use 'transparent' to hide the border."
			),
		innerRadius: z
			.number()
			.positive()
			.nullable()
			.describe(
				"Inner radius for creating annulus (ring/donut) shapes. Must be smaller than the outer radius. Set to null for solid circles. Creates hollow center when combined with annulusFillColor."
			),
		annulusFillColor: z
			.string()
			.nullable()
			.describe(
				"CSS fill color for the ring area between inner and outer radius. Examples: '#FFE5B4' (peach), '#D3D3D3' (light gray). Set to null to disable annulus visualization."
			),
		segments: z
			.array(SegmentSchema)
			.describe(
				"Array of line segments to draw on the circle. Includes radii, inner radii, and diameters. Empty array for no segments. Use to show measurements, divide the circle, or illustrate geometric relationships."
			),
		sectors: z
			.array(SectorSchema)
			.describe(
				"Array of filled pie slice sectors. Empty array for no sectors. Perfect for fraction problems, angle visualization, pie charts, and showing portions of the whole circle."
			),
		arcs: z
			.array(ArcSchema)
			.describe(
				"Array of highlighted arc segments on the circumference. Empty array for no arcs. Use for arc length problems, angle measurements, or emphasizing specific portions of the perimeter."
			),
		showCenterDot: z
			.boolean()
			.describe(
				"Display a small dot marker at the circle's center point. Useful for geometric constructions, showing the center of rotation, or emphasizing the circle's center in problems."
			),
		areaLabel: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label for the circle's area, displayed at the center. Examples: 'A = πr²', 'Area = 78.5 cm²', '314 sq units', 'π × 5² = 25π'. Set to null for no area label."
			)
	})
	.strict()
	.describe(
		"Creates comprehensive circle diagrams for geometry education. Supports full circles, semicircles, and quarter-circles with customizable sectors, arc annotations, and line segments. Perfect for teaching circumference, area, angles, fractions, and geometric relationships. Includes advanced features like annulus shapes, collision-avoiding labels, and right-angle markers."
	)

export type CircleDiagramProps = z.infer<typeof CircleDiagramPropsSchema>

/**
 * Generates an SVG diagram of a circle and its components.
 */
export const generateCircleDiagram: WidgetGenerator<
	typeof CircleDiagramPropsSchema
> = async (props) => {
	const {
		shape,
		rotation,
		width,
		height,
		radius,
		fillColor,
		strokeColor,
		innerRadius,
		annulusFillColor,
		segments,
		sectors,
		arcs,
		showCenterDot,
		areaLabel
	} = props

	const cx = width / 2
	const cy = height / 2
	const mainRadius = Math.min(cx, cy) - PADDING
	const scale = mainRadius / radius

	const toRad = (deg: number) => (deg * Math.PI) / 180
	const pointOnCircle = (angleDeg: number, r: number) => ({
		x: cx + r * Math.cos(toRad(angleDeg)),
		y: cy + r * Math.sin(toRad(angleDeg)) // +y is down in SVG
	})
	const clamp = (value: number, min: number, max: number) =>
		Math.max(min, Math.min(value, max))

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})
	const r = radius * scale
	const rInnerOpt = innerRadius ? innerRadius * scale : null

	// Collision detection utilities
	const avoidSegments: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = []
	const placedLabels: Array<{
		x: number
		y: number
		width: number
		height: number
	}> = []

	function orient(
		p: { x: number; y: number },
		q: { x: number; y: number },
		r: { x: number; y: number }
	) {
		const v = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
		if (v > 1e-9) return 1
		if (v < -1e-9) return -1
		return 0
	}

	function intersects(
		p1: { x: number; y: number },
		p2: { x: number; y: number },
		p3: { x: number; y: number },
		p4: { x: number; y: number }
	) {
		const o1 = orient(p1, p2, p3)
		const o2 = orient(p1, p2, p4)
		const o3 = orient(p3, p4, p1)
		const o4 = orient(p3, p4, p2)
		return o1 !== o2 && o3 !== o4
	}

	function rectIntersectsSegment(
		rect: { x: number; y: number; width: number; height: number; pad?: number },
		s: { a: { x: number; y: number }; b: { x: number; y: number } }
	) {
		const pad = rect.pad ?? 0
		const rx = rect.x - pad
		const ry = rect.y - pad
		const rw = rect.width + 2 * pad
		const rh = rect.height + 2 * pad

		// Quick bounding box check first
		const minX = Math.min(s.a.x, s.b.x)
		const maxX = Math.max(s.a.x, s.b.x)
		const minY = Math.min(s.a.y, s.b.y)
		const maxY = Math.max(s.a.y, s.b.y)
		if (maxX < rx || minX > rx + rw || maxY < ry || minY > ry + rh) return false

		const edges = [
			{ a: { x: rx, y: ry }, b: { x: rx + rw, y: ry } },
			{ a: { x: rx + rw, y: ry }, b: { x: rx + rw, y: ry + rh } },
			{ a: { x: rx + rw, y: ry + rh }, b: { x: rx, y: ry + rh } },
			{ a: { x: rx, y: ry + rh }, b: { x: rx, y: ry } }
		]
		return edges.some((e) => intersects(e.a, e.b, s.a, s.b))
	}

	function rectIntersectsRect(
		rect1: { x: number; y: number; width: number; height: number },
		rect2: { x: number; y: number; width: number; height: number }
	) {
		return !(
			rect1.x + rect1.width < rect2.x ||
			rect2.x + rect2.width < rect1.x ||
			rect1.y + rect1.height < rect2.y ||
			rect2.y + rect2.height < rect1.y
		)
	}

	function withinBounds(rect: {
		x: number
		y: number
		width: number
		height: number
	}) {
		const pad = 2
		const lft = rect.x - pad
		const rgt = rect.x + rect.width + pad
		const top = rect.y - pad
		const bot = rect.y + rect.height + pad
		return (
			lft >= PADDING &&
			rgt <= width - PADDING &&
			top >= PADDING &&
			bot <= height - PADDING
		)
	}

	function rectIntersectsAnySegment(rect: {
		x: number
		y: number
		width: number
		height: number
		pad?: number
	}): boolean {
		for (const seg of avoidSegments) {
			if (rectIntersectsSegment(rect, seg)) return true
		}
		return false
	}

	function findSafeLabelPosition(
		idealX: number,
		idealY: number,
		labelWidth: number,
		labelHeight: number,
		searchRadius = 30
	): { x: number; y: number } | null {
		const halfW = labelWidth / 2
		const halfH = labelHeight / 2

		// Try the ideal position first
		const idealRect = {
			x: idealX - halfW,
			y: idealY - halfH,
			width: labelWidth,
			height: labelHeight,
			pad: 1
		}
		if (withinBounds(idealRect)) {
			const hasSegmentCollision = rectIntersectsAnySegment(idealRect)
			let hasLabelCollision = false

			// Check against other labels
			if (!hasSegmentCollision) {
				for (const label of placedLabels) {
					if (rectIntersectsRect(idealRect, label)) {
						hasLabelCollision = true
						break
					}
				}
			}

			if (!hasSegmentCollision && !hasLabelCollision) {
				return { x: idealX, y: idealY }
			}
		}

		// Search in expanding circles around the ideal position
		const step = 4 // Smaller steps for more precision

		for (let radius = step; radius <= searchRadius; radius += step) {
			const angleStep = Math.PI / 12 // More positions per circle for better coverage
			for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
				const testX = idealX + Math.cos(angle) * radius
				const testY = idealY + Math.sin(angle) * radius
				const testRect = {
					x: testX - halfW,
					y: testY - halfH,
					width: labelWidth,
					height: labelHeight,
					pad: 1
				}

				if (!withinBounds(testRect)) continue

				const hasSegmentCollision = rectIntersectsAnySegment(testRect)
				let hasLabelCollision = false

				// Check against other labels
				if (!hasSegmentCollision) {
					for (const label of placedLabels) {
						if (rectIntersectsRect(testRect, label)) {
							hasLabelCollision = true
							break
						}
					}
				}

				if (!hasSegmentCollision && !hasLabelCollision) {
					return { x: testX, y: testY }
				}
			}
		}

		return null
	}

	function findNormalBasedLabelPosition(
		centerX: number,
		centerY: number,
		angleRad: number,
		radius: number,
		labelWidth: number,
		labelHeight: number,
		minPadding = 20
	): { x: number; y: number } | null {
		const halfW = labelWidth / 2
		const halfH = labelHeight / 2

		// Normal direction (outward from arc center)
		const normalX = Math.cos(angleRad)
		const normalY = Math.sin(angleRad)

		// For certain shapes, we might want to try inward positioning first
		// (e.g., for semicircles where the arc is on the curved part)
		const directions = [1, -0.7] // Try outward first, then inward with less distance

		for (const dirMultiplier of directions) {
			let currentDistance = minPadding
			const maxDistance = Math.min(width, height) / 2 - PADDING
			const step = 8

			while (currentDistance <= maxDistance) {
				// Position along the normal at current distance
				const testX =
					centerX + (radius + currentDistance * dirMultiplier) * normalX
				const testY =
					centerY + (radius + currentDistance * dirMultiplier) * normalY

				const testRect = {
					x: testX - halfW,
					y: testY - halfH,
					width: labelWidth,
					height: labelHeight,
					pad: 4 // Extra padding to ensure clearance
				}

				// Check if position is valid
				if (
					withinBounds(testRect) &&
					!rectIntersectsAnySegment(testRect) &&
					!placedLabels.some((label) => rectIntersectsRect(testRect, label))
				) {
					return { x: testX, y: testY }
				}

				currentDistance += step
			}
		}

		return null
	}

	function findTangentialLabelPosition(
		centerX: number,
		centerY: number,
		angleRad: number,
		radius: number,
		labelWidth: number,
		labelHeight: number
	): { x: number; y: number } | null {
		const halfW = labelWidth / 2
		const halfH = labelHeight / 2

		// Radial direction (from center outward)
		const dirX = Math.cos(angleRad)
		const dirY = Math.sin(angleRad)

		// Tangential direction (perpendicular to radial)
		const tanX = -dirY
		const tanY = dirX

		// Start at the ideal position along the arc
		const baseX = centerX + radius * dirX
		const baseY = centerY + radius * dirY

		// Nudge slightly away from the arc to prevent grazing intersections
		const radialNudge = 4
		const startX = baseX + radialNudge * dirX
		const startY = baseY + radialNudge * dirY

		// Try both tangential directions
		function tryTangential(multiplier: number): {
			x: number
			y: number
			iterations: number
		} {
			let px = startX
			let py = startY
			let iterations = 0
			const maxIterations = 60
			const step = 3

			while (iterations < maxIterations) {
				const testRect = {
					x: px - halfW,
					y: py - halfH,
					width: labelWidth,
					height: labelHeight,
					pad: 1
				}

				if (
					withinBounds(testRect) &&
					!rectIntersectsAnySegment(testRect) &&
					!placedLabels.some((label) => rectIntersectsRect(testRect, label))
				) {
					return { x: px, y: py, iterations }
				}

				px += multiplier * step * tanX
				py += multiplier * step * tanY
				iterations++
			}

			return { x: px, y: py, iterations: maxIterations }
		}

		const clockwise = tryTangential(1)
		const counterclockwise = tryTangential(-1)

		// Choose the direction that required fewer iterations (found a good spot faster)
		const chosen =
			counterclockwise.iterations < clockwise.iterations
				? counterclockwise
				: clockwise

		// Only return if we found a valid position (not at max iterations)
		if (chosen.iterations < 60) {
			return { x: chosen.x, y: chosen.y }
		}

		return null
	}

	// Annulus is only compatible with the full "circle" shape.
	if (shape === "circle" && innerRadius && annulusFillColor) {
		const r1 = radius * scale
		const r2 = innerRadius * scale
		const annulusPath = new Path2D()
			.moveTo(cx - r1, cy)
			.arcTo(r1, r1, 0, 0, 1, cx + r1, cy)
			.arcTo(r1, r1, 0, 0, 1, cx - r1, cy)
			.moveTo(cx - r2, cy)
			.arcTo(r2, r2, 0, 0, 1, cx + r2, cy)
			.arcTo(r2, r2, 0, 0, 1, cx - r2, cy)
		canvas.drawPath(annulusPath, {
			fill: annulusFillColor,
			fillRule: "evenodd"
		})
	}

	// Draw sectors first, so the main shape's stroke is drawn on top.
	if (sectors.length > 0) {
		for (const sector of sectors) {
			const start = pointOnCircle(sector.startAngle, r)
			const end = pointOnCircle(sector.endAngle, r)
			const angleDiff = Math.abs(sector.endAngle - sector.startAngle)
			const largeArcFlag: 0 | 1 = angleDiff > 180 ? 1 : 0
			const sectorPath = new Path2D()
				.moveTo(cx, cy)
				.lineTo(start.x, start.y)
				.arcTo(r, r, 0, largeArcFlag, 1, end.x, end.y)
				.closePath()
			canvas.drawPath(sectorPath, {
				fill: sector.fillColor,
				stroke: "none"
			})

			if (sector.showRightAngleMarker && Math.abs(angleDiff - 90) < 0.1) {
				const markerSize = Math.min(r, 20) * 0.8
				const p1 = pointOnCircle(sector.startAngle, markerSize)
				const p3 = pointOnCircle(
					sector.startAngle + 45,
					markerSize * Math.sqrt(2)
				)
				const p2 = pointOnCircle(sector.endAngle, markerSize)
				const markerPath = new Path2D()
					.moveTo(p1.x, p1.y)
					.lineTo(p3.x, p3.y)
					.lineTo(p2.x, p2.y)
				canvas.drawPath(markerPath, {
					fill: "none",
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			}
		}
	}

	// Draw the main shape's boundary based on the 'shape' prop.
	switch (shape) {
		case "semicircle": {
			// A semicircle path from 0 to 180 degrees, rotated. Closing the path (Z) draws the diameter.
			const startAngle = 0 + rotation
			const endAngle = 180 + rotation
			const start = pointOnCircle(startAngle, r)
			const end = pointOnCircle(endAngle, r)
			const semicirclePath = new Path2D()
				.moveTo(start.x, start.y)
				.arcTo(r, r, 0, 0, 1, end.x, end.y)
				.closePath()
			canvas.drawPath(semicirclePath, {
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: theme.stroke.width.thick
			})

			// Add semicircle arc segments to avoid list for collision detection
			const arcAngleSpan = 180
			const numSegments = Math.max(6, Math.ceil(arcAngleSpan / 30))
			for (let i = 0; i < numSegments; i++) {
				const angle1 = startAngle + (i * arcAngleSpan) / numSegments
				const angle2 = startAngle + ((i + 1) * arcAngleSpan) / numSegments
				const p1 = pointOnCircle(angle1, r)
				const p2 = pointOnCircle(angle2, r)
				avoidSegments.push({ a: p1, b: p2 })
			}
			// Add the diameter line
			avoidSegments.push({ a: start, b: end })
			break
		}
		case "quarter-circle": {
			// A quarter-circle path from the center, out to the arc, and back to the center.
			const startAngle = 0 + rotation
			const endAngle = 90 + rotation
			const start = pointOnCircle(startAngle, r)
			const end = pointOnCircle(endAngle, r)
			const quarterCirclePath = new Path2D()
				.moveTo(cx, cy)
				.lineTo(start.x, start.y)
				.arcTo(r, r, 0, 0, 1, end.x, end.y)
				.closePath()
			canvas.drawPath(quarterCirclePath, {
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: theme.stroke.width.thick
			})

			// Add quarter-circle segments to avoid list for collision detection
			const arcAngleSpan = 90
			const numSegments = Math.max(3, Math.ceil(arcAngleSpan / 30))
			for (let i = 0; i < numSegments; i++) {
				const angle1 = startAngle + (i * arcAngleSpan) / numSegments
				const angle2 = startAngle + ((i + 1) * arcAngleSpan) / numSegments
				const p1 = pointOnCircle(angle1, r)
				const p2 = pointOnCircle(angle2, r)
				avoidSegments.push({ a: p1, b: p2 })
			}
			// Add the radial lines
			avoidSegments.push({ a: { x: cx, y: cy }, b: start })
			avoidSegments.push({ a: { x: cx, y: cy }, b: end })
			break
		}
		default: {
			canvas.drawCircle(cx, cy, r, {
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: theme.stroke.width.thick
			})

			// Add full circle segments to avoid list for collision detection
			const numSegments = 24 // Full circle needs more segments
			for (let i = 0; i < numSegments; i++) {
				const angle1 = (i * 360) / numSegments
				const angle2 = ((i + 1) * 360) / numSegments
				const p1 = pointOnCircle(angle1, r)
				const p2 = pointOnCircle(angle2, r)
				avoidSegments.push({ a: p1, b: p2 })
			}
			break
		}
	}

	// The inner circle is only drawn for the main "circle" shape.
	if (shape === "circle" && innerRadius) {
		const rInner = innerRadius * scale
		canvas.drawCircle(cx, cy, rInner, {
			fill: theme.colors.white,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})

		// Add inner circle segments to avoid list for collision detection
		const numSegments = 20
		for (let i = 0; i < numSegments; i++) {
			const angle1 = (i * 360) / numSegments
			const angle2 = ((i + 1) * 360) / numSegments
			const p1 = pointOnCircle(angle1, rInner)
			const p2 = pointOnCircle(angle2, rInner)
			avoidSegments.push({ a: p1, b: p2 })
		}
	}

	// Arcs are drawn on top of the main shape.
	if (arcs.length > 0) {
		for (const arc of arcs) {
			const start = pointOnCircle(arc.startAngle, r)
			const end = pointOnCircle(arc.endAngle, r)
			const largeArcFlag: 0 | 1 =
				Math.abs(arc.endAngle - arc.startAngle) > 180 ? 1 : 0
			const arcPath = new Path2D()
				.moveTo(start.x, start.y)
				.arcTo(r, r, 0, largeArcFlag, 1, end.x, end.y)
			canvas.drawPath(arcPath, {
				fill: "none",
				stroke: arc.strokeColor,
				strokeWidth: theme.stroke.width.xxthick
			})

			// Add arc segments to avoid list for collision detection
			// Approximate arc with multiple line segments for collision detection
			const arcAngleSpan = Math.abs(arc.endAngle - arc.startAngle)
			const numSegments = Math.max(3, Math.ceil(arcAngleSpan / 30)) // One segment per 30 degrees
			for (let i = 0; i < numSegments; i++) {
				const angle1 = arc.startAngle + (i * arcAngleSpan) / numSegments
				const angle2 = arc.startAngle + ((i + 1) * arcAngleSpan) / numSegments
				const p1 = pointOnCircle(angle1, r)
				const p2 = pointOnCircle(angle2, r)
				avoidSegments.push({ a: p1, b: p2 })
			}

			if (arc.label !== null) {
				const midAngle = (arc.startAngle + arc.endAngle) / 2
				const midAngleRad = (midAngle * Math.PI) / 180

				// Estimate label dimensions
				const { maxWidth: labelWidth, height: labelHeight } =
					estimateWrappedTextDimensions(
						arc.label,
						Number.POSITIVE_INFINITY,
						theme.font.size.medium,
						1.2
					)

				// Try normal-based positioning first (best for avoiding line intersections)
				const normalPos = findNormalBasedLabelPosition(
					cx,
					cy,
					midAngleRad,
					r,
					labelWidth,
					labelHeight
				)

				let finalPos: { x: number; y: number } | null = normalPos

				// If normal positioning failed, try tangential positioning
				if (!finalPos) {
					finalPos = findTangentialLabelPosition(
						cx,
						cy,
						midAngleRad,
						r + PADDING,
						labelWidth,
						labelHeight
					)
				}

				// If both failed, try radial positioning as last resort
				if (!finalPos) {
					const labelPos = pointOnCircle(midAngle, r + PADDING)
					finalPos = findSafeLabelPosition(
						labelPos.x,
						labelPos.y,
						labelWidth,
						labelHeight
					)
				}

				if (finalPos) {
					// Track this label's position to avoid future collisions
					placedLabels.push({
						x: finalPos.x - labelWidth / 2,
						y: finalPos.y - labelHeight / 2,
						width: labelWidth,
						height: labelHeight
					})

					canvas.drawText({
						x: finalPos.x,
						y: finalPos.y,
						text: arc.label,
						fontPx: theme.font.size.medium,
						fontWeight: theme.font.weight.bold,
						fill: theme.colors.text,
						anchor: "middle",
						dominantBaseline: "middle"
					})
				} else {
					// Fallback to clamped position if no safe position found
					logger.warn("arc label placement failed, using fallback", {
						startAngle: arc.startAngle,
						endAngle: arc.endAngle
					})
					const labelPos = pointOnCircle(midAngle, r + PADDING)
					const fallbackX = clamp(labelPos.x, PADDING, width - PADDING)
					const fallbackY = clamp(labelPos.y, PADDING, height - PADDING)

					placedLabels.push({
						x: fallbackX - labelWidth / 2,
						y: fallbackY - labelHeight / 2,
						width: labelWidth,
						height: labelHeight
					})

					canvas.drawText({
						x: fallbackX,
						y: fallbackY,
						text: arc.label,
						fontPx: theme.font.size.medium,
						fontWeight: theme.font.weight.bold,
						fill: theme.colors.text,
						anchor: "middle",
						dominantBaseline: "middle"
					})
				}
			}
		}
	}

	// Segments (radii/inner-radii/diameters) are drawn on top of the main shape.
	if (segments.length > 0) {
		for (const seg of segments) {
			if (seg.type === "innerRadius" && rInnerOpt === null) {
				logger.error("innerRadius segment requires innerRadius", {
					hasInnerRadius: Boolean(innerRadius)
				})
				throw errors.new("inner radius segment without innerRadius")
			}

			const lineStart = pointOnCircle(
				seg.type === "diameter" ? seg.angle + 180 : seg.angle,
				seg.type === "diameter" ? r : 0
			)
			const targetRadius =
				seg.type === "innerRadius" && rInnerOpt !== null ? rInnerOpt : r
			const lineEnd = pointOnCircle(seg.angle, targetRadius)

			// Correction for radius start point: pointOnCircle with r=0 correctly returns the center (cx,cy)
			if (seg.type === "radius" || seg.type === "innerRadius") {
				lineStart.x = cx
				lineStart.y = cy
			}

			// Add segment to avoid list for label collision detection
			avoidSegments.push({ a: lineStart, b: lineEnd })

			canvas.drawLine(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y, {
				stroke: seg.color,
				strokeWidth: theme.stroke.width.thick
			})

			if (seg.label) {
				let labelAnchorRadius = r / 2
				if (seg.type === "innerRadius") {
					labelAnchorRadius = rInnerOpt !== null ? rInnerOpt / 2 : r / 2
				} else if (seg.type === "radius") {
					const startR = rInnerOpt !== null ? rInnerOpt : 0
					labelAnchorRadius = startR + (r - startR) / 2
				} else if (seg.type === "diameter") {
					labelAnchorRadius = r / 2
				}

				const mid = pointOnCircle(seg.angle, labelAnchorRadius)
				const angleRad = toRad(seg.angle)
				const verticalOffsetMultiplier =
					seg.angle > 270 && seg.angle < 360 ? -1 : 1
				const offsetX = -Math.sin(angleRad) * 10
				const offsetY = Math.cos(angleRad) * 10 * verticalOffsetMultiplier
				const idealX = mid.x + offsetX
				const idealY = mid.y + offsetY

				// Calculate rotation angle to make text parallel to the segment line
				let rotationAngle = seg.angle

				// For diameter, the line direction is the segment angle
				// For radius/innerRadius, we want the text to align with the radial direction
				if (seg.type !== "diameter") {
					// For radius segments, align with the radial direction from center
					rotationAngle = seg.angle
				}

				// Ensure text is readable (not upside down) by flipping if needed
				if (rotationAngle > 90 && rotationAngle <= 270) {
					rotationAngle += 180
				}

				// Estimate label dimensions
				const { maxWidth: labelWidth, height: labelHeight } =
					estimateWrappedTextDimensions(
						seg.label,
						Number.POSITIVE_INFINITY,
						theme.font.size.base,
						1.2
					)

				// Find safe position using collision detection
				const safePos = findSafeLabelPosition(
					idealX,
					idealY,
					labelWidth,
					labelHeight
				)
				if (safePos) {
					// Track this label's position to avoid future collisions
					placedLabels.push({
						x: safePos.x - labelWidth / 2,
						y: safePos.y - labelHeight / 2,
						width: labelWidth,
						height: labelHeight
					})

					canvas.drawText({
						x: safePos.x,
						y: safePos.y,
						text: seg.label,
						fontPx: theme.font.size.base,
						fill: theme.colors.text,
						anchor: "middle",
						dominantBaseline: "middle",
						rotate: { angle: rotationAngle, cx: safePos.x, cy: safePos.y }
					})
				} else {
					// Fallback to clamped position if no safe position found
					logger.warn("segment label placement failed, using fallback", {
						segmentType: seg.type,
						angle: seg.angle
					})
					const fallbackX = clamp(idealX, PADDING, width - PADDING)
					const fallbackY = clamp(idealY, PADDING, height - PADDING)

					placedLabels.push({
						x: fallbackX - labelWidth / 2,
						y: fallbackY - labelHeight / 2,
						width: labelWidth,
						height: labelHeight
					})

					canvas.drawText({
						x: fallbackX,
						y: fallbackY,
						text: seg.label,
						fontPx: theme.font.size.base,
						fill: theme.colors.text,
						anchor: "middle",
						dominantBaseline: "middle",
						rotate: { angle: rotationAngle, cx: fallbackX, cy: fallbackY }
					})
				}
			}
		}
	}

	if (showCenterDot) {
		canvas.drawCircle(cx, cy, theme.geometry.pointRadius.small, {
			fill: theme.colors.black
		})
	}

	if (areaLabel !== null) {
		const yOffset = -10
		const idealX = cx
		const idealY = cy + yOffset

		// Estimate label dimensions
		const { maxWidth: labelWidth, height: labelHeight } =
			estimateWrappedTextDimensions(
				areaLabel,
				Number.POSITIVE_INFINITY,
				theme.font.size.large,
				1.2
			)

		// Find safe position using collision detection
		const safePos = findSafeLabelPosition(
			idealX,
			idealY,
			labelWidth,
			labelHeight,
			50
		) // Larger search radius for area label
		if (safePos) {
			// Track this label's position to avoid future collisions
			placedLabels.push({
				x: safePos.x - labelWidth / 2,
				y: safePos.y - labelHeight / 2,
				width: labelWidth,
				height: labelHeight
			})

			canvas.drawText({
				x: safePos.x,
				y: safePos.y,
				text: areaLabel,
				fontPx: theme.font.size.large,
				fontWeight: theme.font.weight.bold,
				fill: theme.colors.text,
				anchor: "middle",
				dominantBaseline: "middle"
			})
		} else {
			// Fallback to original position if no safe position found
			logger.warn("area label placement failed, using fallback position")

			placedLabels.push({
				x: idealX - labelWidth / 2,
				y: idealY - labelHeight / 2,
				width: labelWidth,
				height: labelHeight
			})

			canvas.drawText({
				x: idealX,
				y: idealY,
				text: areaLabel,
				fontPx: theme.font.size.large,
				fontWeight: theme.font.weight.bold,
				fill: theme.colors.text,
				anchor: "middle",
				dominantBaseline: "middle"
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
