import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { theme } from "@/widgets/utils/theme"

// Factory function to create addition with regrouping schema - avoids $ref in OpenAI JSON schema
function createAdditionWithRegroupingPropsSchema() {
	return z
		.object({
			type: z
				.literal("additionWithRegrouping")
				.describe(
					"Identifies this as an addition with regrouping widget for teaching the carrying/regrouping algorithm in addition."
				),
			addend1: z
				.number()
				.int()
				.min(0)
				.describe(
					"The top number (first addend) as a positive integer (e.g., 52, 235, 1000, 20129). Must be non-negative."
				),
			addend2: z
				.number()
				.int()
				.min(0)
				.describe(
					"The bottom number (second addend) as a positive integer (e.g., 27, 168, 543, 9028). Must be non-negative."
				),
			showCarrying: z
				.boolean()
				.describe(
					"Whether to show the carrying/regrouping marks (carried digits above columns). When true, displays the carrying visualization. When false, shows clean numbers without carrying marks."
				),
			showAnswer: z
				.boolean()
				.describe(
					"Whether to show the sum/result. When true, displays the answer below the line. When false, shows only the problem setup. Works independently from showCarrying."
				),
			revealUpTo: z
				.enum([
					"ones",
					"tens",
					"hundreds",
					"thousands",
					"ten-thousands",
					"complete"
				])
				.describe(
					"Controls progressive reveal of the answer digits. 'ones' reveals only ones digit, 'tens' reveals ones and tens, etc. 'complete' shows all answer digits. This field is ignored when showAnswer is false. Common patterns: use 'complete' for full answer, use 'ones' or 'tens' for step-by-step teaching."
				)
		})
		.strict()
		.describe(
			"Creates a visual representation of addition with regrouping (carrying). Shows the traditional column format with independent control of carrying marks and answer display. Perfect for step-by-step teaching. Common usage: 1) showCarrying=false, showAnswer=false for plain problem, 2) showCarrying=true, showAnswer=false to show carrying process, 3) showCarrying=true, showAnswer=true for complete solution. The revealUpTo field is ignored when showAnswer is false."
		)
}

// Export the schema created by the factory function
export const AdditionWithRegroupingPropsSchema =
	createAdditionWithRegroupingPropsSchema()

export type AdditionWithRegroupingProps = z.infer<
	typeof AdditionWithRegroupingPropsSchema
>

/**
 * Performs addition with regrouping and returns the steps
 * NOTE: The sum is calculated here in our code (addend1 + addend2), not by AI.
 * This ensures accurate mathematical computation independent of any AI model.
 */
function performAdditionWithRegrouping(addend1: number, addend2: number) {
	// Convert to strings for digit manipulation
	const addend1Str = addend1.toString()
	const addend2Str = addend2.toString()
	const maxLength = Math.max(addend1Str.length, addend2Str.length)

	// Pad with zeros for alignment
	const paddedAddend1 = addend1Str.padStart(maxLength, "0")
	const paddedAddend2 = addend2Str.padStart(maxLength, "0")

	// Arrays to track carrying
	const addend1Digits = paddedAddend1.split("").map(Number)
	const addend2Digits = paddedAddend2.split("").map(Number)
	const sumDigits: number[] = []
	const carried: number[] = new Array(maxLength + 1).fill(0)

	// Perform addition with carrying from right to left
	let carry = 0
	let hasFinalCarry = false
	for (let i = maxLength - 1; i >= 0; i--) {
		const digit1 = addend1Digits[i] ?? 0
		const digit2 = addend2Digits[i] ?? 0
		const columnSum = digit1 + digit2 + carry

		if (columnSum >= 10) {
			carry = Math.floor(columnSum / 10)
			// Store carry to be displayed above the NEXT column to the left
			if (i > 0) {
				carried[i - 1] = carry
			} else {
				// This is a carry from the leftmost column
				hasFinalCarry = true
			}
			sumDigits.unshift(columnSum % 10)
		} else {
			carry = 0
			sumDigits.unshift(columnSum)
		}
	}

	// Handle final carry if present (from leftmost column)
	if (carry > 0) {
		sumDigits.unshift(carry)
	}

	return {
		addend1Digits,
		addend2Digits,
		sumDigits,
		carried,
		maxLength,
		hasFinalCarry
	}
}

/**
 * Generates an HTML representation of an addition problem with optional regrouping visualization
 */
