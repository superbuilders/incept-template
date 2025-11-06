import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const ErrInvalidPartitionGeometry = errors.new(
	"invalid partition geometry"
)

function createPartitionShapeSchema() {
	return z
		.object({
			type: z
				.enum(["rectangle", "circle"])
				.describe(
					"Shape type. 'rectangle' creates a grid, 'circle' creates pie-like sectors."
				),
			totalParts: z
				.number()
				.int()
				.describe(
					"Total number of equal parts/cells in the shape (e.g., 12, 16, 8). For rectangles, must equal rows × columns."
				),
			shadedCells: z
				.array(z.number().int())
				.describe(
					"Zero-based indices of cells to shade with solid color (e.g., [0, 1, 2] shades first three). Empty array means no shading."
				),
			hatchedCells: z
				.array(z.number().int())
				.describe(
					"Zero-based indices of cells to fill with diagonal lines pattern (e.g., [3, 4]). Can overlap with shaded cells. Empty array means no hatching."
				),
			rows: z
				.number()
				.int()
				.describe(
					"Number of rows for rectangle partition (e.g., 3, 4, 2). Ignored for circles. Must be positive."
				),
			columns: z
				.number()
				.int()
				.describe(
					"Number of columns for rectangle partition (e.g., 4, 3, 6). Ignored for circles. rows × columns must equal totalParts."
				),
			shadeColor: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.describe(
					"Hex-only color for shaded cells (e.g., '#4472C4', '#1E90FF', '#FF000080' for 50% alpha). Applies to all shaded cells."
				),
			shadeOpacity: z
				.number()
				.describe(
					"Opacity for shaded cells, 0-1 range (e.g., 0.3 for 30% opacity, 1 for solid). Allows seeing grid lines through shading."
				)
		})
		.strict()
}

function createLineOverlaySchema() {
	return z
		.object({
			from: z
				.object({
					row: z
						.number()
						.int()
						.describe(
							"Starting row index (0-based). For grid intersections, can equal grid rows for bottom edge."
						),
					col: z
						.number()
						.int()
						.describe(
							"Starting column index (0-based). For grid intersections, can equal grid columns for right edge."
						)
				})
				.strict(),
			to: z
				.object({
					row: z
						.number()
						.int()
						.describe(
							"Ending row index (0-based). Creates line from 'from' to this point."
						),
					col: z
						.number()
						.int()
						.describe(
							"Ending column index (0-based). Creates line from 'from' to this point."
						)
				})
				.strict(),
			style: z
				.enum(["solid", "dashed", "dotted"])
				.describe(
					"Line style. 'solid' for main divisions, 'dashed' for auxiliary lines, 'dotted' for guidelines."
				),
			color: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.describe(
					"Hex-only color for the line (e.g., '#000000', '#FF0000', '#00000080' for 50% alpha). Should contrast with background."
				)
		})
		.strict()
}

function createFigureSchema() {
	return z
		.object({
			vertices: z
				.array(
					z
						.object({
							row: z
								.number()
								.int()
								.describe(
									"Row coordinate of vertex (0-based). Can be fractional for positions between grid lines."
								),
							col: z
								.number()
								.int()
								.describe(
									"Column coordinate of vertex (0-based). Can be fractional for positions between grid lines."
								)
						})
						.strict()
				)
				.describe(
					"Ordered vertices defining the polygon. Connect in sequence, closing back to first. Minimum 3 vertices."
				),
			fillColor: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.nullable()
				.describe(
					"Hex-only fill color for the polygon (e.g., '#FFC8004D' for ~30% alpha). Use transparency via 8-digit hex to show grid. null for no fill."
				),
			strokeColor: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.nullable()
				.describe(
					"Hex-only color for polygon outline (e.g., '#000000', '#00008B'). null for no outline."
				)
		})
		.strict()
}

