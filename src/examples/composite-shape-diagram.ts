import type { CompositeShapeDiagramProps } from "@/widgets/generators/composite-shape-diagram"

/**
 * Example of a composite shape diagram showing a complex polygon with:
 * - Multiple shaded regions
 * - Internal segments with labels
 * - Right angle markers
 * - Partitioned edges
 *
 * This creates a composite figure that can be used for area calculations
 * where students need to find areas of component parts.
 */
export const compositeShapeExample: CompositeShapeDiagramProps = {
	type: "compositeShapeDiagram",
	width: 500,
	height: 340,
	shapes: null,
	fit: null,
	vertices: [
		{ x: 28.829, y: 2.883, id: "T" },
		{ x: 28.829, y: 118.198, id: "L" },
		{ x: 86.487, y: 118.198, id: "H1" },
		{ x: 144.144, y: 118.198, id: "H2" },
		{ x: 86.487, y: 175.856, id: "BL" },
		{ x: 144.144, y: 175.856, id: "BR" },
		{ x: 317.117, y: 118.198, id: "R" }
	],
	regionLabels: [
		{ text: "A", position: { x: 110, y: 70 } },
		{ text: "B", position: { x: 55, y: 155 } },
		{ text: "C", position: { x: 115, y: 150 } },
		{ text: "D", position: { x: 220, y: 140 } }
	],
	boundaryEdges: [
		{
			type: "simple",
			from: "T",
			to: "L",
			label: { value: 4, unit: "units" }
		},
		{
			type: "simple",
			from: "L",
			to: "BL",
			label: null
		},
		{
			type: "simple",
			from: "BL",
			to: "BR",
			label: null
		},
		{
			type: "simple",
			from: "BR",
			to: "R",
			label: null
		},
		{
			type: "simple",
			from: "R",
			to: "T",
			label: null
		}
	],
	shadedRegions: [
		{
			vertexIds: ["T", "L", "R"],
			fillColor: "#bc26124d"
		},
		{
			vertexIds: ["L", "BL", "H1"],
			fillColor: "#e07d104d"
		},
		{
			vertexIds: ["H1", "BL", "BR", "H2"],
			fillColor: "#ca337c4d"
		},
		{
			vertexIds: ["H2", "BR", "R"],
			fillColor: "#01a9954d"
		}
	],
	internalSegments: [
		{
			fromVertexId: "L",
			toVertexId: "H1",
			style: "dashed",
			label: { value: 2, unit: "units" }
		},
		{
			fromVertexId: "H1",
			toVertexId: "H2",
			style: "dashed",
			label: { value: 2, unit: "units" }
		},
		{
			fromVertexId: "H2",
			toVertexId: "R",
			style: "dashed",
			label: { value: 6, unit: "units" }
		},
		{
			fromVertexId: "H1",
			toVertexId: "BL",
			style: "dashed",
			label: { value: 2, unit: "units" }
		},
		{
			fromVertexId: "H2",
			toVertexId: "BR",
			style: "dashed",
			label: { value: 2, unit: "units" }
		}
	],
	rightAngleMarkers: [
		{
			cornerVertexId: "L",
			adjacentVertex1Id: "T",
			adjacentVertex2Id: "H1"
		},
		{
			cornerVertexId: "H1",
			adjacentVertex1Id: "L",
			adjacentVertex2Id: "BL"
		},
		{
			cornerVertexId: "H2",
			adjacentVertex1Id: "R",
			adjacentVertex2Id: "BR"
		}
	]
}

/**
 * Example of a circle with an inscribed rectangle showing shaded regions
 * Demonstrates how to approximate circular shapes using many vertices
 */
