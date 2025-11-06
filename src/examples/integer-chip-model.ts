import type { IntegerChipModelProps } from "@/widgets/generators/integer-chip-model"

export const integerChipModelExamples: IntegerChipModelProps[] = [
	// Basic positive chips
	{
		type: "integerChipModel",
		width: 300,
		height: 300,
		chips: [
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false }
		]
	},
	// Mixed layout with legend
	{
		type: "integerChipModel",
		width: 320,
		height: 300,
		chips: [
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false }
		]
	},
	// Crossed-out chips demonstrating zero pairs
	{
		type: "integerChipModel",
		width: 300,
		height: 300,
		chips: [
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "minus", crossedOut: true },
			{ sign: "plus", crossedOut: true },
			{ sign: "minus", crossedOut: false }
		]
	},
	// All negative chips
	{
		type: "integerChipModel",
		width: 300,
		height: 300,
		chips: [
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false }
		]
	},
	// Complex mixed layout with crossed-out pairs and legend
	{
		type: "integerChipModel",
		width: 360,
		height: 300,
		chips: [
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "minus", crossedOut: true },
			{ sign: "plus", crossedOut: true },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: true },
			{ sign: "plus", crossedOut: true },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false }
		]
	},
	// Additional test cases extracted from database
	// Empty chips with legend
	{
		type: "integerChipModel",
		width: 300,
		height: 300,
		chips: []
	},
	// Single positive chip with legend
	{
		type: "integerChipModel",
		width: 300,
		height: 300,
		chips: [
			{ sign: "plus", crossedOut: false },
			{ sign: "minus", crossedOut: false }
		]
	},
	// Large collection with mixed signs
	{
		type: "integerChipModel",
		width: 320,
		height: 300,
		chips: [
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false }
		]
	},
	// Wide layout with many chips
	{
		type: "integerChipModel",
		width: 300,
		height: 300,
		chips: [
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false }
		]
	},
	// Crossed out chips demonstration
	{
		type: "integerChipModel",
		width: 320,
		height: 300,
		chips: [
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "minus", crossedOut: true }
		]
	},
	// Subtraction with crossed out chips
	{
		type: "integerChipModel",
		width: 320,
		height: 300,
		chips: [
			{ sign: "plus", crossedOut: true },
			{ sign: "plus", crossedOut: true },
			{ sign: "plus", crossedOut: true },
			{ sign: "plus", crossedOut: true },
			{ sign: "plus", crossedOut: true },
			{ sign: "minus", crossedOut: false }
		]
	},
	// Mixed crossed out pattern
	{
		type: "integerChipModel",
		width: 320,
		height: 300,
		chips: [
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false }
		]
	},
	// Complex subtraction pattern
	{
		type: "integerChipModel",
		width: 320,
		height: 300,
		chips: [
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "plus", crossedOut: true },
			{ sign: "plus", crossedOut: true }
		]
	},
	// All crossed out negative chips
	{
		type: "integerChipModel",
		width: 320,
		height: 300,
		chips: [
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false }
		]
	},
	// Evaluation pattern with legend
	{
		type: "integerChipModel",
		width: 320,
		height: 300,
		chips: [
			{ sign: "plus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false }
		]
	},
	// Large positive collection
	{
		type: "integerChipModel",
		width: 320,
		height: 300,
		chips: [
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "minus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false }
		]
	},
	// Complex subtraction with multiple crossed out
	{
		type: "integerChipModel",
		width: 320,
		height: 300,
		chips: [
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "plus", crossedOut: false },
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true },
			{ sign: "minus", crossedOut: true }
		]
	}
]
