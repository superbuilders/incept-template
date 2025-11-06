import { existsSync } from "node:fs"
import * as path from "node:path"
import { fileURLToPath } from "node:url"

const moduleDir = path.dirname(fileURLToPath(import.meta.url))
const initialLibRoot = path.resolve(moduleDir, "..")
const packageRoot = path.resolve(initialLibRoot, "..")

const libRootCandidates = dedupe([
	initialLibRoot,
	path.resolve(packageRoot, "src"),
	path.resolve(packageRoot, "dist")
])

const srcRootCandidates = dedupe([
	path.resolve(packageRoot, "src"),
	path.resolve(packageRoot, "dist")
])

export function resolveLibPath(subpath = "."): string {
	return resolveFromRoots(libRootCandidates, subpath)
}

export function resolveSrcPath(subpath = "."): string {
	return resolveFromRoots(srcRootCandidates, subpath)
}

export function resolvePackagePath(subpath = "."): string {
	return path.resolve(packageRoot, subpath)
}

function resolveFromRoots(roots: string[], subpath: string): string {
	for (const root of roots) {
		const candidate = path.resolve(root, subpath)
		if (existsSync(candidate)) {
			return candidate
		}
	}
	const [fallback] = roots
	return path.resolve(fallback ?? packageRoot, subpath)
}

function dedupe(values: string[]): string[] {
	return Array.from(new Set(values))
}