export const circleWithRectangleExample: CompositeShapeDiagramProps = {
	type: "compositeShapeDiagram",
	width: 400,
	height: 400,
	shapes: null,
	fit: null,
	vertices: [
		// Center and rectangle vertices
		{ x: 0, y: 0, id: "O" },
		{ x: -20, y: -30, id: "R1" },
		{ x: 20, y: -30, id: "R2" },
		{ x: 20, y: 30, id: "R3" },
		{ x: -20, y: 30, id: "R4" },
		// Circle approximation vertices
		{ x: 110, y: 0, id: "C0" },
		{ x: 101.63, y: 42.1, id: "C1" },
		{ x: 77.78, y: 77.78, id: "C2" },
		{ x: 42.1, y: 101.63, id: "C3" },
		{ x: 0, y: 110, id: "C4" },
		{ x: -42.1, y: 101.63, id: "C5" },
		{ x: -77.78, y: 77.78, id: "C6" },
		{ x: -101.63, y: 42.1, id: "C7" },
		{ x: -110, y: 0, id: "C8" },
		{ x: -101.63, y: -42.1, id: "C9" },
		{ x: -77.78, y: -77.78, id: "C10" },
		{ x: -42.1, y: -101.63, id: "C11" },
		{ x: 0, y: -110, id: "C12" },
		{ x: 42.1, y: -101.63, id: "C13" },
		{ x: 77.78, y: -77.78, id: "C14" },
		{ x: 101.63, y: -42.1, id: "C15" }
	],
	boundaryEdges: [
		{
			type: "partitioned",
			path: [
				"C0",
				"C1",
				"C2",
				"C3",
				"C4",
				"C5",
				"C6",
				"C7",
				"C8",
				"C9",
				"C10",
				"C11",
				"C12",
				"C13",
				"C14",
				"C15",
				"C0"
			],
			segments: [
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null },
				{ style: "solid", label: null }
			]
		}
	],
	shadedRegions: [
		{
			vertexIds: [
				"C0",
				"C1",
				"C2",
				"C3",
				"C4",
				"C5",
				"C6",
				"C7",
				"C8",
				"C9",
				"C10",
				"C11",
				"C12",
				"C13",
				"C14",
				"C15"
			],
			fillColor: "#ccfaff80"
		},
		{
			vertexIds: ["R1", "R2", "R3", "R4"],
			fillColor: "#ffffff"
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
			label: { value: 4, unit: "cm" }
		},
		{
			fromVertexId: "R2",
			toVertexId: "R3",
			style: "solid",
			label: { value: 6, unit: "cm" }
		},
		{
			fromVertexId: "R3",
			toVertexId: "R4",
			style: "solid",
			label: null
		},
		{
			fromVertexId: "R4",
			toVertexId: "R1",
			style: "solid",
			label: null
		}
	],
	rightAngleMarkers: null,
	regionLabels: null
}

