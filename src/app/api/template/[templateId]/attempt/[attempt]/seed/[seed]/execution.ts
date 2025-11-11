import { existsSync, rmSync } from "node:fs"
import { mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import * as path from "node:path"
import { pathToFileURL } from "node:url"
import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"
import { and, eq } from "drizzle-orm"
import type { ExecutionRecord } from "@/app/api/template/execution-shared"
import { fetchExecutionRecord } from "@/app/api/template/execution-shared"
import { TemplateNotValidatedError } from "@/app/api/template/shared"
import { db } from "@/db"
import { templateCandidateExecutions, templateCandidates } from "@/db/schema"

type CandidateRecord = {
	templateId: string
	attempt: number
	source: string
	validatedAt: Date | null
}

async function fetchExecutionById(
	logger: Logger,
	executionId: string
): Promise<ExecutionRecord> {
	const record = await fetchExecutionRecord(executionId)
	if (!record) {
		logger.error("template seed execution record missing", {
			executionId
		})
		throw new TemplateExecutionFailedError("execution record missing", {
			executionId
		})
	}
	return record
}

type ModuleWithDefault = { default: unknown }

type CandidateExecutionOutcome =
	| { status: "failed"; reason: string; extra?: Record<string, unknown> }
	| { status: "succeeded"; executionId: string }

export class TemplateExecutionFailedError extends Error {
	constructor(
		public readonly reason: string,
		public readonly extra: Record<string, unknown> | undefined
	) {
		super(reason)
	}
}

const ALIAS_EXTENSIONS = [
	"",
	".ts",
	".tsx",
	".mts",
	".cts",
	".js",
	".mjs",
	".cjs",
	".json"
]

const ALIAS_IMPORT_REGEX = /(['"`])@\/([^'"`]+)\1/g

const RAW_ALIAS_TARGETS = [path.resolve(process.cwd(), "src")]

const SLASH_ALIAS_TARGETS = RAW_ALIAS_TARGETS.filter(
	(candidate, index, array) =>
		existsSync(candidate) && array.indexOf(candidate) === index
)

const REQUIRED_ALIAS_TYPE_SPECIFIERS = [
	"core/content",
	"core/feedback/content",
	"core/feedback/plan",
	"core/feedback/authoring",
	"core/interactions",
	"core/item"
] as const

function hasDefaultExport(value: unknown): value is ModuleWithDefault {
	return typeof value === "object" && value !== null && "default" in value
}

async function fetchCandidateRecord(
	templateId: string,
	attempt: number
): Promise<CandidateRecord | undefined> {
	const rows = await db
		.select({
			templateId: templateCandidates.templateId,
			attempt: templateCandidates.attempt,
			source: templateCandidates.source,
			validatedAt: templateCandidates.validatedAt
		})
		.from(templateCandidates)
		.where(
			and(
				eq(templateCandidates.templateId, templateId),
				eq(templateCandidates.attempt, attempt)
			)
		)
		.limit(1)

	if (rows.length === 0) {
		return undefined
	}

	return rows[0]
}

async function persistExecution(
	templateId: string,
	attempt: number,
	seed: bigint,
	body: unknown
) {
	return db
		.insert(templateCandidateExecutions)
		.values({
			templateId,
			attempt,
			seed,
			body
		})
		.onConflictDoUpdate({
			target: [
				templateCandidateExecutions.templateId,
				templateCandidateExecutions.attempt,
				templateCandidateExecutions.seed
			],
			set: { body }
		})
		.returning({ id: templateCandidateExecutions.id })
}

function disposeStack(
	logger: Logger,
	templateId: string,
	attempt: number,
	stack: DisposableStack,
	context: "failure" | "success"
) {
	const disposalResult = errors.trySync(() => stack.dispose())
	if (disposalResult.error) {
		logger.error("template candidate cleanup failed", {
			templateId,
			attempt,
			context,
			error: disposalResult.error
		})
		throw errors.wrap(disposalResult.error, "template candidate cleanup")
	}
}

export async function performTemplateCandidateExecution({
	logger,
	templateId,
	attempt,
	seed
}: {
	logger: Logger
	templateId: string
	attempt: number
	seed: string
}): Promise<CandidateExecutionOutcome> {
	const cleanupStack = new DisposableStack()

	const fail = (
		reason: string,
		extra?: Record<string, unknown>
	): CandidateExecutionOutcome => {
		logger.error("template candidate execution failed", {
			templateId,
			attempt,
			seed,
			reason,
			...extra
		})
		disposeStack(logger, templateId, attempt, cleanupStack, "failure")
		return { status: "failed" as const, reason, extra }
	}

	const parsedSeedResult = errors.trySync(() => BigInt(seed))
	if (parsedSeedResult.error) {
		return fail(`seed must be a base-10 integer string, received: ${seed}`)
	}
	const normalizedSeed = parsedSeedResult.data
	if (normalizedSeed < BigInt(0)) {
		return fail("seed must be non-negative")
	}

	const candidateRecord = await fetchCandidateRecord(templateId, attempt)
	if (!candidateRecord) {
		return fail("template candidate not found")
	}

	let validatedAtIso: string | null = null
	if (candidateRecord.validatedAt) {
		validatedAtIso = candidateRecord.validatedAt.toISOString()
	}
	logger.debug("fetched template candidate record", {
		templateId: candidateRecord.templateId,
		attempt: candidateRecord.attempt,
		sourceLength: candidateRecord.source.length,
		validatedAt: validatedAtIso
	})

	if (!candidateRecord.validatedAt) {
		return fail("template candidate has not been validated")
	}

	const existingExecution = await db
		.select({ id: templateCandidateExecutions.id })
		.from(templateCandidateExecutions)
		.where(
			and(
				eq(templateCandidateExecutions.templateId, templateId),
				eq(templateCandidateExecutions.attempt, attempt),
				eq(templateCandidateExecutions.seed, normalizedSeed)
			)
		)
		.limit(1)

	if (existingExecution.length > 0) {
		return fail("template candidate execution already exists", {
			existingExecutionId: existingExecution[0].id
		})
	}

	const tempDir = await mkdtemp(path.join(tmpdir(), "template-execution-"))
	cleanupStack.defer(() => rmSync(tempDir, { recursive: true, force: true }))

	const requiredTypeModulesResult = errors.trySync(() =>
		ensureRequiredTypeModulesAvailable(logger, templateId, attempt)
	)
	if (requiredTypeModulesResult.error) {
		return fail("required type module missing", {
			error: requiredTypeModulesResult.error
		})
	}

	const rewrittenSource = rewriteAliasImports(
		logger,
		templateId,
		attempt,
		candidateRecord.source
	)
	const sourcePath = path.join(tempDir, "candidate.ts")
	const writeResult = await errors.try(writeFile(sourcePath, rewrittenSource))
	if (writeResult.error) {
		return fail("failed to write candidate source", {
			error: writeResult.error
		})
	}

	const moduleUrl = pathToFileURL(sourcePath).href
	const importResult = await errors.try(
		import(/* webpackIgnore: true */ moduleUrl)
	)
	if (importResult.error) {
		return fail("failed to import candidate module", {
			error: importResult.error.toString()
		})
	}
	const importedModule = importResult.data
	if (!hasDefaultExport(importedModule)) {
		return fail("candidate module missing default export")
	}
	const candidateFactory = importedModule.default
	if (typeof candidateFactory !== "function") {
		logger.debug("candidate module default export must be a function")
		return fail(
			`candidate module default export must be a function, received ${typeof candidateFactory}`
		)
	}

	const generatedBodyResult = await errors.try(candidateFactory(normalizedSeed))
	if (generatedBodyResult.error) {
		return fail("candidate execution threw", {
			error: generatedBodyResult.error.toString()
		})
	}
	const generatedBody = generatedBodyResult.data

	const persistResult = await errors.try(
		persistExecution(templateId, attempt, normalizedSeed, generatedBody)
	)
	if (persistResult.error) {
		return fail(persistResult.error.toString(), {
			error: persistResult.error.toString()
		})
	}

	const persistedRow = persistResult.data[0]
	if (!persistedRow || !persistedRow.id) {
		return fail("template candidate execution ID missing after persistence")
	}
	const executionId = persistedRow.id

	disposeStack(logger, templateId, attempt, cleanupStack, "success")

	logger.info("template candidate execution completed", {
		templateId,
		attempt,
		seed,
		executionId
	})

	return { status: "succeeded" as const, executionId }
}

function resolveAliasSpecifier(
	logger: Logger,
	templateId: string,
	attempt: number,
	specifier: string
): string {
	if (SLASH_ALIAS_TARGETS.length === 0) {
		logger.error("no alias targets available for '@/'' resolution", {
			templateId,
			attempt,
			specifier
		})
		throw errors.new("path alias '@/…' is not configured")
	}

	const cleanSpecifier = specifier.replace(/^\//, "")
	const attempts: string[] = []

	for (const baseDir of SLASH_ALIAS_TARGETS) {
		const baseCandidate = path.join(baseDir, cleanSpecifier)
		for (const extension of ALIAS_EXTENSIONS) {
			const candidatePath =
				extension.length > 0 ? `${baseCandidate}${extension}` : baseCandidate
			attempts.push(candidatePath)
			if (existsSync(candidatePath)) {
				return pathToFileURL(candidatePath).href
			}
		}

		for (const extension of ALIAS_EXTENSIONS) {
			const indexCandidate = path.join(
				baseDir,
				cleanSpecifier,
				`index${extension}`
			)
			attempts.push(indexCandidate)
			if (existsSync(indexCandidate)) {
				return pathToFileURL(indexCandidate).href
			}
		}
	}

	logger.error("failed to resolve alias import", {
		templateId,
		attempt,
		specifier,
		attempts
	})
	throw errors.new(`unable to resolve alias import @/${cleanSpecifier}`)
}

function rewriteAliasImports(
	logger: Logger,
	templateId: string,
	attempt: number,
	source: string
): string {
	let rewriteCount = 0
	const transformed = source.replace(
		ALIAS_IMPORT_REGEX,
		(_match, quote: string, specifier: string) => {
			rewriteCount += 1
			const resolved = resolveAliasSpecifier(
				logger,
				templateId,
				attempt,
				specifier
			)
			return `${quote}${resolved}${quote}`
		}
	)

	if (rewriteCount > 0) {
		logger.debug("candidate alias imports rewritten", {
			templateId,
			attempt,
			rewriteCount
		})
	}

	return transformed
}

function ensureRequiredTypeModulesAvailable(
	logger: Logger,
	templateId: string,
	attempt: number
) {
	for (const specifier of REQUIRED_ALIAS_TYPE_SPECIFIERS) {
		const resolutionResult = errors.trySync(() =>
			resolveAliasSpecifier(logger, templateId, attempt, specifier)
		)
		if (resolutionResult.error) {
			logger.error("required type module resolution failed", {
				templateId,
				attempt,
				specifier,
				error: resolutionResult.error
			})
			throw resolutionResult.error
		}
	}
}

export async function ensureExecutionForAttemptSeed({
	logger,
	templateId,
	attempt,
	seed
}: {
	logger: Logger
	templateId: string
	attempt: number
	seed: string
}): Promise<ExecutionRecord> {
	const candidateRecord = await db
		.select({ validatedAt: templateCandidates.validatedAt })
		.from(templateCandidates)
		.where(
			and(
				eq(templateCandidates.templateId, templateId),
				eq(templateCandidates.attempt, attempt)
			)
		)
		.limit(1)
		.then((rows) => rows[0])

	if (!candidateRecord || !candidateRecord.validatedAt) {
		logger.error("template attempt not validated", {
			templateId,
			attempt
		})
		throw new TemplateNotValidatedError(templateId)
	}

	const normalizedSeed = BigInt(seed)

	const cachedExecution = await db
		.select({
			id: templateCandidateExecutions.id,
			templateId: templateCandidateExecutions.templateId,
			attempt: templateCandidateExecutions.attempt,
			seed: templateCandidateExecutions.seed,
			body: templateCandidateExecutions.body,
			createdAt: templateCandidateExecutions.createdAt
		})
		.from(templateCandidateExecutions)
		.where(
			and(
				eq(templateCandidateExecutions.templateId, templateId),
				eq(templateCandidateExecutions.attempt, attempt),
				eq(templateCandidateExecutions.seed, normalizedSeed)
			)
		)
		.limit(1)

	if (cachedExecution.length > 0) {
		logger.debug("template seed execution cache hit", {
			templateId,
			attempt,
			seed: normalizedSeed.toString(),
			executionId: cachedExecution[0].id
		})
		return cachedExecution[0]
	}

	const executionResult = await performTemplateCandidateExecution({
		logger,
		templateId,
		attempt,
		seed
	})

	if (executionResult.status === "failed") {
		const existingId = executionResult.extra?.existingExecutionId
		if (
			executionResult.reason ===
				"template candidate execution already exists" &&
			typeof existingId === "string"
		) {
			logger.info("template seed execution reused existing record", {
				templateId,
				attempt,
				seed,
				executionId: existingId
			})
			return fetchExecutionById(logger, existingId)
		}

		logger.error("template seed execution failed", {
			templateId,
			attempt,
			seed,
			reason: executionResult.reason,
			extra: executionResult.extra
		})
		throw new TemplateExecutionFailedError(
			executionResult.reason,
			executionResult.extra
		)
	}

	return fetchExecutionById(logger, executionResult.executionId)
}
