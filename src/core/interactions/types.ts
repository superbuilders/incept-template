import type { BlockContent, InlineContent } from "@/core/content/types"
import type {
	ChoiceIdentifier,
	ResponseIdentifier
} from "@/core/identifiers/types"

export type Interaction<E extends readonly string[]> =
	| {
			type: "choiceInteraction"
			responseIdentifier: ResponseIdentifier
			prompt: InlineContent<E>
			choices: Array<{ identifier: ChoiceIdentifier; content: BlockContent<E> }>
			shuffle: true
			minChoices: number
			maxChoices: number
	  }
	| {
			type: "inlineChoiceInteraction"
			responseIdentifier: ResponseIdentifier
			choices: Array<{
				identifier: ChoiceIdentifier
				content: InlineContent<E>
			}>
			shuffle: true
	  }
	| {
			type: "textEntryInteraction"
			responseIdentifier: ResponseIdentifier
			expectedLength: number | null
	  }
	| {
			type: "orderInteraction"
			responseIdentifier: ResponseIdentifier
			prompt: InlineContent<E>
			choices: Array<{ identifier: ChoiceIdentifier; content: BlockContent<E> }>
			shuffle: true
			orientation: "vertical"
	  }
	| {
			type: "gapMatchInteraction"
			responseIdentifier: ResponseIdentifier
			shuffle: true
			content: BlockContent<E>
			gapTexts: Array<{
				identifier: ChoiceIdentifier
				matchMax: number
				content: InlineContent<E>
			}>
			gaps: Array<{ identifier: ChoiceIdentifier; required: boolean | null }>
	  }
