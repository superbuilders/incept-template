import * as path from "node:path"
import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"
import * as ts from "typescript"
import { resolveLibPath } from "@/internal/paths"
import type { TypeScriptDiagnostic } from "@/templates/types"

let virtualFileCounter = 0
function nextVirtualFilename(): string {
	virtualFileCounter += 1
	return path.join(
		process.cwd(),
		"__virtual_templates__",
		`template-${virtualFileCounter}.ts`
	)
}

export async function typeCheckSource(
	logger: Logger,
	source: string
): Promise<TypeScriptDiagnostic[]> {
	const virtualPath = nextVirtualFilename()
	const normalizedVirtualPath = normalizePath(virtualPath)
	logger.info("running in-process typecheck", { file: normalizedVirtualPath })

	const configPathResult = errors.trySync(() =>
		ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.json")
	)
	if (configPathResult.error || !configPathResult.data) {
		logger.error("could not find tsconfig.json", {
			error: configPathResult.error
		})
		throw errors.new("tsconfig.json not found")
	}
	const configPath = configPathResult.data

	const configFileResult = errors.trySync(() =>
		ts.readConfigFile(configPath, ts.sys.readFile)
	)
	if (configFileResult.error || configFileResult.data.error) {
		logger.error("failed to read tsconfig.json", {
			error: configFileResult.error ?? configFileResult.data.error
		})
		throw errors.new("failed to read tsconfig.json")
	}

	const parsedConfig = ts.parseJsonConfigFileContent(
		configFileResult.data.config,
		ts.sys,
		path.dirname(configPath)
	)
	if (parsedConfig.errors.length > 0) {
		logger.error("errors parsing tsconfig.json", {
			errors: parsedConfig.errors
		})
		throw errors.new("errors parsing tsconfig.json")
	}

	const relevantDirectories = [
		normalizePath(resolveLibPath("templates")),
		normalizePath(resolveLibPath("widgets"))
	]

	const templateRelatedFileNames = parsedConfig.fileNames.filter((fileName) => {
		const normalizedFileName = normalizePath(fileName)
		return relevantDirectories.some((directory) =>
			isWithinDirectory(normalizedFileName, directory)
		)
	})

	const host = createInMemoryHost(
		parsedConfig.options,
		normalizedVirtualPath,
		source
	)

	const rootFiles = templateRelatedFileNames.some(
		(name) => normalizePath(name) === normalizedVirtualPath
	)
		? [...templateRelatedFileNames]
		: [...templateRelatedFileNames, normalizedVirtualPath]

	const program = ts.createProgram({
		rootNames: rootFiles,
		options: parsedConfig.options,
		host
	})
	const allDiagnostics = ts.getPreEmitDiagnostics(program)

	const diagnostics: TypeScriptDiagnostic[] = []
	for (const diagnostic of allDiagnostics) {
		if (!diagnostic.file || diagnostic.start === undefined) continue
		const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
			diagnostic.start
		)
		const message = ts.flattenDiagnosticMessageText(
			diagnostic.messageText,
			"\n"
		)
		diagnostics.push({
			message,
			line: line + 1,
			column: character + 1,
			tsCode: diagnostic.code
		})
	}

	if (diagnostics.length > 0) {
		logger.warn("typecheck produced diagnostics", {
			file: normalizedVirtualPath,
			diagnosticsCount: diagnostics.length
		})
		logger.debug("typecheck diagnostic detail", { diagnostics })
	} else {
		logger.info("typecheck passed", { file: normalizedVirtualPath })
	}

	return diagnostics
}

function createInMemoryHost(
	options: ts.CompilerOptions,
	virtualFilePath: string,
	source: string
): ts.CompilerHost {
	const baseHost = ts.createCompilerHost(options, true)
	const virtualFileName = normalizePath(virtualFilePath)

	const originalGetSourceFile = baseHost.getSourceFile.bind(baseHost)
	baseHost.getSourceFile = (
		fileName,
		languageVersion,
		onError,
		shouldCreateNewSourceFile
	): ts.SourceFile | undefined => {
		if (normalizePath(fileName) === virtualFileName) {
			const target = options.target ?? ts.ScriptTarget.ES2022
			return ts.createSourceFile(fileName, source, target, true)
		}
		return originalGetSourceFile(
			fileName,
			languageVersion,
			onError,
			shouldCreateNewSourceFile
		)
	}

	const originalFileExists = baseHost.fileExists?.bind(baseHost)
	baseHost.fileExists = (fileName: string): boolean => {
		if (normalizePath(fileName) === virtualFileName) return true
		return originalFileExists
			? originalFileExists(fileName)
			: ts.sys.fileExists(fileName)
	}

	const originalReadFile = baseHost.readFile?.bind(baseHost)
	baseHost.readFile = (fileName: string): string | undefined => {
		if (normalizePath(fileName) === virtualFileName) return source
		return originalReadFile
			? originalReadFile(fileName)
			: ts.sys.readFile(fileName)
	}

	baseHost.writeFile = () => {
		// no-op: we only need diagnostics, not emitted output
	}

	return baseHost
}

function normalizePath(filePath: string): string {
	const resolved = path.resolve(filePath)
	return ts.sys.useCaseSensitiveFileNames ? resolved : resolved.toLowerCase()
}

function isWithinDirectory(filePath: string, directoryPath: string): boolean {
	const directoryWithSeparator = directoryPath.endsWith(path.sep)
		? directoryPath
		: `${directoryPath}${path.sep}`
	return (
		filePath === directoryPath || filePath.startsWith(directoryWithSeparator)
	)
}
