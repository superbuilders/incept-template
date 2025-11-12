import { existsSync, readdirSync } from "node:fs"
import * as path from "node:path"
import { pathToFileURL } from "node:url"
import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { compile } from "@/compiler/compiler"
import type { FeedbackPlanAny } from "@/core/feedback/plan"
import type { AssessmentItemInput } from "@/core/item"
import { allWidgetsCollection } from "@/widgets/collections/all"
import type { WidgetTypeTupleFrom } from "@/widgets/collections/types"

type TemplateFactory = (
	seed: bigint
) => AssessmentItemInput<
	WidgetTypeTupleFrom<typeof allWidgetsCollection>,
	FeedbackPlanAny
>

const TEMPLATE_ROOT = path.resolve(
	process.cwd(),
	"src/templates/prompts/examples/positive/templates"
)
const TEMPLATE_EXTENSIONS = [".ts", ".tsx", ".js", ".mjs", ".cjs"] as const

function getAvailableTemplates(): string[] {
	return readdirSync(TEMPLATE_ROOT, { withFileTypes: true })
		.filter(
			(entry) =>
				entry.isFile() &&
				TEMPLATE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))
		)
		.map((entry) => entry.name.replace(/\.(ts|tsx|js|mjs|cjs)$/u, ""))
		.sort()
}

function resolveTemplateModuleUrl(templateId: string): string {
	for (const ext of TEMPLATE_EXTENSIONS) {
		const candidatePath = path.join(TEMPLATE_ROOT, `${templateId}${ext}`)
		if (existsSync(candidatePath)) {
			return pathToFileURL(candidatePath).href
		}
	}
	logger.error("template module not found", {
		templateId,
		templateRoot: TEMPLATE_ROOT
	})
	throw errors.new(`template "${templateId}" not found in ${TEMPLATE_ROOT}`)
}

function hasDefaultExport(value: unknown): value is { default: unknown } {
	return typeof value === "object" && value !== null && "default" in value
}

function isTemplateFactory(value: unknown): value is TemplateFactory {
	return typeof value === "function"
}

function ensureTemplateFactory(
	value: unknown,
	templateId: string
): TemplateFactory {
	if (!isTemplateFactory(value)) {
		logger.error("template module default export invalid", {
			templateId,
			exportType: typeof value
		})
		throw errors.new(
			`template "${templateId}" default export must be a function, received ${typeof value}`
		)
	}
	return value
}

async function main() {
	const args = process.argv.slice(2)
	let templateId: string | undefined
	let seed = 0n

	for (const arg of args) {
		if (arg.startsWith("--seed=")) {
			const raw = arg.slice("--seed=".length)
			if (!raw) {
				logger.error("missing seed value")
				process.exit(1)
			}
			const parsedSeed = errors.trySync(() => BigInt(raw))
			if (parsedSeed.error) {
				logger.error("invalid seed value", {
					value: raw,
					error: parsedSeed.error
				})
				process.exit(1)
			}
			seed = parsedSeed.data
		} else if (!templateId) {
			templateId = arg
		}
	}

	const availableTemplates = getAvailableTemplates()

	if (!templateId) {
		logger.error("template name argument required", {
			availableTemplates
		})
		process.exit(1)
	}

	if (!availableTemplates.includes(templateId)) {
		logger.error("unknown template requested", {
			templateId,
			availableTemplates
		})
		process.exit(1)
	}

	const moduleUrl = resolveTemplateModuleUrl(templateId)
	const importResult = await errors.try(import(moduleUrl))
	if (importResult.error) {
		logger.error("failed to import template module", {
			templateId,
			error: importResult.error.toString()
		})
		throw errors.wrap(importResult.error, "template module import")
	}
	const importedModule = importResult.data
	if (!hasDefaultExport(importedModule)) {
		logger.error("template module missing default export", { templateId })
		throw errors.new(`template "${templateId}" module missing default export`)
	}
	const generateQuestion = ensureTemplateFactory(
		importedModule.default,
		templateId
	)

	const itemInputResult = errors.trySync(() => generateQuestion(seed))
	if (itemInputResult.error) {
		logger.error("template function failed", {
			templateId,
			seed: seed.toString(),
			error: itemInputResult.error
		})
		throw errors.wrap(itemInputResult.error, "template generation")
	}
	const assessmentItemInput = itemInputResult.data

	const compileResult = await errors.try(
		compile(assessmentItemInput, allWidgetsCollection)
	)
	if (compileResult.error) {
		logger.error("qti compilation failed", {
			templateId,
			seed: seed.toString(),
			error: compileResult.error
		})
		throw errors.wrap(compileResult.error, "compilation")
	}
	const qtiXml = compileResult.data
	process.stdout.write(`${qtiXml}\n`)
}

// Execute the main function and handle potential errors at the top level.
const result = await errors.try(main())
if (result.error) {
	logger.error("template poc script failed", { error: result.error })
	process.exit(1)
}
