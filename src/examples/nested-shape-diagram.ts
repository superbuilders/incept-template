import type { CompositeShapeDiagramProps } from "@/widgets/generators/composite-shape-diagram"

// Ported variants of the nested-shape-diagram examples using the composite-shape-diagram schema
export const nestedShapeDiagramExamples: CompositeShapeDiagramProps[] = [
	// Example 1: Area of a shaded region between a circle and a rectangle (xdd3424e759f98328)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 300,
		height: 300,
		vertices: [
			{ id: "O", x: 0, y: 0 },
			{ id: "C0", x: 110, y: 0 },
			{ id: "R1", x: -20, y: -30 },
			{ id: "R2", x: 20, y: -30 },
			{ id: "R3", x: 20, y: 30 },
			{ id: "R4", x: -20, y: 30 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "main_circle", type: "circle", centerId: "O", radius: 110 },
			{ id: "inner_rect", type: "polygon", vertexIds: ["R1", "R2", "R3", "R4"] }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff80",
				path: [
					{ shapeId: "main_circle", pathType: "outer" },
					{ shapeId: "inner_rect", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "O",
				toVertexId: "C0",
				style: "solid",
				label: { value: 11, unit: "cm" }
			},
			{
				fromVertexId: "R1",
				toVertexId: "R2",
				style: "solid",
				label: { value: 6, unit: "cm" }
			},
			{ fromVertexId: "R2", toVertexId: "R3", style: "solid", label: null },
			{ fromVertexId: "R3", toVertexId: "R4", style: "solid", label: null },
			{
				fromVertexId: "R4",
				toVertexId: "R1",
				style: "solid",
				label: { value: 4, unit: "cm" }
			}
		],
		rightAngleMarkers: null,
		regionLabels: null
	},

	// Example 2: Area of a shaded region (circle minus rectangle) (x9b74005f28d0b824)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 300,
		height: 300,
		vertices: [
			{ id: "C", x: 0, y: 0 },
			{ id: "P0", x: 120, y: 0 },
			{ id: "R1", x: -25, y: -55 },
			{ id: "R2", x: 25, y: -55 },
			{ id: "R3", x: 25, y: 55 },
			{ id: "R4", x: -25, y: 55 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "outer_circle", type: "circle", centerId: "C", radius: 120 },
			{ id: "inner_rect", type: "polygon", vertexIds: ["R1", "R2", "R3", "R4"] }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff80",
				path: [
					{ shapeId: "outer_circle", pathType: "outer" },
					{ shapeId: "inner_rect", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "C",
				toVertexId: "P0",
				style: "solid",
				label: { value: 12, unit: "cm" }
			},
			{
				fromVertexId: "R1",
				toVertexId: "R2",
				style: "solid",
				label: { value: 5, unit: "cm" }
			},
			{ fromVertexId: "R2", toVertexId: "R3", style: "solid", label: null },
			{ fromVertexId: "R3", toVertexId: "R4", style: "solid", label: null },
			{
				fromVertexId: "R4",
				toVertexId: "R1",
				style: "solid",
				label: { value: 11, unit: "cm" }
			}
		],
		rightAngleMarkers: null,
		regionLabels: null
	},

	// Example 3: Area of a shaded region (square minus circle) (x70ade9874035cc08)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 300,
		height: 300,
		vertices: [
			{ id: "A", x: 35, y: 35 },
			{ id: "B", x: 140, y: 35 },
			{ id: "C", x: 140, y: 140 },
			{ id: "D", x: 35, y: 140 },
			{ id: "O", x: 87.5, y: 87.5 },
			{ id: "P0", x: 122.5, y: 87.5 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "outer_square", type: "polygon", vertexIds: ["A", "B", "C", "D"] },
			{ id: "inner_circle", type: "circle", centerId: "O", radius: 35 }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff80",
				path: [
					{ shapeId: "outer_square", pathType: "outer" },
					{ shapeId: "inner_circle", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "O",
				toVertexId: "P0",
				style: "solid",
				label: { value: 1, unit: "cm" }
			},
			{
				fromVertexId: "A",
				toVertexId: "B",
				style: "solid",
				label: { value: 3, unit: "cm" }
			},
			{
				fromVertexId: "B",
				toVertexId: "C",
				style: "solid",
				label: { value: 3, unit: "cm" }
			},
			{ fromVertexId: "C", toVertexId: "D", style: "solid", label: null },
			{ fromVertexId: "D", toVertexId: "A", style: "solid", label: null }
		],
		rightAngleMarkers: null,
		regionLabels: null
	},

	// Example 4: Area of a shaded region between a circle and a rectangle (x7893c043131fd6d6)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 360,
		height: 360,
		vertices: [
			{ id: "O", x: 180, y: 180 },
			{ id: "P0", x: 340, y: 180 },
			{ id: "A", x: 60, y: 160 },
			{ id: "B", x: 300, y: 160 },
			{ id: "C", x: 300, y: 200 },
			{ id: "D", x: 60, y: 200 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "large_circle", type: "circle", centerId: "O", radius: 160 },
			{
				id: "horizontal_rect",
				type: "polygon",
				vertexIds: ["A", "B", "C", "D"]
			}
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff80",
				path: [
					{ shapeId: "large_circle", pathType: "outer" },
					{ shapeId: "horizontal_rect", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "O",
				toVertexId: "P0",
				style: "solid",
				label: { value: 8, unit: "cm" }
			},
			{
				fromVertexId: "A",
				toVertexId: "B",
				style: "solid",
				label: { value: 12, unit: "cm" }
			},
			{ fromVertexId: "B", toVertexId: "C", style: "solid", label: null },
			{ fromVertexId: "C", toVertexId: "D", style: "solid", label: null },
			{
				fromVertexId: "D",
				toVertexId: "A",
				style: "solid",
				label: { value: 2, unit: "cm" }
			}
		],
		rightAngleMarkers: null,
		regionLabels: null
	}
]
