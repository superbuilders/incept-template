import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { abbreviateMonth } from "@/widgets/utils/labels"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"
import { theme } from "@/widgets/utils/theme"

function createCircleSchema() {
	return z
		.object({
			label: z
				.string()
				.describe(
					"Category name for this circle (e.g., 'Has a Dog', 'Likes Pizza', 'Students in Band', 'Even Numbers'). Keep concise to fit above circle. Plaintext only; no markdown or HTML."
				),
			count: z
				.number()
				.int()
				.min(0)
				.describe(
					"Number of items ONLY in this circle, excluding the intersection (e.g., 12, 8, 0). This is the exclusive (non-negative integer) count for this category alone."
				),
			color: z
				.string()
				.regex(
					CSS_COLOR_PATTERN,
					"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
				)
				.describe(
					"Hex-only fill color for this circle (e.g., '#FF6B6B', '#1E90FF', '#000000', '#00000080' for 50% alpha). Use translucency to show overlap."
				)
		})
		.strict()
}

// The main Zod schema for the vennDiagram function
export const VennDiagramPropsSchema = z
	.object({
		type: z
			.literal("vennDiagram")
			.describe(
				"Identifies this as a Venn diagram widget for visualizing set relationships and overlaps."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		circleA: createCircleSchema().describe(
			"Left circle representing the first category or set. The count is for items ONLY in A (not in B)."
		),
		circleB: createCircleSchema().describe(
			"Right circle representing the second category or set. The count is for items ONLY in B (not in A)."
		),
		intersectionCount: z
			.number()
			.int()
			.min(0)
			.describe(
				"Number of items in BOTH circles (A AND B intersection). Displayed in the overlapping region (e.g., 5, 15, 0). Non-negative integer."
			),
		outsideCount: z
			.number()
			.int()
			.min(0)
			.describe(
				"Number of items in NEITHER circle (outside both A and B). Displayed outside the circles (e.g., 3, 20, 0). Non-negative integer."
			)
	})
	.strict()
	.describe(
		"Creates a two-circle Venn diagram showing set relationships with counts in each region. Displays four distinct regions: only A, only B, both A and B (intersection), and neither. Perfect for teaching set theory, logical relationships, and data categorization. Circle colors should be translucent to show overlap clearly."
	)

export type VennDiagramProps = z.infer<typeof VennDiagramPropsSchema>

/**
 * This template generates a classic two-circle Venn diagram as an SVG graphic
 * to visually represent the relationship between two sets of data.
 */
export const generateVennDiagram: WidgetGenerator<
	typeof VennDiagramPropsSchema
> = async (data) => {
	const { width, height, circleA, circleB, intersectionCount, outsideCount } =
		data
	const padding = {
		top: PADDING * 2,
		bottom: PADDING * 2,
		horizontal: PADDING / 2
	}
	const chartHeight = height - padding.top - padding.bottom

	const r = Math.min(width / 4, chartHeight / 2.5) // Reduced radius for better spacing
	const overlap = r * 0.45 // 45% overlap for balanced spacing
	const cxA = width / 2 - r + overlap
	const cxB = width / 2 + r - overlap
	const cy = padding.top + chartHeight / 2

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 16,
		lineHeightDefault: 1.2
	})

	canvas.addStyle(
		".label { font-size: 16px; font-weight: bold; text-anchor: middle; } .count { font-size: 18px; text-anchor: middle; }"
	)

	// Draw containing box
	canvas.drawRect(1, 1, width - 2, height - 2, {
		fill: "none",
		stroke: theme.colors.axis
	})

	// Circles (semi-transparent for overlap visibility)
	canvas.drawCircle(cxA, cy, r, {
		fill: circleA.color,
		fillOpacity: theme.opacity.overlay,
		stroke: theme.colors.axis
	})
	canvas.drawCircle(cxB, cy, r, {
		fill: circleB.color,
		fillOpacity: theme.opacity.overlay,
		stroke: theme.colors.axis
	})

	// Labels for circles - positioned farther apart to use side space
	const labelA_X = cxA - r * 0.5
	const labelB_X = cxB + r * 0.5
	// Compute side-constrained max widths so labels never collide or bleed to edges
	const midX = (cxA + cxB) / 2
	const labelPaddingX = PADDING
	const leftHalfWidth = Math.max(
		0,
		Math.min(labelA_X - labelPaddingX, midX - labelA_X - labelPaddingX)
	)
	const rightHalfWidth = Math.max(
		0,
		Math.min(width - labelPaddingX - labelB_X, labelB_X - midX - labelPaddingX)
	)
	const labelA_MaxWidth = leftHalfWidth * 2
	const labelB_MaxWidth = rightHalfWidth * 2

	// Vertically center wrapped labels between the top of the diagram and the top of the circles
	const yTop = 1 // top border of the surrounding rect
	const yCircleTop = cy - r
	const midY = (yTop + yCircleTop) / 2
	const fontPx = 16
	const lineHeight = 1.2
	const labelAMeasure = estimateWrappedTextDimensions(
		abbreviateMonth(circleA.label),
		labelA_MaxWidth,
		fontPx,
		lineHeight
	)
	const labelBMeasure = estimateWrappedTextDimensions(
		abbreviateMonth(circleB.label),
		labelB_MaxWidth,
		fontPx,
		lineHeight
	)
	const labelA_Y = midY - (labelAMeasure.height - fontPx) / 2
	const labelB_Y = midY - (labelBMeasure.height - fontPx) / 2

	canvas.drawWrappedText({
		x: labelA_X,
		y: labelA_Y,
		text: abbreviateMonth(circleA.label),
		fontPx: fontPx,
		fontWeight: theme.font.weight.bold,
		anchor: "middle",
		maxWidthPx: labelA_MaxWidth
	})
	canvas.drawWrappedText({
		x: labelB_X,
		y: labelB_Y,
		text: abbreviateMonth(circleB.label),
		fontPx: fontPx,
		fontWeight: theme.font.weight.bold,
		anchor: "middle",
		maxWidthPx: labelB_MaxWidth
	})

	// Counts
	const countA_X = cxA - r / 2
	const countB_X = cxB + r / 2
	const intersection_X = (cxA + cxB) / 2
	const outside_X = width / 2

	// A only
	canvas.drawText({
		x: countA_X,
		y: cy,
		text: String(circleA.count),
		fontPx: 18,
		anchor: "middle",
		dominantBaseline: "middle"
	})
	// B only
	canvas.drawText({
		x: countB_X,
		y: cy,
		text: String(circleB.count),
		fontPx: 18,
		anchor: "middle",
		dominantBaseline: "middle"
	})
	// Intersection
	canvas.drawText({
		x: intersection_X,
		y: cy,
		text: String(intersectionCount),
		fontPx: 18,
		anchor: "middle",
		dominantBaseline: "middle"
	})
	// Outside
	canvas.drawText({
		x: outside_X,
		y: height - padding.bottom / 2,
		text: String(outsideCount),
		fontPx: 18,
		anchor: "middle"
	})

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
