import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneBaseV2 } from "@/widgets/utils/coordinate-plane-utils"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Factory helpers to avoid schema reuse and $ref generation
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

function createSegmentSchema() {
	return z.object({
		points: z
			.array(createPointSchema())
			.describe(
				"An array of {x, y} points that define this segment of the curve."
			),
		color: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("The color of this line segment."),
		label: z
			.string()
			.describe(
				"The text label for this segment to be displayed in the legend."
			)
	})
}

export const PopulationChangeEventGraphPropsSchema = z
	.object({
		type: z.literal("populationChangeEventGraph"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		xAxisLabel: z
			.string()
			.describe("The label for the horizontal axis (e.g., 'Time')."),
		yAxisLabel: z
			.string()
			.describe(
				"The label for the vertical axis (e.g., 'Deer population size')."
			),
		xAxisMin: z
			.number()
			.describe(
				"The minimum value for the x-axis. This should typically be 0 for time-based data."
			),
		xAxisMax: z
			.number()
			.describe(
				"The maximum value for the x-axis. Set this to accommodate both before and after segments (e.g., 10 if before ends at 5 and after extends to 10)."
			),
		yAxisMin: z
			.number()
			.describe(
				"The minimum value for the y-axis. CRITICAL: Keep this consistent across all related graphs for meaningful comparison."
			),
		yAxisMax: z
			.number()
			.describe(
				"The maximum value for the y-axis. CRITICAL: Keep this consistent across all related graphs for meaningful comparison. Choose a value that accommodates all data points with some padding."
			),
		beforeSegment: createSegmentSchema().describe(
			"The data and style for the 'before' period, drawn as a solid line."
		),
		afterSegment: createSegmentSchema().describe(
			"The data and style for the 'after' period, drawn as a dashed line."
		),
		showLegend: z
			.boolean()
			.describe("If true, a legend is displayed to identify the line segments.")
	})
	.strict()
	.describe(
		"Creates a conceptual graph showing a 'before' and 'after' scenario, typically for population changes over time. Renders a solid line followed by a dashed line, with a legend. IMPORTANT: Always use consistent axis scales across related graphs to enable visual comparison."
	)

export type PopulationChangeEventGraphProps = z.infer<
	typeof PopulationChangeEventGraphPropsSchema
>

export const generatePopulationChangeEventGraph: WidgetGenerator<
	typeof PopulationChangeEventGraphPropsSchema
> = async (props) => {
	const {
		width,
		height,
		xAxisLabel,
		yAxisLabel,
		xAxisMin,
		xAxisMax,
		yAxisMin,
		yAxisMax,
		beforeSegment,
		afterSegment,
		showLegend
	} = props

	const allPoints = [...beforeSegment.points, ...afterSegment.points]
	if (allPoints.length === 0) {
		return `<svg width="${width}" height="${height}"></svg>`
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const baseInfo = setupCoordinatePlaneBaseV2(
		{
			width,
			height,
			title: null, // No title for this widget
			xAxis: {
				xScaleType: "numeric",
				label: xAxisLabel,
				min: xAxisMin,
				max: xAxisMax,
				tickInterval: (xAxisMax - xAxisMin) / 5,
				showGridLines: false,
				showTickLabels: false, // Conceptual, no numeric labels
				showTicks: false
			},
			yAxis: {
				label: yAxisLabel,
				min: yAxisMin,
				max: yAxisMax,
				tickInterval: (yAxisMax - yAxisMin) / 5,
				showGridLines: false,
				showTickLabels: false, // Conceptual, no numeric labels
				showTicks: false
			}
		},
		canvas
	)

	// Axis arrows outside clip
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

	// Curves using Canvas API
	if (beforeSegment.points.length > 0) {
		const beforePoints = beforeSegment.points.map((p) => ({
			x: baseInfo.toSvgX(p.x),
			y: baseInfo.toSvgY(p.y)
		}))
		canvas.drawPolyline(beforePoints, {
			stroke: beforeSegment.color,
			strokeWidth: theme.stroke.width.xxthick,
			strokeLinejoin: "round",
			strokeLinecap: "round"
		})
	}
	if (afterSegment.points.length > 0) {
		const afterPoints = afterSegment.points.map((p) => ({
			x: baseInfo.toSvgX(p.x),
			y: baseInfo.toSvgY(p.y)
		}))
		canvas.drawPolyline(afterPoints, {
			stroke: afterSegment.color,
			strokeWidth: theme.stroke.width.xxthick,
			dash: theme.stroke.dasharray.dashedLong,
			strokeLinejoin: "round",
			strokeLinecap: "round"
		})
	}

	// Legend content (move to right side, outside clip)
	if (showLegend) {
		const legendItems = [
			{ label: beforeSegment.label, color: beforeSegment.color, dashed: false },
			{ label: afterSegment.label, color: afterSegment.color, dashed: true }
		]
		const legendLineLength = 30
		const legendGapX = 8
		const legendItemHeight = 18
		const legendStartX = baseInfo.chartArea.left + baseInfo.chartArea.width + 15
		const legendStartY = baseInfo.chartArea.top + 10
		for (const [i, item] of legendItems.entries()) {
			const y = legendStartY + i * legendItemHeight
			const textY = y + 5
			const x1 = legendStartX
			const x2 = legendStartX + legendLineLength
			const textX = x2 + legendGapX
			// Drawing with Canvas calls below
			canvas.drawLine(x1, y, x2, y, {
				stroke: item.color,
				strokeWidth: theme.stroke.width.xxthick,
				dash: item.dashed ? "8 6" : undefined
			})
			canvas.drawText({
				x: textX,
				y: textY,
				text: item.label,
				anchor: "start"
			})
		}
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
