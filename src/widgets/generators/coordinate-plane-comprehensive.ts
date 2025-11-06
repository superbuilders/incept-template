import * as errors from "@superbuilders/errors"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import {
	createAxisOptionsSchema,
	createDistanceSchema,
	createLineSchema,
	createPlotPointSchema,
	createPolygonSchema,
	createPolylineSchema,
	renderDistances,
	renderLines,
	renderPoints,
	renderPolygons,
	renderPolylines
} from "@/widgets/utils/canvas-utils"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneV2 } from "@/widgets/utils/coordinate-plane-v2"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const ErrInvalidDimensions = errors.new("invalid dimensions")

export const CoordinatePlaneComprehensivePropsSchema = z
	.object({
		type: z
			.literal("coordinatePlane")
			.describe(
				"Identifies this as a comprehensive coordinate plane widget with full geometric features."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		xAxis: createAxisOptionsSchema().describe(
			"Configuration for the horizontal x-axis including range, tick marks, and grid lines. Defines the visible domain of the plane."
		),
		yAxis: createAxisOptionsSchema().describe(
			"Configuration for the vertical y-axis including range, tick marks, and grid lines. Defines the visible range of the plane."
		),
		showQuadrantLabels: z
			.boolean()
			.describe(
				"Whether to display Roman numeral labels (I, II, III, IV) in each quadrant. True helps students identify quadrant locations."
			),
		points: z
			.array(createPlotPointSchema())
			.describe(
				"Array of individual points to plot. Empty array means no points. Points are rendered last (on top). Each point can have a label and custom style."
			),
		lines: z
			.array(createLineSchema())
			.describe(
				"Array of infinite lines defined by slope-intercept or two points. Empty array means no lines. Lines extend to plane boundaries."
			),
		polygons: z
			.array(createPolygonSchema())
			.describe(
				"Array of closed polygons defined by vertices. Empty array means no polygons. Rendered first (bottom layer) with optional fill colors."
			),
		distances: z
			.array(createDistanceSchema())
			.describe(
				"Array of distance measurements between point pairs. Empty array means no distances. Shows horizontal/vertical legs and diagonal with labels."
			),
		polylines: z
			.array(createPolylineSchema())
			.describe(
				"Array of connected line segments (open paths). Empty array means no polylines. Useful for functions, paths, or partial shapes."
			)
	})
	.strict()
	.describe(
		"Creates a full-featured Cartesian coordinate plane supporting points, lines, polygons, distances, and polylines. Essential for graphing, geometry, and coordinate geometry lessons. Renders elements in layers: polygons (bottom) → distances → lines → polylines → points (top)."
	)

export type CoordinatePlaneComprehensiveProps = z.infer<
	typeof CoordinatePlaneComprehensivePropsSchema
>

// Error constant defined above

/**
 * Generates a versatile Cartesian coordinate plane for plotting points, lines, and polygons.
 * Supports a wide range of coordinate geometry problems with perfect feature parity to the original coordinate-plane.ts.
 *
 * This implementation uses modular components but achieves identical functionality including:
 * - Point ID referencing system for polygons and distances
 * - All three line equation types (slope-intercept, standard, point-slope)
 * - Open/closed polygon support
 * - Full distance triangle visualization
 * - Polyline function plotting
 */
export const generateCoordinatePlaneComprehensive: WidgetGenerator<
	typeof CoordinatePlaneComprehensivePropsSchema
> = async (props) => {
	const {
		width,
		height,
		xAxis,
		yAxis,
		showQuadrantLabels,
		points,
		lines,
		polygons,
		distances,
		polylines
	} = props

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

	// 2. Separate clipped geometry from unclipped elements
	// const clippedContent = "" // Unused variable
	// const unclippedContent = "" // Unused variable

	// Render all elements using Canvas API
	// Render clipped geometry
	if (polygons.length > 0) {
		renderPolygons(polygons, pointMap, baseInfo.toSvgX, baseInfo.toSvgY, canvas)
	}
	if (lines.length > 0) {
		renderLines(lines, xAxis, yAxis, baseInfo.toSvgX, baseInfo.toSvgY, canvas)
	}
	if (polylines.length > 0) {
		renderPolylines(polylines, baseInfo.toSvgX, baseInfo.toSvgY, canvas)
	}

	// Render unclipped points and distances on the main canvas
	if (points.length > 0) {
		renderPoints(points, baseInfo.toSvgX, baseInfo.toSvgY, canvas)
	}
	if (distances.length > 0) {
		renderDistances(
			distances,
			pointMap,
			baseInfo.toSvgX,
			baseInfo.toSvgY,
			canvas
		)
	}

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
