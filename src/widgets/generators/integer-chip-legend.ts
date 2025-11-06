import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { theme } from "@/widgets/utils/theme"

const MINUS_CHIP_COLOR = "#FADBD8"
const PLUS_CHIP_COLOR = "#FEF9E7"
const BORDER_COLOR = "#212121"
const SYMBOL_COLOR = "#212121"

export const IntegerChipLegendPropsSchema = z
	.object({
		type: z
			.literal("integerChipLegend")
			.describe("Identifies this as an integer chip legend widget."),
		positiveChipLabel: z
			.string()
			.describe("The text label for the positive chip (e.g., '= +1')."),
		negativeChipLabel: z
			.string()
			.describe("The text label for the negative chip (e.g., '= -1').")
	})
	.strict()

export type IntegerChipLegendProps = z.infer<
	typeof IntegerChipLegendPropsSchema
>

export const generateIntegerChipLegend: WidgetGenerator<
	typeof IntegerChipLegendPropsSchema
> = async (props) => {
	const legendPadding = 6
	const legendCircleRadius = 14
	const legendRowHeight = legendCircleRadius * 2 + legendPadding
	const labelSpacing = 12 // Space between circle and label text
	const fontSize = 16

	// Calculate text widths (approximate based on character count and font size)
	// Using a conservative estimate of 0.6 * fontSize per character for typical fonts
	const positiveTextWidth = props.positiveChipLabel.length * (fontSize * 0.6)
	const negativeTextWidth = props.negativeChipLabel.length * (fontSize * 0.6)
	const maxTextWidth = Math.max(positiveTextWidth, negativeTextWidth)

	// Calculate dynamic width: padding + circle diameter + label spacing + text width + padding
	const legendWidth =
		legendPadding +
		legendCircleRadius * 2 +
		labelSpacing +
		maxTextWidth +
		legendPadding
	const legendHeight = legendRowHeight * 2 + legendPadding * 3
	const legendX = 0
	const legendY = 0

	const box = `<rect x="${legendX}" y="${legendY}" width="${legendWidth}" height="${legendHeight}" rx="6" ry="6" fill="#FFFFFF" stroke="${BORDER_COLOR}" stroke-width="2" />`
	const items: string[] = []

	function legendRow(row: number, sign: "plus" | "minus", label: string): void {
		const cy =
			legendY +
			legendPadding +
			legendCircleRadius +
			row * (legendRowHeight + legendPadding)
		const cx = legendX + legendPadding + legendCircleRadius
		const fillColor = sign === "plus" ? PLUS_CHIP_COLOR : MINUS_CHIP_COLOR
		const symbol = sign === "plus" ? "+" : "−"
		const circle = `<circle cx="${cx}" cy="${cy}" r="${legendCircleRadius}" fill="${fillColor}" stroke="${BORDER_COLOR}" stroke-width="2" />`
		const textSymbol = `<text x="${cx}" y="${cy}" font-size="18px" font-weight="600" fill="${SYMBOL_COLOR}" text-anchor="middle" dominant-baseline="central">${symbol}</text>`
		const textLabel = `<text x="${cx + legendCircleRadius + labelSpacing}" y="${cy}" font-size="${fontSize}px" fill="${SYMBOL_COLOR}" dominant-baseline="central">${label}</text>`
		items.push(circle + textSymbol + textLabel)
	}

	legendRow(0, "plus", props.positiveChipLabel)
	legendRow(1, "minus", props.negativeChipLabel)

	const svg = `<svg width="${legendWidth}" height="${legendHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">
  ${box}
  ${items.join("\n  ")}
</svg>`

	return svg.trim()
}
