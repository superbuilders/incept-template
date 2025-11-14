import { existsSync, rmSync } from "node:fs"
import { mkdtemp } from "node:fs/promises"
import { tmpdir } from "node:os"
import * as path from "node:path"
import { pathToFileURL } from "node:url"
import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"
import { eq } from "drizzle-orm"
import { compile } from "@/compiler/compiler"
import type { FeedbackPlanAny } from "@/core/feedback/plan"
import type { AssessmentItemInput } from "@/core/item"
import { db } from "@/db"
import type { TemplateRecord } from "@/db/schema"
import { templates } from "@/db/schema"
import { ErrTemplateExecutionFailed, ErrTemplateNotValidated } from "@/errors"
import { widgetCollections } from "@/widgets/collections"
import type { WidgetTypeTupleFrom } from "@/widgets/collections/types"

type ModuleWithDefault = { default: unknown }

type SeedParseResult =
	| { success: true; value: bigint }
	| { success: false; reason: string }

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

const widgetCollection = widgetCollections.all

type TemplateAssessmentItem = AssessmentItemInput<
	WidgetTypeTupleFrom<typeof widgetCollection>,
	FeedbackPlanAny
>

export type TemplateExecution = {
	templateId: string
	exemplarQuestionId: string
	seed: bigint
	body: TemplateAssessmentItem
	createdGitCommitSha: string | null
}

function hasDefaultExport(value: unknown): value is ModuleWithDefault {
	return typeof value === "object" && value !== null && "default" in value
}

async function fetchTemplateRecord(templateId: string) {
	const row = await db
		.select({
			id: templates.id,
			exemplarQuestionId: templates.exemplarQuestionId,
			source: templates.source,
			createdGitCommitSha: templates.createdGitCommitSha,
			createdAt: templates.createdAt,
			typescriptPassedWithZeroDiagnosticsAt:
				templates.typescriptPassedWithZeroDiagnosticsAt
		})
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)
		.then((rows) => rows[0])

	return row ?? undefined
}

