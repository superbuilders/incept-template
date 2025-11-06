import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { VOID_ELEMENTS } from "@/stimulus/constants"
import { isElementNode, isTextNode, NODE_TYPE } from "@/stimulus/dom-utils"

export function serializeArticle(root: Element): string {
	const clone = root.cloneNode(true)
	if (!isElementNode(clone)) {
		return serializeElementChildren(root)
	}
	return serializeElementChildren(clone)
}

function serializeNode(node: Node): string {
	if (isElementNode(node)) {
		return serializeElement(node)
	}
	if (isTextNode(node)) {
		const value = readTextValue(node, "serializeNode:text")
		return escapeTextContent(value)
	}
	if (node.nodeType === NODE_TYPE.CDATA_SECTION) {
		const preview = node.nodeValue ?? ""
		logger.error("serializeNode encountered cdata node", {
			preview: preview.slice(0, 200),
			previewLength: preview.length
		})
		throw errors.new("serializeNode encountered cdata")
	}
	return ""
}

function serializeElement(element: Element): string {
	const tag = element.tagName.toLowerCase()
	const attrs: string[] = []
	for (const attr of Array.from(element.attributes)) {
		const name = attr.name
		const value = attr.value
		attrs.push(`${name}="${escapeAttribute(value)}"`)
	}
	const attrString = attrs.length > 0 ? ` ${attrs.join(" ")}` : ""
	if (VOID_ELEMENTS.has(tag)) {
		return `<${tag}${attrString} />`
	}
	const children = Array.from(element.childNodes)
	const childString = children.map(serializeNode).join("")
	return `<${tag}${attrString}>${childString}</${tag}>`
}

function serializeElementChildren(element: Element): string {
	return Array.from(element.childNodes).map(serializeNode).join("")
}

function readTextValue(node: Text, context: string): string {
	const value = node.nodeValue
	if (value === null) {
		logger.error("serializeNode encountered text node without value", {
			context
		})
		throw errors.new("serializeNode: text node missing value")
	}
	return value
}

function escapeTextContent(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
}

function escapeAttribute(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")
}
