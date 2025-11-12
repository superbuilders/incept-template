import type { Logger } from "@superbuilders/slog"
import {
	createNegativeExampleSection,
	createPositiveExampleSection
} from "@/templates/prompts/sections/examples"
import { FEEDBACK_GUIDANCE_SECTION } from "@/templates/prompts/sections/feedback-guidance"
import { FEEDBACK_DIMENSION_SELECTION_SECTION } from "@/templates/prompts/sections/feedback-dimension-selection"
import { FEEDBACK_PLAN_GUARDRAILS_SECTION } from "@/templates/prompts/sections/feedback-plan-guardrails"
import { IDENTIFIER_GUIDANCE_SECTION } from "@/templates/prompts/sections/identifier-guidance"
import { LITERAL_BANS_SECTION } from "@/templates/prompts/sections/literal-bans"
import { NON_NULL_BANS_SECTION } from "@/templates/prompts/sections/non-null-bans"
import { createSourceContextSection } from "@/templates/prompts/sections/qti-source"
import { SEED_GUIDANCE_SECTION } from "@/templates/prompts/sections/seed-guidance"
import { createSeedHelpersSection } from "@/templates/prompts/sections/seed-helpers"
import { SYSTEM_INSTRUCTIONS_SECTION } from "@/templates/prompts/sections/system-instructions"
import { createTemplateContract } from "@/templates/prompts/sections/template-contract"
import { TEMPLATE_PHILOSOPHY_SECTION } from "@/templates/prompts/sections/template-philosophy"
import { TYPE_ASSERTION_BANS_SECTION } from "@/templates/prompts/sections/type-assertion-bans"
import {
	createAssessmentItemTypesSection,
	createContentTypesSection,
	createFeedbackAuthoringTypesSection,
	createFeedbackContentTypesSection,
	createFeedbackPlanSchemaSection,
	createFeedbackPlanTypesSection,
	createInteractionTypesSection
} from "@/templates/prompts/sections/type-definitions"
import { createWidgetGuidance } from "@/templates/prompts/sections/widget-guidance"
import {
	BASE_SYSTEM_PROMPT,
	type PromptArtifacts
} from "@/templates/prompts/shared"
import { createWidgetHelperSections } from "@/templates/widget-helpers"

export function composeInitialPrompt(
	logger: Logger,
	allowedWidgets: readonly string[],
	sourceContext: string
): PromptArtifacts {
	logger.debug("composing initial template prompt", { allowedWidgets })

	const baseSections = [
		SYSTEM_INSTRUCTIONS_SECTION,
		TEMPLATE_PHILOSOPHY_SECTION,
		SEED_GUIDANCE_SECTION,
		createSeedHelpersSection(),
		createWidgetGuidance(allowedWidgets),
		createTemplateContract(logger, allowedWidgets),
		createAssessmentItemTypesSection(),
		createContentTypesSection(),
		createInteractionTypesSection(),
		createFeedbackPlanTypesSection(),
		createFeedbackPlanSchemaSection(),
		createFeedbackContentTypesSection(),
		createFeedbackAuthoringTypesSection(),
		IDENTIFIER_GUIDANCE_SECTION,
		FEEDBACK_DIMENSION_SELECTION_SECTION,
		FEEDBACK_PLAN_GUARDRAILS_SECTION,
		FEEDBACK_GUIDANCE_SECTION,
		LITERAL_BANS_SECTION,
		NON_NULL_BANS_SECTION,
		TYPE_ASSERTION_BANS_SECTION,
		createSourceContextSection(sourceContext),
		createPositiveExampleSection(),
		createNegativeExampleSection()
	].filter((section): section is string => Boolean(section))

	const widgetHelperSections = createWidgetHelperSections(
		logger,
		allowedWidgets
	)

	const userPrompt = [...baseSections, ...widgetHelperSections].join("\n\n")

	return {
		systemPrompt: BASE_SYSTEM_PROMPT,
		userPrompt
	}
}
