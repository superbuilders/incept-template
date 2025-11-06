import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneBaseV2 } from "@/widgets/utils/coordinate-plane-utils"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

const Bin = z
	.object({
		frequency: z
			.number()
			.int()
			.min(0)
			.describe(
				"The count/frequency for this bin. Determines bar height. Must be non-negative integer (e.g., 5, 12, 0, 23)."
			)
	})
	.strict()

export const HistogramPropsSchema = z
	.object({
		type: z
			.literal("histogram")
			.describe(
				"Identifies this as a histogram widget for displaying frequency distributions."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		title: z
			.string()
			.describe(
				"Title displayed above the histogram (e.g., 'Test Score Distribution', 'Age Groups')."
			),
		xAxis: z
			.object({
				label: z
					.string()
					.describe(
						"Title for the horizontal axis describing the variable being binned (e.g., 'Score Range', 'Age (years)', 'Size Category')."
					)
			})
			.strict()
			.describe("Configuration for the x-axis showing bin categories."),
		yAxis: z
			.object({
				label: z
					.string()
					.describe(
						"Title for the vertical axis, typically 'Frequency' or 'Count' (e.g., 'Number of Students', 'Frequency', 'Count')."
					),
				max: z
					.number()
					.int()
					.positive()
					.describe(
						"Maximum value shown on y-axis. Should exceed highest frequency for clarity (e.g., 30, 50, 100). Must be positive integer."
					),
				tickInterval: z
					.number()
					.positive()
					.describe(
						"Spacing between y-axis tick marks (e.g., 5, 10, 2). Should evenly divide max for clean appearance."
					)
			})
			.strict()
			.describe("Configuration for the y-axis showing frequencies."),
		// The numeric separators marking the boundaries between bars. If there are N bars, there must be N+1 separators.
		separators: z
			.array(z.number())
			.min(2)
			.describe(
				"Complete array of ALL numeric boundary markers for x-axis tick labels. Bars are drawn between consecutive separators. Each separator value becomes a tick label (e.g., [0, 5, 10, 15, 20]). Must be strictly increasing sequence."
			),
		bins: z
			.array(Bin)
			.describe(
				"Array of bins with their frequencies. Order determines left-to-right display. Adjacent bars touch (no gaps) in a histogram."
			)
	})
	.strict()
	.describe(
		"Creates a histogram showing frequency distribution of data across bins/intervals. Unlike bar charts, histogram bars touch each other to show continuous data ranges. Essential for statistics education, showing data distributions, and identifying patterns like normal distributions or skewness."
	)

export type HistogramProps = z.infer<typeof HistogramPropsSchema>

/**
 * Generates a standard histogram as an SVG graphic.
 * Histograms are used to visualize the distribution of continuous numerical data by dividing it into intervals (bins).
 * Unlike bar charts, histogram bars are adjacent to each other.
 */
export const generateHistogram: WidgetGenerator<
	typeof HistogramPropsSchema
> = async (data) => {
	const { width, height, title, xAxis, yAxis, bins, separators } = data

	// Runtime validation (no refine allowed in schema for structured outputs)
	if (separators.length !== bins.length + 1) {
		logger.error("histogram invalid separators length", {
			count: separators.length,
			bins: bins.length
		})
		throw errors.new("histogram: separators length must equal bins length + 1")
	}
	for (let i = 1; i < separators.length; i++) {
		const current = separators[i]
		const prev = separators[i - 1]
		if (current === undefined || prev === undefined) {
			logger.error("histogram separators index out of range", { index: i })
			throw errors.new("histogram: separators index out of range")
		}
		if (!(current > prev)) {
			logger.error("histogram separators not strictly increasing", {
				index: i,
				prev,
				current
			})
			throw errors.new("histogram: separators must be strictly increasing")
		}
	}

	if (bins.length === 0) {
		logger.error("histogram empty bins", { count: bins.length })
		throw errors.new("histogram: bins must not be empty")
	}

	// Calculate tick interval from separators
	const deltas: number[] = []
	for (let i = 1; i < separators.length; i++) {
		const curr = separators[i]
		const prev = separators[i - 1]
		if (curr === undefined || prev === undefined) {
			logger.error("histogram separators index out of range", { index: i })
			throw errors.new("histogram: separators index out of range")
		}
		const d = curr - prev
		deltas.push(d)
	}
	const first = deltas[0] ?? 1
	const nonUniform = deltas.some((d) => Math.abs(d - first) > 1e-9)
	let tickInterval = first
	if (nonUniform) {
		// Use the smallest interval for non-uniform bins
		tickInterval = Math.min(...deltas)
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
			title,
			xAxis: {
				xScaleType: "numeric", // Set scale type - histograms use numeric separators, not categories
				label: xAxis.label,
				min: separators[0] ?? 0,
				max: separators[separators.length - 1] ?? 1,
				tickInterval,
				showGridLines: false,
				showTickLabels: true
			},
			yAxis: {
				label: yAxis.label,
				min: 0,
				max: yAxis.max,
				tickInterval: yAxis.tickInterval,
				showGridLines: true,
				showTickLabels: true
			}
		},
		canvas
	)

	// Draw histogram bars within the clipped region
	canvas.drawInClippedRegion((clippedCanvas) => {
		bins.forEach((b, i) => {
			const barHeight = (b.frequency / yAxis.max) * baseInfo.chartArea.height

			// Calculate bin boundaries from separators
			const leftSeparator = separators[i]
			const rightSeparator = separators[i + 1]
			if (leftSeparator === undefined || rightSeparator === undefined) {
				logger.error("histogram separator index out of range", {
					index: i,
					separatorsLength: separators.length
				})
				throw errors.new("histogram: separator index out of range")
			}

			// Convert separator values to SVG coordinates
			const x = baseInfo.toSvgX(leftSeparator)
			const rightX = baseInfo.toSvgX(rightSeparator)
			const binWidth = rightX - x
			const y = baseInfo.chartArea.top + baseInfo.chartArea.height - barHeight

			clippedCanvas.drawRect(x, y, binWidth, barHeight, {
				fill: theme.colors.highlightPrimary,
				stroke: theme.colors.axis,
				strokeWidth: theme.stroke.width.thin
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

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
