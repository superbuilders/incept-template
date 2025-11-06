import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { theme } from "@/widgets/utils/theme"

// The main Zod schema for the verticalArithmeticSetup function
export const VerticalArithmeticSetupPropsSchema = z
	.object({
		type: z
			.literal("verticalArithmeticSetup")
			.describe(
				"Identifies this as a vertical arithmetic setup widget for displaying math problems in traditional column format."
			),
		title: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Optional instruction or problem context displayed above the arithmetic (e.g., 'Calculate:', 'Find the product:', 'Solve:', null). Null means no title."
			),
		operand1: z
			.string()
			.describe(
				"The top number in the calculation, as a string to preserve formatting (e.g., '345', '12.5', '1,234', '7'). Appears above the line."
			),
		operand2: z
			.string()
			.describe(
				"The bottom number in the calculation, as a string to preserve formatting (e.g., '67', '0.25', '89', '456'). Appears below operand1."
			),
		operator: z
			.enum(["×", "+", "−"])
			.describe(
				"The arithmetic operation symbol. '×' for multiplication, '+' for addition, '−' for subtraction. Appears to the left of operand2."
			)
	})
	.strict()
	.describe(
		"Creates a traditional vertical (column) arithmetic setup showing two numbers with an operation, ready for students to solve. Displays numbers aligned by place value with the operator symbol and a horizontal line where the answer would go. Perfect for teaching standard algorithms for addition, subtraction, and multiplication."
	)

export type VerticalArithmeticSetupProps = z.infer<
	typeof VerticalArithmeticSetupPropsSchema
>

/**
 * This template is designed to generate a clear, standards-compliant visual representation
 * of a vertical arithmetic problem within an HTML div. It is ideal for scaffolding
 * multi-digit multiplication, addition, or subtraction problems.
 */
export const generateVerticalArithmeticSetup: WidgetGenerator<
	typeof VerticalArithmeticSetupPropsSchema
> = async (data) => {
	const { title, operand1, operand2, operator } = data

	let html = `<div style="display: inline-block; font-family: ${theme.font.family.mono}; font-size: 1.2em; text-align: right;">`
	if (title !== null) {
		html += `<div style="text-align: center; margin-bottom: 5px; font-family: ${theme.font.family.sans};">${title}</div>`
	}
	html += `<table style="border-collapse: collapse;">`
	html += `<tr><td></td><td style="padding: 2px 5px;">${operand1}</td></tr>`
	html += `<tr><td style="padding: 2px 5px;">${operator}</td><td style="padding: 2px 5px; border-bottom: 2px solid ${theme.colors.black};">${operand2}</td></tr>`
	html += "</table>"
	html += "</div>"
	return html
}
