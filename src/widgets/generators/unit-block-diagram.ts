import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { theme } from "@/widgets/utils/theme"

export const UnitBlockDiagramPropsSchema = z
	.object({
		type: z
			.literal("unitBlockDiagram")
			.describe(
				"Identifies this as a unit block diagram for visualizing place value and decimal concepts."
			),
		totalBlocks: z
			.number()
			.int()
			.positive()
			.describe(
				"Number of 10×10 grid blocks to display (e.g., 3, 5, 1). Each block represents 100 units. Must be positive integer."
			),
		shadedUnitsPerBlock: z
			.number()
			.int()
			.min(0)
			.max(100)
			.describe(
				"Number of unit squares to shade in each block (e.g., 45, 100, 0). Range: 0-100. Same shading pattern applies to all blocks."
			),
		blocksPerRow: z
			.number()
			.int()
			.positive()
			.describe(
				"Number of blocks to display horizontally before wrapping to next row (e.g., 3, 4, 5). Affects overall layout shape."
			),
		blockWidth: z
			.number()
			.positive()
			.describe(
				"Width of each 10×10 block in pixels (e.g., 100, 120, 80). Larger values show grid lines more clearly."
			),
		blockHeight: z
			.number()
			.positive()
			.describe(
				"Height of each 10×10 block in pixels (e.g., 100, 120, 80). Usually equal to blockWidth for square units."
			),
		shadeColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
			)
			.describe(
				"CSS color for shaded unit squares (e.g., '#4472C4' for blue, 'lightcoral', 'rgba(255,0,0,0.5)'). Should contrast with white background."
			)
	})
	.strict()
	.describe(
		"Creates grids of 10×10 blocks (hundreds blocks) with partial shading to represent decimals, percentages, or fractions of 100. Each block contains 100 unit squares arranged in a 10×10 grid. Shading shows parts of the whole, making abstract concepts concrete. Essential for place value, decimals (0.45 = 45 shaded), and percentage (45%) understanding."
	)

export type UnitBlockDiagramProps = z.infer<typeof UnitBlockDiagramPropsSchema>

/**
 * This template generates an SVG diagram of "hundreds blocks" to visually model
 * place value and percentages of large numbers that are multiples of 100.
 * It is particularly effective for explaining concepts like "1% of 800" in a concrete, countable manner.
 */
export const generateUnitBlockDiagram: WidgetGenerator<
	typeof UnitBlockDiagramPropsSchema
> = async (data) => {
	const {
		totalBlocks,
		shadedUnitsPerBlock,
		blocksPerRow,
		blockWidth,
		blockHeight,
		shadeColor
	} = data
	const gap = 10
	const numRows = Math.ceil(totalBlocks / blocksPerRow)
	const svgWidth = blocksPerRow * blockWidth + (blocksPerRow - 1) * gap
	const svgHeight = numRows * blockHeight + (numRows - 1) * gap

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width: svgWidth, height: svgHeight },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	for (let b = 0; b < totalBlocks; b++) {
		const blockRow = Math.floor(b / blocksPerRow)
		const blockCol = b % blocksPerRow
		const bx = blockCol * (blockWidth + gap)
		const by = blockRow * (blockHeight + gap)

		const cellW = blockWidth / 10
		const cellH = blockHeight / 10

		for (let i = 0; i < 100; i++) {
			const row = Math.floor(i / 10)
			const col = i % 10
			const fill = i < shadedUnitsPerBlock ? shadeColor : "none"
			canvas.drawRect(bx + col * cellW, by + row * cellH, cellW, cellH, {
				fill: fill,
				stroke: theme.colors.gridMinor,
				strokeWidth: 0.5
			})
		}
		// Add a border around the whole block
		canvas.drawRect(bx, by, blockWidth, blockHeight, {
			fill: "none",
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thin
		})
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
