import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import {
	createAxisOptionsSchema,
	createLineSchema,
	createPlotPointSchema,
	renderLines,
	renderPoints
} from "@/widgets/utils/canvas-utils"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneV2 } from "@/widgets/utils/coordinate-plane-v2"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const ErrInvalidPolygon = errors.new(
	"polygon must have at least 3 vertices"
)

const createVertexSchema = () =>
	z
		.object({
			x: z
				.number()
				.describe(
					"X-coordinate of the vertex in the coordinate plane (e.g., -3, 0, 5, 2.5). Can be any real number within axis bounds."
				),
			y: z
				.number()
				.describe(
					"Y-coordinate of the vertex in the coordinate plane (e.g., 4, -2, 0, 3.5). Can be any real number within axis bounds."
				)
		})
		.strict()

const VertexSchema = createVertexSchema()
type Vertex = z.infer<typeof VertexSchema>

const createPolygonObjectSchema = () =>
	z
		.object({
			vertices: z
				.array(createVertexSchema())
				.describe(
					"Ordered array of vertices defining the polygon. Connect in sequence, closing back to first. Minimum 3 vertices for valid polygon. Order affects appearance."
				),
			color: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
				)
				.describe(
					"CSS fill color for the polygon (e.g., '#4472C4' for blue, 'rgba(255,0,0,0.3)' for translucent red, 'lightgreen'). Use alpha for transparency."
				),
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
				.describe(
					"Text label for the shape (e.g., 'A', 'Original', 'Pre-image', null). Null means no label. Positioned at shape's centroid."
				)
		})
		.strict()

// Note: Schema factory created but not exported - used inline in ShapeTransformationGraphPropsSchema

const createTransformationRuleSchema = () =>
	z.discriminatedUnion("type", [
		z
			.object({
				type: z
					.literal("translation")
					.describe(
						"Slide transformation moving all points by a fixed vector."
					),
				vector: z
					.object({
						x: z
							.number()
							.describe(
								"Horizontal translation distance. Positive moves right, negative moves left (e.g., 5, -3, 0)."
							),
						y: z
							.number()
							.describe(
								"Vertical translation distance. Positive moves up, negative moves down (e.g., -2, 4, 0)."
							)
					})
					.strict()
					.describe("The displacement vector for the translation.")
			})
			.strict(),
		z
			.object({
				type: z
					.literal("reflection")
					.describe("Flip transformation across an axis."),
				axis: z
					.enum(["x", "y"])
					.describe(
						"The axis of reflection. 'x' reflects across x-axis (horizontal), 'y' reflects across y-axis (vertical)."
					)
			})
			.strict(),
		z
			.object({
				type: z
					.literal("rotation")
					.describe("Turn transformation around a fixed point."),
				center: createVertexSchema().describe(
					"The center point of rotation. Shape rotates around this point, which remains fixed."
				),
				angle: z
					.number()
					.describe(
						"Rotation angle in degrees. Positive is counter-clockwise, negative is clockwise (e.g., 90, -45, 180, 270)."
					)
			})
			.strict(),
		z
			.object({
				type: z
					.literal("dilation")
					.describe("Scaling transformation from a center point."),
				center: createVertexSchema().describe(
					"The center of dilation. Points move toward (scale < 1) or away from (scale > 1) this point."
				),
				scaleFactor: z
					.number()
					.describe(
						"The scaling factor. Values > 1 enlarge, 0 < values < 1 shrink, negative values enlarge and flip (e.g., 2, 0.5, -1, 3)."
					)
			})
			.strict()
	])

// Note: Schema factory created but not exported - used inline in ShapeTransformationGraphPropsSchema

