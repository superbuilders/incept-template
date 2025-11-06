import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { MATHML_INNER_PATTERN } from "@/widgets/utils/mathml"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"
import { theme } from "@/widgets/utils/theme"

// -----------------------------
// Constraint-first schema (angles by three points)
// -----------------------------

// Domain-specific value factories with distinct constraints
function createAngleValueSchema() {
	return z
		.discriminatedUnion("type", [
			z
				.object({
					type: z
						.literal("numeric")
						.describe("Indicates this is a numeric angle value."),
					value: z
						.number()
						.gt(0)
						.lt(180)
						.describe(
							"The angle measure in degrees. Must be between 0 and 180 degrees (exclusive) to ensure valid triangle geometry."
						)
				})
				.strict(),
			z
				.object({
					type: z
						.literal("symbolic")
						.describe("Indicates this is a symbolic angle representation."),
					symbol: z
						.string()
						.describe(
							"A symbolic representation of the angle (e.g., 'x', 'α', '2y + 30'). Used when the exact numeric value is unknown or when representing algebraic relationships."
						)
				})
				.strict()
		])
		.describe(
			"Represents an angle value in a triangle. Can be either a concrete numeric value in degrees or a symbolic expression. Numeric values must be strictly between 0° and 180° to maintain valid triangle geometry. Symbolic values allow representation of unknown angles or algebraic relationships between angles."
		)
}

function createSideValueSchema() {
	return z
		.discriminatedUnion("type", [
			z
				.object({
					type: z
						.literal("numeric")
						.describe("Indicates this is a numeric side length."),
					value: z
						.number()
						.gt(0)
						.describe(
							"The side length as a positive number. Can represent any unit of measurement (pixels, cm, units, etc.). Must be greater than 0 to ensure valid geometry."
						)
				})
				.strict(),
			z
				.object({
					type: z
						.literal("symbolic")
						.describe(
							"Indicates this is a symbolic side length representation."
						),
					symbol: z
						.string()
						.describe(
							"A symbolic representation of the side length (e.g., 'a', 'x + 3', '2y'). Used for algebraic expressions, unknown values, or when showing relationships between sides."
						)
				})
				.strict(),
			z
				.object({
					type: z
						.literal("mathml")
						.describe(
							"Indicates this is a MathML-formatted side length with an associated numeric value."
						),
					mathml: z
						.string()
						.regex(
							MATHML_INNER_PATTERN,
							"invalid mathml snippet; must be inner MathML without outer <math> wrapper"
						)
						.describe(
							"Inner MathML content for rendering complex mathematical expressions (e.g., square roots, fractions). Do not include the outer <math> wrapper tags. Example for √2: '<msqrt><mn>2</mn></msqrt>'"
						),
					value: z
						.number()
						.gt(0)
						.describe(
							"The numeric value that this MathML expression evaluates to. Used for geometric calculations while the MathML provides the visual representation."
						)
				})
				.strict()
		])
		.describe(
			"Represents a side length value in a triangle. Supports three formats: numeric (simple positive numbers), symbolic (algebraic expressions or variables), or MathML (for complex mathematical notation like radicals or fractions). MathML format requires both the visual representation and its numeric value for proper rendering and calculation."
		)
}

function createAngleMarkSchema() {
	return z
		.object({
			vertex: z
				.string()
				.regex(TRI_POINT_ID)
				.describe(
					"The point ID where the angle is centered. This is the vertex of the angle being marked. Must match the ID of a defined point (either a triangle vertex or auxiliary point)."
				),
			from: z
				.string()
				.regex(TRI_POINT_ID)
				.describe(
					"The point ID defining the starting ray of the angle. Combined with the vertex, this creates the first ray from vertex to 'from' point. The angle arc will begin from this ray."
				),
			to: z
				.string()
				.regex(TRI_POINT_ID)
				.describe(
					"The point ID defining the ending ray of the angle. Combined with the vertex, this creates the second ray from vertex to 'to' point. The angle is measured from the 'from' ray to the 'to' ray in the minor arc direction."
				),
			value: createAngleValueSchema().describe(
				"The angle measurement or symbol to display. For numeric values, this will be shown with a degree symbol. For symbolic values, the raw symbol text is displayed. This value should match the geometric constraint of the angle."
			),
			color: z
				.string()
				.regex(CSS_COLOR_PATTERN, "invalid css color")
				.describe(
					"CSS color for the angle arc. Use distinct colors to differentiate multiple angles or highlight specific angles. Common choices: 'red' for important angles, 'blue' for given angles, 'green' for calculated angles."
				),
			showArc: z
				.boolean()
				.describe(
					"Whether to render the arc for this angle. Does not affect geometry."
				),
			showLabel: z
				.boolean()
				.describe(
					"Whether to render the label for this angle (numeric text or symbol). Does not affect geometry."
				)
		})
		.strict()
		.describe(
			"Defines an angle marking in the triangle diagram. Angles are specified by three points: a vertex (center) and two points that define the rays. The angle is always drawn as the minor arc (less than 180°) from the 'from' ray to the 'to' ray. Multiple angle marks can overlap at the same vertex with different arc radii automatically adjusted for clarity. Visibility of the arc and label can be controlled independently via showArc and showLabel."
		)
}

function createSidesLabelSchema() {
	return z
		.object({
			AB: createSideValueSchema()
				.nullable()
				.describe(
					"Label for the side connecting vertices A and B. The label is positioned automatically on the exterior of the triangle, perpendicular to the side. Set to null to omit the label for this side."
				),
			BC: createSideValueSchema()
				.nullable()
				.describe(
					"Label for the side connecting vertices B and C. The label is positioned automatically on the exterior of the triangle, perpendicular to the side. Set to null to omit the label for this side."
				),
			CA: createSideValueSchema()
				.nullable()
				.describe(
					"Label for the side connecting vertices C and A. The label is positioned automatically on the exterior of the triangle, perpendicular to the side. Set to null to omit the label for this side."
				)
		})
		.strict()
		.describe(
			"Defines optional labels for the three sides of the triangle. Each side can display a numeric value, symbolic expression, or MathML notation. Labels are automatically positioned outside the triangle for clarity. Use null for any side you don't want labeled. Side labels are commonly used to show lengths, algebraic expressions, or measurements like '5 cm', 'x + 2', or '√3'."
		)
}

