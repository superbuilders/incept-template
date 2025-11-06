import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

function createWeightSchema() {
	return z
		.object({
			label: z
				.union([z.string(), z.number()])
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
				.describe(
					"The value or variable displayed on this weight (e.g., 5, 'x', 12, 'y', '2x', 3.5, null). Can be numeric values or algebraic expressions. Null shows no label."
				),
			shape: z
				.enum(["square", "circle", "pentagon", "hexagon", "triangle"])
				.describe(
					"Geometric shape for this weight. Different shapes can represent different variables or value types in equations."
				),
			backgroundColor: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.describe(
					"Hex-only background color for this weight (e.g., '#F4F8FF', '#FFF5CC', '#E6FFEE'). Text is rendered in black on top; background MUST be a light color to ensure contrast."
				)
		})
		.strict()
}

export const HangerDiagramPropsSchema = z
	.object({
		type: z
			.literal("hangerDiagram")
			.describe(
				"Identifies this as a hanger diagram (balance scale) for visualizing algebraic equations."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		leftSide: z
			.array(createWeightSchema())
			.describe(
				"Weights hanging on the left side of the balance. Can be empty array for 0 = right side. Order determines left-to-right positioning."
			),
		rightSide: z
			.array(createWeightSchema())
			.describe(
				"Weights hanging on the right side of the balance. Can be empty array for left side = 0. Order determines left-to-right positioning."
			)
	})
	.strict()
	.describe(
		"Creates a balance scale visualization for algebraic equations where each side represents one side of the equation. Weights can show constants or variables with different shapes and colors. Perfect for teaching equation solving, algebraic thinking, and the balance method. The horizontal beam shows the equation is balanced (equal)."
	)

export type HangerDiagramProps = z.infer<typeof HangerDiagramPropsSchema>

/**
 * This template generates a "hanger diagram," a powerful visual metaphor for a balanced
 * algebraic equation, rendered as an SVG graphic. This diagram is ideal for introducing
 * students to the concept of solving equations by maintaining balance.
 */
export const generateHangerDiagram: WidgetGenerator<
	typeof HangerDiagramPropsSchema
> = async (data) => {
	const { width, height, leftSide, rightSide } = data
	const centerX = width / 2

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Dynamic vertical layout to avoid clipping for small heights
	const maxStack = Math.max(leftSide.length, rightSide.length, 1)
	const bottomMargin = 8
	// Place beam relative to height but keep within a sensible range
	const beamY = Math.max(30, Math.min(50, Math.floor(height * 0.2)))
	const availableBelowBeam = Math.max(0, height - beamY - bottomMargin)

	const maxWeightSize = 42
	const minWeightSize = 16
	const baseGap = 6
	// Compute weight size so that all rows fit within available space
	let size = Math.min(
		maxWeightSize,
		Math.max(
			minWeightSize,
			Math.floor((availableBelowBeam - 10) / maxStack) - baseGap
		)
	)
	// In edge cases (very small height), ensure size is not NaN or negative
	if (!Number.isFinite(size) || size < minWeightSize) {
		size = minWeightSize
	}
	const weightGap = baseGap
	const weightHeight = size + weightGap
	const stringOffset = Math.max(8, Math.min(15, Math.floor(size / 2)))
	const weightYStart = beamY + stringOffset + 8

	const beamWidth = width * 0.8
	const beamStartX = centerX - beamWidth / 2
	const beamEndX = centerX + beamWidth / 2

	// Hook and beam
	canvas.drawLine(centerX, 10, centerX, beamY, {
		stroke: theme.colors.axis,
		strokeWidth: 0.6667
	})
	const hookPath = new Path2D()
		.moveTo(centerX - 5, 10)
		.lineTo(centerX, 5)
		.lineTo(centerX + 5, 10)
		.closePath()
	canvas.drawPath(hookPath, {
		fill: theme.colors.axis
	})
	canvas.drawLine(beamStartX, beamY, beamEndX, beamY, {
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.xxthick
	})

	const drawWeight = (x: number, y: number, weight: (typeof leftSide)[0]) => {
		switch (weight.shape) {
			case "circle":
				canvas.drawCircle(x, y + size / 2, size / 2, {
					fill: weight.backgroundColor,
					stroke: theme.colors.axis
				})
				break
			case "triangle":
				canvas.drawPolygon(
					[
						{ x: x - size / 2, y: y + size },
						{ x: x + size / 2, y: y + size },
						{ x: x, y: y }
					],
					{
						fill: weight.backgroundColor,
						stroke: theme.colors.axis
					}
				)
				break
			case "pentagon": {
				// Simplified pentagon
				const pentagonPoints = [
					{ x: x, y: y },
					{ x: x + size / 2, y: y + size * 0.4 },
					{ x: x + size * 0.3, y: y + size },
					{ x: x - size * 0.3, y: y + size },
					{ x: x - size / 2, y: y + size * 0.4 }
				]
				canvas.drawPolygon(pentagonPoints, {
					fill: weight.backgroundColor,
					stroke: theme.colors.axis
				})
				break
			}
			default:
				canvas.drawRect(x - size / 2, y, size, size, {
					fill: weight.backgroundColor,
					stroke: theme.colors.axis
				})
				break
		}
		if (weight.label !== null) {
			canvas.drawText({
				x: x,
				y: y + size / 2 + 4,
				text: String(weight.label),
				fill: "#000000",
				anchor: "middle",
				fontWeight: theme.font.weight.bold
			})
		}
	}

	// First, draw all the lines
	const renderLines = (weights: typeof leftSide, isLeft: boolean) => {
		const sideCenterX = isLeft
			? beamStartX + beamWidth / 4
			: beamEndX - beamWidth / 4
		weights.forEach((_w, i) => {
			const weightY = weightYStart + i * weightHeight
			canvas.drawLine(
				sideCenterX,
				i === 0 ? beamY : weightY - weightHeight + weightGap,
				sideCenterX,
				weightY,
				{
					stroke: theme.colors.axis,
					strokeWidth: theme.stroke.width.base
				}
			)
		})
	}

	// Then, draw all the shapes on top
	const renderShapes = (weights: typeof leftSide, isLeft: boolean) => {
		const sideCenterX = isLeft
			? beamStartX + beamWidth / 4
			: beamEndX - beamWidth / 4
		weights.forEach((w, i) => {
			const weightY = weightYStart + i * weightHeight
			drawWeight(sideCenterX, weightY, w)
		})
	}

	// Draw all lines first
	renderLines(leftSide, true)
	renderLines(rightSide, false)

	// Then draw all shapes on top
	renderShapes(leftSide, true)
	renderShapes(rightSide, false)

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="12">${svgBody}</svg>`
}
