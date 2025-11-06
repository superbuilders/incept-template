import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"

export const ErrInvalidTableData = errors.new("invalid table data")

// Cell content can be simple text or a structured object with text and/or math
const RichTextWithMathSchema = z
	.object({
		text: z.string().describe("Text portion of cell"),
		mathml: z.string().describe("MathML portion of cell to append after text")
	})
	.strict()
	.describe(
		"Structured cell with text and MathML (e.g., {text: 'Temperature: ', mathml: '<mn>25</mn>'}). Both text and mathml are required if using this form."
	)

const CellContentSchema = z.union([
	z.string().describe("Plain text cell content"),
	RichTextWithMathSchema
])

const RowSchema = z
	.array(CellContentSchema.nullable())
	.describe(
		"Array of cell values for one row. Use null for empty cells. Can mix text and structured content."
	)

export const DataTablePropsSchema = z
	.object({
		type: z
			.literal("dataTable")
			.describe("Identifies this as a data table widget."),
		caption: z
			.string()
			.nullable()
			.describe(
				"Optional caption above the table (e.g., 'Temperature Measurements', 'Properties of Matter'). Use null for no caption."
			),
		headers: z
			.array(CellContentSchema)
			.min(1)
			.describe(
				"Column headers for the table (e.g., ['Month', 'Temperature', 'Rainfall']). Must have at least one header."
			),
		rows: z
			.array(RowSchema)
			.min(1)
			.describe(
				"Data rows. Each row is an array of cell values matching the number of headers. Must have at least one row."
			),
		rowHeaders: z
			.boolean()
			.describe(
				"If true, the first column will be styled as row headers (bold). Use for tables where the first column labels each row. Set to false for regular tables."
			)
	})
	.strict()
	.describe(
		"Creates a data table for displaying tabular information. Use this for ANY data table with rows and columns (temperature charts, comparison tables, measurement data, etc.). This is the standard table widget - use it for 99% of table needs."
	)

export type DataTableProps = z.infer<typeof DataTablePropsSchema>

/**
 * Generates an HTML data table.
 * This is the standard table widget for displaying tabular data.
 */
export const generateDataTable: WidgetGenerator<
	typeof DataTablePropsSchema
> = async (data) => {
	const { caption, headers, rows, rowHeaders } = data

	if (headers.length === 0) {
		logger.error("table has no headers", { data })
		throw errors.wrap(ErrInvalidTableData, "headers array cannot be empty")
	}

	if (rows.length === 0) {
		logger.error("table has no rows", { data })
		throw errors.wrap(ErrInvalidTableData, "rows array cannot be empty")
	}

	// Validate all rows have correct number of cells
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i]
		if (!row) {
			logger.error("table row is null/undefined", { rowIndex: i })
			throw errors.wrap(ErrInvalidTableData, `row ${i} is null/undefined`)
		}
		if (row.length !== headers.length) {
			logger.error("table row has wrong number of cells", {
				rowIndex: i,
				expected: headers.length,
				actual: row.length
			})
			throw errors.wrap(
				ErrInvalidTableData,
				`row ${i} has ${row.length} cells but expected ${headers.length}`
			)
		}
	}

	logger.debug("generating data table", {
		caption,
		columnCount: headers.length,
		rowCount: rows.length,
		hasRowHeaders: rowHeaders
	})

	const parts: string[] = []

	// Optional caption
	if (caption) {
		parts.push(
			`<p style="font-weight: 600; margin-bottom: 8px;">${escapeHtml(caption)}</p>`
		)
	}

	// Table start
	parts.push(
		'<table style="border-collapse: collapse; width: 100%; margin: 12px 0;">'
	)

	// Header row
	parts.push("<thead><tr>")
	for (const header of headers) {
		const headerContent = renderCellContent(header)
		parts.push(
			`<th style="border: 1px solid #ddd; padding: 8px 12px; text-align: left; background-color: #f9fafb; font-weight: 600;">${headerContent}</th>`
		)
	}
	parts.push("</tr></thead>")

	// Body rows
	parts.push("<tbody>")
	for (const row of rows) {
		parts.push("<tr>")
		for (let colIndex = 0; colIndex < row.length; colIndex++) {
			const cell = row[colIndex]
			const cellContent = cell ? renderCellContent(cell) : ""
			const isRowHeader = rowHeaders && colIndex === 0

			if (isRowHeader) {
				// First column as row header
				parts.push(
					`<th scope="row" style="border: 1px solid #ddd; padding: 8px 12px; text-align: left; background-color: #f9fafb; font-weight: 600;">${cellContent}</th>`
				)
			} else {
				// Regular cell
				parts.push(
					`<td style="border: 1px solid #ddd; padding: 8px 12px; vertical-align: top;">${cellContent}</td>`
				)
			}
		}
		parts.push("</tr>")
	}
	parts.push("</tbody>")

	parts.push("</table>")

	const html = parts.join("")

	logger.debug("generated data table html", {
		htmlLength: html.length,
		rows: rows.length,
		columns: headers.length
	})

	return html
}

/**
 * Renders cell content which can be a string or structured object with text/mathml
 */
function renderCellContent(
	content: string | { text: string; mathml: string }
): string {
	if (typeof content === "string") {
		return escapeHtml(content)
	}

	const parts: string[] = []
	parts.push(escapeHtml(content.text))
	parts.push(
		`<math xmlns="http://www.w3.org/1998/Math/MathML">${content.mathml}</math>`
	)
	return parts.join("")
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