// Replace constants with factory functions
const TRI_POINT_ID = /^pt_tri_[A-Za-z0-9_]+$/

function createTrianglePointsSchema() {
	return z
		.object({
			A: z
				.object({
					id: z
						.string()
						.regex(TRI_POINT_ID)
						.describe(
							"Unique identifier for vertex A. Must follow the pattern 'pt_tri_[alphanumeric]'. This ID is used to reference this vertex in angle marks, lines, and other constructions."
						),
					label: z
						.string()
						.describe(
							"Display label for vertex A. Typically a single letter like 'A', but can be any string (e.g., 'P', 'A₁'). This is what appears visually next to the vertex point."
						)
				})
				.strict()
				.describe(
					"First vertex of the triangle. By convention, vertices are labeled counterclockwise. The position is automatically calculated based on the angle constraints."
				),
			B: z
				.object({
					id: z
						.string()
						.regex(TRI_POINT_ID)
						.describe(
							"Unique identifier for vertex B. Must follow the pattern 'pt_tri_[alphanumeric]'. This ID is used to reference this vertex in angle marks, lines, and other constructions."
						),
					label: z
						.string()
						.describe(
							"Display label for vertex B. Typically a single letter like 'B', but can be any string (e.g., 'Q', 'B₁'). This is what appears visually next to the vertex point."
						)
				})
				.strict()
				.describe(
					"Second vertex of the triangle. By convention, vertices are labeled counterclockwise. The position is automatically calculated based on the angle constraints."
				),
			C: z
				.object({
					id: z
						.string()
						.regex(TRI_POINT_ID)
						.describe(
							"Unique identifier for vertex C. Must follow the pattern 'pt_tri_[alphanumeric]'. This ID is used to reference this vertex in angle marks, lines, and other constructions."
						),
					label: z
						.string()
						.describe(
							"Display label for vertex C. Typically a single letter like 'C', but can be any string (e.g., 'R', 'C₁'). This is what appears visually next to the vertex point."
						)
				})
				.strict()
				.describe(
					"Third vertex of the triangle. By convention, vertices are labeled counterclockwise. The position is automatically calculated based on the angle constraints."
				)
		})
		.strict()
		.describe(
			"Defines the three vertices of the triangle. Each vertex has a unique ID (for internal references) and a display label (what the user sees). The triangle's shape is determined by the angle constraints provided in angleArcs. Vertices are automatically positioned to satisfy all geometric constraints."
		)
}

function createAuxiliaryPointsSchema() {
	return z
		.array(
			z
				.object({
					id: z
						.string()
						.regex(TRI_POINT_ID)
						.describe(
							"Unique identifier for the auxiliary point. Must follow the pattern 'pt_tri_[alphanumeric]'. Used to reference this point in angle marks, lines, and other constructions."
						),
					label: z
						.string()
						.describe(
							"Display label for the auxiliary point. Can be any string (e.g., 'D', 'E', 'M' for midpoint, 'H' for orthocenter). This is what appears visually next to the point."
						)
				})
				.strict()
				.describe(
					"An auxiliary point added to the diagram beyond the three triangle vertices. Its position must be defined through the 'lines' constraint."
				)
		)
		.nullable()
		.describe(
			"Optional array of auxiliary points to add to the diagram. These points extend beyond the basic triangle vertices and are useful for showing constructions like angle bisectors, medians, altitudes, or exterior angles. Each auxiliary point must be positioned using the 'lines' property to specify collinear constraints with existing points. Set to null if no auxiliary points are needed."
		)
}

function createConstructionLinesSchema() {
	return z
		.array(
			z
				.object({
					points: z
						.array(z.string().regex(TRI_POINT_ID))
						.min(2)
						.max(3)
						.describe(
							"Array of point IDs that this construction line passes through. Specify 2 points for a line segment, or 3 points for a polyline. Points must be existing vertices or auxiliary points. The line is drawn in the order specified."
						),
					style: z
						.enum(["solid", "dashed", "dotted"])
						.describe(
							"Visual style of the construction line. Use 'dashed' for auxiliary constructions like angle bisectors or medians. Use 'dotted' for temporary or reference lines. Use 'solid' for emphasized constructions."
						)
				})
				.strict()
				.describe(
					"A construction line drawn through specified points. Unlike the main triangle edges, these lines can be styled differently to indicate their purpose (e.g., dashed for constructions, dotted for helpers)."
				)
		)
		.nullable()
		.describe(
			"Optional array of construction lines to add to the diagram. These are additional line segments or polylines beyond the triangle edges, useful for showing geometric constructions like angle bisectors, medians, perpendicular bisectors, or extended sides. Each line can have a different visual style (solid, dashed, or dotted) to distinguish its purpose. Set to null if no construction lines are needed."
		)
}

function createLinesSchema() {
	return z
		.array(
			z
				.array(z.string().regex(TRI_POINT_ID))
				.min(2)
				.describe(
					"Array of point IDs that lie on the same line. The order defines collinearity constraints and positioning for auxiliary points. If an auxiliary point appears between two known points, it will be positioned along that line segment."
				)
		)
		.nullable()
		.describe(
			"Optional array defining collinear point constraints and auxiliary point positioning. Each inner array specifies points that must lie on the same straight line. This is the primary mechanism for positioning auxiliary points - they are placed along lines defined by existing points. For example, [['pt_tri_A', 'pt_tri_D', 'pt_tri_B']] places auxiliary point D on line AB between A and B. Multiple lines can intersect to precisely position points. Also enables exterior angle constructions by extending lines beyond the triangle. Set to null if no collinear constraints are needed."
		)
}

