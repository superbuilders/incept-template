import type { FractionModelDiagramProps } from "@/widgets/generators/fractional-model-diagram"

export const fractionModelDiagramExamples: FractionModelDiagramProps[] = [
	{
		type: "fractionModelDiagram",
		width: 400,
		height: 300,
		shapeType: "circle",
		shapes: [
			{
				numerator: 3,
				denominator: 4
			},
			{
				numerator: 1,
				denominator: 4
			}
		],
		operators: ["="]
	},
	{
		type: "fractionModelDiagram",
		width: 500,
		height: 300,
		shapeType: "box",
		shapes: [
			{
				numerator: 2,
				denominator: 3
			},
			{
				numerator: 4,
				denominator: 6
			}
		],
		operators: ["="]
	},
	{
		type: "fractionModelDiagram",
		width: 500,
		height: 300,
		shapeType: "polygon",
		shapes: [
			{
				numerator: 1,
				denominator: 3
			},
			{
				numerator: 1,
				denominator: 4
			},
			{
				numerator: 3,
				denominator: 4
			}
		],
		operators: ["+", "="]
	}
]
