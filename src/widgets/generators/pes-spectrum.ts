import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Photoelectron spectroscopy (PES) spectrum generator

const PeakSchema = z
	.object({
		// Binding energy in MJ/mol (0..1000). Higher energy is placed to the LEFT per PES convention.
		energy: z
			.number()
			.min(0)
			.max(1000)
			.describe(
				"Binding energy in MJ/mol (0-1000). Positioned with higher values to the left."
			),
		// Peak height in discrete units of the horizontal grid (1..7)
		heightUnits: z
			.number()
			.int()
			.min(1)
			.max(7)
			.describe(
				"Peak height measured in grid units (1-7). 7 reaches the top grid line."
			),
		// Optional label shown above the peak tip. Use empty string to omit.
		topLabel: z
			.string()
			.nullable()
			.describe(
				"Label shown above the peak apex. Do not fill out this field if you do not need a label as it is nullable"
			)
	})
	.strict()
	.describe(
		"Defines a single PES peak: binding energy, height in units, and optional top label."
	)

export const PESSpectrumPropsSchema = z
	.object({
		type: z.literal("pesSpectrum"),
		title: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Optional chart title to display above the plot. If the graph does not have a title, do not include this field or pass an empty string."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		yAxisLabel: z.string().describe("The label for the vertical axis."),
		// Peaks to render, left-to-right positioning derived from their energy values.
		peaks: z
			.array(PeakSchema)
			.min(1)
			.max(20)
			.describe(
				"Array of PES peaks. Order is irrelevant for layout; positions come from energy values."
			)
	})
	.strict()
	.describe(
		"Renders an AP Chemistry-style PES spectrum with fixed axis styling, 8 horizontal grid lines, reversed binding energy scale, and narrow vertical peak markers with optional top labels."
	)

export type PESSpectrumProps = z.infer<typeof PESSpectrumPropsSchema>

// Axis styling constants tuned to match the provided SVGs
const GRID_LINE_COUNT = 8 // includes top and bottom lines => 7 intervals
const X_TICK_LABELS = ["1000", "100", "10", "1", "0"]
// Shape parameter to reduce compression near higher-decade bounds (1.0 = pure log)
const LOG_GAMMA = 1.5

export const generatePESSpectrum: WidgetGenerator<
	typeof PESSpectrumPropsSchema
