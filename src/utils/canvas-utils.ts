import * as logger from "@superbuilders/slog"
import { z } from "zod"
import { CSS_COLOR_PATTERN } from "@/utils/css-color"
import { abbreviateMonth } from "@/utils/labels"
import type { Canvas } from "@/utils/layout"
import { estimateWrappedTextDimensions } from "@/utils/text"
import { theme } from "@/utils/theme"

// --- START: Moved Zod Schema Definitions ---
// These schemas were previously in coordinate-plane-base.ts and are now homed here.

// ID patterns for graph primitives
const LINE_ID = /^line_[A-Za-z0-9_]+$/
const POLYLINE_ID = /^polyline_[A-Za-z0-9_]+$/

// Factory function for axis schema to prevent $ref generation
export const createAxisOptionsSchema = () =>
	z
		.object({
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
				.describe(
					'The text title for the axis (e.g., "Number of Days"). Null hides the label.'
				),
			min: z.number().describe("The minimum value displayed on the axis."),
			max: z.number().describe("The maximum value displayed on the axis."),
			tickInterval: z
				.number()
				.describe(
					"The numeric interval between labeled tick marks on the axis."
				),
			showGridLines: z
				.boolean()
				.describe("If true, display grid lines for this axis.")
		})
		.strict()

export const AxisOptionsSchema = createAxisOptionsSchema()
export type AxisOptions = z.infer<typeof AxisOptionsSchema>

// Factory function for point schema to prevent $ref generation
export const createPlotPointSchema = () =>
	z
		.object({
			id: z
				.string()
				.describe(
					"A unique identifier for this point, used to reference it when creating polygons."
				),
			x: z
				.number()
				.describe("The value of the point on the horizontal (X) axis."),
			y: z
				.number()
				.describe("The value of the point on the vertical (Y) axis."),
			label: z
				.string()
				.describe(
					'A text label to display near the point (e.g., "A", "(m, n)").'
				),
			style: z
				.enum(["open", "closed"])
				.describe("Visual style for the point marker.")
		})
		.strict()

export const PlotPointSchema = createPlotPointSchema()
export type PlotPoint = z.infer<typeof PlotPointSchema>

// Factory functions for line equation schemas to prevent $ref generation
export const createSlopeInterceptLineSchema = () =>
	z
		.object({
			type: z
				.literal("slopeIntercept")
				.describe("Specifies a straight line in y = mx + b form."),
			slope: z.number().describe("The slope of the line (m)."),
			yIntercept: z
				.number()
				.describe("The y-value where the line crosses the Y-axis (b).")
		})
		.strict()

export const createStandardLineSchema = () =>
	z
		.object({
			type: z
				.literal("standard")
				.describe("Specifies a straight line in Ax + By = C form."),
			A: z.number().describe("The coefficient of x."),
			B: z.number().describe("The coefficient of y."),
			C: z.number().describe("The constant term.")
		})
		.strict()

export const createPointSlopeLineSchema = () =>
	z
		.object({
			type: z
				.literal("pointSlope")
				.describe("Specifies a straight line in point-slope form."),
			x1: z.number().describe("The x-coordinate of the known point."),
			y1: z.number().describe("The y-coordinate of the known point."),
			slope: z.number().describe("The slope of the line.")
		})
		.strict()

// Factory function for line equation union
export const createLineEquationSchema = () =>
	z.discriminatedUnion("type", [
		createSlopeInterceptLineSchema(),
		createStandardLineSchema(),
		createPointSlopeLineSchema()
	])

// Factory function for line schema
export const createLineSchema = () =>
	z
		.object({
			id: z
				.string()
				.regex(LINE_ID, "invalid line id; must match ^line_[A-Za-z0-9_]+$")
				.describe('A unique identifier for the line (e.g., "line_p").'),
			equation: createLineEquationSchema().describe(
				"The mathematical definition of the line."
			),
			color: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
				)
				.describe(
					'The color of the line, as a CSS color string (e.g., "red", "#FF0000").'
				),
			style: z.enum(["solid", "dashed"]).describe("The style of the line."),
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
				.describe(
					"Optional text label to place near the rendered line. Use null for no label."
				)
		})
		.strict()

