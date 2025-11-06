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

// A simple, safe regex for identifiers.
const identifierRegex = /^[A-Za-z0-9_]+$/

/**
 * Defines a structured label for dimensions, separating the numeric or variable
 * value from its unit for clear, consistent rendering.
 *
 * Factory pattern to avoid shared Zod instances which cause $ref generation.
 */
function createLabelSchema() {
	return z
		.object({
			value: z
				.union([z.number(), z.string()])
				.describe(
					"Numerical value or algebraic variable for the dimension label. Examples: 10, 7.5, 'x', '2y+3'. Use strings for variables or expressions."
				),
			unit: z
				.string()
				.nullable()
				.describe(
					"Measurement unit for the value. Common units: 'cm', 'in', 'm', 'ft', 'mm'. Set to null when no unit applies (pure numbers, ratios, or when unit is contextually understood)."
				)
		})
		.strict()
		.nullable()
}

/**
 * Defines a single vertex with a unique ID and coordinates.
 * This is the single source of truth for all points in the diagram.
 *
 * Factory to prevent $ref generation.
 */
function createVertexSchema() {
	return z
		.object({
			id: z
				.string()
				.regex(identifierRegex)
				.describe(
					"Unique identifier for this vertex point. Use descriptive names like 'A', 'B', 'topLeft', 'center', 'midpoint1'. This ID is referenced throughout the schema to define edges, regions, and markers."
				),
			x: z
				.number()
				.describe(
					"Horizontal position in the diagram's coordinate system. Use any convenient scale - the diagram auto-centers and scales to fit the canvas. Positive values go rightward from the origin."
				),
			y: z
				.number()
				.describe(
					"Vertical position in the diagram's coordinate system. Positive values go downward from the origin, following standard screen/SVG conventions."
				)
		})
		.strict()
}

/**
 * Describes a single, labeled segment that is part of a larger partitioned edge.
 * This is the building block for creating boundaries with multiple labels.
 *
 * Factory to prevent $ref generation.
 */
function createPartitionedSegmentSchema() {
	return z
		.object({
			label: createLabelSchema().describe(
				"Dimension label for this segment portion. Set to null for unlabeled segments. Each segment in a partitioned edge can have its own measurement or variable."
			),
			style: z
				.enum(["solid", "dashed"])
				.describe(
					"Line style for this segment. Use 'solid' for measured/known dimensions and 'dashed' for construction lines, unknown measurements, or auxiliary segments."
				)
		})
		.strict()
}

/**
 * A discriminated union to explicitly define a boundary edge.
 * An edge can either be a simple line between two vertices or a
 * complex path composed of multiple, individually labeled segments.
 *
 * Factory to prevent $ref generation.
 */
function createBoundaryEdgeSchema() {
	return z.discriminatedUnion("type", [
		z
			.object({
				type: z
					.literal("simple")
					.describe(
						"Single straight line edge connecting two vertices directly."
					),
				from: z
					.string()
					.regex(identifierRegex)
					.describe(
						"Starting vertex ID for this edge. Must reference a valid vertex ID from the vertices array."
					),
				to: z
					.string()
					.regex(identifierRegex)
					.describe(
						"Ending vertex ID for this edge. Must reference a valid vertex ID from the vertices array."
					),
				label: createLabelSchema().describe(
					"Measurement label for the entire edge length. Set to null for unlabeled edges."
				)
			})
			.strict(),
		z
			.object({
				type: z
					.literal("partitioned")
					.describe(
						"Multi-segment edge path with individual labels for each segment."
					),
				path: z
					.array(z.string().regex(identifierRegex))
					.min(3)
					.describe(
						"Ordered sequence of vertex IDs forming the edge path. Example: ['A', 'midpoint', 'B'] creates two segments. Minimum 3 vertices required."
					),
				segments: z
					.array(createPartitionedSegmentSchema())
					.describe(
						"Segment definitions for each path section. Array length must equal path.length - 1. Each segment can have its own label and style."
					)
			})
			.strict()
	])
}

/**
 * Defines a line segment that is *internal* to the shape, used for decomposition.
 *
 * Factory to prevent $ref generation.
 */
function createInternalSegmentSchema() {
	return z
		.object({
			fromVertexId: z
				.string()
				.regex(identifierRegex)
				.describe(
					"Starting vertex ID for the internal line segment. Must reference a vertex from the vertices array."
				),
			toVertexId: z
				.string()
				.regex(identifierRegex)
				.describe(
					"Ending vertex ID for the internal line segment. Must reference a vertex from the vertices array."
				),
			style: z
				.enum(["solid", "dashed"])
				.describe(
					"Line appearance. Use 'solid' for structural divisions and 'dashed' for construction lines, heights, or auxiliary measurements."
				),
			label: createLabelSchema().describe(
				"Measurement or name label for this internal segment. Set to null for construction lines without labels."
			)
		})
		.strict()
}

/**
 * Defines a shaded polygonal region within the composite shape.
 *
 * Factory to prevent $ref generation.
 */
function createShadedRegionSchema() {
	return z
		.object({
			vertexIds: z
				.array(z.string().regex(identifierRegex))
				.min(3)
				.describe(
					"Ordered list of vertex IDs forming the polygon boundary for shading. Vertices should be listed in clockwise or counter-clockwise order. Minimum 3 vertices required."
				),
			fillColor: z
				.string()
				.regex(CSS_COLOR_PATTERN)
				.describe(
					"CSS color value for the shaded region. Examples: '#FFE5CC' (hex), 'rgba(255,229,204,0.5)' (with transparency), 'lightblue' (named color). Use rgba with alpha < 1.0 for semi-transparent overlays."
				)
		})
		.strict()
}

/**
 * Path-composed shaded region across shapes (polygons and circles) using even-odd fill.
 * Matches the superior model used in nested-shape-diagram.
 */
