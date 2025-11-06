import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneBaseV2 } from "@/widgets/utils/coordinate-plane-utils"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Factory functions to avoid schema instance reuse which causes $ref in JSON Schema
function createPointSchema() {
	return z.object({
		x: z
			.number()
			.describe("The x-coordinate of the point in an arbitrary data space."),
		y: z
			.number()
			.describe("The y-coordinate of the point in an arbitrary data space.")
	})
}

function createHighlightPointSchema() {
	return z.object({
		t: z
			.number()
			.min(0)
			.max(1)
			.describe(
				"Position along the curve as a fraction of total arc length; 0 = start of curve, 1 = end of curve."
			),
		label: z
			.string()
			.describe(
				"The text label to display next to this point (e.g., 'A', 'B', 'C')."
			)
	})
}

export const ConceptualGraphPropsSchema = z
	.object({
		type: z.literal("conceptualGraph"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		xAxisLabel: z
			.string()
			.describe("The label for the horizontal axis (e.g., 'Time')."),
		yAxisLabel: z
			.string()
			.describe(
				"The label for the vertical axis (e.g., 'Frog population size')."
			),
		curvePoints: z
			.array(createPointSchema())
			.min(2)
			.describe("An array of {x, y} points that define the curve to be drawn."),
		curveColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The color of the plotted curve."),
		highlightPoints: z
			.array(createHighlightPointSchema())
			.describe(
				"An array of specific, labeled points to highlight on the graph."
			),
		highlightPointColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The color of the highlighted points and their labels."),
		highlightPointRadius: z
			.number()
			.positive()
			.describe("The radius of the highlighted points in pixels.")
	})
	.strict()
	.describe(
		"Creates an abstract graph to show relationships between variables without a numerical scale. Renders a smooth curve and highlights key points."
	)

export type ConceptualGraphProps = z.infer<typeof ConceptualGraphPropsSchema>

export const generateConceptualGraph: WidgetGenerator<
	typeof ConceptualGraphPropsSchema
> = async (props) => {
	const {
		width,
		height,
		xAxisLabel,
		yAxisLabel,
		curvePoints,
		curveColor,
		highlightPoints,
		highlightPointColor,
		highlightPointRadius
	} = props

	if (curvePoints.length === 0) {
		return `<svg width="${width}" height="${height}"></svg>`
	}

	const allPoints = curvePoints
	const minX = Math.min(...allPoints.map((p) => p.x))
	const maxX = Math.max(...allPoints.map((p) => p.x))
	const minY = Math.min(...allPoints.map((p) => p.y))
	const maxY = Math.max(...allPoints.map((p) => p.y))

	// Use V2 base with conceptual (non-numeric) axes
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const baseInfo = setupCoordinatePlaneBaseV2(
		{
			width,
			height,
			title: null, // No title for conceptual graphs
			xAxis: {
				xScaleType: "numeric",
				label: xAxisLabel,
				min: minX,
				max: maxX,
				tickInterval: (maxX - minX) / 4, // Arbitrary spacing
				showGridLines: false,
				showTickLabels: false, // Conceptual, no numeric labels
				showTicks: false
			},
			yAxis: {
				label: yAxisLabel,
				min: minY,
				max: maxY,
				tickInterval: (maxY - minY) / 4, // Arbitrary spacing
				showGridLines: false,
				showTickLabels: false, // Conceptual, no numeric labels
				showTicks: false
			}
		},
		canvas
	)

	// Add arrow markers (outside clipped area)
	canvas.addDef(
		`<marker id="graph-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.colors.black}"/></marker>`
	)

	const yAxisX = baseInfo.chartArea.left
	const xAxisY = baseInfo.chartArea.top + baseInfo.chartArea.height
	canvas.drawLine(yAxisX, xAxisY, yAxisX, baseInfo.chartArea.top, {
		stroke: theme.colors.axis,
		strokeWidth: theme.stroke.width.thick,
		markerEnd: "url(#graph-arrow)"
	})
	canvas.drawLine(
		yAxisX,
		xAxisY,
		baseInfo.chartArea.left + baseInfo.chartArea.width,
		xAxisY,
		{
			stroke: theme.colors.axis,
			strokeWidth: theme.stroke.width.thick,
			markerEnd: "url(#graph-arrow)"
		}
	)

	// Track vertical extents for unclipped content so we can grow the viewBox vertically
	let minYExtent = 0
	let maxYExtent = baseInfo.chartArea.top + baseInfo.chartArea.height + 60
	function includeCircleY(cy: number, r: number) {
		minYExtent = Math.min(minYExtent, cy - r)
		maxYExtent = Math.max(maxYExtent, cy + r)
	}
	function includeTextY(cy: number, fontPx: number) {
		const half = fontPx / 2
		minYExtent = Math.min(minYExtent, cy - half)
		maxYExtent = Math.max(maxYExtent, cy + half)
	}

	// Main curve goes in the clipped region
	canvas.drawInClippedRegion((clippedCanvas) => {
		const polylinePoints = curvePoints.map((p) => ({
			x: baseInfo.toSvgX(p.x),
			y: baseInfo.toSvgY(p.y)
		}))
		clippedCanvas.drawPolyline(polylinePoints, {
			stroke: curveColor,
			strokeWidth: theme.stroke.width.xxthick,
			strokeLinejoin: "round",
			strokeLinecap: "round"
		})
	})

	// Precompute cumulative lengths and provide a safe pointAtT
	const cumulativeLengths: number[] = [0]
	for (let i = 1; i < curvePoints.length; i++) {
		const prev = curvePoints[i - 1]
		const curr = curvePoints[i]
		if (!prev || !curr) continue
		const dx = curr.x - prev.x
		const dy = curr.y - prev.y
		const segLen = Math.hypot(dx, dy)
		cumulativeLengths[i] = (cumulativeLengths[i - 1] ?? 0) + segLen
	}
	const totalLength = cumulativeLengths[cumulativeLengths.length - 1] ?? 0
	function pointAtT(t: number): { x: number; y: number } {
		if (curvePoints.length === 0) return { x: 0, y: 0 }
		if (curvePoints.length === 1 || totalLength === 0)
			return curvePoints[0] ?? { x: 0, y: 0 }
		if (t <= 0) return curvePoints[0] ?? { x: 0, y: 0 }
		if (t >= 1) return curvePoints[curvePoints.length - 1] ?? { x: 0, y: 0 }
		const target = t * totalLength
		let idx = 0
		for (let i = 0; i < cumulativeLengths.length - 1; i++) {
			const cStartVal = cumulativeLengths[i] ?? 0
			const cEndVal = cumulativeLengths[i + 1] ?? cStartVal
			if (target >= cStartVal && target <= cEndVal) {
				idx = i
				break
			}
		}
		if (idx < 0) idx = 0
		if (idx >= curvePoints.length - 1)
			return curvePoints[curvePoints.length - 1] ?? { x: 0, y: 0 }
		const cStartVal = cumulativeLengths[idx] ?? 0
		const cEndVal = cumulativeLengths[idx + 1] ?? cStartVal
		const cStart = cStartVal
		const cEnd = cEndVal
		const segmentLength = cEnd - cStart
		const localT = segmentLength === 0 ? 0 : (target - cStart) / segmentLength
		const p0 = curvePoints[idx]
		const p1 = curvePoints[idx + 1]
		if (!p0 || !p1) return { x: 0, y: 0 }
		return {
			x: p0.x + (p1.x - p0.x) * localT,
			y: p0.y + (p1.y - p0.y) * localT
		}
	}

	// Highlight points and labels go in unclipped content to prevent being cut off at boundaries
	for (const hp of highlightPoints) {
		const pt = pointAtT(hp.t)
		const cx = baseInfo.toSvgX(pt.x)
		const cy = baseInfo.toSvgY(pt.y)
		canvas.drawCircle(cx, cy, highlightPointRadius, {
			fill: highlightPointColor
		})
		canvas.drawText({
			x: cx - highlightPointRadius - 5,
			y: cy,
			text: hp.label,
			anchor: "end",
			dominantBaseline: "middle",
			fontWeight: theme.font.weight.bold,
			fontPx: theme.font.size.medium
		})
		// Include vertical extents for the circle and label (dominant-baseline=middle)
		includeCircleY(cy, highlightPointRadius)
		const fontPx = theme.font.size.medium
		includeTextY(cy, fontPx)
	}

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(AXIS_VIEWBOX_PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.large}">${svgBody}</svg>`
}
