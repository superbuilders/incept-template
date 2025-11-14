import * as logger from "@superbuilders/slog"
import { EventSchemas, Inngest, type Logger } from "inngest"
import { z } from "zod"
import { env } from "@/env"

const exemplarQuestionScaffoldRequestedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	exampleAssessmentItemBody: z.json(),
	metadata: z.json()
})

const exemplarQuestionScaffoldCompletedSchema = z.object({
	exemplarQuestionId: z.uuid()
})

const exemplarQuestionScaffoldFailedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	reason: z.string().min(1)
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

const exemplarQuestionRevalidateAllRequestedSchema = z.object({
	reason: z.string().min(1)
})

const schema = {
	"template/exemplar-question.scaffold.requested":
		exemplarQuestionScaffoldRequestedSchema,
	"template/exemplar-question.scaffold.completed":
		exemplarQuestionScaffoldCompletedSchema,
	"template/exemplar-question.scaffold.failed":
		exemplarQuestionScaffoldFailedSchema,
	"template/exemplar-question.template.generate.full":
		exemplarQuestionTemplateGenerateFullSchema,
	"template/exemplar-question.template.generate.invoked":
		exemplarQuestionTemplateGenerateInvokedSchema,
	"template/exemplar-question.template.revalidate.invoked":
		exemplarQuestionTemplateRevalidateInvokedSchema,
	"template/template.generate.invoked": templateGenerationInvokedSchema,
	"template/template.typecheck.invoked": templateTypecheckInvokedSchema,
	"template/template.zero-seed.invoked": templateZeroSeedInvokedSchema,
	"template/exemplar-question.revalidate.all.requested":
		exemplarQuestionRevalidateAllRequestedSchema,
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
