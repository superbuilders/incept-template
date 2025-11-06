import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { abbreviateMonth } from "@/widgets/utils/labels"
import { calculateXAxisLayout, selectAxisLabels } from "@/widgets/utils/layout"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const ErrInvalidRange = errors.new("axis min must be less than axis max")

// Defines the configuration for the horizontal axis
const BoxPlotAxisSchema = z
	.object({
		min: z
			.number()
			.describe(
				"Minimum value shown on the horizontal axis. Should be less than or equal to the data minimum (e.g., 0, 10, -5). Sets the leftmost point of the scale."
			),
		max: z
			.number()
			.describe(
				"Maximum value shown on the horizontal axis. Should be greater than or equal to the data maximum (e.g., 100, 50, 200). Sets the rightmost point of the scale."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Title for the horizontal axis describing what is measured (e.g., 'Test Scores', 'Height (cm)', 'Temperature (°F)', 'Age', null). Null if not needed."
			),
		tickLabels: z
			.array(z.number())
			.describe(
				"Specific values to show as tick marks on the axis (e.g., [0, 25, 50, 75, 100] or [10, 20, 30, 40]). Should span from min to max and include key quartile values."
			)
	})
	.strict()
	.describe("Configuration for the horizontal number line of the box plot.")

// Defines the five-number summary for the box plot
const BoxPlotSummarySchema = z
	.object({
		min: z
			.number()
			.describe(
				"The minimum value in the dataset, shown as the leftmost whisker endpoint (e.g., 12, 0, 45.5). Must be ≤ q1."
			),
		q1: z
			.number()
			.describe(
				"First quartile (25th percentile), forms the left edge of the box (e.g., 25, 15.5, 62). Must be between min and median."
			),
		median: z
			.number()
			.describe(
				"Median value (50th percentile), shown as a vertical line inside the box (e.g., 45, 28, 75.5). Must be between q1 and q3."
			),
		q3: z
			.number()
			.describe(
				"Third quartile (75th percentile), forms the right edge of the box (e.g., 68, 42, 85). Must be between median and max."
			),
		max: z
			.number()
			.describe(
				"The maximum value in the dataset, shown as the rightmost whisker endpoint (e.g., 95, 58, 100). Must be ≥ q3."
			)
	})
	.strict()
	.describe(
		"The five-number summary statistics that define the box and whiskers. Values must be in ascending order: min ≤ q1 ≤ median ≤ q3 ≤ max."
	)

// The main Zod schema for the boxPlot function
export const BoxPlotPropsSchema = z
	.object({
		type: z
			.literal("boxPlot")
			.describe(
				"Identifies this as a box plot widget for displaying five-number summary statistics."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		axis: BoxPlotAxisSchema.describe(
			"Configuration for the horizontal scale including range and tick marks."
		),
		summary: BoxPlotSummarySchema.describe(
			"The five-number summary used to draw the plot."
		),
		boxColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"CSS color for the box fill showing the interquartile range (e.g., '#E8F4FD' for light blue, 'lightgray', 'rgba(150,150,150,0.3)'). Should be subtle to show median line clearly."
			),
		medianColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"CSS color for the median line inside the box (e.g., '#FF6B6B' for red, 'black', 'darkblue'). Should contrast strongly with boxColor for emphasis."
			)
	})
	.strict()
	.describe(
		"Creates a horizontal box-and-whisker plot showing data distribution through five-number summary. Essential for statistics education, comparing distributions, and identifying outliers. The box shows the middle 50% of data (IQR) with whiskers extending to min/max."
	)

export type BoxPlotProps = z.infer<typeof BoxPlotPropsSchema>

/**
 * This template generates a standard horizontal box-and-whisker plot as an SVG graphic.
 * This type of plot is a powerful tool for summarizing the distribution of a numerical
 * data set through its five-number summary.
 */
export const generateBoxPlot: WidgetGenerator<
	typeof BoxPlotPropsSchema
