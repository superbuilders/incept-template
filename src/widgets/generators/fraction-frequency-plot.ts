import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Discriminated union for label values: whole number, simple fraction, or mixed number
const FractionLabelSchema = z.discriminatedUnion("type", [
	z
		.object({
			type: z.literal("whole").describe("Whole number value like 0, 1, 2, 10"),
			value: z.number().int().describe("Whole number integer value")
		})
		.strict(),
	z
		.object({
			type: z
				.literal("fraction")
				.describe("Proper or improper fraction like 1/2, 5/4"),
			numerator: z.number().int().min(0).describe("Numerator of the fraction"),
			denominator: z
				.number()
				.int()
				.positive()
				.describe("Denominator of the fraction")
		})
		.strict(),
	z
		.object({
			type: z.literal("mixed").describe("Mixed number like 1 1/4"),
			whole: z.number().int().describe("Whole number part of the mixed number"),
			numerator: z
				.number()
				.int()
				.min(0)
				.describe("Numerator of the fractional part"),
			denominator: z
				.number()
				.int()
				.positive()
				.describe("Denominator of the fractional part")
		})
		.strict()
])

// Defines the label and frequency for a single point on the plot.
const TickSchema = z
	.object({
		label: FractionLabelSchema.describe(
			"Label for the tick: either whole number, fraction, or mixed number, using discriminated union."
		),
		frequency: z
			.number()
			.int()
			.min(0)
			.describe(
				"The number of 'X' marks to stack above this tick, representing its frequency."
			)
	})
	.strict()

// The main Zod schema for the simplified fractionFrequencyPlot function.
export const FractionFrequencyPlotPropsSchema = z
	.object({
		type: z
			.literal("fractionFrequencyPlot")
			.describe("Identifies this as a fraction frequency plot widget."),
		width: createWidthSchema(),
		height: createHeightSchema(),
		title: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe("Optional title displayed above the plot."),
		ticks: z
			.array(TickSchema)
			.min(1)
			.describe(
				"An array of the tick marks to display, each with its label and frequency count."
			)
	})
	.strict()
	.describe(
		"Creates a line plot for fractional data by stacking 'X's above each specified tick based on its frequency. The axis range is automatically determined from the ticks provided."
	)

export type FractionFrequencyPlotProps = z.infer<
	typeof FractionFrequencyPlotPropsSchema
>
// type Tick = z.infer<typeof TickSchema> // Unused type
type FractionLabel = z.infer<typeof FractionLabelSchema>

/**
 * Calculates the numerical value of a tick's label.
 */
const toNumericValue = (label: FractionLabel): number => {
	if (label.type === "whole") return label.value
	if (label.type === "fraction")
		return label.denominator === 0 ? 0 : label.numerator / label.denominator
	// mixed
	return (
		label.whole +
		(label.denominator === 0 ? 0 : label.numerator / label.denominator)
	)
}

/**
 * Generates an SVG diagram of a line plot for fractional data. Frequencies are
 * represented by stacking 'X' symbols above a number line, and the axis range
 * is inferred from the data.
 */
export const generateFractionFrequencyPlot: WidgetGenerator<
	typeof FractionFrequencyPlotPropsSchema
