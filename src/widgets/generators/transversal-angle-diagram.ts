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

// Id regexes and base schemas (ids are type-safe by prefix)
const RAY_POINT_ID = /^pt_ray_[A-Za-z0-9_]+$/
const CYCLE_POINT_ID = /^pt_cycle_[A-Za-z0-9_]+$/
const ENDPOINT_ID = /^(?:pt_ray_|pt_cycle_)[A-Za-z0-9_]+$/

// Explicit ray mapping type to avoid recursive type references
type Rays = {
	mainPlus: string
	mainMinus: string
	transversalPlus: string
	transversalMinus: string
}

function createPointRaySchema() {
	return z
		.object({
			id: z.string().regex(RAY_POINT_ID),
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
		})
		.strict()
}

function createPointCycleSchema() {
	return z
		.object({
			id: z.string().regex(CYCLE_POINT_ID),
			label: z
				.string()
				.nullable()
				.transform((val) =>
					val === "null" || val === "NULL" || val === "" ? null : val
				)
		})
		.strict()
}

// NEW: Points schema with semantic keys defining the role of each of the 8 points.
const PointsObjectSchema = z
	.object({
		// The four points on the transversal, in order.
		transversalRayA: createPointRaySchema(),
		intersection1: createPointCycleSchema(),
		intersection2: createPointCycleSchema(),
		transversalRayB: createPointRaySchema(),

		// The two ray endpoints for the first line.
		line1RayA: createPointRaySchema(),
		line1RayB: createPointRaySchema(),

		// The two ray endpoints for the second line.
		line2RayA: createPointRaySchema(),
		line2RayB: createPointRaySchema()
	})
	.strict()
	.describe(
		"Defines the 8 points of the diagram by their geometric role. The transversal path is implicitly defined by the key order: transversalRayA → intersection1 → intersection2 → transversalRayB."
	)

// NEW: A schema that defines the entire cycle at intersection 1
// with a single, unambiguous choice.
const Intersection1CycleSchema = z.object({
	nextClockwiseFromTransversalA: z
		.enum(["line1RayA", "line1RayB"])
		.describe(
			"The key of the point on the main line that comes immediately after 'transversalRayA' in clockwise order around 'intersection1'."
		)
})

// NEW: A schema that does the same for intersection 2.
const Intersection2CycleSchema = z.object({
	nextClockwiseFromIntersection1: z
		.enum(["line2RayA", "line2RayB"])
		.describe(
			"The key of the point on the main line that comes immediately after 'intersection1' in clockwise order around 'intersection2'."
		)
})

function createAngleSchema() {
	return z
		.object({
			label: z
				.string()
				.describe("Numeric or symbolic label for the wedge (e.g., '6')."),
			color: z
				.string()
				.regex(CSS_COLOR_PATTERN, "Invalid CSS color format")
				.describe("Fill color for the sector."),
			vertex: z
				.string()
				.regex(CYCLE_POINT_ID)
				.describe("Vertex id; must be one of the two intersection centers."),
			from: z
				.string()
				.regex(ENDPOINT_ID)
				.describe(
					"Starting endpoint id at the vertex's around set (ray or center)."
				),
			to: z
				.string()
				.regex(ENDPOINT_ID)
				.describe(
					"Ending endpoint id at the vertex's around set (ray or center)."
				)
		})
		.strict()
}

// NEW: The final, more explicit props schema
function createTransversalAngleDiagramPropsSchema() {
	return z
		.object({
			type: z
				.literal("transversalAngleDiagram")
				.describe("Identifies this as a transversal angle diagram widget."),
			width: createWidthSchema(),
			height: createHeightSchema(),

			// Single source of truth for all points and their roles.
			points: PointsObjectSchema,

			// Control the visual orientation (each main line can have its own angle)
			line1Angle: z
				.number()
				.min(-360)
				.max(360)
				.describe("The angle of the first main line in degrees."),
			line2Angle: z
				.number()
				.min(-360)
				.max(360)
				.describe("The angle of the second main line in degrees."),
			transversalAngle: z
				.number()
				.min(-360)
				.max(360)
				.describe("The angle of the transversal line in degrees."),

			// NEW: The cycle at each intersection is defined by a single,
			// type-safe choice, banning impossible orderings.
			intersection1Cycle: Intersection1CycleSchema,
			intersection2Cycle: Intersection2CycleSchema,

			angles: z
				.array(createAngleSchema())
				.min(1)
				.describe(
					"Angles defined by vertex/from/to ids with labels and colors."
				)
		})
		.strict()
}

