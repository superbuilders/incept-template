import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { LABEL_AVG_CHAR_WIDTH_PX } from "@/widgets/utils/constants"
import type { Path2D } from "@/widgets/utils/path-builder"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"

// NEW: 2D extents and finalized SVG types
export type Extents2D = {
	minX: number
	maxX: number
	minY: number
	maxY: number
}

export type FinalizedSvg = {
	svgBody: string
	vbMinX: number
	vbMinY: number
	width: number
	height: number
}

// NEW: Options for constructing a Canvas implementation
export interface CanvasOptions {
	chartArea: { left: number; top: number; width: number; height: number }
	fontPxDefault: number
	lineHeightDefault: number
}

// --- REMOVED: Legacy type for backward compatibility ---
// export type Extents = { minX: number; maxX: number }

// NEW: Full Canvas interface as the single source of truth for rendering.
// Text drawing must account for rotation and baseline when updating extents.
// All methods append markup and synchronously update shared Extents2D.
export interface Canvas {
	// Geometry (clipped rendering region)
	clipId: string
	// Scoped clipping method - use this instead of manual SVG string construction
	drawInClippedRegion(renderFn: (clippedCanvas: Canvas) => void): void

	// Text primitives
	drawText(opts: {
		x: number
		y: number
		text: string
		anchor?: "start" | "middle" | "end"
		dominantBaseline?: "hanging" | "middle" | "baseline"
		fontPx?: number
		fontWeight?:
			| "100"
			| "200"
			| "300"
			| "400"
			| "500"
			| "600"
			| "700"
			| "800"
			| "900"
		paintOrder?: "stroke fill"
		stroke?: string
		strokeWidth?: number | string
		fill?: string
		opacity?: number
		strokeOpacity?: number
		fillOpacity?: number
		transform?: string
		rotate?: { angle: number; cx: number; cy: number }
	}): void

	drawWrappedText(opts: {
		x: number
		y: number
		text: string
		className?: string
		maxWidthPx: number
		anchor?: "start" | "middle" | "end"
		fontPx?: number
		lineHeight?: number
		fontWeight?:
			| "100"
			| "200"
			| "300"
			| "400"
			| "500"
			| "600"
			| "700"
			| "800"
			| "900"
		paintOrder?: "stroke fill"
		stroke?: string
		strokeWidth?: number | string
		fill?: string
		opacity?: number
		strokeOpacity?: number
		fillOpacity?: number
		transform?: string
		rotate?: { angle: number; cx: number; cy: number }
		dominantBaseline?:
			| "auto"
			| "alphabetic"
			| "hanging"
			| "ideographic"
			| "mathematical"
			| "middle"
	}): void