export const ShapeTransformationGraphPropsSchema = z
	.object({
		type: z
			.literal("shapeTransformationGraph")
			.describe(
				"Identifies this as a shape transformation graph showing geometric transformations on a coordinate plane."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		xAxis: createAxisOptionsSchema().describe(
			"Configuration for the horizontal axis including range, ticks, and grid. Should encompass both pre-image and image."
		),
		yAxis: createAxisOptionsSchema().describe(
			"Configuration for the vertical axis including range, ticks, and grid. Should encompass both pre-image and image."
		),
		showQuadrantLabels: z
			.boolean()
			.describe(
				"Whether to display Roman numerals (I, II, III, IV) in quadrants. Helps identify shape positions and transformation effects."
			),
		preImage: createPolygonObjectSchema().describe(
			"The original shape before transformation. Usually shown in a distinct color. This is the shape that gets transformed."
		),
		transformation: createTransformationRuleSchema().describe(
			"The geometric transformation to apply. The system automatically calculates and displays the resulting image shape."
		),
		points: z
			.array(createPlotPointSchema())
			.describe(
				"Additional points to plot (e.g., center of rotation, reference points). Empty array means no extra points. Useful for marking key locations."
			),
		lines: z
			.array(createLineSchema())
			.nullable()
			.describe(
				"List of lines defined by equations (slope-intercept, standard, or point-slope). Lines are clipped to the plane extents."
			)
	})
	.strict()
	.describe(
		"Displays geometric transformations on a coordinate plane, showing both the original shape (pre-image) and the transformed shape (image). Supports translations, reflections, rotations, and dilations. Essential for teaching transformation geometry, symmetry, and coordinate geometry concepts."
	)

export type ShapeTransformationGraphProps = z.infer<
	typeof ShapeTransformationGraphPropsSchema
>

export const generateShapeTransformationGraph: WidgetGenerator<
	typeof ShapeTransformationGraphPropsSchema
> = async (props) => {
	const {
		width,
		height,
		xAxis,
		yAxis,
		showQuadrantLabels,
		preImage,
		transformation,
		points,
		lines
	} = props

	// Validate polygon has at least 3 vertices
	if (preImage.vertices.length < 3) {
		logger.error("shape transformation invalid polygon", {
			vertexCount: preImage.vertices.length
		})
		throw errors.wrap(
			ErrInvalidPolygon,
			`polygon has ${preImage.vertices.length} vertices, requires at least 3`
		)
	}

	// 1. Call the base generator and get the body content and extents object
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const baseInfo = setupCoordinatePlaneV2(
		{
			width,
			height,
			xAxis: {
				label: xAxis.label,
				min: xAxis.min,
				max: xAxis.max,
				tickInterval: xAxis.tickInterval,
				showGridLines: xAxis.showGridLines
			},
			yAxis: {
				label: yAxis.label,
				min: yAxis.min,
				max: yAxis.max,
				tickInterval: yAxis.tickInterval,
				showGridLines: yAxis.showGridLines
			},
			showQuadrantLabels: showQuadrantLabels
		},
		canvas
	)

	// Draw shapes within the clipped region
	canvas.drawInClippedRegion((clippedCanvas) => {
		// Draw Pre-Image (solid)
		const preImagePoints = preImage.vertices.map((p) => ({
			x: baseInfo.toSvgX(p.x),
			y: baseInfo.toSvgY(p.y)
		}))
		clippedCanvas.drawPolygon(preImagePoints, {
			fill: preImage.color,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.base,
			fillOpacity: theme.opacity.overlay
		})

		// 3. Calculate Transformed Vertices
		let imageVertices: Vertex[] = []
		switch (transformation.type) {
			case "translation": {
				imageVertices = preImage.vertices.map((v) => ({
					x: v.x + transformation.vector.x,
					y: v.y + transformation.vector.y
				}))
				break
			}
			case "reflection": {
				imageVertices = preImage.vertices.map((v) => ({
					x: transformation.axis === "y" ? -v.x : v.x,
					y: transformation.axis === "x" ? -v.y : v.y
				}))
				break
			}
			case "rotation": {
				const angleRad = (transformation.angle * Math.PI) / 180
				const center = transformation.center
				imageVertices = preImage.vertices.map((v) => {
					const translatedX = v.x - center.x
					const translatedY = v.y - center.y
					return {
						x:
							translatedX * Math.cos(angleRad) -
							translatedY * Math.sin(angleRad) +
							center.x,
						y:
							translatedX * Math.sin(angleRad) +
							translatedY * Math.cos(angleRad) +
							center.y
					}
				})
				break
			}
			case "dilation": {
				const scale = transformation.scaleFactor
				const dilCenter = transformation.center
				imageVertices = preImage.vertices.map((v) => ({
					x: dilCenter.x + scale * (v.x - dilCenter.x),
					y: dilCenter.y + scale * (v.y - dilCenter.y)
				}))
				break
			}
		}

		// 4. Draw Image (dashed)
		const imagePoints = imageVertices.map((p) => ({
			x: baseInfo.toSvgX(p.x),
			y: baseInfo.toSvgY(p.y)
		}))
		clippedCanvas.drawPolygon(imagePoints, {
			fill: preImage.color,
			fillOpacity: theme.opacity.overlay,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.base,
			dash: theme.stroke.dasharray.dashed
		})
	})

	// 5. Add visual aids like center of rotation/dilation
	if (
		transformation.type === "rotation" ||
		transformation.type === "dilation"
	) {
		const c = transformation.center
		const cx = baseInfo.toSvgX(c.x)
		const cy = baseInfo.toSvgY(c.y)
		canvas.drawCircle(cx, cy, theme.geometry.pointRadius.base, {
			fill: theme.colors.actionSecondary
		})
	}

	// 6. Render lines if provided (below points for clarity in layering)
	if (lines && lines.length > 0) {
		renderLines(lines, xAxis, yAxis, baseInfo.toSvgX, baseInfo.toSvgY, canvas)
	}

	// 7. Render points on top
	renderPoints(points, baseInfo.toSvgX, baseInfo.toSvgY, canvas)

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(AXIS_VIEWBOX_PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
