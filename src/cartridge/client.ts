import { createHash } from "node:crypto"
import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type { CartridgeReader } from "@/cartridge/reader"
import { IndexV1Schema, IntegritySchema } from "@/cartridge/schema"
import type {
	IndexV1,
	Lesson,
	Resource,
	ResourceVideo,
	Unit
} from "@/cartridge/types"
import {
	type VideoMetadata,
	VideoMetadataSchema
} from "@/stimulus/video-metadata"

// NOTE: After write-time validation and integrity check on open, reads trust shapes and avoid Zod.
export async function readIndex(reader: CartridgeReader): Promise<IndexV1> {
	const res = await errors.try(reader.readText("index.json"))
	if (res.error) {
		logger.error("index read", { error: res.error })
		throw errors.wrap(res.error, "index read")
	}
	const parseRes = errors.trySync(() => JSON.parse(res.data))
	if (parseRes.error) {
		logger.error("index parse", { error: parseRes.error })
		throw errors.wrap(parseRes.error, "index parse")
	}
	const validated = IndexV1Schema.safeParse(parseRes.data)
	if (!validated.success) {
		logger.error("index schema invalid", { error: validated.error })
		throw errors.wrap(validated.error, "index validate")
	}
	return validated.data
}

export async function readUnit(
	reader: CartridgeReader,
	unitPath: string
): Promise<Unit> {
	const res = await errors.try(reader.readText(unitPath))
	if (res.error) {
		logger.error("unit read", { path: unitPath, error: res.error })
		throw errors.wrap(res.error, "unit read")
	}
	const parseRes = errors.trySync(() => JSON.parse(res.data))
	if (parseRes.error) {
		logger.error("unit parse", { path: unitPath, error: parseRes.error })
		throw errors.wrap(parseRes.error, "unit parse")
	}
	return parseRes.data
}

export async function readLesson(
	reader: CartridgeReader,
	lessonPath: string
): Promise<Lesson> {
	const res = await errors.try(reader.readText(lessonPath))
	if (res.error) {
		logger.error("lesson read", { path: lessonPath, error: res.error })
		throw errors.wrap(res.error, "lesson read")
	}
	const parseRes = errors.trySync(() => JSON.parse(res.data))
	if (parseRes.error) {
		logger.error("lesson parse", { path: lessonPath, error: parseRes.error })
		throw errors.wrap(parseRes.error, "lesson parse")
	}
	return parseRes.data
}

export async function readArticleContent(
	reader: CartridgeReader,
	articlePath: string
): Promise<string> {
	const res = await errors.try(reader.readText(articlePath))
	if (res.error) {
		logger.error("article read", { path: articlePath, error: res.error })
		throw errors.wrap(res.error, "article read")
	}
	return res.data
}

export function isVideoResource(res: Resource): res is ResourceVideo {
	return res.type === "video"
}

export async function readVideoMetadata(
	reader: CartridgeReader,
	resource: ResourceVideo
): Promise<VideoMetadata> {
	const res = await errors.try(reader.readText(resource.path))
	if (res.error) {
		logger.error("video metadata read", {
			path: resource.path,
			error: res.error
		})
		throw errors.wrap(res.error, "video metadata read")
	}
	const parseRes = errors.trySync(() => JSON.parse(res.data))
	if (parseRes.error) {
		logger.error("video metadata parse", {
			path: resource.path,
			error: parseRes.error
		})
		throw errors.wrap(parseRes.error, "video metadata parse")
	}
	const validation = VideoMetadataSchema.safeParse(parseRes.data)
	if (!validation.success) {
		logger.error("video metadata schema invalid", {
			path: resource.path,
			error: validation.error
		})
		throw errors.wrap(validation.error, "video metadata validation")
	}
	return validation.data
}

export async function readQuestionXml(
	reader: CartridgeReader,
	xmlPath: string
): Promise<string> {
	const res = await errors.try(reader.readText(xmlPath))
	if (res.error) {
		logger.error("question xml read", { path: xmlPath, error: res.error })
		throw errors.wrap(res.error, "question xml read")
	}
	return res.data
}

export async function readQuestionJson(
	reader: CartridgeReader,
	jsonPath: string
): Promise<unknown> {
	const res = await errors.try(reader.readText(jsonPath))
	if (res.error) {
		logger.error("question json read", { path: jsonPath, error: res.error })
		throw errors.wrap(res.error, "question json read")
	}
	const parseRes = errors.trySync(() => JSON.parse(res.data))
	if (parseRes.error) {
		logger.error("question json parse", {
			path: jsonPath,
			error: parseRes.error
		})
		throw errors.wrap(parseRes.error, "question json parse")
	}
	return parseRes.data
}

export async function* iterUnits(reader: CartridgeReader): AsyncIterable<Unit> {
	const index = await readIndex(reader)
	for (const uref of index.units) {
		yield await readUnit(reader, uref.path)
	}
}

export async function* iterUnitLessons(
	reader: CartridgeReader,
	unit: Unit
): AsyncIterable<Lesson> {
	for (const lref of unit.lessons) {
		yield await readLesson(reader, lref.path)
	}
}

export async function* iterLessonResources(
	_reader: CartridgeReader,
	lesson: Lesson
): AsyncIterable<Resource> {
	for (const r of lesson.resources) {
		yield r
	}
}

export async function validateIntegrity(
	reader: CartridgeReader
): Promise<{ ok: boolean; issues: Array<{ path: string; reason: string }> }> {
	const issues: Array<{ path: string; reason: string }> = []

	const manifestText = await errors.try(reader.readText("integrity.json"))
	if (manifestText.error)
		return {
			ok: false,
			issues: [
				{ path: "integrity.json", reason: "file not found or unreadable" }
			]
		}

	const manifestParsed = errors.trySync(() => JSON.parse(manifestText.data))
	if (manifestParsed.error)
		return {
			ok: false,
			issues: [{ path: "integrity.json", reason: "JSON parse failed" }]
		}

	const validated = IntegritySchema.safeParse(manifestParsed.data)
	if (!validated.success)
		return {
			ok: false,
			issues: [{ path: "integrity.json", reason: "schema validation failed" }]
		}

	const manifest = validated.data

	for (const [filePath, entry] of Object.entries(manifest.files)) {
		// Skip integrity.json itself to avoid circular validation
		if (filePath === "integrity.json") continue

		const fileBytes = await errors.try(reader.readBytes(filePath))
		if (fileBytes.error) {
			issues.push({ path: filePath, reason: "file not found or unreadable" })
			continue
		}

		if (fileBytes.data.byteLength !== entry.size) {
			issues.push({
				path: filePath,
				reason: `size mismatch (expected ${entry.size}, got ${fileBytes.data.byteLength})`
			})
		}

		const hash = createHash("sha256").update(fileBytes.data).digest("hex")
		if (hash !== entry.sha256) {
			issues.push({ path: filePath, reason: "sha256 hash mismatch" })
		}
	}

	return { ok: issues.length === 0, issues }
}
