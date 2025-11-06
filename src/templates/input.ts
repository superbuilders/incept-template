import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"

export type StructuredItem = {
	widgets?: Record<string, { type: string } | null> | null
	[key: string]: unknown
}

export type StructuredInput = {
	json: StructuredItem
	sourceContext: string
	allowedWidgets: readonly string[]
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function isWidgetMap(
	value: unknown
): value is Record<string, { type: string } | null> | null {
	if (value === null || value === undefined) return true
	if (!isPlainObject(value)) return false
	for (const entry of Object.values(value)) {
		if (entry === null) continue
		if (!isPlainObject(entry)) return false
		if (typeof entry.type !== "string") return false
	}
	return true
}

function isStructuredItem(input: unknown): input is StructuredItem {
	if (!isPlainObject(input)) return false
	if (!Reflect.has(input, "widgets")) return true
	return isWidgetMap(Reflect.get(input, "widgets"))
}

export function parseStructuredInput(
	logger: Logger,
	raw: string
): StructuredInput {
	const jsonResult = errors.trySync(() => JSON.parse(raw))
	if (jsonResult.error) {
		logger.error("failed to parse structured item json", {
			error: jsonResult.error
		})
		throw errors.wrap(jsonResult.error, "structured input: parse json")
	}

	if (!isStructuredItem(jsonResult.data)) {
		logger.error("structured item had invalid shape")
		throw errors.new(
			"structured item must be an object with an optional widgets map"
		)
	}

	const structured: StructuredItem = jsonResult.data
	const widgets = structured.widgets
	const allowedWidgets = widgets
		? Array.from(
				new Set(
					Object.values(widgets)
						.filter((widget): widget is { type: string } => Boolean(widget))
						.map((widget) => widget.type)
				)
			)
		: []

	return {
		json: structured,
		sourceContext: JSON.stringify(structured, null, 2),
		allowedWidgets
	}
}
