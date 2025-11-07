import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"

type BaseSchema = z.core.JSONSchema.BaseSchema

function isBaseSchema(value: unknown): value is BaseSchema {
	return (
		value !== null &&
		value !== undefined &&
		typeof value === "object" &&
		!Array.isArray(value) &&
		Object.keys(value).length > 0
	)
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null
}

// Recursively remove 'propertyNames' which OpenAI's response_format rejects
function stripPropertyNames(node: z.core.JSONSchema._JSONSchema): void {
	if (node === true || node === false) return
	if (!isRecord(node)) return

	// Remove propertyNames if present at this level
	delete node.propertyNames

	const props = node.properties
	if (isRecord(props)) {
		for (const key of Object.keys(props)) {
			const child = props[key]
			if (child === true || child === false) continue
			if (isRecord(child)) stripPropertyNames(child)
		}
	}

	const items = node.items
	if (Array.isArray(items)) {
		for (const it of items) stripPropertyNames(it)
		for (const it of items) {
			if (it !== true && it !== false && isRecord(it)) stripPropertyNames(it)
		}
	} else if (items !== undefined) {
		const it = items
		if (it !== true && it !== false && isRecord(it)) stripPropertyNames(it)
	}

	const anyOf = node.anyOf
	if (Array.isArray(anyOf)) for (const s of anyOf) stripPropertyNames(s)
	const allOf = node.allOf
	if (Array.isArray(allOf)) for (const s of allOf) stripPropertyNames(s)
	const oneOf = node.oneOf
	if (Array.isArray(oneOf)) for (const s of oneOf) stripPropertyNames(s)

	const notSchema = node.not
	if (
		notSchema !== undefined &&
		notSchema !== true &&
		notSchema !== false &&
		isRecord(notSchema)
	) {
		stripPropertyNames(notSchema)
	}

	const addl = node.additionalProperties
	if (addl !== undefined && addl !== true && addl !== false && isRecord(addl))
		stripPropertyNames(addl)

	const defs = node.definitions
	if (isRecord(defs)) {
		for (const k of Object.keys(defs)) {
			const d = defs[k]
			if (isRecord(d)) stripPropertyNames(d)
		}
	}
	const $defs = node.$defs
	if (isRecord($defs)) {
		for (const k of Object.keys($defs)) {
			const d = $defs[k]
			if (isRecord(d)) stripPropertyNames(d)
		}
	}
}

// Hoisted normalization helper: ensure every object has an explicit properties: {} and additionalProperties: false
function ensureEmptyProperties(node: BaseSchema): void {
	if (!(typeof node === "object" && node !== null && !Array.isArray(node)))
		return

	// For object-type schemas, ensure properties exists and additionalProperties is false
	if (node.type === "object") {
		if (node.properties === undefined) {
			node.properties = {}
		}
		if (node.additionalProperties === undefined) {
			node.additionalProperties = false
		}
	}

	// Recurse into properties
	if (node.properties) {
		for (const key of Object.keys(node.properties)) {
			const child = node.properties[key]
			if (child && typeof child === "object" && !Array.isArray(child)) {
				ensureEmptyProperties(child)
			}
		}
	}

	// Recurse into items (single schema or tuple)
	const items = node.items
	if (Array.isArray(items)) {
		for (const it of items) {
			if (it && typeof it === "object" && !Array.isArray(it))
				ensureEmptyProperties(it)
		}
	} else if (items && typeof items === "object" && !Array.isArray(items)) {
		ensureEmptyProperties(items)
	}

	// Recurse combinators
	const combs = [node.anyOf, node.allOf, node.oneOf]
	for (const group of combs) {
		if (Array.isArray(group)) {
			for (const s of group) ensureEmptyProperties(s)
		}
	}

	// Recurse into not
	if (node.not && typeof node.not === "object" && !Array.isArray(node.not))
		ensureEmptyProperties(node.not)

	// Recurse into additionalProperties when it is a schema
	if (
		node.additionalProperties &&
		typeof node.additionalProperties === "object"
	) {
		ensureEmptyProperties(node.additionalProperties)
	}

	// Recurse into definitions / $defs
	const defs = node.definitions
	if (isRecord(defs)) {
		for (const key of Object.keys(defs)) {
			const d = defs[key]
			if (isBaseSchema(d)) ensureEmptyProperties(d)
		}
	}
	const defs2 = node.$defs
	if (isRecord(defs2)) {
		for (const key of Object.keys(defs2)) {
			const d = defs2[key]
			if (isBaseSchema(d)) ensureEmptyProperties(d)
		}
	}
}

/**
 * Converts a Zod schema to JSON Schema suitable for prompt-time usage.
 * - Recursively unwraps transform nodes by converting the inner (input) schema
 * - Uses io: "input" so prompt schemas reflect input shape
 * - Fails hard if conversion throws or produces an empty schema
 */
export function toJSONSchemaPromptSafe(schema: z.ZodType): BaseSchema {
	// Define options for JSON Schema conversion
	// io: "input" automatically unwraps transforms to their input schema
	const options: Parameters<typeof z.toJSONSchema>[1] = {
		target: "draft-2020-12",
		io: "input",
		unrepresentable: "any"
	}

	const result = errors.trySync(() => z.toJSONSchema(schema, options))
	if (result.error) {
		logger.error("json schema prompt-safe conversion", { error: result.error })
		throw errors.wrap(result.error, "json schema prompt-safe conversion")
	}
	const json = result.data
	if (!isBaseSchema(json)) {
		logger.error("json schema prompt-safe conversion produced invalid schema")
		throw errors.new("json schema conversion invalid")
	}

	// Remove propertyNames to satisfy OpenAI response_format validator
	stripPropertyNames(json)
	ensureEmptyProperties(json)
	return json
}