function createAltitudeSchema() {
	return z
		.object({
			vertex: z
				.string()
				.regex(TRI_POINT_ID)
				.describe(
					"The point ID from which the altitude is drawn. This is typically a triangle vertex, but can be any defined point. The altitude will be drawn perpendicular from this point to the specified side."
				),
			toSide: z
				.enum(["AB", "BC", "CA"])
				.describe(
					"The side of the triangle to which the altitude is perpendicular. 'AB' draws altitude to side between vertices A and B, 'BC' to side between B and C, 'CA' to side between C and A."
				),
			value: createSideValueSchema()
				.nullable()
				.describe(
					"Optional label for the altitude length. Can be numeric (e.g., 4), symbolic (e.g., 'h'), or MathML. The label is positioned at the midpoint of the altitude line. Set to null to omit the label."
				),
			style: z
				.enum(["dashed", "dotted"])
				.describe(
					"Visual style for the altitude line. Typically 'dashed' is used for altitudes as a standard geometric construction notation. 'dotted' can be used for less emphasis."
				),
			color: z
				.string()
				.regex(CSS_COLOR_PATTERN, "invalid css color")
				.describe(
					"CSS color for the altitude line. Common choices: 'blue' or 'green' for standard altitudes, 'red' to emphasize a specific altitude in a problem."
				),
			withRightAngle: z
				.literal(true)
				.describe(
					"Always true for altitudes. Draws a small square at the foot of the altitude to indicate the 90-degree angle where the altitude meets the base."
				)
		})
		.strict()
		.describe(
			"Defines an altitude (height) of the triangle. An altitude is a perpendicular line segment from a vertex to the opposite side (or the line containing that side). The altitude creates a 90-degree angle with the base, which is marked with a small square. Altitudes are fundamental in calculating triangle area and in many geometric proofs."
		)
}

