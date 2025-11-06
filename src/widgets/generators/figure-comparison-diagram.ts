import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { abbreviateMonth } from "@/widgets/utils/labels"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"
import { theme } from "@/widgets/utils/theme"

const Point = z
	.object({
		x: z
			.number()
			.describe(
				"Horizontal coordinate relative to figure's local origin. Can be negative. Figure will be auto-positioned within the layout (e.g., -30, 0, 50, 25.5)."
			),
		y: z
			.number()
			.describe(
				"Vertical coordinate relative to figure's local origin. Can be negative. Positive y is downward (e.g., -20, 0, 40, 15.5)."
			)
	})
	.strict()

const Figure = z
	.object({
		vertices: z
			.array(Point)
			.describe(
				"Ordered array of vertices defining the polygon. Connect in order, closing back to first. Minimum 3 vertices for a valid polygon (e.g., triangle, square, pentagon)."
			),
		fillColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
			)
			.describe(
				"Hex-only fill color for the polygon interior (e.g., '#E8F4FD', 'transparent' for outline only, '#FFC8004D' for ~30% alpha)."
			),
		strokeColor: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
			)
			.describe(
				"Hex-only color for the polygon's border (e.g., '#000000', '#333333', '#00008B'). Set to 'transparent' to hide the outline."
			),
		strokeWidth: z
			.number()
			.min(0)
			.describe(
				"Width of the polygon's border in pixels (e.g., 2 for standard, 3 for bold, 1 for thin). Use 0 for no visible border."
			),
		sideLabels: z
			.array(
				z
					.string()
					.nullable()
					.transform((val) =>
						val === "null" || val === "NULL" || val === "" ? null : val
					)
			)
			.describe(
				"Labels for each edge of the polygon. Array length should match vertex count. First label is for edge from vertex[0] to vertex[1]. Null for no label on that edge."
			),
		sideLabelOffset: z
			.number()
			.describe(
				"Distance in pixels from edge to place side labels. Positive places outside, negative inside (e.g., 15, -10, 20). Applies to all side labels."
			),
		figureLabel: z
			.object({
				text: z
					.string()
					.describe(
						"Main label for the entire figure (e.g., 'Figure A', 'Original', 'Square', '64 cm²'). Can include math notation or symbols."
					),
				position: z
					.enum(["top", "bottom", "left", "right", "center"])
					.describe(
						"Where to place the label relative to the figure. 'center' places inside the polygon, others place outside."
					),
				offset: z
					.number()
					.describe(
						"Additional spacing in pixels from the figure's edge or center (e.g., 10, 20, 5). For 'center', this has no effect."
					)
			})
			.strict()
			.describe("Configuration for the figure's main identifying label.")
	})
	.strict()

