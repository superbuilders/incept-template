import type * as logger from "@superbuilders/slog"
import he from "he"

/**
 * Converts problematic HTML entities to their numeric equivalents or actual characters.
 * This prevents validation errors from the QTI API which doesn't accept named HTML entities.
 *
 * @param xml The XML string to process
 * @param logger The logger instance
 * @returns The XML string with HTML entities converted
 */
export function convertHtmlEntities(
	xml: string,
	logger: logger.Logger
): string {
	const exceptions = new Set(["&quot;", "&apos;", "&lt;", "&gt;", "&amp;"])
	const entityRegex = /&(#?[a-zA-Z0-9]+);/g

	let totalReplacements = 0
	const convertedXml = xml.replace(entityRegex, (match) => {
		if (exceptions.has(match)) {
			return match
		}
		totalReplacements++
		return he.decode(match)
	})

	if (totalReplacements > 0) {
		logger.debug("converted html entities to unicode characters", {
			totalReplacements,
			originalLength: xml.length,
			convertedLength: convertedXml.length
		})
	}

	return convertedXml
}

/**
 * Fixes unescaped angle brackets within MathML mo elements.
 * This handles the common case where < and > symbols are not properly escaped
 * within mathematical operator elements.
 *
 * @param xml The XML string to process
 * @param logger The logger instance
 * @returns The XML string with properly escaped angle brackets in mo elements
 */
export function fixMathMLOperators(xml: string, logger: logger.Logger): string {
	let fixCount = 0

	// Fix unescaped < in mo elements
	// This specifically looks for <mo><</mo> pattern
	const moLessThanRegex = /<mo(?:\s+[^>]*)?>(<)<\/mo>/gi
	let fixedXml = xml.replace(moLessThanRegex, (match) => {
		fixCount++
		return match.replace("<</mo>", "&lt;</mo>")
	})

	// Fix unescaped > in mo elements
	// This specifically looks for <mo>></mo> pattern
	const moGreaterThanRegex = /<mo(?:\s+[^>]*)?>><\/mo>/gi
	fixedXml = fixedXml.replace(moGreaterThanRegex, (match) => {
		fixCount++
		return match.replace("></mo>", "&gt;</mo>")
	})

	// Fix unescaped <= in mo elements by converting to Unicode ≤
	// This specifically looks for <mo><=</mo> pattern
	const moLessThanEqualRegex = /<mo(?:\s+[^>]*)?><=(\/mo>)/gi
	fixedXml = fixedXml.replace(moLessThanEqualRegex, (match) => {
		fixCount++
		return match.replace("<=", "≤")
	})

	// Fix unescaped >= in mo elements by converting to Unicode ≥
	// This specifically looks for <mo>>=</mo> pattern
	const moGreaterThanEqualRegex = /<mo(?:\s+[^>]*)?>>=(<\/mo>)/gi
	fixedXml = fixedXml.replace(moGreaterThanEqualRegex, (match) => {
		fixCount++
		return match.replace(">=", "≥")
	})

	if (fixCount > 0) {
		logger.debug("fixed unescaped angle brackets in MathML mo elements", {
			fixCount,
			originalLength: xml.length,
			fixedLength: fixedXml.length
		})
	}

	return fixedXml
}

/**
 * Strips all XML comments from the provided XML string.
 * This prevents issues with malformed comments that could cause XML parsing errors.
 *
 * @param xml The XML string to process
 * @param logger The logger instance
 * @returns The XML string with all comments removed
 */
export function stripXmlComments(xml: string, logger: logger.Logger): string {
	// EXTREMELY robust regex for matching XML comments
	// This handles multi-line comments and ensures we don't accidentally match
	// things that look like comments but aren't (e.g., within CDATA sections)
	//
	// The regex breakdown:
	// <!--              : Matches the exact opening of an XML comment
	// (?<content>       : Named capture group for the comment content
	//   (?:             : Non-capturing group for the content pattern
	//     (?!-->)       : Negative lookahead - ensures we don't match -->
	//     [\s\S]        : Matches any character including newlines
	//   )*              : Zero or more of any character that isn't part of -->
	// )                 : End of content capture group
	// -->               : Matches the exact closing of an XML comment
	const commentRegex = /<!--(?<content>(?:(?!-->)[\s\S])*)-->/g

	// Count comments for logging
	const commentMatches = xml.match(commentRegex)
	const commentCount = commentMatches ? commentMatches.length : 0

	if (commentCount > 0) {
		logger.debug("stripping xml comments", {
			commentCount,
			firstComment: commentMatches?.[0]?.substring(0, 100),
			originalLength: xml.length
		})
	}

	// Replace all comments with empty string
	const strippedXml = xml.replace(commentRegex, "")

	if (commentCount > 0) {
		logger.debug("xml comments stripped", {
			commentCount,
			originalLength: xml.length,
			strippedLength: strippedXml.length,
			bytesRemoved: xml.length - strippedXml.length
		})
	}

	return strippedXml
}

/**
 * Removes consecutive newlines from the XML string, leaving only single newlines.
 * This handles all types of line endings (Unix \n, Windows \r\n, and mixed).
 *
 * @param xml The XML string to process
 * @param logger The logger instance
 * @returns The XML string with consecutive newlines reduced to single newlines
 */
export function removeDoubleNewlines(
	xml: string,
	logger: logger.Logger
): string {
	// First normalize all line endings to \n for consistent processing
	// This handles \r\n (Windows), \r (old Mac), and leaves \n (Unix) as is
	const normalizedXml = xml.replace(/\r\n/g, "\n").replace(/\r/g, "\n")

	// Count the number of double (or more) newline sequences before replacement
	const doubleNewlineMatches = normalizedXml.match(/\n{2,}/g)
	const doubleNewlineCount = doubleNewlineMatches
		? doubleNewlineMatches.length
		: 0

	if (doubleNewlineCount > 0) {
		// Calculate total excess newlines
		const excessNewlines = doubleNewlineMatches?.reduce(
			(sum, match) => sum + match.length - 1,
			0
		)

		logger.debug("removing double newlines", {
			doubleNewlineSequences: doubleNewlineCount,
			totalExcessNewlines: excessNewlines,
			originalLength: xml.length
		})
	}

	// Replace any sequence of 2 or more newlines with a single newline
	const cleanedXml = normalizedXml.replace(/\n{2,}/g, "\n")

	if (doubleNewlineCount > 0) {
		logger.debug("double newlines removed", {
			sequencesRemoved: doubleNewlineCount,
			originalLength: xml.length,
			cleanedLength: cleanedXml.length,
			bytesRemoved: xml.length - cleanedXml.length
		})
	}

	return cleanedXml
}

/**
 * Fixes Khan Academy graphie URLs by appending .svg extension if missing.
 * This handles URLs in the format: https://cdn.kastatic.org/ka-perseus-graphie/[hash]
 *
 * @param xml The XML string to process
 * @param logger The logger instance
 * @returns The XML string with properly formatted Khan graphie URLs
 */
export function fixKhanGraphieUrls(xml: string, logger: logger.Logger): string {
	// Match Khan graphie URLs that don't already have a file extension
	// Named capture groups for clarity
	const khanGraphieRegex =
		/(?<url>https:\/\/cdn\.kastatic\.org\/ka-perseus-graphie\/(?<hash>[a-zA-Z0-9]+))(?!\.(?:svg|png|jpg|jpeg|gif|webp))(?<after>[\s"'<>&]|$)/g

	let fixCount = 0

	const fixedXml = xml.replace(
		khanGraphieRegex,
		(_match, url, _hash, after) => {
			fixCount++
			return `${url}.svg${after}`
		}
	)

	if (fixCount > 0) {
		logger.debug("fixed khan graphie urls by appending .svg", {
			fixCount,
			originalLength: xml.length,
			fixedLength: fixedXml.length
		})
	}

	return fixedXml
}

/**
 * MISSION CRITICAL: Fixes unescaped inequality operators throughout the XML.
 * - For qti-value elements: Escapes to HTML entities (&lt;= and &gt;=) for ASCII input
 * - For all other content: Converts to Unicode symbols (≤ and ≥) for proper display
 *
 * This function uses EXTREMELY robust named capture groups and multiple safeguards
 * to ensure it NEVER corrupts valid XML.
 *
 * @param xml The XML string to process
 * @param logger The logger instance
 * @returns The XML string with properly handled inequality operators
 */
export function fixInequalityOperators(
	xml: string,
	logger: logger.Logger
): string {
	let totalFixCount = 0

	// CRITICAL: Only process qti-value elements that contain mathematical inequalities
	// This regex uses named capture groups for maximum clarity and robustness
	const qtiValueRegex = new RegExp(
		// Opening tag with exact match
		"<qti-value>" +
			// Capture the content - using lazy match to stop at first closing tag
			"(?<content>[\\s\\S]*?)" +
			// Closing tag with exact match
			"</qti-value>",
		"gi"
	)

	let qtiValueFixCount = 0

	const xmlAfterQtiValueFix = xml.replace(
		qtiValueRegex,
		(fullMatch, content) => {
			// CRITICAL SAFEGUARDS:
			// 1. If content already has ANY HTML entities, skip it entirely
			if (/&[a-zA-Z]+;|&#\d+;|&#x[0-9a-fA-F]+;/.test(content)) {
				logger.debug("skipping qti-value with existing entities", { content })
				return fullMatch
			}

			// 2. Process ANY ASCII inequality sequences in qti-value content
			const hasInequalityOperator = /[<>]=?/.test(content)
			if (!hasInequalityOperator) {
				return fullMatch
			}

			// 3. Additional safeguard: content should be relatively short (typical answers)
			if (content.length > 50) {
				logger.warn("skipping suspiciously long qti-value content", {
					contentLength: content.length,
					content: `${content.substring(0, 50)}...`
				})
				return fullMatch
			}

			let modifiedContent = content
			let localFixCount = 0

			// Fix inequalities with EXPLICIT patterns
			// CRITICAL: Don't use .test() with global regex - it maintains state!

			// Pattern 1: <= (less than or equal)
			modifiedContent = modifiedContent.replace(
				/(?<before>[a-zA-Z0-9\s\-+*/()^.]+)(?<operator><=)(?<after>[a-zA-Z0-9\s\-+*/()^.]+)/g,
				(_match: string, before: string, _operator: string, after: string) => {
					localFixCount++
					return `${before}&lt;=${after}`
				}
			)

			// Pattern 2: >= (greater than or equal)
			modifiedContent = modifiedContent.replace(
				/(?<before>[a-zA-Z0-9\s\-+*/()^.]+)(?<operator>>=)(?<after>[a-zA-Z0-9\s\-+*/()^.]+)/g,
				(_match: string, before: string, _operator: string, after: string) => {
					localFixCount++
					return `${before}&gt;=${after}`
				}
			)

			// Pattern 3: < (less than) - but NOT part of <=
			modifiedContent = modifiedContent.replace(
				/(?<before>[a-zA-Z0-9\s\-+*/()^.]+)(?<operator><)(?<after>(?!=)[a-zA-Z0-9\s\-+*/()^.]+)/g,
				(_match: string, before: string, _operator: string, after: string) => {
					localFixCount++
					return `${before}&lt;${after}`
				}
			)

			// Pattern 4: > (greater than) - but NOT part of >=
			modifiedContent = modifiedContent.replace(
				/(?<before>[a-zA-Z0-9\s\-+*/()^.]+)(?<operator>>)(?<after>(?!=)[a-zA-Z0-9\s\-+*/()^.]+)/g,
				(_match: string, before: string, _operator: string, after: string) => {
					localFixCount++
					return `${before}&gt;${after}`
				}
			)

			if (localFixCount > 0) {
				qtiValueFixCount++
				logger.debug("fixed unescaped inequality in qti-value", {
					original: content,
					fixed: modifiedContent,
					fixCount: localFixCount
				})
			}

			return `<qti-value>${modifiedContent}</qti-value>`
		}
	)

	// Handle inequalities in other text content - convert to Unicode
	// CRITICAL: Use extremely specific patterns to avoid false positives
	let generalFixCount = 0

	// Only process text content that's clearly between XML tags
	// Named groups for maximum clarity
	const textContentRegex = new RegExp(
		// Must start after a closing >
		">(?<content>" +
			// Content that doesn't contain < or > (to ensure we're not in a tag)
			"[^<>]+" +
			// Must end before an opening <
			")<",
		"g"
	)

	const finalXml = xmlAfterQtiValueFix.replace(
		textContentRegex,
		(fullMatch, content) => {
			// CRITICAL: Skip if this might be inside a qti-value element
			// Check a wider context to be absolutely sure
			const startIndex = xmlAfterQtiValueFix.lastIndexOf(
				"<",
				xmlAfterQtiValueFix.indexOf(fullMatch)
			)
			const contextBefore = xmlAfterQtiValueFix.substring(
				Math.max(0, startIndex - 20),
				startIndex + 20
			)
			if (contextBefore.includes("qti-value>")) {
				return fullMatch
			}

			// Only process if content contains mathematical inequalities
			if (!/[<>]=?/.test(content)) {
				return fullMatch
			}

			// Check if this looks like mathematical content
			// Must have numbers or common math variables
			if (!/[0-9xyzabc]/.test(content)) {
				return fullMatch
			}

			let modifiedContent = content
			let hasChanges = false

			// ONLY replace inequalities in clear mathematical contexts
			// Use very specific patterns with named groups

			// Pattern 1: Variable <= Number or Variable >= Number
			const variableInequalityRegex =
				/(?<var>[a-zA-Z]+)\s*(?<op>[<>]=?)\s*(?<num>-?\d+(?:\.\d+)?)/g
			modifiedContent = modifiedContent.replace(
				variableInequalityRegex,
				(match: string, variable: string, operator: string, number: string) => {
					if (operator === "<=") {
						hasChanges = true
						return `${variable} ≤ ${number}`
					}
					if (operator === ">=") {
						hasChanges = true
						return `${variable} ≥ ${number}`
					}
					// Don't convert < or > to unicode in general content - could break things
					return match
				}
			)

			// Pattern 2: Number <= Variable or Number >= Variable
			const numberInequalityRegex =
				/(?<num>-?\d+(?:\.\d+)?)\s*(?<op>[<>]=?)\s*(?<var>[a-zA-Z]+)/g
			modifiedContent = modifiedContent.replace(
				numberInequalityRegex,
				(match: string, number: string, operator: string, variable: string) => {
					if (operator === "<=") {
						hasChanges = true
						return `${number} ≤ ${variable}`
					}
					if (operator === ">=") {
						hasChanges = true
						return `${number} ≥ ${variable}`
					}
					return match
				}
			)

			if (hasChanges) {
				generalFixCount++
				logger.debug("converted inequality to unicode in general content", {
					original: content.substring(0, 100),
					fixed: modifiedContent.substring(0, 100)
				})
			}

			return `>${modifiedContent}<`
		}
	)

	totalFixCount = qtiValueFixCount + generalFixCount

	if (totalFixCount > 0) {
		logger.info("MISSION CRITICAL: fixed unescaped inequalities", {
			totalFixCount,
			qtiValueFixCount,
			generalContentFixCount: generalFixCount,
			originalLength: xml.length,
			fixedLength: finalXml.length
		})
	}

	return finalXml
}
