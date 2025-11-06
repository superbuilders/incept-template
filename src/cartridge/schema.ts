import { z } from "zod"

export const QuestionRefSchema = z
	.object({
		number: z.number(),
		xml: z.string(),
		json: z.string()
	})
	.strict()

export const ResourceArticleSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		type: z.literal("article"),
		path: z.string()
	})
	.strict()

export const ResourceVideoSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		type: z.literal("video"),
		path: z.string(),
		youtubeId: z.string(),
		durationSeconds: z.number().int().positive(),
		description: z.string()
	})
	.strict()

export const ResourceQuizSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		type: z.literal("quiz"),
		path: z.string(),
		questionCount: z.number(),
		questions: z.array(QuestionRefSchema)
	})
	.strict()

export const ResourceSchema = z.discriminatedUnion("type", [
	ResourceArticleSchema,
	ResourceVideoSchema,
	ResourceQuizSchema
])

export const LessonSchema = z
	.object({
		id: z.string(),
		unitId: z.string(),
		lessonNumber: z.number(),
		title: z.string(),
		resources: z.array(ResourceSchema)
	})
	.strict()

export const UnitSchema = z
	.object({
		id: z.string(),
		unitNumber: z.number(),
		title: z.string(),
		lessons: z.array(
			z
				.object({
					id: z.string(),
					lessonNumber: z.number(),
					title: z.string(),
					path: z.string()
				})
				.strict()
		),
		unitTest: z
			.object({
				id: z.string(),
				title: z.string(),
				path: z.string(),
				questionCount: z.number(),
				questions: z.array(QuestionRefSchema)
			})
			.strict()
			.optional(),
		counts: z
			.object({
				lessonCount: z.number(),
				resourceCount: z.number(),
				questionCount: z.number()
			})
			.strict()
	})
	.strict()

export const IndexV1Schema = z
	.object({
		version: z.literal(1),
		generatedAt: z.string(),
		generator: z
			.object({
				name: z.string(),
				version: z.string(),
				commit: z.string().optional()
			})
			.strict(),
		course: z.object({ title: z.string(), subject: z.string() }).strict(),
		units: z.array(
			z
				.object({
					id: z.string(),
					unitNumber: z.number(),
					title: z.string(),
					path: z.string()
				})
				.strict()
		)
	})
	.strict()

export const IntegritySchema = z
	.object({
		algorithm: z.literal("sha256"),
		files: z.record(
			z.string(),
			z.object({ size: z.number(), sha256: z.string() }).strict()
		)
	})
	.strict()
