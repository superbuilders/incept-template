import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

const Node = z
	.object({
		id: z
			.string()
			.describe(
				"Unique identifier for this node (e.g., 'root', 'n1', 'left-child', 'outcome-A'). Used to reference in edges. Must be unique within diagram."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Text content displayed in the node (e.g., '24', '2 × 12', 'H', '0.5', 'Yes', null). Keep concise to fit within node circle. Null for unlabeled nodes."
			),
		position: z
			.object({
				x: z
					.number()
					.describe(
						"Horizontal position of node center in pixels (e.g., 200, 100, 350). Origin (0,0) is top-left of diagram."
					),
				y: z
					.number()
					.describe(
						"Vertical position of node center in pixels (e.g., 50, 150, 200). Increases downward. Tree typically grows downward."
					)
			})
			.strict()
			.describe(
				"Exact position for the node center. No automatic layout - positions must be explicitly calculated."
			),
		style: z
			.enum(["circled", "default"])
			.describe(
				"Visual style of the node. 'circled' draws a circle around the label. 'default' also shows a circle (legacy compatibility)."
			),
		color: z
			.string()
			.regex(
				CSS_COLOR_PATTERN,
				"invalid css color; use hex (#RGB, #RRGGBB, #RRGGBBAA), rgb/rgba(), hsl/hsla(), or a common named color"
			)
			.describe(
				"CSS color for the node's text and circle outline (e.g., 'black', '#0066CC', 'darkgreen'). Should contrast with white background."
			)
	})
	.strict()

const Edge = z
	.object({
		from: z
			.string()
			.describe(
				"ID of the parent/source node where this edge starts. Must match a node.id in the nodes array (e.g., 'root', 'n1')."
			),
		to: z
			.string()
			.describe(
				"ID of the child/target node where this edge ends. Must match a node.id in the nodes array (e.g., 'n2', 'left-child')."
			),
		style: z
			.enum(["solid", "dashed"])
			.describe(
				"Visual style of the connecting line. 'solid' for regular edges, 'dashed' for special relationships or probability branches."
			)
	})
	.strict()

export const TreeDiagramPropsSchema = z
	.object({
		type: z
			.literal("treeDiagram")
			.describe(
				"Identifies this as a tree diagram widget for hierarchical structures and decision trees."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		nodes: z
			.array(Node)
			.describe(
				"All nodes in the tree with explicit positions. No automatic layout - each node's position must be calculated. Can be empty for blank diagram."
			),
		edges: z
			.array(Edge)
			.describe(
				"Connections between nodes defining parent-child relationships. Each edge references nodes by their IDs. Can be empty for disconnected nodes."
			),
		nodeFontSize: z
			.number()
			.positive()
			.describe(
				"Font size for node labels in pixels (e.g., 14, 16, 12). Should be readable but fit within nodeRadius."
			),
		nodeRadius: z
			.number()
			.positive()
			.describe(
				"Radius of the circle for 'circled' style nodes in pixels (e.g., 20, 25, 30). Larger values accommodate longer labels."
			)
	})
	.strict()
	.describe(
		"Creates tree diagrams with manually positioned nodes and edges. Perfect for factor trees, probability trees, decision trees, and hierarchical structures. Unlike automatic layout systems, this gives complete control over node positioning for educational clarity. All nodes are rendered with circles for consistency."
	)

export type TreeDiagramProps = z.infer<typeof TreeDiagramPropsSchema>

/**
 * Generates a flexible SVG tree diagram from a set of nodes and edges.
 * Ideal for factor trees, probability trees, and other hierarchical structures.
 */
export const generateTreeDiagram: WidgetGenerator<
	typeof TreeDiagramPropsSchema
> = async (props) => {
	const { width, height, nodes, edges, nodeFontSize, nodeRadius } = props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: nodeFontSize,
		lineHeightDefault: 1.2
	})

	// Handle empty nodes case
	if (nodes.length === 0) {
		return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}"></svg>`
	}

	// Create a map for quick node lookup by ID
	const nodeMap = new Map(nodes.map((node) => [node.id, node]))

	// 1. Draw Edges (in the background)
	for (const edge of edges) {
		const fromNode = nodeMap.get(edge.from)
		const toNode = nodeMap.get(edge.to)
		if (!fromNode || !toNode) continue

		const dash = edge.style === "dashed" ? "5 3" : undefined
		canvas.drawLine(
			fromNode.position.x,
			fromNode.position.y,
			toNode.position.x,
			toNode.position.y,
			{
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.thick,
				dash: dash
			}
		)
	}

	// 2. Draw Nodes (on top of edges)
	for (const node of nodes) {
		const { x, y } = node.position

		// Draw a circle for all nodes
		canvas.drawCircle(x, y, nodeRadius, {
			fill: theme.colors.white,
			stroke: node.color,
			strokeWidth: theme.stroke.width.thick
		})

		// Draw the text label only if it exists
		if (node.label !== null) {
			// Wrap text to fit inside the node circle. We leave a small padding so
			// long labels like "2 heads and 1 tail" don't overflow the bubble.
			const innerPaddingPx = 6
			const maxTextWidthPx = Math.max(2 * nodeRadius - 2 * innerPaddingPx, 4)
			canvas.drawWrappedText({
				x: x,
				y: y,
				text: node.label,
				maxWidthPx: maxTextWidthPx,
				fill: node.color,
				fontPx: nodeFontSize,
				anchor: "middle",
				dominantBaseline: "middle"
			})
		}
	}

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
