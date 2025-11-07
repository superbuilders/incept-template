import type { BlockContent, InlineContent } from "@/core/content/types"

export type AnyInteraction<E extends readonly string[]> =
	| {
			type: "choiceInteraction"
			responseIdentifier: string
			prompt: InlineContent<E>
			choices: Array<{ identifier: string; content: BlockContent<E> }>
			shuffle: true
			minChoices: number
			maxChoices: number
	  }
	| {
			type: "inlineChoiceInteraction"
			responseIdentifier: string
			choices: Array<{ identifier: string; content: InlineContent<E> }>
			shuffle: true
	  }
	| {
			type: "textEntryInteraction"
			responseIdentifier: string
			expectedLength: number | null
	  }
	| {
			type: "orderInteraction"
			responseIdentifier: string
			prompt: InlineContent<E>
			choices: Array<{ identifier: string; content: BlockContent<E> }>
			shuffle: true
			orientation: "vertical"
	  }
	| {
			type: "gapMatchInteraction"
			responseIdentifier: string
			shuffle: boolean
			content: BlockContent<E>
			gapTexts: Array<{
				identifier: string
				matchMax: number
				content: InlineContent<E>
			}>
			gaps: Array<{ identifier: string; required: boolean | null }>
	  }
	| {
			type: "unsupportedInteraction"
			perseusType: string
			responseIdentifier: string
	  }
