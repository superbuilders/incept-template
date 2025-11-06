import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneV2 } from "@/widgets/utils/coordinate-plane-v2"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { abbreviateMonth } from "@/widgets/utils/labels"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Defines a single data point on the scatter plot
const ScatterPointSchema = z
	.object({
		x: z
			.number()
			.describe(
				"The x-coordinate value of the data point (e.g., 25, 42.5, -10, 0). Must be within xAxis min/max range."
			),
		y: z
			.number()
			.describe(
				"The y-coordinate value of the data point (e.g., 180, 95.5, -5, 0). Must be within yAxis min/max range."
			),
		label: z
			.string()
			.describe(
				"Text label for this point (e.g., 'A', 'Outlier', '(3,4)'). Positioned near the point."
			)
	})
	.strict()

// Factory function for common point schema used for free-form line definitions
const createBarePointSchema = () =>
	z
		.object({
			x: z
				.number()
				.describe(
					"X-coordinate for line endpoint or reference point (e.g., 0, 50, -20). Used in line definitions."
				),
			y: z
				.number()
				.describe(
					"Y-coordinate for line endpoint or reference point (e.g., 10, 100, -15). Used in line definitions."
				)
		})
		.strict()
		.describe("A 2D coordinate used in line definitions.")

// Factory function for styling settings applied to any rendered line
const createLineStyleSchema = () =>
	z
		.object({
			color: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.describe(
					"Hex-only color for the line stroke (e.g., '#FF6B6B', '#1E90FF', '#00000080' for 50% alpha). Should contrast with background and points."
				),
			strokeWidth: z
				.number()
				.positive()
				.describe(
					"Width of the line in pixels (e.g., 2 for standard, 3 for bold, 1 for thin). Typical range: 1-4."
				),
			dash: z
				.boolean()
				.describe(
					"Whether to render as dashed line. True for dashed pattern, false for solid. Useful for predictions or reference lines."
				)
		})
		.strict()
		.describe("Visual styling for the line.")

// A line defined by two distinct points. Rendered across the entire chart domain.
const LineTwoPointsSchema = z
	.object({
		type: z
			.literal("twoPoints")
			.describe(
				"Line defined by two specific points. Extends infinitely in both directions through these points."
			),
		a: createBarePointSchema().describe(
			"First point the line passes through. Line extends beyond this point."
		),
		b: createBarePointSchema().describe(
			"Second point the line passes through. Must be different from point 'a'. Determines line's slope."
		),
		label: z
			.string()
			.describe(
				"Text label for the line (e.g., 'y = 2x + 1', 'Line A', 'Model'). Positioned along the line."
			),
		style: createLineStyleSchema().describe(
			"Visual styling for this specific line. Overrides any default line appearance."
		)
	})
	.strict()
	.describe(
		"Render an infinite line that passes through points 'a' and 'b', clipped to the plot area. Vertical lines (a.x === b.x) are supported."
	)

// A line that is computed as the best fit for the provided scatter points
const LineBestFitSchema = z
	.object({
		type: z
			.literal("bestFit")
			.describe(
				"Line computed from the scatter plot data using regression analysis."
			),
		method: z
			.enum(["linear", "quadratic", "exponential"])
			.describe(
				"Regression type. 'linear' fits y = mx + b. 'quadratic' fits y = ax² + bx + c. 'exponential' fits y = ae^(bx) where b > 0 indicates growth, b < 0 indicates decay."
			),
		label: z
			.string()
			.describe(
				"Text label for the regression line (e.g., 'Best Fit', 'Trend', 'y = 0.5x + 10')."
			),
		style: createLineStyleSchema().describe(
			"Visual styling for the regression line. Often uses distinct color or dash pattern."
		)
	})
	.strict()
	.describe(
		"A computed best-fit line or curve derived from the data points. Supports linear, quadratic, and exponential regression (where negative b indicates decay)."
	)

