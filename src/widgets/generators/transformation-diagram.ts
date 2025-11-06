import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"
import { theme } from "@/widgets/utils/theme"

function createShapeSchema() {
	const shape = z
		.object({
			vertices: z
				.array(z.object({ x: z.number(), y: z.number() }).strict())
				.describe(
					"Ordered vertices defining the polygon. Connect in sequence, closing to first. Minimum 3 for valid shape. Order determines edge labeling."
				),
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === null ||
					val.trim() === "" ||
					val.trim().toLowerCase() === "null"
						? null
						: val.trim()
				)
				.describe(
					"Shape identifier (e.g., 'ABCD', 'Figure 1', 'P', 'P''', null). Null means no label. Positioned near shape's center."
				),
			fillColor: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.describe(
					"CSS fill color (e.g., 'rgba(100,149,237,0.3)' for translucent blue, 'lightgreen', '#FFE5B4'). Use alpha for see-through shapes."
				),
			strokeColor: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.describe(
					"CSS color for shape outline (e.g., 'black', '#0000FF', 'darkgreen'). Should contrast with fill and background."
				),
			vertexLabels: z
				.array(z.string().min(1))
				.describe(
					"Labels for each vertex in order (e.g., ['A','B','C','D']). Array length must match vertices length; labels must be non-empty strings."
				),
			angleMarks: z
				.array(
					z
						.object({
							vertexIndex: z.number(),
							radius: z.number(),
							label: z
								.string()
								.nullable()
								.transform((val) =>
									val === null ||
									val.trim() === "" ||
									val.trim().toLowerCase() === "null"
										? null
										: val.trim()
								),
							labelDistance: z.number()
						})
						.strict()
				)
				.describe(
					"Angle annotations to display. Empty array means no angle marks. Useful for showing congruent angles or measurements."
				),
			sideLengths: z
				.array(
					z
						.object({
							value: z.string(),
							position: z.enum(["inside", "outside"]),
							offset: z.number()
						})
						.strict()
				)
				.describe(
					"Edge length labels. First item labels edge from vertex[0] to vertex[1], etc. Array length should match number of edges."
				)
		})
		.strict()

	return shape.superRefine((data, ctx) => {
		if (data.vertices.length < 3) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "vertices must have at least 3 points",
				path: ["vertices"]
			})
		}
		if (data.vertexLabels.length !== data.vertices.length) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "vertexLabels length must match vertices length",
				path: ["vertexLabels"]
			})
		}
	})
}

function createTransformationSchema() {
	// Important: do NOT reuse the same object schema instance across fields to prevent $ref generation
	const createPoint = () => z.object({ x: z.number(), y: z.number() }).strict()
	return z.discriminatedUnion("type", [
		z
			.object({
				type: z.literal("translation"),
				vector: z
					.object({ x: z.number(), y: z.number() })
					.strict()
					.describe("Translation vector to apply to all vertices.")
			})
			.strict(),
		z
			.object({
				type: z.literal("reflection"),
				lineOfReflection: z
					.object({
						from: createPoint(),
						to: createPoint(),
						style: z.enum(["solid", "dashed", "dotted"]),
						color: z
							.string()
							.regex(
								CSS_COLOR_PATTERN,
								"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
							)
					})
					.strict()
					.describe("The mirror line for reflection.")
			})
			.strict(),
		z
			.object({
				type: z.literal("rotation"),
				centerOfRotation: createPoint().describe(
					"Fixed point around which rotation occurs."
				),
				angle: z
					.number()
					.describe(
						"Rotation angle in degrees. Positive is counter-clockwise (e.g., 90, -45, 180)."
					)
			})
			.strict(),
		z
			.object({
				type: z.literal("dilation"),
				centerOfDilation: createPoint().describe(
					"Fixed point from which scaling occurs."
				),
				scaleFactor: z
					.number()
					.describe(
						"Scaling factor for dilation. Values > 1 enlarge, 0 < values < 1 shrink."
					)
			})
			.strict()
	])
}

