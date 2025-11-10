import { existsSync, readFileSync, readdirSync } from "node:fs"
import * as path from "node:path"
import { resolveLibPath } from "@/internal/paths"

const POSITIVE_EXAMPLE_CACHE = new Map<string, string>()
const NEGATIVE_EXAMPLE_CACHE = new Map<string, string>()
const TEMPLATE_EXTENSION = ".ts"

const POSITIVE_ROOT = resolveLibPath("templates/prompts/examples/positive")
const POSITIVE_TEMPLATES_DIR = path.join(POSITIVE_ROOT, "templates")
const POSITIVE_NOTES_DIR = path.join(POSITIVE_ROOT, "notes")

const NEGATIVE_ROOT = resolveLibPath("templates/prompts/examples/negative")
const NEGATIVE_TEMPLATES_DIR = path.join(NEGATIVE_ROOT, "templates")
const NEGATIVE_NOTES_DIR = path.join(NEGATIVE_ROOT, "notes")

export function createPositiveExampleSection(): string {
	const names = enumerateExampleNames(POSITIVE_TEMPLATES_DIR, POSITIVE_NOTES_DIR)
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

export function createNegativeExampleSection(): string {
	const names = enumerateExampleNames(NEGATIVE_TEMPLATES_DIR, NEGATIVE_NOTES_DIR)
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

function enumerateExampleNames(
	templatesDir: string,
	notesDir: string
): string[] {
	if (!existsSync(templatesDir) || !existsSync(notesDir)) return []

	const dirEntries = readdirSync(templatesDir, { withFileTypes: true })
	const names = dirEntries
		.filter(
			(entry) => entry.isFile() && entry.name.endsWith(TEMPLATE_EXTENSION)
		)
		.map((entry) => entry.name.slice(0, -TEMPLATE_EXTENSION.length))
		.filter((name) => {
			const notesPath = path.join(notesDir, `${name}.md`)
			return existsSync(notesPath)
		})
		.sort((a, b) => a.localeCompare(b))

	return names
}

function loadPositiveExample(name: string): string {
	const cached = POSITIVE_EXAMPLE_CACHE.get(name)
	if (cached) return cached

	const codePath = resolveTemplatePath(name, POSITIVE_TEMPLATES_DIR)
	if (!codePath) {
		return ""
	}

	const notesPath = path.join(POSITIVE_NOTES_DIR, `${name}.md`)
	if (!existsSync(notesPath)) {
		return ""
	}
	const code = readFileSync(codePath, "utf-8")
	const notes = readFileSync(notesPath, "utf-8").trim()

	const rendered = `<example kind="positive" name="${name}" source="${codePath}">
<code>
${code}
</code>
<notes>
${notes}
</notes>
</example>`
	POSITIVE_EXAMPLE_CACHE.set(name, rendered)
	return rendered
}

function loadNegativeExample(name: string): string {
	const existing = NEGATIVE_EXAMPLE_CACHE.get(name)
	if (existing) return existing

	const codePath = resolveTemplatePath(name, NEGATIVE_TEMPLATES_DIR)
	if (!codePath) {
		return ""
	}
	const notesPath = path.join(NEGATIVE_NOTES_DIR, `${name}.md`)
	if (!existsSync(notesPath)) {
		return ""
	}
	const code = readFileSync(codePath, "utf-8")
	const notes = readFileSync(notesPath, "utf-8").trim()
	const rendered = `<example kind="negative" name="${name}" source="${codePath}">
<code>
${code}
</code>
<notes>
${notes}
</notes>
</example>`
	NEGATIVE_EXAMPLE_CACHE.set(name, rendered)
	return rendered
}

function resolveTemplatePath(name: string, templatesDir: string): string | undefined {
	const candidate = path.join(templatesDir, `${name}${TEMPLATE_EXTENSION}`)
	if (existsSync(candidate)) {
		return candidate
	}
	return undefined
}
