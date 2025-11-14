import { generateTemplateForExemplarQuestion } from "@/inngest/functions/exemplar-question/full"
import { startExemplarQuestionTemplateGeneration } from "@/inngest/functions/exemplar-question/generation"
import { revalidateLatestExemplarQuestionTemplate } from "@/inngest/functions/exemplar-question/revalidate"
import { revalidateAllValidatedExemplarQuestions } from "@/inngest/functions/exemplar-question/revalidate-all"
import { scaffoldExemplarQuestion } from "@/inngest/functions/exemplar-question/scaffold"
import { helloWorldFunction } from "@/inngest/functions/hello-world"
import { generateTemplate } from "@/inngest/functions/template/generation"
import { typecheckTemplate } from "@/inngest/functions/template/typecheck"
import { validateZeroSeed } from "@/inngest/functions/template/zero-seed"

export const functions = [
	scaffoldExemplarQuestion,
	generateTemplateForExemplarQuestion,
	helloWorldFunction,
	startExemplarQuestionTemplateGeneration,
	revalidateLatestExemplarQuestionTemplate,
	generateTemplate,
	typecheckTemplate,
	validateZeroSeed,
	revalidateAllValidatedExemplarQuestions
]
