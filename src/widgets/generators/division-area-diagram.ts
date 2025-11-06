import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { theme } from "@/widgets/utils/theme"

// Using factories to prevent Zod from creating schemas with $refs, which can cause issues with some tools.

// Per-digit tokens to support digit-level highlighting and boxes
const createDigitTokenSchema = () =>
	z.discriminatedUnion("type", [
		z.object({
			type: z.literal("digit"),
			value: z.number(),
			color: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
		}),
		z.object({
			type: z.literal("boxedDigit"),
			value: z.number(),
			color: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
		}),
		z.object({ type: z.literal("emptyBox") }),
		z.object({ type: z.literal("spacer") })
	])
// Note: do not export or reuse a single schema instance to avoid $ref generation

type DigitToken =
	| { type: "digit"; value: number; color: string | null }
	| { type: "boxedDigit"; value: number; color: string | null }
	| { type: "emptyBox" }
	| { type: "spacer" }

/**
 * Defines a value for the quotient row, which can either be a known numeric value
 * or a placeholder box indicating a missing number to be filled in.
 */
const createValueOrPlaceholderSchema = () =>
	z
		.discriminatedUnion("type", [
			z.object({
				type: z.literal("value").describe("A known numeric value."),
				value: z
					.number()
					.describe("The numeric value to display (e.g., 10, 7)."),
				color: z
					.string()
					.nullable()
					.transform((val) =>
						val === "null" || val === "NULL" || val === "" ? null : val
					)
					.describe("Optional CSS color for this quotient part.")
			}),
			z.object({
				type: z
					.literal("placeholder")
					.describe("An unknown value represented by an empty box.")
			})
		])
		.describe("Represents either a known value or a placeholder box.")

// (all value/placeholder typing is derived from Zod schemas)

/**
 * Defines a single calculation step within a column of the area model, including
 * the numbers to be subtracted and the resulting difference.
 */
const createStepSchema = () =>
	z
		.object({
			subtrahend: z
				.number()
				.nullable()
				.describe(
					"The value being subtracted in this step (e.g., 30). Null to hide."
				),
			difference: z
				.number()
				.nullable()
				.describe("The result of the subtraction (e.g., 21). Null to hide."),
			differenceColor: z
				.string()
				.nullable()
				.describe(
					"Optional CSS color for the difference text (e.g., 'red'). Null for default color."
				),
			topTokens: z
				.array(createDigitTokenSchema())
				.nullable()
				.describe("Optional digit tokens for top dividend row."),
			subtrahendTokens: z
				.array(createDigitTokenSchema())
				.nullable()
				.describe("Optional digit tokens for subtrahend row."),
			differenceTokens: z
				.array(createDigitTokenSchema())
				.nullable()
				.describe("Optional digit tokens for difference row."),
			rightPanel: z
				.object({
					tokensTop: z.array(createDigitTokenSchema()).nullable(),
					minusTokens: z.array(createDigitTokenSchema()).nullable(),
					bottomTokens: z.array(createDigitTokenSchema()).nullable()
				})
				.nullable()
				.describe("Optional auxiliary right-side panel with digit tokens")
		})
		.strict()

type Step = {
	subtrahend: number | null
	difference: number | null
	differenceColor: string | null
	topTokens: DigitToken[] | null
	subtrahendTokens: DigitToken[] | null
	differenceTokens: DigitToken[] | null
	rightPanel: {
		tokensTop: DigitToken[] | null
		minusTokens: DigitToken[] | null
		bottomTokens: DigitToken[] | null
	} | null
}

/**
 * Main Zod schema for the divisionAreaDiagram widget.
 */
export const DivisionAreaDiagramPropsSchema = z
	.object({
		type: z.literal("divisionAreaDiagram"),
		divisor: z
			.number()
			.describe("The divisor, displayed on the left side of the model."),
		dividend: z
			.number()
			.describe("The initial dividend, displayed in the first column."),
		quotientParts: z
			.array(createValueOrPlaceholderSchema())
			.describe("An array of quotient parts displayed across the top."),
		steps: z
			.array(createStepSchema())
			.describe(
				"An array of calculation steps. Its length must match quotientParts."
			),
		showFinalRemainderBox: z
			.boolean()
			.describe("If true, shows the final zero remainder with a box around it.")
	})
	.strict()
	.describe(
		"Creates a visual area model for long division, showing partial quotients and step-by-step subtraction."
	)

export type DivisionAreaDiagramProps = z.infer<
	typeof DivisionAreaDiagramPropsSchema
>

/**
 * Generates an HTML table representing a division area model.
 */
export const generateDivisionAreaDiagram: WidgetGenerator<
	typeof DivisionAreaDiagramPropsSchema
