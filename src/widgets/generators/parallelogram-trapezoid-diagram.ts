import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Factory function to create label value schema - avoids $ref in OpenAI JSON schema
const createLabelValueSchema = () =>
	z.discriminatedUnion("type", [
		z.object({ type: z.literal("number"), value: z.number() }),
		z.object({ type: z.literal("string"), value: z.string().max(1) }),
		z.object({ type: z.literal("none") })
	])

type LabelValue =
	| { type: "number"; value: number }
	| { type: "string"; value: string }
	| { type: "none" }

const Parallelogram = z
	.object({
		type: z
			.literal("parallelogram")
			.describe("Specifies a parallelogram shape."),
		base: z
			.number()
			.positive()
			.describe(
				"Length of the base (bottom side) in arbitrary units (e.g., 8, 10, 6.5). Parallel to the top side."
			),
		height: z
			.number()
			.positive()
			.describe(
				"Perpendicular height of the parallelogram in arbitrary units (e.g., 4, 6, 7.5)"
			),
		slantAngle: z
			.number()
			.min(1, "slant angle must be at least 1°")
			.max(89, "slant angle must be at most 89°")
			.describe(
				"Angle between the base and the slanted side in degrees (acute). Defined at the bottom-left vertex."
			),
		labels: z
			.object({
				base: createLabelValueSchema().describe(
					"Label for the base: number or single-letter variable. Use type 'none' to hide. Positioned below the base."
				),
				height: createLabelValueSchema().describe(
					"Label for the height: number or single-letter variable. Use type 'none' to hide. Perpendicular distance."
				),
				slantAngle: createLabelValueSchema().describe(
					"Label for the slant angle in degrees: number or single-letter variable. Use type 'none' to hide. Positioned near the bottom-left vertex."
				)
			})
			.strict()
			.describe(
				"Labels for dimensions as numbers or single-letter variables. Use type 'none' to hide."
			)
	})
	.strict()

const RightTrapezoid = z
	.object({
		type: z
			.literal("trapezoidRight")
			.describe("Specifies a right trapezoid (one perpendicular side)."),
		topBase: z
			.number()
			.positive()
			.describe(
				"Length of the top parallel side in arbitrary units (e.g., 6, 8, 4.5). Usually shorter than bottom."
			),
		bottomBase: z
			.number()
			.positive()
			.describe(
				"Length of the bottom parallel side in arbitrary units (e.g., 10, 12, 8). Usually longer than top."
			),
		height: z
			.number()
			.positive()
			.describe(
				"Perpendicular distance between parallel sides in arbitrary units (e.g., 5, 7, 4.5)"
			),
		labels: z
			.object({
				topBase: createLabelValueSchema().describe(
					"Label for top base: number or single-letter variable. Use type 'none' to hide."
				),
				bottomBase: createLabelValueSchema().describe(
					"Label for bottom base: number or single-letter variable. Use type 'none' to hide."
				),
				height: createLabelValueSchema().describe(
					"Label for height/left side: number or single-letter variable. Use type 'none' to hide."
				),
				leftSide: createLabelValueSchema().describe(
					"Label for left perpendicular side: number or single-letter variable. Often same as height. Use type 'none' to hide."
				),
				rightSide: createLabelValueSchema().describe(
					"Label for right slanted side: number or single-letter variable. Use type 'none' to hide."
				)
			})
			.strict()
			.describe(
				"Labels for dimensions as numbers or single-letter variables. Use type 'none' to hide."
			)
	})
	.strict()

