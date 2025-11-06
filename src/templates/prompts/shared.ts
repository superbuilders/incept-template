export type PromptArtifacts = {
	systemPrompt: string
	userPrompt: string
}

export const BASE_SYSTEM_PROMPT =
	"You are Superbuilders' template architect. Produce a single TypeScript file implementing `generateTemplate`."
