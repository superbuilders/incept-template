import type { StemLeafPlotProps } from "@/widgets/generators/stem-leaf-plot"

export const stemLeafPlotExamples: StemLeafPlotProps[] = [
	{
		type: "stemLeafPlot",
		title: "Skateboarding Scores",
		data: [
			{ stem: 6, leaves: [2, 7] },
			{ stem: 7, leaves: [0, 1, 8] },
			{ stem: 8, leaves: [5, 5] },
			{ stem: 9, leaves: [0, 2, 2, 6] }
		],
		keyExample: {
			stem: 7,
			leaf: 1,
			value: 7.1
		},
		stemLabel: "Stem",
		leafLabel: "Leaf"
	},
	{
		type: "stemLeafPlot",
		title: "Test Scores",
		data: [
			{ stem: 6, leaves: [5, 8] },
			{ stem: 7, leaves: [2, 3, 5, 7, 9] },
			{ stem: 8, leaves: [0, 1, 4, 6, 8, 9] },
			{ stem: 9, leaves: [2, 5, 8] }
		],
		keyExample: {
			stem: 8,
			leaf: 4,
			value: 84
		},
		stemLabel: "Stem",
		leafLabel: "Leaf"
	},
	{
		type: "stemLeafPlot",
		title: "Data Distribution",
		data: [
			{ stem: 1, leaves: [2, 5, 7] },
			{ stem: 2, leaves: [0, 3, 8] },
			{ stem: 3, leaves: [1, 4] }
		],
		keyExample: {
			stem: 2,
			leaf: 3,
			value: 23
		},
		stemLabel: "Tens",
		leafLabel: "Ones"
	}
]
