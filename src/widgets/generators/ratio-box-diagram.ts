import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

const Item = z
	.object({
		count: z
			.number()
			.int()
			.min(0)
			.describe(
				"Number of icons of this type to display (e.g., 12, 8, 0). Zero means this type is absent. Non-negative integer."
			),
		color: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"Hex-only color for icons of this type (e.g., '#0C7F99' for teal, '#BC2612' for red, '#00000080' for 50% alpha). Each type should have distinct color for clarity."
			),
		style: z
			.enum(["filled", "outline"])
			.describe(
				"Visual style of the icon. 'filled' creates solid circles, 'outline' creates hollow circles with border. Mix styles for emphasis."
			)
	})
	.strict()

const Box = z
	.object({
		startRow: z
			.number()
			.int()
			.min(0)
			.describe(
				"Top row index (0-based) where this box begins. Row 0 is the first row. Must be >= 0 and <= endRow."
			),
		endRow: z
			.number()
			.int()
			.min(0)
			.describe(
				"Bottom row index (0-based) where this box ends, inclusive. To span 3 rows starting at row 1: startRow=1, endRow=3."
			),
		startCol: z
			.number()
			.int()
			.min(0)
			.describe(
				"Leftmost column index (0-based) where this box begins. Column 0 is first. Must be >= 0 and <= endCol."
			),
		endCol: z
			.number()
			.int()
			.min(0)
			.describe(
				"Rightmost column index (0-based) where this box ends, inclusive. To span 4 columns: startCol=0, endCol=3."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label for this box (e.g., '1/3', 'Group A', '25%', null). Null means no label. Positioned inside the box. Plaintext only; no markdown or HTML."
			)
	})
	.strict()

