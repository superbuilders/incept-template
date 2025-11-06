import type { TypeScriptDiagnostic } from "@/templates/types"

export function createRetryDiagnosticsSection(
	diagnostics: TypeScriptDiagnostic[]
): string {
	if (diagnostics.length === 0) {
		return ""
	}

	const rendered = diagnostics
		.map(
			(d) =>
				`  <diagnostic line="${d.line}" column="${d.column}" code="TS${d.tsCode}">${d.message}</diagnostic>`
		)
		.join("\n")

	return `### RETRY_DIAGNOSTICS
<diagnostics>
${rendered}
</diagnostics>`
}
