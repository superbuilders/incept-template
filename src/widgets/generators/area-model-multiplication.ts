import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Function that returns a fresh discriminated union schema to avoid $ref deduplication
const createValueOrUnknownSchema = () =>
	z
		.discriminatedUnion("type", [
			z.object({
				type: z.literal("value").describe("A known numeric value."),
				value: z.number().int().positive().describe("The numeric value.")
			}),
			z.object({
				type: z
					.literal("unknown")
					.describe(
						"An unknown value that should be represented by an empty box."
					)
			})
		])
		.describe(
			"Represents either a known numeric value or an unknown value to be solved."
		)

// Defines the content for a single cell in the area model.
const CellContentSchema = z
	.discriminatedUnion("type", [
		z.object({
			type: z
				.literal("value")
				.describe("The cell displays a specific positive integer value."),
			value: z
				.number()
				.int()
				.positive()
				.describe("The positive integer value to display in the cell.")
		}),
		z.object({
			type: z
				.literal("unknown")
				.describe(
					"The cell's value is unknown and should be represented by an empty box."
				)
		})
	])
	.describe(
		"Determines what is displayed inside a cell: a specific positive integer value or an empty box for a missing number."
	)

// The main Zod schema for the area model multiplication widget.
export const AreaModelMultiplicationPropsSchema = z
	.object({
		type: z
			.literal("areaModelMultiplication")
			.describe("Identifies this as an area model for multiplication."),
		width: createWidthSchema(),
		height: createHeightSchema(),
		rowFactors: z
			.array(createValueOrUnknownSchema())
			.min(1)
			.describe(
				"An array of factors displayed vertically on the left, representing the height of each row."
			),
		columnFactors: z
			.array(createValueOrUnknownSchema())
			.min(1)
			.describe(
				"An array of factors displayed horizontally on top, representing the width of each column."
			),
		cellContents: z
			.array(z.array(CellContentSchema))
			.describe(
				"A 2D array defining the content for each cell. Outer array represents rows, inner array represents columns. Dimensions must match rowFactors.length × columnFactors.length."
			),
		cellColors: z
			.array(z.array(z.string().regex(CSS_COLOR_PATTERN, "invalid css color")))
			.describe(
				"A 2D array of background colors for each cell. Outer array represents rows, inner array represents columns. Dimensions must match rowFactors.length × columnFactors.length."
			)
	})
	.strict()
	.describe(
		"Creates an area model diagram to visualize the distributive property of multiplication. The model consists of a rectangle partitioned into smaller cells, with factors along the sides and products (or placeholders) inside."
	)

export type AreaModelMultiplicationProps = z.infer<
	typeof AreaModelMultiplicationPropsSchema
>

/**
 * Generates an SVG diagram of an area model for multiplication.
 */
export const generateAreaModelMultiplication: WidgetGenerator<
	typeof AreaModelMultiplicationPropsSchema