	// Basic shapes
	drawLine(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		style: {
			stroke: string
			strokeWidth: number
			dash?: string
			strokeLinecap?: "butt" | "round" | "square"
			strokeLinejoin?: "miter" | "round" | "bevel"
			strokeMiterlimit?: number
			markerStart?: string
			markerMid?: string
			markerEnd?: string
			opacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void

	drawCircle(
		cx: number,
		cy: number,
		r: number,
		style: {
			fill?: string
			stroke?: string
			strokeWidth?: number
			dash?: string
			fillPatternId?: string
			opacity?: number
			fillOpacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void

	drawRect(
		x: number,
		y: number,
		w: number,
		h: number,
		style: {
			fill?: string
			stroke?: string
			strokeWidth?: number
			dash?: string
			fillPatternId?: string
			opacity?: number
			fillOpacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void

	drawEllipse(
		cx: number,
		cy: number,
		rx: number,
		ry: number,
		style: {
			fill?: string
			stroke?: string
			strokeWidth?: number
			dash?: string
			fillPatternId?: string
			opacity?: number
			fillOpacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void

	// Complex paths (unclipped)
	drawPath(
		path: Path2D,
		style: {
			fill?: string
			stroke?: string
			strokeWidth?: number
			dash?: string
			strokeLinecap?: "butt" | "round" | "square"
			strokeLinejoin?: "miter" | "round" | "bevel"
			strokeMiterlimit?: number
			fillRule?: "nonzero" | "evenodd"
			markerStart?: string
			markerMid?: string
			markerEnd?: string
			opacity?: number
			fillOpacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void

	// Polygon/polyline convenience (arrays for robust extent tracking)
	drawPolygon(
		points: Array<{ x: number; y: number }>,
		style: {
			fill?: string
			stroke?: string
			strokeWidth?: number
			dash?: string
			fillRule?: "nonzero" | "evenodd"
			strokeLinejoin?: "miter" | "round" | "bevel"
			strokeMiterlimit?: number
			opacity?: number
			fillOpacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void

	drawPolyline(
		points: Array<{ x: number; y: number }>,
		style: {
			stroke: string
			strokeWidth: number
			dash?: string
			strokeLinecap?: "butt" | "round" | "square"
			strokeLinejoin?: "miter" | "round" | "bevel"
			strokeMiterlimit?: number
			opacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void

	// Complex content
	drawForeignObject(opts: {
		x: number
		y: number
		width: number
		height: number
		content: string
		transform?: string
	}): void

	// Images
	drawImage(opts: {
		x: number
		y: number
		width: number
		height: number
		href: string
		preserveAspectRatio?: string
		opacity?: number
		transform?: string
	}): void

	// Legends/blocks
	drawLegendBlock(opts: {
		startX: number
		startY: number
		rows: Array<{
			sample: {
				stroke: string
				strokeWidth: number
				dash?: string
				marker?: "circle" | "square"
			}
			label: string
		}>
		rowGapPx: number
		labelFontPx?: number
		sampleLengthPx?: number
	}): void

	// Advanced SVG structure utilities
	addDef(def: string): void // append raw content to <defs>
	addStyle(cssRules: string): void // append a <style> block to <defs>
	withTransform(transform: string, renderFn: () => void): void // wrap a <g transform="..."> around renderFn output

	// Patterns and gradients helpers
	addHatchPattern(opts: {
		id: string
		color: string
		strokeWidth: number
		spacing?: number
		angleDeg?: number
	}): void
	addLinearGradient(opts: {
		id: string
		stops: Array<{ offset: string; color: string }>
		x1?: string
		y1?: string
		x2?: string
		y2?: string
		gradientUnits?: "objectBoundingBox" | "userSpaceOnUse"
	}): void
	addRadialGradient(opts: {
		id: string
		stops: Array<{ offset: string; color: string }>
		cx?: string
		cy?: string
		r?: string
		fx?: string
		fy?: string
		gradientUnits?: "objectBoundingBox" | "userSpaceOnUse"
	}): void

	// Finalization: derive final size strictly from tracked Extents2D; never rescale chartArea
	finalize(padPx: number): FinalizedSvg
}

// --- REMOVED: All deprecated 1D extent tracking functions ---
// export function initExtents(initialWidth: number): Extents
// export function includeText(ext: Extents, absoluteX: number, text: string, anchor: "start" | "middle" | "end", avgCharWidthPx = 7): void
// export function includePointX(ext: Extents, absoluteX: number): void
// export function computeDynamicWidth(ext: Extents, _height: number, pad = 10): { vbMinX: number; vbMaxX: number; dynamicWidth: number }

export interface AxisPlacementOptions {
	axisPlacement: "leftEdge" | "internalZero"
	titlePadding?: number
	tickLength?: number
	labelPadding?: number
	axisTitleFontPx?: number
}

export function calculateYAxisLayoutAxisAware(
	yAxis: { max: number; min: number; tickInterval: number; label: string },
	xAxis: { min: number; max: number },
	svgWidth: number,
	chartHeightPx: number,
	pads: { top: number; right: number; bottom: number },
	opts: AxisPlacementOptions
): { leftMargin: number; yAxisLabelX: number; anchorX: number } {
	const T = opts.tickLength ?? 5
	const LP = opts.labelPadding ?? 8
	const TP = opts.titlePadding ?? 12
	const TITLE_PX = opts.axisTitleFontPx ?? 16

	const { height: wrappedTitleHeight } = estimateWrappedTextDimensions(
		yAxis.label,
		chartHeightPx,
		TITLE_PX,
		1.1
	)

	let maxTickLabelWidth = 0
	if (yAxis.tickInterval > 0) {
		for (let t = yAxis.min; t <= yAxis.max; t += yAxis.tickInterval) {
			const s = String(t)
			maxTickLabelWidth = Math.max(maxTickLabelWidth, s.length * 7) // Heuristic
		}
	}

	const spaceLeftOfAnchor =
		T + LP + maxTickLabelWidth + TP + wrappedTitleHeight / 2

	const xRange = xAxis.max - xAxis.min
	const f =
		opts.axisPlacement === "internalZero" && xRange > 0
			? (0 - xAxis.min) / xRange
			: 0

	let leftMargin: number
	if (f >= 1) {
		leftMargin = Math.ceil(spaceLeftOfAnchor)
	} else {
		const denom = 1 - f
		leftMargin = Math.ceil(
			(spaceLeftOfAnchor - f * (svgWidth - pads.right)) / denom
		)
	}

	if (!Number.isFinite(leftMargin) || leftMargin < 0) {
		leftMargin = Math.ceil(spaceLeftOfAnchor)
	}

	const chartWidth = svgWidth - leftMargin - pads.right
	const anchorX = leftMargin + f * chartWidth
	const yAxisLabelX =
		anchorX - (T + LP + maxTickLabelWidth + TP + wrappedTitleHeight / 2)

	return { leftMargin, yAxisLabelX, anchorX }
}

/**
 * Calculates the required bottom margin and X-axis title position for a chart.
 * @param hasTickLabels - Whether the chart has tick labels on the X-axis
 * @param titlePadding - Optional spacing between tick labels and title (default: 25px)
 * @returns An object containing the calculated `bottomMargin` and `xAxisTitleY` position.
 */
export function calculateXAxisLayout(
	hasTickLabels = true,
	titlePadding = 25
): { bottomMargin: number; xAxisTitleY: number } {
	const TICK_LENGTH = 5
	const TICK_LABEL_HEIGHT = 16 // Height of tick label text
	const TITLE_HEIGHT = 16 // Height of axis title text

	if (hasTickLabels) {
		const bottomMargin =
			TICK_LENGTH + TICK_LABEL_HEIGHT + titlePadding + TITLE_HEIGHT
		const xAxisTitleY = TICK_LENGTH + TICK_LABEL_HEIGHT + titlePadding
		return { bottomMargin, xAxisTitleY }
	}

	// No tick labels case
	const bottomMargin = TICK_LENGTH + titlePadding + TITLE_HEIGHT
	const xAxisTitleY = TICK_LENGTH + titlePadding / 2
	return { bottomMargin, xAxisTitleY }
}

/**
 * Calculates the required right margin and right Y-axis title position for a chart.
 * @param yAxisRight - The right Y-axis configuration object (null if no right axis).
 * @param titlePadding - Optional spacing between tick labels and title (default: 20px)
 * @returns An object containing the calculated `rightMargin` and `rightYAxisLabelX` position.
 */
export function calculateRightYAxisLayout(
	yAxisRight: {
		max: number
		min: number
		tickInterval: number
		label: string
	} | null,
	titlePadding = 20
): { rightMargin: number; rightYAxisLabelX: number } {
	if (!yAxisRight) {
		return { rightMargin: 20, rightYAxisLabelX: 0 } // Default right margin when no right axis
	}

	const AVG_CHAR_WIDTH_PX = 8 // Estimated width for an average character
	const TICK_LENGTH = 5
	const LABEL_PADDING = 10 // Space between ticks and labels
	const AXIS_TITLE_HEIGHT = 16 // Font size of the title

	let maxLabelWidth = 0

	// Determine the longest tick label string
	for (
		let t = yAxisRight.min;
		t <= yAxisRight.max;
		t += yAxisRight.tickInterval
	) {
		const label = String(t)
		const estimatedWidth = label.length * AVG_CHAR_WIDTH_PX
		if (estimatedWidth > maxLabelWidth) {
			maxLabelWidth = estimatedWidth
		}
	}

	const rightMargin =
		TICK_LENGTH +
		LABEL_PADDING +
		maxLabelWidth +
		titlePadding +
		AXIS_TITLE_HEIGHT
	const rightYAxisLabelX =
		TICK_LENGTH +
		LABEL_PADDING +
		maxLabelWidth +
		titlePadding +
		AXIS_TITLE_HEIGHT / 2

	return { rightMargin, rightYAxisLabelX }
}

/**
 * NEW: Calculates the required left margin for a horizontal bar chart's categorical Y-axis.
 * It measures the actual category labels to ensure the margin is always sufficient.
 *
 * @param yAxisLabels - An array of the string labels for the Y-axis categories.
 * @param labelPadding - Optional spacing between the axis line and the labels (default: 10px).
 * @returns An object containing the calculated `leftMargin`.
 */
export function calculateHorizontalBarChartYAxisLayout(
	yAxisLabels: string[],
	labelPadding = 10
): { leftMargin: number } {
	const AVG_CHAR_WIDTH_PX = 8 // Consistent average character width for estimation.

	// 1. Find the maximum width required for any of the category labels.
	const maxTickLabelWidth = yAxisLabels.reduce((maxWidth, label) => {
		const estimatedWidth = label.length * AVG_CHAR_WIDTH_PX
		return Math.max(maxWidth, estimatedWidth)
	}, 0)

	// 2. The left margin is the sum of the space for the longest label and its padding.
	const leftMargin = maxTickLabelWidth + labelPadding

	return { leftMargin }
}

// --- REMOVED: createChartClipPath and wrapInClippedGroup (replaced by Canvas.addDef and Canvas.wrapClipped) ---

/**
 * Estimates how many lines a title will wrap to based on available width.
 * Accounts for the wrapping logic in renderWrappedText.
 */
function estimateTitleLines(
	title: string,
	maxWidthPx: number,
	avgCharWidthPx = 8
): number {
	// Handle parenthetical splitting (from renderWrappedText logic)
	const titlePattern = /^(.*)\s+(\(.+\))$/
	const match = title.match(titlePattern)
	if (match?.[1] && match[2] && title.length > 36) {
		return 2 // Will be split into main title + parenthetical
	}

	// Estimate width and determine if wrapping is needed
	const estimatedWidth = title.length * avgCharWidthPx
	if (maxWidthPx && estimatedWidth > maxWidthPx) {
		const words = title.split(/\s+/).filter(Boolean)
		if (words.length > 1) {
			// renderWrappedText splits into 2 balanced lines
			return 2
		}
		// Single very long word - may overflow but renderWrappedText keeps as 1 line
		return 1
	}

	return 1 // Single line
}

/**
 * Calculates dynamic title positioning with proper spacing that adapts to title length.
 * Provides bulletproof title placement that prevents clipping regardless of title length.
 * @param title - The title text to measure
 * @param maxTitleWidth - Available width for the title (typically width - 60px)
 * @param customTopMargin - Override for special cases (optional)
 * @returns Object with titleY position, topMargin, and estimated title height
 */
export function calculateTitleLayout(
	title?: string,
	maxTitleWidth?: number,
	customTopMargin?: number
): {
	titleY: number
	topMargin: number
	estimatedTitleHeight: number
} {
	// If no title provided, use conservative defaults
	if (!title) {
		const topMargin = customTopMargin || 65
		return { titleY: 15, topMargin, estimatedTitleHeight: 16 }
	}

	const fontSize = 16 // Title font size in pixels
	const lineHeight = 1.1 // Line height multiplier from renderWrappedText
	const titleBufferTop = 15 // Space above title for proper rendering
	const titleBufferBottom = 15 // Minimum space between title and chart

	// Estimate how many lines the title will actually wrap to
	const estimatedLines = maxTitleWidth
		? estimateTitleLines(title, maxTitleWidth)
		: 1

	// Calculate actual title height including line spacing
	const estimatedTitleHeight = fontSize * estimatedLines * lineHeight

	// Calculate required top margin: buffer + title height + buffer
	const calculatedTopMargin =
		titleBufferTop + estimatedTitleHeight + titleBufferBottom

	// Use custom margin if provided, otherwise ensure minimum spacing
	const topMargin =
		customTopMargin || Math.max(65, Math.ceil(calculatedTopMargin))

	return {
		titleY: titleBufferTop,
		topMargin,
		estimatedTitleHeight
	}
}

/**
 * Calculates layout for a dedicated line legend area positioned outside the chart.
 * Prevents label conflicts with curves, points, and axis elements.
 * @param lineCount - Number of line labels to accommodate
 * @param chartRight - Right edge of chart area (pad.left + chartWidth)
 * @param chartTop - Top edge of chart area (pad.top)
 * @param legendSpacing - Vertical spacing between legend items (default: 18px)
 * @returns Object with legend positioning and required right margin
 */
export function calculateLineLegendLayout(
	_lineCount: number,
	chartRight: number,
	chartTop: number,
	legendSpacing = 18
): {
	legendAreaX: number
	legendStartY: number
	legendSpacing: number
	requiredRightMargin: number
} {
	const legendPadding = 15 // Space between chart and legend
	const maxLabelWidth = 80 // Estimated max width for line labels
	const legendAreaX = chartRight + legendPadding
	const legendStartY = chartTop + 10 // Small offset from chart top
	const requiredRightMargin = legendPadding + maxLabelWidth + 10 // Extra buffer

	return {
		legendAreaX,
		legendStartY,
		legendSpacing,
		requiredRightMargin
	}
}

/**
 * Selects a deterministic, non-overlapping subset of labels for an axis.
 * This is the unified function for all numeric and categorical axes.
 * It ensures visually uniform spacing by calculating a single `step` and applying it
 * consistently across all candidate labels.
 */
export function selectAxisLabels(inputs: {
	labels: string[]
	positions: number[]
	axisLengthPx: number
	orientation: "horizontal" | "vertical"
	fontPx: number
	minGapPx: number
	avgCharWidthPx?: number
}): Set<number> {
	const { labels, positions, axisLengthPx, orientation, fontPx, minGapPx } =
		inputs
	const avgCharWidthPx = inputs.avgCharWidthPx ?? LABEL_AVG_CHAR_WIDTH_PX

	if (labels.length !== positions.length) {
		logger.error("labels and positions arrays must have the same length", {
			labels: labels.length,
			positions: positions.length
		})
		throw errors.new("mismatched input lengths for selectAxisLabels")
	}

	const n = labels.length
	if (n === 0) {
		return new Set()
	}

	const sizesPx =
		orientation === "horizontal"
			? labels.map((label) => (label ? label.length * avgCharWidthPx : 0))
			: labels.map(() => fontPx)

	const nonEmptyIndices = labels.map((_, i) => i).filter((i) => !!labels[i])

	if (nonEmptyIndices.length === 0) {
		return new Set()
	}

	const avgSize =
		nonEmptyIndices.reduce((sum, i) => sum + (sizesPx[i] ?? 0), 0) /
		nonEmptyIndices.length

	const maxLabelsThatCanFit = Math.floor(axisLengthPx / (avgSize + minGapPx))

	if (nonEmptyIndices.length <= maxLabelsThatCanFit) {
		return new Set(nonEmptyIndices)
	}

	const step = Math.ceil(nonEmptyIndices.length / maxLabelsThatCanFit)
	const selected = new Set<number>()
	for (let i = 0; i < nonEmptyIndices.length; i += step) {
		const idx = nonEmptyIndices[i]
		if (idx !== undefined) {
			selected.add(idx)
		}
	}

	return selected
}
