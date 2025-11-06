import { parseHTML } from "linkedom"

export function createDocument(html: string) {
	const trimmed = html.trim()
	let markup = trimmed
	if (trimmed.length === 0) {
		markup = "<html><body></body></html>"
	} else if (!/^<!DOCTYPE|<html[\s>]/i.test(trimmed)) {
		markup = `<html><body>${trimmed}</body></html>`
	}
	const { document } = parseHTML(markup)
	return document
}