export const generateAdditionWithRegrouping: WidgetGenerator<
	typeof AdditionWithRegroupingPropsSchema
> = async (data) => {
	const {
		addend1,
		addend2,
		showCarrying,
		showAnswer,
		revealUpTo = "complete"
	} = data

	const result = performAdditionWithRegrouping(addend1, addend2)
	const {
		addend1Digits,
		addend2Digits,
		sumDigits,
		carried,
		maxLength,
		hasFinalCarry
	} = result

	// Determine which columns to reveal based on revealUpTo
	let columnsToReveal = maxLength // Default to all columns
	if (showAnswer && revealUpTo !== "complete") {
		const placeValueMap = {
			ones: 1,
			tens: 2,
			hundreds: 3,
			thousands: 4,
			"ten-thousands": 5
		}
		columnsToReveal = Math.min(
			placeValueMap[revealUpTo] ?? maxLength,
			maxLength
		)
	}

	let html = `<div style="display: inline-block; font-family: ${theme.font.family.mono}; font-size: 1.4em; text-align: right;">`

	// Build the addition problem with carrying marks if showing carrying
	html += '<table style="border-collapse: collapse; position: relative;">'

	if (showCarrying) {
		// Row for carried numbers (shown above the addend1)
		html += "<tr>"
		html += "<td></td>" // Empty cell for operator column

		// If there's a final carry, we need an extra column on the left
		if (hasFinalCarry) {
			html += '<td style="padding: 0 8px;"></td>'
		}

		// Show carried values above the columns they affect
		// IMPORTANT: Avoid absolute positioning so the row contributes to layout height
		for (let index = 0; index < maxLength; index++) {
			const carryValue = carried[index] ?? 0

			if (carryValue > 0) {
				html +=
					'<td style="padding: 0 8px 6px; text-align: center; vertical-align: bottom;">' +
					`<span style="display: inline-block; font-size: 0.7em; color: #1E90FF; font-weight: bold;">${String(
						carryValue
					)}</span>` +
					"</td>"
			} else {
				html += '<td style="padding: 0 8px 6px;"></td>'
			}
		}
		html += "</tr>"
	}

	// First addend row
	html += "<tr>"
	html += "<td></td>" // Empty cell for operator column

	// Add empty cell if sum has extra digit and we're showing the answer
	if (hasFinalCarry && showAnswer) {
		html += '<td style="padding: 2px 8px;"></td>'
	}

	for (let index = 0; index < addend1Digits.length; index++) {
		const digit = addend1Digits[index]
		// Don't show leading zeros for the first addend
		const isLeadingZero =
			index < addend1Digits.length - 1 &&
			addend1Digits.slice(0, index + 1).every((d) => d === 0)
		html += `<td style="padding: 2px 8px;">${isLeadingZero ? "" : String(digit)}</td>`
	}
	html += "</tr>"

	// Second addend row with operator
	html += "<tr>"
	html += '<td style="padding: 2px 8px;">+</td>'

	// Add empty cell if sum has extra digit
	if (hasFinalCarry && showAnswer) {
		html += `<td style="padding: 2px 8px; border-bottom: 2px solid ${theme.colors.black};"></td>`
	}

	for (let index = 0; index < addend2Digits.length; index++) {
		const digit = addend2Digits[index]
		// Don't show leading zeros for the second addend
		const isLeadingZero =
			index < addend2Digits.length - 1 &&
			addend2Digits.slice(0, index + 1).every((d) => d === 0)
		html += `<td style="padding: 2px 8px; border-bottom: 2px solid ${theme.colors.black};">${isLeadingZero ? "" : String(digit)}</td>`
	}
	html += "</tr>"

	// Answer row (if showing)
	if (showAnswer) {
		html += "<tr>"
		html += "<td></td>" // Empty cell for operator column

		for (let index = 0; index < sumDigits.length; index++) {
			const digit = sumDigits[index]
			// Calculate position from right (1 = ones, 2 = tens, etc.)
			const columnPosition = sumDigits.length - index
			const shouldReveal =
				revealUpTo === "complete" || columnPosition <= columnsToReveal

			if (shouldReveal) {
				html +=
					'<td style="padding: 2px 8px; color: #4472c4; font-weight: bold;">'
				html += String(digit)
				html += "</td>"
			} else {
				// Empty cell for unrevealed digits
				html += '<td style="padding: 2px 8px;"></td>'
			}
		}
		html += "</tr>"
	}

	html += "</table>"
	html += "</div>"

	return html
}
