import { generateTemplateCandidate } from "@/inngest/functions/candidate/generation"
import { validateTemplateCandidate } from "@/inngest/functions/candidate/validation"
import { helloWorldFunction } from "@/inngest/functions/hello-world"
import { startTemplateGeneration } from "@/inngest/functions/template/generation"
import { scaffoldTemplateFunction } from "@/inngest/functions/template/scaffold"

export const functions = [
	scaffoldTemplateFunction,
	helloWorldFunction,
	startTemplateGeneration,
	generateTemplateCandidate,
	validateTemplateCandidate
]
