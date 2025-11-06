declare const question: string

type TextContent = { type: "text"; content: string }

type ChoiceInteractionPrompt = TextContent[]

const _choicePrompt: ChoiceInteractionPrompt = [
	{ type: "text", content: question },
	{ type: "text", content: "Select one answer." }
]

// The rendering engine concatenates prompt segments without automatic spacing.
// Because the second segment lacks a leading space, the learner sees
// "wording.Select one answer." in the player.
