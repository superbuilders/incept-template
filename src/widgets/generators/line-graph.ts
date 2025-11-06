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
import { estimateWrappedTextDimensions } from "@/widgets/utils/text" // ADD THIS IMPORT
import { theme } from "@/widgets/utils/theme"
import { buildTicks } from "@/widgets/utils/ticks" // ADD THIS IMPORT

export const ErrMismatchedDataLength = errors.new(
	"series data must have the same length as x-axis categories"
)

// Factory helpers to avoid schema reuse and $ref generation
function createSeriesSchema() {
	return z
		.object({
			name: z
				.string()
				.describe(
					"The name of this data series, which will appear in the legend (e.g., 'Bullhead City', 'Sedona')."
				),
			values: z
				.array(z.number())
				.describe(
					"An array of numerical values for this series. The order must correspond to the `xAxis.categories` array."
				),
			color: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex format only (#RGB, #RRGGBB, or #RRGGBBAA)"
				)
				.describe(
					"The color for the line and points of this series in hex format only (e.g., '#000', '#3377dd', '#ff000080')."
				),
			style: z
				.enum(["solid", "dashed", "dotted"])
				.describe(
					"The visual style of the line. 'solid' is a continuous line, 'dashed' and 'dotted' are broken lines."
				),
			pointShape: z
				.enum(["circle", "square"])
				.describe("The shape of the marker for each data point."),
			yAxis: z
				.enum(["left", "right"])
				.describe(
					"Specifies which Y-axis this series should be plotted against."
				)
		})
		.strict()
}

function createYAxisSchema() {
	return z
		.object({
			label: z
				.string()
				.describe(
					"The label for the vertical axis (e.g., 'Average temperature (°C)')."
				),
			min: z.number().describe("The minimum value for the y-axis scale."),
			max: z.number().describe("The maximum value for the y-axis scale."),
			tickInterval: z
				.number()
				.positive()
				.describe(
					"The numeric interval between labeled tick marks on the y-axis."
				),
			showGridLines: z
				.boolean()
				.describe("If true, displays horizontal grid lines for the y-axis.")
		})
		.strict()
}

