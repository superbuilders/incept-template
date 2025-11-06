import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Defines a dimension label for an edge or a face area
const DimensionLabel = z
	.object({
		text: z
			.string()
			.describe(
				"The label text to display (e.g., '10 cm', 'h = 5', 'length', '8'). Can include units or variable names."
			),
		target: z
			.string()
			.describe(
				"Which dimension to label: 'length', 'width', 'height', 'slantHeight', or face names like 'topFace', 'frontFace', 'baseFace'."
			)
	})
	.strict()

// Defines the face names that can appear across all supported polyhedra
const FaceName = z
	.enum([
		"frontFace",
		"backFace",
		"leftFace",
		"rightFace",
		"topFace",
		"bottomFace",
		"baseFace"
	])
	.describe(
		"Face identifier for polyhedra. 'frontFace' is the viewer-facing surface, 'backFace' is hidden behind, 'leftFace'/'rightFace' are side surfaces, 'topFace'/'bottomFace' are vertical extremes, and 'baseFace' is the foundation of pyramids."
	)

// Factory function to create anchor schema - avoids $ref in OpenAI JSON schema
const createAnchorSchema = () =>
	z.discriminatedUnion("type", [
		z
			.object({
				type: z.literal("vertex"),
				index: z
					.number()
					.int()
					.min(0)
					.describe(
						"Zero-based vertex index referring to a specific corner of the polyhedron. Vertex numbering follows the systematic ordering used by each shape type."
					)
			})
			.strict()
			.describe(
				"References an existing vertex of the polyhedron by its index position."
			),
		z
			.object({
				type: z.literal("edgeMidpoint"),
				a: z
					.number()
					.int()
					.min(0)
					.describe(
						"Index of the first vertex that defines one endpoint of the edge."
					),
				b: z
					.number()
					.int()
					.min(0)
					.describe(
						"Index of the second vertex that defines the other endpoint of the edge. Must be different from 'a'."
					)
			})
			.strict()
			.describe(
				"References the midpoint of an edge connecting two vertices. Useful for slant heights, edge bisectors, and construction lines."
			),
		z
			.object({
				type: z.literal("edgePoint"),
				a: z
					.number()
					.int()
					.min(0)
					.describe(
						"Index of the first vertex defining the edge's starting point."
					),
				b: z
					.number()
					.int()
					.min(0)
					.describe(
						"Index of the second vertex defining the edge's ending point. Must be different from 'a'."
					),
				t: z
					.number()
					.min(0)
					.max(1)
					.describe(
						"Parametric position along the edge from vertex 'a' to vertex 'b'. 0 = at vertex a, 1 = at vertex b, 0.5 = midpoint, 0.25 = quarter way from a to b."
					)
			})
			.strict()
			.describe(
				"References a specific point along an edge at a fractional distance between two vertices. Enables precise positioning for construction lines and measurements."
			),
		z
			.object({
				type: z.literal("faceCentroid"),
				face: FaceName.describe(
					"The face whose geometric center will be used as the anchor point."
				)
			})
			.strict()
			.describe(
				"References the geometric center (centroid) of a face polygon. Calculated as the average position of all vertices that define the face."
			)
	])

// Defines a line segment between two anchor points with optional labeling
const Segment = z
	.object({
		from: createAnchorSchema().describe(
			"Starting point of the line segment. Can be any anchor type: vertex, edge point, or face center."
		),
		to: createAnchorSchema().describe(
			"Ending point of the line segment. Can be any anchor type: vertex, edge point, or face center. Must be different from 'from'."
		),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Optional text label for the segment (e.g., '140 cm', 'slant height', 'd = √50', null). Positioned at the segment's midpoint with automatic offset. Null means no label."
			)
	})
	.strict()
	.describe(
		"Defines a line segment between two anchor points with optional labeling. The renderer determines visibility and line pattern (e.g., dashed for hidden) using its camera/occlusion model; the input does not control styling."
	)

