// biome-ignore-all lint/suspicious/noConsole: batch script relies on console output

import { randomUUID } from "node:crypto"
import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"

import { inngest } from "@/inngest/client"

type JsonPrimitive = string | number | boolean | null
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }
type JsonObject = { [key: string]: JsonValue }

type CliOptions = {
	directory: string
	dryRun: boolean
}

type ScriptMetadata = JsonObject & {
	script: string
	runAt: string
	sourceDirectory: string
	sourceFile: string
	sourceFileRelative: string
}

const SCRIPT_METADATA_KEY = "__dispatchedByScript"

type AssessmentItem = JsonValue

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

function buildMetadata(
	_item: AssessmentItem,
	scriptInfo: ScriptMetadata
): JsonObject {
	return {
		[SCRIPT_METADATA_KEY]: scriptInfo
	}
}

async function loadAssessmentItem(filePath: string): Promise<AssessmentItem> {
	const raw = await readFile(filePath, "utf8")
	return JSON.parse(raw)
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

		const loadResult = await errors.try(loadAssessmentItem(filePath))
		if (loadResult.error) {
			const message = loadResult.error.toString()
			console.error(
				`error: skipping "${relativeFilePath}" due to invalid JSON:`,
				message
			)
			continue
		}
		const assessmentItem = loadResult.data

		const scriptInfo: ScriptMetadata = {
			script: scriptLabel,
			runAt: runTimestamp,
			sourceDirectory: resolvedDirectory,
			sourceFile: filePath,
			sourceFileRelative: relativeFilePath
		}

		const metadata = buildMetadata(assessmentItem, scriptInfo)
		const exemplarQuestionId = randomUUID()

		const eventPayload = {
			name: "template/exemplar-question.template.generate.full.invoked" as const,
			data: {
				exemplarQuestionId,
				exampleAssessmentItemBody: assessmentItem,
				metadata
			}
		}

		if (dryRun) {
			console.log(
				`dry-run: would dispatch event for template "${exemplarQuestionId}" from "${relativeFilePath}":`
			)
			console.log(JSON.stringify(eventPayload, null, 2))
			dispatchedCount += 1
			continue
		}

		const dispatchResult = await errors.try(inngest.send(eventPayload))
		if (dispatchResult.error) {
			const message = dispatchResult.error.toString()
			logger.error("failed to dispatch template full generation event", {
				exemplarQuestionId,
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
			`info: dispatched event for template "${exemplarQuestionId}" from "${relativeFilePath}"`
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
