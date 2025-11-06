import type { BoxGridProps } from "@/widgets/generators/box-grid"

export const boxGridExamples: BoxGridProps[] = [
	{
		type: "boxGrid",
		width: 300,
		height: 300,
		data: [
			[
				{
					content: { type: "whole", value: 1, sign: "+" },
					backgroundColor: "#FFE5B4"
				},
				{
					content: {
						type: "fraction",
						numerator: 1,
						denominator: 2,
						sign: "+"
					},
					backgroundColor: null
				},
				{
					content: {
						type: "mixed",
						whole: 1,
						numerator: 1,
						denominator: 4,
						sign: "+"
					},
					backgroundColor: "#B4E5FF"
				},
				{
					content: { type: "whole", value: 4, sign: "+" },
					backgroundColor: null
				}
			],
			[
				{
					content: { type: "whole", value: 5, sign: "+" },
					backgroundColor: null
				},
				{
					content: {
						type: "mixed",
						whole: 2,
						numerator: 3,
						denominator: 5,
						sign: "-"
					},
					backgroundColor: "#FFB4E5"
				},
				{
					content: {
						type: "fraction",
						numerator: 3,
						denominator: 4,
						sign: "+"
					},
					backgroundColor: null
				},
				{
					content: { type: "whole", value: 8, sign: "+" },
					backgroundColor: "#B4FFE5"
				}
			],
			[
				{
					content: { type: "whole", value: 0, sign: "+" },
					backgroundColor: null
				},
				{
					content: {
						type: "mixed",
						whole: 3,
						numerator: 0,
						denominator: 7,
						sign: "+"
					},
					backgroundColor: "#E5B4FF"
				},
				{
					content: {
						type: "fraction",
						numerator: 7,
						denominator: 8,
						sign: "-"
					},
					backgroundColor: null
				},
				{
					content: { type: "whole", value: 12, sign: "+" },
					backgroundColor: "#FFE5B4"
				}
			]
		],
		showGridLines: true
	},
	{
		type: "boxGrid",
		width: 300,
		height: 300,
		data: [
			[
				{
					content: { type: "math", mathml: "<mn>2</mn><mo>+</mo><mn>3</mn>" },
					backgroundColor: "#4285F4"
				},
				{
					content: {
						type: "fraction",
						numerator: 0,
						denominator: 1,
						sign: "+"
					},
					backgroundColor: null
				},
				{
					content: { type: "whole", value: 5, sign: "+" },
					backgroundColor: "#34A853"
				}
			],
			[
				{
					content: { type: "math", mathml: "<mn>4</mn><mo>×</mo><mn>6</mn>" },
					backgroundColor: "#FF6B6B"
				},
				{
					content: {
						type: "fraction",
						numerator: 0,
						denominator: 1,
						sign: "+"
					},
					backgroundColor: null
				},
				{
					content: { type: "whole", value: 24, sign: "+" },
					backgroundColor: "#FFD93D"
				}
			]
		],
		showGridLines: true
	}
]
