// biome-ignore-all lint/suspicious/noConsole: dump script requires console.log

import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import * as errors from "@superbuilders/errors"

import type { Logger } from "@superbuilders/slog"
import { composeInitialPrompt } from "@/templates/prompts/initial"
import { composeRetryPrompt } from "@/templates/prompts/retry"
import type { TypeScriptDiagnostic } from "@/templates/types"

type DumpConfig = {
	allowedWidgets: string[]
	sourceContext: string
	previousCode: string
	diagnostics: TypeScriptDiagnostic[]
}

type DumpConfigOverrides = {
	allowedWidgets?: string[]
	sourceContext?: string
	sourceContextFile?: string
	previousCode?: string
	previousCodeFile?: string
	diagnostics?: TypeScriptDiagnostic[]
	diagnosticsFile?: string
}

const DEFAULT_CONFIG: DumpConfig = {
	allowedWidgets: [],
	sourceContext: "No source context provided.",
	previousCode: "// previous attempt not provided.",
	diagnostics: []
}

const CONFIG_FILE_NAME = "scripts/template/dump-prompts.config.json"

type SectionStub = {
	tag: string
	placeholder: string
}

type PromptKind = "initial" | "retry"

const SECTION_STUBS: readonly SectionStub[] = [
	{
		tag: "assessment_item_types",
		placeholder: "[assessment item types omitted]"
	},
	{
		tag: "content_types",
		placeholder: "[content types omitted]"
	},
	{
		tag: "interaction_types",
		placeholder: "[interaction types omitted]"
	},
	{
		tag: "feedback_plan_types",
		placeholder: "[feedback plan types omitted]"
	},
	{
		tag: "feedback_plan_schema",
		placeholder: "[feedback plan schema omitted]"
	},
	{
		tag: "feedback_content_types",
		placeholder: "[feedback content types omitted]"
	},
	{
		tag: "feedback_authoring_types",
		placeholder: "[feedback authoring types omitted]"
	},
	{
		tag: "seed_helpers",
		placeholder: "[seed helpers omitted]"
	},
	{
		tag: "contract",
		placeholder: "[template contract omitted]"
	},
	{
		tag: "widget_helper",
		placeholder: "[widget helper source omitted]"
	},
	{
		tag: "code",
		placeholder: "[code omitted]"
	}
]

const consoleLogger: Logger = {
	debug(message, attributes) {
		console.log("[debug]", message, attributes ?? "")
	},
	info(message, attributes) {
		console.log("[info]", message, attributes ?? "")
	},
	warn(message, attributes) {
		console.log("[warn]", message, attributes ?? "")
	},
	error(message, attributes) {
		console.log("[error]", message, attributes ?? "")
	}
}

async function main(): Promise<void> {
	const promptKind = parsePromptSelection()
	const config = await loadConfig()

	console.log("=== prompt dump configuration ===")
	console.log(JSON.stringify({ promptKind, ...config }, null, 2))

	if (promptKind === "initial") {
		const initialArtifacts = composeInitialPrompt(
			consoleLogger,
			config.allowedWidgets,
			config.sourceContext
		)

		console.log("\n=== initial prompt ===")
		console.log("\n--- system prompt ---")
		console.log(initialArtifacts.systemPrompt)
		console.log("\n--- user prompt (stubbed) ---")
		console.log(stubPrompt(initialArtifacts.userPrompt))
		return
	}

	const retryArtifacts = composeRetryPrompt(
		consoleLogger,
		config.allowedWidgets,
		config.sourceContext,
		config.previousCode,
		config.diagnostics
	)

	console.log("\n=== retry prompt ===")
	console.log("\n--- system prompt ---")
	console.log(retryArtifacts.systemPrompt)
	console.log("\n--- user prompt (stubbed) ---")
	console.log(stubPrompt(retryArtifacts.userPrompt))
}

const result = await errors.try(main())
if (result.error) {
	console.log("prompt dump failed", result.error)
	process.exit(1)
}

async function loadConfig(): Promise<DumpConfig> {
	const overrides = await loadConfigFile()

	const allowedWidgets =
		overrides.allowedWidgets ?? DEFAULT_CONFIG.allowedWidgets

	let sourceContext = DEFAULT_CONFIG.sourceContext
	if (overrides.sourceContextFile) {
		const loaded = await readTextFile(overrides.sourceContextFile)
		if (loaded !== null) {
			sourceContext = loaded
		}
	} else if (overrides.sourceContext !== undefined) {
		sourceContext = overrides.sourceContext
	}

	let previousCode = DEFAULT_CONFIG.previousCode
	if (overrides.previousCodeFile) {
		const loaded = await readTextFile(overrides.previousCodeFile)
		if (loaded !== null) {
			previousCode = loaded
		}
	} else if (overrides.previousCode !== undefined) {
		previousCode = overrides.previousCode
	}

	let diagnostics = DEFAULT_CONFIG.diagnostics
	if (overrides.diagnosticsFile) {
		const loaded = await loadDiagnosticsFile(overrides.diagnosticsFile)
		if (loaded !== null) {
			diagnostics = loaded
		}
	} else if (overrides.diagnostics !== undefined) {
		diagnostics = overrides.diagnostics
	}

	return {
		allowedWidgets,
		sourceContext,
		previousCode,
		diagnostics
	}
}

