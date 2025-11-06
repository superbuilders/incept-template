import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { selectAxisLabels } from "@/widgets/utils/layout"
import { MATHML_INNER_PATTERN } from "@/widgets/utils/mathml"
import { numberContentToInnerMathML } from "@/widgets/utils/number-to-mathml"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"
import { buildTicks } from "@/widgets/utils/ticks"

// Additional overlays to subsume fraction-number-line without adding new tick modes
const Segment = z
	.object({
		start: z
			.number()
			.describe(
				"Starting value of the highlighted segment along the axis. Must lie within [min, max]."
			),
		end: z
			.number()
			.describe(
				"Ending value of the highlighted segment along the axis. Must lie within [min, max] and >= start."
			),
		color: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe(
				"CSS color for the segment stroke (e.g., '#11accd', 'rgba(255,0,0,0.5)')"
			)
	})
	.strict()

const ModelCellGroup = z
	.object({
		count: z
			.number()
			.int()
			.positive()
			.describe(
				"Number of consecutive cells in this group. Sum across groups equals totalCells."
			),
		color: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("CSS fill color for cells in this group.")
	})
	.strict()

const Model = z
	.object({
		totalCells: z
			.number()
			.int()
			.positive()
			.describe(
				"Total number of cells in the model bar (e.g., 8 for eighths)."
			),
		cellGroups: z
			.array(ModelCellGroup)
			.describe(
				"Groups of colored cells shown left-to-right. Sum of counts equals totalCells."
			),
		bracketLabel: z
			.string()
			.describe(
				"Label for a bracket spanning the entire model bar (e.g., '1 whole'). Empty string to omit."
			)
	})
	.strict()

// Factory function to create a TickIntervalSchema to avoid $ref issues
const createTickIntervalSchema = () =>
	z
		.discriminatedUnion("type", [
			z
				.object({
					type: z.literal("whole"),
					interval: z
						.number()
						.positive()
						.describe(
							"Spacing between tick marks using whole numbers. Examples: 1 (every integer), 2 (every even number), 5 (multiples of 5), 10 (multiples of 10). Determines tick density."
						)
				})
				.strict(),
			z
				.object({
					type: z.literal("fraction"),
					denominator: z
						.number()
						.int()
						.positive()
						.describe(
							"Denominator for fractional intervals. Examples: 2 (halves), 3 (thirds), 4 (quarters), 5 (fifths), 8 (eighths). Creates tick marks at unit fractions like 1/4, 2/4, 3/4, etc."
						)
				})
				.strict()
		])
		.describe(
			"Defines the spacing between tick marks on the number line. Use 'whole' for integer intervals or 'fraction' for fractional divisions."
		)