export const LineSchema = createLineSchema()
export type Line = z.infer<typeof LineSchema>

// Factory function for polygon schema
export const createPolygonSchema = () =>
	z
		.object({
			vertices: z
				.array(z.string())
				.min(2)
				.describe(
					"An array of point `id` strings, in the order they should be connected. Requires at least 2 points for a line, 3 for a polygon."
				),
			isClosed: z
				.boolean()
				.describe(
					"If true, connects the last vertex to the first to form a closed shape. If false, renders an open polyline."
				),
			fillColor: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
				)
				.describe(
					"The fill color of the polygon. MUST include transparency/opacity (e.g., #11accd26, rgba(17,172,205,0.15)). Use 8-digit hex (#RRGGBBAA) or rgba() with alpha < 1. Solid colors without transparency will obscure grid lines. Only applies if isClosed is true."
				),
			strokeColor: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
				)
				.describe("The border color of the polygon."),
			label: z.string().describe("A label for the polygon itself.")
		})
		.strict()

export const PolygonSchema = createPolygonSchema()
export type Polygon = z.infer<typeof PolygonSchema>

// Factory function for distance schema
export const createDistanceSchema = () =>
	z
		.object({
			pointId1: z.string().describe("The ID of the first point."),
			pointId2: z.string().describe("The ID of the second point."),
			showLegs: z
				.boolean()
				.describe(
					"If true, draws the 'rise' and 'run' legs of the right triangle."
				),
			showLegLabels: z
				.boolean()
				.describe("If true, labels the legs with their lengths."),
			hypotenuseLabel: z
				.string()
				.describe("A label for the hypotenuse (the distance line)."),
			color: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
				)
				.describe("The color of the distance lines."),
			style: z
				.enum(["solid", "dashed"])
				.describe("The style of the distance lines.")
		})
		.strict()

export const DistanceSchema = createDistanceSchema()
export type Distance = z.infer<typeof DistanceSchema>

// Factory function for polyline schema
export const createPolylineSchema = () =>
	z.discriminatedUnion("type", [
		z
			.object({
				type: z
					.literal("points")
					.describe("Indicates this polyline is defined by explicit points."),
				id: z
					.string()
					.regex(
						POLYLINE_ID,
						"invalid polyline id; must match ^polyline_[A-Za-z0-9_]+$"
					)
					.describe(
						"A unique identifier for this polyline (e.g., 'polyline_motion')."
					),
				points: z
					.array(z.object({ x: z.number(), y: z.number() }))
					.describe("An array of {x, y} points to connect in order."),
				color: z
					.string()
					.regex(
						CSS_COLOR_PATTERN,
						"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
					)
					.describe("The color of the polyline."),
				style: z
					.enum(["solid", "dashed"])
					.describe("The style of the polyline."),
				label: z
					.string()
					.nullable()
					.transform((val) =>
						val === "null" || val === "NULL" || val === "" ? null : val
					)
					.describe(
						"Optional text label to place near the rendered polyline. Use null for no label."
					)
			})
			.strict(),
		z
			.object({
				type: z
					.literal("function")
					.describe(
						"Indicates this polyline is defined by a polynomial function."
					),
				id: z
					.string()
					.regex(
						POLYLINE_ID,
						"invalid polyline id; must match ^polyline_[A-Za-z0-9_]+$"
					)
					.describe(
						"A unique identifier for this polyline (e.g., 'polyline_motion')."
					),
				coefficients: z
					.array(z.number())
					.min(1, "must have at least one coefficient")
					.describe(
						"Polynomial coefficients in descending order of powers. E.g., [4, 3, 2, 1, 0] represents 4x⁴ + 3x³ + 2x² + 1x + 0."
					),
				xRange: z
					.object({
						min: z
							.number()
							.describe("Minimum x value for function evaluation."),
						max: z.number().describe("Maximum x value for function evaluation.")
					})
					.describe(
						"The x-range over which to evaluate and plot the function."
					),
				resolution: z
					.number()
					.int()
					.min(10, "resolution must be at least 10 points")
					.default(100)
					.describe(
						"Number of points to generate when plotting the function (default: 100)."
					),
				color: z
					.string()
					.regex(
						CSS_COLOR_PATTERN,
						"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
					)
					.describe("The color of the polyline."),
				style: z
					.enum(["solid", "dashed"])
					.describe("The style of the polyline."),
				label: z
					.string()
					.nullable()
					.transform((val) =>
						val === "null" || val === "NULL" || val === "" ? null : val
					)
					.describe(
						"Optional text label to place near the rendered polyline. Use null for no label."
					)
			})
			.strict()
	])

