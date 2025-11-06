import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { theme } from "@/widgets/utils/theme"

// Factory function to create subtraction with regrouping schema - avoids $ref in OpenAI JSON schema
function createSubtractionWithRegroupingPropsSchema() {
	return z
		.object({
			type: z
				.literal("subtractionWithRegrouping")
				.describe(
					"Identifies this as a subtraction with regrouping widget for teaching the borrowing/regrouping algorithm in subtraction."
				),
			minuend: z
				.number()
				.int()
				.describe(
					"The top number (the number being subtracted from) as an integer (e.g., 52, -27, 235, 1000, 4321). Can be positive or negative. Must be greater than the subtrahend for valid subtraction."
				),
			subtrahend: z
				.number()
				.int()
				.describe(
					"The bottom number (the number being subtracted) as an integer (e.g., 27, -15, 168, 543, 1876). Can be positive or negative. Must be less than the minuend."
				),
			showRegrouping: z
				.boolean()
				.describe(
					"Whether to show the borrowing/regrouping marks (crossed-out digits and borrowed values). When true, displays the regrouping visualization. When false, shows clean numbers without borrowing marks."
				),
			showAnswer: z
				.boolean()
				.describe(
					"Whether to show the difference/result. When true, displays the answer below the line. When false, shows only the problem setup. Works independently from showRegrouping."
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
			"Creates a visual representation of subtraction with regrouping (borrowing). Shows the traditional column format with independent control of regrouping marks and answer display. Perfect for step-by-step teaching. Common usage: 1) showRegrouping=false, showAnswer=false for plain problem, 2) showRegrouping=true, showAnswer=false to show borrowing process, 3) showRegrouping=true, showAnswer=true for complete solution. The revealUpTo field is ignored when showAnswer is false."
		)
}

// Export the factory function call directly to avoid $ref generation
export const SubtractionWithRegroupingPropsSchema =
	createSubtractionWithRegroupingPropsSchema()

export type SubtractionWithRegroupingProps = z.infer<
	typeof SubtractionWithRegroupingPropsSchema
>

/**
 * Performs subtraction with regrouping and returns the steps
 * NOTE: The difference is calculated here in our code (minuend - subtrahend), not by AI.
 * This ensures accurate mathematical computation independent of any AI model.
 */
function performSubtractionWithRegrouping(minuend: number, subtrahend: number) {
	const minuendStr = minuend.toString()
	const subtrahendStr = subtrahend.toString().padStart(minuendStr.length, "0")
	// Calculate the actual difference ourselves - no AI involved
	const difference = minuend - subtrahend
	const differenceStr = difference.toString().padStart(minuendStr.length, "0")

	// Arrays to track regrouping
	const minuendDigits = minuendStr.split("").map(Number)
	const subtrahendDigits = subtrahendStr.split("").map(Number)
	const differenceDigits = differenceStr.split("").map(Number)
	const borrowed: boolean[] = new Array(minuendDigits.length).fill(false)
	const regroupedMinuend = [...minuendDigits]

	// Perform regrouping from right to left
	for (let i = minuendDigits.length - 1; i >= 0; i--) {
		const topDigit = regroupedMinuend[i]
		const bottomDigit = subtrahendDigits[i]

		if (
			topDigit !== undefined &&
			bottomDigit !== undefined &&
			topDigit < bottomDigit
		) {
			// Need to borrow from the left
			let borrowFrom = i - 1
			while (borrowFrom >= 0 && regroupedMinuend[borrowFrom] === 0) {
				regroupedMinuend[borrowFrom] = 9
				borrowed[borrowFrom] = true
				borrowFrom--
			}
			if (borrowFrom >= 0) {
				const borrowValue = regroupedMinuend[borrowFrom]
				if (borrowValue !== undefined) {
					regroupedMinuend[borrowFrom] = borrowValue - 1
					borrowed[borrowFrom] = true
				}
				const currentValue = regroupedMinuend[i]
				if (currentValue !== undefined) {
					regroupedMinuend[i] = currentValue + 10
				}
			}
		}
	}

	return {
		minuendDigits,
		subtrahendDigits,
		differenceDigits,
		borrowed,
		regroupedMinuend
	}
}

/**
 * Generates an HTML representation of a subtraction problem with optional regrouping visualization
 */
export const generateSubtractionWithRegrouping: WidgetGenerator<
	typeof SubtractionWithRegroupingPropsSchema
> = async (data) => {
	const {
		minuend,
		subtrahend,
		showRegrouping,
		showAnswer,
		revealUpTo = "complete"
	} = data

	// Validate that minuend > subtrahend
	if (minuend <= subtrahend) {
		logger.error("invalid subtraction parameters", { minuend, subtrahend })
		throw errors.new(
			"minuend must be greater than subtrahend for valid subtraction"
		)
	}

	const result = performSubtractionWithRegrouping(minuend, subtrahend)
	const {
		minuendDigits,
		subtrahendDigits,
		differenceDigits,
		regroupedMinuend
	} = result

	// Determine which columns to reveal based on revealUpTo
	const maxLength = minuendDigits.length
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

	// Build the minuend row with regrouping marks if showing regrouping
	html += '<table style="border-collapse: collapse; position: relative;">'

	if (showRegrouping) {
		// Row for regrouping numbers (shown above the minuend)
		html += "<tr>"
		html += "<td></td>" // Empty cell for operator column
		for (let index = 0; index < minuendDigits.length; index++) {
			const digit = minuendDigits[index]
			const regroupedValue = regroupedMinuend[index]

			// Show regrouped value if it's different from the original (either gave or received a borrow)
			if (regroupedValue !== undefined && regroupedValue !== digit) {
				// Show the regrouped value in small blue text above
				html += '<td style="padding: 0 8px; position: relative;">'
				html +=
					'<div style="position: absolute; top: -18px; left: 0; right: 0; text-align: center; font-size: 0.7em; color: #1E90FF;">'
				html +=
					regroupedValue < 10
						? String(regroupedValue)
						: `1${regroupedValue % 10}`
				html += "</div>"
				html += "</td>"
			} else {
				html += '<td style="padding: 0 8px;"></td>'
			}
		}
		html += "</tr>"
	}

	// Minuend row
	html += "<tr>"
	html += "<td></td>" // Empty cell for operator column
	for (let index = 0; index < minuendDigits.length; index++) {
		const digit = minuendDigits[index]
		const regroupedValue = regroupedMinuend[index]

		// Cross out any digit that changed (gave or received a borrow)
		if (
			showRegrouping &&
			regroupedValue !== undefined &&
			regroupedValue !== digit
		) {
			// Show crossed out original digit
			html += '<td style="padding: 2px 8px; position: relative;">'
			html += `<span style="text-decoration: line-through; text-decoration-color: #FF6B6B; text-decoration-thickness: 2px;">${digit}</span>`
			html += "</td>"
		} else {
			html += `<td style="padding: 2px 8px;">${digit}</td>`
		}
	}
	html += "</tr>"

	// Subtrahend row with operator
	html += "<tr>"
	html += '<td style="padding: 2px 8px;">−</td>'
	for (const digit of subtrahendDigits) {
		html += `<td style="padding: 2px 8px; border-bottom: 2px solid ${theme.colors.black};">${digit === 0 && digit !== subtrahendDigits[subtrahendDigits.length - 1] ? "" : digit}</td>`
	}
	html += "</tr>"

	// Answer row (if showing)
	if (showAnswer) {
		html += "<tr>"
		html += "<td></td>" // Empty cell for operator column
		for (let index = 0; index < differenceDigits.length; index++) {
			const digit = differenceDigits[index]
			const columnPosition = maxLength - index // Column position from right (1-based)
			const shouldReveal =
				revealUpTo === "complete" || columnPosition <= columnsToReveal

			// Don't show leading zeros
			const isLeadingZero =
				index < differenceDigits.length - 1 &&
				differenceDigits.slice(0, index + 1).every((d) => d === 0)
			html +=
				'<td style="padding: 2px 8px; color: #4472c4; font-weight: bold;">'
			html += shouldReveal && !isLeadingZero ? String(digit) : ""
			html += "</td>"
		}
		html += "</tr>"
	}

	html += "</table>"
	html += "</div>"

	return html
}