// Factory function to create a HighlightedPointSchema to avoid $ref issues
const createHighlightedPointSchema = () =>
	z
		.discriminatedUnion("type", [
			z
				.object({
					type: z.literal("whole"),
					position: z
						.number()
						.describe(
							"Exact position on the number line where the point should be placed. Must correspond to the actual value being represented."
						),
					color: z
						.string()
						.regex(CSS_COLOR_PATTERN, "invalid css color")
						.describe(
							"CSS color for both the point dot and its label. Examples: '#FF0000' (red), '#0066CC' (blue), '#00AA00' (green). Use distinct colors for multiple points."
						),
					style: z
						.literal("dot")
						.describe(
							"Visual representation style. Currently only 'dot' (circular marker) is supported."
						),
					value: z
						.number()
						.int()
						.describe(
							"Absolute value of the whole number (non-negative integer). Examples: 5, 12, 100. Combined with sign to form the complete number."
						),
					sign: z
						.enum(["+", "-"])
						.describe(
							"Sign of the whole number. '+' for positive numbers, '-' for negative numbers. Affects both positioning and label display."
						)
				})
				.strict(),
			z
				.object({
					type: z.literal("fraction"),
					position: z
						.number()
						.describe(
							"Exact position on the number line where the fraction should be placed. Must correspond to the actual fractional value."
						),
					color: z
						.string()
						.regex(CSS_COLOR_PATTERN, "invalid css color")
						.describe(
							"CSS color for both the point dot and its fraction label. Examples: '#FF6B6B' (coral), '#4ECDC4' (turquoise). Use distinct colors for multiple fractions."
						),
					style: z
						.literal("dot")
						.describe(
							"Visual representation style. Currently only 'dot' (circular marker) is supported."
						),
					numerator: z
						.number()
						.int()
						.min(0)
						.describe(
							"Numerator of the fraction (non-negative integer). Examples: 3 in 3/4, 7 in 7/8. Zero creates a fraction equal to 0."
						),
					denominator: z
						.number()
						.int()
						.positive()
						.describe(
							"Denominator of the fraction (positive integer). Examples: 4 in 3/4, 8 in 7/8. Must be greater than 0."
						),
					sign: z
						.enum(["+", "-"])
						.describe(
							"Sign of the fraction. '+' for positive fractions (right of zero), '-' for negative fractions (left of zero)."
						)
				})
				.strict(),
			z
				.object({
					type: z.literal("mixed"),
					position: z
						.number()
						.describe(
							"Exact position on the number line where the mixed number should be placed. Must correspond to the actual mixed number value."
						),
					color: z
						.string()
						.regex(CSS_COLOR_PATTERN, "invalid css color")
						.describe(
							"CSS color for both the point dot and its mixed number label. Examples: '#9B59B6' (purple), '#E67E22' (orange). Use distinct colors for multiple mixed numbers."
						),
					style: z
						.literal("dot")
						.describe(
							"Visual representation style. Currently only 'dot' (circular marker) is supported."
						),
					whole: z
						.number()
						.int()
						.min(0)
						.describe(
							"Whole number part of the mixed number (non-negative integer). Examples: 2 in 2¾, 5 in 5⅓. Zero creates an improper fraction."
						),
					numerator: z
						.number()
						.int()
						.min(0)
						.describe(
							"Numerator of the fractional part (non-negative integer). Examples: 3 in 2¾, 1 in 5⅓. Should be less than denominator for proper mixed numbers."
						),
					denominator: z
						.number()
						.int()
						.positive()
						.describe(
							"Denominator of the fractional part (positive integer). Examples: 4 in 2¾, 3 in 5⅓. Must be greater than 0."
						),
					sign: z
						.enum(["+", "-"])
						.describe(
							"Sign of the entire mixed number. '+' for positive mixed numbers (right of zero), '-' for negative mixed numbers (left of zero)."
						)
				})
				.strict(),
			z
				.object({
					type: z.literal("mathml"),
					position: z
						.number()
						.describe(
							"Exact position on the number line where the mathematical expression should be placed. Must correspond to the actual value of the MathML expression."
						),
					color: z
						.string()
						.regex(CSS_COLOR_PATTERN, "invalid css color")
						.describe(
							"CSS color for both the point dot and its MathML label. Examples: '#8E44AD' (violet), '#2ECC71' (emerald). Use distinct colors for multiple expressions."
						),
					style: z
						.literal("dot")
						.describe(
							"Visual representation style. Currently only 'dot' (circular marker) is supported."
						),
					mathml: z
						.string()
						.regex(
							MATHML_INNER_PATTERN,
							"invalid mathml snippet; must be inner MathML without outer <math> wrapper"
						)
						.describe(
							"Inner MathML markup for complex mathematical expressions. Examples: '<msqrt><mn>2</mn></msqrt>' for √2, '<mfrac><mn>22</mn><mn>7</mn></mfrac>' for 22/7. Do not include outer <math> wrapper tags."
						)
				})
				.strict()
		])
		.describe(
			"Defines a special point to highlight on the number line. Supports whole numbers, fractions, mixed numbers, and complex MathML expressions. Each point appears as a colored dot with an appropriately formatted label."
		)

