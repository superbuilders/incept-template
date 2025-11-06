import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"

const OPENAI_RETRY_BASE_MS = 1000
const OPENAI_RETRY_MAX_SLEEP_MS = 60000

function sleep(ms: number): Promise<void> {
	return new Promise((r) => setTimeout(r, ms))
}

function classifyError(error: Error): { retriable: boolean; reason: string } {
	const message = error.message || ""

	// Prefer structured status if present without using type assertions
	let status: number | undefined
	if (typeof error === "object" && error !== null) {
		const st = Reflect.get(error, "status")
		if (typeof st === "number") status = st
	}

	if (
		typeof status === "number" &&
		[408, 429, 500, 502, 503, 504].includes(status)
	) {
		return { retriable: true, reason: "http-transient" }
	}
	if (/\b(408|429|500|502|503|504)\b/.test(message))
		return { retriable: true, reason: "http-transient" }

	// Treat all timeout/network hiccups as retriable; broaden phrasing coverage
	const timeoutLike =
		/(timeout|timed out|deadline exceeded|context deadline exceeded|gateway timeout|operation timed out)/i
	const networkLike =
		/(ETIMEDOUT|ENETUNREACH|ECONNRESET|EAI_AGAIN|ECONNABORTED|ENETDOWN|EHOSTUNREACH|EPIPE)/i
	if (
		timeoutLike.test(message) ||
		networkLike.test(message) ||
		error.name === "TimeoutError"
	) {
		return { retriable: true, reason: "network-timeout" }
	}

	return { retriable: false, reason: "non-retriable" }
}

export async function callOpenAIWithRetry<T>(
	label: string,
	fn: () => Promise<T>
): Promise<T> {
	let attempt = 0
	while (true) {
		attempt++
		const result = await errors.try(fn())
		if (!result.error) {
			if (attempt > 1)
				logger.info("openai recovered after retries", { label, attempt })
			return result.data
		}
		if (!(result.error instanceof Error)) {
			logger.error("openai request failed with non-error", {
				label,
				attempt,
				error: result.error
			})
			throw result.error
		}
		const classification = classifyError(result.error)
		logger.warn("openai request failed", {
			label,
			attempt,
			reason: classification.reason,
			error: result.error
		})
		if (!classification.retriable) {
			logger.error("openai non-retriable error", {
				label,
				attempt,
				error: result.error
			})
			throw result.error
		}
		const exp = Math.min(
			OPENAI_RETRY_MAX_SLEEP_MS,
			OPENAI_RETRY_BASE_MS * 2 ** (attempt - 1)
		)
		const jitter = Math.max(0, Math.round(exp * (0.8 + Math.random() * 0.4)))
		logger.info("backing off before retry", { label, attempt, delayMs: jitter })
		await sleep(jitter)
	}
}
