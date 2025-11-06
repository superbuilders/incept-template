import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type { AiContextEnvelope } from "@/structured/types"

const SUPPORTED_EXTENSIONS = ["svg", "png", "jpeg", "jpg", "gif"] as const
const IMAGE_URL_REGEX = /https?:\/\/[^\s"'()<>]+?\.(svg|png|jpeg|jpg|gif)/gi

const FETCH_TIMEOUT_MS = 30000
export async function buildPerseusEnvelope(
	perseusJson: unknown,
	fetchFn: (
		url: string | URL | Request,
		init?: RequestInit
	) => Promise<Response> = fetch
): Promise<AiContextEnvelope> {
	const primaryContent = JSON.stringify(perseusJson, null, 2)
	const supplementaryContent: string[] = []
	const multimodalImageUrls = new Set<string>()
	const foundUrls = new Set<string>()

	const findAllUrls = (obj: unknown): void => {
		if (typeof obj !== "object" || obj === null) return
		if (Array.isArray(obj)) {
			for (const item of obj) findAllUrls(item)
			return
		}
		for (const value of Object.values(obj)) {
			if (typeof value === "string") {
				if (value.startsWith("web+graphie://")) foundUrls.add(value)
				const imageMatches = value.matchAll(IMAGE_URL_REGEX)
				for (const match of imageMatches) {
					if (match[0]) foundUrls.add(match[0])
				}
			} else {
				findAllUrls(value)
			}
		}
	}

	const resolveAndFetchUrl = async (
		url: string
	): Promise<{
		type: "raster" | "svg"
		url: string
		content?: string
	} | null> => {
		if (url.startsWith("web+graphie://")) {
			const baseUrl = url.replace("web+graphie://", "https://")
			for (const ext of SUPPORTED_EXTENSIONS) {
				const urlWithExt = `${baseUrl}.${ext}`

				const headResult = await errors.try(
					fetchFn(urlWithExt, {
						method: "HEAD",
						signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
					})
				)
				if (headResult.error || !headResult.data.ok) continue

				if (ext === "svg") {
					const dl = await errors.try(
						fetchFn(urlWithExt, {
							signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
						})
					)
					if (dl.error || !dl.data.ok) continue
					const text = await errors.try(dl.data.text())
					if (text.error) continue
					return { type: "svg", url: urlWithExt, content: text.data }
				}
				return { type: "raster", url: urlWithExt }
			}
		} else {
			const urlResult = errors.trySync(() => new URL(url))
			if (urlResult.error) {
				return null
			}
			const u = urlResult.data
			if (u.protocol !== "http:" && u.protocol !== "https:") return null

			if (url.endsWith(".svg")) {
				const dl = await errors.try(
					fetchFn(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
				)
				if (dl.error || !dl.data.ok) return null
				const text = await errors.try(dl.data.text())
				if (text.error) return null
				return { type: "svg", url, content: text.data }
			}
			return { type: "raster", url }
		}
		return null
	}

	findAllUrls(perseusJson)

	if (foundUrls.size > 0) {
		logger.debug("resolving perseus urls", { count: foundUrls.size })
		const promises = Array.from(foundUrls).map(async (url) => {
			const result = await errors.try(resolveAndFetchUrl(url))
			if (result.error || !result.data) {
				logger.warn("failed to resolve perseus url", {
					url,
					error: result.error
				})
				return
			}
			if (result.data.type === "svg" && result.data.content) {
				const contentWithComment = `<!-- URL: ${result.data.url} -->\n${result.data.content}`
				supplementaryContent.push(contentWithComment)
			} else {
				multimodalImageUrls.add(result.data.url)
			}
		})
		await Promise.all(promises)
	}

	return {
		primaryContent,
		supplementaryContent,
		multimodalImageUrls: Array.from(multimodalImageUrls).sort(),
		multimodalImagePayloads: [],
		pdfPayloads: []
	}
}

export async function buildMathacademyEnvelope(
	html: string,
	screenshotUrl?: string,
	fetchFn: (
		url: string | URL | Request,
		init?: RequestInit
	) => Promise<Response> = fetch
): Promise<AiContextEnvelope> {
	const primaryContent = html
	const supplementaryContent: string[] = []
	const multimodalImageUrls = new Set<string>()
	const svgUrlsToFetch = new Set<string>()

	if (screenshotUrl) {
		const result = errors.trySync(() => new URL(screenshotUrl))
		if (result.error) {
			logger.error("invalid screenshot url", {
				screenshotUrl,
				error: result.error
			})
			throw errors.wrap(result.error, "screenshot url parse")
		}
		const normalized = result.data
		if (normalized.protocol !== "http:" && normalized.protocol !== "https:") {
			logger.error("unsupported screenshot url scheme", {
				screenshotUrl,
				protocol: normalized.protocol
			})
			throw errors.new("unsupported screenshot url scheme")
		}
		multimodalImageUrls.add(normalized.toString())
	}

	const imgTagRegex = /<img\s[^>]*src\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>/gi
	let match: RegExpExecArray | null = imgTagRegex.exec(html)
	while (match !== null) {
		const rawSrc = match[1] ?? match[2]
		if (!rawSrc) {
			match = imgTagRegex.exec(html)
			continue
		}

		const urlResult = errors.trySync(() => new URL(rawSrc))
		if (urlResult.error) {
			logger.warn("skipping invalid image src in html", {
				src: rawSrc,
				error: urlResult.error
			})
			match = imgTagRegex.exec(html)
			continue
		}
		const urlObj = urlResult.data
		if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
			match = imgTagRegex.exec(html)
			continue
		}
		const url = urlObj.toString()
		const isSvg = urlObj.pathname.toLowerCase().endsWith(".svg")
		if (isSvg) {
			svgUrlsToFetch.add(url)
		} else {
			multimodalImageUrls.add(url)
		}
		match = imgTagRegex.exec(html)
	}

	if (svgUrlsToFetch.size > 0) {
		logger.debug("fetching svg urls from html", { count: svgUrlsToFetch.size })
		const promises = Array.from(svgUrlsToFetch).map(async (url) => {
			const result = await errors.try(
				fetchFn(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
			)
			if (result.error || !result.data.ok) {
				logger.warn("failed to fetch svg from html", {
					url,
					error: result.error
				})
				return
			}
			const textResult = await errors.try(result.data.text())
			if (textResult.error) {
				logger.warn("failed to read svg text from html", {
					url,
					error: textResult.error
				})
				return
			}
			const contentWithComment = `<!-- URL: ${url} -->\n${textResult.data}`
			supplementaryContent.push(contentWithComment)
		})
		await Promise.all(promises)
	}

	return {
		primaryContent,
		supplementaryContent,
		multimodalImageUrls: Array.from(multimodalImageUrls).sort(),
		multimodalImagePayloads: [],
		pdfPayloads: []
	}
}
