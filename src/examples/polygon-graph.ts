import type { PolygonGraphProps } from "@/widgets/generators/polygon-graph"

/**
 * Examples for the PolygonGraph widget
 *
 * This file contains various examples demonstrating different uses of the PolygonGraph widget:
 * - Basic triangles and quadrilaterals
 * - Complex polygons and pentagons
 * - Coordinate plane transformations
 * - Multiple polygons on the same plane
 * - Different fill colors and stroke styles
 * - Various coordinate ranges and grid configurations
 */

export const polygonGraphExamples: PolygonGraphProps[] = [
	// Example 1: Two triangles with different colors
	{
		type: "polygonGraph",
		width: 300,
		xAxis: {
			max: 12,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 12,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 7,
				y: 10,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 0,
				y: 10,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 2,
				y: 6,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: 7,
				y: 7,
				id: "D",
				label: "D",
				style: "closed"
			},
			{
				x: 7,
				y: 0,
				id: "E",
				label: "E",
				style: "closed"
			},
			{
				x: 11,
				y: 2,
				id: "F",
				label: "F",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C"],
				fillColor: "#99999926",
				strokeColor: "#999"
			},
			{
				label: "",
				isClosed: true,
				vertices: ["D", "E", "F"],
				fillColor: "#11accd26",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 2: Two labeled quadrilaterals
	{
		type: "polygonGraph",
		width: 300,
		xAxis: {
			max: 16,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 16,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 14,
				y: 8,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 14,
				y: 11,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 12,
				y: 13,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: 10,
				y: 13,
				id: "D",
				label: "D",
				style: "closed"
			},
			{
				x: 8,
				y: 9,
				id: "W",
				label: "W",
				style: "closed"
			},
			{
				x: 8,
				y: 6,
				id: "X",
				label: "X",
				style: "closed"
			},
			{
				x: 6,
				y: 4,
				id: "Y",
				label: "Y",
				style: "closed"
			},
			{
				x: 4,
				y: 4,
				id: "Z",
				label: "Z",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "ABCD",
				isClosed: true,
				vertices: ["A", "B", "C", "D"],
				fillColor: "#00000000",
				strokeColor: "#999999"
			},
			{
				label: "WXYZ",
				isClosed: true,
				vertices: ["W", "X", "Y", "Z"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 3: Two pentagons
	{
		type: "polygonGraph",
		width: 325,
		xAxis: {
			max: 18,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 18,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 3,
				y: 4,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 4,
				y: 11,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 6,
				y: 11,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: 4,
				y: 8,
				id: "D",
				label: "D",
				style: "closed"
			},
			{
				x: 6,
				y: 4,
				id: "E",
				label: "E",
				style: "closed"
			},
			{
				x: 9,
				y: 3,
				id: "M",
				label: "M",
				style: "closed"
			},
			{
				x: 9,
				y: 17,
				id: "N",
				label: "N",
				style: "closed"
			},
			{
				x: 15,
				y: 17,
				id: "O",
				label: "O",
				style: "closed"
			},
			{
				x: 11,
				y: 11,
				id: "P",
				label: "P",
				style: "closed"
			},
			{
				x: 15,
				y: 3,
				id: "Q",
				label: "Q",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C", "D", "E"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			},
			{
				label: "",
				isClosed: true,
				vertices: ["M", "N", "O", "P", "Q"],
				fillColor: "#00000000",
				strokeColor: "#1fab54"
			}
		],
		showQuadrantLabels: false
	},

	// Example 4: Two labeled figures
	{
		type: "polygonGraph",
		width: 325,
		xAxis: {
			max: 16,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 16,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 2,
				y: 4,
				id: "M",
				label: "M",
				style: "closed"
			},
			{
				x: 3,
				y: 5,
				id: "F1_1",
				label: "",
				style: "closed"
			},
			{
				x: 5,
				y: 4,
				id: "F1_2",
				label: "",
				style: "closed"
			},
			{
				x: 3,
				y: 3,
				id: "F1_3",
				label: "",
				style: "closed"
			},
			{
				x: 8,
				y: 7,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 10,
				y: 9,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 14,
				y: 7,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: 10,
				y: 5,
				id: "D",
				label: "D",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "Figure 1",
				isClosed: true,
				vertices: ["M", "F1_1", "F1_2", "F1_3"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			},
			{
				label: "Figure 2",
				isClosed: true,
				vertices: ["A", "B", "C", "D"],
				fillColor: "#00000000",
				strokeColor: "#1fab54"
			}
		],
		showQuadrantLabels: false
	},

	// Example 5: Two filled figures
	{
		type: "polygonGraph",
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 2,
				y: 1,
				id: "K",
				label: "K",
				style: "closed"
			},
			{
				x: 4,
				y: 3,
				id: "L",
				label: "L",
				style: "closed"
			},
			{
				x: 5,
				y: 1,
				id: "M",
				label: "M",
				style: "closed"
			},
			{
				x: 1,
				y: 1,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 4,
				y: 5,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 6,
				y: 1,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: 8,
				y: 1,
				id: "D",
				label: "D",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "Figure 1",
				isClosed: true,
				vertices: ["K", "L", "M"],
				fillColor: "#11accd22",
				strokeColor: "#11accd"
			},
			{
				label: "Figure 2",
				isClosed: true,
				vertices: ["A", "B", "C", "D"],
				fillColor: "#1fab5422",
				strokeColor: "#1fab54"
			}
		],
		showQuadrantLabels: false
	},

	// Example 6: Triangle in quadrant II
	{
		type: "polygonGraph",
		width: 425,
		xAxis: {
			max: 8,
			min: -8,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: -8,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: -3,
				y: 6,
				id: "A",
				label: "",
				style: "closed"
			},
			{
				x: -6,
				y: 2,
				id: "B",
				label: "",
				style: "closed"
			},
			{
				x: -3,
				y: 4,
				id: "C",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 7: Triangle in quadrant I
	{
		type: "polygonGraph",
		width: 425,
		xAxis: {
			max: 8,
			min: -8,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: -8,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: 6,
				y: 2,
				id: "P1",
				label: "",
				style: "closed"
			},
			{
				x: 3,
				y: 6,
				id: "P2",
				label: "",
				style: "closed"
			},
			{
				x: 3,
				y: 4,
				id: "P3",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["P1", "P2", "P3"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 8: Triangle in quadrant III
	{
		type: "polygonGraph",
		width: 425,
		xAxis: {
			max: 8,
			min: -8,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: -8,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: -3,
				y: -6,
				id: "A",
				label: "",
				style: "closed"
			},
			{
				x: -6,
				y: -2,
				id: "B",
				label: "",
				style: "closed"
			},
			{
				x: -3,
				y: -4,
				id: "C",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 9: Triangle transformation - reflection across x-axis
	{
		type: "polygonGraph",
		width: 425,
		xAxis: {
			max: 8,
			min: -8,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: -8,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: -2,
				y: 0,
				id: "A",
				label: "",
				style: "closed"
			},
			{
				x: -6,
				y: 5,
				id: "B",
				label: "",
				style: "closed"
			},
			{
				x: -4,
				y: 4,
				id: "C",
				label: "",
				style: "closed"
			},
			{
				x: -2,
				y: 0,
				id: "A_prime",
				label: "",
				style: "closed"
			},
			{
				x: -6,
				y: -5,
				id: "B_prime",
				label: "",
				style: "closed"
			},
			{
				x: -4,
				y: -4,
				id: "C_prime",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			},
			{
				label: "",
				isClosed: true,
				vertices: ["A_prime", "B_prime", "C_prime"],
				fillColor: "#00000000",
				strokeColor: "#1fab54"
			}
		],
		showQuadrantLabels: false
	},

	// Example 10: Triangle transformation - reflection across y-axis
	{
		type: "polygonGraph",
		width: 425,
		xAxis: {
			max: 8,
			min: -8,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: -8,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: -2,
				y: 0,
				id: "A",
				label: "",
				style: "closed"
			},
			{
				x: -6,
				y: 5,
				id: "B",
				label: "",
				style: "closed"
			},
			{
				x: -4,
				y: 4,
				id: "C",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 0,
				id: "A_wrong",
				label: "",
				style: "closed"
			},
			{
				x: 6,
				y: 5,
				id: "B_wrong",
				label: "",
				style: "closed"
			},
			{
				x: 4,
				y: 4,
				id: "C_wrong",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			},
			{
				label: "",
				isClosed: true,
				vertices: ["A_wrong", "B_wrong", "C_wrong"],
				fillColor: "#00000000",
				strokeColor: "#1fab54"
			}
		],
		showQuadrantLabels: false
	},

	// Example 11: Small filled triangle
	{
		type: "polygonGraph",
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 9,
				y: 5,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 9,
				y: 2,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 7,
				y: 1,
				id: "C",
				label: "C",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C"],
				fillColor: "#11accd1a",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 12: Pentagon
	{
		type: "polygonGraph",
		width: 300,
		xAxis: {
			max: 16,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 16,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 8,
				y: 14,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 10,
				y: 12,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 6,
				y: 8,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: 6,
				y: 12,
				id: "D",
				label: "D",
				style: "closed"
			},
			{
				x: 8,
				y: 12,
				id: "E",
				label: "E",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C", "D", "E"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 13: Regular pentagon with decimal coordinates
	{
		type: "polygonGraph",
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 6.25,
				y: 1.875,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 8.75,
				y: 1.875,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 8.75,
				y: 3.125,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: 7.5,
				y: 4.375,
				id: "D",
				label: "D",
				style: "closed"
			},
			{
				x: 6.25,
				y: 3.125,
				id: "E",
				label: "E",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C", "D", "E"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 14: Open polyline (not closed polygon)
	{
		type: "polygonGraph",
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: -7,
				y: -7.5,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: -3,
				y: -7.5,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: -3,
				y: 2.5,
				id: "C",
				label: "C",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: false,
				vertices: ["A", "B", "C"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 15: Rectangle with variable labels
	{
		type: "polygonGraph",
		width: 400,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: false
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: false
		},
		height: 400,
		points: [
			{
				x: 2,
				y: 3,
				id: "BL",
				label: "(x , 3)",
				style: "closed"
			},
			{
				x: 2,
				y: 7,
				id: "TL",
				label: "(2, 7)",
				style: "closed"
			},
			{
				x: 4,
				y: 7,
				id: "TR",
				label: "(y, 7)",
				style: "closed"
			},
			{
				x: 4,
				y: 3,
				id: "BR",
				label: "(4, 3)",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["BL", "TL", "TR", "BR"],
				fillColor: "#00000000",
				strokeColor: "#000000"
			}
		],
		showQuadrantLabels: false
	},

	// Example 16: Triangle labeled P with light blue fill
	{
		type: "polygonGraph",
		width: 340,
		xAxis: {
			max: 8,
			min: -8,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: -8,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 340,
		points: [
			{
				x: -6,
				y: -2,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: -2,
				y: -2,
				id: "p2",
				label: "",
				style: "closed"
			},
			{
				x: -3,
				y: -7,
				id: "p3",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "P",
				isClosed: true,
				vertices: ["p1", "p2", "p3"],
				fillColor: "#11accd22",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 17: Triangle with trapezoid
	{
		type: "polygonGraph",
		width: 325,
		xAxis: {
			max: 12,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 2,
				y: 3,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 4,
				y: 8,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 9,
				y: 8,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: 11,
				y: 3,
				id: "D",
				label: "D",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C", "D"],
				fillColor: "#11accd1a",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 18: Quadrilateral with light blue fill
	{
		type: "polygonGraph",
		width: 325,
		xAxis: {
			max: 12,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 12,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 2,
				y: 6,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 5,
				y: 10,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 7,
				y: 7,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: 11,
				y: 6,
				id: "D",
				label: "D",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C", "D"],
				fillColor: "#11accd22",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 19: Quadrilateral
	{
		type: "polygonGraph",
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 2,
				y: 1,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 4,
				y: 4,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 8,
				y: 4,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: 2,
				y: 8,
				id: "D",
				label: "D",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A", "B", "C", "D"],
				fillColor: "#00000000",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 20: Triangle ABC with point P
	{
		type: "polygonGraph",
		width: 400,
		xAxis: {
			max: 26,
			min: -2,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 2,
			min: -26,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 0,
				id: "P",
				label: "P",
				style: "closed"
			},
			{
				x: 8,
				y: -8,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: 12,
				y: -12,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: 0,
				y: -10,
				id: "C",
				label: "C",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "ABC",
				isClosed: true,
				vertices: ["A", "B", "C"],
				fillColor: "#e0f3f7",
				strokeColor: "#0c7f99"
			}
		],
		showQuadrantLabels: false
	},

	// Example 21: Large squares with different sizes
	{
		type: "polygonGraph",
		width: 400,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: -6,
				y: -6,
				id: "A1",
				label: "",
				style: "closed"
			},
			{
				x: -6,
				y: 6,
				id: "A2",
				label: "",
				style: "closed"
			},
			{
				x: 6,
				y: 6,
				id: "A3",
				label: "",
				style: "closed"
			},
			{
				x: 6,
				y: -6,
				id: "A4",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A1", "A2", "A3", "A4"],
				fillColor: "#00000000",
				strokeColor: "#333333"
			}
		],
		showQuadrantLabels: false
	},

	// Example 22: Larger square
	{
		type: "polygonGraph",
		width: 400,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: -9,
				y: -9,
				id: "B1",
				label: "",
				style: "closed"
			},
			{
				x: -9,
				y: 9,
				id: "B2",
				label: "",
				style: "closed"
			},
			{
				x: 9,
				y: 9,
				id: "B3",
				label: "",
				style: "closed"
			},
			{
				x: 9,
				y: -9,
				id: "B4",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["B1", "B2", "B3", "B4"],
				fillColor: "#00000000",
				strokeColor: "#333333"
			}
		],
		showQuadrantLabels: false
	},

	// Example 23: Rectangle
	{
		type: "polygonGraph",
		width: 400,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: -9,
				y: -6,
				id: "C1",
				label: "",
				style: "closed"
			},
			{
				x: -9,
				y: 6,
				id: "C2",
				label: "",
				style: "closed"
			},
			{
				x: 9,
				y: 6,
				id: "C3",
				label: "",
				style: "closed"
			},
			{
				x: 9,
				y: -6,
				id: "C4",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["C1", "C2", "C3", "C4"],
				fillColor: "#00000000",
				strokeColor: "#333333"
			}
		],
		showQuadrantLabels: false
	},

	// Example 24: Small filled rectangle
	{
		type: "polygonGraph",
		width: 400,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: -8,
				y: -2,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: -8,
				y: 7,
				id: "p2",
				label: "",
				style: "closed"
			},
			{
				x: -5,
				y: 7,
				id: "p3",
				label: "",
				style: "closed"
			},
			{
				x: -5,
				y: -2,
				id: "p4",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["p1", "p2", "p3", "p4"],
				fillColor: "#FFC8004D",
				strokeColor: "#000000"
			}
		],
		showQuadrantLabels: false
	},

	// Example 25: Empty coordinate plane
	{
		type: "polygonGraph",
		width: 500,
		xAxis: {
			max: 20,
			min: -2,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 20,
			min: -2,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 500,
		points: [],
		polygons: [],
		showQuadrantLabels: false
	},

	// Example 26: Square with light blue fill and larger grid
	{
		type: "polygonGraph",
		width: 500,
		xAxis: {
			max: 12,
			min: -12,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 12,
			min: -12,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 500,
		points: [
			{
				x: 8,
				y: -8,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: 8,
				y: 8,
				id: "p2",
				label: "",
				style: "closed"
			},
			{
				x: -8,
				y: 8,
				id: "p3",
				label: "",
				style: "closed"
			},
			{
				x: -8,
				y: -8,
				id: "p4",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["p1", "p2", "p3", "p4"],
				fillColor: "#cfeff926",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 27: Rectangle with light blue fill
	{
		type: "polygonGraph",
		width: 500,
		xAxis: {
			max: 12,
			min: -12,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 12,
			min: -12,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 500,
		points: [
			{
				x: 10,
				y: -9,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: 10,
				y: 9,
				id: "p2",
				label: "",
				style: "closed"
			},
			{
				x: -8,
				y: 9,
				id: "p3",
				label: "",
				style: "closed"
			},
			{
				x: -8,
				y: -9,
				id: "p4",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["p1", "p2", "p3", "p4"],
				fillColor: "#cfeff926",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 28: Large square with light blue fill
	{
		type: "polygonGraph",
		width: 500,
		xAxis: {
			max: 12,
			min: -12,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 12,
			min: -12,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 500,
		points: [
			{
				x: 10,
				y: -10,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: 10,
				y: 10,
				id: "p2",
				label: "",
				style: "closed"
			},
			{
				x: -10,
				y: 10,
				id: "p3",
				label: "",
				style: "closed"
			},
			{
				x: -10,
				y: -10,
				id: "p4",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["p1", "p2", "p3", "p4"],
				fillColor: "#cfeff926",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 29: Square with light blue fill
	{
		type: "polygonGraph",
		width: 380,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 380,
		points: [
			{
				x: -5,
				y: -5,
				id: "A1",
				label: "",
				style: "closed"
			},
			{
				x: 5,
				y: -5,
				id: "A2",
				label: "",
				style: "closed"
			},
			{
				x: 5,
				y: 5,
				id: "A3",
				label: "",
				style: "closed"
			},
			{
				x: -5,
				y: 5,
				id: "A4",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["A1", "A2", "A3", "A4"],
				fillColor: "#cfeaf326",
				strokeColor: "#11accd"
			}
		],
		showQuadrantLabels: false
	},

	// Example 30: Smaller gray square
	{
		type: "polygonGraph",
		width: 380,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 380,
		points: [
			{
				x: -4,
				y: -4,
				id: "B1",
				label: "",
				style: "closed"
			},
			{
				x: 4,
				y: -4,
				id: "B2",
				label: "",
				style: "closed"
			},
			{
				x: 4,
				y: 4,
				id: "B3",
				label: "",
				style: "closed"
			},
			{
				x: -4,
				y: 4,
				id: "B4",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["B1", "B2", "B3", "B4"],
				fillColor: "#e6e6e626",
				strokeColor: "#666666"
			}
		],
		showQuadrantLabels: false
	},

	// Example 31: Complex star-like polygon
	{
		type: "polygonGraph",
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: -7.5,
				y: 0,
				id: "P1",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 6.5,
				id: "P2",
				label: "",
				style: "closed"
			},
			{
				x: 5.5,
				y: 5.5,
				id: "P3",
				label: "",
				style: "closed"
			},
			{
				x: 6.5,
				y: 0,
				id: "P4",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: -4.5,
				id: "P5",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["P1", "P3", "P5", "P2", "P4"],
				fillColor: "#4a90e240",
				strokeColor: "#4A90E2"
			}
		],
		showQuadrantLabels: false
	},

	// Example 32: Regular pentagon
	{
		type: "polygonGraph",
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: -7.5,
				y: 0,
				id: "P1",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 6.5,
				id: "P2",
				label: "",
				style: "closed"
			},
			{
				x: 5.5,
				y: 5.5,
				id: "P3",
				label: "",
				style: "closed"
			},
			{
				x: 6.5,
				y: 0,
				id: "P4",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: -4.5,
				id: "P5",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["P1", "P2", "P3", "P4", "P5"],
				fillColor: "#4a90e240",
				strokeColor: "#4A90E2"
			}
		],
		showQuadrantLabels: false
	},

	// Example 33: Pentagon with adjusted point
	{
		type: "polygonGraph",
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: -7.5,
				y: 0,
				id: "P1",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 6.5,
				id: "P2",
				label: "",
				style: "closed"
			},
			{
				x: 5.5,
				y: 4.5,
				id: "P3",
				label: "",
				style: "closed"
			},
			{
				x: 6.5,
				y: 0,
				id: "P4",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: -4.5,
				id: "P5",
				label: "",
				style: "closed"
			}
		],
		polygons: [
			{
				label: "",
				isClosed: true,
				vertices: ["P1", "P2", "P3", "P4", "P5"],
				fillColor: "#4a90e240",
				strokeColor: "#4A90E2"
			}
		],
		showQuadrantLabels: false
	}
]
