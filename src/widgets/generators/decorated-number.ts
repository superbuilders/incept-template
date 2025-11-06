import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

/**
 * Schema for digit decorations within a number
 */
const DigitDecorationSchema = z.object({
	placeValue: z
		.enum([
			"ones",
			"tens",
			"hundreds",
			"thousands",
			"tenThousands",
			"hundredThousands"
		])
		.describe("The place value of the digit to decorate"),
	decoration: z
		.enum(["circle", "underline", "both"])
		.describe("The type of decoration to apply to this digit")
})

export const DecoratedNumberPropsSchema = z
	.object({
		type: z.literal("decoratedNumber"),
		number: z
			.number()
			.int()
			.min(0)
			.max(999999)
			.describe("The number to display (0-999,999)"),
		decorations: z
			.array(DigitDecorationSchema)
			.min(1)
			.describe("Array of decorations to apply to specific digits"),
		width: createWidthSchema().describe("Width of the widget in pixels"),
		height: createHeightSchema().describe("Height of the widget in pixels")
	})
	.describe(
		"Displays a number with specific digits decorated with circles and/or underlines. Useful for place-value questions where certain digits need to be highlighted visually."
	)

export type DecoratedNumberProps = z.infer<typeof DecoratedNumberPropsSchema>

/**
 * Maps place value to position index (from right, 0-indexed)
 */
const placeValueToPosition: Record<string, number> = {
	ones: 0,
	tens: 1,
	hundreds: 2,
	thousands: 3,
	tenThousands: 4,
	hundredThousands: 5
}

/**
 * Generates an SVG displaying a number with decorated digits (circles and/or underlines)
 */
export const generateDecoratedNumber: WidgetGenerator<
	typeof DecoratedNumberPropsSchema
> = async (props) => {
	const { number, decorations, width, height } = props

	// Convert number to string and get individual digits
	const numStr = number.toString()
	const digits = numStr.split("").map(Number)
	const numDigits = digits.length

	// Calculate spacing and sizing
	const fontSize = Math.min(24, height * 0.4)
	const digitWidth = width / (numDigits + Math.floor((numDigits - 1) / 3)) // Account for commas
	const centerY = height / 2
	const baselineY = centerY + fontSize * 0.35

	// Build decoration map: position -> decoration type
	const decorationMap = new Map<number, "circle" | "underline" | "both">()
	for (const dec of decorations) {
		const pos = placeValueToPosition[dec.placeValue]
		if (pos !== undefined) {
			decorationMap.set(pos, dec.decoration)
		}
	}

	let svgContent = ""
	let currentX = 10 // Starting X position with padding

	// Render each digit from left to right
	for (let i = 0; i < numDigits; i++) {
		const digit = digits[i]
		const posFromRight = numDigits - 1 - i

		// Get decoration for this digit
		const decoration = decorationMap.get(posFromRight)

		// Draw the digit
		const digitX = currentX + digitWidth / 2
		svgContent += `<text x="${digitX}" y="${baselineY}" font-size="${fontSize}" fill="${theme.colors.text}" font-family="${theme.font.family.sans}" text-anchor="middle">${digit}</text>`

		// Draw decorations
		if (decoration === "circle" || decoration === "both") {
			const circleRadius = fontSize * 0.65
			svgContent += `<circle cx="${digitX}" cy="${centerY}" r="${circleRadius}" fill="none" stroke="${theme.colors.black}" stroke-width="${theme.stroke.width.base}"/>`
		}

		if (decoration === "underline" || decoration === "both") {
			const underlineY = baselineY + fontSize * 0.15
			const underlineX1 = digitX - digitWidth * 0.35
			const underlineX2 = digitX + digitWidth * 0.35
			svgContent += `<line x1="${underlineX1}" y1="${underlineY}" x2="${underlineX2}" y2="${underlineY}" stroke="${theme.colors.black}" stroke-width="${theme.stroke.width.base}"/>`
		}

		currentX += digitWidth

		// Add comma AFTER this digit if the next digit is at a multiple-of-3 position from right
		// (i.e., after thousands, millions, etc.)
		if (posFromRight > 0 && posFromRight % 3 === 0) {
			svgContent += `<text x="${currentX}" y="${baselineY}" font-size="${fontSize}" fill="${theme.colors.text}" font-family="${theme.font.family.sans}">,</text>`
			currentX += digitWidth * 0.4 // Comma takes less space
		}
	}

	// Wrap in SVG
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="display: inline-block; vertical-align: middle;">
${svgContent}
</svg>`

	return svg
}
