import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"
import type { Ai, ChatCompletionParams } from "@/utils/ai"

type GenerationAttempt = {
	logger: Logger
	ai: Ai
	model: string
	systemPrompt: string
	userPrompt: string
}

export async function runGenerationAttempt({
	logger,
	ai,
	model,
	systemPrompt,
	userPrompt
}: GenerationAttempt): Promise<string> {
	logger.debug("invoking openai for generation attempt", { model })

	const params: ChatCompletionParams = {
		model,
		messages: [
			{ role: "system", content: systemPrompt },
			{ role: "user", content: userPrompt }
		]
	}

	const codeContent = await ai.text(params)
	if (!codeContent) {
		logger.error("openai response missing content")
		throw errors.new("generation attempt: empty openai response")
	}

	const match = codeContent.match(/```typescript\s*([\s\S]*?)```/i)
	const code = match ? match[1] : codeContent
	logger.debug("openai returned code", { characterCount: code.length })
	return code
}
