import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

export const QuadrantDiagramPropsSchema = z
	.object({
		type: z.literal("quadrantDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema()
	})
	.strict()
	.describe(
		"Generates a basic quadrant diagram with labeled axes (x and y) and labeled quadrants (I, II, III, IV)."
	)

export type QuadrantDiagramProps = z.infer<typeof QuadrantDiagramPropsSchema>

export const generateQuadrantDiagram: WidgetGenerator<
	typeof QuadrantDiagramPropsSchema
> = async (props) => {
	const { width, height } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 16,
		lineHeightDefault: 1.2
	})

	const cx = width / 2
	const cy = height / 2

	// Add arrow marker definition
	canvas.addDef(
		`<marker id="quadrant-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.colors.black}"/></marker>`
	)

	// Draw X and Y axes
	canvas.drawLine(PADDING, cy, width - PADDING, cy, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick,
		markerEnd: "url(#quadrant-arrow)",
		markerStart: "url(#quadrant-arrow)"
	})
	canvas.drawLine(cx, PADDING, cx, height - PADDING, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick,
		markerEnd: "url(#quadrant-arrow)",
		markerStart: "url(#quadrant-arrow)"
	})

	// Label axes
	canvas.drawText({
		x: width - PADDING + 10,
		y: cy,
		text: "x",
		anchor: "start",
		dominantBaseline: "middle",
		fontPx: 18
	})
	canvas.drawText({
		x: cx,
		y: PADDING - 10,
		text: "y",
		anchor: "middle",
		dominantBaseline: "baseline",
		fontPx: 18
	})

	// Label quadrants
	const quadrantPadding = 20
	const labelOptions = {
		fontPx: 16,
		fill: theme.colors.text
	}

	// Quadrant I (top-right)
	canvas.drawText({
		x: cx + quadrantPadding,
		y: cy - quadrantPadding,
		text: "Quadrant I",
		anchor: "start",
		dominantBaseline: "baseline",
		...labelOptions
	})

	// Quadrant II (top-left)
	canvas.drawText({
		x: cx - quadrantPadding,
		y: cy - quadrantPadding,
		text: "Quadrant II",
		anchor: "end",
		dominantBaseline: "baseline",
		...labelOptions
	})

	// Quadrant III (bottom-left)
	canvas.drawText({
		x: cx - quadrantPadding,
		y: cy + quadrantPadding,
		text: "Quadrant III",
		anchor: "end",
		dominantBaseline: "middle",
		...labelOptions
	})

	// Quadrant IV (bottom-right)
	canvas.drawText({
		x: cx + quadrantPadding,
		y: cy + quadrantPadding,
		text: "Quadrant IV",
		anchor: "start",
		dominantBaseline: "middle",
		...labelOptions
	})

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
