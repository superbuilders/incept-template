import * as logger from "@superbuilders/slog"
import { EventSchemas, Inngest, type Logger } from "inngest"
import { z } from "zod"
import { env } from "@/env"

const templateScaffoldRequestedSchema = z.object({
	templateId: z.uuid(),
	exampleAssessmentItemBody: z.json(),
	metadata: z.json()
})

const templateScaffoldCompletedSchema = z.object({
	templateId: z.uuid()
})

const templateScaffoldFailedSchema = z.object({
	templateId: z.uuid(),
	reason: z.string().min(1)
})

const helloWorldSchema = z.object({
	message: z.string().min(1)
})

const templateGenerationRequestedSchema = z.object({
	templateId: z.uuid()
})

const templateCandidateGenerationRequestedSchema = z.object({
	templateId: z.uuid(),
	attempt: z.number().int().min(0)
})

const templateCandidateValidationRequestedSchema = z.object({
	templateId: z.uuid(),
	attempt: z.number().int().min(0)
})

const templateCandidateValidationCompletedSchema = z.object({
	templateId: z.uuid(),
	attempt: z.number().int().min(0),
	diagnosticsCount: z.number().int().min(0)
})

const templateCandidateGenerationFailedSchema = z.object({
	templateId: z.uuid(),
	attempt: z.number().int().min(0),
	reason: z.string().min(1)
})

const templateGenerationCompletedSchema = z.object({
	templateId: z.uuid(),
	attempt: z.number().int().min(0)
})

const templateGenerationFailedSchema = z.object({
	templateId: z.uuid(),
	attempt: z.number().int().min(0),
	reason: z.string().min(1)
})

const questionBatchRequestedSchema = z.object({
	jobId: z.uuid(),
	templateId: z.uuid(),
	desiredCount: z.number().int().min(1)
})

const questionBatchCompletedSchema = z.object({
	jobId: z.uuid(),
	templateId: z.uuid(),
	fulfilledCount: z.number().int().min(0)
})

const questionBatchFailedSchema = z.object({
	jobId: z.uuid(),
	templateId: z.uuid(),
	reason: z.string().min(1)
})

const schema = {
	"template/template.scaffold.requested": templateScaffoldRequestedSchema,
	"template/template.scaffold.completed": templateScaffoldCompletedSchema,
	"template/template.scaffold.failed": templateScaffoldFailedSchema,
	"template/template.generation.requested": templateGenerationRequestedSchema,
	"template/template.generation.completed": templateGenerationCompletedSchema,
	"template/template.generation.failed": templateGenerationFailedSchema,
	"template/candidate.generation.requested":
		templateCandidateGenerationRequestedSchema,
	"template/candidate.generation.failed":
		templateCandidateGenerationFailedSchema,
	"template/candidate.validation.requested":
		templateCandidateValidationRequestedSchema,
	"template/candidate.validation.completed":
		templateCandidateValidationCompletedSchema,
	"template/question.batch.requested": questionBatchRequestedSchema,
	"template/question.batch.completed": questionBatchCompletedSchema,
	"template/question.batch.failed": questionBatchFailedSchema,
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
