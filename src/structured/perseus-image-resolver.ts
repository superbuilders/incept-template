import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"

const SUPPORTED_EXTENSIONS = ["svg", "png", "jpeg", "jpg", "gif"] as const
type ImageType = (typeof SUPPORTED_EXTENSIONS)[number]

export interface ImageContext {
	rasterImageUrls: string[]
	svgContentMap: Map<string, string>
	resolvedUrlMap: Map<string, string>
}

async function resolvePerseusUrl(
	baseUrl: string
): Promise<{ resolvedUrl: string; type: ImageType } | undefined> {
	for (const ext of SUPPORTED_EXTENSIONS) {
		const urlWithExt = `${baseUrl}.${ext}`
		const result = await errors.try(
			fetch(urlWithExt, { method: "HEAD", signal: AbortSignal.timeout(5000) })
		)
		if (!result.error && result.data.ok) {
			logger.debug("successfully resolved perseus url", {
				originalUrl: baseUrl,
				resolvedUrl: urlWithExt
			})
			return { resolvedUrl: urlWithExt, type: ext }
		}
	}
	return undefined
}

function findPerseusUrls(obj: unknown, urls: Set<string>): void {
	if (typeof obj !== "object" || obj === null) return
	if (Array.isArray(obj)) {
		for (const item of obj) findPerseusUrls(item, urls)
		return
	}
	for (const [key, value] of Object.entries(obj)) {
		if (
			key === "url" &&
			typeof value === "string" &&
			value.startsWith("web+graphie://")
		) {
			urls.add(value)
		} else {
			findPerseusUrls(value, urls)
		}
	}
}

export async function buildImageContext(
	perseusData: unknown
): Promise<ImageContext> {
	logger.debug("starting perseus url resolution for ai context")
	const originalUrls = new Set<string>()
	findPerseusUrls(perseusData, originalUrls)

	const context: ImageContext = {
		rasterImageUrls: [],
		svgContentMap: new Map(),
		resolvedUrlMap: new Map()
	}

	if (originalUrls.size === 0) {
		logger.debug("no perseus urls found to resolve")
		return context
	}

	const resolutionPromises = Array.from(originalUrls).map(
		async (originalUrl) => {
			const baseUrl = originalUrl.replace("web+graphie://", "https://")
			const resolved = await resolvePerseusUrl(baseUrl)

			if (!resolved) {
				logger.warn("failed to resolve perseus url, skipping from context", {
					url: originalUrl
				})
				return
			}

			context.resolvedUrlMap.set(originalUrl, resolved.resolvedUrl)

			if (resolved.type === "svg") {
				const downloadResult = await errors.try(fetch(resolved.resolvedUrl))
				if (!downloadResult.error && downloadResult.data.ok) {
					const textResult = await errors.try(downloadResult.data.text())
					if (!textResult.error) {
						context.svgContentMap.set(originalUrl, textResult.data)
					}
				}
			} else {
				context.rasterImageUrls.push(resolved.resolvedUrl)
			}
		}
	)

	await Promise.all(resolutionPromises)
	logger.info("finished building image context for ai", {
		found: originalUrls.size,
		resolved: context.resolvedUrlMap.size,
		rasters: context.rasterImageUrls.length,
		svgs: context.svgContentMap.size
	})
	return context
}
