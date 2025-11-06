import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"
import OpenAI from "openai"
import type { z } from "zod"

let cachedOpenAI: OpenAI | null = null
export const TEMPLATE_GENERATION_MODEL = "gpt-5"

export type ChatCompletionMessage = {
	role: "system" | "user" | "assistant"
	content: string
}

export type ChatCompletionParams = {
	model: string
	messages: ChatCompletionMessage[]
}

export type ResponsesCreateParams = Parameters<OpenAI["responses"]["create"]>[0]
type RawResponsesCreateResult = Awaited<
	ReturnType<OpenAI["responses"]["create"]>
>

export interface Ai {
	text(params: ChatCompletionParams): Promise<string>
	json<T>(params: ResponsesCreateParams, schema: z.ZodType<T>): Promise<T>
}

export function createAi(logger: Logger, apiKey: string): Ai {
	if (!cachedOpenAI) {
		logger.debug("instantiating openai client")
		cachedOpenAI = new OpenAI({ apiKey })
	}

	const openai = cachedOpenAI

	return {
		async text(params) {
			logger.debug("requesting chat completion", {
				model: params.model,
				messageCount: params.messages.length
			})

			const response = await openai.chat.completions.create({
				model: params.model,
				messages: params.messages
			})

			const content = response.choices[0]?.message?.content
			if (!content) {
				logger.error("received empty chat completion content")
				throw errors.new("chat completion returned no content")
			}
			return content
		},
		async json(params, schema) {
			logger.debug("requesting openai response")

			const response = await openai.responses.create(params)
			const output = extractOutputText(response)
			if (!output) {
				logger.error("openai response missing text output")
				throw errors.new("openai response missing text output")
			}

			const parseResult = errors.trySync(() => JSON.parse(output))
			if (parseResult.error) {
				logger.error("openai response json parse failed", {
					error: parseResult.error
				})
				throw errors.wrap(
					parseResult.error,
					"openai response json parse failed"
				)
			}
			const parsed = parseResult.data

			const validation = schema.safeParse(parsed)
			if (!validation.success) {
				logger.error("openai response failed schema validation", {
					error: validation.error
				})
				throw errors.wrap(
					validation.error,
					"openai response schema validation failed"
				)
			}

			return validation.data
		}
	}
}

function extractOutputText(response: RawResponsesCreateResult): string | null {
	const topLevel: unknown = response
	if (!isRecord(topLevel)) {
		return null
	}

	const direct = topLevel.output_text
	const directText = normalizeTextValue(direct)
	if (directText) {
		return directText
	}

	const output = topLevel.output
	if (!Array.isArray(output)) {
		return null
	}

	const collected = collectTextFromOutputArray(output)
	if (collected.length === 0) {
		return null
	}

	const joined = collected.join("").trim()
	return joined.length > 0 ? joined : null
}

function collectTextFromOutputArray(items: unknown[]): string[] {
	const collected: string[] = []
	for (const item of items) {
		if (!isRecord(item)) {
			continue
		}
		const content = item.content
		if (!Array.isArray(content)) {
			continue
		}
		for (const part of content) {
			if (!isRecord(part)) {
				continue
			}
			const text = normalizeTextValue(part.text)
			if (text) {
				collected.push(text)
			}
		}
	}
	return collected
}

function normalizeTextValue(value: unknown): string | null {
	if (typeof value === "string") {
		const trimmed = value.trim()
		return trimmed.length > 0 ? trimmed : null
	}

	if (Array.isArray(value)) {
		const merged = value
			.map((entry) => (typeof entry === "string" ? entry : ""))
			.join("")
			.trim()
		return merged.length > 0 ? merged : null
	}

	if (isRecord(value)) {
		const inner = value.value
		if (typeof inner === "string") {
			const trimmed = inner.trim()
			return trimmed.length > 0 ? trimmed : null
		}
	}

	return null
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null
}
