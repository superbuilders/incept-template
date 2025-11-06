import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { selectAxisLabels } from "@/widgets/utils/layout"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { type Theme, theme } from "@/widgets/utils/theme"

export const NumberLineWithActionPropsSchema = z
	.object({
		type: z
			.literal("numberLineWithAction")
			.describe(
				"Identifies this as a number line with action arrows showing addition/subtraction operations."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		orientation: z
			.enum(["horizontal", "vertical"])
			.describe(
				"Direction of the number line. 'horizontal' is left-to-right, 'vertical' is bottom-to-top. Affects layout and arrow directions."
			),
		min: z
			.number()
			.describe(
				"Minimum value shown on the number line (e.g., -10, 0, -5). Should be less than startValue - sum of negative deltas."
			),
		max: z
			.number()
			.describe(
				"Maximum value shown on the number line (e.g., 20, 10, 15). Should be greater than startValue + sum of positive deltas."
			),
		tickInterval: z
			.discriminatedUnion("type", [
				z
					.object({
						type: z.literal("whole"),
						interval: z
							.number()
							.positive()
							.describe(
								"Whole number interval between major ticks (e.g., 1, 2, 5, 10)"
							)
					})
					.strict(),
				z
					.object({
						type: z.literal("fraction"),
						numerator: z.literal(1).describe("Always 1 for unit fractions"),
						denominator: z
							.number()
							.int()
							.positive()
							.describe(
								"Denominator for unit fractions (e.g., 5 for fifths, 7 for sevenths)"
							)
					})
					.strict()
			])
			.describe(
				"Major tick interval specification with full-length ticks and labels"
			),
		secondaryTickInterval: z
			.discriminatedUnion("type", [
				z
					.object({
						type: z.literal("whole"),
						interval: z
							.number()
							.positive()
							.describe(
								"Whole number interval between minor ticks (e.g., 0.5, 1, 2.5)"
							)
					})
					.strict(),
				z
					.object({
						type: z.literal("fraction"),
						numerator: z.literal(1).describe("Always 1 for unit fractions"),
						denominator: z
							.number()
							.int()
							.positive()
							.describe(
								"Denominator for unit fractions (e.g., 10 for tenths, 20 for twentieths)"
							)
					})
					.strict()
			])
			.nullable()
			.describe(
				"Optional minor tick interval with half-length ticks and no labels"
			),
		startValue: z
			.number()
			.describe(
				"The initial position before any actions (e.g., 5, 0, -2). Marked with a distinct point. Actions begin from here."
			),
		actions: z
			.array(
				z
					.object({
						delta: z
							.discriminatedUnion("type", [
								z
									.object({
										type: z.literal("whole").describe("Whole number change"),
										value: z
											.number()
											.int()
											.describe("Integer value for the change, e.g. -3, 0, 5"),
										sign: z
											.enum(["+", "-"])
											.describe("Sign of the whole number change")
									})
									.strict(),
								z
									.object({
										type: z
											.literal("fraction")
											.describe("Proper or improper fraction change"),
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
										sign: z
											.enum(["+", "-"])
											.describe("Sign of the fraction change")
									})
									.strict(),
								z
									.object({
										type: z
											.literal("mixed")
											.describe("Mixed number change like 1 1/4"),
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
											.describe(
												"Denominator of the fractional part (positive)"
											),
										sign: z
											.enum(["+", "-"])
											.describe("Sign of the mixed number change")
									})
									.strict()
							])
							.describe(
								"The change amount for this action. Supports numeric, fractional, or mixed number values with explicit signs. Positive for addition/forward, negative for subtraction/backward."
							)
					})
					.strict()
			)
			.describe(
				"Sequence of operations shown as curved arrows. Applied in order from startValue. Multiple actions create multi-step problems (e.g., 5 + 3 - 2)."
			)
	})
	.strict()
	.describe(
		"Creates an interactive number line showing arithmetic operations as curved 'jump' arrows. Perfect for teaching addition/subtraction concepts, multi-step problems, and integer operations. Supports multiple sequential actions to show complex calculations step-by-step."
	)

export type NumberLineWithActionProps = z.infer<
	typeof NumberLineWithActionPropsSchema
>

type ActionDelta = z.infer<
	typeof NumberLineWithActionPropsSchema
>["actions"][number]["delta"]

/**
 * Calculates the numerical value of an action's delta.
 */
const toNumericDelta = (delta: ActionDelta): number => {
	if (delta.type === "whole") {
		return delta.sign === "-" ? -delta.value : delta.value
	}
	if (delta.type === "fraction") {
		const magnitude =
			delta.denominator === 0 ? 0 : delta.numerator / delta.denominator
		return delta.sign === "-" ? -magnitude : magnitude
	}
	// mixed
	const total =
		delta.whole +
		(delta.denominator === 0 ? 0 : delta.numerator / delta.denominator)
	return delta.sign === "-" ? -total : total
}

/**
 * Generates the display label for an action's delta.
 */
const toDeltaLabel = (delta: ActionDelta): string => {
	if (delta.type === "whole") {
		const sign = delta.sign === "-" ? "-" : "+"
		return `${sign}${delta.value}`
	}
	if (delta.type === "fraction") {
		const sign = delta.sign === "-" ? "-" : "+"
		return `${sign}${delta.numerator}/${delta.denominator}`
	}
	// mixed
	const sign = delta.sign === "-" ? "-" : "+"
	return `${sign}${delta.whole} ${delta.numerator}/${delta.denominator}`
}

/**
 * Formats a numeric value as a fraction when appropriate.
 */
const formatPointLabel = (value: number, min: number, max: number): string => {
	if (Number.isInteger(value)) {
		return value.toString()
	}

	// For unit intervals [0,1], try to represent as simple fractions
	if (min === 0 && max === 1) {
		// Try common denominators
		const denominators = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12]
		for (const den of denominators) {
			const num = Math.round(value * den)
			if (Math.abs(value - num / den) < 1e-10) {
				if (num === 0) return "0"
				if (num === den) return "1"
				// Simplify the fraction
				const gcd = (a: number, b: number): number =>
					b === 0 ? a : gcd(b, a % b)
				const g = gcd(num, den)
				return `${num / g}/${den / g}`
			}
		}
	}

	// Fallback to decimal with limited precision
	return value.toFixed(2).replace(/\.?0+$/, "")
}