export const TriangleDiagramPropsSchema = z
	.object({
		type: z
			.literal("triangleDiagram")
			.describe(
				"Identifies this widget as a triangle diagram. Always use the exact value 'triangleDiagram'."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		points: createTrianglePointsSchema().describe(
			"The three vertices that define the triangle. The triangle's shape is fully determined by the angle constraints specified in angleArcs."
		),
		extraPoints: createAuxiliaryPointsSchema().describe(
			"Additional points beyond the three triangle vertices. Used for constructions like angle bisectors, medians, or exterior angle demonstrations."
		),
		angleArcs: z
			.array(createAngleMarkSchema())
			.min(3)
			.max(3)
			.describe(
				"Array of exactly three angle markings to display (one per triangle angle, interior or exterior construction). At least 2 numeric angle values are required to determine the triangle's shape. The third angle is automatically calculated to sum to 180°. If all three provided angles are numeric, their interior measures MUST sum exactly to 180°. If any angle is symbolic/variable, the sum requirement is not enforced at validation time. Supports both interior angles (between triangle sides) and exterior angles (using auxiliary points and collinear constraints). Multiple angles at the same vertex are automatically given different arc radii for clarity."
			),
		sideLabels: createSidesLabelSchema()
			.nullable()
			.describe(
				"Optional labels for the three sides of the triangle. Labels can show measurements, variables, or mathematical expressions."
			),
		constructionLines: createConstructionLinesSchema().describe(
			"Additional line segments for geometric constructions. These appear on top of the base triangle and can be styled (solid, dashed, dotted) to indicate their purpose."
		),
		lines: createLinesSchema().describe(
			"Collinearity constraints that position auxiliary points and enable extended constructions. Critical for creating exterior angles and precise geometric relationships."
		),
		altitudes: z
			.array(createAltitudeSchema())
			.nullable()
			.describe(
				"Array of altitudes (perpendicular heights) to draw from vertices to opposite sides. Each altitude includes a right angle marker at its foot and optional length label."
			),
		rightAngleMarks: z
			.array(
				z
					.object({
						vertex: z
							.string()
							.regex(TRI_POINT_ID)
							.describe(
								"The point ID where the right angle is located. This is the vertex of the 90-degree angle."
							),
						from: z
							.string()
							.regex(TRI_POINT_ID)
							.describe(
								"Point ID defining the first ray of the right angle, extending from the vertex."
							),
						to: z
							.string()
							.regex(TRI_POINT_ID)
							.describe(
								"Point ID defining the second ray of the right angle, extending from the vertex. The angle from 'from' to 'to' must be 90 degrees."
							),
						size: z
							.number()
							.positive()
							.nullable()
							.describe(
								"Optional custom size for the right angle square marker in pixels. If null, uses default size of 14 pixels."
							)
					})
					.strict()
					.describe(
						"Defines a right angle (90-degree) marker shown as a small square at the vertex between two rays."
					)
			)
			.nullable()
			.describe(
				"Optional array of right angle markers to explicitly show 90-degree angles in the diagram. These appear as small squares at the specified vertices. Useful for right triangles or when showing perpendicular constructions. Note: altitudes automatically include right angle markers, so this is only needed for other 90-degree angles."
			)
	})
	.strict()
	.describe(
		"Creates a constraint-based triangle diagram with rich geometric constructions. The triangle shape is determined by angle constraints (at least 2 numeric angles required). Supports interior and exterior angles, auxiliary points for constructions, altitudes with automatic right-angle markers, and customizable visual elements. Angles are specified using three points (vertex + two ray endpoints) allowing precise control over which angle is marked. The diagram automatically positions all elements to satisfy geometric constraints while maintaining visual clarity through smart label placement and arc radius adjustments."
	)

export type TriangleDiagramProps = z.infer<typeof TriangleDiagramPropsSchema>

type Vec = { x: number; y: number }
type AltitudeSpec = z.infer<ReturnType<typeof createAltitudeSchema>>

function toRad(deg: number): number {
	return (deg * Math.PI) / 180
}

// function toDeg(rad: number): number {
// 	return (rad * 180) / Math.PI
// }

function vecAdd(a: Vec, b: Vec): Vec {
	return { x: a.x + b.x, y: a.y + b.y }
}

function vecScale(a: Vec, s: number): Vec {
	return { x: a.x * s, y: a.y * s }
}

// function dist(a: Vec, b: Vec): number {
// 	return Math.hypot(a.x - b.x, a.y - b.y)
// }

function lineIntersection(p: Vec, v: Vec, q: Vec, w: Vec): Vec {
	// Solve p + t v = q + s w
	const det = v.x * w.y - v.y * w.x
	if (Math.abs(det) < 1e-9) {
		logger.error("triangle lines parallel", { v, w })
		throw errors.new("triangle geometry: parallel lines")
	}
	const t = ((q.x - p.x) * w.y - (q.y - p.y) * w.x) / det
	return { x: p.x + t * v.x, y: p.y + t * v.y }
}

function angleOf(v: Vec): number {
	return Math.atan2(v.y, v.x)
}

function drawArc(
	canvas: CanvasImpl,
	center: Vec,
	r: number,
	start: number,
	end: number,
	color: string
): void {
	// Normalize
	let s = start
	let e = end
	while (e - s > Math.PI * 2) e -= Math.PI * 2
	while (s - e > Math.PI * 2) s -= Math.PI * 2
	const largeFlag: 0 | 1 = Math.abs(e - s) > Math.PI ? 1 : 0
	const sweepFlag: 0 | 1 = e >= s ? 1 : 0
	const sx = center.x + r * Math.cos(s)
	const sy = center.y + r * Math.sin(s)
	const ex = center.x + r * Math.cos(e)
	const ey = center.y + r * Math.sin(e)
	const path = new Path2D()
		.moveTo(sx, sy)
		.arcTo(r, r, 0, largeFlag, sweepFlag, ex, ey)
	canvas.drawPath(path, {
		fill: "none",
		stroke: color,
		strokeWidth: theme.stroke.width.thick
	})
}

type AngleValue = z.infer<ReturnType<typeof createAngleValueSchema>>
type SideValue = z.infer<ReturnType<typeof createSideValueSchema>>

function angleValueToString(v: AngleValue): string {
	return v.type === "numeric" ? `${v.value}\u00B0` : v.symbol
}

function sideValueToString(v: SideValue): string {
	if (v.type === "numeric") return `${v.value}`
	if (v.type === "symbolic") return v.symbol
	if (v.type === "mathml") return v.value.toString()
	return ""
}

// forward-only schema: no legacy normalization helpers

export const generateTriangleDiagram: WidgetGenerator<
	typeof TriangleDiagramPropsSchema
> = async (props) => {
	const {
		width,
		height,
		angleArcs,
		sideLabels,
		points,
		extraPoints,
		constructionLines,
		lines,
		altitudes,
		rightAngleMarks
	} = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// --- Derive interior angles at A and B from constraints ---
	const idA = points.A.id
	const idB = points.B.id
	const idC = points.C.id

	const onSameLine = (...ids: string[]): boolean => {
		if (!lines) return false
		for (const L of lines) {
			let ok = true
			for (const id of ids)
				if (!L.includes(id)) {
					ok = false
					break
				}
			if (ok) return true
		}
		return false
	}

	type AngleMarkNormalized = {
		vertex: string
		from: string
		to: string
		value: AngleValue
		color: string
	}
	const angleMarks: AngleMarkNormalized[] = angleArcs.map((m) => ({
		vertex: m.vertex,
		from: m.from,
		to: m.to,
		value: m.value,
		color: m.color
	}))

	const rightAt = new Set<string>((rightAngleMarks ?? []).map((r) => r.vertex))

	// If all three provided angle marks are numeric (after interior conversion),
	// validate that the interior angles sum to 180°.
	function numericInteriorFromInput(vertex: string): number | null {
		let others: string[]
		if (vertex === idA) {
			others = [idB, idC]
		} else if (vertex === idB) {
			others = [idA, idC]
		} else {
			others = [idA, idB]
		}
		const arcs = angleMarks.filter(
			(a) => a.vertex === vertex && a.value.type === "numeric"
		)
		let v: number | null = null
		for (const a of arcs) {
			const f = a.from
			const t = a.to
			if (a.value.type !== "numeric") continue
			const val = a.value.value
			if (
				(f === others[0] && t === others[1]) ||
				(f === others[1] && t === others[0])
			) {
				v = val
				break
			}
			if (
				(f === others[0] && onSameLine(vertex, others[1], t)) ||
				(t === others[0] && onSameLine(vertex, others[1], f)) ||
				(f === others[1] && onSameLine(vertex, others[0], t)) ||
				(t === others[1] && onSameLine(vertex, others[0], f))
			) {
				v = 180 - val
				break
			}
		}
		return v
	}

	const AinProvided = numericInteriorFromInput(idA)
	const BinProvided = numericInteriorFromInput(idB)
	const CinProvided = numericInteriorFromInput(idC)
	const providedCount = [AinProvided, BinProvided, CinProvided].filter(
		(x): x is number => x != null
	).length
	if (
		providedCount === 3 &&
		AinProvided != null &&
		BinProvided != null &&
		CinProvided != null
	) {
		const sumProvided = AinProvided + BinProvided + CinProvided
		if (Math.abs(sumProvided - 180) > 1e-6) {
			logger.error("interior angles do not sum to 180", {
				A: AinProvided,
				B: BinProvided,
				C: CinProvided,
				sum: sumProvided
			})
			throw errors.new("angles sum invalid")
		}
	}

	function tryInteriorDegFor(vertex: string): number | null {
		let others: string[]
		if (vertex === idA) {
			others = [idB, idC]
		} else if (vertex === idB) {
			others = [idA, idC]
		} else {
			others = [idA, idB]
		}
		const arcs = angleMarks.filter(
			(a) => a.vertex === vertex && a.value.type === "numeric"
		)
		let fromArcs: number | null = null
		for (const a of arcs) {
			const f = a.from
			const t = a.to
			if (a.value.type !== "numeric") continue
			const val = a.value.value
			if (
				(f === others[0] && t === others[1]) ||
				(f === others[1] && t === others[0])
			) {
				fromArcs = val
				break
			}
			if (
				(f === others[0] && onSameLine(vertex, others[1], t)) ||
				(t === others[0] && onSameLine(vertex, others[1], f)) ||
				(f === others[1] && onSameLine(vertex, others[0], t)) ||
				(t === others[1] && onSameLine(vertex, others[0], f))
			) {
				fromArcs = 180 - val
				break
			}
		}
		if (fromArcs != null) {
			if (rightAt.has(vertex) && Math.abs(fromArcs - 90) > 1e-6) {
				logger.error("conflicting angle constraints at vertex", {
					vertex,
					numeric: fromArcs
				})
				throw errors.new("conflicting angle constraints")
			}
			return fromArcs
		}
		if (rightAt.has(vertex)) return 90
		return null
	}

	let Adeg = tryInteriorDegFor(idA)
	let Bdeg = tryInteriorDegFor(idB)
	let Cdeg = tryInteriorDegFor(idC)

	const known = [Adeg, Bdeg, Cdeg].filter(
		(v): v is number => typeof v === "number"
	)
	if (known.length < 2) {
		logger.error("insufficient numeric angle constraints", {
			hasA: Adeg != null,
			hasB: Bdeg != null,
			hasC: Cdeg != null
		})
		throw errors.new("insufficient numeric angle constraints")
	}
	if (Adeg == null && Bdeg != null && Cdeg != null) Adeg = 180 - (Bdeg + Cdeg)
	if (Bdeg == null && Adeg != null && Cdeg != null) Bdeg = 180 - (Adeg + Cdeg)
	if (Cdeg == null && Adeg != null && Bdeg != null) Cdeg = 180 - (Adeg + Bdeg)

	if (
		!(
			Adeg != null &&
			Bdeg != null &&
			Cdeg != null &&
			Adeg > 0 &&
			Bdeg > 0 &&
			Cdeg > 0
		)
	) {
		logger.error("derived triangle angles invalid", {
			A: Adeg,
			B: Bdeg,
			C: Cdeg
		})
		throw errors.new("invalid derived triangle angles")
	}

	// TypeScript now knows these are numbers after the null check above
	const AdegVal = Adeg
	const BdegVal = Bdeg
	// const CdegVal = Cdeg

	// --- Data space geometry (unit base), then fit to box ---
	const A_data: Vec = { x: 0, y: 0 }
	const B_data: Vec = { x: 1, y: 0 }
	const vA_data: Vec = {
		x: Math.cos(toRad(AdegVal)),
		y: -Math.sin(toRad(AdegVal))
	}
	const vB_data: Vec = {
		x: -Math.cos(toRad(BdegVal)),
		y: -Math.sin(toRad(BdegVal))
	}
	const C_data = lineIntersection(A_data, vA_data, B_data, vB_data)

	function computeFit(pointsList: Vec[]) {
		if (pointsList.length === 0) {
			return { scale: 1, project: (p: Vec) => p }
		}
		const minX = Math.min(...pointsList.map((p) => p.x))
		const maxX = Math.max(...pointsList.map((p) => p.x))
		const minY = Math.min(...pointsList.map((p) => p.y))
		const maxY = Math.max(...pointsList.map((p) => p.y))
		const rawW = maxX - minX
		const rawH = maxY - minY
		const scale = Math.min(
			(width - 2 * PADDING) / (rawW || 1),
			(height - 2 * PADDING) / (rawH || 1)
		)
		const offsetX = (width - scale * rawW) / 2 - scale * minX
		const offsetY = (height - scale * rawH) / 2 - scale * minY
		const project = (p: Vec) => ({
			x: offsetX + scale * p.x,
			y: offsetY + scale * p.y
		})
		return { scale, project }
	}

	const { project } = computeFit([A_data, B_data, C_data])
	const A = project(A_data)
	const B = project(B_data)
	const C = project(C_data)

	// Precompute interior-bisector directions for each triangle vertex to keep
	// angle labels inside the triangle consistently.
	function normalize(v: Vec): Vec {
		const L = Math.hypot(v.x, v.y) || 1
		return { x: v.x / L, y: v.y / L }
	}
	const centroid: Vec = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 }
	const interiorDirByVertex = new Map<string, number>()
	const sumVec = (p: Vec, q: Vec) => ({ x: p.x + q.x, y: p.y + q.y })
	{
		const uAB = normalize({ x: B.x - A.x, y: B.y - A.y })
		const uAC = normalize({ x: C.x - A.x, y: C.y - A.y })
		const insideA = normalize(sumVec(uAB, uAC))
		interiorDirByVertex.set(idA, angleOf(insideA))
	}
	{
		const uBA = normalize({ x: A.x - B.x, y: A.y - B.y })
		const uBC = normalize({ x: C.x - B.x, y: C.y - B.y })
		const insideB = normalize(sumVec(uBA, uBC))
		interiorDirByVertex.set(idB, angleOf(insideB))
	}
	{
		const uCA = normalize({ x: A.x - C.x, y: A.y - C.y })
		const uCB = normalize({ x: B.x - C.x, y: B.y - C.y })
		const insideC = normalize(sumVec(uCA, uCB))
		interiorDirByVertex.set(idC, angleOf(insideC))
	}

	// We'll draw arcs first; lines and labels will be drawn after to sit on top
	const vertexFont = theme.font.size.large

	// Build id map including primary vertices
	const idToPoint = new Map<string, Vec>([
		[idA, A],
		[idB, B],
		[idC, C]
	])

	// Place auxiliary points using colinear constraints
	if (lines) {
		for (const line of lines) {
			const knownIdx: number[] = []
			for (let i = 0; i < line.length; i++)
				if (idToPoint.has(line[i])) knownIdx.push(i)
			if (knownIdx.length < 2) continue
			const p1 = idToPoint.get(line[knownIdx[0]])
			const p2 = idToPoint.get(line[knownIdx[1]])
			if (!p1 || !p2) continue
			const dir = { x: p2.x - p1.x, y: p2.y - p1.y }
			const baseLen = Math.hypot(dir.x, dir.y) || 1
			const ux = dir.x / baseLen
			const uy = dir.y / baseLen
			const step = baseLen * 0.3
			const anchor = knownIdx[0]
			for (let i = anchor + 1; i < line.length; i++) {
				const prev = idToPoint.get(line[i - 1])
				const curId = line[i]
				if (!prev) break
				if (!idToPoint.has(curId))
					idToPoint.set(curId, { x: prev.x + step * ux, y: prev.y + step * uy })
			}
			for (let i = anchor - 1; i >= 0; i--) {
				const next = idToPoint.get(line[i + 1])
				const curId = line[i]
				if (!next) break
				if (!idToPoint.has(curId))
					idToPoint.set(curId, { x: next.x - step * ux, y: next.y - step * uy })
			}

			// Do not draw base lines yet; arcs will be drawn first
		}
	}

	// Build screen segments for collision detection (triangle edges + explicit base lines)
	const screenSegments: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = []
	screenSegments.push({ a: A, b: B }, { a: B, b: C }, { a: C, b: A })
	if (lines) {
		for (const line of lines) {
			for (let i = 1; i < line.length; i++) {
				const p1 = idToPoint.get(line[i - 1])
				const p2 = idToPoint.get(line[i])
				if (p1 && p2) screenSegments.push({ a: p1, b: p2 })
			}
		}
	}

	// Optional construction lines
	if (constructionLines) {
		for (const line of constructionLines) {
			const pts = line.points
				.map((pid: string) => idToPoint.get(pid))
				.filter((p: Vec | undefined): p is Vec => p != null)
			if (pts.length >= 2) {
				let dash: string | undefined
				if (line.style === "dashed") {
					dash = "4 3"
				} else if (line.style === "dotted") {
					dash = "2 4"
				} else {
					dash = undefined
				}
				for (let i = 1; i < pts.length; i++) {
					const p1 = pts[i - 1]
					const p2 = pts[i]
					canvas.drawLine(p1.x, p1.y, p2.x, p2.y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.base,
						dash
					})
					screenSegments.push({ a: p1, b: p2 })
				}
			}
		}
	}

	// Precompute altitude segments BEFORE placing angle labels so labels can avoid them
	const precomputedAltitudes: Array<{ alt: AltitudeSpec; v: Vec; foot: Vec }> =
		[]
	if (altitudes) {
		const sideMap: Record<"AB" | "BC" | "CA", { p1: Vec; p2: Vec }> = {
			AB: { p1: A, p2: B },
			BC: { p1: B, p2: C },
			CA: { p1: C, p2: A }
		}
		const vertexMap: Record<string, Vec> = {
			[points.A.id]: A,
			[points.B.id]: B,
			[points.C.id]: C
		}
		for (const alt of altitudes) {
			const v = vertexMap[alt.vertex]
			const base = sideMap[alt.toSide]
			if (!v || !base) {
				logger.error("altitude references unknown points", { alt })
				throw errors.new("invalid altitude references")
			}
			const bx = base.p2.x - base.p1.x
			const by = base.p2.y - base.p1.y
			const len2 = bx * bx + by * by
			if (len2 === 0) {
				logger.error("altitude base degenerate", { alt })
				throw errors.new("invalid altitude base")
			}
			const t = ((v.x - base.p1.x) * bx + (v.y - base.p1.y) * by) / len2
			if (t < 0 || t > 1) {
				logger.error("altitude foot outside segment", { alt, t })
				throw errors.new("altitude foot outside segment")
			}
			const foot: Vec = { x: base.p1.x + t * bx, y: base.p1.y + t * by }
			precomputedAltitudes.push({ alt, v, foot })
			// include altitude line in collision segments so angle labels avoid it
			screenSegments.push({ a: v, b: foot })
		}
	}

	// Draw angle arcs by three points (uniform radius, minor arc only)
	// Track preferred label directions: opposite the arc's mid-angle
	const preferredOppositeByVertex = new Map<string, number>()
	for (const mark of angleArcs) {
		// Independent control for arc and label visibility
		const drawArcVisible: boolean = mark.showArc === true
		const drawLabelVisible: boolean = mark.showLabel === true
		const center = idToPoint.get(mark.vertex)
		const pf = idToPoint.get(mark.from)
		const pt = idToPoint.get(mark.to)
		if (!center || !pf || !pt) {
			logger.error("missing points for angle arc", { mark })
			throw errors.new("missing points for angle arc")
		}

		const v1: Vec = { x: pf.x - center.x, y: pf.y - center.y }
		const v2: Vec = { x: pt.x - center.x, y: pt.y - center.y }

		let a1 = angleOf(v1)
		let a2 = angleOf(v2)
		let d = a2 - a1
		while (d <= -Math.PI) d += 2 * Math.PI
		while (d > Math.PI) d -= 2 * Math.PI
		const sweep = Math.abs(d)
		let start = d >= 0 ? a1 : a2
		let end = start + sweep

		// Dynamic, screen-space arc radius: doubled base, scaled by angle size (smaller angle -> slightly larger radius)
		const baseArcRadius = 36
		const sweepRatio = Math.min(Math.max(sweep / Math.PI, 0), 1) // 0..1 for 0..180°
		const sizeScale = 0.85 + (1 - sweepRatio) * 0.35 // 0.85..1.2
		const arcRadius = baseArcRadius * sizeScale
		if (drawArcVisible) {
			drawArc(canvas, center, arcRadius, start, end, mark.color)
		}

		// Label with collision-aware placement using estimated text size.
		// Always prefer INSIDE the triangle. For triangle vertices use the
		// interior angle bisector; for auxiliary points use the direction
		// towards the triangle centroid.
		const mid = (start + end) / 2 // kept for arc construction only
		const baseR = arcRadius + 18
		const centerToCentroid: Vec = {
			x: centroid.x - center.x,
			y: centroid.y - center.y
		}
		const interiorAngle =
			interiorDirByVertex.get(mark.vertex) ?? angleOf(centerToCentroid)
		// Save opposite (outward) direction for vertex letter placement later
		preferredOppositeByVertex.set(
			mark.vertex,
			(interiorAngle + Math.PI) % (2 * Math.PI)
		)
		// const segments = [
		// 	{ p1: A, p2: B },
		// 	{ p1: B, p2: C },
		// 	{ p1: C, p2: A }
		// ]
		// const orient = (a: Vec, b: Vec, c: Vec) => {
		// 	const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
		// 	if (val > 1e-9) return 1
		// 	if (val < -1e-9) return -1
		// 				return 0
		// 			}
		// const intersects = (a: Vec, b: Vec, c: Vec, d2: Vec) => {
		// 	const o1 = orient(a, b, c)
		// 	const o2 = orient(a, b, d2)
		// 	const o3 = orient(c, d2, a)
		// 	const o4 = orient(c, d2, b)
		// 	return o1 !== o2 && o3 !== o4
		// }
		// const rectHitsAnySegment = (rect: { x: number; y: number; width: number; height: number; pad?: number }): boolean => {
		// const pad = rect.pad ?? 0
		// const rx = rect.x - pad
		// const ry = rect.y - pad
		// const rw = rect.width + 2 * pad
		// const rh = rect.height + 2 * pad
		// const corners = [
		// 	{ x: rx, y: ry },
		// 	{ x: rx + rw, y: ry },
		// 	{ x: rx + rw, y: ry + rh },
		// 	{ x: rx, y: ry + rh }
		// ]
		// for (const s of segments) {
		// 	if (
		// 		intersects(s.p1, s.p2, corners[0], corners[1]) ||
		// 		intersects(s.p1, s.p2, corners[1], corners[2]) ||
		// 		intersects(s.p1, s.p2, corners[2], corners[3]) ||
		// 		intersects(s.p1, s.p2, corners[3], corners[0])
		// 	) {
		// 		return true
		// 	}
		// }
		// return false
		// }
		if (!drawLabelVisible) continue
		const text = angleValueToString(mark.value)
		const fontPx = theme.font.size.medium
		const { maxWidth, height: textH } = estimateWrappedTextDimensions(
			text,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = maxWidth / 2
		const halfH = textH / 2
		let best = {
			x: center.x + baseR * Math.cos(mid),
			y: center.y + baseR * Math.sin(mid)
		}
		let minHits = Number.POSITIVE_INFINITY
		// Prefer placing labels opposite the triangle interior
		// const tri = [A, B, C]
		// function pointInTriangle(p: Vec): boolean {
		// const [p0, p1, p2] = tri
		// const area = (a: Vec, b: Vec, c: Vec) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
		// const s1 = area(p0, p1, p)
		// const s2 = area(p1, p2, p)
		// const s3 = area(p2, p0, p)
		// const hasNeg = (s1 < 0) || (s2 < 0) || (s3 < 0)
		// const hasPos = (s1 > 0) || (s2 > 0) || (s3 > 0)
		// return !(hasNeg && hasPos)
		// }
		// Try interior first unless the angle is very acute; if collisions persist, flip outside
		for (const dr of [0, 8, -8, 16, -16, 24]) {
			for (const dt of [0, Math.PI / 18, -Math.PI / 18]) {
				const r = baseR + dr
				const ang = interiorAngle + dt
				const x = center.x + r * Math.cos(ang)
				const y = center.y + r * Math.sin(ang)
				const rect = {
					x: x - halfW,
					y: y - halfH,
					width: maxWidth,
					height: textH,
					pad: 2
				}
				const hits = rectIntersectsAnySegment(rect) ? 1 : 0
				if (hits < minHits) {
					minHits = hits
					best = { x, y }
				}
				if (minHits === 0) break
			}
			if (minHits === 0) break
		}
		canvas.drawText({
			x: best.x,
			y: best.y,
			text,
			fill: theme.colors.black,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			fontWeight: theme.font.weight.bold
		})
	}

	// After arcs: draw triangle lines and any explicit base lines so lines sit on top
	canvas.drawPolygon([A, B, C], {
		fill: "none",
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick
	})
	if (lines) {
		for (const line of lines) {
			for (let i = 1; i < line.length; i++) {
				const a = idToPoint.get(line[i - 1])
				const b = idToPoint.get(line[i])
				if (a && b)
					canvas.drawLine(a.x, a.y, b.x, b.y, {
						stroke: theme.colors.black,
						strokeWidth: theme.stroke.width.thick
					})
			}
		}
	}

	// Altitudes (dropped heights)
	if (altitudes) {
		for (const { alt, v, foot } of precomputedAltitudes) {
			const dash = alt.style === "dashed" ? "4 3" : "2 4"
			canvas.drawLine(v.x, v.y, foot.x, foot.y, {
				stroke: alt.color,
				strokeWidth: theme.stroke.width.base,
				dash
			})
			if (alt.withRightAngle) {
				// Draw right angle square at foot using base direction and altitude direction
				const bx = foot.x - v.x
				const by = foot.y - v.y
				// base direction should be perpendicular to altitude; reuse triangle side for orthonormal marker
				// approximate using small square aligned with altitude and a perpendicular
				const al = Math.hypot(bx, by) || 1
				const nax = (v.x - foot.x) / al
				const nay = (v.y - foot.y) / al
				// For the second leg, project along the triangle side direction nearest the altitude foot by using AB/BC/CA mapping
				const s = 14
				const perpX = -nay
				const perpY = nax
				const p1 = { x: foot.x + perpX * s, y: foot.y + perpY * s }
				const p2 = { x: foot.x + nax * s, y: foot.y + nay * s }
				const corner = { x: p1.x + nax * s, y: p1.y + nay * s }
				canvas.drawLine(p1.x, p1.y, corner.x, corner.y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.thick
				})
				canvas.drawLine(p2.x, p2.y, corner.x, corner.y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.thick
				})
			}
			if (alt.value) {
				const mid = { x: (v.x + foot.x) / 2, y: (v.y + foot.y) / 2 }
				const dx = foot.x - v.x
				const dy = foot.y - v.y
				const L = Math.hypot(dx, dy) || 1

				// Calculate rotation angle to make altitude label parallel to the altitude line
				let rotationAngle = Math.atan2(dy, dx) * (180 / Math.PI)

				// Ensure text is readable (not upside down) by flipping if needed
				if (rotationAngle > 90 || rotationAngle < -90) {
					rotationAngle += 180
				}

				const nx = -dy / L
				const ny = dx / L
				const off = 14
				canvas.drawText({
					x: mid.x + nx * off,
					y: mid.y + ny * off,
					text: sideValueToString(alt.value),
					fill: theme.colors.black,
					anchor: "middle",
					dominantBaseline: "middle",
					rotate: {
						angle: rotationAngle,
						cx: mid.x + nx * off,
						cy: mid.y + ny * off
					}
				})
			}
		}
	}

	// Collision helpers inspired by radially-constrained-angle-diagram
	function segmentIntersectsRect(
		Apt: { x: number; y: number },
		Bpt: { x: number; y: number },
		rect: { x: number; y: number; width: number; height: number; pad?: number }
	): boolean {
		const pad = rect.pad ?? 0
		const rx = rect.x - pad
		const ry = rect.y - pad
		const rw = rect.width + 2 * pad
		const rh = rect.height + 2 * pad
		const minX = Math.min(Apt.x, Bpt.x)
		const maxX = Math.max(Apt.x, Bpt.x)
		const minY = Math.min(Apt.y, Bpt.y)
		const maxY = Math.max(Apt.y, Bpt.y)
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
			segmentsIntersect(Apt, Bpt, r1, r2) ||
			segmentsIntersect(Apt, Bpt, r2, r3) ||
			segmentsIntersect(Apt, Bpt, r3, r4) ||
			segmentsIntersect(Apt, Bpt, r4, r1)
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

	// Vertex labels A, B, C and point markers
	canvas.drawCircle(A.x, A.y, 5, { fill: theme.colors.black })
	canvas.drawCircle(B.x, B.y, 5, { fill: theme.colors.black })
	canvas.drawCircle(C.x, C.y, 5, { fill: theme.colors.black })

	function placePointLabel(pos: Vec, text: string, preferredAngleRad?: number) {
		const fontPx = vertexFont
		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			text,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = w / 2
		const halfH = h / 2
		let best = { x: pos.x, y: pos.y }
		let minCollisions = Number.POSITIVE_INFINITY
		// Build candidate angles prioritizing the preferred direction, then spread
		const angleCandidates: number[] = []
		if (typeof preferredAngleRad === "number") {
			angleCandidates.push(preferredAngleRad)
			angleCandidates.push(
				preferredAngleRad + Math.PI / 6,
				preferredAngleRad - Math.PI / 6
			)
			angleCandidates.push(
				preferredAngleRad + Math.PI / 3,
				preferredAngleRad - Math.PI / 3
			)
		}
		for (let i = 0; i < 8; i++) angleCandidates.push((i * Math.PI) / 4)
		for (const ang of angleCandidates) {
			for (const dist of [24, 34, 14, 44]) {
				const tx = pos.x + dist * Math.cos(ang)
				const ty = pos.y + dist * Math.sin(ang)
				const rect = {
					x: tx - halfW,
					y: ty - halfH,
					width: w,
					height: h,
					pad: 2
				}
				const hits = rectIntersectsAnySegment(rect) ? 1 : 0
				if (hits < minCollisions) {
					minCollisions = hits
					best = { x: tx, y: ty }
				}
				if (minCollisions === 0) break
			}
			if (minCollisions === 0) break
		}
		canvas.drawText({
			x: best.x,
			y: best.y,
			text,
			fill: theme.colors.black,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			fontWeight: theme.font.weight.bold
		})
	}

	placePointLabel(A, points.A.label, preferredOppositeByVertex.get(points.A.id))
	placePointLabel(B, points.B.label, preferredOppositeByVertex.get(points.B.id))
	placePointLabel(C, points.C.label, preferredOppositeByVertex.get(points.C.id))

	// Draw markers and labels for extra points positioned via lines
	if (extraPoints) {
		for (const p of extraPoints) {
			const pos = idToPoint.get(p.id)
			if (!pos) continue
			canvas.drawCircle(pos.x, pos.y, 5, { fill: theme.colors.black })
			placePointLabel(pos, p.label)
		}
	}

	// Optional side labels (screen space)
	if (sideLabels) {
		const placeSideLabel = (
			p1: Vec,
			p2: Vec,
			lbl: z.infer<ReturnType<typeof createSideValueSchema>> | null
		) => {
			if (!lbl) return
			const mid = vecScale(vecAdd(p1, p2), 0.5)
			const dx = p2.x - p1.x
			const dy = p2.y - p1.y
			const len = Math.hypot(dx, dy)
			if (len === 0) return

			// Calculate rotation angle to make text parallel to the line
			let rotationAngle = Math.atan2(dy, dx) * (180 / Math.PI)

			// Ensure text is readable (not upside down) by flipping if needed
			if (rotationAngle > 90 || rotationAngle < -90) {
				rotationAngle += 180
			}

			const nx = -dy / len
			const ny = dx / len
			const off = 20
			const lx = mid.x + nx * off
			const ly = mid.y + ny * off

			if (lbl.type === "mathml") {
				// For MathML, we'll use transform on the foreignObject to rotate it
				const fontPx = theme.font.size.large
				const labelWidth = 120
				const labelHeight = 32
				const transform = `rotate(${rotationAngle} ${lx} ${ly})`
				const xhtml = `<!DOCTYPE html><div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:flex-end;justify-content:center;width:100%;height:100%;line-height:1;font-family:${theme.font.family.sans};color:${theme.colors.black};"><math xmlns="http://www.w3.org/1998/Math/MathML" display="inline" style="font-size:${fontPx * 1.1}px;">${lbl.mathml}</math></div>`
				canvas.drawForeignObject({
					x: lx - labelWidth / 2,
					y: ly - labelHeight / 2,
					width: labelWidth,
					height: labelHeight,
					content: xhtml,
					transform
				})
				return
			}

			// For regular text, use the rotate parameter
			canvas.drawText({
				x: lx,
				y: ly,
				text: sideValueToString(lbl),
				fill: theme.colors.black,
				anchor: "middle",
				dominantBaseline: "middle",
				rotate: { angle: rotationAngle, cx: lx, cy: ly }
			})
		}
		placeSideLabel(A, B, sideLabels.AB)
		placeSideLabel(B, C, sideLabels.BC)
		placeSideLabel(C, A, sideLabels.CA)
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.medium}">${svgBody}</svg>`
}
