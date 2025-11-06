import type { CircleAngleDiagramProps } from "@/widgets/generators/circle-angle-diagram"

export const circleAngleDiagramExamples: CircleAngleDiagramProps[] = [
	{
		type: "circleAngleDiagram",
		width: 300,
		height: 300,
		angle: 72,
		rotation: -15,
		labels: { center: "O", point1: "A", point2: "B" },
		shadeColor: "#FFD700"
	},
	{
		type: "circleAngleDiagram",
		width: 300,
		height: 300,
		angle: 36,
		rotation: 160,
		labels: { center: "O", point1: "B", point2: "A" },
		shadeColor: "#FFD700"
	},
	{
		type: "circleAngleDiagram",
		width: 300,
		height: 300,
		angle: 18,
		rotation: -5,
		labels: { center: "O", point1: "A", point2: "B" },
		shadeColor: "#FFD700"
	}
]
