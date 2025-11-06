import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import {
	createAxisOptionsSchema,
	createPlotPointSchema,
	createPolygonSchema,
	renderPoints,
	renderPolygons
} from "@/widgets/utils/canvas-utils"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneV2 } from "@/widgets/utils/coordinate-plane-v2"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const PolygonGraphPropsSchema = z
	.object({
		type: z
			.literal("polygonGraph")
			.describe(
				"Identifies this as a polygon graph for drawing shapes on a coordinate plane."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		xAxis: createAxisOptionsSchema().describe(
			"Configuration for the horizontal x-axis including range, tick marks, labels, and optional grid lines."
		),
		yAxis: createAxisOptionsSchema().describe(
			"Configuration for the vertical y-axis including range, tick marks, labels, and optional grid lines."
		),
		showQuadrantLabels: z
			.boolean()
			.describe(
				"Whether to display Roman numerals (I, II, III, IV) in each quadrant. Helps with quadrant identification."
			),
		points: z
			.array(createPlotPointSchema())
			.describe(
				"Labeled points that can be referenced by polygons. Each point has an ID for polygon vertex references. Can include standalone points."
			),
		polygons: z
			.array(createPolygonSchema())
			.describe(
				"Polygons defined by referencing point IDs. Can be closed shapes or open polylines. Fill colors MUST include transparency (e.g., #11accd26, rgba(17,172,205,0.15)) to avoid obscuring grid lines. Empty array shows just points."
			)
	})
	.strict()
	.describe(
		"Creates a coordinate plane for drawing polygons and polylines by connecting named points. Points are defined once and can be reused in multiple polygons. Supports both closed shapes (triangles, quadrilaterals) and open paths. Perfect for coordinate geometry, transformations, and exploring properties of shapes on the coordinate plane."
	)

export type PolygonGraphProps = z.infer<typeof PolygonGraphPropsSchema>

export const generatePolygonGraph: WidgetGenerator<
	typeof PolygonGraphPropsSchema
> = async (props) => {
	const { width, height, xAxis, yAxis, showQuadrantLabels, points, polygons } =
		props

	// 1. Call the base generator and get the body content and extents object
	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const baseInfo = setupCoordinatePlaneV2(
		{
			width,
			height,
			xAxis: {
				label: xAxis.label,
				min: xAxis.min,
				max: xAxis.max,
				tickInterval: xAxis.tickInterval,
				showGridLines: xAxis.showGridLines
			},
			yAxis: {
				label: yAxis.label,
				min: yAxis.min,
				max: yAxis.max,
				tickInterval: yAxis.tickInterval,
				showGridLines: yAxis.showGridLines
			},
			showQuadrantLabels: showQuadrantLabels
		},
		canvas
	)

	// Create point map for ID resolution
	const pointMap = new Map(points.map((pt) => [pt.id, pt]))

	// Render elements using Canvas API
	renderPolygons(polygons, pointMap, baseInfo.toSvgX, baseInfo.toSvgY, canvas)
	renderPoints(points, baseInfo.toSvgX, baseInfo.toSvgY, canvas)

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(AXIS_VIEWBOX_PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