export const LineGraphPropsSchema = z
	.object({
		type: z.literal("lineGraph"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		title: z.string().describe("The main title displayed above the graph."),
		xAxis: z
			.object({
				label: z
					.string()
					.describe("The label for the horizontal axis (e.g., 'Month')."),
				categories: z
					.array(z.string().min(1, "tick label cannot be empty"))
					.describe(
						"Complete array of tick labels for ALL x-axis positions. Each position must have a meaningful label (e.g., ['January', 'February', 'March', 'April']). Array length must match data series length."
					)
			})
			.strict(),
		yAxis: createYAxisSchema(),
		yAxisRight: z
			.union([createYAxisSchema(), z.null()])
			.describe(
				"Configuration for an optional second Y-axis on the right side. Null for a single-axis graph."
			),
		series: z
			.array(createSeriesSchema())
			.describe("An array of data series to plot on the graph."),
		showLegend: z
			.boolean()
			.describe("If true, a legend is displayed to identify each data series.")
	})
	.strict()
	.describe(
		"Creates a multi-series line graph for comparing trends across categorical data. Supports multiple lines with distinct styles, data point markers, an optional second Y-axis, and a legend."
	)

export type LineGraphProps = z.infer<typeof LineGraphPropsSchema>

export const generateLineGraph: WidgetGenerator<
	typeof LineGraphPropsSchema
> = async (props) => {
	const { width, height, title, xAxis, yAxis, yAxisRight, series, showLegend } =
		props

	for (const s of series) {
		if (s.values.length !== xAxis.categories.length) {
			logger.error("mismatched data length in line graph", {
				seriesName: s.name,
				valuesCount: s.values.length,
				categoriesCount: xAxis.categories.length
			})
			throw errors.wrap(
				ErrMismatchedDataLength,
				`Series "${s.name}" has ${s.values.length} values, but xAxis has ${xAxis.categories.length} categories.`
			)
		}
	}

	// Use V2 base for left axis only (dual Y-axis not supported in V2 yet)
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const baseInfo = setupCoordinatePlaneBaseV2(
		{
			width,
			height,
			title,
			xAxis: {
				xScaleType: "categoryPoint",
				label: xAxis.label,
				categories: xAxis.categories.map((cat) => abbreviateMonth(cat)),
				showGridLines: false,
				showTickLabels: true
			},
			yAxis: {
				label: yAxis.label,
				min: yAxis.min,
				max: yAxis.max,
				tickInterval: yAxis.tickInterval,
				showGridLines: yAxis.showGridLines,
				showTickLabels: true
			}
		},
		canvas
	)

	// Handle right Y-axis manually if present
	let toSvgYRight = (_val: number) => 0
	if (yAxisRight) {
		const rightAxisX = baseInfo.chartArea.left + baseInfo.chartArea.width
		toSvgYRight = (val: number) => {
			const frac = (val - yAxisRight.min) / (yAxisRight.max - yAxisRight.min)
			return (
				baseInfo.chartArea.top +
				baseInfo.chartArea.height -
				frac * baseInfo.chartArea.height
			)
		}

		canvas.drawLine(
			rightAxisX,
			baseInfo.chartArea.top,
			rightAxisX,
			baseInfo.chartArea.top + baseInfo.chartArea.height,
			{
				stroke: theme.colors.axis,
				strokeWidth: 1.5
			}
		)

		for (
			let t = yAxisRight.min;
			t <= yAxisRight.max;
			t += yAxisRight.tickInterval
		) {
			const y = toSvgYRight(t)
			canvas.drawLine(rightAxisX, y, rightAxisX + 5, y, {
				stroke: theme.colors.axis,
				strokeWidth: 1.5
			})
			canvas.drawText({
				x: rightAxisX + 10,
				y: y + 4,
				text: String(t),
				anchor: "start",
				fontPx: 12
			})
		}

		const yCenter = baseInfo.chartArea.top + baseInfo.chartArea.height / 2

		// ADD dynamic labelX calculation
		const { height: wrappedTitleHeight } = estimateWrappedTextDimensions(
			yAxisRight.label,
			baseInfo.chartArea.height,
			16,
			1.2
		)
		const rightTickInfo = buildTicks(
			yAxisRight.min,
			yAxisRight.max,
			yAxisRight.tickInterval
		)
		const maxTickLabelWidth = Math.max(
			...rightTickInfo.labels.map((l) => l.length * 7)
		) // Heuristic
		const TICK_LENGTH = 5
		const TICK_LABEL_PADDING = 10
		const AXIS_TITLE_PADDING = 15

		const labelX =
			rightAxisX +
			TICK_LENGTH +
			TICK_LABEL_PADDING +
			maxTickLabelWidth +
			AXIS_TITLE_PADDING +
			wrappedTitleHeight / 2

		// Estimate available width for text (space between axis and chart edge)
		const availableWidth = Math.max(
			50,
			baseInfo.chartArea.width - (rightAxisX - baseInfo.chartArea.left)
		)

		// CHANGE drawText to drawWrappedText and use new labelX
		canvas.drawWrappedText({
			x: labelX,
			y: yCenter,
			text: abbreviateMonth(yAxisRight.label),
			anchor: "middle",
			fontPx: 16,
			maxWidthPx: availableWidth,
			// FIX: Use 90 for right axis to read top-to-bottom
			rotate: { angle: 90, cx: labelX, cy: yCenter }
		})
	}

	// Use axis engine's toSvgX for positioning (no manual stepX calculation)
	const toSvgX = (index: number) => baseInfo.toSvgX(index)

	// Draw series polylines within the clipped region
	canvas.drawInClippedRegion((clippedCanvas) => {
		for (const s of series) {
			const toSvgY = s.yAxis === "right" ? toSvgYRight : baseInfo.toSvgY
			const points = s.values.map((v, i) => ({ x: toSvgX(i), y: toSvgY(v) }))

			// Draw polyline
			let dash: string | undefined
			if (s.style === "dashed") dash = "8 4"
			if (s.style === "dotted") dash = "2 6"
			clippedCanvas.drawPolyline(points, {
				stroke: s.color,
				strokeWidth: theme.stroke.width.xthick,
				dash: dash
			})
		}
	})

	// Render data point markers on the main canvas (unclipped)
	for (const s of series) {
		const toSvgY = s.yAxis === "right" ? toSvgYRight : baseInfo.toSvgY
		for (const [i, v] of s.values.entries()) {
			const cx = toSvgX(i)
			const cy = toSvgY(v)
			if (s.pointShape === "circle") {
				canvas.drawCircle(cx, cy, theme.geometry.pointRadius.base, {
					fill: s.color
				})
			} else if (s.pointShape === "square") {
				canvas.drawRect(cx - 4, cy - 4, 8, 8, {
					fill: s.color
				})
			}
		}
	}

	// Legend content (moved to the right side, outside clip)
	if (showLegend) {
		const legendItemHeight = 18
		// const legendLineLength = 30 // Unused variable
		// Start near the top-right of the chart area
		let legendStartX = baseInfo.chartArea.left + baseInfo.chartArea.width + 15
		const legendStartY = baseInfo.chartArea.top + 10

		// If a right Y-axis exists and we computed a right-side label position, push legend further right
		if (yAxisRight) {
			const rightAxisX = baseInfo.chartArea.left + baseInfo.chartArea.width
			const { height: wrappedTitleHeight } = estimateWrappedTextDimensions(
				yAxisRight.label,
				baseInfo.chartArea.height,
				16,
				1.2
			)
			const rightTickInfo = buildTicks(
				yAxisRight.min,
				yAxisRight.max,
				yAxisRight.tickInterval
			)
			const maxTickLabelWidth = Math.max(
				...rightTickInfo.labels.map((l) => l.length * 7)
			)
			const TICK_LENGTH = 5
			const TICK_LABEL_PADDING = 10
			const AXIS_TITLE_PADDING = 15
			const labelX =
				rightAxisX +
				TICK_LENGTH +
				TICK_LABEL_PADDING +
				maxTickLabelWidth +
				AXIS_TITLE_PADDING +
				wrappedTitleHeight / 2
			legendStartX = labelX + 20
		}

		canvas.drawLegendBlock({
			startX: legendStartX,
			startY: legendStartY,
			rowGapPx: legendItemHeight - 12,
			rows: series.map((s) => {
				let dash: string | undefined
				if (s.style === "dashed") dash = "8 4"
				if (s.style === "dotted") dash = "2 6"
				return {
					label: s.name,
					sample: {
						stroke: s.color,
						strokeWidth: theme.stroke.width.xthick,
						dash: dash,
						marker: s.pointShape
					}
				}
			})
		})
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
