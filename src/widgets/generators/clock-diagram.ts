import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

/**
 * Creates a diagram of an analog clock face showing a specific time.
 */
export const ClockDiagramPropsSchema = z
	.object({
		type: z.literal("clockDiagram"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		hour: z
			.number()
			.int()
			.min(1)
			.max(12)
			.describe(
				"The hour to display (1-12). The hour hand will be positioned accordingly."
			),
		minute: z
			.number()
			.int()
			.min(0)
			.max(59)
			.describe(
				"The minute to display (0-59). The minute hand will be positioned accordingly."
			)
	})
	.strict()

export type ClockDiagramProps = z.infer<typeof ClockDiagramPropsSchema>

/**
 * Generates an SVG diagram of an analog clock.
 */
export const generateClockDiagram: WidgetGenerator<
	typeof ClockDiagramPropsSchema
> = async (props) => {
	const { width, height, hour, minute } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const cx = width / 2
	const cy = height / 2
	const radius = Math.min(width, height) / 2 - PADDING

	// Outer circle (clock face)
	canvas.drawCircle(cx, cy, radius, {
		fill: theme.colors.background,
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.xxthick
	})

	// Minute and hour ticks
	for (let i = 1; i <= 60; i++) {
		const angle = (i / 60) * 2 * Math.PI - Math.PI / 2
		const isHourMark = i % 5 === 0
		const tickLength = isHourMark ? 12 : 6
		const startR = radius - tickLength
		const endR = radius
		const x1 = cx + startR * Math.cos(angle)
		const y1 = cy + startR * Math.sin(angle)
		const x2 = cx + endR * Math.cos(angle)
		const y2 = cy + endR * Math.sin(angle)
		canvas.drawLine(x1, y1, x2, y2, {
			stroke: theme.colors.black,
			strokeWidth: isHourMark ? 3 : 1.5
		})
	}

	// Hour numerals (push further inward so they do not overlap large hour ticks)
	for (let i = 1; i <= 12; i++) {
		const angle = (i / 12) * 2 * Math.PI - Math.PI / 2
		const hourTickLength = 12
		const numeralPadding = 16
		const numRadius = radius - hourTickLength - numeralPadding
		const x = cx + numRadius * Math.cos(angle)
		const y = cy + numRadius * Math.sin(angle)
		canvas.drawText({
			x,
			y,
			text: String(i),
			fontPx: Math.max(10, Math.floor(radius * 0.15)),
			fontWeight: theme.font.weight.bold,
			anchor: "middle",
			dominantBaseline: "middle"
		})
	}

	// Minute hand
	const minuteAngle = (minute / 60) * 2 * Math.PI - Math.PI / 2
	const minuteLen = radius * 0.66
	canvas.drawLine(
		cx,
		cy,
		cx + minuteLen * Math.cos(minuteAngle),
		cy + minuteLen * Math.sin(minuteAngle),
		{
			stroke: theme.colors.black,
			strokeWidth: 4,
			strokeLinecap: "round"
		}
	)

	// Hour hand (moves with minute)
	const hourAngle =
		((hour % 12) / 12 + minute / (12 * 60)) * 2 * Math.PI - Math.PI / 2
	const hourLen = radius * 0.38
	canvas.drawLine(
		cx,
		cy,
		cx + hourLen * Math.cos(hourAngle),
		cy + hourLen * Math.sin(hourAngle),
		{
			stroke: theme.colors.black,
			strokeWidth: 6,
			strokeLinecap: "round"
		}
	)

	// Center hub
	canvas.drawCircle(cx, cy, 6, { fill: theme.colors.black })

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
