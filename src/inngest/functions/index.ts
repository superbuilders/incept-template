import { generateTemplateForExemplarQuestion } from "@/inngest/functions/exemplar-question/full"
import { startExemplarQuestionTemplateGeneration } from "@/inngest/functions/exemplar-question/generation"
import { scaffoldExemplarQuestion } from "@/inngest/functions/exemplar-question/scaffold"
import { helloWorldFunction } from "@/inngest/functions/hello-world"
import { generateTemplate } from "@/inngest/functions/template/generation"
import { validateTemplate } from "@/inngest/functions/template/validation"

export const functions = [
	scaffoldExemplarQuestion,
	generateTemplateForExemplarQuestion,
	helloWorldFunction,
	startExemplarQuestionTemplateGeneration,
	generateTemplate,
	validateTemplate
]
