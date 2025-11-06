import { existsSync, readFileSync } from "node:fs"
import * as path from "node:path"
import { resolveLibPath } from "@/internal/paths"

const POSITIVE_EXAMPLE_CACHE = new Map<string, string>()
const NEGATIVE_EXAMPLE_CACHE = new Map<string, string>()

const POSITIVE_ROOT = resolveLibPath("templates/prompts/examples/positive")
const POSITIVE_TEMPLATES_DIR = path.join(POSITIVE_ROOT, "templates")
const POSITIVE_NOTES_DIR = path.join(POSITIVE_ROOT, "notes")

const NEGATIVE_ROOT = resolveLibPath("templates/prompts/examples/negative")
const NEGATIVE_TEMPLATES_DIR = path.join(NEGATIVE_ROOT, "templates")
const NEGATIVE_NOTES_DIR = path.join(NEGATIVE_ROOT, "notes")

export function createPositiveExampleSection(names: readonly string[]): string {
	if (names.length === 0) return ""
	const rendered = names
		.map((name) => loadPositiveExample(name))
		.filter((block) => block.length > 0)
		.join("\n\n")
	if (rendered.length === 0) return ""
	return `### POSITIVE_EXAMPLES
<examples type="positive">
${rendered}
</examples>`
}

export function createNegativeExampleSection(names: readonly string[]): string {
	if (names.length === 0) return ""
	const rendered = names
		.map((name) => loadNegativeExample(name))
		.filter((block) => block.length > 0)
		.join("\n\n")
	if (rendered.length === 0) return ""
	return `### NEGATIVE_EXAMPLES
<examples type="negative">
${rendered}
</examples>`
}

function loadPositiveExample(name: string): string {
	const cached = POSITIVE_EXAMPLE_CACHE.get(name)
	if (cached) return cached

	const codePath = path.join(POSITIVE_TEMPLATES_DIR, `${name}.ts`)
	if (!existsSync(codePath)) {
		return ""
	}

	const notesPath = path.join(POSITIVE_NOTES_DIR, `${name}.md`)
	const code = readFileSync(codePath, "utf-8")
	const notes = existsSync(notesPath)
		? readFileSync(notesPath, "utf-8").trim()
		: ""

	const rendered = `<example kind="positive" name="${name}" source="${codePath}">
<code>
${code}
</code>
${notes ? `<notes>\n${notes}\n</notes>` : "<notes />"}
</example>`
	POSITIVE_EXAMPLE_CACHE.set(name, rendered)
	return rendered
}

function loadNegativeExample(name: string): string {
	const existing = NEGATIVE_EXAMPLE_CACHE.get(name)
	if (existing) return existing

	const codePath = path.join(NEGATIVE_TEMPLATES_DIR, `${name}.ts`)
	if (!existsSync(codePath)) {
		return ""
	}
	const notesPath = path.join(NEGATIVE_NOTES_DIR, `${name}.md`)
	const code = readFileSync(codePath, "utf-8")
	const notes = existsSync(notesPath)
		? readFileSync(notesPath, "utf-8").trim()
		: ""
	const rendered = `<example kind="negative" name="${name}" source="${codePath}">
<code>
${code}
</code>
${notes ? `<notes>\n${notes}\n</notes>` : "<notes />"}
</example>`
	NEGATIVE_EXAMPLE_CACHE.set(name, rendered)
	return rendered
}
