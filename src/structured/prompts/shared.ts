import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import { toJSONSchemaPromptSafe } from "@/core/json-schema/to-json-schema"
import type {
	WidgetCollection,
	WidgetDefinition
} from "@/widgets/collections/types"

// Runtime type guard to ensure values are Zod schemas without using type assertions
function isZodSchema(value: unknown): value is z.ZodType<unknown> {
	return value instanceof z.ZodType
}

/**
 * Generates the reusable markdown section for widget selection instructions.
 */
export function createWidgetSelectionPromptSection<
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		readonly string[]
	>
>(collection: C): string {
	const allowedWidgetTypes = collection.widgetTypeKeys
	const widgetSchemas: Record<string, object> = {}

	// Iterate over widget definitions to extract schemas
	for (const key of collection.widgetTypeKeys) {
		const schemaEntry = collection.widgets[key].schema
		if (!isZodSchema(schemaEntry)) {
			logger.error("collection schema not a zod type", {
				key,
				collectionName: collection.name
			})
			throw errors.new("invalid widget schema")
		}

		const jsonResult = errors.trySync(() => toJSONSchemaPromptSafe(schemaEntry))
		if (jsonResult.error) {
			logger.error("widget schema json conversion", {
				key,
				error: jsonResult.error
			})
			throw errors.wrap(jsonResult.error, "widget schema json conversion")
		}
		widgetSchemas[key] = jsonResult.data
	}
	const widgetSchemasJson = JSON.stringify(widgetSchemas, null, 2)

	return `
## Available Widget Types and Schemas
You MUST choose a \`widgetType\` from this exact list: \`[${Array.from(
		allowedWidgetTypes
	)
		.map((t) => `"${t}"`)
		.join(", ")}]\`.
Here are the FULL JSON schemas for each available widget:
\`\`\`json
${widgetSchemasJson}
\`\`\`
`
}

/**
 * Format unified context sections for all prompts
 */
export function formatUnifiedContextSections(
	envelope: { primaryContent: string; supplementaryContent: string[] },
	imageContext: { imageUrls: string[] }
): string {
	const sections: string[] = []

	sections.push("## Primary Content:")
	sections.push("```")
	sections.push(envelope.primaryContent)
	sections.push("```")

	if (
		envelope.supplementaryContent &&
		envelope.supplementaryContent.length > 0
	) {
		sections.push("\n## Supplementary Content:")
		for (let i = 0; i < envelope.supplementaryContent.length; i++) {
			sections.push(`\n### Supplement ${i + 1}:`)
			sections.push("```")
			sections.push(envelope.supplementaryContent[i])
			sections.push("```")
		}
	}

	if (imageContext.imageUrls && imageContext.imageUrls.length > 0) {
		sections.push("\n## Visual Context:")
		sections.push("Raster images are attached as multimodal inputs for vision.")
		sections.push(
			"Use these images to understand visual content that will be represented by widgets."
		)
	}

	return sections.join("\n")
}
