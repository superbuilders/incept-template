// Shared text rendering helpers for widgets

/**
 * Renders a text element with optional wrapping.
 * 1) If the text ends with a parenthetical ("... (...)"), and is long (> 36), split conservatively into two lines.
 * 2) Otherwise, if maxWidthPx is provided and the estimated width exceeds it, split into two balanced lines by words.
 * 3) Else render as a single line.
 */
export function renderWrappedText(
	text: string,
	x: number,
	y: number,
	className: string,
	lineHeight = "1.1em",
	maxWidthPx?: number,
	approxCharWidthPx = 8
): string {
	let lines: string[] = []
	const titlePattern = /^(.*)\s+(\(.+\))$/
	const m = text.match(titlePattern)
	if (m?.[1] && m[2]) {
		const shouldSplit = text.length > 36
		lines = shouldSplit ? [m[1].trim(), m[2].trim()] : [text]
	} else {
		const estimated = text.length * approxCharWidthPx
		if (maxWidthPx && estimated > maxWidthPx) {
			const words = text.split(/\s+/).filter(Boolean)
			if (words.length > 1) {
				const wordWidths = words.map((w) => w.length * approxCharWidthPx)
				const total =
					wordWidths.reduce((a, b) => a + b, 0) +
					(words.length - 1) * approxCharWidthPx
				const target = total / 2
				let acc = 0
				let splitIdx = 1
				for (let i = 0; i < words.length - 1; i++) {
					const w = wordWidths[i] ?? 0
					acc += w + approxCharWidthPx
					if (acc >= target) {
						splitIdx = i + 1
						break
					}
				}
				const left = words.slice(0, splitIdx).join(" ")
				const right = words.slice(splitIdx).join(" ")
				lines = [left, right]
			} else {
				lines = [text]
			}
		} else {
			lines = [text]
		}
	}

	let tspans = ""
	lines.forEach((line, i) => {
		const dy = i === 0 ? "0" : lineHeight
		tspans += `<tspan x="${x}" dy="${dy}">${line}</tspan>`
	})
	return `<text x="${x}" y="${y}" class="${className}">${tspans}</text>`
}

/**
 * Renders a Y-axis label that wraps to fit the chart height and is rotated -90 degrees around (x, yCenter).
 * The wrapping width is derived from the available chart height.
 */
export function renderRotatedWrappedYAxisLabel(
	text: string,
	x: number,
	yCenter: number,
	chartHeightPx: number,
	className = "axis-label",
	lineHeight = "1.1em",
	approxCharWidthPx = 8,
	paddingPx = 10
): string {
	const maxWrappedWidth = Math.max(20, chartHeightPx - 2 * paddingPx)
	let wrapped = renderWrappedText(
		text,
		x,
		yCenter,
		className,
		lineHeight,
		maxWrappedWidth,
		approxCharWidthPx
	)
	// Inject rotation transform with pivot
	wrapped = wrapped.replace(
		"<text ",
		`<text transform="rotate(-90, ${x}, ${yCenter})" `
	)
	return wrapped
}

/**
 * Strip common Markdown/HTML syntax to produce safe plaintext for widget fields.
 *
 * Goals:
 * - Replace links/images with their human-readable text (drop URLs)
 * - Remove emphasis markers, code fences/spans, headings, blockquotes, list bullets
 * - Remove HTML tags
 * - Normalize whitespace
 * - If the result is a bare URL or empty, return an empty string
 */
