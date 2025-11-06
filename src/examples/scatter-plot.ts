import type { ScatterPlotProps } from "@/widgets/generators/scatter-plot"

export const scatterPlotExamples: ScatterPlotProps[] = [
	{
		type: "scatterPlot",
		width: 500,
		height: 420,
		title: "Height vs. Arm Span",
		xAxis: {
			label: "Height (cm)",
			min: 140,
			max: 200,
			tickInterval: 10,
			gridLines: true
		},
		yAxis: {
			label: "Arm Span (cm)",
			min: 140,
			max: 200,
			tickInterval: 10,
			gridLines: true
		},
		points: [
			{ x: 150, y: 152, label: "A" },
			{ x: 158, y: 160, label: "B" },
			{ x: 165, y: 166, label: "C" },
			{ x: 170, y: 171, label: "D" },
			{ x: 175, y: 176, label: "E" },
			{ x: 182, y: 185, label: "F" },
			{ x: 190, y: 192, label: "G" }
		],
		lines: [
			{
				type: "bestFit",
				method: "linear",
				label: "Best Fit",
				style: { color: "#11accd", strokeWidth: 2, dash: false }
			}
		]
	},
	{
		type: "scatterPlot",
		width: 500,
		height: 400,
		title: "Time vs. Bacteria Count",
		xAxis: {
			label: "Time (hours)",
			min: 0,
			max: 10,
			tickInterval: 1,
			gridLines: true
		},
		yAxis: {
			label: "Count (thousands)",
			min: 0,
			max: 200,
			tickInterval: 20,
			gridLines: true
		},
		points: [
			{ x: 0, y: 5, label: "t0" },
			{ x: 1, y: 7, label: "t1" },
			{ x: 2, y: 10, label: "t2" },
			{ x: 3, y: 15, label: "t3" },
			{ x: 4, y: 22, label: "t4" },
			{ x: 6, y: 45, label: "t6" },
			{ x: 8, y: 90, label: "t8" },
			{ x: 10, y: 180, label: "t10" }
		],
		lines: [
			{
				type: "bestFit",
				method: "exponential",
				label: "Trend",
				style: { color: "#e74c3c", strokeWidth: 2, dash: true }
			},
			{
				type: "twoPoints",
				a: { x: 0, y: 0 },
				b: { x: 10, y: 200 },
				label: "Reference",
				style: { color: "#2ecc71", strokeWidth: 2, dash: false }
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 9.77
				},
				b: {
					x: 10,
					y: 2.27
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 7.05
				},
				b: {
					x: 10,
					y: -0.45
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 5.55
				},
				b: {
					x: 10,
					y: 4.55
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1.82,
				y: 8.18,
				label: ""
			},
			{
				x: 2.73,
				y: 7.27,
				label: ""
			},
			{
				x: 3.18,
				y: 6.82,
				label: ""
			},
			{
				x: 3.64,
				y: 6.82,
				label: ""
			},
			{
				x: 4.09,
				y: 5.91,
				label: ""
			},
			{
				x: 5.45,
				y: 6.36,
				label: ""
			},
			{
				x: 4.55,
				y: 5.91,
				label: ""
			},
			{
				x: 6.36,
				y: 4.73,
				label: ""
			},
			{
				x: 6.36,
				y: 5.18,
				label: ""
			},
			{
				x: 8.18,
				y: 3.36,
				label: ""
			},
			{
				x: 7.27,
				y: 4,
				label: ""
			},
			{
				x: 9.09,
				y: 3.36,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 9
				},
				b: {
					x: 8,
					y: 3
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 2
				},
				b: {
					x: 8,
					y: 8
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 6
				},
				b: {
					x: 10,
					y: 6
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 9,
				label: ""
			},
			{
				x: 3,
				y: 8,
				label: ""
			},
			{
				x: 3.5,
				y: 7.5,
				label: ""
			},
			{
				x: 4,
				y: 6.5,
				label: ""
			},
			{
				x: 4,
				y: 6,
				label: ""
			},
			{
				x: 6,
				y: 6,
				label: ""
			},
			{
				x: 5,
				y: 5.5,
				label: ""
			},
			{
				x: 7,
				y: 6.2,
				label: ""
			},
			{
				x: 7,
				y: 6.7,
				label: ""
			},
			{
				x: 9,
				y: 8.7,
				label: ""
			},
			{
				x: 8,
				y: 7.4,
				label: ""
			},
			{
				x: 10,
				y: 7.7,
				label: ""
			},
			{
				x: 2,
				y: 2,
				label: ""
			},
			{
				x: 3,
				y: 3.5,
				label: ""
			},
			{
				x: 3.5,
				y: 3.5,
				label: ""
			},
			{
				x: 4,
				y: 4.5,
				label: ""
			},
			{
				x: 6,
				y: 5,
				label: ""
			},
			{
				x: 5,
				y: 6.5,
				label: ""
			},
			{
				x: 7,
				y: 5.2,
				label: ""
			},
			{
				x: 7,
				y: 4.7,
				label: ""
			},
			{
				x: 9,
				y: 3,
				label: ""
			},
			{
				x: 8,
				y: 4.4,
				label: ""
			},
			{
				x: 10,
				y: 1.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 9
				},
				b: {
					x: 8,
					y: 3
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 2
				},
				b: {
					x: 8,
					y: 8
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 6
				},
				b: {
					x: 10,
					y: 6
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 9,
				label: ""
			},
			{
				x: 3,
				y: 8,
				label: ""
			},
			{
				x: 3.5,
				y: 7.5,
				label: ""
			},
			{
				x: 4,
				y: 6.5,
				label: ""
			},
			{
				x: 4,
				y: 6,
				label: ""
			},
			{
				x: 5,
				y: 5.5,
				label: ""
			},
			{
				x: 6,
				y: 6,
				label: ""
			},
			{
				x: 7,
				y: 6.2,
				label: ""
			},
			{
				x: 7,
				y: 6.7,
				label: ""
			},
			{
				x: 8,
				y: 7,
				label: ""
			},
			{
				x: 9,
				y: 8.7,
				label: ""
			},
			{
				x: 10,
				y: 7.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 4
				},
				b: {
					x: 8,
					y: 10
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 2
				}
			},
			{
				a: {
					x: 0,
					y: 2
				},
				b: {
					x: 8,
					y: 8
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 2
				}
			},
			{
				a: {
					x: 0,
					y: 4
				},
				b: {
					x: 10,
					y: 5
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 2
				}
			}
		],
		title: "Scatter plot with lines A, B, and C",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 2,
				label: ""
			},
			{
				x: 3,
				y: 3,
				label: ""
			},
			{
				x: 4,
				y: 3.5,
				label: ""
			},
			{
				x: 4,
				y: 5,
				label: ""
			},
			{
				x: 5,
				y: 5.5,
				label: ""
			},
			{
				x: 6,
				y: 6,
				label: ""
			},
			{
				x: 7,
				y: 6.2,
				label: ""
			},
			{
				x: 7,
				y: 6.7,
				label: ""
			},
			{
				x: 8,
				y: 7,
				label: ""
			},
			{
				x: 9,
				y: 8.7,
				label: ""
			},
			{
				x: 10,
				y: 7.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 5
				},
				b: {
					x: 4,
					y: 2
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 2
				},
				b: {
					x: 8,
					y: 10
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 5
				},
				b: {
					x: 10,
					y: 6
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 5,
				label: ""
			},
			{
				x: 3,
				y: 5.3,
				label: ""
			},
			{
				x: 3.5,
				y: 5.5,
				label: ""
			},
			{
				x: 4,
				y: 5,
				label: ""
			},
			{
				x: 4.5,
				y: 5.5,
				label: ""
			},
			{
				x: 5,
				y: 5.5,
				label: ""
			},
			{
				x: 6,
				y: 6,
				label: ""
			},
			{
				x: 7,
				y: 5.2,
				label: ""
			},
			{
				x: 7.5,
				y: 5.3,
				label: ""
			},
			{
				x: 8,
				y: 6,
				label: ""
			},
			{
				x: 9,
				y: 5.7,
				label: ""
			},
			{
				x: 10,
				y: 5.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 6.5,
					y: 2
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 8
				},
				b: {
					x: 10,
					y: 7
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 0
				},
				b: {
					x: 1,
					y: 2
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 8,
				label: ""
			},
			{
				x: 2,
				y: 8.1,
				label: ""
			},
			{
				x: 2.5,
				y: 7.8,
				label: ""
			},
			{
				x: 3,
				y: 7.9,
				label: ""
			},
			{
				x: 3.5,
				y: 7.6,
				label: ""
			},
			{
				x: 4,
				y: 7.5,
				label: ""
			},
			{
				x: 5,
				y: 7.4,
				label: ""
			},
			{
				x: 6,
				y: 7.2,
				label: ""
			},
			{
				x: 6.5,
				y: 7.2,
				label: ""
			},
			{
				x: 7,
				y: 7.1,
				label: ""
			},
			{
				x: 8,
				y: 7,
				label: ""
			},
			{
				x: 9,
				y: 6.9,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 10
				},
				b: {
					x: 9,
					y: 3
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 8,
					y: 7
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 4
				},
				b: {
					x: 10,
					y: 3
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 9,
				label: ""
			},
			{
				x: 3,
				y: 8,
				label: ""
			},
			{
				x: 3.5,
				y: 7.5,
				label: ""
			},
			{
				x: 4,
				y: 6.5,
				label: ""
			},
			{
				x: 1,
				y: 1.2,
				label: ""
			},
			{
				x: 6,
				y: 6,
				label: ""
			},
			{
				x: 4.5,
				y: 3.9,
				label: ""
			},
			{
				x: 2,
				y: 2,
				label: ""
			},
			{
				x: 3,
				y: 3.5,
				label: ""
			},
			{
				x: 3.5,
				y: 3.5,
				label: ""
			},
			{
				x: 2.5,
				y: 2.31,
				label: ""
			},
			{
				x: 6,
				y: 5,
				label: ""
			},
			{
				x: 5,
				y: 6.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 10,
					y: 6
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 5
				},
				b: {
					x: 5,
					y: 0
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 6
				},
				b: {
					x: 8,
					y: 0
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 4,
				label: ""
			},
			{
				x: 3,
				y: 7,
				label: ""
			},
			{
				x: 3,
				y: 3,
				label: ""
			},
			{
				x: 4,
				y: 5.5,
				label: ""
			},
			{
				x: 4.4,
				y: 2,
				label: ""
			},
			{
				x: 6,
				y: 4,
				label: ""
			},
			{
				x: 5,
				y: 6.5,
				label: ""
			},
			{
				x: 7,
				y: 7.2,
				label: ""
			},
			{
				x: 7,
				y: 7.7,
				label: ""
			},
			{
				x: 9,
				y: 1.7,
				label: ""
			},
			{
				x: 8,
				y: 2.4,
				label: ""
			},
			{
				x: 10,
				y: 2.7,
				label: ""
			},
			{
				x: 2,
				y: 3,
				label: ""
			},
			{
				x: 3,
				y: 4.5,
				label: ""
			},
			{
				x: 3.5,
				y: 4.5,
				label: ""
			},
			{
				x: 4,
				y: 5.5,
				label: ""
			},
			{
				x: 6,
				y: 2,
				label: ""
			},
			{
				x: 5,
				y: 4.5,
				label: ""
			},
			{
				x: 7,
				y: 1.2,
				label: ""
			},
			{
				x: 7,
				y: 3.7,
				label: ""
			},
			{
				x: 9,
				y: 4,
				label: ""
			},
			{
				x: 8,
				y: 5.4,
				label: ""
			},
			{
				x: 10,
				y: 7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 7
				},
				b: {
					x: 10,
					y: 7
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 9,
					y: 9
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 8
				},
				b: {
					x: 4,
					y: 2
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 1.5,
				label: ""
			},
			{
				x: 2,
				y: 3,
				label: ""
			},
			{
				x: 2.5,
				y: 3.7,
				label: ""
			},
			{
				x: 3,
				y: 3.5,
				label: ""
			},
			{
				x: 3.5,
				y: 4.5,
				label: ""
			},
			{
				x: 5,
				y: 5.5,
				label: ""
			},
			{
				x: 4,
				y: 4.9,
				label: ""
			},
			{
				x: 6,
				y: 6.2,
				label: ""
			},
			{
				x: 7,
				y: 7.1,
				label: ""
			},
			{
				x: 8,
				y: 8.5,
				label: ""
			},
			{
				x: 0,
				y: 0.9,
				label: ""
			},
			{
				x: 7.5,
				y: 7.7,
				label: ""
			},
			{
				x: 9,
				y: 9,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 7
				},
				b: {
					x: 8,
					y: 1
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 0
				},
				b: {
					x: 8,
					y: 6
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 8
				},
				b: {
					x: 8,
					y: 2
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: -1,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 6,
				y: 4,
				label: ""
			},
			{
				x: 8.5,
				y: 1.5,
				label: ""
			},
			{
				x: 7,
				y: 4.7,
				label: ""
			},
			{
				x: 9,
				y: 6.7,
				label: ""
			},
			{
				x: 8,
				y: 6.4,
				label: ""
			},
			{
				x: 10,
				y: 7.7,
				label: ""
			},
			{
				x: 6,
				y: 3,
				label: ""
			},
			{
				x: 7,
				y: 2.8,
				label: ""
			},
			{
				x: 7,
				y: 2.2,
				label: ""
			},
			{
				x: 9,
				y: 0.5,
				label: ""
			},
			{
				x: 8,
				y: 1.8,
				label: ""
			},
			{
				x: 10,
				y: -0.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 1,
					y: 0
				},
				b: {
					x: 10,
					y: 10
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 8,
					y: 10
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 3
				},
				b: {
					x: 5,
					y: 8.5
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 0,
				y: 0.5,
				label: ""
			},
			{
				x: 1,
				y: 1.5,
				label: ""
			},
			{
				x: 2,
				y: 3,
				label: ""
			},
			{
				x: 2.5,
				y: 3.7,
				label: ""
			},
			{
				x: 3,
				y: 4.5,
				label: ""
			},
			{
				x: 3.5,
				y: 5,
				label: ""
			},
			{
				x: 4,
				y: 5.5,
				label: ""
			},
			{
				x: 5,
				y: 7,
				label: ""
			},
			{
				x: 6,
				y: 7.2,
				label: ""
			},
			{
				x: 7,
				y: 8.1,
				label: ""
			},
			{
				x: 7.5,
				y: 9.7,
				label: ""
			},
			{
				x: 8,
				y: 9.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 8
				},
				b: {
					x: 8,
					y: 6
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 9,
					y: 5
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 8.1,
					y: 10
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 1.5,
				label: ""
			},
			{
				x: 2,
				y: 3,
				label: ""
			},
			{
				x: 2.5,
				y: 3.7,
				label: ""
			},
			{
				x: 3,
				y: 4.5,
				label: ""
			},
			{
				x: 3.5,
				y: 5,
				label: ""
			},
			{
				x: 5,
				y: 7,
				label: ""
			},
			{
				x: 4,
				y: 6.5,
				label: ""
			},
			{
				x: 6,
				y: 7.2,
				label: ""
			},
			{
				x: 7,
				y: 7.9,
				label: ""
			},
			{
				x: 8,
				y: 9.5,
				label: ""
			},
			{
				x: 0,
				y: 0.5,
				label: ""
			},
			{
				x: 7.5,
				y: 9.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 8
				},
				b: {
					x: 9,
					y: 3.5
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 6
				},
				b: {
					x: 8,
					y: 8
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 10,
					y: 7
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 7.8,
				label: ""
			},
			{
				x: 2,
				y: 8,
				label: ""
			},
			{
				x: 3,
				y: 7,
				label: ""
			},
			{
				x: 3.5,
				y: 6.5,
				label: ""
			},
			{
				x: 4,
				y: 6.5,
				label: ""
			},
			{
				x: 4.5,
				y: 5.8,
				label: ""
			},
			{
				x: 5,
				y: 6,
				label: ""
			},
			{
				x: 6,
				y: 5.5,
				label: ""
			},
			{
				x: 7,
				y: 5.2,
				label: ""
			},
			{
				x: 8,
				y: 5.1,
				label: ""
			},
			{
				x: 9,
				y: 4.1,
				label: ""
			},
			{
				x: 10,
				y: 3.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 9.5
				},
				b: {
					x: 10,
					y: 1.5
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 7,
					y: 5
				},
				b: {
					x: 10,
					y: 1.5
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 1,
					y: 5
				},
				b: {
					x: 10,
					y: 1.5
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 11,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 8,
				label: ""
			},
			{
				x: 3,
				y: 7,
				label: ""
			},
			{
				x: 3.5,
				y: 6.5,
				label: ""
			},
			{
				x: 4,
				y: 6.5,
				label: ""
			},
			{
				x: 4.5,
				y: 6,
				label: ""
			},
			{
				x: 6,
				y: 5,
				label: ""
			},
			{
				x: 5,
				y: 5.5,
				label: ""
			},
			{
				x: 7,
				y: 4.2,
				label: ""
			},
			{
				x: 7,
				y: 4.7,
				label: ""
			},
			{
				x: 8,
				y: 3.4,
				label: ""
			},
			{
				x: 9,
				y: 2.7,
				label: ""
			},
			{
				x: 10,
				y: 2.7,
				label: ""
			},
			{
				x: 10.5,
				y: 2,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 7
				},
				b: {
					x: 8,
					y: 1
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#E1A158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 0
				},
				b: {
					x: 8,
					y: 6
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#A24D61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 8
				},
				b: {
					x: 8,
					y: 2
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77B05D",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 7,
				label: ""
			},
			{
				x: 3,
				y: 6,
				label: ""
			},
			{
				x: 3.5,
				y: 5.5,
				label: ""
			},
			{
				x: 4,
				y: 4.5,
				label: ""
			},
			{
				x: 4,
				y: 4,
				label: ""
			},
			{
				x: 6,
				y: 4,
				label: ""
			},
			{
				x: 5,
				y: 3.5,
				label: ""
			},
			{
				x: 7,
				y: 4.2,
				label: ""
			},
			{
				x: 7,
				y: 4.7,
				label: ""
			},
			{
				x: 9,
				y: 6.7,
				label: ""
			},
			{
				x: 8,
				y: 5.4,
				label: ""
			},
			{
				x: 10,
				y: 5.7,
				label: ""
			},
			{
				x: 2,
				y: 0,
				label: ""
			},
			{
				x: 3,
				y: 1.5,
				label: ""
			},
			{
				x: 3.5,
				y: 1.5,
				label: ""
			},
			{
				x: 4,
				y: 2.5,
				label: ""
			},
			{
				x: 6,
				y: 3,
				label: ""
			},
			{
				x: 5,
				y: 4.5,
				label: ""
			},
			{
				x: 7,
				y: 3.2,
				label: ""
			},
			{
				x: 7,
				y: 2.7,
				label: ""
			},
			{
				x: 9,
				y: 1,
				label: ""
			},
			{
				x: 8,
				y: 2.4,
				label: ""
			},
			{
				x: 10,
				y: 0.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 6
				},
				b: {
					x: 8,
					y: 10
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 3
				},
				b: {
					x: 8,
					y: 1
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 9
				},
				b: {
					x: 10,
					y: 4
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "Scatterplot with lines A, B, and C",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 3,
				label: ""
			},
			{
				x: 3,
				y: 6,
				label: ""
			},
			{
				x: 3,
				y: 9,
				label: ""
			},
			{
				x: 4,
				y: 6.5,
				label: ""
			},
			{
				x: 4.4,
				y: 1,
				label: ""
			},
			{
				x: 6,
				y: 3,
				label: ""
			},
			{
				x: 5,
				y: 5.5,
				label: ""
			},
			{
				x: 7,
				y: 6.2,
				label: ""
			},
			{
				x: 7,
				y: 6.7,
				label: ""
			},
			{
				x: 9,
				y: 8.7,
				label: ""
			},
			{
				x: 8,
				y: 7.4,
				label: ""
			},
			{
				x: 10,
				y: 1.7,
				label: ""
			},
			{
				x: 2,
				y: 2,
				label: ""
			},
			{
				x: 3,
				y: 3.5,
				label: ""
			},
			{
				x: 3.5,
				y: 3.5,
				label: ""
			},
			{
				x: 4,
				y: 8.5,
				label: ""
			},
			{
				x: 6,
				y: 1,
				label: ""
			},
			{
				x: 5,
				y: 6.5,
				label: ""
			},
			{
				x: 7,
				y: 8.2,
				label: ""
			},
			{
				x: 7,
				y: 2.7,
				label: ""
			},
			{
				x: 9,
				y: 3,
				label: ""
			},
			{
				x: 8,
				y: 4.4,
				label: ""
			},
			{
				x: 10,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 2
				},
				b: {
					x: 7,
					y: 1
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 3
				},
				b: {
					x: 8,
					y: 9
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 6,
					y: 10
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 1.8,
				label: ""
			},
			{
				x: 2,
				y: 3.5,
				label: ""
			},
			{
				x: 2.5,
				y: 3.9,
				label: ""
			},
			{
				x: 3,
				y: 5.5,
				label: ""
			},
			{
				x: 3.5,
				y: 6,
				label: ""
			},
			{
				x: 5,
				y: 9,
				label: ""
			},
			{
				x: 4,
				y: 6.9,
				label: ""
			},
			{
				x: 6,
				y: 9.8,
				label: ""
			},
			{
				x: 5.5,
				y: 9.5,
				label: ""
			},
			{
				x: 4.5,
				y: 8,
				label: ""
			},
			{
				x: 0,
				y: 0.5,
				label: ""
			},
			{
				x: 1.5,
				y: 3,
				label: ""
			},
			{
				x: 0.5,
				y: 1.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 7
				},
				b: {
					x: 8,
					y: 1
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 3
				},
				b: {
					x: 8,
					y: 1
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 1,
					y: 2
				},
				b: {
					x: 9,
					y: 6
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 7,
				label: ""
			},
			{
				x: 2,
				y: 6,
				label: ""
			},
			{
				x: 2.5,
				y: 5.5,
				label: ""
			},
			{
				x: 3,
				y: 4.5,
				label: ""
			},
			{
				x: 3,
				y: 4,
				label: ""
			},
			{
				x: 5,
				y: 4,
				label: ""
			},
			{
				x: 4,
				y: 3.5,
				label: ""
			},
			{
				x: 7,
				y: 1,
				label: ""
			},
			{
				x: 9,
				y: 0,
				label: ""
			},
			{
				x: 1,
				y: 3,
				label: ""
			},
			{
				x: 2,
				y: 2.5,
				label: ""
			},
			{
				x: 2.5,
				y: 2.5,
				label: ""
			},
			{
				x: 3,
				y: 2,
				label: ""
			},
			{
				x: 5,
				y: 1.7,
				label: ""
			},
			{
				x: 4,
				y: 1.7,
				label: ""
			},
			{
				x: 6,
				y: 1.3,
				label: ""
			},
			{
				x: 6,
				y: 2.7,
				label: ""
			},
			{
				x: 8,
				y: 1,
				label: ""
			},
			{
				x: 7,
				y: 2.4,
				label: ""
			},
			{
				x: 9,
				y: 0.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 9
				},
				b: {
					x: 10,
					y: 4
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#E1A158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 8,
					y: 7
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#A24D61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 4
				},
				b: {
					x: 8,
					y: 6
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77B05D",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 3,
				label: ""
			},
			{
				x: 3,
				y: 4,
				label: ""
			},
			{
				x: 3,
				y: 8,
				label: ""
			},
			{
				x: 4,
				y: 6.5,
				label: ""
			},
			{
				x: 4.4,
				y: 1,
				label: ""
			},
			{
				x: 6,
				y: 3,
				label: ""
			},
			{
				x: 5,
				y: 5.5,
				label: ""
			},
			{
				x: 7,
				y: 6.2,
				label: ""
			},
			{
				x: 7,
				y: 6.7,
				label: ""
			},
			{
				x: 9,
				y: 8.7,
				label: ""
			},
			{
				x: 8,
				y: 7.4,
				label: ""
			},
			{
				x: 10,
				y: 7.7,
				label: ""
			},
			{
				x: 2,
				y: 2,
				label: ""
			},
			{
				x: 3,
				y: 0.5,
				label: ""
			},
			{
				x: 3.5,
				y: 3.5,
				label: ""
			},
			{
				x: 4,
				y: 8.5,
				label: ""
			},
			{
				x: 6,
				y: 9,
				label: ""
			},
			{
				x: 5,
				y: 6.5,
				label: ""
			},
			{
				x: 7,
				y: 8.2,
				label: ""
			},
			{
				x: 7,
				y: 4.7,
				label: ""
			},
			{
				x: 9,
				y: 3,
				label: ""
			},
			{
				x: 8,
				y: 4.4,
				label: ""
			},
			{
				x: 10,
				y: 5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 4
				},
				b: {
					x: 8,
					y: 0
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 1,
					y: 0
				},
				b: {
					x: 10,
					y: 8.5
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 10,
					y: 1
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 1,
				label: ""
			},
			{
				x: 3,
				y: 1.2,
				label: ""
			},
			{
				x: 3.5,
				y: 1.5,
				label: ""
			},
			{
				x: 4,
				y: 1.2,
				label: ""
			},
			{
				x: 4.5,
				y: 0.9,
				label: ""
			},
			{
				x: 6,
				y: 0.9,
				label: ""
			},
			{
				x: 5,
				y: 1,
				label: ""
			},
			{
				x: 7,
				y: 1.2,
				label: ""
			},
			{
				x: 7.7,
				y: 0.7,
				label: ""
			},
			{
				x: 9,
				y: 0.8,
				label: ""
			},
			{
				x: 8,
				y: 1.1,
				label: ""
			},
			{
				x: 10,
				y: 1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 9
				},
				b: {
					x: 8,
					y: 3
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 2
				},
				b: {
					x: 8,
					y: 8
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 4
				},
				b: {
					x: 10,
					y: 5
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "Scatter plot with lines A, B, and C",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 2,
				y: 3,
				label: ""
			},
			{
				x: 3,
				y: 4.3,
				label: ""
			},
			{
				x: 3.5,
				y: 4.5,
				label: ""
			},
			{
				x: 1.5,
				y: 2,
				label: ""
			},
			{
				x: 4,
				y: 5,
				label: ""
			},
			{
				x: 6,
				y: 6,
				label: ""
			},
			{
				x: 5,
				y: 5.5,
				label: ""
			},
			{
				x: 7,
				y: 5.2,
				label: ""
			},
			{
				x: 7,
				y: 4.7,
				label: ""
			},
			{
				x: 9,
				y: 3.7,
				label: ""
			},
			{
				x: 8,
				y: 4.4,
				label: ""
			},
			{
				x: 10,
				y: 2.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 1
				},
				b: {
					x: 8,
					y: 3
				},
				type: "twoPoints",
				label: "A",
				style: {
					dash: false,
					color: "#a24d61",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 2
				},
				b: {
					x: 8,
					y: 10
				},
				type: "twoPoints",
				label: "B",
				style: {
					dash: false,
					color: "#e1a158",
					strokeWidth: 3
				}
			},
			{
				a: {
					x: 0,
					y: 4
				},
				b: {
					x: 8,
					y: 10
				},
				type: "twoPoints",
				label: "C",
				style: {
					dash: false,
					color: "#77b05d",
					strokeWidth: 3
				}
			}
		],
		title: "",
		width: 425,
		xAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 3,
				label: ""
			},
			{
				x: 2,
				y: 6,
				label: ""
			},
			{
				x: 2,
				y: 2,
				label: ""
			},
			{
				x: 3,
				y: 4.5,
				label: ""
			},
			{
				x: 3.4,
				y: 1,
				label: ""
			},
			{
				x: 5,
				y: 7,
				label: ""
			},
			{
				x: 4,
				y: 5.5,
				label: ""
			},
			{
				x: 5,
				y: 7.2,
				label: ""
			},
			{
				x: 6,
				y: 7.7,
				label: ""
			},
			{
				x: 8,
				y: 0.7,
				label: ""
			},
			{
				x: 7,
				y: 1.4,
				label: ""
			},
			{
				x: 9,
				y: 2.7,
				label: ""
			},
			{
				x: 1,
				y: 2,
				label: ""
			},
			{
				x: 2,
				y: 3.5,
				label: ""
			},
			{
				x: 2.5,
				y: 3.5,
				label: ""
			},
			{
				x: 5,
				y: 1,
				label: ""
			},
			{
				x: 4,
				y: 3.5,
				label: ""
			},
			{
				x: 6,
				y: 7.2,
				label: ""
			},
			{
				x: 6,
				y: 2.7,
				label: ""
			},
			{
				x: 8,
				y: 3,
				label: ""
			},
			{
				x: 7,
				y: 8.4,
				label: ""
			},
			{
				x: 1,
				y: 5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 45
				},
				b: {
					x: 1,
					y: 55
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29abca",
					strokeWidth: 2
				}
			}
		],
		title: "Study time and test score",
		width: 366,
		xAxis: {
			max: 10,
			min: 0,
			label: "Study time in hours",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 10
		},
		height: 369,
		points: [
			{
				x: 4.4,
				y: 68,
				label: ""
			},
			{
				x: 5.4,
				y: 68,
				label: ""
			},
			{
				x: 3.8,
				y: 56,
				label: ""
			},
			{
				x: 6.4,
				y: 68,
				label: ""
			},
			{
				x: 6.6,
				y: 80,
				label: ""
			},
			{
				x: 6,
				y: 76,
				label: ""
			},
			{
				x: 2.8,
				y: 68,
				label: ""
			},
			{
				x: 7.8,
				y: 80,
				label: ""
			},
			{
				x: 7.6,
				y: 77,
				label: ""
			},
			{
				x: 7.2,
				y: 84,
				label: ""
			},
			{
				x: 9.4,
				y: 89,
				label: ""
			},
			{
				x: 7.6,
				y: 76,
				label: ""
			},
			{
				x: 3.2,
				y: 52,
				label: ""
			},
			{
				x: 5.2,
				y: 83,
				label: ""
			},
			{
				x: 4.4,
				y: 73,
				label: ""
			},
			{
				x: 1,
				y: 43,
				label: ""
			},
			{
				x: 4.2,
				y: 70,
				label: ""
			},
			{
				x: 7.8,
				y: 84,
				label: ""
			},
			{
				x: 5.4,
				y: 66,
				label: ""
			},
			{
				x: 1,
				y: 45,
				label: ""
			},
			{
				x: 5.2,
				y: 66,
				label: ""
			},
			{
				x: 7.4,
				y: 70,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 40
				},
				b: {
					x: 100,
					y: 15
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#11accd",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 363.303,
		xAxis: {
			max: 100,
			min: 0,
			label: "Kilometers driven in thousands",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 40,
			min: 0,
			label: "Price in thousands of dollars",
			gridLines: true,
			tickInterval: 5
		},
		height: 357.143,
		points: [
			{
				x: 0,
				y: 40,
				label: ""
			},
			{
				x: 10,
				y: 38,
				label: ""
			},
			{
				x: 21,
				y: 34,
				label: ""
			},
			{
				x: 29,
				y: 31,
				label: ""
			},
			{
				x: 40,
				y: 28,
				label: ""
			},
			{
				x: 49,
				y: 28,
				label: ""
			},
			{
				x: 61,
				y: 25,
				label: ""
			},
			{
				x: 70,
				y: 24,
				label: ""
			},
			{
				x: 78,
				y: 21,
				label: ""
			},
			{
				x: 89,
				y: 19,
				label: ""
			},
			{
				x: 99,
				y: 13,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 42
				},
				b: {
					x: 8,
					y: 10
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29abca",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 375,
		xAxis: {
			max: 10,
			min: 0,
			label: "Average number of buses per hour",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "Number of complaints",
			gridLines: true,
			tickInterval: 10
		},
		height: 355,
		points: [
			{
				x: 2.5,
				y: 38,
				label: ""
			},
			{
				x: 3.125,
				y: 33,
				label: ""
			},
			{
				x: 5.3125,
				y: 21,
				label: ""
			},
			{
				x: 6.25,
				y: 23,
				label: ""
			},
			{
				x: 6.5625,
				y: 20,
				label: ""
			},
			{
				x: 7.8125,
				y: 17,
				label: ""
			},
			{
				x: 9.0625,
				y: 14,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 8,
					y: 0
				},
				b: {
					x: 60,
					y: 330
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29ABCA",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 342,
		xAxis: {
			max: 60,
			min: 0,
			label: "Foot length (cm)",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 330,
			min: 0,
			label: "Shoulder height (cm)",
			gridLines: true,
			tickInterval: 30
		},
		height: 334,
		points: []
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0.5,
					y: 0.5
				},
				b: {
					x: 3.5,
					y: 2
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29ABCA",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 367,
		xAxis: {
			max: 10,
			min: 0,
			label: "Exercise in hours",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Weight lost in kilograms",
			gridLines: true,
			tickInterval: 1
		},
		height: 370,
		points: [
			{
				x: 1,
				y: 0.8,
				label: ""
			},
			{
				x: 2,
				y: 1.6,
				label: ""
			},
			{
				x: 3,
				y: 1.9,
				label: ""
			},
			{
				x: 4,
				y: 2.3,
				label: ""
			},
			{
				x: 5,
				y: 2.7,
				label: ""
			},
			{
				x: 6,
				y: 3.1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 7.5
				},
				b: {
					x: 5,
					y: 2.5
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29abca",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 351,
		xAxis: {
			max: 10,
			min: 0,
			label: "Hours online",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Mood rating",
			gridLines: true,
			tickInterval: 1
		},
		height: 348,
		points: [
			{
				x: 1,
				y: 6.8,
				label: ""
			},
			{
				x: 2,
				y: 5.6,
				label: ""
			},
			{
				x: 3,
				y: 5.8,
				label: ""
			},
			{
				x: 4,
				y: 5.5,
				label: ""
			},
			{
				x: 5,
				y: 4.85,
				label: ""
			},
			{
				x: 6,
				y: 4.7,
				label: ""
			},
			{
				x: 7,
				y: 4.1,
				label: ""
			},
			{
				x: 8,
				y: 3.9,
				label: ""
			},
			{
				x: 9,
				y: 2.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 28
				},
				b: {
					x: 11,
					y: 6
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29abca",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 382,
		xAxis: {
			max: 11,
			min: 0,
			label: "Average March temperature in degrees Celsius",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "Date in April of first bloom",
			gridLines: true,
			tickInterval: 1
		},
		height: 368,
		points: [
			{
				x: 0.25,
				y: 29,
				label: ""
			},
			{
				x: 10.4,
				y: 8,
				label: ""
			},
			{
				x: 1,
				y: 24,
				label: ""
			},
			{
				x: 5.1,
				y: 21,
				label: ""
			},
			{
				x: 3,
				y: 23,
				label: ""
			},
			{
				x: 0.42,
				y: 26,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 1,
					y: 2
				},
				b: {
					x: 2,
					y: 4.5
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#11accd",
					strokeWidth: 2
				}
			}
		],
		title: "Rating vs. Cost per package",
		width: 360,
		xAxis: {
			max: 3,
			min: 0,
			label: "Cost per package in dollars",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Rating",
			gridLines: true,
			tickInterval: 1
		},
		height: 368,
		points: [
			{
				x: 0.91,
				y: 2.22,
				label: ""
			},
			{
				x: 2.09,
				y: 6.3,
				label: ""
			},
			{
				x: 2.07,
				y: 5.65,
				label: ""
			},
			{
				x: 2.61,
				y: 5.68,
				label: ""
			},
			{
				x: 1.8,
				y: 4.67,
				label: ""
			},
			{
				x: 2.22,
				y: 5.68,
				label: ""
			},
			{
				x: 2.13,
				y: 4.88,
				label: ""
			},
			{
				x: 1.73,
				y: 3.47,
				label: ""
			},
			{
				x: 1.58,
				y: 4.16,
				label: ""
			},
			{
				x: 2.84,
				y: 6.19,
				label: ""
			},
			{
				x: 1.73,
				y: 3.17,
				label: ""
			},
			{
				x: 2.04,
				y: 5.33,
				label: ""
			},
			{
				x: 2.32,
				y: 5.27,
				label: ""
			},
			{
				x: 1.91,
				y: 3.43,
				label: ""
			},
			{
				x: 1.96,
				y: 4.43,
				label: ""
			},
			{
				x: 2.33,
				y: 6.16,
				label: ""
			},
			{
				x: 2.33,
				y: 6.56,
				label: ""
			},
			{
				x: 2.82,
				y: 5.66,
				label: ""
			},
			{
				x: 1.25,
				y: 3.04,
				label: ""
			},
			{
				x: 0.82,
				y: 0.59,
				label: ""
			},
			{
				x: 1.52,
				y: 4.16,
				label: ""
			},
			{
				x: 2.72,
				y: 6.15,
				label: ""
			},
			{
				x: 1.44,
				y: 2.32,
				label: ""
			},
			{
				x: 1.64,
				y: 3.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 40
				},
				b: {
					x: 40,
					y: 20
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29abca",
					strokeWidth: 3
				}
			}
		],
		title: "Percentage of adults who smoke vs. years since 1967",
		width: 371,
		xAxis: {
			max: 40,
			min: 0,
			label: "Years since 1967",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "Percentage of adults who smoke",
			gridLines: true,
			tickInterval: 5
		},
		height: 365,
		points: [
			{
				x: 0,
				y: 40,
				label: ""
			},
			{
				x: 5,
				y: 38,
				label: ""
			},
			{
				x: 10,
				y: 35,
				label: ""
			},
			{
				x: 15,
				y: 33,
				label: ""
			},
			{
				x: 20,
				y: 30.5,
				label: ""
			},
			{
				x: 25,
				y: 29,
				label: ""
			},
			{
				x: 30,
				y: 26,
				label: ""
			},
			{
				x: 35,
				y: 22.5,
				label: ""
			},
			{
				x: 40,
				y: 20.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 1.5
				},
				b: {
					x: 4,
					y: 9.5
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29abca",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 358.5,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time in hours",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Distance in kilometers",
			gridLines: true,
			tickInterval: 2
		},
		height: 354,
		points: [
			{
				x: 2,
				y: 5,
				label: ""
			},
			{
				x: 2.75,
				y: 8,
				label: ""
			},
			{
				x: 4,
				y: 9.5,
				label: ""
			},
			{
				x: 7.25,
				y: 16,
				label: ""
			},
			{
				x: 8.5,
				y: 18,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 800
				},
				b: {
					x: 5,
					y: 1000
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#11accd",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 375,
		xAxis: {
			max: 13,
			min: 0,
			label: "Years after 2000",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 1300,
			min: 700,
			label: "Average rent in dollars per month",
			gridLines: true,
			tickInterval: 100
		},
		height: 358,
		points: [
			{
				x: 0,
				y: 800,
				label: ""
			},
			{
				x: 5,
				y: 1000,
				label: ""
			},
			{
				x: 13,
				y: 1250,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 1,
					y: 2
				},
				b: {
					x: 3,
					y: 7
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#11accd",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 388,
		xAxis: {
			max: 10,
			min: 0,
			label: "Age in years",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Kilometers driven in thousands",
			gridLines: true,
			tickInterval: 1
		},
		height: 352,
		points: [
			{
				x: 0.083,
				y: 0.2,
				label: ""
			},
			{
				x: 0.583,
				y: 0.733,
				label: ""
			},
			{
				x: 0.917,
				y: 1,
				label: ""
			},
			{
				x: 1,
				y: 0.853,
				label: ""
			},
			{
				x: 1.5,
				y: 1.667,
				label: ""
			},
			{
				x: 1.833,
				y: 2.133,
				label: ""
			},
			{
				x: 2.083,
				y: 3,
				label: ""
			},
			{
				x: 2.5,
				y: 2.8,
				label: ""
			},
			{
				x: 2.917,
				y: 3.2,
				label: ""
			},
			{
				x: 3.167,
				y: 2.933,
				label: ""
			},
			{
				x: 4.333,
				y: 4.2,
				label: ""
			},
			{
				x: 5.417,
				y: 5.733,
				label: ""
			},
			{
				x: 7.5,
				y: 6.667,
				label: ""
			},
			{
				x: 7.667,
				y: 7.667,
				label: ""
			},
			{
				x: 8.333,
				y: 8.667,
				label: ""
			},
			{
				x: 9.583,
				y: 9.333,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 20
				},
				b: {
					x: 4,
					y: 100
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#11accd",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 366,
		xAxis: {
			max: 5,
			min: 0,
			label: "Study time (hours)",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 110,
			min: 0,
			label: "Test score",
			gridLines: true,
			tickInterval: 10
		},
		height: 369,
		points: [
			{
				x: 0.5,
				y: 45,
				label: ""
			},
			{
				x: 0.7,
				y: 50,
				label: ""
			},
			{
				x: 1,
				y: 58,
				label: ""
			},
			{
				x: 1.2,
				y: 62,
				label: ""
			},
			{
				x: 1.5,
				y: 68,
				label: ""
			},
			{
				x: 1.8,
				y: 73,
				label: ""
			},
			{
				x: 2,
				y: 78,
				label: ""
			},
			{
				x: 2.2,
				y: 82,
				label: ""
			},
			{
				x: 2.5,
				y: 85,
				label: ""
			},
			{
				x: 2.8,
				y: 88,
				label: ""
			},
			{
				x: 3,
				y: 90,
				label: ""
			},
			{
				x: 3.3,
				y: 92,
				label: ""
			},
			{
				x: 3.6,
				y: 94,
				label: ""
			},
			{
				x: 3.9,
				y: 96,
				label: ""
			},
			{
				x: 4.2,
				y: 98,
				label: ""
			},
			{
				x: 4.5,
				y: 95,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 5
				},
				b: {
					x: 3,
					y: 9.5
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29abca",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 366,
		xAxis: {
			max: 10,
			min: 0,
			label: "Hours playing sports",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Mood rating",
			gridLines: true,
			tickInterval: 1
		},
		height: 366,
		points: [
			{
				x: 0,
				y: 4.8,
				label: ""
			},
			{
				x: 1,
				y: 5.33,
				label: ""
			},
			{
				x: 2,
				y: 6.86,
				label: ""
			},
			{
				x: 3,
				y: 7.17,
				label: ""
			},
			{
				x: 4,
				y: 8.25,
				label: ""
			},
			{
				x: 5,
				y: 8.5,
				label: ""
			},
			{
				x: 6,
				y: 9.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 0
				},
				b: {
					x: 100,
					y: 100
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29abca",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 360,
		xAxis: {
			max: 100,
			min: 0,
			label: "Exam 1 score",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Exam 2 score",
			gridLines: true,
			tickInterval: 10
		},
		height: 360,
		points: [
			{
				x: 37,
				y: 28.8,
				label: ""
			},
			{
				x: 83,
				y: 72.7,
				label: ""
			},
			{
				x: 77,
				y: 71,
				label: ""
			},
			{
				x: 71,
				y: 72,
				label: ""
			},
			{
				x: 82,
				y: 71.4,
				label: ""
			},
			{
				x: 81,
				y: 72.1,
				label: ""
			},
			{
				x: 96,
				y: 91.5,
				label: ""
			},
			{
				x: 70,
				y: 71.6,
				label: ""
			},
			{
				x: 31,
				y: 37.7,
				label: ""
			},
			{
				x: 41,
				y: 23.8,
				label: ""
			},
			{
				x: 72,
				y: 74.9,
				label: ""
			},
			{
				x: 64,
				y: 68.3,
				label: ""
			},
			{
				x: 70,
				y: 67.9,
				label: ""
			},
			{
				x: 44,
				y: 35.6,
				label: ""
			},
			{
				x: 70,
				y: 77.2,
				label: ""
			},
			{
				x: 38,
				y: 36.9,
				label: ""
			},
			{
				x: 72,
				y: 90.1,
				label: ""
			},
			{
				x: 29,
				y: 24.8,
				label: ""
			},
			{
				x: 55,
				y: 63.1,
				label: ""
			},
			{
				x: 38,
				y: 34.8,
				label: ""
			},
			{
				x: 73,
				y: 75.1,
				label: ""
			},
			{
				x: 37,
				y: 49.9,
				label: ""
			},
			{
				x: 49,
				y: 37,
				label: ""
			},
			{
				x: 90,
				y: 95.5,
				label: ""
			},
			{
				x: 65,
				y: 68.2,
				label: ""
			},
			{
				x: 37,
				y: 30.8,
				label: ""
			},
			{
				x: 67,
				y: 59.8,
				label: ""
			},
			{
				x: 56,
				y: 58.9,
				label: ""
			},
			{
				x: 97,
				y: 95.8,
				label: ""
			},
			{
				x: 65,
				y: 61.5,
				label: ""
			},
			{
				x: 35,
				y: 31.3,
				label: ""
			},
			{
				x: 60,
				y: 54.2,
				label: ""
			},
			{
				x: 84,
				y: 97.5,
				label: ""
			},
			{
				x: 70,
				y: 64.4,
				label: ""
			},
			{
				x: 56,
				y: 62.9,
				label: ""
			},
			{
				x: 53,
				y: 61.3,
				label: ""
			},
			{
				x: 51,
				y: 53.5,
				label: ""
			},
			{
				x: 45,
				y: 58.1,
				label: ""
			},
			{
				x: 24,
				y: 20.1,
				label: ""
			},
			{
				x: 75,
				y: 31,
				label: ""
			},
			{
				x: 31,
				y: 83,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: -3.5
				},
				b: {
					x: 2.25,
					y: 28
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#29abca",
					strokeWidth: 2
				}
			}
		],
		title: "",
		width: 360,
		xAxis: {
			max: 2.5,
			min: 0,
			label: "Goals scored per match",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 30,
			min: -5,
			label: "Number of wins",
			gridLines: true,
			tickInterval: 5
		},
		height: 355,
		points: []
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 370,
		xAxis: {
			max: 12,
			min: 0,
			label: "Hours spent on video games",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 24,
			min: 0,
			label: "Hours spent on homework",
			gridLines: true,
			tickInterval: 4
		},
		height: 360,
		points: [
			{
				x: 5.6,
				y: 19.104,
				label: ""
			},
			{
				x: 3.92,
				y: 15.072,
				label: ""
			},
			{
				x: 7.44,
				y: 9.792,
				label: ""
			},
			{
				x: 4.96,
				y: 14.4,
				label: ""
			},
			{
				x: 8.16,
				y: 8.832,
				label: ""
			},
			{
				x: 11.36,
				y: 3.072,
				label: ""
			},
			{
				x: 7.68,
				y: 10.08,
				label: ""
			},
			{
				x: 4.4,
				y: 15.36,
				label: ""
			},
			{
				x: 9.76,
				y: 10.464,
				label: ""
			},
			{
				x: 5.84,
				y: 15.552,
				label: ""
			},
			{
				x: 0.4,
				y: 22.56,
				label: ""
			},
			{
				x: 2.32,
				y: 18.24,
				label: ""
			},
			{
				x: 5.68,
				y: 10.464,
				label: ""
			},
			{
				x: 4.8,
				y: 16.704,
				label: ""
			},
			{
				x: 6.72,
				y: 9.504,
				label: ""
			},
			{
				x: 8.64,
				y: 6.912,
				label: ""
			},
			{
				x: 6.56,
				y: 9.6,
				label: ""
			},
			{
				x: 2.24,
				y: 14.112,
				label: ""
			},
			{
				x: 6,
				y: 11.52,
				label: ""
			},
			{
				x: 4.48,
				y: 14.4,
				label: ""
			},
			{
				x: 5.12,
				y: 15.936,
				label: ""
			},
			{
				x: 6.08,
				y: 16.512,
				label: ""
			},
			{
				x: 6.16,
				y: 12.192,
				label: ""
			},
			{
				x: 6.4,
				y: 12.96,
				label: ""
			},
			{
				x: 3.6,
				y: 17.952,
				label: ""
			},
			{
				x: 3.52,
				y: 16.8,
				label: ""
			},
			{
				x: 5.36,
				y: 13.056,
				label: ""
			},
			{
				x: 2.72,
				y: 19.968,
				label: ""
			},
			{
				x: 8.32,
				y: 8.16,
				label: ""
			},
			{
				x: 8.56,
				y: 3.264,
				label: ""
			},
			{
				x: 6.8,
				y: 9.408,
				label: ""
			},
			{
				x: 6.96,
				y: 12.576,
				label: ""
			},
			{
				x: 3.84,
				y: 14.784,
				label: ""
			},
			{
				x: 4,
				y: 15.168,
				label: ""
			},
			{
				x: 6.96,
				y: 12.096,
				label: ""
			},
			{
				x: 4.4,
				y: 9.216,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 360,
		xAxis: {
			max: 10,
			min: 0,
			label: "Cost per package in dollars",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Rating",
			gridLines: true,
			tickInterval: 1
		},
		height: 368,
		points: [
			{
				x: 3.03,
				y: 2.22,
				label: ""
			},
			{
				x: 6.97,
				y: 6.3,
				label: ""
			},
			{
				x: 6.9,
				y: 5.65,
				label: ""
			},
			{
				x: 8.7,
				y: 5.68,
				label: ""
			},
			{
				x: 6,
				y: 4.67,
				label: ""
			},
			{
				x: 7.4,
				y: 5.68,
				label: ""
			},
			{
				x: 7.1,
				y: 4.88,
				label: ""
			},
			{
				x: 5.77,
				y: 3.47,
				label: ""
			},
			{
				x: 5.27,
				y: 4.16,
				label: ""
			},
			{
				x: 9.47,
				y: 6.19,
				label: ""
			},
			{
				x: 5.77,
				y: 3.17,
				label: ""
			},
			{
				x: 6.8,
				y: 5.33,
				label: ""
			},
			{
				x: 7.73,
				y: 5.27,
				label: ""
			},
			{
				x: 6.37,
				y: 3.43,
				label: ""
			},
			{
				x: 6.53,
				y: 4.43,
				label: ""
			},
			{
				x: 7.77,
				y: 6.16,
				label: ""
			},
			{
				x: 7.77,
				y: 6.56,
				label: ""
			},
			{
				x: 9.4,
				y: 5.66,
				label: ""
			},
			{
				x: 4.17,
				y: 3.04,
				label: ""
			},
			{
				x: 2.73,
				y: 0.59,
				label: ""
			},
			{
				x: 5.07,
				y: 4.16,
				label: ""
			},
			{
				x: 9.07,
				y: 6.15,
				label: ""
			},
			{
				x: 4.8,
				y: 2.32,
				label: ""
			},
			{
				x: 5.47,
				y: 3.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Average rent (dollars per month) vs. years after 2000",
		width: 375,
		xAxis: {
			max: 13,
			min: 0,
			label: "Years after 2000",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 1300,
			min: 800,
			label: "Average rent in dollars per month",
			gridLines: true,
			tickInterval: 50
		},
		height: 358,
		points: [
			{
				x: 0,
				y: 800,
				label: ""
			},
			{
				x: 1,
				y: 827,
				label: ""
			},
			{
				x: 2,
				y: 866,
				label: ""
			},
			{
				x: 3,
				y: 901,
				label: ""
			},
			{
				x: 4,
				y: 939,
				label: ""
			},
			{
				x: 5,
				y: 962,
				label: ""
			},
			{
				x: 6,
				y: 1000,
				label: ""
			},
			{
				x: 7,
				y: 1069,
				label: ""
			},
			{
				x: 8,
				y: 1189,
				label: ""
			},
			{
				x: 9,
				y: 1184,
				label: ""
			},
			{
				x: 10,
				y: 1228,
				label: ""
			},
			{
				x: 11,
				y: 1268,
				label: ""
			},
			{
				x: 12,
				y: 1288,
				label: ""
			},
			{
				x: 13,
				y: 1250,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 366,
		xAxis: {
			max: 10,
			min: 0,
			label: "Study time in hours",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 1
		},
		height: 369,
		points: [
			{
				x: 6.28,
				y: 8.71,
				label: ""
			},
			{
				x: 3.62,
				y: 6.21,
				label: ""
			},
			{
				x: 4.57,
				y: 7.8,
				label: ""
			},
			{
				x: 4.29,
				y: 6.66,
				label: ""
			},
			{
				x: 6.37,
				y: 9.21,
				label: ""
			},
			{
				x: 4.67,
				y: 7.23,
				label: ""
			},
			{
				x: 6.78,
				y: 9.26,
				label: ""
			},
			{
				x: 5.46,
				y: 6.53,
				label: ""
			},
			{
				x: 5.13,
				y: 8.05,
				label: ""
			},
			{
				x: 5.34,
				y: 8.19,
				label: ""
			},
			{
				x: 8.54,
				y: 9.55,
				label: ""
			},
			{
				x: 3.98,
				y: 6.47,
				label: ""
			},
			{
				x: 5.43,
				y: 7.9,
				label: ""
			},
			{
				x: 7.96,
				y: 8.81,
				label: ""
			},
			{
				x: 8.84,
				y: 9.45,
				label: ""
			},
			{
				x: 6.86,
				y: 9.18,
				label: ""
			},
			{
				x: 7.07,
				y: 9.66,
				label: ""
			},
			{
				x: 5.12,
				y: 8.18,
				label: ""
			},
			{
				x: 5.21,
				y: 6.14,
				label: ""
			},
			{
				x: 6.91,
				y: 9.3,
				label: ""
			},
			{
				x: 6.55,
				y: 8.48,
				label: ""
			},
			{
				x: 7.39,
				y: 9.27,
				label: ""
			},
			{
				x: 6.15,
				y: 8.87,
				label: ""
			},
			{
				x: 7.12,
				y: 9.49,
				label: ""
			},
			{
				x: 1.25,
				y: 4.31,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Average income vs. average rent",
		width: 405,
		xAxis: {
			max: 60000,
			min: 35000,
			label: "Average income (dollars)",
			gridLines: true,
			tickInterval: 5000
		},
		yAxis: {
			max: 1600,
			min: 800,
			label: "Average rent (dollars)",
			gridLines: true,
			tickInterval: 200
		},
		height: 375,
		points: [
			{
				x: 57296,
				y: 1324,
				label: ""
			},
			{
				x: 50011,
				y: 961,
				label: ""
			},
			{
				x: 50003,
				y: 1071,
				label: ""
			},
			{
				x: 42219,
				y: 932,
				label: ""
			},
			{
				x: 41821,
				y: 893,
				label: ""
			},
			{
				x: 54628,
				y: 1259,
				label: ""
			},
			{
				x: 49957,
				y: 905,
				label: ""
			},
			{
				x: 58866,
				y: 1421,
				label: ""
			},
			{
				x: 58866,
				y: 1554,
				label: ""
			},
			{
				x: 43420,
				y: 1073,
				label: ""
			},
			{
				x: 43605,
				y: 896,
				label: ""
			},
			{
				x: 40440,
				y: 858,
				label: ""
			},
			{
				x: 51552,
				y: 1303,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 352.5,
		xAxis: {
			max: 10,
			min: 0,
			label: "Length of ownership in months",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Exercise per month in hours",
			gridLines: true,
			tickInterval: 1
		},
		height: 363,
		points: [
			{
				x: 0.8333333333,
				y: 9,
				label: ""
			},
			{
				x: 2.5,
				y: 7,
				label: ""
			},
			{
				x: 5,
				y: 6,
				label: ""
			},
			{
				x: 6.6666666667,
				y: 4,
				label: ""
			},
			{
				x: 9.1666666667,
				y: 2,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 360,
		xAxis: {
			max: 10,
			min: 0,
			label: "Years since 1945",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 45,
			min: 20,
			label: "Percent of adults who smoke",
			gridLines: true,
			tickInterval: 5
		},
		height: 354,
		points: [
			{
				x: 0,
				y: 42,
				label: ""
			},
			{
				x: 0.89,
				y: 37,
				label: ""
			},
			{
				x: 2,
				y: 37,
				label: ""
			},
			{
				x: 2.89,
				y: 34,
				label: ""
			},
			{
				x: 3.78,
				y: 33,
				label: ""
			},
			{
				x: 4.44,
				y: 30,
				label: ""
			},
			{
				x: 4.89,
				y: 29,
				label: ""
			},
			{
				x: 5.56,
				y: 25.5,
				label: ""
			},
			{
				x: 7.11,
				y: 24.7,
				label: ""
			},
			{
				x: 7.78,
				y: 23,
				label: ""
			},
			{
				x: 8.22,
				y: 22,
				label: ""
			},
			{
				x: 8.67,
				y: 20.9,
				label: ""
			},
			{
				x: 9.11,
				y: 20.8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 360,
		xAxis: {
			max: 100,
			min: 0,
			label: "Exam 1 score",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Exam 2 score",
			gridLines: true,
			tickInterval: 10
		},
		height: 360,
		points: [
			{
				x: 37,
				y: 28.8,
				label: ""
			},
			{
				x: 83,
				y: 72.7,
				label: ""
			},
			{
				x: 77,
				y: 71,
				label: ""
			},
			{
				x: 71,
				y: 72,
				label: ""
			},
			{
				x: 82,
				y: 71.4,
				label: ""
			},
			{
				x: 81,
				y: 72.1,
				label: ""
			},
			{
				x: 96,
				y: 91.5,
				label: ""
			},
			{
				x: 70,
				y: 71.6,
				label: ""
			},
			{
				x: 31,
				y: 37.7,
				label: ""
			},
			{
				x: 41,
				y: 23.8,
				label: ""
			},
			{
				x: 72,
				y: 74.9,
				label: ""
			},
			{
				x: 64,
				y: 68.3,
				label: ""
			},
			{
				x: 70,
				y: 67.9,
				label: ""
			},
			{
				x: 44,
				y: 35.6,
				label: ""
			},
			{
				x: 70,
				y: 77.2,
				label: ""
			},
			{
				x: 38,
				y: 36.9,
				label: ""
			},
			{
				x: 72,
				y: 90.1,
				label: ""
			},
			{
				x: 29,
				y: 24.8,
				label: ""
			},
			{
				x: 55,
				y: 63.1,
				label: ""
			},
			{
				x: 38,
				y: 34.8,
				label: ""
			},
			{
				x: 73,
				y: 75.1,
				label: ""
			},
			{
				x: 37,
				y: 49.9,
				label: ""
			},
			{
				x: 49,
				y: 37,
				label: ""
			},
			{
				x: 90,
				y: 95.5,
				label: ""
			},
			{
				x: 65,
				y: 68.2,
				label: ""
			},
			{
				x: 37,
				y: 30.8,
				label: ""
			},
			{
				x: 67,
				y: 59.8,
				label: ""
			},
			{
				x: 56,
				y: 58.9,
				label: ""
			},
			{
				x: 97,
				y: 95.8,
				label: ""
			},
			{
				x: 65,
				y: 61.5,
				label: ""
			},
			{
				x: 35,
				y: 31.3,
				label: ""
			},
			{
				x: 60,
				y: 54.2,
				label: ""
			},
			{
				x: 84,
				y: 97.5,
				label: ""
			},
			{
				x: 70,
				y: 64.4,
				label: ""
			},
			{
				x: 56,
				y: 62.9,
				label: ""
			},
			{
				x: 53,
				y: 61.3,
				label: ""
			},
			{
				x: 51,
				y: 53.5,
				label: ""
			},
			{
				x: 45,
				y: 58.1,
				label: ""
			},
			{
				x: 24,
				y: 20.1,
				label: ""
			},
			{
				x: 75,
				y: 31,
				label: ""
			},
			{
				x: 31,
				y: 83,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 342,
		xAxis: {
			max: 60,
			min: 15,
			label: "Foot lengths in centimeters",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 300,
			min: 80,
			label: "Shoulder height in centimeters",
			gridLines: true,
			tickInterval: 20
		},
		height: 334,
		points: [
			{
				x: 18,
				y: 100,
				label: ""
			},
			{
				x: 19,
				y: 110,
				label: ""
			},
			{
				x: 20,
				y: 118,
				label: ""
			},
			{
				x: 21,
				y: 125,
				label: ""
			},
			{
				x: 22,
				y: 130,
				label: ""
			},
			{
				x: 23,
				y: 138,
				label: ""
			},
			{
				x: 24,
				y: 142,
				label: ""
			},
			{
				x: 25,
				y: 150,
				label: ""
			},
			{
				x: 26,
				y: 158,
				label: ""
			},
			{
				x: 27,
				y: 162,
				label: ""
			},
			{
				x: 28,
				y: 170,
				label: ""
			},
			{
				x: 29,
				y: 176,
				label: ""
			},
			{
				x: 30,
				y: 182,
				label: ""
			},
			{
				x: 31,
				y: 188,
				label: ""
			},
			{
				x: 32,
				y: 196,
				label: ""
			},
			{
				x: 33,
				y: 202,
				label: ""
			},
			{
				x: 34,
				y: 210,
				label: ""
			},
			{
				x: 35,
				y: 216,
				label: ""
			},
			{
				x: 36,
				y: 222,
				label: ""
			},
			{
				x: 37,
				y: 228,
				label: ""
			},
			{
				x: 38,
				y: 234,
				label: ""
			},
			{
				x: 39,
				y: 240,
				label: ""
			},
			{
				x: 40,
				y: 246,
				label: ""
			},
			{
				x: 41,
				y: 254,
				label: ""
			},
			{
				x: 42,
				y: 260,
				label: ""
			},
			{
				x: 43,
				y: 266,
				label: ""
			},
			{
				x: 44,
				y: 272,
				label: ""
			},
			{
				x: 45,
				y: 278,
				label: ""
			},
			{
				x: 46,
				y: 284,
				label: ""
			},
			{
				x: 47,
				y: 286,
				label: ""
			},
			{
				x: 48,
				y: 290,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 366,
		xAxis: {
			max: 10,
			min: 0,
			label: "Hours playing sports",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Mood rating",
			gridLines: true,
			tickInterval: 1
		},
		height: 366,
		points: [
			{
				x: 0,
				y: 4.8,
				label: ""
			},
			{
				x: 1,
				y: 5.3333333333,
				label: ""
			},
			{
				x: 2,
				y: 6.8571428571,
				label: ""
			},
			{
				x: 3,
				y: 7.1666666667,
				label: ""
			},
			{
				x: 4,
				y: 8.25,
				label: ""
			},
			{
				x: 5,
				y: 8.5,
				label: ""
			},
			{
				x: 6,
				y: 9.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 396,
		xAxis: {
			max: 18,
			min: 8,
			label: "Years of education",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 70000,
			min: 0,
			label: "Annual Income in dollars",
			gridLines: true,
			tickInterval: 10000
		},
		height: 364,
		points: [
			{
				x: 12.91,
				y: 33524,
				label: ""
			},
			{
				x: 13.7,
				y: 55741,
				label: ""
			},
			{
				x: 11.79,
				y: 40283,
				label: ""
			},
			{
				x: 15.88,
				y: 48690,
				label: ""
			},
			{
				x: 14.2,
				y: 28180,
				label: ""
			},
			{
				x: 14.12,
				y: 52980,
				label: ""
			},
			{
				x: 14.08,
				y: 21583,
				label: ""
			},
			{
				x: 12.78,
				y: 27408,
				label: ""
			},
			{
				x: 14.25,
				y: 37272,
				label: ""
			},
			{
				x: 14.43,
				y: 38083,
				label: ""
			},
			{
				x: 13.57,
				y: 9119,
				label: ""
			},
			{
				x: 14.2,
				y: 28866,
				label: ""
			},
			{
				x: 13.29,
				y: 21006,
				label: ""
			},
			{
				x: 11.73,
				y: 11189,
				label: ""
			},
			{
				x: 13.91,
				y: 19170,
				label: ""
			},
			{
				x: 14.54,
				y: 41400,
				label: ""
			},
			{
				x: 13.54,
				y: 34329,
				label: ""
			},
			{
				x: 14.66,
				y: 39165,
				label: ""
			},
			{
				x: 13.97,
				y: 52346,
				label: ""
			},
			{
				x: 13.19,
				y: 24767,
				label: ""
			},
			{
				x: 13.59,
				y: 40049,
				label: ""
			},
			{
				x: 12.78,
				y: 22237,
				label: ""
			},
			{
				x: 15.24,
				y: 39954,
				label: ""
			},
			{
				x: 14.2,
				y: 53803,
				label: ""
			},
			{
				x: 13.61,
				y: 16794,
				label: ""
			},
			{
				x: 14.99,
				y: 62804,
				label: ""
			},
			{
				x: 13.26,
				y: 35137,
				label: ""
			},
			{
				x: 15.17,
				y: 40387,
				label: ""
			},
			{
				x: 13.73,
				y: 22758,
				label: ""
			},
			{
				x: 13.89,
				y: 49527,
				label: ""
			},
			{
				x: 12.91,
				y: 32022,
				label: ""
			},
			{
				x: 14.89,
				y: 42859,
				label: ""
			},
			{
				x: 11.99,
				y: 7800,
				label: ""
			},
			{
				x: 14.06,
				y: 43351,
				label: ""
			},
			{
				x: 12.61,
				y: 13441,
				label: ""
			},
			{
				x: 11.17,
				y: 3846,
				label: ""
			},
			{
				x: 13.17,
				y: 18659,
				label: ""
			},
			{
				x: 14.86,
				y: 46336,
				label: ""
			},
			{
				x: 15.22,
				y: 52425,
				label: ""
			},
			{
				x: 12.45,
				y: 53680,
				label: ""
			},
			{
				x: 14.02,
				y: 48570,
				label: ""
			},
			{
				x: 14.39,
				y: 33435,
				label: ""
			},
			{
				x: 9.97,
				y: 0,
				label: ""
			},
			{
				x: 12.5,
				y: 24919,
				label: ""
			},
			{
				x: 14.34,
				y: 33940,
				label: ""
			},
			{
				x: 11.74,
				y: 23806,
				label: ""
			},
			{
				x: 15.08,
				y: 34980,
				label: ""
			},
			{
				x: 13.07,
				y: 48863,
				label: ""
			},
			{
				x: 13.46,
				y: 48897,
				label: ""
			},
			{
				x: 13.29,
				y: 9435,
				label: ""
			},
			{
				x: 14.36,
				y: 45438,
				label: ""
			},
			{
				x: 11.82,
				y: 11687,
				label: ""
			},
			{
				x: 15.28,
				y: 58538,
				label: ""
			},
			{
				x: 13.88,
				y: 33001,
				label: ""
			},
			{
				x: 15.25,
				y: 47125,
				label: ""
			},
			{
				x: 13.7,
				y: 39447,
				label: ""
			},
			{
				x: 12.03,
				y: 0,
				label: ""
			},
			{
				x: 12.9,
				y: 18264,
				label: ""
			},
			{
				x: 13.5,
				y: 19193,
				label: ""
			},
			{
				x: 12.97,
				y: 19545,
				label: ""
			},
			{
				x: 11.58,
				y: 10258,
				label: ""
			},
			{
				x: 11.34,
				y: 0,
				label: ""
			},
			{
				x: 12.03,
				y: 16272,
				label: ""
			},
			{
				x: 13.81,
				y: 42538,
				label: ""
			},
			{
				x: 13.36,
				y: 41244,
				label: ""
			},
			{
				x: 15.01,
				y: 64386,
				label: ""
			},
			{
				x: 13.21,
				y: 22810,
				label: ""
			},
			{
				x: 14.37,
				y: 38344,
				label: ""
			},
			{
				x: 15.04,
				y: 53817,
				label: ""
			},
			{
				x: 14.87,
				y: 8861,
				label: ""
			},
			{
				x: 13.34,
				y: 23489,
				label: ""
			},
			{
				x: 11.66,
				y: 24370,
				label: ""
			},
			{
				x: 14.01,
				y: 48332,
				label: ""
			},
			{
				x: 12.73,
				y: 20088,
				label: ""
			},
			{
				x: 12.86,
				y: 18598,
				label: ""
			},
			{
				x: 13.03,
				y: 10715,
				label: ""
			},
			{
				x: 13.37,
				y: 25149,
				label: ""
			},
			{
				x: 14.74,
				y: 49147,
				label: ""
			},
			{
				x: 15.45,
				y: 62572,
				label: ""
			},
			{
				x: 11.92,
				y: 28759,
				label: ""
			},
			{
				x: 13.48,
				y: 18973,
				label: ""
			},
			{
				x: 12.93,
				y: 13407,
				label: ""
			},
			{
				x: 11.55,
				y: 30259,
				label: ""
			},
			{
				x: 13.98,
				y: 32795,
				label: ""
			},
			{
				x: 13.37,
				y: 4450,
				label: ""
			},
			{
				x: 13.51,
				y: 43553,
				label: ""
			},
			{
				x: 13.9,
				y: 23724,
				label: ""
			},
			{
				x: 13.88,
				y: 22365,
				label: ""
			},
			{
				x: 12.86,
				y: 20884,
				label: ""
			},
			{
				x: 13.85,
				y: 45394,
				label: ""
			},
			{
				x: 11.71,
				y: 27195,
				label: ""
			},
			{
				x: 12.23,
				y: 7868,
				label: ""
			},
			{
				x: 14.01,
				y: 34873,
				label: ""
			},
			{
				x: 16.04,
				y: 42325,
				label: ""
			},
			{
				x: 13.85,
				y: 27285,
				label: ""
			},
			{
				x: 11.59,
				y: 0,
				label: ""
			},
			{
				x: 14,
				y: 26709,
				label: ""
			},
			{
				x: 13.11,
				y: 33720,
				label: ""
			},
			{
				x: 13.01,
				y: 22888,
				label: ""
			},
			{
				x: 13.75,
				y: 15645,
				label: ""
			},
			{
				x: 13.48,
				y: 22285,
				label: ""
			},
			{
				x: 14.05,
				y: 33267,
				label: ""
			},
			{
				x: 15.9,
				y: 45130,
				label: ""
			},
			{
				x: 12.84,
				y: 41096,
				label: ""
			},
			{
				x: 13.47,
				y: 21240,
				label: ""
			},
			{
				x: 12.84,
				y: 28060,
				label: ""
			},
			{
				x: 12.34,
				y: 9654,
				label: ""
			},
			{
				x: 12.05,
				y: 14408,
				label: ""
			},
			{
				x: 12.74,
				y: 33204,
				label: ""
			},
			{
				x: 13.72,
				y: 37761,
				label: ""
			},
			{
				x: 14.51,
				y: 35994,
				label: ""
			},
			{
				x: 11.65,
				y: 708,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 366,
		xAxis: {
			max: 10,
			min: 0,
			label: "Study time (hours)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 100,
			min: 40,
			label: "Score",
			gridLines: true,
			tickInterval: 10
		},
		height: 369,
		points: [
			{
				x: 4.4,
				y: 68,
				label: ""
			},
			{
				x: 5.4,
				y: 68,
				label: ""
			},
			{
				x: 3.8,
				y: 56,
				label: ""
			},
			{
				x: 6.4,
				y: 68,
				label: ""
			},
			{
				x: 6.6,
				y: 80,
				label: ""
			},
			{
				x: 6,
				y: 76,
				label: ""
			},
			{
				x: 2.8,
				y: 68,
				label: ""
			},
			{
				x: 7.8,
				y: 80,
				label: ""
			},
			{
				x: 7.6,
				y: 77,
				label: ""
			},
			{
				x: 7.2,
				y: 84,
				label: ""
			},
			{
				x: 9.4,
				y: 89,
				label: ""
			},
			{
				x: 7.6,
				y: 76,
				label: ""
			},
			{
				x: 3.2,
				y: 52,
				label: ""
			},
			{
				x: 5.2,
				y: 83,
				label: ""
			},
			{
				x: 4.4,
				y: 73,
				label: ""
			},
			{
				x: 1,
				y: 43,
				label: ""
			},
			{
				x: 4.2,
				y: 70,
				label: ""
			},
			{
				x: 7.8,
				y: 84,
				label: ""
			},
			{
				x: 5.4,
				y: 66,
				label: ""
			},
			{
				x: 1,
				y: 45,
				label: ""
			},
			{
				x: 5.2,
				y: 66,
				label: ""
			},
			{
				x: 7.4,
				y: 70,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 351,
		xAxis: {
			max: 10,
			min: 0,
			label: "Hours online",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Mood rating",
			gridLines: true,
			tickInterval: 1
		},
		height: 348,
		points: [
			{
				x: 1,
				y: 6.8,
				label: ""
			},
			{
				x: 2,
				y: 5.6,
				label: ""
			},
			{
				x: 3,
				y: 5.8,
				label: ""
			},
			{
				x: 4,
				y: 5.5,
				label: ""
			},
			{
				x: 5,
				y: 4.85,
				label: ""
			},
			{
				x: 6,
				y: 4.7,
				label: ""
			},
			{
				x: 7,
				y: 4.1,
				label: ""
			},
			{
				x: 8,
				y: 3.9,
				label: ""
			},
			{
				x: 9,
				y: 2.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 354,
		xAxis: {
			max: 50,
			min: 30,
			label: "Latitude (degrees)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 80,
			min: 0,
			label: "Temperature (°F)",
			gridLines: true,
			tickInterval: 10
		},
		height: 356,
		points: [
			{
				x: 35,
				y: 50.3,
				label: ""
			},
			{
				x: 36.3,
				y: 43.4,
				label: ""
			},
			{
				x: 36.9,
				y: 40,
				label: ""
			},
			{
				x: 38.3,
				y: 35.4,
				label: ""
			},
			{
				x: 37.4,
				y: 53.7,
				label: ""
			},
			{
				x: 40.7,
				y: 48,
				label: ""
			},
			{
				x: 42.6,
				y: 17.1,
				label: ""
			},
			{
				x: 43.4,
				y: 25.1,
				label: ""
			},
			{
				x: 42.4,
				y: 29.7,
				label: ""
			},
			{
				x: 41.8,
				y: 34.3,
				label: ""
			},
			{
				x: 34.8,
				y: 51.4,
				label: ""
			},
			{
				x: 30,
				y: 74.3,
				label: ""
			},
			{
				x: 31,
				y: 66.3,
				label: ""
			},
			{
				x: 45,
				y: 25.1,
				label: ""
			},
			{
				x: 43.8,
				y: 21.7,
				label: ""
			},
			{
				x: 45.4,
				y: 13.7,
				label: ""
			},
			{
				x: 47.7,
				y: 9.1,
				label: ""
			},
			{
				x: 46.7,
				y: 2.3,
				label: ""
			},
			{
				x: 40.5,
				y: 25.1,
				label: ""
			},
			{
				x: 41.2,
				y: 30.9,
				label: ""
			},
			{
				x: 38.1,
				y: 27.4,
				label: ""
			},
			{
				x: 38.7,
				y: 38.9,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 375,
		xAxis: {
			max: 25,
			min: 15,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 25,
			min: 8,
			label: "Accidents per 100 drivers",
			gridLines: true,
			tickInterval: 1
		},
		height: 369,
		points: [
			{
				x: 16,
				y: 23,
				label: ""
			},
			{
				x: 17,
				y: 20,
				label: ""
			},
			{
				x: 18,
				y: 19,
				label: ""
			},
			{
				x: 19,
				y: 14,
				label: ""
			},
			{
				x: 20,
				y: 14,
				label: ""
			},
			{
				x: 21,
				y: 13,
				label: ""
			},
			{
				x: 22,
				y: 13,
				label: ""
			},
			{
				x: 23,
				y: 17,
				label: ""
			},
			{
				x: 24,
				y: 10,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Scatterplot",
		width: 350,
		xAxis: {
			max: 14,
			min: 0,
			label: "x",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 6,
			min: -6,
			label: "y",
			gridLines: true,
			tickInterval: 2
		},
		height: 343,
		points: [
			{
				x: 0,
				y: 4.6,
				label: ""
			},
			{
				x: 0.5,
				y: 3.6,
				label: ""
			},
			{
				x: 1,
				y: 1.3,
				label: ""
			},
			{
				x: 1.5,
				y: 0.2,
				label: ""
			},
			{
				x: 2,
				y: -1,
				label: ""
			},
			{
				x: 2.5,
				y: -1.8,
				label: ""
			},
			{
				x: 3,
				y: -2.7,
				label: ""
			},
			{
				x: 3.5,
				y: -3.2,
				label: ""
			},
			{
				x: 4,
				y: -3.7,
				label: ""
			},
			{
				x: 4.5,
				y: -3.95,
				label: ""
			},
			{
				x: 5,
				y: -4.1,
				label: ""
			},
			{
				x: 5.5,
				y: -3.9,
				label: ""
			},
			{
				x: 6,
				y: -3.7,
				label: ""
			},
			{
				x: 6.5,
				y: -3.1,
				label: ""
			},
			{
				x: 7,
				y: -2.5,
				label: ""
			},
			{
				x: 7.5,
				y: -1.6,
				label: ""
			},
			{
				x: 8,
				y: -0.8,
				label: ""
			},
			{
				x: 8.5,
				y: 0.4,
				label: ""
			},
			{
				x: 9,
				y: 1.6,
				label: ""
			},
			{
				x: 9.5,
				y: 3.2,
				label: ""
			},
			{
				x: 10,
				y: 4.8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Heart rate vs. life expectancy",
		width: 404,
		xAxis: {
			max: 600,
			min: 0,
			label: "Heart rate, in beats per minute",
			gridLines: true,
			tickInterval: 50
		},
		yAxis: {
			max: 40,
			min: 0,
			label: "Life expectancy, in years",
			gridLines: true,
			tickInterval: 5
		},
		height: 377,
		points: [
			{
				x: 40,
				y: 40,
				label: ""
			},
			{
				x: 60,
				y: 30,
				label: ""
			},
			{
				x: 80,
				y: 22,
				label: ""
			},
			{
				x: 100,
				y: 18,
				label: ""
			},
			{
				x: 120,
				y: 15,
				label: ""
			},
			{
				x: 140,
				y: 13,
				label: ""
			},
			{
				x: 160,
				y: 11,
				label: ""
			},
			{
				x: 180,
				y: 10,
				label: ""
			},
			{
				x: 200,
				y: 9,
				label: ""
			},
			{
				x: 225,
				y: 8.5,
				label: ""
			},
			{
				x: 250,
				y: 7.8,
				label: ""
			},
			{
				x: 275,
				y: 7,
				label: ""
			},
			{
				x: 300,
				y: 6.4,
				label: ""
			},
			{
				x: 325,
				y: 5.9,
				label: ""
			},
			{
				x: 350,
				y: 5.5,
				label: ""
			},
			{
				x: 380,
				y: 5,
				label: ""
			},
			{
				x: 410,
				y: 4.7,
				label: ""
			},
			{
				x: 440,
				y: 4.4,
				label: ""
			},
			{
				x: 470,
				y: 4.2,
				label: ""
			},
			{
				x: 500,
				y: 4.1,
				label: ""
			},
			{
				x: 530,
				y: 4,
				label: ""
			},
			{
				x: 560,
				y: 4,
				label: ""
			},
			{
				x: 580,
				y: 4,
				label: ""
			},
			{
				x: 600,
				y: 4,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Population density vs. average 1-bedroom rent",
		width: 400,
		xAxis: {
			max: 45000,
			min: 0,
			label: "Population density, in people per square kilometer",
			gridLines: true,
			tickInterval: 5000
		},
		yAxis: {
			max: 2000,
			min: 0,
			label: "Average 1-bedroom rent, in dollars per month",
			gridLines: true,
			tickInterval: 100
		},
		height: 385,
		points: [
			{
				x: 2000,
				y: 825,
				label: ""
			},
			{
				x: 4000,
				y: 909,
				label: ""
			},
			{
				x: 5000,
				y: 950,
				label: ""
			},
			{
				x: 6000,
				y: 918,
				label: ""
			},
			{
				x: 8000,
				y: 1007,
				label: ""
			},
			{
				x: 10000,
				y: 1001,
				label: ""
			},
			{
				x: 12000,
				y: 1105,
				label: ""
			},
			{
				x: 14000,
				y: 1119,
				label: ""
			},
			{
				x: 15500,
				y: 1220,
				label: ""
			},
			{
				x: 16000,
				y: 1258,
				label: ""
			},
			{
				x: 18000,
				y: 1237,
				label: ""
			},
			{
				x: 20000,
				y: 1351,
				label: ""
			},
			{
				x: 22000,
				y: 1300,
				label: ""
			},
			{
				x: 24000,
				y: 1449,
				label: ""
			},
			{
				x: 26000,
				y: 1438,
				label: ""
			},
			{
				x: 28000,
				y: 1577,
				label: ""
			},
			{
				x: 30000,
				y: 1521,
				label: ""
			},
			{
				x: 32000,
				y: 1670,
				label: ""
			},
			{
				x: 34000,
				y: 1644,
				label: ""
			},
			{
				x: 35000,
				y: 1747,
				label: ""
			},
			{
				x: 36000,
				y: 1783,
				label: ""
			},
			{
				x: 38000,
				y: 1762,
				label: ""
			},
			{
				x: 40000,
				y: 1831,
				label: ""
			},
			{
				x: 42000,
				y: 1895,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title:
			"Population density vs. CO2 emissions per person (36 Japanese cities)",
		width: 375,
		xAxis: {
			max: 3500,
			min: 0,
			label: "People, per square kilometer",
			gridLines: true,
			tickInterval: 500
		},
		yAxis: {
			max: 25,
			min: 0,
			label: "CO2 emissions per person, in metric tons",
			gridLines: true,
			tickInterval: 1
		},
		height: 375,
		points: [
			{
				x: 400,
				y: 6.5,
				label: ""
			},
			{
				x: 550,
				y: 5.8,
				label: ""
			},
			{
				x: 600,
				y: 7.2,
				label: ""
			},
			{
				x: 700,
				y: 6.9,
				label: ""
			},
			{
				x: 800,
				y: 8.1,
				label: ""
			},
			{
				x: 900,
				y: 7.4,
				label: ""
			},
			{
				x: 1000,
				y: 9,
				label: ""
			},
			{
				x: 750,
				y: 5.5,
				label: ""
			},
			{
				x: 650,
				y: 7.9,
				label: ""
			},
			{
				x: 850,
				y: 6.3,
				label: ""
			},
			{
				x: 1200,
				y: 10.5,
				label: ""
			},
			{
				x: 1400,
				y: 9.8,
				label: ""
			},
			{
				x: 1600,
				y: 11.2,
				label: ""
			},
			{
				x: 1800,
				y: 10,
				label: ""
			},
			{
				x: 2000,
				y: 12.5,
				label: ""
			},
			{
				x: 2500,
				y: 15,
				label: ""
			},
			{
				x: 3000,
				y: 18.2,
				label: ""
			},
			{
				x: 3200,
				y: 20.4,
				label: ""
			},
			{
				x: 3400,
				y: 17.1,
				label: ""
			},
			{
				x: 1500,
				y: 21,
				label: ""
			},
			{
				x: 2200,
				y: 4,
				label: ""
			},
			{
				x: 2800,
				y: 7,
				label: ""
			},
			{
				x: 500,
				y: 14,
				label: ""
			},
			{
				x: 3100,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Scatterplot",
		width: 432,
		xAxis: {
			max: 24,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 140,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 10
		},
		height: 394,
		points: [
			{
				x: 1,
				y: 95,
				label: ""
			},
			{
				x: 2,
				y: 81,
				label: ""
			},
			{
				x: 3,
				y: 66,
				label: ""
			},
			{
				x: 4,
				y: 53,
				label: ""
			},
			{
				x: 5,
				y: 42,
				label: ""
			},
			{
				x: 6,
				y: 32,
				label: ""
			},
			{
				x: 7,
				y: 24,
				label: ""
			},
			{
				x: 8,
				y: 18,
				label: ""
			},
			{
				x: 9,
				y: 12,
				label: ""
			},
			{
				x: 10,
				y: 9,
				label: ""
			},
			{
				x: 11,
				y: 8,
				label: ""
			},
			{
				x: 12,
				y: 10,
				label: ""
			},
			{
				x: 13,
				y: 13,
				label: ""
			},
			{
				x: 14,
				y: 17,
				label: ""
			},
			{
				x: 15,
				y: 23,
				label: ""
			},
			{
				x: 16,
				y: 31,
				label: ""
			},
			{
				x: 17,
				y: 41,
				label: ""
			},
			{
				x: 18,
				y: 54,
				label: ""
			},
			{
				x: 19,
				y: 68,
				label: ""
			},
			{
				x: 20,
				y: 82,
				label: ""
			},
			{
				x: 21,
				y: 100,
				label: ""
			},
			{
				x: 22,
				y: 118,
				label: ""
			},
			{
				x: 2.5,
				y: 88,
				label: ""
			},
			{
				x: 3.5,
				y: 60,
				label: ""
			},
			{
				x: 17.5,
				y: 45,
				label: ""
			},
			{
				x: 19.5,
				y: 75,
				label: ""
			},
			{
				x: 9.5,
				y: 11,
				label: ""
			},
			{
				x: 10.2,
				y: 10,
				label: ""
			},
			{
				x: 10.5,
				y: 9,
				label: ""
			},
			{
				x: 10.8,
				y: 9,
				label: ""
			},
			{
				x: 11.2,
				y: 9,
				label: ""
			},
			{
				x: 11.5,
				y: 11,
				label: ""
			},
			{
				x: 12,
				y: 10,
				label: ""
			},
			{
				x: 12.5,
				y: 12,
				label: ""
			},
			{
				x: 9,
				y: 14,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Life expectancy vs. income",
		width: 500,
		xAxis: {
			max: 60,
			min: 0,
			label: "Average income, in thousands of dollars",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 85,
			min: 0,
			label: "Life expectancy, in years",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 4,
				y: 69,
				label: ""
			},
			{
				x: 6,
				y: 69.5,
				label: ""
			},
			{
				x: 8,
				y: 70,
				label: ""
			},
			{
				x: 10,
				y: 70.5,
				label: ""
			},
			{
				x: 12,
				y: 71,
				label: ""
			},
			{
				x: 14,
				y: 71.5,
				label: ""
			},
			{
				x: 16,
				y: 72,
				label: ""
			},
			{
				x: 18,
				y: 72.8,
				label: ""
			},
			{
				x: 22,
				y: 73.8,
				label: ""
			},
			{
				x: 24,
				y: 74.2,
				label: ""
			},
			{
				x: 26,
				y: 74.9,
				label: ""
			},
			{
				x: 28,
				y: 75.3,
				label: ""
			},
			{
				x: 30,
				y: 75.9,
				label: ""
			},
			{
				x: 32,
				y: 76.4,
				label: ""
			},
			{
				x: 34,
				y: 76.8,
				label: ""
			},
			{
				x: 36,
				y: 77.4,
				label: ""
			},
			{
				x: 38,
				y: 77.9,
				label: ""
			},
			{
				x: 40,
				y: 78.3,
				label: ""
			},
			{
				x: 42,
				y: 79,
				label: ""
			},
			{
				x: 44,
				y: 79.4,
				label: ""
			},
			{
				x: 46,
				y: 80,
				label: ""
			},
			{
				x: 48,
				y: 80.6,
				label: ""
			},
			{
				x: 50,
				y: 81,
				label: ""
			},
			{
				x: 52,
				y: 82,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Average score vs. period",
		width: 500,
		xAxis: {
			max: 9,
			min: 0,
			label: "Period",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Average score",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 67,
				label: ""
			},
			{
				x: 1.2,
				y: 58,
				label: ""
			},
			{
				x: 1.4,
				y: 62,
				label: ""
			},
			{
				x: 1.6,
				y: 47,
				label: ""
			},
			{
				x: 1.8,
				y: 73,
				label: ""
			},
			{
				x: 2,
				y: 61,
				label: ""
			},
			{
				x: 2.2,
				y: 55,
				label: ""
			},
			{
				x: 2.4,
				y: 70,
				label: ""
			},
			{
				x: 2.6,
				y: 43,
				label: ""
			},
			{
				x: 2.8,
				y: 59,
				label: ""
			},
			{
				x: 3,
				y: 74,
				label: ""
			},
			{
				x: 3.2,
				y: 60,
				label: ""
			},
			{
				x: 3.4,
				y: 52,
				label: ""
			},
			{
				x: 3.6,
				y: 71,
				label: ""
			},
			{
				x: 3.8,
				y: 57,
				label: ""
			},
			{
				x: 4,
				y: 65,
				label: ""
			},
			{
				x: 4.2,
				y: 48,
				label: ""
			},
			{
				x: 4.4,
				y: 62,
				label: ""
			},
			{
				x: 4.6,
				y: 59,
				label: ""
			},
			{
				x: 4.8,
				y: 75,
				label: ""
			},
			{
				x: 5,
				y: 54,
				label: ""
			},
			{
				x: 5.2,
				y: 63,
				label: ""
			},
			{
				x: 5.4,
				y: 46,
				label: ""
			},
			{
				x: 5.6,
				y: 68,
				label: ""
			},
			{
				x: 5.8,
				y: 58,
				label: ""
			},
			{
				x: 6,
				y: 64,
				label: ""
			},
			{
				x: 6.2,
				y: 45,
				label: ""
			},
			{
				x: 6.4,
				y: 73,
				label: ""
			},
			{
				x: 6.6,
				y: 51,
				label: ""
			},
			{
				x: 6.8,
				y: 69,
				label: ""
			},
			{
				x: 7,
				y: 56,
				label: ""
			},
			{
				x: 7.2,
				y: 66,
				label: ""
			},
			{
				x: 7.4,
				y: 49,
				label: ""
			},
			{
				x: 7.6,
				y: 72,
				label: ""
			},
			{
				x: 7.8,
				y: 55,
				label: ""
			},
			{
				x: 8,
				y: 61,
				label: ""
			},
			{
				x: 2.7,
				y: 78,
				label: ""
			},
			{
				x: 4.9,
				y: 77,
				label: ""
			},
			{
				x: 1.1,
				y: 39,
				label: ""
			},
			{
				x: 6.6,
				y: 42,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 5,
			min: 0,
			label: "Study time, in hours",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 0.7,
				y: 50,
				label: ""
			},
			{
				x: 0.8,
				y: 52,
				label: ""
			},
			{
				x: 0.9,
				y: 53,
				label: ""
			},
			{
				x: 1,
				y: 55,
				label: ""
			},
			{
				x: 1.1,
				y: 56,
				label: ""
			},
			{
				x: 1.2,
				y: 58,
				label: ""
			},
			{
				x: 1.3,
				y: 59,
				label: ""
			},
			{
				x: 1.4,
				y: 61,
				label: ""
			},
			{
				x: 1.5,
				y: 62,
				label: ""
			},
			{
				x: 1.6,
				y: 64,
				label: ""
			},
			{
				x: 1.7,
				y: 65,
				label: ""
			},
			{
				x: 1.8,
				y: 67,
				label: ""
			},
			{
				x: 1.9,
				y: 68,
				label: ""
			},
			{
				x: 2,
				y: 70,
				label: ""
			},
			{
				x: 2.1,
				y: 71,
				label: ""
			},
			{
				x: 2.2,
				y: 73,
				label: ""
			},
			{
				x: 2.3,
				y: 74,
				label: ""
			},
			{
				x: 2.4,
				y: 76,
				label: ""
			},
			{
				x: 2.5,
				y: 77,
				label: ""
			},
			{
				x: 2.6,
				y: 79,
				label: ""
			},
			{
				x: 2.7,
				y: 80,
				label: ""
			},
			{
				x: 2.8,
				y: 82,
				label: ""
			},
			{
				x: 2.9,
				y: 83,
				label: ""
			},
			{
				x: 3,
				y: 85,
				label: ""
			},
			{
				x: 3.1,
				y: 86,
				label: ""
			},
			{
				x: 3.2,
				y: 87,
				label: ""
			},
			{
				x: 3.3,
				y: 88,
				label: ""
			},
			{
				x: 3.5,
				y: 89,
				label: ""
			},
			{
				x: 3.8,
				y: 90,
				label: ""
			},
			{
				x: 4,
				y: 90,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Group size vs. time, in minutes",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Group size",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Time, in minutes",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 19.8,
				label: ""
			},
			{
				x: 1.2,
				y: 18.7,
				label: ""
			},
			{
				x: 1.4,
				y: 17.5,
				label: ""
			},
			{
				x: 1.7,
				y: 16,
				label: ""
			},
			{
				x: 2,
				y: 14.2,
				label: ""
			},
			{
				x: 2.3,
				y: 12.8,
				label: ""
			},
			{
				x: 2.6,
				y: 11.6,
				label: ""
			},
			{
				x: 2.9,
				y: 10.8,
				label: ""
			},
			{
				x: 3.2,
				y: 10,
				label: ""
			},
			{
				x: 3.6,
				y: 9.4,
				label: ""
			},
			{
				x: 4,
				y: 8.9,
				label: ""
			},
			{
				x: 4.4,
				y: 8.4,
				label: ""
			},
			{
				x: 4.8,
				y: 8,
				label: ""
			},
			{
				x: 5.2,
				y: 7.7,
				label: ""
			},
			{
				x: 5.6,
				y: 7.4,
				label: ""
			},
			{
				x: 6,
				y: 7.1,
				label: ""
			},
			{
				x: 6.3,
				y: 7,
				label: ""
			},
			{
				x: 6.6,
				y: 6.9,
				label: ""
			},
			{
				x: 6.9,
				y: 6.8,
				label: ""
			},
			{
				x: 7.2,
				y: 6.7,
				label: ""
			},
			{
				x: 7.5,
				y: 6.6,
				label: ""
			},
			{
				x: 7.8,
				y: 6.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 382,
		xAxis: {
			max: 100,
			min: 0,
			label: "Infant mortality, per 1000",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 85,
			min: 0,
			label: "Life expectancy, in years",
			gridLines: true,
			tickInterval: 5
		},
		height: 382,
		points: [
			{
				x: 1,
				y: 83,
				label: ""
			},
			{
				x: 3,
				y: 82,
				label: ""
			},
			{
				x: 4,
				y: 81,
				label: ""
			},
			{
				x: 5,
				y: 80,
				label: ""
			},
			{
				x: 6,
				y: 79,
				label: ""
			},
			{
				x: 8,
				y: 78,
				label: ""
			},
			{
				x: 9,
				y: 78,
				label: ""
			},
			{
				x: 10,
				y: 77,
				label: ""
			},
			{
				x: 12,
				y: 76,
				label: ""
			},
			{
				x: 14,
				y: 75,
				label: ""
			},
			{
				x: 15,
				y: 74,
				label: ""
			},
			{
				x: 16,
				y: 74,
				label: ""
			},
			{
				x: 18,
				y: 73,
				label: ""
			},
			{
				x: 19,
				y: 72,
				label: ""
			},
			{
				x: 20,
				y: 72,
				label: ""
			},
			{
				x: 22,
				y: 70,
				label: ""
			},
			{
				x: 24,
				y: 69,
				label: ""
			},
			{
				x: 26,
				y: 68,
				label: ""
			},
			{
				x: 28,
				y: 67,
				label: ""
			},
			{
				x: 30,
				y: 66,
				label: ""
			},
			{
				x: 32,
				y: 65,
				label: ""
			},
			{
				x: 35,
				y: 64,
				label: ""
			},
			{
				x: 38,
				y: 62,
				label: ""
			},
			{
				x: 40,
				y: 61,
				label: ""
			},
			{
				x: 45,
				y: 58,
				label: ""
			},
			{
				x: 50,
				y: 56,
				label: ""
			},
			{
				x: 55,
				y: 54,
				label: ""
			},
			{
				x: 60,
				y: 52,
				label: ""
			},
			{
				x: 65,
				y: 50,
				label: ""
			},
			{
				x: 70,
				y: 47,
				label: ""
			},
			{
				x: 72,
				y: 46,
				label: ""
			},
			{
				x: 74,
				y: 43,
				label: ""
			},
			{
				x: 75,
				y: 42,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 100,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 20
		},
		height: 400,
		points: [
			{
				x: 48,
				y: 50,
				label: ""
			},
			{
				x: 50,
				y: 52,
				label: ""
			},
			{
				x: 52,
				y: 54,
				label: ""
			},
			{
				x: 54,
				y: 56,
				label: ""
			},
			{
				x: 56,
				y: 58,
				label: ""
			},
			{
				x: 58,
				y: 60,
				label: ""
			},
			{
				x: 60,
				y: 62,
				label: ""
			},
			{
				x: 62,
				y: 64,
				label: ""
			},
			{
				x: 64,
				y: 66,
				label: ""
			},
			{
				x: 66,
				y: 68,
				label: ""
			},
			{
				x: 68,
				y: 70,
				label: ""
			},
			{
				x: 70,
				y: 72,
				label: ""
			},
			{
				x: 72,
				y: 74,
				label: ""
			},
			{
				x: 74,
				y: 76,
				label: ""
			},
			{
				x: 76,
				y: 78,
				label: ""
			},
			{
				x: 78,
				y: 80,
				label: ""
			},
			{
				x: 80,
				y: 82,
				label: ""
			},
			{
				x: 82,
				y: 84,
				label: ""
			},
			{
				x: 84,
				y: 86,
				label: ""
			},
			{
				x: 86,
				y: 88,
				label: ""
			},
			{
				x: 88,
				y: 90,
				label: ""
			},
			{
				x: 90,
				y: 92,
				label: ""
			},
			{
				x: 92,
				y: 94,
				label: ""
			},
			{
				x: 95,
				y: 99,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Change in average world temperature over time",
		width: 500,
		xAxis: {
			max: 45,
			min: 0,
			label: "Years since 1970",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 2,
			min: 0,
			label: "Degrees above 13, in degrees Celsius",
			gridLines: true,
			tickInterval: 0.1
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 1.12,
				label: ""
			},
			{
				x: 1.5,
				y: 1.128,
				label: ""
			},
			{
				x: 3,
				y: 1.161,
				label: ""
			},
			{
				x: 4.5,
				y: 1.159,
				label: ""
			},
			{
				x: 6,
				y: 1.199,
				label: ""
			},
			{
				x: 7.5,
				y: 1.203,
				label: ""
			},
			{
				x: 9,
				y: 1.239,
				label: ""
			},
			{
				x: 10.5,
				y: 1.235,
				label: ""
			},
			{
				x: 12,
				y: 1.269,
				label: ""
			},
			{
				x: 13.5,
				y: 1.273,
				label: ""
			},
			{
				x: 15,
				y: 1.314,
				label: ""
			},
			{
				x: 16.5,
				y: 1.304,
				label: ""
			},
			{
				x: 18,
				y: 1.344,
				label: ""
			},
			{
				x: 19.5,
				y: 1.345,
				label: ""
			},
			{
				x: 21,
				y: 1.376,
				label: ""
			},
			{
				x: 22.5,
				y: 1.376,
				label: ""
			},
			{
				x: 24,
				y: 1.415,
				label: ""
			},
			{
				x: 25.5,
				y: 1.419,
				label: ""
			},
			{
				x: 27,
				y: 1.452,
				label: ""
			},
			{
				x: 28.5,
				y: 1.444,
				label: ""
			},
			{
				x: 30,
				y: 1.483,
				label: ""
			},
			{
				x: 31.5,
				y: 1.487,
				label: ""
			},
			{
				x: 33,
				y: 1.522,
				label: ""
			},
			{
				x: 34.5,
				y: 1.525,
				label: ""
			},
			{
				x: 36,
				y: 1.552,
				label: ""
			},
			{
				x: 37.5,
				y: 1.556,
				label: ""
			},
			{
				x: 39,
				y: 1.569,
				label: ""
			},
			{
				x: 40.5,
				y: 1.582,
				label: ""
			},
			{
				x: 42,
				y: 1.59,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Scatterplot",
		width: 399,
		xAxis: {
			max: 100,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 10
		},
		height: 381,
		points: [
			{
				x: 1,
				y: 53,
				label: ""
			},
			{
				x: 5,
				y: 52.5,
				label: ""
			},
			{
				x: 9,
				y: 46.62,
				label: ""
			},
			{
				x: 13,
				y: 49.24,
				label: ""
			},
			{
				x: 17,
				y: 41.56,
				label: ""
			},
			{
				x: 21,
				y: 43.58,
				label: ""
			},
			{
				x: 25,
				y: 36.8,
				label: ""
			},
			{
				x: 29,
				y: 40.72,
				label: ""
			},
			{
				x: 33,
				y: 33.54,
				label: ""
			},
			{
				x: 37,
				y: 35.66,
				label: ""
			},
			{
				x: 41,
				y: 30.28,
				label: ""
			},
			{
				x: 45,
				y: 32.1,
				label: ""
			},
			{
				x: 49,
				y: 24.42,
				label: ""
			},
			{
				x: 53,
				y: 27.14,
				label: ""
			},
			{
				x: 57,
				y: 21.16,
				label: ""
			},
			{
				x: 61,
				y: 24.18,
				label: ""
			},
			{
				x: 65,
				y: 17.4,
				label: ""
			},
			{
				x: 69,
				y: 18.32,
				label: ""
			},
			{
				x: 73,
				y: 12.34,
				label: ""
			},
			{
				x: 77,
				y: 15.56,
				label: ""
			},
			{
				x: 81,
				y: 9.38,
				label: ""
			},
			{
				x: 85,
				y: 11,
				label: ""
			},
			{
				x: 89,
				y: 4.32,
				label: ""
			},
			{
				x: 93,
				y: 6.24,
				label: ""
			},
			{
				x: 97,
				y: 1.16,
				label: ""
			},
			{
				x: 99,
				y: 1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 355,
		xAxis: {
			max: 14,
			min: 0,
			label: "",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 6,
			min: -6,
			label: "",
			gridLines: true,
			tickInterval: 2
		},
		height: 348,
		points: [
			{
				x: 0.9,
				y: 5,
				label: ""
			},
			{
				x: 1.2,
				y: 4.7,
				label: ""
			},
			{
				x: 1.4,
				y: 4.5,
				label: ""
			},
			{
				x: 1.7,
				y: 4.1,
				label: ""
			},
			{
				x: 2,
				y: 3.8,
				label: ""
			},
			{
				x: 2.3,
				y: 3.4,
				label: ""
			},
			{
				x: 2.6,
				y: 3.1,
				label: ""
			},
			{
				x: 2.9,
				y: 2.7,
				label: ""
			},
			{
				x: 3.2,
				y: 2.3,
				label: ""
			},
			{
				x: 3.5,
				y: 2,
				label: ""
			},
			{
				x: 3.8,
				y: 1.7,
				label: ""
			},
			{
				x: 4.1,
				y: 1.4,
				label: ""
			},
			{
				x: 4.4,
				y: 1.1,
				label: ""
			},
			{
				x: 4.7,
				y: 0.8,
				label: ""
			},
			{
				x: 5,
				y: 0.5,
				label: ""
			},
			{
				x: 5.3,
				y: 0.2,
				label: ""
			},
			{
				x: 5.6,
				y: -0.1,
				label: ""
			},
			{
				x: 5.9,
				y: -0.3,
				label: ""
			},
			{
				x: 6.2,
				y: -0.6,
				label: ""
			},
			{
				x: 6.5,
				y: -0.9,
				label: ""
			},
			{
				x: 6.8,
				y: -1.2,
				label: ""
			},
			{
				x: 7.1,
				y: -1.4,
				label: ""
			},
			{
				x: 7.4,
				y: -1.7,
				label: ""
			},
			{
				x: 7.7,
				y: -2,
				label: ""
			},
			{
				x: 8,
				y: -2.3,
				label: ""
			},
			{
				x: 8.3,
				y: -2.6,
				label: ""
			},
			{
				x: 8.6,
				y: -2.9,
				label: ""
			},
			{
				x: 8.9,
				y: -3.1,
				label: ""
			},
			{
				x: 9.3,
				y: -3.4,
				label: ""
			},
			{
				x: 9.6,
				y: -3.8,
				label: ""
			},
			{
				x: 9.8,
				y: -4.1,
				label: ""
			},
			{
				x: 10,
				y: -4.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 400,
		xAxis: {
			max: 3,
			min: 0,
			label: "",
			gridLines: false,
			tickInterval: 0.1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "",
			gridLines: false,
			tickInterval: 0.5
		},
		height: 395,
		points: [
			{
				x: 1.15,
				y: 0.8,
				label: ""
			},
			{
				x: 1.2,
				y: 1.1,
				label: ""
			},
			{
				x: 1.25,
				y: 1.3,
				label: ""
			},
			{
				x: 1.35,
				y: 1.7,
				label: ""
			},
			{
				x: 1.4,
				y: 2.1,
				label: ""
			},
			{
				x: 1.5,
				y: 2.4,
				label: ""
			},
			{
				x: 1.55,
				y: 2.8,
				label: ""
			},
			{
				x: 1.6,
				y: 2.9,
				label: ""
			},
			{
				x: 1.7,
				y: 3.6,
				label: ""
			},
			{
				x: 1.75,
				y: 3.9,
				label: ""
			},
			{
				x: 1.85,
				y: 4.1,
				label: ""
			},
			{
				x: 1.9,
				y: 4.6,
				label: ""
			},
			{
				x: 2,
				y: 4.9,
				label: ""
			},
			{
				x: 2.05,
				y: 5.4,
				label: ""
			},
			{
				x: 2.15,
				y: 5.9,
				label: ""
			},
			{
				x: 2.2,
				y: 6.1,
				label: ""
			},
			{
				x: 2.3,
				y: 6.4,
				label: ""
			},
			{
				x: 2.35,
				y: 6.7,
				label: ""
			},
			{
				x: 2.45,
				y: 7.1,
				label: ""
			},
			{
				x: 2.5,
				y: 7.6,
				label: ""
			},
			{
				x: 2.6,
				y: 8.2,
				label: ""
			},
			{
				x: 2.65,
				y: 8.6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Scatterplot",
		width: 390,
		xAxis: {
			max: 10,
			min: 0,
			label: "x-axis",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "y-axis",
			gridLines: true,
			tickInterval: 5
		},
		height: 386,
		points: [
			{
				x: 3.1,
				y: 12.5,
				label: ""
			},
			{
				x: 3.3,
				y: 18.1,
				label: ""
			},
			{
				x: 3.7,
				y: 25,
				label: ""
			},
			{
				x: 4,
				y: 14.2,
				label: ""
			},
			{
				x: 4.2,
				y: 22.3,
				label: ""
			},
			{
				x: 4.6,
				y: 27.6,
				label: ""
			},
			{
				x: 5,
				y: 13.3,
				label: ""
			},
			{
				x: 5.2,
				y: 20.8,
				label: ""
			},
			{
				x: 5.4,
				y: 24.7,
				label: ""
			},
			{
				x: 5.6,
				y: 18.2,
				label: ""
			},
			{
				x: 5.8,
				y: 28,
				label: ""
			},
			{
				x: 6,
				y: 16.5,
				label: ""
			},
			{
				x: 6.2,
				y: 21.1,
				label: ""
			},
			{
				x: 6.4,
				y: 26.4,
				label: ""
			},
			{
				x: 6.6,
				y: 13.9,
				label: ""
			},
			{
				x: 6.8,
				y: 23.7,
				label: ""
			},
			{
				x: 7,
				y: 15.8,
				label: ""
			},
			{
				x: 3.2,
				y: 27.1,
				label: ""
			},
			{
				x: 3.6,
				y: 19.4,
				label: ""
			},
			{
				x: 4.1,
				y: 27.9,
				label: ""
			},
			{
				x: 4.9,
				y: 12.8,
				label: ""
			},
			{
				x: 6.1,
				y: 24.3,
				label: ""
			},
			{
				x: 6.7,
				y: 17.2,
				label: ""
			},
			{
				x: 3.9,
				y: 22.9,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Score vs. Shoe size",
		width: 375,
		xAxis: {
			max: 11,
			min: 0,
			label: "Shoe size",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 10
		},
		height: 375,
		points: [
			{
				x: 5.6,
				y: 78,
				label: ""
			},
			{
				x: 5.9,
				y: 60,
				label: ""
			},
			{
				x: 6.1,
				y: 72,
				label: ""
			},
			{
				x: 6.4,
				y: 83,
				label: ""
			},
			{
				x: 6.7,
				y: 55,
				label: ""
			},
			{
				x: 6.9,
				y: 68,
				label: ""
			},
			{
				x: 7.2,
				y: 80,
				label: ""
			},
			{
				x: 7.4,
				y: 59,
				label: ""
			},
			{
				x: 7.6,
				y: 73,
				label: ""
			},
			{
				x: 7.9,
				y: 65,
				label: ""
			},
			{
				x: 8.1,
				y: 82,
				label: ""
			},
			{
				x: 8.3,
				y: 58,
				label: ""
			},
			{
				x: 8.5,
				y: 75,
				label: ""
			},
			{
				x: 8.8,
				y: 62,
				label: ""
			},
			{
				x: 9,
				y: 84,
				label: ""
			},
			{
				x: 9.2,
				y: 57,
				label: ""
			},
			{
				x: 9.5,
				y: 71,
				label: ""
			},
			{
				x: 9.7,
				y: 64,
				label: ""
			},
			{
				x: 10,
				y: 79,
				label: ""
			},
			{
				x: 10.2,
				y: 67,
				label: ""
			},
			{
				x: 10.4,
				y: 53,
				label: ""
			},
			{
				x: 10.7,
				y: 76,
				label: ""
			},
			{
				x: 10.9,
				y: 61,
				label: ""
			},
			{
				x: 11,
				y: 70,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Average income vs. average rent",
		width: 500,
		xAxis: {
			max: 50000,
			min: 30000,
			label: "Average income, in dollars per year",
			gridLines: true,
			tickInterval: 5000
		},
		yAxis: {
			max: 2000,
			min: 0,
			label: "Average rent for a 1 bedroom, in dollars per month",
			gridLines: true,
			tickInterval: 100
		},
		height: 420,
		points: [
			{
				x: 36500,
				y: 830,
				label: ""
			},
			{
				x: 37500,
				y: 880,
				label: ""
			},
			{
				x: 38500,
				y: 930,
				label: ""
			},
			{
				x: 39500,
				y: 990,
				label: ""
			},
			{
				x: 40500,
				y: 1050,
				label: ""
			},
			{
				x: 41000,
				y: 1080,
				label: ""
			},
			{
				x: 41500,
				y: 1100,
				label: ""
			},
			{
				x: 42500,
				y: 1175,
				label: ""
			},
			{
				x: 43500,
				y: 1225,
				label: ""
			},
			{
				x: 44000,
				y: 1280,
				label: ""
			},
			{
				x: 44500,
				y: 1300,
				label: ""
			},
			{
				x: 45500,
				y: 1375,
				label: ""
			},
			{
				x: 46500,
				y: 1450,
				label: ""
			},
			{
				x: 47000,
				y: 1520,
				label: ""
			},
			{
				x: 47500,
				y: 1500,
				label: ""
			},
			{
				x: 48500,
				y: 1580,
				label: ""
			},
			{
				x: 49500,
				y: 1650,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Age vs. accidents per 100 drivers (2009)",
		width: 375,
		xAxis: {
			max: 25,
			min: 16,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 24,
			min: 9,
			label: "Accidents per 100 drivers",
			gridLines: true,
			tickInterval: 1
		},
		height: 369,
		points: [
			{
				x: 16,
				y: 23,
				label: ""
			},
			{
				x: 17,
				y: 22.5,
				label: ""
			},
			{
				x: 18,
				y: 21.5,
				label: ""
			},
			{
				x: 19,
				y: 19.5,
				label: ""
			},
			{
				x: 20,
				y: 17,
				label: ""
			},
			{
				x: 21,
				y: 15.5,
				label: ""
			},
			{
				x: 22,
				y: 14,
				label: ""
			},
			{
				x: 23,
				y: 12.5,
				label: ""
			},
			{
				x: 24,
				y: 11,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Scores versus grams of sugar",
		width: 500,
		xAxis: {
			max: 40,
			min: 0,
			label: "Grams of sugar (per 100 grams of cake)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 4.75,
				label: ""
			},
			{
				x: 2,
				y: 14,
				label: ""
			},
			{
				x: 3.5,
				y: 26.9375,
				label: ""
			},
			{
				x: 4.5,
				y: 34.9375,
				label: ""
			},
			{
				x: 5,
				y: 38.75,
				label: ""
			},
			{
				x: 6,
				y: 46,
				label: ""
			},
			{
				x: 7,
				y: 52.75,
				label: ""
			},
			{
				x: 8,
				y: 59,
				label: ""
			},
			{
				x: 9.5,
				y: 67.4375,
				label: ""
			},
			{
				x: 10,
				y: 70,
				label: ""
			},
			{
				x: 11,
				y: 74.75,
				label: ""
			},
			{
				x: 12,
				y: 79,
				label: ""
			},
			{
				x: 13,
				y: 82.75,
				label: ""
			},
			{
				x: 14.5,
				y: 87.4375,
				label: ""
			},
			{
				x: 15.5,
				y: 89.9375,
				label: ""
			},
			{
				x: 16.5,
				y: 91.9375,
				label: ""
			},
			{
				x: 17.5,
				y: 93.4375,
				label: ""
			},
			{
				x: 18,
				y: 94,
				label: ""
			},
			{
				x: 18.5,
				y: 94.4375,
				label: ""
			},
			{
				x: 19,
				y: 94.75,
				label: ""
			},
			{
				x: 19.2,
				y: 94.84,
				label: ""
			},
			{
				x: 19.5,
				y: 94.9375,
				label: ""
			},
			{
				x: 19.7,
				y: 94.9775,
				label: ""
			},
			{
				x: 19.9,
				y: 94.9975,
				label: ""
			},
			{
				x: 20,
				y: 95,
				label: ""
			},
			{
				x: 20.1,
				y: 94.9975,
				label: ""
			},
			{
				x: 20.2,
				y: 94.99,
				label: ""
			},
			{
				x: 20.3,
				y: 94.9775,
				label: ""
			},
			{
				x: 20.5,
				y: 94.9375,
				label: ""
			},
			{
				x: 20.8,
				y: 94.84,
				label: ""
			},
			{
				x: 21,
				y: 94.75,
				label: ""
			},
			{
				x: 21.5,
				y: 94.4375,
				label: ""
			},
			{
				x: 22,
				y: 94,
				label: ""
			},
			{
				x: 22.5,
				y: 93.4375,
				label: ""
			},
			{
				x: 23,
				y: 92.75,
				label: ""
			},
			{
				x: 24,
				y: 91,
				label: ""
			},
			{
				x: 24.5,
				y: 89.9375,
				label: ""
			},
			{
				x: 25,
				y: 88.75,
				label: ""
			},
			{
				x: 26,
				y: 86,
				label: ""
			},
			{
				x: 27,
				y: 82.75,
				label: ""
			},
			{
				x: 28,
				y: 79,
				label: ""
			},
			{
				x: 29,
				y: 74.75,
				label: ""
			},
			{
				x: 30,
				y: 70,
				label: ""
			},
			{
				x: 31.5,
				y: 61.9375,
				label: ""
			},
			{
				x: 32,
				y: 59,
				label: ""
			},
			{
				x: 33,
				y: 52.75,
				label: ""
			},
			{
				x: 34,
				y: 46,
				label: ""
			},
			{
				x: 35,
				y: 38.75,
				label: ""
			},
			{
				x: 36,
				y: 31,
				label: ""
			},
			{
				x: 37,
				y: 22.75,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Scatter plot",
		width: 396,
		xAxis: {
			max: 4.5,
			min: 0,
			label: "x-axis",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "y-axis",
			gridLines: true,
			tickInterval: 1
		},
		height: 396,
		points: [
			{
				x: 0.5,
				y: 6.9,
				label: ""
			},
			{
				x: 1,
				y: 6.35,
				label: ""
			},
			{
				x: 1.5,
				y: 5.8,
				label: ""
			},
			{
				x: 2,
				y: 5.25,
				label: ""
			},
			{
				x: 2.5,
				y: 4.7,
				label: ""
			},
			{
				x: 3,
				y: 4.15,
				label: ""
			},
			{
				x: 3.5,
				y: 3.6,
				label: ""
			},
			{
				x: 4,
				y: 3.05,
				label: ""
			},
			{
				x: 4.5,
				y: 2.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 600,
			min: 0,
			label: "Heart rate, in beats per minute",
			gridLines: true,
			tickInterval: 50
		},
		yAxis: {
			max: 40,
			min: 0,
			label: "Life expectancy, in years",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 40,
				y: 40,
				label: ""
			},
			{
				x: 60,
				y: 34,
				label: ""
			},
			{
				x: 80,
				y: 30,
				label: ""
			},
			{
				x: 100,
				y: 27,
				label: ""
			},
			{
				x: 120,
				y: 24,
				label: ""
			},
			{
				x: 140,
				y: 22,
				label: ""
			},
			{
				x: 160,
				y: 20,
				label: ""
			},
			{
				x: 180,
				y: 18.5,
				label: ""
			},
			{
				x: 200,
				y: 17,
				label: ""
			},
			{
				x: 225,
				y: 15.5,
				label: ""
			},
			{
				x: 250,
				y: 14,
				label: ""
			},
			{
				x: 275,
				y: 13,
				label: ""
			},
			{
				x: 300,
				y: 12,
				label: ""
			},
			{
				x: 330,
				y: 11,
				label: ""
			},
			{
				x: 360,
				y: 10,
				label: ""
			},
			{
				x: 390,
				y: 9.2,
				label: ""
			},
			{
				x: 420,
				y: 8.5,
				label: ""
			},
			{
				x: 450,
				y: 7.9,
				label: ""
			},
			{
				x: 480,
				y: 7.3,
				label: ""
			},
			{
				x: 510,
				y: 6.8,
				label: ""
			},
			{
				x: 540,
				y: 6.2,
				label: ""
			},
			{
				x: 560,
				y: 5.8,
				label: ""
			},
			{
				x: 580,
				y: 5,
				label: ""
			},
			{
				x: 600,
				y: 4.4,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Average global temperature change over time",
		width: 500,
		xAxis: {
			max: 45,
			min: 0,
			label: "Years since 1970",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 2,
			min: 0,
			label: "Degrees above 13, in degrees Celsius",
			gridLines: true,
			tickInterval: 0.1
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 1.1,
				label: ""
			},
			{
				x: 2,
				y: 1.133,
				label: ""
			},
			{
				x: 4,
				y: 1.138,
				label: ""
			},
			{
				x: 6,
				y: 1.177,
				label: ""
			},
			{
				x: 8,
				y: 1.191,
				label: ""
			},
			{
				x: 10,
				y: 1.231,
				label: ""
			},
			{
				x: 12,
				y: 1.236,
				label: ""
			},
			{
				x: 14,
				y: 1.27,
				label: ""
			},
			{
				x: 16,
				y: 1.29,
				label: ""
			},
			{
				x: 18,
				y: 1.308,
				label: ""
			},
			{
				x: 20,
				y: 1.347,
				label: ""
			},
			{
				x: 22,
				y: 1.359,
				label: ""
			},
			{
				x: 24,
				y: 1.39,
				label: ""
			},
			{
				x: 26,
				y: 1.402,
				label: ""
			},
			{
				x: 28,
				y: 1.44,
				label: ""
			},
			{
				x: 30,
				y: 1.455,
				label: ""
			},
			{
				x: 32,
				y: 1.491,
				label: ""
			},
			{
				x: 34,
				y: 1.496,
				label: ""
			},
			{
				x: 36,
				y: 1.534,
				label: ""
			},
			{
				x: 38,
				y: 1.548,
				label: ""
			},
			{
				x: 40,
				y: 1.582,
				label: ""
			},
			{
				x: 42,
				y: 1.6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Fuel used vs. Speed",
		width: 500,
		xAxis: {
			max: 140,
			min: 0,
			label: "Speed, in kilometers per hour",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 14,
			min: 0,
			label: "Fuel used, in liters per 100 kilometers",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 20,
				y: 13,
				label: ""
			},
			{
				x: 30,
				y: 10.5,
				label: ""
			},
			{
				x: 40,
				y: 8.5,
				label: ""
			},
			{
				x: 50,
				y: 7,
				label: ""
			},
			{
				x: 60,
				y: 6,
				label: ""
			},
			{
				x: 70,
				y: 6.3,
				label: ""
			},
			{
				x: 80,
				y: 7.1,
				label: ""
			},
			{
				x: 90,
				y: 8,
				label: ""
			},
			{
				x: 100,
				y: 8.8,
				label: ""
			},
			{
				x: 110,
				y: 9.5,
				label: ""
			},
			{
				x: 120,
				y: 10,
				label: ""
			},
			{
				x: 130,
				y: 10.6,
				label: ""
			}
		]
	},
	/* REMOVED: invalid example with out-of-domain points (fathers vs sons) */
	/*{
    "type": "scatterPlot",
    "lines": [],
    "title": "Heights of fathers and sons (in centimeters)",
    "width": 300,
    "xAxis": {
      "max": 188,
      "min": 148,
      "label": "Father's height, in centimeters",
      "gridLines": true,
      "tickInterval": 5
    },
    "yAxis": {
      "max": 188,
      "min": 148,
      "label": "Son's height, in centimeters",
      "gridLines": true,
      "tickInterval": 5
    },
    "height": 300,
    "points": [
      {
        "x": 150,
        "y": 166.8,
        "label": ""
      },
      {
        "x": 151,
        "y": 166.1,
        "label": ""
      },
      {
        "x": 152,
        "y": 167.3,
        "label": ""
      },
      {
        "x": 153,
        "y": 167.9,
        "label": ""
      },
      {
        "x": 154,
        "y": 167.2,
        "label": ""
      },
      {
        "x": 155,
        "y": 168.6,
        "label": ""
      },
      {
        "x": 156,
        "y": 168,
        "label": ""
      },
      {
        "x": 157,
        "y": 169.6,
        "label": ""
      },
      {
        "x": 158,
        "y": 169.5,
        "label": ""
      },
      {
        "x": 159,
        "y": 170.3,
        "label": ""
      },
      {
        "x": 160,
        "y": 170,
        "label": ""
      },
      {
        "x": 162,
        "y": 171.9,
        "label": ""
      },
      {
        "x": 163,
        "y": 171.1,
        "label": ""
      },
      {
        "x": 164,
        "y": 172.3,
        "label": ""
      },
      {
        "x": 166,
        "y": 172.1,
        "label": ""
      },
      {
        "x": 168,
        "y": 174.2,
        "label": ""
      },
      {
        "x": 170,
        "y": 175.1,
        "label": ""
      },
      {
        "x": 171,
        "y": 175,
        "label": ""
      },
      {
        "x": 172,
        "y": 176,
        "label": ""
      },
      {
        "x": 174,
        "y": 176.5,
        "label": ""
      },
      {
        "x": 176,
        "y": 177.4,
        "label": ""
      },
      {
        "x": 177,
        "y": 177.9,
        "label": ""
      },
      {
        "x": 178,
        "y": 178.1,
        "label": ""
      },
      {
        "x": 180,
        "y": 179.2,
        "label": ""
      },
      {
        "x": 181,
        "y": 178.8,
        "label": ""
      },
      {
        "x": 182,
        "y": 180.5,
        "label": ""
      },
      {
        "x": 184,
        "y": 180.4,
        "label": ""
      },
      {
        "x": 185,
        "y": 180.9,
        "label": ""
      },
      {
        "x": 186,
        "y": 182,
        "label": ""
      },
      {
        "x": 188,
        "y": 182.2,
        "label": ""
      },
      {
        "x": 189,
        "y": 182.8,
        "label": ""
      },
      {
        "x": 190,
        "y": 182.9,
        "label": ""
      }
    ]
  },*/
	{
		type: "scatterPlot",
		lines: [],
		title: "Time to solve vs. group size",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Group size",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Time, in minutes",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 19.6,
				label: ""
			},
			{
				x: 1,
				y: 19.8,
				label: ""
			},
			{
				x: 1,
				y: 20,
				label: ""
			},
			{
				x: 2,
				y: 12,
				label: ""
			},
			{
				x: 2,
				y: 12.3,
				label: ""
			},
			{
				x: 2,
				y: 12.6,
				label: ""
			},
			{
				x: 3,
				y: 9.4,
				label: ""
			},
			{
				x: 3,
				y: 9.7,
				label: ""
			},
			{
				x: 3,
				y: 10,
				label: ""
			},
			{
				x: 4,
				y: 8.1,
				label: ""
			},
			{
				x: 4,
				y: 8.4,
				label: ""
			},
			{
				x: 4,
				y: 8.7,
				label: ""
			},
			{
				x: 5,
				y: 7.4,
				label: ""
			},
			{
				x: 5,
				y: 7.7,
				label: ""
			},
			{
				x: 5,
				y: 8,
				label: ""
			},
			{
				x: 6,
				y: 6.8,
				label: ""
			},
			{
				x: 6,
				y: 7.1,
				label: ""
			},
			{
				x: 6,
				y: 7.4,
				label: ""
			},
			{
				x: 7,
				y: 6.5,
				label: ""
			},
			{
				x: 7,
				y: 6.8,
				label: ""
			},
			{
				x: 7,
				y: 7,
				label: ""
			},
			{
				x: 8,
				y: 6.3,
				label: ""
			},
			{
				x: 8,
				y: 6.5,
				label: ""
			},
			{
				x: 8,
				y: 6.8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Number of hurricanes over time",
		width: 300,
		xAxis: {
			max: 40,
			min: 0,
			label: "Years since 1970",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 16,
			min: 0,
			label: "Number of hurricanes",
			gridLines: true,
			tickInterval: 1
		},
		height: 300,
		points: [
			{
				x: 0,
				y: 5.2,
				label: ""
			},
			{
				x: 2,
				y: 5,
				label: ""
			},
			{
				x: 4,
				y: 5.8,
				label: ""
			},
			{
				x: 6,
				y: 6.2,
				label: ""
			},
			{
				x: 8,
				y: 6.5,
				label: ""
			},
			{
				x: 10,
				y: 6.8,
				label: ""
			},
			{
				x: 12,
				y: 7.4,
				label: ""
			},
			{
				x: 14,
				y: 7,
				label: ""
			},
			{
				x: 16,
				y: 7.8,
				label: ""
			},
			{
				x: 18,
				y: 8.1,
				label: ""
			},
			{
				x: 20,
				y: 8.6,
				label: ""
			},
			{
				x: 22,
				y: 8.9,
				label: ""
			},
			{
				x: 24,
				y: 9.3,
				label: ""
			},
			{
				x: 26,
				y: 9.8,
				label: ""
			},
			{
				x: 28,
				y: 10.2,
				label: ""
			},
			{
				x: 30,
				y: 10,
				label: ""
			},
			{
				x: 32,
				y: 10.7,
				label: ""
			},
			{
				x: 34,
				y: 11,
				label: ""
			},
			{
				x: 36,
				y: 11.2,
				label: ""
			},
			{
				x: 38,
				y: 11.7,
				label: ""
			},
			{
				x: 40,
				y: 12,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Scores vs. Sugar Content",
		width: 500,
		xAxis: {
			max: 40,
			min: 0,
			label: "Grams of sugar per 100 grams of cake",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 9,
				label: ""
			},
			{
				x: 2,
				y: 15,
				label: ""
			},
			{
				x: 3,
				y: 20,
				label: ""
			},
			{
				x: 4,
				y: 28,
				label: ""
			},
			{
				x: 5,
				y: 35,
				label: ""
			},
			{
				x: 6,
				y: 43,
				label: ""
			},
			{
				x: 7,
				y: 50,
				label: ""
			},
			{
				x: 8,
				y: 58,
				label: ""
			},
			{
				x: 9,
				y: 65,
				label: ""
			},
			{
				x: 10,
				y: 72,
				label: ""
			},
			{
				x: 11,
				y: 80,
				label: ""
			},
			{
				x: 12,
				y: 86,
				label: ""
			},
			{
				x: 13,
				y: 90,
				label: ""
			},
			{
				x: 14,
				y: 93,
				label: ""
			},
			{
				x: 15,
				y: 95,
				label: ""
			},
			{
				x: 16,
				y: 96,
				label: ""
			},
			{
				x: 17,
				y: 96,
				label: ""
			},
			{
				x: 18,
				y: 97,
				label: ""
			},
			{
				x: 19,
				y: 97,
				label: ""
			},
			{
				x: 20,
				y: 97,
				label: ""
			},
			{
				x: 21,
				y: 97,
				label: ""
			},
			{
				x: 22,
				y: 97,
				label: ""
			},
			{
				x: 23,
				y: 96,
				label: ""
			},
			{
				x: 24,
				y: 95,
				label: ""
			},
			{
				x: 25,
				y: 93,
				label: ""
			},
			{
				x: 26,
				y: 90,
				label: ""
			},
			{
				x: 27,
				y: 85,
				label: ""
			},
			{
				x: 28,
				y: 80,
				label: ""
			},
			{
				x: 29,
				y: 74,
				label: ""
			},
			{
				x: 30,
				y: 68,
				label: ""
			},
			{
				x: 31,
				y: 60,
				label: ""
			},
			{
				x: 32,
				y: 52,
				label: ""
			},
			{
				x: 33,
				y: 45,
				label: ""
			},
			{
				x: 34,
				y: 38,
				label: ""
			},
			{
				x: 35,
				y: 30,
				label: ""
			},
			{
				x: 36,
				y: 26,
				label: ""
			},
			{
				x: 37,
				y: 22,
				label: ""
			},
			{
				x: 38,
				y: 19,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Life expectancy vs. income",
		width: 500,
		xAxis: {
			max: 60,
			min: 0,
			label: "Average income, in thousands of dollars",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 85,
			min: 65,
			label: "Life expectancy, in years",
			gridLines: true,
			tickInterval: 2
		},
		height: 380,
		points: [
			{
				x: 2,
				y: 70.5,
				label: ""
			},
			{
				x: 4,
				y: 68.7,
				label: ""
			},
			{
				x: 6,
				y: 75.8,
				label: ""
			},
			{
				x: 8,
				y: 71.6,
				label: ""
			},
			{
				x: 10,
				y: 77,
				label: ""
			},
			{
				x: 12,
				y: 72.2,
				label: ""
			},
			{
				x: 13,
				y: 73,
				label: ""
			},
			{
				x: 15,
				y: 72.9,
				label: ""
			},
			{
				x: 18,
				y: 74,
				label: ""
			},
			{
				x: 20,
				y: 74.5,
				label: ""
			},
			{
				x: 23,
				y: 75.4,
				label: ""
			},
			{
				x: 26,
				y: 75.6,
				label: ""
			},
			{
				x: 28,
				y: 76.2,
				label: ""
			},
			{
				x: 30,
				y: 76,
				label: ""
			},
			{
				x: 33,
				y: 77.1,
				label: ""
			},
			{
				x: 35,
				y: 77.7,
				label: ""
			},
			{
				x: 36,
				y: 78.1,
				label: ""
			},
			{
				x: 38,
				y: 78.3,
				label: ""
			},
			{
				x: 40,
				y: 79,
				label: ""
			},
			{
				x: 43,
				y: 79.7,
				label: ""
			},
			{
				x: 45,
				y: 80.2,
				label: ""
			},
			{
				x: 47,
				y: 80.8,
				label: ""
			},
			{
				x: 49,
				y: 81.2,
				label: ""
			},
			{
				x: 51,
				y: 81.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Average score versus period",
		width: 500,
		xAxis: {
			max: 9,
			min: 0,
			label: "Period",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Average score",
			gridLines: true,
			tickInterval: 10
		},
		height: 450,
		points: [
			{
				x: 1,
				y: 58,
				label: ""
			},
			{
				x: 1.2,
				y: 62,
				label: ""
			},
			{
				x: 1.5,
				y: 55,
				label: ""
			},
			{
				x: 1.6,
				y: 44,
				label: ""
			},
			{
				x: 1.8,
				y: 64,
				label: ""
			},
			{
				x: 2,
				y: 61,
				label: ""
			},
			{
				x: 2.3,
				y: 59,
				label: ""
			},
			{
				x: 2.4,
				y: 78,
				label: ""
			},
			{
				x: 2.6,
				y: 57,
				label: ""
			},
			{
				x: 2.9,
				y: 63,
				label: ""
			},
			{
				x: 3,
				y: 46,
				label: ""
			},
			{
				x: 3.1,
				y: 60,
				label: ""
			},
			{
				x: 3.4,
				y: 65,
				label: ""
			},
			{
				x: 3.7,
				y: 56,
				label: ""
			},
			{
				x: 3.8,
				y: 76,
				label: ""
			},
			{
				x: 4,
				y: 58,
				label: ""
			},
			{
				x: 4.2,
				y: 62,
				label: ""
			},
			{
				x: 4.5,
				y: 59,
				label: ""
			},
			{
				x: 4.6,
				y: 74,
				label: ""
			},
			{
				x: 4.8,
				y: 61,
				label: ""
			},
			{
				x: 5,
				y: 57,
				label: ""
			},
			{
				x: 5.2,
				y: 39,
				label: ""
			},
			{
				x: 5.3,
				y: 60,
				label: ""
			},
			{
				x: 5.6,
				y: 64,
				label: ""
			},
			{
				x: 5.9,
				y: 55,
				label: ""
			},
			{
				x: 6.1,
				y: 66,
				label: ""
			},
			{
				x: 6.4,
				y: 58,
				label: ""
			},
			{
				x: 6.7,
				y: 62,
				label: ""
			},
			{
				x: 6.8,
				y: 73,
				label: ""
			},
			{
				x: 7,
				y: 59,
				label: ""
			},
			{
				x: 7.2,
				y: 63,
				label: ""
			},
			{
				x: 7.5,
				y: 57,
				label: ""
			},
			{
				x: 7.6,
				y: 41,
				label: ""
			},
			{
				x: 7.8,
				y: 61,
				label: ""
			},
			{
				x: 8,
				y: 60,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Complaints vs. Buses per Hour",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Average number of buses per hour",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 60,
			min: 0,
			label: "Number of complaints",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 2,
				y: 52,
				label: ""
			},
			{
				x: 3,
				y: 45,
				label: ""
			},
			{
				x: 4,
				y: 38,
				label: ""
			},
			{
				x: 5,
				y: 30,
				label: ""
			},
			{
				x: 6,
				y: 24,
				label: ""
			},
			{
				x: 7,
				y: 18,
				label: ""
			},
			{
				x: 7.5,
				y: 14,
				label: ""
			}
		]
	},
	/* REMOVED: invalid example with x=42000 > xMax=40000 */
	/*{
    "type": "scatterPlot",
    "lines": [],
    "title": "Population density and average 1-bedroom rent",
    "width": 500,
    "xAxis": {
      "max": 40000,
      "min": 0,
      "label": "Population density, in people per square kilometer",
      "gridLines": true,
      "tickInterval": 5000
    },
    "yAxis": {
      "max": 2000,
      "min": 0,
      "label": "Average 1-bedroom rent, in dollars per month",
      "gridLines": true,
      "tickInterval": 100
    },
    "height": 400,
    "points": [
      {
        "x": 2000,
        "y": 825,
        "label": ""
      },
      {
        "x": 4000,
        "y": 870,
        "label": ""
      },
      {
        "x": 6000,
        "y": 930,
        "label": ""
      },
      {
        "x": 8000,
        "y": 980,
        "label": ""
      },
      {
        "x": 9000,
        "y": 1005,
        "label": ""
      },
      {
        "x": 10000,
        "y": 1040,
        "label": ""
      },
      {
        "x": 12000,
        "y": 1100,
        "label": ""
      },
      {
        "x": 14000,
        "y": 1160,
        "label": ""
      },
      {
        "x": 15000,
        "y": 1190,
        "label": ""
      },
      {
        "x": 16000,
        "y": 1210,
        "label": ""
      },
      {
        "x": 18000,
        "y": 1275,
        "label": ""
      },
      {
        "x": 20000,
        "y": 1320,
        "label": ""
      },
      {
        "x": 22000,
        "y": 1380,
        "label": ""
      },
      {
        "x": 24000,
        "y": 1425,
        "label": ""
      },
      {
        "x": 26000,
        "y": 1480,
        "label": ""
      },
      {
        "x": 27000,
        "y": 1505,
        "label": ""
      },
      {
        "x": 28000,
        "y": 1530,
        "label": ""
      },
      {
        "x": 30000,
        "y": 1590,
        "label": ""
      },
      {
        "x": 32000,
        "y": 1640,
        "label": ""
      },
      {
        "x": 34000,
        "y": 1700,
        "label": ""
      },
      {
        "x": 36000,
        "y": 1745,
        "label": ""
      },
      {
        "x": 38000,
        "y": 1800,
        "label": ""
      },
      {
        "x": 40000,
        "y": 1860,
        "label": ""
      },
      {
        "x": 42000,
        "y": 1900,
        "label": ""
      }
    ]
  },*/
	{
		type: "scatterPlot",
		lines: [],
		title: "Age vs. Accidents per 100 Drivers (2009)",
		width: 500,
		xAxis: {
			max: 25,
			min: 16,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 24,
			min: 9,
			label: "Accidents per 100 drivers",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 16,
				y: 23,
				label: ""
			},
			{
				x: 16.5,
				y: 22,
				label: ""
			},
			{
				x: 17.5,
				y: 21,
				label: ""
			},
			{
				x: 18.5,
				y: 19.5,
				label: ""
			},
			{
				x: 19,
				y: 18.8,
				label: ""
			},
			{
				x: 20.5,
				y: 17,
				label: ""
			},
			{
				x: 21.5,
				y: 15.5,
				label: ""
			},
			{
				x: 23,
				y: 13.5,
				label: ""
			},
			{
				x: 24,
				y: 11.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Life expectancy vs. infant mortality rate",
		width: 500,
		xAxis: {
			max: 100,
			min: 0,
			label: "Infant mortality, per 1000",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 58,
			min: 8,
			label: "Life expectancy, in years",
			gridLines: true,
			tickInterval: 5
		},
		height: 420,
		points: [
			{
				x: 1,
				y: 56,
				label: ""
			},
			{
				x: 3,
				y: 55,
				label: ""
			},
			{
				x: 4,
				y: 54,
				label: ""
			},
			{
				x: 5,
				y: 53,
				label: ""
			},
			{
				x: 6,
				y: 52,
				label: ""
			},
			{
				x: 7,
				y: 51,
				label: ""
			},
			{
				x: 8,
				y: 51,
				label: ""
			},
			{
				x: 9,
				y: 50,
				label: ""
			},
			{
				x: 10,
				y: 49,
				label: ""
			},
			{
				x: 11,
				y: 48,
				label: ""
			},
			{
				x: 12,
				y: 48,
				label: ""
			},
			{
				x: 13,
				y: 47,
				label: ""
			},
			{
				x: 14,
				y: 46,
				label: ""
			},
			{
				x: 15,
				y: 45,
				label: ""
			},
			{
				x: 16,
				y: 45,
				label: ""
			},
			{
				x: 18,
				y: 44,
				label: ""
			},
			{
				x: 19,
				y: 43,
				label: ""
			},
			{
				x: 22,
				y: 42,
				label: ""
			},
			{
				x: 25,
				y: 40,
				label: ""
			},
			{
				x: 28,
				y: 39,
				label: ""
			},
			{
				x: 30,
				y: 38,
				label: ""
			},
			{
				x: 35,
				y: 36,
				label: ""
			},
			{
				x: 40,
				y: 34,
				label: ""
			},
			{
				x: 45,
				y: 32,
				label: ""
			},
			{
				x: 50,
				y: 30,
				label: ""
			},
			{
				x: 55,
				y: 27,
				label: ""
			},
			{
				x: 60,
				y: 25,
				label: ""
			},
			{
				x: 65,
				y: 22,
				label: ""
			},
			{
				x: 70,
				y: 19,
				label: ""
			},
			{
				x: 75,
				y: 16,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Temperature and Gas Use",
		width: 500,
		xAxis: {
			max: 14,
			min: 0,
			label: "Temperature, in degrees Celsius",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 25,
			min: 0,
			label: "Gas used, in cubic meters",
			gridLines: true,
			tickInterval: 5
		},
		height: 420,
		points: [
			{
				x: 0,
				y: 22,
				label: ""
			},
			{
				x: 2.6,
				y: 18.8,
				label: ""
			},
			{
				x: 5.2,
				y: 15.6,
				label: ""
			},
			{
				x: 7.8,
				y: 12.3,
				label: ""
			},
			{
				x: 10.4,
				y: 9.1,
				label: ""
			},
			{
				x: 12.9,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Test scores vs. study time",
		width: 500,
		xAxis: {
			max: 5,
			min: 0,
			label: "Study time (hours)",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 0.7,
				y: 50,
				label: ""
			},
			{
				x: 0.8,
				y: 51,
				label: ""
			},
			{
				x: 0.9,
				y: 52,
				label: ""
			},
			{
				x: 1,
				y: 54,
				label: ""
			},
			{
				x: 1.1,
				y: 55,
				label: ""
			},
			{
				x: 1.2,
				y: 56,
				label: ""
			},
			{
				x: 1.3,
				y: 58,
				label: ""
			},
			{
				x: 1.4,
				y: 59,
				label: ""
			},
			{
				x: 1.5,
				y: 60,
				label: ""
			},
			{
				x: 1.6,
				y: 61,
				label: ""
			},
			{
				x: 1.7,
				y: 63,
				label: ""
			},
			{
				x: 1.8,
				y: 64,
				label: ""
			},
			{
				x: 1.9,
				y: 65,
				label: ""
			},
			{
				x: 2,
				y: 66,
				label: ""
			},
			{
				x: 2.1,
				y: 67,
				label: ""
			},
			{
				x: 2.2,
				y: 68,
				label: ""
			},
			{
				x: 2.3,
				y: 70,
				label: ""
			},
			{
				x: 2.4,
				y: 71,
				label: ""
			},
			{
				x: 2.5,
				y: 72,
				label: ""
			},
			{
				x: 2.6,
				y: 73,
				label: ""
			},
			{
				x: 2.7,
				y: 74,
				label: ""
			},
			{
				x: 2.8,
				y: 75,
				label: ""
			},
			{
				x: 2.9,
				y: 77,
				label: ""
			},
			{
				x: 3,
				y: 78,
				label: ""
			},
			{
				x: 3.1,
				y: 79,
				label: ""
			},
			{
				x: 3.2,
				y: 80,
				label: ""
			},
			{
				x: 3.3,
				y: 81,
				label: ""
			},
			{
				x: 3.4,
				y: 83,
				label: ""
			},
			{
				x: 3.5,
				y: 84,
				label: ""
			},
			{
				x: 3.6,
				y: 85,
				label: ""
			},
			{
				x: 3.7,
				y: 86,
				label: ""
			},
			{
				x: 3.8,
				y: 87,
				label: ""
			},
			{
				x: 3.9,
				y: 88,
				label: ""
			},
			{
				x: 4,
				y: 90,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Age vs. internet use",
		width: 500,
		xAxis: {
			max: 60,
			min: 0,
			label: "Age (in years)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 5,
			min: 0,
			label: "Average daily internet usage (in hours)",
			gridLines: true,
			tickInterval: 0.5
		},
		height: 400,
		points: [
			{
				x: 3,
				y: 0,
				label: ""
			},
			{
				x: 8,
				y: 0.5,
				label: ""
			},
			{
				x: 12,
				y: 1.5,
				label: ""
			},
			{
				x: 16,
				y: 2.5,
				label: ""
			},
			{
				x: 19,
				y: 3.5,
				label: ""
			},
			{
				x: 22,
				y: 4,
				label: ""
			},
			{
				x: 30,
				y: 3,
				label: ""
			},
			{
				x: 40,
				y: 1.5,
				label: ""
			},
			{
				x: 55,
				y: 0.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Test grades vs. shoe sizes",
		width: 500,
		xAxis: {
			max: 11,
			min: 4,
			label: "Shoe size",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 95,
			min: 50,
			label: "Score",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 5.5,
				y: 82,
				label: ""
			},
			{
				x: 5.5,
				y: 60,
				label: ""
			},
			{
				x: 6,
				y: 70,
				label: ""
			},
			{
				x: 6,
				y: 85,
				label: ""
			},
			{
				x: 6.5,
				y: 76,
				label: ""
			},
			{
				x: 6.5,
				y: 58,
				label: ""
			},
			{
				x: 7,
				y: 66,
				label: ""
			},
			{
				x: 7,
				y: 83,
				label: ""
			},
			{
				x: 7.5,
				y: 72,
				label: ""
			},
			{
				x: 7.5,
				y: 55,
				label: ""
			},
			{
				x: 8,
				y: 79,
				label: ""
			},
			{
				x: 8,
				y: 63,
				label: ""
			},
			{
				x: 8.5,
				y: 68,
				label: ""
			},
			{
				x: 8.5,
				y: 86,
				label: ""
			},
			{
				x: 9,
				y: 74,
				label: ""
			},
			{
				x: 9,
				y: 57,
				label: ""
			},
			{
				x: 9.5,
				y: 62,
				label: ""
			},
			{
				x: 9.5,
				y: 80,
				label: ""
			},
			{
				x: 10,
				y: 71,
				label: ""
			},
			{
				x: 10,
				y: 54,
				label: ""
			},
			{
				x: 10.5,
				y: 65,
				label: ""
			},
			{
				x: 10.5,
				y: 82,
				label: ""
			},
			{
				x: 11,
				y: 59,
				label: ""
			},
			{
				x: 11,
				y: 77,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Average income vs. average 1-bedroom rent",
		width: 300,
		xAxis: {
			max: 60,
			min: 30,
			label: "Average annual income, in thousands of dollars per year",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 2000,
			min: 600,
			label: "Average 1-bedroom rent, in dollars per month",
			gridLines: true,
			tickInterval: 100
		},
		height: 300,
		points: [
			{
				x: 36.5,
				y: 825,
				label: ""
			},
			{
				x: 38,
				y: 900,
				label: ""
			},
			{
				x: 40,
				y: 950,
				label: ""
			},
			{
				x: 42,
				y: 1000,
				label: ""
			},
			{
				x: 44,
				y: 1100,
				label: ""
			},
			{
				x: 45,
				y: 1150,
				label: ""
			},
			{
				x: 47,
				y: 1200,
				label: ""
			},
			{
				x: 48.5,
				y: 1300,
				label: ""
			},
			{
				x: 50,
				y: 1400,
				label: ""
			},
			{
				x: 52,
				y: 1500,
				label: ""
			},
			{
				x: 54,
				y: 1600,
				label: ""
			},
			{
				x: 56,
				y: 1700,
				label: ""
			},
			{
				x: 58,
				y: 1800,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 60,
			min: 0,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 4,
			min: 0,
			label: "Internet use (hours)",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 3,
				y: 0,
				label: ""
			},
			{
				x: 10,
				y: 1,
				label: ""
			},
			{
				x: 16,
				y: 2.5,
				label: ""
			},
			{
				x: 22,
				y: 4,
				label: ""
			},
			{
				x: 35,
				y: 3,
				label: ""
			},
			{
				x: 55,
				y: 0.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 150,
			min: 0,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 50
		},
		yAxis: {
			max: 14,
			min: 0,
			label: "Internet use (hours)",
			gridLines: true,
			tickInterval: 2
		},
		height: 400,
		points: [
			{
				x: 3,
				y: 0,
				label: ""
			},
			{
				x: 10,
				y: 1,
				label: ""
			},
			{
				x: 16,
				y: 2.5,
				label: ""
			},
			{
				x: 22,
				y: 4,
				label: ""
			},
			{
				x: 35,
				y: 3,
				label: ""
			},
			{
				x: 55,
				y: 0.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 4,
			min: 0,
			label: "Internet use (hours)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 60,
			min: 0,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 3,
				label: ""
			},
			{
				x: 1,
				y: 10,
				label: ""
			},
			{
				x: 2.5,
				y: 16,
				label: ""
			},
			{
				x: 4,
				y: 22,
				label: ""
			},
			{
				x: 3,
				y: 35,
				label: ""
			},
			{
				x: 0.5,
				y: 55,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 14,
			min: 0,
			label: "Internet use (hours)",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 150,
			min: 0,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 50
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 3,
				label: ""
			},
			{
				x: 1,
				y: 10,
				label: ""
			},
			{
				x: 2.5,
				y: 16,
				label: ""
			},
			{
				x: 4,
				y: 22,
				label: ""
			},
			{
				x: 3,
				y: 35,
				label: ""
			},
			{
				x: 0.5,
				y: 55,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 150,
			min: 0,
			label: "Gas left (L)",
			gridLines: true,
			tickInterval: 30
		},
		yAxis: {
			max: 1500,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 500
		},
		height: 350,
		points: [
			{
				x: 50,
				y: 0,
				label: ""
			},
			{
				x: 42.2,
				y: 100,
				label: ""
			},
			{
				x: 34.2,
				y: 200,
				label: ""
			},
			{
				x: 26,
				y: 300,
				label: ""
			},
			{
				x: 17.6,
				y: 400,
				label: ""
			},
			{
				x: 9.1,
				y: 500,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 1500,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 500
		},
		yAxis: {
			max: 150,
			min: 0,
			label: "Gas left (L)",
			gridLines: true,
			tickInterval: 30
		},
		height: 350,
		points: [
			{
				x: 0,
				y: 50,
				label: ""
			},
			{
				x: 100,
				y: 42.2,
				label: ""
			},
			{
				x: 200,
				y: 34.2,
				label: ""
			},
			{
				x: 300,
				y: 26,
				label: ""
			},
			{
				x: 400,
				y: 17.6,
				label: ""
			},
			{
				x: 500,
				y: 9.1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 50,
			min: 0,
			label: "Gas left (L)",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 500,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 100
		},
		height: 350,
		points: [
			{
				x: 50,
				y: 0,
				label: ""
			},
			{
				x: 42.2,
				y: 100,
				label: ""
			},
			{
				x: 34.2,
				y: 200,
				label: ""
			},
			{
				x: 26,
				y: 300,
				label: ""
			},
			{
				x: 17.6,
				y: 400,
				label: ""
			},
			{
				x: 9.1,
				y: 500,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 500,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 100
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "Gas left (L)",
			gridLines: true,
			tickInterval: 10
		},
		height: 350,
		points: [
			{
				x: 0,
				y: 50,
				label: ""
			},
			{
				x: 100,
				y: 42.2,
				label: ""
			},
			{
				x: 200,
				y: 34.2,
				label: ""
			},
			{
				x: 300,
				y: 26,
				label: ""
			},
			{
				x: 400,
				y: 17.6,
				label: ""
			},
			{
				x: 500,
				y: 9.1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 50,
			min: 0,
			label: "Latitude (degrees)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 25,
			min: 0,
			label: "Low temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 14,
				y: 20,
				label: ""
			},
			{
				x: 21,
				y: 7,
				label: ""
			},
			{
				x: 24,
				y: 17,
				label: ""
			},
			{
				x: 31,
				y: 4,
				label: ""
			},
			{
				x: 49,
				y: 1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 25,
			min: 0,
			label: "Low temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "Latitude (degrees)",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 49,
				label: ""
			},
			{
				x: 4,
				y: 31,
				label: ""
			},
			{
				x: 7,
				y: 21,
				label: ""
			},
			{
				x: 17,
				y: 24,
				label: ""
			},
			{
				x: 20,
				y: 14,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 180,
			min: 0,
			label: "Latitude (degrees)",
			gridLines: true,
			tickInterval: 15
		},
		yAxis: {
			max: 75,
			min: 0,
			label: "Low temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 15
		},
		height: 400,
		points: [
			{
				x: 14,
				y: 20,
				label: ""
			},
			{
				x: 21,
				y: 7,
				label: ""
			},
			{
				x: 24,
				y: 17,
				label: ""
			},
			{
				x: 31,
				y: 4,
				label: ""
			},
			{
				x: 49,
				y: 1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 60,
			min: 0,
			label: "Low temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 15
		},
		yAxis: {
			max: 180,
			min: 0,
			label: "Latitude (degrees)",
			gridLines: true,
			tickInterval: 15
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 49,
				label: ""
			},
			{
				x: 4,
				y: 31,
				label: ""
			},
			{
				x: 7,
				y: 21,
				label: ""
			},
			{
				x: 17,
				y: 24,
				label: ""
			},
			{
				x: 20,
				y: 14,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 150,
			min: 0,
			label: "Speed (km/hour)",
			gridLines: true,
			tickInterval: 50
		},
		yAxis: {
			max: 14,
			min: 0,
			label: "Fuel used (liters)",
			gridLines: true,
			tickInterval: 2
		},
		height: 350,
		points: [
			{
				x: 20,
				y: 13,
				label: ""
			},
			{
				x: 40,
				y: 8,
				label: ""
			},
			{
				x: 60,
				y: 5.9,
				label: ""
			},
			{
				x: 80,
				y: 7,
				label: ""
			},
			{
				x: 100,
				y: 8.3,
				label: ""
			},
			{
				x: 120,
				y: 9.9,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 14,
			min: 0,
			label: "Fuel used (liters)",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 150,
			min: 0,
			label: "Speed (km/hour)",
			gridLines: true,
			tickInterval: 50
		},
		height: 350,
		points: [
			{
				x: 13,
				y: 20,
				label: ""
			},
			{
				x: 8,
				y: 40,
				label: ""
			},
			{
				x: 5.9,
				y: 60,
				label: ""
			},
			{
				x: 7,
				y: 80,
				label: ""
			},
			{
				x: 8.3,
				y: 100,
				label: ""
			},
			{
				x: 9.9,
				y: 120,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 300,
			min: 0,
			label: "Speed (km/hour)",
			gridLines: true,
			tickInterval: 100
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Fuel used (liters)",
			gridLines: true,
			tickInterval: 10
		},
		height: 350,
		points: [
			{
				x: 20,
				y: 13,
				label: ""
			},
			{
				x: 40,
				y: 8,
				label: ""
			},
			{
				x: 60,
				y: 5.9,
				label: ""
			},
			{
				x: 80,
				y: 7,
				label: ""
			},
			{
				x: 100,
				y: 8.3,
				label: ""
			},
			{
				x: 120,
				y: 9.9,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 100,
			min: 0,
			label: "Fuel used (liters)",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 300,
			min: 0,
			label: "Speed (km/hour)",
			gridLines: true,
			tickInterval: 100
		},
		height: 350,
		points: [
			{
				x: 13,
				y: 20,
				label: ""
			},
			{
				x: 8,
				y: 40,
				label: ""
			},
			{
				x: 5.9,
				y: 60,
				label: ""
			},
			{
				x: 7,
				y: 80,
				label: ""
			},
			{
				x: 8.3,
				y: 100,
				label: ""
			},
			{
				x: 9.9,
				y: 120,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 80,
			min: 0,
			label: "Life expectancy, in years",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Heart rate, in beats per minute",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 12,
				y: 50,
				label: ""
			},
			{
				x: 13,
				y: 75,
				label: ""
			},
			{
				x: 25,
				y: 95,
				label: ""
			},
			{
				x: 40,
				y: 32,
				label: ""
			},
			{
				x: 70,
				y: 20,
				label: ""
			},
			{
				x: 70,
				y: 30,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 100,
			min: 0,
			label: "Heart rate, in beats per minute",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 80,
			min: 0,
			label: "Life expectancy, in years",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 20,
				y: 70,
				label: ""
			},
			{
				x: 30,
				y: 70,
				label: ""
			},
			{
				x: 32,
				y: 40,
				label: ""
			},
			{
				x: 50,
				y: 12,
				label: ""
			},
			{
				x: 75,
				y: 13,
				label: ""
			},
			{
				x: 95,
				y: 25,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 240,
			min: 0,
			label: "Life expectancy, in years",
			gridLines: true,
			tickInterval: 60
		},
		yAxis: {
			max: 300,
			min: 0,
			label: "Heart rate, in beats per minute",
			gridLines: true,
			tickInterval: 60
		},
		height: 400,
		points: [
			{
				x: 12,
				y: 50,
				label: ""
			},
			{
				x: 13,
				y: 75,
				label: ""
			},
			{
				x: 25,
				y: 95,
				label: ""
			},
			{
				x: 40,
				y: 32,
				label: ""
			},
			{
				x: 70,
				y: 20,
				label: ""
			},
			{
				x: 70,
				y: 30,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 300,
			min: 0,
			label: "Heart rate, in beats per minute",
			gridLines: true,
			tickInterval: 60
		},
		yAxis: {
			max: 240,
			min: 0,
			label: "Life expectancy, in years",
			gridLines: true,
			tickInterval: 60
		},
		height: 400,
		points: [
			{
				x: 20,
				y: 70,
				label: ""
			},
			{
				x: 30,
				y: 70,
				label: ""
			},
			{
				x: 32,
				y: 40,
				label: ""
			},
			{
				x: 50,
				y: 12,
				label: ""
			},
			{
				x: 75,
				y: 13,
				label: ""
			},
			{
				x: 95,
				y: 25,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 20,
			min: 0,
			label: "Exercise, in hours",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 9,
			min: 0,
			label: "Weight lost, in kilograms",
			gridLines: true,
			tickInterval: 1
		},
		height: 350,
		points: [
			{
				x: 1,
				y: 0.86,
				label: ""
			},
			{
				x: 2,
				y: 1.13,
				label: ""
			},
			{
				x: 3,
				y: 1.59,
				label: ""
			},
			{
				x: 4,
				y: 2.27,
				label: ""
			},
			{
				x: 5,
				y: 2.62,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 6,
			min: 0,
			label: "Exercise, in hours",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 3,
			min: 0,
			label: "Weight lost, in kilograms",
			gridLines: true,
			tickInterval: 0.5
		},
		height: 350,
		points: [
			{
				x: 1,
				y: 0.86,
				label: ""
			},
			{
				x: 2,
				y: 1.13,
				label: ""
			},
			{
				x: 3,
				y: 1.59,
				label: ""
			},
			{
				x: 4,
				y: 2.27,
				label: ""
			},
			{
				x: 5,
				y: 2.62,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 9,
			min: 0,
			label: "Weight lost, in kilograms",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Exercise, in hours",
			gridLines: true,
			tickInterval: 5
		},
		height: 350,
		points: [
			{
				x: 0.86,
				y: 1,
				label: ""
			},
			{
				x: 1.13,
				y: 2,
				label: ""
			},
			{
				x: 1.59,
				y: 3,
				label: ""
			},
			{
				x: 2.27,
				y: 4,
				label: ""
			},
			{
				x: 2.62,
				y: 5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 3,
			min: 0,
			label: "Weight lost, in kilograms",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 6,
			min: 0,
			label: "Exercise, in hours",
			gridLines: true,
			tickInterval: 1
		},
		height: 350,
		points: [
			{
				x: 0.86,
				y: 1,
				label: ""
			},
			{
				x: 1.13,
				y: 2,
				label: ""
			},
			{
				x: 1.59,
				y: 3,
				label: ""
			},
			{
				x: 2.27,
				y: 4,
				label: ""
			},
			{
				x: 2.62,
				y: 5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 180,
			min: 0,
			label: "Number of complaints",
			gridLines: true,
			tickInterval: 15
		},
		yAxis: {
			max: 24,
			min: 0,
			label: "Average number of buses per hour",
			gridLines: true,
			tickInterval: 3
		},
		height: 350,
		points: [
			{
				x: 52,
				y: 2,
				label: ""
			},
			{
				x: 33,
				y: 2.5,
				label: ""
			},
			{
				x: 21,
				y: 4.25,
				label: ""
			},
			{
				x: 23,
				y: 5,
				label: ""
			},
			{
				x: 20,
				y: 5.25,
				label: ""
			},
			{
				x: 17,
				y: 6.25,
				label: ""
			},
			{
				x: 14,
				y: 7.25,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 24,
			min: 0,
			label: "Average number of buses per hour",
			gridLines: true,
			tickInterval: 3
		},
		yAxis: {
			max: 180,
			min: 0,
			label: "Number of complaints",
			gridLines: true,
			tickInterval: 15
		},
		height: 350,
		points: [
			{
				x: 2,
				y: 52,
				label: ""
			},
			{
				x: 2.5,
				y: 33,
				label: ""
			},
			{
				x: 4.25,
				y: 21,
				label: ""
			},
			{
				x: 5,
				y: 23,
				label: ""
			},
			{
				x: 5.25,
				y: 20,
				label: ""
			},
			{
				x: 6.25,
				y: 17,
				label: ""
			},
			{
				x: 7.25,
				y: 14,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 60,
			min: 0,
			label: "Number of complaints",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "Average number of buses per hour",
			gridLines: true,
			tickInterval: 1
		},
		height: 350,
		points: [
			{
				x: 52,
				y: 2,
				label: ""
			},
			{
				x: 33,
				y: 2.5,
				label: ""
			},
			{
				x: 21,
				y: 4.25,
				label: ""
			},
			{
				x: 23,
				y: 5,
				label: ""
			},
			{
				x: 20,
				y: 5.25,
				label: ""
			},
			{
				x: 17,
				y: 6.25,
				label: ""
			},
			{
				x: 14,
				y: 7.25,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Average number of buses per hour",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 60,
			min: 0,
			label: "Number of complaints",
			gridLines: true,
			tickInterval: 5
		},
		height: 350,
		points: [
			{
				x: 2,
				y: 52,
				label: ""
			},
			{
				x: 2.5,
				y: 33,
				label: ""
			},
			{
				x: 4.25,
				y: 21,
				label: ""
			},
			{
				x: 5,
				y: 23,
				label: ""
			},
			{
				x: 5.25,
				y: 20,
				label: ""
			},
			{
				x: 6.25,
				y: 17,
				label: ""
			},
			{
				x: 7.25,
				y: 14,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 12,
			min: 0,
			label: "Change in circumference (centimeters)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Sunlight (hours per day)",
			gridLines: true,
			tickInterval: 1
		},
		height: 360,
		points: [
			{
				x: 1,
				y: 0,
				label: ""
			},
			{
				x: 2.5,
				y: 2,
				label: ""
			},
			{
				x: 5.25,
				y: 4,
				label: ""
			},
			{
				x: 10.75,
				y: 6,
				label: ""
			},
			{
				x: 11.25,
				y: 8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 10,
			min: 0,
			label: "Sunlight (hours per day)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 12,
			min: 0,
			label: "Change in circumference (centimeters)",
			gridLines: true,
			tickInterval: 1
		},
		height: 360,
		points: [
			{
				x: 0,
				y: 1,
				label: ""
			},
			{
				x: 2,
				y: 2.5,
				label: ""
			},
			{
				x: 4,
				y: 5.25,
				label: ""
			},
			{
				x: 6,
				y: 10.75,
				label: ""
			},
			{
				x: 8,
				y: 11.25,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 35,
			min: 0,
			label: "Change in circumference (centimeters)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "Sunlight (hours per day)",
			gridLines: true,
			tickInterval: 15
		},
		height: 360,
		points: [
			{
				x: 1,
				y: 0,
				label: ""
			},
			{
				x: 2.5,
				y: 2,
				label: ""
			},
			{
				x: 5.25,
				y: 4,
				label: ""
			},
			{
				x: 10.75,
				y: 6,
				label: ""
			},
			{
				x: 11.25,
				y: 8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 30,
			min: 0,
			label: "Sunlight (hours per day)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 35,
			min: 0,
			label: "Change in circumference (centimeters)",
			gridLines: true,
			tickInterval: 5
		},
		height: 360,
		points: [
			{
				x: 0,
				y: 1,
				label: ""
			},
			{
				x: 2,
				y: 2.5,
				label: ""
			},
			{
				x: 4,
				y: 5.25,
				label: ""
			},
			{
				x: 6,
				y: 10.75,
				label: ""
			},
			{
				x: 8,
				y: 11.25,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 10,
			min: 0,
			label: "Time (hours)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 2
		},
		height: 350,
		points: [
			{
				x: 2,
				y: 5,
				label: ""
			},
			{
				x: 2.75,
				y: 8,
				label: ""
			},
			{
				x: 4,
				y: 9.5,
				label: ""
			},
			{
				x: 7.25,
				y: 16,
				label: ""
			},
			{
				x: 8.5,
				y: 18,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 30,
			min: 0,
			label: "Time (hours)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 60,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 5
		},
		height: 350,
		points: [
			{
				x: 2,
				y: 5,
				label: ""
			},
			{
				x: 2.75,
				y: 8,
				label: ""
			},
			{
				x: 4,
				y: 9.5,
				label: ""
			},
			{
				x: 7.25,
				y: 16,
				label: ""
			},
			{
				x: 8.5,
				y: 18,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 20,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Time (hours)",
			gridLines: true,
			tickInterval: 1
		},
		height: 350,
		points: [
			{
				x: 5,
				y: 2,
				label: ""
			},
			{
				x: 8,
				y: 2.75,
				label: ""
			},
			{
				x: 9.5,
				y: 4,
				label: ""
			},
			{
				x: 16,
				y: 7.25,
				label: ""
			},
			{
				x: 18,
				y: 8.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 60,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "Time (hours)",
			gridLines: true,
			tickInterval: 5
		},
		height: 350,
		points: [
			{
				x: 5,
				y: 2,
				label: ""
			},
			{
				x: 8,
				y: 2.75,
				label: ""
			},
			{
				x: 9.5,
				y: 4,
				label: ""
			},
			{
				x: 16,
				y: 7.25,
				label: ""
			},
			{
				x: 18,
				y: 8.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 270,
			min: 0,
			label: "Ad length (seconds)",
			gridLines: true,
			tickInterval: 45
		},
		yAxis: {
			max: 24,
			min: 0,
			label: "Average rating",
			gridLines: true,
			tickInterval: 3
		},
		height: 350,
		points: [
			{
				x: 30,
				y: 6,
				label: ""
			},
			{
				x: 45,
				y: 7,
				label: ""
			},
			{
				x: 60,
				y: 5,
				label: ""
			},
			{
				x: 75,
				y: 3,
				label: ""
			},
			{
				x: 90,
				y: 2.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 24,
			min: 0,
			label: "Average rating",
			gridLines: true,
			tickInterval: 3
		},
		yAxis: {
			max: 270,
			min: 0,
			label: "Ad length (seconds)",
			gridLines: true,
			tickInterval: 45
		},
		height: 350,
		points: [
			{
				x: 6,
				y: 30,
				label: ""
			},
			{
				x: 7,
				y: 45,
				label: ""
			},
			{
				x: 5,
				y: 60,
				label: ""
			},
			{
				x: 3,
				y: 75,
				label: ""
			},
			{
				x: 2.5,
				y: 90,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 90,
			min: 0,
			label: "Ad length (seconds)",
			gridLines: true,
			tickInterval: 15
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "Average rating",
			gridLines: true,
			tickInterval: 1
		},
		height: 350,
		points: [
			{
				x: 30,
				y: 6,
				label: ""
			},
			{
				x: 45,
				y: 7,
				label: ""
			},
			{
				x: 60,
				y: 5,
				label: ""
			},
			{
				x: 75,
				y: 3,
				label: ""
			},
			{
				x: 90,
				y: 2.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 7,
			min: 0,
			label: "Average rating",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 90,
			min: 0,
			label: "Ad length (seconds)",
			gridLines: true,
			tickInterval: 15
		},
		height: 350,
		points: [
			{
				x: 6,
				y: 30,
				label: ""
			},
			{
				x: 7,
				y: 45,
				label: ""
			},
			{
				x: 5,
				y: 60,
				label: ""
			},
			{
				x: 3,
				y: 75,
				label: ""
			},
			{
				x: 2.5,
				y: 90,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 15,
			min: 0,
			label: "Fuel used (liters)",
			gridLines: true,
			tickInterval: 3
		},
		yAxis: {
			max: 2.5,
			min: 0,
			label: "Mass (metric tons)",
			gridLines: true,
			tickInterval: 0.5
		},
		height: 360,
		points: [
			{
				x: 3.6,
				y: 0.45,
				label: ""
			},
			{
				x: 6.7,
				y: 0.91,
				label: ""
			},
			{
				x: 9.8,
				y: 1.36,
				label: ""
			},
			{
				x: 11.2,
				y: 1.81,
				label: ""
			},
			{
				x: 14.7,
				y: 2.27,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 2.5,
			min: 0,
			label: "Mass (metric tons)",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 15,
			min: 0,
			label: "Fuel used (liters)",
			gridLines: true,
			tickInterval: 3
		},
		height: 360,
		points: [
			{
				x: 0.45,
				y: 3.6,
				label: ""
			},
			{
				x: 0.91,
				y: 6.7,
				label: ""
			},
			{
				x: 1.36,
				y: 9.8,
				label: ""
			},
			{
				x: 1.81,
				y: 11.2,
				label: ""
			},
			{
				x: 2.27,
				y: 14.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 36,
			min: 0,
			label: "Fuel used (liters)",
			gridLines: true,
			tickInterval: 9
		},
		yAxis: {
			max: 7.5,
			min: 0,
			label: "Mass (metric tons)",
			gridLines: true,
			tickInterval: 1.5
		},
		height: 360,
		points: [
			{
				x: 3.6,
				y: 0.45,
				label: ""
			},
			{
				x: 6.7,
				y: 0.91,
				label: ""
			},
			{
				x: 9.8,
				y: 1.36,
				label: ""
			},
			{
				x: 11.2,
				y: 1.81,
				label: ""
			},
			{
				x: 14.7,
				y: 2.27,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 7.5,
			min: 0,
			label: "Mass (metric tons)",
			gridLines: true,
			tickInterval: 1.5
		},
		yAxis: {
			max: 36,
			min: 0,
			label: "Fuel used (liters)",
			gridLines: true,
			tickInterval: 9
		},
		height: 360,
		points: [
			{
				x: 0.45,
				y: 3.6,
				label: ""
			},
			{
				x: 0.91,
				y: 6.7,
				label: ""
			},
			{
				x: 1.36,
				y: 9.8,
				label: ""
			},
			{
				x: 1.81,
				y: 11.2,
				label: ""
			},
			{
				x: 2.27,
				y: 14.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 500,
			min: 0,
			label: "Cones sold",
			gridLines: true,
			tickInterval: 50
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "Average high temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 1,
				label: ""
			},
			{
				x: 0,
				y: 3,
				label: ""
			},
			{
				x: 30,
				y: 7.3,
				label: ""
			},
			{
				x: 61,
				y: 14.3,
				label: ""
			},
			{
				x: 118,
				y: 21.2,
				label: ""
			},
			{
				x: 426,
				y: 26.1,
				label: ""
			},
			{
				x: 485,
				y: 28.6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 1500,
			min: 0,
			label: "Cones sold",
			gridLines: true,
			tickInterval: 150
		},
		yAxis: {
			max: 90,
			min: 0,
			label: "Average high temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 7.5
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 1,
				label: ""
			},
			{
				x: 0,
				y: 3,
				label: ""
			},
			{
				x: 30,
				y: 7.3,
				label: ""
			},
			{
				x: 61,
				y: 14.3,
				label: ""
			},
			{
				x: 118,
				y: 21.2,
				label: ""
			},
			{
				x: 426,
				y: 26.1,
				label: ""
			},
			{
				x: 485,
				y: 28.6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 30,
			min: 0,
			label: "Average high temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 500,
			min: 0,
			label: "Cones sold",
			gridLines: true,
			tickInterval: 50
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 0,
				label: ""
			},
			{
				x: 3,
				y: 0,
				label: ""
			},
			{
				x: 7.3,
				y: 30,
				label: ""
			},
			{
				x: 14.3,
				y: 61,
				label: ""
			},
			{
				x: 21.2,
				y: 118,
				label: ""
			},
			{
				x: 26.1,
				y: 426,
				label: ""
			},
			{
				x: 28.6,
				y: 485,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 90,
			min: 0,
			label: "Average high temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 7.5
		},
		yAxis: {
			max: 1500,
			min: 0,
			label: "Cones sold",
			gridLines: true,
			tickInterval: 150
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 0,
				label: ""
			},
			{
				x: 3,
				y: 0,
				label: ""
			},
			{
				x: 7.3,
				y: 30,
				label: ""
			},
			{
				x: 14.3,
				y: 61,
				label: ""
			},
			{
				x: 21.2,
				y: 118,
				label: ""
			},
			{
				x: 26.1,
				y: 426,
				label: ""
			},
			{
				x: 28.6,
				y: 485,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 350,
			min: 0,
			label: "Dosage (mg)",
			gridLines: true,
			tickInterval: 50
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Average pain level",
			gridLines: true,
			tickInterval: 1
		},
		height: 350,
		points: [
			{
				x: 0,
				y: 6,
				label: ""
			},
			{
				x: 50,
				y: 5.8,
				label: ""
			},
			{
				x: 100,
				y: 5.2,
				label: ""
			},
			{
				x: 150,
				y: 4.9,
				label: ""
			},
			{
				x: 200,
				y: 3.9,
				label: ""
			},
			{
				x: 250,
				y: 3.6,
				label: ""
			},
			{
				x: 300,
				y: 3.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 1050,
			min: 0,
			label: "Dosage (mg)",
			gridLines: true,
			tickInterval: 150
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "Average pain level",
			gridLines: true,
			tickInterval: 3
		},
		height: 350,
		points: [
			{
				x: 0,
				y: 6,
				label: ""
			},
			{
				x: 50,
				y: 5.8,
				label: ""
			},
			{
				x: 100,
				y: 5.2,
				label: ""
			},
			{
				x: 150,
				y: 4.9,
				label: ""
			},
			{
				x: 200,
				y: 3.9,
				label: ""
			},
			{
				x: 250,
				y: 3.6,
				label: ""
			},
			{
				x: 300,
				y: 3.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 10,
			min: 0,
			label: "Average pain level",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 350,
			min: 0,
			label: "Dosage (mg)",
			gridLines: true,
			tickInterval: 50
		},
		height: 350,
		points: [
			{
				x: 6,
				y: 0,
				label: ""
			},
			{
				x: 5.8,
				y: 50,
				label: ""
			},
			{
				x: 5.2,
				y: 100,
				label: ""
			},
			{
				x: 4.9,
				y: 150,
				label: ""
			},
			{
				x: 3.9,
				y: 200,
				label: ""
			},
			{
				x: 3.6,
				y: 250,
				label: ""
			},
			{
				x: 3.5,
				y: 300,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 30,
			min: 0,
			label: "Average pain level",
			gridLines: true,
			tickInterval: 3
		},
		yAxis: {
			max: 1050,
			min: 0,
			label: "Dosage (mg)",
			gridLines: true,
			tickInterval: 150
		},
		height: 350,
		points: [
			{
				x: 6,
				y: 0,
				label: ""
			},
			{
				x: 5.8,
				y: 50,
				label: ""
			},
			{
				x: 5.2,
				y: 100,
				label: ""
			},
			{
				x: 4.9,
				y: 150,
				label: ""
			},
			{
				x: 3.9,
				y: 200,
				label: ""
			},
			{
				x: 3.6,
				y: 250,
				label: ""
			},
			{
				x: 3.5,
				y: 300,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 60,
			min: 0,
			label: "Gas used (cubic meters)",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 40,
			min: 0,
			label: "Temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 22,
				y: 0,
				label: ""
			},
			{
				x: 17,
				y: 2,
				label: ""
			},
			{
				x: 16.7,
				y: 4.5,
				label: ""
			},
			{
				x: 14.2,
				y: 7.2,
				label: ""
			},
			{
				x: 12,
				y: 10,
				label: ""
			},
			{
				x: 6,
				y: 12.8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 40,
			min: 0,
			label: "Temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 60,
			min: 0,
			label: "Gas used (cubic meters)",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 22,
				label: ""
			},
			{
				x: 2,
				y: 17,
				label: ""
			},
			{
				x: 4.5,
				y: 16.7,
				label: ""
			},
			{
				x: 7.2,
				y: 14.2,
				label: ""
			},
			{
				x: 10,
				y: 12,
				label: ""
			},
			{
				x: 12.8,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 25,
			min: 0,
			label: "Gas used (cubic meters)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 15,
			min: 0,
			label: "Temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 22,
				y: 0,
				label: ""
			},
			{
				x: 17,
				y: 2,
				label: ""
			},
			{
				x: 16.7,
				y: 4.5,
				label: ""
			},
			{
				x: 14.2,
				y: 7.2,
				label: ""
			},
			{
				x: 12,
				y: 10,
				label: ""
			},
			{
				x: 6,
				y: 12.8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 14,
			min: 0,
			label: "Temperature (degrees Celsius)",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 25,
			min: 0,
			label: "Gas used (cubic meters)",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 22,
				label: ""
			},
			{
				x: 2,
				y: 17,
				label: ""
			},
			{
				x: 4.5,
				y: 16.7,
				label: ""
			},
			{
				x: 7.2,
				y: 14.2,
				label: ""
			},
			{
				x: 10,
				y: 12,
				label: ""
			},
			{
				x: 12.8,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph A",
		width: 500,
		xAxis: {
			max: 20,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 150,
			min: 0,
			label: "Time (minutes)",
			gridLines: true,
			tickInterval: 50
		},
		height: 360,
		points: [
			{
				x: 1,
				y: 5.1,
				label: ""
			},
			{
				x: 2,
				y: 11.8,
				label: ""
			},
			{
				x: 3,
				y: 17.7,
				label: ""
			},
			{
				x: 4,
				y: 25.2,
				label: ""
			},
			{
				x: 5,
				y: 33,
				label: ""
			},
			{
				x: 6,
				y: 41.9,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph B",
		width: 500,
		xAxis: {
			max: 150,
			min: 0,
			label: "Time (minutes)",
			gridLines: true,
			tickInterval: 50
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 5
		},
		height: 360,
		points: [
			{
				x: 5.1,
				y: 1,
				label: ""
			},
			{
				x: 11.8,
				y: 2,
				label: ""
			},
			{
				x: 17.7,
				y: 3,
				label: ""
			},
			{
				x: 25.2,
				y: 4,
				label: ""
			},
			{
				x: 33,
				y: 5,
				label: ""
			},
			{
				x: 41.9,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph C",
		width: 500,
		xAxis: {
			max: 6,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 50,
			min: 0,
			label: "Time (minutes)",
			gridLines: true,
			tickInterval: 5
		},
		height: 360,
		points: [
			{
				x: 1,
				y: 5.1,
				label: ""
			},
			{
				x: 2,
				y: 11.8,
				label: ""
			},
			{
				x: 3,
				y: 17.7,
				label: ""
			},
			{
				x: 4,
				y: 25.2,
				label: ""
			},
			{
				x: 5,
				y: 33,
				label: ""
			},
			{
				x: 6,
				y: 41.9,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Graph D",
		width: 500,
		xAxis: {
			max: 50,
			min: 0,
			label: "Time (minutes)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 6,
			min: 0,
			label: "Distance (km)",
			gridLines: true,
			tickInterval: 1
		},
		height: 360,
		points: [
			{
				x: 5.1,
				y: 1,
				label: ""
			},
			{
				x: 11.8,
				y: 2,
				label: ""
			},
			{
				x: 17.7,
				y: 3,
				label: ""
			},
			{
				x: 25.2,
				y: 4,
				label: ""
			},
			{
				x: 33,
				y: 5,
				label: ""
			},
			{
				x: 41.9,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Temperature vs. Elevation",
		width: 450,
		xAxis: {
			max: 10,
			min: -10,
			label: "Elevation (m)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "Temperature (°C)",
			gridLines: true,
			tickInterval: 1
		},
		height: 435,
		points: [
			{
				x: -6,
				y: 5,
				label: "A"
			},
			{
				x: -7,
				y: -7,
				label: ""
			},
			{
				x: -5,
				y: -6,
				label: ""
			},
			{
				x: -1,
				y: 3,
				label: ""
			},
			{
				x: 2,
				y: 9,
				label: ""
			},
			{
				x: 3,
				y: 4,
				label: ""
			},
			{
				x: 5,
				y: -8,
				label: ""
			},
			{
				x: 7,
				y: 6,
				label: ""
			},
			{
				x: 8,
				y: 8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Temperature vs. Elevation",
		width: 444,
		xAxis: {
			max: 900,
			min: 0,
			label: "Elevation (m)",
			gridLines: true,
			tickInterval: 100
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "Temperature (°C)",
			gridLines: true,
			tickInterval: 2
		},
		height: 435,
		points: [
			{
				x: 100,
				y: 5,
				label: ""
			},
			{
				x: 200,
				y: -7,
				label: ""
			},
			{
				x: 300,
				y: 4,
				label: ""
			},
			{
				x: 450,
				y: 6,
				label: ""
			},
			{
				x: 500,
				y: -9,
				label: ""
			},
			{
				x: 650,
				y: -2,
				label: ""
			},
			{
				x: 700,
				y: 4,
				label: ""
			},
			{
				x: 850,
				y: -7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Temperature vs. Elevation",
		width: 450,
		xAxis: {
			max: 10,
			min: -10,
			label: "Elevation (m)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "Temperature (°C)",
			gridLines: true,
			tickInterval: 1
		},
		height: 435,
		points: [
			{
				x: -9,
				y: 7,
				label: ""
			},
			{
				x: -7,
				y: 5,
				label: ""
			},
			{
				x: -6,
				y: -9,
				label: ""
			},
			{
				x: -3,
				y: 2,
				label: ""
			},
			{
				x: 4,
				y: 8,
				label: ""
			},
			{
				x: 6,
				y: 2,
				label: ""
			},
			{
				x: 7,
				y: -8,
				label: ""
			},
			{
				x: 8,
				y: 9,
				label: ""
			},
			{
				x: 9,
				y: -3,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 450,
		xAxis: {
			max: 10,
			min: -10,
			label: "Temperature (°C)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 10,
			min: -10,
			label: "Weight (g)",
			gridLines: true,
			tickInterval: 1
		},
		height: 435,
		points: [
			{
				x: -9,
				y: -2,
				label: "A"
			},
			{
				x: -8,
				y: -6,
				label: ""
			},
			{
				x: -6,
				y: -3,
				label: ""
			},
			{
				x: -5,
				y: 2,
				label: ""
			},
			{
				x: 1,
				y: 3,
				label: ""
			},
			{
				x: 3,
				y: 4,
				label: ""
			},
			{
				x: 4,
				y: 3,
				label: ""
			},
			{
				x: 5,
				y: 2,
				label: ""
			},
			{
				x: 8,
				y: 5,
				label: ""
			},
			{
				x: 9,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 87
				},
				b: {
					x: 20,
					y: 67
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Score vs. Minutes remaining",
		width: 355,
		xAxis: {
			max: 18,
			min: 0,
			label: "Minutes remaining",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 90,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 10
		},
		height: 355,
		points: [
			{
				x: 0.1,
				y: 88,
				label: ""
			},
			{
				x: 0.8,
				y: 87,
				label: ""
			},
			{
				x: 1.5,
				y: 86,
				label: ""
			},
			{
				x: 2.3,
				y: 85,
				label: ""
			},
			{
				x: 3,
				y: 84,
				label: ""
			},
			{
				x: 3.8,
				y: 83,
				label: ""
			},
			{
				x: 4.5,
				y: 82,
				label: ""
			},
			{
				x: 5.2,
				y: 81.5,
				label: ""
			},
			{
				x: 6,
				y: 80,
				label: ""
			},
			{
				x: 6.8,
				y: 79,
				label: ""
			},
			{
				x: 7.5,
				y: 78.5,
				label: ""
			},
			{
				x: 8.3,
				y: 77,
				label: ""
			},
			{
				x: 9,
				y: 76.5,
				label: ""
			},
			{
				x: 9.8,
				y: 75,
				label: ""
			},
			{
				x: 10.6,
				y: 74,
				label: ""
			},
			{
				x: 11.3,
				y: 73.5,
				label: ""
			},
			{
				x: 12.1,
				y: 72,
				label: ""
			},
			{
				x: 12.8,
				y: 71.5,
				label: ""
			},
			{
				x: 13.6,
				y: 70.5,
				label: ""
			},
			{
				x: 14.3,
				y: 69.5,
				label: ""
			},
			{
				x: 15.1,
				y: 68,
				label: ""
			},
			{
				x: 15.8,
				y: 67.5,
				label: ""
			},
			{
				x: 16.6,
				y: 66,
				label: ""
			},
			{
				x: 17,
				y: 65,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 5
				},
				b: {
					x: 3,
					y: 9.5
				},
				type: "twoPoints",
				label: "Regression line",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Mood Rating vs. Hours Playing Sports",
		width: 500,
		xAxis: {
			max: 4.5,
			min: 0,
			label: "Hours playing sports",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Mood rating",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 4.8,
				label: ""
			},
			{
				x: 0.5,
				y: 5.6,
				label: ""
			},
			{
				x: 1,
				y: 6.4,
				label: ""
			},
			{
				x: 1.5,
				y: 7.2,
				label: ""
			},
			{
				x: 2,
				y: 8,
				label: ""
			},
			{
				x: 2.5,
				y: 8.7,
				label: ""
			},
			{
				x: 3,
				y: 9.4,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 41
				},
				b: {
					x: 45,
					y: 18
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Percent of adults who smoke vs. Years since 1945",
		width: 500,
		xAxis: {
			max: 45,
			min: 0,
			label: "Years since 1945",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Percent of adults who smoke",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 42,
				label: ""
			},
			{
				x: 3,
				y: 40.5,
				label: ""
			},
			{
				x: 6,
				y: 39,
				label: ""
			},
			{
				x: 9,
				y: 37.5,
				label: ""
			},
			{
				x: 12,
				y: 36,
				label: ""
			},
			{
				x: 15,
				y: 34.5,
				label: ""
			},
			{
				x: 18,
				y: 33,
				label: ""
			},
			{
				x: 21,
				y: 31,
				label: ""
			},
			{
				x: 24,
				y: 29.5,
				label: ""
			},
			{
				x: 27,
				y: 28,
				label: ""
			},
			{
				x: 31,
				y: 26.5,
				label: ""
			},
			{
				x: 36,
				y: 24,
				label: ""
			},
			{
				x: 41,
				y: 21.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 10000,
					y: 0
				},
				b: {
					x: 60000,
					y: 1520
				},
				type: "twoPoints",
				label: "Regression line",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Average income vs. rent",
		width: 500,
		xAxis: {
			max: 50000,
			min: 0,
			label: "Average income (dollars per year)",
			gridLines: true,
			tickInterval: 5000
		},
		yAxis: {
			max: 2000,
			min: 0,
			label: "Rent (dollars per month)",
			gridLines: true,
			tickInterval: 100
		},
		height: 400,
		points: [
			{
				x: 36000,
				y: 825,
				label: ""
			},
			{
				x: 37000,
				y: 900,
				label: ""
			},
			{
				x: 38000,
				y: 980,
				label: ""
			},
			{
				x: 39000,
				y: 1025,
				label: ""
			},
			{
				x: 40000,
				y: 1100,
				label: ""
			},
			{
				x: 41000,
				y: 1180,
				label: ""
			},
			{
				x: 42000,
				y: 1250,
				label: ""
			},
			{
				x: 43000,
				y: 1320,
				label: ""
			},
			{
				x: 44000,
				y: 1380,
				label: ""
			},
			{
				x: 45000,
				y: 1450,
				label: ""
			},
			{
				x: 46000,
				y: 1520,
				label: ""
			},
			{
				x: 47000,
				y: 1600,
				label: ""
			},
			{
				x: 48000,
				y: 1680,
				label: ""
			},
			{
				x: 50000,
				y: 1800,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 1950,
					y: 8.75
				},
				b: {
					x: 2015,
					y: 2.5
				},
				type: "twoPoints",
				label: "Regression line",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Score vs. Release year",
		width: 500,
		xAxis: {
			max: 2010,
			min: 1950,
			label: "Release year",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 10,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 1954,
				y: 8.5,
				label: ""
			},
			{
				x: 1956,
				y: 8.2,
				label: ""
			},
			{
				x: 1960,
				y: 7.9,
				label: ""
			},
			{
				x: 1962,
				y: 7.7,
				label: ""
			},
			{
				x: 1965,
				y: 7.4,
				label: ""
			},
			{
				x: 1968,
				y: 7.1,
				label: ""
			},
			{
				x: 1972,
				y: 6.8,
				label: ""
			},
			{
				x: 1975,
				y: 6.4,
				label: ""
			},
			{
				x: 1978,
				y: 6.2,
				label: ""
			},
			{
				x: 1982,
				y: 5.7,
				label: ""
			},
			{
				x: 1985,
				y: 5.3,
				label: ""
			},
			{
				x: 1988,
				y: 5,
				label: ""
			},
			{
				x: 1992,
				y: 4.6,
				label: ""
			},
			{
				x: 1995,
				y: 4.3,
				label: ""
			},
			{
				x: 1998,
				y: 3.9,
				label: ""
			},
			{
				x: 2002,
				y: 3.6,
				label: ""
			},
			{
				x: 2005,
				y: 3.2,
				label: ""
			},
			{
				x: 2008,
				y: 2.9,
				label: ""
			},
			{
				x: 2010,
				y: 2.8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 38
				},
				b: {
					x: 5.5,
					y: 85
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Winning percentage vs. salary",
		width: 500,
		xAxis: {
			max: 5,
			min: 0,
			label: "Salary (millions of dollars)",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Winning percentage",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 0.3,
				y: 22,
				label: ""
			},
			{
				x: 0.5,
				y: 34,
				label: ""
			},
			{
				x: 0.6,
				y: 36,
				label: ""
			},
			{
				x: 0.7,
				y: 42,
				label: ""
			},
			{
				x: 0.9,
				y: 46,
				label: ""
			},
			{
				x: 1.1,
				y: 48,
				label: ""
			},
			{
				x: 1.3,
				y: 53,
				label: ""
			},
			{
				x: 1.4,
				y: 50,
				label: ""
			},
			{
				x: 1.6,
				y: 57,
				label: ""
			},
			{
				x: 1.8,
				y: 59,
				label: ""
			},
			{
				x: 2,
				y: 62,
				label: ""
			},
			{
				x: 2.2,
				y: 66,
				label: ""
			},
			{
				x: 2.4,
				y: 67,
				label: ""
			},
			{
				x: 2.6,
				y: 70,
				label: ""
			},
			{
				x: 2.8,
				y: 72,
				label: ""
			},
			{
				x: 3,
				y: 74,
				label: ""
			},
			{
				x: 3.2,
				y: 76,
				label: ""
			},
			{
				x: 3.4,
				y: 78,
				label: ""
			},
			{
				x: 3.6,
				y: 80,
				label: ""
			},
			{
				x: 3.8,
				y: 81,
				label: ""
			},
			{
				x: 4,
				y: 82,
				label: ""
			},
			{
				x: 4.1,
				y: 83,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 800
				},
				b: {
					x: 12.5,
					y: 1300
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Average rent vs. years after 2000",
		width: 375,
		xAxis: {
			max: 12,
			min: 0,
			label: "Years after 2000",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 1200,
			min: 0,
			label: "Average rent, in dollars per month",
			gridLines: true,
			tickInterval: 100
		},
		height: 358,
		points: []
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 23
				},
				b: {
					x: 15,
					y: 3
				},
				type: "twoPoints",
				label: "Regression line",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Hours spent on video games vs. hours spent on homework",
		width: 370,
		xAxis: {
			max: 14,
			min: 0,
			label: "Hours spent on video games",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 24,
			min: 0,
			label: "Hours spent on homework",
			gridLines: true,
			tickInterval: 2
		},
		height: 360,
		points: []
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 38
				},
				b: {
					x: 5.5,
					y: 85
				},
				type: "twoPoints",
				label: "Regression line",
				style: {
					dash: false,
					color: "#11accd",
					strokeWidth: 2
				}
			}
		],
		title: "Winning percentage vs. Salary (millions of dollars)",
		width: 500,
		xAxis: {
			max: 5,
			min: 0,
			label: "Salary (millions of dollars)",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Winning percentage",
			gridLines: true,
			tickInterval: 5
		},
		height: 400,
		points: [
			{
				x: 0.3,
				y: 22,
				label: ""
			},
			{
				x: 0.5,
				y: 32.2,
				label: ""
			},
			{
				x: 0.6,
				y: 36,
				label: ""
			},
			{
				x: 0.7,
				y: 38.9,
				label: ""
			},
			{
				x: 0.8,
				y: 41,
				label: ""
			},
			{
				x: 0.9,
				y: 43.1,
				label: ""
			},
			{
				x: 1,
				y: 46.5,
				label: ""
			},
			{
				x: 1.2,
				y: 48.1,
				label: ""
			},
			{
				x: 1.3,
				y: 50,
				label: ""
			},
			{
				x: 1.4,
				y: 53.8,
				label: ""
			},
			{
				x: 1.6,
				y: 53,
				label: ""
			},
			{
				x: 1.8,
				y: 58.2,
				label: ""
			},
			{
				x: 1.9,
				y: 49,
				label: ""
			},
			{
				x: 2,
				y: 51.8,
				label: ""
			},
			{
				x: 2.1,
				y: 55.5,
				label: ""
			},
			{
				x: 2.2,
				y: 59.5,
				label: ""
			},
			{
				x: 2.3,
				y: 58,
				label: ""
			},
			{
				x: 2.4,
				y: 56.7,
				label: ""
			},
			{
				x: 2.5,
				y: 59.1,
				label: ""
			},
			{
				x: 2.6,
				y: 60.9,
				label: ""
			},
			{
				x: 2.8,
				y: 59.1,
				label: ""
			},
			{
				x: 3,
				y: 64.8,
				label: ""
			},
			{
				x: 3.1,
				y: 63.1,
				label: ""
			},
			{
				x: 3.2,
				y: 66.9,
				label: ""
			},
			{
				x: 3.3,
				y: 69.8,
				label: ""
			},
			{
				x: 3.4,
				y: 65.1,
				label: ""
			},
			{
				x: 3.5,
				y: 73.5,
				label: ""
			},
			{
				x: 3.6,
				y: 65.3,
				label: ""
			},
			{
				x: 3.7,
				y: 74.2,
				label: ""
			},
			{
				x: 3.8,
				y: 66,
				label: ""
			},
			{
				x: 3.9,
				y: 73.8,
				label: ""
			},
			{
				x: 4,
				y: 77.7,
				label: ""
			},
			{
				x: 4.1,
				y: 82.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 38
				},
				b: {
					x: 4.2,
					y: 100
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Study time vs. score",
		width: 500,
		xAxis: {
			max: 4.5,
			min: 0,
			label: "Study time (hours)",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 90,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 1.8,
				y: 62,
				label: ""
			},
			{
				x: 1.9,
				y: 66,
				label: ""
			},
			{
				x: 2,
				y: 68,
				label: ""
			},
			{
				x: 2.1,
				y: 69,
				label: ""
			},
			{
				x: 2.2,
				y: 71,
				label: ""
			},
			{
				x: 2.4,
				y: 73,
				label: ""
			},
			{
				x: 2.5,
				y: 75,
				label: ""
			},
			{
				x: 2.6,
				y: 77,
				label: ""
			},
			{
				x: 2.7,
				y: 78,
				label: ""
			},
			{
				x: 2.8,
				y: 79,
				label: ""
			},
			{
				x: 2.9,
				y: 80,
				label: ""
			},
			{
				x: 3,
				y: 82,
				label: ""
			},
			{
				x: 3.1,
				y: 83,
				label: ""
			},
			{
				x: 3.2,
				y: 85,
				label: ""
			},
			{
				x: 3.3,
				y: 86,
				label: ""
			},
			{
				x: 3.4,
				y: 87,
				label: ""
			},
			{
				x: 3.5,
				y: 88,
				label: ""
			},
			{
				x: 3.6,
				y: 88,
				label: ""
			},
			{
				x: 3.8,
				y: 89,
				label: ""
			},
			{
				x: 4,
				y: 90,
				label: ""
			},
			{
				x: 4.2,
				y: 90,
				label: ""
			},
			{
				x: 4.4,
				y: 90,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 90
				},
				b: {
					x: 95,
					y: 135
				},
				type: "twoPoints",
				label: "Regression line",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Ear circumference vs. age",
		width: 500,
		xAxis: {
			max: 90,
			min: 0,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 160,
			min: 0,
			label: "Ear circumference (mm)",
			gridLines: true,
			tickInterval: 10
		},
		height: 450,
		points: [
			{
				x: 21,
				y: 100,
				label: ""
			},
			{
				x: 25,
				y: 102,
				label: ""
			},
			{
				x: 28,
				y: 104,
				label: ""
			},
			{
				x: 32,
				y: 105,
				label: ""
			},
			{
				x: 35,
				y: 107,
				label: ""
			},
			{
				x: 38,
				y: 109,
				label: ""
			},
			{
				x: 42,
				y: 111,
				label: ""
			},
			{
				x: 45,
				y: 112,
				label: ""
			},
			{
				x: 48,
				y: 113,
				label: ""
			},
			{
				x: 50,
				y: 114,
				label: ""
			},
			{
				x: 53,
				y: 116,
				label: ""
			},
			{
				x: 56,
				y: 117,
				label: ""
			},
			{
				x: 59,
				y: 119,
				label: ""
			},
			{
				x: 62,
				y: 120,
				label: ""
			},
			{
				x: 65,
				y: 121,
				label: ""
			},
			{
				x: 68,
				y: 123,
				label: ""
			},
			{
				x: 72,
				y: 125,
				label: ""
			},
			{
				x: 75,
				y: 126,
				label: ""
			},
			{
				x: 78,
				y: 128,
				label: ""
			},
			{
				x: 81,
				y: 129,
				label: ""
			},
			{
				x: 84,
				y: 131,
				label: ""
			},
			{
				x: 87,
				y: 132,
				label: ""
			},
			{
				x: 90,
				y: 134,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 2.5,
					y: 0
				},
				b: {
					x: 60,
					y: 320
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Scatterplot and regression line",
		width: 500,
		xAxis: {
			max: 55,
			min: 0,
			label: "Foot length, in centimeters",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 340,
			min: 0,
			label: "Shoulder height, in centimeters",
			gridLines: true,
			tickInterval: 20
		},
		height: 400,
		points: []
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 0,
					y: 37
				},
				b: {
					x: 4.2,
					y: 100
				},
				type: "twoPoints",
				label: "Regression line",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Study time and test score",
		width: 366,
		xAxis: {
			max: 4.5,
			min: 0,
			label: "Study time, in hours",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 10
		},
		height: 369,
		points: [
			{
				x: 1.8,
				y: 62,
				label: ""
			},
			{
				x: 1.9,
				y: 63,
				label: ""
			},
			{
				x: 2,
				y: 65,
				label: ""
			},
			{
				x: 2.1,
				y: 66,
				label: ""
			},
			{
				x: 2.2,
				y: 68,
				label: ""
			},
			{
				x: 2.3,
				y: 69,
				label: ""
			},
			{
				x: 2.4,
				y: 71,
				label: ""
			},
			{
				x: 2.5,
				y: 73,
				label: ""
			},
			{
				x: 2.6,
				y: 74,
				label: ""
			},
			{
				x: 2.7,
				y: 76,
				label: ""
			},
			{
				x: 2.8,
				y: 77,
				label: ""
			},
			{
				x: 2.9,
				y: 79,
				label: ""
			},
			{
				x: 3,
				y: 80,
				label: ""
			},
			{
				x: 3.2,
				y: 83,
				label: ""
			},
			{
				x: 3.4,
				y: 86,
				label: ""
			},
			{
				x: 3.6,
				y: 88,
				label: ""
			},
			{
				x: 3.8,
				y: 90,
				label: ""
			},
			{
				x: 4,
				y: 92,
				label: ""
			},
			{
				x: 4.2,
				y: 94,
				label: ""
			},
			{
				x: 4.4,
				y: 95,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [
			{
				a: {
					x: 1,
					y: 0
				},
				b: {
					x: 3,
					y: 10
				},
				type: "twoPoints",
				label: "",
				style: {
					dash: false,
					color: "#1E90FF",
					strokeWidth: 2
				}
			}
		],
		title: "Average rating vs. cost",
		width: 500,
		xAxis: {
			max: 2.5,
			min: 0,
			label: "Cost (dollars)",
			gridLines: true,
			tickInterval: 0.1
		},
		yAxis: {
			max: 9,
			min: 0,
			label: "Average rating",
			gridLines: true,
			tickInterval: 1
		},
		height: 350,
		points: [
			{
				x: 1,
				y: 1.2,
				label: ""
			},
			{
				x: 1.07,
				y: 1.3,
				label: ""
			},
			{
				x: 1.14,
				y: 1.5,
				label: ""
			},
			{
				x: 1.21,
				y: 1.6,
				label: ""
			},
			{
				x: 1.28,
				y: 1.8,
				label: ""
			},
			{
				x: 1.35,
				y: 2.1,
				label: ""
			},
			{
				x: 1.42,
				y: 2.4,
				label: ""
			},
			{
				x: 1.49,
				y: 2.7,
				label: ""
			},
			{
				x: 1.56,
				y: 3,
				label: ""
			},
			{
				x: 1.63,
				y: 3.3,
				label: ""
			},
			{
				x: 1.7,
				y: 3.7,
				label: ""
			},
			{
				x: 1.77,
				y: 4.1,
				label: ""
			},
			{
				x: 1.84,
				y: 4.4,
				label: ""
			},
			{
				x: 1.91,
				y: 4.8,
				label: ""
			},
			{
				x: 1.98,
				y: 5.2,
				label: ""
			},
			{
				x: 2.05,
				y: 5.5,
				label: ""
			},
			{
				x: 2.12,
				y: 5.9,
				label: ""
			},
			{
				x: 2.19,
				y: 6.2,
				label: ""
			},
			{
				x: 2.26,
				y: 6.6,
				label: ""
			},
			{
				x: 2.33,
				y: 6.9,
				label: ""
			},
			{
				x: 2.4,
				y: 7.3,
				label: ""
			},
			{
				x: 2.47,
				y: 7.7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Period",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Avg score",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: []
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Period",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Avg score",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 95,
				label: ""
			},
			{
				x: 2,
				y: 70,
				label: ""
			},
			{
				x: 3,
				y: 90,
				label: ""
			},
			{
				x: 4,
				y: 65,
				label: ""
			},
			{
				x: 5,
				y: 70,
				label: ""
			},
			{
				x: 6,
				y: 85,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Period",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Avg score",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 85,
				label: ""
			},
			{
				x: 2,
				y: 70,
				label: ""
			},
			{
				x: 3,
				y: 65,
				label: ""
			},
			{
				x: 4,
				y: 90,
				label: ""
			},
			{
				x: 5,
				y: 70,
				label: ""
			},
			{
				x: 6,
				y: 95,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Period",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Avg score",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 5,
				label: ""
			},
			{
				x: 2,
				y: 30,
				label: ""
			},
			{
				x: 3,
				y: 10,
				label: ""
			},
			{
				x: 4,
				y: 35,
				label: ""
			},
			{
				x: 5,
				y: 30,
				label: ""
			},
			{
				x: 6,
				y: 15,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 5,
			min: 0,
			label: "Years",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "Wage",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 5.5,
				label: ""
			},
			{
				x: 1,
				y: 6.5,
				label: ""
			},
			{
				x: 2,
				y: 7,
				label: ""
			},
			{
				x: 3,
				y: 7.5,
				label: ""
			},
			{
				x: 4,
				y: 7.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Wage",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 5,
			min: 0,
			label: "Years",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 5.5,
				y: 0,
				label: ""
			},
			{
				x: 6.5,
				y: 1,
				label: ""
			},
			{
				x: 7,
				y: 2,
				label: ""
			},
			{
				x: 7.5,
				y: 3,
				label: ""
			},
			{
				x: 7.5,
				y: 4,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 5,
			min: 0,
			label: "Years",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "Wage",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 0,
				y: 7.5,
				label: ""
			},
			{
				x: 1,
				y: 7.5,
				label: ""
			},
			{
				x: 2,
				y: 7,
				label: ""
			},
			{
				x: 3,
				y: 6.5,
				label: ""
			},
			{
				x: 4,
				y: 5.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Sick days vs. T-shirts",
		width: 425,
		xAxis: {
			max: 11,
			min: 0,
			label: "Sick days",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "T-shirts",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 6,
				y: 6,
				label: ""
			},
			{
				x: 7.5,
				y: 7,
				label: ""
			},
			{
				x: 0.5,
				y: 7,
				label: ""
			},
			{
				x: 3,
				y: 7,
				label: ""
			},
			{
				x: 4,
				y: 5,
				label: ""
			},
			{
				x: 9.5,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Sick days vs. T-shirts",
		width: 425,
		xAxis: {
			max: 11,
			min: 0,
			label: "Sick days",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "T-shirts",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 6,
				y: 6,
				label: ""
			},
			{
				x: 7,
				y: 7.5,
				label: ""
			},
			{
				x: 7,
				y: 0.5,
				label: ""
			},
			{
				x: 7,
				y: 3,
				label: ""
			},
			{
				x: 5,
				y: 4,
				label: ""
			},
			{
				x: 6,
				y: 9.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Sick days vs. T-shirts",
		width: 425,
		xAxis: {
			max: 11,
			min: 0,
			label: "Sick days",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "T-shirts",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 6,
				y: 6,
				label: ""
			},
			{
				x: 8,
				y: 7,
				label: ""
			},
			{
				x: 1,
				y: 7,
				label: ""
			},
			{
				x: 3,
				y: 7,
				label: ""
			},
			{
				x: 4,
				y: 5,
				label: ""
			},
			{
				x: 10,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Meditation (minutes) vs. Sleep (hours)",
		width: 500,
		xAxis: {
			max: 24,
			min: 0,
			label: "Meditation (minutes)",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "Sleep (hours)",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 4,
				y: 4.5,
				label: ""
			},
			{
				x: 8,
				y: 9.5,
				label: ""
			},
			{
				x: 10,
				y: 8.5,
				label: ""
			},
			{
				x: 4,
				y: 6,
				label: ""
			},
			{
				x: 4,
				y: 7,
				label: ""
			},
			{
				x: 18,
				y: 10,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Meditation (minutes) vs. Sleep (hours)",
		width: 500,
		xAxis: {
			max: 24,
			min: 0,
			label: "Meditation (minutes)",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "Sleep (hours)",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 4.5,
				y: 4,
				label: ""
			},
			{
				x: 9.5,
				y: 8,
				label: ""
			},
			{
				x: 8.5,
				y: 10,
				label: ""
			},
			{
				x: 6,
				y: 4,
				label: ""
			},
			{
				x: 7,
				y: 4,
				label: ""
			},
			{
				x: 10,
				y: 8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Meditation (minutes) vs. Sleep (hours)",
		width: 500,
		xAxis: {
			max: 24,
			min: 0,
			label: "Meditation (minutes)",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "Sleep (hours)",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 4,
				y: 4.5,
				label: ""
			},
			{
				x: 8,
				y: 9.5,
				label: ""
			},
			{
				x: 12,
				y: 8.5,
				label: ""
			},
			{
				x: 4,
				y: 6,
				label: ""
			},
			{
				x: 4,
				y: 7,
				label: ""
			},
			{
				x: 18,
				y: 10,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Study Time vs. Score",
		width: 500,
		xAxis: {
			max: 3.5,
			min: 0,
			label: "Hours",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 2
		},
		height: 400,
		points: [
			{
				x: 0.25,
				y: 12,
				label: ""
			},
			{
				x: 0.75,
				y: 15,
				label: ""
			},
			{
				x: 1,
				y: 13,
				label: ""
			},
			{
				x: 2,
				y: 16,
				label: ""
			},
			{
				x: 3.25,
				y: 19,
				label: ""
			},
			{
				x: 0,
				y: 7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Study Time vs. Score",
		width: 500,
		xAxis: {
			max: 3.5,
			min: 0,
			label: "Hours",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 2
		},
		height: 400,
		points: [
			{
				x: 0.25,
				y: 15,
				label: ""
			},
			{
				x: 0.75,
				y: 12,
				label: ""
			},
			{
				x: 1,
				y: 16,
				label: ""
			},
			{
				x: 2,
				y: 19,
				label: ""
			},
			{
				x: 3.25,
				y: 7,
				label: ""
			},
			{
				x: 0,
				y: 13,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Study Time vs. Score",
		width: 500,
		xAxis: {
			max: 3.5,
			min: 0,
			label: "Hours",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 2
		},
		height: 400,
		points: [
			{
				x: 0.25,
				y: 12,
				label: ""
			},
			{
				x: 0.75,
				y: 15,
				label: ""
			},
			{
				x: 1,
				y: 13,
				label: ""
			},
			{
				x: 2,
				y: 16,
				label: ""
			},
			{
				x: 3.25,
				y: 18,
				label: ""
			},
			{
				x: 0,
				y: 7,
				label: ""
			}
		]
	},
	/* REMOVED: invalid example 'Option A' with y values > yMax */
	/*{
    "type": "scatterPlot",
    "lines": [],
    "title": "Option A",
    "width": 425,
    "xAxis": {
      "max": 120,
      "min": 0,
      "label": "Speed",
      "gridLines": true,
      "tickInterval": 10
    },
    "yAxis": {
      "max": 22,
      "min": 0,
      "label": "Fuel used",
      "gridLines": true,
      "tickInterval": 2
    },
    "height": 425,
    "points": [
      {
        "x": 21,
        "y": 10,
        "label": ""
      },
      {
        "x": 10,
        "y": 30,
        "label": ""
      },
      {
        "x": 7,
        "y": 50,
        "label": ""
      },
      {
        "x": 6,
        "y": 70,
        "label": ""
      },
      {
        "x": 8,
        "y": 90,
        "label": ""
      },
      {
        "x": 9,
        "y": 110,
        "label": ""
      }
    ]
  },*/
	{
		type: "scatterPlot",
		lines: [],
		title: "Option B",
		width: 425,
		xAxis: {
			max: 120,
			min: 0,
			label: "Speed",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 22,
			min: 0,
			label: "Fuel used",
			gridLines: true,
			tickInterval: 2
		},
		height: 425,
		points: [
			{
				x: 10,
				y: 21,
				label: ""
			},
			{
				x: 30,
				y: 10,
				label: ""
			},
			{
				x: 50,
				y: 7,
				label: ""
			},
			{
				x: 70,
				y: 6,
				label: ""
			},
			{
				x: 90,
				y: 8,
				label: ""
			},
			{
				x: 110,
				y: 9,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Option C",
		width: 425,
		xAxis: {
			max: 120,
			min: 0,
			label: "Speed",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 22,
			min: 0,
			label: "Fuel used",
			gridLines: true,
			tickInterval: 2
		},
		height: 425,
		points: [
			{
				x: 10,
				y: 21,
				label: ""
			},
			{
				x: 30,
				y: 12,
				label: ""
			},
			{
				x: 50,
				y: 9,
				label: ""
			},
			{
				x: 70,
				y: 7,
				label: ""
			},
			{
				x: 90,
				y: 6,
				label: ""
			},
			{
				x: 110,
				y: 5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Speed vs. Fuel used",
		width: 425,
		xAxis: {
			max: 120,
			min: 0,
			label: "Speed",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 22,
			min: 0,
			label: "Fuel used",
			gridLines: true,
			tickInterval: 2
		},
		height: 425,
		points: []
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Height vs. Petal length",
		width: 500,
		xAxis: {
			max: 42,
			min: -4,
			label: "Height",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 11,
			min: -1,
			label: "Petal length",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 10,
				y: 1.5,
				label: ""
			},
			{
				x: 15,
				y: 2,
				label: ""
			},
			{
				x: 20,
				y: 4,
				label: ""
			},
			{
				x: 32.5,
				y: 5,
				label: ""
			},
			{
				x: 35,
				y: 8,
				label: ""
			},
			{
				x: 37.5,
				y: 8.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Height vs. Petal length",
		width: 500,
		xAxis: {
			max: 42,
			min: -4,
			label: "Height",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 11,
			min: -1,
			label: "Petal length",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 10,
				y: 5,
				label: ""
			},
			{
				x: 15,
				y: 4,
				label: ""
			},
			{
				x: 20,
				y: 2,
				label: ""
			},
			{
				x: 32.5,
				y: 8,
				label: ""
			},
			{
				x: 35,
				y: 1.5,
				label: ""
			},
			{
				x: 37.5,
				y: 8.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Height vs. Petal length",
		width: 500,
		xAxis: {
			max: 42,
			min: -4,
			label: "Height",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 11,
			min: -1,
			label: "Petal length",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 10,
				y: 2,
				label: ""
			},
			{
				x: 15,
				y: 2.5,
				label: ""
			},
			{
				x: 20,
				y: 4.5,
				label: ""
			},
			{
				x: 32.5,
				y: 5.5,
				label: ""
			},
			{
				x: 35,
				y: 8.5,
				label: ""
			},
			{
				x: 37.5,
				y: 9,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Scatter Plot",
		width: 425,
		xAxis: {
			max: 300,
			min: 0,
			label: "Coffee (mL)",
			gridLines: true,
			tickInterval: 50
		},
		yAxis: {
			max: 22,
			min: 0,
			label: "Duration (min)",
			gridLines: true,
			tickInterval: 2
		},
		height: 425,
		points: [
			{
				x: 100,
				y: 18,
				label: ""
			},
			{
				x: 200,
				y: 14,
				label: ""
			},
			{
				x: 150,
				y: 15,
				label: ""
			},
			{
				x: 125,
				y: 20,
				label: ""
			},
			{
				x: 225,
				y: 12,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Scatter Plot",
		width: 425,
		xAxis: {
			max: 22,
			min: 0,
			label: "Duration (min)",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 300,
			min: 0,
			label: "Coffee (mL)",
			gridLines: true,
			tickInterval: 50
		},
		height: 425,
		points: [
			{
				x: 18,
				y: 100,
				label: ""
			},
			{
				x: 14,
				y: 200,
				label: ""
			},
			{
				x: 15,
				y: 150,
				label: ""
			},
			{
				x: 20,
				y: 125,
				label: ""
			},
			{
				x: 12,
				y: 225,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Scatter Plot",
		width: 425,
		xAxis: {
			max: 300,
			min: 0,
			label: "Coffee (mL)",
			gridLines: true,
			tickInterval: 50
		},
		yAxis: {
			max: 22,
			min: 0,
			label: "Duration (min)",
			gridLines: true,
			tickInterval: 2
		},
		height: 425,
		points: [
			{
				x: 100,
				y: 18,
				label: ""
			},
			{
				x: 200,
				y: 14,
				label: ""
			},
			{
				x: 150,
				y: 15,
				label: ""
			},
			{
				x: 125,
				y: 2,
				label: ""
			},
			{
				x: 225,
				y: 12,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 10,
			min: 0,
			label: "Gold",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 14,
			min: 0,
			label: "Silver",
			gridLines: true,
			tickInterval: 1
		},
		height: 450,
		points: [
			{
				x: 2,
				y: 4,
				label: ""
			},
			{
				x: 3,
				y: 1,
				label: ""
			},
			{
				x: 4,
				y: 1,
				label: ""
			},
			{
				x: 4,
				y: 4,
				label: ""
			},
			{
				x: 8,
				y: 4,
				label: ""
			},
			{
				x: 9,
				y: 13,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 10,
			min: 0,
			label: "Silver",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 14,
			min: 0,
			label: "Gold",
			gridLines: true,
			tickInterval: 1
		},
		height: 450,
		points: [
			{
				x: 2,
				y: 4,
				label: ""
			},
			{
				x: 3,
				y: 1,
				label: ""
			},
			{
				x: 4,
				y: 1,
				label: ""
			},
			{
				x: 4,
				y: 4,
				label: ""
			},
			{
				x: 8,
				y: 4,
				label: ""
			},
			{
				x: 9,
				y: 13,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 10,
			min: 0,
			label: "Gold",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 14,
			min: 0,
			label: "Silver",
			gridLines: true,
			tickInterval: 1
		},
		height: 450,
		points: [
			{
				x: 2,
				y: 1,
				label: ""
			},
			{
				x: 3,
				y: 4,
				label: ""
			},
			{
				x: 4,
				y: 1,
				label: ""
			},
			{
				x: 4,
				y: 4,
				label: ""
			},
			{
				x: 8,
				y: 4,
				label: ""
			},
			{
				x: 9,
				y: 13,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Gold vs. Silver medals",
		width: 500,
		xAxis: {
			max: 10,
			min: 0,
			label: "Gold",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 14,
			min: 0,
			label: "Silver",
			gridLines: true,
			tickInterval: 1
		},
		height: 450,
		points: []
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Mean heights by age",
		width: 500,
		xAxis: {
			max: 13,
			min: 0,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 2,
			min: 0,
			label: "Height (meters)",
			gridLines: true,
			tickInterval: 0.5
		},
		height: 400,
		points: [
			{
				x: 5,
				y: 1.1,
				label: ""
			},
			{
				x: 6,
				y: 1.2,
				label: ""
			},
			{
				x: 8,
				y: 1.3,
				label: ""
			},
			{
				x: 10,
				y: 1.4,
				label: ""
			},
			{
				x: 12,
				y: 1.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Mean heights by age",
		width: 500,
		xAxis: {
			max: 2,
			min: 0,
			label: "Height (meters)",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 13,
			min: 0,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 1.1,
				y: 5,
				label: ""
			},
			{
				x: 1.2,
				y: 6,
				label: ""
			},
			{
				x: 1.3,
				y: 8,
				label: ""
			},
			{
				x: 1.4,
				y: 10,
				label: ""
			},
			{
				x: 1.5,
				y: 12,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Mean heights by age",
		width: 500,
		xAxis: {
			max: 13,
			min: 0,
			label: "Age (years)",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 2,
			min: 0,
			label: "Height (meters)",
			gridLines: true,
			tickInterval: 0.5
		},
		height: 400,
		points: [
			{
				x: 5,
				y: 1,
				label: ""
			},
			{
				x: 6,
				y: 1.1,
				label: ""
			},
			{
				x: 8,
				y: 1.2,
				label: ""
			},
			{
				x: 10,
				y: 1.3,
				label: ""
			},
			{
				x: 12,
				y: 1.4,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Study time (hours) vs. Score",
		width: 500,
		xAxis: {
			max: 4,
			min: 0,
			label: "Hours",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 2
		},
		height: 400,
		points: [
			{
				x: 1.75,
				y: 17,
				label: ""
			},
			{
				x: 1.5,
				y: 15,
				label: ""
			},
			{
				x: 0.5,
				y: 7,
				label: ""
			},
			{
				x: 3,
				y: 19,
				label: ""
			},
			{
				x: 3.25,
				y: 20,
				label: ""
			},
			{
				x: 2,
				y: 16,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Study time (hours) vs. Score",
		width: 500,
		xAxis: {
			max: 4,
			min: 0,
			label: "Hours",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 2
		},
		height: 400,
		points: [
			{
				x: 1.75,
				y: 7,
				label: ""
			},
			{
				x: 1.5,
				y: 19,
				label: ""
			},
			{
				x: 0.5,
				y: 15,
				label: ""
			},
			{
				x: 3,
				y: 20,
				label: ""
			},
			{
				x: 3.25,
				y: 16,
				label: ""
			},
			{
				x: 2,
				y: 17,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Study time (hours) vs. Score",
		width: 500,
		xAxis: {
			max: 4,
			min: 0,
			label: "Hours",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Score",
			gridLines: true,
			tickInterval: 2
		},
		height: 400,
		points: [
			{
				x: 1.5,
				y: 17,
				label: ""
			},
			{
				x: 1.5,
				y: 15,
				label: ""
			},
			{
				x: 0.5,
				y: 7,
				label: ""
			},
			{
				x: 3,
				y: 19,
				label: ""
			},
			{
				x: 3,
				y: 20,
				label: ""
			},
			{
				x: 2,
				y: 16,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Period",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Avg score",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 60,
				label: ""
			},
			{
				x: 2,
				y: 55,
				label: ""
			},
			{
				x: 3,
				y: 60,
				label: ""
			},
			{
				x: 4,
				y: 80,
				label: ""
			},
			{
				x: 6,
				y: 90,
				label: ""
			},
			{
				x: 7,
				y: 95,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 100,
			min: 0,
			label: "Avg score",
			gridLines: true,
			tickInterval: 10
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "Period",
			gridLines: true,
			tickInterval: 1
		},
		height: 400,
		points: [
			{
				x: 60,
				y: 1,
				label: ""
			},
			{
				x: 90,
				y: 6,
				label: ""
			},
			{
				x: 55,
				y: 2,
				label: ""
			},
			{
				x: 80,
				y: 4,
				label: ""
			},
			{
				x: 95,
				y: 7,
				label: ""
			},
			{
				x: 60,
				y: 3,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 8,
			min: 0,
			label: "Period",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 100,
			min: 0,
			label: "Avg score",
			gridLines: true,
			tickInterval: 10
		},
		height: 400,
		points: [
			{
				x: 1,
				y: 60,
				label: ""
			},
			{
				x: 2,
				y: 65,
				label: ""
			},
			{
				x: 3,
				y: 50,
				label: ""
			},
			{
				x: 4,
				y: 80,
				label: ""
			},
			{
				x: 6,
				y: 90,
				label: ""
			},
			{
				x: 7,
				y: 95,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 425,
		xAxis: {
			max: 32,
			min: 0,
			label: "Right",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 32,
			min: 0,
			label: "Left",
			gridLines: true,
			tickInterval: 2
		},
		height: 425,
		points: [
			{
				x: 29,
				y: 6,
				label: ""
			},
			{
				x: 12,
				y: 26,
				label: ""
			},
			{
				x: 24,
				y: 1,
				label: ""
			},
			{
				x: 18,
				y: 7,
				label: ""
			},
			{
				x: 1,
				y: 16,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 425,
		xAxis: {
			max: 32,
			min: 0,
			label: "Right",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 32,
			min: 0,
			label: "Left",
			gridLines: true,
			tickInterval: 2
		},
		height: 425,
		points: [
			{
				x: 6,
				y: 29,
				label: ""
			},
			{
				x: 26,
				y: 12,
				label: ""
			},
			{
				x: 1,
				y: 24,
				label: ""
			},
			{
				x: 7,
				y: 18,
				label: ""
			},
			{
				x: 16,
				y: 1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 425,
		xAxis: {
			max: 32,
			min: 0,
			label: "Right",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 32,
			min: 0,
			label: "Left",
			gridLines: true,
			tickInterval: 2
		},
		height: 425,
		points: [
			{
				x: 29,
				y: 29,
				label: ""
			},
			{
				x: 12,
				y: 12,
				label: ""
			},
			{
				x: 24,
				y: 24,
				label: ""
			},
			{
				x: 18,
				y: 18,
				label: ""
			},
			{
				x: 1,
				y: 1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 425,
		xAxis: {
			max: 40,
			min: 0,
			label: "Height",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "Petal length",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 32.5,
				y: 6.5,
				label: ""
			},
			{
				x: 15,
				y: 4.5,
				label: ""
			},
			{
				x: 7.5,
				y: 7,
				label: ""
			},
			{
				x: 27.5,
				y: 9,
				label: ""
			},
			{
				x: 15,
				y: 5.5,
				label: ""
			},
			{
				x: 32.5,
				y: 3,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 425,
		xAxis: {
			max: 40,
			min: 0,
			label: "Height",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "Petal length",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 32.5,
				y: 6,
				label: ""
			},
			{
				x: 15,
				y: 4.5,
				label: ""
			},
			{
				x: 7.5,
				y: 7,
				label: ""
			},
			{
				x: 27.5,
				y: 9,
				label: ""
			},
			{
				x: 15,
				y: 5.5,
				label: ""
			},
			{
				x: 32.5,
				y: 2.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 425,
		xAxis: {
			max: 40,
			min: 0,
			label: "Height",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "Petal length",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 32.5,
				y: 4.5,
				label: ""
			},
			{
				x: 15,
				y: 7,
				label: ""
			},
			{
				x: 7.5,
				y: 9,
				label: ""
			},
			{
				x: 27.5,
				y: 5.5,
				label: ""
			},
			{
				x: 15,
				y: 3,
				label: ""
			},
			{
				x: 32.5,
				y: 6.5,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Gold vs. Silver",
		width: 500,
		xAxis: {
			max: 20,
			min: 0,
			label: "Gold",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Silver",
			gridLines: true,
			tickInterval: 2
		},
		height: 350,
		points: [
			{
				x: 16,
				y: 9,
				label: ""
			},
			{
				x: 5,
				y: 2,
				label: ""
			},
			{
				x: 4,
				y: 2,
				label: ""
			},
			{
				x: 2,
				y: 1,
				label: ""
			},
			{
				x: 1,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Gold vs. Silver",
		width: 500,
		xAxis: {
			max: 20,
			min: 0,
			label: "Gold",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Silver",
			gridLines: true,
			tickInterval: 2
		},
		height: 350,
		points: [
			{
				x: 9,
				y: 16,
				label: ""
			},
			{
				x: 2,
				y: 5,
				label: ""
			},
			{
				x: 2,
				y: 4,
				label: ""
			},
			{
				x: 1,
				y: 2,
				label: ""
			},
			{
				x: 6,
				y: 1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Gold vs. Silver",
		width: 500,
		xAxis: {
			max: 20,
			min: 0,
			label: "Gold",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 20,
			min: 0,
			label: "Silver",
			gridLines: true,
			tickInterval: 2
		},
		height: 350,
		points: [
			{
				x: 16,
				y: 9,
				label: ""
			},
			{
				x: 5,
				y: 2,
				label: ""
			},
			{
				x: 4,
				y: 2,
				label: ""
			},
			{
				x: 2,
				y: 1,
				label: ""
			},
			{
				x: 6,
				y: 1,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 40,
			min: 0,
			label: "Feet",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 13,
			min: 0,
			label: "Head",
			gridLines: true,
			tickInterval: 1
		},
		height: 450,
		points: [
			{
				x: 35,
				y: 12,
				label: ""
			},
			{
				x: 20,
				y: 2,
				label: ""
			},
			{
				x: 25,
				y: 2,
				label: ""
			},
			{
				x: 25,
				y: 1,
				label: ""
			},
			{
				x: 15,
				y: 4,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 13,
			min: 0,
			label: "Head",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 40,
			min: 0,
			label: "Feet",
			gridLines: true,
			tickInterval: 5
		},
		height: 450,
		points: [
			{
				x: 12,
				y: 35,
				label: ""
			},
			{
				x: 2,
				y: 20,
				label: ""
			},
			{
				x: 2,
				y: 25,
				label: ""
			},
			{
				x: 1,
				y: 25,
				label: ""
			},
			{
				x: 4,
				y: 15,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 500,
		xAxis: {
			max: 40,
			min: 0,
			label: "Feet",
			gridLines: true,
			tickInterval: 5
		},
		yAxis: {
			max: 13,
			min: 0,
			label: "Head",
			gridLines: true,
			tickInterval: 1
		},
		height: 450,
		points: [
			{
				x: 35,
				y: 12,
				label: ""
			},
			{
				x: 20,
				y: 2,
				label: ""
			},
			{
				x: 25,
				y: 2,
				label: ""
			},
			{
				x: 25,
				y: 1,
				label: ""
			},
			{
				x: 15,
				y: 2,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 425,
		xAxis: {
			max: 11,
			min: 0,
			label: "Age",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 15,
			min: 0,
			label: "Sleep",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 13,
				label: ""
			},
			{
				x: 2,
				y: 11,
				label: ""
			},
			{
				x: 3,
				y: 10,
				label: ""
			},
			{
				x: 5,
				y: 9,
				label: ""
			},
			{
				x: 8,
				y: 8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 425,
		xAxis: {
			max: 15,
			min: 0,
			label: "Sleep",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 11,
			min: 0,
			label: "Age",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 13,
				y: 1,
				label: ""
			},
			{
				x: 11,
				y: 2,
				label: ""
			},
			{
				x: 10,
				y: 3,
				label: ""
			},
			{
				x: 9,
				y: 5,
				label: ""
			},
			{
				x: 8,
				y: 8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "",
		width: 425,
		xAxis: {
			max: 11,
			min: 0,
			label: "Age",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 15,
			min: 0,
			label: "Sleep",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 13,
				label: ""
			},
			{
				x: 2,
				y: 11,
				label: ""
			},
			{
				x: 3,
				y: 9,
				label: ""
			},
			{
				x: 5,
				y: 10,
				label: ""
			},
			{
				x: 8,
				y: 8,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Age vs. Weight",
		width: 425,
		xAxis: {
			max: 7,
			min: 0,
			label: "Age",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "Weight",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 4.25,
				label: ""
			},
			{
				x: 2,
				y: 5,
				label: ""
			},
			{
				x: 3,
				y: 5.75,
				label: ""
			},
			{
				x: 4,
				y: 6.25,
				label: ""
			},
			{
				x: 5,
				y: 6.75,
				label: ""
			},
			{
				x: 6,
				y: 7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Weight vs. Age",
		width: 425,
		xAxis: {
			max: 8,
			min: 4,
			label: "Weight",
			gridLines: true,
			tickInterval: 0.5
		},
		yAxis: {
			max: 7,
			min: 0,
			label: "Age",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 4.25,
				y: 1,
				label: ""
			},
			{
				x: 5,
				y: 2,
				label: ""
			},
			{
				x: 5.75,
				y: 3,
				label: ""
			},
			{
				x: 6.25,
				y: 4,
				label: ""
			},
			{
				x: 6.75,
				y: 5,
				label: ""
			},
			{
				x: 7,
				y: 6,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Age vs. Weight",
		width: 425,
		xAxis: {
			max: 7,
			min: 0,
			label: "Age",
			gridLines: true,
			tickInterval: 1
		},
		yAxis: {
			max: 8,
			min: 0,
			label: "Weight",
			gridLines: true,
			tickInterval: 1
		},
		height: 425,
		points: [
			{
				x: 1,
				y: 4.5,
				label: ""
			},
			{
				x: 2,
				y: 5,
				label: ""
			},
			{
				x: 3,
				y: 5.5,
				label: ""
			},
			{
				x: 4,
				y: 6,
				label: ""
			},
			{
				x: 5,
				y: 6.5,
				label: ""
			},
			{
				x: 6,
				y: 7,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Predicted (x) vs. Actual (y)",
		width: 500,
		xAxis: {
			max: 30,
			min: 0,
			label: "Predicted",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "Actual",
			gridLines: true,
			tickInterval: 2
		},
		height: 400,
		points: [
			{
				x: 11,
				y: 14,
				label: ""
			},
			{
				x: 13,
				y: 15,
				label: ""
			},
			{
				x: 12,
				y: 12,
				label: ""
			},
			{
				x: 17,
				y: 16,
				label: ""
			},
			{
				x: 15,
				y: 14,
				label: ""
			},
			{
				x: 17,
				y: 27,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Predicted (x) vs. Actual (y)",
		width: 500,
		xAxis: {
			max: 30,
			min: 0,
			label: "Predicted",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "Actual",
			gridLines: true,
			tickInterval: 2
		},
		height: 400,
		points: [
			{
				x: 14,
				y: 11,
				label: ""
			},
			{
				x: 15,
				y: 13,
				label: ""
			},
			{
				x: 12,
				y: 12,
				label: ""
			},
			{
				x: 16,
				y: 17,
				label: ""
			},
			{
				x: 14,
				y: 15,
				label: ""
			},
			{
				x: 27,
				y: 17,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title: "Predicted (x) vs. Actual (y)",
		width: 500,
		xAxis: {
			max: 30,
			min: 0,
			label: "Predicted",
			gridLines: true,
			tickInterval: 2
		},
		yAxis: {
			max: 30,
			min: 0,
			label: "Actual",
			gridLines: true,
			tickInterval: 2
		},
		height: 400,
		points: [
			{
				x: 11,
				y: 14,
				label: ""
			},
			{
				x: 13,
				y: 15,
				label: ""
			},
			{
				x: 12,
				y: 12,
				label: ""
			},
			{
				x: 17,
				y: 16,
				label: ""
			},
			{
				x: 15,
				y: 14,
				label: ""
			},
			{
				x: 27,
				y: 17,
				label: ""
			}
		]
	},
	{
		type: "scatterPlot",
		lines: [],
		title:
			"Population density vs. CO2 emissions per person (36 Japanese cities)",
		width: 375,
		xAxis: {
			max: 3500,
			min: 0,
			label: "People, per square kilometer",
			gridLines: true,
			tickInterval: 500
		},
		yAxis: {
			max: 25,
			min: 0,
			label: "CO2 emissions per person, in metric tons",
			gridLines: true,
			tickInterval: 1
		},
		height: 375,
		points: [
			{
				x: 400,
				y: 6.5,
				label: ""
			},
			{
				x: 550,
				y: 5.8,
				label: ""
			},
			{
				x: 600,
				y: 7.2,
				label: ""
			},
			{
				x: 700,
				y: 6.9,
				label: ""
			},
			{
				x: 800,
				y: 8.1,
				label: ""
			},
			{
				x: 900,
				y: 7.4,
				label: ""
			},
			{
				x: 1000,
				y: 9,
				label: ""
			},
			{
				x: 750,
				y: 5.5,
				label: ""
			},
			{
				x: 650,
				y: 7.9,
				label: ""
			},
			{
				x: 850,
				y: 6.3,
				label: ""
			},
			{
				x: 1200,
				y: 10.5,
				label: ""
			},
			{
				x: 1400,
				y: 9.8,
				label: ""
			},
			{
				x: 1600,
				y: 11.2,
				label: ""
			},
			{
				x: 1800,
				y: 10,
				label: ""
			},
			{
				x: 2000,
				y: 12.5,
				label: ""
			},
			{
				x: 2500,
				y: 15,
				label: ""
			},
			{
				x: 3000,
				y: 18.2,
				label: ""
			},
			{
				x: 3200,
				y: 20.4,
				label: ""
			},
			{
				x: 3400,
				y: 17.1,
				label: ""
			},
			{
				x: 1500,
				y: 21,
				label: ""
			},
			{
				x: 2200,
				y: 4,
				label: ""
			},
			{
				x: 2800,
				y: 7,
				label: ""
			},
			{
				x: 500,
				y: 14,
				label: ""
			},
			{
				x: 3100,
				y: 6,
				label: ""
			}
		]
	}
]
