// zstd reader uses Bun.spawn to decompress; no fs imports needed

import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { spawn } from "bun"
import tar from "tar-stream"
import { validateIntegrity } from "@/cartridge/client"
import type { CartridgeReader } from "@/cartridge/reader"

export async function createTarZstReader(
	filePath: string
): Promise<CartridgeReader> {
	const fileIndex = new Map<string, Buffer>()

	const extract = tar.extract()
	const zstdProc = spawn({
		cmd: ["zstd", "-d", "-c", filePath],
		stdout: "pipe",
		stderr: "pipe"
	})

	const p = new Promise<void>((resolve, reject) => {
		extract.on("entry", (header, stream, next) => {
			const chunks: Buffer[] = []
			stream.on("data", (chunk) => chunks.push(chunk))
			stream.on("end", () => {
				if (header.type === "file") {
					fileIndex.set(header.name.replace(/^\.\//, ""), Buffer.concat(chunks))
				}
				next()
			})
			stream.resume()
		})

		extract.on("finish", () => {
			logger.debug("tar.zst extraction complete", {
				file: filePath,
				entryCount: fileIndex.size
			})
			resolve()
		})

		extract.on("error", (err) => reject(errors.wrap(err, "tar extract error")))

		const reader = zstdProc.stdout.getReader()
		async function pipe() {
			while (true) {
				const chunk = await reader.read()
				if (chunk.done) break
				extract.write(Buffer.from(chunk.value))
			}
			extract.end()
		}
		void pipe()
	})

	const pres = await errors.try(p)
	if (pres.error) {
		logger.error("failed to create tar.zst reader", {
			file: filePath,
			error: pres.error
		})
		throw errors.wrap(pres.error, "tar.zst reader creation")
	}

	return {
		async readText(p: string): Promise<string> {
			const data = fileIndex.get(p)
			if (data === undefined) {
				logger.error("file not found in archive", { path: p })
				throw errors.new(`file not found in archive: ${p}`)
			}
			return data.toString("utf8")
		},
		async readBytes(p: string): Promise<Uint8Array> {
			const data = fileIndex.get(p)
			if (data === undefined) {
				logger.error("file not found in archive", { path: p })
				throw errors.new(`file not found in archive: ${p}`)
			}
			return new Uint8Array(data)
		},
		async exists(p: string): Promise<boolean> {
			return fileIndex.has(p)
		},
		async list(prefix: string): Promise<string[]> {
			const allFiles = Array.from(fileIndex.keys())
			return allFiles.filter((f) => f.startsWith(prefix))
		}
	}
}

export async function openCartridgeTarZst(
	filePath: string
): Promise<CartridgeReader> {
	const reader = await createTarZstReader(filePath)
	const validation = await validateIntegrity(reader)
	if (!validation.ok) {
		logger.error("integrity validation failed", {
			file: filePath,
			issues: validation.issues
		})
		throw errors.new("integrity validation failed")
	}
	return reader
}
