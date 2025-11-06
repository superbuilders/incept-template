import { createHash } from "node:crypto"
import * as fscore from "node:fs"
import * as fs from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"
import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import tar from "tar-stream"
import { z } from "zod"
import {
	IndexV1Schema,
	IntegritySchema,
	LessonSchema,
	QuestionRefSchema,
	UnitSchema
} from "@/cartridge/schema"

export type GeneratorInfo = { name: string; version: string; commit?: string }

// Runtime schemas for strict validation (no extra fields allowed)
const GeneratorInfoSchema = z
	.object({
		name: z.string(),
		version: z.string(),
		commit: z.string().optional()
	})
	.strict()
const CourseInfoSchema = z
	.object({ title: z.string(), subject: z.string() })
	.strict()

const UnitTestSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		path: z.string(),
		questionCount: z.number(),
		questions: z.array(QuestionRefSchema)
	})
	.strict()

const NumericUnitId = z.string().regex(/^unit-\d+$/)
const NonNumericUnitId = z.string().refine((v) => !/^unit-\d+$/.test(v), {
	message: "non-numeric unit id must not match unit-<n>"
})

const BuildUnitNumericSchema = z
	.object({
		id: NumericUnitId,
		unitNumber: z.number(),
		title: z.string(),
		lessons: z.array(LessonSchema),
		unitTest: UnitTestSchema.optional()
	})
	.strict()

const BuildUnitNonNumericSchema = z
	.object({
		id: NonNumericUnitId,
		unitNumber: z.number(),
		title: z.string(),
		lessons: z.array(LessonSchema),
		unitTest: UnitTestSchema.optional()
	})
	.strict()

export const BuildUnitSchema = z.union([
	BuildUnitNumericSchema,
	BuildUnitNonNumericSchema
])
export type BuildUnit = z.infer<typeof BuildUnitSchema>

const CartridgePathSchema = z
	.string()
	.refine((p) => !p.startsWith("/") && !p.includes("\\"), {
		message: "paths must be POSIX relative"
	})

export const CartridgeBuildInputSchema = z
	.object({
		generator: GeneratorInfoSchema,
		course: CourseInfoSchema,
		units: z.array(BuildUnitSchema).min(1),
		files: z.record(CartridgePathSchema, z.instanceof(Uint8Array))
	})
	.strict()

export type CartridgeBuildInput = {
	generator: GeneratorInfo
	course: { title: string; subject: string }
	units: BuildUnit[]
	files: Record<string, Uint8Array<ArrayBufferLike>>
}

export type CartridgeFileMap = Record<string, string> // dest path in cartridge -> absolute source path

function stringifyJson(data: unknown): string {
	return `${JSON.stringify(data, null, 2)}\n`
}

// removed computeIntegrity in favor of streaming accumulation

function assert(condition: boolean, msg: string): void {
	if (!condition) {
		logger.error("assertion failed", { message: msg })
		throw errors.new(msg)
	}
}

function ensureBuffer(chunk: unknown, context: string): Buffer {
	if (Buffer.isBuffer(chunk)) {
		return chunk
	}
	if (chunk instanceof Uint8Array) {
		return Buffer.from(chunk)
	}
	if (typeof chunk === "string") {
		return Buffer.from(chunk, "utf8")
	}
	if (chunk instanceof ArrayBuffer) {
		return Buffer.from(chunk)
	}
	logger.error("unexpected stream chunk", { context, type: typeof chunk })
	throw errors.new(`${context}: unexpected stream chunk type`)
}

async function collectStream(
	readable: NodeJS.ReadableStream,
	context: string
): Promise<Uint8Array> {
	const chunks: Buffer[] = []
	for await (const chunk of readable as AsyncIterable<unknown>) {
		const buffer = ensureBuffer(chunk, context)
		chunks.push(buffer)
	}
	let totalLength = 0
	for (const chunk of chunks) {
		totalLength += chunk.length
	}
	const output = new Uint8Array(totalLength)
	let offset = 0
	for (const chunk of chunks) {
		output.set(chunk, offset)
		offset += chunk.length
	}
	return output
}