export function stripMarkdownToPlaintext(input: string): string {
	if (!input) return ""
	let text = String(input)

	// Normalize newlines
	text = text.replace(/\r\n?|\n/g, "\n")

	// Remove reference-style link definitions: [ref]: https://...
	text = text.replace(/^\s*\[[^\]]+\]:\s+\S+.*$/gim, "")

	// Images: ![alt](url) -> alt
	text = text.replace(/!\[([^\]]*)]\([^)]*\)/g, "$1")

	// Inline links: [text](url) -> text
	text = text.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, "$1")

	// Reference-style links: [text][ref] -> text
	text = text.replace(/\[([^\]]+)\]\[[^\]]*\]/g, "$1")

	// Autolinks: <https://...> or <mailto:...> -> remove entirely
	text = text.replace(/<(?:(?:https?:\/\/)|mailto:)[^>]+>/gim, "")

	// Code fences (```lang\ncode\n```): drop fences, keep inner text
	text = text.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ""))

	// Inline code: `code` -> code
	text = text.replace(/`([^`]+)`/g, "$1")

	// Emphasis/strong/strike markers -> keep inner text
	text = text.replace(/(\*\*|__)(.*?)\1/g, "$2")
	text = text.replace(/(\*|_)(.*?)\1/g, "$2")
	text = text.replace(/~~(.*?)~~/g, "$1")

	// Headings: remove leading # markup
	text = text.replace(/^#{1,6}\s+/gm, "")

	// Blockquotes: remove '>' markers
	text = text.replace(/^>\s?/gm, "")

	// Lists: bullets and ordered markers at line starts
	text = text.replace(/^\s*[-*+]\s+/gm, "")
	text = text.replace(/^\s*\d+\.\s+/gm, "")

	// HTML tags: strip tags but keep inner text
	text = text.replace(/<\/?[^>]+>/g, "")

	// Unescape common backslash-escaped punctuation used by markdown
	text = text.replace(/\\([\\`*_{}[\]()#+\-.!>])/g, "$1")

	// Collapse whitespace
	text = text.replace(/\u00A0/g, " ") // nbsp
	text = text.replace(/\s+/g, " ").trim()

	// If the remaining text is just a URL, drop it
	if (/^(?:https?:\/\/|mailto:)[^\s]+$/i.test(text)) {
		return ""
	}

	return text
}

/**
 * Estimates the final dimensions (width and height) of a text element after wrapping.
 * This function uses the same wrapping logic as CanvasImpl.wrapText for accurate prediction.
 *
 * @returns An object with the total height and maximum width of the wrapped text.
 */
export function estimateWrappedTextDimensions(
	text: string,
	maxWidthPx: number,
	fontSize = 16,
	lineHeight = 1.2
	// approxCharWidthPx = 8 // Unused parameter
): { height: number; maxWidth: number } {
	// Use shared wrapText logic for accurate prediction
	const lines = wrapText(text, maxWidthPx, fontSize)

	const totalHeight = fontSize * lines.length * lineHeight
	const maxWidth = Math.max(
		...lines.map((line) => estimateTextWidth(line, fontSize))
	)
	return { height: totalHeight, maxWidth }
}

/**
 * Shared text wrapping function that matches CanvasImpl.wrapText logic
 */
function wrapText(text: string, maxWidth: number, fontPx: number): string[] {
	// First check for explicit line breaks
	if (text.includes("\n")) {
		return text.split("\n")
	}
	// Simple word-based wrapping
	const words = text.split(" ")
	const lines: string[] = []
	let currentLine = ""
	for (const word of words) {
		const testLine = currentLine ? `${currentLine} ${word}` : word
		const testWidth = estimateTextWidth(testLine, fontPx)
		if (testWidth > maxWidth && currentLine) {
			// Word doesn't fit, start new line
			lines.push(currentLine)
			currentLine = word
		} else {
			// Word fits, add it to current line
			currentLine = testLine
		}
	}
	// Add the last line
	if (currentLine) {
		lines.push(currentLine)
	}
	return lines.length > 0 ? lines : [text]
}

/**
 * Shared text width estimation that matches CanvasImpl.estimateTextWidth
 */
function estimateTextWidth(text: string, fontPx: number): number {
	// Simple heuristic: average character width is about 0.6 * font size
	// This is server-safe and deterministic
	return text.length * fontPx * 0.6
}