/**
 * Creates an interactive number line showing arithmetic operations as curved 'jump' arrows.
 * Perfect for teaching addition/subtraction concepts, multi-step problems, and integer operations.
 * Supports multiple sequential actions to show complex calculations step-by-step.
 */
// Helper function to draw a dotted line with clipping around label areas
function drawClippedDottedLine(
	canvas: CanvasImpl,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	labelBounds: Array<{ x: number; y: number; width: number; height: number }>,
	theme: Theme
) {
	// Check if the line intersects with any label bounds
	const lineIntersections: Array<{ start: number; end: number }> = []

	// For vertical lines (x1 === x2)
	if (Math.abs(x1 - x2) < 0.1) {
		const lineX = x1
		const minY = Math.min(y1, y2)
		const maxY = Math.max(y1, y2)

		for (const bound of labelBounds) {
			// Check if vertical line intersects with label rectangle
			if (lineX >= bound.x && lineX <= bound.x + bound.width) {
				const intersectionStart = Math.max(minY, bound.y)
				const intersectionEnd = Math.min(maxY, bound.y + bound.height)

				if (intersectionStart < intersectionEnd) {
					lineIntersections.push({
						start: intersectionStart,
						end: intersectionEnd
					})
				}
			}
		}
	}
	// For horizontal lines (y1 === y2)
	else if (Math.abs(y1 - y2) < 0.1) {
		const lineY = y1
		const minX = Math.min(x1, x2)
		const maxX = Math.max(x1, x2)

		for (const bound of labelBounds) {
			// Check if horizontal line intersects with label rectangle
			if (lineY >= bound.y && lineY <= bound.y + bound.height) {
				const intersectionStart = Math.max(minX, bound.x)
				const intersectionEnd = Math.min(maxX, bound.x + bound.width)

				if (intersectionStart < intersectionEnd) {
					lineIntersections.push({
						start: intersectionStart,
						end: intersectionEnd
					})
				}
			}
		}
	}

	// If no intersections, draw the full line
	if (lineIntersections.length === 0) {
		canvas.drawLine(x1, y1, x2, y2, {
			stroke: theme.colors.actionPrimary,
			strokeWidth: theme.stroke.width.thin,
			dash: "2,2",
			opacity: 0.6
		})
		return
	}

	// Sort intersections and draw line segments between them
	lineIntersections.sort((a, b) => a.start - b.start)

	// For vertical lines
	if (Math.abs(x1 - x2) < 0.1) {
		const lineX = x1
		const minY = Math.min(y1, y2)
		const maxY = Math.max(y1, y2)
		let currentY = minY

		for (const intersection of lineIntersections) {
			// Draw segment before intersection
			if (currentY < intersection.start) {
				canvas.drawLine(lineX, currentY, lineX, intersection.start, {
					stroke: theme.colors.actionPrimary,
					strokeWidth: theme.stroke.width.thin,
					dash: "2,2",
					opacity: 0.6
				})
			}
			currentY = Math.max(currentY, intersection.end)
		}

		// Draw final segment after last intersection
		if (currentY < maxY) {
			canvas.drawLine(lineX, currentY, lineX, maxY, {
				stroke: theme.colors.actionPrimary,
				strokeWidth: theme.stroke.width.thin,
				dash: "2,2",
				opacity: 0.6
			})
		}
	}
	// For horizontal lines
	else {
		const lineY = y1
		const minX = Math.min(x1, x2)
		const maxX = Math.max(x1, x2)
		let currentX = minX

		for (const intersection of lineIntersections) {
			// Draw segment before intersection
			if (currentX < intersection.start) {
				canvas.drawLine(currentX, lineY, intersection.start, lineY, {
					stroke: theme.colors.actionPrimary,
					strokeWidth: theme.stroke.width.thin,
					dash: "2,2",
					opacity: 0.6
				})
			}
			currentX = Math.max(currentX, intersection.end)
		}

		// Draw final segment after last intersection
		if (currentX < maxX) {
			canvas.drawLine(currentX, lineY, maxX, lineY, {
				stroke: theme.colors.actionPrimary,
				strokeWidth: theme.stroke.width.thin,
				dash: "2,2",
				opacity: 0.6
			})
		}
	}
}

