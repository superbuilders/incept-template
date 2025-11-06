import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const ErrInvalidDimensions = errors.new("invalid frame dimensions")

const DimensionLabel = z
	.object({
		text: z
			.string()
			.describe(
				"The measurement or label text (e.g., '10 cm', '5 m', 'length', 'Area = 50 cm²'). Can include units and mathematical expressions."
			),
		target: z
			.string()
			.describe(
				"Which dimension or face to label: 'height', 'width', 'length', 'thickness', 'top_face', 'front_face', 'side_face', 'bottom_face', 'back_face', 'inner_face'."
			)
	})
	.strict()

const Diagonal = z
	.object({
		fromVertexIndex: z
			.number()
			.int()
			.describe(
				"Starting vertex index (0-based) for the diagonal. Vertices numbered 0-7: outer corners first (0-3), then inner corners (4-7)."
			),
		toVertexIndex: z
			.number()
			.int()
			.describe(
				"Ending vertex index (0-based) for the diagonal. Must be different from fromVertexIndex. Can connect any two vertices."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label for the diagonal's length (e.g., '15 cm', 'd = 13', '√50', null). Null means no label. Positioned at midpoint."
			),
		style: z
			.enum(["solid", "dashed", "dotted"])
			.describe(
				"Visual style of the diagonal line. 'solid' for main diagonals, 'dashed' for auxiliary lines, 'dotted' for reference lines."
			)
	})
	.strict()

export const RectangularFrameDiagramPropsSchema = z
	.object({
		type: z
			.literal("rectangularFrameDiagram")
			.describe(
				"Identifies this as a 3D rectangular frame (hollow box) diagram."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		outerLength: z
			.number()
			.describe(
				"Outer depth/length of the frame in units (e.g., 10, 8, 12.5). The z-axis dimension extending into the page."
			),
		outerWidth: z
			.number()
			.describe(
				"Outer width of the frame in units (e.g., 6, 10, 7.5). The horizontal dimension across the front face."
			),
		outerHeight: z
			.number()
			.describe(
				"Outer height of the frame in units (e.g., 4, 8, 5). The vertical dimension of the frame."
			),
		thickness: z
			.number()
			.describe(
				"Wall thickness of the hollow frame in units (e.g., 0.5, 1, 2). Subtracts from outer dimensions to create inner cavity."
			),
		labels: z
			.array(DimensionLabel)
			.describe(
				"Labels for edges and faces. Empty array means no labels. Can label dimensions, areas, or custom text on specific parts."
			),
		diagonals: z
			.array(Diagonal)
			.describe(
				"Internal diagonal lines between vertices. Empty array means no diagonals. Useful for showing space diagonals or cross-sections."
			),
		shadedFace: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Face identifier to shade/highlight: 'top_face', 'side_face', 'front_face', 'bottom_face', or null. Null means no shading."
			),
		showHiddenEdges: z
			.boolean()
			.describe(
				"Whether to show edges hidden behind the frame as dashed lines. True for mathematical clarity, false for realistic view."
			)
	})
	.strict()
	.describe(
		"Creates a 3D hollow rectangular frame (box with walls) in isometric projection. Shows inner and outer dimensions with wall thickness. Perfect for volume problems involving hollow objects, surface area of boxes with cavities, or structural engineering concepts. Supports face shading and space diagonals."
	)

export type RectangularFrameDiagramProps = z.infer<
	typeof RectangularFrameDiagramPropsSchema
>

/**
 * This template generates SVG diagrams of three-dimensional hollow rectangular frames
 * (like picture frames with depth). It renders the frame in an isometric view to provide
 * depth perception.
 */
export const generateRectangularFrameDiagram: WidgetGenerator<
	typeof RectangularFrameDiagramPropsSchema
