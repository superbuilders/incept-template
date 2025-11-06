import type { HistogramProps } from "@/widgets/registry"

// Examples extracted from question x9b2dc70eb097982d: Select the correct histogram for email counts
export const histogramExamples: HistogramProps[] = [
	{
		bins: [
			{ frequency: 1 },
			{ frequency: 2 },
			{ frequency: 2 },
			{ frequency: 2 }
		],
		type: "histogram",
		title: "Histogram",
		width: 500,
		xAxis: { label: "Number of emails sent" },
		yAxis: { max: 5, label: "Number of days", tickInterval: 1 },
		height: 400,
		separators: [0, 30, 60, 90, 120]
	},
	{
		bins: [
			{ frequency: 1 },
			{ frequency: 1 },
			{ frequency: 3 },
			{ frequency: 2 }
		],
		type: "histogram",
		title: "Histogram",
		width: 500,
		xAxis: { label: "Number of emails sent" },
		yAxis: { max: 5, label: "Number of days", tickInterval: 1 },
		height: 400,
		separators: [0, 30, 60, 90, 120]
	},
	{
		bins: [
			{ frequency: 0 },
			{ frequency: 3 },
			{ frequency: 2 },
			{ frequency: 2 }
		],
		type: "histogram",
		title: "Histogram",
		width: 500,
		xAxis: { label: "Number of emails sent" },
		yAxis: { max: 5, label: "Number of days", tickInterval: 1 },
		height: 400,
		separators: [0, 30, 60, 90, 120]
	},
	// Examples extracted from question x1a8cfa4b0621544f: Select the histogram for Nate's red candy data
	{
		bins: [
			{ frequency: 1 },
			{ frequency: 2 },
			{ frequency: 2 },
			{ frequency: 2 }
		],
		type: "histogram",
		title: "Red Candy Pieces per Bag",
		width: 500,
		xAxis: { label: "Number of red candy pieces" },
		yAxis: { max: 5, label: "Number of bags", tickInterval: 1 },
		height: 400,
		separators: [0, 3, 6, 9, 12]
	},
	{
		bins: [
			{ frequency: 1 },
			{ frequency: 1 },
			{ frequency: 2 },
			{ frequency: 3 }
		],
		type: "histogram",
		title: "Red Candy Pieces per Bag",
		width: 500,
		xAxis: { label: "Number of red candy pieces" },
		yAxis: { max: 5, label: "Number of bags", tickInterval: 1 },
		height: 400,
		separators: [0, 3, 6, 9, 12]
	},
	{
		bins: [
			{ frequency: 2 },
			{ frequency: 1 },
			{ frequency: 1 },
			{ frequency: 3 }
		],
		type: "histogram",
		title: "Red Candy Pieces per Bag",
		width: 500,
		xAxis: { label: "Number of red candy pieces" },
		yAxis: { max: 5, label: "Number of bags", tickInterval: 1 },
		height: 400,
		separators: [0, 3, 6, 9, 12]
	}
]