export const NumberLinePropsSchema = z
	.object({
		type: z
			.literal("numberLine")
			.describe(
				"Widget type identifier for general-purpose number lines supporting integers, fractions, and mixed numbers."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		orientation: z
			.enum(["horizontal", "vertical"])
			.describe(
				"Direction of the number line. 'horizontal' runs left-to-right with values increasing rightward. 'vertical' runs bottom-to-top with values increasing upward."
			),
		min: z
			.number()
			.describe(
				"Minimum value displayed on the number line. Can be negative, zero, or positive. Defines the left boundary (horizontal) or bottom boundary (vertical)."
			),
		max: z
			.number()
			.describe(
				"Maximum value displayed on the number line. Must be greater than min. Defines the right boundary (horizontal) or top boundary (vertical)."
			),
		tickInterval: createTickIntervalSchema().describe(
			"Primary tick mark configuration. Creates full-height tick marks with labels. Use whole number intervals for integer number lines or fractional intervals for fraction work."
		),
		secondaryTickInterval: createTickIntervalSchema()
			.nullable()
			.describe(
				"Optional secondary tick marks for finer divisions. Creates half-height tick marks without labels. Useful for showing subdivisions like halves between integers. Set to null for no secondary ticks."
			),
		showTickLabels: z
			.boolean()
			.describe(
				"Whether to display numeric labels at major tick marks. Labels are automatically spaced to prevent overlap. Set to false for unlabeled number lines where students fill in values."
			),
		highlightedPoints: z
			.array(createHighlightedPointSchema())
			.nullable()
			.describe(
				"Array of special points to highlight with colored dots and labels. Each point can be a whole number, fraction, mixed number, or complex MathML expression. Set to null for no highlighted points."
			),
		segments: z
			.array(Segment)
			.nullable()
			.describe(
				"Colored segments drawn along the axis to highlight ranges. Null for none."
			),
		model: Model.nullable().describe(
			"Optional cell-based model bar shown above the axis (horizontal only). Null to omit."
		)
	})
	.strict()
	.describe(
		"Creates versatile number lines for teaching integers, fractions, decimals, and mixed numbers. Supports both horizontal and vertical orientations with customizable tick intervals, highlighted points, and MathML labels. Perfect for number sense, fraction concepts, and coordinate system introduction."
	)

export type NumberLineProps = z.infer<typeof NumberLinePropsSchema>

// Helper to convert the schema object to a numeric value
const getNumericInterval = (
	interval: z.infer<ReturnType<typeof createTickIntervalSchema>>
): number => {
	return interval.type === "whole"
		? interval.interval
		: 1 / interval.denominator
}

// Helper to format tick labels based on interval type
const formatTickLabel = (
	value: number,
	tickInterval: z.infer<ReturnType<typeof createTickIntervalSchema>>
): string => {
	if (tickInterval.type === "whole") {
		// For whole number intervals, show integers or decimals as appropriate
		return Number.isInteger(value) ? String(value) : value.toString()
	}
	// For fraction intervals, show as fractions
	const denominator = tickInterval.denominator
	const numerator = Math.round(value * denominator)

	// Handle zero
	if (numerator === 0) return "0"

	// Handle whole numbers (when numerator is a multiple of denominator)
	if (numerator % denominator === 0) {
		return String(numerator / denominator)
	}

	// Simplify the fraction
	const gcd = (a: number, b: number): number =>
		b === 0 ? Math.abs(a) : gcd(b, a % b)
	const g = gcd(Math.abs(numerator), denominator)
	const simplifiedNum = numerator / g
	const simplifiedDen = denominator / g

	return `${simplifiedNum}/${simplifiedDen}`
}

export const generateNumberLine: WidgetGenerator<
	typeof NumberLinePropsSchema
> = async (data) => {
	const {
		width,
		height,
		orientation,
		min,
		max,
		tickInterval,
		secondaryTickInterval,
		showTickLabels,
		highlightedPoints,
		segments,
		model
	} = data

	if (min >= max) {
		return `<svg width="${width}" height="${height}"></svg>`
	}

	const isHorizontal = orientation === "horizontal"
	const lineLength = (isHorizontal ? width : height) - 2 * PADDING
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})
	const scale = lineLength / (max - min)

	const majorInterval = getNumericInterval(tickInterval)
	const { values: majorValues } = buildTicks(min, max, majorInterval)

	// Generate custom labels based on tick interval type
	const majorLabels = majorValues.map((value) =>
		formatTickLabel(value, tickInterval)
	)

	const minorValues = secondaryTickInterval
		? buildTicks(min, max, getNumericInterval(secondaryTickInterval)).values
		: []

	if (isHorizontal) {
		const yPos = height / 2
		const toSvgX = (val: number) => PADDING + (val - min) * scale

		canvas.drawLine(PADDING, yPos, width - PADDING, yPos, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thick
		})

		const selectedLabels = selectAxisLabels({
			labels: majorLabels,
			positions: majorValues.map(toSvgX),
			axisLengthPx: lineLength,
			orientation: "horizontal",
			fontPx: theme.font.size.small,
			minGapPx: 8
		})

		// Draw minor ticks first
		for (const t of minorValues) {
			if (!majorValues.some((mt) => Math.abs(mt - t) < 1e-9)) {
				// Avoid drawing over major ticks
				canvas.drawLine(toSvgX(t), yPos - 3, toSvgX(t), yPos + 3, {
					stroke: theme.colors.axis,
					strokeWidth: theme.stroke.width.base
				})
			}
		}

		// Draw major ticks and labels
		majorValues.forEach((t, i) => {
			const x = toSvgX(t)
			canvas.drawLine(x, yPos - 5, x, yPos + 5, {
				stroke: theme.colors.axis,
				strokeWidth: theme.stroke.width.base
			})
			if (showTickLabels && selectedLabels.has(i)) {
				canvas.drawText({
					x,
					y: yPos + 20,
					text: majorLabels[i] ?? "",
					fill: theme.colors.axis,
					anchor: "middle",
					fontPx: theme.font.size.small
				})
			}
		})

		// Draw highlighted points (new discriminated union with explicit position and MathML labels)

		// 3a. Draw on-axis segments (horizontal)
		if (segments) {
			for (const s of segments) {
				const startVal = Math.max(min, Math.min(max, s.start))
				const endVal = Math.max(min, Math.min(max, s.end))
				if (endVal <= startVal) continue
				const startX = toSvgX(startVal)
				const endX = toSvgX(endVal)
				canvas.drawLine(startX, yPos, endX, yPos, {
					stroke: s.color,
					strokeWidth: 5
				})
			}
		}

		// 3b. Draw fraction model bar (horizontal only)
		if (model) {
			const chartWidth = width - 2 * PADDING
			const modelY = PADDING
			const modelHeight = 36
			const cellWidth = chartWidth / model.totalCells

			// Render cell fills based on groups
			let cellCounter = 0
			for (const group of model.cellGroups) {
				for (let i = 0; i < group.count; i++) {
					const cellX = PADDING + cellCounter * cellWidth
					canvas.drawRect(cellX, modelY, cellWidth, modelHeight, {
						fill: group.color,
						fillOpacity: theme.opacity.overlayLow
					})
					cellCounter++
				}
			}

			// Render cell borders on top
			let currentX = PADDING
			for (let i = 0; i < model.totalCells; i++) {
				canvas.drawRect(currentX, modelY, cellWidth, modelHeight, {
					fill: "none",
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.thick
				})
				currentX += cellWidth
			}

			// Bracket and label spanning the model
			if (model.bracketLabel !== "") {
				const bracketY = modelY - 15
				const bracketStartX = PADDING
				const bracketEndX = PADDING + chartWidth
				canvas.drawLine(
					bracketStartX,
					bracketY + 5,
					bracketStartX,
					bracketY - 5,
					{
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base
					}
				)
				canvas.drawLine(bracketStartX, bracketY, bracketEndX, bracketY, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
				canvas.drawLine(bracketEndX, bracketY + 5, bracketEndX, bracketY - 5, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
				canvas.drawText({
					x: width / 2,
					y: bracketY - 8,
					text: model.bracketLabel,
					anchor: "middle",
					fontPx: 13,
					fontWeight: theme.font.weight.bold
				})
			}
		}

		// 3c. Highlighted points on top
		if (highlightedPoints) {
			for (const p of highlightedPoints) {
				const px = toSvgX(p.position)
				// Draw the point dot
				canvas.drawCircle(px, yPos, 5, {
					fill: p.color,
					stroke: p.color,
					strokeWidth: theme.stroke.width.thin
				})

				// Prepare MathML content
				let inner: string
				if (p.type === "mathml") {
					inner = p.mathml
				} else if (p.type === "whole") {
					inner = numberContentToInnerMathML({
						type: "whole",
						value: p.value,
						sign: p.sign
					})
				} else if (p.type === "fraction") {
					inner = numberContentToInnerMathML({
						type: "fraction",
						numerator: p.numerator,
						denominator: p.denominator,
						sign: p.sign
					})
				} else {
					inner = numberContentToInnerMathML({
						type: "mixed",
						whole: p.whole,
						numerator: p.numerator,
						denominator: p.denominator,
						sign: p.sign
					})
				}

				// Render label near the point (larger font). Ensure consistent gap from axis
				const fontPx = theme.font.size.large
				const labelWidth = 120
				const labelHeight = 32
				const desiredGapFromAxisPx = 18
				// Position the foreignObject so that its BOTTOM edge is a fixed gap above the axis
				// Do not clamp to top padding; allow negative viewBox adjustments to preserve consistent gap
				const safeY = yPos - desiredGapFromAxisPx - labelHeight
				// Bottom-align MathML inside the foreignObject so visual gap is consistent regardless of content height
				const xhtml = `<!DOCTYPE html><div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:flex-end;justify-content:center;width:100%;height:100%;line-height:1;font-family:${theme.font.family.sans};color:${p.color};"><math xmlns="http://www.w3.org/1998/Math/MathML" display="inline" style="font-size:${fontPx * 1.2}px;">${inner}</math></div>`
				canvas.drawForeignObject({
					x: px - labelWidth / 2,
					y: safeY,
					width: labelWidth,
					height: labelHeight,
					content: xhtml
				})
			}
		}
	} else {
		// Vertical
		const xPos = width / 2
		const toSvgY = (val: number) => height - PADDING - (val - min) * scale

		canvas.drawLine(xPos, PADDING, xPos, height - PADDING, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thick
		})

		const selectedLabels = selectAxisLabels({
			labels: majorLabels,
			positions: majorValues.map(toSvgY),
			axisLengthPx: lineLength,
			orientation: "vertical",
			fontPx: theme.font.size.small,
			minGapPx: 12
		})

		for (const t of minorValues) {
			if (!majorValues.some((mt) => Math.abs(mt - t) < 1e-9)) {
				// Minor ticks on the LEFT side only for vertical orientation
				canvas.drawLine(xPos - 3, toSvgY(t), xPos, toSvgY(t), {
					stroke: theme.colors.axis,
					strokeWidth: theme.stroke.width.base
				})
			}
		}

		majorValues.forEach((t, i) => {
			const y = toSvgY(t)
			// Major ticks on the LEFT side only
			canvas.drawLine(xPos - 5, y, xPos, y, {
				stroke: theme.colors.axis,
				strokeWidth: theme.stroke.width.base
			})
			if (showTickLabels && selectedLabels.has(i)) {
				// Place tick labels on the LEFT side, opposite from highlighted text labels
				canvas.drawText({
					x: xPos - 10,
					y: y + 4,
					text: majorLabels[i] ?? "",
					fill: theme.colors.axis,
					anchor: "end",
					fontPx: theme.font.size.small
				})
			}
		})

		if (highlightedPoints) {
			for (const p of highlightedPoints) {
				const py = toSvgY(p.position)
				// Draw the point dot
				canvas.drawCircle(xPos, py, 5, {
					fill: p.color,
					stroke: p.color,
					strokeWidth: theme.stroke.width.thin
				})

				// Prepare MathML content
				let inner: string
				if (p.type === "mathml") {
					inner = p.mathml
				} else if (p.type === "whole") {
					inner = numberContentToInnerMathML({
						type: "whole",
						value: p.value,
						sign: p.sign
					})
				} else if (p.type === "fraction") {
					inner = numberContentToInnerMathML({
						type: "fraction",
						numerator: p.numerator,
						denominator: p.denominator,
						sign: p.sign
					})
				} else {
					inner = numberContentToInnerMathML({
						type: "mixed",
						whole: p.whole,
						numerator: p.numerator,
						denominator: p.denominator,
						sign: p.sign
					})
				}

				// Render label near the point (larger font). Ensure consistent gap from vertical axis
				const fontPx = theme.font.size.large
				const labelWidth = 240
				const labelHeight = 32
				const desiredGapFromAxisPx = 15
				// Place the foreignObject so that its LEFT edge is a fixed gap to the right of the axis
				// Do not clamp to the right edge; allow viewBox expansion to preserve consistent gap
				const safeX = xPos + desiredGapFromAxisPx
				// Left-align MathML inside the foreignObject so visual gap is consistent regardless of content width
				const xhtml = `<!DOCTYPE html><div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:flex-start;width:100%;height:100%;line-height:1;font-family:${theme.font.family.sans};color:${p.color};"><math xmlns="http://www.w3.org/1998/Math/MathML" display="inline" style="font-size:${fontPx * 1.2}px;">${inner}</math></div>`
				canvas.drawForeignObject({
					x: safeX,
					y: py - labelHeight / 2,
					width: labelWidth,
					height: labelHeight,
					content: xhtml
				})
			}
		}

		// 3a (vertical). Draw on-axis segments along the vertical axis
		if (segments) {
			for (const s of segments) {
				const startVal = Math.max(min, Math.min(max, s.start))
				const endVal = Math.max(min, Math.min(max, s.end))
				if (endVal <= startVal) continue
				const startY = toSvgY(startVal)
				const endY = toSvgY(endVal)
				canvas.drawLine(xPos, startY, xPos, endY, {
					stroke: s.color,
					strokeWidth: 5
				})
			}
		}
	}

	// arrows removed: only 'dot' style is supported; no marker defs needed

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="12">${svgBody}</svg>`
}