> = async (data) => {
	const {
		width,
		height,
		outerLength,
		outerWidth,
		outerHeight,
		thickness,
		labels,
		diagonals,
		shadedFace,
		showHiddenEdges
	} = data

	if (width <= 0 || height <= 0) {
		logger.error("invalid frame dimensions", { width, height })
		throw errors.wrap(
			ErrInvalidDimensions,
			`width: ${width}, height: ${height}`
		)
	}

	if (
		thickness <= 0 ||
		thickness >= Math.min(outerLength, outerWidth, outerHeight)
	) {
		logger.error("invalid frame thickness", {
			thickness,
			outerLength,
			outerWidth,
			outerHeight,
			minDimension: Math.min(outerLength, outerWidth, outerHeight)
		})
		throw errors.wrap(
			ErrInvalidDimensions,
			`thickness: ${thickness} must be positive and less than all outer dimensions`
		)
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Scale based on the provided dimensions, similar to Khan Academy approach
	const boxWidth = outerWidth * 25
	const boxHeight = outerHeight * 25
	const boxDepth = outerLength * 20

	// Center the box in the viewBox
	const offsetX = (width - boxWidth - boxDepth) / 2
	const offsetY = (height - boxHeight + boxDepth) / 2

	// Front face coordinates (bottom-left origin)
	const frontLeft = offsetX
	const frontRight = offsetX + boxWidth
	const frontBottom = offsetY + boxHeight
	const frontTop = offsetY

	// Back face coordinates (perspective offset)
	const backLeft = frontLeft + boxDepth
	const backRight = frontRight + boxDepth
	const backBottom = frontBottom - boxDepth * 0.5
	const backTop = frontTop - boxDepth * 0.5

	// Canvas automatically tracks extents

	// Khan Academy style: Use efficient SVG path commands with single paths containing multiple shapes
	// Front face outline (main rectangular face) - exactly like Khan Academy
	const frontOutlinePath = new Path2D()
	frontOutlinePath.moveTo(frontLeft, frontBottom)
	frontOutlinePath.lineTo(frontLeft + boxWidth, frontBottom)
	frontOutlinePath.moveTo(frontRight, frontBottom)
	frontOutlinePath.lineTo(frontRight, frontTop)
	frontOutlinePath.moveTo(frontRight, frontTop)
	frontOutlinePath.lineTo(frontLeft, frontTop)
	frontOutlinePath.moveTo(frontLeft, frontTop)
	frontOutlinePath.lineTo(frontLeft, frontTop + boxHeight)
	canvas.drawPath(frontOutlinePath, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick
	})

	// Hidden back edges (dashed if enabled) - combined like Khan Academy
	if (showHiddenEdges) {
		const backEdgePath = new Path2D()
		backEdgePath.moveTo(backLeft, backBottom)
		backEdgePath.lineTo(backLeft + boxWidth, backBottom)
		canvas.drawPath(backEdgePath, {
			stroke: theme.colors.black,
			dash: theme.stroke.dasharray.backEdge
		})
		const backVerticalPath = new Path2D()
		backVerticalPath.moveTo(backRight, backBottom)
		backVerticalPath.lineTo(backRight, backTop)
		backVerticalPath.moveTo(backRight, backTop)
		backVerticalPath.lineTo(backLeft, backTop)
		canvas.drawPath(backVerticalPath, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})
		const backDiagonalPath = new Path2D()
		backDiagonalPath.moveTo(backLeft, backTop)
		backDiagonalPath.lineTo(backLeft, backTop + boxHeight)
		backDiagonalPath.moveTo(frontLeft, frontBottom)
		backDiagonalPath.lineTo(frontLeft + boxDepth, frontBottom - boxDepth * 0.5)
		canvas.drawPath(backDiagonalPath, {
			stroke: theme.colors.black,
			dash: theme.stroke.dasharray.backEdge
		})
	}

	// Visible connecting edges (front to back) - combined into single path like Khan Academy
	const connectingEdgesPath = new Path2D()
	connectingEdgesPath.moveTo(frontLeft, frontTop)
	connectingEdgesPath.lineTo(frontLeft + boxDepth, frontTop - boxDepth * 0.5)
	connectingEdgesPath.moveTo(frontRight, frontBottom)
	connectingEdgesPath.lineTo(
		frontRight + boxDepth,
		frontBottom - boxDepth * 0.5
	)
	connectingEdgesPath.moveTo(frontRight, frontTop)
	connectingEdgesPath.lineTo(frontRight + boxDepth, frontTop - boxDepth * 0.5)
	canvas.drawPath(connectingEdgesPath, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick
	})

	// Face fills - Khan Academy approach: simple solid shapes, not hollow frames
	const purpleColor = theme.colors.highlightPrimary
	const grayColor = theme.colors.border

	// Front face fill (if shaded)
	if (shadedFace === "front_face") {
		const frontFaceFillPath = new Path2D()
		frontFaceFillPath.moveTo(frontLeft, frontBottom)
		frontFaceFillPath.lineTo(frontLeft, frontTop)
		frontFaceFillPath.lineTo(frontLeft + boxWidth, frontTop)
		frontFaceFillPath.lineTo(frontLeft + boxWidth, frontTop + boxHeight)
		frontFaceFillPath.closePath()
		canvas.drawPath(frontFaceFillPath, {
			fill: purpleColor,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			fillOpacity: theme.opacity.overlayLow
		})
	}

	// Combined faces in single paths like Khan Academy - this matches their exact approach
	// Left side face + Top face combined into single path element
	const leftSidePath = new Path2D()
	leftSidePath.moveTo(frontLeft, frontBottom)
	leftSidePath.lineTo(frontLeft, frontTop)
	leftSidePath.lineTo(frontLeft + boxDepth, frontTop - boxDepth * 0.5)
	leftSidePath.lineTo(
		frontLeft + boxDepth,
		frontTop - boxDepth * 0.5 + boxHeight
	)
	leftSidePath.closePath()

	const topFacePath = new Path2D()
	topFacePath.moveTo(backLeft, backTop)
	topFacePath.lineTo(backLeft, backTop + boxHeight)
	topFacePath.lineTo(backLeft + boxWidth, backTop + boxHeight)
	topFacePath.lineTo(backLeft + boxWidth, backTop)
	topFacePath.closePath()

	const rightSidePath = new Path2D()
	rightSidePath.moveTo(frontRight, frontBottom)
	rightSidePath.lineTo(frontRight, frontTop)
	rightSidePath.lineTo(frontRight + boxDepth, frontTop - boxDepth * 0.5)
	rightSidePath.lineTo(
		frontRight + boxDepth,
		frontTop - boxDepth * 0.5 + boxHeight
	)
	rightSidePath.closePath()

	// Combine left side and top face into single path like Khan Academy does
	const combinedSideTopPath = new Path2D()
	combinedSideTopPath.moveTo(frontLeft, frontBottom)
	combinedSideTopPath.lineTo(frontLeft, frontTop)
	combinedSideTopPath.lineTo(frontLeft + boxDepth, frontTop - boxDepth * 0.5)
	combinedSideTopPath.lineTo(
		frontLeft + boxDepth,
		frontTop - boxDepth * 0.5 + boxHeight
	)
	combinedSideTopPath.closePath()
	combinedSideTopPath.moveTo(backLeft, backTop)
	combinedSideTopPath.lineTo(backLeft, backTop + boxHeight)
	combinedSideTopPath.lineTo(backLeft + boxWidth, backTop + boxHeight)
	combinedSideTopPath.lineTo(backLeft + boxWidth, backTop)
	combinedSideTopPath.closePath()

	if (shadedFace === "side_face") {
		canvas.drawPath(leftSidePath, {
			fill: purpleColor,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			fillOpacity: theme.opacity.overlayLow
		})
		canvas.drawPath(topFacePath, {
			fill: grayColor,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			fillOpacity: theme.opacity.overlayLow
		})
	} else if (shadedFace === "top_face") {
		canvas.drawPath(leftSidePath, {
			fill: grayColor,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			fillOpacity: theme.opacity.overlayLow
		})
		canvas.drawPath(topFacePath, {
			fill: purpleColor,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			fillOpacity: theme.opacity.overlayLow
		})
	} else if (shadedFace !== "") {
		// Default: both faces gray, combined like Khan Academy
		canvas.drawPath(combinedSideTopPath, {
			fill: grayColor,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			fillOpacity: theme.opacity.overlayLow
		})
	}

	// Right side face
	if (shadedFace === "bottom_face") {
		canvas.drawPath(rightSidePath, {
			fill: purpleColor,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			fillOpacity: theme.opacity.overlayLow
		})
	} else if (shadedFace !== "") {
		canvas.drawPath(rightSidePath, {
			fill: grayColor,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			fillOpacity: theme.opacity.overlayLow
		})
	}

	// Render diagonals if any exist
	if (diagonals.length > 0) {
		// Define the 8 vertices of the box for diagonal calculations
		const vertices = [
			{ x: frontLeft, y: frontBottom }, // 0: front bottom left
			{ x: frontRight, y: frontBottom }, // 1: front bottom right
			{ x: frontRight, y: frontTop }, // 2: front top right
			{ x: frontLeft, y: frontTop }, // 3: front top left
			{ x: backLeft, y: backBottom }, // 4: back bottom left
			{ x: backRight, y: backBottom }, // 5: back bottom right
			{ x: backRight, y: backTop }, // 6: back top right
			{ x: backLeft, y: backTop } // 7: back top left
		]

		for (const d of diagonals) {
			const from = vertices[d.fromVertexIndex]
			const to = vertices[d.toVertexIndex]
			if (!from || !to) continue

			let strokeDashArray = ""
			if (d.style === "dashed") {
				strokeDashArray = ' stroke-dasharray="4 2"'
			} else if (d.style === "dotted") {
				strokeDashArray = ' stroke-dasharray="2 3"'
			}

			canvas.drawLine(from.x, from.y, to.x, to.y, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.thick,
				dash: strokeDashArray
					.replace(' stroke-dasharray="', "")
					.replace('"', "")
			})

			if (d.label) {
				const midX = (from.x + to.x) / 2
				const midY = (from.y + to.y) / 2
				canvas.drawText({
					x: midX,
					y: midY,
					text: d.label,
					anchor: "middle",
					fontPx: theme.font.size.base
				})
			}
		}
	}

	// Labels for dimensions
	if (labels.length > 0) {
		for (const lab of labels) {
			if (lab.target === "height") {
				const textX = frontLeft - 15
				const textY = frontTop + boxHeight / 2
				canvas.drawText({
					x: textX,
					y: textY,
					text: lab.text,
					anchor: "end",
					fontPx: theme.font.size.base
				})
			}
			if (lab.target === "width") {
				const textX = frontLeft + boxWidth / 2
				const textY = frontBottom + 20
				canvas.drawText({
					x: textX,
					y: textY,
					text: lab.text,
					anchor: "middle",
					fontPx: theme.font.size.base
				})
			}
			if (lab.target === "length") {
				const textX = frontRight + boxDepth / 2
				const textY = frontBottom - boxDepth * 0.25
				canvas.drawText({
					x: textX,
					y: textY,
					text: lab.text,
					anchor: "middle",
					fontPx: theme.font.size.base
				})
			}
			if (lab.target === "thickness") {
				const textX = frontLeft + 10
				const textY = frontBottom + 15
				canvas.drawText({
					x: textX,
					y: textY,
					text: lab.text,
					anchor: "start",
					fontPx: theme.font.size.small
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

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
