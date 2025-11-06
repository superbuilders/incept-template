import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { Path2D } from "@/widgets/utils/path-builder"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Defines a group of identical sectors on the spinner
const ProbabilitySpinnerSectorGroupSchema = z
	.object({
		count: z
			.number()
			.int()
			.positive()
			.describe(
				"Number of equal sectors in this group (e.g., 3, 5, 1). All sectors in a group share the same color and emoji. Must be positive integer."
			),
		emoji: z
			.string()
			.nullable()
			.transform((val) => (val === "null" || val === "NULL" ? null : val))
			.describe(
				"Emoji to display in each sector of this group (e.g., '⭐', '🎯', '❌', null). Null means no emoji, just colored sector. Single emoji recommended."
			),
		color: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA)"
			)
			.describe(
				"Hex-only color for all sectors in this group (e.g., '#FF6B6B', '#1E90FF', '#000000', '#00000080' for 50% alpha). Each group should have distinct color."
			)
	})
	.strict()

// The main Zod schema for the probabilitySpinner function
export const ProbabilitySpinnerPropsSchema = z
	.object({
		type: z
			.literal("probabilitySpinner")
			.describe(
				"Identifies this as a probability spinner widget for demonstrating random events and likelihood."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		groups: z
			.array(ProbabilitySpinnerSectorGroupSchema)
			.describe(
				"Array of sector groups defining the spinner. Total sectors = sum of all counts. Order affects color assignment. Empty array creates blank spinner."
			),
		pointerAngle: z
			.number()
			.describe(
				"Angle in degrees where the arrow points (0 = right, 90 = up, 180 = left, 270 = down). Can be any value; wraps around 360. Determines 'current' sector."
			),
		title: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Title displayed above the spinner (e.g., 'Spin the Wheel!', 'Color Spinner', null). Null means no title. Keep concise for space. Plaintext only; no markdown or HTML."
			)
	})
	.strict()
	.describe(
		"Creates a circular spinner divided into colored sectors for probability experiments. Each sector group can have multiple equal sectors with the same appearance. Perfect for teaching probability, likelihood, and random events. The pointer indicates the 'selected' outcome."
	)

export type ProbabilitySpinnerProps = z.infer<
	typeof ProbabilitySpinnerPropsSchema
>

/**
 * Generates an SVG diagram of a probability spinner.
 * Ideal for visualizing theoretical probability problems.
 */
export const generateProbabilitySpinner: WidgetGenerator<
	typeof ProbabilitySpinnerPropsSchema
> = async (props) => {
	const { width, height, groups, pointerAngle, title } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const cx = width / 2
	const cy = height / 2
	const padding = title !== null ? PADDING + 15 : PADDING
	const radius = Math.min(width, height) / 2 - padding

	const totalSectors = groups.reduce((sum, group) => sum + group.count, 0)
	if (totalSectors === 0) {
		return `<svg width="${width}" height="${height}" />`
	}
	const anglePerSector = 360 / totalSectors

	const toRad = (deg: number) => (deg * Math.PI) / 180
	const pointOnCircle = (angleDeg: number, r: number) => ({
		x: cx + r * Math.cos(toRad(angleDeg)),
		y: cy + r * Math.sin(toRad(angleDeg))
	})

	canvas.addStyle(
		".title { font-size: 16px; font-weight: bold; text-anchor: middle; }"
	)

	if (title !== null) {
		canvas.drawText({
			x: cx,
			y: padding - 10,
			text: title,
			fontPx: 16,
			fontWeight: theme.font.weight.bold,
			anchor: "middle"
		})
	}

	// 1. Draw Sectors and Emojis
	let currentAngle = -90 // Start at the top

	for (const group of groups) {
		for (let i = 0; i < group.count; i++) {
			const startAngle = currentAngle
			const endAngle = currentAngle + anglePerSector

			const start = pointOnCircle(startAngle, radius)
			const end = pointOnCircle(endAngle, radius)

			// Create the path for the pie slice
			const largeArcFlag: 0 | 1 = anglePerSector > 180 ? 1 : 0
			const sectorPath = new Path2D()
				.moveTo(cx, cy)
				.lineTo(start.x, start.y)
				.arcTo(radius, radius, 0, largeArcFlag, 1, end.x, end.y)
				.closePath()
			canvas.drawPath(sectorPath, {
				fill: group.color,
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base
			})

			// Add emoji if it exists
			if (group.emoji !== null) {
				const midAngle = startAngle + anglePerSector / 2
				const emojiPos = pointOnCircle(midAngle, radius * 0.65)
				const emojiSize = Math.min(radius / totalSectors, 30) * 1.5 // Scale emoji size
				canvas.drawText({
					x: emojiPos.x,
					y: emojiPos.y,
					text: group.emoji,
					fontPx: emojiSize,
					anchor: "middle",
					dominantBaseline: "middle"
				})
			}

			currentAngle += anglePerSector
		}
	}

	// 2. Draw Spinner Pointer and Hub
	const pointerWidth = 12
	const pointerLength = radius * 1.2

	// Use withTransform for the rotated pointer
	canvas.withTransform(`rotate(${pointerAngle}, ${cx}, ${cy})`, () => {
		// A polygon for a nice arrow shape
		const pointerPoints = [
			{ x: cx, y: cy - pointerWidth / 2 },
			{ x: cx + pointerLength - pointerWidth, y: cy - pointerWidth / 2 },
			{ x: cx + pointerLength - pointerWidth, y: cy - pointerWidth },
			{ x: cx + pointerLength, y: cy },
			{ x: cx + pointerLength - pointerWidth, y: cy + pointerWidth },
			{ x: cx + pointerLength - pointerWidth, y: cy + pointerWidth / 2 },
			{ x: cx, y: cy + pointerWidth / 2 }
		]
		canvas.drawPolygon(pointerPoints, {
			fill: theme.colors.textSecondary,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.thin
		})
	})

	// Central hub
	canvas.drawCircle(cx, cy, pointerWidth, {
		fill: theme.colors.background,
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.thick
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
