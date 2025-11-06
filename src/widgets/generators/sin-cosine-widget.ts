import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import {
	createAxisOptionsSchema,
	createPlotPointSchema,
	renderPoints
} from "@/widgets/utils/canvas-utils"
import {
	PADDING,
	TICK_LABEL_FONT_PX,
	X_AXIS_MIN_LABEL_PADDING_PX
} from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { selectAxisLabels } from "@/widgets/utils/layout"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"
import { buildTicks } from "@/widgets/utils/ticks"

// Factory functions to prevent Zod schema reuse issues ($ref)
const createPlotConfigSchema = () =>
	z
		.object({
			type: z
				.enum(["sin", "cos"])
				.describe("The type of trigonometric function to plot."),
			color: z
				.string()
				.regex(CSS_COLOR_PATTERN, "invalid css color")
				.describe("The color of the curve."),
			strokeWidth: z
				.number()
				.positive()
				.describe("The thickness of the curve in pixels."),
			style: z
				.enum(["solid", "dashed"])
				.describe("The line style for the curve.")
		})
		.strict()

/**
 * Creates a sine or cosine wave plot on a coordinate plane, ideal for visualizing trigonometric functions.
 * The x-axis is typically represented in radians, often as multiples of π.
 */
export const SinCosineWidgetPropsSchema = z
	.object({
		type: z
			.literal("sinCosineWidget")
			.describe("Identifies this as a sine/cosine wave plotting widget."),
		width: createWidthSchema(),
		height: createHeightSchema(),
		xAxis: createAxisOptionsSchema().describe(
			"Configuration for the horizontal x-axis (usually representing angles in radians)."
		),
		yAxis: createAxisOptionsSchema().describe(
			"Configuration for the vertical y-axis (usually representing amplitude)."
		),
		plots: z
			.array(createPlotConfigSchema())
			.min(1)
			.describe("An array of sine and/or cosine functions to plot."),
		points: z
			.array(createPlotPointSchema())
			.describe("An array of specific points to highlight on the graph.")
	})
	.strict()

export type SinCosineWidgetProps = z.infer<typeof SinCosineWidgetPropsSchema>

// Helper to format radian values into labels with π
function formatPiLabel(value: number): string {
	if (Math.abs(value) < 1e-9) return "0"

	const multiple = value / Math.PI

	// Check for integer multiples of π
	if (Math.abs(multiple - Math.round(multiple)) < 1e-9) {
		const intMultiple = Math.round(multiple)
		if (intMultiple === 1) return "π"
		if (intMultiple === -1) return "-π"
		if (intMultiple === 0) return "0"
		return `${intMultiple}π`
	}

	// Check for common fractional multiples of π (e.g., π/2, 3π/4)
	const denominators = [2, 3, 4, 6]
	for (const d of denominators) {
		const numerator = Math.round(multiple * d)
		if (Math.abs(multiple - numerator / d) < 1e-9) {
			if (numerator === 0) return "0"
			const sign = numerator < 0 ? "-" : ""
			const absNum = Math.abs(numerator)
			if (absNum === 1) return `${sign}π/${d}`
			return `${sign}${absNum}π/${d}`
		}
	}

	// Fallback to a decimal representation if not a simple multiple of π
	return value.toFixed(2)
}