export const PartitionedShapePropsSchema = z
	.discriminatedUnion("mode", [
		z
			.object({
				type: z.literal("partitionedShape").describe("Widget type identifier."),
				width: createWidthSchema(),
				height: createHeightSchema(),
				mode: z
					.literal("partition")
					.describe(
						"Partition mode: shows shapes divided into equal parts for fractions."
					),
				shapes: z
					.array(createPartitionShapeSchema())
					.describe(
						"Shapes to display. Can mix rectangles and circles. Order determines left-to-right or top-to-bottom placement."
					),
				layout: z
					.enum(["horizontal", "vertical"])
					.describe(
						"How to arrange multiple shapes. 'horizontal' places side-by-side, 'vertical' stacks top-to-bottom."
					),
				overlays: z
					.array(createLineOverlaySchema())
					.describe(
						"Additional lines to draw over shapes (e.g., to show equivalent fractions). Empty array means no overlays."
					)
			})
			.strict(),
		z
			.object({
				type: z.literal("partitionedShape").describe("Widget type identifier."),
				width: createWidthSchema(),
				height: createHeightSchema(),
				mode: z
					.literal("geometry")
					.describe(
						"Geometry mode: shows a coordinate grid with polygons and lines."
					),
				grid: z
					.object({
						rows: z
							.number()
							.int()
							.describe(
								"Number of grid rows (e.g., 10, 8, 12). Creates horizontal lines."
							),
						columns: z
							.number()
							.int()
							.describe(
								"Number of grid columns (e.g., 10, 12, 8). Creates vertical lines."
							),
						opacity: z
							.number()
							.describe(
								"Grid line opacity, 0-1 range (e.g., 0.2 for subtle, 0.5 for visible). Lower values emphasize figures."
							)
					})
					.strict()
					.describe("Background grid configuration."),
				figures: z
					.array(createFigureSchema())
					.describe(
						"Polygons to draw on the grid. Can represent geometric shapes, regions, or areas. Empty array means no figures."
					),
				lines: z
					.array(createLineOverlaySchema())
					.describe(
						"Additional line segments on the grid. Useful for diagonals, measurements, or constructions. Empty array means no extra lines."
					)
			})
			.strict()
	])
	.describe(
		"Creates either fraction partition diagrams or geometric grid diagrams. Partition mode shows shapes divided into equal parts with shading for teaching fractions. Geometry mode provides a coordinate grid for drawing polygons and line segments. Both modes support various visual overlays."
	)

export type PartitionedShapeProps = z.infer<typeof PartitionedShapePropsSchema>

// Extract the types for each mode
type PartitionModeProps = Extract<PartitionedShapeProps, { mode: "partition" }>
type GeometryModeProps = Extract<PartitionedShapeProps, { mode: "geometry" }>

