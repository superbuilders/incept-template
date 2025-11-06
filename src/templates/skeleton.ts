import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"

export function buildTemplateSkeleton(
	logger: Logger,
	widgetKeys: readonly string[]
): string {
	logger.info("building template skeleton", { widgetKeys })

	if (widgetKeys.length > 1) {
		logger.error("build template skeleton received more than one widget key", {
			widgetKeys
		})
		throw errors.new("buildTemplateSkeleton expects zero or one widget key")
	}

	const widgetTuple = widgetKeys.length === 0 ? "[]" : `["${widgetKeys[0]}"]`
	const widgetComment =
		widgetKeys.length === 0
			? "// Widgets: none (widget-free template)"
			: `// Widgets: ["${widgetKeys[0]}"]`

	const header = `
import type { FeedbackContent } from "@/core/content/types"
import type { FeedbackPlan } from "@/core/feedback/plan/types"
import type { AssessmentItemInput } from "@/core/item/types"
import { createSeededRandom } from "@/templates/seeds"

${widgetComment}
export type TemplateWidgets = readonly ${widgetTuple}
`

	const signature = `
export default function generateTemplate(
	seed: bigint
): AssessmentItemInput<TemplateWidgets> {
	// Implementation must be deterministic, seed-driven, and pure.
	// Generate widgets, interactions, and feedback based solely on values derived from the seed.
}
`

	return `${header.trim()}\n\n${signature.trim()}\n`
}
