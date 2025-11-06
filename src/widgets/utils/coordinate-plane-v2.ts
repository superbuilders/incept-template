import {
	LABEL_AVG_CHAR_WIDTH_PX,
	PADDING,
	TICK_LABEL_FONT_PX,
	X_AXIS_MIN_LABEL_PADDING_PX,
	Y_AXIS_MIN_LABEL_GAP_PX
} from "@/widgets/utils/constants"
import { abbreviateMonth } from "@/widgets/utils/labels"
import type { Canvas } from "@/widgets/utils/layout"
import { selectAxisLabels } from "@/widgets/utils/layout"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"
import { theme } from "@/widgets/utils/theme"
import { buildTicks } from "@/widgets/utils/ticks"

// Re-export types that are needed for the render functions
export type AxisOptions = {
	label: string | null
	min: number
	max: number
	tickInterval: number
	showGridLines: boolean
}

// Removed unused function formatPiLabel

/**
 * Sets up a 4-quadrant Cartesian coordinate plane with centered axes using the Canvas API.
 */
export function setupCoordinatePlaneV2(
	data: {
		width: number
		height: number
		xAxis: AxisOptions
		yAxis: AxisOptions
		showQuadrantLabels: boolean
		title?: string | null // ADD THIS PROPERTY
	},
	canvas: Canvas
): {
	toSvgX: (val: number) => number
	toSvgY: (val: number) => number
	chartArea: { top: number; left: number; width: number; height: number }
} {
	const { width, height, xAxis, yAxis, showQuadrantLabels, title } = data // ADD title

	// ADD dynamic margin calculation logic
	const yAxisTickInfo = buildTicks(yAxis.min, yAxis.max, yAxis.tickInterval)
	const maxTickLabelWidth = Math.max(
		...yAxisTickInfo.labels.map((l) => l.length * LABEL_AVG_CHAR_WIDTH_PX)
	)
	const { height: wrappedTitleHeight } = estimateWrappedTextDimensions(
		yAxis.label ?? "",
		height,
		14
	)
	// Note: For v2 (4-quadrant), use similar logic but adjust if needed for centered axes.

	const TICK_LENGTH = 4
	const TICK_LABEL_PADDING = 8
	const AXIS_TITLE_PADDING = 12

	const dynamicLeftMargin =
		TICK_LENGTH +
		TICK_LABEL_PADDING +
		maxTickLabelWidth +
		AXIS_TITLE_PADDING +
		wrappedTitleHeight / 2 +
		PADDING

	// Calculate dynamic top margin based on title height
	let dynamicTopMargin = 40 // Default top margin
	if (title) {
		// Measure wrapped title dimensions with the available width
		const titleDimensions = estimateWrappedTextDimensions(
			title,
			width - dynamicLeftMargin - PADDING,
			18
		)
		// Add padding above and below the title
		dynamicTopMargin = Math.max(40, titleDimensions.height + 20 + 15) // top padding + title + bottom padding
	}

	// Define margins to create space for labels and ticks (titles float outside)
	const margin = {
		top: dynamicTopMargin,
		right: PADDING,
		bottom: 40,
		left: dynamicLeftMargin
	}
	const chartWidth = width - margin.left - margin.right
	const chartHeight = height - margin.top - margin.bottom

	const scaleX = chartWidth / (xAxis.max - xAxis.min)
	const scaleY = chartHeight / (yAxis.max - yAxis.min)

	const toSvgX = (val: number) => margin.left + (val - xAxis.min) * scaleX
	const toSvgY = (val: number) =>
		height - margin.bottom - (val - yAxis.min) * scaleY

	const zeroX = toSvgX(0)
	const zeroY = toSvgY(0)
	// Clamp axis anchors to chart edges when 0 is outside the visible domain
	const anchorXPos = Math.min(
		Math.max(zeroX, margin.left),
		margin.left + chartWidth
	)
	const anchorYPos = Math.min(
		Math.max(zeroY, margin.top),
		margin.top + chartHeight
	)

	const chartArea = {
		left: margin.left,
		top: margin.top,
		width: chartWidth,
		height: chartHeight
	}

	// ADD THIS BLOCK: Render title if it exists
	if (title) {
		// Position title above the chart area, centered horizontally
		canvas.drawWrappedText({
			x: margin.left + chartWidth / 2,
			y: 20, // Fixed top padding for title
			text: title,
			maxWidthPx: chartWidth,
			fontPx: 18,
			anchor: "middle",
			fill: theme.colors.title
		})
	}

	// Add a clipping path definition that other elements can reference.
	canvas.addDef(
		`<clipPath id="${canvas.clipId}"><rect x="${chartArea.left}" y="${chartArea.top}" width="${chartArea.width}" height="${chartArea.height}"/></clipPath>`
	)

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
	canvas.drawLine(margin.left, anchorYPos, width - margin.right, anchorYPos, {
		stroke: theme.colors.axis,
		strokeWidth: 1.5
	})
	canvas.drawLine(anchorXPos, margin.top, anchorXPos, height - margin.bottom, {
		stroke: theme.colors.axis,
		strokeWidth: 1.5
	})

	// X-axis ticks and labels
	const { values: xValues, labels: xLabels } = buildTicks(
		xAxis.min,
		xAxis.max,
		xAxis.tickInterval
	)
	const xTickPositions = xValues.map(toSvgX)

	const selectedXTicks = selectAxisLabels({
		labels: xLabels,
		positions: xTickPositions,
		axisLengthPx: chartWidth,
		orientation: "horizontal",
		fontPx: TICK_LABEL_FONT_PX,
		minGapPx: X_AXIS_MIN_LABEL_PADDING_PX
	})
	xValues.forEach((t, i) => {
		if (Math.abs(t) < 1e-9) return // Skip origin
		const x = toSvgX(t)
		canvas.drawLine(x, anchorYPos - 4, x, anchorYPos + 4, {
			stroke: theme.colors.axis,
			strokeWidth: 1
		})
		if (selectedXTicks.has(i)) {
			const label = xLabels[i]
			if (label !== undefined) {
				canvas.drawText({
					x: x,
					y: anchorYPos + 15,
					text: label,
					fill: theme.colors.axisLabel,
					anchor: "middle",
					fontPx: TICK_LABEL_FONT_PX
				})
			}
		}
	})

	// Y-axis ticks and labels
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
		minGapPx: Y_AXIS_MIN_LABEL_GAP_PX
	})
	yValues.forEach((t, i) => {
		if (Math.abs(t) < 1e-9) return // Skip origin
		const y = toSvgY(t)
		canvas.drawLine(anchorXPos - 4, y, anchorXPos + 4, y, {
			stroke: theme.colors.axis,
			strokeWidth: 1
		})
		if (selectedYTicks.has(i)) {
			const label = yLabels[i]
			if (label !== undefined) {
				canvas.drawText({
					x: anchorXPos - 8,
					y: y + 4,
					text: label,
					fill: theme.colors.axisLabel,
					anchor: "end",
					fontPx: TICK_LABEL_FONT_PX
				})
			}
		}
	})

	// Axis labels
	canvas.drawText({
		x: margin.left + chartWidth / 2,
		y: height - 5,
		text: abbreviateMonth(xAxis.label ?? ""),
		anchor: "middle",
		fill: theme.colors.axisLabel,
		fontPx: 14
	})

	// ADD new dynamic and wrapped axis label logic
	const yAxisTitleX =
		margin.left -
		(AXIS_TITLE_PADDING +
			maxTickLabelWidth +
			TICK_LABEL_PADDING +
			TICK_LENGTH +
			wrappedTitleHeight / 2)
	const yAxisTitleY = margin.top + chartHeight / 2
	canvas.drawWrappedText({
		x: yAxisTitleX,
		y: yAxisTitleY,
		text: abbreviateMonth(yAxis.label ?? ""),
		maxWidthPx: chartHeight,
		anchor: "middle",
		fill: theme.colors.axisLabel,
		fontPx: 14,
		rotate: { angle: -90, cx: yAxisTitleX, cy: yAxisTitleY }
	})

	// Quadrant labels
	if (showQuadrantLabels) {
		const hasPositiveX = xAxis.max > 0
		const hasNegativeX = xAxis.min < 0
		const hasPositiveY = yAxis.max > 0
		const hasNegativeY = yAxis.min < 0

		const qLabelStyle = {
			fill: "#ccc",
			fontPx: 18,
			anchor: "middle" as const,
			dominantBaseline: "middle" as const
		}

		// I: (+x, +y)
		if (hasPositiveX && hasPositiveY) {
			canvas.drawText({
				x: anchorXPos + chartWidth / 4,
				y: anchorYPos - chartHeight / 4,
				text: "I",
				...qLabelStyle
			})
		}
		// II: (-x, +y)
		if (hasNegativeX && hasPositiveY) {
			canvas.drawText({
				x: anchorXPos - chartWidth / 4,
				y: anchorYPos - chartHeight / 4,
				text: "II",
				...qLabelStyle
			})
		}
		// III: (-x, -y)
		if (hasNegativeX && hasNegativeY) {
			canvas.drawText({
				x: anchorXPos - chartWidth / 4,
				y: anchorYPos + chartHeight / 4,
				text: "III",
				...qLabelStyle
			})
		}
		// IV: (+x, -y)
		if (hasPositiveX && hasNegativeY) {
			canvas.drawText({
				x: anchorXPos + chartWidth / 4,
				y: anchorYPos + chartHeight / 4,
				text: "IV",
				...qLabelStyle
			})
		}
	}

	return { toSvgX, toSvgY, chartArea }
}
