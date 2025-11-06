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
import { buildTicks } from "@/widgets/utils/ticks"

export const ErrInvalidDimensions = errors.new(
	"invalid chart dimensions or axis range"
)

const DataPoint = z
	.object({
		value: z
			.number()
			.describe(
				"The numerical value on the axis where dots are placed (e.g., 5, 12.5, -3, 0). Must be within axis min/max range."
			),
		count: z
			.number()
			.int()
			.min(0)
			.describe(
				"Number of dots to stack at this value. Represents frequency (e.g., 3 means 3 dots stacked vertically). Must be non-negative."
			)
	})
	.strict()

export const DotPlotPropsSchema = z
	.object({
		type: z
			.literal("dotPlot")
			.describe(
				"Identifies this as a dot plot widget for displaying frequency distributions."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		axis: z
			.object({
				label: z
					.string()
					.nullable()
					.transform((val) =>
						val === "null" || val === "NULL" || val === "" ? null : val
					)
					.describe(
						"Title for the horizontal axis describing the variable (e.g., 'Test Score', 'Number of Siblings', 'Temperature (°C)', null). Null shows no label."
					),
				min: z
					.number()
					.describe(
						"Minimum value shown on the axis (e.g., 0, -10, 50). Should be less than or equal to smallest data value."
					),
				max: z
					.number()
					.describe(
						"Maximum value shown on the axis (e.g., 100, 20, 10). Should be greater than or equal to largest data value."
					),
				tickInterval: z
					.number()
					.describe(
						"Spacing between axis tick marks (e.g., 10, 5, 0.5, 1). Should evenly divide the range for clean appearance."
					)
			})
			.strict()
			.describe("Configuration for the horizontal number line axis."),
		data: z
			.array(DataPoint)
			.describe(
				"Array of values and their frequencies. Each unique value gets its own dot stack. Order doesn't matter. Can be empty for blank plot."
			),
		dotColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
			)
			.describe(
				"Hex-only color for the dots (e.g., '#4472C4', '#1E90FF', '#FF0000CC' for ~80% alpha). Should contrast with white background."
			),
		dotRadius: z
			.number()
			.positive()
			.describe(
				"Radius of each dot in pixels (e.g., 4, 5, 3). Larger dots are more visible but may overlap. Typical range: 3-6."
			)
	})
	.strict()
	.describe(
		"Creates a dot plot (line plot) showing frequency distribution of numerical data. Each value is represented by stacked dots indicating count/frequency. Excellent for small datasets, showing distribution shape, clusters, gaps, and outliers. Dots stack vertically when multiple observations have the same value."
	)

export type DotPlotProps = z.infer<typeof DotPlotPropsSchema>

/**
 * Generates a clear, accessible, and standards-compliant dot plot as an SVG graphic.
 * Dot plots are used to visualize the distribution of a numerical data set,
 * especially when the data consists of discrete values or has been binned.
 */
export const generateDotPlot: WidgetGenerator<
	typeof DotPlotPropsSchema
> = async (data) => {
	const { width, height, axis, data: plotData, dotColor, dotRadius } = data

	const { bottomMargin, xAxisTitleY } = calculateXAxisLayout(true)
	const margin = {
		top: PADDING,
		right: PADDING,
		bottom: bottomMargin,
		left: PADDING
	}

	const chartWidth = width - margin.left - margin.right
	const chartHeight = height - margin.top - margin.bottom
	const axisY = height - margin.bottom

	if (chartWidth <= 0 || chartHeight <= 0 || axis.min >= axis.max) {
		logger.error("invalid chart dimensions or axis range", {
			width,
			height,
			chartWidth,
			chartHeight,
			axisMin: axis.min,
			axisMax: axis.max
		})
		throw errors.wrap(
			ErrInvalidDimensions,
			`width: ${width}, height: ${height}, axis range: ${axis.min}-${axis.max}`
		)
	}

	const scale = chartWidth / (axis.max - axis.min)
	const toSvgX = (val: number) => margin.left + (val - axis.min) * scale

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Axis line
	canvas.drawLine(margin.left, axisY, width - margin.right, axisY, {
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.base
	})

	// Axis label
	if (axis.label !== null) {
		canvas.drawText({
			x: width / 2,
			y: height - margin.bottom + xAxisTitleY,
			text: abbreviateMonth(axis.label),
			fill: theme.colors.axisLabel,
			anchor: "middle",
			fontPx: theme.font.size.medium
		})
	}

	// Draw tick marks and labels
	const { values, labels: tickLabels } = buildTicks(
		axis.min,
		axis.max,
		axis.tickInterval
	)
	const tickPositions = values.map(toSvgX)
	const selectedLabels = selectAxisLabels({
		labels: tickLabels,
		positions: tickPositions,
		axisLengthPx: chartWidth,
		orientation: "horizontal",
		fontPx: 12,
		minGapPx: 18
	})

	values.forEach((t, i) => {
		const pos = toSvgX(t)
		canvas.drawLine(pos, axisY - 5, pos, axisY + 5, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.base
		})
		if (selectedLabels.has(i)) {
			const label = tickLabels[i]
			if (label !== undefined) {
				canvas.drawText({
					x: pos,
					y: axisY + 20,
					text: label,
					fill: theme.colors.axisLabel,
					anchor: "middle"
				})
			}
		}
	})

	const dotDiameter = dotRadius * 2
	const dotSpacing = 2 // Vertical space between dots
	const baseOffset = 10 // Additional space between axis and first dot
	for (const dp of plotData) {
		if (dp.count > 0) {
			const x = toSvgX(dp.value)
			for (let i = 0; i < dp.count; i++) {
				const y =
					axisY - dotRadius - baseOffset - i * (dotDiameter + dotSpacing)
				canvas.drawCircle(x, y, dotRadius, {
					fill: dotColor
				})
			}
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