> = async (props) => {
	const { width, height, title, ticks } = props

	// Calculate the numerical values for all ticks to determine the axis range.
	const tickValues = ticks.map((t) => toNumericValue(t.label))
	const minValue = Math.min(...tickValues)
	const maxValue = Math.max(...tickValues)
	const range = maxValue - minValue

	// Determine axis bounds with padding to prevent symbols at the edges from being clipped.
	// The padding is a fraction of the data range, ensuring a visually pleasing margin.
	const axisPadding = range > 0 ? range * 0.1 : 1
	const axisMin = minValue - axisPadding
	const axisMax = maxValue + axisPadding

	const margin = { top: PADDING, right: PADDING, bottom: 60, left: PADDING }
	if (title) {
		margin.top += 30
	}

	const chartWidth = width - margin.left - margin.right
	const axisY = height - margin.bottom

	if (axisMin >= axisMax || chartWidth <= 0) {
		return `<svg width="${width}" height="${height}" />`
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const scale = chartWidth / (axisMax - axisMin)
	const toSvgX = (val: number) => margin.left + (val - axisMin) * scale

	// 1. Draw Title
	if (title) {
		canvas.drawText({
			x: width / 2,
			y: margin.top - 15,
			text: title,
			fill: theme.colors.title,
			anchor: "middle",
			fontPx: theme.font.size.large,
			fontWeight: theme.font.weight.bold
		})
	}

	// 2. Draw Axis Line
	canvas.drawLine(margin.left, axisY, width - margin.right, axisY, {
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.base
	})

	// 3. Helper to render fractional/mixed number labels
	const drawFractionLabel = (x: number, y: number, label: FractionLabel) => {
		const fontStyles = {
			anchor: "middle" as const,
			dominantBaseline: "middle" as const,
			fontPx: 14
		}
		const FRACTION_OFFSET = 9
		if (label.type === "whole") {
			canvas.drawText({ x, y, text: String(label.value), ...fontStyles })
			return
		}
		if (label.type === "fraction") {
			const numText = String(label.numerator)
			const denText = String(label.denominator)
			const fracWidth = Math.max(numText.length, denText.length) * 8
			canvas.drawText({
				x,
				y: y - FRACTION_OFFSET,
				text: numText,
				...fontStyles
			})
			canvas.drawLine(x - fracWidth / 2, y - 1, x + fracWidth / 2, y - 1, {
				stroke: theme.colors.axisLabel,
				strokeWidth: 1.5
			})
			canvas.drawText({
				x,
				y: y + FRACTION_OFFSET,
				text: denText,
				...fontStyles
			})
			return
		}
		// mixed
		const wholeText = String(label.whole)
		const numText = String(label.numerator)
		const denText = String(label.denominator)
		const wholeWidth = wholeText.length * 9
		const fracWidth = Math.max(numText.length, denText.length) * 8
		const totalWidth = wholeWidth + fracWidth + 4
		const wholeX = x - totalWidth / 2 + wholeWidth / 2
		const fracX = wholeX + wholeWidth / 2 + 4 + fracWidth / 2
		canvas.drawText({ x: wholeX, y, text: wholeText, ...fontStyles })
		canvas.drawText({
			x: fracX,
			y: y - FRACTION_OFFSET,
			text: numText,
			...fontStyles
		})
		canvas.drawLine(
			fracX - fracWidth / 2,
			y - 1,
			fracX + fracWidth / 2,
			y - 1,
			{
				stroke: theme.colors.axisLabel,
				strokeWidth: 1.5
			}
		)
		canvas.drawText({
			x: fracX,
			y: y + FRACTION_OFFSET,
			text: denText,
			...fontStyles
		})
	}

	// 4. Draw Ticks and Labels
	for (const tick of ticks) {
		const x = toSvgX(toNumericValue(tick.label))
		canvas.drawLine(x, axisY - 5, x, axisY + 5, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.base
		})
		drawFractionLabel(x, axisY + 25, tick.label)
	}

	// 5. Draw the Frequency Symbols
	const dotSize = 16
	const verticalSpacing = 2
	const baseOffset = 20

	for (const tick of ticks) {
		if (tick.frequency > 0) {
			const x = toSvgX(toNumericValue(tick.label))
			for (let i = 0; i < tick.frequency; i++) {
				const y = axisY - baseOffset - i * (dotSize + verticalSpacing)
				canvas.drawText({
					x: x,
					y: y,
					text: "X",
					fill: theme.colors.text,
					fontPx: dotSize,
					fontWeight: theme.font.weight.bold,
					anchor: "middle",
					dominantBaseline: "middle"
				})
			}
		}
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
