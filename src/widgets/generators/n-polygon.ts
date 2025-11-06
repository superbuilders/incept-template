import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

/**
 * Factory to create label schema avoiding $ref generation.
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
}

export const NPolygonPropsSchema = z
	.object({
		type: z
			.literal("nPolygon")
			.describe(
				"Renders one or more polygon shapes horizontally. Use this widget for regular polygons (regularTriangle, regularSquare, regularPentagon, regularHexagon, regularHeptagon, regularOctagon), rectangle, and specialized forms (rightTrapezoid, pentagonTwoConsecutiveRightAngles), either individually or side-by-side for comparison."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		polygons: z
			.array(
				z.object({
					shape: z
						.enum([
							"regularTriangle",
							"regularSquare",
							"rectangle",
							"regularPentagon",
							"regularHexagon",
							"regularHeptagon",
							"regularOctagon",
							"rightTrapezoid",
							"pentagonTwoConsecutiveRightAngles"
						])
						.describe(
							"The specific polygon shape to render. Regular variants render equilateral/equiangular polygons (regularTriangle, regularSquare, regularPentagon, regularHexagon, regularHeptagon, regularOctagon). Rectangle uses a 4:3 aspect ratio. rightTrapezoid is a quadrilateral with exactly one pair of parallel sides and two right angles. pentagonTwoConsecutiveRightAngles is a pentagon with two adjacent right-angle vertices (house shape)."
						),
					fillColor: z
						.string()
						.regex(
							CSS_COLOR_PATTERN,
							"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
						)
						.describe("The hex-only fill color for this polygon."),
					sideLabels: z
						.array(
							z
								.object({
									sideIndex: z
										.number()
										.int()
										.min(0)
										.describe(
											"Zero-based index of the side to label. For a triangle: 0=bottom, 1=right, 2=left. For a square/rectangle: 0=top, 1=right, 2=bottom, 3=left. Sides are numbered in the order vertices are generated (typically counterclockwise from top or top-left)."
										),
									label: createLabelSchema().describe(
										"Dimension label for this side showing its length measurement or variable."
									)
								})
								.strict()
						)
						.nullable()
						.describe(
							"Optional array of side labels. Each label specifies which side (by index) and what measurement to display. Labels are placed outside the polygon perpendicular to the midpoint of each side."
						)
				})
			)
			.min(1)
			.describe(
				"Array of polygon definitions. Can contain a single polygon or multiple polygons to display side-by-side with automatic spacing. Each polygon is centered within its allocated horizontal space."
			)
	})
	.strict()
	.describe(
		"Renders one or more filled polygons with a black border, placed side by side with sensible internal spacing. Supports regularTriangle, regularSquare, rectangle, regularPentagon, regularHexagon, regularHeptagon, regularOctagon. Also supports rightTrapezoid (one parallel pair, two right angles) and pentagonTwoConsecutiveRightAngles (house shape). Rectangle uses a 4:3 aspect inside its tile; other listed regulars are fitted in their tile. Optionally displays dimension labels on polygon sides."
	)

export type NPolygonProps = z.infer<typeof NPolygonPropsSchema>

type Label = z.infer<ReturnType<typeof createLabelSchema>>

/**
 * Format label object into display string.
 */
const formatLabel = (label: Label): string => {
	if (label.unit) {
		return `${label.value} ${label.unit}`
	}
	return String(label.value)
}

export const generateNPolygon: WidgetGenerator<
	typeof NPolygonPropsSchema
