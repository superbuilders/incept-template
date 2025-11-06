import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const ErrInvalidBaseShape = errors.new(
	"invalid base shape for polyhedron type"
)

// Base shape definition factories (avoid reusing schema instances to prevent $ref)
function createSquareBase() {
	return z
		.object({
			type: z.literal("square").describe("Specifies a square base shape."),
			side: z
				.number()
				.describe(
					"Side length of the square in arbitrary units (e.g., 5, 8, 6.5). All four sides are equal."
				)
		})
		.strict()
}

function createRectangleBase() {
	return z
		.object({
			type: z
				.literal("rectangle")
				.describe("Specifies a rectangular base shape."),
			length: z
				.number()
				.describe(
					"Length of the rectangle in arbitrary units (e.g., 8, 10, 5.5). The longer dimension by convention."
				),
			width: z
				.number()
				.describe(
					"Width of the rectangle in arbitrary units (e.g., 4, 6, 3). The shorter dimension by convention."
				)
		})
		.strict()
}

function createTriangleBase() {
	return z
		.object({
			type: z
				.literal("triangle")
				.describe("Specifies a triangular base shape."),
			base: z
				.number()
				.describe(
					"Base length of the triangle in arbitrary units (e.g., 6, 8, 5). The bottom edge in standard orientation."
				),
			height: z
				.number()
				.describe(
					"Perpendicular height of the triangle in arbitrary units (e.g., 4, 5, 3.5). From base to opposite vertex."
				),
			side1: z
				.number()
				.describe(
					"Length of the first non-base side in arbitrary units (e.g., 5, 7, 4.5). Must satisfy triangle inequality."
				),
			side2: z
				.number()
				.describe(
					"Length of the second non-base side in arbitrary units (e.g., 5, 7, 4.5). Must satisfy triangle inequality."
				)
		})
		.strict()
}

function createPentagonBase() {
	return z
		.object({
			type: z
				.literal("pentagon")
				.describe("Specifies a regular pentagon base shape."),
			side: z
				.number()
				.describe(
					"Side length of the regular pentagon in arbitrary units (e.g., 4, 6, 3.5). All five sides are equal."
				)
		})
		.strict()
}

// Polyhedron type variants
const Cube = z
	.object({
		polyhedronType: z
			.literal("cube")
			.describe("A cube net with 6 identical square faces in cross pattern."),
		width: createWidthSchema(),
		height: createHeightSchema(),
		base: createSquareBase().describe(
			"Dimensions of the square faces. All 6 faces are identical squares."
		),
		showLabels: z
			.boolean()
			.nullable()
			.describe(
				"Whether to show edge measurements on the net. True adds dimension labels for calculation exercises."
			)
	})
	.strict()

const RectPrism = z
	.object({
		polyhedronType: z
			.literal("rectangularPrism")
			.describe("A rectangular prism net with 6 rectangular faces (3 pairs)."),
		width: createWidthSchema(),
		height: createHeightSchema(),
		base: createRectangleBase().describe(
			"Dimensions of the rectangular base. Top and bottom faces use these dimensions."
		),
		lateralHeight: z
			.number()
			.describe(
				"Height of the prism in arbitrary units (e.g., 5, 8, 6). The vertical dimension when standing on base."
			),
		showLabels: z
			.boolean()
			.nullable()
			.describe(
				"Whether to show dimension labels. True helps with surface area calculations."
			)
	})
	.strict()