export const FigureComparisonDiagramPropsSchema = z
	.object({
		type: z
			.literal("figureComparisonDiagram")
			.describe(
				"Identifies this as a figure comparison diagram for displaying multiple polygons side by side."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		figures: z
			.array(Figure)
			.describe(
				"Array of polygonal figures to display. Can show different shapes or same shape with different properties. Order determines left-to-right or top-to-bottom placement."
			),
		layout: z
			.enum(["horizontal", "vertical"])
			.describe(
				"Arrangement direction. 'horizontal' places figures left to right. 'vertical' stacks figures top to bottom. Choose based on figure count and aspect ratios."
			),
		spacing: z
			.number()
			.min(0)
			.describe(
				"Gap between figures in pixels (e.g., 50, 80, 30). Provides visual separation. Larger spacing prevents label overlap."
			)
	})
	.strict()
	.describe(
		"Creates a comparison view of multiple polygonal figures with comprehensive labeling options. Perfect for showing transformations, comparing shapes, demonstrating congruence/similarity, or analyzing different polygons. Each figure can have different styling and complete edge/vertex labeling."
	)

export type FigureComparisonDiagramProps = z.infer<
	typeof FigureComparisonDiagramPropsSchema
>

/**
 * Generates diagrams for comparing multiple independent geometric figures.
 * Perfect for scale copies, similarity problems, and geometric comparisons.
 */
export const generateFigureComparisonDiagram: WidgetGenerator<
	typeof FigureComparisonDiagramPropsSchema
> = async (data) => {
	const { width, height, figures, layout, spacing } = data

	if (figures.length === 0) return `<svg width="${width}" height="${height}" />`

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Collect geometry in raw coordinates first, then fit-to-box scale and render
	type Point = { x: number; y: number }
	type FigureGeometry = {
		vertices: Point[]
		sideLabels: Array<{
			x: number
			y: number
			text: string
			color: string
			edgeFrom: { x: number; y: number }
			edgeTo: { x: number; y: number }
		}>
		figureLabel: { x: number; y: number; text: string; color: string }
		fillColor: string
		strokeColor: string
		strokeWidth: number
	}

	const figureGeometries: FigureGeometry[] = []
	const allPoints: Point[] = []

	// Calculate bounding boxes for each figure in raw coordinates
	const figureBounds = figures.map((figure) => {
		const xs = figure.vertices.map((v) => v.x)
		const ys = figure.vertices.map((v) => v.y)
		return {
			minX: Math.min(...xs),
			maxX: Math.max(...xs),
			minY: Math.min(...ys),
			maxY: Math.max(...ys),
			width: Math.max(...xs) - Math.min(...xs),
			height: Math.max(...ys) - Math.min(...ys)
		}
	})

	// Calculate total dimensions needed in raw coordinates (without spacing)
	const maxFigureWidth = Math.max(...figureBounds.map((b) => b.width))
	const maxFigureHeight = Math.max(...figureBounds.map((b) => b.height))

	let totalContentWidth: number
	let totalContentHeight: number

	if (layout === "horizontal") {
		totalContentWidth = figureBounds.reduce((sum, b) => sum + b.width, 0)
		totalContentHeight = maxFigureHeight
	} else {
		totalContentWidth = maxFigureWidth
		totalContentHeight = figureBounds.reduce((sum, b) => sum + b.height, 0)
	}

	// Position figures in raw coordinate space (centered around 0,0, no spacing yet)
	const startX = -totalContentWidth / 2
	const startY = -totalContentHeight / 2

	let currentX = startX
	let currentY = startY

	for (let i = 0; i < figures.length; i++) {
		const figure = figures[i]
		const bounds = figureBounds[i]
		if (!figure || !bounds) continue

		// Calculate offset to position this figure in raw coordinates
		const offsetX = currentX - bounds.minX
		const offsetY = currentY - bounds.minY

		// Collect geometry for this figure
		const figureGeometry = collectFigureGeometry(figure, offsetX, offsetY)
		figureGeometries.push(figureGeometry)

		// Add all points to the global collection for fit calculation
		allPoints.push(...figureGeometry.vertices)
		allPoints.push(
			...figureGeometry.sideLabels.map((label) => ({ x: label.x, y: label.y }))
		)
		allPoints.push({
			x: figureGeometry.figureLabel.x,
			y: figureGeometry.figureLabel.y
		})

		// Move to next position in raw coordinates (no spacing)
		if (layout === "horizontal") {
			currentX += bounds.width
		} else {
			currentY += bounds.height
		}
	}

	// Compute fit transform from all collected points
	const { project } = computeFit(allPoints, width, height)

	// Calculate spacing offsets in screen coordinates
	const spacingOffsets: Array<{ x: number; y: number }> = []
	let cumulativeOffsetX = 0
	let cumulativeOffsetY = 0

	for (let i = 0; i < figureGeometries.length; i++) {
		spacingOffsets.push({ x: cumulativeOffsetX, y: cumulativeOffsetY })

		if (i < figureGeometries.length - 1) {
			// Don't add spacing after the last figure
			if (layout === "horizontal") {
				cumulativeOffsetX += spacing
			} else {
				cumulativeOffsetY += spacing
			}
		}
	}

	// Track all placed labels to prevent overlaps between side labels and figure labels
	const placedLabelRects: Array<{
		x: number
		y: number
		width: number
		height: number
	}> = []

	// Render all figures with spacing applied in screen space
	for (let i = 0; i < figureGeometries.length; i++) {
		const figureGeom = figureGeometries[i]
		const spacingOffset = spacingOffsets[i]
		const figure = figures[i]
		if (!figureGeom || !spacingOffset || !figure) continue
		// Draw the figure shape with spacing offset
		const transformedVertices = figureGeom.vertices.map((v) => {
			const projected = project(v)
			return {
				x: projected.x + spacingOffset.x,
				y: projected.y + spacingOffset.y
			}
		})
		canvas.drawPolygon(transformedVertices, {
			fill: figureGeom.fillColor,
			stroke: figureGeom.strokeColor,
			strokeWidth: figureGeom.strokeWidth // Keep original stroke width (screen space)
		})

		// Draw side labels with spacing offset, nudging outward to avoid line collisions
		for (const sideLabel of figureGeom.sideLabels) {
			const projectedFrom = project({
				x: sideLabel.edgeFrom.x,
				y: sideLabel.edgeFrom.y
			})
			const projectedTo = project({
				x: sideLabel.edgeTo.x,
				y: sideLabel.edgeTo.y
			})

			const labelFontPx = 14
			const labelLineHeight = 1.2
			const { maxWidth: textWidthPx, height: textHeightPx } =
				estimateWrappedTextDimensions(
					sideLabel.text,
					Number.POSITIVE_INFINITY,
					labelFontPx,
					labelLineHeight
				)

			// Compute outward normal in screen space using polygon center
			const edgeDx = projectedTo.x - projectedFrom.x
			const edgeDy = projectedTo.y - projectedFrom.y
			const edgeLen = Math.sqrt(edgeDx * edgeDx + edgeDy * edgeDy)
			let normalX = 0
			let normalY = 0
			if (edgeLen > 0) {
				normalX = -edgeDy / edgeLen
				normalY = edgeDx / edgeLen
			}

			const polyCenterX =
				transformedVertices.reduce((sum, v) => sum + v.x, 0) /
				transformedVertices.length
			const polyCenterY =
				transformedVertices.reduce((sum, v) => sum + v.y, 0) /
				transformedVertices.length
			// Use edge midpoint for initial candidate placement
			const midX = (projectedFrom.x + projectedTo.x) / 2
			const midY = (projectedFrom.y + projectedTo.y) / 2
			const toCenterX = polyCenterX - midX
			const toCenterY = polyCenterY - midY
			const dot = normalX * toCenterX + normalY * toCenterY
			if (dot > 0) {
				normalX = -normalX
				normalY = -normalY
			}

			// Build candidates: outward and inward from the edge midpoint, then choose best by minimal nudges
			// midX/midY already defined above

			const halfW = textWidthPx / 2
			const halfH = textHeightPx / 2

			// Capture narrowed values for use inside the local function (avoids optional narrowing loss)
			const offsetDistance = figure.sideLabelOffset
			const spacingX = spacingOffset.x
			const spacingY = spacingOffset.y

			function placeFor(dirX: number, dirY: number) {
				const startX = midX + dirX * offsetDistance + spacingX
				const startY = midY + dirY * offsetDistance + spacingY
				let px = startX
				let py = startY
				let iterations = 0
				const maxIterations = 60
				const stepPx = 2
				while (
					polygonIntersectsRect(transformedVertices, {
						x: px - halfW,
						y: py - halfH,
						width: textWidthPx,
						height: textHeightPx,
						pad: 1
					}) &&
					iterations < maxIterations
				) {
					px += dirX * stepPx
					py += dirY * stepPx
					iterations++
				}
				return { x: px, y: py, iterations }
			}

			const outward = placeFor(normalX, normalY)
			const inward = placeFor(-normalX, -normalY)

			// Choose candidate with fewer iterations; tie-break by further distance from polygon (more iterations not necessarily better, so prefer the one that first cleared)
			const chosen = inward.iterations < outward.iterations ? inward : outward

			canvas.drawText({
				x: chosen.x,
				y: chosen.y,
				text: sideLabel.text,
				fill: sideLabel.color,
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx: labelFontPx,
				fontWeight: theme.font.weight.bold
			})

			// Track this side label's bounding box for figure label collision detection
			placedLabelRects.push({
				x: chosen.x - textWidthPx / 2,
				y: chosen.y - textHeightPx / 2,
				width: textWidthPx,
				height: textHeightPx
			})
		}

		// Calculate figure label position based on final transformed bounds
		const finalBounds = {
			minX: Math.min(...transformedVertices.map((v) => v.x)),
			maxX: Math.max(...transformedVertices.map((v) => v.x)),
			minY: Math.min(...transformedVertices.map((v) => v.y)),
			maxY: Math.max(...transformedVertices.map((v) => v.y))
		}

		const centerX = (finalBounds.minX + finalBounds.maxX) / 2
		const centerY = (finalBounds.minY + finalBounds.maxY) / 2

		let labelX = centerX
		let labelY = centerY

		// Add clearance for external side labels to avoid overlap with the figure label.
		// This pushes the figure label further out if side labels are present and positioned externally.
		const hasExternalSideLabels =
			figure.sideLabels.some((l) => typeof l === "string" && l.trim() !== "") &&
			figure.sideLabelOffset > 0
		const clearance = hasExternalSideLabels ? figure.sideLabelOffset + 20 : 0 // Increased buffer to 20px to account for font sizes.

		switch (figure.figureLabel.position) {
			case "top":
				labelY = finalBounds.minY - figure.figureLabel.offset - clearance
				break
			case "bottom":
				labelY = finalBounds.maxY + figure.figureLabel.offset + clearance
				break
			case "left":
				labelX = finalBounds.minX - figure.figureLabel.offset - clearance
				break
			case "right":
				labelX = finalBounds.maxX + figure.figureLabel.offset + clearance
				break
			default:
				// Already set to center
				break
		}

		// Nudge figure label outward if overlapping the polygon edges
		{
			const figureFontPx = 16
			const figureLineHeight = 1.2
			const { maxWidth: figTextW, height: figTextH } =
				estimateWrappedTextDimensions(
					figureGeom.figureLabel.text,
					Number.POSITIVE_INFINITY,
					figureFontPx,
					figureLineHeight
				)
			let flX = labelX
			let flY = labelY
			const halfW = figTextW / 2
			const halfH = figTextH / 2

			// Determine outward direction based on label position
			let dirX = 0
			let dirY = 0
			if (figure.figureLabel.position === "top") {
				dirY = -1
			} else if (figure.figureLabel.position === "bottom") {
				dirY = 1
			} else if (figure.figureLabel.position === "left") {
				dirX = -1
			} else if (figure.figureLabel.position === "right") {
				dirX = 1
			} else {
				// center: use vector from polygon center to label
				const vx = flX - centerX
				const vy = flY - centerY
				const vlen = Math.sqrt(vx * vx + vy * vy)
				if (vlen > 0) {
					dirX = vx / vlen
					dirY = vy / vlen
				}
			}

			let iter = 0
			const maxIter = 60
			const step = 2

			// Check collision against both polygon edges and placed side labels
			function hasCollision(x: number, y: number): boolean {
				const figureRect = {
					x: x - halfW,
					y: y - halfH,
					width: figTextW,
					height: figTextH
				}

				// Check collision with polygon edges
				if (
					polygonIntersectsRect(transformedVertices, { ...figureRect, pad: 1 })
				) {
					return true
				}

				// Check collision with placed side labels
				for (const placedRect of placedLabelRects) {
					if (rectanglesOverlap(figureRect, placedRect)) {
						return true
					}
				}

				return false
			}

			while (hasCollision(flX, flY) && iter < maxIter) {
				flX += dirX * step
				flY += dirY * step
				iter++
			}

			canvas.drawText({
				x: flX,
				y: flY,
				text: figureGeom.figureLabel.text,
				fill: figureGeom.figureLabel.color,
				anchor: "middle",
				dominantBaseline: "middle",
				fontPx: figureFontPx,
				fontWeight: theme.font.weight.bold
			})
		}
	}

	// Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}

/**
 * Helper: compute fit transform for all collected points
 */
function computeFit(
	allPoints: Array<{ x: number; y: number }>,
	width: number,
	height: number
) {
	if (allPoints.length === 0) {
		return {
			scale: 1,
			offsetX: 0,
			offsetY: 0,
			project: (p: { x: number; y: number }) => p
		}
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
	const project = (p: { x: number; y: number }) => ({
		x: offsetX + scale * p.x,
		y: offsetY + scale * p.y
	})
	return { scale, offsetX, offsetY, project }
}

/**
 * Collects geometry for a single figure in raw coordinates
 */
function collectFigureGeometry(
	figure: z.infer<typeof Figure>,
	offsetX: number,
	offsetY: number
): {
	vertices: Array<{ x: number; y: number }>
	sideLabels: Array<{
		x: number
		y: number
		text: string
		color: string
		edgeFrom: { x: number; y: number }
		edgeTo: { x: number; y: number }
	}>
	figureLabel: { x: number; y: number; text: string; color: string }
	fillColor: string
	strokeColor: string
	strokeWidth: number
} {
	// Transform vertices to raw coordinates
	const transformedVertices = figure.vertices.map((v) => ({
		x: v.x + offsetX,
		y: v.y + offsetY
	}))

	// Collect side labels
	const sideLabels: Array<{
		x: number
		y: number
		text: string
		color: string
		edgeFrom: { x: number; y: number }
		edgeTo: { x: number; y: number }
	}> = []
	for (
		let i = 0;
		i < Math.min(figure.sideLabels.length, transformedVertices.length);
		i++
	) {
		const rawLabel = figure.sideLabels[i]
		if (!rawLabel) continue
		const label = abbreviateMonth(rawLabel)

		const from = transformedVertices[i]
		const to = transformedVertices[(i + 1) % transformedVertices.length]
		if (!from || !to) continue

		// Calculate midpoint
		const midX = (from.x + to.x) / 2
		const midY = (from.y + to.y) / 2

		// Calculate perpendicular offset for label placement
		const dx = to.x - from.x
		const dy = to.y - from.y
		const length = Math.sqrt(dx * dx + dy * dy)
		const normalX = -dy / length
		const normalY = dx / length

		// Determine outward direction
		const centerX =
			transformedVertices.reduce((sum, v) => sum + v.x, 0) /
			transformedVertices.length
		const centerY =
			transformedVertices.reduce((sum, v) => sum + v.y, 0) /
			transformedVertices.length
		const toCenterX = centerX - midX
		const toCenterY = centerY - midY
		const dotProduct = normalX * toCenterX + normalY * toCenterY

		// Flip normal if it points toward center
		const outwardNormalX = dotProduct > 0 ? -normalX : normalX
		const outwardNormalY = dotProduct > 0 ? -normalY : normalY

		const labelX = midX + outwardNormalX * figure.sideLabelOffset
		const labelY = midY + outwardNormalY * figure.sideLabelOffset

		sideLabels.push({
			x: labelX,
			y: labelY,
			text: label,
			color: figure.strokeColor,
			edgeFrom: { x: from.x, y: from.y },
			edgeTo: { x: to.x, y: to.y }
		})
	}

	// Calculate figure label position
	const bounds = {
		minX: Math.min(...transformedVertices.map((v) => v.x)),
		maxX: Math.max(...transformedVertices.map((v) => v.x)),
		minY: Math.min(...transformedVertices.map((v) => v.y)),
		maxY: Math.max(...transformedVertices.map((v) => v.y))
	}

	const centerX = (bounds.minX + bounds.maxX) / 2
	const centerY = (bounds.minY + bounds.maxY) / 2

	let labelX = centerX
	let labelY = centerY

	// Add clearance for external side labels to avoid overlap with the figure label.
	// This pushes the figure label further out if side labels are present and positioned externally.
	const hasExternalSideLabels =
		figure.sideLabels.some((l) => typeof l === "string" && l.trim() !== "") &&
		figure.sideLabelOffset > 0
	const clearance = hasExternalSideLabels ? figure.sideLabelOffset + 20 : 0 // Increased buffer to 20px to account for font sizes.

	switch (figure.figureLabel.position) {
		case "top":
			labelY = bounds.minY - figure.figureLabel.offset - clearance
			break
		case "bottom":
			labelY = bounds.maxY + figure.figureLabel.offset + clearance
			break
		case "left":
			labelX = bounds.minX - figure.figureLabel.offset - clearance
			break
		case "right":
			labelX = bounds.maxX + figure.figureLabel.offset + clearance
			break
		default:
			// Already set to center
			break
	}

	const labelText = abbreviateMonth(figure.figureLabel.text)

	return {
		vertices: transformedVertices,
		sideLabels,
		figureLabel: {
			x: labelX,
			y: labelY,
			text: labelText,
			color: figure.strokeColor
		},
		fillColor: figure.fillColor,
		strokeColor: figure.strokeColor,
		strokeWidth: figure.strokeWidth
	}
}

/**
 * Geometry helpers for collision checks in screen space
 */
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

	// Quick reject if both points are on one outside side without crossing
	const minX = Math.min(A.x, B.x)
	const maxX = Math.max(A.x, B.x)
	const minY = Math.min(A.y, B.y)
	const maxY = Math.max(A.y, B.y)
	if (maxX < rx || minX > rx + rw || maxY < ry || minY > ry + rh) {
		// Bounding boxes don't overlap
		// Might still intersect if the segment passes through the rectangle area in a narrow way, but
		// since the segment bbox is fully outside the expanded rect bbox, it's safe to return false
		return false
	}

	// If either endpoint inside the rect
	if (
		pointInRect(A.x, A.y, rx, ry, rw, rh) ||
		pointInRect(B.x, B.y, rx, ry, rw, rh)
	)
		return true

	// Check intersection with each rectangle side
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

	// Any polygon edge intersect the rect
	for (let i = 0; i < poly.length; i++) {
		const a = poly[i]
		const b = poly[(i + 1) % poly.length]
		if (!a || !b) continue
		if (segmentIntersectsRect(a, b, { x: rx, y: ry, width: rw, height: rh }))
			return true
	}

	// Any polygon vertex inside rect
	for (const p of poly) {
		if (pointInRect(p.x, p.y, rx, ry, rw, rh)) return true
	}

	// Rect center inside polygon (handles rect completely inside polygon with no edge intersections)
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

function rectanglesOverlap(
	rect1: { x: number; y: number; width: number; height: number },
	rect2: { x: number; y: number; width: number; height: number }
): boolean {
	return !(
		rect1.x + rect1.width <= rect2.x ||
		rect2.x + rect2.width <= rect1.x ||
		rect1.y + rect1.height <= rect2.y ||
		rect2.y + rect2.height <= rect1.y
	)
}
