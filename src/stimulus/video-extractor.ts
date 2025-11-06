import { isElementNode } from "@/stimulus/dom-utils"
import type { ExtractedVideo } from "@/stimulus/types"

const YOUTUBE_EMBED_PATTERN = /\/embed\/([A-Za-z0-9_-]{11})(?:[/?#&]|$)/
const TREE_WALKER_SHOW_ELEMENT = 1

const VIDEO_INSTRUCTION_PATTERNS = [
	/^watch the following videos\b.*$/i,
	/^watch the videos below\b.*$/i
] as const

export function extractYouTubeVideos(root: Element): ExtractedVideo[] {
	const videos: ExtractedVideo[] = []
	const pendingInstructionElements: Element[] = []
	const walker = root.ownerDocument.createTreeWalker(
		root,
		TREE_WALKER_SHOW_ELEMENT
	)
	let current = walker.nextNode()
	while (current) {
		if (!isElementNode(current)) {
			current = walker.nextNode()
			continue
		}
		const element = current
		if (isInstructionCallout(element, pendingInstructionElements)) {
			pendingInstructionElements.push(element)
			current = walker.nextNode()
			continue
		}
		if (element.tagName.toLowerCase() === "iframe") {
			const srcAttr = element.getAttribute("src")
			if (typeof srcAttr !== "string") {
				current = walker.nextNode()
				continue
			}
			const youtubeId = parseYoutubeId(srcAttr)
			if (youtubeId === undefined) {
				current = walker.nextNode()
				continue
			}
			removePendingInstructions(pendingInstructionElements)
			const order = videos.length + 1
			const contextElement = findContextElement(element)
			let contextHtml: string | undefined
			let titleHint: string | undefined
			if (contextElement) {
				const contextOuterHtml = contextElement.outerHTML
				if (contextOuterHtml.trim().length > 0) {
					contextHtml = contextOuterHtml
				}
				const headingText = extractHeadingText(contextElement)
				if (headingText !== undefined) {
					titleHint = headingText
				}
			}
			element.remove()
			const videoEntry: ExtractedVideo = { order, youtubeId }
			if (titleHint !== undefined) {
				videoEntry.titleHint = titleHint
			}
			if (contextHtml !== undefined) {
				videoEntry.contextHtml = contextHtml
			}
			videos.push(videoEntry)
		}
		current = walker.nextNode()
	}
	return videos
}

function parseYoutubeId(url: string): string | undefined {
	const match = YOUTUBE_EMBED_PATTERN.exec(url)
	if (!match) return undefined
	return match[1]
}

function isInstructionCallout(element: Element, pending: Element[]): boolean {
	for (const queued of pending) {
		if (queued.contains(element)) {
			return false
		}
	}
	const rawText = element.textContent
	if (typeof rawText !== "string") {
		return false
	}
	const normalized = normalizeWhitespace(rawText)
	if (normalized.length === 0) {
		return false
	}
	for (const pattern of VIDEO_INSTRUCTION_PATTERNS) {
		if (pattern.test(normalized)) {
			return true
		}
	}
	return false
}

function removePendingInstructions(queue: Element[]): void {
	while (queue.length > 0) {
		const element = queue.pop()
		if (!element) {
			continue
		}
		if (element.parentNode) {
			element.remove()
		}
	}
}

function findContextElement(iframe: Element): Element | null {
	const parent = iframe.parentElement
	if (!parent) {
		return null
	}
	let candidate: Element | null = iframe.previousElementSibling
	while (candidate) {
		const text = candidate.textContent
		if (typeof text === "string" && normalizeWhitespace(text).length > 0) {
			return candidate
		}
		candidate = candidate.previousElementSibling
	}
	let ancestor: Element | null = parent.previousElementSibling
	while (ancestor) {
		const text = ancestor.textContent
		if (typeof text === "string" && normalizeWhitespace(text).length > 0) {
			return ancestor
		}
		ancestor = ancestor.previousElementSibling
	}
	return null
}

function extractHeadingText(element: Element): string | undefined {
	const tag = element.tagName.toLowerCase()
	if (
		tag === "h1" ||
		tag === "h2" ||
		tag === "h3" ||
		tag === "h4" ||
		tag === "h5" ||
		tag === "h6"
	) {
		const raw = element.textContent
		if (typeof raw !== "string") {
			return undefined
		}
		const normalized = normalizeWhitespace(raw)
		if (normalized.length === 0) {
			return undefined
		}
		return normalized
	}
	return undefined
}

function normalizeWhitespace(value: string): string {
	return value.replace(/\s+/g, " ").trim()
}
