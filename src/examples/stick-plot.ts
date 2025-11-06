import type { StickPlotProps } from "@/widgets/generators/stick-plot"

// Valid examples for the Stick Plot widget
export const stickPlotExamples: StickPlotProps[] = [
	{
		type: "stickPlot",
		width: 500,
		height: 400,
		title: "Mass Spectrum of Chlorine",
		xAxis: {
			label: "Atomic mass (u)",
			categories: ["35", "36", "37", "38", "39"],
			showGridLines: true
		},
		yAxis: {
			label: "Relative abundance (%)",
			min: 0,
			max: 100,
			tickInterval: 20,
			showGridLines: true
		},
		sticks: [
			{
				xLabel: "35",
				yValue: 75.8,
				color: "#2563eb"
			},
			{
				xLabel: "37",
				yValue: 24.2,
				color: "#2563eb"
			}
		],
		stickWidthPx: 4,
		references: []
	},
	{
		type: "stickPlot",
		width: 500,
		height: 350,
		title: "Isotopic Distribution of Bromine",
		xAxis: {
			label: "Mass (amu)",
			categories: ["79", "80", "81", "82"],
			showGridLines: false
		},
		yAxis: {
			label: "Intensity",
			min: 0,
			max: 60,
			tickInterval: 10,
			showGridLines: true
		},
		sticks: [
			{
				xLabel: "79",
				yValue: 50.7,
				color: "#dc2626"
			},
			{
				xLabel: "81",
				yValue: 49.3,
				color: "#dc2626"
			}
		],
		stickWidthPx: 6,
		references: [
			{
				xLabel: "80",
				label: "Average",
				color: "#059669"
			}
		]
	},
	{
		type: "stickPlot",
		width: 450,
		height: 300,
		title: "Elemental Analysis Results",
		xAxis: {
			label: "Element",
			categories: ["H", "C", "N", "O", "S"],
			showGridLines: false
		},
		yAxis: {
			label: "Percentage (%)",
			min: 0,
			max: 50,
			tickInterval: 10,
			showGridLines: true
		},
		sticks: [
			{
				xLabel: "H",
				yValue: 8.2,
				color: "#7c3aed"
			},
			{
				xLabel: "C",
				yValue: 42.1,
				color: "#7c3aed"
			},
			{
				xLabel: "N",
				yValue: 15.6,
				color: "#7c3aed"
			},
			{
				xLabel: "O",
				yValue: 32.8,
				color: "#7c3aed"
			},
			{
				xLabel: "S",
				yValue: 1.3,
				color: "#7c3aed"
			}
		],
		stickWidthPx: 8,
		references: []
	}
]
