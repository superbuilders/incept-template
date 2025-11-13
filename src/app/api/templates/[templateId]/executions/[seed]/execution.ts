import { existsSync, rmSync } from "node:fs"
import { mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import * as path from "node:path"
import { pathToFileURL } from "node:url"
import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"
import { and, eq } from "drizzle-orm"
import type { ExecutionRecord } from "@/app/api/templates/execution-shared"
import { fetchExecutionRecord } from "@/app/api/templates/execution-shared"
import { TemplateNotValidatedError } from "@/app/api/templates/shared"
import { db } from "@/db"
import {
	templateExecutions,
	templates,
	typescriptDiagnostics,
	typescriptRuns
} from "@/db/schema"
import { env } from "@/env"

type TemplateRecord = {
	id: string
	questionId: string
	source: string
}

type TemplateExecutionOutcome =
	| { status: "succeeded"; executionId: string }
	| {
			status: "failed"
			reason: string
			extra?: Record<string, unknown>
	  }

type ModuleWithDefault = { default: unknown }

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

async function fetchTemplateRecord(
	templateId: string
): Promise<TemplateRecord | undefined> {
	const row = await db
		.select({
			id: templates.id,
			questionId: templates.questionId,
			source: templates.source
		})
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)
		.then((rows) => rows[0])

	if (!row) return undefined

	return {
		id: row.id,
		questionId: row.questionId,
		source: row.source
	}
}

async function getTypeScriptRunId(templateId: string): Promise<string | null> {
	const run = await db
		.select({ id: typescriptRuns.id })
		.from(typescriptRuns)
		.where(eq(typescriptRuns.templateId, templateId))
		.limit(1)
		.then((rows) => rows[0])
	return run?.id ?? null
}

async function hasSuccessfulTypeScriptRun(
	templateId: string
): Promise<boolean> {
	const runId = await getTypeScriptRunId(templateId)
	if (!runId) return false
	const diagnostic = await db
		.select({ id: typescriptDiagnostics.id })
		.from(typescriptDiagnostics)
		.where(eq(typescriptDiagnostics.runId, runId))
		.limit(1)
		.then((rows) => rows[0])
	return !diagnostic
}

async function persistExecution(
	templateId: string,
	seed: bigint,
	body: unknown
) {
	const gitCommitSha = env.VERCEL_GIT_COMMIT_SHA

	return db
		.insert(templateExecutions)
		.values({
			templateId,
			seed,
			body,
			gitCommitSha
		})
		.onConflictDoUpdate({
			target: [templateExecutions.templateId, templateExecutions.seed],
			set: {
				body,
				gitCommitSha
			}
		})
		.returning({ id: templateExecutions.id })
}

function disposeStack(
	logger: Logger,
	templateId: string,
	stack: DisposableStack,
	context: "failure" | "success"
) {
	const disposalResult = errors.trySync(() => stack.dispose())
	if (disposalResult.error) {
		logger.error("template execution cleanup failed", {
			templateId,
			context,
			error: disposalResult.error
		})
		throw errors.wrap(disposalResult.error, "template execution cleanup")
	}
}

function resolveAliasSpecifier(
	logger: Logger,
	templateId: string,
	specifier: string
): string {
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
		specifier,
		attempts
	})
	throw errors.new(`unable to resolve alias import @/${cleanSpecifier}`)
}

function rewriteAliasImports(
	logger: Logger,
	templateId: string,
	source: string
): string {
	let rewriteCount = 0
	const transformed = source.replace(
		ALIAS_IMPORT_REGEX,
		(_match, quote: string, specifier: string) => {
			rewriteCount += 1
			const resolved = resolveAliasSpecifier(logger, templateId, specifier)
			return `${quote}${resolved}${quote}`
		}
	)

	if (rewriteCount > 0) {
		logger.debug("template alias imports rewritten", {
			templateId,
			rewriteCount
		})
	}

	return transformed
}

function ensureRequiredTypeModulesAvailable(
	logger: Logger,
	templateId: string
) {
	for (const specifier of REQUIRED_ALIAS_TYPE_SPECIFIERS) {
		const resolutionResult = errors.trySync(() =>
			resolveAliasSpecifier(logger, templateId, specifier)
		)
		if (resolutionResult.error) {
			logger.error("required type module resolution failed", {
				templateId,
				specifier,
				error: resolutionResult.error
			})
			throw resolutionResult.error
		}
	}
}

export class TemplateExecutionFailedError extends Error {
	constructor(
		public readonly reason: string,
		public readonly extra: Record<string, unknown> | undefined
	) {
		super(reason)
	}
}