async function loadConfigFile(): Promise<DumpConfigOverrides> {
	const configPath = resolvePath(CONFIG_FILE_NAME)
	if (!existsSync(configPath)) {
		console.log(
			`info: config file not found at "${configPath}", using defaults`
		)
		return {}
	}

	const raw = await readFile(configPath, "utf8")
	const parsed = safeParseJson(raw)
	if (!isRecord(parsed)) {
		console.log(`warning: config file "${configPath}" is not valid JSON`)
		return {}
	}

	const record = parsed
	const overrides: DumpConfigOverrides = {}

	const widgets = record.allowedWidgets
	if (Array.isArray(widgets)) {
		overrides.allowedWidgets = widgets
			.map((item) => (typeof item === "string" ? item.trim() : ""))
			.filter(Boolean)
	}

	if (typeof record.sourceContext === "string") {
		overrides.sourceContext = record.sourceContext
	}

	if (typeof record.sourceContextFile === "string") {
		overrides.sourceContextFile = record.sourceContextFile
	}

	if (typeof record.previousCode === "string") {
		overrides.previousCode = record.previousCode
	}

	if (typeof record.previousCodeFile === "string") {
		overrides.previousCodeFile = record.previousCodeFile
	}

	if (isDiagnosticArray(record.diagnostics)) {
		overrides.diagnostics = record.diagnostics
	}

	if (typeof record.diagnosticsFile === "string") {
		overrides.diagnosticsFile = record.diagnosticsFile
	}

	return overrides
}

async function readTextFile(filePath: string): Promise<string | null> {
	const absolutePath = resolvePath(filePath)
	if (!existsSync(absolutePath)) {
		console.log(`warning: file not found at "${absolutePath}"`)
		return null
	}

	return readFile(absolutePath, "utf8")
}

async function loadDiagnosticsFile(
	filePath: string
): Promise<TypeScriptDiagnostic[] | null> {
	const raw = await readTextFile(filePath)
	if (!raw) {
		return null
	}
	const parsed = safeParseJson(raw)
	if (!parsed || !isDiagnosticArray(parsed)) {
		console.log(
			`warning: diagnostics file "${filePath}" is not a valid diagnostic array`
		)
		return null
	}
	return parsed
}

function safeParseJson(value: string): unknown | null {
	const parseResult = errors.trySync(() => JSON.parse(value))
	if (parseResult.error) {
		console.log("warning: failed to parse JSON value", parseResult.error)
		return null
	}
	return parseResult.data
}

function isDiagnosticArray(value: unknown): value is TypeScriptDiagnostic[] {
	return Array.isArray(value) && value.every((entry) => isDiagnostic(entry))
}

function isDiagnostic(value: unknown): value is TypeScriptDiagnostic {
	if (!isRecord(value)) {
		return false
	}
	const record = value
	return (
		typeof record.message === "string" &&
		typeof record.line === "number" &&
		typeof record.column === "number" &&
		typeof record.tsCode === "number"
	)
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value)
}

function stubPrompt(prompt: string): string {
	return SECTION_STUBS.reduce((current, stub) => {
		const pattern = new RegExp(
			String.raw`(<${stub.tag}[^>]*>)([\s\S]*?)(</${stub.tag}>)`,
			"g"
		)
		return current.replace(pattern, (_match, open, _content, close) =>
			[open, stub.placeholder, close].join("\n")
		)
	}, prompt)
}

function parsePromptSelection(): PromptKind {
	let selection: PromptKind | null = null
	const args = process.argv.slice(2)
	if (args.length === 0) {
		console.log(
			'error: prompt selection is required. Run with "--prompt=initial" or "--prompt=retry".'
		)
		process.exit(1)
	}
	for (const arg of args) {
		if (arg.startsWith("--prompt=")) {
			const raw = arg.slice("--prompt=".length).trim().toLowerCase()
			if (raw === "initial" || raw === "retry") {
				selection = raw
			} else {
				console.log(
					`warning: unrecognized prompt selection "${raw}", defaulting to "initial"`
				)
			}
			continue
		}
		if (arg === "--prompt") {
			console.log(
				'warning: expected "--prompt=initial" or "--prompt=retry"; using default "initial"'
			)
			continue
		}
		console.log(`warning: unrecognized argument "${arg}"`)
	}
	if (!selection) {
		console.log(
			'error: missing valid "--prompt" argument. Use "--prompt=initial" or "--prompt=retry".'
		)
		process.exit(1)
	}
	return selection
}

function resolvePath(inputPath: string): string {
	return path.isAbsolute(inputPath)
		? inputPath
		: path.resolve(process.cwd(), inputPath)
}
