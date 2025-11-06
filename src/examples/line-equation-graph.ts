import type { LineEquationGraphProps } from "@/widgets/generators/line-equation-graph"

// Valid examples for the Line Equation Graph widget
export const lineEquationGraphExamples: LineEquationGraphProps[] = [
	// Example 1: line "p" with positive slope
	{
		type: "lineEquationGraph",
		width: 500,
		height: 500,
		xAxis: {
			label: "r",
			min: -10,
			max: 10,
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
		showQuadrantLabels: false,
		lines: [
			{
				id: "line_p",
				equation: { type: "slopeIntercept", slope: 2, yIntercept: 2 },
				color: "#1fb6ff",
				style: "solid",
				label: "p"
			}
		],
		points: []
	},
	// Example 2: line "q" shallow positive slope, negative intercept
	{
		type: "lineEquationGraph",
		width: 500,
		height: 500,
		xAxis: {
			label: "t",
			min: -10,
			max: 10,
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
		showQuadrantLabels: false,
		lines: [
			{
				id: "line_q",
				equation: { type: "slopeIntercept", slope: 0.75, yIntercept: -6 },
				color: "#14b8a6",
				style: "solid",
				label: "q"
			}
		],
		points: []
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_7x_minus_y_eq_7",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					A: 7,
					B: -1,
					C: 7,
					type: "standard"
				}
			},
			{
				id: "line_x_plus_2y_eq_6",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 2,
					C: 6,
					type: "standard"
				}
			}
		],
		width: 345,
		xAxis: {
			max: 7,
			min: -7,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 7,
			min: -7,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [
			{
				x: 0,
				y: -7,
				id: "p_7xmy_yint",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 0,
				id: "p_7xmy_xint",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 3,
				id: "p_xp2y_yint",
				label: "",
				style: "closed"
			},
			{
				x: 6,
				y: 0,
				id: "p_xp2y_xint",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_neg7x_minus2y_eq_14",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3.5,
					yIntercept: -7
				}
			},
			{
				id: "line_6x_plus6y_eq_18",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: 3
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_neg7x_minus2y_eq_14",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3.5,
					yIntercept: -7
				}
			},
			{
				id: "line_6x_plus6y_eq_18",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: 3
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [
			{
				x: -4,
				y: 7,
				id: "pt_intersection",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_neg7x_minus2y_eq_14",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3.5,
					yIntercept: -7
				}
			},
			{
				id: "line_6x_plus6y_eq_18",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: 3
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [
			{
				x: -3,
				y: 6,
				id: "pt_not_intersection",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_eq1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					A: -8,
					B: 4,
					C: 24,
					type: "standard"
				}
			},
			{
				id: "line_eq2",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					A: -7,
					B: 7,
					C: 28,
					type: "standard"
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [
			{
				x: -3,
				y: 0,
				id: "p_eq1_xint",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 6,
				id: "p_eq1_yint",
				label: "",
				style: "closed"
			},
			{
				x: -4,
				y: 0,
				id: "p_eq2_xint",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 4,
				id: "p_eq2_yint",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_eq1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					A: -8,
					B: 4,
					C: 24,
					type: "standard"
				}
			},
			{
				id: "line_eq2",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					A: -7,
					B: 7,
					C: 28,
					type: "standard"
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [
			{
				x: -3,
				y: 0,
				id: "p_eq1_xint",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 6,
				id: "p_eq1_yint",
				label: "",
				style: "closed"
			},
			{
				x: -4,
				y: 0,
				id: "p_eq2_xint",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 4,
				id: "p_eq2_yint",
				label: "",
				style: "closed"
			},
			{
				x: -2,
				y: 2,
				id: "p_intersection",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_eq1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					A: -8,
					B: 4,
					C: 24,
					type: "standard"
				}
			},
			{
				id: "line_eq2",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					A: -7,
					B: 7,
					C: 28,
					type: "standard"
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [
			{
				x: -3,
				y: 0,
				id: "p_eq1_xint",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 6,
				id: "p_eq1_yint",
				label: "",
				style: "closed"
			},
			{
				x: -4,
				y: 0,
				id: "p_eq2_xint",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 4,
				id: "p_eq2_yint",
				label: "",
				style: "closed"
			},
			{
				x: -2,
				y: -2,
				id: "p_wrong_point",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -2
				}
			},
			{
				id: "line_2",
				color: "#FF00AF",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: -6
				}
			}
		],
		width: 400,
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
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -2
				}
			},
			{
				id: "line_2",
				color: "#FF00AF",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: -6
				}
			}
		],
		width: 400,
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
		height: 400,
		points: [
			{
				x: -2,
				y: -4,
				id: "p_intersection",
				label: "P",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -2
				}
			},
			{
				id: "line_2",
				color: "#FF00AF",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: -6
				}
			}
		],
		width: 400,
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
		height: 400,
		points: [
			{
				x: -2,
				y: 4,
				id: "p_wrong",
				label: "P",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -7,
					yIntercept: -3
				}
			},
			{
				id: "line_a2",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: -3
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -7,
					yIntercept: 3
				}
			},
			{
				id: "line_b2",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: -3
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 7,
					yIntercept: 3
				}
			},
			{
				id: "line_c2",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: 3
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_blue",
				color: "#6495ED",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -4,
					yIntercept: -3
				}
			},
			{
				id: "line_magenta",
				color: "#FF00AF",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2,
					yIntercept: 1
				}
			}
		],
		width: 300,
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
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_y_eq_x_minus_4",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -4
				}
			},
			{
				id: "line_y_eq_4x_plus_2",
				color: "#ca337c",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: 2
				}
			}
		],
		width: 300,
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
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_y_eq_x_minus_4",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -4
				}
			},
			{
				id: "line_y_eq_4x_plus_2",
				color: "#ca337c",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: 2
				}
			}
		],
		width: 300,
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
		height: 300,
		points: [
			{
				x: -2,
				y: -6,
				id: "pt_intersection",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_y_eq_x_minus_4",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -4
				}
			},
			{
				id: "line_y_eq_4x_plus_2",
				color: "#ca337c",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: 2
				}
			}
		],
		width: 300,
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
		height: 300,
		points: [
			{
				x: -2,
				y: 6,
				id: "pt_wrong",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_negative_slope",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2,
					yIntercept: -5
				}
			},
			{
				id: "line_positive_slope",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: -2
				}
			}
		],
		width: 400,
		xAxis: {
			max: 7,
			min: -7,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 7,
			min: -7,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: -5,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: -7,
				id: "p2",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: -2,
				id: "p3",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 0,
				id: "p4",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_l1_correct",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3,
					yIntercept: 6
				}
			},
			{
				id: "line_l2_wrong",
				color: "#ca337c",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: 2
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [
			{
				x: 0,
				y: 6,
				id: "p_l1_yint",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 0,
				id: "p_l1_xint",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 2,
				id: "p_l2_yint",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 0,
				id: "p_l2_xint",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_21x7y42",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3,
					yIntercept: 6
				}
			},
			{
				id: "line_neg5x5y10",
				color: "#ca337c",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 2
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [
			{
				x: 0,
				y: 6,
				id: "p1_l1_yint",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 0,
				id: "p2_l1_xint",
				label: "",
				style: "closed"
			},
			{
				x: -2,
				y: 0,
				id: "p3_l2_xint",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 2,
				id: "p4_l2_yint",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 3,
				id: "p_intersection",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_l1_wrong",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2,
					yIntercept: 6
				}
			},
			{
				id: "line_l2_correct",
				color: "#ca337c",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 2
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [
			{
				x: 0,
				y: 6,
				id: "p_l1_wrong_yint",
				label: "",
				style: "closed"
			},
			{
				x: 3,
				y: 0,
				id: "p_l1_wrong_xint",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 2,
				id: "p_l2_yint",
				label: "",
				style: "closed"
			},
			{
				x: -2,
				y: 0,
				id: "p_l2_xint",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_y_4x_minus_2",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: -2
				}
			},
			{
				id: "line_y_x_plus_3",
				color: "#ca337c",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 3
				}
			}
		],
		width: 400,
		xAxis: {
			max: 7,
			min: -7,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 7,
			min: -7,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 3
				}
			},
			{
				id: "line_2",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.2857142857,
					yIntercept: 2
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [
			{
				x: -3,
				y: 0,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 3,
				id: "p2",
				label: "",
				style: "closed"
			},
			{
				x: -7,
				y: 0,
				id: "p3",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 2,
				id: "p4",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					A: 11,
					B: -5,
					C: 275,
					type: "standard"
				}
			}
		],
		width: 424,
		xAxis: {
			max: 30,
			min: -10,
			label: "x-axis",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -60,
			label: "y-axis",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.75,
					yIntercept: -6
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [
			{
				x: 0,
				y: -6,
				id: "y_intercept",
				label: "",
				style: "closed"
			},
			{
				x: -8,
				y: 0,
				id: "x_intercept",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 100
				}
			}
		],
		width: 424,
		xAxis: {
			max: 100,
			min: -300,
			label: "",
			tickInterval: 50,
			showGridLines: true
		},
		yAxis: {
			max: 150,
			min: -50,
			label: "",
			tickInterval: 25,
			showGridLines: true
		},
		height: 424,
		points: [
			{
				x: -250,
				y: 0,
				id: "x_intercept_point",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 100,
				id: "y_intercept_point",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					A: 2,
					B: -9,
					C: 9,
					type: "standard"
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -4,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [
			{
				x: 4.5,
				y: 0,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: -1,
				id: "p2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_main",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.7142857142857143,
					yIntercept: 2.5
				}
			}
		],
		width: 424,
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
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.375,
					yIntercept: 15
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -50,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 20,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [
			{
				x: -40,
				y: 0,
				id: "x_intercept_point",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 15,
				id: "y_intercept_point",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.3333333333333333,
					yIntercept: 0.4
				}
			}
		],
		width: 424,
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
		height: 424,
		points: [
			{
				x: 0,
				y: 0.4,
				id: "y_intercept_point",
				label: "",
				style: "closed"
			},
			{
				x: 0.3,
				y: 0,
				id: "x_intercept_point",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -4.5,
					yIntercept: -45
				}
			}
		],
		width: 424,
		xAxis: {
			max: 12,
			min: -12,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -50,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [
			{
				x: -10,
				y: 0,
				id: "point_x_intercept",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: -45,
				id: "point_y_intercept",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.5833333333333334,
					yIntercept: -0.7
				}
			}
		],
		width: 424,
		xAxis: {
			max: 2,
			min: -2,
			label: "",
			tickInterval: 0.1,
			showGridLines: true
		},
		yAxis: {
			max: 2,
			min: -2,
			label: "",
			tickInterval: 0.1,
			showGridLines: true
		},
		height: 424,
		points: [
			{
				x: -1.2,
				y: 0,
				id: "x_intercept",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: -0.7,
				id: "y_intercept",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2.2,
					yIntercept: 275
				}
			}
		],
		width: 424,
		xAxis: {
			max: 150,
			min: 0,
			label: "",
			tickInterval: 25,
			showGridLines: true
		},
		yAxis: {
			max: 300,
			min: 0,
			label: "",
			tickInterval: 25,
			showGridLines: true
		},
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: "",
				style: "solid",
				equation: {
					A: 10,
					B: -3,
					C: 30,
					type: "standard"
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 6,
			min: -14,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [
			{
				x: 3,
				y: 0,
				id: "p_x_int",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: -10,
				id: "p_y_int",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.2857142857142857,
					yIntercept: 2
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [
			{
				x: -7,
				y: 0,
				id: "p_x_intercept",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: 2,
				id: "p_y_intercept",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.7333333333333333,
					yIntercept: 5.5
				}
			}
		],
		width: 424,
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
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_satellite",
				color: "#d00000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 17,
					yIntercept: 0
				}
			}
		],
		width: 500,
		xAxis: {
			max: 3,
			min: 0,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "d",
			tickInterval: 5,
			showGridLines: true
		},
		height: 500,
		points: [
			{
				x: 0,
				y: 0,
				id: "p0",
				label: "(0, 0)",
				style: "closed"
			},
			{
				x: 2,
				y: 34,
				id: "p1",
				label: "(2, 34)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_ideal_rate",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 70,
					yIntercept: 0
				}
			}
		],
		width: 475,
		xAxis: {
			max: 4,
			min: 0,
			label: "Minutes",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 200,
			min: 0,
			label: "Beats",
			tickInterval: 20,
			showGridLines: true
		},
		height: 450,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_deepak",
				color: "#4da6ff",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.6,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "c",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_big_deal",
				color: "#4A90E2",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.5,
					yIntercept: 0
				}
			}
		],
		width: 475,
		xAxis: {
			max: 1000,
			min: 0,
			label: "Big Deal's Sale",
			tickInterval: 100,
			showGridLines: true
		},
		yAxis: {
			max: 1000,
			min: 0,
			label: "",
			tickInterval: 100,
			showGridLines: true
		},
		height: 475,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#3b7dd8",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 200,
					yIntercept: 0
				}
			}
		],
		width: 500,
		xAxis: {
			max: 5,
			min: 0,
			label: "t (hours)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 250,
			min: 0,
			label: "d (miles)",
			tickInterval: 25,
			showGridLines: true
		},
		height: 500,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#4F8BFF",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3.5,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_dollar_city",
				color: "#5B8FD9",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.2,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 10,
			min: 0,
			label: "Dollar City's Sale",
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
		height: 475,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#d62020",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.2,
					yIntercept: 0
				}
			}
		],
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
		height: 475,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#2bb673",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.8,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 40,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 5,
			min: 0,
			label: "",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 200,
			min: 0,
			label: "",
			tickInterval: 50,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: " ",
				style: "closed"
			},
			{
				x: 1,
				y: 40,
				id: "point_1",
				label: " ",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.6666666666666666,
					yIntercept: 0
				}
			}
		],
		width: 325,
		xAxis: {
			max: 6,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 6,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 3,
				y: 2,
				id: "p1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: 0
				}
			}
		],
		width: 325,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 1,
				y: 4,
				id: "p1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 0
				}
			}
		],
		width: 325,
		xAxis: {
			max: 6,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 6,
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
				id: "p_2_4",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_proportional",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.5,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 4.5,
			min: 0,
			label: "",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 4.5,
			min: 0,
			label: "",
			tickInterval: 0.5,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 0.5,
				id: "point_1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#11accd",
				label: "A",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: 0
				}
			},
			{
				id: "line_b",
				color: "#1fab54",
				label: "B",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 0
				}
			},
			{
				id: "line_c",
				color: "#7854ab",
				label: "C",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.5,
					yIntercept: 0
				}
			}
		],
		width: 325,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 325,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_A",
				color: "#11accd",
				label: "A",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 0
				}
			},
			{
				id: "line_B",
				color: "#1fab54",
				label: "B",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 0
				}
			},
			{
				id: "line_C",
				color: "#7854ab",
				label: "C",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.5,
					yIntercept: 0
				}
			}
		],
		width: 325,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 325,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_A",
				color: "#11accd",
				label: "A",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 0
				}
			},
			{
				id: "line_B",
				color: "#1fab54",
				label: "B",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.25,
					yIntercept: 0
				}
			},
			{
				id: "line_C",
				color: "#7854ab",
				label: "C",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.25,
					yIntercept: 0
				}
			}
		],
		width: 325,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 325,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					A: 3,
					B: -4,
					C: 0,
					type: "standard"
				}
			}
		],
		width: 325,
		xAxis: {
			max: 6,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 6,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 4,
				y: 3,
				id: "pt_4_3",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_p",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					A: 3,
					B: -1,
					C: 0,
					type: "standard"
				}
			}
		],
		width: 325,
		xAxis: {
			max: 6,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 6,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 1,
				y: 3,
				id: "pt_1_3",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					A: 3,
					B: -2,
					C: 0,
					type: "standard"
				}
			}
		],
		width: 325,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 4,
				y: 6,
				id: "pt_1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 0
				}
			}
		],
		width: 325,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 6,
				y: 6,
				id: "point_1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					A: 1,
					B: -5,
					C: 0,
					type: "standard"
				}
			}
		],
		width: 325,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 325,
		points: [
			{
				x: 5,
				y: 1,
				id: "pt_5_1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_A",
				color: "#11accd",
				label: "A",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: 0
				}
			},
			{
				id: "line_B",
				color: "#1fab54",
				label: "B",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 0
				}
			},
			{
				id: "line_C",
				color: "#7854ab",
				label: "C",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.25,
					yIntercept: 0
				}
			}
		],
		width: 325,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 325,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_proportional",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3.5,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin_point",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 3.5,
				id: "key_point",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#11accd",
				label: "A",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 0
				}
			},
			{
				id: "line_b",
				color: "#1fab54",
				label: "B",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: 0
				}
			},
			{
				id: "line_c",
				color: "#7854ab",
				label: "C",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 0
				}
			}
		],
		width: 325,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 325,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_proportional",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 8,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 4,
				id: "point_1_4",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					x1: 3,
					y1: 0,
					type: "pointSlope",
					slope: 1.5
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					A: 4,
					B: -5,
					C: -8,
					type: "standard"
				}
			}
		],
		width: 345,
		xAxis: {
			max: 6,
			min: -6,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 6,
			min: -6,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: 2
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: -2
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_main",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					A: 4,
					B: 5,
					C: -7,
					type: "standard"
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3,
					yIntercept: 4
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					A: 2,
					B: 3,
					C: 9,
					type: "standard"
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.75,
					yIntercept: -1
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [
			{
				x: 0,
				y: -1,
				id: "p_left",
				label: "",
				style: "open"
			},
			{
				x: 4,
				y: 2,
				id: "p_right",
				label: "",
				style: "open"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					A: 3,
					B: 4,
					C: -1,
					type: "standard"
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					A: 8,
					B: -5,
					C: -12,
					type: "standard"
				}
			}
		],
		width: 345,
		xAxis: {
			max: 6,
			min: -6,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 6,
			min: -6,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [
			{
				x: -4,
				y: -4,
				id: "p_left",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 4,
				id: "p_right",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.75,
					yIntercept: -1.25
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2,
					yIntercept: 2
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					x1: -2,
					y1: 0,
					type: "pointSlope",
					slope: 3
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.5,
					yIntercept: 3
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: -3
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_main",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.5,
					yIntercept: 2
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -3
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_main",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.6666666667,
					yIntercept: 1.3333333333
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.3333333333333333,
					yIntercept: 0.6666666666666666
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.75,
					yIntercept: -1.25
				}
			}
		],
		width: 345,
		xAxis: {
			max: 6,
			min: -6,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 6,
			min: -6,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_main",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: -3,
					C: 5,
					type: "standard"
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_main",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2.6666666666666665,
					yIntercept: 6.666666666666667
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.5,
					yIntercept: 3.5
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 1
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					A: 3,
					B: 1,
					C: -3,
					type: "standard"
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 0
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					A: 8,
					B: 5,
					C: 12,
					type: "standard"
				}
			}
		],
		width: 345,
		xAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [
			{
				x: -1,
				y: 4,
				id: "p_left",
				label: "",
				style: "open"
			},
			{
				x: 4,
				y: -4,
				id: "p_right",
				label: "",
				style: "open"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a1",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 0
				}
			}
		],
		width: 400,
		xAxis: {
			max: 8,
			min: 0,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin_a",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b1",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: 3
				}
			}
		],
		width: 400,
		xAxis: {
			max: 8,
			min: 0,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 3,
				id: "point_b_start",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_choice_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.25,
					yIntercept: 0
				}
			}
		],
		width: 400,
		xAxis: {
			max: 8,
			min: 0,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin_a",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_choice_b",
				color: "#9467bd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.2,
					yIntercept: 0
				}
			}
		],
		width: 400,
		xAxis: {
			max: 8,
			min: 0,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin_b",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a1",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 0
				}
			}
		],
		width: 400,
		xAxis: {
			max: 8,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin_dot",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b1",
				color: "#8e44ad",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.75,
					yIntercept: 2
				}
			}
		],
		width: 400,
		xAxis: {
			max: 8,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 2,
				id: "y_intercept_dot",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: -3,
					C: -15,
					type: "standard"
				}
			}
		],
		width: 500,
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
		height: 500,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 3,
					C: 15,
					type: "standard"
				}
			}
		],
		width: 500,
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
		height: 500,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 3,
					C: 12,
					type: "standard"
				}
			}
		],
		width: 500,
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
		height: 500,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: -5
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: -9
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -4,
					yIntercept: -9
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 5
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2,
					yIntercept: 5
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2,
					yIntercept: 3
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.8,
					yIntercept: 7
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.8,
					yIntercept: -7
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.8,
					yIntercept: -7
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					A: 3,
					B: -5,
					C: 45,
					type: "standard"
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					A: 5,
					B: -3,
					C: 27,
					type: "standard"
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					A: 5,
					B: -3,
					C: -27,
					type: "standard"
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -4
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 4
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 4
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a1",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3,
					yIntercept: -7
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b1",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3,
					yIntercept: 7
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c1",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: 7
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#2252C1",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.3333333333333333,
					yIntercept: 8
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#2252C1",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.3333333333333333,
					yIntercept: 8
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#2252C1",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.3333333333333333,
					yIntercept: 6
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a1",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.75,
					yIntercept: -2
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b1",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.75,
					yIntercept: 2
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c1",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.75,
					yIntercept: 2
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 7
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: -7
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2,
					yIntercept: -7
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.5,
					yIntercept: 3
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.5,
					yIntercept: -3
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.5,
					yIntercept: -3
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -6
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: -6
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: 6
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.6666666667,
					yIntercept: -4
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 2,
					B: -3,
					C: 12,
					type: "standard"
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.6666666667,
					yIntercept: 4
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.8333333333333334,
					yIntercept: 1
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.2,
					yIntercept: 1
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.2,
					yIntercept: 1
				}
			}
		],
		width: 428,
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
		height: 428,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.25,
					yIntercept: 6
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.25,
					yIntercept: 6
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.25,
					yIntercept: -6
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_profit",
				color: "#3b82f6",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -8
				}
			}
		],
		width: 425,
		xAxis: {
			max: 21,
			min: -2,
			label: "n",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 13,
			min: -9,
			label: "P",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -5,
					yIntercept: -1
				}
			},
			{
				id: "line_2",
				color: "#FF00AF",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -5,
					yIntercept: 7
				}
			}
		],
		width: 300,
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
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [],
		width: 300,
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
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_y_eq_x_plus_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 1
				}
			},
			{
				id: "line_y_eq_2x_minus_5",
				color: "#ca337c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: -5
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [
			{
				x: 0,
				y: 1,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 2,
				id: "p2",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: -5,
				id: "p3",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: -3,
				id: "p4",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [],
		width: 300,
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
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [],
		width: 300,
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
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_second_plant",
				color: "#6495ED",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.8,
					yIntercept: 30
				}
			}
		],
		width: 468,
		xAxis: {
			max: 24,
			min: 0,
			label: "Time (days)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "Height (centimeters)",
			tickInterval: 2,
			showGridLines: true
		},
		height: 456,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_henry",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 25,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 250,
			min: 0,
			label: "Water (liters)",
			tickInterval: 25,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 0,
				y: 0,
				id: "p0",
				label: "",
				style: "closed"
			},
			{
				x: 8,
				y: 200,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: 10,
				y: 250,
				id: "p2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_stove_2",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.75,
					yIntercept: 200
				}
			}
		],
		width: 300,
		xAxis: {
			max: 100,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 10,
			showGridLines: true
		},
		yAxis: {
			max: 220,
			min: 0,
			label: "Temperature (degrees Celsius)",
			tickInterval: 10,
			showGridLines: true
		},
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_engine2",
				color: "#6495ED",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.2,
					yIntercept: 22
				}
			}
		],
		width: 468,
		xAxis: {
			max: 25,
			min: 0,
			label: "Rotation (cycles per second)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "Temperature (degrees Celsius)",
			tickInterval: 2,
			showGridLines: true
		},
		height: 456,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_second_wrestler",
				color: "#6495ED",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 75
				}
			}
		],
		width: 468,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time (months)",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 130,
			min: 0,
			label: "Weight (kilograms)",
			tickInterval: 5,
			showGridLines: true
		},
		height: 456,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_mrs_smith",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.15,
					yIntercept: 4.5
				}
			}
		],
		width: 468,
		xAxis: {
			max: 50,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: 0,
			label: "Distance (kilometers)",
			tickInterval: 0.25,
			showGridLines: true
		},
		height: 456,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_zeus",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: 15
				}
			}
		],
		width: 300,
		xAxis: {
			max: 50,
			min: 0,
			label: "Height (centimeters)",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 200,
			min: 0,
			label: "Loudness (decibels)",
			tickInterval: 10,
			showGridLines: true
		},
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_second_sawmill",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 18,
					yIntercept: 20
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "Length (meters)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 120,
			min: 0,
			label: "Price (dollars)",
			tickInterval: 10,
			showGridLines: true
		},
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_alexandra",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 6,
					yIntercept: -240
				}
			}
		],
		width: 468,
		xAxis: {
			max: 100,
			min: 0,
			label: "Spices sold (kilograms)",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 390,
			min: -300,
			label: "Weekly profit (dollars)",
			tickInterval: 30,
			showGridLines: true
		},
		height: 432,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_manitoba",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.75,
					yIntercept: -8
				}
			}
		],
		width: 468,
		xAxis: {
			max: 20,
			min: 0,
			label: "Time (years)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "Balance (millions of dollars)",
			tickInterval: 1,
			showGridLines: true
		},
		height: 440,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_second_car_cost",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 140
				}
			}
		],
		width: 468,
		xAxis: {
			max: 600,
			min: 0,
			label: "Distance (kilometers)",
			tickInterval: 25,
			showGridLines: true
		},
		yAxis: {
			max: 400,
			min: 0,
			label: "Price (dollars)",
			tickInterval: 20,
			showGridLines: true
		},
		height: 456,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_wage",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 40,
					yIntercept: 0
				}
			}
		],
		width: 480,
		xAxis: {
			max: 10,
			min: 0,
			label: "Hours worked",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 440,
			min: 0,
			label: "Earnings (dollars)",
			tickInterval: 40,
			showGridLines: true
		},
		height: 480,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 40,
				id: "one_hour_point",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_price",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: 0
				}
			}
		],
		width: 480,
		xAxis: {
			max: 5,
			min: 0,
			label: "Weight (kilograms)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Total cost (dollars)",
			tickInterval: 2,
			showGridLines: true
		},
		height: 480,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: " ",
				style: "closed"
			},
			{
				x: 1,
				y: 3,
				id: "pt_1_3",
				label: " ",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_cost",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 6,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 5,
			min: 0,
			label: "Square meters of fabric",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "Total cost (dollars)",
			tickInterval: 2,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: "",
				style: "closed"
			},
			{
				x: 4,
				y: 24,
				id: "point_4_24",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_price",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.5,
					yIntercept: 0
				}
			}
		],
		width: 480,
		xAxis: {
			max: 10,
			min: 0,
			label: "Liters of gas",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Total cost (dollars)",
			tickInterval: 1,
			showGridLines: true
		},
		height: 480,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 1.5,
				id: "unit_rate_point",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_speed",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 80,
					yIntercept: 0
				}
			}
		],
		width: 480,
		xAxis: {
			max: 3,
			min: 0,
			label: "Time (hours)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 280,
			min: 0,
			label: "Distance (kilometers)",
			tickInterval: 40,
			showGridLines: true
		},
		height: 480,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 80,
				id: "point_1_80",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_proportional",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 7,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 80,
			min: 0,
			label: "Liters of water",
			tickInterval: 10,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 5,
				y: 35,
				id: "point_A",
				label: "A",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_cost",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 30,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 10,
			min: 0,
			label: "Number of hours",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 160,
			min: 0,
			label: "Total cost (dollars)",
			tickInterval: 20,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 4,
				y: 120,
				id: "A",
				label: "A",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_proportional",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 5,
			min: 0,
			label: "Time (hours)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 15,
			min: 0,
			label: "Distance (kilometers)",
			tickInterval: 5,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 3,
				y: 7.5,
				id: "pt_3_7_5",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_relationship",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 12,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 3,
			min: 0,
			label: "Time open parenthesis hours close parenthesis",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 40,
			min: 0,
			label:
				"Length of necklace open parenthesis centimeters close parenthesis",
			tickInterval: 4,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 24,
				id: "p_2_24",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_cashews",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 30,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 3,
			min: 0,
			label: "Mass (kilograms)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 120,
			min: 0,
			label: "Total cost (dollars)",
			tickInterval: 20,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 60,
				id: "p_2_60",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_cost",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 28,
			min: 0,
			label: "Distance (kilometers)",
			tickInterval: 4,
			showGridLines: true
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Total cost (dollars)",
			tickInterval: 2,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 20,
				y: 8,
				id: "point_A",
				label: "A",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_recipe",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.5,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 10,
			min: 0,
			label: "Cups of tomato sauce",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "cups of tomato paste",
			tickInterval: 1,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 0,
				y: 0,
				id: "p_origin",
				label: " ",
				style: "closed"
			},
			{
				x: 8,
				y: 4,
				id: "p_8_4",
				label: " ",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_through_origin",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 15,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 5,
			min: 0,
			label: "Time (hours)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Length of fencing (meters)",
			tickInterval: 20,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: "",
				style: "closed"
			},
			{
				x: 4,
				y: 60,
				id: "point_A",
				label: "A",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_balloon",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 20,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 5,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 120,
			min: 0,
			label: "Height (meters)",
			tickInterval: 20,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 0,
				y: 0,
				id: "origin",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 40,
				id: "p_2_40",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_rental_cost",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 40,
					yIntercept: 0
				}
			}
		],
		width: 360,
		xAxis: {
			max: 7,
			min: 1,
			label: "Rental days",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 350,
			min: 50,
			label: "Total cost (dollars)",
			tickInterval: 50,
			showGridLines: true
		},
		height: 360,
		points: [
			{
				x: 5,
				y: 200,
				id: "A",
				label: "A",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 12,
					yIntercept: -360
				}
			}
		],
		width: 400,
		xAxis: {
			max: 65,
			min: 0,
			label: "",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 420,
			min: -360,
			label: "",
			tickInterval: 60,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -12,
					yIntercept: 360
				}
			}
		],
		width: 400,
		xAxis: {
			max: 65,
			min: 0,
			label: "",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 420,
			min: -360,
			label: "",
			tickInterval: 60,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -12,
					yIntercept: 300
				}
			}
		],
		width: 400,
		xAxis: {
			max: 65,
			min: 0,
			label: "",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 420,
			min: -360,
			label: "",
			tickInterval: 60,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#cc3333",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: 30
				}
			}
		],
		width: 400,
		xAxis: {
			max: 100,
			min: 0,
			label: "Time (seconds)",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 400,
			min: 0,
			label: "Files (megabytes)",
			tickInterval: 20,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 30,
				id: "a_pt1",
				label: "",
				style: "closed"
			},
			{
				x: 10,
				y: 70,
				id: "a_pt2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: 60
				}
			}
		],
		width: 400,
		xAxis: {
			max: 100,
			min: 0,
			label: "Time (seconds)",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 400,
			min: 0,
			label: "Files (megabytes)",
			tickInterval: 20,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 60,
				id: "b_pt1",
				label: "",
				style: "closed"
			},
			{
				x: 10,
				y: 100,
				id: "b_pt2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#2e8b57",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 60
				}
			}
		],
		width: 400,
		xAxis: {
			max: 100,
			min: 0,
			label: "Time (seconds)",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 400,
			min: 0,
			label: "Files (megabytes)",
			tickInterval: 20,
			showGridLines: true
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 60,
				id: "c_pt1",
				label: "",
				style: "closed"
			},
			{
				x: 10,
				y: 80,
				id: "c_pt2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 7.5,
					yIntercept: 10
				}
			}
		],
		width: 400,
		xAxis: {
			max: 15,
			min: -2,
			label: "Time in minutes",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 85,
			min: -15,
			label: "Temperature in degrees Celsius",
			tickInterval: 5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 7.5,
					yIntercept: -10
				}
			}
		],
		width: 400,
		xAxis: {
			max: 15,
			min: -2,
			label: "Time in minutes",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 85,
			min: -15,
			label: "Temperature in degrees Celsius",
			tickInterval: 5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 20
				}
			}
		],
		width: 400,
		xAxis: {
			max: 15,
			min: -2,
			label: "Time in minutes",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 85,
			min: -15,
			label: "Temperature in degrees Celsius",
			tickInterval: 5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#cc0000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.5,
					yIntercept: 10
				}
			}
		],
		width: 400,
		xAxis: {
			max: 70,
			min: 0,
			label: "",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "",
			tickInterval: 5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.5,
					yIntercept: 40
				}
			}
		],
		width: 400,
		xAxis: {
			max: 70,
			min: 0,
			label: "",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "",
			tickInterval: 5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#2ca02c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.5,
					yIntercept: 20
				}
			}
		],
		width: 400,
		xAxis: {
			max: 70,
			min: 0,
			label: "",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "",
			tickInterval: 5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#d9534f",
				label: "A",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.1,
					yIntercept: 0.5
				}
			}
		],
		width: 400,
		xAxis: {
			max: 65,
			min: -5,
			label: "Time in seconds",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 4,
			min: -4,
			label: "Altitude in meters",
			tickInterval: 0.5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#6495ed",
				label: "B",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.1,
					yIntercept: -3.5
				}
			}
		],
		width: 400,
		xAxis: {
			max: 65,
			min: -5,
			label: "Time in seconds",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 4,
			min: -4,
			label: "Altitude in meters",
			tickInterval: 0.5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#5cb85c",
				label: "C",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.1,
					yIntercept: 3.5
				}
			}
		],
		width: 400,
		xAxis: {
			max: 65,
			min: -5,
			label: "Time in seconds",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 4,
			min: -4,
			label: "Altitude in meters",
			tickInterval: 0.5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [],
		width: 400,
		xAxis: {
			max: 65,
			min: -5,
			label: "Time in seconds",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 4,
			min: -4,
			label: "Altitude in meters",
			tickInterval: 0.5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: 20
				}
			}
		],
		width: 420,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Capacity (%)",
			tickInterval: 5,
			showGridLines: true
		},
		height: 436,
		points: [
			{
				x: 0,
				y: 20,
				id: "a_p1",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 24,
				id: "a_p2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 20
				}
			}
		],
		width: 420,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Capacity (%)",
			tickInterval: 5,
			showGridLines: true
		},
		height: 436,
		points: [
			{
				x: 0,
				y: 20,
				id: "b_p1",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 25,
				id: "b_p2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 10
				}
			}
		],
		width: 420,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Capacity (%)",
			tickInterval: 5,
			showGridLines: true
		},
		height: 436,
		points: [
			{
				x: 0,
				y: 10,
				id: "c_p1",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 15,
				id: "c_p2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: -20
				}
			}
		],
		width: 420,
		xAxis: {
			max: 6,
			min: -0.5,
			label: "Time (seconds)",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 2,
			min: -22,
			label: "Elevation (meters)",
			tickInterval: 2,
			showGridLines: true
		},
		height: 436,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: -20
				}
			}
		],
		width: 420,
		xAxis: {
			max: 6,
			min: -0.5,
			label: "Time (seconds)",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 2,
			min: -22,
			label: "Elevation (meters)",
			tickInterval: 2,
			showGridLines: true
		},
		height: 436,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -4,
					yIntercept: -20
				}
			}
		],
		width: 420,
		xAxis: {
			max: 6,
			min: -0.5,
			label: "Time (seconds)",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 2,
			min: -22,
			label: "Elevation (meters)",
			tickInterval: 2,
			showGridLines: true
		},
		height: 436,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 0
				}
			}
		],
		width: 400,
		xAxis: {
			max: 25,
			min: 0,
			label: "Time in weeks",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 60,
			min: 0,
			label: "Beard in millimeters",
			tickInterval: 4,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 8
				}
			}
		],
		width: 400,
		xAxis: {
			max: 25,
			min: 0,
			label: "Time in weeks",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 60,
			min: 0,
			label: "Beard in millimeters",
			tickInterval: 4,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 8
				}
			}
		],
		width: 400,
		xAxis: {
			max: 25,
			min: 0,
			label: "Time in weeks",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 60,
			min: 0,
			label: "Beard in millimeters",
			tickInterval: 4,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 6,
					yIntercept: 80
				}
			}
		],
		width: 420,
		xAxis: {
			max: 30,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 250,
			min: 0,
			label: "Water level (centimeters)",
			tickInterval: 10,
			showGridLines: true
		},
		height: 432,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 6,
					yIntercept: 100
				}
			}
		],
		width: 420,
		xAxis: {
			max: 30,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 250,
			min: 0,
			label: "Water level (centimeters)",
			tickInterval: 10,
			showGridLines: true
		},
		height: 432,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 120
				}
			}
		],
		width: 420,
		xAxis: {
			max: 30,
			min: 0,
			label: "Time (minutes)",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 250,
			min: 0,
			label: "Water level (centimeters)",
			tickInterval: 10,
			showGridLines: true
		},
		height: 432,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a1",
				color: "#cc0000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -5,
					yIntercept: 0
				}
			}
		],
		width: 400,
		xAxis: {
			max: 55,
			min: -5,
			label: "Time (seconds)",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 275,
			min: -25,
			label: "Slushy (milliliters)",
			tickInterval: 25,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b1",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -5,
					yIntercept: 250
				}
			}
		],
		width: 400,
		xAxis: {
			max: 55,
			min: -5,
			label: "Time (seconds)",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 275,
			min: -25,
			label: "Slushy (milliliters)",
			tickInterval: 25,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c1",
				color: "#2ca02c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 0
				}
			}
		],
		width: 400,
		xAxis: {
			max: 55,
			min: -5,
			label: "Time (seconds)",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 275,
			min: -25,
			label: "Slushy (milliliters)",
			tickInterval: 25,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [],
		width: 400,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 500,
			min: 0,
			label: "Water in liters",
			tickInterval: 25,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: "A",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 62.5,
					yIntercept: 0
				}
			}
		],
		width: 400,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 500,
			min: 0,
			label: "Water in liters",
			tickInterval: 25,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: "B",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -62.5,
					yIntercept: 500
				}
			}
		],
		width: 400,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 500,
			min: 0,
			label: "Water in liters",
			tickInterval: 25,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: "C",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -62.5,
					yIntercept: 400
				}
			}
		],
		width: 400,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 500,
			min: 0,
			label: "Water in liters",
			tickInterval: 25,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#d62728",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: -5
				}
			}
		],
		width: 400,
		xAxis: {
			max: 20,
			min: -2,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -50,
			label: "",
			tickInterval: 2.5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3,
					yIntercept: -5
				}
			}
		],
		width: 400,
		xAxis: {
			max: 20,
			min: -2,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -50,
			label: "",
			tickInterval: 2.5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#2ca02c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3,
					yIntercept: 5
				}
			}
		],
		width: 400,
		xAxis: {
			max: 20,
			min: -2,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 5,
			min: -50,
			label: "",
			tickInterval: 2.5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_wrong_positive_slope",
				color: "#cc0000",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.8,
					yIntercept: 400
				}
			}
		],
		width: 420,
		xAxis: {
			max: 600,
			min: 0,
			label: "Distance in kilometers",
			tickInterval: 50,
			showGridLines: true
		},
		yAxis: {
			max: 440,
			min: 0,
			label: "Fuel in liters",
			tickInterval: 40,
			showGridLines: true
		},
		height: 432,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_correct",
				color: "#1f77b4",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.8,
					yIntercept: 400
				}
			}
		],
		width: 420,
		xAxis: {
			max: 600,
			min: 0,
			label: "Distance in kilometers",
			tickInterval: 50,
			showGridLines: true
		},
		yAxis: {
			max: 440,
			min: 0,
			label: "Fuel in liters",
			tickInterval: 40,
			showGridLines: true
		},
		height: 432,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_wrong_slope_magnitude",
				color: "#2ca02c",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.4,
					yIntercept: 400
				}
			}
		],
		width: 420,
		xAxis: {
			max: 600,
			min: 0,
			label: "Distance in kilometers",
			tickInterval: 50,
			showGridLines: true
		},
		yAxis: {
			max: 440,
			min: 0,
			label: "Fuel in liters",
			tickInterval: 40,
			showGridLines: true
		},
		height: 432,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.2,
					yIntercept: 3
				}
			}
		],
		width: 400,
		xAxis: {
			max: 20,
			min: -2,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 4,
			min: -0.5,
			label: "",
			tickInterval: 0.25,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.2,
					yIntercept: -3
				}
			}
		],
		width: 400,
		xAxis: {
			max: 20,
			min: -2,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 4,
			min: -0.5,
			label: "",
			tickInterval: 0.25,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.2,
					yIntercept: 2
				}
			}
		],
		width: 400,
		xAxis: {
			max: 20,
			min: -2,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 4,
			min: -0.5,
			label: "",
			tickInterval: 0.25,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.75,
					yIntercept: -2
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [
			{
				x: 0,
				y: -2,
				id: "pt_y_intercept",
				label: "",
				style: "closed"
			},
			{
				x: 4,
				y: 1,
				id: "pt_second",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					A: 1,
					B: -2,
					C: 6,
					type: "standard"
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: -9
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.6666666666666666,
					yIntercept: 4
				}
			}
		],
		width: 424,
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
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: 3
				}
			}
		],
		width: 424,
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
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -5
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.25,
					yIntercept: -6
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 4
				}
			}
		],
		width: 424,
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
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.5,
					yIntercept: 3
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.3333333333333333,
					yIntercept: 5
				}
			}
		],
		width: 424,
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
		height: 424,
		points: [
			{
				x: 0,
				y: 5,
				id: "p1",
				label: "",
				style: "closed"
			},
			{
				x: 3,
				y: 4,
				id: "p2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3,
					yIntercept: 7
				}
			}
		],
		width: 424,
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
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2,
					yIntercept: 5
				}
			}
		],
		width: 424,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 424,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_knitting",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 16,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 4,
			min: 0,
			label: "scarves",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 80,
			min: 0,
			label: "hours",
			tickInterval: 20,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 1,
				y: 16,
				id: "p1",
				label: "(1, 16)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_A",
				color: "#11accd",
				label: "A",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3.5,
					yIntercept: 0
				}
			},
			{
				id: "line_B",
				color: "#1fab54",
				label: "B",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 0
				}
			},
			{
				id: "line_C",
				color: "#7854ab",
				label: "C",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 0
				}
			}
		],
		width: 420,
		xAxis: {
			max: 10,
			min: 0,
			label: "Minutes",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Water (gallons)",
			tickInterval: 2,
			showGridLines: true
		},
		height: 420,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_eggs",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4.5,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "Days",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Eggs",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 1,
				y: 4.5,
				id: "p1",
				label: "(1, 4.5)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_k",
				color: "#1fab54",
				label: "K",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3.75,
					yIntercept: 0
				}
			},
			{
				id: "line_j",
				color: "#11accd",
				label: "J",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 0
				}
			},
			{
				id: "line_l",
				color: "#7854ab",
				label: "L",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 6,
					yIntercept: 0
				}
			}
		],
		width: 456,
		xAxis: {
			max: 6,
			min: 0,
			label: "Minutes",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "Hot dogs",
			tickInterval: 10,
			showGridLines: true
		},
		height: 348,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_rate",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.3333333333333333,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 4,
			min: 0,
			label: "Flour (liters)",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 4,
			min: 0,
			label: "Water (liters)",
			tickInterval: 1,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 3,
				y: 1,
				id: "p_3_1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 50,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 3,
			min: 0,
			label: "seconds",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 200,
			min: 0,
			label: "milliliters",
			tickInterval: 50,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 1,
				y: 50,
				id: "p1",
				label: "(1,50)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "Cereal (cups)",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Popcorn (cups)",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 1,
				y: 2,
				id: "pt_1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_y",
				color: "#1fab54",
				label: "Y",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: 0
				}
			},
			{
				id: "line_x",
				color: "#11accd",
				label: "X",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 0
				}
			},
			{
				id: "line_z",
				color: "#7854ab",
				label: "Z",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 6,
					yIntercept: 0
				}
			}
		],
		width: 420,
		xAxis: {
			max: 10,
			min: 0,
			label: "Bars",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 40,
			min: 0,
			label: "Price (dollars)",
			tickInterval: 10,
			showGridLines: true
		},
		height: 344,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_rate",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 4,
			min: 0,
			label: "hours",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 15,
			min: 0,
			label: "kilometers",
			tickInterval: 5,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 1,
				y: 5,
				id: "pt_1_5",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_profit",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8,
					yIntercept: -280
				}
			}
		],
		width: 375,
		xAxis: {
			max: 100,
			min: 0,
			label: "Paprika in kilograms",
			tickInterval: 10,
			showGridLines: true
		},
		yAxis: {
			max: 500,
			min: -300,
			label: "Profit in dollars",
			tickInterval: 100,
			showGridLines: true
		},
		height: 330,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -8,
					yIntercept: 600
				}
			}
		],
		width: 375,
		xAxis: {
			max: 80,
			min: 0,
			label: "Time in seconds",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 600,
			min: 0,
			label: "Slushy in milliliters",
			tickInterval: 50,
			showGridLines: true
		},
		height: 375,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -8,
					yIntercept: 600
				}
			}
		],
		width: 375,
		xAxis: {
			max: 80,
			min: 0,
			label: "Time in seconds",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 600,
			min: 0,
			label: "Slushy in milliliters",
			tickInterval: 50,
			showGridLines: true
		},
		height: 375,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -11,
					yIntercept: 440
				}
			}
		],
		width: 390,
		xAxis: {
			max: 72,
			min: 0,
			label: "Time in minutes",
			tickInterval: 8,
			showGridLines: true
		},
		yAxis: {
			max: 480,
			min: -400,
			label: "Altitude in meters",
			tickInterval: 80,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_beard_growth",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 10
				}
			}
		],
		width: 375,
		xAxis: {
			max: 35,
			min: 0,
			label: "Time in weeks",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 90,
			min: 0,
			label: "Beard length in millimeters",
			tickInterval: 5,
			showGridLines: true
		},
		height: 375,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -72,
					yIntercept: 360
				}
			}
		],
		width: 375,
		xAxis: {
			max: 5.5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 400,
			min: 0,
			label: "Water in liters",
			tickInterval: 40,
			showGridLines: true
		},
		height: 360,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_drain_rate",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -72,
					yIntercept: 360
				}
			}
		],
		width: 375,
		xAxis: {
			max: 5.5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 400,
			min: 0,
			label: "Water in liters",
			tickInterval: 40,
			showGridLines: true
		},
		height: 360,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8,
					yIntercept: -280
				}
			}
		],
		width: 375,
		xAxis: {
			max: 100,
			min: 0,
			label: "Paprika in kilograms",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 500,
			min: -300,
			label: "Profit in dollars",
			tickInterval: 100,
			showGridLines: true
		},
		height: 330,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_water_drain",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -72,
					yIntercept: 360
				}
			}
		],
		width: 375,
		xAxis: {
			max: 5.5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 400,
			min: 0,
			label: "Water in liters",
			tickInterval: 40,
			showGridLines: true
		},
		height: 360,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8,
					yIntercept: -6
				}
			}
		],
		width: 375,
		xAxis: {
			max: 5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.25,
			showGridLines: true
		},
		yAxis: {
			max: 40,
			min: -10,
			label: "Temperature in degrees Celsius",
			tickInterval: 5,
			showGridLines: true
		},
		height: 339,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_zane",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					A: 5,
					B: -7,
					C: 175,
					type: "standard"
				}
			}
		],
		width: 390,
		xAxis: {
			max: 37.5,
			min: 0,
			label: "Time in seconds",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -30,
			label: "Elevation in meters",
			tickInterval: 2.5,
			showGridLines: true
		},
		height: 324,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.7142857142857143,
					yIntercept: -25
				}
			}
		],
		width: 390,
		xAxis: {
			max: 37.5,
			min: 0,
			label: "Time in seconds",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -30,
			label: "Elevation in meters",
			tickInterval: 2.5,
			showGridLines: true
		},
		height: 324,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -5,
					yIntercept: 8500
				}
			}
		],
		width: 358,
		xAxis: {
			max: 1800,
			min: 0,
			label: "Time in seconds",
			tickInterval: 100,
			showGridLines: true
		},
		yAxis: {
			max: 9000,
			min: 0,
			label: "Elevation in meters",
			tickInterval: 500,
			showGridLines: true
		},
		height: 326,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_plane_descent",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -5,
					yIntercept: 8500
				}
			}
		],
		width: 358,
		xAxis: {
			max: 1800,
			min: 0,
			label: "Time in seconds",
			tickInterval: 100,
			showGridLines: true
		},
		yAxis: {
			max: 9000,
			min: 0,
			label: "Elevation in meters",
			tickInterval: 500,
			showGridLines: true
		},
		height: 326,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8,
					yIntercept: -6
				}
			}
		],
		width: 375,
		xAxis: {
			max: 5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 40,
			min: -10,
			label: "Temperature in degrees Celsius",
			tickInterval: 5,
			showGridLines: true
		},
		height: 339,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_charging",
				color: "#6495ed",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 40
				}
			}
		],
		width: 400,
		xAxis: {
			max: 32.5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Capacity, percent charged",
			tickInterval: 5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_fuel",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					A: 3,
					B: 5,
					C: 2500,
					type: "standard"
				}
			}
		],
		width: 390,
		xAxis: {
			max: 900,
			min: 0,
			label: "Distance in kilometers",
			tickInterval: 100,
			showGridLines: true
		},
		yAxis: {
			max: 550,
			min: 0,
			label: "Fuel in liters",
			tickInterval: 50,
			showGridLines: true
		},
		height: 360,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_drain",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -72,
					yIntercept: 360
				}
			}
		],
		width: 375,
		xAxis: {
			max: 5.5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 400,
			min: 0,
			label: "Water in liters",
			tickInterval: 40,
			showGridLines: true
		},
		height: 360,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_profit",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8,
					yIntercept: -280
				}
			}
		],
		width: 375,
		xAxis: {
			max: 100,
			min: 0,
			label: "Paprika in kilograms",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 500,
			min: -300,
			label: "Profit in dollars",
			tickInterval: 100,
			showGridLines: true
		},
		height: 330,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_beard",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 10
				}
			}
		],
		width: 375,
		xAxis: {
			max: 35,
			min: 0,
			label: "Time in weeks",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 90,
			min: 0,
			label: "Beard length in millimeters",
			tickInterval: 10,
			showGridLines: true
		},
		height: 375,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_elevation",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -5,
					yIntercept: 8500
				}
			}
		],
		width: 358,
		xAxis: {
			max: 1800,
			min: 0,
			label: "Time in seconds",
			tickInterval: 100,
			showGridLines: true
		},
		yAxis: {
			max: 9000,
			min: 0,
			label: "Elevation in meters",
			tickInterval: 500,
			showGridLines: true
		},
		height: 326,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_fuel_distance",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.6,
					yIntercept: 500
				}
			}
		],
		width: 390,
		xAxis: {
			max: 900,
			min: 0,
			label: "Distance in kilometers",
			tickInterval: 50,
			showGridLines: true
		},
		yAxis: {
			max: 550,
			min: 0,
			label: "Fuel in liters",
			tickInterval: 50,
			showGridLines: true
		},
		height: 360,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_zane",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.7142857142857143,
					yIntercept: -25
				}
			}
		],
		width: 390,
		xAxis: {
			max: 37.5,
			min: 0,
			label: "Time in seconds",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -30,
			label: "Elevation in meters",
			tickInterval: 2.5,
			showGridLines: true
		},
		height: 324,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_fuel_vs_distance",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.6,
					yIntercept: 500
				}
			}
		],
		width: 390,
		xAxis: {
			max: 900,
			min: 0,
			label: "Distance in kilometers",
			tickInterval: 100,
			showGridLines: true
		},
		yAxis: {
			max: 550,
			min: 0,
			label: "Fuel in liters",
			tickInterval: 50,
			showGridLines: true
		},
		height: 360,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8,
					yIntercept: -6
				}
			}
		],
		width: 375,
		xAxis: {
			max: 5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 40,
			min: -10,
			label: "temperature in degrees Celsius",
			tickInterval: 5,
			showGridLines: true
		},
		height: 339,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_beard_growth",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 10
				}
			}
		],
		width: 375,
		xAxis: {
			max: 35,
			min: 0,
			label: "Time in weeks",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 90,
			min: 0,
			label: "Beard length in millimeters",
			tickInterval: 10,
			showGridLines: true
		},
		height: 375,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_beard",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 10
				}
			}
		],
		width: 375,
		xAxis: {
			max: 35,
			min: 0,
			label: "Time in weeks",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 90,
			min: 0,
			label: "Beard length in millimeters",
			tickInterval: 10,
			showGridLines: true
		},
		height: 375,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_descent",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -11,
					yIntercept: 440
				}
			}
		],
		width: 390,
		xAxis: {
			max: 72,
			min: 0,
			label: "Time in minutes",
			tickInterval: 8,
			showGridLines: true
		},
		yAxis: {
			max: 480,
			min: -400,
			label: "Altitude in meters",
			tickInterval: 40,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_profit",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8,
					yIntercept: -280
				}
			}
		],
		width: 375,
		xAxis: {
			max: 100,
			min: 0,
			label: "Paprika in kilograms",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 500,
			min: -300,
			label: "Profit in dollars",
			tickInterval: 100,
			showGridLines: true
		},
		height: 330,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -5,
					yIntercept: 8500
				}
			}
		],
		width: 358,
		xAxis: {
			max: 1800,
			min: 0,
			label: "Time in seconds",
			tickInterval: 100,
			showGridLines: true
		},
		yAxis: {
			max: 9000,
			min: 0,
			label: "Elevation in meters",
			tickInterval: 500,
			showGridLines: true
		},
		height: 326,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 40
				}
			}
		],
		width: 400,
		xAxis: {
			max: 32.5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Capacity, percent charged",
			tickInterval: 5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -8,
					yIntercept: 600
				}
			}
		],
		width: 375,
		xAxis: {
			max: 80,
			min: 0,
			label: "Time in seconds",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 600,
			min: 0,
			label: "Slushy in milliliters",
			tickInterval: 50,
			showGridLines: true
		},
		height: 375,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_altitude",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -11,
					yIntercept: 440
				}
			}
		],
		width: 390,
		xAxis: {
			max: 72,
			min: 0,
			label: "Time in minutes",
			tickInterval: 8,
			showGridLines: true
		},
		yAxis: {
			max: 480,
			min: -400,
			label: "Altitude in meters",
			tickInterval: 40,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_battery",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 40
				}
			}
		],
		width: 400,
		xAxis: {
			max: 32.5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Capacity, percent charged",
			tickInterval: 5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_fuel",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.6,
					yIntercept: 500
				}
			}
		],
		width: 390,
		xAxis: {
			max: 900,
			min: 0,
			label: "Distance in kilometers",
			tickInterval: 50,
			showGridLines: true
		},
		yAxis: {
			max: 550,
			min: 0,
			label: "Fuel in liters",
			tickInterval: 50,
			showGridLines: true
		},
		height: 360,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_charge",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 40
				}
			}
		],
		width: 400,
		xAxis: {
			max: 32.5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Capacity, percent charged",
			tickInterval: 5,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ED",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -11,
					yIntercept: 440
				}
			}
		],
		width: 390,
		xAxis: {
			max: 72,
			min: 0,
			label: "Time in minutes",
			tickInterval: 8,
			showGridLines: true
		},
		yAxis: {
			max: 480,
			min: -400,
			label: "Altitude in meters",
			tickInterval: 40,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_p",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8,
					yIntercept: -6
				}
			}
		],
		width: 375,
		xAxis: {
			max: 5,
			min: 0,
			label: "Time in minutes",
			tickInterval: 0.5,
			showGridLines: true
		},
		yAxis: {
			max: 40,
			min: -10,
			label: "temperature in degrees Celsius",
			tickInterval: 5,
			showGridLines: true
		},
		height: 339,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -8,
					yIntercept: 600
				}
			}
		],
		width: 375,
		xAxis: {
			max: 80,
			min: 0,
			label: "Time in seconds",
			tickInterval: 5,
			showGridLines: true
		},
		yAxis: {
			max: 600,
			min: 0,
			label: "Slushy in milliliters",
			tickInterval: 50,
			showGridLines: true
		},
		height: 375,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#6495ed",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.7142857142857143,
					yIntercept: -25
				}
			}
		],
		width: 390,
		xAxis: {
			max: 37.5,
			min: 0,
			label: "Time in seconds",
			tickInterval: 2.5,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -30,
			label: "Elevation in meters",
			tickInterval: 2.5,
			showGridLines: true
		},
		height: 324,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#7A3E9D",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 0
				}
			}
		],
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
				x: 0,
				y: 0,
				id: "A1",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 5,
				id: "A2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1E90FF",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 0
				}
			}
		],
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
				x: 0,
				y: 0,
				id: "B1",
				label: "",
				style: "closed"
			},
			{
				x: 5,
				y: 2,
				id: "B2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#2E8B57",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 1
				}
			}
		],
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
				x: 0,
				y: 1,
				id: "C1",
				label: "",
				style: "closed"
			},
			{
				x: 5,
				y: 3,
				id: "C2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 2
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.4,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.7,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 12,
			min: -12,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.4285714285714286,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 12,
			min: -12,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.4285714285714286,
					yIntercept: 1
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 12,
			min: -12,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.75,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.3333333333,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.3333333333,
					yIntercept: 1
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.2,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.2,
					yIntercept: 1
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.6666666667,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.375,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.375,
					yIntercept: 1
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.25,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.8,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.8,
					yIntercept: 1
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4444444444444444,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 11,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 450,
		points: [
			{
				x: 0,
				y: 0,
				id: "p1",
				label: "(0, 0)",
				style: "closed"
			},
			{
				x: 4,
				y: 9,
				id: "p2",
				label: "(4, 9)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.25,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 11,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 450,
		points: [
			{
				x: 0,
				y: 0,
				id: "p1",
				label: "(0, 0)",
				style: "closed"
			},
			{
				x: 4,
				y: 9,
				id: "p2",
				label: "(4, 9)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.25,
					yIntercept: 2
				}
			}
		],
		width: 450,
		xAxis: {
			max: 11,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 450,
		points: [
			{
				x: 0,
				y: 0,
				id: "p1",
				label: "(0, 0)",
				style: "closed"
			},
			{
				x: 4,
				y: 9,
				id: "p2",
				label: "(4, 9)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.6,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.6666666667,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.6666666667,
					yIntercept: 1
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_neg_5_7",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.7142857142857143,
					yIntercept: 0
				}
			}
		],
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
				x: 0,
				y: 0,
				id: "O",
				label: " ",
				style: "closed"
			},
			{
				x: 7,
				y: 5,
				id: "P",
				label: " ",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_5_7",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.7142857142857143,
					yIntercept: 0
				}
			}
		],
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
				x: 0,
				y: 0,
				id: "O",
				label: " ",
				style: "closed"
			},
			{
				x: 7,
				y: 5,
				id: "P",
				label: " ",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_5_7_b1",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.7142857142857143,
					yIntercept: 1
				}
			}
		],
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
				x: 0,
				y: 0,
				id: "O",
				label: " ",
				style: "closed"
			},
			{
				x: 7,
				y: 5,
				id: "P",
				label: " ",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.3,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 11,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3.3333333333333335,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 11,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3.3333333333333335,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 11,
			min: -10,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#3366cc",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 11,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 450,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#3366cc",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 9.5,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 11,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 450,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#3366cc",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 9.5,
					yIntercept: 1
				}
			}
		],
		width: 450,
		xAxis: {
			max: 11,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 450,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					A: 3,
					B: -2,
					C: 0,
					type: "standard"
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					A: 2,
					B: -3,
					C: 0,
					type: "standard"
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					A: 2,
					B: -3,
					C: -6,
					type: "standard"
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.11764705882352941,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8.5,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8.5,
					yIntercept: 1
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#3366cc",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -3,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#2a9d8f",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#e76f51",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: 1
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.625,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.6,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.6,
					yIntercept: 2
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 1
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3.5,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: true
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.2857142857142857,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: true
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.2857142857142857,
					yIntercept: 3
				}
			}
		],
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
		points: [],
		showQuadrantLabels: true
	},
	{
		type: "lineEquationGraph",
		lines: [],
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
		points: [],
		showQuadrantLabels: true
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 1
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a1",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.6,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b1",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.6,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c1",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.6,
					yIntercept: 2
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_correct",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 60,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 5,
			min: -1,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: -10,
			label: "y",
			tickInterval: 10,
			showGridLines: true
		},
		height: 450,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_wrong_slope",
				color: "#d62728",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 40,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 5,
			min: -1,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: -10,
			label: "y",
			tickInterval: 10,
			showGridLines: true
		},
		height: 450,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_wrong_intercept",
				color: "#2ca02c",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 60,
					yIntercept: 20
				}
			}
		],
		width: 450,
		xAxis: {
			max: 5,
			min: -1,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: -10,
			label: "y",
			tickInterval: 10,
			showGridLines: true
		},
		height: 450,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.4,
					yIntercept: 2
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.4,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.4,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#4A90E2",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.3,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 14,
			min: -14,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 14,
			min: -14,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#4A90E2",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.7692307692307693,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 14,
			min: -14,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 14,
			min: -14,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#4A90E2",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.7692307692307693,
					yIntercept: 2
				}
			}
		],
		width: 425,
		xAxis: {
			max: 14,
			min: -14,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 14,
			min: -14,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#2b8cbe",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 9,
					yIntercept: 2
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#2ca25f",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 9,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#de2d26",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#555555",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 5,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: 0,
				y: 0,
				id: "p_a1",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 2,
				id: "p_a2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.5,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 5,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: 0,
				y: 0,
				id: "p_b1",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 3,
				id: "p_b2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#A23E2C",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.5,
					yIntercept: 1
				}
			}
		],
		width: 425,
		xAxis: {
			max: 5,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [
			{
				x: 0,
				y: 1,
				id: "p_c1",
				label: "",
				style: "closed"
			},
			{
				x: 2,
				y: 4,
				id: "p_c2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [],
		width: 425,
		xAxis: {
			max: 5,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_correct",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 60,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 8,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "y",
			tickInterval: 10,
			showGridLines: true
		},
		height: 450,
		points: [
			{
				x: 0,
				y: 0,
				id: "p0",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 60,
				id: "p1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_slope30",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 30,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 8,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "y",
			tickInterval: 10,
			showGridLines: true
		},
		height: 450,
		points: [
			{
				x: 0,
				y: 0,
				id: "b_p0",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 30,
				id: "b_p1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_intercept10",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 60,
					yIntercept: 10
				}
			}
		],
		width: 450,
		xAxis: {
			max: 8,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "y",
			tickInterval: 10,
			showGridLines: true
		},
		height: 450,
		points: [
			{
				x: 0,
				y: 10,
				id: "c_p0",
				label: "",
				style: "closed"
			},
			{
				x: 1,
				y: 70,
				id: "c_p1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 60,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 8,
			min: -1,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: -10,
			label: "d",
			tickInterval: 10,
			showGridLines: true
		},
		height: 450,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: 60
				}
			}
		],
		width: 450,
		xAxis: {
			max: 8,
			min: -1,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: -10,
			label: "d",
			tickInterval: 10,
			showGridLines: true
		},
		height: 450,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 30,
					yIntercept: 0
				}
			}
		],
		width: 450,
		xAxis: {
			max: 8,
			min: -1,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 100,
			min: -10,
			label: "d",
			tickInterval: 10,
			showGridLines: true
		},
		height: 450,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					A: 3,
					B: -8,
					C: 0,
					type: "standard"
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					A: 8,
					B: -3,
					C: 0,
					type: "standard"
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					A: 8,
					B: -3,
					C: -6,
					type: "standard"
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.1666666666666667,
					yIntercept: 1
				}
			}
		],
		width: 400,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.1666666666666667,
					yIntercept: 0
				}
			}
		],
		width: 400,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1.1666666666666667,
					yIntercept: 0
				}
			}
		],
		width: 400,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.75,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.3333333333333333,
					yIntercept: 0
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#1f77b4",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.3333333333333333,
					yIntercept: 1
				}
			}
		],
		width: 425,
		xAxis: {
			max: 10,
			min: -10,
			label: "t",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "d",
			tickInterval: 1,
			showGridLines: true
		},
		height: 425,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2.5,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 2,
				y: 5,
				id: "p_c",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_d",
				color: "#7854ab",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.4,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 5,
				y: 2,
				id: "p_d",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.6,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 5,
				y: 3,
				id: "pt_b",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#7854ab",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 8,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 1,
				y: 8,
				id: "pt_c",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_main",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.75,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 8,
				y: 6,
				id: "pt_8_6",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_choice_c",
				color: "#7854ab",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.5,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 2,
				y: 1,
				id: "pt_2_1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_car_a",
				color: "#7854ab",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 10,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 8,
			min: 0,
			label: "L",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 60,
			min: 0,
			label: "km",
			tickInterval: 20,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 4,
				y: 40,
				id: "p1",
				label: "(4, 40)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#7854ab",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 4,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 4,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "",
			tickInterval: 4,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 1,
				y: 4,
				id: "p_c",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_d",
				color: "#e07d10",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3.5,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 2,
			min: 0,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 2,
				y: 7,
				id: "p_d",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_e",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3.5,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 4,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "",
			tickInterval: 4,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 4,
				y: 14,
				id: "p_e",
				label: "(4, 14)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_store_c",
				color: "#1fab54",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1.5,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 4,
				y: 6,
				id: "pt_4_6",
				label: "(4, 6)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_ariel",
				color: "#208170",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 150,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 6,
			min: 0,
			label: "Minutes",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 800,
			min: 0,
			label: "words",
			tickInterval: 50,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 2,
				y: 300,
				id: "p1",
				label: "(2, 300)",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_main",
				color: "#000000",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.25,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 8,
				y: 2,
				id: "pt_8_2",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_choice_c",
				color: "#000000",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.25,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 4,
				y: 1,
				id: "pt_4_1",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_y_9x",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 9,
					yIntercept: 0
				}
			}
		],
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
			tickInterval: 3,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 1,
				y: 9,
				id: "p_1_9",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#7854ab",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.5,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_main",
				color: "#11accd",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 3,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 2,
				y: 6,
				id: "p_main",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_choice_c",
				color: "#7854ab",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 6,
					yIntercept: 0
				}
			}
		],
		width: 300,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			tickInterval: 2,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			tickInterval: 2,
			showGridLines: true
		},
		height: 300,
		points: [
			{
				x: 1,
				y: 6,
				id: "p_choice_c",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#3b82f6",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -3
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#4da3ff",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 5,
					yIntercept: -1
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#3B82F6",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: -2
				}
			}
		],
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
				x: -5,
				y: -2,
				id: "pt1",
				label: "",
				style: "closed"
			},
			{
				x: 0,
				y: -2,
				id: "pt2",
				label: "",
				style: "closed"
			},
			{
				x: 3,
				y: -2,
				id: "pt3",
				label: "",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#5fa0ff",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.6666666666666666,
					yIntercept: 0
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#3b82f6",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -8,
					yIntercept: 7
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_vertical_x_eq_neg2",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 0,
					C: -2,
					type: "standard"
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_vertical_x_eq_neg4",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 0,
					C: -4,
					type: "standard"
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_vertical_x_eq_neg6",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 0,
					C: -6,
					type: "standard"
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_y_eq_1",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 0,
					B: 1,
					C: 1,
					type: "standard"
				}
			}
		],
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
				y: 1,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: -2,
				y: 6,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: -3,
				y: 3,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: -3,
				y: -2,
				id: "D",
				label: "D",
				style: "closed"
			},
			{
				x: 6,
				y: 1,
				id: "Aprime",
				label: "A'",
				style: "closed"
			},
			{
				x: 6,
				y: 6,
				id: "Bprime",
				label: "B'",
				style: "closed"
			},
			{
				x: 7,
				y: 3,
				id: "Cprime",
				label: "C'",
				style: "closed"
			},
			{
				x: 7,
				y: -2,
				id: "Dprime",
				label: "D'",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_x_eq_2",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 0,
					C: 2,
					type: "standard"
				}
			}
		],
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
				y: 1,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: -2,
				y: 6,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: -3,
				y: 3,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: -3,
				y: -2,
				id: "D",
				label: "D",
				style: "closed"
			},
			{
				x: 6,
				y: 1,
				id: "Aprime",
				label: "A'",
				style: "closed"
			},
			{
				x: 6,
				y: 6,
				id: "Bprime",
				label: "B'",
				style: "closed"
			},
			{
				x: 7,
				y: 3,
				id: "Cprime",
				label: "C'",
				style: "closed"
			},
			{
				x: 7,
				y: -2,
				id: "Dprime",
				label: "D'",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_x_eq_1",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 0,
					C: 1,
					type: "standard"
				}
			}
		],
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
				y: 1,
				id: "A",
				label: "A",
				style: "closed"
			},
			{
				x: -2,
				y: 6,
				id: "B",
				label: "B",
				style: "closed"
			},
			{
				x: -3,
				y: 3,
				id: "C",
				label: "C",
				style: "closed"
			},
			{
				x: -3,
				y: -2,
				id: "D",
				label: "D",
				style: "closed"
			},
			{
				x: 6,
				y: 1,
				id: "Aprime",
				label: "A'",
				style: "closed"
			},
			{
				x: 6,
				y: 6,
				id: "Bprime",
				label: "B'",
				style: "closed"
			},
			{
				x: 7,
				y: 3,
				id: "Cprime",
				label: "C'",
				style: "closed"
			},
			{
				x: 7,
				y: -2,
				id: "Dprime",
				label: "D'",
				style: "closed"
			}
		],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_reflection",
				color: "#1fab54",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: -1
				}
			}
		],
		width: 400,
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
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_parallel_wrong",
				color: "#cc0000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: 1
				}
			}
		],
		width: 400,
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
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_vertical_wrong",
				color: "#0066cc",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 0,
					C: -1,
					type: "standard"
				}
			}
		],
		width: 400,
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
		height: 400,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_a",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: 5
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_b",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 0,
					C: -3,
					type: "standard"
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_c",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: -6
				}
			}
		],
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
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_y_eq_1",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: 1
				}
			}
		],
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
		points: [],
		showQuadrantLabels: true
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_x_eq_1",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 0,
					C: 1,
					type: "standard"
				}
			}
		],
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
		points: [],
		showQuadrantLabels: true
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_x_eq_neg1",
				color: "#000000",
				label: " ",
				style: "solid",
				equation: {
					A: 1,
					B: 0,
					C: -1,
					type: "standard"
				}
			}
		],
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
		points: [],
		showQuadrantLabels: true
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_horizontal_neg5",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: -5
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: -3
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_horizontal_y_7",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0,
					yIntercept: 7
				}
			}
		],
		width: 345,
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
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_1",
				color: "#11accd",
				label: "",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.5,
					yIntercept: 4
				}
			}
		],
		width: 345,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 345,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_q",
				color: "#11accd",
				label: "q",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: 3
				}
			}
		],
		width: 328,
		xAxis: {
			max: 10,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -5,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_q",
				color: "#11accd",
				label: "q",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -4
				}
			}
		],
		width: 328,
		xAxis: {
			max: 6,
			min: -6,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 6,
			min: -6,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_p",
				color: "#1976d2",
				label: "p",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 7
				}
			}
		],
		width: 328,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_q",
				color: "#11accd",
				label: "q",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: 5
				}
			}
		],
		width: 328,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_g",
				color: "#11accd",
				label: "g",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.5,
					yIntercept: 2
				}
			}
		],
		width: 328,
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
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_q",
				color: "#11accd",
				label: "q",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -6
				}
			}
		],
		width: 328,
		xAxis: {
			max: 10,
			min: -2,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 2,
			min: -8,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_p",
				color: "#11accd",
				label: "p",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.25,
					yIntercept: -7
				}
			}
		],
		width: 328,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_p",
				color: "#11accd",
				label: "p",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.6666666667,
					yIntercept: -7
				}
			}
		],
		width: 328,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 2,
			min: -14,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_h",
				color: "#11accd",
				label: "h",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -1,
					yIntercept: 4
				}
			}
		],
		width: 328,
		xAxis: {
			max: 6,
			min: -2,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 8,
			min: -2,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_f",
				color: "#11accd",
				label: "f",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.5,
					yIntercept: -3
				}
			}
		],
		width: 328,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_h",
				color: "#11accd",
				label: "h",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 2,
					yIntercept: 7
				}
			}
		],
		width: 328,
		xAxis: {
			max: 6,
			min: -4,
			label: "x",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 14,
			min: 0,
			label: "y",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_p",
				color: "#11accd",
				label: "p",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -0.25,
					yIntercept: -7
				}
			}
		],
		width: 328,
		xAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_p",
				color: "#11accd",
				label: "p",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 1,
					yIntercept: -6
				}
			}
		],
		width: 328,
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
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_q",
				color: "#11accd",
				label: "q",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: 0.25,
					yIntercept: 0
				}
			}
		],
		width: 328,
		xAxis: {
			max: 5,
			min: -1,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		yAxis: {
			max: 3,
			min: -1,
			label: "",
			tickInterval: 1,
			showGridLines: true
		},
		height: 328,
		points: [],
		showQuadrantLabels: false
	},
	{
		type: "lineEquationGraph",
		lines: [
			{
				id: "line_f",
				color: "#11accd",
				label: "f",
				style: "solid",
				equation: {
					type: "slopeIntercept",
					slope: -2,
					yIntercept: 1
				}
			}
		],
		width: 328,
		xAxis: {
			max: 6,
			min: -6,
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
		height: 328,
		points: [],
		showQuadrantLabels: false
	}
]
