import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Simplified solid object schema with just the type enum
const SolidObjectSchema = z
	.object({
		type: z.enum([
			"rectangularPrism",
			"pentagonalPrism",
			"octagonalPrism",
			"squarePyramid",
			"cylinder",
			"cone",
			"sphere"
		])
	})
	.strict()
	.describe("The 3D solid to be intersected by the plane.")

// Defines the intersecting plane's properties as a discriminated union
const PlaneSchema = z.discriminatedUnion("orientation", [
	z
		.object({
			orientation: z
				.literal("horizontal")
				.describe(
					"A plane parallel to the base, cutting through the solid horizontally like slicing a cake layer."
				),
			position: z
				.number()
				.min(0)
				.max(1)
				.describe(
					"The relative position along the solid's height where the plane intersects (0 = bottom, 0.5 = middle, 1 = top)."
				)
		})
		.strict(),
	z
		.object({
			orientation: z
				.literal("vertical")
				.describe(
					"A plane perpendicular to the base, cutting through the solid vertically like slicing a loaf of bread."
				),
			position: z
				.number()
				.min(0)
				.max(1)
				.describe(
					"The relative position along the solid's width/depth where the plane intersects (0 = back/left, 0.5 = center, 1 = front/right)."
				)
		})
		.strict(),
	z
		.object({
			orientation: z
				.literal("oblique")
				.describe(
					"A plane at an angle, neither purely horizontal nor vertical, creating diagonal cross-sections."
				),
			position: z
				.number()
				.min(0)
				.max(1)
				.describe(
					"The relative position where the plane's center intersects the solid (0 = near bottom/left, 0.5 = center, 1 = near top/right)."
				),
			angle: z
				.number()
				.min(-90)
				.max(90)
				.describe(
					"The tilt angle in degrees from horizontal (-90 = steep downward, 0 = horizontal, 45 = diagonal upward, 90 = steep upward)."
				)
		})
		.strict()
])