export const PolylineSchema = createPolylineSchema()
export type Polyline = z.infer<typeof PolylineSchema>

/**
 * Utility to render points using Canvas API.
 */
export function renderPoints(
	points: PlotPoint[],
	toSvgX: (v: number) => number,
	toSvgY: (v: number) => number,
	canvas: Canvas
): void {
	// The Zod schema ensures `points` is an array, so `if (!points)` is not necessary.
	for (const p of points) {
		const px = toSvgX(p.x)
		const py = toSvgY(p.y)
		const pointColor = theme.colors.black
		const fill = p.style === "open" ? theme.colors.white : pointColor

		canvas.drawCircle(px, py, theme.geometry.pointRadius.base, {
			fill,
			stroke: pointColor,
			strokeWidth: theme.stroke.width.base
		})

		canvas.drawText({
			x: px + 6,
			y: py - 6,
			text: abbreviateMonth(p.label),
			fill: theme.colors.text
		})
	}
}

/**
 * Utility to render lines with support for all equation types using Canvas API.
 */
export function renderLines(
	lines: Line[],
	xAxis: AxisOptions,
	yAxis: AxisOptions,
	toSvgX: (v: number) => number,
	toSvgY: (v: number) => number,
	canvas: Canvas
): void {
	if (!lines) return

	// Compute chart bounds for label placement constraints
	const chartLeft = Math.min(toSvgX(xAxis.min), toSvgX(xAxis.max))
	const chartRight = Math.max(toSvgX(xAxis.min), toSvgX(xAxis.max))
	const chartTop = Math.min(toSvgY(yAxis.min), toSvgY(yAxis.max))
	const chartBottom = Math.max(toSvgY(yAxis.min), toSvgY(yAxis.max))

	// Axes segments to avoid (if visible)
	const avoidAxes: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = []
	if (yAxis.min <= 0 && 0 <= yAxis.max) {
		const y0 = toSvgY(0)
		avoidAxes.push({ a: { x: chartLeft, y: y0 }, b: { x: chartRight, y: y0 } })
	}
	if (xAxis.min <= 0 && 0 <= xAxis.max) {
		const x0 = toSvgX(0)
		avoidAxes.push({ a: { x: x0, y: chartTop }, b: { x: x0, y: chartBottom } })
	}

	for (const l of lines) {
		let y1: number
		let y2: number
		let isVertical = false
		let verticalX: number | null = null

		if (l.equation.type === "slopeIntercept") {
			const { slope, yIntercept } = l.equation
			y1 = slope * xAxis.min + yIntercept
			y2 = slope * xAxis.max + yIntercept
		} else if (l.equation.type === "standard") {
			const { A, B, C } = l.equation
			if (B === 0) {
				isVertical = true
				verticalX = C / A
				y1 = yAxis.min
				y2 = yAxis.max
			} else {
				y1 = (C - A * xAxis.min) / B
				y2 = (C - A * xAxis.max) / B
			}
		} else {
			const { x1, y1: yPoint, slope } = l.equation
			y1 = slope * (xAxis.min - x1) + yPoint
			y2 = slope * (xAxis.max - x1) + yPoint
		}

		const dash = l.style === "dashed" ? "5 3" : undefined
		const x1Svg =
			isVertical && verticalX !== null ? toSvgX(verticalX) : toSvgX(xAxis.min)
		const x2Svg =
			isVertical && verticalX !== null ? toSvgX(verticalX) : toSvgX(xAxis.max)
		const y1Svg = toSvgY(y1)
		const y2Svg = toSvgY(y2)

		canvas.drawInClippedRegion((clippedCanvas) => {
			clippedCanvas.drawLine(x1Svg, y1Svg, x2Svg, y2Svg, {
				stroke: l.color,
				strokeWidth: theme.stroke.width.thick,
				dash: dash
			})
		})

		// Auto place label when provided (non-null/non-empty)
		if (l.label !== null) {
			const text = l.label.trim()
			if (text.length > 0) {
				const seg = { a: { x: x1Svg, y: y1Svg }, b: { x: x2Svg, y: y2Svg } }
				const dx = seg.b.x - seg.a.x
				const dy = seg.b.y - seg.a.y
				const len = Math.hypot(dx, dy) || 1
				const tx = dx / len
				const ty = dy / len
				const nx = -ty
				const ny = tx

				const midAnchor = {
					x: (seg.a.x + seg.b.x) / 2,
					y: (seg.a.y + seg.b.y) / 2
				}
				const normalOffset = 14

				const fontPx = theme.font.size.medium
				const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
					text,
					Number.POSITIVE_INFINITY,
					fontPx,
					1.2
				)
				const halfW = w / 2
				const halfH = h / 2

				const avoid = [...avoidAxes, seg]

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
						lft >= chartLeft &&
						rgt <= chartRight &&
						top >= chartTop &&
						bot <= chartBottom
					)
				}
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
					rect: { x: number; y: number; width: number; height: number },
					s: { a: { x: number; y: number }; b: { x: number; y: number } }
				) {
					const r = {
						x1: rect.x,
						y1: rect.y,
						x2: rect.x + rect.width,
						y2: rect.y + rect.height
					}
					const edges = [
						{ a: { x: r.x1, y: r.y1 }, b: { x: r.x2, y: r.y1 } },
						{ a: { x: r.x2, y: r.y1 }, b: { x: r.x2, y: r.y2 } },
						{ a: { x: r.x2, y: r.y2 }, b: { x: r.x1, y: r.y2 } },
						{ a: { x: r.x1, y: r.y2 }, b: { x: r.x1, y: r.y1 } }
					]
					return edges.some((e) => intersects(e.a, e.b, s.a, s.b))
				}
				function placeFromBase(
					base: { x: number; y: number },
					direction: 1 | -1
				) {
					const step = 6
					const maxIt = 80
					for (let i = 0; i < maxIt; i++) {
						const cx = base.x + direction * tx * i * step
						const cy = base.y + direction * ty * i * step
						const rect = { x: cx - halfW, y: cy - halfH, width: w, height: h }
						if (!withinBounds(rect)) continue
						let hit = false
						for (const s of avoid) {
							if (rectIntersectsSegment(rect, s)) {
								hit = true
								break
							}
						}
						if (!hit) return { x: cx, y: cy, i }
					}
					return null
				}

				// Candidate anchors: near far-from-y-axis endpoint, then midpoint
				const yAxisVisible = xAxis.min <= 0 && 0 <= xAxis.max
				const x0 = yAxisVisible ? toSvgX(0) : 0
				const distA = Math.abs(seg.a.x - x0)
				const distB = Math.abs(seg.b.x - x0)
				const far = distA >= distB ? seg.a : seg.b
				const near = distA >= distB ? seg.b : seg.a
				// Anchor 15% inward from the far endpoint to avoid edges
				const fracInward = 0.15
				const farAnchor = {
					x: far.x + (near.x - far.x) * fracInward,
					y: far.y + (near.y - far.y) * fracInward
				}
				const anchors = [farAnchor, midAnchor]

				let chosen: { x: number; y: number; i: number } | null = null
				let bestDistFromYAxis = Number.NEGATIVE_INFINITY
				for (const a of anchors) {
					const base = {
						x: a.x + nx * normalOffset,
						y: a.y + ny * normalOffset
					}
					// Prefer direction that increases distance from y-axis
					let preferredDir: 1 | -1 = 1
					if (yAxisVisible) {
						const signFromAxis = a.x - x0 >= 0 ? 1 : -1
						const signTx = tx >= 0 ? 1 : -1
						preferredDir = signFromAxis * signTx > 0 ? 1 : -1
					}
					const posPreferred = placeFromBase(base, preferredDir)
					const otherDir: 1 | -1 = preferredDir === 1 ? -1 : 1
					const posOther = placeFromBase(base, otherDir)
					let cand: { x: number; y: number; i: number } | null
					if (posPreferred && posOther) {
						cand = posPreferred.i <= posOther.i ? posPreferred : posOther
					} else {
						cand = posPreferred ?? posOther
					}
					if (!cand) continue

					// Enforce minimum horizontal gap from y-axis
					if (yAxisVisible) {
						const minGapPx = 14
						if (Math.abs(cand.x - x0) < halfW + minGapPx) {
							const step = 6
							const maxExtra = 120
							let extra = 0
							while (extra <= maxExtra) {
								const cx = cand.x + preferredDir * tx * step
								const cy = cand.y + preferredDir * ty * step
								const rect = {
									x: cx - halfW,
									y: cy - halfH,
									width: w,
									height: h
								}
								const within = withinBounds(rect)
								let hit = false
								for (const s of avoid) {
									if (rectIntersectsSegment(rect, s)) {
										hit = true
										break
									}
								}
								if (within && !hit && Math.abs(cx - x0) >= halfW + minGapPx) {
									cand = { x: cx, y: cy, i: cand.i }
									break
								}
								extra += step
							}
						}
					}

					const distFromYAxis = yAxisVisible
						? Math.abs(cand.x - x0)
						: Number.POSITIVE_INFINITY
					if (distFromYAxis > bestDistFromYAxis) {
						bestDistFromYAxis = distFromYAxis
						chosen = cand
					}
				}
				if (!chosen) {
					// fallback: use the last valid anchor position we found
					logger.warn("no optimal label placement found, using fallback", {
						type: "line",
						id: l.id
					})
					if (anchors.length > 0) {
						const fallbackAnchor = anchors[anchors.length - 1]
						chosen = {
							x: fallbackAnchor.x + nx * normalOffset,
							y: fallbackAnchor.y + ny * normalOffset,
							i: 0
						}
					} else {
						// ultimate fallback: use line midpoint
						const midX = (x1Svg + x2Svg) / 2
						const midY = (y1Svg + y2Svg) / 2
						chosen = {
							x: midX + nx * normalOffset,
							y: midY + ny * normalOffset,
							i: 0
						}
					}
				}

				// Enforce a minimum horizontal gap from the y-axis if visible
				if (yAxisVisible) {
					const minGapPx = 14
					const gapOk = Math.abs(chosen.x - x0) >= halfW + minGapPx
					if (!gapOk) {
						const step = 6
						const maxExtra = 120
						let extra = 0
						// Choose nudge direction that increases distance from the y-axis
						let dir: 1 | -1 = 1
						if (yAxisVisible) {
							const chosenSide = chosen.x - x0 >= 0 ? 1 : -1
							const tangentSide = tx >= 0 ? 1 : -1
							dir = chosenSide * tangentSide > 0 ? 1 : -1
						}
						while (extra <= maxExtra) {
							const cx = chosen.x + dir * tx * step
							const cy = chosen.y + dir * ty * step
							const rect = { x: cx - halfW, y: cy - halfH, width: w, height: h }
							const within = withinBounds(rect)
							let hit = false
							for (const s of avoid) {
								if (rectIntersectsSegment(rect, s)) {
									hit = true
									break
								}
							}
							if (within && !hit && Math.abs(cx - x0) >= halfW + minGapPx) {
								chosen = { x: cx, y: cy, i: chosen.i }
								break
							}
							extra += step
						}
					}
				}

				canvas.drawText({
					x: chosen.x,
					y: chosen.y,
					text: abbreviateMonth(text),
					fill: l.color,
					anchor: "middle",
					dominantBaseline: "middle",
					fontPx,
					fontWeight: theme.font.weight.bold
				})
			}
		}
	}
}

