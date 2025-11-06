import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { XMLParser } from "fast-xml-parser"
import { VOID_ELEMENTS } from "@/stimulus/constants"
import { createDocument } from "@/stimulus/dom"
import { isElementNode, isTextNode, NODE_TYPE } from "@/stimulus/dom-utils"
import type { StimulusIssue } from "@/stimulus/types"

const ALLOWED_NAMED_ENTITIES = new Set(["amp", "lt", "gt", "quot", "apos"])
const NAMED_ENTITY_PATTERN = /&([a-zA-Z][a-zA-Z0-9]+);/g
const NUMERIC_ENTITY_PATTERN = /&#(?:x[0-9a-fA-F]+|\d+);/g

const xmlParser = new XMLParser({
	ignoreAttributes: false,
	allowBooleanAttributes: false,
	trimValues: false,
	processEntities: true
})

export function validateHtml(html: string): StimulusIssue[] {
	const documentResult = errors.trySync(() => createDocument(html))
	if (documentResult.error) {
		const message = getErrorMessage(documentResult.error)
		return [
			{
				severity: "error",
				code: "html-parse-error",
				message: `HTML validation failed: ${message}`
			}
		]
	}

	const doc = documentResult.data
	const body = doc.body
	if (!body) {
		return [
			{
				severity: "error",
				code: "html-parse-error",
				message: "Parsed HTML does not contain a body element."
			}
		]
	}

	const containerDoc = createDocument("<div></div>")
	const container = containerDoc.querySelector("div")
	if (!container) {
		logger.error("validation container missing in generated document")
		return [
			{
				severity: "error",
				code: "html-parse-error",
				message: "Failed to create validation container."
			}
		]
	}
	for (const child of Array.from(body.childNodes)) {
		const imported = containerDoc.importNode(child, true)
		container.appendChild(imported)
	}

	assertNoCdata(container, html.length)

	const issues: StimulusIssue[] = []
	issues.push(...collectEntityIssues(html))

	const xmlString = `<?xml version="1.0" encoding="UTF-8"?>${serializeElementToXml(container)}`
	const xmlParseResult = errors.trySync(() => xmlParser.parse(xmlString))
	if (xmlParseResult.error) {
		const message = getErrorMessage(xmlParseResult.error)
		issues.push({
			severity: "error",
			code: "xml-parse-error",
			message: `XML validation failed: ${message}`
		})
	}

	return issues
}

function collectEntityIssues(html: string): StimulusIssue[] {
	const issues: StimulusIssue[] = []
	const numericEntities = new Set<string>()
	for (
		let numericMatch = NUMERIC_ENTITY_PATTERN.exec(html);
		numericMatch;
		numericMatch = NUMERIC_ENTITY_PATTERN.exec(html)
	) {
		numericEntities.add(numericMatch[0])
	}
	for (
		let namedMatch = NAMED_ENTITY_PATTERN.exec(html);
		namedMatch;
		namedMatch = NAMED_ENTITY_PATTERN.exec(html)
	) {
		const entity = namedMatch[0]
		if (numericEntities.has(entity)) {
			continue
		}
		const name = namedMatch[1]
		if (!ALLOWED_NAMED_ENTITIES.has(name)) {
			issues.push({
				severity: "error",
				code: "disallowed-html-entity",
				message: `Found disallowed HTML entity: ${entity}`
			})
		}
	}
	return issues
}

function serializeElementToXml(element: Element): string {
	const tag = element.tagName.toLowerCase()
	const attrs = Array.from(element.attributes)
		.map((attr) => `${attr.name}="${escapeXmlAttribute(attr.value)}"`)
		.join(" ")
	const attrString = attrs.length > 0 ? ` ${attrs}` : ""

	if (VOID_ELEMENTS.has(tag)) {
		return `<${tag}${attrString} />`
	}

	const childXml = Array.from(element.childNodes)
		.map((child) => serializeNodeToXml(child))
		.join("")
	return `<${tag}${attrString}>${childXml}</${tag}>`
}

function serializeNodeToXml(node: Node): string {
	if (isElementNode(node)) {
		return serializeElementToXml(node)
	}
	if (isTextNode(node)) {
		return escapeXmlText(node.nodeValue ?? "")
	}
	if (node.nodeType === NODE_TYPE.CDATA_SECTION) {
		const preview = node.nodeValue ?? ""
		logger.error("serializeNodeToXml encountered cdata node", {
			preview: preview.slice(0, 200),
			previewLength: preview.length
		})
		throw errors.new("stimulus xml serialization encountered cdata")
	}
	return ""
}

function escapeXmlAttribute(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")
}

function escapeXmlText(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
}

function getErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error)
}

function assertNoCdata(root: Node, htmlLength: number): void {
	if (!containsCdata(root)) {
		return
	}
	logger.error("cdata found in stimulus html", { htmlLength })
	throw errors.new("stimulus html contains cdata")
}

function containsCdata(root: Node): boolean {
	if (root.nodeType === NODE_TYPE.CDATA_SECTION) {
		return true
	}
	for (const child of Array.from(root.childNodes)) {
		if (containsCdata(child)) {
			return true
		}
	}
	return false
}
