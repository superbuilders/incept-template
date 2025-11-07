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
import type {
	EnumeratedFeedbackDimension,
	FeedbackCombination,
	FeedbackPlan
} from "@/core/feedback/plan/types"
import type {
	ChoiceIdentifierTuple,
	FeedbackCombinationIdentifier,
	ResponseIdentifier
} from "@/core/identifiers/types"
import type { AssessmentItemInput } from "@/core/item/types"
import { createSeededRandom } from "@/templates/seeds"

${widgetComment}
export type TemplateWidgets = readonly ${widgetTuple}

const PLAN_CHOICE_IDS = [] as const satisfies ChoiceIdentifierTuple<readonly []>

type TemplateDimensions = readonly [
	EnumeratedFeedbackDimension<ResponseIdentifier, typeof PLAN_CHOICE_IDS>
]

const FEEDBACK_DIMENSIONS = [] as TemplateDimensions

const FEEDBACK_COMBINATIONS = [] as const satisfies readonly FeedbackCombination<
	FeedbackCombinationIdentifier,
	TemplateDimensions
>[]

const feedbackPlan = {
	dimensions: FEEDBACK_DIMENSIONS,
	combinations: FEEDBACK_COMBINATIONS
} satisfies FeedbackPlan

type TemplateFeedbackPlan = typeof feedbackPlan
`

	const signature = `
export default function generateTemplate(
	seed: bigint
): AssessmentItemInput<TemplateWidgets, TemplateFeedbackPlan> {
	const random = createSeededRandom(seed)

	// Implementation must be deterministic, seed-driven, and pure.
	// Generate widgets, interactions, and feedback based solely on values derived from the seed.
}
`

	return `${header.trim()}\n\n${signature.trim()}\n`
}