const AngleMark = z
	.object({
		vertexIndex: z
			.number()
			.describe(
				"Zero-based index of the vertex where angle is marked. Must be valid index into vertices array (e.g., 0, 1, 2)."
			),
		radius: z
			.number()
			.describe(
				"Radius of the angle arc in pixels (e.g., 20, 30, 25). Larger values create wider arcs. Use consistent radius for similar angles."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === null || val.trim() === "" || val.trim().toLowerCase() === "null"
					? null
					: val.trim()
			)
			.describe(
				"Angle measurement or name (e.g., '90°', '45°', '∠ABC', 'θ', null). Null shows arc without label. Positioned near the arc."
			),
		labelDistance: z
			.number()
			.describe(
				"Distance from vertex to place the label in pixels (e.g., 40, 50, 35). Should be beyond the arc radius to avoid overlap."
			)
	})
	.strict()

export const TransformationDiagramPropsSchema = z
	.object({
		type: z
			.literal("transformationDiagram")
			.describe(
				"Identifies this as a transformation diagram showing geometric transformations with detailed annotations."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		preImage: createShapeSchema().describe(
			"The original shape before transformation. All properties (vertices, labels, angles, sides) are preserved in the transformation."
		),
		transformation: createTransformationSchema().describe(
			"Details of how preImage transforms to image. Include visual aids like vectors, reflection lines, or rotation centers."
		)
	})
	.strict()
	.describe(
		"Creates detailed geometric transformation diagrams showing pre-image and image shapes with comprehensive annotations including vertex labels, angle marks, side lengths, and transformation-specific visual aids. Perfect for teaching reflections, rotations, translations, and dilations with full mathematical notation."
	)

export type TransformationDiagramProps = z.infer<
	typeof TransformationDiagramPropsSchema
>

/**
 * Generates an SVG diagram illustrating a geometric transformation.
 */
export const generateTransformationDiagram: WidgetGenerator<
	typeof TransformationDiagramPropsSchema
> = async (props) => {
	const { width, height, preImage, transformation } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const calculateCentroid = (vertices: Array<{ x: number; y: number }>) => {
		const centroid = vertices.reduce(
			(acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
			{
				x: 0,
				y: 0
			}
		)
		centroid.x /= vertices.length
		centroid.y /= vertices.length
		return centroid
	}

	const rotatePoint = (
		p: { x: number; y: number },
		center: { x: number; y: number },
		angleDeg: number
	) => {
		const rad = (angleDeg * Math.PI) / 180
		const tx = p.x - center.x
		const ty = p.y - center.y
		return {
			x: tx * Math.cos(rad) - ty * Math.sin(rad) + center.x,
			y: tx * Math.sin(rad) + ty * Math.cos(rad) + center.y
		}
	}

	const reflectPointAcrossLine = (
		p: { x: number; y: number },
		a: { x: number; y: number },
		b: { x: number; y: number }
	) => {
		const vx = b.x - a.x
		const vy = b.y - a.y
		const len = Math.hypot(vx, vy)
		if (len === 0) {
			logger.error("reflection line degenerate", { from: a, to: b })
			throw errors.new("reflection line must have nonzero length")
		}
		const ux = vx / len
		const uy = vy / len
		const wx = p.x - a.x
		const wy = p.y - a.y
		const dot = wx * ux + wy * uy
		const projx = dot * ux
		const projy = dot * uy
		const perpx = wx - projx
		const perpy = wy - projy
		return { x: a.x + projx - perpx, y: a.y + projy - perpy }
	}

	let imageVertices: Array<{ x: number; y: number }> = []
	switch (transformation.type) {
		case "translation":
			imageVertices = preImage.vertices.map((p) => ({
				x: p.x + transformation.vector.x,
				y: p.y + transformation.vector.y
			}))
			break
		case "rotation":
			imageVertices = preImage.vertices.map((p) =>
				rotatePoint(p, transformation.centerOfRotation, transformation.angle)
			)
			break
		case "reflection": {
			const { from, to } = transformation.lineOfReflection
			imageVertices = preImage.vertices.map((p) =>
				reflectPointAcrossLine(p, from, to)
			)
			break
		}
		case "dilation": {
			const c = transformation.centerOfDilation
			const s = transformation.scaleFactor
			imageVertices = preImage.vertices.map((p) => ({
				x: c.x + s * (p.x - c.x),
				y: c.y + s * (p.y - c.y)
			}))
			break
		}
	}

	const image: TransformationDiagramProps["preImage"] = {
		...preImage,
		vertices: imageVertices,
		label: "Figure 2", // Use "Figure 2" instead of primed label
		vertexLabels: ["A", "B", "C", "D"], // Use different labels for the second shape
		strokeColor: "#1fab54", // Use green for the transformed image
		sideLengths: [] // Side lengths are not transferred as they change in dilation
	}

	let centerPoint: { x: number; y: number } | null = null
	if (transformation.type === "rotation")
		centerPoint = transformation.centerOfRotation
	if (transformation.type === "dilation")
		centerPoint = transformation.centerOfDilation

	let centerPointInfo:
		| { x: number; y: number; label: string | null; style: string }
		| undefined
	// const otherPoints: Array<{
	//	x: number
	//	y: number
	//	label: string | null
	//	style: string
	// }> = [] // Unused variable

	const allPoints = [...preImage.vertices, ...image.vertices]
	if (centerPoint) allPoints.push(centerPoint)
	if (transformation.type === "reflection")
		allPoints.push(
			transformation.lineOfReflection.from,
			transformation.lineOfReflection.to
		)

	const minX = Math.min(...allPoints.map((p) => p.x))
	const maxX = Math.max(...allPoints.map((p) => p.x))
	const minY = Math.min(...allPoints.map((p) => p.y))
	const maxY = Math.max(...allPoints.map((p) => p.y))

	const dataWidth = maxX - minX
	const dataHeight = maxY - minY

	const padding = PADDING * 2
	const availableWidth = width - 2 * padding
	const availableHeight = height - 2 * padding

	const scaleX = dataWidth > 1e-9 ? availableWidth / dataWidth : 1
	const scaleY = dataHeight > 1e-9 ? availableHeight / dataHeight : 1
	const scale = Math.max(1e-9, Math.min(scaleX, scaleY))

	const dataCenterX = (minX + maxX) / 2
	const dataCenterY = (minY + maxY) / 2
	const svgCenterX = width / 2
	const svgCenterY = height / 2

	const toSvgX = (x: number) => svgCenterX + (x - dataCenterX) * scale
	const toSvgY = (y: number) => svgCenterY - (y - dataCenterY) * scale

	// --- Begin screen geometry for collision detection ---
	const screenSegments: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = []

	function addShapeSegments(shape: TransformationDiagramProps["preImage"]) {
		const pts = shape.vertices.map((p) => ({ x: toSvgX(p.x), y: toSvgY(p.y) }))
		for (let i = 0; i < pts.length; i++) {
			const a = pts[i]
			const b = pts[(i + 1) % pts.length]
			screenSegments.push({ a, b })
		}
	}

	function addSegment(
		from: { x: number; y: number },
		to: { x: number; y: number }
	) {
		screenSegments.push({
			a: { x: toSvgX(from.x), y: toSvgY(from.y) },
			b: { x: toSvgX(to.x), y: toSvgY(to.y) }
		})
	}

	// Add polygon edges for both shapes
	addShapeSegments(preImage)
	addShapeSegments(image)

	// Add reflection aid segments when applicable
	if (transformation.type === "reflection") {
		addSegment(
			transformation.lineOfReflection.from,
			transformation.lineOfReflection.to
		)
		// Also add dotted correspondence lines (pre vertex -> image vertex)
		for (let i = 0; i < preImage.vertices.length; i++) {
			const p = preImage.vertices[i]
			const q = image.vertices[i]
			if (p && q) addSegment(p, q)
		}
	}

	function segmentIntersectsRect(
		A: { x: number; y: number },
		B: { x: number; y: number },
		rect: { x: number; y: number; width: number; height: number; pad?: number }
	): boolean {
		const pad = rect.pad ?? 0
		const rx = rect.x - pad
		const ry = rect.y - pad
		const rw = rect.width + 2 * pad
		const rh = rect.height + 2 * pad

		const minX = Math.min(A.x, B.x)
		const maxX = Math.max(A.x, B.x)
		const minY = Math.min(A.y, B.y)
		const maxY = Math.max(A.y, B.y)
		if (maxX < rx || minX > rx + rw || maxY < ry || minY > ry + rh) return false

		const r1 = { x: rx, y: ry }
		const r2 = { x: rx + rw, y: ry }
		const r3 = { x: rx + rw, y: ry + rh }
		const r4 = { x: rx, y: ry + rh }
		const orient = (
			p: { x: number; y: number },
			q: { x: number; y: number },
			r: { x: number; y: number }
		) => {
			const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
			if (val > 1e-9) return 1
			if (val < -1e-9) return -1
			return 0
		}
		const segmentsIntersect = (
			p1: { x: number; y: number },
			p2: { x: number; y: number },
			p3: { x: number; y: number },
			p4: { x: number; y: number }
		) => {
			const o1 = orient(p1, p2, p3)
			const o2 = orient(p1, p2, p4)
			const o3 = orient(p3, p4, p1)
			const o4 = orient(p3, p4, p2)
			return o1 !== o2 && o3 !== o4
		}
		return (
			segmentsIntersect(A, B, r1, r2) ||
			segmentsIntersect(A, B, r2, r3) ||
			segmentsIntersect(A, B, r3, r4) ||
			segmentsIntersect(A, B, r4, r1)
		)
	}

	function rectIntersectsAnySegment(rect: {
		x: number
		y: number
		width: number
		height: number
		pad?: number
	}): boolean {
		for (const seg of screenSegments) {
			if (segmentIntersectsRect(seg.a, seg.b, rect)) return true
		}
		return false
	}

	function rectsOverlap(
		a: { x: number; y: number; width: number; height: number },
		b: {
			x: number
			y: number
			width: number
			height: number
		}
	): boolean {
		return !(
			a.x + a.width < b.x ||
			b.x + b.width < a.x ||
			a.y + a.height < b.y ||
			b.y + b.height < a.y
		)
	}

	function rectsOverlapInflated(
		a: { x: number; y: number; width: number; height: number },
		b: { x: number; y: number; width: number; height: number },
		grow: number
	): boolean {
		return !(
			a.x + a.width < b.x - grow ||
			b.x + b.width + grow < a.x ||
			a.y + a.height < b.y - grow ||
			b.y + b.height + grow < a.y
		)
	}
	// --- End screen geometry for collision detection ---

	const drawPolygon = (
		shape: TransformationDiagramProps["preImage"],
		isImage: boolean
	) => {
		const polygonPoints = shape.vertices.map((p) => ({
			x: toSvgX(p.x),
			y: toSvgY(p.y)
		}))
		const strokeWidth = isImage ? 2.5 : 2
		const dash = isImage ? "4 4" : undefined

		canvas.drawPolygon(polygonPoints, {
			fill: shape.fillColor,
			stroke: shape.strokeColor,
			strokeWidth: strokeWidth,
			dash: dash
		})

		// Draw vertex dots
		for (const vertex of shape.vertices) {
			const svgX = toSvgX(vertex.x)
			const svgY = toSvgY(vertex.y)
			canvas.drawCircle(svgX, svgY, 4, {
				fill: shape.strokeColor,
				stroke: shape.strokeColor,
				strokeWidth: 2
			})
		}
	}

	const drawLine = (line: {
		from: { x: number; y: number }
		to: { x: number; y: number }
		style: string
		color: string
	}) => {
		let dash: string | undefined
		if (line.style === "dashed") dash = "8 6"
		else if (line.style === "dotted") dash = "2 4"

		canvas.drawLine(
			toSvgX(line.from.x),
			toSvgY(line.from.y),
			toSvgX(line.to.x),
			toSvgY(line.to.y),
			{
				stroke: line.color,
				strokeWidth: theme.stroke.width.thick,
				dash
			}
		)
	}

	// Removed unused function drawRotationArc

	const placedLabelRects: Array<{
		x: number
		y: number
		width: number
		height: number
	}> = []

	const drawVertexLabels = (
		shape: TransformationDiagramProps["preImage"],
		extraOffset: number | Array<number> = 0
	) => {
		for (let i = 0; i < shape.vertices.length; i++) {
			const vertex = shape.vertices[i]
			const label = shape.vertexLabels[i]
			if (!vertex || !label || label === "•") continue // Skip bullet point placeholders

			const perVertexExtraOffset = Array.isArray(extraOffset)
				? (extraOffset[i] ?? 0)
				: extraOffset
			const labelOffset = 16 + perVertexExtraOffset

			const prevVertex =
				shape.vertices[(i - 1 + shape.vertices.length) % shape.vertices.length]
			const nextVertex = shape.vertices[(i + 1) % shape.vertices.length]
			if (!prevVertex || !nextVertex) continue

			const v_prev_x = prevVertex.x - vertex.x
			const v_prev_y = prevVertex.y - vertex.y
			const v_next_x = nextVertex.x - vertex.x
			const v_next_y = nextVertex.y - vertex.y

			const len_prev = Math.hypot(v_prev_x, v_prev_y)
			const len_next = Math.hypot(v_next_x, v_next_y)

			const u_prev_x = len_prev > 0 ? v_prev_x / len_prev : 0
			const u_prev_y = len_prev > 0 ? v_prev_y / len_prev : 0
			const u_next_x = len_next > 0 ? v_next_x / len_next : 0
			const u_next_y = len_next > 0 ? v_next_y / len_next : 0

			let bisectorX = u_prev_x + u_next_x
			let bisectorY = u_prev_y + u_next_y
			const len_bisector = Math.hypot(bisectorX, bisectorY)

			if (len_bisector < 1e-9) {
				bisectorX = -u_prev_y
				bisectorY = u_prev_x
			} else {
				bisectorX /= len_bisector
				bisectorY /= len_bisector
			}

			const centroid = calculateCentroid(shape.vertices)
			const centroidVecX = vertex.x - centroid.x
			const centroidVecY = vertex.y - centroid.y

			if (bisectorX * centroidVecX + bisectorY * centroidVecY < 0) {
				bisectorX = -bisectorX
				bisectorY = -bisectorY
			}

			// Base screen-space direction away from vertex (accounting for flipped Y)
			const screenRadX = bisectorX
			const screenRadY = -bisectorY
			const baseX = toSvgX(vertex.x) + screenRadX * labelOffset
			const baseY = toSvgY(vertex.y) + screenRadY * labelOffset

			const fontPx = theme.font.size.medium
			const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
				label,
				Number.POSITIVE_INFINITY,
				fontPx,
				1.2
			)
			const halfW = w / 2
			const halfH = h / 2

			// Tangential unit vector (perpendicular to radial)
			const radLen = Math.hypot(screenRadX, screenRadY) || 1
			const rx = screenRadX / radLen
			const ry = screenRadY / radLen
			const tx = -ry
			const ty = rx

			function placeTangential(mult: number) {
				let px = baseX
				let py = baseY
				let it = 0
				const maxIt = 80
				const step = 3
				while (
					(rectIntersectsAnySegment({
						x: px - halfW,
						y: py - halfH,
						width: w,
						height: h,
						pad: 1
					}) ||
						placedLabelRects.some((r) =>
							rectsOverlap(
								{ x: px - halfW, y: py - halfH, width: w, height: h },
								r
							)
						)) &&
					it < maxIt
				) {
					px += mult * step * tx
					py += mult * step * ty
					it++
				}
				return { x: px, y: py, it }
			}

			const cw = placeTangential(1)
			const ccw = placeTangential(-1)
			const chosen = ccw.it < cw.it ? ccw : cw

			canvas.drawText({
				x: chosen.x,
				y: chosen.y,
				text: label,
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx,
				fontWeight: theme.font.weight.bold,
				fill: theme.colors.text
			})

			placedLabelRects.push({
				x: chosen.x - halfW,
				y: chosen.y - halfH,
				width: w,
				height: h
			})
		}
	}

	const drawAngleMark = (
		vertices: Array<{ x: number; y: number }>,
		mark: z.infer<typeof AngleMark>,
		strokeColor: string
	) => {
		if (mark.vertexIndex < 0 || mark.vertexIndex >= vertices.length) return
		const vertex = vertices[mark.vertexIndex]
		const prevVertex =
			vertices[(mark.vertexIndex - 1 + vertices.length) % vertices.length]
		const nextVertex = vertices[(mark.vertexIndex + 1) % vertices.length]
		if (!vertex || !prevVertex || !nextVertex) return

		let angle1 = Math.atan2(prevVertex.y - vertex.y, prevVertex.x - vertex.x)
		let angle2 = Math.atan2(nextVertex.y - vertex.y, nextVertex.x - vertex.x)

		const crossProduct =
			(nextVertex.x - vertex.x) * (prevVertex.y - vertex.y) -
			(nextVertex.y - vertex.y) * (prevVertex.x - vertex.x)
		if (crossProduct > 0) [angle1, angle2] = [angle2, angle1]

		const svgRadius = mark.radius * scale
		const svgVertexX = toSvgX(vertex.x)
		const svgVertexY = toSvgY(vertex.y)

		const startX = svgVertexX + svgRadius * Math.cos(-angle1)
		const startY = svgVertexY + svgRadius * Math.sin(-angle1)
		const endX = svgVertexX + svgRadius * Math.cos(-angle2)
		const endY = svgVertexY + svgRadius * Math.sin(-angle2)

		let angleDiff = angle2 - angle1
		if (angleDiff < 0) angleDiff += 2 * Math.PI
		// Determine whether the small-arc bisector points toward the shape centroid.
		// If it does, render the external (large) arc so the concave side faces away from the center.
		const centroid = calculateCentroid(vertices)
		const dirToCentroidX = centroid.x - vertex.x
		const dirToCentroidY = centroid.y - vertex.y
		const midAngle = angle1 + angleDiff / 2
		const midDirX = Math.cos(midAngle)
		const midDirY = Math.sin(midAngle)
		const pointsTowardCentroid =
			midDirX * dirToCentroidX + midDirY * dirToCentroidY > 0
		// We want the interior (small) arc when its bisector points toward the centroid; otherwise use the exterior arc
		const largeArcFlag: 0 | 1 = pointsTowardCentroid ? 0 : 1

		// Determine sweep direction in SVG coords (angles increase clockwise).
		const startScreen =
			((-angle1 % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
		const endScreen = ((-angle2 % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
		const cwDiff = (endScreen - startScreen + 2 * Math.PI) % (2 * Math.PI)
		const clockwiseIsSmall = cwDiff <= Math.PI
		let sweepFlag: 0 | 1
		if (largeArcFlag === 0) {
			sweepFlag = clockwiseIsSmall ? 1 : 0
		} else {
			sweepFlag = clockwiseIsSmall ? 0 : 1
		}

		const markPath = new Path2D()
			.moveTo(startX, startY)
			.arcTo(svgRadius, svgRadius, 0, largeArcFlag, sweepFlag, endX, endY)
		canvas.drawPath(markPath, {
			stroke: strokeColor,
			strokeWidth: 1.5,
			fill: "none"
		})

		if (mark.label) {
			// Always label the interior angle: choose the radial direction that points toward the polygon centroid
			const labelAngle = pointsTowardCentroid ? midAngle : midAngle + Math.PI
			// Push label center far enough from the arc to avoid clashes.
			// Use half the text height (since we place the text's center) plus extra clearance.
			const LABEL_FONT = 13
			const LABEL_HALF_HEIGHT = LABEL_FONT / 2
			const CLEARANCE = 10
			const minDistanceFromCenter = svgRadius + LABEL_HALF_HEIGHT + CLEARANCE
			const svgLabelDistance = Math.max(
				mark.labelDistance * scale,
				minDistanceFromCenter
			)
			const labelX = svgVertexX + svgLabelDistance * Math.cos(-labelAngle)
			const labelY = svgVertexY + svgLabelDistance * Math.sin(-labelAngle)
			canvas.drawText({
				x: labelX,
				y: labelY,
				text: mark.label,
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx: LABEL_FONT,
				fill: theme.colors.text
			})
		}
	}

	const drawPoint = (point: {
		x: number
		y: number
		label: string | null
		style: string
	}) => {
		const svgX = toSvgX(point.x)
		const svgY = toSvgY(point.y)
		const radius = 4
		const style =
			point.style === "circle"
				? {
						fill: "none",
						stroke: theme.colors.text,
						strokeWidth: theme.stroke.width.thick
					}
				: {
						fill: theme.colors.highlightPrimary,
						stroke: theme.colors.white,
						strokeWidth: theme.stroke.width.thin
					}
		canvas.drawCircle(svgX, svgY, radius, style)
		if (point.label) {
			canvas.drawText({
				x: svgX,
				y: svgY - 12,
				text: point.label,
				anchor: "middle",
				dominantBaseline: "baseline",
				fontPx: theme.font.size.medium,
				fontWeight: theme.font.weight.bold,
				fill: theme.colors.text
			})
		}
	}

	const drawSideLengths = (shape: TransformationDiagramProps["preImage"]) => {
		for (let i = 0; i < shape.vertices.length; i++) {
			const sideLength = shape.sideLengths[i]
			if (!sideLength || !sideLength.value) continue

			const p1 = shape.vertices[i]
			const p2 = shape.vertices[(i + 1) % shape.vertices.length]
			if (!p1 || !p2) continue

			const midX = (p1.x + p2.x) / 2
			const midY = (p1.y + p2.y) / 2
			const dx = p2.x - p1.x
			const dy = p2.y - p1.y
			const len = Math.hypot(dx, dy)
			if (len < 1e-9) continue
			const perpX = -dy / len
			const perpY = dx / len

			const centroid = calculateCentroid(shape.vertices)
			const centroidVecX = midX - centroid.x
			const centroidVecY = midY - centroid.y
			const dot = perpX * centroidVecX + perpY * centroidVecY

			let finalPerpX = perpX
			let finalPerpY = perpY

			if (
				(sideLength.position === "inside" && dot > 0) ||
				(sideLength.position === "outside" && dot < 0)
			) {
				finalPerpX = -perpX
				finalPerpY = -perpY
			}

			const labelX = toSvgX(midX) + finalPerpX * sideLength.offset
			const labelY = toSvgY(midY) - finalPerpY * sideLength.offset

			canvas.drawText({
				x: labelX,
				y: labelY,
				text: sideLength.value,
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx: 13,
				fill: theme.colors.text
			})
		}
	}

	if (transformation.type === "reflection") {
		drawLine(transformation.lineOfReflection)
	}

	drawPolygon(preImage, false)
	drawPolygon(image, true)

	for (const mark of preImage.angleMarks) {
		drawAngleMark(preImage.vertices, mark, preImage.strokeColor)
	}
	for (const mark of image.angleMarks) {
		drawAngleMark(image.vertices, mark, image.strokeColor)
	}

	// When dilation scale is very close to 1, pre-image and image labels can overlap.
	// Nudge the image labels outward with a small additional offset to avoid overlap.
	let imageLabelExtraOffset: number | Array<number> = 0
	if (transformation.type === "dilation") {
		const s = transformation.scaleFactor
		const defaultNudge = Math.abs(s - 1) < 0.05 ? 14 : 0
		const perVertex: Array<number> = new Array(image.vertices.length).fill(
			defaultNudge
		)
		const count = Math.min(preImage.vertices.length, image.vertices.length)
		for (let i = 0; i < count; i++) {
			const p = preImage.vertices[i]
			const q = image.vertices[i]
			if (!p || !q) continue
			const dx = p.x - q.x
			const dy = p.y - q.y
			const d = Math.hypot(dx, dy)
			if (d < 1e-9) {
				const val = perVertex[i]
				let currentOffset: number
				if (val === undefined) currentOffset = defaultNudge
				else currentOffset = val
				if (currentOffset < 16) currentOffset = 16
				perVertex[i] = currentOffset
			}
		}
		imageLabelExtraOffset = perVertex
	}

	drawVertexLabels(preImage)
	drawVertexLabels(image, imageLabelExtraOffset)
	drawSideLengths(preImage)

	// Reserve center point label 'P' rectangle to avoid shape-label overlap.
	if (centerPoint) {
		const svgX = toSvgX(centerPoint.x)
		const svgY = toSvgY(centerPoint.y)
		const fontPx = theme.font.size.medium
		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			"P",
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const textX = svgX
		const textY = svgY - 12 // baseline offset in drawPoint
		placedLabelRects.push({
			x: textX - w / 2,
			y: textY - h,
			width: w,
			height: h
		})
	}

	// Draw shape labels with collision avoidance against edges and other labels
	const drawShapeLabel = (
		shape: TransformationDiagramProps["preImage"],
		preferBelow = false
	) => {
		if (!shape.label) return

		// Compute screen-space bbox of the shape
		const svgXs = shape.vertices.map((v) => toSvgX(v.x))
		const svgYs = shape.vertices.map((v) => toSvgY(v.y))
		const minSvgX = Math.min(...svgXs)
		const maxSvgX = Math.max(...svgXs)
		const minSvgY = Math.min(...svgYs)
		const maxSvgY = Math.max(...svgYs)

		// Label styling and margins
		const fontPx = theme.font.size.medium
		const margin = preferBelow ? 28 : 24
		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			shape.label,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = w / 2
		const halfH = h / 2

		const centerX = (minSvgX + maxSvgX) / 2
		const aboveY = Math.max(PADDING + halfH, minSvgY - margin - halfH)
		const belowY = maxSvgY + margin + halfH

		const padForEdges = preferBelow ? 2 : 1
		function fitsAt(x: number, y: number): boolean {
			const rect = {
				x: x - halfW,
				y: y - halfH,
				width: w,
				height: h,
				pad: padForEdges
			}
			if (rectIntersectsAnySegment(rect)) return false
			for (const r of placedLabelRects) {
				// add extra separation so shape labels don't stack on top of vertex labels
				if (
					rectsOverlapInflated(
						{ x: rect.x, y: rect.y, width: rect.width, height: rect.height },
						r,
						10
					)
				)
					return false
			}
			return true
		}

		function slideHoriz(x: number, y: number) {
			let left = { x, y, it: 0 }
			let right = { x, y, it: 0 }
			const step = 4
			const maxIt = 120
			const minX = PADDING + halfW
			const maxX = width - PADDING - halfW
			while (!fitsAt(left.x, left.y) && left.it < maxIt) {
				left.x -= step
				if (left.x < minX) {
					left.x = minX
					break
				}
				left.it++
			}
			while (!fitsAt(right.x, right.y) && right.it < maxIt) {
				right.x += step
				if (right.x > maxX) {
					right.x = maxX
					break
				}
				right.it++
			}
			return left.it <= right.it ? left : right
		}

		// Prefer location based on caller; try preferred first then fallback
		const above = slideHoriz(centerX, aboveY)
		const below = slideHoriz(centerX, belowY)
		let chosen: { x: number; y: number; it: number }
		if (preferBelow) {
			if (fitsAt(below.x, below.y)) {
				chosen = below
			} else if (fitsAt(above.x, above.y)) {
				chosen = above
			} else if (below.it <= above.it) {
				chosen = below
			} else {
				chosen = above
			}
		} else {
			if (fitsAt(above.x, above.y)) {
				chosen = above
			} else if (fitsAt(below.x, below.y)) {
				chosen = below
			} else if (above.it <= below.it) {
				chosen = above
			} else {
				chosen = below
			}
		}

		canvas.drawText({
			x: chosen.x,
			y: chosen.y,
			text: shape.label,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			fontWeight: theme.font.weight.bold,
			fill: shape.strokeColor
		})

		placedLabelRects.push({
			x: chosen.x - halfW,
			y: chosen.y - halfH,
			width: w,
			height: h
		})
	}

	drawShapeLabel(preImage)
	// Prefer placing the transformed figure label below its triangle to reduce clashes near vertex labels
	drawShapeLabel(image, true)

	if (centerPoint) {
		drawPoint(centerPointInfo ?? { ...centerPoint, label: "P", style: "dot" })
	}

	switch (transformation.type) {
		case "rotation":
			break
		case "reflection":
			for (let i = 0; i < preImage.vertices.length; i++) {
				const preVertex = preImage.vertices[i]
				const imgVertex = image.vertices[i]
				if (preVertex && imgVertex) {
					drawLine({
						from: preVertex,
						to: imgVertex,
						style: "dotted",
						color: theme.colors.gridMinor
					})
				}
			}
			break
		case "dilation":
			for (let i = 0; i < preImage.vertices.length; i++) {
				const preVertex = preImage.vertices[i]
				const imgVertex = image.vertices[i]
				if (preVertex && imgVertex) {
					canvas.drawCircle(toSvgX(preVertex.x), toSvgY(preVertex.y), 2, {
						fill: theme.colors.highlightPrimary,
						fillOpacity: 0.6
					})
					canvas.drawCircle(toSvgX(imgVertex.x), toSvgY(imgVertex.y), 2.5, {
						fill: theme.colors.highlightPrimary
					})
				}
			}
			break
	}

	// no-op: general markers removed

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
