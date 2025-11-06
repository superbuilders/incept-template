import type { Logger } from "@superbuilders/slog"
import {
	createNegativeExampleSection,
	createPositiveExampleSection
} from "@/templates/prompts/sections/examples"
import { FEEDBACK_GUIDANCE_SECTION } from "@/templates/prompts/sections/feedback-guidance"
import { IDENTIFIER_GUIDANCE_SECTION } from "@/templates/prompts/sections/identifier-guidance"
import { LITERAL_BANS_SECTION } from "@/templates/prompts/sections/literal-bans"
import { NON_NULL_BANS_SECTION } from "@/templates/prompts/sections/non-null-bans"
import { createSourceContextSection } from "@/templates/prompts/sections/qti-source"
import { createRetryDiagnosticsSection } from "@/templates/prompts/sections/retry-hints"
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
	createFeedbackPlanSchemaSection,
	createFeedbackPlanTypesSection,
	createInteractionTypesSection
} from "@/templates/prompts/sections/type-definitions"
import { createWidgetGuidance } from "@/templates/prompts/sections/widget-guidance"
import {
	BASE_SYSTEM_PROMPT,
	type PromptArtifacts
} from "@/templates/prompts/shared"
import type { TypeScriptDiagnostic } from "@/templates/types"
import { createWidgetHelperSections } from "@/templates/widget-helpers"

export function composeRetryPrompt(
	logger: Logger,
	allowedWidgets: readonly string[],
	sourceContext: string,
	previousCode: string,
	diagnostics: TypeScriptDiagnostic[]
): PromptArtifacts {
	logger.debug("composing retry template prompt", {
		allowedWidgets,
		diagnosticsCount: diagnostics.length
	})

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
		createFeedbackAuthoringTypesSection(),
		IDENTIFIER_GUIDANCE_SECTION,
		FEEDBACK_GUIDANCE_SECTION,
		LITERAL_BANS_SECTION,
		NON_NULL_BANS_SECTION,
		TYPE_ASSERTION_BANS_SECTION,
		createRetryDiagnosticsSection(diagnostics),
		createSourceContextSection(sourceContext),
		createPositiveExampleSection(["fraction-addition"]),
		createNegativeExampleSection([
			"shuffled_twice",
			"prompt_spacing",
			"readonly_choice_ids",
			"interaction_replacement",
			"fraction_feedback_outdated",
			"feedback_plan_generic"
		])
	].filter((section): section is string => Boolean(section))

	const widgetHelperSections = createWidgetHelperSections(
		logger,
		allowedWidgets
	)

	const previousBlock = `### PREVIOUS_ATTEMPT
<previous_code>
${previousCode.trim()}
</previous_code>`

	const userPrompt = `${[...baseSections, ...widgetHelperSections].join(
		"\n\n"
	)}\n\n${previousBlock}`

	return {
		systemPrompt: BASE_SYSTEM_PROMPT,
		userPrompt
	}
}