/**
 * Helper function to ensure a fill color has proper opacity.
 * If the color is opaque (no alpha channel), adds a default semi-transparent alpha.
 */
function ensureFillOpacity(color: string): string {
	// Check if it's an 8-digit hex with alpha
	if (/^#[0-9a-fA-F]{8}$/.test(color)) {
		return color
	}

	// Check if it's a 6-digit hex (opaque) - add alpha
	if (/^#[0-9a-fA-F]{6}$/.test(color)) {
		return `${color}26` // Add ~15% opacity
	}

	// Check if it's a 3-digit hex (opaque) - expand and add alpha
	if (/^#[0-9a-fA-F]{3}$/.test(color)) {
		const expanded = color.replace(
			/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/,
			"#$1$1$2$2$3$3"
		)
		return `${expanded}26` // Add ~15% opacity
	}

	// Check if it's rgba with alpha
	if (/rgba?\s*\([^)]+\)/.test(color)) {
		// If it's rgb without alpha, convert to rgba
		if (/^rgb\s*\(/.test(color)) {
			return color.replace(/^rgb/, "rgba").replace(/\)$/, ", 0.15)")
		}
		// It's already rgba, return as is
		return color
	}

	// For hsla or other formats with alpha, return as is
	if (/hsla?\s*\([^)]+\)/.test(color)) {
		// If it's hsl without alpha, convert to hsla
		if (/^hsl\s*\(/.test(color)) {
			return color.replace(/^hsl/, "hsla").replace(/\)$/, ", 0.15)")
		}
		return color
	}

	// Default: return with rgba wrapper for safety
	logger.warn("unexpected fill color format, adding default opacity", { color })
	return "rgba(128, 128, 128, 0.15)"
}

