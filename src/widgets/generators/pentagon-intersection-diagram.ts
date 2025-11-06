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

const KAArc = z
	.object({
		startX: z
			.number()
			.describe(
				"X-coordinate where the arc begins (e.g., 150, 200, 175.5). Usually on or near a line segment."
			),
		startY: z
			.number()
			.describe(
				"Y-coordinate where the arc begins (e.g., 100, 150, 125.5). Defines the arc's starting point."
			),
		rx: z
			.number()
			.describe(
				"Horizontal radius of the elliptical arc in pixels (e.g., 20, 30, 25). Controls arc width."
			),
		ry: z
			.number()
			.describe(
				"Vertical radius of the elliptical arc in pixels (e.g., 20, 30, 25). Often equals rx for circular arcs."
			),
		xAxisRotation: z
			.number()
			.describe(
				"Rotation of the ellipse in degrees (e.g., 0, 45, -30). Usually 0 for simple angle arcs."
			),
		largeArcFlag: z
			.number()
			.describe(
				"SVG arc flag: 0 for small arc (<180°), 1 for large arc (>180°). Typically 0 for angle markers."
			),
		sweepFlag: z
			.number()
			.describe(
				"SVG sweep direction: 0 for counter-clockwise, 1 for clockwise. Determines arc direction."
			),
		endDeltaX: z
			.number()
			.describe(
				"X-offset from start to end point (e.g., 15, -10, 20). End point = (startX + endDeltaX, startY + endDeltaY)."
			),
		endDeltaY: z
			.number()
			.describe(
				"Y-offset from start to end point (e.g., 10, -15, 5). Defines where the arc ends relative to start."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label for the angle (e.g., '72°', '36°', 'α', null). Null shows arc without label. Positioned near the arc."
			),
		color: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
			)
			.describe(
				"CSS color for the arc and its label (e.g., '#FF6B6B' for red, 'blue', 'green'). Different colors distinguish angle types."
			)
	})
	.strict()

const Point = z
	.object({
		id: z
			.string()
			.describe(
				"Unique identifier for this vertex (e.g., 'A', 'B', 'C', 'D', 'E'). Used to reference in intersection lines. Must be unique."
			),
		x: z
			.number()
			.describe(
				"X-coordinate of the vertex in SVG space (e.g., 200, 150, 250). Pentagon will be centered in the diagram."
			),
		y: z
			.number()
			.describe(
				"Y-coordinate of the vertex in SVG space (e.g., 50, 100, 200). Positive y is downward in SVG."
			)
	})
	.strict()

