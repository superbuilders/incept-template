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

const ErrInvalidBounds = errors.new("gridBounds min must be less than max")
const ErrLineNotPerpendicular = errors.new("lines are not perpendicular")

// Regex to enforce a 'line_' prefix for type safety
const lineIdRegex = /^line_[A-Za-z0-9_]+$/

// Schema for a line in the diagram
const LineSchema = z
	.object({
		id: z
			.string()
			.regex(lineIdRegex)
			.describe(
				"Unique identifier for this line with required 'line_' prefix. Examples: 'line_r', 'line_AB', 'line_perpendicular'. Used for referencing in perpendicular indicators."
			),
		from: z
			.object({ x: z.number(), y: z.number() })
			.strict()
			.describe(
				"First point defining the infinite line in grid coordinates. The line extends infinitely in both directions through this point and the 'to' point."
			),
		to: z
			.object({ x: z.number(), y: z.number() })
			.strict()
			.describe(
				"Second point defining the infinite line in grid coordinates. Combined with 'from' point, determines the line's direction and slope."
			),
		style: z
			.enum(["solid", "dotted"])
			.describe(
				"Visual style of the line. 'solid' for standard lines, 'dotted' for auxiliary or construction lines that appear dashed."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Optional text label for the line. Examples: 'r', 's', 'm', 'AB', 'perpendicular'. Set to null for unlabeled lines."
			),
		labelPosition: z
			.enum(["start", "middle", "end"])
			.describe(
				"Position of the label along the visible portion of the line. 'start' places near beginning, 'middle' at center, 'end' near the end of the visible line segment."
			),
		color: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe(
				"CSS color for both the line and its label. Examples: '#FF0000' (red), '#0066CC' (blue), '#00AA00' (green). Use distinct colors for different lines."
			)
	})
	.strict()

// Schema for a perpendicular indicator
const PerpendicularIndicatorSchema = z
	.object({
		line1Id: z
			.string()
			.regex(lineIdRegex)
			.describe(
				"ID of the first line forming the perpendicular relationship. Must match an existing line's ID from the lines array."
			),
		line2Id: z
			.string()
			.regex(lineIdRegex)
			.describe(
				"ID of the second line forming the perpendicular relationship. Must match an existing line's ID from the lines array. The two lines must be geometrically perpendicular."
			),
		size: z
			.number()
			.positive()
			.describe(
				"Size of the right angle square marker in pixels. Typical values: 15-25px. Larger values are more visible but may overlap with other elements."
			),
		color: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe(
				"CSS color for the perpendicular square indicator. Examples: '#000000' (black), '#666666' (gray). Should contrast with background and lines."
			)
	})
	.strict()