// Defines a right-angle marker positioned at an anchor using two reference directions
const AngleMarker = z
	.object({
		type: z
			.literal("right")
			.describe(
				"Marker type identifier. Currently only 'right' is supported for right-angle square markers."
			),
		at: createAnchorSchema().describe(
			"The anchor point where the angle marker will be positioned. This is the vertex of the angle."
		),
		from: createAnchorSchema().describe(
			"Reference anchor defining the first ray of the angle. A line from 'at' to 'from' forms one side of the angle."
		),
		to: createAnchorSchema().describe(
			"Reference anchor defining the second ray of the angle. A line from 'at' to 'to' forms the other side of the angle."
		),
		sizePx: z
			.number()
			.positive()
			.describe(
				"Size of the right-angle marker square in pixels. Typical values: 8-15 pixels. The marker extends this distance along both angle rays from the vertex."
			)
	})
	.strict()
	.describe(
		"Places a right-angle marker (small square) at an anchor point using two reference anchors to define the angle's rays. Essential for indicating perpendicular relationships like slant heights meeting base edges, altitudes, and construction perpendiculars."
	)

// Defines the properties for a rectangular prism (including cubes)
const RectangularPrismDataSchema = z
	.object({
		type: z.literal("rectangularPrism")
	})
	.strict()

// Triangular prism type schema
const TriangularPrismDataSchema = z
	.object({
		type: z.literal("triangularPrism")
	})
	.strict()

// Defines the properties for a rectangular pyramid
const RectangularPyramidDataSchema = z
	.object({
		type: z.literal("rectangularPyramid")
	})
	.strict()

// Defines the properties for a triangular pyramid (tetrahedron)
const TriangularPyramidDataSchema = z
	.object({
		type: z.literal("triangularPyramid")
	})
	.strict()

// Defines a diagonal line to be drawn between two vertices.
const Diagonal = z
	.object({
		fromVertexIndex: z
			.number()
			.int()
			.describe(
				"Starting vertex index (0-based) for the diagonal. Vertices are numbered systematically by the shape type."
			),
		toVertexIndex: z
			.number()
			.int()
			.describe(
				"Ending vertex index (0-based) for the diagonal. Must be different from fromVertexIndex."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text label for the diagonal's length (e.g., '12.7 cm', 'd = 15', '√50', null). Null means no label."
			)
	})
	.strict()

// The main Zod schema for the polyhedronDiagram function
export const PolyhedronDiagramPropsSchema = z
	.object({
		type: z
			.literal("polyhedronDiagram")
			.describe("Identifies this as a 3D polyhedron diagram widget."),
		width: createWidthSchema(),
		height: createHeightSchema(),
		shape: z
			.discriminatedUnion("type", [
				RectangularPrismDataSchema.describe(
					"A box-shaped prism with rectangular faces."
				),
				TriangularPrismDataSchema.describe(
					"A prism with triangular bases and rectangular sides."
				),
				RectangularPyramidDataSchema.describe(
					"A pyramid with a rectangular base and triangular faces."
				),
				TriangularPyramidDataSchema.describe(
					"A pyramid with a triangular base (tetrahedron when regular)."
				)
			])
			.describe(
				"The specific 3D shape to render with its dimensions. Each type has different dimension requirements."
			),
		labels: z
			.array(DimensionLabel)
			.describe(
				"Dimension labels to display on edges or faces. Empty array means no labels. Can label multiple dimensions and faces."
			),
		segments: z
			.array(Segment)
			.nullable()
			.describe(
				"Array of line segments to draw between anchor points. Null or empty array means no segments. Supports slant heights from apex to edge midpoints, construction lines, auxiliary measurements, and any line between vertices, edge points, or face centers. Each segment can have independent styling and labeling. Generalizes the old diagonal system with much more flexibility."
			),
		diagonals: z
			.array(Diagonal)
			.describe(
				"Space diagonals or face diagonals to draw. Empty array means no diagonals. Useful for distance calculations and 3D geometry."
			),
		angleMarkers: z
			.array(AngleMarker)
			.nullable()
			.describe(
				"Array of angle markers to place at anchor points using reference rays. Null or empty array means no markers. Currently supports right-angle square markers positioned at any anchor (vertex, edge midpoint, face center) with two reference anchors defining the angle's arms. Essential for showing perpendicular relationships like slant heights meeting base edges, altitude constructions, and geometric proofs requiring right-angle indicators."
			),
		shadedFace: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Face identifier to shade/highlight: 'topFace', 'bottomFace', 'frontFace', 'backFace', 'leftFace', 'rightFace', 'baseFace', or null. Null means no shading."
			),
		showHiddenEdges: z
			.boolean()
			.describe(
				"Whether to show edges hidden behind the solid as dashed lines. True for mathematical clarity, false for realistic view."
			)
	})
	.strict()
	.describe(
		"Creates 3D diagrams of prisms and pyramids in isometric projection. Shows vertices, edges, faces with optional labels, diagonals, and face highlighting. Essential for teaching 3D geometry, volume, surface area, and spatial visualization. Supports both solid and wireframe views with hidden edge visibility control."
	)

