import { createHash } from "node:crypto"
import * as fscore from "node:fs"
import * as fs from "node:fs/promises"
import * as os from "node:os"
import * as path from "node:path"
// stream import no longer required after switching to direct piping
import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { spawn } from "bun"
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

	// We'll stream tar entries directly into a multi-threaded zstd compressor.
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

	// Finalize tar then stream into multi-threaded zstd
	pack.finalize()

	const proc = spawn({
		cmd: ["zstd", "--fast=3", "-T0", "-q", "-c"],
		stdin: "pipe",
		stdout: "pipe",
		stderr: "pipe"
	})
	async function runZstdStream(): Promise<Uint8Array> {
		await new Promise<void>((resolve, reject) => {
			pack.on("data", (c) => {
				void proc.stdin.write(c)
			})
			pack.on("end", () => {
				proc.stdin.end()
				resolve()
			})
			pack.on("error", (err) => reject(errors.wrap(err, "tar finalize")))
		})
		const waited = await errors.try(proc.exited)
		if (waited.error || proc.exitCode !== 0) {
			const stderrText = await new Response(proc.stderr).text()
			logger.error("zstd compression failed", {
				exitCode: proc.exitCode,
				stderr: stderrText
			})
			throw errors.new("zstd compression failure")
		}
		const zst = new Uint8Array(await new Response(proc.stdout).arrayBuffer())
		return zst
	}
	const streamResult = await errors.try(runZstdStream())
	if (streamResult.error) {
		logger.error("zstd streaming encountered error", {
			error: streamResult.error
		})
		throw streamResult.error
	}
	return streamResult.data
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

	// Stream to zstd directly to file
	const proc = spawn({
		cmd: ["zstd", "--fast=3", "-T0", "-q", "-o", outFile],
		stdin: "pipe",
		stdout: "pipe",
		stderr: "pipe"
	})
	async function pipeToZstdFile(): Promise<true> {
		await new Promise<void>((resolve, reject) => {
			pack.on("data", (c) => {
				void proc.stdin.write(c)
			})
			pack.on("end", () => {
				proc.stdin.end()
				resolve()
			})
			pack.on("error", (err) => reject(errors.wrap(err, "tar finalize")))
		})
		const waited = await errors.try(proc.exited)
		if (waited.error || proc.exitCode !== 0) {
			const stderrText = await new Response(proc.stderr).text()
			logger.error("zstd compression failed", {
				exitCode: proc.exitCode,
				stderr: stderrText
			})
			throw errors.new("zstd compression failure")
		}
		return true as const
	}
	await pipeToZstdFile()
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

	// tar | zstd
	const procTar = spawn({
		cmd: ["tar", "-C", stageRoot, "-cf", "-", "."],
		stdout: "pipe",
		stderr: "pipe"
	})
	const procZstd = spawn({
		cmd: ["zstd", "--fast=3", "-T0", "-q", "-o", outFile],
		stdin: "pipe",
		stdout: "pipe",
		stderr: "pipe"
	})

	async function runCompression(): Promise<true> {
		if (!procTar.stdout) {
			logger.error("tar produced no stdout stream")
			throw errors.new("tar stdout missing")
		}
		const reader = procTar.stdout.getReader()
		while (true) {
			const rr = await reader.read()
			if (rr.done) break
			const w = errors.trySync(() => procZstd.stdin.write(rr.value))
			if (w.error) {
				logger.error("zstd stdin write failed", { error: w.error })
				throw errors.wrap(w.error, "zstd stdin write")
			}
		}
		procZstd.stdin.end()
		const tExit = await procTar.exited
		const zExit = await procZstd.exited
		if (tExit !== 0) {
			const stderrText = await new Response(procTar.stderr).text()
			logger.error("tar failed", { exitCode: tExit, stderr: stderrText })
			throw errors.new("tar failure")
		}
		if (zExit !== 0) {
			const stderrText = await new Response(procZstd.stderr).text()
			logger.error("zstd failed", { exitCode: zExit, stderr: stderrText })
			throw errors.new("zstd failure")
		}
		return true as const
	}
	await runCompression()

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