const GeneralTrapezoid = z
	.object({
		type: z
			.literal("trapezoid")
			.describe("Specifies a general trapezoid (both sides slanted)."),
		topBase: z
			.number()
			.positive()
			.describe(
				"Length of the top parallel side in arbitrary units (e.g., 5, 7, 4). Usually shorter than bottom."
			),
		bottomBase: z
			.number()
			.positive()
			.describe(
				"Length of the bottom parallel side in arbitrary units (e.g., 9, 12, 8). Usually longer than top."
			),
		height: z
			.number()
			.positive()
			.describe(
				"Perpendicular distance between parallel sides in arbitrary units (e.g., 4, 6, 5.5)"
			),
		leftSideLength: z
			.number()
			.positive()
			.describe(
				"Length of the left slanted side in arbitrary units (e.g., 5, 7, 4.5). Can differ from right side."
			),
		labels: z
			.object({
				topBase: createLabelValueSchema().describe(
					"Label for top base: number or single-letter variable. Use type 'none' to hide."
				),
				bottomBase: createLabelValueSchema().describe(
					"Label for bottom base: number or single-letter variable. Use type 'none' to hide."
				),
				height: createLabelValueSchema().describe(
					"Label for perpendicular height: number or single-letter variable. Shows with dashed line. Use type 'none' to hide."
				),
				leftSide: createLabelValueSchema().describe(
					"Label for left slanted side: number or single-letter variable. Use type 'none' to hide."
				),
				rightSide: createLabelValueSchema().describe(
					"Label for right slanted side: number or single-letter variable. Use type 'none' to hide."
				)
			})
			.strict()
			.describe(
				"Labels for dimensions as numbers or single-letter variables. Use type 'none' to hide."
			)
	})
	.strict()