export async function buildCartridgeToBytes(
	input: CartridgeBuildInput
): Promise<Uint8Array> {
	// Validate full input strictly
	const inputValidation = CartridgeBuildInputSchema.safeParse(input)
	if (!inputValidation.success) {
		logger.error("cartridge build input invalid", {
			error: inputValidation.error
		})
		throw errors.wrap(inputValidation.error, "cartridge build input validation")
	}
	const validated = inputValidation.data

	// Cross-check files coverage
	const requiredPaths = new Set<string>()
	for (const u of validated.units) {
		for (const l of u.lessons) {
			for (const r of l.resources) {
				if (r.type === "article") requiredPaths.add(r.path)
				if (r.type === "video") requiredPaths.add(r.path)
				if (r.type === "quiz") {
					for (const q of r.questions) {
						requiredPaths.add(q.xml)
						requiredPaths.add(q.json)
					}
				}
			}
		}
		if (u.unitTest) {
			for (const q of u.unitTest.questions) {
				requiredPaths.add(q.xml)
				requiredPaths.add(q.json)
			}
		}
	}
	for (const p of requiredPaths) {
		assert(p in validated.files, `missing file payload: ${p}`)
	}
	// No extras: every provided file must be referenced
	const extras = Object.keys(validated.files).filter(
		(p) => !requiredPaths.has(p)
	)
	if (extras.length > 0) {
		logger.error("unexpected file inputs", { count: extras.length, extras })
		throw errors.new("unexpected file inputs")
	}

	// We'll collect tar entries in-memory and gzip with Bun.
	// As we add entries, compute integrity in-memory to write integrity.json last.
	const integrityFiles: Record<string, { size: number; sha256: string }> = {}
	function hashAndRecord(pathRel: string, bytes: Uint8Array | string): void {
		const content =
			typeof bytes === "string"
				? Buffer.from(bytes, "utf8")
				: Buffer.from(bytes)
		const sha = createHash("sha256").update(content).digest("hex")
		integrityFiles[pathRel] = { size: content.length, sha256: sha }
	}

	// Pack tar stream
	const pack = tar.pack()
	const tarStreamPromise = collectStream(pack, "cartridge tar stream")
	const addEntry = async (
		name: string,
		content: Uint8Array | string
	): Promise<void> => {
		hashAndRecord(name, content)
		const buffer =
			typeof content === "string"
				? Buffer.from(content, "utf8")
				: Buffer.from(content)
		await new Promise<void>((resolve, reject) => {
			pack.entry({ name, size: buffer.length, type: "file" }, buffer, (err) => {
				if (err) return reject(errors.wrap(err, "tar entry"))
				resolve()
			})
		})
	}

	// Lessons
	for (const u of validated.units) {
		for (const l of u.lessons) {
			const lessonJson = {
				id: l.id,
				unitId: l.unitId,
				lessonNumber: l.lessonNumber,
				title: l.title,
				resources: l.resources
			}
			const lessonPath = `lessons/${u.id}/${l.id}.json`
			const lv = LessonSchema.safeParse(lessonJson)
			if (!lv.success) {
				logger.error("lesson schema invalid", {
					unitId: u.id,
					lessonId: l.id,
					error: lv.error
				})
				throw errors.wrap(lv.error, "lesson schema validation")
			}
			await addEntry(lessonPath, stringifyJson(lv.data))
		}
	}

	// Units
	for (const u of validated.units) {
		const lessonRefs = u.lessons.map((l) => ({
			id: l.id,
			lessonNumber: l.lessonNumber,
			title: l.title,
			path: `lessons/${u.id}/${l.id}.json`
		}))
		const lessonCount = u.lessons.length
		const resourceCount = u.lessons.reduce(
			(sum, l) => sum + l.resources.length,
			0
		)
		const quizQuestionCount = u.lessons.reduce((sum, l) => {
			let lessonQuizQuestions = 0
			for (const r of l.resources) {
				if (r.type === "quiz") {
					lessonQuizQuestions += r.questionCount
				}
			}
			return sum + lessonQuizQuestions
		}, 0)
		const unitTestQuestionCount = u.unitTest ? u.unitTest.questionCount : 0
		const counts = {
			lessonCount,
			resourceCount,
			questionCount: quizQuestionCount + unitTestQuestionCount
		}

		const unitJson: Record<string, unknown> = {
			id: u.id,
			unitNumber: u.unitNumber,
			title: u.title,
			lessons: lessonRefs,
			unitTest: u.unitTest,
			counts
		}
		const uv = UnitSchema.safeParse(unitJson)
		if (!uv.success) {
			logger.error("unit schema invalid", { unitId: u.id, error: uv.error })
			throw errors.wrap(uv.error, "unit schema validation")
		}
		await addEntry(`units/${u.id}.json`, stringifyJson(uv.data))
	}

	// Index
	const index: Record<string, unknown> = {
		version: 1 as const,
		generatedAt: new Date().toISOString(),
		generator: validated.generator,
		course: validated.course,
		units: validated.units.map((u) => ({
			id: u.id,
			unitNumber: u.unitNumber,
			title: u.title,
			path: `units/${u.id}.json`
		}))
	}
	const iv = IndexV1Schema.safeParse(index)
	if (!iv.success) {
		logger.error("index schema invalid", { error: iv.error })
		throw errors.wrap(iv.error, "index schema validation")
	}
	await addEntry("index.json", stringifyJson(iv.data))

	// Attach content files
	for (const [p, bytes] of Object.entries(input.files)) {
		await addEntry(p, bytes)
	}

	// Integrity (write last; integrity.json is excluded from validation checks downstream)
	const integrity = { algorithm: "sha256" as const, files: integrityFiles }
	const integV = IntegritySchema.safeParse(integrity)
	if (!integV.success) {
		logger.error("integrity schema invalid", { error: integV.error })
		throw errors.wrap(integV.error, "integrity schema validation")
	}
	await addEntry("integrity.json", stringifyJson(integV.data))

	// Finalize tar then compress with Bun gzip
	pack.finalize()

	const tarStreamResult = await errors.try(tarStreamPromise)
	if (tarStreamResult.error) {
		logger.error("tar stream collection failed", {
			error: tarStreamResult.error
		})
		throw tarStreamResult.error
	}
	const gzipResult = errors.trySync(() => Bun.gzipSync(tarStreamResult.data))
	if (gzipResult.error) {
		logger.error("gzip compression failed", { error: gzipResult.error })
		throw errors.wrap(gzipResult.error, "gzip compression")
	}
	return gzipResult.data
}

