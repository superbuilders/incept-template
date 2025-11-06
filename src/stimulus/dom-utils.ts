export const NODE_TYPE = {
	ELEMENT: 1,
	TEXT: 3,
	CDATA_SECTION: 4,
	COMMENT: 8
} as const

export function isElementNode(node: Node | null): node is Element {
	return !!node && node.nodeType === NODE_TYPE.ELEMENT
}

export function isTextNode(node: Node | null): node is Text {
	return !!node && node.nodeType === NODE_TYPE.TEXT
}

export function isCommentNode(node: Node | null): node is Comment {
	return !!node && node.nodeType === NODE_TYPE.COMMENT
}
