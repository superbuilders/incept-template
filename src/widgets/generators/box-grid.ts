import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { MATHML_INNER_PATTERN } from "@/widgets/utils/mathml"
import { numberContentToInnerMathML } from "@/widgets/utils/number-to-mathml"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Defines the content and styling for a single cell in the grid.
const BoxGridCellSchema = z
	.object({
		content: z
			.discriminatedUnion("type", [
				// text-only removed: we render numbers/math as MathML for consistent typography
				z
					.object({
						type: z
							.literal("math")
							.describe("Identifies this as mathematical content"),
						mathml: z
							.string()
							.regex(
								MATHML_INNER_PATTERN,
								"invalid mathml snippet; must be inner MathML without outer <math> wrapper"
							)
							.describe("Inner MathML markup (no outer <math> element)")
					})
					.strict()
					.describe("Mathematical content represented in MathML format"),
				z
					.object({
						type: z.literal("whole").describe("Whole number content"),
						value: z
							.number()
							.int()
							.describe("Integer magnitude (non-directional)"),
						sign: z.enum(["+", "-"]).describe("Sign of the number")
					})
					.strict()
					.describe("Whole number content with explicit sign"),
				z
					.object({
						type: z.literal("fraction").describe("Fractional number content"),
						numerator: z
							.number()
							.int()
							.min(0)
							.describe("Numerator (non-negative)"),
						denominator: z
							.number()
							.int()
							.positive()
							.describe("Denominator (positive)"),
						sign: z.enum(["+", "-"]).describe("Sign of the fraction")
					})
					.strict()
					.describe("Fractional number content with explicit sign"),
				z
					.object({
						type: z
							.literal("mixed")
							.describe("Mixed number content like 1 1/4"),
						whole: z
							.number()
							.int()
							.min(0)
							.describe("Whole part (non-negative)"),
						numerator: z
							.number()
							.int()
							.min(0)
							.describe("Numerator of the fractional part"),
						denominator: z
							.number()
							.int()
							.positive()
							.describe("Denominator of the fractional part (positive)"),
						sign: z.enum(["+", "-"]).describe("Sign of the mixed number")
					})
					.strict()
					.describe("Mixed number content with explicit sign")
			])
			.describe(
				"Inline content for the cell: math (MathML) or number (whole/fraction/mixed)"
			),
		backgroundColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Hex-only color for the cell background (e.g., '#FFE5B4', '#1E90FF', '#FF00004D' for ~30% alpha, null). Null means no background color (transparent)."
			)
	})
	.strict()

// The main Zod schema for the boxGrid function.
export const BoxGridPropsSchema = z
	.object({
		type: z
			.literal("boxGrid")
			.describe(
				"Identifies this as a box grid widget for displaying tabular data with optional cell highlighting."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		data: z
			.array(z.array(BoxGridCellSchema))
			.describe(
				"2D array where data[row][col] represents the cell content. First row often contains headers. All rows should have the same number of columns for proper alignment."
			),
		showGridLines: z
			.boolean()
			.describe(
				"Whether to show borders between cells. True creates a traditional table look. False creates a borderless layout, useful for highlighting patterns."
			)
	})
	.strict()
	.describe(
		"Creates a grid/table structure for displaying data, patterns, or mathematical arrays. Supports individual cell highlighting for emphasis. Useful for multiplication tables, data organization, and pattern recognition."
	)

export type BoxGridProps = z.infer<typeof BoxGridPropsSchema>

/**
 * Generates an SVG diagram of a grid of cells, with each cell capable of
 * displaying data and having a custom background color for highlighting.
 */
export const generateBoxGrid: WidgetGenerator<
	typeof BoxGridPropsSchema
> = async (props) => {
	const { width, height, data, showGridLines } = props

	const numRows = data.length
	if (numRows === 0) {
		logger.error("box grid has no rows", { width, height })
		throw errors.new("box grid: no rows")
	}
	const firstRow = data[0]
	const expectedNumCols = firstRow ? firstRow.length : 0
	if (expectedNumCols === 0) {
		logger.error("box grid first row has no columns", { width, height })
		throw errors.new("box grid: no columns")
	}
	for (let r = 0; r < numRows; r++) {
		const row = data[r]
		const rowCols = row ? row.length : -1
		if (rowCols !== expectedNumCols) {
			logger.error("box grid rows have inconsistent column counts", {
				rowIndex: r,
				expected: expectedNumCols,
				actual: rowCols
			})
			throw errors.new("box grid: ragged rows")
		}
	}
	const numCols = expectedNumCols

	const cellWidth = width / numCols
	const cellHeight = height / numRows

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 14,
		lineHeightDefault: 1.2
	})

	canvas.addStyle(`
        .cell-text {
            font-size: 14px;
            text-anchor: middle;
            dominant-baseline: middle;
        }
    `)

	// Loop through data to draw backgrounds and text content
	for (let r = 0; r < numRows; r++) {
		for (let c = 0; c < numCols; c++) {
			const cell = data[r]?.[c]
			if (!cell) continue

			const x = c * cellWidth
			const y = r * cellHeight

			// Draw background rectangle for highlighting, if specified
			if (cell.backgroundColor && cell.backgroundColor !== "") {
				canvas.drawRect(x, y, cellWidth, cellHeight, {
					fill: cell.backgroundColor
				})
			}

			// Draw content: for math and numbers, render as MathML via XHTML foreignObject for typographic quality
			if (
				cell.content.type === "math" ||
				cell.content.type === "whole" ||
				cell.content.type === "fraction" ||
				cell.content.type === "mixed"
			) {
				const inner =
					cell.content.type === "math"
						? cell.content.mathml
						: numberContentToInnerMathML(cell.content)

				const fontPx = 14
				// Increase font size for better legibility in grid cells
				const xhtml = `<!DOCTYPE html><div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-family:${theme.font.family.sans};color:${theme.colors.text};"><math xmlns="http://www.w3.org/1998/Math/MathML" display="inline" style="font-size:${fontPx * 1.25}px;">${inner}</math></div>`

				canvas.drawForeignObject({
					x: x,
					y: y,
					width: cellWidth,
					height: cellHeight,
					content: xhtml
				})
			}
		}
	}

	// Loop again to draw grid lines on top of all content
	if (showGridLines) {
		for (let r = 0; r < numRows; r++) {
			for (let c = 0; c < numCols; c++) {
				const x = c * cellWidth
				const y = r * cellHeight
				canvas.drawRect(x, y, cellWidth, cellHeight, {
					fill: "none",
					stroke: theme.colors.border,
					strokeWidth: theme.stroke.width.base
				})
			}
		}
	}

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
