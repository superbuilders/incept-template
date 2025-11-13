import { existsSync, rmSync } from "node:fs"
import { mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import * as path from "node:path"
import { pathToFileURL } from "node:url"
import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"
import { and, eq } from "drizzle-orm"
import { db } from "@/db"
import { templateExecutions, templates } from "@/db/schema"
import { env } from "@/env"
import { ErrTemplateExecutionFailed, ErrTemplateNotValidated } from "@/errors"

type TemplateExecutionOutcome =
	| { status: "succeeded"; templateId: string; seed: bigint }
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

async function fetchTemplateRecord(templateId: string) {
	const row = await db
		.select({
			id: templates.id,
			exemplarQuestionId: templates.exemplarQuestionId,
			source: templates.source
		})
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)
		.then((rows) => rows[0])

	return row ?? undefined
}

async function hasSuccessfulTypeScriptRun(
	templateId: string
): Promise<boolean> {
	const templateRow = await db
		.select({
			validatedAt: templates.typescriptPassedWithZeroDiagnosticsAt
		})
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)
		.then((rows) => rows[0])
	if (!templateRow?.validatedAt) return false
	return true
}

async function persistExecution(
	templateId: string,
	seed: bigint,
	body: unknown
) {
	const createdGitCommitSha = env.VERCEL_GIT_COMMIT_SHA

	return db
		.insert(templateExecutions)
		.values({
			templateId,
			seed,
			body,
			createdGitCommitSha
		})
		.onConflictDoUpdate({
			target: [templateExecutions.templateId, templateExecutions.seed],
			set: {
				body,
				createdGitCommitSha,
				xml: null,
				xmlGeneratedAt: null,
				xmlGeneratedGitCommitSha: null
			}
		})
		.returning({
			templateId: templateExecutions.templateId,
			seed: templateExecutions.seed
		})
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
		exemplarQuestionId: templateRecord.exemplarQuestionId,
		sourceLength: templateRecord.source.length,
		validated
	})

	if (!validated) {
		return fail("template has not been validated")
	}

	const existingExecution = await db
		.select({ seed: templateExecutions.seed })
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
			existingExecutionSeed: existingExecution[0].seed.toString()
		})
	}

	const tempDir = await mkdtemp(path.join(tmpdir(), "template-execution-"))
	cleanupStack.defer(() => rmSync(tempDir, { recursive: true, force: true }))

	const requiredTypeModulesResult = errors.trySync(() =>
		ensureRequiredTypeModulesAvailable(
			logger,
			templateRecord.exemplarQuestionId
		)
	)
	if (requiredTypeModulesResult.error) {
		return fail("required type module missing", {
			error: requiredTypeModulesResult.error
		})
	}

	const rewrittenSource = rewriteAliasImports(
		logger,
		templateRecord.exemplarQuestionId,
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
		executionSeed: executionRecord.seed.toString()
	})

	return {
		status: "succeeded" as const,
		templateId: executionRecord.templateId,
		seed: executionRecord.seed
	}
}

export async function ensureExecutionForSeed({
	logger,
	templateId,
	seed
}: {
	logger: Logger
	templateId: string
	seed: string
}) {
	const templateRecord = await fetchTemplateRecord(templateId)
	if (!templateRecord) {
		logger.error("template not found", {
			templateId
		})
		throw errors.wrap(ErrTemplateNotValidated, "template missing")
	}

	const validated = await hasSuccessfulTypeScriptRun(templateId)
	if (!validated) {
		logger.error("template not validated", {
			templateId
		})
		throw errors.wrap(ErrTemplateNotValidated, "template not validated")
	}

	const normalizedSeed = BigInt(seed)

	const cachedExecution = await db
		.select({
			templateId: templateExecutions.templateId,
			exemplarQuestionId: templates.exemplarQuestionId,
			seed: templateExecutions.seed,
			body: templateExecutions.body,
			xml: templateExecutions.xml,
			xmlGeneratedAt: templateExecutions.xmlGeneratedAt,
			xmlGeneratedGitCommitSha: templateExecutions.xmlGeneratedGitCommitSha,
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
		const cached = cachedExecution[0]
		logger.debug("template seed execution cache hit", {
			templateId,
			seed: normalizedSeed.toString(),
			createdAt: cached.createdAt.toISOString()
		})
		return cached
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
		throw errors.wrap(ErrTemplateExecutionFailed, executionResult.reason)
	}

	const executionSeed = executionResult.seed

	const record = await db
		.select({
			templateId: templateExecutions.templateId,
			exemplarQuestionId: templates.exemplarQuestionId,
			seed: templateExecutions.seed,
			body: templateExecutions.body,
			xml: templateExecutions.xml,
			xmlGeneratedAt: templateExecutions.xmlGeneratedAt,
			xmlGeneratedGitCommitSha: templateExecutions.xmlGeneratedGitCommitSha,
			createdAt: templateExecutions.createdAt
		})
		.from(templateExecutions)
		.innerJoin(templates, eq(templates.id, templateExecutions.templateId))
		.where(
			and(
				eq(templateExecutions.templateId, executionResult.templateId),
				eq(templateExecutions.seed, executionSeed)
			)
		)
		.limit(1)
		.then((rows) => rows[0] ?? null)

	if (!record) {
		logger.error("template execution record missing after creation", {
			templateId,
			seed,
			executionSeed: executionSeed.toString()
		})
		throw errors.new("execution record missing after creation")
	}

	return record
}