> = async (props) => {
	const { width, height, peaks, title, yAxisLabel } = props

	// Create canvas
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Margins proportioned to match the provided example SVGs closely
	const leftMargin = Math.max(40, 0.152 * width)
	const rightMargin = Math.max(14, 0.052 * width)
	const topMargin = Math.max(12, 0.08 * height)
	const bottomMargin = Math.max(26, 0.245 * height)

	const chartLeft = leftMargin
	const chartTop = topMargin
	const chartRight = width - rightMargin
	const chartBottom = height - bottomMargin
	const chartWidth = chartRight - chartLeft
	const chartHeight = chartBottom - chartTop

	if (chartWidth <= 0 || chartHeight <= 0) {
		logger.error("invalid chart area for pes spectrum", {
			width,
			height,
			leftMargin,
			rightMargin,
			topMargin,
			bottomMargin
		})
		throw errors.new("invalid chart area dimensions")
	}

	// Draw faint horizontal grid lines (opacity .1, stroke-width 2)
	for (let i = 0; i < GRID_LINE_COUNT; i++) {
		const y = chartTop + (i * chartHeight) / (GRID_LINE_COUNT - 1)
		canvas.drawLine(chartLeft, y, chartRight, y, {
			stroke: theme.colors.black,
			strokeWidth: 2,
			opacity: 0.1
		})
	}

	// Axes: bottom x-axis and left y-axis (stroke-width 2)
	canvas.drawLine(chartLeft, chartBottom, chartRight, chartBottom, {
		stroke: theme.colors.black,
		strokeWidth: 2
	})
	canvas.drawLine(chartLeft, chartBottom, chartLeft, chartTop, {
		stroke: theme.colors.black,
		strokeWidth: 2
	})

	// X-axis ticks and labels at equal spacing with labels 1000,100,10,1,0
	const xTickCount = X_TICK_LABELS.length
	for (let i = 0; i < xTickCount; i++) {
		const frac = i / (xTickCount - 1)
		const x = chartLeft + frac * chartWidth
		canvas.drawLine(x, chartBottom, x, chartBottom + 5, {
			stroke: theme.colors.black,
			strokeWidth: 1.5
		})
		canvas.drawText({
			x,
			y: chartBottom + 17,
			text: X_TICK_LABELS[i] ?? "",
			anchor: "middle",
			fontPx: 10
		})
	}

	// Optional title
	if (title) {
		canvas.drawText({
			x: chartLeft + chartWidth / 2,
			y: Math.max(14, topMargin - 6),
			text: title,
			anchor: "middle",
			fontPx: 14,
			fontWeight: "700"
		})
	}

	// Axis labels
	// Bottom: Binding Energy (Mj/mol)
	canvas.drawText({
		x: chartLeft + chartWidth / 2,
		y: height - 10,
		text: "Binding Energy (Mj/mol)",
		anchor: "middle",
		fontPx: 12,
		fontWeight: "700"
	})

	// Left (rotated -90): y-axis label
	const yLabelX = leftMargin - 15
	const yLabelY = chartTop + chartHeight / 2
	canvas.drawText({
		x: yLabelX,
		y: yLabelY,
		text: yAxisLabel,
		anchor: "middle",
		fontPx: 12,
		fontWeight: "700",
		rotate: { angle: -90, cx: yLabelX, cy: yLabelY }
	})

	// Helpers for coordinate transforms
	const baselineY = chartBottom
	const unitStepY = chartHeight / (GRID_LINE_COUNT - 1) // height per unit (1..7)

	// Map binding energy to reversed x using decade-based log interpolation across equal tick spacing
	// Ticks (left->right): 1000, 100, 10, 1, 0
	function energyToX(energy: number): number {
		const x1000 = chartLeft
		const x100 = chartLeft + 0.25 * chartWidth
		const x10 = chartLeft + 0.5 * chartWidth
		const x1 = chartLeft + 0.75 * chartWidth
		const x0 = chartLeft + 1.0 * chartWidth

		if (energy >= 1000) return x1000
		if (energy >= 100) {
			const t = (Math.log10(energy) - 2) / (3 - 2)
			const tAdj = t ** LOG_GAMMA
			return x1000 + (1 - tAdj) * (x100 - x1000)
		}
		if (energy >= 10) {
			const t = (Math.log10(energy) - 1) / (2 - 1)
			const tAdj = t ** LOG_GAMMA
			return x100 + (1 - tAdj) * (x10 - x100)
		}
		if (energy >= 1) {
			const t = (Math.log10(energy) - 0) / (1 - 0)
			const tAdj = t ** LOG_GAMMA
			return x10 + (1 - tAdj) * (x1 - x10)
		}
		if (energy > 0) {
			const t = energy / 1
			return x1 + (1 - t) * (x0 - x1)
		}
		return x0
	}

	// Draw peaks as narrow vertical outlines composed of two parallel strokes (no fill), matching the visual style
	const halfWidthPx = 1.8 // tuned to visually match the provided SVG bars
	const smallCapFrac = 0.2 // small slanted cap proportion relative to one unit step
	const smallCapDy = unitStepY * smallCapFrac

	for (const peak of peaks) {
		if (peak.heightUnits < 1 || peak.heightUnits > 7) {
			logger.error("invalid peak height units", {
				heightUnits: peak.heightUnits
			})
			throw errors.new("invalid peak height units")
		}

		const xCenter = energyToX(peak.energy)
		const yTop = baselineY - peak.heightUnits * unitStepY

		const leftX = xCenter - halfWidthPx
		const rightX = xCenter + halfWidthPx

		// Left side: small cap up then long up (two segments for the outlined look)
		canvas.drawLine(leftX, baselineY, leftX + 0.9, baselineY - smallCapDy, {
			stroke: theme.colors.black,
			strokeWidth: 2
		})
		canvas.drawLine(leftX + 0.9, baselineY - smallCapDy, leftX + 1.8, yTop, {
			stroke: theme.colors.black,
			strokeWidth: 2
		})

		// Right side: long down then small cap to baseline (mirrored)
		canvas.drawLine(rightX - 1.8, yTop, rightX - 0.9, baselineY - smallCapDy, {
			stroke: theme.colors.black,
			strokeWidth: 2
		})
		canvas.drawLine(rightX - 0.9, baselineY - smallCapDy, rightX, baselineY, {
			stroke: theme.colors.black,
			strokeWidth: 2
		})

		// Optional top label
		if (peak.topLabel !== null && peak.topLabel !== "") {
			canvas.drawText({
				x: xCenter,
				y: yTop - 6,
				text: peak.topLabel,
				anchor: "middle",
				fontPx: 10
			})
		}
	}

	// Finalize
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
