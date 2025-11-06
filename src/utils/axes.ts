import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import {
	AXIS_STROKE_WIDTH_PX,
	AXIS_TITLE_FONT_PX,
	GRID_STROKE_WIDTH_PX,
	LABEL_AVG_CHAR_WIDTH_PX,
	TICK_LABEL_FONT_PX,
	TICK_LABEL_PADDING_PX,
	TICK_LENGTH_PX,
	X_AXIS_MIN_LABEL_PADDING_PX,
	X_AXIS_TITLE_PADDING_PX,
	Y_AXIS_MIN_LABEL_GAP_PX
} from "@/utils/constants"
import { type Canvas, selectAxisLabels } from "@/utils/layout"
import { theme } from "@/utils/theme"
import { buildTicks } from "@/utils/ticks"

export const ErrInvalidAxisDomain = errors.new(
	"axis domain min must be less than max"
)
export const ErrInvalidTickInterval = errors.new(
	"axis tick interval must be positive"
)
export const ErrInvalidCategories = errors.new(
	"axis categories must not be empty when provided"
)

type AxisDomain = { min: number; max: number }
// Removed unused MAX_TICKS constant

// New: required X-scale type (no default)
export type XScaleType = "numeric" | "categoryBand" | "categoryPoint"

// Base properties shared by both axes
type AxisSpecBase = {
	label: string
	showGridLines: boolean
	showTickLabels: boolean
	showTicks?: boolean
}

// --- X-Axis Specification as a Discriminated Union ---
type NumericXAxisSpec = AxisSpecBase & {
	placement: "bottom"
	xScaleType: "numeric"
	domain: { min: number; max: number } // Required for numeric
	tickInterval: number // Required for numeric
	labelFormatter?: (value: number) => string
	categories?: never // Disallow categories
}

type CategoryXAxisSpec = AxisSpecBase & {
	placement: "bottom"
	xScaleType: "categoryBand" | "categoryPoint"
	categories: string[] // Required for category
	domain?: never // Disallow numeric properties
	tickInterval?: never // Disallow numeric properties
}

export type AxisSpecX = NumericXAxisSpec | CategoryXAxisSpec

// --- Y-Axis Specification: Unchanged ---
export type AxisSpecY = AxisSpecBase & {
	placement: "left" | "right"
	domain: { min: number; max: number }
	tickInterval: number
	labelFormatter?: (value: number) => string
}

// Legacy AxisSpec for backward compatibility with Y-axis functions
export type AxisSpec = {
	domain: AxisDomain
	tickInterval: number
	label: string
	showGridLines: boolean
	showTickLabels: boolean
	showTicks?: boolean
	placement: "left" | "right" | "bottom" | "internalZero"
	categories?: string[]
	labelFormatter?: (value: number) => string
}

// MODIFIED: Return type no longer includes markup or extent registration.
export type AxisResult = {
	toSvg: (val: number) => number
	bandWidth?: number
}

// Removed unused function clampTickCount

