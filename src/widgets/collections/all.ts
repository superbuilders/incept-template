import type { WidgetCollection } from "@/widgets/collections/types"
import { allWidgetDefinitions } from "@/widgets/definitions"

function toReadonlyKeys<T extends Record<string, unknown>>(
	obj: T
): ReadonlyArray<keyof T & string> {
	const keys = Object.keys(obj)
	// Narrow via a runtime check that keys are strings
	return keys.filter((k): k is keyof T & string => typeof k === "string")
}

export const allWidgetsCollection: WidgetCollection<
	typeof allWidgetDefinitions,
	ReadonlyArray<keyof typeof allWidgetDefinitions & string>
> = {
	name: "all",
	widgets: allWidgetDefinitions,
	widgetTypeKeys: toReadonlyKeys(allWidgetDefinitions)
} as const
