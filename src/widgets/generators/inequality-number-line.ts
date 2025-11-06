import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const ErrInvalidRange = errors.new("min must be less than max")

function toOpaqueHex(color: string): string {
	const hex = color.toLowerCase()
	// #RRGGBBAA -> #RRGGBB (strip alpha)
	if (hex.length === 9) {
		return hex.slice(0, 7)
	}
	// #RGB -> #RRGGBB (expand)
	if (hex.length === 4) {
		const r = hex[1]
		const g = hex[2]
		const b = hex[3]
		return `#${r}${r}${g}${g}${b}${b}`
	}
	// #RRGGBB stays as-is
	return hex
}

function createBoundarySchema() {
	return z
		.object({
			value: z
				.number()
				.describe(
					"The numerical value where this boundary occurs on the number line (e.g., 3, -2, 5.5, 0). Must be within min/max range."
				),
			type: z
				.enum(["open", "closed"])
				.describe(
					"Boundary type. 'open' (exclusive) shows hollow circle for < or >, 'closed' (inclusive) shows filled circle for ≤ or ≥."
				)
		})
		.strict()
}

function createStartSchema() {
	return z.discriminatedUnion("type", [
		z
			.object({
				type: z
					.literal("bounded")
					.describe("The range has a defined starting point."),
				at: createBoundarySchema().describe(
					"The starting boundary with its value and open/closed type."
				)
			})
			.strict(),
		z
			.object({
				type: z
					.literal("unbounded")
					.describe(
						"The range extends infinitely to the left (negative infinity)."
					)
			})
			.strict()
	])
}

function createEndSchema() {
	return z.discriminatedUnion("type", [
		z
			.object({
				type: z
					.literal("bounded")
					.describe("The range has a defined ending point."),
				at: createBoundarySchema().describe(
					"The ending boundary with its value and open/closed type."
				)
			})
			.strict(),
		z
			.object({
				type: z
					.literal("unbounded")
					.describe(
						"The range extends infinitely to the right (positive infinity)."
					)
			})
			.strict()
	])
}

function createRangeSchema() {
	return z
		.object({
			start: createStartSchema().describe(
				"The left boundary of the shaded region. Can be bounded (specific value) or unbounded (extends to -∞)."
			),
			end: createEndSchema().describe(
				"The right boundary of the shaded region. Can be bounded (specific value) or unbounded (extends to +∞)."
			),
			color: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.describe(
					"Hex-only color for the shaded region (e.g., '#4287F54D' for 30% alpha, '#FFE5B4'). Use translucency via 8-digit hex for overlapping ranges."
				)
		})
		.strict()
}

export const InequalityNumberLinePropsSchema = z
	.object({
		type: z
			.literal("inequalityNumberLine")
			.describe(
				"Identifies this as an inequality number line for visualizing solution sets."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		min: z
			.number()
			.describe(
				"Minimum value shown on the number line (e.g., -10, -5, 0). Should be less than smallest relevant boundary."
			),
		max: z
			.number()
			.describe(
				"Maximum value shown on the number line (e.g., 10, 20, 15). Should be greater than largest relevant boundary."
			),
		tickInterval: z
			.number()
			.positive()
			.describe(
				"Spacing between tick marks (e.g., 1, 2, 0.5). Should evenly divide the range for clean appearance."
			),
		ranges: z
			.array(createRangeSchema())
			.describe(
				"Solution ranges to shade on the number line. Can overlap for compound inequalities. Empty array shows blank number line. Order doesn't affect display."
			)
	})
	.strict()
	.describe(
		"Creates number lines showing solution sets for inequalities with shaded regions, open/closed endpoints, and arrows for unbounded intervals. Essential for teaching inequality notation (x < 5, x ≥ -2), compound inequalities (3 < x ≤ 7), and solution set visualization. Supports multiple overlapping ranges."
	)

export type InequalityNumberLineProps = z.infer<
	typeof InequalityNumberLinePropsSchema
>

/**
 * Generates an SVG number line to graph the solution set of single or compound inequalities,
 * using open/closed circles and shaded regions to represent the solution.
 */
export const generateInequalityNumberLine: WidgetGenerator<
	typeof InequalityNumberLinePropsSchema
> = async (data) => {
	const { width, height, min, max, tickInterval, ranges } = data
	const chartWidth = width - 2 * PADDING
	const yPos = height / 2

	if (min >= max) {
		logger.error("inequality number line invalid range", { min, max })
		throw errors.wrap(
			ErrInvalidRange,
			`min (${min}) must be less than max (${max})`
		)
	}

	const scale = chartWidth / (max - min)
	const toSvgX = (val: number) => PADDING + (val - min) * scale

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Define markers for arrows
	canvas.addDef(
		`<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.colors.axis}"/></marker>`
	)

	// Add colored arrow markers for ranges (use opaque colors to avoid showing axis beneath)
	const uniqueColors = new Set(ranges.map((r) => toOpaqueHex(r.color)))
	for (const color of uniqueColors) {
		const colorId = color.replace(/[^a-zA-Z0-9]/g, "")
		canvas.addDef(
			`<marker id="arrow-${colorId}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${color}"/></marker>`
		)
	}

	// Axis and Ticks
	canvas.drawLine(PADDING, yPos, width - PADDING, yPos, {
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.base,
		markerStart: "url(#arrow)",
		markerEnd: "url(#arrow)"
	})

	for (let t = min; t <= max; t += tickInterval) {
		const x = toSvgX(t)
		// Match tick sizing with standard number line widget for visual consistency
		canvas.drawLine(x, yPos - 8, x, yPos + 8, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.base
		})
		canvas.drawText({
			x: x,
			y: yPos + 25,
			text: String(t),
			fill: theme.colors.axisLabel,
			anchor: "middle"
		})
	}

	for (const r of ranges) {
		const lineColor = toOpaqueHex(r.color)
		const startPos =
			r.start.type === "bounded" ? toSvgX(r.start.at.value) : PADDING
		const endPos =
			r.end.type === "bounded" ? toSvgX(r.end.at.value) : width - PADDING
		const colorId = lineColor.replace(/[^a-zA-Z0-9]/g, "")

		// Add markers for unbounded cases
		let markerStart: string | undefined
		let markerEnd: string | undefined
		if (r.start.type === "unbounded") {
			markerStart = `url(#arrow-${colorId})`
		}
		if (r.end.type === "unbounded") {
			markerEnd = `url(#arrow-${colorId})`
		}

		canvas.drawLine(startPos, yPos, endPos, yPos, {
			stroke: lineColor,
			strokeWidth: theme.stroke.width.xxxthick,
			strokeLinecap: "butt",
			markerStart: markerStart,
			markerEnd: markerEnd
		})

		// Boundary circles
		if (r.start.type === "bounded") {
			const fill =
				r.start.at.type === "closed" ? lineColor : theme.colors.background
			canvas.drawCircle(startPos, yPos, 5, {
				fill: fill,
				stroke: lineColor,
				strokeWidth: theme.stroke.width.base
			})
		}
		if (r.end.type === "bounded") {
			const fill = r.end.at.type === "closed" ? lineColor : theme.colors.white
			canvas.drawCircle(endPos, yPos, 5, {
				fill: fill,
				stroke: lineColor,
				strokeWidth: theme.stroke.width.base
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
