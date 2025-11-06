export const BLOCK_ELEMENTS = new Set([
	"article",
	"section",
	"nav",
	"aside",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"header",
	"footer",
	"address",
	"p",
	"hr",
	"pre",
	"blockquote",
	"ol",
	"ul",
	"li",
	"dl",
	"dt",
	"dd",
	"figure",
	"figcaption",
	"div",
	"table",
	"thead",
	"tbody",
	"tfoot",
	"tr",
	"td",
	"th",
	"form",
	"fieldset",
	"legend"
])

export const INLINE_ELEMENTS = new Set([
	"a",
	"span",
	"b",
	"strong",
	"i",
	"em",
	"u",
	"small",
	"sup",
	"sub",
	"mark",
	"cite",
	"code",
	"q",
	"samp",
	"kbd",
	"var",
	"abbr",
	"dfn",
	"time",
	"data",
	"br",
	"wbr",
	"img",
	"iframe"
])

export const VOID_ELEMENTS = new Set([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"source",
	"track",
	"wbr"
])

export const DEFAULT_REMOVAL_SELECTORS = [
	"nav",
	"form",
	".jumpnav",
	".jumpmenu",
	".activity_footer",
	".activity-footer",
	".activity-navigation",
	".activity-navigation-footer",
	".sr-only"
]

export const ALLOWED_GLOBAL_ATTRIBUTES = new Set([
	"id",
	"title",
	"lang",
	"xml:lang"
])

export const TAG_ATTRIBUTE_WHITELIST: Record<string, ReadonlySet<string>> = {
	a: new Set(["href", "title", "target", "rel"]),
	iframe: new Set([
		"src",
		"width",
		"height",
		"allow",
		"allowfullscreen",
		"title"
	]),
	img: new Set(["src", "alt", "title", "width", "height"]),
	ol: new Set(["start", "type"]),
	ul: new Set(["type"]),
	li: new Set(["value"]),
	table: new Set(["summary"]),
	td: new Set(["colspan", "rowspan", "headers"]),
	th: new Set(["colspan", "rowspan", "scope", "headers"])
}
