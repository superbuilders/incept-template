import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { theme } from "@/widgets/utils/theme"

// Factory for a color group of marbles schema (avoids pointer reuse/$ref)
const createMarbleColorGroupSchema = () =>
	z
		.object({
			color: z
				.string()
				.regex(CSS_COLOR_PATTERN, "invalid css color")
				.describe(
					"CSS color for the marbles in this group (e.g., '#5B8DEF', 'red', 'rgba(208,2,27,1)')"
				),
			count: z
				.number()
				.int()
				.positive()
				.describe("Number of marbles in this color group (positive integer).")
		})
		.strict()

export const MarbleDiagramPropsSchema = z
	.object({
		type: z.literal("marbleDiagram"),
		groups: z
			.array(createMarbleColorGroupSchema())
			.min(1)
			.describe(
				"Array of color groups. Each group defines a CSS color and a positive count. Supports two or more groups."
			)
	})
	.strict()
	.describe(
		"Displays a bag/jar of marbles packed randomly, grouped by color. Supports multiple color groups with positive counts."
	)

export type MarbleDiagramProps = z.infer<typeof MarbleDiagramPropsSchema>

export const generateMarbleDiagram: WidgetGenerator<
	typeof MarbleDiagramPropsSchema
> = async (props) => {
	const { groups } = props
	const total = groups.reduce((sum, g) => sum + g.count, 0)
	if (total === 0) {
		return `<svg width="100" height="50" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" />`
	}

	// Fixed visual parameters for consistency
	const radius = 24
	const diameter = radius * 2
	const stroke = "#000000"
	const strokeWidth = 2
	const padding = 10
	const clearance = 6 // extra spacing so circles do not visually touch
	const minDist = diameter + clearance

	// Start with a generous square canvas so random packing succeeds
	const sideCount = Math.ceil(Math.sqrt(total)) + 2
	let width = padding * 2 + sideCount * minDist
	let height = padding * 2 + sideCount * minDist

	const innerLeft = padding + radius
	let innerRight = width - padding - radius
	const innerTop = padding + radius
	let innerBottom = height - padding - radius

	// Build color list from groups and shuffle deterministically via Math.random
	const colors: string[] = []
	for (const g of groups) {
		for (let i = 0; i < g.count; i++) {
			colors.push(g.color)
		}
	}
	for (let i = colors.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const t = colors[i]
		colors[i] = colors[j]
		colors[j] = t
	}

	type Pt = { x: number; y: number; fill: string }
	const placed: Pt[] = []

	function dist2(
		a: { x: number; y: number },
		b: { x: number; y: number }
	): number {
		const dx = a.x - b.x
		const dy = a.y - b.y
		return dx * dx + dy * dy
	}

	let requiredDist2 = minDist * minDist
	for (const fill of colors) {
		let attempts = 0
		const maxAttemptsPerMarble = 800
		let placedThis = false
		while (!placedThis) {
			const x = innerLeft + Math.random() * (innerRight - innerLeft)
			const y = innerTop + Math.random() * (innerBottom - innerTop)
			let ok = true
			for (let k = 0; k < placed.length; k++) {
				const p = placed[k]
				if (!p) continue
				if (dist2({ x, y }, p) < requiredDist2) {
					ok = false
					break
				}
			}
			if (ok) {
				placed.push({ x, y, fill })
				placedThis = true
				break
			}
			attempts++
			if (attempts >= maxAttemptsPerMarble) {
				// Expand the canvas deterministically to create more space
				height += minDist
				innerBottom = height - padding - radius
				attempts = 0
			}
		}
	}

	const circles = placed
		.map(
			(p) =>
				`<circle cx="${p.x}" cy="${p.y}" r="${radius}" fill="${p.fill}" stroke="${stroke}" stroke-width="${strokeWidth}" />`
		)
		.join("\n  ")

	return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">
	${circles}
</svg>`
}