// The main Zod schema for the 3dIntersectionDiagram function
export const ThreeDIntersectionDiagramPropsSchema = z
	.object({
		type: z.literal("threeDIntersectionDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		solid: SolidObjectSchema,
		plane: PlaneSchema.describe("The properties of the intersecting plane."),
		viewOptions: z
			.object({
				projectionAngle: z
					.number()
					.min(0)
					.max(90)
					.describe(
						"The isometric projection angle in degrees for the 3D view (0 = straight-on side view, 30 = standard isometric, 45 = cabinet projection, 90 = top-down)."
					),
				intersectionColor: z
					.string()
					.regex(
						CSS_COLOR_PATTERN,
						"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
					)
					.describe(
						"The fill color for the cross-section area where the plane cuts the solid. Use CSS color format."
					),
				showHiddenEdges: z
					.boolean()
					.describe(
						"Whether to show edges that would be hidden behind the solid as dashed lines."
					),
				showLabels: z
					.boolean()
					.describe(
						"Whether to display measurement labels on the solid's dimensions and the cross-section."
					)
			})
			.strict()
			.describe(
				"Visual presentation options that control how the 3D solid and its cross-section are rendered."
			)
	})
	.strict()
	.describe(
		"Generates an SVG diagram illustrating the cross-section of a 3D solid intersected by a plane. This widget supports rectangular prisms, pyramids, cylinders, cones, and spheres with horizontal, vertical, or oblique plane intersections. The resulting cross-section is highlighted to show the 2D shape created by slicing the 3D object."
	)

export type ThreeDIntersectionDiagramProps = z.infer<
	typeof ThreeDIntersectionDiagramPropsSchema
>

// Type definitions for 3D vector math
type Point3D = { x: number; y: number; z: number }
type Point2D = { x: number; y: number }
// type Face = { vertices: number[]; normal: Point3D } // TODO: will need this for plane intersections

// Helper function to make any color transparent (simplified version)
const makeColorTransparent = (color: string, opacity: number): string => {
	// Handle hex colors
	if (color.startsWith("#")) {
		const hex = color.slice(1)
		let r: number
		let g: number
		let b: number

		if (hex.length === 3) {
			// Short hex format #RGB
			r = Number.parseInt(hex[0] + hex[0], 16)
			g = Number.parseInt(hex[1] + hex[1], 16)
			b = Number.parseInt(hex[2] + hex[2], 16)
		} else if (hex.length === 6) {
			// Long hex format #RRGGBB
			r = Number.parseInt(hex.slice(0, 2), 16)
			g = Number.parseInt(hex.slice(2, 4), 16)
			b = Number.parseInt(hex.slice(4, 6), 16)
		} else if (hex.length === 8) {
			// Already has alpha #RRGGBBAA - extract RGB and ignore existing alpha
			r = Number.parseInt(hex.slice(0, 2), 16)
			g = Number.parseInt(hex.slice(2, 4), 16)
			b = Number.parseInt(hex.slice(4, 6), 16)
		} else {
			// Invalid hex format, return as-is
			return color
		}

		return `rgba(${r}, ${g}, ${b}, ${opacity})`
	}

	// Handle rgba/rgb colors - extract RGB values and apply new opacity
	const rgbaMatch = color.match(
		/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
	)
	if (rgbaMatch) {
		const [, r, g, b] = rgbaMatch
		return `rgba(${r}, ${g}, ${b}, ${opacity})`
	}

	// For named colors or other formats, return as-is (CSS will handle it)
	return color
}

/**
 * Generates an SVG diagram of a 3D solid being intersected by a plane,
 * showing the semi-transparent plane cutting through the solid.
 */
export const generateThreeDIntersectionDiagram: WidgetGenerator<
	typeof ThreeDIntersectionDiagramPropsSchema
> = async (props) => {
	const { width, height, solid, plane, viewOptions } = props
	const { intersectionColor: rawIntersectionColor } = viewOptions

	// Make the intersection color more transparent but still visible, with enhanced saturation
	const intersectionColor = makeColorTransparent(rawIntersectionColor, 0.35) // 35% opacity

	const chartWidth = width - PADDING * 2
	const chartHeight = height - PADDING * 2

	// Calculate solid dimensions based on canvas size for deterministic rendering
	const canvasPadding = 40
	const maxDrawingHeight = height - canvasPadding * 2
	const maxDrawingWidth = width - canvasPadding * 2

	// Simple isometric projection - classic 3D view
	const projectIsometric = (point: Point3D): Point2D => {
		// Isometric projection matrix
		// Rotate 45° around Y, then ~35° around X for classic isometric look
		const cos45 = Math.cos(Math.PI / 4)
		const sin45 = Math.sin(Math.PI / 4)
		const cosIso = Math.cos(Math.atan(1 / Math.sqrt(2))) // ~35.26°
		const sinIso = Math.sin(Math.atan(1 / Math.sqrt(2)))

		// First rotate around Y axis by 45°
		const x1 = point.x * cos45 + point.z * sin45
		const y1 = point.y
		const z1 = -point.x * sin45 + point.z * cos45

		// Then rotate around X axis by ~35°
		const x2 = x1
		const y2 = y1 * cosIso - z1 * sinIso

		return { x: x2, y: -y2 } // flip Y for screen coordinates
	}

	// Define basic solid shapes - focus on getting them to look right first
	let vertices: Point3D[] = []
	let edges: Array<{ start: number; end: number }> = []

	switch (solid.type) {
		case "rectangularPrism": {
			// Calculate dimensions based on canvas size
			const h = maxDrawingHeight * 0.4 // height
			const w = maxDrawingWidth * 0.3 // width
			const d = maxDrawingWidth * 0.2 // depth

			// 8 vertices of a rectangular prism
			vertices = [
				{ x: -w, y: -h, z: -d }, // 0: back bottom left
				{ x: w, y: -h, z: -d }, // 1: back bottom right
				{ x: w, y: h, z: -d }, // 2: back top right
				{ x: -w, y: h, z: -d }, // 3: back top left
				{ x: -w, y: -h, z: d }, // 4: front bottom left
				{ x: w, y: -h, z: d }, // 5: front bottom right
				{ x: w, y: h, z: d }, // 6: front top right
				{ x: -w, y: h, z: d } // 7: front top left
			]

			// 12 edges of the rectangular prism
			edges = [
				// Back face
				{ start: 0, end: 1 },
				{ start: 1, end: 2 },
				{ start: 2, end: 3 },
				{ start: 3, end: 0 },
				// Front face
				{ start: 4, end: 5 },
				{ start: 5, end: 6 },
				{ start: 6, end: 7 },
				{ start: 7, end: 4 },
				// Connecting edges
				{ start: 0, end: 4 },
				{ start: 1, end: 5 },
				{ start: 2, end: 6 },
				{ start: 3, end: 7 }
			]
			break
		}
		case "pentagonalPrism": {
			// Calculate dimensions based on canvas size
			const h = maxDrawingHeight * 0.4
			const side = maxDrawingWidth * 0.15
			const radius = side / (2 * Math.sin(Math.PI / 5))

			// Pentagon vertices (bottom then top)
			for (let i = 0; i < 5; i++) {
				const angle = (i * 2 * Math.PI) / 5
				const x = radius * Math.cos(angle)
				const z = radius * Math.sin(angle)

				vertices.push({ x, y: -h, z }) // bottom vertex
				vertices.push({ x, y: h, z }) // top vertex
			}

			// Pentagon edges
			for (let i = 0; i < 5; i++) {
				const next = (i + 1) % 5
				// Bottom pentagon
				edges.push({ start: i * 2, end: next * 2 })
				// Top pentagon
				edges.push({ start: i * 2 + 1, end: next * 2 + 1 })
				// Vertical edges
				edges.push({ start: i * 2, end: i * 2 + 1 })
			}
			break
		}
		case "octagonalPrism": {
			// Calculate dimensions based on canvas size
			const h = maxDrawingHeight * 0.4
			const side = maxDrawingWidth * 0.12
			const radius = side / (2 * Math.sin(Math.PI / 8)) // circumradius of octagon

			// Octagon vertices (bottom then top)
			// Rotate by π/8 (22.5°) so that a flat face is parallel to the Z-axis
			const rotationOffset = Math.PI / 8
			for (let i = 0; i < 8; i++) {
				const angle = (i * 2 * Math.PI) / 8 + rotationOffset
				const x = radius * Math.cos(angle)
				const z = radius * Math.sin(angle)

				vertices.push({ x, y: -h, z }) // bottom vertex
				vertices.push({ x, y: h, z }) // top vertex
			}

			// Octagon edges
			for (let i = 0; i < 8; i++) {
				const next = (i + 1) % 8
				// Bottom octagon
				edges.push({ start: i * 2, end: next * 2 })
				// Top octagon
				edges.push({ start: i * 2 + 1, end: next * 2 + 1 })
				// Vertical edges
				edges.push({ start: i * 2, end: i * 2 + 1 })
			}
			break
		}
		case "squarePyramid": {
			// Calculate dimensions based on canvas size
			const h = maxDrawingHeight * 0.45 // pyramid height
			const b = maxDrawingWidth * 0.25 // half of base side

			vertices = [
				{ x: -b, y: -h, z: -b }, // 0: back bottom left
				{ x: b, y: -h, z: -b }, // 1: back bottom right
				{ x: b, y: -h, z: b }, // 2: front bottom right
				{ x: -b, y: -h, z: b }, // 3: front bottom left
				{ x: 0, y: h, z: 0 } // 4: apex
			]

			edges = [
				// Base square
				{ start: 0, end: 1 },
				{ start: 1, end: 2 },
				{ start: 2, end: 3 },
				{ start: 3, end: 0 },
				// Edges to apex
				{ start: 0, end: 4 },
				{ start: 1, end: 4 },
				{ start: 2, end: 4 },
				{ start: 3, end: 4 }
			]
			break
		}
		case "cylinder": {
			// Calculate dimensions based on canvas size
			const h = maxDrawingHeight * 0.4
			const r = maxDrawingWidth * 0.15
			const segments = 12 // fewer segments for cleaner look

			// Generate circle vertices
			for (let i = 0; i < segments; i++) {
				const angle = (i * 2 * Math.PI) / segments
				const x = r * Math.cos(angle)
				const z = r * Math.sin(angle)

				vertices.push({ x, y: -h, z }) // bottom circle
				vertices.push({ x, y: h, z }) // top circle
			}

			// Generate edges
			for (let i = 0; i < segments; i++) {
				const next = (i + 1) % segments
				// Bottom circle
				edges.push({ start: i * 2, end: next * 2 })
				// Top circle
				edges.push({ start: i * 2 + 1, end: next * 2 + 1 })
				// Vertical edges (only show some for clarity)
				if (i % 3 === 0) {
					// every 3rd vertical line
					edges.push({ start: i * 2, end: i * 2 + 1 })
				}
			}
			break
		}
		case "cone": {
			// Calculate dimensions based on canvas size
			const h = maxDrawingHeight * 0.45
			const r = maxDrawingWidth * 0.2
			const segments = 12

			// Base circle vertices
			for (let i = 0; i < segments; i++) {
				const angle = (i * 2 * Math.PI) / segments
				vertices.push({
					x: r * Math.cos(angle),
					y: -h,
					z: r * Math.sin(angle)
				})
			}
			// Apex vertex
			vertices.push({ x: 0, y: h, z: 0 })
			const apexIndex = segments

			// Generate edges
			for (let i = 0; i < segments; i++) {
				const next = (i + 1) % segments
				// Base circle
				edges.push({ start: i, end: next })
				// Lines to apex (only show some for clarity)
				if (i % 2 === 0) {
					// every other line
					edges.push({ start: i, end: apexIndex })
				}
			}
			break
		}
		case "sphere": {
			// Calculate dimensions based on canvas size
			const r = Math.min(maxDrawingWidth, maxDrawingHeight) * 0.25
			const stacks = 6 // latitude lines
			const sectors = 12 // longitude lines

			// Generate vertices
			for (let i = 0; i <= stacks; i++) {
				const phi = (Math.PI * i) / stacks // 0 to PI
				const y = r * Math.cos(phi)
				const ringRadius = r * Math.sin(phi)

				for (let j = 0; j < sectors; j++) {
					const theta = (2 * Math.PI * j) / sectors
					const x = ringRadius * Math.cos(theta)
					const z = ringRadius * Math.sin(theta)
					vertices.push({ x, y, z })
				}
			}

			// Generate edges for wireframe sphere
			for (let i = 0; i < stacks; i++) {
				for (let j = 0; j < sectors; j++) {
					const current = i * sectors + j
					const next = i * sectors + ((j + 1) % sectors)
					const below = (i + 1) * sectors + j

					// Horizontal edges (longitude)
					if (i < stacks) {
						edges.push({ start: current, end: next })
					}
					// Vertical edges (latitude) - only some for clarity
					if (i < stacks && j % 2 === 0) {
						edges.push({ start: current, end: below })
					}
				}
			}
			break
		}
	}

	// Project all vertices to 2D
	const projected = vertices.map(projectIsometric)

	// Calculate bounds for scaling
	const minX = Math.min(...projected.map((p) => p.x))
	const maxX = Math.max(...projected.map((p) => p.x))
	const minY = Math.min(...projected.map((p) => p.y))
	const maxY = Math.max(...projected.map((p) => p.y))

	// Scale to fit in canvas with padding
	const scaleX = chartWidth / (maxX - minX + 1)
	const scaleY = chartHeight / (maxY - minY + 1)
	const scale = Math.min(scaleX, scaleY) * 0.7 // leave some margin

	const centerX = PADDING + chartWidth / 2
	const centerY = PADDING + chartHeight / 2

	// Convert 2D projected point to SVG coordinates
	const toSvg = (p: Point2D): Point2D => ({
		x: centerX + (p.x - (minX + maxX) / 2) * scale,
		y: centerY + (p.y - (minY + maxY) / 2) * scale
	})

	// Calculate rectangular plane that cuts through the solid
	const calculateRectangularPlane = (): {
		planePoints: Point2D[]
		planeZ: number
	} => {
		// Calculate bounds of the entire solid
		const bounds = {
			minX: Math.min(...vertices.map((v) => v.x)),
			maxX: Math.max(...vertices.map((v) => v.x)),
			minY: Math.min(...vertices.map((v) => v.y)),
			maxY: Math.max(...vertices.map((v) => v.y)),
			minZ: Math.min(...vertices.map((v) => v.z)),
			maxZ: Math.max(...vertices.map((v) => v.z))
		}

		// Add some padding to make sure plane extends beyond solid
		const padding = 1.2
		const paddedBounds = {
			minX: bounds.minX * padding,
			maxX: bounds.maxX * padding,
			minY: bounds.minY * padding,
			maxY: bounds.maxY * padding,
			minZ: bounds.minZ * padding,
			maxZ: bounds.maxZ * padding
		}

		let planeVertices: Point3D[] = []
		let planeZ = 0

		if (plane.orientation === "vertical") {
			// Vertical plane (parallel to YZ plane)
			planeZ =
				paddedBounds.minZ +
				plane.position * (paddedBounds.maxZ - paddedBounds.minZ)
			planeVertices = [
				{ x: paddedBounds.minX, y: paddedBounds.minY, z: planeZ },
				{ x: paddedBounds.maxX, y: paddedBounds.minY, z: planeZ },
				{ x: paddedBounds.maxX, y: paddedBounds.maxY, z: planeZ },
				{ x: paddedBounds.minX, y: paddedBounds.maxY, z: planeZ }
			]
		} else if (plane.orientation === "horizontal") {
			// Horizontal plane (parallel to XZ plane)
			const planeY =
				paddedBounds.minY +
				plane.position * (paddedBounds.maxY - paddedBounds.minY)
			planeZ = planeY // for depth sorting, use Y coordinate
			planeVertices = [
				{ x: paddedBounds.minX, y: planeY, z: paddedBounds.minZ },
				{ x: paddedBounds.maxX, y: planeY, z: paddedBounds.minZ },
				{ x: paddedBounds.maxX, y: planeY, z: paddedBounds.maxZ },
				{ x: paddedBounds.minX, y: planeY, z: paddedBounds.maxZ }
			]
		} else {
			// Oblique plane
			const angleRad = (plane.angle * Math.PI) / 180
			const centerY =
				paddedBounds.minY +
				plane.position * (paddedBounds.maxY - paddedBounds.minY)
			const centerZ =
				paddedBounds.minZ +
				plane.position * (paddedBounds.maxZ - paddedBounds.minZ)
			planeZ = centerZ

			// Create tilted rectangular plane that spans the full width and depth
			const yRange = paddedBounds.maxY - paddedBounds.minY
			const tiltOffset = (Math.tan(angleRad) * yRange) / 2

			planeVertices = [
				{
					x: paddedBounds.minX,
					y: centerY - yRange / 2,
					z: centerZ - tiltOffset
				},
				{
					x: paddedBounds.maxX,
					y: centerY - yRange / 2,
					z: centerZ - tiltOffset
				},
				{
					x: paddedBounds.maxX,
					y: centerY + yRange / 2,
					z: centerZ + tiltOffset
				},
				{
					x: paddedBounds.minX,
					y: centerY + yRange / 2,
					z: centerZ + tiltOffset
				}
			]
		}

		// Convert to 2D points
		const planePoints = planeVertices.map((p) => toSvg(projectIsometric(p)))
		return { planePoints, planeZ }
	}

	const { planePoints, planeZ } = calculateRectangularPlane()

	// Separate edges into those behind and in front of the plane for proper depth ordering
	const edgesBehindPlane: typeof edges = []
	const edgesInFrontOfPlane: typeof edges = []

	for (const edge of edges) {
		const startVertex = vertices[edge.start]
		const endVertex = vertices[edge.end]

		if (startVertex && endVertex) {
			// Determine if edge is mostly behind or in front of plane
			let startZ: number
			let endZ: number
			if (plane.orientation === "vertical") {
				startZ = startVertex.z
				endZ = endVertex.z
			} else if (plane.orientation === "horizontal") {
				startZ = startVertex.y
				endZ = endVertex.y
			} else {
				// For oblique, use Z coordinate as approximation
				startZ = startVertex.z
				endZ = endVertex.z
			}

			const avgZ = (startZ + endZ) / 2
			if (avgZ < planeZ) {
				edgesBehindPlane.push(edge)
			} else {
				edgesInFrontOfPlane.push(edge)
			}
		}
	}

	// Generate SVG using Canvas API
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Draw edges behind the plane first
	for (const edge of edgesBehindPlane) {
		const startVertex = vertices[edge.start]
		const endVertex = vertices[edge.end]

		if (startVertex && endVertex) {
			const startProj = projected[edge.start]
			const endProj = projected[edge.end]

			if (startProj && endProj) {
				const startSvg = toSvg(startProj)
				const endSvg = toSvg(endProj)

				canvas.drawLine(startSvg.x, startSvg.y, endSvg.x, endSvg.y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			}
		}
	}

	// Draw the rectangular plane
	if (planePoints.length >= 3) {
		canvas.drawPolygon(planePoints, {
			fill: intersectionColor,
			stroke: "none",
			strokeWidth: 0
		})
	}

	// Draw edges in front of the plane on top
	for (const edge of edgesInFrontOfPlane) {
		const startVertex = vertices[edge.start]
		const endVertex = vertices[edge.end]

		if (startVertex && endVertex) {
			const startProj = projected[edge.start]
			const endProj = projected[edge.end]

			if (startProj && endProj) {
				const startSvg = toSvg(startProj)
				const endSvg = toSvg(endProj)

				canvas.drawLine(startSvg.x, startSvg.y, endSvg.x, endSvg.y, {
					stroke: theme.colors.black,
					strokeWidth: theme.stroke.width.base
				})
			}
		}
	}

	// Finalize and return SVG
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