export type PolyhedronDiagramProps = z.infer<
	typeof PolyhedronDiagramPropsSchema
>

/**
 * This template is a versatile tool for generating SVG diagrams of three-dimensional
 * polyhedra with flat faces, such as prisms and pyramids. It renders the shapes in a
 * standard isometric or perspective view to provide depth perception.
 */
export const generatePolyhedronDiagram: WidgetGenerator<
	typeof PolyhedronDiagramPropsSchema
> = async (data) => {
	const {
		width,
		height,
		shape,
		labels,
		diagonals,
		segments,
		angleMarkers,
		shadedFace,
		showHiddenEdges
	} = data

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Helper: compute a transform that scales and centers a set of raw points into the chart area
	function computeFit(points: Array<{ x: number; y: number }>) {
		const minX = Math.min(...points.map((p) => p.x))
		const maxX = Math.max(...points.map((p) => p.x))
		const minY = Math.min(...points.map((p) => p.y))
		const maxY = Math.max(...points.map((p) => p.y))
		const rawW = maxX - minX
		const rawH = maxY - minY
		const scale = Math.min(
			(width - 2 * PADDING) / (rawW || 1),
			(height - 2 * PADDING) / (rawH || 1)
		)
		const offsetX = (width - scale * rawW) / 2 - scale * minX
		const offsetY = (height - scale * rawH) / 2 - scale * minY
		const project = (p: { x: number; y: number }) => ({
			x: offsetX + scale * p.x,
			y: offsetY + scale * p.y
		})
		return { project }
	}

	// Helper: resolve an Anchor to a concrete point using the projected vertices and faces
	function resolveAnchor(
		anchor:
			| z.infer<ReturnType<typeof createAnchorSchema>>
			| { type: "vertex"; index: number }
			| { type: "edgeMidpoint"; a: number; b: number }
			| { type: "edgePoint"; a: number; b: number; t: number }
			| { type: "faceCentroid"; face: z.infer<typeof FaceName> },
		p: Array<{ x: number; y: number } | undefined>,
		faces: Record<
			string,
			{ points: Array<{ x: number; y: number } | undefined> }
		>
	): { x: number; y: number } | null {
		switch (anchor.type) {
			case "vertex": {
				const v = p[anchor.index]
				return v ? { x: v.x, y: v.y } : null
			}
			case "edgeMidpoint": {
				const a = p[anchor.a]
				const b = p[anchor.b]
				if (!a || !b) return null
				return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
			}
			case "edgePoint": {
				const a = p[anchor.a]
				const b = p[anchor.b]
				if (!a || !b) return null
				const t = anchor.t
				return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
			}
			case "faceCentroid": {
				const face = faces[anchor.face]
				if (!face) return null
				const pts = face.points.filter(
					(pt): pt is { x: number; y: number } => !!pt
				)
				if (pts.length === 0) return null
				const sum = pts.reduce(
					(acc, q) => ({ x: acc.x + q.x, y: acc.y + q.y }),
					{ x: 0, y: 0 }
				)
				return { x: sum.x / pts.length, y: sum.y / pts.length }
			}
		}
	}

	function drawSegmentsAndMarkers(
		p: Array<{ x: number; y: number } | undefined>,
		faces: Record<
			string,
			{ points: Array<{ x: number; y: number } | undefined> }
		>
	) {
		// Back-compat: map legacy diagonals to segments if any were provided
		const allSegments: Array<{
			from:
				| { type: "vertex"; index: number }
				| { type: "edgeMidpoint"; a: number; b: number }
				| { type: "edgePoint"; a: number; b: number; t: number }
				| { type: "faceCentroid"; face: z.infer<typeof FaceName> }
			to:
				| { type: "vertex"; index: number }
				| { type: "edgeMidpoint"; a: number; b: number }
				| { type: "edgePoint"; a: number; b: number; t: number }
				| { type: "faceCentroid"; face: z.infer<typeof FaceName> }
			label: string | null
		}> = []
		for (const d of diagonals) {
			allSegments.push({
				from: { type: "vertex", index: d.fromVertexIndex },
				to: { type: "vertex", index: d.toVertexIndex },
				label: d.label
			})
		}
		if (segments !== null) {
			for (const s of segments) {
				allSegments.push(s)
			}
		}

		for (const s of allSegments) {
			const from = resolveAnchor(s.from, p, faces)
			const to = resolveAnchor(s.to, p, faces)
			if (!from || !to) continue

			// Camera/renderer decides whether a line should be dashed or occluded.
			// For now, draw as solid; future occlusion logic will handle visibility.
			canvas.drawLine(from.x, from.y, to.x, to.y, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				dash: undefined
			})

			if (s.label) {
				const midX = (from.x + to.x) / 2
				const midY = (from.y + to.y) / 2
				const angle = Math.atan2(to.y - from.y, to.x - from.x)
				const offsetX = -Math.sin(angle) * 10
				const offsetY = Math.cos(angle) * 10
				canvas.drawText({
					x: midX + offsetX,
					y: midY + offsetY,
					text: s.label,
					fill: theme.colors.black,
					anchor: "middle",
					dominantBaseline: "middle",
					fontPx: theme.font.size.base,
					stroke: theme.colors.white,
					strokeWidth: 3,
					paintOrder: "stroke fill"
				})
			}
		}

		if (angleMarkers !== null) {
			for (const m of angleMarkers) {
				if (m.type !== "right") continue
				const at = resolveAnchor(m.at, p, faces)
				const from = resolveAnchor(m.from, p, faces)
				const to = resolveAnchor(m.to, p, faces)
				if (!at || !from || !to) continue

				// Build two unit vectors from 'at' to 'from' and 'to'
				const uVec = { x: from.x - at.x, y: from.y - at.y }
				const vVec = { x: to.x - at.x, y: to.y - at.y }
				const uLen = Math.hypot(uVec.x, uVec.y) || 1
				const vLen = Math.hypot(vVec.x, vVec.y) || 1
				const ux = (uVec.x / uLen) * m.sizePx
				const uy = (uVec.y / uLen) * m.sizePx
				const vx = (vVec.x / vLen) * m.sizePx
				const vy = (vVec.y / vLen) * m.sizePx

				const p0 = { x: at.x + ux, y: at.y + uy }
				const p1 = { x: p0.x + vx, y: p0.y + vy }
				const p2 = { x: at.x + vx, y: at.y + vy }

				canvas.drawLine(p0.x, p0.y, p1.x, p1.y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
				canvas.drawLine(p1.x, p1.y, p2.x, p2.y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			}
		}
	}

	switch (shape.type) {
		case "rectangularPrism": {
			// Use default dimensions for rectangular prism
			const w = 3
			const h = 4
			const l = 5 // depth

			// Build vertices in data space (origin at front-bottom-left)
			const raw = [
				{ x: 0, y: 0 }, // 0: front bottom left
				{ x: w, y: 0 }, // 1: front bottom right
				{ x: w, y: -h }, // 2: front top right
				{ x: 0, y: -h }, // 3: front top left
				{ x: l, y: -l * 0.5 }, // 4: back bottom left
				{ x: w + l, y: -l * 0.5 }, // 5: back bottom right
				{ x: w + l, y: -h - l * 0.5 }, // 6: back top right
				{ x: l, y: -h - l * 0.5 } // 7: back top left
			]
			const { project } = computeFit(raw)
			const p = raw.map(project)

			const faces = {
				frontFace: {
					points: [p[0], p[1], p[2], p[3]],
					color: "rgba(255,0,0,0.2)"
				},
				topFace: {
					points: [p[3], p[2], p[6], p[7]],
					color: "rgba(0,0,255,0.2)"
				},
				rightFace: {
					points: [p[1], p[5], p[6], p[2]],
					color: "rgba(0,255,0,0.2)"
				},
				bottomFace: {
					points: [p[0], p[4], p[5], p[1]],
					color: "rgba(255,255,0,0.2)"
				}
			}

			const getFaceSvg = (faceName: keyof typeof faces) => {
				const face = faces[faceName]
				const polygonPoints = face.points.filter(
					(pt): pt is { x: number; y: number } => !!pt
				)
				canvas.drawPolygon(polygonPoints, {
					fill: shadedFace === faceName ? face.color : "none",
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			}

			// const hidden = 'stroke="${theme.colors.black}" stroke-width="${theme.stroke.width.base}" stroke-dasharray="${theme.stroke.dasharray.dashedShort}"' // Unused variable
			// const _solid = 'stroke="${theme.colors.black}" stroke-width="${theme.stroke.width.base}"' // Not used, can be removed

			// Draw hidden elements first
			if (showHiddenEdges) {
				if (p[0] && p[4])
					canvas.drawLine(p[0].x, p[0].y, p[4].x, p[4].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					})
				if (p[4] && p[5])
					canvas.drawLine(p[4].x, p[4].y, p[5].x, p[5].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					})
				if (p[4] && p[7])
					canvas.drawLine(p[4].x, p[4].y, p[7].x, p[7].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					})
			}
			// Draw visible faces and edges
			getFaceSvg("frontFace")
			getFaceSvg("topFace")
			getFaceSvg("rightFace")

			// Segments and angle markers
			drawSegmentsAndMarkers(p, faces)

			for (const lab of labels) {
				if (lab.target === "height" && p[0] && p[3]) {
					const textX = p[0].x - 10
					const textY = (p[0].y + p[3].y) / 2
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "end",
						dominantBaseline: "middle"
					})
				}
				if (lab.target === "width" && p[0] && p[1]) {
					const textX = (p[0].x + p[1].x) / 2
					const textY = p[0].y + 15
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "middle"
					})
				}
				if (lab.target === "length" && p[1] && p[5]) {
					const textX = (p[1].x + p[5].x) / 2
					const textY = (p[1].y + p[5].y) / 2 + 10
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "middle",
						transform: "skewX(-25)"
					})
				}
			}
			break
		}
		case "triangularPrism": {
			// Use default dimensions for triangular prism
			const b = 4 // base length
			const h = 3 // triangle height
			const l = 5 // prism length
			const w = b

			// Build vertices in data space
			const raw = [
				{ x: 0, y: 0 }, // 0: front bottom left
				{ x: w, y: 0 }, // 1: front bottom right
				{ x: w / 2, y: -h }, // 2: front top
				{ x: l, y: -l * 0.5 }, // 3: back bottom left
				{ x: w + l, y: -l * 0.5 }, // 4: back bottom right
				{ x: w / 2 + l, y: -h - l * 0.5 } // 5: back top
			]
			const { project } = computeFit(raw)
			const p = raw.map(project)

			// Define faces for triangular prism
			const faces = {
				frontFace: { points: [p[0], p[1], p[2]], color: "rgba(255,0,0,0.2)" },
				backFace: {
					points: [p[3], p[4], p[5]],
					color: "rgba(128,128,128,0.2)"
				},
				bottomFace: {
					points: [p[0], p[1], p[4], p[3]],
					color: "rgba(255,255,0,0.2)"
				},
				leftFace: {
					points: [p[0], p[3], p[5], p[2]],
					color: "rgba(0,255,0,0.2)"
				},
				rightFace: {
					points: [p[1], p[2], p[5], p[4]],
					color: "rgba(0,0,255,0.2)"
				}
			}

			// Helper to draw face
			const drawFace = (faceName: keyof typeof faces) => {
				const face = faces[faceName]
				const polygonPoints = face.points.filter(
					(pt): pt is { x: number; y: number } => !!pt
				)
				canvas.drawPolygon(polygonPoints, {
					fill: shadedFace === faceName ? face.color : "none",
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			}

			// const hidden = 'stroke="${theme.colors.black}" stroke-width="${theme.stroke.width.base}" stroke-dasharray="${theme.stroke.dasharray.dashedShort}"' // Unused variable

			// Draw hidden edges first
			if (showHiddenEdges) {
				// Hidden back triangle edges
				if (p[3] && p[4])
					canvas.drawLine(p[3].x, p[3].y, p[4].x, p[4].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					})
				if (p[3] && p[5])
					canvas.drawLine(p[3].x, p[3].y, p[5].x, p[5].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					})
				if (p[4] && p[5])
					canvas.drawLine(p[4].x, p[4].y, p[5].x, p[5].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					})
			}

			// Draw visible faces
			drawFace("bottomFace")
			drawFace("leftFace")
			drawFace("rightFace")
			drawFace("frontFace")

			// Segments and angle markers
			drawSegmentsAndMarkers(p, faces)

			// Draw labels
			for (const lab of labels) {
				if (lab.target === "base" && p[0] && p[1]) {
					const textX = (p[0].x + p[1].x) / 2
					const textY = p[0].y + 15
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "middle"
					})
				} else if (lab.target === "height" && p[0] && p[2]) {
					const textX = p[0].x - 10
					const textY = (p[0].y + p[2].y) / 2
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "end",
						dominantBaseline: "middle"
					})
				} else if (lab.target === "length" && p[1] && p[4]) {
					const textX = (p[1].x + p[4].x) / 2
					const textY = (p[1].y + p[4].y) / 2 + 15
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "middle"
					})
				}
			}
			break
		}
		case "rectangularPyramid": {
			// Use default dimensions for rectangular pyramid
			const w = 3 // base width
			const l = 4 // base length
			const h = 5 // pyramid height

			// 5 vertices in data space
			const raw = [
				{ x: 0, y: 0 }, // 0: base front left
				{ x: w, y: 0 }, // 1: base front right
				{ x: w + l, y: -l * 0.5 }, // 2: base back right
				{ x: l, y: -l * 0.5 }, // 3: base back left
				{ x: w / 2 + l / 2, y: -h - l * 0.25 } // 4: apex
			]
			const { project } = computeFit(raw)
			const p = raw.map(project)

			// Define faces
			const faces = {
				baseFace: {
					points: [p[0], p[1], p[2], p[3]],
					color: "rgba(255,255,0,0.2)"
				},
				frontFace: { points: [p[0], p[1], p[4]], color: "rgba(255,0,0,0.2)" },
				rightFace: { points: [p[1], p[2], p[4]], color: "rgba(0,0,255,0.2)" },
				backFace: {
					points: [p[2], p[3], p[4]],
					color: "rgba(128,128,128,0.2)"
				},
				leftFace: { points: [p[3], p[0], p[4]], color: "rgba(0,255,0,0.2)" }
			}

			// Helper to draw face
			const drawFace = (faceName: keyof typeof faces) => {
				const face = faces[faceName]
				const polygonPoints = face.points.filter(
					(pt): pt is { x: number; y: number } => !!pt
				)
				canvas.drawPolygon(polygonPoints, {
					fill: shadedFace === faceName ? face.color : "none",
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			}

			// const hidden = 'stroke="${theme.colors.black}" stroke-width="${theme.stroke.width.base}" stroke-dasharray="${theme.stroke.dasharray.dashedShort}"' // Unused variable
			// const solid = 'stroke="${theme.colors.black}" stroke-width="${theme.stroke.width.base}"' // Unused variable

			// Draw hidden edges first
			if (showHiddenEdges) {
				// Hidden base edges
				if (p[0] && p[3])
					canvas.drawLine(p[0].x, p[0].y, p[3].x, p[3].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					})
				if (p[3] && p[2])
					canvas.drawLine(p[3].x, p[3].y, p[2].x, p[2].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					})
				// Hidden edge from back left base to apex
				if (p[3] && p[4])
					canvas.drawLine(p[3].x, p[3].y, p[4].x, p[4].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					})
			}

			// Draw visible faces
			drawFace("frontFace")
			drawFace("rightFace")
			drawFace("leftFace")

			// Draw visible edges that aren't part of filled faces (or are drawn on top)
			if (p[0] && p[1])
				canvas.drawLine(p[0].x, p[0].y, p[1].x, p[1].y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			if (p[1] && p[2])
				canvas.drawLine(p[1].x, p[1].y, p[2].x, p[2].y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			if (p[2] && p[4])
				canvas.drawLine(p[2].x, p[2].y, p[4].x, p[4].y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})

			// Segments and angle markers
			drawSegmentsAndMarkers(p, faces)

			// Draw labels
			for (const lab of labels) {
				if (lab.target === "baseWidth" && p[0] && p[1]) {
					const textX = (p[0].x + p[1].x) / 2
					const textY = p[0].y + 15
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "middle"
					})
				} else if (lab.target === "baseLength" && p[1] && p[2]) {
					const textX = (p[1].x + p[2].x) / 2
					const textY = (p[1].y + p[2].y) / 2 + 15
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "middle"
					})
				} else if (lab.target === "height" && p[4]) {
					// Draw height line from base center to apex
					if (p[0] && p[2]) {
						const baseCenterX = (p[0].x + p[2].x) / 2
						const baseCenterY = (p[0].y + p[2].y) / 2
						canvas.drawLine(baseCenterX, baseCenterY, p[4].x, p[4].y, {
							stroke: theme.colors.gridMinor,
							strokeWidth: theme.stroke.width.thin,
							dash: theme.stroke.dasharray.dotted
						})
						const textX = baseCenterX - 10
						const textY = (baseCenterY + p[4].y) / 2
						canvas.drawText({
							x: textX,
							y: textY,
							text: lab.text,
							anchor: "end",
							dominantBaseline: "middle"
						})
					}
				}
			}
			break
		}
		case "triangularPyramid": {
			// Use default dimensions for triangular pyramid
			const b = 4 // base length
			const h = 3 // base height
			const pyrH = 5 // pyramid height

			// Build vertices in data space
			const frontLeft = { x: 0, y: 0 }
			const frontRight = { x: b, y: 0 }
			const backVertex = { x: b / 2 + h, y: -h * 0.5 }
			const base_centroid_x = (frontLeft.x + frontRight.x + backVertex.x) / 3
			const base_centroid_y = (frontLeft.y + frontRight.y + backVertex.y) / 3
			const apexRaw = { x: base_centroid_x, y: base_centroid_y - pyrH }
			const raw = [frontLeft, frontRight, backVertex, apexRaw]
			const { project } = computeFit(raw)
			const p = raw.map(project)

			// Define faces
			const faces = {
				baseFace: { points: [p[0], p[1], p[2]], color: "rgba(255,255,0,0.2)" },
				frontFace: { points: [p[0], p[1], p[3]], color: "rgba(255,0,0,0.2)" },
				rightFace: { points: [p[1], p[2], p[3]], color: "rgba(0,0,255,0.2)" },
				leftFace: { points: [p[2], p[0], p[3]], color: "rgba(0,255,0,0.2)" }
			}

			// Helper to draw face
			const drawFace = (faceName: keyof typeof faces) => {
				const face = faces[faceName]
				const polygonPoints = face.points.filter(
					(pt): pt is { x: number; y: number } => !!pt
				)
				canvas.drawPolygon(polygonPoints, {
					fill: shadedFace === faceName ? face.color : "none",
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			}

			// const hidden = 'stroke="${theme.colors.black}" stroke-width="${theme.stroke.width.base}" stroke-dasharray="${theme.stroke.dasharray.dashedShort}"' // Unused variable
			// const solid = 'stroke="${theme.colors.black}" stroke-width="${theme.stroke.width.base}"' // Unused variable

			// Draw hidden edges first
			if (showHiddenEdges) {
				// Edges of the base triangle that might be hidden or partially hidden from front view
				if (p[0] && p[2])
					canvas.drawLine(p[0].x, p[0].y, p[2].x, p[2].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					}) // Back-left base edge
				if (p[1] && p[2])
					canvas.drawLine(p[1].x, p[1].y, p[2].x, p[2].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					}) // Back-right base edge
				// Edge from the back base vertex to the apex
				if (p[2] && p[3])
					canvas.drawLine(p[2].x, p[2].y, p[3].x, p[3].y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash: theme.stroke.dasharray.dashedShort
					})
			}

			// Draw faces (order matters for overlapping with semi-transparent fills)
			drawFace("baseFace")
			drawFace("frontFace")
			drawFace("rightFace")
			drawFace("leftFace")

			// Draw visible edges that are not covered by faces (front base edge, and edges to apex)
			if (p[0] && p[1])
				canvas.drawLine(p[0].x, p[0].y, p[1].x, p[1].y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				}) // Front base edge
			if (p[0] && p[3])
				canvas.drawLine(p[0].x, p[0].y, p[3].x, p[3].y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				}) // Front-left edge to apex
			if (p[1] && p[3])
				canvas.drawLine(p[1].x, p[1].y, p[3].x, p[3].y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				}) // Front-right edge to apex

			// Segments and angle markers
			drawSegmentsAndMarkers(p, faces)

			// Draw labels
			for (const lab of labels) {
				if (lab.target === "baseLength" && p[0] && p[1]) {
					// Label for the base triangle's 'b' (front edge)
					const textX = (p[0].x + p[1].x) / 2
					const textY = p[0].y + 15
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "middle"
					})
				} else if (lab.target === "baseHeight" && p[0] && p[1] && p[2]) {
					// Label for the base triangle's 'h' (perpendicular height/depth)
					// Draw a guide line from midpoint of front base to back vertex
					const mid_p0_p1_x = (p[0].x + p[1].x) / 2
					const mid_p0_p1_y = (p[0].y + p[1].y) / 2
					canvas.drawLine(mid_p0_p1_x, mid_p0_p1_y, p[2].x, p[2].y, {
						stroke: theme.colors.gridMinor,
						strokeWidth: theme.stroke.width.thin,
						dash: theme.stroke.dasharray.dotted
					})
					const textX = (mid_p0_p1_x + p[2].x) / 2 + 10
					const textY = (mid_p0_p1_y + p[2].y) / 2
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "start",
						dominantBaseline: "middle"
					})
				} else if (lab.target === "height" && p[0] && p[1] && p[2] && p[3]) {
					// Label for pyramid height
					// Draw height line from base centroid to apex
					const base_centroid_x_for_label = (p[0].x + p[1].x + p[2].x) / 3
					const base_centroid_y_for_label = (p[0].y + p[1].y + p[2].y) / 3
					canvas.drawLine(
						base_centroid_x_for_label,
						base_centroid_y_for_label,
						p[3].x,
						p[3].y,
						{
							stroke: theme.colors.gridMinor,
							strokeWidth: theme.stroke.width.thin,
							dash: theme.stroke.dasharray.dotted
						}
					)
					const textX = base_centroid_x_for_label - 10
					const textY = (base_centroid_y_for_label + p[3].y) / 2
					canvas.drawText({
						x: textX,
						y: textY,
						text: lab.text,
						anchor: "end",
						dominantBaseline: "middle"
					})
				}
			}
			break
		}
	}
	// Final assembly with dynamic width
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	const viewBox = `${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}`
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