function createShadedPathRegionSchema() {
	return z
		.object({
			fillColor: z
				.string()
				.regex(CSS_COLOR_PATTERN)
				.describe(
					"CSS color for composed shading. Use rgba with alpha < 1.0 for transparency."
				),
			path: z
				.array(
					z
						.object({
							shapeId: z.string().describe("ID of a shape in the shapes array"),
							pathType: z
								.enum(["outer", "inner"])
								.describe(
									"whether to traverse this shape's outer or inner boundary"
								)
						})
						.strict()
				)
				.min(1)
				.describe("Ordered path segments composing this region across shapes.")
		})
		.strict()
}

/**
 * Factory for shape union used to describe geometry for composed shading and circle support.
 * Using a factory avoids shared Zod instances which would otherwise generate `$ref`s
 * during OpenAI JSON Schema conversion.
 */
function createCompositeShapeSchema() {
	return z.discriminatedUnion("type", [
		z
			.object({
				id: z.string(),
				type: z.literal("polygon"),
				vertexIds: z.array(z.string()).min(3)
			})
			.strict(),
		z
			.object({
				id: z.string(),
				type: z.literal("circle"),
				centerId: z.string(),
				radius: z.number().positive()
			})
			.strict()
	])
}

/**
 * Defines a text label placed at an arbitrary position inside a region.
 *
 * Factory to prevent $ref generation.
 */
function createRegionLabelSchema() {
	return z
		.object({
			text: z
				.string()
				.describe(
					"Text content for the region label. Examples: 'Region A', '45 cm²', 'Area = 12x', 'Triangle ABC'. Use for area calculations, region names, or mathematical expressions."
				),
			position: z
				.object({
					x: z
						.number()
						.describe(
							"Horizontal coordinate for label placement, using the same coordinate system as vertices. Position should be inside the intended region."
						),
					y: z
						.number()
						.describe(
							"Vertical coordinate for label placement, using the same coordinate system as vertices. Positive y goes downward."
						)
				})
				.strict()
		})
		.strict()
}

/**
 * Defines a right-angle marker at a vertex.
 *
 * Factory to prevent $ref generation.
 */
function createRightAngleMarkerSchema() {
	return z
		.object({
			cornerVertexId: z
				.string()
				.regex(identifierRegex)
				.describe(
					"Vertex ID where the 90° angle is located. This is the corner vertex where the right angle marker will be drawn."
				),
			adjacentVertex1Id: z
				.string()
				.regex(identifierRegex)
				.describe(
					"ID of the first vertex connected to the corner, forming one side of the right angle. Must be connected to cornerVertexId by an edge."
				),
			adjacentVertex2Id: z
				.string()
				.regex(identifierRegex)
				.describe(
					"ID of the second vertex connected to the corner, forming the other side of the right angle. Must be connected to cornerVertexId by an edge."
				)
		})
		.strict()
}

/**
 * Creates complex composite polygons with internal divisions, shaded regions, and geometric annotations.
 * This API is designed to be explicit and robust, defining the shape's perimeter as a collection of `boundaryEdges`.
 * This approach avoids ambiguity and allows for clear, semantically correct definitions of complex boundaries with multiple labels.
 */