export const RatioBoxDiagramPropsSchema = z
	.object({
		type: z
			.literal("ratioBoxDiagram")
			.describe(
				"Identifies this as a ratio box diagram for visualizing part-to-part and part-to-whole relationships."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		items: z
			.array(Item)
			.describe(
				"Array of item types with counts and styles. Order matters: items are placed sequentially or grouped based on layout. Can be empty for blank grid."
			),
		itemsPerRow: z
			.number()
			.int()
			.positive()
			.describe(
				"Number of item icons per row in the grid (e.g., 10, 12, 8). Determines grid width and total rows needed."
			),
		boxes: z
			.array(Box)
			.describe(
				"Overlay boxes to highlight groups of items. Empty array means no boxes. Useful for showing fractions, ratios, or groupings. Can overlap."
			),
		partitions: z
			.number()
			.int()
			.describe(
				"Number of equal groups to divide all items into using boxes. 0 means no automatic partitioning. E.g., 3 creates thirds, 4 creates quarters."
			),
		layout: z
			.enum(["sequential", "grouped"])
			.describe(
				"Item arrangement. 'sequential' places items in reading order mixing types. 'grouped' clusters each type together with visual separation."
			)
	})
	.strict()
	.describe(
		"Creates a grid of colored circular icons to visualize ratios and proportions. Supports overlay boxes to highlight parts, automatic partitioning for fractions, and two layout modes. Perfect for teaching part-to-part ratios (red:blue), part-to-whole relationships (fraction of total), and equivalent ratios."
	)

export type RatioBoxDiagramProps = z.infer<typeof RatioBoxDiagramPropsSchema>

/**
 * Generates an SVG diagram of items in a grid with box overlays to illustrate ratios.
 */
export const generateRatioBoxDiagram: WidgetGenerator<
	typeof RatioBoxDiagramPropsSchema
> = async (props) => {
	const { width, height, items, itemsPerRow, boxes, partitions, layout } = props

	const totalItems = items.reduce((sum, item) => sum + item.count, 0)
	if (totalItems === 0) {
		return `<svg width="${width}" height="${height}" />`
	}

	const padding = {
		top: PADDING,
		right: PADDING,
		bottom: PADDING,
		left: PADDING
	}
	const chartWidth = width - padding.left - padding.right
	const chartHeight = height - padding.top - padding.bottom

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	if (layout === "grouped") {
		// --- Grouped Layout Logic ---
		// Create a 5x3 grid but place blue circles in first 3 columns, red in last 2 columns
		const numRows = 3
		const numCols = 5
		const cellWidth = chartWidth / numCols
		const cellHeight = chartHeight / numRows
		const iconRadiusX = cellWidth * 0.1
		const iconRadiusY = iconRadiusX

		// Create a position map for specific placement
		const grid: Array<{ color: string; style: "filled" | "outline" } | null> =
			new Array(numRows * numCols).fill(null)

		// Place blue circles in first 3 columns (positions 0-2, 5-7, 10-12)
		const bluePositions = [0, 1, 2, 5, 6, 7, 10, 11, 12] // First 3 columns in each row
		const redPositions = [3, 4, 8, 9, 13, 14] // Last 2 columns in each row

		// Fill blue positions
		const blueGroup = items[0]
		if (blueGroup) {
			for (
				let i = 0;
				i < Math.min(blueGroup.count, bluePositions.length);
				i++
			) {
				const position = bluePositions[i]
				if (position !== undefined) {
					grid[position] = { color: blueGroup.color, style: blueGroup.style }
				}
			}
		}

		// Fill red positions
		const redGroup = items[1]
		if (redGroup) {
			for (let i = 0; i < Math.min(redGroup.count, redPositions.length); i++) {
				const position = redPositions[i]
				if (position !== undefined) {
					grid[position] = { color: redGroup.color, style: redGroup.style }
				}
			}
		}

		// Render all items
		for (let i = 0; i < grid.length; i++) {
			const item = grid[i]
			if (!item) continue

			const row = Math.floor(i / numCols)
			const col = i % numCols

			const cx = padding.left + col * cellWidth + cellWidth / 2
			const cy = padding.top + row * cellHeight + cellHeight / 2

			// Canvas automatically tracks extents

			const fill = item.style === "filled" ? item.color : "none"
			const stroke = item.color

			canvas.drawEllipse(cx, cy, iconRadiusX, iconRadiusY, {
				fill,
				stroke,
				strokeWidth: theme.stroke.width.thick
			})
		}

		// Draw boxes
		if (boxes.length > 0) {
			// Helper function to draw a box based on grid cell coordinates
			const drawBox = (
				startRow: number,
				endRow: number,
				startCol: number,
				endCol: number,
				extraPadding = 0
			) => {
				const boxPadding = cellWidth * 0.1 + extraPadding
				const x = padding.left + startCol * cellWidth - boxPadding / 2
				const y = padding.top + startRow * cellHeight - boxPadding / 2
				const boxWidth = (endCol - startCol + 1) * cellWidth + boxPadding
				const boxHeight = (endRow - startRow + 1) * cellHeight + boxPadding
				// Canvas automatically tracks extents
				canvas.drawRect(x, y, boxWidth, boxHeight, {
					fill: "none",
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.thick
				})
			}

			// Draw outer box first (so it appears behind inner box)
			if (boxes.length >= 2) {
				// Overall outer box around entire grid with extra padding
				drawBox(0, numRows - 1, 0, numCols - 1, 10)
			}

			if (boxes.length >= 1) {
				// Inner box around first 3 columns (blue area) - smaller padding
				drawBox(0, numRows - 1, 0, 2, -5)
			}
		}
	} else {
		// --- Sequential Layout Logic (original) ---
		const numRows = Math.ceil(totalItems / itemsPerRow)
		const cellWidth = chartWidth / itemsPerRow
		const cellHeight = chartHeight / numRows
		const iconRadiusX = cellWidth * 0.1
		const iconRadiusY = iconRadiusX

		// Flatten the items array for easier rendering
		const flatItems: { color: string; style: "filled" | "outline" }[] = []
		for (const group of items) {
			for (let i = 0; i < group.count; i++) {
				flatItems.push({ color: group.color, style: group.style })
			}
		}

		// 1. Render all item icons
		for (let i = 0; i < totalItems; i++) {
			const row = Math.floor(i / itemsPerRow)
			const col = i % itemsPerRow

			const cx = padding.left + col * cellWidth + cellWidth / 2
			const cy = padding.top + row * cellHeight + cellHeight / 2

			// Canvas automatically tracks extents

			const item = flatItems[i]
			if (!item) continue

			const fill = item.style === "filled" ? item.color : "none"
			const stroke = item.color

			canvas.drawEllipse(cx, cy, iconRadiusX, iconRadiusY, {
				fill,
				stroke,
				strokeWidth: theme.stroke.width.thick
			})
		}

		// Helper function to draw a box based on grid cell coordinates
		const drawBox = (
			startRow: number,
			endRow: number,
			startCol: number,
			endCol: number
		) => {
			const boxPadding = cellWidth * 0.2
			const x = padding.left + startCol * cellWidth + boxPadding / 2
			const y = padding.top + startRow * cellHeight + boxPadding / 2
			const boxWidth = (endCol - startCol + 1) * cellWidth - boxPadding
			const boxHeight = (endRow - startRow + 1) * cellHeight - boxPadding
			// Canvas automatically tracks extents
			canvas.drawRect(x, y, boxWidth, boxHeight, {
				fill: "none",
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.thick
			})
		}

		// 2. Render Partition Boxes
		if (partitions > 0 && totalItems % partitions === 0) {
			const itemsPerPartition = totalItems / partitions
			if (itemsPerPartition % itemsPerRow === 0) {
				const rowsPerPartition = itemsPerPartition / itemsPerRow
				for (let i = 0; i < partitions; i++) {
					const startRow = i * rowsPerPartition
					const endRow = startRow + rowsPerPartition - 1
					drawBox(startRow, endRow, 0, itemsPerRow - 1)
				}
			} else {
				const colsPerPartition = itemsPerRow / partitions
				for (let i = 0; i < partitions; i++) {
					const startCol = i * colsPerPartition
					const endCol = startCol + colsPerPartition - 1
					drawBox(0, numRows - 1, startCol, endCol)
				}
			}
		}

		// 3. Render Custom Boxes
		if (boxes.length > 0) {
			for (const box of boxes) {
				const sr = Math.max(0, box.startRow)
				const er = Math.min(numRows - 1, box.endRow)
				const sc = Math.max(0, box.startCol)
				const ec = Math.min(itemsPerRow - 1, box.endCol)
				if (sr > er || sc > ec) continue
				drawBox(sr, er, sc, ec)
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

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`
}
