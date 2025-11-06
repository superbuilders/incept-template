// gzip reader uses Bun built-ins; no fs imports needed

import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import tar from "tar-stream"
import { validateIntegrity } from "@/cartridge/client"
import type { CartridgeReader } from "@/cartridge/reader"

export async function createTarGzReader(
	filePath: string
): Promise<CartridgeReader> {
	const fileIndex = new Map<string, Buffer>()

	const fileBlob = Bun.file(filePath)
	const readResult = await errors.try(fileBlob.arrayBuffer())
	if (readResult.error) {
		logger.error("tar.gz read failed", { file: filePath, error: readResult.error })
		throw errors.wrap(readResult.error, "tar.gz file read")
	}
	const compressedBytes = new Uint8Array(readResult.data)
	const decompressResult = errors.trySync(() => Bun.gunzipSync(compressedBytes))
	if (decompressResult.error) {
		logger.error("tar.gz decompress failed", {
			file: filePath,
			error: decompressResult.error
		})
		throw errors.wrap(decompressResult.error, "tar.gz decompress")
	}
	const tarBytes = Buffer.from(decompressResult.data)
	const extract = tar.extract()

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
			logger.debug("tar.gz extraction complete", {
				file: filePath,
				entryCount: fileIndex.size
			})
			resolve()
		})

		extract.on("error", (err) => reject(errors.wrap(err, "tar extract error")))
	})

	extract.end(tarBytes)

	const pres = await errors.try(p)
	if (pres.error) {
		logger.error("failed to create tar.gz reader", {
			file: filePath,
			error: pres.error
		})
		throw errors.wrap(pres.error, "tar.gz reader creation")
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

export async function openCartridgeTarGz(
	filePath: string
): Promise<CartridgeReader> {
	const reader = await createTarGzReader(filePath)
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
