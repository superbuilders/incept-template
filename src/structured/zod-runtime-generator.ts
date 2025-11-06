import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"

/**
 * Recursively generates a Zod schema from a JavaScript object or value at runtime.
 *
 * NOTE: This function is now simpler because it expects an object that has already
 * had its arrays transformed into objects. It will not handle arrays directly.
 *
 * @param obj The object or value to generate a schema from.
 * @param visited A map to track visited objects to prevent infinite recursion from circular references.
 * @returns A Zod schema that validates the structure and types of the input object.
 * @throws {Error} When encountering unsupported types or circular references.
 */
export function generateZodSchemaFromObject(
	obj: unknown,
	visited = new Map<object, z.ZodTypeAny>(),
	processing = new Set<object>(),
	path: Array<string | number> = []
): z.ZodTypeAny {
	if (obj === null) {
		return z.null()
	}

	// Handle objects (including arrays) to check for circular references first.
	if (typeof obj === "object") {
		// Check if we already have a completed schema for this object
		if (visited.has(obj)) {
			const existingSchema = visited.get(obj)
			if (!existingSchema) {
				// CRITICAL: Map corruption - has() returned true but get() returned undefined
				logger.error("zod schema generation map corruption detected", {
					objType: typeof obj
				})
				throw errors.new(
					"zod schema generation: schema map corruption detected"
				)
			}
			return existingSchema
		}

		// Check if we're currently processing this object (circular reference)
		if (processing.has(obj)) {
			// CRITICAL: Circular reference detected - cannot generate schema
			logger.error("zod schema generation circular reference detected", {
				objType: typeof obj
			})
			throw errors.new("zod schema generation: circular reference detected")
		}

		// Mark this object as being processed
		processing.add(obj)
	}

	switch (typeof obj) {
		case "string":
			return z.string()
		case "number":
			return z.number()
		case "boolean":
			return z.boolean()
		case "undefined":
			return z.undefined()
		case "bigint":
			return z.bigint()
		case "object": {
			if (obj instanceof Date) {
				return z.date()
			}

			// MODIFIED: The entire `if (Array.isArray(obj))` block has been REMOVED.
			// This function will no longer receive arrays due to the pre-transformation.

			const shape: { [key: string]: z.ZodTypeAny } = {}
			// Use Object.entries to safely iterate over the object
			const entries = Object.entries(obj)
			// Compute some conservative parent metadata from entries without type assertions
			let parentType: string | undefined
			let parentHasIdentifier = false
			let parentHasCorrect = false
			for (const [k, v] of entries) {
				if (k === "type" && typeof v === "string") parentType = v
				if (k === "identifier" && typeof v === "string")
					parentHasIdentifier = true
				if (k === "correct") parentHasCorrect = true
			}

			for (const [key, value] of entries) {
				// Freeze specific identifier and scoring-related fields as literals to guarantee immutability
				if (key === "type" && typeof value === "string") {
					// Always freeze 'type' across the structure (widgets, interactions, content blocks)
					shape[key] = z.literal(value)
					continue
				}

				if (key === "slotId" && typeof value === "string") {
					// Freeze slotId only for slot objects to be conservative
					if (parentType === "blockSlot" || parentType === "inlineSlot") {
						shape[key] = z.literal(value)
						continue
					}
				}

				if (key === "responseIdentifier" && typeof value === "string") {
					// Freeze responseIdentifier only within interaction objects (including unsupportedInteraction)
					if (
						parentType === "choiceInteraction" ||
						parentType === "inlineChoiceInteraction" ||
						parentType === "textEntryInteraction" ||
						parentType === "orderInteraction" ||
						parentType === "unsupportedInteraction"
					) {
						shape[key] = z.literal(value)
						continue
					}
				}

				if (key === "shuffle" && typeof value === "boolean") {
					// Freeze shuffle only for interactions that define it
					if (
						parentType === "choiceInteraction" ||
						parentType === "inlineChoiceInteraction" ||
						parentType === "orderInteraction"
					) {
						shape[key] = z.literal(value)
						continue
					}
				}

				if (
					(key === "cardinality" || key === "baseType") &&
					typeof value === "string"
				) {
					// Freeze only for response declaration objects: heuristic check by sibling keys
					const lacksType = typeof parentType !== "string"
					const isLikelyResponseDeclaration =
						parentHasIdentifier && parentHasCorrect && lacksType
					const isInResponseDeclarationsPath = path.includes(
						"responseDeclarations"
					)
					if (isLikelyResponseDeclaration || isInResponseDeclarationsPath) {
						shape[key] = z.literal(value)
						continue
					}
				}

				shape[key] = generateZodSchemaFromObject(value, visited, processing, [
					...path,
					key
				])
			}

			// Create a strict object schema to disallow any extra properties.
			const schema = z.object(shape).strict()

			// Update the visited map with the final, fully-defined schema.
			visited.set(obj, schema)
			// Remove from processing set now that we're done
			processing.delete(obj)
			return schema
		}

		default:
			// CRITICAL: Unsupported type - FAIL FAST
			logger.error("zod schema generation unsupported type", {
				objType: typeof obj,
				obj
			})
			throw errors.new(
				`zod schema generation: unsupported type '${typeof obj}'`
			)
	}
}
