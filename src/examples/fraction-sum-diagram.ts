import type { FractionSumDiagramProps } from "@/widgets/generators/fraction-sum-diagram"

export const fractionSumDiagramExamples: FractionSumDiagramProps[] = [
	{
		type: "fractionSumDiagram",
		width: 500,
		height: 300,
		denominator: 10,
		groups: [
			{ numerator: 4, color: "#FADBD8" },
			{ numerator: 2, color: "#FDEBD0" },
			{ numerator: 1, color: "#D6EAF8" }
		]
	},
	{
		type: "fractionSumDiagram",
		width: 500,
		height: 300,
		denominator: 8,
		groups: [
			{ numerator: 1, color: "#FADBD8" },
			{ numerator: 2, color: "#FDEBD0" },
			{ numerator: 4, color: "#D6EAF8" }
		]
	}
]