// Custom coordinate plane setup for trigonometric functions with π labels
function setupTrigCoordinatePlane(
	data: {
		width: number
		height: number
		xAxis: {
			label: string | null
			min: number
			max: number
			tickInterval: number
			showGridLines: boolean
		}
		yAxis: {
			label: string | null
			min: number
			max: number
			tickInterval: number
			showGridLines: boolean
		}
	},
	canvas: CanvasImpl
): {
	toSvgX: (val: number) => number
	toSvgY: (val: number) => number
} {
	const { width, height, xAxis, yAxis } = data

	// Calculate margins for labels and title
	const margin = {
		top: 40,
		bottom: 80,
		left: 80,
		right: 40
	}

	const chartWidth = width - margin.left - margin.right
	const chartHeight = height - margin.top - margin.bottom

	// Coordinate transformation functions
	const toSvgX = (val: number) =>
		margin.left + ((val - xAxis.min) / (xAxis.max - xAxis.min)) * chartWidth
	const toSvgY = (val: number) =>
		margin.top +
		chartHeight -
		((val - yAxis.min) / (yAxis.max - yAxis.min)) * chartHeight

	const zeroX = toSvgX(0)
	const zeroY = toSvgY(0)

	// Grid lines
	if (xAxis.showGridLines) {
		const { values } = buildTicks(xAxis.min, xAxis.max, xAxis.tickInterval)
		for (const t of values) {
			if (Math.abs(t) < 1e-9) continue // Skip origin
			const x = toSvgX(t)
			canvas.drawLine(x, margin.top, x, height - margin.bottom, {
				stroke: theme.colors.gridMajor,
				strokeWidth: 1
			})
		}
	}
	if (yAxis.showGridLines) {
		const { values } = buildTicks(yAxis.min, yAxis.max, yAxis.tickInterval)
		for (const t of values) {
			if (Math.abs(t) < 1e-9) continue // Skip origin
			const y = toSvgY(t)
			canvas.drawLine(margin.left, y, width - margin.right, y, {
				stroke: theme.colors.gridMajor,
				strokeWidth: 1
			})
		}
	}

	// Axes lines
	canvas.drawLine(margin.left, zeroY, width - margin.right, zeroY, {
		stroke: theme.colors.axis,
		strokeWidth: 1.5
	})
	canvas.drawLine(zeroX, margin.top, zeroX, height - margin.bottom, {
		stroke: theme.colors.axis,
		strokeWidth: 1.5
	})

	// X-axis ticks and π labels
	const { values: xValues } = buildTicks(
		xAxis.min,
		xAxis.max,
		xAxis.tickInterval
	)
	const xTickPositions = xValues.map(toSvgX)
	const xPiLabels = xValues.map(formatPiLabel)

	const selectedXTicks = selectAxisLabels({
		labels: xPiLabels,
		positions: xTickPositions,
		axisLengthPx: chartWidth,
		orientation: "horizontal",
		fontPx: TICK_LABEL_FONT_PX,
		minGapPx: X_AXIS_MIN_LABEL_PADDING_PX
	})

	xValues.forEach((t, i) => {
		if (Math.abs(t) < 1e-9) return // Skip origin
		const x = toSvgX(t)
		canvas.drawLine(x, zeroY - 4, x, zeroY + 4, {
			stroke: theme.colors.axis,
			strokeWidth: 1
		})
		if (selectedXTicks.has(i)) {
			canvas.drawText({
				x: x,
				y: zeroY + 15,
				text: xPiLabels[i],
				fill: theme.colors.axisLabel,
				anchor: "middle",
				fontPx: TICK_LABEL_FONT_PX
			})
		}
	})

	// Y-axis ticks and labels (standard numeric)
	const { values: yValues, labels: yLabels } = buildTicks(
		yAxis.min,
		yAxis.max,
		yAxis.tickInterval
	)
	const yTickPositions = yValues.map(toSvgY)

	const selectedYTicks = selectAxisLabels({
		labels: yLabels,
		positions: yTickPositions,
		axisLengthPx: chartHeight,
		orientation: "vertical",
		fontPx: TICK_LABEL_FONT_PX,
		minGapPx: 12
	})

	yValues.forEach((t, i) => {
		if (Math.abs(t) < 1e-9) return // Skip origin
		const y = toSvgY(t)
		canvas.drawLine(zeroX - 4, y, zeroX + 4, y, {
			stroke: theme.colors.axis,
			strokeWidth: 1
		})
		if (selectedYTicks.has(i)) {
			canvas.drawText({
				x: zeroX - 10,
				y: y + 4,
				text: yLabels[i],
				fill: theme.colors.axisLabel,
				anchor: "end",
				fontPx: TICK_LABEL_FONT_PX
			})
		}
	})

	// Axis labels
	if (xAxis.label !== null) {
		canvas.drawText({
			x: width / 2,
			y: height - 20,
			text: xAxis.label,
			fill: theme.colors.axisLabel,
			anchor: "middle",
			fontPx: 14
		})
	}

	if (yAxis.label !== null) {
		canvas.drawText({
			x: 20,
			y: height / 2,
			text: yAxis.label,
			fill: theme.colors.axisLabel,
			anchor: "middle",
			fontPx: 14,
			transform: `rotate(-90, 20, ${height / 2})`
		})
	}

	return { toSvgX, toSvgY }
}

export const generateSinCosineWidget: WidgetGenerator<
	typeof SinCosineWidgetPropsSchema
> = async (props) => {
	const { width, height, xAxis, yAxis, plots, points } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Setup the coordinate plane with π formatting
	const { toSvgX, toSvgY } = setupTrigCoordinatePlane(
		{
			width,
			height,
			xAxis,
			yAxis
		},
		canvas
	)

	const xMin = xAxis.min
	const xMax = xAxis.max

	// Draw the function plots
	canvas.drawInClippedRegion((clippedCanvas) => {
		for (const plot of plots) {
			const numPoints = 200 // Increase for smoother curves
			const curvePoints = []

			for (let i = 0; i <= numPoints; i++) {
				const x = xMin + (i / numPoints) * (xMax - xMin)
				const y = plot.type === "sin" ? Math.sin(x) : Math.cos(x)
				curvePoints.push({ x: toSvgX(x), y: toSvgY(y) })
			}

			clippedCanvas.drawPolyline(curvePoints, {
				stroke: plot.color,
				strokeWidth: plot.strokeWidth,
				dash: plot.style === "dashed" ? "8 4" : undefined
			})
		}
	})

	// Draw any highlighted points
	renderPoints(points, toSvgX, toSvgY, canvas)

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
