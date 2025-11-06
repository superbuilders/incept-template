import * as errors from "@superbuilders/errors"
import type * as logger from "@superbuilders/slog"
import he from "he"

const LATEX_LIKE_REGEX = /\\(?:[a-zA-Z]+|[(){}[\]])/

// ADD: New regex constants for the new checks.
const PERSEUS_ARTIFACT_REGEX = /\[\[☃\s*[\s\S]*?\]\]/
const MFENCED_REGEX = /<mfenced(?:\s+[^>]*)?>/i

/**
 * Validates that no LaTeX content is present in an HTML/XML string fragment.
 * Throws an error if LaTeX is detected.
 * @param htmlFragment The string to validate.
 * @param logger The logger instance.
 */
export function checkNoLatex(
	htmlFragment: string,
	logger: logger.Logger
): void {
	const latexCommandMatch = htmlFragment.match(LATEX_LIKE_REGEX)
	if (latexCommandMatch) {
		const contextIndex = latexCommandMatch.index ?? 0
		const errorContext = htmlFragment.substring(
			Math.max(0, contextIndex - 50),
			Math.min(htmlFragment.length, contextIndex + 50)
		)
		logger.error("found latex command-like content", {
			match: latexCommandMatch[0],
			context: errorContext
		})
		throw errors.new(
			`Invalid content: LaTeX command-like content is not allowed. Found: "${latexCommandMatch[0]}". Context: "...${errorContext}..."`
		)
	}

	// First, check if dollar signs are properly tagged as currency - if so, skip LaTeX validation
	// This handles cases like <span class="currency">$</span>
	const currencyTaggedDollar =
		/<span\s+class\s*=\s*["']currency["']\s*>\s*\$\s*<\/span>/gi
	const fragmentWithoutCurrencyTags = htmlFragment.replace(
		currencyTaggedDollar,
		"CURRENCY_PLACEHOLDER"
	)

	// Also handle cases where $ appears right before a number or math tag (likely currency)
	// Examples: $50, $<math>, <mo>$</mo>
	const currencyPatterns = [
		// Dollar sign in MathML operator element (e.g., <mo>$</mo>)
		/<mo(?:\s+[^>]*)?>[\s]*\$[\s]*<\/mo>/gi,
		// Dollar sign immediately before a math tag or mn element
		/\$(?=\s*<(?:math|mn))/g,
		// Dollar sign immediately before a simple number (not followed by parentheses)
		/\$(?=\s*\d+(?:\.\d+)?(?:\s|$|[.,;:!?]|<))/g
	]

	let processedFragment = fragmentWithoutCurrencyTags
	for (const pattern of currencyPatterns) {
		processedFragment = processedFragment.replace(
			pattern,
			"CURRENCY_PLACEHOLDER"
		)
	}

	// Now check for LaTeX-style dollar delimiters in the processed fragment
	const dollarPairRegex = /\$(?<content>[^$]+)\$/g
	let match: RegExpExecArray | null
	match = dollarPairRegex.exec(processedFragment)
	while (match !== null) {
		if (match.groups?.content) {
			const content = match.groups.content
			// Check if this looks like mathematical content (not just a number)
			const hasMathIndicators =
				// Variables or expressions with operators
				/[a-zA-Z]\s*[+\-*/=]/.test(content) ||
				// Superscript or subscript notation
				/[a-zA-Z0-9][_^]/.test(content) ||
				// Mathematical functions or parentheses with variables
				/\([^)]*[a-zA-Z][^)]*\)/.test(content) ||
				// Mixed letters and numbers (like 2x, 3y)
				/\d+[a-zA-Z]|[a-zA-Z]+\d/.test(content) ||
				// Equals signs with variables
				/[a-zA-Z]\s*=/.test(content) ||
				// Coordinate pairs or tuples (e.g., (2,3) or (x,y))
				/^\s*\(\s*[^)]+\s*,\s*[^)]+\s*\)\s*$/.test(content) ||
				// Expressions starting with number followed by parentheses (e.g., 3(x+2))
				/^\s*\d+\s*\(/.test(content)

			if (hasMathIndicators) {
				// Find the original position in the unprocessed fragment
				const contextIndex = htmlFragment.indexOf(match[0])
				if (contextIndex !== -1) {
					const errorContext = htmlFragment.substring(
						Math.max(0, contextIndex - 50),
						Math.min(htmlFragment.length, contextIndex + 50)
					)
					logger.error("found dollar-sign delimited latex", {
						match: match[0],
						context: errorContext
					})
					throw errors.new(
						`Invalid content: Dollar-sign delimited LaTeX is not allowed. Found: "${match[0]}". Context: "...${errorContext}..."`
					)
				}
			}
		}
		match = dollarPairRegex.exec(processedFragment)
	}
}

