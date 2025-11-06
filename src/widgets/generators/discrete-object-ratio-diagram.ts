import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { drawChartTitle } from "@/widgets/utils/chart-layout-utils"
// PADDING intentionally unused; this widget uses tighter padding for visuals.
import { abbreviateMonth } from "@/widgets/utils/labels"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// Defines a type of object to be rendered
const ObjectTypeSchema = z
	.object({
		count: z
			.number()
			.int()
			.describe(
				"Number of objects of this type to display. Must be non-negative integer (e.g., 5, 12, 0). Zero means this type is absent."
			),
		emoji: z
			.string()
			.describe(
				"The emoji character representing this object type (e.g., '🍎' for apple, '🍊' for orange, '🐶' for dog). Should be a single emoji for clarity."
			)
	})
	.strict()

// The main Zod schema for the discreteObjectRatioDiagram function
// Single, simple API: always renders one row per object type from top to bottom.
export const DiscreteObjectRatioDiagramPropsSchema = z
	.object({
		type: z
			.literal("discreteObjectRatioDiagram")
			.describe(
				"Identifies this as a discrete object ratio diagram for visualizing ratios with countable objects."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		objects: z
			.array(ObjectTypeSchema)
			.min(1)
			.describe(
				"Array of object types with their counts. Each type uses a different emoji. One or more types required."
			),
		title: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Title displayed above the diagram (e.g., 'Fruit Basket Contents', null). Null means no title. Plaintext only; no markdown/HTML."
			)
	})
	.strict()
	.describe(
		"Creates visual representations of ratios using discrete countable objects (emojis). Objects are grouped by rows, one row per object type."
	)

export type DiscreteObjectRatioDiagramProps = z.infer<
	typeof DiscreteObjectRatioDiagramPropsSchema
>

/**
 * This template generates an SVG graphic that visually represents a ratio using a collection
 * of discrete, countable objects. It is perfect for introductory ratio problems where
 * students can directly count the items to understand the relationship.
 */
export const generateDiscreteObjectRatioDiagram: WidgetGenerator<
	typeof DiscreteObjectRatioDiagramPropsSchema
> = async (data) => {
	const { width, height, title } = data

	// Titles float above the chart content area.
	// Tighter side/bottom padding for a cleaner look in this widget.
	const padding = { top: 40, right: 12, bottom: 12, left: 12 }

	const chartWidth = width - padding.left - padding.right
	const chartHeight = height - padding.top - padding.bottom

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	// Add a clean background container with rounded corners and subtle border
	const containerPadding = 6
	const containerX = padding.left - containerPadding
	const containerY = padding.top - containerPadding
	const containerWidth = chartWidth + 2 * containerPadding
	const containerHeight = chartHeight + 2 * containerPadding

	// Draw container background using Canvas API
	canvas.drawRect(containerX, containerY, containerWidth, containerHeight, {
		fill: theme.colors.background,
		stroke: theme.colors.border,
		strokeWidth: theme.stroke.width.thick
	})

	// Draw the title using the new helper
	if (title !== null) {
		// Define the frame for the title
		const titleFrame = {
			left: 0,
			top: 0,
			width: width,
			height: height
		}

		// Call the new helper
		drawChartTitle(canvas, titleFrame, abbreviateMonth(title), {
			maxWidthPolicy: "frame",
			fontPx: theme.font.size.base * 1.1
		})
	}

	// Dynamically size emoji so rows fill available space cleanly
	const spacingRatio = 0.35 // horizontal space between items as a fraction of size
	const rowCount = data.objects.length
	const rowHeight = chartHeight / rowCount
	const heightBased = rowHeight * 0.8
	const widthBasedAllRows = Math.min(
		...data.objects.map((o) =>
			o.count > 0 ? chartWidth / (o.count * (1 + spacingRatio)) : heightBased
		)
	)
	const iconSize = Math.max(
		12,
		Math.floor(Math.min(heightBased, widthBasedAllRows))
	)
	const iconPadding = Math.floor(iconSize * spacingRatio)
	const step = iconSize + iconPadding

	// Function to draw emojis with better positioning using Canvas API
	const drawIcon = (x: number, y: number, emoji: string) => {
		const fontSize = iconSize * 0.9 // Better emoji sizing
		canvas.drawText({
			x: x + iconSize / 2,
			y: y + iconSize / 2,
			text: emoji,
			fontPx: fontSize,
			anchor: "middle",
			dominantBaseline: "middle"
		})
	}

	let currentX = padding.left
	let currentY = padding.top

	// Group by horizontal rows (one row per object type)
	const objects = data.objects
	for (let rowIndex = 0; rowIndex < objects.length; rowIndex++) {
		const obj = objects[rowIndex]
		const startY = padding.top + rowIndex * rowHeight
		// Center row content horizontally
		const rowContentWidth = obj.count * step
		const extraX = Math.max(0, Math.floor((chartWidth - rowContentWidth) / 2))
		currentX = padding.left + extraX
		currentY = startY
		for (let i = 0; i < obj.count; i++) {
			drawIcon(currentX, currentY, obj.emoji)
			currentX += step
		}
	}

	// NEW: Finalize the canvas and construct the root SVG element with smaller outer padding
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(12)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.medium}">${svgBody}</svg>`
}
