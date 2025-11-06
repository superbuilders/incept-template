import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// The main Zod schema for the factorization diagram.
export const FactorizationDiagramPropsSchema = z
	.object({
		type: z
			.literal("factorizationDiagram")
			.describe("Identifies this as a factorization diagram widget."),
		width: createWidthSchema(),
		height: createHeightSchema(),
		numberToFactor: z
			.number()
			.int()
			.positive()
			.describe(
				"The integer to be factored and displayed as a rectangular array of dots."
			),
		dotColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("CSS color for the dots in the array.")
	})
	.strict()
	.describe(
		"Creates a rectangular array of numbered dots to visually represent the factors of a number. The widget automatically determines the number of rows and columns by finding the factors closest to the square root of the number."
	)

export type FactorizationDiagramProps = z.infer<
	typeof FactorizationDiagramPropsSchema
>

/**
 * Finds the pair of integer factors of a number that are closest to its square root.
 * This results in the most "squarish" possible layout for the rectangular array.
 * @param n The number to factor.
 * @returns An object with `rows` and `columns`.
 */
function findBestFactors(n: number): { rows: number; columns: number } {
	if (n <= 0) return { rows: 0, columns: 0 }
	const sqrt = Math.floor(Math.sqrt(n))
	for (let i = sqrt; i >= 1; i--) {
		if (n % i === 0) {
			// Return the smaller factor as rows and the larger as columns
			return { rows: i, columns: n / i }
		}
	}
	return { rows: 1, columns: n } // Fallback for prime numbers
}

/**
 * Generates an SVG diagram of a rectangular array of numbered dots to illustrate factors.
 */
export const generateFactorizationDiagram: WidgetGenerator<
	typeof FactorizationDiagramPropsSchema
> = async (props) => {
	const { width, height, numberToFactor, dotColor } = props

	// The widget's logic now determines the best row and column count.
	const { rows, columns } = findBestFactors(numberToFactor)

	if (rows === 0 || columns === 0) {
		return `<svg width="${width}" height="${height}" />`
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const availableWidth = width - 2 * PADDING
	const availableHeight = height - 2 * PADDING

	const cellWidth = availableWidth / columns
	const cellHeight = availableHeight / rows

	const dotRadius = Math.min(cellWidth, cellHeight) * 0.4
	const fontSize = Math.max(8, dotRadius * 0.9)

	for (let i = 0; i < numberToFactor; i++) {
		const row = Math.floor(i / columns)
		const col = i % columns
		const dotNumber = i + 1

		const cx = PADDING + col * cellWidth + cellWidth / 2
		const cy = PADDING + row * cellHeight + cellHeight / 2

		canvas.drawCircle(cx, cy, dotRadius, {
			fill: dotColor,
			stroke: "none"
		})

		canvas.drawText({
			x: cx,
			y: cy,
			text: String(dotNumber),
			fill: theme.colors.black,
			fontPx: fontSize,
			fontWeight: theme.font.weight.medium,
			anchor: "middle",
			dominantBaseline: "middle"
		})
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`
}
