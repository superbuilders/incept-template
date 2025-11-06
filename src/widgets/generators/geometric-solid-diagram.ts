import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"
import { theme } from "@/widgets/utils/theme"

// Factory functions for label schemas to avoid $ref in OpenAI JSON Schema
const createRadiusLabelSchema = () =>
	z
		.string()
		.nullable()
		.describe(
			"Nullable radius label text (e.g., 'r = 5', '10 cm', 'd = 10'). Can include units, equations, or simple values."
		)

const createHeightLabelSchema = () =>
	z
		.string()
		.nullable()
		.describe(
			"Nullable height label text (e.g., 'h = 8', '6 cm'). Can include units, equations, or simple values."
		)

const Cylinder = z
	.object({
		type: z
			.literal("cylinder")
			.describe("Specifies a circular cylinder shape."),
		radiusLabel: createRadiusLabelSchema(),
		heightLabel: createHeightLabelSchema()
	})
	.strict()

const Cone = z
	.object({
		type: z.literal("cone").describe("Specifies a circular cone shape."),
		radiusLabel: createRadiusLabelSchema(),
		heightLabel: createHeightLabelSchema()
	})
	.strict()

const Sphere = z
	.object({
		type: z.literal("sphere").describe("Specifies a perfect sphere shape."),
		radiusLabel: createRadiusLabelSchema()
	})
	.strict()

