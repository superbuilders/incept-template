import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

/**
 * Creates a diagram of a wheel with spokes and optionally shaded contiguous sectors.
 */
export const WheelDiagramPropsSchema = z
	.object({
		type: z.literal("wheelDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		spokeCount: z
			.number()
			.int()
			.positive()
			.describe("Total number of spokes (number of equal sectors)."),
		shadedSectorCount: z
			.number()
			.int()
			.min(0)
			.describe(
				"Number of contiguous sectors to shade from the top (12 o'clock)."
			),
		shadeColor: z
			.string()
			.regex(CSS_COLOR_PATTERN, "invalid css color")
			.describe("CSS color for shaded sectors.")
	})
	.strict()

export type WheelDiagramProps = z.infer<typeof WheelDiagramPropsSchema>

export const generateWheelDiagram: WidgetGenerator<
	typeof WheelDiagramPropsSchema
> = async (props) => {
	const { width, height, spokeCount, shadedSectorCount, shadeColor } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const cx = width / 2
	const cy = height / 2
	const outerRadius = Math.min(width, height) / 2 - PADDING
	const hubRadius = Math.max(8, Math.floor(outerRadius * 0.2))
	const tireThickness = Math.max(4, Math.floor(outerRadius * 0.1))

	// Tire (outer ring)
	canvas.drawCircle(cx, cy, outerRadius, {
		fill: theme.colors.black,
		stroke: "none"
	})
	canvas.drawCircle(cx, cy, outerRadius - tireThickness, {
		fill: theme.colors.background,
		stroke: "none"
	})

	const angleStep = (2 * Math.PI) / spokeCount
	// Colored sectors extend only halfway out from the center
	const shadeOuterRadius = Math.max(
		hubRadius + 1,
		Math.floor(outerRadius * 0.5)
	)

	// Shaded sectors from 12 o'clock clockwise
	if (shadedSectorCount > 0) {
		for (let i = 0; i < shadedSectorCount; i++) {
			const startAngle = -Math.PI / 2 + i * angleStep
			const endAngle = startAngle + angleStep

			const path = new Path2D()
				.moveTo(
					cx + hubRadius * Math.cos(startAngle),
					cy + hubRadius * Math.sin(startAngle)
				)
				.lineTo(
					cx + shadeOuterRadius * Math.cos(startAngle),
					cy + shadeOuterRadius * Math.sin(startAngle)
				)
				.arcTo(
					shadeOuterRadius,
					shadeOuterRadius,
					0,
					0,
					1,
					cx + shadeOuterRadius * Math.cos(endAngle),
					cy + shadeOuterRadius * Math.sin(endAngle)
				)
				.lineTo(
					cx + hubRadius * Math.cos(endAngle),
					cy + hubRadius * Math.sin(endAngle)
				)
				.arcTo(
					hubRadius,
					hubRadius,
					0,
					0,
					0,
					cx + hubRadius * Math.cos(startAngle),
					cy + hubRadius * Math.sin(startAngle)
				)
				.closePath()

			canvas.drawPath(path, { fill: shadeColor, stroke: "none" })
		}
	}

	// Spokes
	for (let i = 0; i < spokeCount; i++) {
		const angle = i * angleStep - Math.PI / 2
		const x1 = cx + hubRadius * Math.cos(angle)
		const y1 = cy + hubRadius * Math.sin(angle)
		const x2 = cx + outerRadius * Math.cos(angle)
		const y2 = cy + outerRadius * Math.sin(angle)
		canvas.drawLine(x1, y1, x2, y2, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.base
		})
	}

	// Hub
	canvas.drawCircle(cx, cy, hubRadius, {
		fill: theme.colors.textSecondary,
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.base
	})

	// Draw the outer wheel line LAST so it sits above spokes and shaded sectors
	canvas.drawCircle(cx, cy, outerRadius, {
		fill: "none",
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.xxthick
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
