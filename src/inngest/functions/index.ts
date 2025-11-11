import { generateAssessmentItem } from "@/inngest/functions/assessment/generation"
import { generateTemplateCandidate } from "@/inngest/functions/candidate/generation"
import { validateTemplateCandidate } from "@/inngest/functions/candidate/validation"
import { helloWorldFunction } from "@/inngest/functions/hello-world"
import { generateTemplateFully } from "@/inngest/functions/template/full"
import { startTemplateGeneration } from "@/inngest/functions/template/generation"
import { scaffoldTemplateFunction } from "@/inngest/functions/template/scaffold"

export const functions = [
	scaffoldTemplateFunction,
	generateTemplateFully,
	helloWorldFunction,
	startTemplateGeneration,
	generateTemplateCandidate,
	validateTemplateCandidate,
	generateAssessmentItem
]