export async function performTemplateExecution({
	logger,
	templateId,
	seed
}: {
	logger: Logger
	templateId: string
	seed: string
}): Promise<TemplateExecutionOutcome> {
	const cleanupStack = new DisposableStack()

	const fail = (
		reason: string,
		extra?: Record<string, unknown>
	): TemplateExecutionOutcome => {
		logger.error("template execution failed", {
			templateId,
			seed,
			reason,
			...extra
		})
		disposeStack(logger, templateId, cleanupStack, "failure")
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

	const templateRecord = await fetchTemplateRecord(templateId)
	if (!templateRecord) {
		return fail("template not found")
	}

	const validated = await hasSuccessfulTypeScriptRun(templateId)
	logger.debug("fetched template record", {
		templateId,
		questionId: templateRecord.questionId,
		sourceLength: templateRecord.source.length,
		validated
	})

	if (!validated) {
		return fail("template has not been validated")
	}

	const existingExecution = await db
		.select({ id: templateExecutions.id })
		.from(templateExecutions)
		.where(
			and(
				eq(templateExecutions.templateId, templateRecord.id),
				eq(templateExecutions.seed, normalizedSeed)
			)
		)
		.limit(1)

	if (existingExecution.length > 0) {
		return fail("template execution already exists", {
			existingExecutionId: existingExecution[0].id
		})
	}

	const tempDir = await mkdtemp(path.join(tmpdir(), "template-execution-"))
	cleanupStack.defer(() => rmSync(tempDir, { recursive: true, force: true }))

	const requiredTypeModulesResult = errors.trySync(() =>
		ensureRequiredTypeModulesAvailable(logger, templateRecord.questionId)
	)
	if (requiredTypeModulesResult.error) {
		return fail("required type module missing", {
			error: requiredTypeModulesResult.error
		})
	}

	const rewrittenSource = rewriteAliasImports(
		logger,
		templateRecord.questionId,
		templateRecord.source
	)
	const sourcePath = path.join(tempDir, "template.ts")
	const writeResult = await errors.try(writeFile(sourcePath, rewrittenSource))
	if (writeResult.error) {
		return fail("failed to write template source", {
			error: writeResult.error
		})
	}

	const moduleUrl = pathToFileURL(sourcePath).href
	const importResult = await errors.try(
		import(/* webpackIgnore: true */ moduleUrl)
	)
	if (importResult.error) {
		return fail("failed to import template module", {
			error: importResult.error.toString()
		})
	}
	const importedModule = importResult.data
	if (!hasDefaultExport(importedModule)) {
		return fail("template module missing default export")
	}
	const templateFactory = importedModule.default
	if (typeof templateFactory !== "function") {
		logger.debug("template module default export must be a function")
		return fail(
			`template module default export must be a function, received ${typeof templateFactory}`
		)
	}

	const generatedBodyResult = await errors.try(templateFactory(normalizedSeed))
	if (generatedBodyResult.error) {
		return fail("template execution threw", {
			error: generatedBodyResult.error.toString()
		})
	}
	const generatedBody = generatedBodyResult.data

	const persistResult = await errors.try(
		persistExecution(templateRecord.id, normalizedSeed, generatedBody)
	)
	if (persistResult.error) {
		return fail(persistResult.error.toString(), {
			error: persistResult.error.toString()
		})
	}

	const executionRecord = persistResult.data[0]
	if (!executionRecord) {
		return fail("persisted execution missing result row")
	}

	disposeStack(logger, templateId, cleanupStack, "success")

	logger.info("template execution completed", {
		templateId,
		seed,
		executionId: executionRecord.id
	})

	return { status: "succeeded", executionId: executionRecord.id }
}

export async function ensureExecutionForSeed({
	logger,
	templateId,
	seed
}: {
	logger: Logger
	templateId: string
	seed: string
}): Promise<ExecutionRecord> {
	const templateRecord = await fetchTemplateRecord(templateId)
	if (!templateRecord) {
		logger.error("template not found", {
			templateId
		})
		throw new TemplateNotValidatedError(templateId)
	}

	const validated = await hasSuccessfulTypeScriptRun(templateId)
	if (!validated) {
		logger.error("template not validated", {
			templateId
		})
		throw new TemplateNotValidatedError(templateId)
	}

	const normalizedSeed = BigInt(seed)

	const cachedExecution = await db
		.select({
			id: templateExecutions.id,
			templateId: templateExecutions.templateId,
			questionId: templates.questionId,
			seed: templateExecutions.seed,
			body: templateExecutions.body,
			createdAt: templateExecutions.createdAt
		})
		.from(templateExecutions)
		.innerJoin(templates, eq(templates.id, templateExecutions.templateId))
		.where(
			and(
				eq(templateExecutions.templateId, templateId),
				eq(templateExecutions.seed, normalizedSeed)
			)
		)
		.limit(1)

	if (cachedExecution.length > 0) {
		logger.debug("template seed execution cache hit", {
			templateId,
			seed: normalizedSeed.toString(),
			executionId: cachedExecution[0].id
		})
		return cachedExecution[0]
	}

	const executionResult = await performTemplateExecution({
		logger,
		templateId,
		seed
	})

	if (executionResult.status === "failed") {
		logger.error("template execution failed", {
			templateId,
			seed,
			reason: executionResult.reason,
			extra: executionResult.extra
		})
		throw new TemplateExecutionFailedError(
			executionResult.reason,
			executionResult.extra
		)
	}

	const record = await fetchExecutionRecord(executionResult.executionId)
	if (!record) {
		logger.error("template execution record missing after creation", {
			templateId,
			seed,
			executionId: executionResult.executionId
		})
		throw errors.new("execution record missing after creation")
	}

	return record
}