// Main schema for the LineDiagram widget
export const LineDiagramPropsSchema = z
	.object({
		type: z
			.literal("lineDiagram")
			.describe(
				"Widget type identifier for line geometry diagrams with infinite lines and perpendicular relationships."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		gridBounds: z
			.object({
				minX: z.number(),
				maxX: z.number(),
				minY: z.number(),
				maxY: z.number()
			})
			.strict()
			.describe(
				"Logical coordinate boundaries for the grid system. Examples: {minX: -5, maxX: 5, minY: -5, maxY: 5} creates an 11×11 grid. Lines extend to these boundaries and are clipped at the edges."
			),
		lines: z
			.array(LineSchema)
			.describe(
				"Array of infinite lines to display. Each line is defined by two points but extends infinitely in both directions within the grid bounds. Lines can intersect and have perpendicular relationships."
			),
		perpendicularIndicators: z
			.array(PerpendicularIndicatorSchema)
			.describe(
				"Array of right angle markers to show perpendicular relationships between lines. Each indicator draws a small square at the intersection point of two perpendicular lines."
			)
	})
	.strict()
	.describe(
		"Creates geometric line diagrams showing infinite lines on a coordinate grid. Perfect for demonstrating line relationships, intersections, and perpendicular concepts. Lines extend infinitely within the grid bounds with automatic collision-avoiding label placement. Supports right angle indicators to highlight perpendicular relationships."
	)

type Point = { x: number; y: number }

/**
 * Finds the intersection point of two infinite lines.
 * Returns null if lines are parallel.
 */
const findLineIntersection = (
	l1p1: Point,
	l1p2: Point,
	l2p1: Point,
	l2p2: Point
): Point | null => {
	const a1 = l1p2.y - l1p1.y
	const b1 = l1p1.x - l1p2.x
	const c1 = a1 * l1p1.x + b1 * l1p1.y

	const a2 = l2p2.y - l2p1.y
	const b2 = l2p1.x - l2p2.x
	const c2 = a2 * l2p1.x + b2 * l2p1.y

	const determinant = a1 * b2 - a2 * b1

	if (Math.abs(determinant) < 1e-9) {
		return null // Parallel
	}

	return {
		x: (b2 * c1 - b1 * c2) / determinant,
		y: (a1 * c2 - a2 * c1) / determinant
	}
}

/**
 * Clips an infinite line defined by two points to a bounding box.
 * Returns the two intersection points with the box edges.
 */
const clipLineToBox = (
	p1: Point,
	p2: Point,
	box: { minX: number; maxX: number; minY: number; maxY: number }
) => {
	const { minX, maxX, minY, maxY } = box
	const dx = p2.x - p1.x
	const dy = p2.y - p1.y
	const intersections: Point[] = []

	if (Math.abs(dx) > 1e-9) {
		const m = dy / dx
		const c = p1.y - m * p1.x
		// Check left edge
		let y = m * minX + c
		if (y >= minY && y <= maxY) intersections.push({ x: minX, y })
		// Check right edge
		y = m * maxX + c
		if (y >= minY && y <= maxY) intersections.push({ x: maxX, y })
	}

	if (Math.abs(dy) > 1e-9) {
		const mInv = dx / dy
		const c = p1.x - mInv * p1.y
		// Check bottom edge
		let x = mInv * minY + c
		if (x >= minX && x <= maxX) intersections.push({ x, y: minY })
		// Check top edge
		x = mInv * maxY + c
		if (x >= minX && x <= maxX) intersections.push({ x, y: maxY })
	}

	return intersections.length >= 2
		? { p1: intersections[0], p2: intersections[1] }
		: null
}

/**
 * Generates an SVG diagram of lines on a grid, with optional perpendicular indicators.
 */
export const generateLineDiagram: WidgetGenerator<
	typeof LineDiagramPropsSchema
> = async (props) => {
	const { width, height, gridBounds, lines, perpendicularIndicators } = props

	if (
		gridBounds.minX >= gridBounds.maxX ||
		gridBounds.minY >= gridBounds.maxY
	) {
		logger.error("invalid grid bounds for line diagram", { gridBounds })
		throw errors.wrap(
			ErrInvalidBounds,
			"min must be less than max for grid bounds"
		)
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const gridWidth = gridBounds.maxX - gridBounds.minX
	const gridHeight = gridBounds.maxY - gridBounds.minY
	const chartWidth = width - 2 * PADDING
	const chartHeight = height - 2 * PADDING

	const scaleX = chartWidth / gridWidth
	const scaleY = chartHeight / gridHeight

	const toSvgX = (gridX: number) => PADDING + (gridX - gridBounds.minX) * scaleX
	const toSvgY = (gridY: number) => PADDING + (gridBounds.maxY - gridY) * scaleY // Y is inverted in SVG

	// Draw Grid
	for (
		let y = Math.ceil(gridBounds.minY);
		y <= Math.floor(gridBounds.maxY);
		y++
	) {
		canvas.drawLine(
			toSvgX(gridBounds.minX),
			toSvgY(y),
			toSvgX(gridBounds.maxX),
			toSvgY(y),
			{
				stroke: theme.colors.gridMinor,
				strokeWidth: 1
			}
		)
	}
	for (
		let x = Math.ceil(gridBounds.minX);
		x <= Math.floor(gridBounds.maxX);
		x++
	) {
		canvas.drawLine(
			toSvgX(x),
			toSvgY(gridBounds.minY),
			toSvgX(x),
			toSvgY(gridBounds.maxY),
			{
				stroke: theme.colors.gridMinor,
				strokeWidth: 1
			}
		)
	}

	// Draw Lines and Labels
	const lineMap = new Map(lines.map((line) => [line.id, line]))

	// Keep track of placed text labels to avoid text-to-text collisions
	const placedLabels: Array<{
		x: number
		y: number
		width: number
		height: number
		padding: number
	}> = []

	// Draw Perpendicular Indicators UNDER the lines for better aesthetics
	for (const indicator of perpendicularIndicators) {
		const line1 = lineMap.get(indicator.line1Id)
		const line2 = lineMap.get(indicator.line2Id)
		if (!line1 || !line2) continue

		const v1 = { x: line1.to.x - line1.from.x, y: line1.to.y - line1.from.y }
		const v2 = { x: line2.to.x - line2.from.x, y: line2.to.y - line2.from.y }
		const dotProduct = v1.x * v2.x + v1.y * v2.y
		if (Math.abs(dotProduct) > 1e-6) {
			logger.error("lines are not perpendicular", {
				line1Id: line1.id,
				line2Id: line2.id,
				dotProduct
			})
			throw errors.wrap(
				ErrLineNotPerpendicular,
				`Lines '${line1.id}' and '${line2.id}' are not perpendicular.`
			)
		}

		const intersection = findLineIntersection(
			line1.from,
			line1.to,
			line2.from,
			line2.to
		)
		if (!intersection) continue

		const svgIntersection = {
			x: toSvgX(intersection.x),
			y: toSvgY(intersection.y)
		}

		const len1 = Math.hypot(v1.x, v1.y)
		const u1 = { x: v1.x / len1, y: v1.y / len1 }
		const len2 = Math.hypot(v2.x, v2.y)
		const u2 = { x: v2.x / len2, y: v2.y / len2 }

		const svg_u1 = { x: u1.x * scaleX, y: -u1.y * scaleY }
		const svg_u2 = { x: u2.x * scaleX, y: -u2.y * scaleY }

		// Normalize screen vectors so size is in pixels
		const u1LenPx = Math.hypot(svg_u1.x, svg_u1.y) || 1
		const u2LenPx = Math.hypot(svg_u2.x, svg_u2.y) || 1
		const n1 = { x: svg_u1.x / u1LenPx, y: svg_u1.y / u1LenPx }
		const n2 = { x: svg_u2.x / u2LenPx, y: svg_u2.y / u2LenPx }
		const markerSize = indicator.size

		const p0 = { x: svgIntersection.x, y: svgIntersection.y }
		const p1 = { x: p0.x + n1.x * markerSize, y: p0.y + n1.y * markerSize }
		const p2 = { x: p1.x + n2.x * markerSize, y: p1.y + n2.y * markerSize }
		const p3 = { x: p0.x + n2.x * markerSize, y: p0.y + n2.y * markerSize }

		const path = new Path2D()
			.moveTo(p0.x, p0.y)
			.lineTo(p1.x, p1.y)
			.lineTo(p2.x, p2.y)
			.lineTo(p3.x, p3.y)
			.closePath()
		canvas.drawPath(path, {
			fill: "none",
			stroke: indicator.color,
			strokeWidth: theme.stroke.width.thick
		})
	}
	// Keep a list of screen-space segments for collision checks when placing labels
	const screenSegments: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = []
	for (const line of lines) {
		const extendedPoints = clipLineToBox(line.from, line.to, gridBounds)
		if (!extendedPoints) continue

		const { p1, p2 } = extendedPoints
		const svgP1 = { x: toSvgX(p1.x), y: toSvgY(p1.y) }
		const svgP2 = { x: toSvgX(p2.x), y: toSvgY(p2.y) }

		const dash = line.style === "dotted" ? "5 5" : undefined

		// Define a per-color arrowhead so marker fill matches the line color, and make it slightly smaller
		const markerId = `arrow-head-${line.color.replace(/[^a-zA-Z0-9]/g, "_")}`
		canvas.addDef(
			`<marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${line.color}"/></marker>`
		)

		canvas.drawLine(svgP1.x, svgP1.y, svgP2.x, svgP2.y, {
			stroke: line.color,
			strokeWidth: 2.5,
			markerStart: `url(#${markerId})`,
			markerEnd: `url(#${markerId})`,
			dash
		})

		// Track for collision checks
		screenSegments.push({ a: svgP1, b: svgP2 })

		if (line.label) {
			let t = 0.5
			if (line.labelPosition === "start") t = 0.1
			if (line.labelPosition === "end") t = 0.9

			const labelPoint = {
				x: p1.x + t * (p2.x - p1.x),
				y: p1.y + t * (p2.y - p1.y)
			}

			// Compute screen-space basis for this line
			const sx = toSvgX(labelPoint.x)
			const sy = toSvgY(labelPoint.y)
			const sdx = svgP2.x - svgP1.x
			const sdy = svgP2.y - svgP1.y
			const slen = Math.hypot(sdx, sdy) || 1
			const nx = -sdy / slen
			const ny = sdx / slen
			const tx = sdx / slen
			const ty = sdy / slen

			// Start offset from the line, then slide tangentially if the label collides
			const baseOffset = 20
			let lx = sx + nx * baseOffset
			let ly = sy + ny * baseOffset

			const fontPx = 18
			const dims = estimateWrappedTextDimensions(
				line.label,
				Number.POSITIVE_INFINITY,
				fontPx,
				1.2
			)
			const halfW = dims.maxWidth / 2
			const halfH = dims.height / 2

			function rectIntersectsAnySegmentOrText(rect: {
				x: number
				y: number
				width: number
				height: number
				pad?: number
			}): boolean {
				const pad = rect.pad ?? 0
				const rx = rect.x - pad
				const ry = rect.y - pad
				const rw = rect.width + 2 * pad
				const rh = rect.height + 2 * pad

				// Check for text-to-text collisions first
				for (const placedLabel of placedLabels) {
					const labelPad = placedLabel.padding
					const lx = placedLabel.x - labelPad
					const ly = placedLabel.y - labelPad
					const lw = placedLabel.width + 2 * labelPad
					const lh = placedLabel.height + 2 * labelPad

					// Check if rectangles overlap (AABB collision)
					if (rx < lx + lw && rx + rw > lx && ry < ly + lh && ry + rh > ly) {
						return true
					}
				}

				// Check for text-to-line collisions
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
				): boolean => {
					const o1 = orient(p1, p2, p3)
					const o2 = orient(p1, p2, p4)
					const o3 = orient(p3, p4, p1)
					const o4 = orient(p3, p4, p2)
					return o1 !== o2 && o3 !== o4
				}
				for (const seg of screenSegments) {
					if (
						segmentsIntersect(seg.a, seg.b, r1, r2) ||
						segmentsIntersect(seg.a, seg.b, r2, r3) ||
						segmentsIntersect(seg.a, seg.b, r3, r4) ||
						segmentsIntersect(seg.a, seg.b, r4, r1)
					) {
						return true
					}
				}
				return false
			}

			function placeTangential(mult: number) {
				let px = lx
				let py = ly
				let it = 0
				const maxIt = 80
				const step = 3
				while (
					rectIntersectsAnySegmentOrText({
						x: px - halfW,
						y: py - halfH,
						width: dims.maxWidth,
						height: dims.height,
						pad: 5
					}) &&
					it < maxIt
				) {
					px += mult * step * tx
					py += mult * step * ty
					it++
				}
				return { x: px, y: py, it }
			}

			const cw = placeTangential(1)
			const ccw = placeTangential(-1)
			const chosen = ccw.it < cw.it ? ccw : cw

			canvas.drawText({
				text: line.label,
				x: chosen.x,
				y: chosen.y,
				fill: line.color,
				fontPx: fontPx,
				fontWeight: theme.font.weight.bold,
				anchor: "middle",
				dominantBaseline: "middle"
			})

			// Record this label's position to prevent future text-to-text collisions
			// Use a larger padding to ensure better separation between labels
			const labelPadding = 8
			placedLabels.push({
				x: chosen.x - halfW,
				y: chosen.y - halfH,
				width: dims.maxWidth,
				height: dims.height,
				padding: labelPadding
			})
		}
	}

	// (Markers already drawn under the lines above)

	// no global arrowhead; per-line colored markers are defined above

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