export const generateNumberLineWithAction: WidgetGenerator<
	typeof NumberLineWithActionPropsSchema
> = async (data) => {
	const {
		width,
		height,
		orientation,
		min,
		max,
		tickInterval,
		secondaryTickInterval,
		startValue,
		actions
	} = data
	const isHorizontal = orientation === "horizontal"
	const lineLength = (isHorizontal ? width : height) - 2 * PADDING

	if (min >= max) return `<svg width="${width}" height="${height}"></svg>`

	// Validate that start value and all action points stay within bounds
	if (startValue < min || startValue > max) {
		logger.error("start value outside bounds", {
			startValue,
			min,
			max
		})
		throw errors.new("start value outside bounds")
	}

	let currentValue = startValue
	for (let i = 0; i < actions.length; i++) {
		const action = actions[i]
		if (!action) continue

		const numericDelta = toNumericDelta(action.delta)
		currentValue += numericDelta
		if (currentValue < min || currentValue > max) {
			logger.error("action results in value outside bounds", {
				actionIndex: i + 1,
				delta: numericDelta,
				resultValue: currentValue,
				min,
				max
			})
			throw errors.new("action results in value outside bounds")
		}
	}

	const scale = lineLength / (max - min)

	// Helper function to generate tick values and labels
	const generateTicks = (
		tickSpec: typeof tickInterval
	): { values: number[]; labels: string[] } => {
		const values: number[] = []
		const labels: string[] = []

		if (tickSpec.type === "whole") {
			// Generate ticks at whole number intervals
			const interval = tickSpec.interval
			const startTick = Math.ceil(min / interval) * interval

			for (let value = startTick; value <= max; value += interval) {
				if (value >= min) {
					values.push(value)
					labels.push(
						Number.isInteger(value) ? value.toString() : value.toFixed(2)
					)
				}
			}
		} else if (tickSpec.type === "fraction") {
			// Generate ticks at fractional intervals (1/denominator)
			const denominator = tickSpec.denominator
			const interval = 1 / denominator
			const numTicks = Math.floor((max - min) / interval) + 1

			for (let i = 0; i <= numTicks; i++) {
				const value = min + i * interval
				if (value <= max + 1e-10) {
					// Add small epsilon for floating point precision
					values.push(value)

					// Generate proper fractional labels
					if (Number.isInteger(value)) {
						labels.push(value.toString())
					} else {
						// For unit intervals [0,1], show as simple fractions
						if (min === 0 && max === 1) {
							labels.push(`${i}/${denominator}`)
						} else {
							// For other ranges, show fractional representation
							const wholePart = Math.floor(value)
							const fracPart = value - wholePart
							const fracNumerator = Math.round(fracPart * denominator)

							if (fracNumerator === 0) {
								labels.push(wholePart.toString())
							} else if (wholePart === 0) {
								labels.push(`${fracNumerator}/${denominator}`)
							} else {
								labels.push(`${wholePart} ${fracNumerator}/${denominator}`)
							}
						}
					}
				}
			}
		}
		return { values, labels }
	}

	// Generate major ticks
	const { values: tickValues, labels: tickLabels } = generateTicks(tickInterval)

	// Generate secondary ticks if specified
	const secondaryTickValues: number[] = secondaryTickInterval
		? generateTicks(secondaryTickInterval).values
		: []

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	canvas.addDef(
		`<marker id="action-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.colors.axis}"/></marker>`
	)

	if (isHorizontal) {
		const yPos = height / 2
		const toSvgX = (val: number) => PADDING + (val - min) * scale

		// Axis and Ticks
		canvas.drawLine(PADDING, yPos, width - PADDING, yPos, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thick
		})

		const values = tickValues
		const labels = tickLabels
		const tickPositions = values.map(toSvgX)

		// Check if start value coincides with any tick and force it to have a label
		const startValueAtTick = tickValues.some(
			(tick) => Math.abs(tick - startValue) < 1e-10
		)

		// Smart label selection to prevent overlaps, but force start value to be labeled
		const selectedLabels = selectAxisLabels({
			labels: labels,
			positions: tickPositions,
			axisLengthPx: lineLength,
			orientation: "horizontal",
			fontPx: theme.font.size.small,
			minGapPx: 8
		})

		// If start value is at a tick position, force it to be selected
		if (startValueAtTick) {
			const startTickIndex = tickValues.findIndex(
				(tick) => Math.abs(tick - startValue) < 1e-10
			)
			if (startTickIndex >= 0) {
				selectedLabels.add(startTickIndex)
			}
		}

		// Draw major ticks with full length and labels
		values.forEach((t, i) => {
			const x = toSvgX(t)
			canvas.drawLine(x, yPos - 5, x, yPos + 5, {
				stroke: theme.colors.axis,
				strokeWidth: theme.stroke.width.base
			})

			if (selectedLabels.has(i)) {
				canvas.drawText({
					x: x,
					y: yPos + 20,
					text: labels[i] ?? "",
					fill: theme.colors.axis,
					anchor: "middle",
					fontPx: theme.font.size.small
				})
			}
		})

		// Draw secondary ticks with half length and no labels, BUT promote to primary if it's the start value
		for (const t of secondaryTickValues) {
			// Skip secondary ticks that overlap with major ticks
			const isOverlapping = tickValues.some(
				(majorTick) => Math.abs(majorTick - t) < 1e-10
			)
			if (!isOverlapping) {
				const x = toSvgX(t)
				const isStartValue = Math.abs(t - startValue) < 1e-10

				if (isStartValue) {
					// Keep secondary tick size, but add label
					canvas.drawLine(x, yPos - 2.5, x, yPos + 2.5, {
						stroke: theme.colors.axis,
						strokeWidth: theme.stroke.width.thin
					})
					const startLabel = formatPointLabel(startValue, min, max)
					canvas.drawText({
						x: x,
						y: yPos + 20,
						text: startLabel,
						fill: theme.colors.axis,
						anchor: "middle",
						fontPx: theme.font.size.small
					})
				} else {
					// Regular secondary tick
					canvas.drawLine(x, yPos - 2.5, x, yPos + 2.5, {
						stroke: theme.colors.axis,
						strokeWidth: theme.stroke.width.thin
					})
				}
			}
		}

		// Start value marker (no separate label - uses tick label instead)
		const startX = toSvgX(startValue)
		canvas.drawCircle(startX, yPos, theme.geometry.pointRadius.small, {
			fill: theme.colors.actionPrimary,
			stroke: theme.colors.actionPrimary,
			strokeWidth: theme.stroke.width.thin
		})

		// Action arrows - sequential with stacked labels
		let currentValue = startValue
		const labelBounds: Array<{
			x: number
			y: number
			width: number
			height: number
		}> = []

		// First pass: collect label bounds
		for (let i = 0; i < actions.length; i++) {
			const action = actions[i]
			if (!action) continue

			const numericDelta = toNumericDelta(action.delta)
			const actionLabel = toDeltaLabel(action.delta)
			const actionStartX = toSvgX(currentValue)
			const actionEndX = toSvgX(currentValue + numericDelta)
			const midX = (actionStartX + actionEndX) / 2
			const baseOffset = 30
			const arrowSpacing = 25
			const arrowY = yPos - baseOffset - i * arrowSpacing

			// Estimate label dimensions with tight bounds (server-safe approximation)
			const labelWidth = actionLabel.length * theme.font.size.small * 0.6
			const labelHeight = theme.font.size.small
			const padding = 2 // Minimal padding for tighter clipping

			labelBounds.push({
				x: midX - labelWidth / 2 - padding,
				y: arrowY - 8 - labelHeight / 2 - padding,
				width: labelWidth + 2 * padding,
				height: labelHeight + 2 * padding
			})

			currentValue += numericDelta
		}

		// Second pass: draw arrows and clipped dotted lines
		currentValue = startValue
		for (let i = 0; i < actions.length; i++) {
			const action = actions[i]
			if (!action) continue

			const numericDelta = toNumericDelta(action.delta)
			const actionStartX = toSvgX(currentValue)
			const actionEndX = toSvgX(currentValue + numericDelta)
			const midX = (actionStartX + actionEndX) / 2

			// Stack arrows vertically with better spacing
			const baseOffset = 30
			const arrowSpacing = 25
			const arrowY = yPos - baseOffset - i * arrowSpacing

			// Draw completely horizontal arrow
			canvas.drawLine(actionStartX, arrowY, actionEndX, arrowY, {
				stroke: theme.colors.actionPrimary,
				strokeWidth: theme.stroke.width.base,
				markerEnd: "url(#action-arrow)"
			})

			// Draw dotted lines with clipping around labels
			drawClippedDottedLine(
				canvas,
				actionStartX,
				arrowY,
				actionStartX,
				yPos,
				labelBounds,
				theme
			)
			drawClippedDottedLine(
				canvas,
				actionEndX,
				arrowY,
				actionEndX,
				yPos,
				labelBounds,
				theme
			)

			// Arrow label with better spacing
			const actionLabel = toDeltaLabel(action.delta)
			canvas.drawText({
				x: midX,
				y: arrowY - 8,
				text: actionLabel,
				fill: theme.colors.actionPrimary,
				anchor: "middle",
				fontPx: theme.font.size.small,
				fontWeight: theme.font.weight.bold
			})

			currentValue += numericDelta
		}

		// Final value marker
		const finalX = toSvgX(currentValue)
		canvas.drawCircle(finalX, yPos, theme.geometry.pointRadius.small, {
			fill: theme.colors.actionSecondary,
			stroke: theme.colors.actionSecondary,
			strokeWidth: theme.stroke.width.thin
		})
	} else {
		// Vertical orientation
		const xPos = width / 2
		const toSvgY = (val: number) => height - PADDING - (val - min) * scale

		// Axis and Ticks
		canvas.drawLine(xPos, PADDING, xPos, height - PADDING, {
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thick
		})

		const values = tickValues
		const labels = tickLabels
		const tickPositions = values.map(toSvgY)

		// Check if start value coincides with any tick and force it to have a label
		const startValueAtTick = tickValues.some(
			(tick) => Math.abs(tick - startValue) < 1e-10
		)

		// Smart label selection to prevent overlaps, but force start value to be labeled
		const selectedLabels = selectAxisLabels({
			labels: labels,
			positions: tickPositions,
			axisLengthPx: lineLength,
			orientation: "vertical",
			fontPx: theme.font.size.small,
			minGapPx: 12
		})

		// If start value is at a tick position, force it to be selected
		if (startValueAtTick) {
			const startTickIndex = tickValues.findIndex(
				(tick) => Math.abs(tick - startValue) < 1e-10
			)
			if (startTickIndex >= 0) {
				selectedLabels.add(startTickIndex)
			}
		}

		// Draw major ticks with full length and labels
		values.forEach((t, i) => {
			const y = toSvgY(t)
			canvas.drawLine(xPos - 5, y, xPos + 5, y, {
				stroke: theme.colors.axis,
				strokeWidth: theme.stroke.width.base
			})

			const labelX = xPos - 10
			if (selectedLabels.has(i)) {
				canvas.drawText({
					x: labelX,
					y: y + 4,
					text: labels[i] ?? "",
					fill: theme.colors.axis,
					anchor: "end",
					fontPx: theme.font.size.small
				})
			}
		})

		// Draw secondary ticks with half length and no labels, BUT promote to primary if it's the start value
		for (const t of secondaryTickValues) {
			// Skip secondary ticks that overlap with major ticks
			const isOverlapping = tickValues.some(
				(majorTick) => Math.abs(majorTick - t) < 1e-10
			)
			if (!isOverlapping) {
				const y = toSvgY(t)
				const isStartValue = Math.abs(t - startValue) < 1e-10

				if (isStartValue) {
					// Keep secondary tick size, but add label
					canvas.drawLine(xPos - 2.5, y, xPos + 2.5, y, {
						stroke: theme.colors.axis,
						strokeWidth: theme.stroke.width.thin
					})
					const startLabel = formatPointLabel(startValue, min, max)
					const labelX = xPos - 10
					canvas.drawText({
						x: labelX,
						y: y + 4,
						text: startLabel,
						fill: theme.colors.axis,
						anchor: "end",
						fontPx: theme.font.size.small
					})
				} else {
					// Regular secondary tick
					canvas.drawLine(xPos - 2.5, y, xPos + 2.5, y, {
						stroke: theme.colors.axis,
						strokeWidth: theme.stroke.width.thin
					})
				}
			}
		}

		// Start value marker (no separate label - uses tick label instead)
		const startY = toSvgY(startValue)
		canvas.drawCircle(xPos, startY, theme.geometry.pointRadius.small, {
			fill: theme.colors.actionPrimary,
			stroke: theme.colors.actionPrimary,
			strokeWidth: theme.stroke.width.thin
		})

		// Action arrows - sequential with stacked labels
		let currentValue = startValue
		const labelBounds: Array<{
			x: number
			y: number
			width: number
			height: number
		}> = []

		// First pass: collect label bounds for vertical layout
		for (let i = 0; i < actions.length; i++) {
			const action = actions[i]
			if (!action) continue

			const numericDelta = toNumericDelta(action.delta)
			const actionLabel = toDeltaLabel(action.delta)
			const actionStartY = toSvgY(currentValue)
			const actionEndY = toSvgY(currentValue + numericDelta)
			const midY = (actionStartY + actionEndY) / 2
			const baseOffset = 30
			const arrowSpacing = 32 // Reduced from 40 to 32 for tighter spacing
			const arrowX = xPos + baseOffset + i * arrowSpacing
			const labelX = arrowX + 18 // Reduced from 25 to 18 for better balance

			// For rotated text (-90 degrees), calculate accurate bounding box
			const textWidth = actionLabel.length * theme.font.size.small * 0.6 // original text width
			const textHeight = theme.font.size.small // original text height
			const padding = 3 // Adequate padding for proper clipping

			// For -90 degree rotation around (labelX, midY), use heavily asymmetric clipping
			// Text visually extends more to the left, so we need much more padding on the left
			const leftPadding = padding + 4 // Much more padding on the left where text appears
			const rightPadding = 0 // No padding on the right - preserve maximum dotted line
			const topPadding = padding
			const bottomPadding = padding

			labelBounds.push({
				x: labelX - textHeight / 2 - leftPadding, // more space on left
				y: midY - textWidth / 2 - topPadding, // top edge
				width: textHeight + leftPadding + rightPadding, // asymmetric width
				height: textWidth + topPadding + bottomPadding // symmetric height
			})

			currentValue += numericDelta
		}

		// Second pass: draw arrows and clipped dotted lines
		currentValue = startValue
		for (let i = 0; i < actions.length; i++) {
			const action = actions[i]
			if (!action) continue

			const numericDelta = toNumericDelta(action.delta)
			const actionStartY = toSvgY(currentValue)
			const actionEndY = toSvgY(currentValue + numericDelta)
			const midY = (actionStartY + actionEndY) / 2

			// Stack arrows horizontally with better spacing
			const baseOffset = 30
			const arrowSpacing = 32 // Reduced from 40 to 32 for tighter spacing
			const arrowX = xPos + baseOffset + i * arrowSpacing

			// Draw completely vertical arrow
			canvas.drawLine(arrowX, actionStartY, arrowX, actionEndY, {
				stroke: theme.colors.actionPrimary,
				strokeWidth: theme.stroke.width.base,
				markerEnd: "url(#action-arrow)"
			})

			// Draw dotted lines with clipping around labels
			drawClippedDottedLine(
				canvas,
				arrowX,
				actionStartY,
				xPos,
				actionStartY,
				labelBounds,
				theme
			)
			drawClippedDottedLine(
				canvas,
				arrowX,
				actionEndY,
				xPos,
				actionEndY,
				labelBounds,
				theme
			)

			// Arrow label (rotated for vertical layout) with better spacing
			const actionLabel = toDeltaLabel(action.delta)
			const labelX = arrowX + 18 // Reduced from 25 to 18 for better balance
			canvas.drawText({
				x: labelX,
				y: midY,
				text: actionLabel,
				fill: theme.colors.actionPrimary,
				anchor: "middle",
				fontPx: theme.font.size.small,
				fontWeight: theme.font.weight.bold,
				rotate: { angle: -90, cx: labelX, cy: midY }
			})

			currentValue += numericDelta
		}

		// Final value marker
		const finalY = toSvgY(currentValue)
		canvas.drawCircle(xPos, finalY, theme.geometry.pointRadius.small, {
			fill: theme.colors.actionSecondary,
			stroke: theme.colors.actionSecondary,
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

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
