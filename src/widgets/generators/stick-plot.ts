import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneBaseV2 } from "@/widgets/utils/coordinate-plane-utils"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { abbreviateMonth } from "@/widgets/utils/labels"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// A single vertical stick at an x-category with a height determined by y value
const StickSchema = z
	.object({
		xLabel: z
			.string()
			.describe(
				"Label for the position along the x-axis (e.g., isotope mass label)."
			),
		yValue: z
			.number()
			.nonnegative()
			.describe(
				"Height of the stick along the y-axis. Typically a percentage or count."
			),
		color: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe("Hex-only color for the stick stroke.")
	})
	.strict()

// Optional reference lines such as mean/average
const ReferenceLineSchema = z
	.object({
		xLabel: z
			.string()
			.describe("Category label at which to draw a vertical reference line."),
		label: z
			.string()
			.describe("Text to annotate near the reference line (e.g., 'Average')."),
		color: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe("Color of the reference line and label.")
	})
	.strict()

export const StickPlotPropsSchema = z
	.object({
		type: z.literal("stickPlot"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		title: z.string().describe("Main title displayed above the plot."),
		xAxis: z
			.object({
				label: z
					.string()
					.describe("Label for the horizontal axis (e.g., 'Atomic mass (u)')."),
				categories: z
					.array(z.string().min(1))
					.min(1)
					.describe(
						"Complete ordered list of category labels along the x-axis."
					),
				showGridLines: z
					.boolean()
					.describe("Whether to display vertical grid lines.")
			})
			.strict(),
		yAxis: z
			.object({
				label: z
					.string()
					.describe(
						"Label for the vertical axis (e.g., 'Relative abundance (%)')."
					),
				min: z.number().describe("Minimum numeric value on the y-axis."),
				max: z.number().describe("Maximum numeric value on the y-axis."),
				tickInterval: z
					.number()
					.positive()
					.describe("Spacing between y-axis ticks."),
				showGridLines: z
					.boolean()
					.describe("Whether to display horizontal grid lines.")
			})
			.strict(),
		sticks: z.array(StickSchema),
		stickWidthPx: z.number().positive(),
		references: z.array(ReferenceLineSchema)
	})
	.strict()
	.describe(
		"Renders a categorical stick plot (mass spectrum-like). Each category can have a vertical 'stick' whose height represents an abundance or count."
	)

export type StickPlotProps = z.infer<typeof StickPlotPropsSchema>

export const generateStickPlot: WidgetGenerator<
	typeof StickPlotPropsSchema
> = async (props) => {
	const {
		width,
		height,
		title,
		xAxis,
		yAxis,
		sticks,
		stickWidthPx,
		references
	} = props

	// Validate that all sticks map to known categories and values are within range
	const categoryToIndex = new Map<string, number>()
	for (const [i, c] of xAxis.categories.entries()) {
		categoryToIndex.set(c, i)
	}
	for (const s of sticks) {
		if (!categoryToIndex.has(s.xLabel)) {
			logger.error("stick xLabel missing from categories", { xLabel: s.xLabel })
			throw errors.new("stick plot: xLabel must exist in xAxis.categories")
		}
		if (s.yValue < yAxis.min || s.yValue > yAxis.max) {
			logger.error("stick yValue out of bounds", {
				y: s.yValue,
				min: yAxis.min,
				max: yAxis.max
			})
			throw errors.new("stick plot: yValue out of y-axis bounds")
		}
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Use categoryBand for x, numeric for y
	const baseInfo = setupCoordinatePlaneBaseV2(
		{
			width,
			height,
			title,
			xAxis: {
				xScaleType: "categoryBand",
				label: xAxis.label,
				categories: xAxis.categories.map((c) => abbreviateMonth(c)),
				showTickLabels: true,
				showGridLines: xAxis.showGridLines
			},
			yAxis: {
				label: yAxis.label,
				min: yAxis.min,
				max: yAxis.max,
				tickInterval: yAxis.tickInterval,
				showTickLabels: true,
				showGridLines: yAxis.showGridLines
			}
		},
		canvas
	)

	// Render sticks within clipped chart area
	const bandWidth = baseInfo.bandWidth
	if (bandWidth === undefined) {
		logger.error("stick plot requires bandWidth for categorical x-axis", {
			categoriesCount: xAxis.categories.length
		})
		throw errors.new("stick plot: missing bandWidth for categorical x-axis")
	}

	const halfStick = Math.min(stickWidthPx, Math.max(1, bandWidth * 0.9)) / 2

	canvas.drawInClippedRegion((clippedCanvas) => {
		for (const s of sticks) {
			const i = categoryToIndex.get(s.xLabel)
			if (i === undefined) continue
			const cx = baseInfo.toSvgX(i)
			const yBottom = baseInfo.toSvgY(Math.max(yAxis.min, 0))
			const yTop = baseInfo.toSvgY(s.yValue)

			// Draw vertical line as the stick
			clippedCanvas.drawLine(cx, yBottom, cx, yTop, {
				stroke: s.color,
				strokeWidth: stickWidthPx
			})

			// Cap marker at the top for clarity
			clippedCanvas.drawLine(cx - halfStick, yTop, cx + halfStick, yTop, {
				stroke: s.color,
				strokeWidth: Math.max(1, stickWidthPx - 1)
			})
		}
	})

	// Optional reference lines at categories
	for (const ref of references) {
		const idx = categoryToIndex.get(ref.xLabel)
		if (idx === undefined) {
			logger.error("reference xLabel missing from categories", {
				xLabel: ref.xLabel
			})
			throw errors.new(
				"stick plot: reference xLabel must exist in xAxis.categories"
			)
		}
		const x = baseInfo.toSvgX(idx)
		canvas.drawLine(
			x,
			baseInfo.chartArea.top,
			x,
			baseInfo.chartArea.top + baseInfo.chartArea.height,
			{
				stroke: ref.color,
				strokeWidth: theme.stroke.width.thin
			}
		)
		canvas.drawText({
			x: x + 4,
			y: baseInfo.chartArea.top + 12,
			text: abbreviateMonth(ref.label),
			fill: ref.color,
			anchor: "start"
		})
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(AXIS_VIEWBOX_PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
