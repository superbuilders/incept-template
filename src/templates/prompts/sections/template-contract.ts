import type { Logger } from "@superbuilders/slog"
import { buildTemplateSkeleton } from "@/templates/skeleton"

export function createTemplateContract(
	logger: Logger,
	allowedWidgets: readonly string[]
): string {
	const skeleton = buildTemplateSkeleton(logger, allowedWidgets)
	return `### TEMPLATE_CONTRACT
<contract>
${skeleton.trim()}
</contract>`
}