export async function buildCartridgeToFile(
	input: CartridgeBuildInput,
	outFile: string
): Promise<void> {
	// Ensure directory exists
	const dir = path.dirname(outFile)
	const mk = await errors.try(fs.mkdir(dir, { recursive: true }))
	if (mk.error) {
		logger.error("directory creation", { dir, error: mk.error })
		throw errors.wrap(mk.error, "directory creation")
	}

	// Prepare integrity accumulator and tar pack
	const integrityFiles: Record<string, { size: number; sha256: string }> = {}
	function record(pathRel: string, bytes: Uint8Array | string): Buffer {
		const buffer =
			typeof bytes === "string"
				? Buffer.from(bytes, "utf8")
				: Buffer.from(bytes)
		const sha = createHash("sha256").update(buffer).digest("hex")
		integrityFiles[pathRel] = { size: buffer.length, sha256: sha }
		return buffer
	}

	const pack = tar.pack()
	const tarStreamPromise = collectStream(pack, "cartridge tar file stream")
	const addEntry = async (
		name: string,
		content: Uint8Array | string
	): Promise<void> => {
		const buffer = record(name, content)
		await new Promise<void>((resolve, reject) => {
			pack.entry({ name, size: buffer.length, type: "file" }, buffer, (err) => {
				if (err) return reject(errors.wrap(err, "tar entry"))
				resolve()
			})
		})
	}

	// Reuse the validated build steps by calling buildCartridgeToBytes' preparation pieces
	async function writeEntries(): Promise<true> {
		// We duplicate minimal logic to avoid buffering the whole archive
		const inputValidation = CartridgeBuildInputSchema.safeParse(input)
		if (!inputValidation.success) {
			logger.error("cartridge build input invalid", {
				error: inputValidation.error
			})
			throw errors.wrap(
				inputValidation.error,
				"cartridge build input validation"
			)
		}
		const validated = inputValidation.data

		// Lessons
		for (const u of validated.units) {
			for (const l of u.lessons) {
				const lessonJson = {
					id: l.id,
					unitId: l.unitId,
					lessonNumber: l.lessonNumber,
					title: l.title,
					resources: l.resources
				}
				const lessonPath = `lessons/${u.id}/${l.id}.json`
				const lv = LessonSchema.safeParse(lessonJson)
				if (!lv.success) {
					logger.error("lesson schema invalid", {
						unitId: u.id,
						lessonId: l.id,
						error: lv.error
					})
					throw errors.wrap(lv.error, "lesson schema validation")
				}
				await addEntry(lessonPath, stringifyJson(lv.data))
			}
		}

		// Units
		for (const u of validated.units) {
			const lessonRefs = u.lessons.map((l) => ({
				id: l.id,
				lessonNumber: l.lessonNumber,
				title: l.title,
				path: `lessons/${u.id}/${l.id}.json`
			}))
			const lessonCount = u.lessons.length
			const resourceCount = u.lessons.reduce(
				(sum, l) => sum + l.resources.length,
				0
			)
			const quizQuestionCount = u.lessons.reduce((sum, l) => {
				let lessonQuizQuestions = 0
				for (const r of l.resources) {
					if (r.type === "quiz") lessonQuizQuestions += r.questionCount
				}
				return sum + lessonQuizQuestions
			}, 0)
			const unitTestQuestionCount = u.unitTest ? u.unitTest.questionCount : 0
			const counts = {
				lessonCount,
				resourceCount,
				questionCount: quizQuestionCount + unitTestQuestionCount
			}
			const unitJson = {
				id: u.id,
				unitNumber: u.unitNumber,
				title: u.title,
				lessons: lessonRefs,
				unitTest: u.unitTest,
				counts
			}
			const uv = UnitSchema.safeParse(unitJson)
			if (!uv.success) {
				logger.error("unit schema invalid", { unitId: u.id, error: uv.error })
				throw errors.wrap(uv.error, "unit schema validation")
			}
			await addEntry(`units/${u.id}.json`, stringifyJson(uv.data))
		}

		// Index
		const index: Record<string, unknown> = {
			version: 1 as const,
			generatedAt: new Date().toISOString(),
			generator: validated.generator,
			course: validated.course,
			units: validated.units.map((u) => ({
				id: u.id,
				unitNumber: u.unitNumber,
				title: u.title,
				path: `units/${u.id}.json`
			}))
		}
		const iv = IndexV1Schema.safeParse(index)
		if (!iv.success) {
			logger.error("index schema invalid", { error: iv.error })
			throw errors.wrap(iv.error, "index schema validation")
		}
		await addEntry("index.json", stringifyJson(iv.data))

		// Input content files
		for (const [p, bytes] of Object.entries(validated.files)) {
			await addEntry(p, bytes)
		}

		// Integrity last
		const integrity = { algorithm: "sha256" as const, files: integrityFiles }
		const integV = IntegritySchema.safeParse(integrity)
		if (!integV.success) {
			logger.error("integrity schema invalid", { error: integV.error })
			throw errors.wrap(integV.error, "integrity schema validation")
		}
		await addEntry("integrity.json", stringifyJson(integV.data))

		// Finalize pack
		pack.finalize()

		return true as const
	}
	const bytesBuild = await errors.try(writeEntries())
	if (bytesBuild.error) {
		logger.error("writing tar entries failed", { error: bytesBuild.error })
		throw bytesBuild.error
	}

	const tarStreamResult = await errors.try(tarStreamPromise)
	if (tarStreamResult.error) {
		logger.error("tar stream collection failed", {
			error: tarStreamResult.error
		})
		throw tarStreamResult.error
	}
	const gzipResult = errors.trySync(() => Bun.gzipSync(tarStreamResult.data))
	if (gzipResult.error) {
		logger.error("gzip compression failed", { error: gzipResult.error })
		throw errors.wrap(gzipResult.error, "gzip compression")
	}
	const writeResult = await errors.try(fs.writeFile(outFile, gzipResult.data))
	if (writeResult.error) {
		logger.error("gzip file write failed", {
			file: outFile,
			error: writeResult.error
		})
		throw errors.wrap(writeResult.error, "gzip write")
	}
}

