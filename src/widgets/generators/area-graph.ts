import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneBaseV2 } from "@/widgets/utils/coordinate-plane-utils"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { abbreviateMonth } from "@/widgets/utils/labels"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

const PointSchema = z.object({
	x: z
		.number()
		.describe("The x-coordinate (horizontal value) of the data point."),
	y: z.number().describe("The y-coordinate (vertical value) of the data point.")
})

export const AreaGraphPropsSchema = z
	.object({
		type: z.literal("areaGraph"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		title: z.string().describe("The main title displayed above the graph."),
		xAxis: z
			.object({
				label: z
					.string()
					.describe("The label for the horizontal axis (e.g., 'Year')."),
				min: z.number().describe("The minimum value for the x-axis scale."),
				max: z.number().describe("The maximum value for the x-axis scale."),
				tickValues: z
					.array(z.number())
					.describe(
						"An array of specific numerical values to be marked as ticks on the x-axis."
					)
			})
			.strict(),
		yAxis: z
			.object({
				label: z
					.string()
					.describe(
						"The label for the vertical axis (e.g., 'Percent of total')."
					),
				min: z.number().describe("The minimum value for the y-axis scale."),
				max: z.number().describe("The maximum value for the y-axis scale."),
				tickInterval: z
					.number()
					.positive()
					.describe(
						"The numeric interval between labeled tick marks on the y-axis."
					),
				// REMOVED: tickFormat field is no longer supported.
				showGridLines: z
					.boolean()
					.describe("If true, displays horizontal grid lines for the y-axis.")
			})
			.strict(),
		dataPoints: z
			.array(PointSchema)
			.min(2)
			.describe(
				"An array of {x, y} points defining the boundary line between the two areas."
			),
		bottomArea: z
			.object({
				label: z
					.string()
					.describe("Text label to display within the bottom area."),
				color: z
					.string()
					.regex(CSS_COLOR_PATTERN, "invalid css color")
					.describe("The fill color for the bottom area.")
			})
			.strict(),
		topArea: z
			.object({
				label: z
					.string()
					.describe("Text label to display within the top area."),
				color: z
					.string()
					.regex(CSS_COLOR_PATTERN, "invalid css color")
					.describe("The fill color for the top area.")
			})
			.strict(),
		boundaryLine: z
			.object({
				color: z
					.string()
					.regex(CSS_COLOR_PATTERN, "invalid css color")
					.describe("The color of the line separating the areas."),
				strokeWidth: z
					.number()
					.positive()
					.describe("The thickness of the line separating the areas.")
			})
			.strict()
	})
	.strict()
	.describe(
		"Creates a stacked area graph to show how a total is divided into two categories over time or another continuous variable. Ideal for showing percentage breakdowns."
	)

export type AreaGraphProps = z.infer<typeof AreaGraphPropsSchema>

export const generateAreaGraph: WidgetGenerator<
	typeof AreaGraphPropsSchema
> = async (props) => {
	const {
		width,
		height,
		title,
		xAxis,
		yAxis,
		dataPoints,
		bottomArea,
		topArea,
		boundaryLine
	} = props

	if (xAxis.tickValues.length < 2) {
		logger.error("area graph invalid tickValues", {
			count: xAxis.tickValues.length
		})
		throw errors.new("invalid x tick values")
	}
	const deltas: number[] = []
	for (let i = 1; i < xAxis.tickValues.length; i++) {
		const curr = xAxis.tickValues[i]
		if (curr === undefined) {
			logger.error("area graph invalid tick value", { index: i })
			throw errors.new("invalid x tick values")
		}
		const prev = xAxis.tickValues[i - 1]
		if (prev === undefined) {
			logger.error("area graph invalid tick value", { index: i - 1 })
			throw errors.new("invalid x tick values")
		}
		const d = curr - prev
		deltas.push(d)
	}
	const first = deltas[0] ?? 0
	const nonUniform = deltas.some((d) => Math.abs(d - first) > 1e-9)
	// Relaxed: if non-uniform, we won't throw; we use a reasonable tickInterval fallback
	const tickInterval = nonUniform
		? Math.max(1e-9, Math.min(...deltas.map((d) => Math.abs(d))))
		: Math.abs(first)

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const baseInfo = setupCoordinatePlaneBaseV2(
		{
			width,
			height,
			title,
			xAxis: {
				xScaleType: "numeric",
				label: xAxis.label,
				min: xAxis.min,
				max: xAxis.max,
				tickInterval,
				showGridLines: false,
				showTickLabels: true
			},
			yAxis: {
				label: yAxis.label,
				min: yAxis.min,
				max: yAxis.max,
				tickInterval: yAxis.tickInterval,
				showGridLines: yAxis.showGridLines,
				showTickLabels: true
			}
		},
		canvas
	)

	const toSvgX = baseInfo.toSvgX
	const toSvgY = baseInfo.toSvgY

	// Track data points for extent calculation (handled by Canvas now)
	// const pointsStr = dataPoints.map((p) => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(" ") // Unused variable
	const firstPoint = dataPoints[0]
	if (!firstPoint) {
		logger.error("area graph missing first point", {
			count: dataPoints.length
		})
		throw errors.new("missing data point")
	}
	const lastPoint = dataPoints[dataPoints.length - 1]
	if (!lastPoint) {
		logger.error("area graph missing last point", { count: dataPoints.length })
		throw errors.new("missing data point")
	}
	const leftX = toSvgX(firstPoint.x)
	const rightX = toSvgX(lastPoint.x)

	// Build bottom area path
	const bottomPath = new Path2D()
	bottomPath.moveTo(leftX, toSvgY(yAxis.min))
	for (const point of dataPoints) {
		bottomPath.lineTo(toSvgX(point.x), toSvgY(point.y))
	}
	bottomPath.lineTo(rightX, toSvgY(yAxis.min))
	bottomPath.closePath()

	// Build top area path
	const topPath = new Path2D()
	topPath.moveTo(leftX, toSvgY(yAxis.max))
	for (const point of dataPoints) {
		topPath.lineTo(toSvgX(point.x), toSvgY(point.y))
	}
	topPath.lineTo(rightX, toSvgY(yAxis.max))
	topPath.closePath()

	// 1. Compute label anchors using area-weighted center of mass along x
	// Weight each segment by its horizontal span and area thickness
	let topWeightedX = 0
	let topTotalWeight = 0
	let bottomWeightedX = 0
	let bottomTotalWeight = 0
	for (let i = 0; i < dataPoints.length - 1; i++) {
		const p0 = dataPoints[i]
		const p1 = dataPoints[i + 1]
		if (!p0 || !p1) {
			logger.error("area graph missing segment point", { index: i })
			throw errors.new("invalid data points")
		}
		const dx = Math.abs(p1.x - p0.x)
		if (dx === 0) {
			logger.error("area graph invalid segment", { index: i })
			throw errors.new("invalid data points")
		}
		const midX = (p0.x + p1.x) / 2
		const topThick0 = yAxis.max - p0.y
		const topThick1 = yAxis.max - p1.y
		const bottomThick0 = p0.y - yAxis.min
		const bottomThick1 = p1.y - yAxis.min
		if (
			topThick0 < 0 ||
			topThick1 < 0 ||
			bottomThick0 < 0 ||
			bottomThick1 < 0
		) {
			logger.error("area graph y outside bounds", { index: i })
			throw errors.new("y out of bounds")
		}
		const topAvgThick = (topThick0 + topThick1) / 2
		const bottomAvgThick = (bottomThick0 + bottomThick1) / 2
		topWeightedX += midX * dx * topAvgThick
		topTotalWeight += dx * topAvgThick
		bottomWeightedX += midX * dx * bottomAvgThick
		bottomTotalWeight += dx * bottomAvgThick
	}
	if (topTotalWeight <= 0) {
		logger.error("area graph zero top area", { count: dataPoints.length })
		throw errors.new("invalid top area")
	}
	if (bottomTotalWeight <= 0) {
		logger.error("area graph zero bottom area", { count: dataPoints.length })
		throw errors.new("invalid bottom area")
	}
	const topCenterXVal = topWeightedX / topTotalWeight
	const bottomCenterXVal = bottomWeightedX / bottomTotalWeight

	// Interpolate boundary y-value at an arbitrary x using piecewise linear segments
	function interpolateBoundaryY(x: number): number {
		for (let i = 0; i < dataPoints.length - 1; i++) {
			const p0 = dataPoints[i]
			const p1 = dataPoints[i + 1]
			if (!p0 || !p1) {
				logger.error("area graph missing segment point", { index: i })
				throw errors.new("invalid data points")
			}
			const within = (p0.x <= x && x <= p1.x) || (p1.x <= x && x <= p0.x)
			if (within) {
				const span = p1.x - p0.x
				if (span === 0) {
					logger.error("area graph zero-length span", { index: i })
					throw errors.new("invalid data points")
				}
				const t = (x - p0.x) / span
				return p0.y + t * (p1.y - p0.y)
			}
		}
		logger.error("area graph interpolation x outside range", { x })
		throw errors.new("interpolation out of range")
	}

	// Bias the top label position toward the y-axis to avoid clashing with the boundary line on the right
	const topLabelXVal = xAxis.min + (topCenterXVal - xAxis.min) * 0.4
	const topBoundaryYVal = interpolateBoundaryY(topLabelXVal)
	const bottomBoundaryYVal = interpolateBoundaryY(bottomCenterXVal)

	const topLabelX = toSvgX(topLabelXVal)
	const bottomLabelX = toSvgX(bottomCenterXVal)
	// Position labels comfortably within each area band
	const topLabelY = toSvgY(yAxis.max - (yAxis.max - topBoundaryYVal) * 0.25)
	const bottomLabelY = toSvgY(
		yAxis.min + (bottomBoundaryYVal - yAxis.min) * 0.25
	)

	// 2. Draw area fills and boundary line using Canvas, within a clipped region
	canvas.drawInClippedRegion((clippedCanvas) => {
		// Draw bottom area fill
		clippedCanvas.drawPath(bottomPath, {
			fill: bottomArea.color,
			stroke: "none"
		})

		// Draw top area fill
		clippedCanvas.drawPath(topPath, {
			fill: topArea.color,
			stroke: "none"
		})

		// Draw boundary line
		const boundaryPoints = dataPoints.map((p) => ({
			x: toSvgX(p.x),
			y: toSvgY(p.y)
		}))
		clippedCanvas.drawPolyline(boundaryPoints, {
			stroke: boundaryLine.color,
			strokeWidth: boundaryLine.strokeWidth
		})
	})

	// Add unclipped labels using the main Canvas
	canvas.drawWrappedText({
		x: topLabelX,
		y: topLabelY,
		text: abbreviateMonth(topArea.label),
		maxWidthPx: baseInfo.chartArea.width,
		fontPx: theme.font.size.medium,
		anchor: "middle",
		fill: theme.colors.text
	})
	canvas.drawWrappedText({
		x: bottomLabelX,
		y: bottomLabelY,
		text: abbreviateMonth(bottomArea.label),
		maxWidthPx: baseInfo.chartArea.width,
		fontPx: theme.font.size.medium,
		anchor: "middle",
		fill: theme.colors.text
	})

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(AXIS_VIEWBOX_PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.medium}">${svgBody}</svg>`
}
