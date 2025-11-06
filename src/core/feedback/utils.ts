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
