import type { z } from "zod"

/**
 * A fully-typed, self-contained definition for a widget. This object pairs a Zod schema
 * with a pure generator function, ensuring that the generator only ever receives
 * pre-validated, correctly-typed data.
 *
 * @template Output The type of the validated and transformed data (what the generator receives).
 * @template Input The raw input type that the schema accepts before validation. Defaults to Output.
 */
export interface WidgetDefinition<Output, Input = Output> {
	readonly schema: z.ZodType<Output, Input>
	generator(data: Output): Promise<string>
}

/**
 * A collection of widget definitions. The generic `T` allows for creating collections
 * that contain any combination of valid WidgetDefinitions.
 *
 * @template T A record mapping widget type names to their WidgetDefinition.
 */
export type WidgetCollection<
	T extends Record<string, WidgetDefinition<unknown, unknown>> = Record<
		string,
		WidgetDefinition<unknown, unknown>
	>,
	K extends ReadonlyArray<keyof T & string> = ReadonlyArray<keyof T & string>
> = {
	readonly name: string
	readonly widgets: T
	readonly widgetTypeKeys: K
}

/**
 * A helper type to infer a readonly tuple of widget type names from a collection.
 * This replaces the previous redundant `widgetTypeKeys` array.
 */
export type WidgetTypeTupleFrom<
	C extends WidgetCollection<Record<string, WidgetDefinition<unknown, unknown>>>
> = C["widgetTypeKeys"]

/**
 * Generic widget type tuple used by content/item generics.
 */
export type WidgetTypeTuple = readonly string[]