export const CompositeShapeDiagramPropsSchema = z
	.object({
		type: z
			.literal("compositeShapeDiagram")
			.describe(
				"Widget type identifier for composite shape diagrams with complex polygons and annotations."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		vertices: z
			.array(createVertexSchema())
			.describe(
				"Complete list of all vertex points defining the shape geometry. Each vertex needs a unique ID for referencing in edges, regions, and markers. Define vertices in logical coordinates - scaling is automatic."
			),

		boundaryEdges: z
			.array(createBoundaryEdgeSchema())
			.describe(
				"Ordered sequence of edges forming the shape's outer perimeter. Each edge connects vertices and can have measurement labels. Use simple edges for single measurements or partitioned edges for multi-segment boundaries."
			),

		// Optional shapes for composed shading and circle support (transplanted from nested-shape-diagram)
		shapes: z
			.array(createCompositeShapeSchema())
			.nullable()
			.describe(
				"Optional shapes collection supporting polygons and circles. Enables composed shaded regions and circle outlines. Use null when no shapes are needed."
			),

		internalSegments: z
			.array(createInternalSegmentSchema())
			.nullable()
			.describe(
				"Optional internal line segments for shape decomposition and analysis. Common uses: heights, medians, diagonals, construction lines. These appear inside the boundary and can show measurements or structural divisions."
			),

		shadedRegions: z
			.array(
				z.union([createShadedRegionSchema(), createShadedPathRegionSchema()])
			)
			.nullable()
			.describe(
				"Optional colored regions. Supports either polygonal regions (vertexIds) or composed regions across shapes via path with even-odd fill."
			),

		regionLabels: z
			.array(createRegionLabelSchema())
			.nullable()
			.describe(
				"Optional text labels placed at specific coordinates within regions. Use for area calculations, region names, formulas, or annotations that need precise positioning."
			),

		rightAngleMarkers: z
			.array(createRightAngleMarkerSchema())
			.nullable()
			.describe(
				"Optional 90° angle indicators drawn as small squares at vertices. Specify the corner vertex and its two adjacent vertices to show perpendicular relationships."
			),

		// Rendering fit control to enable parity with nested-shape-diagram when needed
		fit: z
			.enum(["auto", "none"]) // no defaulting here to avoid schema-level silent fallbacks
			.nullable()
			.describe(
				"Rendering fit mode. 'auto' scales and centers to the canvas; 'none' renders in data coordinates for snapshot parity with nested-shape-diagram."
			)
	})
	.strict()

export type CompositeShapeDiagramProps = z.infer<
	typeof CompositeShapeDiagramPropsSchema
>
type Point = { x: number; y: number }
type Label = z.infer<ReturnType<typeof createLabelSchema>>

// Helper function to format the label object into a display string.
const formatLabel = (label: Label): string | null => {
	if (!label) return null
	if (label.unit) {
		return `${label.value} ${label.unit}`
	}
	return String(label.value)
}

// Type guards for shaded region union without unsafe casts
type ShadedPolygonRegion = { vertexIds: string[]; fillColor: string }
type ShadedPathRegion = {
	fillColor: string
	path: Array<{ shapeId: string; pathType: "outer" | "inner" }>
}
function isShadedPolygonRegion(x: unknown): x is ShadedPolygonRegion {
	return (
		typeof x === "object" && x !== null && "vertexIds" in x && "fillColor" in x
	)
}
function isShadedPathRegion(x: unknown): x is ShadedPathRegion {
	return typeof x === "object" && x !== null && "path" in x && "fillColor" in x
}

// Geometry helpers used for radius-aware placement (ported and hardened)
type Vec = { x: number; y: number }
function distance(a: Vec, b: Vec): number {
	const dx = b.x - a.x
	const dy = b.y - a.y
	return Math.hypot(dx, dy)
}
function segmentIntersectionParamT(
	p: Vec,
	r: Vec,
	q: Vec,
	s: Vec
): number | null {
	const rx = r.x - p.x
	const ry = r.y - p.y
	const sx = s.x - q.x
	const sy = s.y - q.y
	const denom = rx * sy - ry * sx
	if (denom === 0) return null
	const qpx = q.x - p.x
	const qpy = q.y - p.y
	const t = (qpx * sy - qpy * sx) / denom
	const u = (qpx * ry - qpy * rx) / denom
	if (t < 0 || t > 1) return null
	if (u < 0 || u > 1) return null
	return t
}
function computeSafeBasePointForRadius(
	center: Vec,
	end: Vec,
	shapes: ReadonlyArray<
		| { type: "polygon"; id: string; vertexIds: string[] }
		| { type: "circle"; id: string; centerId: string; radius: number }
	>,
	getVertex: (id: string) => Vec | undefined,
	perpendicularOffsetPx: number,
	pxToData: number
): Vec {
	const totalLen = distance(center, end)
	if (!(totalLen > 0)) {
		logger.error("composite-shape: radius base degenerate length")
		throw errors.new("composite-shape: radius base degenerate length")
	}

	// Compute buffers adaptively in pixel space to avoid eliminating the entire segment for short radii
	const totalLenPx = totalLen / Math.max(pxToData, 1e-9)
	const nearCenterPx = Math.min(20, totalLenPx * 0.25)
	const nearCirclePx = Math.min(perpendicularOffsetPx + 12, totalLenPx * 0.25)
	const intersectionBufferPx = Math.min(15, Math.max(4, totalLenPx * 0.1))
	const bufferNearCenterData = nearCenterPx * pxToData
	const bufferNearCircleData = nearCirclePx * pxToData

	const tMinRaw = bufferNearCenterData / totalLen
	const tMaxRaw = 1 - bufferNearCircleData / totalLen
	let tMin = tMinRaw
	let tMax = tMaxRaw
	if (tMin < 0) tMin = 0
	if (tMax > 1) tMax = 1
	if (tMin >= tMax) {
		logger.error("composite-shape: radius base no interval")
		throw errors.new("composite-shape: radius base no interval")
	}

	const intersectionTs: number[] = []
	for (const shape of shapes) {
		if (shape.type === "polygon") {
			const ids = shape.vertexIds
			if (ids && ids.length > 1) {
				const pts: Vec[] = []
				for (const id of ids) {
					const v = getVertex(id)
					if (v) pts.push(v)
				}
				for (let i = 0; i < pts.length; i++) {
					const a = pts[i]
					const b = pts[(i + 1) % pts.length]
					const t = segmentIntersectionParamT(center, end, a, b)
					if (t !== null && t > 0 && t < 1) intersectionTs.push(t)
				}
			}
		}
	}

	const forbiddens: Array<{ start: number; end: number }> = []
	forbiddens.push({ start: tMin, end: tMin })
	const bufferT = (intersectionBufferPx * pxToData) / totalLen
	for (const t of intersectionTs) {
		const start = t - bufferT
		const end = t + bufferT
		forbiddens.push({ start, end })
	}

	const merged: Array<{ start: number; end: number }> = []
	const sorted = forbiddens
		.map((iv) => ({ start: Math.max(iv.start, 0), end: Math.min(iv.end, 1) }))
		.filter((iv) => iv.end > iv.start)
		.sort((i1, i2) => {
			if (i1.start < i2.start) return -1
			if (i1.start > i2.start) return 1
			return 0
		})
	for (const iv of sorted) {
		if (merged.length === 0) {
			merged.push({ start: iv.start, end: iv.end })
		} else {
			const last = merged[merged.length - 1]
			if (iv.start <= last.end) {
				if (iv.end > last.end) last.end = iv.end
			} else {
				merged.push({ start: iv.start, end: iv.end })
			}
		}
	}

	let allowed: Array<{ start: number; end: number }> = []
	let cursor = tMin
	for (const f of merged) {
		if (f.end < tMin) continue
		if (f.start > tMax) break
		const segStart = cursor
		const segEnd = Math.min(f.start, tMax)
		if (segEnd > segStart) allowed.push({ start: segStart, end: segEnd })
		if (f.end > cursor) cursor = Math.max(f.end, cursor)
		if (cursor >= tMax) break
	}
	if (cursor < tMax) allowed.push({ start: cursor, end: tMax })

	if (allowed.length === 0) {
		logger.error("composite-shape: radius base no safe interval")
		throw errors.new("composite-shape: radius base no safe interval")
	}

	let best = allowed[0]
	let bestSpan = best.end - best.start
	for (let i = 1; i < allowed.length; i++) {
		const span = allowed[i].end - allowed[i].start
		if (span > bestSpan) {
			best = allowed[i]
			bestSpan = span
		}
	}
	const tChosen = (best.start + best.end) / 2
	const baseX = center.x + (end.x - center.x) * tChosen
	const baseY = center.y + (end.y - center.y) * tChosen
	return { x: baseX, y: baseY }
}

/**
 * Generates a diagram of a composite polygon from a set of vertices. Ideal for area
 * problems involving the decomposition of a complex shape into simpler figures.
 */
export const generateCompositeShapeDiagram: WidgetGenerator<
	typeof CompositeShapeDiagramPropsSchema
> = async (data) => {
	const { width, height, vertices, boundaryEdges } = data
	const internalSegments = data.internalSegments
	const shadedRegions = data.shadedRegions
	const regionLabels = data.regionLabels
	const rightAngleMarkers = data.rightAngleMarkers
	const shapes = data.shapes
	const fit = data.fit

	if (vertices.length === 0) {
		logger.error("composite-shape: no vertices")
		throw errors.new("composite-shape: no vertices")
	}

	const vertexMap = new Map(vertices.map((v) => [v.id, { x: v.x, y: v.y }]))

	// --- Data Validation ---
	for (const edge of boundaryEdges) {
		if (edge.type === "partitioned") {
			if (edge.segments.length !== edge.path.length - 1) {
				logger.error("Partitioned edge segment/path mismatch", {
					pathCount: edge.path.length,
					segmentCount: edge.segments.length
				})
				throw errors.new(
					`For a partitioned edge, segments length (${edge.segments.length}) must be one less than path length (${edge.path.length}).`
				)
			}
		}
	}
	// --- End Validation ---

	// Fit-to-canvas projection (uniform scale + centering)
	const allPoints: Point[] = [
		...vertices.map((v) => ({ x: v.x, y: v.y })),
		...(regionLabels
			? regionLabels.map((l) => ({ x: l.position.x, y: l.position.y }))
			: [])
	]

	const computeFit = (points: Point[]) => {
		if (points.length === 0) return { scale: 1, project: (p: Point) => p }
		const minX = Math.min(...points.map((p) => p.x))
		const maxX = Math.max(...points.map((p) => p.x))
		const minY = Math.min(...points.map((p) => p.y))
		const maxY = Math.max(...points.map((p) => p.y))
		const rawW = maxX - minX
		const rawH = maxY - minY
		if (!(rawW > 0) || !(rawH > 0)) {
			logger.error("composite-shape: fit degenerate bounds", {
				width: rawW,
				height: rawH
			})
			throw errors.new("composite-shape: fit degenerate bounds")
		}
		const scale = Math.min(
			(width - 2 * PADDING) / rawW,
			(height - 2 * PADDING) / rawH
		)
		const offsetX = (width - scale * rawW) / 2 - scale * minX
		const offsetY = (height - scale * rawH) / 2 - scale * minY
		const project = (p: Point) => ({
			x: offsetX + scale * p.x,
			y: offsetY + scale * p.y
		})
		return { scale, project }
	}

	// Fit selection: default to auto when unspecified for backward-compat
	let scale = 1
	let project = (p: Point) => p
	if (fit === "none") {
		// identity projection keeps data coordinates as-is
		scale = 1
		project = (p: Point) => p
	} else {
		const fitted = computeFit(allPoints)
		scale = fitted.scale
		project = fitted.project
	}
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// 1. Shaded regions (drawn first)
	if (shadedRegions) {
		for (const region of shadedRegions) {
			// union: polygon-style or composed path-style
			if (isShadedPolygonRegion(region)) {
				const r = region
				const regionPoints = r.vertexIds
					.map((id) => vertexMap.get(id))
					.filter((p): p is Point => !!p)
					.map(project)
				if (regionPoints.length < 3) {
					logger.error(
						"composite-shape: shaded polygon insufficient vertices",
						{
							count: regionPoints.length
						}
					)
					throw errors.new(
						"composite-shape: shaded polygon insufficient vertices"
					)
				}
				canvas.drawPolygon(regionPoints, { fill: r.fillColor, stroke: "none" })
			} else if (isShadedPathRegion(region)) {
				// composed path requires shapes
				if (!shapes || shapes.length === 0) {
					logger.error("composite-shape: composed shaded region without shapes")
					throw errors.new(
						"composite-shape: composed shaded region without shapes"
					)
				}
				const r = region
				const path2d = new Path2D()
				for (const part of r.path) {
					const shape = shapes.find((s) => s.id === part.shapeId)
					if (!shape) {
						logger.error("composite-shape: shaded path unknown shape", {
							shapeId: part.shapeId
						})
						throw errors.new("composite-shape: shaded path unknown shape")
					}
					if (shape.type === "polygon") {
						const ids = shape.vertexIds
						if (ids.length < 3) {
							logger.error("composite-shape: polygon shape too few vertices", {
								shapeId: shape.id
							})
							throw errors.new(
								"composite-shape: polygon shape too few vertices"
							)
						}
						const first = vertexMap.get(ids[0])
						if (!first) {
							logger.error("composite-shape: polygon shading missing vertex", {
								shapeId: shape.id,
								vertexId: ids[0]
							})
							throw errors.new("composite-shape: polygon missing vertex")
						}
						const q0 = project(first)
						path2d.moveTo(q0.x, q0.y)
						for (let i = 1; i < ids.length; i++) {
							const p = vertexMap.get(ids[i])
							if (!p) {
								logger.error(
									"composite-shape: polygon shading missing vertex",
									{
										shapeId: shape.id,
										vertexId: ids[i]
									}
								)
								throw errors.new("composite-shape: polygon missing vertex")
							}
							const q = project(p)
							path2d.lineTo(q.x, q.y)
						}
						path2d.closePath()
					} else {
						const c = vertexMap.get(shape.centerId)
						if (!c) {
							logger.error("composite-shape: circle shading missing center", {
								shapeId: shape.id
							})
							throw errors.new("composite-shape: circle center missing")
						}
						const center = project(c)
						const rData = shape.radius * scale
						if (!(rData > 0)) {
							logger.error("composite-shape: invalid circle radius", {
								shapeId: shape.id,
								radius: shape.radius
							})
							throw errors.new("composite-shape: invalid circle radius")
						}
						// approximate full circle using arcTo API provided by Path2D helper
						path2d.moveTo(center.x + rData, center.y)
						path2d.arcTo(rData, rData, 0, 1, 1, center.x - rData, center.y)
						path2d.arcTo(rData, rData, 0, 1, 1, center.x + rData, center.y)
						path2d.closePath()
					}
				}

				// 1b. Draw shapes outlines (to match nested-shape-diagram rendering)
				if (shapes && shapes.length > 0) {
					for (const shape of shapes) {
						if (shape.type === "polygon") {
							const pts: Point[] = []
							for (const id of shape.vertexIds) {
								const v = vertexMap.get(id)
								if (!v) {
									logger.error(
										"composite-shape: polygon outline missing vertex",
										{
											vertexId: id,
											shapeId: shape.id
										}
									)
									throw errors.new("composite-shape: polygon missing vertex")
								}
								pts.push(project(v))
							}
							canvas.drawPolyline(pts, {
								stroke: theme.colors.axis,
								strokeWidth: theme.stroke.width.base
							})
						} else {
							const c = vertexMap.get(shape.centerId)
							if (!c) {
								logger.error("composite-shape: circle outline missing center", {
									shapeId: shape.id
								})
								throw errors.new("composite-shape: circle center missing")
							}
							const center = project(c)
							const rPx = shape.radius * scale
							canvas.drawCircle(center.x, center.y, rPx, {
								stroke: theme.colors.axis,
								strokeWidth: theme.stroke.width.base,
								fill: "none"
							})
						}
					}
				}
				canvas.drawPath(path2d, { fill: r.fillColor, fillRule: "evenodd" })
			} else {
				logger.error("composite-shape: shaded region type unsupported")
				throw errors.new("composite-shape: shaded region type unsupported")
			}
		}
	}

	// 2. Main shape boundary and its labels
	const outerBoundaryPath = new Path2D()
	const transformedPerimeter: Array<{ x: number; y: number }> = []
	for (const [index, edge] of boundaryEdges.entries()) {
		if (edge.type === "simple") {
			const from = vertexMap.get(edge.from)
			const to = vertexMap.get(edge.to)
			if (!from || !to) {
				logger.error("composite-shape: boundary simple edge missing vertex", {
					from: edge.from,
					to: edge.to
				})
				throw errors.new("composite-shape: boundary simple missing vertex")
			}

			const pFrom = project(from)
			if (index === 0) {
				outerBoundaryPath.moveTo(pFrom.x, pFrom.y)
				transformedPerimeter.push(pFrom)
			}
			const pTo = project(to)
			outerBoundaryPath.lineTo(pTo.x, pTo.y)
			transformedPerimeter.push(pTo)
		} else {
			// Partitioned edge
			const pathPointsRaw = edge.path.map((id) => vertexMap.get(id))
			if (pathPointsRaw.some((p) => !p)) {
				logger.error(
					"composite-shape: boundary partitioned path missing vertex"
				)
				throw errors.new("composite-shape: boundary partitioned missing vertex")
			}
			const pathPoints: Point[] = pathPointsRaw.filter((p): p is Point =>
				Boolean(p)
			)

			if (index === 0 && pathPoints[0]) {
				const first = project(pathPoints[0])
				outerBoundaryPath.moveTo(first.x, first.y)
				transformedPerimeter.push(first)
			}
			for (let i = 1; i < pathPoints.length; i++) {
				const point = pathPoints[i]
				if (point) {
					const pt = project(point)
					outerBoundaryPath.lineTo(pt.x, pt.y)
					transformedPerimeter.push(pt)
				}
			}

			for (let i = 0; i < edge.segments.length; i++) {
				const from = pathPoints[i]
				const to = pathPoints[i + 1]
				const segment = edge.segments[i]
				if (!from || !to || !segment) {
					logger.error("composite-shape: boundary partitioned segment mismatch")
					throw errors.new(
						"composite-shape: boundary partitioned segment mismatch"
					)
				}

				const p1 = project(from)
				const p2 = project(to)
				const dash =
					segment.style === "dashed" ? theme.stroke.dasharray.dashed : undefined
				canvas.drawLine(p1.x, p1.y, p2.x, p2.y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base,
					dash
				})
			}
		}
	}
	canvas.drawPath(outerBoundaryPath.closePath(), {
		fill: "none",
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick
	})

	// Build perimeter segments for collision checks
	const perimeterSegments: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = []
	for (let i = 0; i < transformedPerimeter.length; i++) {
		const a = transformedPerimeter[i]
		const b = transformedPerimeter[(i + 1) % transformedPerimeter.length]
		if (a && b) perimeterSegments.push({ a, b })
	}

	// 2b. Boundary simple-edge labels with collision avoidance
	for (const edge of boundaryEdges) {
		if (edge.type !== "simple") continue
		const from = vertexMap.get(edge.from)
		const to = vertexMap.get(edge.to)
		if (!from || !to) {
			logger.error("composite-shape: simple edge label missing vertex", {
				from: edge.from,
				to: edge.to
			})
			throw errors.new("composite-shape: simple edge label missing vertex")
		}
		const labelText = formatLabel(edge.label)
		if (!labelText) continue
		const sFrom = project(from)
		const sTo = project(to)
		const midX = (sFrom.x + sTo.x) / 2
		const midY = (sFrom.y + sTo.y) / 2
		const dx = sTo.x - sFrom.x
		const dy = sTo.y - sFrom.y
		const len = Math.hypot(dx, dy)
		if (len === 0) continue
		let nx = -dy / len
		let ny = dx / len
		const polyCenterX =
			transformedPerimeter.reduce((sum, v) => sum + v.x, 0) /
			Math.max(transformedPerimeter.length, 1)
		const polyCenterY =
			transformedPerimeter.reduce((sum, v) => sum + v.y, 0) /
			Math.max(transformedPerimeter.length, 1)
		const toCenterX = polyCenterX - midX
		const toCenterY = polyCenterY - midY
		const dot = nx * toCenterX + ny * toCenterY
		if (dot > 0) {
			nx = -nx
			ny = -ny
		}
		const fontPx = theme.font.size.medium
		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			labelText,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = w / 2
		const halfH = h / 2
		const baseOffsetPx = 12
		function placeFor(dirX: number, dirY: number) {
			let px = midX + dirX * baseOffsetPx
			let py = midY + dirY * baseOffsetPx
			let it = 0
			const maxIt = 60
			const step = 2
			while (
				polygonIntersectsRect(transformedPerimeter, {
					x: px - halfW,
					y: py - halfH,
					width: w,
					height: h,
					pad: 1
				}) &&
				it < maxIt
			) {
				px += dirX * step
				py += dirY * step
				it++
			}
			return { x: px, y: py, it }
		}
		const outward = placeFor(nx, ny)
		const inward = placeFor(-nx, -ny)
		const chosen = inward.it < outward.it ? inward : outward
		canvas.drawText({
			x: chosen.x,
			y: chosen.y,
			text: labelText,
			fill: theme.colors.text,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			fontWeight: theme.font.weight.bold
		})
	}

	// 2c. Partitioned segment labels with collision avoidance
	for (const edge of boundaryEdges) {
		if (edge.type !== "partitioned") continue
		const pathPointsRaw = edge.path.map((id) => vertexMap.get(id))
		if (pathPointsRaw.some((p) => !p)) {
			logger.error("composite-shape: partitioned edge label missing vertex")
			throw errors.new("composite-shape: partitioned edge label missing vertex")
		}
		const pathPoints: Point[] = pathPointsRaw.filter((p): p is Point =>
			Boolean(p)
		)
		for (let i = 0; i < edge.segments.length; i++) {
			const from = pathPoints[i]
			const to = pathPoints[i + 1]
			if (!from || !to) {
				logger.error(
					"composite-shape: partitioned edge label missing segment endpoints"
				)
				throw errors.new(
					"composite-shape: partitioned edge label missing segment endpoints"
				)
			}
			const labelText = formatLabel(edge.segments[i]?.label)
			if (!labelText) continue
			const sFrom = project(from)
			const sTo = project(to)
			const midX = (sFrom.x + sTo.x) / 2
			const midY = (sFrom.y + sTo.y) / 2
			const dx = sTo.x - sFrom.x
			const dy = sTo.y - sFrom.y
			const len = Math.hypot(dx, dy)
			if (len === 0) continue
			let nx = -dy / len
			let ny = dx / len
			const polyCenterX =
				transformedPerimeter.reduce((sum, v) => sum + v.x, 0) /
				Math.max(transformedPerimeter.length, 1)
			const polyCenterY =
				transformedPerimeter.reduce((sum, v) => sum + v.y, 0) /
				Math.max(transformedPerimeter.length, 1)
			const toCenterX = polyCenterX - midX
			const toCenterY = polyCenterY - midY
			const dot = nx * toCenterX + ny * toCenterY
			if (dot > 0) {
				nx = -nx
				ny = -ny
			}
			const fontPx = theme.font.size.base
			const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
				labelText,
				Number.POSITIVE_INFINITY,
				fontPx,
				1.2
			)
			const halfW = w / 2
			const halfH = h / 2
			const baseOffsetPx = 10
			function placeFor(dirX: number, dirY: number) {
				let px = midX + dirX * baseOffsetPx
				let py = midY + dirY * baseOffsetPx
				let it = 0
				const maxIt = 60
				const step = 2
				while (
					polygonIntersectsRect(transformedPerimeter, {
						x: px - halfW,
						y: py - halfH,
						width: w,
						height: h,
						pad: 1
					}) &&
					it < maxIt
				) {
					px += dirX * step
					py += dirY * step
					it++
				}
				return { x: px, y: py, it }
			}
			const outward = placeFor(nx, ny)
			const inward = placeFor(-nx, -ny)
			const chosen = inward.it < outward.it ? inward : outward
			canvas.drawText({
				x: chosen.x,
				y: chosen.y,
				text: labelText,
				fill: theme.colors.text,
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx,
				stroke: theme.colors.background,
				strokeWidth: 3,
				paintOrder: "stroke fill"
			})
		}
	}

	// 3. Internal segments
	const internalSegmentsScreen: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
		aData: { x: number; y: number }
		bData: { x: number; y: number }
		label: string | null
		isRadius: boolean
		centerId?: string
		fromId: string
		toId: string
	}> = []
	if (internalSegments) {
		for (const s of internalSegments) {
			const from = vertexMap.get(s.fromVertexId)
			const to = vertexMap.get(s.toVertexId)
			if (!from || !to) {
				logger.error("composite-shape: internal segment missing vertex", {
					fromVertexId: s.fromVertexId,
					toVertexId: s.toVertexId
				})
				throw errors.new("composite-shape: internal segment missing vertex")
			}

			// radius detection if shapes include a circle centered at one endpoint
			let isRadius = false
			let centerId: string | undefined
			if (shapes) {
				for (const shape of shapes) {
					if (shape.type === "circle") {
						if (
							shape.centerId === s.fromVertexId ||
							shape.centerId === s.toVertexId
						) {
							isRadius = true
							centerId = shape.centerId
							break
						}
					}
				}
			}

			const p1 = project(from)
			const p2 = project(to)
			const dash =
				s.style === "dashed" ? theme.stroke.dasharray.dashed : undefined
			canvas.drawLine(p1.x, p1.y, p2.x, p2.y, {
				stroke: isRadius ? "#ff0000" : theme.colors.black,
				strokeWidth: theme.stroke.width.base,
				dash
			})
			internalSegmentsScreen.push({
				a: p1,
				b: p2,
				aData: from,
				bData: to,
				label: formatLabel(s.label),
				isRadius,
				centerId,
				fromId: s.fromVertexId,
				toId: s.toVertexId
			})
		}
	}

	// 3b. Internal segment labels with collision avoidance against all lines
	function rectIntersectsAnyLine(rect: {
		x: number
		y: number
		width: number
		height: number
		pad?: number
	}): boolean {
		for (const seg of perimeterSegments) {
			if (segmentIntersectsRect(seg.a, seg.b, rect)) return true
		}
		for (const seg of internalSegmentsScreen) {
			if (seg.label && segmentIntersectsRect(seg.a, seg.b, rect)) return true
		}
		return false
	}
	for (const seg of internalSegmentsScreen) {
		const labelText = seg.label
		if (!labelText) continue
		const sFrom = seg.a
		const sTo = seg.b
		const midX = (sFrom.x + sTo.x) / 2
		const midY = (sFrom.y + sTo.y) / 2
		const dx = sTo.x - sFrom.x
		const dy = sTo.y - sFrom.y
		const len = Math.hypot(dx, dy)
		if (len === 0) continue
		const nx = -dy / len
		const ny = dx / len
		const fontPx = theme.font.size.base
		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			labelText,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = w / 2
		const halfH = h / 2
		const baseOffsetPx = 8

		if (seg.isRadius && shapes && seg.centerId) {
			const centerData = vertexMap.get(seg.centerId)
			const endData = seg.fromId === seg.centerId ? seg.bData : seg.aData
			if (!centerData) {
				logger.error("composite-shape: radius label missing center", {
					centerId: seg.centerId
				})
				throw errors.new("composite-shape: radius label missing center")
			}
			const baseData = computeSafeBasePointForRadius(
				centerData,
				endData,
				shapes,
				(id) => vertexMap.get(id),
				baseOffsetPx,
				1 / scale
			)
			const baseScreen = project(baseData)
			const angle = Math.atan2(sTo.y - sFrom.y, sTo.x - sFrom.x)
			const labelX = baseScreen.x + baseOffsetPx * Math.sin(angle)
			const labelY = baseScreen.y - baseOffsetPx * Math.cos(angle)
			canvas.drawText({
				x: labelX,
				y: labelY,
				text: labelText,
				fill: "#ff0000",
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx,
				stroke: theme.colors.background,
				strokeWidth: 3,
				paintOrder: "stroke fill"
			})
			continue
		}

		function placeFor(dirX: number, dirY: number) {
			let px = midX + dirX * baseOffsetPx
			let py = midY + dirY * baseOffsetPx
			let it = 0
			const maxIt = 60
			const step = 2
			while (
				rectIntersectsAnyLine({
					x: px - halfW,
					y: py - halfH,
					width: w,
					height: h,
					pad: 1
				}) &&
				it < maxIt
			) {
				px += dirX * step
				py += dirY * step
				it++
			}
			return { x: px, y: py, it }
		}
		const a = placeFor(nx, ny)
		const b = placeFor(-nx, -ny)
		const chosen = a.it <= b.it ? a : b
		canvas.drawText({
			x: chosen.x,
			y: chosen.y,
			text: labelText,
			fill: theme.colors.text,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			stroke: theme.colors.background,
			strokeWidth: 3,
			paintOrder: "stroke fill"
		})
	}

	// 4. Region labels
	if (regionLabels)
		for (const l of regionLabels) {
			const pos0 = project({ x: l.position.x, y: l.position.y })
			const fontPx = theme.font.size.medium
			const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
				l.text,
				Number.POSITIVE_INFINITY,
				fontPx,
				1.2
			)
			const halfW = w / 2
			const halfH = h / 2

			function rectIntersectsAnyLine(rect: {
				x: number
				y: number
				width: number
				height: number
				pad?: number
			}): boolean {
				for (const seg of perimeterSegments) {
					if (segmentIntersectsRect(seg.a, seg.b, rect)) return true
				}
				for (const seg of internalSegmentsScreen) {
					if (segmentIntersectsRect(seg.a, seg.b, rect)) return true
				}
				return false
			}

			function nearestPointOnSegment(
				p: { x: number; y: number },
				a: { x: number; y: number },
				b: { x: number; y: number }
			) {
				const abx = b.x - a.x
				const aby = b.y - a.y
				const ab2 = abx * abx + aby * aby
				if (ab2 === 0) return { x: a.x, y: a.y }
				const apx = p.x - a.x
				const apy = p.y - a.y
				let t = (apx * abx + apy * aby) / ab2
				if (t < 0) t = 0
				if (t > 1) t = 1
				return { x: a.x + t * abx, y: a.y + t * aby }
			}

			function computeAwayDirection(
				px: number,
				py: number
			): { dx: number; dy: number } {
				let bestDist2 = Number.POSITIVE_INFINITY
				let nearest: {
					a: { x: number; y: number }
					b: { x: number; y: number }
				} | null = null
				for (const seg of perimeterSegments) {
					const q = nearestPointOnSegment({ x: px, y: py }, seg.a, seg.b)
					const dx = px - q.x
					const dy = py - q.y
					const d2 = dx * dx + dy * dy
					if (d2 < bestDist2) {
						bestDist2 = d2
						nearest = seg
					}
				}
				for (const seg of internalSegmentsScreen) {
					const q = nearestPointOnSegment({ x: px, y: py }, seg.a, seg.b)
					const dx = px - q.x
					const dy = py - q.y
					const d2 = dx * dx + dy * dy
					if (d2 < bestDist2) {
						bestDist2 = d2
						nearest = seg
					}
				}
				if (!nearest) return { dx: 0, dy: -1 }
				const q = nearestPointOnSegment({ x: px, y: py }, nearest.a, nearest.b)
				let dx = px - q.x
				let dy = py - q.y
				const len = Math.hypot(dx, dy)
				if (len === 0) return { dx: 0, dy: -1 }
				dx /= len
				dy /= len
				return { dx, dy }
			}

			function placeFor(dirX: number, dirY: number) {
				let px = pos0.x
				let py = pos0.y
				let it = 0
				const maxIt = 80
				const step = 2
				while (
					rectIntersectsAnyLine({
						x: px - halfW,
						y: py - halfH,
						width: w,
						height: h,
						pad: 1
					}) &&
					it < maxIt
				) {
					px += dirX * step
					py += dirY * step
					it++
					// keep the center inside the polygon
					if (!pointInPolygon({ x: px, y: py }, transformedPerimeter)) {
						it = maxIt + 1
						break
					}
				}
				return { x: px, y: py, it }
			}

			const away = computeAwayDirection(pos0.x, pos0.y)
			const a = placeFor(away.dx, away.dy)
			const b = placeFor(-away.dx, -away.dy)
			let chosen = a
			if (b.it < a.it) chosen = b
			if (chosen.it > 80) {
				// fallback attempt in axes if both failed within bounds
				const c = placeFor(0, -1)
				const d = placeFor(1, 0)
				const e = placeFor(0, 1)
				const f = placeFor(-1, 0)
				chosen = [a, b, c, d, e, f].reduce((best, cur) =>
					cur.it < best.it ? cur : best
				)
			}

			canvas.drawText({
				x: chosen.x,
				y: chosen.y,
				text: l.text,
				fill: theme.colors.text,
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx,
				fontWeight: theme.font.weight.bold
			})
		}

	// 5. Right-angle markers
	if (rightAngleMarkers)
		for (const m of rightAngleMarkers) {
			const corner = vertexMap.get(m.cornerVertexId)
			const adj1 = vertexMap.get(m.adjacentVertex1Id)
			const adj2 = vertexMap.get(m.adjacentVertex2Id)
			if (!corner || !adj1 || !adj2) {
				logger.error("composite-shape: right angle marker missing vertex", {
					corner: m.cornerVertexId,
					a: m.adjacentVertex1Id,
					b: m.adjacentVertex2Id
				})
				throw errors.new("composite-shape: right angle marker missing vertex")
			}

			const v1x = adj1.x - corner.x
			const v1y = adj1.y - corner.y
			const mag1 = Math.hypot(v1x, v1y)
			if (mag1 === 0) continue
			const u1x = v1x / mag1
			const u1y = v1y / mag1

			const v2x = adj2.x - corner.x
			const v2y = adj2.y - corner.y
			const mag2 = Math.hypot(v2x, v2y)
			if (mag2 === 0) continue
			const u2x = v2x / mag2
			const u2y = v2y / mag2

			const markerSizePx = 10
			const markerSizeData = markerSizePx / scale
			const p1x = corner.x + u1x * markerSizeData
			const p1y = corner.y + u1y * markerSizeData
			const p2x = corner.x + u2x * markerSizeData
			const p2y = corner.y + u2y * markerSizeData
			const p3x = corner.x + (u1x + u2x) * markerSizeData
			const p3y = corner.y + (u1y + u2y) * markerSizeData

			const q1 = project({ x: p1x, y: p1y })
			const q2 = project({ x: p3x, y: p3y })
			const q3 = project({ x: p2x, y: p2y })
			const markerPath = new Path2D()
				.moveTo(q1.x, q1.y)
				.lineTo(q2.x, q2.y)
				.lineTo(q3.x, q3.y)
			canvas.drawPath(markerPath, {
				fill: "none",
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base
			})
		}

	// Finalize and return SVG
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.small}">${svgBody}</svg>`
}

