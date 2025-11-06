import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type {
	WidgetCollection,
	WidgetDefinition
} from "@/widgets/collections/types"

/**
 * Creates a subset WidgetCollection from a parent collection, filtered to include only
 * the specified widget types. This enables passing minimal schemas to AI prompts instead
 * of sending irrelevant widget definitions.
 *
 * @param parentCollection The source collection to filter from.
 * @param widgetTypeNames Array of widget type names to include in the subset.
 * @returns A new WidgetCollection containing only the specified widgets.
 */
export function createSubsetCollection<
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		readonly string[]
	>
>(
	parentCollection: C,
	widgetTypeNames: ReadonlyArray<C["widgetTypeKeys"][number]>
): WidgetCollection<
	Record<string, WidgetDefinition<unknown, unknown>>,
	ReadonlyArray<C["widgetTypeKeys"][number]>
> {
	// Validate all requested types exist in parent
	for (const typeName of widgetTypeNames) {
		if (!(typeName in parentCollection.widgets)) {
			logger.error("widget type not found in parent collection", {
				typeName,
				parentCollection: parentCollection.name,
				availableTypes: parentCollection.widgetTypeKeys
			})
			throw errors.new(
				`widget type '${typeName}' not found in collection '${parentCollection.name}'`
			)
		}
	}

	// Build the subset widgets map
	const subsetWidgets: Record<string, WidgetDefinition<unknown, unknown>> = {}
	for (const typeName of widgetTypeNames) {
		const widget = parentCollection.widgets[typeName]
		if (!widget) {
			logger.error("widget definition missing despite existence check", {
				typeName
			})
			throw errors.new("widget definition missing")
		}
		subsetWidgets[typeName] = widget
	}

	return {
		name: `${parentCollection.name}-subset`,
		widgets: subsetWidgets,
		widgetTypeKeys: widgetTypeNames
	}
}
