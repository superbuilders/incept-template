import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"

export const ErrInvalidStemLeafData = errors.new("invalid stem-leaf plot data")

const LeafEntry = z
	.object({
		stem: z
			.union([z.number(), z.string()])
			.describe(
				"The stem value (e.g., 6, 7, 8, 9). Can be number or string for decimal stems like '1.2'."
			),
		leaves: z
			.array(z.union([z.number(), z.string()]))
			.describe(
				"Array of leaf values for this stem (e.g., [2, 7] for stem 6 means 6.2 and 6.7). Can be numbers or strings."
			)
	})
	.strict()

export const StemLeafPlotPropsSchema = z
	.object({
		type: z
			.literal("stemLeafPlot")
			.describe(
				"Identifies this as a stem-and-leaf plot widget for displaying data distributions."
			),
		title: z
			.string()
			.describe(
				"Required title above the plot describing what data is shown (e.g., 'Skateboarding Scores', 'Test Results', 'Temperature Readings'). This helps students understand what they're analyzing."
			),
		data: z
			.array(LeafEntry)
			.min(1)
			.describe(
				"Array of stem-leaf entries. Each entry has a stem and its associated leaves. Must have at least one entry."
			),
		keyExample: z
			.object({
				stem: z
					.union([z.number(), z.string()])
					.describe("The stem value shown in the key example (e.g., 7)."),
				leaf: z
					.union([z.number(), z.string()])
					.describe("The leaf value shown in the key example (e.g., 1)."),
				value: z
					.union([z.number(), z.string()])
					.describe(
						"What the stem|leaf combination represents (e.g., 7.1 or '71')."
					)
			})
			.strict()
			.describe(
				"CRITICAL: The widget automatically renders this key example below the plot (e.g., 'Key: A stem of 7 with a leaf of 1 represents 7.1.'). DO NOT duplicate this explanation in the body content - it is already included in the widget output."
			),
		stemLabel: z
			.string()
			.describe(
				"Label for the stem column header (e.g., 'Stem', 'Tens', 'Ones Place'). Use 'Stem' for standard plots."
			),
		leafLabel: z
			.string()
			.describe(
				"Label for the leaf column header (e.g., 'Leaf', 'Ones', 'Tenths Place'). Use 'Leaf' for standard plots."
			)
	})
	.strict()
	.describe(
		"Creates a stem-and-leaf plot table for displaying numerical data distributions. Shows stems in left column and leaves in right column. IMPORTANT: The widget automatically includes a key example at the bottom explaining how to read the plot (e.g., 'Key: A stem of 7 with a leaf of 1 represents 7.1.') - DO NOT repeat this explanation in the body content."
	)

export type StemLeafPlotProps = z.infer<typeof StemLeafPlotPropsSchema>

/**
 * Generates a stem-and-leaf plot as an HTML table.
 * Stem-and-leaf plots are used to display the distribution of numerical data
 * while preserving the actual data values, making them ideal for educational contexts.
 */
export const generateStemLeafPlot: WidgetGenerator<
	typeof StemLeafPlotPropsSchema
> = async (data) => {
	const { title, data: plotData, keyExample, stemLabel, leafLabel } = data

	if (plotData.length === 0) {
		logger.error("stem-leaf plot data is empty", { data })
		throw errors.wrap(ErrInvalidStemLeafData, "data array cannot be empty")
	}

	logger.debug("generating stem-leaf plot", {
		title,
		rowCount: plotData.length,
		stemLabel,
		leafLabel,
		hasKeyExample: Boolean(keyExample)
	})

	// Build the stem-and-leaf plot with characteristic visual style
	const parts: string[] = []

	// Title (required)
	parts.push(
		`<p style="font-weight: 600; margin-bottom: 8px;">${escapeHtml(title)}</p>`
	)

	// Container div for the plot
	parts.push(
		"<div style=\"display: inline-block; font-family: 'Courier New', monospace; border: 2px solid #374151; border-radius: 8px; padding: 16px; background-color: #F9FAFB; margin: 12px 0;\">"
	)

	// Header row with column labels
	parts.push(
		'<div style="display: flex; gap: 24px; padding-bottom: 8px; border-bottom: 2px solid #374151; margin-bottom: 12px;">'
	)
	parts.push(
		`<div style="font-weight: 700; min-width: 60px; text-align: center; color: #374151;">${escapeHtml(stemLabel)}</div>`
	)
	parts.push(
		'<div style="width: 2px; background-color: #374151; margin: 0 8px;"></div>'
	)
	parts.push(
		`<div style="font-weight: 700; color: #374151;">${escapeHtml(leafLabel)}</div>`
	)
	parts.push("</div>")

	// Data rows with characteristic stem-leaf separator
	for (const entry of plotData) {
		const stemStr = String(entry.stem)
		const leavesStr = entry.leaves.map((l) => String(l)).join("  ")

		parts.push(
			'<div style="display: flex; gap: 24px; padding: 4px 0; line-height: 1.6;">'
		)
		// Stem column (right-aligned)
		parts.push(
			`<div style="min-width: 60px; text-align: right; font-weight: 600; color: #1F2937; padding-right: 8px;">${escapeHtml(stemStr)}</div>`
		)
		// Vertical separator line (the key characteristic of stem-and-leaf plots)
		parts.push('<div style="width: 2px; background-color: #374151;"></div>')
		// Leaves (left-aligned with extra spacing between values)
		parts.push(
			`<div style="color: #1F2937; letter-spacing: 0.1em;">${escapeHtml(leavesStr)}</div>`
		)
		parts.push("</div>")
	}

	parts.push("</div>") // Close container

	// Key example (explanatory note)
	parts.push(
		`<p style="font-size: 14px; color: #6B7280; margin-top: 8px; font-style: italic;">Key: A stem of ${escapeHtml(String(keyExample.stem))} with a leaf of ${escapeHtml(String(keyExample.leaf))} represents ${escapeHtml(String(keyExample.value))}.</p>`
	)

	const html = parts.join("")

	logger.debug("generated stem-leaf plot html", {
		htmlLength: html.length,
		rows: plotData.length
	})

	return html
}

/**
 * Escapes HTML special characters to prevent XSS and rendering issues.
 */
function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;"
	}
	return text.replace(/[&<>"']/g, (char) => map[char] ?? char)
}
