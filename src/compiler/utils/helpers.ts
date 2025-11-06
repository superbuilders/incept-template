import { typedSchemas } from "@/widgets/registry"

/**
 * Calculates the greatest common divisor (GCD) of two numbers using the Euclidean algorithm.
 * @param a The first number.
 * @param b The second number.
 * @returns The GCD of a and b.
 */
export function gcd(a: number, b: number): number {
	return b === 0 ? a : gcd(b, a % b)
}

/**
 * Determines if a fraction results in a terminating decimal.
 * A fraction terminates if and only if the prime factors of its simplified denominator are only 2s and 5s.
 * @param numerator The numerator of the fraction.
 * @param denominator The denominator of the fraction.
 * @returns True if the fraction terminates, false otherwise.
 */
export function isTerminatingFraction(
	numerator: number,
	denominator: number
): boolean {
	if (denominator === 0) {
		return false
	}
	// Simplify the fraction by dividing by the GCD.
	const commonDivisor = gcd(Math.abs(numerator), Math.abs(denominator))
	let simplifiedDen = Math.abs(denominator) / commonDivisor

	// The fraction terminates if the simplified denominator's prime factors are only 2 and 5.
	while (simplifiedDen % 2 === 0) {
		simplifiedDen /= 2
	}
	while (simplifiedDen % 5 === 0) {
		simplifiedDen /= 5
	}

	return simplifiedDen === 1
}

export function encodeDataUri(content: string): string {
	const base64 = btoa(unescape(encodeURIComponent(content)))
	const isSvg = content.trim().startsWith("<svg")
	return `${isSvg ? "data:image/svg+xml" : "data:text/html"};base64,${base64}`
}

// Helper function to check if a string is a valid widget type
export function isValidWidgetType(
	type: string
): type is keyof typeof typedSchemas {
	return type in typedSchemas
}

/**
 * Attempts to approximate simple multiplicative/divisive expressions that include π or pi
 * by replacing pi with the provided approximation (default 3.14) and evaluating the expression.
 *
 * Supported forms (case-insensitive for "pi"):
 * - "144*pi", "pi*144", "144pi" (implicit multiplication), "pi144" (rare, but treated as pi*144)
 * - Chains with '*' and '/' only, e.g. "3/2*pi", "pi/4", "6*pi/5", "(144) * (pi)"
 * Parentheses are allowed but only for grouping; no addition/subtraction is supported.
 *
 * Returns a normalized decimal string if evaluation succeeds, otherwise null.
 */
export function tryApproximatePiProduct(
	rawExpr: string,
	piApprox = 3.14
): string | null {
	if (typeof rawExpr !== "string" || rawExpr.trim() === "") return null

	// Quick check: must contain a pi token of some sort
	const containsPi = /\bpi\b/i.test(rawExpr) || rawExpr.includes("π")
	if (!containsPi) return null

	// Normalize: insert explicit * for implicit numeric-pi adjacency in common cases
	const expr = rawExpr
		// insert * between number and pi (e.g., 144pi -> 144*pi)
		.replace(/(\d)\s*(π|\bpi\b)/gi, "$1*$2")
		// and between pi and number (e.g., pi144 -> pi*144)
		.replace(/(π|\bpi\b)\s*(\d)/gi, "$1*$2")
		// remove whitespace
		.replace(/\s+/g, "")
		// drop parentheses (multiplicative-only evaluation does not require them)
		.replace(/[()]/g, "")
		// normalize 'pi' variants to numeric approximation
		.replace(/π/gi, String(piApprox))
		.replace(/\bpi\b/gi, String(piApprox))

	// After substitution, we only allow digits, '.', '*', '/' characters
	if (/[^0-9.*/]/.test(expr)) return null
	// Disallow addition/subtraction in this lightweight evaluator
	if (/[+-]/.test(expr)) return null
	// Must still contain the approximation value to ensure we actually used pi
	if (!expr.includes(String(piApprox))) return null

	// Split into tokens by * and / and evaluate left-to-right (* and / are same precedence)
	const parts: string[] = expr.split(/([*/])/)
	if (parts.length === 0) return null

	// Validate tokens
	for (let i = 0; i < parts.length; i++) {
		const t = parts[i]
		if (i % 2 === 0) {
			// operand
			if (t === "" || Number.isNaN(Number(t))) return null
		} else {
			// operator must be * or /
			if (t !== "*" && t !== "/") return null
		}
	}

	let acc = Number(parts[0])
	for (let i = 1; i < parts.length; i += 2) {
		const op = parts[i]
		const rhs = Number(parts[i + 1])
		if (op === "*") acc = acc * rhs
		else {
			if (rhs === 0) return null
			acc = acc / rhs
		}
	}

	// Normalize number to a compact string while preserving significant digits
	// Avoid scientific notation for typical classroom values
	const normalizeNumberString = () => {
		const maybeFixed = acc.toFixed(10) // limit noise
		// trim trailing zeros
		const trimmed = maybeFixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1")
		return trimmed
	}
	const asString = normalizeNumberString()

	// Add a guard: must be a finite number
	if (!Number.isFinite(Number(asString))) return null
	return asString
}

/**
 * Normalizes a string part for use in a derived QTI identifier.
 * Converts to upper snake case and removes invalid characters.
 * @param part The string part to normalize.
 * @returns The normalized string.
 */
export function normalizeIdPart(part: string): string {
	return part.toUpperCase().replace(/[^A-Z0-9_]/g, "_")
}

/**
 * Derives a deterministic, QTI-safe combo identifier from a path of response parts.
 * @param pathParts An array of strings, where each string is a response-value pair (e.g., "RESPONSE_1_A").
 * @returns The fully-formed combo identifier (e.g., "FB__RESPONSE_1_A__RESPONSE_2_CORRECT").
 */
export function deriveComboIdentifier(pathParts: string[]): string {
	return `FB__${pathParts.join("__")}`
}