// Ported variants of the nested-shape-diagram examples using the new composite-shape-diagram schema
export const compositeFromNestedExamples: CompositeShapeDiagramProps[] = [
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
	},

	// Example 5: Area of a shaded region (circle minus rectangle) (xd8c0fb6d8bfff96e)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 300,
		height: 300,
		vertices: [
			{ id: "O", x: 140, y: 140 },
			{ id: "A", x: 70, y: 90 },
			{ id: "B", x: 210, y: 90 },
			{ id: "C", x: 210, y: 190 },
			{ id: "D", x: 70, y: 190 },
			{ id: "C0", x: 260, y: 140 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "main_circle", type: "circle", centerId: "O", radius: 120 },
			{ id: "rect", type: "polygon", vertexIds: ["A", "B", "C", "D"] }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff",
				path: [
					{ shapeId: "main_circle", pathType: "outer" },
					{ shapeId: "rect", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "O",
				toVertexId: "C0",
				style: "solid",
				label: { value: 6, unit: "cm" }
			},
			{
				fromVertexId: "A",
				toVertexId: "B",
				style: "solid",
				label: { value: 7, unit: "cm" }
			},
			{ fromVertexId: "B", toVertexId: "C", style: "solid", label: null },
			{ fromVertexId: "C", toVertexId: "D", style: "solid", label: null },
			{
				fromVertexId: "D",
				toVertexId: "A",
				style: "solid",
				label: { value: 5, unit: "cm" }
			}
		],
		rightAngleMarkers: null,
		regionLabels: null
	},

	// Example 6: Area of the shaded region (circle minus rectangle) (x3a68667079fdffdd)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 300,
		height: 300,
		vertices: [
			{ id: "O", x: 100, y: 100 },
			{ id: "R1", x: 70, y: 80 },
			{ id: "R2", x: 130, y: 80 },
			{ id: "R3", x: 130, y: 120 },
			{ id: "R4", x: 70, y: 120 },
			{ id: "C0", x: 180, y: 100 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "circle", type: "circle", centerId: "O", radius: 80 },
			{ id: "rectangle", type: "polygon", vertexIds: ["R1", "R2", "R3", "R4"] }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff80",
				path: [
					{ shapeId: "circle", pathType: "outer" },
					{ shapeId: "rectangle", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "O",
				toVertexId: "C0",
				style: "solid",
				label: { value: 4, unit: "cm" }
			},
			{
				fromVertexId: "R1",
				toVertexId: "R2",
				style: "solid",
				label: { value: 3, unit: "cm" }
			},
			{ fromVertexId: "R2", toVertexId: "R3", style: "solid", label: null },
			{ fromVertexId: "R3", toVertexId: "R4", style: "solid", label: null },
			{
				fromVertexId: "R4",
				toVertexId: "R1",
				style: "solid",
				label: { value: 2, unit: "cm" }
			}
		],
		rightAngleMarkers: null,
		regionLabels: null
	},

	// Example 7: Area of the shaded region between a rectangle and a circle (x55061cb6ed4c4ee5)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 350,
		height: 350,
		vertices: [
			{ id: "A", x: 25, y: 25 },
			{ id: "B", x: 300, y: 25 },
			{ id: "C", x: 300, y: 325 },
			{ id: "D", x: 25, y: 325 },
			{ id: "O", x: 162.5, y: 175 },
			{ id: "R", x: 187.5, y: 175 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "rectangle", type: "polygon", vertexIds: ["A", "B", "C", "D"] },
			{ id: "circle", type: "circle", centerId: "O", radius: 25 }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff80",
				path: [
					{ shapeId: "rectangle", pathType: "outer" },
					{ shapeId: "circle", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "O",
				toVertexId: "R",
				style: "solid",
				label: { value: 1, unit: "cm" }
			},
			{
				fromVertexId: "A",
				toVertexId: "B",
				style: "solid",
				label: { value: 11, unit: "cm" }
			},
			{
				fromVertexId: "B",
				toVertexId: "C",
				style: "solid",
				label: { value: 12, unit: "cm" }
			},
			{ fromVertexId: "C", toVertexId: "D", style: "solid", label: null },
			{ fromVertexId: "D", toVertexId: "A", style: "solid", label: null }
		],
		rightAngleMarkers: [
			{ cornerVertexId: "A", adjacentVertex1Id: "B", adjacentVertex2Id: "D" },
			{ cornerVertexId: "B", adjacentVertex1Id: "A", adjacentVertex2Id: "C" },
			{ cornerVertexId: "C", adjacentVertex1Id: "B", adjacentVertex2Id: "D" },
			{ cornerVertexId: "D", adjacentVertex1Id: "A", adjacentVertex2Id: "C" }
		],
		regionLabels: null
	},

	// Example 8: Area of the shaded region: rectangle minus circle (xb9a2f2df68f7f278)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 300,
		height: 300,
		vertices: [
			{ id: "R1", x: 25, y: 25 },
			{ id: "R2", x: 225, y: 25 },
			{ id: "R3", x: 225, y: 200 },
			{ id: "R4", x: 25, y: 200 },
			{ id: "O", x: 125, y: 112.5 },
			{ id: "P0", x: 200, y: 112.5 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "rect", type: "polygon", vertexIds: ["R1", "R2", "R3", "R4"] },
			{ id: "circle", type: "circle", centerId: "O", radius: 75 }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff80",
				path: [
					{ shapeId: "rect", pathType: "outer" },
					{ shapeId: "circle", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "O",
				toVertexId: "P0",
				style: "solid",
				label: { value: 3, unit: "cm" }
			},
			{
				fromVertexId: "R1",
				toVertexId: "R2",
				style: "solid",
				label: { value: 8, unit: "cm" }
			},
			{
				fromVertexId: "R2",
				toVertexId: "R3",
				style: "solid",
				label: { value: 7, unit: "cm" }
			},
			{ fromVertexId: "R3", toVertexId: "R4", style: "solid", label: null },
			{ fromVertexId: "R4", toVertexId: "R1", style: "solid", label: null }
		],
		rightAngleMarkers: [
			{
				cornerVertexId: "R1",
				adjacentVertex1Id: "R2",
				adjacentVertex2Id: "R4"
			},
			{
				cornerVertexId: "R2",
				adjacentVertex1Id: "R1",
				adjacentVertex2Id: "R3"
			},
			{
				cornerVertexId: "R3",
				adjacentVertex1Id: "R2",
				adjacentVertex2Id: "R4"
			},
			{ cornerVertexId: "R4", adjacentVertex1Id: "R1", adjacentVertex2Id: "R3" }
		],
		regionLabels: null
	},

	// Example 9: Area of a shaded region (rectangle with inscribed circle) (xc12b923ac5d6ad9e)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 300,
		height: 300,
		vertices: [
			{ id: "A", x: 35, y: 35 },
			{ id: "B", x: 140, y: 35 },
			{ id: "C", x: 140, y: 175 },
			{ id: "D", x: 35, y: 175 },
			{ id: "O", x: 87.5, y: 105 },
			{ id: "R", x: 122.5, y: 105 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "rectangle", type: "polygon", vertexIds: ["A", "B", "C", "D"] },
			{ id: "circle", type: "circle", centerId: "O", radius: 35 }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff80",
				path: [
					{ shapeId: "rectangle", pathType: "outer" },
					{ shapeId: "circle", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "O",
				toVertexId: "R",
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
				label: { value: 4, unit: "cm" }
			},
			{ fromVertexId: "C", toVertexId: "D", style: "solid", label: null },
			{ fromVertexId: "D", toVertexId: "A", style: "solid", label: null }
		],
		rightAngleMarkers: [
			{ cornerVertexId: "A", adjacentVertex1Id: "B", adjacentVertex2Id: "D" },
			{ cornerVertexId: "B", adjacentVertex1Id: "A", adjacentVertex2Id: "C" },
			{ cornerVertexId: "C", adjacentVertex1Id: "B", adjacentVertex2Id: "D" },
			{ cornerVertexId: "D", adjacentVertex1Id: "A", adjacentVertex2Id: "C" }
		],
		regionLabels: null
	},

	// Example 10: Area of a shaded region: rectangle minus circle (x9b473530bde85c53)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 350,
		height: 350,
		vertices: [
			{ id: "A", x: 25, y: 25 },
			{ id: "B", x: 300, y: 25 },
			{ id: "C", x: 300, y: 325 },
			{ id: "D", x: 25, y: 325 },
			{ id: "O", x: 162.5, y: 175 },
			{ id: "R", x: 212.5, y: 175 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "rectangle", type: "polygon", vertexIds: ["A", "B", "C", "D"] },
			{ id: "circle", type: "circle", centerId: "O", radius: 50 }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff80",
				path: [
					{ shapeId: "rectangle", pathType: "outer" },
					{ shapeId: "circle", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "O",
				toVertexId: "R",
				style: "solid",
				label: { value: 2, unit: "cm" }
			},
			{
				fromVertexId: "A",
				toVertexId: "B",
				style: "solid",
				label: { value: 11, unit: "cm" }
			},
			{
				fromVertexId: "B",
				toVertexId: "C",
				style: "solid",
				label: { value: 12, unit: "cm" }
			},
			{ fromVertexId: "C", toVertexId: "D", style: "solid", label: null },
			{ fromVertexId: "D", toVertexId: "A", style: "solid", label: null }
		],
		rightAngleMarkers: null,
		regionLabels: null
	},

	// Example 11: Area of the shaded region between a square and a circle (xf0438c2e9eb979cd)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 350,
		height: 325,
		vertices: [
			{ id: "A", x: 25, y: 25 },
			{ id: "B", x: 300, y: 25 },
			{ id: "C", x: 300, y: 300 },
			{ id: "D", x: 25, y: 300 },
			{ id: "O", x: 162.5, y: 162.5 },
			{ id: "R", x: 287.5, y: 162.5 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "square", type: "polygon", vertexIds: ["A", "B", "C", "D"] },
			{ id: "circle", type: "circle", centerId: "O", radius: 125 }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff80",
				path: [
					{ shapeId: "square", pathType: "outer" },
					{ shapeId: "circle", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "O",
				toVertexId: "R",
				style: "solid",
				label: { value: 5, unit: "cm" }
			},
			{
				fromVertexId: "A",
				toVertexId: "B",
				style: "solid",
				label: { value: 11, unit: "cm" }
			},
			{
				fromVertexId: "B",
				toVertexId: "C",
				style: "solid",
				label: { value: 11, unit: "cm" }
			},
			{ fromVertexId: "C", toVertexId: "D", style: "solid", label: null },
			{ fromVertexId: "D", toVertexId: "A", style: "solid", label: null }
		],
		rightAngleMarkers: null,
		regionLabels: null
	},

	// Example 12: Area of a shaded region between a circle and a square (x74eb96d7a07de3a4)
	{
		type: "compositeShapeDiagram",
		fit: "none",
		width: 300,
		height: 300,
		vertices: [
			{ id: "O", x: 100, y: 100 },
			{ id: "S1", x: 70, y: 70 },
			{ id: "S2", x: 130, y: 70 },
			{ id: "S3", x: 130, y: 130 },
			{ id: "S4", x: 70, y: 130 },
			{ id: "C0", x: 180, y: 100 }
		],
		boundaryEdges: [],
		shapes: [
			{ id: "circle", type: "circle", centerId: "O", radius: 80 },
			{ id: "square", type: "polygon", vertexIds: ["S1", "S2", "S3", "S4"] }
		],
		shadedRegions: [
			{
				fillColor: "#ccfaff",
				path: [
					{ shapeId: "circle", pathType: "outer" },
					{ shapeId: "square", pathType: "inner" }
				]
			}
		],
		internalSegments: [
			{
				fromVertexId: "S1",
				toVertexId: "S2",
				style: "solid",
				label: { value: 3, unit: "cm" }
			},
			{ fromVertexId: "S2", toVertexId: "S3", style: "solid", label: null },
			{ fromVertexId: "S3", toVertexId: "S4", style: "solid", label: null },
			{
				fromVertexId: "S4",
				toVertexId: "S1",
				style: "solid",
				label: { value: 3, unit: "cm" }
			},
			{
				fromVertexId: "O",
				toVertexId: "C0",
				style: "solid",
				label: { value: 4, unit: "cm" }
			}
		],
		rightAngleMarkers: null,
		regionLabels: null
	}
]
