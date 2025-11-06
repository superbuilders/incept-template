import { z } from "zod"

export const VideoMetadataSchema = z
	.object({
		id: z.string(),
		type: z.literal("video"),
		title: z.string(),
		path: z.string(),
		youtubeId: z.string(),
		durationSeconds: z.number().int().positive(),
		description: z.string(),
		unitId: z.string(),
		lessonId: z.string(),
		order: z.number().int().positive(),
		titleHint: z.string().optional(),
		contextHtml: z.string().optional()
	})
	.strict()

export type VideoMetadata = z.infer<typeof VideoMetadataSchema>