// MODIFIED: Both functions must now accept a Canvas instance and return the simplified AxisResult.
export function computeAndRenderYAxis(
	spec: AxisSpec,
	chartArea: { top: number; left: number; width: number; height: number },
	// xAxisSpec: AxisSpec, // Unused parameter
	canvas: Canvas,
	// ADD THIS ARGUMENT
	yAxisLabelX: number
): AxisResult {
	const tickLength = spec.showTicks === false ? 0 : TICK_LENGTH_PX
	// Type guard function for categorical spec
	function isCategoricalSpec(
		spec: AxisSpec
	): spec is AxisSpec & { categories: string[] } {
		return !!(spec.categories && spec.categories.length > 0)
	}
	const isCategorical = isCategoricalSpec(spec)
	if (!isCategorical) {
		if (spec.domain.min >= spec.domain.max) {
			logger.error("invalid y-axis domain", { domain: spec.domain })
			throw errors.wrap(
				ErrInvalidAxisDomain,
				`y-axis min ${spec.domain.min} must be less than max ${spec.domain.max}`
			)
		}
		if (spec.tickInterval <= 0) {
			logger.error("invalid y-axis tick interval", {
				tickInterval: spec.tickInterval
			})
			throw errors.wrap(
				ErrInvalidTickInterval,
				"y-axis tickInterval must be positive"
			)
		}
	} else {
		if (!spec.categories || spec.categories.length === 0) {
			logger.error("invalid y-axis categories", {
				categories: spec.categories
			})
			throw errors.wrap(
				ErrInvalidCategories,
				"y-axis categories array cannot be empty"
			)
		}
	}

	const axisX = chartArea.left

	const yRange = spec.domain.max - spec.domain.min
	function toSvgYNumeric(val: number): number {
		const frac = (val - spec.domain.min) / yRange
		return chartArea.top + chartArea.height - frac * chartArea.height
	}

	let bandWidth: number | undefined
	let toSvgYCategorical: ((idx: number) => number) | undefined
	if (isCategorical) {
		const bw = chartArea.height / spec.categories.length
		bandWidth = bw
		toSvgYCategorical = (idx: number) => chartArea.top + (idx + 0.5) * bw
	}

	// MODIFIED: Replace all markup generation with canvas calls.
	canvas.drawLine(
		axisX,
		chartArea.top,
		axisX,
		chartArea.top + chartArea.height,
		{
			stroke: theme.colors.axis,
			strokeWidth: AXIS_STROKE_WIDTH_PX
		}
	)

	if (isCategorical) {
		const cats = spec.categories
		for (let i = 0; i < cats.length; i++) {
			const y = toSvgYCategorical?.(i)
			if (y === undefined) continue
			canvas.drawLine(axisX - tickLength, y, axisX, y, {
				stroke: theme.colors.axis,
				strokeWidth: AXIS_STROKE_WIDTH_PX
			})
			if (spec.showTickLabels) {
				const label = cats[i]
				canvas.drawText({
					x: axisX - TICK_LABEL_PADDING_PX,
					y: y + 4,
					text: label,
					anchor: "end",
					fontPx: TICK_LABEL_FONT_PX,
					fill: theme.colors.axisLabel
				})
			}
		}
	} else {
		const { values, labels } = buildTicks(
			spec.domain.min,
			spec.domain.max,
			spec.tickInterval
		)
		const tickPositions = values.map(toSvgYNumeric)

		const selected = selectAxisLabels({
			labels,
			positions: tickPositions,
			axisLengthPx: chartArea.height,
			orientation: "vertical",
			fontPx: TICK_LABEL_FONT_PX,
			minGapPx: Y_AXIS_MIN_LABEL_GAP_PX
		})

		values.forEach((t, i) => {
			const y = toSvgYNumeric(t)
			// Draw the tick mark (length may be 0 if disabled)
			canvas.drawLine(axisX - tickLength, y, axisX, y, {
				stroke: theme.colors.axis,
				strokeWidth: AXIS_STROKE_WIDTH_PX
			})

			if (spec.showTickLabels && selected.has(i)) {
				const label = spec.labelFormatter ? spec.labelFormatter(t) : labels[i]
				if (label !== undefined) {
					canvas.drawText({
						x: axisX - TICK_LABEL_PADDING_PX,
						y: y + 4,
						text: label,
						anchor: "end",
						fontPx: TICK_LABEL_FONT_PX,
						fill: theme.colors.axisLabel
					})
				}
			}

			// Always render horizontal gridlines for all ticks when enabled, including at y = 0
			if (spec.showGridLines) {
				canvas.drawLine(
					chartArea.left,
					y,
					chartArea.left + chartArea.width,
					y,
					{
						stroke: theme.colors.gridMajor,
						strokeWidth: GRID_STROKE_WIDTH_PX
					}
				)
			}
		})
	}

	// Y-axis title (rotated)
	const yAxisLabelY = chartArea.top + chartArea.height / 2
	canvas.drawWrappedText({
		x: yAxisLabelX,
		y: yAxisLabelY,
		text: spec.label,
		maxWidthPx: chartArea.height, // Max width for wrapped text is chart height
		rotate: { angle: -90, cx: yAxisLabelX, cy: yAxisLabelY },
		fontPx: AXIS_TITLE_FONT_PX,
		anchor: "middle",
		// THIS IS THE FIX: Align the text block vertically to its center.
		dominantBaseline: "middle",
		fill: theme.colors.axisLabel
	})

	// REMOVED: `registerExtents` function is no longer needed.
	return {
		toSvg: isCategorical ? (toSvgYCategorical ?? (() => 0)) : toSvgYNumeric,
		bandWidth
	}
}

