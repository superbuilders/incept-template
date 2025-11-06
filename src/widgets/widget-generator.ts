import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type { z } from "zod"
import type {
	WidgetCollection,
	WidgetDefinition
} from "@/widgets/collections/types"

// Type guard to safely check if a key exists in a collection's widgets.
function hasWidget<
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		readonly string[]
	>,
	K extends string
>(collection: C, key: K): key is K & keyof C["widgets"] {
	return key in collection.widgets
}

// Pure dispatcher: assumes data has already been validated upstream against the matching schema.
export async function generateWidget<
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		readonly string[]
	>,
	K extends keyof C["widgets"] & string
>(
	collection: C,
	widgetType: K,
	data: z.infer<C["widgets"][K]["schema"]>
): Promise<string> {
	if (!hasWidget(collection, widgetType)) {
		logger.error("widget type not found in provided collection", {
			widgetType,
			collectionName: collection.name
		})
		throw errors.new("widget type not found in collection")
	}
	const definition = collection.widgets[widgetType]
	return await definition.generator(data)
}
