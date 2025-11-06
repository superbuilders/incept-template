import type { z } from "zod"

/**
 * Generic widget generator function type.
 * Takes validated data and returns a string representation (typically SVG or HTML).
 */
export type WidgetGenerator<TSchema extends z.ZodType> = (
	data: z.infer<TSchema>
) => Promise<string>