> = async (data) => {
	const { width, height, axis, summary, boxColor, medianColor } = data

	const { bottomMargin, xAxisTitleY } = calculateXAxisLayout(true, 15) // has tick labels, less padding
	const margin = {
		top: PADDING,
		right: PADDING,
		bottom: bottomMargin,
		left: PADDING
	}

	// const plotHeight = height - margin.top - margin.bottom // Unused variable
	const chartWidth = width - margin.left - margin.right
	// const yCenter = margin.top + plotHeight / 2 // Unused variable
	const innerBottomGapPx = 10

	if (axis.min >= axis.max) {
		logger.error("invalid axis range for box plot", {
			axisMin: axis.min,
			axisMax: axis.max
		})
		throw errors.wrap(
			ErrInvalidRange,
			`axis.min (${axis.min}) must be less than axis.max (${axis.max})`
		)
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const scale = chartWidth / (axis.max - axis.min)
	const toSvgX = (val: number) => margin.left + (val - axis.min) * scale

	const minPos = toSvgX(summary.min)
	const q1Pos = toSvgX(summary.q1)
	const medianPos = toSvgX(summary.median)
	const q3Pos = toSvgX(summary.q3)
	const maxPos = toSvgX(summary.max)

	// Draw axis
	const axisY = height - margin.bottom
	canvas.drawLine(margin.left, axisY, width - margin.right, axisY, {
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.base
	})

	if (axis.label && axis.label !== "") {
		const labelX = margin.left + chartWidth / 2
		const labelY = height - margin.bottom + xAxisTitleY
		canvas.drawText({
			x: labelX,
			y: labelY,
			text: abbreviateMonth(axis.label),
			fill: theme.colors.axisLabel,
			anchor: "middle",
			fontPx: theme.font.size.medium
		})
	}

	// Add text-aware label selection
	// Draw tick marks and labels
	const tickPositions = axis.tickLabels.map(toSvgX)
	const selectedLabels = selectAxisLabels({
		labels: axis.tickLabels.map(String),
		positions: tickPositions,
		axisLengthPx: chartWidth,
		orientation: "horizontal",
		fontPx: 12,
		minGapPx: 10
	})

	axis.tickLabels.forEach((t, i) => {
		const pos = toSvgX(t)
		canvas.drawLine(pos, axisY - 5, pos, axisY + 5, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.base
		})
		if (selectedLabels.has(i)) {
			// Check if label should be rendered
			canvas.drawText({
				x: pos,
				y: axisY + 20,
				text: String(t),
				fill: theme.colors.axisLabel,
				anchor: "middle"
			})
		}
	})

	// Box plot elements
	// Main box with guaranteed clearance above axis, anchored to axis for consistent thickness
	const minBoxHeightPx = 14
	const maxBoxHeightPx = 28
	const safeBottom = axisY - innerBottomGapPx
	// For cramped charts, draw a proper box anchored to the axis regardless of plotHeight
	const desiredHeight = Math.max(
		minBoxHeightPx,
		Math.min(maxBoxHeightPx, height * 0.25)
	)
	const boxTopRaw = safeBottom - desiredHeight
	const boxTop = Math.max(0, boxTopRaw)
	const boxHeight = Math.max(minBoxHeightPx, safeBottom - boxTop)

	canvas.drawRect(q1Pos, boxTop, q3Pos - q1Pos, boxHeight, {
		fill: boxColor,
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.base
	})

	// Median line
	canvas.drawLine(medianPos, boxTop, medianPos, safeBottom, {
		stroke: medianColor,
		strokeWidth: theme.stroke.width.thick
	})

	// Whiskers aligned with the box vertical center
	const yMidForWhiskers = (boxTop + safeBottom) / 2
	canvas.drawLine(minPos, yMidForWhiskers, q1Pos, yMidForWhiskers, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.base
	})
	canvas.drawLine(q3Pos, yMidForWhiskers, maxPos, yMidForWhiskers, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.base
	})

	canvas.drawLine(minPos, yMidForWhiskers - 10, minPos, yMidForWhiskers + 10, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.base
	})
	canvas.drawLine(maxPos, yMidForWhiskers - 10, maxPos, yMidForWhiskers + 10, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.base
	})

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