export const GeometricSolidDiagramPropsSchema = z
	.object({
		type: z
			.literal("geometricSolidDiagram")
			.describe(
				"Identifies this as a geometric solid diagram showing 3D shapes with dimension labels."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		shape: z
			.discriminatedUnion("type", [Cylinder, Cone, Sphere])
			.describe("The 3D geometric solid to display with its dimension labels.")
	})
	.strict()
	.describe(
		"Creates 3D geometric solids (cylinder, cone, sphere) with optional dimension labels. Uses isometric-style projection to show depth. Essential for teaching volume, surface area, and 3D geometry concepts. Labels help identify key measurements for calculations."
	)

export type GeometricSolidDiagramProps = z.infer<
	typeof GeometricSolidDiagramPropsSchema
>

/**
 * Generates a 3D diagram of a geometric solid with curved surfaces (e.g., cylinder, cone).
 * Supports dimension labels for volume and surface area problems.
 */
export const generateGeometricSolidDiagram: WidgetGenerator<
	typeof GeometricSolidDiagramPropsSchema
> = async (data) => {
	const { width, height, shape } = data

	// --- NEW SCALING AND DRAWING LOGIC ---

	const labelSpace = 40 // Extra space for external labels if needed

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	canvas.addDef(
		`<marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.colors.black}" /></marker>`
	)

	const availableWidth = width - 2 * PADDING - labelSpace
	const availableHeight = height - 2 * PADDING - labelSpace

	if (shape.type === "cylinder") {
		const radius = 5 // default radius
		const shapeHeight = 6 // default height
		let scale = Math.min(
			availableWidth / (radius * 2),
			availableHeight / shapeHeight
		)
		let r = radius * scale
		let h = shapeHeight * scale
		let ry = r * 0.25 // Ellipse perspective ratio

		// Auto-scale boost if rendered content is too small relative to available area
		{
			const contentWidth = 2 * r
			const contentHeight = h + ry
			const availableMin = Math.max(
				1,
				Math.min(availableWidth, availableHeight)
			)
			const occupancy = Math.min(contentWidth, contentHeight) / availableMin
			const targetOccupancy = 0.7
			if (occupancy > 0 && occupancy < targetOccupancy) {
				const boost = targetOccupancy / occupancy
				scale *= boost
				r = radius * scale
				h = shapeHeight * scale
				ry = r * 0.25
			}
		}

		const cx = width / 2
		const topY = (height - h) / 2
		const bottomY = topY + h

		// Canvas automatically tracks extents

		// Side lines
		canvas.drawLine(cx - r, topY, cx - r, bottomY, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})
		canvas.drawLine(cx + r, topY, cx + r, bottomY, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})

		// Bottom base (draw back dashed part first, then front solid part)
		const bottomBackPath = new Path2D()
			.moveTo(cx - r, bottomY)
			.arcTo(r, ry, 0, 0, 0, cx + r, bottomY)
		canvas.drawPath(bottomBackPath, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			dash: theme.stroke.dasharray.dashed
		})
		const bottomFrontPath = new Path2D()
			.moveTo(cx - r, bottomY)
			.arcTo(r, ry, 0, 0, 1, cx + r, bottomY)
		canvas.drawPath(bottomFrontPath, {
			fill: "rgba(200, 200, 200, 0.2)",
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})

		// Top base
		canvas.drawEllipse(cx, topY, r, ry, {
			fill: "rgba(220, 220, 220, 0.4)",
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})

		if (shape.radiusLabel) {
			// Dashed line for radius on the bottom base
			canvas.drawLine(cx, bottomY, cx + r, bottomY, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				dash: theme.stroke.dasharray.backEdge
			})
			const textY = Math.min(bottomY + 18, height - 10) // Ensure text stays within bounds
			canvas.drawText({
				x: cx + r / 2,
				y: textY,
				text: shape.radiusLabel,
				anchor: "middle",
				fontPx: theme.font.size.base
			})
		}
		if (shape.heightLabel) {
			// External line with arrows for height - positioned with adequate spacing
			const lineX = cx + r + 10 // Fixed distance from cylinder edge
			canvas.drawLine(lineX, topY, lineX, bottomY, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				markerStart: "url(#arrow)",
				markerEnd: "url(#arrow)"
			})
			canvas.drawText({
				x: lineX + 10,
				y: height / 2,
				text: shape.heightLabel,
				anchor: "start",
				fontPx: theme.font.size.base
			})
		}
	} else if (shape.type === "cone") {
		const radius = 4 // default radius
		const shapeHeight = 6 // default height
		let scale = Math.min(
			availableWidth / (radius * 2),
			availableHeight / shapeHeight
		)
		let r = radius * scale
		let h = shapeHeight * scale
		let ry = r * 0.25 // Ellipse perspective ratio

		// Auto-scale boost if rendered content is too small relative to available area
		{
			const contentWidth = 2 * r
			const contentHeight = h + ry
			const availableMin = Math.max(
				1,
				Math.min(availableWidth, availableHeight)
			)
			const occupancy = Math.min(contentWidth, contentHeight) / availableMin
			const targetOccupancy = 0.7
			if (occupancy > 0 && occupancy < targetOccupancy) {
				const boost = targetOccupancy / occupancy
				scale *= boost
				r = radius * scale
				h = shapeHeight * scale
				ry = r * 0.25
			}
		}

		const cx = width / 2
		const apexY = (height - h) / 2
		const baseY = apexY + h

		// Canvas automatically tracks extents

		// Generator lines
		canvas.drawLine(cx - r, baseY, cx, apexY, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})
		canvas.drawLine(cx + r, baseY, cx, apexY, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})

		// Base (draw back dashed part first, then front solid part)
		const baseBackPath = new Path2D()
			.moveTo(cx - r, baseY)
			.arcTo(r, ry, 0, 0, 0, cx + r, baseY)
		canvas.drawPath(baseBackPath, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick,
			dash: theme.stroke.dasharray.dashed
		})
		const baseFrontPath = new Path2D()
			.moveTo(cx - r, baseY)
			.arcTo(r, ry, 0, 0, 1, cx + r, baseY)
		canvas.drawPath(baseFrontPath, {
			fill: "rgba(200, 200, 200, 0.2)",
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})

		if (shape.radiusLabel) {
			// Dashed line from center to right for radius
			canvas.drawLine(cx, baseY, cx + r, baseY, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				dash: theme.stroke.dasharray.backEdge
			})
			const textY = Math.min(baseY + 18, height - 10) // Ensure text stays within bounds
			canvas.drawText({
				x: cx + r / 2,
				y: textY,
				text: shape.radiusLabel,
				anchor: "middle",
				fontPx: theme.font.size.base
			})
		}
		if (shape.heightLabel) {
			// Dashed line from apex to center for height
			canvas.drawLine(cx, apexY, cx, baseY, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				dash: theme.stroke.dasharray.backEdge
			})
			// Right angle indicator
			const indicatorSize = Math.min(10, r * 0.2)
			const indicatorPath = new Path2D()
				.moveTo(cx + indicatorSize, baseY)
				.lineTo(cx + indicatorSize, baseY - indicatorSize)
				.lineTo(cx, baseY - indicatorSize)
			canvas.drawPath(indicatorPath, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.thin
			})
			canvas.drawText({
				x: cx - 10,
				y: height / 2,
				text: shape.heightLabel,
				anchor: "end",
				fontPx: theme.font.size.base
			})
		}
	} else if (shape.type === "sphere") {
		const radius = 5 // default radius
		let scale = Math.min(
			availableWidth / (radius * 2),
			availableHeight / (radius * 2)
		)
		let r = radius * scale
		let ry = r * 0.3 // Ellipse perspective ratio for equator

		// Auto-scale boost if rendered content is too small relative to available area
		{
			const contentWidth = 2 * r
			const contentHeight = 2 * r
			const availableMin = Math.max(
				1,
				Math.min(availableWidth, availableHeight)
			)
			const occupancy = Math.min(contentWidth, contentHeight) / availableMin
			const targetOccupancy = 0.7
			if (occupancy > 0 && occupancy < targetOccupancy) {
				const boost = targetOccupancy / occupancy
				scale *= boost
				r = radius * scale
				ry = r * 0.3
			}
		}

		const cx = width / 2
		const cy = height / 2

		// Canvas automatically tracks extents

		// Main sphere outline
		canvas.drawEllipse(cx, cy, r, r, {
			fill: "rgba(220, 220, 220, 0.4)",
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})

		// Internal equator for 3D effect (dashed back, solid front)
		const equatorBackPath = new Path2D()
			.moveTo(cx - r, cy)
			.arcTo(r, ry, 0, 0, 0, cx + r, cy)
		canvas.drawPath(equatorBackPath, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.base,
			dash: theme.stroke.dasharray.dashed
		})
		const equatorFrontPath = new Path2D()
			.moveTo(cx - r, cy)
			.arcTo(r, ry, 0, 0, 1, cx + r, cy)
		canvas.drawPath(equatorFrontPath, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.base
		})

		if (shape.radiusLabel) {
			// Dashed line from center to circumference for radius
			canvas.drawLine(cx, cy, cx + r, cy, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				dash: theme.stroke.dasharray.backEdge
			})

			// Place label centered above the dashed radius with a minimal non-overlapping gap
			const fontPx = theme.font.size.base
			const dims = estimateWrappedTextDimensions(
				shape.radiusLabel,
				Number.POSITIVE_INFINITY,
				fontPx,
				1.2
			)
			const minGap = theme.stroke.width.base + 2
			const labelX = cx + r / 2
			const labelY = cy - (dims.height / 2 + minGap)

			canvas.drawText({
				x: labelX,
				y: labelY,
				text: shape.radiusLabel,
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx
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

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.medium}">${svgBody}</svg>`
}