> = async (props) => {
	const { width, height, polygons } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const tileCount = polygons.length
	const INTERNAL_SPACING = PADDING * 2
	const totalSpacing = INTERNAL_SPACING * Math.max(0, tileCount - 1)
	const tileWidth = (width - totalSpacing) / tileCount
	const tileHeight = height

	function drawSinglePolygon(
		tileLeft: number,
		tileTop: number,
		tileW: number,
		tileH: number,
		shape: (typeof polygons)[number]["shape"],
		fillColor: string
	): Array<{ x: number; y: number }> {
		const cx = tileLeft + tileW / 2
		const cy = tileTop + tileH / 2
		const radius = Math.min(tileW, tileH) / 2 - PADDING

		function isRegularShape(
			s: (typeof polygons)[number]["shape"]
		): s is
			| "regularTriangle"
			| "regularSquare"
			| "regularPentagon"
			| "regularHexagon"
			| "regularHeptagon"
			| "regularOctagon" {
			return (
				s === "regularTriangle" ||
				s === "regularSquare" ||
				s === "regularPentagon" ||
				s === "regularHexagon" ||
				s === "regularHeptagon" ||
				s === "regularOctagon"
			)
		}

		const regularSides: Record<
			| "regularTriangle"
			| "regularSquare"
			| "regularPentagon"
			| "regularHexagon"
			| "regularHeptagon"
			| "regularOctagon",
			number
		> = {
			regularTriangle: 3,
			regularSquare: 4,
			regularPentagon: 5,
			regularHexagon: 6,
			regularHeptagon: 7,
			regularOctagon: 8
		}

		const points: Array<{ x: number; y: number }> = []

		switch (shape) {
			case "rectangle": {
				const availableWidth = tileW - 2 * PADDING
				const availableHeight = tileH - 2 * PADDING
				const aspectRatio = 4 / 3
				let rectWidth = availableWidth
				let rectHeight = rectWidth / aspectRatio
				if (rectHeight > availableHeight) {
					rectHeight = availableHeight
					rectWidth = rectHeight * aspectRatio
				}
				const halfWidth = rectWidth / 2
				const halfHeight = rectHeight / 2
				points.push(
					{ x: cx - halfWidth, y: cy - halfHeight },
					{ x: cx + halfWidth, y: cy - halfHeight },
					{ x: cx + halfWidth, y: cy + halfHeight },
					{ x: cx - halfWidth, y: cy + halfHeight }
				)
				break
			}
			case "rightTrapezoid": {
				// Deterministic right trapezoid: horizontal bases, left leg vertical → two right angles
				const availableWidth = tileW - 2 * PADDING
				const availableHeight = tileH - 2 * PADDING
				const baseBottom = Math.min(availableWidth, availableHeight * 1.4)
				const baseTop = baseBottom * 0.65
				const height = Math.min(availableHeight, baseBottom * 0.6)
				const leftX = cx - baseBottom / 2
				const rightXBottom = cx + baseBottom / 2
				const rightXTop = leftX + baseTop // slanted right leg
				const topY = cy - height / 2
				const bottomY = cy + height / 2
				points.push(
					{ x: leftX, y: topY }, // top-left
					{ x: rightXTop, y: topY }, // top-right (shorter top base)
					{ x: rightXBottom, y: bottomY }, // bottom-right
					{ x: leftX, y: bottomY } // bottom-left (vertical left leg)
				)
				break
			}
			case "pentagonTwoConsecutiveRightAngles": {
				// House-shaped pentagon with two consecutive right angles at bottom corners
				const availableWidth = tileW - 2 * PADDING
				const availableHeight = tileH - 2 * PADDING
				const baseWidth = Math.min(availableWidth, availableHeight * 1.6)
				const wallHeight = Math.min(availableHeight * 0.45, baseWidth * 0.45)
				const roofHeight = Math.min(availableHeight * 0.35, baseWidth * 0.35)
				const leftX = cx - baseWidth / 2
				const rightX = cx + baseWidth / 2
				const bottomY =
					cy + Math.max(0, (availableHeight - (wallHeight + roofHeight)) / 2)
				const topWallY = bottomY - wallHeight
				const roofApexY = topWallY - roofHeight
				const apexX = cx
				points.push(
					{ x: leftX, y: bottomY }, // bottom-left (right angle)
					{ x: rightX, y: bottomY }, // bottom-right (right angle) — consecutive to bottom-left
					{ x: rightX, y: topWallY }, // right wall top
					{ x: apexX, y: roofApexY }, // roof apex
					{ x: leftX, y: topWallY } // left wall top
				)
				break
			}
			default: {
				if (isRegularShape(shape)) {
					const numSides = regularSides[shape]
					const angleOffset =
						shape === "regularSquare" ? Math.PI / 4 : -Math.PI / 2
					for (let i = 0; i < numSides; i++) {
						const angle = (i / numSides) * 2 * Math.PI + angleOffset
						points.push({
							x: cx + radius * Math.cos(angle),
							y: cy + radius * Math.sin(angle)
						})
					}
				}
				break
			}
		}

		canvas.drawPolygon(points, {
			fill: fillColor,
			stroke: "#000000",
			strokeWidth: 2
		})

		return points
	}

	// Draw all polygons and collect their points for label rendering
	const polygonPoints: Array<{
		points: Array<{ x: number; y: number }>
		sideLabels: NonNullable<(typeof polygons)[number]["sideLabels"]>
	}> = []

	for (let index = 0; index < polygons.length; index++) {
		const poly = polygons[index]
		if (!poly) continue
		const tileLeft = index * (tileWidth + INTERNAL_SPACING)
		const points = drawSinglePolygon(
			tileLeft,
			0,
			tileWidth,
			tileHeight,
			poly.shape,
			poly.fillColor
		)
		polygonPoints.push({
			points,
			sideLabels: poly.sideLabels ?? []
		})
	}

	// Render side labels
	for (const polyData of polygonPoints) {
		const { points, sideLabels } = polyData
		if (!sideLabels || sideLabels.length === 0) continue
		if (points.length < 2) {
			logger.error("npolygon: insufficient points for labels", {
				pointCount: points.length
			})
			throw errors.new("npolygon: insufficient points for labels")
		}

		for (const sideLabel of sideLabels) {
			const { sideIndex, label } = sideLabel
			if (sideIndex < 0 || sideIndex >= points.length) {
				logger.error("npolygon: invalid side index", {
					sideIndex,
					maxIndex: points.length - 1
				})
				throw errors.new("npolygon: invalid side index")
			}

			const p1 = points[sideIndex]
			const p2 = points[(sideIndex + 1) % points.length]
			if (!p1 || !p2) {
				logger.error("npolygon: side endpoints missing", { sideIndex })
				throw errors.new("npolygon: side endpoints missing")
			}

			const labelText = formatLabel(label)
			const midX = (p1.x + p2.x) / 2
			const midY = (p1.y + p2.y) / 2

			// Compute perpendicular direction pointing outward
			const dx = p2.x - p1.x
			const dy = p2.y - p1.y
			const len = Math.hypot(dx, dy)
			if (!(len > 0)) continue

			let nx = -dy / len
			let ny = dx / len

			// Determine polygon center to ensure outward direction
			const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length
			const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length
			const toCenterX = centerX - midX
			const toCenterY = centerY - midY
			const dot = nx * toCenterX + ny * toCenterY

			// Flip if pointing inward
			if (dot > 0) {
				nx = -nx
				ny = -ny
			}

			// Offset label outside the polygon
			const offsetPx = 16
			const labelX = midX + nx * offsetPx
			const labelY = midY + ny * offsetPx

			canvas.drawText({
				x: labelX,
				y: labelY,
				text: labelText,
				fill: theme.colors.text,
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx: theme.font.size.medium,
				fontWeight: theme.font.weight.bold
			})
		}
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`
}