> = async (props) => {
	const { width, height, rowFactors, columnFactors, cellContents, cellColors } =
		props

	// Runtime validation to ensure 2D arrays have matching dimensions.
	if (
		cellContents.length !== rowFactors.length ||
		cellColors.length !== rowFactors.length
	) {
		logger.error("dimension mismatch in area model", {
			cellContentsRows: cellContents.length,
			cellColorsRows: cellColors.length,
			rowFactorsLength: rowFactors.length
		})
		throw errors.new("cell arrays must have same number of rows as row factors")
	}

	for (let i = 0; i < cellContents.length; i++) {
		if (
			cellContents[i]?.length !== columnFactors.length ||
			cellColors[i]?.length !== columnFactors.length
		) {
			logger.error("column dimension mismatch in area model", {
				row: i,
				cellContentsColumns: cellContents[i]?.length,
				cellColorsColumns: cellColors[i]?.length,
				columnFactorsLength: columnFactors.length
			})
			throw errors.new(
				`row ${i} arrays must have same length as column factors`
			)
		}
	}

	// Helper function to get numeric value from ValueOrUnknownSchema
	// For unknown factors, use place value sizing: 10^n where n is distance from end of array
	// (rightmost = ones = 10^0, next left = tens = 10^1, next = hundreds = 10^2, etc.)
	const getFactorValueForLayout = (
		factor: (typeof rowFactors)[0] | (typeof columnFactors)[0],
		index?: number,
		isColumn?: boolean
	): number => {
		if (factor.type === "value") {
			return factor.value
		}
		// For unknown factors, calculate place value based on position from right
		if (index !== undefined && isColumn) {
			const distanceFromEnd = columnFactors.length - 1 - index
			return 10 ** distanceFromEnd
		}
		if (index !== undefined && !isColumn) {
			// For row factors, use simpler sizing (larger numbers for top rows)
			return 10 ** (index + 1)
		}
		// Fallback
		return 100
	}

	const labelSpace = 40
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 16,
		lineHeightDefault: 1.2
	})

	// --- Scaling and Layout ---
	const availableWidth = width - PADDING * 2 - labelSpace
	const availableHeight = height - PADDING * 2 - labelSpace

	// Use a log-scale-like approach to prevent tiny cells from small factors
	// This ensures all cells are reasonably sized while still showing proportional relationships
	const minCellWidth = 60 // Minimum width for readability
	const minCellHeight = 40 // Minimum height for readability

	// Calculate column widths
	const columnFactorValues = columnFactors.map((factor, index) =>
		getFactorValueForLayout(factor, index, true)
	)
	const logFactors = columnFactorValues.map((factor) => Math.log10(factor + 1)) // +1 to handle factor=1
	const totalLogWidth = logFactors.reduce(
		(sum, logFactor) => sum + logFactor,
		0
	)

	// Calculate base widths using log scale, then ensure minimum sizes
	const baseWidths = logFactors.map(
		(logFactor) => (logFactor / totalLogWidth) * availableWidth
	)
	const scaledColWidths = baseWidths.map((baseWidth) =>
		Math.max(baseWidth, minCellWidth)
	)

	// If minimum widths caused overflow, scale down proportionally
	const totalActualWidth = scaledColWidths.reduce((sum, w) => sum + w, 0)
	if (totalActualWidth > availableWidth) {
		const overflowScale = availableWidth / totalActualWidth
		scaledColWidths.forEach((width, i) => {
			scaledColWidths[i] = width * overflowScale
		})
	}

	// Calculate row heights using similar approach
	const rowFactorValues = rowFactors.map((factor, index) =>
		getFactorValueForLayout(factor, index, false)
	)
	const logRowFactors = rowFactorValues.map((factor) => Math.log10(factor + 1))
	const totalLogHeight = logRowFactors.reduce(
		(sum, logFactor) => sum + logFactor,
		0
	)

	// Calculate base heights using log scale, then ensure minimum sizes
	const baseHeights = logRowFactors.map(
		(logFactor) => (logFactor / totalLogHeight) * availableHeight
	)
	const scaledRowHeights = baseHeights.map((baseHeight) =>
		Math.max(baseHeight, minCellHeight)
	)

	// If minimum heights caused overflow, scale down proportionally
	const totalActualHeight = scaledRowHeights.reduce((sum, h) => sum + h, 0)
	if (totalActualHeight > availableHeight) {
		const overflowScale = availableHeight / totalActualHeight
		scaledRowHeights.forEach((height, i) => {
			scaledRowHeights[i] = height * overflowScale
		})
	}

	const totalGridWidth = scaledColWidths.reduce((sum, w) => sum + w, 0)
	// const totalGridHeight = scaledRowHeights.reduce((sum, h) => sum + h, 0) // Unused variable

	const gridStartX = (width - totalGridWidth) / 2 // Center the grid horizontally
	const gridStartY = PADDING + labelSpace

	// --- Rendering ---

	// Draw column factor labels above the grid
	let currentX = gridStartX
	for (let j = 0; j < columnFactors.length; j++) {
		const colFactor = columnFactors[j]
		const colWidth = scaledColWidths[j]
		if (colFactor === undefined || colWidth === undefined) continue
		const cellCenterX = currentX + colWidth / 2

		// Draw column factor label above this column (or unknown box)
		if (colFactor.type === "value") {
			canvas.drawText({
				x: cellCenterX,
				y: gridStartY - PADDING,
				text: String(colFactor.value),
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx: 18,
				fontWeight: theme.font.weight.bold
			})
		} else {
			// Draw unknown box for column factor
			const boxWidth = 30
			const boxHeight = 20
			canvas.drawRect(
				cellCenterX - boxWidth / 2,
				gridStartY - PADDING - boxHeight / 2,
				boxWidth,
				boxHeight,
				{
					fill: theme.colors.white,
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				}
			)
		}
		currentX += colWidth
	}

	// Draw the grid of cells
	let currentY = gridStartY
	for (let i = 0; i < rowFactors.length; i++) {
		const rowFactor = rowFactors[i]
		const rowHeight = scaledRowHeights[i]
		if (rowFactor === undefined || rowHeight === undefined) continue
		const rowCenterY = currentY + rowHeight / 2

		// Draw row factor label to the left of this row (or unknown box)
		if (rowFactor.type === "value") {
			canvas.drawText({
				x: gridStartX - PADDING,
				y: rowCenterY,
				text: String(rowFactor.value),
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx: 18,
				fontWeight: theme.font.weight.bold
			})
		} else {
			// Draw unknown box for row factor
			const boxWidth = 30
			const boxHeight = 20
			canvas.drawRect(
				gridStartX - PADDING - boxWidth / 2,
				rowCenterY - boxHeight / 2,
				boxWidth,
				boxHeight,
				{
					fill: theme.colors.white,
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				}
			)
		}

		// Draw cells in this row
		currentX = gridStartX
		for (let j = 0; j < columnFactors.length; j++) {
			const colWidth = scaledColWidths[j]
			const content = cellContents[i]?.[j]
			const color = cellColors[i]?.[j]
			if (
				colWidth === undefined ||
				content === undefined ||
				color === undefined
			)
				continue

			// Draw cell background
			canvas.drawRect(currentX, currentY, colWidth, rowHeight, {
				fill: color,
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.thick
			})

			const cellCenterX = currentX + colWidth / 2
			const cellCenterY = currentY + rowHeight / 2

			// Draw cell content
			switch (content.type) {
				case "value": {
					// Display the specific integer value
					canvas.drawText({
						x: cellCenterX,
						y: cellCenterY,
						text: String(content.value),
						anchor: "middle",
						dominantBaseline: "middle",
						fontPx: 20,
						fontWeight: theme.font.weight.bold
					})
					break
				}
				case "unknown": {
					const boxWidth = Math.min(colWidth * 0.6, 80)
					const boxHeight = Math.min(rowHeight * 0.6, 30)
					canvas.drawRect(
						cellCenterX - boxWidth / 2,
						cellCenterY - boxHeight / 2,
						boxWidth,
						boxHeight,
						{
							fill: theme.colors.white,
							stroke: theme.colors.black,
							strokeWidth: theme.stroke.width.base
						}
					)
					break
				}
			}
			currentX += colWidth
		}
		currentY += rowHeight
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
