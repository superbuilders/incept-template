import * as logger from "@superbuilders/slog"
import { EventSchemas, Inngest, type Logger } from "inngest"
import { z } from "zod"
import { env } from "@/env"

const exemplarQuestionScaffoldInvokedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	exampleAssessmentItemBody: z.json(),
	metadata: z.json()
})

const exemplarQuestionTemplateGenerateFullSchema = z.object({
	exemplarQuestionId: z.uuid(),
	exampleAssessmentItemBody: z.json(),
	metadata: z.json().optional()
})

const helloWorldSchema = z.object({
	message: z.string().min(1)
})

const exemplarQuestionTemplateGenerateInvokedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const exemplarQuestionTemplateRevalidateInvokedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const templateGenerationInvokedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const templateTypecheckInvokedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const templateZeroSeedInvokedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const exemplarQuestionRevalidateAllInvokedSchema = z.object({
	reason: z.string().min(1)
})

const schema = {
	"template/exemplar-question.scaffold.invoked":
		exemplarQuestionScaffoldInvokedSchema,
	"template/exemplar-question.template.generate.full.invoked":
		exemplarQuestionTemplateGenerateFullSchema,
	"template/exemplar-question.template.generate.invoked":
		exemplarQuestionTemplateGenerateInvokedSchema,
	"template/exemplar-question.template.revalidate.invoked":
		exemplarQuestionTemplateRevalidateInvokedSchema,
	"template/template.generate.invoked": templateGenerationInvokedSchema,
	"template/template.typecheck.invoked": templateTypecheckInvokedSchema,
	"template/template.zero-seed.invoked": templateZeroSeedInvokedSchema,
	"template/exemplar-question.revalidate.all.invoked":
		exemplarQuestionRevalidateAllInvokedSchema,
	"template/hello": helloWorldSchema
}

const inngestLogger: Logger = {
	info: logger.info,
	warn: logger.warn,
	error: logger.error,
	debug: logger.debug
}

export const inngest = new Inngest({
	id: "template",
	schemas: new EventSchemas().fromSchema(schema),
	logger: inngestLogger,
	eventKey: env.INNGEST_EVENT_KEY,
	signingKey: env.INNGEST_SIGNING_KEY
})
