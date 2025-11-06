import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"

/**
 * XML utility functions for extracting data from QTI XML strings
 */

/**
 * Escapes special characters in XML attribute values
 * @param value The value to escape
 * @returns The escaped value
 */
export function escapeXmlAttribute(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")
}

/**
 * Sanitizes a value for use in XML attributes by removing invalid characters
 * @param value The value to sanitize
 * @returns The sanitized value
 */
export function sanitizeXmlAttributeValue(value: string): string {
	// Remove control characters and other invalid XML characters
	// biome-ignore lint/suspicious/noControlCharactersInRegex: Control chars are intentionally handled here for data sanitization
	return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
}

/**
 * Replaces attributes on the root element of an XML string
 * @param xml The XML string
 * @param elementName The expected root element name
 * @param identifier The identifier attribute value
 * @param title The title attribute value
 * @returns The modified XML string
 */
export function replaceRootAttributes(
	xml: string,
	elementName: string,
	identifier: string,
	title: string
): string {
	// Use robust named capture groups; fail fast if not found
	const openTagRegex = new RegExp(
		`(?<open><\\s*${elementName}\\b)(?<attrs>[^>]*)>`,
		"i"
	)
	const openMatch = openTagRegex.exec(xml)
	if (!openMatch || !openMatch.groups) {
		logger.error("xml root open tag not found", { elementName })
		throw errors.new("xml: root open tag not found")
	}

	const start: string = String(openMatch.groups.open)
	const originalAttrs: string = String(openMatch.groups.attrs)

	let updatedAttrs: string = originalAttrs

	// identifier: replace if present (preserving quote style), else append
	const idAttrRegex = /\sidentifier\s*=\s*(?<q>["'])(?<value>.*?)k<q>/i
	const idAttrMatch = idAttrRegex.exec(updatedAttrs)
	if (idAttrMatch?.groups) {
		const quote: string = String(idAttrMatch.groups.q)
		updatedAttrs = updatedAttrs.replace(
			idAttrRegex,
			` identifier=${quote}${escapeXmlAttribute(identifier)}${quote}`
		)
	} else {
		updatedAttrs += ` identifier="${escapeXmlAttribute(identifier)}"`
	}

	// title: replace if present (preserving quote style), else append
	const titleAttrRegex = /\stitle\s*=\s*(?<q>["'])(?<value>.*?)k<q>/i
	const titleAttrMatch = titleAttrRegex.exec(updatedAttrs)
	if (titleAttrMatch?.groups) {
		const quote: string = String(titleAttrMatch.groups.q)
		updatedAttrs = updatedAttrs.replace(
			titleAttrRegex,
			` title=${quote}${escapeXmlAttribute(title)}${quote}`
		)
	} else {
		updatedAttrs += ` title="${escapeXmlAttribute(title)}"`
	}

	// Reconstruct the opening tag with updated attributes
	const replacement = `${start}${updatedAttrs}>`
	return xml.replace(openTagRegex, replacement)
}

/**
 * Extracts the identifier attribute from a QTI XML element
 * @param xml The XML string to parse
 * @param elementName The name of the element (e.g., 'qti-assessment-item')
 * @returns The identifier value (throws if missing)
 */
export function extractIdentifier(xml: string, elementName: string): string {
	// Use named groups for the open tag; fail fast
	const openTagRegex = new RegExp(
		`(?<open><\\s*${elementName}\\b)(?<attrs>[^>]*)>`,
		"i"
	)
	const openMatch = openTagRegex.exec(xml)
	if (!openMatch || !openMatch.groups) {
		logger.error("xml root open tag not found in extractIdentifier", {
			elementName
		})
		throw errors.new("xml: root open tag not found")
	}

	const attrs: string = String(openMatch.groups.attrs)
	const idAttrRegex = /\sidentifier\s*=\s*(?<q>["'])(?<value>[^"']+)k<q>/i
	const idMatch = idAttrRegex.exec(attrs)
	if (!idMatch || !idMatch.groups || !idMatch.groups.value) {
		logger.error("xml identifier attribute not found", { elementName })
		throw errors.new("xml: identifier attribute not found")
	}

	return String(idMatch.groups.value)
}

/**
 * Extracts the title from a QTI XML element
 * @param xml The XML string to parse
 * @returns The title value or null if not found
 */
export function extractTitle(xml: string): string | null {
	// Try to extract from title attribute
	const titleAttrMatch = xml.match(/\stitle=["']([^"']+)["']/i)
	if (titleAttrMatch?.[1]) return titleAttrMatch[1]

	// Try to extract from <qti-title> element
	const titleElementMatch = xml.match(/<qti-title[^>]*>([^<]+)<\/qti-title>/i)
	if (titleElementMatch?.[1]) return titleElementMatch[1].trim()

	return null
}

/**
 * Extracts the body content from a QTI stimulus XML
 * @param xml The XML string to parse
 * @returns The body content or null if not found
 */
export function extractQtiStimulusBodyContent(xml: string): string {
	// Extract content between <qti-stimulus-body> tags
	const match = xml.match(
		/<qti-stimulus-body[^>]*>([\s\S]*?)<\/qti-stimulus-body>/i
	)
	if (!match) {
		return ""
	}
	return (match[1] ?? "").trim()
}

/**
 * Extracts all assessment item references from a QTI test XML
 * @param xml The XML string to parse
 * @returns Array of referenced item identifiers
 */
export function extractItemRefs(xml: string): string[] {
	const itemRefs: string[] = []

	// Match all qti-assessment-item-ref elements and extract their identifier attributes
	const regex = /<qti-assessment-item-ref[^>]*\sidentifier=["']([^"']+)["']/gi
	let match: RegExpExecArray | null = regex.exec(xml)

	while (match !== null) {
		if (match[1]) itemRefs.push(match[1])
		match = regex.exec(xml)
	}

	// Also check for href attributes that might reference items
	const hrefRegex = /<qti-assessment-item-ref[^>]*\shref=["']([^"']+)["']/gi
	let hrefMatch: RegExpExecArray | null = hrefRegex.exec(xml)

	while (hrefMatch !== null) {
		// Extract identifier from href (usually the last part of the path without extension)
		const href = hrefMatch[1]
		if (href) {
			const identifier = href
				.split("/")
				.pop()
				?.replace(/\.[^.]+$/, "")
			if (identifier && !itemRefs.includes(identifier)) {
				itemRefs.push(identifier)
			}
		}
		hrefMatch = hrefRegex.exec(xml)
	}

	return itemRefs
}
