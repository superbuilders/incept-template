import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneBaseV2 } from "@/widgets/utils/coordinate-plane-utils"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

function createAxisOptionsSchema() {
	return z
		.object({
			label: z.string(),
			min: z.number(),
			max: z.number(),
			tickInterval: z.number().positive(),
			showGridLines: z.boolean(),
			showTickLabels: z
				.boolean()
				.describe("Whether to show tick labels on the axis.")
		})
		.strict()
}

export const ParabolaGraphPropsSchema = z
	.object({
		type: z.literal("parabolaGraph"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		xAxis: createAxisOptionsSchema(),
		yAxis: createAxisOptionsSchema(),
		parabola: z
			.object({
				vertex: z
					.object({
						x: z
							.number()
							.positive()
							.describe("x-coordinate of the vertex (must be > 0)"),
						y: z
							.number()
							.positive()
							.describe("y-coordinate of the vertex (must be > 0)")
					})
					.strict(),
				yIntercept: z
					.number()
					.positive()
					.describe(
						"Positive y-intercept at x = 0 (must be > 0 and less than vertex.y)."
					),
				color: z
					.string()
					.regex(CSS_COLOR_PATTERN, "invalid css color")
					.describe("The color of the parabola curve."),
				style: z
					.enum(["solid", "dashed"])
					.describe("The line style of the parabola curve.")
			})
			.strict()
	})
	.strict()
	.describe(
		"Creates a coordinate plane and renders a down-facing parabola in the first quadrant, defined by a positive vertex and positive y-intercept."
	)

export type ParabolaGraphProps = z.infer<typeof ParabolaGraphPropsSchema>

export const generateParabolaGraph: WidgetGenerator<
	typeof ParabolaGraphPropsSchema
> = async (props) => {
	const { width, height, xAxis, yAxis, parabola } = props

	// Vertex-form parabola: y = a (x - h)^2 + k
	const h = parabola.vertex.x
	const k = parabola.vertex.y
	const y0 = parabola.yIntercept

	// Runtime validation: enforce first-quadrant, down-facing configuration
	if (!(h > 0 && k > 0 && y0 > 0)) {
		logger.error("invalid parabola parameters", {
			vertexX: h,
			vertexY: k,
			yIntercept: y0
		})
		throw errors.new("invalid parabola parameters")
	}
	if (!(y0 < k)) {
		logger.error("y intercept must be less than vertex y", {
			vertexY: k,
			yIntercept: y0
		})
		throw errors.new("invalid parabola parameters")
	}

	// a must be negative (down-facing)
	const a = (y0 - k) / (h * h)
	if (!(a < 0)) {
		logger.error("invalid parabola shape", {
			a,
			vertexX: h,
			vertexY: k,
			yIntercept: y0
		})
		throw errors.new("invalid parabola shape")
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
				label: xAxis.label,
				min: xAxis.min,
				max: xAxis.max,
				tickInterval: xAxis.tickInterval,
				showGridLines: false,
				showTickLabels: xAxis.showTickLabels
			},
			yAxis: {
				label: yAxis.label,
				min: yAxis.min,
				max: yAxis.max,
				tickInterval: yAxis.tickInterval,
				showGridLines: yAxis.showGridLines,
				showTickLabels: yAxis.showTickLabels
			}
		},
		canvas
	)

	// Parabola curve content - clip to first quadrant (x >= 0, y >= 0)
	const steps = 200
	const parabolaPoints: Array<{ x: number; y: number }> = []
	for (let i = 0; i <= steps; i++) {
		const x = xAxis.min + (i / steps) * (xAxis.max - xAxis.min)
		const y = a * (x - h) * (x - h) + k
		if (x >= 0 && y >= 0) {
			parabolaPoints.push({ x: baseInfo.toSvgX(x), y: baseInfo.toSvgY(y) })
		}
	}

	// Draw parabola within the clipped region
	if (parabolaPoints.length > 0) {
		canvas.drawInClippedRegion((clippedCanvas) => {
			const dash = parabola.style === "dashed" ? "8 6" : undefined
			clippedCanvas.drawPolyline(parabolaPoints, {
				stroke: parabola.color,
				strokeWidth: 2.5,
				dash: dash
			})
		})
	}

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(AXIS_VIEWBOX_PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="12">${svgBody}</svg>`
}