// MODIFIED: Apply the same transformation to computeAndRenderXAxis.
export function computeAndRenderXAxis(
	spec: AxisSpecX,
	chartArea: { top: number; left: number; width: number; height: number },
	canvas: Canvas
): AxisResult {
	const tickLength = spec.showTicks === false ? 0 : TICK_LENGTH_PX
	// The `xScaleType` is guaranteed to exist by the type system.
	// Validation is now primarily handled by the discriminated union
	switch (spec.xScaleType) {
		case "numeric":
			// `spec.domain` and `spec.tickInterval` are now guaranteed to be present.
			if (spec.domain.min >= spec.domain.max) {
				logger.error("invalid x-axis domain for numeric scale", {
					domain: spec.domain
				})
				throw errors.wrap(
					ErrInvalidAxisDomain,
					`x-axis min ${spec.domain.min} must be less than max ${spec.domain.max}`
				)
			}
			if (spec.tickInterval <= 0) {
				logger.error("invalid x-axis tick interval for numeric scale", {
					tickInterval: spec.tickInterval
				})
				throw errors.wrap(
					ErrInvalidTickInterval,
					"x-axis tickInterval must be positive"
				)
			}
			break
		case "categoryBand":
		case "categoryPoint":
			// `spec.categories` is now guaranteed to be present.
			if (spec.categories.length === 0) {
				logger.error("invalid x-axis categories", {
					categories: spec.categories,
					xScaleType: spec.xScaleType
				})
				throw errors.wrap(
					ErrInvalidCategories,
					`${spec.xScaleType} requires non-empty categories`
				)
			}
			break
	}

	const axisY = chartArea.top + chartArea.height

	canvas.drawLine(
		chartArea.left,
		axisY,
		chartArea.left + chartArea.width,
		axisY,
		{
			stroke: theme.colors.axis,
			strokeWidth: AXIS_STROKE_WIDTH_PX
		}
	)

	let toSvgX: (val: number) => number
	let bandWidth: number | undefined

	switch (spec.xScaleType) {
		case "numeric": {
			const xRange = spec.domain.max - spec.domain.min
			toSvgX = (val: number) => {
				const frac = (val - spec.domain.min) / xRange
				return chartArea.left + frac * chartArea.width
			}
			break
		}
		case "categoryBand": {
			const N = spec.categories.length
			bandWidth = chartArea.width / N
			toSvgX = (i: number) => chartArea.left + (i + 0.5) * (bandWidth ?? 0)
			break
		}
		case "categoryPoint": {
			const N = spec.categories.length
			const step = N <= 1 ? 0 : chartArea.width / (N - 1)
			toSvgX = (i: number) => {
				if (N === 1) {
					// Single point is centered in the chart area
					return chartArea.left + chartArea.width / 2
				}
				return chartArea.left + i * step
			}
			break
		}
	}

	let tickLabels: string[]
	let tickPositions: number[]
	let tickValues: number[] | undefined

	switch (spec.xScaleType) {
		case "categoryBand":
		case "categoryPoint": {
			tickLabels = spec.categories
			tickPositions = spec.categories.map((_, i) => toSvgX(i))
			break
		}
		case "numeric": {
			const { values, labels } = buildTicks(
				spec.domain.min,
				spec.domain.max,
				spec.tickInterval
			)
			tickLabels = labels
			tickPositions = values.map(toSvgX)
			tickValues = values
			break
		}
	}

	const selected = selectAxisLabels({
		labels: tickLabels,
		positions: tickPositions,
		axisLengthPx: chartArea.width,
		orientation: "horizontal",
		fontPx: TICK_LABEL_FONT_PX,
		minGapPx: X_AXIS_MIN_LABEL_PADDING_PX,
		avgCharWidthPx: LABEL_AVG_CHAR_WIDTH_PX
	})

	for (let i = 0; i < tickPositions.length; i++) {
		const x = tickPositions[i]
		if (x === undefined) continue
		canvas.drawLine(x, axisY, x, axisY + tickLength, {
			stroke: theme.colors.axis,
			strokeWidth: AXIS_STROKE_WIDTH_PX
		})
		if (spec.showTickLabels && selected.has(i)) {
			const labelValue = tickValues?.[i]
			const labelText = tickLabels?.[i]
			if (labelValue === undefined && labelText === undefined) continue

			const label =
				spec.xScaleType === "numeric" &&
				spec.labelFormatter &&
				labelValue !== undefined
					? spec.labelFormatter(labelValue)
					: labelText
			canvas.drawText({
				x: x,
				y: axisY + tickLength + TICK_LABEL_PADDING_PX,
				text: label,
				anchor: "middle",
				dominantBaseline: "hanging",
				fontPx: TICK_LABEL_FONT_PX,
				fill: theme.colors.axisLabel
			})
		}
		// Gridline logic for numeric axes only
		if (spec.xScaleType === "numeric" && spec.showGridLines) {
			canvas.drawLine(x, chartArea.top, x, chartArea.top + chartArea.height, {
				stroke: theme.colors.gridMajor,
				strokeWidth: GRID_STROKE_WIDTH_PX
			})
		}
	}

	const xAxisLabelY =
		axisY +
		TICK_LENGTH_PX +
		TICK_LABEL_PADDING_PX +
		TICK_LABEL_FONT_PX +
		X_AXIS_TITLE_PADDING_PX
	canvas.drawWrappedText({
		x: chartArea.left + chartArea.width / 2,
		y: xAxisLabelY,
		text: spec.label,
		maxWidthPx: chartArea.width,
		anchor: "middle",
		fontPx: AXIS_TITLE_FONT_PX,
		fill: theme.colors.axisLabel
	})

	return { toSvg: toSvgX, bandWidth }
}
