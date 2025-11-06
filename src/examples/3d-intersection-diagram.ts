import type { ThreeDIntersectionDiagramProps } from "@/widgets/generators/3d-intersection-diagram"

export const threeDIntersectionDiagramExamples: ThreeDIntersectionDiagramProps[] =
	[
		{
			type: "threeDIntersectionDiagram",
			plane: {
				position: 0.5,
				orientation: "vertical"
			},
			solid: {
				type: "squarePyramid"
			},
			width: 300,
			height: 300,
			viewOptions: {
				showLabels: false,
				projectionAngle: 30,
				showHiddenEdges: true,
				intersectionColor: "#11accd"
			}
		},
		{
			type: "threeDIntersectionDiagram",
			plane: {
				position: 0.5,
				orientation: "vertical"
			},
			solid: {
				type: "rectangularPrism"
			},
			width: 500,
			height: 350,
			viewOptions: {
				showLabels: false,
				projectionAngle: 30,
				showHiddenEdges: true,
				intersectionColor: "#FF6B6B80"
			}
		},
		{
			type: "threeDIntersectionDiagram",
			plane: {
				position: 0.5,
				orientation: "vertical"
			},
			solid: {
				type: "cone"
			},
			width: 500,
			height: 350,
			viewOptions: {
				showLabels: false,
				projectionAngle: 30,
				showHiddenEdges: true,
				intersectionColor: "#11accd"
			}
		},
		{
			type: "threeDIntersectionDiagram",
			plane: {
				position: 0.3,
				orientation: "vertical"
			},
			solid: {
				type: "squarePyramid"
			},
			width: 500,
			height: 380,
			viewOptions: {
				showLabels: false,
				projectionAngle: 30,
				showHiddenEdges: true,
				intersectionColor: "#ffcc66"
			}
		},
		{
			type: "threeDIntersectionDiagram",
			plane: {
				position: 0.5,
				orientation: "vertical"
			},
			solid: {
				type: "rectangularPrism"
			},
			width: 500,
			height: 350,
			viewOptions: {
				showLabels: false,
				projectionAngle: 30,
				showHiddenEdges: true,
				intersectionColor: "#11accd"
			}
		},
		{
			type: "threeDIntersectionDiagram",
			plane: {
				position: 0.6,
				orientation: "vertical"
			},
			solid: {
				type: "octagonalPrism"
			},
			width: 400,
			height: 350,
			viewOptions: {
				showLabels: false,
				projectionAngle: 30,
				showHiddenEdges: false,
				intersectionColor: "#9b59b6"
			}
		}
	]
