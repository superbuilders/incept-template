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

const exemplarQuestionTemplateGenerateRequestedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const templateGenerateRequestedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const templateValidateRequestedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const templateValidateCompletedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	diagnosticsCount: z.number().int().min(0),
	templateId: z.uuid()
})

const templateZeroSeedRequestedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const templateZeroSeedCompletedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const templateZeroSeedFailedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid(),
	reason: z.string().min(1)
})

const exemplarQuestionGenerateAllRequestedSchema = z.object({
	reason: z.string().min(1)
})

const templateGenerateFailedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid(),
	reason: z.string().min(1)
})

const exemplarQuestionTemplateGenerateCompletedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid()
})

const exemplarQuestionTemplateGenerateFailedSchema = z.object({
	exemplarQuestionId: z.uuid(),
	templateId: z.uuid(),
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
	"template/exemplar-question.template.generate.requested":
		exemplarQuestionTemplateGenerateRequestedSchema,
	"template/exemplar-question.template.generate.completed":
		exemplarQuestionTemplateGenerateCompletedSchema,
	"template/exemplar-question.template.generate.failed":
		exemplarQuestionTemplateGenerateFailedSchema,
	"template/template.generate.requested": templateGenerateRequestedSchema,
	"template/template.generate.failed": templateGenerateFailedSchema,
	"template/template.validate.requested": templateValidateRequestedSchema,
	"template/template.validate.completed": templateValidateCompletedSchema,
	"template/template.zero-seed.requested": templateZeroSeedRequestedSchema,
	"template/template.zero-seed.completed": templateZeroSeedCompletedSchema,
	"template/template.zero-seed.failed": templateZeroSeedFailedSchema,
	"template/exemplar-question.generate.all.requested":
		exemplarQuestionGenerateAllRequestedSchema,
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