/**
 * Utility to render polygons that reference points by ID using Canvas API.
 */
export function renderPolygons(
	polygons: Polygon[],
	pointMap: Map<string, PlotPoint>,
	toSvgX: (v: number) => number,
	toSvgY: (v: number) => number,
	canvas: Canvas
): void {
	if (!polygons) return

	canvas.drawInClippedRegion((clippedCanvas) => {
		for (const poly of polygons) {
			const polyPoints = poly.vertices
				.map((id) => {
					const pt = pointMap.get(id)
					return pt ? { x: toSvgX(pt.x), y: toSvgY(pt.y) } : null
				})
				.filter((pt): pt is { x: number; y: number } => pt !== null)

			if (polyPoints.length > 0) {
				if (poly.isClosed) {
					clippedCanvas.drawPolygon(polyPoints, {
						fill: ensureFillOpacity(poly.fillColor),
						stroke: poly.strokeColor,
						strokeWidth: theme.stroke.width.thick
					})
				} else {
					clippedCanvas.drawPolyline(polyPoints, {
						stroke: poly.strokeColor,
						strokeWidth: theme.stroke.width.thick
					})
				}

				const centroidX =
					polyPoints.reduce((sum, pt) => sum + pt.x, 0) / polyPoints.length
				const bottomY = Math.max(...polyPoints.map((pt) => pt.y))
				const labelX = centroidX
				const labelY = bottomY + 20

				clippedCanvas.drawText({
					x: labelX,
					y: labelY,
					text: abbreviateMonth(poly.label),
					anchor: "middle",
					fontPx: theme.font.size.medium,
					fontWeight: "500",
					fill: poly.strokeColor
				})
			}
		}
	})
}

