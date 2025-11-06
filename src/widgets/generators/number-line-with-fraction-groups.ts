import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { selectAxisLabels } from "@/widgets/utils/layout"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const NumberLineWithFractionGroupsPropsSchema = z
	.object({
		type: z
			.literal("numberLineWithFractionGroups")
			.describe(
				"Identifies this as a number line with fraction groups showing repeated segments."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		axis: z
			.object({
				lowerBound: z
					.number()
					.int()
					.describe("Lower bound numerator (e.g., 0 for 0/4, -2 for -2/4)"),
				upperBound: z
					.number()
					.int()
					.describe("Upper bound numerator (e.g., 8 for 8/4 = 2)"),
				denominator: z
					.number()
					.int()
					.positive()
					.describe(
						"The common denominator for all fractions on this axis (e.g., 4 for fourths). Determines tick spacing."
					)
			})
			.strict()
			.describe("Defines the axis bounds and fraction interval"),
		boxes: z
			.object({
				lowerBound: z
					.number()
					.int()
					.describe(
						"Starting numerator for the boxes (e.g., 0 to start from 0/4, -2 for -2/4)"
					),
				upperBound: z
					.number()
					.int()
					.describe(
						"Ending numerator for the boxes (e.g., 7 for boxes up to 7/4)"
					),
				fillTo: z
					.number()
					.int()
					.describe(
						"Numerator up to which boxes should be filled/shaded (e.g., 4 to fill up to 4/4)"
					)
			})
			.strict()
			.describe("Defines which boxes to show and how many to fill")
	})
	.strict()
	.describe(
		"Creates a number line with fraction intervals and colored boxes above it. Perfect for visualizing fraction concepts like 'how many fourths make one whole?' The axis shows fraction labels above tick marks and whole number labels below. Boxes are automatically generated and filled up to the specified bound.\n\nExample: axis from 0/4 to 8/4 with denominator 4, boxes from 0 to 7 filled to 4, creates a number line from 0 to 2 with fourths marked, and boxes showing 4/4 = 1 whole."
	)

export type NumberLineWithFractionGroupsProps = z.infer<
	typeof NumberLineWithFractionGroupsPropsSchema
>

function renderFraction(numerator: number, denominator: number): string {
	return `${numerator}/${denominator}`
}

/**
 * This template generates a highly illustrative number line as an SVG graphic,
 * specifically designed to build conceptual understanding of fraction division.
 * It automatically generates ticks, labels, and boxes based on fraction bounds and intervals.
 */
export const generateNumberLineWithFractionGroups: WidgetGenerator<
	typeof NumberLineWithFractionGroupsPropsSchema
> = async (data) => {
	const { width, height, axis, boxes } = data
	const padding = { horizontal: PADDING * 2, vertical: 60 }
	const chartWidth = width - 2 * padding.horizontal
	const yPos = height / 2

	// Convert fraction bounds to decimal values for positioning
	const minValue = axis.lowerBound / axis.denominator
	const maxValue = axis.upperBound / axis.denominator

	// Validation checks
	if (minValue >= maxValue)
		return `<svg width="${width}" height="${height}"></svg>`

	if (boxes.lowerBound >= boxes.upperBound) {
		logger.error("invalid box bounds", {
			lowerBound: boxes.lowerBound,
			upperBound: boxes.upperBound
		})
		throw errors.new("box lower bound must be less than upper bound")
	}

	if (boxes.lowerBound < axis.lowerBound) {
		logger.error("box lower bound below axis range", {
			boxLowerBound: boxes.lowerBound,
			axisLowerBound: axis.lowerBound
		})
		throw errors.new("box lower bound must be within axis range")
	}

	if (boxes.upperBound > axis.upperBound) {
		logger.error("box upper bound above axis range", {
			boxUpperBound: boxes.upperBound,
			axisUpperBound: axis.upperBound
		})
		throw errors.new("box upper bound must be within axis range")
	}

	if (boxes.fillTo < boxes.lowerBound || boxes.fillTo > boxes.upperBound) {
		logger.error("fillTo value outside box bounds", {
			fillTo: boxes.fillTo,
			lowerBound: boxes.lowerBound,
			upperBound: boxes.upperBound
		})
		throw errors.new("fillTo must be within box bounds")
	}

	const scale = chartWidth / (maxValue - minValue)
	const toSvgX = (val: number) => padding.horizontal + (val - minValue) * scale

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Draw the main axis line
	canvas.drawLine(padding.horizontal, yPos, width - padding.horizontal, yPos, {
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.base
	})

	// Generate all tick marks and labels automatically
	const fractionLabels: string[] = []
	const wholeLabels: string[] = []
	const tickPositions: number[] = []

	for (
		let numerator = axis.lowerBound;
		numerator <= axis.upperBound;
		numerator++
	) {
		const fractionValue = numerator / axis.denominator
		const position = toSvgX(fractionValue)

		tickPositions.push(position)
		fractionLabels.push(renderFraction(numerator, axis.denominator))

		// Add whole number labels for integer values
		if (numerator % axis.denominator === 0) {
			wholeLabels.push(String(numerator / axis.denominator))
		} else {
			wholeLabels.push("")
		}
	}

	// Smart label selection to prevent overlaps
	const selectedFractionLabels = selectAxisLabels({
		labels: fractionLabels,
		positions: tickPositions,
		axisLengthPx: chartWidth,
		orientation: "horizontal",
		fontPx: 10,
		minGapPx: 6
	})

	// Draw ticks and labels
	tickPositions.forEach((x, i) => {
		const numerator = axis.lowerBound + i
		const isWhole = numerator % axis.denominator === 0
		const tickHeight = isWhole ? 8 : 4

		// Draw tick mark
		canvas.drawLine(x, yPos - tickHeight, x, yPos + tickHeight, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.base
		})

		// Draw fraction label above the tick (if selected)
		if (selectedFractionLabels.has(i)) {
			canvas.drawText({
				x: x,
				y: yPos - 25,
				text: fractionLabels[i] ?? "",
				fill: theme.colors.axisLabel,
				anchor: "middle",
				fontPx: 11
			})
		}

		// Draw whole number label below the tick
		if (wholeLabels[i] !== "") {
			canvas.drawText({
				x: x,
				y: yPos + 35,
				text: wholeLabels[i] ?? "",
				fill: theme.colors.axisLabel,
				anchor: "middle",
				fontPx: 12
			})
		}
	})

	// Generate and draw boxes
	// const boxCount = boxes.upperBound - boxes.lowerBound // Unused variable
	const boxWidth = chartWidth / (axis.upperBound - axis.lowerBound)
	const boxHeight = 40
	const boxY = yPos - boxHeight - 45

	for (
		let numerator = boxes.lowerBound;
		numerator < boxes.upperBound;
		numerator++
	) {
		const fractionValue = numerator / axis.denominator
		const boxX = toSvgX(fractionValue)

		// Determine if this box should be filled
		const isFilled = numerator < boxes.fillTo
		const fillColor = isFilled ? "#11accd" : theme.colors.background
		const strokeColor = theme.colors.axis

		canvas.drawRect(boxX, boxY, boxWidth, boxHeight, {
			fill: fillColor,
			fillOpacity: isFilled ? 0.7 : 0.1,
			stroke: strokeColor,
			strokeWidth: 1
		})
	}

	// Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