export const TransversalAngleDiagramPropsSchema =
	createTransversalAngleDiagramPropsSchema()
export type TransversalAngleDiagramProps = z.infer<
	typeof TransversalAngleDiagramPropsSchema
>

/**
 * Generates an SVG diagram of two lines intersected by a transversal using constraint-first inputs.
 */
export const generateTransversalAngleDiagram: WidgetGenerator<
	typeof TransversalAngleDiagramPropsSchema
> = async (props) => {
	const {
		width,
		height,
		line1Angle,
		line2Angle,
		transversalAngle,
		points,
		intersection1Cycle,
		intersection2Cycle,
		angles
	} = props

	// --- BEGIN RUNTIME INVARIANT VALIDATION ---
	const norm = (deg: number) => ((deg % 180) + 180) % 180
	if (
		norm(transversalAngle) === norm(line1Angle) ||
		norm(transversalAngle) === norm(line2Angle)
	) {
		logger.error("invalid geometry: transversal parallel to a main line", {
			line1Angle,
			line2Angle,
			transversalAngle
		})
		throw errors.new("transversal cannot be parallel to either main line")
	}

	// Build id→label map and uniqueness check
	const allPointEntries = Object.values(points)
	const idSet = new Set(allPointEntries.map((p) => p.id))
	if (idSet.size !== allPointEntries.length) {
		logger.error("duplicate point ids detected in points object")
		throw errors.new("duplicate point ids")
	}
	const pointsById = new Map(allPointEntries.map((p) => [p.id, p]))
	// --- END RUNTIME INVARIANT VALIDATION ---

	// --- BEGIN DERIVATION FROM SCHEMA ---
	// The schema's structure guarantees these relationships are valid.
	const allTransversal = [
		points.transversalRayA.id,
		points.intersection1.id,
		points.intersection2.id,
		points.transversalRayB.id
	]

	// Derive the full clockwise order for intersection 1 from the single user choice.
	const i1Choice = intersection1Cycle.nextClockwiseFromTransversalA
	const i1OppositeChoice = i1Choice === "line1RayA" ? "line1RayB" : "line1RayA"
	const clockwiseKeys1 = [
		"transversalRayA",
		i1Choice,
		"intersection2", // Opposite on transversal
		i1OppositeChoice
	] as const

	// Derive the full clockwise order for intersection 2.
	const i2Choice = intersection2Cycle.nextClockwiseFromIntersection1
	const i2OppositeChoice = i2Choice === "line2RayA" ? "line2RayB" : "line2RayA"
	const clockwiseKeys2 = [
		"intersection1",
		i2Choice,
		"transversalRayB", // Opposite on transversal
		i2OppositeChoice
	] as const

	const degToRad = (deg: number) => (deg * Math.PI) / 180
	const normalizeRad = (ang: number) => {
		let a = ang % (2 * Math.PI)
		if (a < 0) a += 2 * Math.PI
		return a
	}

	// (previous helper removed; alignment handled by alignAndMap)

	// This is the core replacement for the old, complex `assignRays` function.
	// We rotate the logical cycle to align with the geometric one.
	const alignAndMap = (
		logicalKeys: ReadonlyArray<keyof typeof points>,
		mainAngleDeg: number,
		transAngleDeg: number
	) => {
		// This alignment assumes the first key in logicalKeys corresponds to the
		// 'minus' direction on the transversal relative to the diagram's center.
		//
		// IMPORTANT: We anchor BOTH intersections to the transversal "minus" side.
		// Doing so guarantees that the two ray endpoints on the transversal
		// (E near intersection1 and F near intersection2) are placed on opposite
		// sides of the diagram. Previously, anchoring intersection2 to
		// "transversalPlus" caused both E and F to land on the same side.
		const transAnchorKey = "transversalMinus"
		const mainAngle = degToRad(mainAngleDeg)
		const transAngle = degToRad(transAngleDeg)

		const directions = [
			{ key: "transversalPlus" as const, ang: normalizeRad(transAngle) },
			{ key: "mainPlus" as const, ang: normalizeRad(mainAngle) },
			{
				key: "transversalMinus" as const,
				ang: normalizeRad(transAngle + Math.PI)
			},
			{ key: "mainMinus" as const, ang: normalizeRad(mainAngle + Math.PI) }
		]
		const geometricOrder = directions
			.sort((a, b) => a.ang - b.ang)
			.map((d) => d.key)

		const anchorIndex = geometricOrder.indexOf(transAnchorKey)
		if (anchorIndex === -1) {
			logger.error("anchor key not found", { transAnchorKey, geometricOrder })
			throw errors.new("internal error: anchor key not found")
		}

		// Build entries first, then materialize a strictly-typed record ensuring all keys are present
		const entries: Array<
			[
				"mainPlus" | "mainMinus" | "transversalPlus" | "transversalMinus",
				string
			]
		> = []
		for (let i = 0; i < 4; i++) {
			const geoKey = geometricOrder[(anchorIndex + i) % 4]
			const logicalId = points[logicalKeys[i]].id
			entries.push([geoKey, logicalId])
		}
		const m = new Map(entries)
		const get = (
			k: "mainPlus" | "mainMinus" | "transversalPlus" | "transversalMinus"
		): string => {
			const v = m.get(k)
			if (v === undefined) {
				logger.error("ray key missing", { key: k })
				throw errors.new("ray key missing")
			}
			return v
		}
		return {
			mainPlus: get("mainPlus"),
			mainMinus: get("mainMinus"),
			transversalPlus: get("transversalPlus"),
			transversalMinus: get("transversalMinus")
		}
	}

	// For intersection 1, `transversalRayA` is the reference, which is on the "minus" side of the transversal.
	// But `intersection2` is on the "plus" side. So we must reverse its logical key order before aligning.
	const raysLine1 = alignAndMap(clockwiseKeys1, line1Angle, transversalAngle)
	const raysLine2 = alignAndMap(clockwiseKeys2, line2Angle, transversalAngle)

	type Intersection = {
		label: string
		rays: Rays
		angles: Array<{
			span: "byEndpoints"
			label: string
			color: string
			fromEndpoint: string
			toEndpoint: string
		}>
	}

	const intersections: { line1: Intersection; line2: Intersection } = {
		line1: {
			label: points.intersection1.id,
			rays: raysLine1,
			angles: []
		},
		line2: {
			label: points.intersection2.id,
			rays: raysLine2,
			angles: []
		}
	}

	// Compile angles, validating they belong to the correct, derived intersection sets.
	for (const a of angles) {
		let target: Intersection | null = null
		if (a.vertex === intersections.line1.label) {
			target = intersections.line1
		} else if (a.vertex === intersections.line2.label) {
			target = intersections.line2
		} else {
			target = null
		}
		if (!target) {
			logger.error("angle vertex not at intersections", {
				vertex: a.vertex,
				centers: [intersections.line1.label, intersections.line2.label]
			})
			throw errors.new("angle vertex must be one of the two intersections")
		}
		if (a.from === a.to) {
			logger.error("angle endpoints identical", { vertex: a.vertex })
			throw errors.new("angle endpoints must be distinct")
		}
		const allowed = new Set(Object.values(target.rays))
		if (!allowed.has(a.from) || !allowed.has(a.to)) {
			logger.error("angle endpoints not in around set", {
				vertex: a.vertex,
				from: a.from,
				to: a.to,
				allowed: Array.from(allowed)
			})
			throw errors.new(
				"angle endpoints must be in the derived around set for that vertex"
			)
		}
		target.angles.push({
			span: "byEndpoints",
			label: a.label,
			color: a.color,
			fromEndpoint: a.from,
			toEndpoint: a.to
		})
	}
	// --- END DERIVATION ---

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 16,
		lineHeightDefault: 1.2
	})

	const cx = width / 2
	const cy = height / 2
	const toRad = (deg: number) => (deg * Math.PI) / 180

	const line1Rad = toRad(line1Angle)
	const line2Rad = toRad(line2Angle)
	const transversalRad = toRad(transversalAngle)

	// Layout: intersection points along transversal
	const spacing = Math.min(width, height) * 0.25
	const dx = (spacing / 2) * Math.cos(transversalRad)
	const dy = (spacing / 2) * Math.sin(transversalRad)
	const intersectionPos = {
		line1: { x: cx - dx, y: cy - dy },
		line2: { x: cx + dx, y: cy + dy }
	}

	const resolveBaseAngle = (
		raySide: "main" | "transversal",
		main: "line1" | "line2"
	): number => {
		if (raySide === "transversal") return transversalRad
		if (main === "line1") return line1Rad
		return line2Rad
	}
	const angleForRay = (dir: "+" | "-", base: number) =>
		dir === "+" ? base : base + Math.PI

	function labelsToAngles(
		main: "line1" | "line2",
		rays: Rays
	): Map<string, number> {
		const map = new Map<string, number>()
		map.set(rays.mainPlus, angleForRay("+", resolveBaseAngle("main", main)))
		map.set(rays.mainMinus, angleForRay("-", resolveBaseAngle("main", main)))
		map.set(
			rays.transversalPlus,
			angleForRay("+", resolveBaseAngle("transversal", main))
		)
		map.set(
			rays.transversalMinus,
			angleForRay("-", resolveBaseAngle("transversal", main))
		)
		return map
	}

	// Draw sectors first
	const sectorRadius = spacing * 0.3
	const labelRadius = sectorRadius + 14
	const pendingAngleLabels: Array<{
		x: number
		y: number
		text: string
		midAngleRad: number
		origin: { x: number; y: number }
	}> = []

	function drawAnglesFor(
		main: "line1" | "line2",
		at: { x: number; y: number },
		inter: Intersection
	) {
		const map = labelsToAngles(main, inter.rays)
		const resolveAngle = (
			centerLabel: string,
			endpointLabel: string
		): number => {
			const ang = map.get(endpointLabel)
			if (typeof ang === "number") return ang

			// Handle cases where an angle is defined to a point farther down the transversal
			const ci = allTransversal.indexOf(centerLabel)
			const ei = allTransversal.indexOf(endpointLabel)
			if (ci >= 0 && ei >= 0 && ci !== ei) {
				const plus = map.get(inter.rays.transversalPlus)
				const minus = map.get(inter.rays.transversalMinus)
				if (plus === undefined || minus === undefined) {
					logger.error("missing transversal ray angles", {
						centerLabel,
						endpointLabel
					})
					throw errors.new("missing transversal ray angles")
				}
				return ei > ci ? plus : minus
			}
			logger.error("unresolvable endpoint label for angle", {
				centerLabel,
				endpointLabel
			})
			throw errors.new("unresolvable endpoint label")
		}
		for (const a of inter.angles) {
			const startAngleRad = resolveAngle(inter.label, a.fromEndpoint)
			const endAngleRad = resolveAngle(inter.label, a.toEndpoint)
			let sweep = endAngleRad - startAngleRad
			if (sweep <= -Math.PI) sweep += 2 * Math.PI
			if (sweep > Math.PI) sweep -= 2 * Math.PI

			const startX = at.x + sectorRadius * Math.cos(startAngleRad)
			const startY = at.y + sectorRadius * Math.sin(startAngleRad)
			const arcEndAngleRad = startAngleRad + sweep
			const endX = at.x + sectorRadius * Math.cos(arcEndAngleRad)
			const endY = at.y + sectorRadius * Math.sin(arcEndAngleRad)
			const largeArcFlag: 0 | 1 = Math.abs(sweep) > Math.PI ? 1 : 0
			const sweepFlag: 0 | 1 = sweep >= 0 ? 1 : 0
			const path = new Path2D()
				.moveTo(at.x, at.y)
				.lineTo(startX, startY)
				.arcTo(
					sectorRadius,
					sectorRadius,
					0,
					largeArcFlag,
					sweepFlag,
					endX,
					endY
				)
				.closePath()
			canvas.drawPath(path, { fill: a.color, stroke: "none" })

			const midAngleRad = startAngleRad + sweep / 2
			pendingAngleLabels.push({
				x: at.x + labelRadius * Math.cos(midAngleRad),
				y: at.y + labelRadius * Math.sin(midAngleRad),
				text: a.label,
				midAngleRad,
				origin: { x: at.x, y: at.y }
			})
		}
	}

	drawAnglesFor("line1", intersectionPos.line1, intersections.line1)
	drawAnglesFor("line2", intersectionPos.line2, intersections.line2)

	// Draw lines above sectors
	const lineLength = Math.max(width, height) * 0.8
	const screenSegments: Array<{
		a: { x: number; y: number }
		b: { x: number; y: number }
	}> = []
	const drawLine = (center: { x: number; y: number }, angleRad: number) => {
		const ldx = (lineLength / 2) * Math.cos(angleRad)
		const ldy = (lineLength / 2) * Math.sin(angleRad)
		const ax = center.x - ldx
		const ay = center.y - ldy
		const bx = center.x + ldx
		const by = center.y + ldy
		canvas.drawLine(ax, ay, bx, by, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})
		screenSegments.push({ a: { x: ax, y: ay }, b: { x: bx, y: by } })
	}
	drawLine(intersectionPos.line1, line1Rad)
	drawLine(intersectionPos.line2, line2Rad)
	drawLine({ x: cx, y: cy }, transversalRad)

	// Endpoint label positions from ray mappings
	const pointPositions = new Map<string, { x: number; y: number }>()
	const pointDist = Math.min(width, height) * 0.35
	function placeEndpointsFor(
		main: "line1" | "line2",
		origin: { x: number; y: number },
		rays: Rays
	) {
		const map = labelsToAngles(main, rays)
		for (const [label, ang] of map) {
			if (
				!Object.values(points).some(
					(p) => p.id === label && p.id.startsWith("pt_ray_")
				)
			)
				continue
			if (!pointPositions.has(label)) {
				pointPositions.set(label, {
					x: origin.x + pointDist * Math.cos(ang),
					y: origin.y + pointDist * Math.sin(ang)
				})
			}
		}
	}
	placeEndpointsFor("line1", intersectionPos.line1, intersections.line1.rays)
	placeEndpointsFor("line2", intersectionPos.line2, intersections.line2.rays)

	// Vertex labels
	for (const key of ["line1", "line2"] as const) {
		const inter = intersections[key]
		const pos = intersectionPos[key]
		const labelText = pointsById.get(inter.label)?.label ?? ""
		canvas.drawText({
			x: pos.x,
			y: pos.y - 14,
			text: labelText,
			fill: theme.colors.black,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx: 18,
			fontWeight: theme.font.weight.bold
		})
	}

	// Collision helpers and label placement (unchanged from original)
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

	for (const item of pendingAngleLabels) {
		const fontPx = 16
		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			item.text,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = w / 2
		const halfH = h / 2
		const dirX = Math.cos(item.midAngleRad)
		const dirY = Math.sin(item.midAngleRad)

		let bestPos = { x: item.x, y: item.y }
		let minCollisions = Number.POSITIVE_INFINITY
		let bestDist = 0

		for (const dist of [0, 8, -8, 16, -16, 24, -24]) {
			const testX = item.origin.x + (labelRadius + dist) * dirX
			const testY = item.origin.y + (labelRadius + dist) * dirY

			const rect = {
				x: testX - halfW,
				y: testY - halfH,
				width: w,
				height: h,
				pad: 2
			}
			const collides = rectIntersectsAnySegment(rect)
			const collisions = collides ? 1 : 0

			if (collisions < minCollisions) {
				minCollisions = collisions
				bestPos = { x: testX, y: testY }
				bestDist = dist
			} else if (
				collisions === minCollisions &&
				Math.abs(dist) < Math.abs(bestDist)
			) {
				bestPos = { x: testX, y: testY }
				bestDist = dist
			}
			if (minCollisions === 0) break
		}
		canvas.drawText({
			x: bestPos.x,
			y: bestPos.y,
			text: item.text,
			fill: theme.colors.black,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			fontWeight: theme.font.weight.bold
		})
	}

	for (const [pointId, pos] of pointPositions) {
		canvas.drawCircle(pos.x, pos.y, 5, { fill: theme.colors.black })
		const fontPx = 20
		const labelText = pointsById.get(pointId)?.label ?? ""
		if (!labelText) continue

		const { maxWidth: w, height: h } = estimateWrappedTextDimensions(
			labelText,
			Number.POSITIVE_INFINITY,
			fontPx,
			1.2
		)
		const halfW = w / 2
		const halfH = h / 2

		let bestX = pos.x
		let bestY = pos.y
		let minCollisions = Number.POSITIVE_INFINITY

		for (let i = 0; i < 8; i++) {
			const angle = (i * Math.PI) / 4
			for (let dist of [22, 32, 12]) {
				const testX = pos.x + dist * Math.cos(angle)
				const testY = pos.y + dist * Math.sin(angle)
				const rect = {
					x: testX - halfW,
					y: testY - halfH,
					width: w,
					height: h,
					pad: 2
				}
				const collisions = rectIntersectsAnySegment(rect) ? 1 : 0

				if (collisions < minCollisions) {
					minCollisions = collisions
					bestX = testX
					bestY = testY
				}
				if (minCollisions === 0) break
			}
			if (minCollisions === 0) break
		}
		canvas.drawText({
			x: bestX,
			y: bestY,
			text: labelText,
			fill: theme.colors.black,
			anchor: "middle",
			dominantBaseline: "middle",
			fontPx,
			fontWeight: theme.font.weight.bold
		})
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
