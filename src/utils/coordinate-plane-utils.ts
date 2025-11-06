import {
	type AxisSpec,
	type AxisSpecX,
	computeAndRenderXAxis,
	computeAndRenderYAxis
} from "@/utils/axes"
import {
	AXIS_TITLE_FONT_PX,
	AXIS_TITLE_PADDING_PX,
	CHART_TITLE_BOTTOM_PADDING_PX,
	CHART_TITLE_FONT_PX,
	LABEL_AVG_CHAR_WIDTH_PX,
	TICK_LABEL_PADDING_PX,
	TICK_LENGTH_PX
} from "@/utils/constants"
import type { Canvas } from "@/utils/layout"
import { estimateWrappedTextDimensions } from "@/utils/text"
import { theme } from "@/utils/theme"
import { buildTicks } from "@/utils/ticks"

// Coordinate plane specific types
export type AxisOptionsFromWidgetX =
	| {
			xScaleType: "numeric"
			label: string
			min: number // Required for numeric
			max: number // Required for numeric
			tickInterval: number // Required for numeric
			showGridLines: boolean
			showTickLabels: boolean
			showTicks?: boolean
			labelFormatter?: (value: number) => string
	  }
	| {
			xScaleType: "categoryBand" | "categoryPoint"
			label: string
			categories: string[] // Required for category
			showGridLines: boolean
			showTickLabels: boolean
			showTicks?: boolean
	  }

export type AxisOptionsFromWidgetY = {
	label: string
	min: number
	max: number
	tickInterval: number
	showGridLines: boolean
	showTickLabels: boolean
	showTicks?: boolean
	labelFormatter?: (value: number) => string
}

/**
 * Sets up a coordinate plane with axes, title, and gridlines using Canvas API.
 * This function receives a canvas and draws onto it, returning scaling functions.
 */
export function setupCoordinatePlaneBaseV2(
	data: {
		width: number
		height: number
		title: string | null
		xAxis: AxisOptionsFromWidgetX
		yAxis: AxisOptionsFromWidgetY
	},
	canvas: Canvas
): {
	toSvgX: (val: number) => number
	toSvgY: (val: number) => number
	chartArea: { top: number; left: number; width: number; height: number }
	bandWidth?: number
} {
	// 1. Fix chartArea to the full input size. No padding deductions.
	const chartArea = {
		top: 0,
		left: 0,
		width: data.width,
		height: data.height
	}

	// 2. Measure and position title (if present) to hover above the chartArea.
	if (data.title) {
		const measured = estimateWrappedTextDimensions(
			data.title,
			chartArea.width,
			CHART_TITLE_FONT_PX
		)
		// Position the title's bottom edge just above the chart area's top.
		const titleY = chartArea.top - CHART_TITLE_BOTTOM_PADDING_PX
		const titleX = chartArea.left + chartArea.width / 2

		// drawWrappedText anchors text from the top by default. We adjust the Y position
		// so the entire text block appears above chartArea.top.
		const adjustedTitleY = titleY - measured.height

		canvas.drawWrappedText({
			x: titleX,
			y: adjustedTitleY,
			text: data.title,
			maxWidthPx: chartArea.width,
			fontPx: CHART_TITLE_FONT_PX,
			anchor: "middle",
			dominantBaseline: "hanging",
			fill: theme.colors.title
		})
	}

	// 3. Measure Y-axis components to calculate the total required left-side offset.
	const yTicks = buildTicks(
		data.yAxis.min,
		data.yAxis.max,
		data.yAxis.tickInterval
	)
	const maxYTickWidth = Math.max(
		0,
		...yTicks.labels.map((l) => l.length * LABEL_AVG_CHAR_WIDTH_PX)
	)
	// Since Y-axis title is rotated, its "width" is its measured height.
	const yLabelDimensions = estimateWrappedTextDimensions(
		data.yAxis.label,
		chartArea.height,
		AXIS_TITLE_FONT_PX
	)
	const yLabelWidth = yLabelDimensions.height

	const leftOffset =
		yLabelWidth +
		AXIS_TITLE_PADDING_PX +
		TICK_LABEL_PADDING_PX +
		TICK_LENGTH_PX +
		maxYTickWidth
	// The Y-axis title's final X position is computed to place it correctly to the left of all other axis hardware.
	const yAxisLabelX = chartArea.left - (leftOffset - yLabelWidth / 2)

	// Y-axis uses a legacy spec object for now.
	const yAxisLegacySpec: AxisSpec = {
		...data.yAxis,
		placement: "left",
		domain: { min: data.yAxis.min, max: data.yAxis.max }
	}

	const xAxisSpec: AxisSpecX =
		data.xAxis.xScaleType === "numeric"
			? {
					...data.xAxis,
					placement: "bottom" as const,
					domain: { min: data.xAxis.min, max: data.xAxis.max }
				}
			: {
					...data.xAxis,
					placement: "bottom" as const
				}

	// The `computeAndRender...` functions will draw relative to the chartArea edges.
	// `yAxisLabelX` is passed explicitly to position the Y-axis title correctly in the negative space.
	const yRes = computeAndRenderYAxis(
		yAxisLegacySpec,
		chartArea,
		canvas,
		yAxisLabelX
	)
	const xRes = computeAndRenderXAxis(xAxisSpec, chartArea, canvas)

	// Clip path remains tied to the fixed chartArea.
	canvas.addDef(
		`<clipPath id="${canvas.clipId}"><rect x="${chartArea.left}" y="${chartArea.top}" width="${chartArea.width}" height="${chartArea.height}"/></clipPath>`
	)

	// Scaling functions are now relative to the fixed chartArea.
	const toSvgY = yRes.toSvg
	const toSvgX = xRes.toSvg
	const bandWidth = xRes.bandWidth

	return { toSvgX, toSvgY, chartArea, bandWidth }
}
