import type { FunctionPlotGraphProps } from "@/widgets/generators/function-plot-graph"

// Valid examples for the Function Plot Graph widget
export const functionPlotGraphExamples: FunctionPlotGraphProps[] = [
	{
		type: "functionPlotGraph",
		width: 500,
		height: 500,
		xAxis: {
			label: "x",
			min: -5,
			max: 5,
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			label: "y",
			min: -10,
			max: 10,
			tickInterval: 2,
			showGridLines: true
		},
		showQuadrantLabels: true,
		polylines: [
			{
				type: "points",
				id: "polyline_parabola",
				points: [
					{ x: -4, y: 8 },
					{ x: -3, y: 4.5 },
					{ x: -2, y: 2 },
					{ x: -1, y: 0.5 },
					{ x: 0, y: 0 },
					{ x: 1, y: 0.5 },
					{ x: 2, y: 2 },
					{ x: 3, y: 4.5 },
					{ x: 4, y: 8 }
				],
				color: "#2563eb",
				style: "solid",
				label: null
			}
		],
		points: [
			{ id: "origin", x: 0, y: 0, label: "O", style: "closed" },
			{ id: "point1", x: -2, y: 2, label: "A", style: "closed" },
			{ id: "point2", x: 2, y: 2, label: "B", style: "closed" }
		]
	},
	{
		type: "functionPlotGraph",
		width: 500,
		height: 400,
		xAxis: {
			label: "Time (s)",
			min: 0,
			max: 10,
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			label: "Position (m)",
			min: -5,
			max: 5,
			tickInterval: 1,
			showGridLines: true
		},
		showQuadrantLabels: false,
		polylines: [
			{
				type: "points",
				id: "polyline_motion",
				points: [
					{ x: 0, y: 0 },
					{ x: 1, y: 2 },
					{ x: 2, y: 3 },
					{ x: 3, y: 3.5 },
					{ x: 4, y: 3 },
					{ x: 5, y: 2 },
					{ x: 6, y: 0 },
					{ x: 7, y: -2 },
					{ x: 8, y: -3 },
					{ x: 9, y: -2 },
					{ x: 10, y: 0 }
				],
				color: "#059669",
				style: "solid",
				label: null
			}
		],
		points: [
			{ id: "max", x: 3, y: 3.5, label: "Max", style: "closed" },
			{ id: "min", x: 8, y: -3, label: "Min", style: "closed" }
		]
	},
	{
		type: "functionPlotGraph",
		width: 400,
		height: 400,
		xAxis: {
			label: "x",
			min: -3,
			max: 3,
			tickInterval: 0.5,
			showGridLines: false
		},
		yAxis: {
			label: "f(x)",
			min: -2,
			max: 8,
			tickInterval: 1,
			showGridLines: false
		},
		showQuadrantLabels: false,
		polylines: [
			{
				type: "points",
				id: "polyline_quadratic",
				points: [
					{ x: -3, y: 9 },
					{ x: -2.5, y: 6.25 },
					{ x: -2, y: 4 },
					{ x: -1.5, y: 2.25 },
					{ x: -1, y: 1 },
					{ x: -0.5, y: 0.25 },
					{ x: 0, y: 0 },
					{ x: 0.5, y: 0.25 },
					{ x: 1, y: 1 },
					{ x: 1.5, y: 2.25 },
					{ x: 2, y: 4 },
					{ x: 2.5, y: 6.25 },
					{ x: 3, y: 9 }
				],
				color: "#7c3aed",
				style: "solid",
				label: null
			}
		],
		points: []
	},
	{
		type: "functionPlotGraph",
		width: 500,
		height: 500,
		xAxis: {
			label: "x",
			min: -3,
			max: 3,
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			label: "f(x)",
			min: -5,
			max: 15,
			tickInterval: 2,
			showGridLines: true
		},
		showQuadrantLabels: false,
		polylines: [
			{
				type: "function",
				id: "polyline_cubic",
				coefficients: [1, 0, -4, 0], // x³ - 4x
				xRange: { min: -3, max: 3 },

				color: "#dc2626",
				style: "solid",
				label: "y = x³ - 4x"
			},
			{
				type: "function",
				id: "polyline_quadratic",
				coefficients: [1, 0, 0], // x²
				xRange: { min: -2.5, max: 2.5 },

				color: "#2563eb",
				style: "dashed",
				label: "y = x²"
			}
		],
		points: [
			{ id: "origin", x: 0, y: 0, label: "O", style: "closed" },
			{ id: "root1", x: -2, y: 0, label: "(-2,0)", style: "closed" },
			{ id: "root2", x: 2, y: 0, label: "(2,0)", style: "closed" }
		]
	},
	// Function-based versions of the original 3 examples
	{
		type: "functionPlotGraph",
		width: 500,
		height: 500,
		xAxis: {
			label: "x",
			min: -5,
			max: 5,
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			label: "y",
			min: -10,
			max: 10,
			tickInterval: 2,
			showGridLines: true
		},
		showQuadrantLabels: true,
		polylines: [
			{
				type: "function",
				id: "polyline_parabola_func",
				coefficients: [0.5, 0, 0], // 0.5x²
				xRange: { min: -4, max: 4 },

				color: "#2563eb",
				style: "solid",
				label: "y = 0.5x²"
			}
		],
		points: [
			{ id: "origin", x: 0, y: 0, label: "O", style: "closed" },
			{ id: "point1", x: -2, y: 2, label: "A", style: "closed" },
			{ id: "point2", x: 2, y: 2, label: "B", style: "closed" }
		]
	},
	{
		type: "functionPlotGraph",
		width: 400,
		height: 400,
		xAxis: {
			label: "x",
			min: -3,
			max: 3,
			tickInterval: 0.5,
			showGridLines: false
		},
		yAxis: {
			label: "f(x)",
			min: -2,
			max: 8,
			tickInterval: 1,
			showGridLines: false
		},
		showQuadrantLabels: false,
		polylines: [
			{
				type: "function",
				id: "polyline_quadratic_func",
				coefficients: [1, 0, 0], // x²
				xRange: { min: -3, max: 3 },

				color: "#7c3aed",
				style: "solid",
				label: "y = x²"
			}
		],
		points: []
	}
]
