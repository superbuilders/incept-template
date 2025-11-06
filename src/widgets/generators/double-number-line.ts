import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { abbreviateMonth } from "@/widgets/utils/labels"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { type Theme, theme } from "@/widgets/utils/theme"

export const ErrMismatchedTickCounts = errors.new(
	"top and bottom lines must have the same number of ticks"
)

export const DoubleNumberLinePropsSchema = z
	.object({
		type: z
			.literal("doubleNumberLine")
			.describe(
				"Identifies this as a double number line widget for showing proportional relationships."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		topLine: z
			.object({
				label: z
					.string()
					.nullable()
					.transform((val) =>
						val === "null" || val === "NULL" || val === "" ? null : val
					)
					.describe(
						"Label for this number line shown on the left side (e.g., 'Cups of Flour', 'Cost ($)', 'Miles', 'Time (minutes)', null). Keep concise to fit. Null shows no label."
					),
				ticks: z
					.array(z.union([z.string(), z.number()]))
					.describe(
						"Tick mark values from left to right. Can be numbers (e.g., [0, 2, 4, 6]) or strings (e.g., ['0', '1/2', '1', '3/2']). Must have same count as other line for alignment."
					)
			})
			.strict()
			.describe(
				"Configuration for the upper number line. Represents one quantity in the proportional relationship."
			),
		bottomLine: z
			.object({
				label: z
					.string()
					.nullable()
					.transform((val) =>
						val === "null" || val === "NULL" || val === "" ? null : val
					)
					.describe(
						"Label for this number line shown on the left side (e.g., 'Cups of Flour', 'Cost ($)', 'Miles', 'Time (minutes)', null). Keep concise to fit. Null shows no label."
					),
				ticks: z
					.array(z.union([z.string(), z.number()]))
					.describe(
						"Tick mark values from left to right. Can be numbers (e.g., [0, 2, 4, 6]) or strings (e.g., ['0', '1/2', '1', '3/2']). Must have same count as other line for alignment."
					)
			})
			.strict()
			.describe(
				"Configuration for the lower number line. Represents the related quantity. Tick positions align vertically with top line."
			)
	})
	.strict()
	.describe(
		"Creates parallel number lines showing proportional relationships between two quantities. Vertical lines connect corresponding values. Essential for ratio reasoning, unit rates, and proportional thinking. Both lines must have the same number of ticks for proper alignment."
	)

export type DoubleNumberLineProps = z.infer<typeof DoubleNumberLinePropsSchema>

// Helper function to draw a dotted line with clipping around label areas
function drawClippedDottedLine(
	canvas: CanvasImpl,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	labelBounds: Array<{ x: number; y: number; width: number; height: number }>,
	theme: Theme
) {
	// Check if the line intersects with any label bounds
	const lineIntersections: Array<{ start: number; end: number }> = []

	// For vertical lines (x1 === x2)
	if (Math.abs(x1 - x2) < 0.1) {
		const lineX = x1
		const minY = Math.min(y1, y2)
		const maxY = Math.max(y1, y2)

		for (const bound of labelBounds) {
			// Check if vertical line intersects with label rectangle
			if (lineX >= bound.x && lineX <= bound.x + bound.width) {
				const intersectionStart = Math.max(minY, bound.y)
				const intersectionEnd = Math.min(maxY, bound.y + bound.height)

				if (intersectionStart < intersectionEnd) {
					lineIntersections.push({
						start: intersectionStart,
						end: intersectionEnd
					})
				}
			}
		}
	}

	// If no intersections, draw the full line
	if (lineIntersections.length === 0) {
		canvas.drawLine(x1, y1, x2, y2, {
			stroke: theme.colors.gridMinor,
			strokeWidth: theme.stroke.width.base,
			dash: theme.stroke.dasharray.gridMinor
		})
		return
	}

	// Sort intersections and draw line segments between them
	lineIntersections.sort((a, b) => a.start - b.start)

	// For vertical lines
	const lineX = x1
	const minY = Math.min(y1, y2)
	const maxY = Math.max(y1, y2)
	let currentY = minY

	for (const intersection of lineIntersections) {
		// Draw segment before intersection
		if (currentY < intersection.start) {
			canvas.drawLine(lineX, currentY, lineX, intersection.start, {
				stroke: theme.colors.gridMinor,
				strokeWidth: theme.stroke.width.base,
				dash: theme.stroke.dasharray.gridMinor
			})
		}
		currentY = Math.max(currentY, intersection.end)
	}

	// Draw final segment after last intersection
	if (currentY < maxY) {
		canvas.drawLine(lineX, currentY, lineX, maxY, {
			stroke: theme.colors.gridMinor,
			strokeWidth: theme.stroke.width.base,
			dash: theme.stroke.dasharray.gridMinor
		})
	}
}

/**
 * This template generates a double number line diagram as a clear and accurate SVG graphic.
 * This visualization tool is excellent for illustrating the relationship between two
 * different quantities that share a constant ratio.
 */
export const generateDoubleNumberLine: WidgetGenerator<
	typeof DoubleNumberLinePropsSchema
> = async (data) => {
	const { width, height, topLine, bottomLine } = data
	const lineLength = width - 2 * PADDING

	// Define vertical spacing constants for clarity and maintainability.
	const TOP_LINE_LABEL_Y_OFFSET = -20 // Distance from top line UP to its label
	const TOP_LINE_TICK_LABEL_Y_OFFSET = 20 // Distance from top line DOWN to its tick labels
	const BOTTOM_LINE_LABEL_Y_OFFSET = 30 // Distance from bottom line DOWN to its label
	const BOTTOM_LINE_TICK_LABEL_Y_OFFSET = -15 // Distance from bottom line UP to its tick labels
	const TICK_MARK_HEIGHT = 5
	const LINE_SEPARATION = 100 // Increased to ensure sufficient vertical space between lines and labels

	// Calculate minimum height needed to prevent label clipping
	const requiredMinHeight =
		Math.abs(TOP_LINE_LABEL_Y_OFFSET) +
		LINE_SEPARATION +
		BOTTOM_LINE_LABEL_Y_OFFSET +
		10 // +10 buffer
	const adjustedHeight = Math.max(height, requiredMinHeight)

	// Calculate the vertical center of the SVG and position the lines symmetrically around it.
	const verticalCenter = adjustedHeight / 2
	const topY = verticalCenter - LINE_SEPARATION / 2
	const bottomY = verticalCenter + LINE_SEPARATION / 2

	if (topLine.ticks.length !== bottomLine.ticks.length) {
		logger.error("mismatched tick counts between top and bottom lines", {
			topTickCount: topLine.ticks.length,
			bottomTickCount: bottomLine.ticks.length
		})
		throw errors.wrap(
			ErrMismatchedTickCounts,
			`top line has ${topLine.ticks.length} ticks, bottom line has ${bottomLine.ticks.length} ticks`
		)
	}

	const numTicks = topLine.ticks.length
	if (numTicks < 2) {
		return `<svg width="${width}" height="${adjustedHeight}"></svg>` // Not enough ticks to draw a line
	}

	const tickSpacing = lineLength / (numTicks - 1)

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height: adjustedHeight },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	canvas.addStyle(
		".line-label { font-size: 14px; font-weight: bold; text-anchor: middle; }"
	)

	// Collect label bounds for intelligent clipping
	const labelBounds: Array<{
		x: number
		y: number
		width: number
		height: number
	}> = []

	// Top line
	canvas.drawLine(PADDING, topY, width - PADDING, topY, {
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.base
	})
	if (topLine.label !== null) {
		const labelText = abbreviateMonth(topLine.label)
		const labelX = width / 2
		const labelY = topY + TOP_LINE_LABEL_Y_OFFSET
		canvas.drawText({
			x: labelX,
			y: labelY,
			text: labelText,
			fontPx: 14,
			fontWeight: theme.font.weight.bold,
			anchor: "middle"
		})
	}
	topLine.ticks.forEach((t, i) => {
		const x = PADDING + i * tickSpacing
		canvas.drawLine(x, topY - TICK_MARK_HEIGHT, x, topY + TICK_MARK_HEIGHT, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.base
		})
		const labelText = String(t)
		const labelY = topY + TOP_LINE_TICK_LABEL_Y_OFFSET
		canvas.drawText({
			x: x,
			y: labelY,
			text: labelText,
			fill: theme.colors.axisLabel,
			anchor: "middle"
		})

		// Only collect label bounds for clipping if there's actually visible text
		if (labelText.trim() !== "") {
			const fontPx = 12 // Default font size
			const textWidth = labelText.length * fontPx * 0.6 // Same as CanvasImpl.estimateTextWidth
			const padding = 3 // More padding for better visual separation

			// For baseline text, we need to account for:
			// - Ascender height (above baseline): ~0.75 * fontSize
			// - Descender depth (below baseline): ~0.25 * fontSize
			const ascenderHeight = fontPx * 0.75
			const descenderDepth = fontPx * 0.25
			const totalTextHeight = ascenderHeight + descenderDepth

			// For anchor="middle" + dominantBaseline="baseline":
			// - X: text is centered horizontally around x
			// - Y: labelY is the baseline, text extends from labelY - ascenderHeight to labelY + descenderDepth
			labelBounds.push({
				x: x - textWidth / 2 - padding,
				y: labelY - ascenderHeight - padding, // Top of text including ascenders
				width: textWidth + 2 * padding,
				height: totalTextHeight + 2 * padding
			})
		}
	})

	// Bottom line
	canvas.drawLine(PADDING, bottomY, width - PADDING, bottomY, {
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.base
	})
	if (bottomLine.label !== null) {
		const labelText = abbreviateMonth(bottomLine.label)
		const labelX = width / 2
		const labelY = bottomY + BOTTOM_LINE_LABEL_Y_OFFSET
		canvas.drawText({
			x: labelX,
			y: labelY,
			text: labelText,
			fontPx: 14,
			fontWeight: theme.font.weight.bold,
			anchor: "middle"
		})
	}
	bottomLine.ticks.forEach((t, i) => {
		const x = PADDING + i * tickSpacing
		canvas.drawLine(
			x,
			bottomY - TICK_MARK_HEIGHT,
			x,
			bottomY + TICK_MARK_HEIGHT,
			{
				stroke: theme.colors.axis,
				strokeWidth: theme.stroke.width.base
			}
		)
		const labelText = String(t)
		const labelY = bottomY + BOTTOM_LINE_TICK_LABEL_Y_OFFSET
		canvas.drawText({
			x: x,
			y: labelY,
			text: labelText,
			fill: theme.colors.axisLabel,
			anchor: "middle"
		})

		// Only collect label bounds for clipping if there's actually visible text
		if (labelText.trim() !== "") {
			const fontPx = 12 // Default font size
			const textWidth = labelText.length * fontPx * 0.6 // Same as CanvasImpl.estimateTextWidth
			const padding = 3 // More padding for better visual separation

			// For baseline text, we need to account for:
			// - Ascender height (above baseline): ~0.75 * fontSize
			// - Descender depth (below baseline): ~0.25 * fontSize
			const ascenderHeight = fontPx * 0.75
			const descenderDepth = fontPx * 0.25
			const totalTextHeight = ascenderHeight + descenderDepth

			// For anchor="middle" + dominantBaseline="baseline":
			// - X: text is centered horizontally around x
			// - Y: labelY is the baseline, text extends from labelY - ascenderHeight to labelY + descenderDepth
			labelBounds.push({
				x: x - textWidth / 2 - padding,
				y: labelY - ascenderHeight - padding, // Top of text including ascenders
				width: textWidth + 2 * padding,
				height: totalTextHeight + 2 * padding
			})
		}
	})

	// Alignment lines with intelligent clipping around labels
	for (let i = 0; i < numTicks; i++) {
		const x = PADDING + i * tickSpacing
		drawClippedDottedLine(
			canvas,
			x,
			topY + TICK_MARK_HEIGHT,
			x,
			bottomY - TICK_MARK_HEIGHT,
			labelBounds,
			theme
		)
	}

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
