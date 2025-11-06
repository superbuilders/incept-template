export function createSourceContextSection(rawContext: string): string {
	const trimmed = rawContext.trim()
	if (trimmed.length === 0) {
		return ""
	}
	return `### SOURCE_CONTEXT
<source reference="authoring_input" caution="Do not copy text verbatim. Reinterpret and compute values instead.">
${trimmed}
</source>`
}
