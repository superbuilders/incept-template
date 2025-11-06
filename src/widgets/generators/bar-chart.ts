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

// Defines the data and state for a single bar in the chart
const BarDataSchema = z
	.object({
		label: z
			.string()
			.describe(
				"Category name displayed on the x-axis below this bar. Examples: 'January', 'Apples', 'Grade 3', 'Q1 2023'. Use empty string to hide the label for this bar."
			),
		value: z
			.number()
			.describe(
				"Numerical value that determines the bar's height. Supports positive and negative values. Zero creates a bar at the baseline."
			),
		state: z
			.enum(["normal", "unknown"])
			.describe(
				"Visual rendering style for the bar. 'normal' creates a solid filled bar, 'unknown' creates a dashed outline bar for missing data problems."
			)
	})
	.strict()

// Define Y-axis schema via factory to avoid $ref in OpenAI JSON Schema
const createYAxisSchema = () =>
	z
		.object({
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
				.describe(
					"Title for the vertical y-axis. Examples: 'Sales ($)', 'Population (thousands)', 'Test Scores', 'Temperature (°C)'. Set to null for no axis label."
				),
			min: z
				.number()
				.describe(
					"Minimum value on the y-axis scale. Must be less than max. For data starting at 0, use 0. For negative data, use appropriate negative minimum."
				),
			max: z
				.number()
				.describe(
					"Maximum value on the y-axis scale. Must be greater than min. Should accommodate the highest data value with some headroom for clarity."
				),
			tickInterval: z
				.number()
				.describe(
					"Spacing between tick marks and grid lines on the y-axis. Should evenly divide the range (max - min). Examples: 10, 25, 100, 0.5."
				)
		})
		.strict()

// The main Zod schema for the barChart function
export const BarChartPropsSchema = z
	.object({
		type: z
			.literal("barChart")
			.describe(
				"Widget type identifier for vertical bar charts used to compare categorical data."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		title: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Chart title displayed at the top. Examples: 'Monthly Sales Report', 'Student Test Scores by Grade', 'Quarterly Revenue'. Set to null for no title."
			),
		xAxisLabel: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Label for the horizontal axis describing the categories. Examples: 'Months', 'Product Types', 'School Districts'. Set to null when category labels are self-explanatory."
			),
		yAxis: createYAxisSchema().describe(
			"Vertical axis configuration defining the scale, range, tick intervals, and axis label for the numerical values."
		),
		data: z
			.array(BarDataSchema)
			.describe(
				"Array of data points, each representing one bar. Order determines left-to-right positioning. Each entry defines the category label, numerical value, and visual state."
			),
		barColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"CSS color for normal bars. Examples: '#4472C4' (blue), '#E74C3C' (red), '#2ECC71' (green). Use hex format with optional alpha channel for transparency."
			)
	})
	.strict()
	.describe(
		"Creates vertical bar charts for comparing numerical values across discrete categories. Supports solid bars for known values and dashed outline bars for unknown/missing data scenarios."
	)

export type BarChartProps = z.infer<typeof BarChartPropsSchema>

/**
 * This template generates a standard vertical bar chart as an SVG graphic.
 * Bar charts are used to compare numerical values across a set of discrete categories.
 * Supports rendering bars in an "unknown" state for missing value problems.
 */
export const generateBarChart: WidgetGenerator<
	typeof BarChartPropsSchema
> = async (data) => {
	const {
		width,
		height,
		title,
		xAxisLabel,
		yAxis,
		data: chartData,
		barColor
	} = data

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Label preparation logic
	let finalXAxisLabel = ""
	if (xAxisLabel) {
		finalXAxisLabel = xAxisLabel
	}

	let finalYAxisLabel = ""
	if (yAxis.label) {
		finalYAxisLabel = yAxis.label
	}

	// MODIFIED: Call the setup function, passing the canvas. It will draw the axes.
	const baseInfo = setupCoordinatePlaneBaseV2(
		{
			width,
			height,
			title,
			xAxis: {
				xScaleType: "categoryBand",
				label: finalXAxisLabel,
				categories: chartData.map((d) => abbreviateMonth(d.label)),
				showTickLabels: true,
				showGridLines: false
			},
			yAxis: {
				...yAxis,
				label: finalYAxisLabel,
				showTickLabels: true,
				showGridLines: true
			}
		},
		canvas
	)

	// bandWidth and innerBarWidth calculation remains
	const bandWidth = baseInfo.bandWidth
	if (bandWidth === undefined) {
		logger.error("bandWidth missing for categorical x-axis in bar chart", {
			length: chartData.length
		})
		throw errors.wrap(
			ErrInvalidDimensions,
			"categorical x-axis requires defined bandWidth"
		)
	}
	const barPadding = 0.2
	const innerBarWidth = bandWidth * (1 - barPadding)

	// Draw bars within the clipped region
	canvas.drawInClippedRegion((clippedCanvas) => {
		chartData.forEach((d, i) => {
			const xCenter = baseInfo.toSvgX(i)
			const barX = xCenter - innerBarWidth / 2
			const barHeight =
				((d.value - yAxis.min) / (yAxis.max - yAxis.min)) *
				baseInfo.chartArea.height
			const y = baseInfo.chartArea.top + baseInfo.chartArea.height - barHeight

			if (d.state === "normal") {
				clippedCanvas.drawRect(barX, y, innerBarWidth, barHeight, {
					fill: barColor
				})
			} else {
				clippedCanvas.drawRect(barX, y, innerBarWidth, barHeight, {
					fill: "none",
					stroke: barColor,
					strokeWidth: theme.stroke.width.thick,
					dash: theme.stroke.dasharray.dashed
				})
			}
		})
	})

	// NEW: Finalize the canvas and construct the root SVG element.
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(AXIS_VIEWBOX_PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
