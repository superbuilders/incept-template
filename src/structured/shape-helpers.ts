// src/structured/shape-helpers.ts

const ARRAY_KEY_PREFIX = "__sb_idx__"
const ARRAY_EMPTY_SENTINEL = "__sb_empty_array__"

function isPlainRecord(value: unknown): value is Record<string, unknown> {
	if (typeof value !== "object" || value === null) return false
	const proto = Object.getPrototypeOf(value)
	return proto === Object.prototype || proto === null
}

/**
 * Recursively transforms arrays into objects using a safe, prefixed key.
 * This creates a rigid, unambiguous structure ideal for schema generation.
 * e.g., ["a", "b"] -> { "__sb_idx__0": "a", "__sb_idx__1": "b" }
 */
export function transformArraysToObjects(data: unknown): unknown {
	if (Array.isArray(data)) {
		if (data.length === 0) {
			return { [ARRAY_EMPTY_SENTINEL]: true }
		}
		const newObj: Record<string, unknown> = {}
		for (let i = 0; i < data.length; i++) {
			newObj[`${ARRAY_KEY_PREFIX}${i}`] = transformArraysToObjects(data[i])
		}
		return newObj
	}
	if (isPlainRecord(data)) {
		const record: Record<string, unknown> = {}
		for (const [key, value] of Object.entries(data)) {
			record[key] = transformArraysToObjects(value)
		}
		return record
	}
	return data
}

/**
 * Recursively transforms objects with prefixed keys back into arrays.
 * This is the exact, safe inverse of transformArraysToObjects.
 */
export function transformObjectsToArrays(data: unknown): unknown {
	if (isPlainRecord(data)) {
		const obj = data
		const keys = Object.keys(obj)

		if (
			keys.length === 1 &&
			keys[0] === ARRAY_EMPTY_SENTINEL &&
			obj[ARRAY_EMPTY_SENTINEL] === true
		) {
			return []
		}

		const isArrayLike =
			keys.length > 0 && keys.every((k) => k.startsWith(ARRAY_KEY_PREFIX))

		if (isArrayLike) {
			const newArr: unknown[] = []
			const sortedKeys = keys.sort(
				(a, b) =>
					Number.parseInt(a.substring(ARRAY_KEY_PREFIX.length), 10) -
					Number.parseInt(b.substring(ARRAY_KEY_PREFIX.length), 10)
			)
			for (const key of sortedKeys) {
				const index = Number.parseInt(
					key.substring(ARRAY_KEY_PREFIX.length),
					10
				)
				newArr[index] = transformObjectsToArrays(obj[key])
			}
			return newArr
		}

		const newObj: Record<string, unknown> = {}
		for (const key in obj) {
			if (Object.hasOwn(obj, key)) {
				newObj[key] = transformObjectsToArrays(obj[key])
			}
		}
		return newObj
	}
	return data
}