export const ParallelogramTrapezoidDiagramPropsSchema = z
	.object({
		type: z
			.literal("parallelogramTrapezoidDiagram")
			.describe(
				"Identifies this as a parallelogram or trapezoid diagram widget."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		shape: z
			.discriminatedUnion("type", [
				Parallelogram,
				RightTrapezoid,
				GeneralTrapezoid
			])
			.describe(
				"The specific quadrilateral to draw with its dimensions and labels."
			)
	})
	.strict()
	.describe(
		"Creates accurate diagrams of parallelograms and trapezoids with labeled dimensions. Supports three types: parallelograms (opposite sides parallel and equal), right trapezoids (one perpendicular side), and general trapezoids (both sides slanted). Essential for geometry education, area calculations, and quadrilateral properties."
	)

export type ParallelogramTrapezoidDiagramProps = z.infer<
	typeof ParallelogramTrapezoidDiagramPropsSchema
>

/**
 * Generates an SVG diagram for a parallelogram or trapezoid directly with layout utilities.
 */
export const generateParallelogramTrapezoidDiagram: WidgetGenerator<
	typeof ParallelogramTrapezoidDiagramPropsSchema
> = async (props) => {
	const { width, height, shape } = props
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const labelToString = (value: LabelValue): string | undefined => {
		if (value.type === "none") return undefined
		if (value.type === "number") return String(value.value)
		return value.value
	}

	// --- SCALING LOGIC START ---
	const availableWidth = width - PADDING * 2
	const availableHeight = height - PADDING * 2

	let shapeWidth = 0
	let shapeHeight = 0

	if (shape.type === "parallelogram") {
		const angleRad = (shape.slantAngle * Math.PI) / 180
		const offset = shape.height / Math.tan(angleRad)
		shapeWidth = shape.base + offset
		shapeHeight = shape.height
	} else if (shape.type === "trapezoidRight") {
		// Right trapezoid
		shapeWidth = shape.bottomBase
		shapeHeight = shape.height
	} else {
		// General trapezoid
		shapeWidth = shape.bottomBase
		shapeHeight = shape.height
	}

	const scale = Math.min(
		availableWidth / shapeWidth,
		availableHeight / shapeHeight
	)
	// --- SCALING LOGIC END ---

	// Center the shape in the diagram
	const centerX = width / 2
	const centerY = height / 2

	if (shape.type === "parallelogram") {
		const { base, height: h, slantAngle, labels } = shape

		const scaledBase = base * scale
		const scaledH = h * scale
		const angleRad = (slantAngle * Math.PI) / 180
		const scaledOffset = scaledH / Math.tan(angleRad)

		// Center the shape
		const shapeActualWidth = scaledBase + scaledOffset
		const xOffset = centerX - shapeActualWidth / 2
		const yOffset = centerY - scaledH / 2

		const vertices = [
			{ x: xOffset, y: yOffset + scaledH }, // 0: Bottom-left
			{ x: xOffset + scaledBase, y: yOffset + scaledH }, // 1: Bottom-right
			{ x: xOffset + scaledBase + scaledOffset, y: yOffset }, // 2: Top-right
			{ x: xOffset + scaledOffset, y: yOffset }, // 3: Top-left
			{ x: xOffset + scaledOffset, y: yOffset + scaledH } // 4: Point for height line base
		]

		// Draw outer boundary polygon
		const outerPoints = [
			vertices[0],
			vertices[1],
			vertices[2],
			vertices[3]
		].filter((p) => p !== undefined)
		canvas.drawPolygon(outerPoints, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})

		// Draw height line (dashed)
		const v3 = vertices[3]
		const v4 = vertices[4]
		if (v3 && v4) {
			canvas.drawLine(v3.x, v3.y, v4.x, v4.y, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				dash: theme.stroke.dasharray.dashedShort
			})
		}

		// Draw right angle marker
		const markerSize = 10
		if (v4) {
			const markerPath = new Path2D()
				.moveTo(v4.x - markerSize, v4.y)
				.lineTo(v4.x - markerSize, v4.y - markerSize)
				.lineTo(v4.x, v4.y - markerSize)
			canvas.drawPath(markerPath, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base
			})
		}

		// If the vertical height drops outside the base segment, extend the base with a dashed line
		// so the extension meets the foot of the height.
		const baseEndX = xOffset + scaledBase
		if (v4 && v4.x > baseEndX) {
			canvas.drawLine(baseEndX, yOffset + scaledH, v4.x, yOffset + scaledH, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				dash: theme.stroke.dasharray.dashedShort
			})
		}

		// Draw labels only when provided
		// Base label (bottom)
		const baseLabel = labelToString(labels.base)
		if (baseLabel !== undefined) {
			const baseLabelX = xOffset + scaledBase / 2
			const baseLabelY = yOffset + scaledH + 20
			canvas.drawText({
				x: baseLabelX,
				y: baseLabelY,
				text: baseLabel,
				anchor: "middle",
				fontPx: theme.font.size.medium
			})
		}

		// Slant angle label (placed near right slanted side for visibility)
		const rightLabel = labelToString(labels.slantAngle)
		if (rightLabel !== undefined) {
			const rightLabelX = xOffset + scaledBase + scaledOffset / 2
			const rightLabelY = yOffset + scaledH / 2
			canvas.drawText({
				x: rightLabelX + 20,
				y: rightLabelY,
				text: rightLabel,
				anchor: "start",
				fontPx: theme.font.size.medium
			})
		}

		// Top base label mirrors base label when provided
		if (baseLabel !== undefined) {
			const topLabelX = xOffset + scaledOffset + scaledBase / 2
			const topLabelY = yOffset - 10
			canvas.drawText({
				x: topLabelX,
				y: topLabelY,
				text: baseLabel,
				anchor: "middle",
				fontPx: theme.font.size.medium
			})
		}

		// Mirror of slant angle label on the left side when provided
		const leftLabel = labelToString(labels.slantAngle)
		if (leftLabel !== undefined) {
			const leftLabelX = xOffset + scaledOffset / 2
			const leftLabelY = yOffset + scaledH / 2
			canvas.drawText({
				x: leftLabelX - 20,
				y: leftLabelY,
				text: leftLabel,
				anchor: "end",
				fontPx: theme.font.size.medium
			})
		}

		// Height label with dynamic side placement to avoid clash with left slanted edge
		const heightLabel = labelToString(labels.height)
		if (heightLabel !== undefined && v3 && v4) {
			const yMid = v3.y + (v4.y - v3.y) / 2
			// Interpolate x of the left slanted side (between top-left v3 and bottom-left v0) at yMid
			const v0 = vertices[0]
			let placeOnLeft = true
			if (v0) {
				const denom = v0.y - v3.y
				const t = denom === 0 ? 0 : (yMid - v3.y) / denom
				const xLeftAtMid = v3.x + (v0.x - v3.x) * t
				const dashedX = v3.x
				const gap = dashedX - xLeftAtMid // available horizontal space to the left of the dashed line
				const estimateTextWidth = (text: string, fontPx: number) =>
					Math.max(0, Math.ceil(fontPx * 0.6 * Math.max(1, text.length)))
				const fontPx = theme.font.size.medium
				const labelWidthPx = estimateTextWidth(heightLabel, fontPx)
				const margin = 10
				placeOnLeft = labelWidthPx + margin <= gap
			}

			const heightLabelY = yMid
			if (placeOnLeft) {
				const heightLabelX = v3.x - 10
				canvas.drawText({
					x: heightLabelX,
					y: heightLabelY,
					text: heightLabel,
					anchor: "end",
					fontPx: theme.font.size.medium
				})
			} else {
				const heightLabelX = v3.x + 10
				canvas.drawText({
					x: heightLabelX,
					y: heightLabelY,
					text: heightLabel,
					anchor: "start",
					fontPx: theme.font.size.medium
				})
			}
		}
	} else if (shape.type === "trapezoidRight") {
		// Right trapezoid - left side is perpendicular
		const { topBase, bottomBase, height: h, labels } = shape

		const scaledTop = topBase * scale
		const scaledBottom = bottomBase * scale
		const scaledH = h * scale

		// Center the shape
		const xOffset = centerX - scaledBottom / 2
		const yOffset = centerY - scaledH / 2

		const vertices = [
			{ x: xOffset, y: yOffset + scaledH }, // 0: Bottom-left
			{ x: xOffset + scaledBottom, y: yOffset + scaledH }, // 1: Bottom-right
			{ x: xOffset + scaledTop, y: yOffset }, // 2: Top-right
			{ x: xOffset, y: yOffset }, // 3: Top-left
			{ x: xOffset, y: yOffset + scaledH } // 4: Point for left height
		]

		// Draw outer boundary polygon
		const outerPoints = [
			vertices[0],
			vertices[1],
			vertices[2],
			vertices[3]
		].filter((p) => p !== undefined)
		canvas.drawPolygon(outerPoints, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})

		// Draw height line (dashed)
		const v3t = vertices[3]
		const v4t = vertices[4]
		if (v3t && v4t) {
			canvas.drawLine(v3t.x, v3t.y, v4t.x, v4t.y, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				dash: theme.stroke.dasharray.dashedShort
			})
		}

		// Draw right angle marker
		const markerSize = 10
		if (v4t) {
			const markerPath = new Path2D()
				.moveTo(v4t.x, v4t.y - markerSize)
				.lineTo(v4t.x + markerSize, v4t.y - markerSize)
				.lineTo(v4t.x + markerSize, v4t.y)
			canvas.drawPath(markerPath, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base
			})
		}

		const rightOffset = scaledBottom - scaledTop

		// Draw labels only when provided
		// Bottom base label
		const bottomLabel = labelToString(labels.bottomBase)
		if (bottomLabel !== undefined) {
			const bottomLabelX = xOffset + scaledBottom / 2
			const bottomLabelY = yOffset + scaledH + 20
			canvas.drawText({
				x: bottomLabelX,
				y: bottomLabelY,
				text: bottomLabel,
				anchor: "middle",
				fontPx: theme.font.size.medium
			})
		}

		// Right side label
		const rightLabel = labelToString(labels.rightSide)
		if (rightLabel !== undefined) {
			const rightLabelX = xOffset + scaledBottom - rightOffset / 2
			const rightLabelY = yOffset + scaledH / 2
			canvas.drawText({
				x: rightLabelX + 20,
				y: rightLabelY,
				text: rightLabel,
				anchor: "start",
				fontPx: theme.font.size.medium
			})
		}

		// Top base label
		const topLabel = labelToString(labels.topBase)
		if (topLabel !== undefined) {
			const topLabelX = xOffset + scaledTop / 2
			const topLabelY = yOffset - 10
			canvas.drawText({
				x: topLabelX,
				y: topLabelY,
				text: topLabel,
				anchor: "middle",
				fontPx: theme.font.size.medium
			})
		}

		// Left side labeling: for right trapezoids, height equals left side.
		// Prefer height label if present; otherwise use leftSide. Draw only once.
		let resolvedLeftLabel: string | undefined
		const heightLabelLeft = labelToString(labels.height)
		if (heightLabelLeft !== undefined) {
			resolvedLeftLabel = heightLabelLeft
		} else {
			const leftSideLabel = labelToString(labels.leftSide)
			if (leftSideLabel !== undefined) {
				resolvedLeftLabel = leftSideLabel
			}
		}
		if (resolvedLeftLabel !== undefined) {
			const leftLabelX = xOffset - 15
			const leftLabelY = yOffset + scaledH / 2
			canvas.drawText({
				x: leftLabelX,
				y: leftLabelY,
				text: resolvedLeftLabel,
				anchor: "end",
				fontPx: theme.font.size.medium
			})
		}
	} else {
		// shape.type === "trapezoid" - general trapezoid with both sides slanted
		const { topBase, bottomBase, height: h, leftSideLength, labels } = shape

		const scaledTop = topBase * scale
		const scaledBottom = bottomBase * scale
		const scaledH = h * scale
		const scaledLeft = leftSideLength * scale

		if (scaledLeft < scaledH) {
			logger.error("invalid trapezoid dimensions", {
				leftSideLength: scaledLeft,
				height: scaledH
			})
			throw errors.new("left side length cannot be less than height")
		}

		const leftOffset = Math.sqrt(scaledLeft * scaledLeft - scaledH * scaledH)

		// Center the shape
		const shapeActualWidth = Math.max(scaledBottom, leftOffset + scaledTop)
		const xOffset = centerX - shapeActualWidth / 2
		const yOffset = centerY - scaledH / 2

		const vertices = [
			{ x: xOffset, y: yOffset + scaledH }, // 0: Bottom-left
			{ x: xOffset + scaledBottom, y: yOffset + scaledH }, // 1: Bottom-right
			{ x: xOffset + leftOffset + scaledTop, y: yOffset }, // 2: Top-right
			{ x: xOffset + leftOffset, y: yOffset }, // 3: Top-left
			{ x: xOffset + leftOffset, y: yOffset + scaledH } // 4: Point for left height
		]

		// Draw outer boundary polygon
		const outerPoints = [
			vertices[0],
			vertices[1],
			vertices[2],
			vertices[3]
		].filter((p) => p !== undefined)
		canvas.drawPolygon(outerPoints, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})

		// Draw height line (dashed)
		const v3g = vertices[3]
		const v4g = vertices[4]
		if (v3g && v4g) {
			canvas.drawLine(v3g.x, v3g.y, v4g.x, v4g.y, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				dash: theme.stroke.dasharray.dashedShort
			})
		}

		// Draw right angle marker
		const markerSize = 10
		if (v4g) {
			const markerPath = new Path2D()
				.moveTo(v4g.x - markerSize, v4g.y)
				.lineTo(v4g.x - markerSize, v4g.y - markerSize)
				.lineTo(v4g.x, v4g.y - markerSize)
			canvas.drawPath(markerPath, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base
			})
		}

		const rightOffset = scaledBottom - (leftOffset + scaledTop)

		// Draw labels only when provided
		// Bottom base label
		const bottomLabel = labelToString(labels.bottomBase)
		if (bottomLabel !== undefined) {
			const bottomLabelX = xOffset + scaledBottom / 2
			const bottomLabelY = yOffset + scaledH + 20
			canvas.drawText({
				x: bottomLabelX,
				y: bottomLabelY,
				text: bottomLabel,
				anchor: "middle",
				fontPx: theme.font.size.medium
			})
		}

		// Right side label
		const rightLabel = labelToString(labels.rightSide)
		if (rightLabel !== undefined) {
			const rightLabelX = xOffset + scaledBottom - rightOffset / 2
			const rightLabelY = yOffset + scaledH / 2
			canvas.drawText({
				x: rightLabelX + 20,
				y: rightLabelY,
				text: rightLabel,
				anchor: "start",
				fontPx: theme.font.size.medium
			})
		}

		// Top base label
		const topLabel = labelToString(labels.topBase)
		if (topLabel !== undefined) {
			const topLabelX = xOffset + leftOffset + scaledTop / 2
			const topLabelY = yOffset - 10
			canvas.drawText({
				x: topLabelX,
				y: topLabelY,
				text: topLabel,
				anchor: "middle",
				fontPx: theme.font.size.medium
			})
		}

		// Left side label
		const leftLabel = labelToString(labels.leftSide)
		if (leftLabel !== undefined) {
			const leftLabelX = xOffset + leftOffset / 2
			const leftLabelY = yOffset + scaledH / 2
			canvas.drawText({
				x: leftLabelX - 20,
				y: leftLabelY,
				text: leftLabel,
				anchor: "end",
				fontPx: theme.font.size.medium
			})
		}

		// Height label
		const heightLabel3 = labelToString(labels.height)
		if (heightLabel3 !== undefined && v3g && v4g) {
			const heightLabelX = v3g.x + (v4g.x - v3g.x) / 2 - 10
			const heightLabelY = v3g.y + (v4g.y - v3g.y) / 2
			canvas.drawText({
				x: heightLabelX,
				y: heightLabelY,
				text: heightLabel3,
				anchor: "end",
				fontPx: theme.font.size.medium
			})
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