/**
 * NEW: Validates that no Perseus artifacts are present in an HTML/XML string fragment.
 * Throws an error if an artifact is detected.
 * @param htmlFragment The string to validate.
 * @param logger The logger instance.
 */
export function checkNoPerseusArtifacts(
	htmlFragment: string,
	logger: logger.Logger
): void {
	const match = htmlFragment.match(PERSEUS_ARTIFACT_REGEX)
	if (match) {
		const contextIndex = match.index ?? 0
		const errorContext = htmlFragment.substring(
			Math.max(0, contextIndex - 50),
			Math.min(htmlFragment.length, contextIndex + 50)
		)
		logger.error("found perseus artifact", {
			match: match[0],
			context: errorContext
		})
		throw errors.new(
			`Invalid content: Perseus artifact '[[☃ ...]]' is not allowed. Found: "${match[0]}". Context: "...${errorContext}..."`
		)
	}
}

/**
 * NEW: Validates that no deprecated <mfenced> elements are used in an HTML/XML string fragment.
 * Throws an error if an mfenced element is detected.
 * @param htmlFragment The string to validate.
 * @param logger The logger instance.
 */
export function checkNoMfencedElements(
	htmlFragment: string,
	logger: logger.Logger
): void {
	const match = htmlFragment.match(MFENCED_REGEX)
	if (match) {
		const contextIndex = match.index ?? 0
		const errorContext = htmlFragment.substring(
			Math.max(0, contextIndex - 50),
			Math.min(htmlFragment.length, contextIndex + 50)
		)
		logger.error("found deprecated mfenced element", {
			match: match[0],
			context: errorContext
		})
		throw errors.new(
			`Invalid MathML: The <mfenced> element is deprecated and not allowed. Found: "${match[0]}". Context: "...${errorContext}..."`
		)
	}
}

/**
 * A shared utility to convert problematic HTML entities to their character equivalents.
 * @param htmlFragment The HTML string to process.
 * @returns The processed string.
 */