/**
 * Utility to render distance visualizations between points using Canvas API.
 */
export function renderDistances(
	distances: Distance[],
	pointMap: Map<string, PlotPoint>,
	toSvgX: (v: number) => number,
	toSvgY: (v: number) => number,
	canvas: Canvas
): void {
	if (!distances) return

	for (const dist of distances) {
		const p1 = pointMap.get(dist.pointId1)
		const p2 = pointMap.get(dist.pointId2)
		if (!p1 || !p2) continue

		const p1Svg = { x: toSvgX(p1.x), y: toSvgY(p1.y) }
		const p2Svg = { x: toSvgX(p2.x), y: toSvgY(p2.y) }
		const cornerSvg = { x: toSvgX(p2.x), y: toSvgY(p1.y) }

		const dash = dist.style === "dashed" ? "4 3" : undefined

		// Hypotenuse
		canvas.drawLine(p1Svg.x, p1Svg.y, p2Svg.x, p2Svg.y, {
			stroke: dist.color,
			strokeWidth: theme.stroke.width.base,
			dash: dash
		})

		if (dist.showLegs) {
			// Horizontal and Vertical Legs
			canvas.drawLine(p1Svg.x, p1Svg.y, cornerSvg.x, cornerSvg.y, {
				stroke: dist.color,
				strokeWidth: theme.stroke.width.base,
				dash: dash
			})
			canvas.drawLine(cornerSvg.x, cornerSvg.y, p2Svg.x, p2Svg.y, {
				stroke: dist.color,
				strokeWidth: theme.stroke.width.base,
				dash: dash
			})
		}

		// TODO: Add leg labels and hypotenuse labels if needed
	}
}

