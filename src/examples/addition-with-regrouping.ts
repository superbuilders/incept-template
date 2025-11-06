import type { AdditionWithRegroupingProps } from "@/widgets/generators/addition-with-regrouping"

export const additionWithRegroupingExamples: AdditionWithRegroupingProps[] = [
	{
		type: "additionWithRegrouping",
		addend1: 247,
		addend2: 186,
		showCarrying: true,
		showAnswer: true,
		revealUpTo: "complete"
	},
	{
		type: "additionWithRegrouping",
		addend1: 58,
		addend2: 37,
		showCarrying: false,
		showAnswer: false,
		revealUpTo: "complete"
	},
	{
		type: "additionWithRegrouping",
		addend1: 1234,
		addend2: 5678,
		showCarrying: true,
		showAnswer: true,
		revealUpTo: "tens"
	},
	{
		type: "additionWithRegrouping",
		addend1: 89,
		addend2: 46,
		showCarrying: true,
		showAnswer: false,
		revealUpTo: "complete"
	}
]
