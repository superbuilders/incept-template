export type InlineContentItem<E extends readonly string[]> =
	| { type: "text"; content: string }
	| { type: "math"; mathml: string }
	| { type: "inlineWidgetRef"; widgetId: string; widgetType: E[number] }
	| { type: "inlineInteractionRef"; interactionId: string }
	| {
			type: "gap"
			gapId: string
	  }

export type InlineContent<E extends readonly string[]> = Array<
	InlineContentItem<E>
>

export type BlockQuoteBlockItem<E extends readonly string[]> = {
	type: "blockquote"
	content: InlineContent<E>
}

export type BlockContentItem<E extends readonly string[]> =
	| { type: "paragraph"; content: InlineContent<E> }
	| { type: "unorderedList"; items: InlineContent<E>[] }
	| { type: "orderedList"; items: InlineContent<E>[] }
	| {
			type: "tableRich"
			header: (InlineContent<E> | null)[][] | null
			rows: (InlineContent<E> | null)[][]
	  }
	| BlockQuoteBlockItem<E>
	| { type: "widgetRef"; widgetId: string; widgetType: E[number] }
	| { type: "interactionRef"; interactionId: string }

export type BlockContent<E extends readonly string[]> = Array<
	BlockContentItem<E>
>