/**
 * Utility to render polylines (function plots) using Canvas API.
 */
export function renderPolylines(
	polylines: Polyline[],
	toSvgX: (v: number) => number,
	toSvgY: (v: number) => number,
	canvas: Canvas
): void {
	if (!polylines) return

	canvas.drawInClippedRegion((clippedCanvas) => {
		for (const polyline of polylines) {
			let points: { x: number; y: number }[]

			if (polyline.type === "points") {
				points = polyline.points.map((p) => ({
					x: toSvgX(p.x),
					y: toSvgY(p.y)
				}))
			} else {
				// function-based polyline: evaluate polynomial at resolution points
				const { coefficients, xRange, resolution } = polyline
				const xStep = (xRange.max - xRange.min) / (resolution - 1)
				points = []

				for (let i = 0; i < resolution; i++) {
					const x = xRange.min + i * xStep
					let y = 0
					const degree = coefficients.length - 1

					// evaluate polynomial: coefficients[0]*x^degree + coefficients[1]*x^(degree-1) + ...
					for (let j = 0; j < coefficients.length; j++) {
						const power = degree - j
						y += coefficients[j] * x ** power
					}

					points.push({
						x: toSvgX(x),
						y: toSvgY(y)
					})
				}
			}
			if (points.length > 0) {
				const dash = polyline.style === "dashed" ? "5 3" : undefined
				clippedCanvas.drawPolyline(points, {
					stroke: polyline.color,
					strokeWidth: theme.stroke.width.thick,
					dash: dash
				})

				if (polyline.label !== null) {
					const text = polyline.label.trim()
					if (text.length > 0 && points.length >= 2) {
						let total = 0
						const segLens: number[] = []
						for (let i = 0; i < points.length - 1; i++) {
							const dx = points[i + 1].x - points[i].x
							const dy = points[i + 1].y - points[i].y
							const d = Math.hypot(dx, dy)
							segLens.push(d)
							total += d
						}
						let target = total / 2
						let segIndex = 0
						while (segIndex < segLens.length && target > segLens[segIndex]) {
							target -= segLens[segIndex]
							segIndex++
						}
						const a = points[Math.min(segIndex, points.length - 2)]
						const b = points[Math.min(segIndex + 1, points.length - 1)]
						const segLen = Math.max(
							1,
							segLens[Math.min(segIndex, segLens.length - 1)] || 1
						)
						const t = target / segLen
						const anchorX = a.x + (b.x - a.x) * t
						const anchorY = a.y + (b.y - a.y) * t
						const dx = b.x - a.x
						const dy = b.y - a.y
						const len = Math.hypot(dx, dy) || 1
						const tx = dx / len
						const ty = dy / len
						const nx = -ty
						const ny = tx

						const avoid: Array<{
							a: { x: number; y: number }
							b: { x: number; y: number }
						}> = []
						for (let i = 0; i < points.length - 1; i++) {
							avoid.push({ a: points[i], b: points[i + 1] })
						}

						const normalOffset = 14
						const baseX = anchorX + nx * normalOffset
						const baseY = anchorY + ny * normalOffset
						const fontPx = theme.font.size.medium
						const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
							text,
							Number.POSITIVE_INFINITY,
							fontPx,
							1.2
						)
						const halfW = w / 2
						const halfH = h / 2

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
							rect: { x: number; y: number; width: number; height: number },
							s: { a: { x: number; y: number }; b: { x: number; y: number } }
						) {
							const r = {
								x1: rect.x,
								y1: rect.y,
								x2: rect.x + rect.width,
								y2: rect.y + rect.height
							}
							const edges = [
								{ a: { x: r.x1, y: r.y1 }, b: { x: r.x2, y: r.y1 } },
								{ a: { x: r.x2, y: r.y1 }, b: { x: r.x2, y: r.y2 } },
								{ a: { x: r.x2, y: r.y2 }, b: { x: r.x1, y: r.y2 } },
								{ a: { x: r.x1, y: r.y2 }, b: { x: r.x1, y: r.y1 } }
							]
							return edges.some((e) => intersects(e.a, e.b, s.a, s.b))
						}
						function place(direction: 1 | -1) {
							const step = 6
							const maxIt = 80
							for (let i = 0; i < maxIt; i++) {
								const cx = baseX + direction * tx * i * step
								const cy = baseY + direction * ty * i * step
								const rect = {
									x: cx - halfW,
									y: cy - halfH,
									width: w,
									height: h
								}
								let hit = false
								for (const s of avoid) {
									if (rectIntersectsSegment(rect, s)) {
										hit = true
										break
									}
								}
								if (!hit) return { x: cx, y: cy, i }
							}
							return null
						}

						const pos1 = place(1)
						const pos2 = place(-1)
						let chosen: { x: number; y: number; i: number } | null
						if (pos1 && pos2) {
							chosen = pos1.i <= pos2.i ? pos1 : pos2
						} else {
							chosen = pos1 ?? pos2
						}
						if (!chosen) {
							// fallback: use the midpoint of the polyline
							logger.warn("no optimal label placement found, using fallback", {
								type: "polyline",
								id: polyline.id
							})
							if (polyline.type === "points" && polyline.points.length > 0) {
								const midIdx = Math.floor(polyline.points.length / 2)
								const midPoint = polyline.points[midIdx]
								const midX = toSvgX(midPoint.x)
								const midY = toSvgY(midPoint.y)
								chosen = { x: midX, y: midY - 20, i: 0 } // offset above the line
							} else {
								// for function polylines, use the first point with offset
								const firstPoint =
									polyline.type === "function" && polyline.xRange
										? { x: polyline.xRange.min, y: 0 }
										: { x: 0, y: 0 }
								chosen = {
									x: toSvgX(firstPoint.x),
									y: toSvgY(firstPoint.y) - 20,
									i: 0
								}
							}
						}

						clippedCanvas.drawText({
							x: chosen.x,
							y: chosen.y,
							text: abbreviateMonth(text),
							fill: polyline.color,
							anchor: "middle",
							dominantBaseline: "middle",
							fontPx,
							fontWeight: theme.font.weight.bold
						})
					}
				}
			}
		}
	})
}
