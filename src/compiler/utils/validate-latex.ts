import * as errors from "@superbuilders/errors"
import type * as logger from "@superbuilders/slog"

/**
 * Validates that no LaTeX content is present in the compiled QTI XML.
 * LaTeX should be converted to MathML for proper QTI compliance.
 * Throws an error if LaTeX is detected.
 */
export function validateNoLatex(xml: string, logger: logger.Logger): void {
	// Check #1: Look for command-like LaTeX (e.g., \frac, \sqrt)
	const latexCommandRegex = /\\(?:[a-zA-Z]+|[(){}[\]])/
	const latexCommandMatch = xml.match(latexCommandRegex)
	if (latexCommandMatch) {
		const contextIndex = latexCommandMatch.index ?? 0
		const errorContext = xml.substring(
			Math.max(0, contextIndex - 50),
			Math.min(xml.length, contextIndex + 100)
		)
		logger.error("found latex command-like content in compiled xml", {
			match: latexCommandMatch[0],
			context: errorContext
		})
		throw errors.new(
			`invalid content: LaTeX command-like content is not allowed in QTI. Use MathML instead. Found: "${latexCommandMatch[0]}". Context: "...${errorContext}..."`
		)
	}

	// Check #2: Look for dollar-sign delimited LaTeX (e.g., $x^2$)
	// First find all potential dollar-sign pairs, then check if they contain math
	const dollarPairRegex = /\$(?<content>[^$]+)\$/g
	let match: RegExpExecArray | null

	match = dollarPairRegex.exec(xml)
	while (match !== null) {
		if (match.groups?.content) {
			const content = match.groups.content

			// Check if this looks like a mathematical expression rather than currency
			const isCurrency = /^[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{1,2})?$/.test(
				content.trim()
			)

			if (!isCurrency) {
				// Check for mathematical indicators
				const hasMathIndicators =
					// LaTeX commands
					/\\[a-zA-Z]+/.test(content) ||
					// Superscript or subscript notation
					/[a-zA-Z0-9][_^]/.test(content) ||
					// Variables with operators
					/[a-zA-Z]\s*[+\-*/=]\s*[a-zA-Z0-9]/.test(content) ||
					// Numbers followed by variables (like 2x, 3y)
					/\d+[a-zA-Z]/.test(content) ||
					// Mathematical functions
					/(?:sin|cos|tan|log|ln|sqrt|lim|sum|int)\s*\(/.test(content) ||
					// Fractions or mathematical structures
					/[a-zA-Z0-9]\s*\/\s*[a-zA-Z0-9]/.test(content) ||
					// Greek letters or special math symbols in the content
					/[αβγδεζηθικλμνξοπρστυφχψω]/.test(content) ||
					// Common math patterns
					/[xy]\s*=/.test(content) ||
					// Parentheses with mathematical content
					/\([^)]*[a-zA-Z+\-*/^][^)]*\)/.test(content)

				if (hasMathIndicators) {
					const contextIndex = match.index ?? 0
					const errorContext = xml.substring(
						Math.max(0, contextIndex - 50),
						Math.min(xml.length, contextIndex + 100)
					)
					logger.error(
						"found dollar-sign delimited latex content in compiled xml",
						{
							match: match[0],
							content: content,
							context: errorContext
						}
					)
					throw errors.new(
						`invalid content: Dollar-sign delimited LaTeX ('$...$') is not allowed in QTI. All math must be converted to MathML. Found: "${match[0]}". Context: "...${errorContext}..."`
					)
				}
			}
		}

		match = dollarPairRegex.exec(xml)
	}

	logger.debug("validated no latex content in compiled xml")
}
