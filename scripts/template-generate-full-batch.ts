// biome-ignore-all lint/suspicious/noConsole: batch script relies on console output

import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"

import { inngest } from "@/inngest/client"

const JSON_VALUE_SCHEMA = z.json()
type JsonValue = z.infer<typeof JSON_VALUE_SCHEMA>
type JsonObject = Record<string, JsonValue>

const TEMPLATE_EVENT_FILE_SCHEMA = z.object({
	templateId: z.uuid(),
	exampleAssessmentItemBody: JSON_VALUE_SCHEMA,
	metadata: JSON_VALUE_SCHEMA.optional()
})

type TemplateEventFile = z.infer<typeof TEMPLATE_EVENT_FILE_SCHEMA>

type CliOptions = {
	directory: string
	dryRun: boolean
}

type ScriptMetadata = {
	script: string
	runAt: string
	sourceDirectory: string
	sourceFile: string
	sourceFileRelative: string
}

const SCRIPT_METADATA_KEY = "__dispatchedByScript"

function usage(scriptLabel: string): string {
	return [
		`Usage: bun run ${scriptLabel} <directory> [--dry-run]`,
		"",
		"Arguments:",
		"  <directory>   Path to a folder containing JSON files.",
		"  --dry-run     Preview events without sending them."
	].join("\n")
}

function parseCliArguments(scriptLabel: string): CliOptions {
	const args = process.argv.slice(2)
	let directory: string | null = null
	let dryRun = false

	for (const arg of args) {
		if (arg === "--dry-run") {
			dryRun = true
			continue
		}
		if (arg === "--help" || arg === "-h") {
			console.log(usage(scriptLabel))
			process.exit(0)
		}
		if (directory === null) {
			directory = arg
			continue
		}
		console.error(`error: unexpected argument "${arg}"`)
		console.log(usage(scriptLabel))
		process.exit(1)
	}

	if (!directory) {
		console.error("error: directory argument is required.")
		console.log(usage(scriptLabel))
		process.exit(1)
	}

	return { directory, dryRun }
}

function isJsonObject(value: JsonValue | undefined): value is JsonObject {
	return typeof value === "object" && value !== null && !Array.isArray(value)
}

function mergeMetadata(
	original: JsonValue | undefined,
	scriptInfo: ScriptMetadata
): JsonObject {
	if (isJsonObject(original)) {
		return { ...original, [SCRIPT_METADATA_KEY]: scriptInfo }
	}

	if (typeof original === "undefined" || original === null) {
		return { [SCRIPT_METADATA_KEY]: scriptInfo }
	}

	return {
		originalMetadata: original,
		[SCRIPT_METADATA_KEY]: scriptInfo
	}
}

async function loadTemplateEventFile(
	filePath: string
): Promise<TemplateEventFile> {
	const raw = await readFile(filePath, "utf8")
	const parsed = JSON.parse(raw)
	const result = TEMPLATE_EVENT_FILE_SCHEMA.safeParse(parsed)
	if (!result.success) {
		const issues = result.error.issues.map((issue) => issue.message).join("; ")
		const relativePath = path.relative(process.cwd(), filePath)
		logger.error("invalid template event JSON", {
			filePath: relativePath,
			issues
		})
		throw errors.new(
			`invalid template event JSON: ${issues || "see schema requirements"}`
		)
	}
	return result.data
}

async function ensureDirectoryExists(directory: string): Promise<void> {
	const stats = await stat(directory)
	if (!stats.isDirectory()) {
		logger.error("path provided is not a directory", { directory })
		throw errors.new(`path "${directory}" is not a directory`)
	}
}

async function main(): Promise<void> {
	const scriptFilePath = decodeURIComponent(new URL(import.meta.url).pathname)
	const scriptLabel = path.relative(process.cwd(), scriptFilePath)

	const { directory, dryRun } = parseCliArguments(scriptLabel)

	const resolvedDirectory = path.resolve(process.cwd(), directory)

	const ensureDirectoryResult = await errors.try(
		ensureDirectoryExists(resolvedDirectory)
	)
	if (ensureDirectoryResult.error) {
		const message = ensureDirectoryResult.error.toString()
		logger.error("failed to verify source directory", {
			directory: resolvedDirectory,
			error: message
		})
		console.error(
			`error: failed to read directory "${resolvedDirectory}":`,
			message
		)
		process.exit(1)
	}

	const directoryEntries = await readdir(resolvedDirectory, {
		withFileTypes: true
	})

	const jsonFiles = directoryEntries
		.filter(
			(entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".json")
		)
		.map((entry) => path.join(resolvedDirectory, entry.name))

	if (jsonFiles.length === 0) {
		console.log(
			`info: no JSON files found in "${resolvedDirectory}". Nothing to dispatch.`
		)
		return
	}

	console.log(
		`info: discovered ${jsonFiles.length} JSON file(s) in "${resolvedDirectory}".`
	)

	let dispatchedCount = 0
	const runTimestamp = new Date().toISOString()

	for (const filePath of jsonFiles) {
		const relativeFilePath = path.relative(process.cwd(), filePath)
		console.log(`info: processing "${relativeFilePath}"`)

		const loadResult = await errors.try(loadTemplateEventFile(filePath))
		if (loadResult.error) {
			const message = loadResult.error.toString()
			console.error(
				`error: skipping "${relativeFilePath}" due to invalid JSON:`,
				message
			)
			continue
		}
		const fileContents = loadResult.data

		const scriptInfo: ScriptMetadata = {
			script: scriptLabel,
			runAt: runTimestamp,
			sourceDirectory: resolvedDirectory,
			sourceFile: filePath,
			sourceFileRelative: relativeFilePath
		}

		const metadata = mergeMetadata(fileContents.metadata, scriptInfo)

		const eventPayload = {
			name: "template/template.generate.full" as const,
			data: {
				templateId: fileContents.templateId,
				exampleAssessmentItemBody: fileContents.exampleAssessmentItemBody,
				metadata
			}
		}

		if (dryRun) {
			console.log(
				`dry-run: would dispatch event for template "${fileContents.templateId}" from "${relativeFilePath}":`
			)
			console.log(JSON.stringify(eventPayload, null, 2))
			dispatchedCount += 1
			continue
		}

		const dispatchResult = await errors.try(inngest.send(eventPayload))
		if (dispatchResult.error) {
			const message = dispatchResult.error.toString()
			logger.error("failed to dispatch template full generation event", {
				templateId: fileContents.templateId,
				sourceFile: relativeFilePath,
				error: message
			})
			console.error(
				`error: failed to dispatch event for "${relativeFilePath}":`,
				message
			)
			continue
		}

		console.log(
			`info: dispatched event for template "${fileContents.templateId}" from "${relativeFilePath}"`
		)
		dispatchedCount += 1
	}

	if (dryRun) {
		console.log(
			`dry-run complete: ${dispatchedCount} event(s) prepared from "${resolvedDirectory}".`
		)
	} else {
		console.log(
			`info: successfully dispatched ${dispatchedCount} event(s) from "${resolvedDirectory}".`
		)
	}
}

await main()
