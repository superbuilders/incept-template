import type { BarChartProps } from "@/widgets/generators/bar-chart"

export const barChartExamples: BarChartProps[] = [
	{
		type: "barChart",
		width: 480,
		height: 340,
		title: "Games Won Last Summer",
		xAxisLabel: "Team",
		yAxis: {
			label: "Games Won",
			min: 0,
			max: 16,
			tickInterval: 2
		},
		data: [
			{ label: "Lions", value: 14, state: "normal" },
			{ label: "Tigers", value: 2, state: "normal" },
			{ label: "Bears", value: 7, state: "normal" }
		],
		barColor: "#4285F4"
	},
	{
		type: "barChart",
		width: 400,
		height: 300,
		title: "Favorite Ice Cream Flavors",
		xAxisLabel: "Flavor",
		yAxis: {
			label: "Number of Votes",
			min: 0,
			max: 25,
			tickInterval: 5
		},
		data: [
			{ label: "Vanilla", value: 18, state: "normal" },
			{ label: "Chocolate", value: 22, state: "normal" },
			{ label: "Strawberry", value: 12, state: "normal" },
			{ label: "Mint", value: 8, state: "normal" }
		],
		barColor: "#FF6B6B"
	}
]