const TriPrism = z
	.object({
		polyhedronType: z
			.literal("triangularPrism")
			.describe(
				"A triangular prism net with 2 triangular faces and 3 rectangular faces."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		base: createTriangleBase().describe(
			"Dimensions of the triangular base. Both triangular faces use these dimensions."
		),
		lateralHeight: z
			.number()
			.describe(
				"Height/length of the prism in arbitrary units (e.g., 6, 10, 7.5). Length of the rectangular faces."
			),
		showLabels: z
			.boolean()
			.nullable()
			.describe(
				"Whether to display edge measurements. Useful for surface area problems."
			)
	})
	.strict()

const SquarePyr = z
	.object({
		polyhedronType: z
			.literal("squarePyramid")
			.describe(
				"A square pyramid net with 1 square base and 4 triangular faces."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		base: createSquareBase().describe(
			"Dimensions of the square base. The central square in the net."
		),
		lateralHeight: z
			.number()
			.describe(
				"Slant height of the triangular faces in arbitrary units (e.g., 6, 8, 7). From base edge to apex."
			),
		showLabels: z
			.boolean()
			.nullable()
			.describe(
				"Whether to label dimensions. Important for distinguishing base edges from slant heights."
			)
	})
	.strict()

const TriPyr = z
	.object({
		polyhedronType: z
			.literal("triangularPyramid")
			.describe(
				"A triangular pyramid (tetrahedron) net with 4 triangular faces."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		base: createTriangleBase().describe(
			"Dimensions of the base triangle. Other faces are calculated from these and lateralHeight."
		),
		lateralHeight: z
			.number()
			.describe(
				"Height from base edges to apex in arbitrary units (e.g., 5, 7, 6). Determines lateral face dimensions."
			),
		showLabels: z
			.boolean()
			.nullable()
			.describe(
				"Whether to show measurements. Helps identify which edges connect when folded."
			)
	})
	.strict()

const PentPyr = z
	.object({
		polyhedronType: z
			.literal("pentagonalPyramid")
			.describe(
				"A pentagonal pyramid net with 1 pentagon base and 5 triangular faces."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		base: createPentagonBase().describe(
			"Dimensions of the regular pentagon base. The central pentagon in the net."
		),
		lateralHeight: z
			.number()
			.describe(
				"Slant height of triangular faces in arbitrary units (e.g., 5, 7, 6.5). From base edge to apex."
			),
		showLabels: z
			.boolean()
			.nullable()
			.describe(
				"Whether to display edge labels. Useful for surface area and folding exercises."
			)
	})
	.strict()

// Add type field to each variant
const CubeWithType = Cube.extend({ type: z.literal("polyhedronNetDiagram") })
const RectPrismWithType = RectPrism.extend({
	type: z.literal("polyhedronNetDiagram")
})
const TriPrismWithType = TriPrism.extend({
	type: z.literal("polyhedronNetDiagram")
})
const SquarePyrWithType = SquarePyr.extend({
	type: z.literal("polyhedronNetDiagram")
})
const TriPyrWithType = TriPyr.extend({
	type: z.literal("polyhedronNetDiagram")
})
const PentPyrWithType = PentPyr.extend({
	type: z.literal("polyhedronNetDiagram")
})

export const PolyhedronNetDiagramPropsSchema = z
	.discriminatedUnion("polyhedronType", [
		CubeWithType,
		RectPrismWithType,
		TriPrismWithType,
		SquarePyrWithType,
		TriPyrWithType,
		PentPyrWithType
	])
	.describe(
		"Creates 2D nets (unfolded patterns) of 3D polyhedra. Each net shows how faces connect and can be folded to form the 3D shape. Essential for teaching surface area, 3D visualization, and spatial reasoning. The polyhedronType determines which specific shape and net pattern to generate."
	)

export type PolyhedronNetDiagramProps = z.infer<
	typeof PolyhedronNetDiagramPropsSchema
>

/**
 * This template generates a two-dimensional "net" of a 3D polyhedron as an SVG graphic.
 * A net is a 2D pattern that can be folded to form the 3D shape, and this template is
 * essential for questions about surface area and the relationship between 2D and 3D geometry.
 */
export const generatePolyhedronNetDiagram: WidgetGenerator<
	typeof PolyhedronNetDiagramPropsSchema
> = async (data) => {
	const { width, height, polyhedronType, base, showLabels } = data
	const lateralHeight = "lateralHeight" in data ? data.lateralHeight : undefined

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const unit = 20 // Logical unit; final fit-to-box scaling is applied later

	// Collect geometry in raw coordinates first, then fit-to-box scale and render
	type Point = { x: number; y: number }
	const rects: Array<{ x: number; y: number; w: number; h: number }> = []
	const polys: Array<Point[]> = []
	const lines: Array<{
		x1: number
		y1: number
		x2: number
		y2: number
		stroke?: string
		strokeWidth?: number
	}> = []

	// Helper: compute fit transform for all collected points
	function computeFit(allPoints: Point[]) {
		if (allPoints.length === 0) {
			return { scale: 1, offsetX: 0, offsetY: 0, project: (p: Point) => p }
		}
		const minX = Math.min(...allPoints.map((p) => p.x))
		const maxX = Math.max(...allPoints.map((p) => p.x))
		const minY = Math.min(...allPoints.map((p) => p.y))
		const maxY = Math.max(...allPoints.map((p) => p.y))
		const rawW = maxX - minX
		const rawH = maxY - minY
		const scale = Math.min(
			(width - 2 * PADDING) / (rawW || 1),
			(height - 2 * PADDING) / (rawH || 1)
		)
		const offsetX = (width - scale * rawW) / 2 - scale * minX
		const offsetY = (height - scale * rawH) / 2 - scale * minY
		const project = (p: Point) => ({
			x: offsetX + scale * p.x,
			y: offsetY + scale * p.y
		})
		return { scale, offsetX, offsetY, project }
	}

	const rect = (x: number, y: number, w: number, h: number) => {
		rects.push({ x, y, w, h })
	}

	const poly = (points: string) => {
		const polygonPoints = points
			.split(" ")
			.map((p) => {
				const [x, y] = p.split(",").map(Number)
				return { x: x || 0, y: y || 0 }
			})
			.filter(
				(p) =>
					!Number.isNaN(p.x) &&
					!Number.isNaN(p.y) &&
					Number.isFinite(p.x) &&
					Number.isFinite(p.y)
			)
		polys.push(polygonPoints)
	}

	const drawGridLines = (
		x: number,
		y: number,
		w: number,
		h: number,
		dim_w: number,
		dim_h: number
	) => {
		const unit_w = w / dim_w
		const unit_h = h / dim_h
		for (let i = 1; i < dim_w; i++) {
			lines.push({
				x1: x + i * unit_w,
				y1: y,
				x2: x + i * unit_w,
				y2: y + h,
				stroke: theme.colors.black,
				strokeWidth: 0.5
			})
		}
		for (let i = 1; i < dim_h; i++) {
			lines.push({
				x1: x,
				y1: y + i * unit_h,
				x2: x + w,
				y2: y + i * unit_h,
				stroke: theme.colors.black,
				strokeWidth: 0.5
			})
		}
	}

	switch (polyhedronType) {
		case "cube": {
			if (base.type !== "square") {
				logger.error("invalid base shape for cube", {
					baseType: base.type,
					expected: "square"
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					`cube must have a square base, but received type '${base.type}'`
				)
			}
			const side = base.side
			const a = side
			const b = side
			const c = side
			// REMOVE ALL SCALING AND OFFSET CALCULATIONS
			const a_u = a * unit
			const b_u = b * unit
			const c_u = c * unit

			// Center the main cross shape around (0,0) for a predictable viewBox
			const row_y = -c_u / 2
			const x_start = -(b_u + a_u / 2)

			rect(x_start, row_y, b_u, c_u)
			rect(x_start + b_u, row_y, a_u, c_u)
			rect(x_start + b_u + a_u, row_y, b_u, c_u)
			rect(x_start + b_u + a_u + b_u, row_y, a_u, c_u)
			rect(x_start + b_u, row_y - b_u, a_u, b_u)
			rect(x_start + b_u, row_y + c_u, a_u, b_u)

			if (showLabels === true) {
				drawGridLines(x_start, row_y, b_u, c_u, b, c)
				drawGridLines(x_start + b_u, row_y, a_u, c_u, a, c)
				drawGridLines(x_start + b_u + a_u, row_y, b_u, c_u, b, c)
				drawGridLines(x_start + b_u + a_u + b_u, row_y, a_u, c_u, a, c)
				drawGridLines(x_start + b_u, row_y - b_u, a_u, b_u, a, b)
				drawGridLines(x_start + b_u, row_y + c_u, a_u, b_u, a, b)
			}
			break
		}
		case "rectangularPrism": {
			if (base.type !== "rectangle") {
				logger.error("invalid base shape for rectangular prism", {
					baseType: base.type,
					expected: "rectangle"
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					`rectangularPrism must have a rectangle base, but received type '${base.type}'`
				)
			}
			if (lateralHeight == null) {
				logger.error("missing lateral height for rectangular prism", {
					polyhedronType
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					"lateralHeight is required for rectangularPrism"
				)
			}
			const length = base.length
			const width = base.width
			const prismHeight = lateralHeight
			const a = length
			const b = width
			const c = prismHeight
			// REMOVE ALL SCALING AND OFFSET CALCULATIONS
			const a_u = a * unit
			const b_u = b * unit
			const c_u = c * unit

			// Center the main cross shape around (0,0) for a predictable viewBox
			const row_y = -c_u / 2
			const x_start = -(b_u + a_u / 2)

			rect(x_start, row_y, b_u, c_u)
			rect(x_start + b_u, row_y, a_u, c_u)
			rect(x_start + b_u + a_u, row_y, b_u, c_u)
			rect(x_start + b_u + a_u + b_u, row_y, a_u, c_u)
			rect(x_start + b_u, row_y - b_u, a_u, b_u)
			rect(x_start + b_u, row_y + c_u, a_u, b_u)
			if (showLabels === true) {
				drawGridLines(x_start, row_y, b_u, c_u, width, prismHeight)
				drawGridLines(x_start + b_u, row_y, a_u, c_u, length, prismHeight)
				drawGridLines(x_start + b_u + a_u, row_y, b_u, c_u, width, prismHeight)
				drawGridLines(
					x_start + b_u + a_u + b_u,
					row_y,
					a_u,
					c_u,
					length,
					prismHeight
				)
				drawGridLines(x_start + b_u, row_y - b_u, a_u, b_u, length, width)
				drawGridLines(x_start + b_u, row_y + c_u, a_u, b_u, length, width)
			}
			break
		}
		case "triangularPrism": {
			if (base.type !== "triangle") {
				logger.error("invalid base shape for triangular prism", {
					baseType: base.type,
					expected: "triangle"
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					`triangularPrism must have a triangle base, but received type '${base.type}'`
				)
			}
			if (lateralHeight == null) {
				logger.error("missing lateral height for triangular prism", {
					polyhedronType
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					"lateralHeight is required for triangularPrism"
				)
			}
			const base_len = base.base
			const tri_h = base.height
			const side1 = base.side1
			const side2 = base.side2
			const prism_h = lateralHeight
			const d = (side1 ** 2 + base_len ** 2 - side2 ** 2) / (2 * base_len)
			// REMOVE ALL SCALING AND OFFSET CALCULATIONS
			const side1_u = side1 * unit
			const base_u = base_len * unit
			const side2_u = side2 * unit
			const prism_h_u = prism_h * unit
			const tri_h_u = tri_h * unit

			// Center the shape around (0,0)
			const total_width = side1_u + base_u + side2_u
			const row_start_x = -total_width / 2
			const row_y = -prism_h_u / 2

			rect(row_start_x, row_y, side1_u, prism_h_u)
			const middle_x = row_start_x + side1_u
			rect(middle_x, row_y, base_u, prism_h_u)
			const right_x = middle_x + base_u
			rect(right_x, row_y, side2_u, prism_h_u)
			const top_left = middle_x
			const top_right = middle_x + base_u
			const top_y_base = row_y
			const top_apex_x = middle_x + d * unit
			const top_apex_y = row_y - tri_h_u
			poly(
				`${top_left},${top_y_base} ${top_right},${top_y_base} ${top_apex_x},${top_apex_y}`
			)
			const bot_y_base = row_y + prism_h_u
			const bot_apex_y = bot_y_base + tri_h_u
			const bot_apex_x = middle_x + d * unit
			poly(
				`${top_left},${bot_y_base} ${top_right},${bot_y_base} ${bot_apex_x},${bot_apex_y}`
			)
			if (showLabels === true) {
				drawGridLines(row_start_x, row_y, side1_u, prism_h_u, side1, prism_h)
				drawGridLines(middle_x, row_y, base_u, prism_h_u, base_len, prism_h)
				drawGridLines(right_x, row_y, side2_u, prism_h_u, side2, prism_h)
			}
			break
		}
		case "squarePyramid": {
			if (base.type !== "square") {
				logger.error("invalid base shape for square pyramid", {
					baseType: base.type,
					expected: "square"
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					`squarePyramid must have a square base, but received type '${base.type}'`
				)
			}
			if (lateralHeight == null) {
				logger.error("missing lateral height for square pyramid", {
					polyhedronType
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					"lateralHeight is required for squarePyramid"
				)
			}
			const side = base.side
			const lat_h = lateralHeight
			// REMOVE ALL SCALING AND OFFSET CALCULATIONS
			const s_u = side * unit
			const lat_u = lat_h * unit

			// Center the pyramid net around (0,0)
			const base_x = -s_u / 2
			const base_y = -s_u / 2

			rect(base_x, base_y, s_u, s_u)
			const top_base_y = base_y
			const top_left_x = base_x
			const top_right_x = base_x + s_u
			const apex_d = side / 2
			const top_apex_x = base_x + apex_d * unit
			const top_apex_y = base_y - lat_u
			poly(
				`${top_left_x},${top_base_y} ${top_right_x},${top_base_y} ${top_apex_x},${top_apex_y}`
			)
			const bot_base_y = base_y + s_u
			const bot_apex_y = bot_base_y + lat_u
			const bot_apex_x = base_x + apex_d * unit
			poly(
				`${top_left_x},${bot_base_y} ${top_right_x},${bot_base_y} ${bot_apex_x},${bot_apex_y}`
			)
			const left_base_top_y = base_y
			const left_base_bot_y = base_y + s_u
			const left_base_x = base_x
			const left_apex_x = base_x - lat_u
			const left_apex_y = base_y + apex_d * unit
			poly(
				`${left_base_x},${left_base_top_y} ${left_base_x},${left_base_bot_y} ${left_apex_x},${left_apex_y}`
			)
			const right_base_x = base_x + s_u
			const right_apex_x = right_base_x + lat_u
			const right_apex_y = base_y + apex_d * unit
			poly(
				`${right_base_x},${left_base_top_y} ${right_base_x},${left_base_bot_y} ${right_apex_x},${right_apex_y}`
			)
			if (showLabels === true) {
				drawGridLines(base_x, base_y, s_u, s_u, side, side)
			}
			break
		}
		case "triangularPyramid": {
			if (base.type !== "triangle") {
				logger.error("invalid base shape for triangular pyramid", {
					baseType: base.type,
					expected: "triangle"
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					`triangularPyramid must have a triangle base, but received type '${base.type}'`
				)
			}
			if (lateralHeight == null) {
				logger.error("missing lateral height for triangular pyramid", {
					polyhedronType
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					"lateralHeight is required for triangularPyramid"
				)
			}
			const base_len = base.base
			const tri_h = base.height
			const side1 = base.side1
			const side2 = base.side2
			const lat_h = lateralHeight
			const d = (side1 ** 2 + base_len ** 2 - side2 ** 2) / (2 * base_len)
			interface Point {
				x: number
				y: number
			}
			// REMOVE ALL SCALING AND OFFSET CALCULATIONS
			// Use unit directly for all calculations
			const p1: Point = { x: 0, y: 0 }
			const p2: Point = { x: base_len * unit, y: 0 }
			const p3: Point = { x: d * unit, y: -tri_h * unit }
			const getApex = (pa: Point, pb: Point, pc: Point): Point => {
				const ex = pb.x - pa.x
				const ey = pb.y - pa.y
				const mx = (pa.x + pb.x) / 2
				const my = (pa.y + pb.y) / 2
				const cross = ex * (pc.y - pa.y) - ey * (pc.x - pa.x)
				let px: number
				let py: number
				if (cross > 0) {
					px = ey
					py = -ex
				} else {
					px = -ey
					py = ex
				}
				const plen = Math.sqrt(px ** 2 + py ** 2)
				const ux = px / plen
				const uy = py / plen
				return { x: mx + lat_h * unit * ux, y: my + lat_h * unit * uy }
			}
			const apex_base = getApex(p1, p2, p3)
			const apex_side1 = getApex(p1, p3, p2)
			const apex_side2 = getApex(p3, p2, p1)
			const all_points: Point[] = [
				p1,
				p2,
				p3,
				apex_base,
				apex_side1,
				apex_side2
			]
			// Find bounds and center around (0,0)
			const min_x = Math.min(...all_points.map((p) => p.x))
			const max_x = Math.max(...all_points.map((p) => p.x))
			const min_y = Math.min(...all_points.map((p) => p.y))
			const max_y = Math.max(...all_points.map((p) => p.y))
			const center_x = (min_x + max_x) / 2
			const center_y = (min_y + max_y) / 2
			// Center all points
			const cp1: Point = { x: p1.x - center_x, y: p1.y - center_y }
			const cp2: Point = { x: p2.x - center_x, y: p2.y - center_y }
			const cp3: Point = { x: p3.x - center_x, y: p3.y - center_y }
			const capex_base: Point = {
				x: apex_base.x - center_x,
				y: apex_base.y - center_y
			}
			const capex_side1: Point = {
				x: apex_side1.x - center_x,
				y: apex_side1.y - center_y
			}
			const capex_side2: Point = {
				x: apex_side2.x - center_x,
				y: apex_side2.y - center_y
			}

			poly(`${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${cp3.x},${cp3.y}`)
			poly(
				`${cp1.x},${cp1.y} ${cp2.x},${cp2.y} ${capex_base.x},${capex_base.y}`
			)
			poly(
				`${cp1.x},${cp1.y} ${cp3.x},${cp3.y} ${capex_side1.x},${capex_side1.y}`
			)
			poly(
				`${cp3.x},${cp3.y} ${cp2.x},${cp2.y} ${capex_side2.x},${capex_side2.y}`
			)
			break
		}
		case "pentagonalPyramid": {
			if (base.type !== "pentagon") {
				logger.error("invalid base shape for pentagonal pyramid", {
					baseType: base.type,
					expected: "pentagon"
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					`pentagonalPyramid must have a pentagon base, but received type '${base.type}'`
				)
			}
			if (lateralHeight == null) {
				logger.error("missing lateral height for pentagonal pyramid", {
					polyhedronType
				})
				throw errors.wrap(
					ErrInvalidBaseShape,
					"lateralHeight is required for pentagonalPyramid"
				)
			}
			const side = base.side
			const lat_h = lateralHeight
			interface Point {
				x: number
				y: number
			}
			// REMOVE ALL SCALING AND OFFSET CALCULATIONS
			const sin_pi5 = Math.sin(Math.PI / 5)
			const R = (side * unit) / (2 * sin_pi5)
			const points: Point[] = []
			for (let i = 0; i < 5; i++) {
				const theta = (2 * Math.PI * i) / 5 - Math.PI / 2
				points.push({
					x: R * Math.cos(theta),
					y: R * Math.sin(theta)
				})
			}
			const getApex = (pa: Point, pb: Point, pc: Point): Point => {
				const ex = pb.x - pa.x
				const ey = pb.y - pa.y
				const mx = (pa.x + pb.x) / 2
				const my = (pa.y + pb.y) / 2
				const cross = ex * (pc.y - pa.y) - ey * (pc.x - pa.x)
				let px: number
				let py: number
				if (cross > 0) {
					px = ey
					py = -ex
				} else {
					px = -ey
					py = ex
				}
				const plen = Math.sqrt(px ** 2 + py ** 2)
				const ux = px / plen
				const uy = py / plen
				return { x: mx + lat_h * unit * ux, y: my + lat_h * unit * uy }
			}
			const apexes: Point[] = []
			for (let j = 0; j < 5; j++) {
				const pa = points[j]
				const pb = points[(j + 1) % 5]
				const pc = points[(j + 2) % 5]
				if (!pa || !pb || !pc) continue
				const apex = getApex(pa, pb, pc)
				apexes.push(apex)
			}
			// Pentagon is already centered at (0,0) by construction
			const base_points_str = points.map((p) => `${p.x},${p.y}`).join(" ")
			poly(base_points_str)
			for (let j = 0; j < 5; j++) {
				const pa = points[j]
				const pb = points[(j + 1) % 5]
				const apex = apexes[j]
				if (!pa || !pb || !apex) continue
				poly(`${pa.x},${pa.y} ${pb.x},${pb.y} ${apex.x},${apex.y}`)
			}
			break
		}
	}

	// Compute fit transform from all collected shapes
	const allPoints: Point[] = []
	for (const r of rects) {
		allPoints.push({ x: r.x, y: r.y })
		allPoints.push({ x: r.x + r.w, y: r.y + r.h })
	}
	for (const polyPts of polys) allPoints.push(...polyPts)
	for (const ln of lines) {
		allPoints.push({ x: ln.x1, y: ln.y1 })
		allPoints.push({ x: ln.x2, y: ln.y2 })
	}
	const { scale, project } = computeFit(allPoints)

	// Render with transform; keep stroke widths and fonts in screen space
	for (const r of rects) {
		const topLeft = project({ x: r.x, y: r.y })
		canvas.drawRect(topLeft.x, topLeft.y, r.w * scale, r.h * scale, {
			fill: "rgba(200,200,200,0.3)",
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})
	}
	for (const polyPts of polys) {
		const projected = polyPts.map(project)
		canvas.drawPolygon(projected, {
			fill: "rgba(200,200,200,0.3)",
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})
	}
	for (const ln of lines) {
		const p1 = project({ x: ln.x1, y: ln.y1 })
		const p2 = project({ x: ln.x2, y: ln.y2 })
		canvas.drawLine(p1.x, p1.y, p2.x, p2.y, {
			stroke: ln.stroke || theme.colors.black,
			strokeWidth: ln.strokeWidth ?? 0.5
		})
	}

	// Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