function parseSeed(seed: string): SeedParseResult {
	const trimmed = seed.trim()
	const parsedResult = errors.trySync(() => BigInt(trimmed))
	if (parsedResult.error) {
		return {
			success: false,
			reason: "seed must be a base-10 integer string"
		}
	}
	const parsed = parsedResult.data
	if (parsed < 0) {
		return {
			success: false,
			reason: "seed must be non-negative"
		}
	}
	return { success: true, value: parsed }
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

type LoadedTemplateFactory = {
	execute(seed: bigint): Promise<TemplateAssessmentItem>
	cleanup(): void
}

async function loadTemplateFactory(
	logger: Logger,
	template: TemplateRecord
): Promise<LoadedTemplateFactory> {
	const cleanupStack = new DisposableStack()

	const disposeCleanup = () => {
		const disposeResult = errors.trySync(() => cleanupStack.dispose())
		if (disposeResult.error) {
			logger.error("template execution cleanup failed", {
				templateId: template.id,
				error: disposeResult.error
			})
		}
	}

	const fail = (operation: string, error?: Error): never => {
		disposeCleanup()
		const baseError = error ?? ErrTemplateExecutionFailed
		logger.error("template execution setup failed", {
			templateId: template.id,
			operation,
			error: baseError
		})
		throw errors.wrap(baseError, operation)
	}

	const tempDirResult = await errors.try(
		mkdtemp(path.join(tmpdir(), `template-execution-${template.id}-`))
	)
	if (tempDirResult.error) {
		fail("template execution workspace", tempDirResult.error)
	}
	const tempDir =
		tempDirResult.data ?? fail("template execution workspace missing")
	cleanupStack.defer(() => rmSync(tempDir, { recursive: true, force: true }))

	const requiredModulesResult = errors.trySync(() =>
		ensureRequiredTypeModulesAvailable(logger, template.exemplarQuestionId)
	)
	if (requiredModulesResult.error) {
		fail("required type module resolution", requiredModulesResult.error)
	}

	const rewriteResult = errors.trySync(() =>
		rewriteAliasImports(logger, template.exemplarQuestionId, template.source)
	)
	if (rewriteResult.error) {
		fail("rewrite template imports", rewriteResult.error)
	}
	const rewrittenSource =
		rewriteResult.data ?? fail("rewrite template imports missing")

	const sourcePath = path.join(tempDir, "template.ts")
	const writeResult = await errors.try(Bun.write(sourcePath, rewrittenSource))
	if (writeResult.error) {
		fail("write template source", writeResult.error)
	}

	const moduleUrl = pathToFileURL(sourcePath).href
	const importResult = await errors.try(
		import(/* webpackIgnore: true */ moduleUrl)
	)
	if (importResult.error) {
		fail("import template module", importResult.error)
	}
	const importedModule = importResult.data
	if (!hasDefaultExport(importedModule)) {
		fail("template module missing default export")
	}
	const templateFactoryCandidate = importedModule.default
	if (typeof templateFactoryCandidate !== "function") {
		fail("template module default export must be a function")
	}
	const templateFactory = templateFactoryCandidate

	const factory: LoadedTemplateFactory = {
		async execute(seed: bigint): Promise<TemplateAssessmentItem> {
			const bodyResult = await errors.try(templateFactory(seed))
			if (bodyResult.error) {
				logger.error("template execution run failed", {
					templateId: template.id,
					seed: seed.toString(),
					error: bodyResult.error
				})
				throw errors.wrap(ErrTemplateExecutionFailed, "template execution run")
			}
			const body = bodyResult.data
			// @ts-expect-error: validated template factories return AssessmentItemInput
			return body
		},
		cleanup: disposeCleanup
	}

	return factory
}

async function compileExecutionToXml({
	logger,
	templateId,
	seed,
	body
}: {
	logger: Logger
	templateId: string
	seed: bigint
	body: TemplateAssessmentItem
}): Promise<string> {
	const xmlResult = await errors.try(compile(body, widgetCollection))
	if (xmlResult.error) {
		logger.error("template execution xml compilation failed", {
			templateId,
			seed: seed.toString(),
			error: xmlResult.error
		})
		throw errors.wrap(
			ErrTemplateExecutionFailed,
			"failed to compile assessment item"
		)
	}
	return xmlResult.data
}

async function ensureTemplateContext(templateId: string, logger: Logger) {
	const templateRecord = await fetchTemplateRecord(templateId)
	if (!templateRecord) {
		logger.error("template not found", { templateId })
		throw errors.wrap(ErrTemplateNotValidated, "template missing")
	}

	const validatedAt = templateRecord.typescriptPassedWithZeroDiagnosticsAt
	if (!validatedAt) {
		logger.error("template not validated", { templateId })
		throw errors.wrap(ErrTemplateNotValidated, "template not validated")
	}

	return templateRecord
}

function mapExecution({
	template,
	seed,
	body
}: {
	template: TemplateRecord
	seed: bigint
	body: TemplateAssessmentItem
}): TemplateExecution {
	return {
		templateId: template.id,
		exemplarQuestionId: template.exemplarQuestionId,
		seed,
		body,
		createdGitCommitSha: template.createdGitCommitSha ?? null
	}
}

export async function executeTemplate({
	logger,
	templateId,
	seed
}: {
	logger: Logger
	templateId: string
	seed: bigint
}): Promise<TemplateExecution> {
	const normalizedSeed = seed

	const templateRecord = await ensureTemplateContext(templateId, logger)

	const factoryResult = await errors.try(
		loadTemplateFactory(logger, templateRecord)
	)
	if (factoryResult.error) {
		logger.error("template execution setup failed", {
			templateId,
			seed: normalizedSeed.toString(),
			error: factoryResult.error
		})
		throw errors.wrap(ErrTemplateExecutionFailed, "template execution setup")
	}
	const factory = factoryResult.data

	const bodyResult = await errors.try(factory.execute(normalizedSeed))
	if (bodyResult.error) {
		factory.cleanup()
		logger.error("template execution run failed", {
			templateId,
			seed: normalizedSeed.toString(),
			error: bodyResult.error
		})
		throw errors.wrap(ErrTemplateExecutionFailed, "template execution run")
	}

	const execution = mapExecution({
		template: templateRecord,
		seed: normalizedSeed,
		body: bodyResult.data
	})

	factory.cleanup()

	return execution
}

export async function executeTemplateToXml({
	logger,
	templateId,
	seed
}: {
	logger: Logger
	templateId: string
	seed: bigint
}): Promise<{ execution: TemplateExecution; xml: string }> {
	const execution = await executeTemplate({ logger, templateId, seed })
	const xml = await compileExecutionToXml({
		logger,
		templateId: execution.templateId,
		seed: execution.seed,
		body: execution.body
	})
	return { execution, xml }
}

export async function executeTemplatesToXml({
	logger,
	templateId,
	seeds
}: {
	logger: Logger
	templateId: string
	seeds: readonly string[]
}): Promise<
	Array<{ seed: string; execution: TemplateExecution; xml: string }>
> {
	if (seeds.length === 0) {
		return []
	}

	const templateRecord = await ensureTemplateContext(templateId, logger)

	const normalizedSeeds = seeds.map((seed) => {
		const parsed = parseSeed(seed)
		if (!parsed.success) {
			logger.error("template execution received invalid seed", {
				templateId,
				seed,
				reason: parsed.reason
			})
			throw errors.wrap(ErrTemplateExecutionFailed, parsed.reason)
		}
		return { original: seed, normalized: parsed.value }
	})

	const factoryResult = await errors.try(
		loadTemplateFactory(logger, templateRecord)
	)
	if (factoryResult.error) {
		logger.error("template execution setup failed", {
			templateId,
			error: factoryResult.error
		})
		throw errors.wrap(ErrTemplateExecutionFailed, "template execution setup")
	}
	const factory = factoryResult.data

	const executionPromises = normalizedSeeds.map(
		async ({ original, normalized }) => {
			const body = await factory.execute(normalized)
			const execution = mapExecution({
				template: templateRecord,
				seed: normalized,
				body
			})
			const xml = await compileExecutionToXml({
				logger,
				templateId,
				seed: normalized,
				body
			})
			return { seed: original, execution, xml }
		}
	)

	const settledResults = await Promise.allSettled(executionPromises)

	const firstRejected = settledResults.find(
		(result): result is PromiseRejectedResult => result.status === "rejected"
	)

	if (firstRejected) {
		const failure = firstRejected.reason
		if (errors.is(failure, ErrTemplateNotValidated)) {
			factory.cleanup()
			logger.error("template execution range failed", {
				templateId,
				rangeSize: seeds.length,
				error: failure
			})
			throw failure
		}
		if (errors.is(failure, ErrTemplateExecutionFailed)) {
			factory.cleanup()
			logger.error("template execution range failed", {
				templateId,
				rangeSize: seeds.length,
				error: failure
			})
			throw failure
		}

		factory.cleanup()
		logger.error("template execution range failed", {
			templateId,
			rangeSize: seeds.length,
			error: failure
		})
		throw errors.wrap(
			ErrTemplateExecutionFailed,
			String(failure ?? "template execution failed")
		)
	}

	const fulfilledResults = settledResults.filter(
		(
			result
		): result is PromiseFulfilledResult<{
			seed: string
			execution: TemplateExecution
			xml: string
		}> => result.status === "fulfilled"
	)

	const executions = fulfilledResults.map((result) => result.value)
	factory.cleanup()

	return executions
}
