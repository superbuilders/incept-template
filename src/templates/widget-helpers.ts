import { existsSync, readFileSync } from "node:fs"
import * as path from "node:path"
import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"
import { resolveLibPath } from "@/internal/paths"

const REGISTRY_PATH = resolveLibPath("widgets/registry.ts")

export const ErrWidgetGeneratorMissing = errors.new(
	"widget generator source missing"
)
export const ErrWidgetRegistryParseFailed = errors.new(
	"widget registry parse failed"
)

let widgetModuleIndex: Map<string, string> | null = null

function buildWidgetModuleIndex(logger: Logger): Map<string, string> {
	if (widgetModuleIndex) {
		return widgetModuleIndex
	}

	const registryResult = errors.trySync(() =>
		readFileSync(REGISTRY_PATH, "utf-8")
	)
	if (registryResult.error) {
		logger.error("failed to read widget registry", {
			registryPath: REGISTRY_PATH,
			error: registryResult.error
		})
		throw errors.wrap(registryResult.error, "read widget registry")
	}
	const registrySource = registryResult.data

	// Map schema identifier to module specifier (e.g., FractionModelDiagramPropsSchema -> "@/widgets/generators/fractional-model-diagram")
	const schemaImportMap = new Map<string, string>()
	const importPattern = /import\s+\{([^}]+)\}\s+from\s+"([^"]+)"/g
	for (
		let importMatch = importPattern.exec(registrySource);
		importMatch !== null;
		importMatch = importPattern.exec(registrySource)
	) {
		const identifiers = importMatch[1]
			.split(",")
			.map((token) => token.trim())
			.filter(Boolean)
		for (const identifier of identifiers) {
			schemaImportMap.set(identifier, importMatch[2])
		}
	}

	const startIndex = registrySource.indexOf("const allWidgetSchemas = {")
	if (startIndex === -1) {
		logger.error("could not locate widget schemas block in registry", {
			registryPath: REGISTRY_PATH
		})
		throw errors.wrap(
			ErrWidgetRegistryParseFailed,
			"missing allWidgetSchemas block"
		)
	}
	const endIndex = registrySource.indexOf("} as const", startIndex)
	if (endIndex === -1) {
		logger.error("could not locate end of widget schemas block", {
			registryPath: REGISTRY_PATH
		})
		throw errors.wrap(
			ErrWidgetRegistryParseFailed,
			"missing allWidgetSchemas terminator"
		)
	}
	const blockSource = registrySource.slice(startIndex, endIndex)

	const moduleIndex = new Map<string, string>()
	const entryPattern = /([a-zA-Z0-9_]+)\s*:\s*([A-Za-z0-9_]+)/g
	for (
		let entryMatch = entryPattern.exec(blockSource);
		entryMatch !== null;
		entryMatch = entryPattern.exec(blockSource)
	) {
		const widgetType = entryMatch[1]
		const schemaIdentifier = entryMatch[2]
		const moduleSpecifier = schemaImportMap.get(schemaIdentifier)
		if (!moduleSpecifier) {
			logger.error("widget schema import missing module specifier", {
				widgetType,
				schemaIdentifier
			})
			throw errors.wrap(ErrWidgetRegistryParseFailed, widgetType)
		}
		moduleIndex.set(widgetType, moduleSpecifier)
	}

	widgetModuleIndex = moduleIndex
	return moduleIndex
}

function resolveModuleSpecifierToPath(moduleSpecifier: string): string {
	// Support our alias convention "@/foo/bar"
	if (moduleSpecifier.startsWith("@/")) {
		const relativePath = moduleSpecifier.slice(2)
		const withExtension = moduleSpecifier.endsWith(".ts")
			? relativePath
			: `${relativePath}.ts`
		return resolveLibPath(withExtension)
	}
	// Already a relative path from registry location
	if (moduleSpecifier.startsWith("./") || moduleSpecifier.startsWith("../")) {
		const withExtension = moduleSpecifier.endsWith(".ts")
			? moduleSpecifier
			: `${moduleSpecifier}.ts`
		return path.resolve(path.dirname(REGISTRY_PATH), withExtension)
	}
	// Fallback: treat as absolute module path relative to project root
	const withExtension = moduleSpecifier.endsWith(".ts")
		? moduleSpecifier
		: `${moduleSpecifier}.ts`
	return resolveLibPath(withExtension)
}

function loadWidgetSource(widgetType: string, logger: Logger): string {
	const moduleIndex = buildWidgetModuleIndex(logger)
	const moduleSpecifier = moduleIndex.get(widgetType)
	if (!moduleSpecifier) {
		logger.error("widget type not registered", { widgetType })
		throw errors.wrap(ErrWidgetGeneratorMissing, widgetType)
	}

	const generatorPath = resolveModuleSpecifierToPath(moduleSpecifier)
	if (!existsSync(generatorPath)) {
		logger.error("widget generator source not found", {
			widgetType,
			generatorPath
		})
		throw errors.wrap(ErrWidgetGeneratorMissing, widgetType)
	}

	const sourceResult = errors.trySync(() =>
		readFileSync(generatorPath, "utf-8")
	)
	if (sourceResult.error) {
		logger.error("failed to read widget generator source", {
			widgetType,
			generatorPath,
			error: sourceResult.error
		})
		throw errors.wrap(sourceResult.error, "read widget generator source")
	}

	return sourceResult.data
}

export function createWidgetHelperSections(
	logger: Logger,
	allowedWidgets: readonly string[]
): string[] {
	const uniqueWidgets = Array.from(new Set(allowedWidgets))
	const sections: string[] = []
	for (const widget of uniqueWidgets) {
		const source = loadWidgetSource(widget, logger)
		sections.push(
			`### WIDGET_HELPER_${widget.toUpperCase()}
<widget_helper type="${widget}">
${source.trim()}
</widget_helper>`
		)
	}
	return sections
}