export const PentagonIntersectionDiagramPropsSchema = z
	.object({
		type: z
			.literal("pentagonIntersectionDiagram")
			.describe(
				"Identifies this as a pentagon intersection diagram showing internal angle relationships."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		pentagonPoints: z
			.array(Point)
			.describe(
				"Exactly 5 points defining the pentagon vertices in order. Connect sequentially to form the pentagon. Generator validates count = 5."
			),
		intersectionLines: z
			.array(
				z
					.object({
						from: z
							.string()
							.describe(
								"ID of the starting vertex for this diagonal. Must match a point.id in pentagonPoints (e.g., 'A', 'B')."
							),
						to: z
							.string()
							.describe(
								"ID of the ending vertex for this diagonal. Must match a point.id in pentagonPoints (e.g., 'C', 'D')."
							)
					})
					.strict()
			)
			.describe(
				"Diagonal lines connecting non-adjacent vertices. Creates the internal star pattern. Empty array shows just the pentagon outline."
			),
		khanArcs: z
			.array(KAArc)
			.describe(
				"Angle arcs using Khan Academy's style. Empty array means no angle markers. Uses SVG elliptical arc notation for precise control."
			)
	})
	.strict()
	.describe(
		"Creates a regular pentagon with optional diagonal lines forming a pentagram (5-pointed star) pattern. Shows interior angles (108°) and star point angles (36°) with customizable arc markers. Essential for teaching polygon angle sums, symmetry, and golden ratio relationships in pentagons."
	)

export type PentagonIntersectionDiagramProps = z.infer<
	typeof PentagonIntersectionDiagramPropsSchema
>

export const generatePentagonIntersectionDiagram: WidgetGenerator<
	typeof PentagonIntersectionDiagramPropsSchema
> = async (data) => {
	// Validate exactly 5 pentagon points
	if (data.pentagonPoints.length !== 5) {
		logger.error("pentagon diagram invalid point count", {
			pointCount: data.pentagonPoints.length
		})
		throw errors.new(
			`pentagon must have exactly 5 points, got ${data.pentagonPoints.length}`
		)
	}

	const { width, height, pentagonPoints, intersectionLines, khanArcs } = data

	// Initialize extents
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Track intersection line endpoints
	for (const line of intersectionLines) {
		const fromPoint = pentagonPoints.find((p) => p.id === line.from)
		const toPoint = pentagonPoints.find((p) => p.id === line.to)

		if (!fromPoint) {
			logger.error("pentagon diagram point not found", {
				pointId: line.from,
				line
			})
			throw errors.new(`point not found: ${line.from}`)
		}
		if (!toPoint) {
			logger.error("pentagon diagram point not found", {
				pointId: line.to,
				line
			})
			throw errors.new(`point not found: ${line.to}`)
		}

		// Canvas automatically tracks extents
	}

	// Canvas automatically tracks arc extents
	for (const arc of khanArcs) {
		// Track label position if label exists
		if (arc.label) {
			// const arcCenterX = arc.startX + arc.endDeltaX / 2 // Unused variable
			// const arcCenterY = arc.startY + arc.endDeltaY / 2 // Unused variable
			// const perpX = -arc.endDeltaY / Math.sqrt(arc.endDeltaX * arc.endDeltaX + arc.endDeltaY * arc.endDeltaY) // Unused variable
			// const labelOffset = arc.rx + 8 // Unused variable
			// const labelX = arcCenterX + perpX * labelOffset // Unused variable
			// Canvas automatically tracks text extents
		}
	}

	// Draw pentagon perimeter using Canvas API
	for (let i = 0; i < pentagonPoints.length; i++) {
		const current = pentagonPoints[i]
		const next = pentagonPoints[(i + 1) % pentagonPoints.length]

		if (!current || !next) {
			logger.error("pentagon diagram missing pentagon point", {
				index: i,
				current,
				next
			})
			throw errors.new(`pentagon point missing at index ${i}`)
		}

		canvas.drawLine(current.x, current.y, next.x, next.y, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})
	}

	// Draw intersection lines
	for (const line of intersectionLines) {
		const fromPoint = pentagonPoints.find((p) => p.id === line.from)
		const toPoint = pentagonPoints.find((p) => p.id === line.to)

		if (!fromPoint || !toPoint) {
			// Already validated above
			continue
		}

		canvas.drawLine(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})
	}

	// Draw Khan Academy style arcs using exact SVG arc parameters
	for (const arc of khanArcs) {
		// Create the exact SVG path using Khan Academy's arc format
		const endX = arc.startX + arc.endDeltaX
		const endY = arc.startY + arc.endDeltaY
		const arcPath = new Path2D()
			.moveTo(arc.startX, arc.startY)
			.arcTo(
				arc.rx,
				arc.ry,
				arc.xAxisRotation,
				arc.largeArcFlag ? 1 : 0,
				arc.sweepFlag ? 1 : 0,
				endX,
				endY
			)
		canvas.drawPath(arcPath, {
			fill: "none",
			stroke: arc.color,
			strokeWidth: theme.stroke.width.xthick
		})

		// Calculate label position at the center of the arc but just outside its edge
		// Find the center point of the arc path
		const arcCenterX = arc.startX + arc.endDeltaX / 2
		const arcCenterY = arc.startY + arc.endDeltaY / 2

		// Calculate the perpendicular direction outward from the arc
		// This is perpendicular to the line from start to end of arc
		const perpX =
			-arc.endDeltaY /
			Math.sqrt(arc.endDeltaX * arc.endDeltaX + arc.endDeltaY * arc.endDeltaY)
		const perpY =
			arc.endDeltaX /
			Math.sqrt(arc.endDeltaX * arc.endDeltaX + arc.endDeltaY * arc.endDeltaY)

		// Position label just outside the arc edge (radius + small offset) if label exists
		if (arc.label) {
			const labelOffset = arc.rx + 8 // Arc radius plus small gap
			const labelX = arcCenterX + perpX * labelOffset
			const labelY = arcCenterY + perpY * labelOffset

			canvas.drawText({
				x: labelX,
				y: labelY,
				text: arc.label,
				fill: theme.colors.black,
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx: theme.font.size.medium
			})
		}
	}

	// Draw pentagon points
	for (const point of pentagonPoints) {
		canvas.drawCircle(point.x, point.y, 4, { fill: theme.colors.black })
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
