import type { CustomPolygonDiagramProps } from "@/widgets/generators/custom-polygon-diagram"

export const customPolygonDiagramExamples: CustomPolygonDiagramProps[] = [
	// Example 1: Trapezoid-like shape (left vertical, top horizontal)
	{
		type: "customPolygonDiagram",
		width: 300,
		height: 300,
		points: [
			// P -> Q -> T -> R (closed automatically)
			{ x: 10, y: 10, label: "P" },
			{ x: 10, y: 120, label: "Q" },
			{ x: 140, y: 120, label: "T" },
			{ x: 110, y: 20, label: "R" }
		],
		fillColor: "#00000000",
		strokeColor: "#1F6FB2"
	},
	// Example 2: Parallelogram (bottom horizontal)
	{
		type: "customPolygonDiagram",
		width: 300,
		height: 300,
		points: [
			// P -> R -> T -> Q
			{ x: 10, y: 10, label: "P" },
			{ x: 150, y: 10, label: "R" },
			{ x: 210, y: 110, label: "T" },
			{ x: 70, y: 110, label: "Q" }
		],
		fillColor: "#00000000",
		strokeColor: "#1F6FB2"
	}
]
