import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneBaseV2 } from "@/widgets/utils/coordinate-plane-utils"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { abbreviateMonth } from "@/widgets/utils/labels"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const ErrInvalidDimensions = errors.new(
	"invalid chart dimensions or data"
)

// Defines the data for a single category's count (e.g., yearly elk count)
const PopulationBarDataPointSchema = z
	.object({
		label: z
			.string()
			.min(1, "bar label cannot be empty")
			.describe(
				"The category label displayed as x-axis tick label for this bar (e.g., '1990', '1995', '2000'). Must be meaningful text."
			),
		value: z
			.number()
			.min(0)
			.describe("The non-negative value represented by the bar.")
	})
	.strict()

// Defines the Y-axis configuration
const YAxisOptionsSchema = z
	.object({
		label: z
			.string()
			.describe("The title for the vertical axis (e.g., 'Number of elk')."),
		min: z.number().describe("The minimum value shown on the y-axis."),
		max: z.number().describe("The maximum value shown on the y-axis."),
		tickInterval: z
			.number()
			.positive()
			.describe("The spacing between tick marks and grid lines on the y-axis.")
	})
	.strict()

// The main Zod schema for the populationBarChart function
export const PopulationBarChartPropsSchema = z
	.object({
		type: z
			.literal("populationBarChart")
			.describe(
				"Identifies this as a bar chart styled like the elk population example."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		xAxisLabel: z
			.string()
			.describe("The label for the horizontal axis (e.g., 'Year')."),
		yAxis: YAxisOptionsSchema.describe(
			"Configuration for the vertical axis including scale and labels."
		),
		xAxisVisibleLabels: z
			.array(z.string().min(1, "visible label cannot be empty"))
			.describe(
				"Optional subset of x-axis labels to display when spacing is limited. Each string must be a meaningful label from the data array (e.g., ['1990', '1995', '2000']). If empty, automatic text-width-aware spacing applies."
			),
		data: z
			.array(PopulationBarDataPointSchema)
			.describe(
				"Complete array of ALL data points to display. Each point must have a meaningful label for x-axis tick labeling. Order determines left-to-right positioning."
			),
		barColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe("CSS color for the bars (e.g., '#208388')."),
		gridColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe("CSS color for the horizontal grid lines (e.g., '#cccccc').")
	})
	.strict()
	.describe(
		"Creates a vertical bar chart specifically styled to match the provided elk population graph. Features include solid horizontal grid lines, bold axis labels, and specific tick mark styling."
	)

export type PopulationBarChartProps = z.infer<
	typeof PopulationBarChartPropsSchema
>

/**
 * Generates a vertical bar chart styled to replicate the provided elk population graph.
 */
export const generatePopulationBarChart: WidgetGenerator<
	typeof PopulationBarChartPropsSchema
> = async (data) => {
	const {
		width,
		height,
		xAxisLabel,
		yAxis,
		data: chartData,
		barColor,
		gridColor
	} = data
	// xAxisVisibleLabels unused from destructuring

	if (chartData.length === 0) {
		logger.error("invalid data for population bar chart", {
			dataLength: chartData.length
		})
		throw errors.wrap(ErrInvalidDimensions, "chart data must not be empty")
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const baseInfo = setupCoordinatePlaneBaseV2(
		{
			width,
			height,
			title: null, // No title for this widget
			xAxis: {
				xScaleType: "categoryBand",
				label: xAxisLabel,
				categories: chartData.map((d) => abbreviateMonth(d.label)),
				showGridLines: false,
				showTickLabels: true
			},
			yAxis: {
				label: yAxis.label,
				min: yAxis.min,
				max: yAxis.max,
				tickInterval: yAxis.tickInterval,
				showGridLines: true,
				showTickLabels: true
			}
		},
		canvas
	)

	// Override grid lines with custom color
	for (let t = yAxis.min; t <= yAxis.max; t += yAxis.tickInterval) {
		if (t === 0) continue
		const y = baseInfo.toSvgY(t)
		canvas.drawLine(
			baseInfo.chartArea.left,
			y,
			baseInfo.chartArea.left + baseInfo.chartArea.width,
			y,
			{
				stroke: gridColor,
				strokeWidth: 1
			}
		)
	}

	// Bar rendering
	const bandWidth = baseInfo.bandWidth
	if (bandWidth === undefined) {
		logger.error(
			"bandWidth missing for categorical x-axis in population bar chart",
			{
				length: chartData.length
			}
		)
		throw errors.wrap(
			ErrInvalidDimensions,
			"categorical x-axis requires defined bandWidth"
		)
	}
	const barPadding = 0.3
	const innerBarWidth = bandWidth * (1 - barPadding)

	// Handle visible labels logic (deterministic: inputs define category labels; thinning is applied upstream in axis renderer)
	// const visibleLabelSet = new Set<string>(xAxisVisibleLabels) // Unused variable
	// const useAutoThinning = xAxisVisibleLabels.length === 0 // Unused variable

	chartData.forEach((d, i) => {
		const xCenter = baseInfo.toSvgX(i)
		const barX = xCenter - innerBarWidth / 2
		const barHeight =
			((d.value - yAxis.min) / (yAxis.max - yAxis.min)) *
			baseInfo.chartArea.height
		const y = baseInfo.chartArea.top + baseInfo.chartArea.height - barHeight

		canvas.drawRect(barX, y, innerBarWidth, barHeight, {
			fill: barColor
		})
	})

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(AXIS_VIEWBOX_PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