async function copyWithHash(
	src: string,
	dest: string
): Promise<{ size: number; sha256: string }> {
	await fs.mkdir(path.dirname(dest), { recursive: true })
	const read = fscore.createReadStream(src)
	const write = fscore.createWriteStream(dest)
	const hash = createHash("sha256")
	let size = 0
	await new Promise<void>((resolve, reject) => {
		read.on("data", (chunk: Buffer | string) => {
			const buf = typeof chunk === "string" ? Buffer.from(chunk) : chunk
			hash.update(buf)
			size += buf.length
			const ok = write.write(buf)
			if (!ok) read.pause()
		})
		write.on("drain", () => read.resume())
		read.on("error", (err) => reject(errors.wrap(err, "file read")))
		write.on("error", (err) => reject(errors.wrap(err, "file write")))
		read.on("end", () => {
			write.end()
		})
		write.on("finish", () => resolve())
	})
	return { size, sha256: hash.digest("hex") }
}

export async function buildCartridgeFromFileMap(
	plan: {
		generator: GeneratorInfo
		course: { title: string; subject: string }
		units: BuildUnit[]
		files: CartridgeFileMap
	},
	outFile: string
): Promise<void> {
	// Validate plan
	const unitsValidation = z.array(BuildUnitSchema).safeParse(plan.units)
	if (!unitsValidation.success) {
		logger.error("units schema invalid", { error: unitsValidation.error })
		throw errors.wrap(unitsValidation.error, "units schema validation")
	}

	// Stage to temp directory
	const stageRoot = await fs.mkdtemp(path.join(os.tmpdir(), "cartridge-stage-"))
	logger.debug("staging files to temp directory", { dir: stageRoot })

	const integrityFiles: Record<string, { size: number; sha256: string }> = {}

	async function writeJson(rel: string, data: unknown): Promise<void> {
		const content = stringifyJson(data)
		const abs = path.join(stageRoot, rel)
		await fs.mkdir(path.dirname(abs), { recursive: true })
		const wr = await errors.try(fs.writeFile(abs, content))
		if (wr.error) {
			logger.error("file write", { file: abs, error: wr.error })
			throw errors.wrap(wr.error, "file write")
		}
		integrityFiles[rel] = {
			size: Buffer.byteLength(content),
			sha256: createHash("sha256").update(content).digest("hex")
		}
	}

	// Lessons JSON
	for (const u of plan.units) {
		for (const l of u.lessons) {
			const lessonPath = `lessons/${u.id}/${l.id}.json`
			const lv = LessonSchema.safeParse({
				id: l.id,
				unitId: l.unitId,
				lessonNumber: l.lessonNumber,
				title: l.title,
				resources: l.resources
			})
			if (!lv.success) {
				logger.error("lesson schema invalid", {
					unitId: u.id,
					lessonId: l.id,
					error: lv.error
				})
				throw errors.wrap(lv.error, "lesson schema validation")
			}
			await writeJson(lessonPath, lv.data)
		}
	}

	// Units JSON
	for (const u of plan.units) {
		const lessonRefs = u.lessons.map((l) => ({
			id: l.id,
			lessonNumber: l.lessonNumber,
			title: l.title,
			path: `lessons/${u.id}/${l.id}.json`
		}))
		const lessonCount = u.lessons.length
		const resourceCount = u.lessons.reduce(
			(sum, l) => sum + l.resources.length,
			0
		)
		const quizQuestionCount = u.lessons.reduce((sum, l) => {
			let lessonQuizQuestions = 0
			for (const r of l.resources) {
				if (r.type === "quiz") lessonQuizQuestions += r.questionCount
			}
			return sum + lessonQuizQuestions
		}, 0)
		const unitTestQuestionCount = u.unitTest ? u.unitTest.questionCount : 0
		const counts = {
			lessonCount,
			resourceCount,
			questionCount: quizQuestionCount + unitTestQuestionCount
		}
		const uv = UnitSchema.safeParse({
			id: u.id,
			unitNumber: u.unitNumber,
			title: u.title,
			lessons: lessonRefs,
			unitTest: u.unitTest,
			counts
		})
		if (!uv.success) {
			logger.error("unit schema invalid", { unitId: u.id, error: uv.error })
			throw errors.wrap(uv.error, "unit schema validation")
		}
		await writeJson(`units/${u.id}.json`, uv.data)
	}

	// Index JSON
	const index = {
		version: 1 as const,
		generatedAt: new Date().toISOString(),
		generator: plan.generator,
		course: plan.course,
		units: plan.units.map((u) => ({
			id: u.id,
			unitNumber: u.unitNumber,
			title: u.title,
			path: `units/${u.id}.json`
		}))
	}
	const iv = IndexV1Schema.safeParse(index)
	if (!iv.success) {
		logger.error("index schema invalid", { error: iv.error })
		throw errors.wrap(iv.error, "index schema validation")
	}
	await writeJson("index.json", iv.data)

	// Copy content files with hashing
	for (const [destRel, srcAbs] of Object.entries(plan.files)) {
		const destAbs = path.join(stageRoot, destRel)
		const res = await errors.try(copyWithHash(srcAbs, destAbs))
		if (res.error) {
			logger.error("file copy", {
				src: srcAbs,
				dest: destAbs,
				error: res.error
			})
			throw res.error
		}
		integrityFiles[destRel] = res.data
	}

	// Integrity JSON
	const integ = IntegritySchema.safeParse({
		algorithm: "sha256" as const,
		files: integrityFiles
	})
	if (!integ.success) {
		logger.error("integrity schema invalid", { error: integ.error })
		throw errors.wrap(integ.error, "integrity schema validation")
	}
	await writeJson("integrity.json", integ.data)

	const pack = tar.pack()
	const tarStreamPromise = collectStream(pack, "cartridge stage tar stream")
	const stagedPaths = Object.keys(integrityFiles).sort((a, b) =>
		a.localeCompare(b)
	)
	for (const rel of stagedPaths) {
		const abs = path.join(stageRoot, rel)
		const readResult = await errors.try(fs.readFile(abs))
		if (readResult.error) {
			logger.error("staged file read failed", {
				file: abs,
				error: readResult.error
			})
			throw errors.wrap(readResult.error, "staged file read")
		}
		const buffer = readResult.data
		await new Promise<void>((resolve, reject) => {
			pack.entry(
				{ name: rel, size: buffer.length, type: "file" },
				buffer,
				(err) => {
					if (err) return reject(errors.wrap(err, "tar entry"))
					resolve()
				}
			)
		})
	}
	pack.finalize()

	const tarStreamResult = await errors.try(tarStreamPromise)
	if (tarStreamResult.error) {
		logger.error("tar stream collection failed", {
			error: tarStreamResult.error
		})
		throw tarStreamResult.error
	}
	const gzipResult = errors.trySync(() => Bun.gzipSync(tarStreamResult.data))
	if (gzipResult.error) {
		logger.error("gzip compression failed", { error: gzipResult.error })
		throw errors.wrap(gzipResult.error, "gzip compression")
	}
	const writeResult = await errors.try(fs.writeFile(outFile, gzipResult.data))
	if (writeResult.error) {
		logger.error("gzip file write failed", {
			file: outFile,
			error: writeResult.error
		})
		throw errors.wrap(writeResult.error, "gzip write")
	}

	const rm = await errors.try(
		fs.rm(stageRoot, { recursive: true, force: true })
	)
	if (rm.error) {
		logger.warn("failed to remove staging directory", {
			dir: stageRoot,
			error: rm.error
		})
	}
}
