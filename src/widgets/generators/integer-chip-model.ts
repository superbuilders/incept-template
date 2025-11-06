import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

const MINUS_CHIP_COLOR = "#FADBD8"
const PLUS_CHIP_COLOR = "#FEF9E7"
const BORDER_COLOR = "#212121"
const SYMBOL_COLOR = "#212121"

export const IntegerChipModelPropsSchema = z
	.object({
		type: z.literal("integerChipModel"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		chips: z
			.array(
				z
					.object({
						sign: z.enum(["plus", "minus"]),
						crossedOut: z.boolean()
					})
					.strict()
			)
			.describe(
				"Sequence of chips in render order; 'crossedOut' draws an X overlay."
			)
	})
	.strict()
	.describe(
		"Displays positive (yellow) and negative (red) integer chips to visualize integer arithmetic."
	)

export type IntegerChipModelProps = z.infer<typeof IntegerChipModelPropsSchema>

export const generateIntegerChipModel: WidgetGenerator<
	typeof IntegerChipModelPropsSchema
> = async (props) => {
	const { width, height, chips } = props

	const chipRadius = 24
	const chipDiameter = chipRadius * 2
	const padding = 10
	const symbolFontSize = 32
	const symbolFontWeight = "600"

	const availableWidth = width - padding * 2
	const chipsPerRow = Math.floor(availableWidth / (chipDiameter + padding))

	if (chipsPerRow === 0) {
		return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"></svg>`
	}

	const svgElements: string[] = []

	let currentX = padding + chipRadius
	let currentY = padding + chipRadius
	let chipsInCurrentRow = 0

	function placeChip(sign: "plus" | "minus", crossedOut: boolean): void {
		if (chipsInCurrentRow >= chipsPerRow) {
			currentY += chipDiameter + padding
			currentX = padding + chipRadius
			chipsInCurrentRow = 0
		}
		const fillColor = sign === "plus" ? PLUS_CHIP_COLOR : MINUS_CHIP_COLOR
		const symbol = sign === "plus" ? "+" : "−"
		const circle = `<circle cx="${currentX}" cy="${currentY}" r="${chipRadius}" fill="${fillColor}" stroke="${BORDER_COLOR}" stroke-width="2" />`
		const text = `<text x="${currentX}" y="${currentY}" font-size="${symbolFontSize}px" font-weight="${symbolFontWeight}" fill="${SYMBOL_COLOR}" text-anchor="middle" dominant-baseline="central">${symbol}</text>`
		let cross = ""
		if (crossedOut) {
			// Single diagonal line (/) extending beyond the circle
			const extension = chipRadius * 0.2 // Extend beyond circle
			const x1 = currentX - chipRadius - extension
			const y1 = currentY + chipRadius + extension
			const x2 = currentX + chipRadius + extension
			const y2 = currentY - chipRadius - extension
			cross = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${BORDER_COLOR}" stroke-width="1" />`
		}
		svgElements.push(circle + text + cross)
		currentX += chipDiameter + padding
		chipsInCurrentRow++
	}

	// Group chips by sign: render all minus chips first, then plus chips
	const minusChips = chips.filter((chip) => chip.sign === "minus")
	const plusChips = chips.filter((chip) => chip.sign === "plus")

	// Render all minus chips first
	for (const chip of minusChips) {
		placeChip(chip.sign, chip.crossedOut)
	}

	// Start plus chips on a new row if there were minus chips
	if (
		minusChips.length > 0 &&
		plusChips.length > 0 &&
		chipsInCurrentRow !== 0
	) {
		currentY += chipDiameter + padding
		currentX = padding + chipRadius
		chipsInCurrentRow = 0
	}

	// Render all plus chips
	for (const chip of plusChips) {
		placeChip(chip.sign, chip.crossedOut)
	}

	const requiredHeight = currentY + chipRadius + padding
	const finalHeight = Math.max(height, requiredHeight)
	const svgBody = svgElements.join("\n  ")

	return `<svg width="${width}" height="${finalHeight}" viewBox="0 0 ${width} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">
  ${svgBody}
</svg>`
}
