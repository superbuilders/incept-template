export type InlineContentItem<E extends readonly string[]> =
	| { type: "text"; content: string }
	| { type: "math"; mathml: string }
	| { type: "inlineWidgetRef"; widgetId: string; widgetType: E[number] }
	| { type: "inlineInteractionRef"; interactionId: string }
	| {
			type: "gap"
			gapId: string
	  }

export type InlineContent<E extends readonly string[]> = ReadonlyArray<
	InlineContentItem<E>
>

export type BlockQuoteBlockItem<E extends readonly string[]> = {
	type: "blockquote"
	content: InlineContent<E>
}

export type TableRichCell<E extends readonly string[]> = InlineContent<E> | null

export type TableRichRow<E extends readonly string[]> = ReadonlyArray<
	TableRichCell<E>
>

export type TableRichRows<E extends readonly string[]> = ReadonlyArray<
	TableRichRow<E>
>

export type BlockContentItem<E extends readonly string[]> =
	| { type: "paragraph"; content: InlineContent<E> }
	| { type: "unorderedList"; items: ReadonlyArray<InlineContent<E>> }
	| { type: "orderedList"; items: ReadonlyArray<InlineContent<E>> }
	| {
			type: "tableRich"
			header: TableRichRows<E> | null
			rows: TableRichRows<E>
	  }
	| BlockQuoteBlockItem<E>
	| { type: "widgetRef"; widgetId: string; widgetType: E[number] }
	| { type: "interactionRef"; interactionId: string }

export type BlockContent<E extends readonly string[]> = ReadonlyArray<
	BlockContentItem<E>
>
