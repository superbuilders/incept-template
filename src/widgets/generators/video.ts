import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"

// 1. Zod Schema for Video Widget Properties
export const VideoPropsSchema = z
	.object({
		type: z.literal("video").describe("Identifies this as a video widget."),
		width: createWidthSchema(),
		height: createHeightSchema(),
		url: z
			.string()
			.url()
			.regex(/^https:/, "URL must use https://")
			.describe(
				"The full embed URL for the video (e.g., from YouTube). Must be an https:// URL."
			),
		fallbackText: z
			.string()
			.max(200)
			.nullable()
			.describe(
				"Optional fallback text displayed if the video cannot be rendered. Null for no text."
			)
	})
	.strict()

// 2. TypeScript Type from Schema
export type VideoProps = z.infer<typeof VideoPropsSchema>

// 3. Widget Generator Function
export const generateVideo: WidgetGenerator<typeof VideoPropsSchema> = async (
	data
) => {
	const validationResult = VideoPropsSchema.safeParse(data)
	if (!validationResult.success) {
		logger.error("video widget validation failed", {
			error: validationResult.error,
			data
		})
		throw errors.wrap(validationResult.error, "video widget validation")
	}

	const { width, height, url, fallbackText } = validationResult.data
	const fallback = fallbackText ? fallbackText : "Embedded video content."

	// Generate a standards-compliant <object> tag for embedding.
	const html = `<div class="video-container">
	<object type="text/html" data="${url}" width="${width}" height="${height}">
		${fallback}
	</object>
</div>`

	return html
}
