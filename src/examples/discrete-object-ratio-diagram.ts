import type { DiscreteObjectRatioDiagramProps } from "@/widgets/generators/discrete-object-ratio-diagram"

export const discreteObjectRatioDiagramExamples: DiscreteObjectRatioDiagramProps[] =
	[
		// Apples over bananas – exact image: 4 apples on first row, 5 bananas on second row
		{
			type: "discreteObjectRatioDiagram",
			width: 480,
			height: 300,
			title: null,
			objects: [
				{ count: 4, emoji: "🍎" },
				{ count: 5, emoji: "🍌" }
			]
		},
		// Additional example
		{
			type: "discreteObjectRatioDiagram",
			width: 480,
			height: 300,
			title: "Apples vs Bananas",
			objects: [
				{ count: 4, emoji: "🍎" },
				{ count: 5, emoji: "🍌" }
			]
		},
		// Grid-like counts, still row grouped
		{
			type: "discreteObjectRatioDiagram",
			width: 420,
			height: 300,
			title: null,
			objects: [
				{ count: 3, emoji: "🍇" },
				{ count: 6, emoji: "🍓" }
			]
		}
	]
