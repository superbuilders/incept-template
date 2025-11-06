import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { theme } from "@/widgets/utils/theme"

// Defines the properties for the Free Body Diagram widget.
export const FreeBodyDiagramPropsSchema = z
	.object({
		type: z.literal("freeBodyDiagram"),
		top: z
			.string()
			.nullable()
			.describe(
				"Name of the upward force (e.g., 'Normal', 'Lift', 'Buoyant'). Null = no arrow, empty string = arrow without label, string = arrow with the provided label."
			),
		bottom: z
			.string()
			.nullable()
			.describe(
				"Name of the downward force (e.g., 'Gravity', 'Weight'). Null = no arrow, empty string = arrow without label, string = arrow with the provided label."
			),
		left: z
			.string()
			.nullable()
			.describe(
				"Name of the leftward force (e.g., 'Friction', 'Drag', 'Tension'). Null = no arrow, empty string = arrow without label, string = arrow with the provided label."
			),
		right: z
			.string()
			.nullable()
			.describe(
				"Name of the rightward force (e.g., 'Applied', 'Thrust', 'Push'). Null = no arrow, empty string = arrow without label, string = arrow with the provided label."
			)
	})
	.strict()
	.describe(
		"Creates a free-body diagram with a central block and up to four force vectors. Provide ONLY the force name (e.g., 'Normal', 'Gravity'). A separate process will handle formatting it into F_Normal notation. Null = no arrow, empty string = arrow only, string value = arrow with the provided plain text label."
	)

export type FreeBodyDiagramProps = z.infer<typeof FreeBodyDiagramPropsSchema>

/**
 * Helper function to ensure force labels always end with "Force"
 * If the label already contains "force" (case-insensitive), it returns as-is
 * Otherwise, it appends " Force" to the label
 */
const ensureForceLabel = (label: string): string => {
	// Check if "force" already exists in the label (case-insensitive)
	if (label.toLowerCase().includes("force")) {
		return label
	}
	// Append " Force" to the label
	return `${label} Force`
}

/**
 * Generates an SVG of a free-body diagram using the Canvas utility.
 * It conditionally renders force arrows and labels based on the provided props.
 * The labels are rendered as plain text with "Force" appended if not present.
 *
 * Note: Force labels are rendered as plain text here.
 * The client-side rendering process will transform these
 * into proper physics notation (F_subscript) using MathML.
 */
export const generateFreeBodyDiagram: WidgetGenerator<
	typeof FreeBodyDiagramPropsSchema
> = async (props) => {
	// Normalize string "null" or whitespace-only labels to actual null (no arrow)
	const normalize = (val: string | null): string | null => {
		if (val === null) return null
		const trimmed = val.trim()
		if (trimmed === "" || trimmed.toLowerCase() === "null") return null
		return val
	}

	const normalizedProps = {
		...props,
		top: normalize(props.top),
		bottom: normalize(props.bottom),
		left: normalize(props.left),
		right: normalize(props.right)
	}
	const width = 700
	const height = 700

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 24, // Increased font size for better visibility
		lineHeightDefault: 1.2
	})

	// Central Box
	canvas.drawRect(206.28, 210.71, 286.33, 276.85, {
		stroke: theme.colors.black,
		strokeWidth: 8,
		fill: "none" // Explicitly no fill
	})

	// Top Arrow
	if (normalizedProps.top !== null) {
		canvas.drawLine(349.45, 210.71, 349.69, 51.81, {
			stroke: theme.colors.black,
			strokeWidth: 8
		})
		canvas.drawPolygon(
			[
				{ x: 362.9, y: 51.83 },
				{ x: 349.75, y: 15.51 },
				{ x: 336.49, y: 51.79 }
			],
			{ fill: theme.colors.black, stroke: theme.colors.black, strokeWidth: 8 }
		)
		if (normalizedProps.top) {
			// Position label to the right of the arrow, left-aligned to prevent overflow
			const label = ensureForceLabel(normalizedProps.top)
			canvas.drawText({
				x: 380,
				y: 100,
				text: label,
				anchor: "start",
				dominantBaseline: "middle"
			})
		}
	}

	// Bottom Arrow
	if (normalizedProps.bottom !== null) {
		canvas.drawLine(349.45, 487.56, 349.45, 648.19, {
			stroke: theme.colors.black,
			strokeWidth: 8
		})
		canvas.drawPolygon(
			[
				{ x: 336.23, y: 648.19 },
				{ x: 349.44, y: 684.49 },
				{ x: 362.65, y: 648.19 }
			],
			{ fill: theme.colors.black, stroke: theme.colors.black, strokeWidth: 8 }
		)
		if (normalizedProps.bottom) {
			// Position label to the right of the arrow, left-aligned to prevent overflow
			const label = ensureForceLabel(normalizedProps.bottom)
			canvas.drawText({
				x: 380,
				y: 600,
				text: label,
				anchor: "start",
				dominantBaseline: "middle"
			})
		}
	}

	// Left Arrow
	if (normalizedProps.left !== null) {
		canvas.drawLine(207.38, 349.13, 52.61, 348.48, {
			stroke: theme.colors.black,
			strokeWidth: 8
		})
		canvas.drawPolygon(
			[
				{ x: 52.67, y: 335.27 },
				{ x: 16.31, y: 348.33 },
				{ x: 52.56, y: 361.7 }
			],
			{ fill: theme.colors.black, stroke: theme.colors.black, strokeWidth: 8 }
		)
		if (normalizedProps.left) {
			// Position label above the arrow, centered but close to arrow tip
			const label = ensureForceLabel(normalizedProps.left)
			canvas.drawText({
				x: 100,
				y: 320,
				text: label,
				anchor: "middle",
				dominantBaseline: "baseline"
			})
		}
	}

	// Right Arrow
	if (normalizedProps.right !== null) {
		canvas.drawLine(492.61, 349.13, 647.38, 348.48, {
			stroke: theme.colors.black,
			strokeWidth: 8
		})
		canvas.drawPolygon(
			[
				{ x: 647.44, y: 361.7 },
				{ x: 683.69, y: 348.33 },
				{ x: 647.33, y: 335.27 }
			],
			{ fill: theme.colors.black, stroke: theme.colors.black, strokeWidth: 8 }
		)
		if (normalizedProps.right) {
			// Position label above the arrow; wrap if it would clash with the box
			const label = ensureForceLabel(normalizedProps.right)
			const fontPx = 24
			const averageCharWidth = fontPx * 0.6 // matches CanvasImpl heuristic
			const estimatedWidth = label.length * averageCharWidth
			const labelCenterX = 600
			const boxRightX = 206.28 + 286.33 // = 492.61
			const safetyMargin = 8
			const allowedHalfWidth = labelCenterX - (boxRightX + safetyMargin)
			const allowedFullWidth = Math.max(0, allowedHalfWidth * 2)

			if (estimatedWidth > allowedFullWidth && allowedFullWidth > 0) {
				// Wrap centered, and nudge up slightly to avoid the arrow
				canvas.drawText({
					x: labelCenterX,
					y: 310,
					text: label,
					anchor: "middle",
					dominantBaseline: "baseline",
					maxWidth: allowedFullWidth,
					lineHeight: 1.2
				})
			} else {
				canvas.drawText({
					x: labelCenterX,
					y: 320,
					text: label,
					anchor: "middle",
					dominantBaseline: "baseline"
				})
			}
		}
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)

	return `<svg width="320" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}">${svgBody}</svg>`
}