> = async (props) => {
	let { divisor, dividend, quotientParts, steps, showFinalRemainderBox } = props

	// Helper to render string content, optionally with a color.
	const renderContent = (
		content: string | number | null,
		color?: string | null
	): string => {
		if (content === null) return " "
		const text = typeof content === "number" ? String(content) : content
		// Simple HTML escaping for numbers/operators
		const escapedContent = text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
		// Use tabular numbers to keep digits aligned uniformly
		const style = `${color ? `color: ${color};` : ""} font-variant-numeric: tabular-nums; letter-spacing: 0;`
		// Using a span to ensure styling is applied correctly.
		return `<span style="${style}">${escapedContent}</span>`
	}

	const renderTokenSpan = (
		token: DigitToken,
		opts?: { leftBorder?: boolean; rightBorder?: boolean }
	): string => {
		const baseSpan =
			"display:inline-block; width: 16px; text-align:center; padding: 0; margin: 0; box-sizing: border-box;"
		if (token.type === "digit") {
			const color = token.color ? `color: ${token.color};` : ""
			return `<span style="${baseSpan} ${color}">${renderContent(token.value, token.color)}</span>`
		}
		if (token.type === "boxedDigit") {
			const color = token.color ? `color: ${token.color};` : ""
			const left = opts?.leftBorder
				? "border-left: 1.5px solid black;"
				: "border-left: 0;"
			const right = opts?.rightBorder
				? "border-right: 1.5px solid black;"
				: "border-right: 0;"
			return `<span style="${baseSpan} border-top: 1.5px solid black; border-bottom: 1.5px solid black; ${left} ${right} padding: 2px 2px; ${color}">${renderContent(token.value, token.color)}</span>`
		}
		if (token.type === "spacer") {
			return `<span style="${baseSpan}"> </span>`
		}
		// emptyBox
		return `<span style="${baseSpan} border: 1.5px solid black; padding: 8px 2px;"></span>`
	}

	// Inline tokens container to embed consistently in the right content cell
	const DIGIT_SLOT_PX = 16
	const GRID_COLS = 3
	const GRID_WIDTH_PX = DIGIT_SLOT_PX * GRID_COLS
	const DIFF_TOP_MARGIN_PX = 6
	const UNDERLINE_TOP_GAP_PX = 4
	const renderTokensGrid = (tokens: DigitToken[]): string => {
		const firstIdx = tokens.findIndex((t) => t.type === "boxedDigit")
		let lastIdx = -1
		for (let i = tokens.length - 1; i >= 0; i--) {
			if (tokens[i].type === "boxedDigit") {
				lastIdx = i
				break
			}
		}
		return `<div style="display:grid; grid-auto-flow: column; grid-template-columns: repeat(${GRID_COLS}, ${DIGIT_SLOT_PX}px); column-gap: 0px; align-items: center; font-variant-numeric: tabular-nums;">${tokens
			.map((t, i) =>
				renderTokenSpan(t, {
					leftBorder: i === firstIdx && firstIdx !== -1,
					rightBorder: i === lastIdx && lastIdx !== -1
				})
			)
			.join("")}</div>`
	}
	const renderAlignedTokens = (tokens: DigitToken[]): string => {
		return `<div style="width: ${GRID_WIDTH_PX}px; margin-left: auto;">${renderTokensGrid(tokens)}</div>`
	}
	const renderAlignedTokensUnderlined = (tokens: DigitToken[]): string => {
		return `<div style="width: ${GRID_WIDTH_PX}px; margin-left: auto; padding-bottom: ${UNDERLINE_TOP_GAP_PX}px; border-bottom: 1.5px solid black; box-sizing: border-box;">${renderTokensGrid(tokens)}</div>`
	}
	const renderAlignedTokensWithGap = (tokens: DigitToken[]): string => {
		return `<div style="width: ${GRID_WIDTH_PX}px; margin-left: auto; margin-top: ${DIFF_TOP_MARGIN_PX}px;">${renderTokensGrid(tokens)}</div>`
	}

	// Convert a numeric value into digit tokens for uniform layout
	const toDigitTokens = (
		value: number,
		color?: string | null
	): DigitToken[] => {
		const str = String(value)
		const tokens: DigitToken[] = []
		for (const ch of str) {
			if (ch >= "0" && ch <= "9") {
				tokens.push({ type: "digit", value: Number(ch), color: color ?? null })
			}
			// Ignore non-digits (no negatives or decimals in our use-cases)
		}
		return tokens
	}

	// Pad tokens on the left to align by ones column
	const leftPadTokens = (
		tokens: DigitToken[],
		totalSlots: number
	): DigitToken[] => {
		const padCount = Math.max(0, totalSlots - tokens.length)
		const pads: DigitToken[] = Array.from({ length: padCount }, () => ({
			type: "spacer"
		}))
		return [...pads, ...tokens]
	}

	// Helper to render a placeholder box.
	const renderPlaceholder = (): string => {
		return `<div style="width: 40px; height: 24px; border: 1.5px solid ${theme.colors.border}; margin: auto;"></div>`
	}

	// Main table wrapper
	let html = `<div style="display: inline-block; font-family: ${theme.font.family.sans}; font-size: 1.2em;">`
	html += `<table cellpadding="10" align="center" style="border: none; border-collapse: collapse; margin: auto;">`
	html += "<tbody>"

	// Top Row: Quotient Parts
	html += "<tr>"
	// Top-left corner spacer (no borders to avoid visible corner artifact)
	html += `<td style="width: 40px; height: 40px; border: none; padding: 0;"></td>`
	for (const part of quotientParts) {
		const content =
			part.type === "value" ? renderContent(part.value) : renderPlaceholder()
		const style =
			"width: 80px; height: 40px; background-color: #EBF5FB; text-align:center; padding: 10px;"
		html += `<td style="${style}">${content}</td>`
	}
	html += "</tr>"

	// Main Row: Divisor and Steps
	html += "<tr>"

	// Divisor Cell
	html += `<td style="vertical-align: top; text-align: right; padding: 0; padding-right: 5px;">`
	html += `<div style="padding: 12px; background-color: #EBF5FB; display: inline-block; margin-top: 5px;">${renderContent(divisor)}</div>`
	html += "</td>"

	// Steps Cells
	const stepsTyped: Step[] = steps
	for (let index = 0; index < stepsTyped.length; index++) {
		const step = stepsTyped[index]
		const isFirst = index === 0
		const isLast = index === steps.length - 1
		const borderStyle = `border-top: 1.5px solid black; border-bottom: 1.5px solid black;${isFirst ? " border-left: 1.5px solid black;" : ""}${isLast ? " border-right: 1.5px solid black;" : ""}`
		html += `<td style="width: 80px; vertical-align: top; text-align: center; padding: 5px; ${borderStyle}">`
		// Inner table for this step's calculation
		html += `<table cellpadding="0" align="center" style="width: 100%; border: none; border-collapse: collapse;"><tbody>`

		// Dividend for this step (always 2 columns: spacer + content)
		if (step.topTokens && step.topTokens.length > 0) {
			html += "<tr>"
			html += `<td style="width: 16px; text-align:right; padding: 0;"> </td>`
			const tokens = step.topTokens
			const padded = leftPadTokens(tokens, 3)
			html += `<td style="text-align:left; padding: 0;">${renderAlignedTokens(padded)}</td>`
			html += "</tr>"
		} else {
			html += "<tr>"
			html += `<td style="width: 16px; text-align:right; padding: 0;"> </td>`
			const padded = leftPadTokens(toDigitTokens(dividend), 3)
			html += `<td style="text-align:left; padding: 0;">${renderAlignedTokens(padded)}</td>`
			html += "</tr>"
		}

		if (step.subtrahendTokens && step.subtrahendTokens.length > 0) {
			// Subtraction line with tokenized subtrahend (2 columns: minus + content)
			html += "<tr>"
			html += `<td style="width: 16px; text-align:right; padding: 0 2px 0 0; font-variant-numeric: tabular-nums;">${renderContent("−")}</td>`
			const subTokens = step.subtrahendTokens
			const paddedSub = leftPadTokens(subTokens, 3)
			html += `<td style="text-align:left; padding: 0;">${renderAlignedTokensUnderlined(paddedSub)}</td>`
			html += "</tr>"
		} else if (step.subtrahend !== null) {
			// Subtraction line
			html += "<tr>"
			html += `<td style="width: 16px; text-align:right; padding: 0 2px 0 0; font-variant-numeric: tabular-nums;">${renderContent("−")}</td>`
			const paddedSub = leftPadTokens(toDigitTokens(step.subtrahend), 3)
			html += `<td style="text-align:left; padding: 0;">${renderAlignedTokensUnderlined(paddedSub)}</td>`
			html += "</tr>"
		}

		if (step.differenceTokens && step.differenceTokens.length > 0) {
			html += "<tr>"
			html += `<td style="width: 16px; text-align:right; padding: 0;"> </td>`
			const diffTokens = step.differenceTokens
			const paddedDiff = leftPadTokens(diffTokens, 3)
			html += `<td style="text-align:left; padding: 0;">${renderAlignedTokensWithGap(paddedDiff)}</td>`
			html += "</tr>"
		} else if (step.difference !== null) {
			// Difference (remainder)
			html += "<tr>"
			html += `<td style="width: 16px; text-align:right; padding: 0;"> </td>`
			html += `<td style="text-align:left; padding: 0;">`
			if (showFinalRemainderBox && index === steps.length - 1) {
				const paddedBox = leftPadTokens(toDigitTokens(step.difference), 3)
				html += `<div style="display:flex; justify-content:flex-end; width: ${GRID_WIDTH_PX}px; margin-left:auto; margin-top: ${DIFF_TOP_MARGIN_PX}px;"><div style="border: 1.5px solid black; display: inline-block; padding: 1px 8px;">${renderTokensGrid(
					paddedBox
				)}</div></div>`
			} else {
				const padded = leftPadTokens(
					toDigitTokens(step.difference, step.differenceColor),
					3
				)
				html += renderAlignedTokensWithGap(padded)
			}
			html += "</td></tr>"
		}

		html += "</tbody></table></td>"

		// The difference of this step becomes the dividend of the next.
		if (step.difference !== null) {
			dividend = step.difference
		}
	}

	html += "</tr>"
	html += "</tbody></table></div>"

	return html
}