// Geometry helpers for collision checks in screen space
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
	if (maxX < rx || minX > rx + rw || maxY < ry || minY > ry + rh) {
		return false
	}

	if (
		pointInRect(A.x, A.y, rx, ry, rw, rh) ||
		pointInRect(B.x, B.y, rx, ry, rw, rh)
	)
		return true

	const r1 = { x: rx, y: ry }
	const r2 = { x: rx + rw, y: ry }
	const r3 = { x: rx + rw, y: ry + rh }
	const r4 = { x: rx, y: ry + rh }

	if (segmentsIntersect(A, B, r1, r2)) return true
	if (segmentsIntersect(A, B, r2, r3)) return true
	if (segmentsIntersect(A, B, r3, r4)) return true
	if (segmentsIntersect(A, B, r4, r1)) return true

	return false
}

function polygonIntersectsRect(
	poly: Array<{ x: number; y: number }>,
	rect: { x: number; y: number; width: number; height: number; pad?: number }
): boolean {
	if (poly.length < 2) return false
	const pad = rect.pad ?? 0
	const rx = rect.x - pad
	const ry = rect.y - pad
	const rw = rect.width + 2 * pad
	const rh = rect.height + 2 * pad

	for (let i = 0; i < poly.length; i++) {
		const a = poly[i]
		const b = poly[(i + 1) % poly.length]
		if (!a || !b) continue
		if (segmentIntersectsRect(a, b, { x: rx, y: ry, width: rw, height: rh }))
			return true
	}

	for (const p of poly) {
		if (pointInRect(p.x, p.y, rx, ry, rw, rh)) return true
	}

	const cx = rx + rw / 2
	const cy = ry + rh / 2
	if (pointInPolygon({ x: cx, y: cy }, poly)) return true

	return false
}

