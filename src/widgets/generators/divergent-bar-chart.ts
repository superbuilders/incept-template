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

// Defines the data for a single bar in the chart
const DataPointSchema = z
	.object({
		category: z
			.string()
			.min(1, "category label cannot be empty")
			.describe(
				"The category name displayed as x-axis tick label (e.g., '1st Century', '5th Century', '10th Century'). Each bar position must have a meaningful label."
			),
		value: z
			.number()
			.describe(
				"The numerical value. Positive values are drawn above the zero line, negative values below."
			)
	})
	.strict()

// The main Zod schema for the divergentBarChart function
export const DivergentBarChartPropsSchema = z
	.object({
		type: z.literal("divergentBarChart"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		xAxisLabel: z
			.string()
			.describe("The label for the horizontal axis (e.g., 'Century')."),
		yAxis: z
			.object({
				label: z
					.string()
					.describe(
						"The title for the vertical axis (e.g., 'Change in sea level (cm)')."
					),
				min: z
					.number()
					.describe("The minimum value on the y-axis (can be negative)."),
				max: z.number().describe("The maximum value on the y-axis."),
				tickInterval: z
					.number()
					.positive()
					.describe("The spacing between tick marks on the y-axis.")
			})
			.strict()
			.describe("Configuration for the vertical axis."),
		data: z
			.array(DataPointSchema)
			.describe(
				"Complete array of ALL data points to display as bars. Each bar must have a meaningful category label for proper x-axis tick labeling."
			),
		positiveBarColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("CSS color for bars with positive values."),
		negativeBarColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("CSS color for bars with negative values."),
		gridColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("CSS color for the horizontal grid lines.")
	})
	.strict()
	.describe(
		"Creates a divergent bar chart where bars can be positive or negative, extending from a central zero line. Styled to match the sea level change example."
	)

export type DivergentBarChartProps = z.infer<
	typeof DivergentBarChartPropsSchema
>

/**
 * Generates a divergent bar chart styled to replicate the provided sea level change graph.
 */
export const generateDivergentBarChart: WidgetGenerator<
	typeof DivergentBarChartPropsSchema
> = async (data) => {
	const {
		width,
		height,
		xAxisLabel,
		yAxis,
		data: chartData,
		positiveBarColor,
		negativeBarColor,
		gridColor
	} = data

	if (chartData.length === 0 || yAxis.min >= yAxis.max) {
		logger.error("invalid data for divergent bar chart", {
			dataLength: chartData.length,
			yAxis
		})
		throw errors.wrap(
			ErrInvalidDimensions,
			"chart data must not be empty and y-axis min must be less than max"
		)
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
				categories: chartData.map((d) => abbreviateMonth(d.category)),
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
		if (t === 0) continue // Skip zero line, we'll draw it separately
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

	// Prominent zero line
	const yZero = baseInfo.toSvgY(0)
	canvas.drawLine(
		baseInfo.chartArea.left,
		yZero,
		baseInfo.chartArea.left + baseInfo.chartArea.width,
		yZero,
		{
			stroke: theme.colors.axis,
			strokeWidth: 2
		}
	)

	// Bar rendering
	const bandWidth = baseInfo.bandWidth
	if (bandWidth === undefined) {
		logger.error(
			"bandWidth missing for categorical x-axis in divergent bar chart",
			{
				length: chartData.length
			}
		)
		throw errors.wrap(
			ErrInvalidDimensions,
			"categorical x-axis requires defined bandWidth"
		)
	}
	const barPadding = 0.4
	const innerBarWidth = bandWidth * (1 - barPadding)

	// Draw bars within the clipped region (deterministic order by index)
	canvas.drawInClippedRegion((clippedCanvas) => {
		chartData.forEach((d, i) => {
			const xCenter = baseInfo.toSvgX(i)
			const barX = xCenter - innerBarWidth / 2
			const barAbsHeight =
				(Math.abs(d.value) / (yAxis.max - yAxis.min)) *
				baseInfo.chartArea.height

			let y: number
			let color: string

			if (d.value >= 0) {
				y = yZero - barAbsHeight
				color = positiveBarColor
			} else {
				y = yZero
				color = negativeBarColor
			}

			clippedCanvas.drawRect(barX, y, innerBarWidth, barAbsHeight, {
				fill: color
			})
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