// The main Zod schema for the scatterPlot function
export const ScatterPlotPropsSchema = z
	.object({
		type: z
			.literal("scatterPlot")
			.describe(
				"Identifies this as a scatter plot widget for displaying bivariate data relationships."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		title: z
			.string()
			.describe(
				"Title displayed above or below the plot (e.g., 'Age vs. Income', 'Temperature Over Time'). Plaintext only; no markdown or HTML."
			),
		xAxis: z
			.object({
				label: z
					.string()
					.describe(
						"Title for the horizontal axis describing the variable (e.g., 'Age (years)', 'Time (hours)', 'Temperature (°C)')."
					),
				min: z
					.number()
					.describe(
						"Minimum value shown on x-axis (e.g., 0, -10, 1990). Should be ≤ smallest x data value with some padding."
					),
				max: z
					.number()
					.describe(
						"Maximum value shown on x-axis (e.g., 100, 50, 2025). Should be ≥ largest x data value with some padding."
					),
				tickInterval: z
					.number()
					.describe(
						"Spacing between x-axis tick marks (e.g., 10, 5, 0.5). Should evenly divide the range for clean appearance."
					),
				gridLines: z
					.boolean()
					.describe(
						"Whether to show vertical grid lines at each tick mark. True improves readability, false reduces clutter."
					)
			})
			.strict()
			.describe(
				"Configuration for the horizontal axis including scale, labels, and optional grid."
			),
		yAxis: z
			.object({
				label: z
					.string()
					.describe(
						"Title for the vertical axis describing the variable (e.g., 'Income ($1000s)', 'Score', 'Growth (cm)')."
					),
				min: z
					.number()
					.describe(
						"Minimum value shown on y-axis (e.g., 0, -20, 50). Should be ≤ smallest y data value with some padding."
					),
				max: z
					.number()
					.describe(
						"Maximum value shown on y-axis (e.g., 200, 100, 10). Should be ≥ largest y data value with some padding."
					),
				tickInterval: z
					.number()
					.describe(
						"Spacing between y-axis tick marks (e.g., 20, 10, 2.5). Should evenly divide the range for clean appearance."
					),
				gridLines: z
					.boolean()
					.describe(
						"Whether to show horizontal grid lines at each tick mark. True helps estimate values, false keeps focus on points."
					)
			})
			.strict()
			.describe(
				"Configuration for the vertical axis including scale, labels, and optional grid."
			),
		points: z
			.array(ScatterPointSchema)
			.describe(
				"Data points to plot. Each point can have an optional label. Empty array creates blank plot for exercises. Order doesn't affect display."
			),
		lines: z
			.array(
				z.discriminatedUnion("type", [LineBestFitSchema, LineTwoPointsSchema])
			)
			.describe(
				"Optional lines to overlay on the scatter plot. Can include regression lines, reference lines, or user-defined lines. Empty array means no lines."
			)
	})
	.strict()
	.describe(
		"Creates a scatter plot for exploring relationships between two numerical variables. Supports data points with labels, best-fit lines (linear or quadratic regression), and custom reference lines. Essential for statistics, correlation analysis, and data visualization. The gold standard widget design."
	)

export type ScatterPlotProps = z.infer<typeof ScatterPlotPropsSchema>

/**
 * Generates a two-dimensional scatter plot to visualize the relationship between two
 * variables, with optional support for overlaying linear or nonlinear trend lines.
 */
function computeLinearRegression(
	points: ReadonlyArray<{ x: number; y: number }>
): { slope: number; yIntercept: number } | null {
	const count = points.length
	if (count < 2) return null

	let sumX = 0
	let sumY = 0
	let sumXY = 0
	let sumX2 = 0
	for (const p of points) {
		sumX += p.x
		sumY += p.y
		sumXY += p.x * p.y
		sumX2 += p.x * p.x
	}

	const denom = count * sumX2 - sumX * sumX
	if (denom === 0) return null

	const slope = (count * sumXY - sumX * sumY) / denom
	const yIntercept = (sumY - slope * sumX) / count
	return { slope, yIntercept }
}

function computeQuadraticRegression(
	points: ReadonlyArray<{ x: number; y: number }>
): { a: number; b: number; c: number } | null {
	const count = points.length
	if (count < 3) return null

	let Sx = 0
	let Sx2 = 0
	let Sx3 = 0
	let Sx4 = 0
	let Sy = 0
	let Sxy = 0
	let Sx2y = 0
	for (const p of points) {
		const x = p.x
		const y = p.y
		const x2 = x * x
		Sx += x
		Sx2 += x2
		Sx3 += x2 * x
		Sx4 += x2 * x2
		Sy += y
		Sxy += x * y
		Sx2y += x2 * y
	}

	const det3 = (
		m11: number,
		m12: number,
		m13: number,
		m21: number,
		m22: number,
		m23: number,
		m31: number,
		m32: number,
		m33: number
	): number =>
		m11 * (m22 * m33 - m23 * m32) -
		m12 * (m21 * m33 - m23 * m31) +
		m13 * (m21 * m32 - m22 * m31)

	const D = det3(Sx4, Sx3, Sx2, Sx3, Sx2, Sx, Sx2, Sx, count)
	if (D === 0) return null

	const Da = det3(Sx2y, Sx3, Sx2, Sxy, Sx2, Sx, Sy, Sx, count)
	const Db = det3(Sx4, Sx2y, Sx2, Sx3, Sxy, Sx, Sx2, Sy, count)
	const Dc = det3(Sx4, Sx3, Sx2y, Sx3, Sx2, Sxy, Sx2, Sx, Sy)

	return { a: Da / D, b: Db / D, c: Dc / D }
}

function computeExponentialRegression(
	points: ReadonlyArray<{ x: number; y: number }>
): { a: number; b: number } | null {
	const count = points.length
	if (count < 2) return null

	// Filter out points where y <= 0 since we need ln(y)
	const validPoints = points.filter((p) => p.y > 0)
	if (validPoints.length < 2) return null

	// Transform data: ln(y) = ln(a) + bx, so we fit ln(y) vs x
	const transformedPoints = validPoints.map((p) => ({
		x: p.x,
		y: Math.log(p.y)
	}))

	// Use linear regression on transformed data
	const linearCoeff = computeLinearRegression(transformedPoints)
	if (!linearCoeff) return null

	// Convert back: ln(y) = mx + b => y = e^(mx + b) = e^b * e^(mx) = ae^(bx)
	const a = Math.exp(linearCoeff.yIntercept) // e^b
	const b = linearCoeff.slope // m

	return { a, b }
}

// type LineStyle = z.infer<ReturnType<typeof createLineStyleSchema>> // Unused type

export const generateScatterPlot: WidgetGenerator<
	typeof ScatterPlotPropsSchema
> = async (data) => {
	const { width, height, title, xAxis, yAxis, points, lines } = data

	// Validation logic moved from schema
	const hasLinear = lines.some(
		(l) => l.type === "bestFit" && l.method === "linear"
	)
	const hasQuadratic = lines.some(
		(l) => l.type === "bestFit" && l.method === "quadratic"
	)
	const hasExponential = lines.some(
		(l) => l.type === "bestFit" && l.method === "exponential"
	)

	if (hasLinear && points.length < 2) {
		logger.error("linear best fit requires at least 2 points", {
			pointsLength: points.length
		})
		throw errors.new("linear best fit requires at least 2 points")
	}
	if (hasQuadratic && points.length < 3) {
		logger.error("quadratic best fit requires at least 3 points", {
			pointsLength: points.length
		})
		throw errors.new("quadratic best fit requires at least 3 points")
	}
	if (hasExponential && points.length < 2) {
		logger.error("exponential best fit requires at least 2 points", {
			pointsLength: points.length
		})
		throw errors.new("exponential best fit requires at least 2 points")
	}
	if (hasExponential && points.some((p) => p.y <= 0)) {
		logger.error(
			"exponential regression requires all y-values to be positive",
			{
				negativePoints: points.filter((p) => p.y <= 0)
			}
		)
		throw errors.new(
			"exponential regression requires all y-values to be positive"
		)
	}
	// Validate twoPoints lines have different endpoints
	for (const line of lines) {
		if (
			line.type === "twoPoints" &&
			line.a.x === line.b.x &&
			line.a.y === line.b.y
		) {
			logger.error("line endpoints must differ", {
				lineA: line.a,
				lineB: line.b
			})
			throw errors.new("line endpoints must differ")
		}
	}

	// Validate all data points lie within the declared axis domains
	const outOfDomainPoints = points.filter(
		(p) =>
			p.x < xAxis.min || p.x > xAxis.max || p.y < yAxis.min || p.y > yAxis.max
	)
	if (outOfDomainPoints.length > 0) {
		logger.error("points outside domain", {
			count: outOfDomainPoints.length,
			outOfDomainPoints,
			xMin: xAxis.min,
			xMax: xAxis.max,
			yMin: yAxis.min,
			yMax: yAxis.max
		})
		throw errors.new("points outside domain")
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const baseInfo = setupCoordinatePlaneV2(
		{
			width,
			height,
			title,
			xAxis: {
				label: xAxis.label,
				min: xAxis.min,
				max: xAxis.max,
				tickInterval: xAxis.tickInterval,
				showGridLines: xAxis.gridLines
			},
			yAxis: {
				label: yAxis.label,
				min: yAxis.min,
				max: yAxis.max,
				tickInterval: yAxis.tickInterval,
				showGridLines: yAxis.gridLines
			},
			showQuadrantLabels: false
		},
		canvas
	)

	// Render line overlays - curves and extended lines need clipping
	type ClippedLineData =
		| { path: Path2D; line: (typeof lines)[number] }
		| {
				x1: number
				y1: number
				x2: number
				y2: number
				line: (typeof lines)[number]
		  }
	const clippedLines: Array<() => ClippedLineData> = []

	for (const line of lines) {
		if (line.type === "bestFit") {
			if (line.method === "linear") {
				const coeff = computeLinearRegression(points)
				if (coeff) {
					// Linear lines span exact chart range - no clipping needed
					const y1 = coeff.slope * xAxis.min + coeff.yIntercept
					const y2 = coeff.slope * xAxis.max + coeff.yIntercept
					const x1Svg = baseInfo.toSvgX(xAxis.min)
					const x2Svg = baseInfo.toSvgX(xAxis.max)

					canvas.drawLine(
						x1Svg,
						baseInfo.toSvgY(y1),
						x2Svg,
						baseInfo.toSvgY(y2),
						{
							stroke: line.style.color,
							strokeWidth: line.style.strokeWidth,
							dash: line.style.dash ? "5 5" : undefined
						}
					)
				}
			}
			if (line.method === "quadratic") {
				const coeff = computeQuadraticRegression(points)
				if (coeff) {
					// Render full mathematical curve - clipping will handle bounds
					clippedLines.push(() => {
						const steps = 100
						const curvePoints: Array<{ x: number; y: number }> = []
						for (let i = 0; i <= steps; i++) {
							const xVal = xAxis.min + (i / steps) * (xAxis.max - xAxis.min)
							const yVal = coeff.a * xVal ** 2 + coeff.b * xVal + coeff.c
							const px = baseInfo.toSvgX(xVal)
							const py = baseInfo.toSvgY(yVal)
							curvePoints.push({ x: px, y: py })
						}

						// Build path for curve
						const path = new Path2D()
						for (const [i, point] of curvePoints.entries()) {
							if (i === 0) {
								path.moveTo(point.x, point.y)
							} else {
								path.lineTo(point.x, point.y)
							}
						}
						return { path, line }
					})
				}
			}
			if (line.method === "exponential") {
				const coeff = computeExponentialRegression(points)
				if (coeff) {
					// Render exponential curve: y = ae^(bx) - clipping prevents infinite values
					clippedLines.push(() => {
						const steps = 100
						const curvePoints: Array<{ x: number; y: number }> = []
						for (let i = 0; i <= steps; i++) {
							const xVal = xAxis.min + (i / steps) * (xAxis.max - xAxis.min)
							const yVal = coeff.a * Math.exp(coeff.b * xVal)
							const px = baseInfo.toSvgX(xVal)
							const py = baseInfo.toSvgY(yVal)
							curvePoints.push({ x: px, y: py })
						}

						// Build path for exponential curve
						const path = new Path2D()
						for (const [i, point] of curvePoints.entries()) {
							if (i === 0) {
								path.moveTo(point.x, point.y)
							} else {
								path.lineTo(point.x, point.y)
							}
						}
						return { path, line }
					})
				}
			}
		} else if (line.type === "twoPoints") {
			const { a, b } = line
			if (a.x === b.x) {
				// vertical line across full y-domain - draw directly with canvas
				const xSvg = baseInfo.toSvgX(a.x)
				canvas.drawLine(
					xSvg,
					baseInfo.toSvgY(yAxis.min),
					xSvg,
					baseInfo.toSvgY(yAxis.max),
					{
						stroke: line.style.color,
						strokeWidth: line.style.strokeWidth,
						dash: line.style.dash ? "5 5" : undefined
					}
				)
			} else {
				// twoPoints lines can extend beyond bounds - add to clipped content
				clippedLines.push(() => {
					const slope = (b.y - a.y) / (b.x - a.x)
					const intercept = a.y - slope * a.x
					const yAtMin = slope * xAxis.min + intercept
					const yAtMax = slope * xAxis.max + intercept
					const x1Svg = baseInfo.toSvgX(xAxis.min)
					const x2Svg = baseInfo.toSvgX(xAxis.max)
					const y1Svg = baseInfo.toSvgY(yAtMin)
					const y2Svg = baseInfo.toSvgY(yAtMax)

					return { x1: x1Svg, y1: y1Svg, x2: x2Svg, y2: y2Svg, line }
				})
			}
		}
	}

	// Draw all clipped content within the clipped region
	if (clippedLines.length > 0) {
		canvas.drawInClippedRegion((clippedCanvas) => {
			for (const getLineData of clippedLines) {
				const data = getLineData()
				if ("path" in data) {
					// It's a curve (quadratic or exponential)
					clippedCanvas.drawPath(data.path, {
						fill: "none",
						stroke: data.line.style.color,
						strokeWidth: data.line.style.strokeWidth,
						dash: data.line.style.dash ? "5 5" : undefined
					})
				} else if ("x1" in data) {
					// It's a two-point line
					clippedCanvas.drawLine(data.x1, data.y1, data.x2, data.y2, {
						stroke: data.line.style.color,
						strokeWidth: data.line.style.strokeWidth,
						dash: data.line.style.dash ? "5 5" : undefined
					})
				}
			}
		})
	}

	// Render data points and labels
	for (const p of points) {
		const px = baseInfo.toSvgX(p.x)
		const py = baseInfo.toSvgY(p.y)

		// Data points and labels
		canvas.drawCircle(px, py, theme.geometry.pointRadius.large, {
			fill: theme.colors.black,
			fillOpacity: theme.opacity.overlayHigh
		})
		canvas.drawText({
			x: px + 5,
			y: py - 5,
			text: abbreviateMonth(p.label),
			fill: theme.colors.text,
			fontPx: theme.font.size.small
		})
	}

	// Line legend content
	// const legendContent = "" // Unused variable
	if (lines.length > 0) {
		const legendStartX = baseInfo.chartArea.left + baseInfo.chartArea.width + 15
		const legendStartY = baseInfo.chartArea.top + 10

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]
			if (!line) continue

			const legendY = legendStartY + i * 18
			const lineStartX = legendStartX
			const lineEndX = legendStartX + 20
			const lineCenterY = legendY - 3

			// Draw small line sample with same style as the actual line
			const dash = line.style.dash ? "5 5" : undefined
			canvas.drawLine(lineStartX, lineCenterY, lineEndX, lineCenterY, {
				stroke: line.style.color,
				strokeWidth: line.style.strokeWidth,
				dash: dash
			})

			// Label positioned after the line sample
			canvas.drawText({
				x: lineEndX + 5,
				y: legendY,
				text: abbreviateMonth(line.label),
				fill: theme.colors.black,
				anchor: "start"
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
	} = canvas.finalize(AXIS_VIEWBOX_PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