const generatePartitionView = (props: PartitionModeProps): string => {
	const {
		shapes,
		width: shapeWidth,
		height: shapeHeight,
		layout,
		overlays
	} = props

	// Validate rectangle geometry
	for (const shape of shapes) {
		if (
			shape.type === "rectangle" &&
			shape.rows * shape.columns !== shape.totalParts
		) {
			logger.error("invalid rectangle partition geometry", {
				rows: shape.rows,
				columns: shape.columns,
				expectedTotalParts: shape.rows * shape.columns,
				actualTotalParts: shape.totalParts
			})
			throw errors.wrap(
				ErrInvalidPartitionGeometry,
				`rectangle with rows=${shape.rows}, columns=${shape.columns} must have totalParts=${shape.rows * shape.columns}, got ${shape.totalParts}`
			)
		}
	}

	const rad = (deg: number) => (deg * Math.PI) / 180
	const gap = 20
	const totalWidth =
		layout === "horizontal"
			? shapes.length * shapeWidth + (shapes.length - 1) * gap
			: shapeWidth
	const totalHeight =
		layout === "vertical"
			? shapes.length * shapeHeight + (shapes.length - 1) * gap
			: shapeHeight

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width: totalWidth, height: totalHeight },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	shapes.forEach((s, idx) => {
		const xOffset = layout === "horizontal" ? idx * (shapeWidth + gap) : 0
		const yOffset = layout === "vertical" ? idx * (shapeHeight + gap) : 0

		if (s.type === "rectangle") {
			const rows = s.rows
			const cols = s.columns
			const cellW = shapeWidth / cols
			const cellH = shapeHeight / rows

			const shadedSet = new Set(s.shadedCells)
			const hatchedSet = new Set(s.hatchedCells)

			for (let i = 0; i < s.totalParts; i++) {
				const row = Math.floor(i / cols)
				const col = i % cols
				const isShaded = shadedSet.has(i)
				const isHatched = hatchedSet.has(i)

				const fill = isShaded ? s.shadeColor : "none"
				const opacity = isShaded ? s.shadeOpacity : 1
				const rectX = xOffset + col * cellW
				const rectY = yOffset + row * cellH

				// Canvas automatically tracks extents

				canvas.drawRect(rectX, rectY, cellW, cellH, {
					fill,
					fillOpacity: opacity,
					stroke: theme.colors.border,
					strokeWidth: theme.stroke.width.thin
				})

				if (isHatched) {
					const cellId = `hatch-${idx}-${i}`
					canvas.addHatchPattern({
						id: cellId,
						color: theme.colors.textSecondary,
						strokeWidth: 2,
						spacing: 4,
						angleDeg: 45
					})
					canvas.drawRect(rectX, rectY, cellW, cellH, {
						fill: `url(#${cellId})`,
						stroke: theme.colors.border,
						strokeWidth: theme.stroke.width.thin
					})
				}
			}
		} else if (s.type === "circle") {
			const cx = xOffset + shapeWidth / 2
			const cy = yOffset + shapeHeight / 2
			const r = Math.min(shapeWidth, shapeHeight) / 2 - 5

			// Canvas automatically tracks extents
			const angleStep = 360 / s.totalParts

			const shadedSet = new Set(s.shadedCells)
			const hatchedSet = new Set(s.hatchedCells)

			for (let i = 0; i < s.totalParts; i++) {
				const startAngle = i * angleStep - 90
				const endAngle = (i + 1) * angleStep - 90
				const startRad = rad(startAngle)
				const endRad = rad(endAngle)
				const largeArc: 0 | 1 = angleStep > 180 ? 1 : 0
				const isShaded = shadedSet.has(i)
				const isHatched = hatchedSet.has(i)

				const fill = isShaded ? s.shadeColor : "none"
				const opacity = isShaded ? s.shadeOpacity : 1

				const x1 = cx + r * Math.cos(startRad)
				const y1 = cy + r * Math.sin(startRad)
				const x2 = cx + r * Math.cos(endRad)
				const y2 = cy + r * Math.sin(endRad)

				const sectorPath = new Path2D()
					.moveTo(cx, cy)
					.lineTo(x1, y1)
					.arcTo(r, r, 0, largeArc, 1, x2, y2)
					.closePath()

				if (isHatched) {
					const cellId = `hatch-circle-${idx}-${i}`
					canvas.addHatchPattern({
						id: cellId,
						color: theme.colors.textSecondary,
						strokeWidth: 2,
						spacing: 4,
						angleDeg: 45
					})
					canvas.drawPath(sectorPath, {
						fill: `url(#${cellId})`,
						stroke: theme.colors.border,
						strokeWidth: theme.stroke.width.thin
					})
				} else {
					canvas.drawPath(sectorPath, {
						fill: fill,
						fillOpacity: opacity,
						stroke: theme.colors.border,
						strokeWidth: theme.stroke.width.thin
					})
				}
			}
		}
	})

	// Render overlays
	if (overlays.length > 0) {
		const firstShape = shapes[0]
		if (firstShape && firstShape.type === "rectangle") {
			const cellWidth = shapeWidth / firstShape.columns
			const cellHeight = shapeHeight / firstShape.rows

			for (const line of overlays) {
				const fromX = line.from.col * cellWidth
				const fromY = line.from.row * cellHeight
				const toX = line.to.col * cellWidth
				const toY = line.to.row * cellHeight

				let strokeDasharray = ""
				if (line.style === "dashed") {
					strokeDasharray = theme.stroke.dasharray.dashed
				} else if (line.style === "dotted") {
					strokeDasharray = theme.stroke.dasharray.dotted
				}

				canvas.drawLine(fromX, fromY, toX, toY, {
					stroke: line.color,
					strokeWidth: theme.stroke.width.thick,
					dash: strokeDasharray
				})
			}
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

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`
}

const generateGeometryView = (props: GeometryModeProps): string => {
	const { width, height, grid, figures, lines } = props
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const cellWidth = width / grid.columns
	const cellHeight = height / grid.rows

	// Utility to convert grid coordinates to pixel coordinates
	const gridToPixel = (pos: { row: number; col: number }) => {
		return {
			x: pos.col * cellWidth + cellWidth / 2,
			y: pos.row * cellHeight + cellHeight / 2
		}
	}

	// 1. Draw background grid
	// Vertical lines
	for (let col = 0; col <= grid.columns; col++) {
		const x = col * cellWidth
		canvas.drawLine(x, 0, x, height, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thin,
			opacity: grid.opacity
		})
	}
	// Horizontal lines
	for (let row = 0; row <= grid.rows; row++) {
		const y = row * cellHeight
		canvas.drawLine(0, y, width, y, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thin,
			opacity: grid.opacity
		})
	}

	// 2. Draw figures
	for (const fig of figures) {
		const pixelPoints = fig.vertices.map((p) => gridToPixel(p))

		canvas.drawPolygon(pixelPoints, {
			fill: fig.fillColor ?? "none",
			stroke: fig.strokeColor ?? theme.colors.black,
			strokeWidth: theme.stroke.width.thick
		})
	}

	// 3. Draw lines
	for (const line of lines) {
		const fromPixel = gridToPixel(line.from)
		const toPixel = gridToPixel(line.to)

		let strokeDasharray = ""
		if (line.style === "dashed") {
			strokeDasharray = theme.stroke.dasharray.dashed
		} else if (line.style === "dotted") {
			strokeDasharray = theme.stroke.dasharray.dotted
		}

		canvas.drawLine(fromPixel.x, fromPixel.y, toPixel.x, toPixel.y, {
			stroke: line.color,
			strokeWidth: theme.stroke.width.thick,
			dash: strokeDasharray
		})
	}

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg">${svgBody}</svg>`
}

// MODIFIED: The main generator function is now a switcher
export const generatePartitionedShape: WidgetGenerator<
	typeof PartitionedShapePropsSchema
> = async (props) => {
	switch (props.mode) {
		case "partition":
			return generatePartitionView(props)
		case "geometry":
			return generateGeometryView(props)
	}
}