function pointInRect(
	x: number,
	y: number,
	rx: number,
	ry: number,
	rw: number,
	rh: number
): boolean {
	return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh
}

function segmentsIntersect(
	p1: { x: number; y: number },
	p2: { x: number; y: number },
	p3: { x: number; y: number },
	p4: { x: number; y: number }
): boolean {
	function orientation(
		a: { x: number; y: number },
		b: { x: number; y: number },
		c: { x: number; y: number }
	): number {
		const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
		if (val > 0) return 1
		if (val < 0) return -1
		return 0
	}
	function onSegment(
		a: { x: number; y: number },
		b: { x: number; y: number },
		c: { x: number; y: number }
	): boolean {
		return (
			Math.min(a.x, c.x) <= b.x &&
			b.x <= Math.max(a.x, c.x) &&
			Math.min(a.y, c.y) <= b.y &&
			b.y <= Math.max(a.y, c.y)
		)
	}
	const o1 = orientation(p1, p2, p3)
	const o2 = orientation(p1, p2, p4)
	const o3 = orientation(p3, p4, p1)
	const o4 = orientation(p3, p4, p2)

	if (o1 !== o2 && o3 !== o4) return true
	if (o1 === 0 && onSegment(p1, p3, p2)) return true
	if (o2 === 0 && onSegment(p1, p4, p2)) return true
	if (o3 === 0 && onSegment(p3, p1, p4)) return true
	if (o4 === 0 && onSegment(p3, p2, p4)) return true
	return false
}

function pointInPolygon(
	point: { x: number; y: number },
	polygon: Array<{ x: number; y: number }>
): boolean {
	if (polygon.length < 3) return false
	let inside = false
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const pi = polygon[i]
		const pj = polygon[j]
		if (!pi || !pj) continue
		const xi = pi.x
		const yi = pi.y
		const xj = pj.x
		const yj = pj.y
		const intersect =
			yi > point.y !== yj > point.y &&
			point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
		if (intersect) inside = !inside
	}
	return inside
}