export function sanitizeHtmlEntities(htmlFragment: string): string {
	const exceptions = new Set(["&quot;", "&apos;", "&lt;", "&gt;", "&amp;"])
	const entityRegex = /&(#?[a-zA-Z0-9]+);/g
	return htmlFragment.replace(entityRegex, (match) => {
		if (exceptions.has(match)) {
			return match
		}
		return he.decode(match)
	})
}

/**
 * A shared utility to fix common MathML operator issues.
 * @param htmlFragment The HTML string to process.
 * @returns The processed string.
 */
export function sanitizeMathMLOperators(htmlFragment: string): string {
	let fixedXml = htmlFragment
	fixedXml = fixedXml.replace(/<mo(?:\s+[^>]?)?>(<)<\/mo>/gi, (match) =>
		match.replace("<</mo>", "&lt;</mo>")
	)
	fixedXml = fixedXml.replace(/<mo(?:\s+[^>]*)?>><\/mo>/gi, (match) =>
		match.replace("></mo>", "&gt;</mo>")
	)
	fixedXml = fixedXml.replace(/<mo(?:\s+[^>]?)?><=(\/mo>)/gi, (match) =>
		match.replace("<=", "≤")
	)
	fixedXml = fixedXml.replace(/<mo(?:\s+[^>]*)?>>=(<\/mo>)/gi, (match) =>
		match.replace(">=", "≥")
	)
	return fixedXml
}

/**
 * Validates that a string contains only XML 1.0 valid characters for character data (PCDATA).
 * Disallows C0 control characters other than TAB (0x09), LF (0x0A), and CR (0x0D),
 * as well as non-characters like U+FFFE/U+FFFF and any unpaired UTF-16 surrogates.
 *
 * Context: The XML validator surfaced "PCDATA invalid Char value <code>" errors for inputs containing
 * characters like \u0002, \u0004, \u0019. This function bans such characters early during pre-validation.
 *
 * @param fragment The text or markup fragment to validate
 * @param logger The logger instance
 */
export function checkNoInvalidXmlChars(
	fragment: string,
	logger: logger.Logger
): void {
	const invalidCodePoints: Array<{ index: number; codePoint: number }> = []

	// Iterate by code points to handle surrogate pairs correctly
	for (let i = 0; i < fragment.length; ) {
		const maybeCodePoint = fragment.codePointAt(i)
		if (maybeCodePoint === undefined) {
			// Should not happen with 0 <= i < length, but fail safe
			logger.error("code point retrieval failed", { index: i })
			throw errors.new("invalid string indexing")
		}
		const codePoint = maybeCodePoint
		const codeUnitCount = codePoint > 0xffff ? 2 : 1

		const isAllowed =
			// Whitespace controls allowed by XML 1.0
			codePoint === 0x09 ||
			codePoint === 0x0a ||
			codePoint === 0x0d ||
			// General allowed ranges
			(codePoint >= 0x20 && codePoint <= 0xd7ff) ||
			(codePoint >= 0xe000 && codePoint <= 0xfffd) ||
			(codePoint >= 0x10000 && codePoint <= 0x10ffff)

		// Exclude non-characters U+FFFE/U+FFFF within BMP
		const isBmpNonCharacter = codePoint === 0xfffe || codePoint === 0xffff

		// Detect unpaired surrogate halves explicitly
		const codeUnit = fragment.charCodeAt(i)
		const nextCodeUnit =
			i + 1 < fragment.length ? fragment.charCodeAt(i + 1) : 0
		const isHighSurrogate = codeUnit >= 0xd800 && codeUnit <= 0xdbff
		const isLowSurrogate = codeUnit >= 0xdc00 && codeUnit <= 0xdfff
		const isUnpairedHigh =
			isHighSurrogate && !(nextCodeUnit >= 0xdc00 && nextCodeUnit <= 0xdfff)
		const isUnpairedLow =
			isLowSurrogate &&
			!(
				i > 0 &&
				fragment.charCodeAt(i - 1) >= 0xd800 &&
				fragment.charCodeAt(i - 1) <= 0xdbff
			)

		if (!isAllowed || isBmpNonCharacter || isUnpairedHigh || isUnpairedLow) {
			invalidCodePoints.push({ index: i, codePoint })
		}

		i += codeUnitCount
	}

	if (invalidCodePoints.length > 0) {
		// Build a concise context preview around the first offending index
		const first = invalidCodePoints[0]
		if (!first) {
			logger.error("invalid code points invariant", {
				count: invalidCodePoints.length
			})
			throw errors.new("invalid code points invariant")
		}
		const contextStart = Math.max(0, first.index - 40)
		const contextEnd = Math.min(fragment.length, first.index + 40)
		const contextPreview = fragment.substring(contextStart, contextEnd)

		logger.error("invalid xml characters in content", {
			count: invalidCodePoints.length,
			invalid: invalidCodePoints.slice(0, 10).map((c) => ({
				index: c.index,
				codePointHex: `U+${c.codePoint.toString(16).toUpperCase()}`,
				codePointDec: c.codePoint
			})),
			context: contextPreview
		})

		const details = invalidCodePoints
			.slice(0, 5)
			.map((c) => `U+${c.codePoint.toString(16).toUpperCase()}@${c.index}`)
			.join(", ")
		logger.error("invalid xml characters found in content", {
			invalidCount: invalidCodePoints.length,
			details,
			contentLength: fragment.length
		})
		throw errors.new(
			`invalid xml characters found in content: ${invalidCodePoints.length} occurrence(s), e.g., ${details}`
		)
	}
}

/**
 * Validates that no CDATA sections are present in the fragment.
 * QTI requires properly XML-encoded content; CDATA (<![CDATA[ ... ]]>) is disallowed.
 *
 * @param fragment The text or markup fragment to validate
 * @param logger The logger instance
 */
export function checkNoCDataSections(
	fragment: string,
	logger: logger.Logger
): void {
	const openIdx = fragment.indexOf("<![CDATA[")
	const closeIdx = fragment.indexOf("]]>")
	if (openIdx !== -1 || closeIdx !== -1) {
		const idx = openIdx !== -1 ? openIdx : closeIdx
		const contextStart = Math.max(0, idx - 40)
		const contextEnd = Math.min(fragment.length, idx + 40)
		const contextPreview = fragment.substring(contextStart, contextEnd)

		logger.error("found cdata section in content", {
			index: idx,
			context: contextPreview
		})
		throw errors.new("cdata sections are not allowed")
	}
}
