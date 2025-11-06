import { existsSync, readFileSync } from "node:fs"
import { resolveLibPath } from "@/internal/paths"

const SEED_HELPERS_PATH = resolveLibPath("templates/seeds.ts")
let cachedSeedHelpers: string | null = null

export function createSeedHelpersSection(): string {
	if (!existsSync(SEED_HELPERS_PATH)) {
		return ""
	}
	if (cachedSeedHelpers === null) {
		cachedSeedHelpers = readFileSync(SEED_HELPERS_PATH, "utf-8").trim()
	}
	return `### SEED_HELPERS
<seed_helpers source="${SEED_HELPERS_PATH}" caution="Read for helper behavior; do not modify or duplicate.">
${cachedSeedHelpers}
</seed_helpers>`
}
