import * as fs from "node:fs/promises"
import * as path from "node:path"
import * as errors from "@superbuilders/errors"
import type { Logger } from "@superbuilders/slog"
import { runGenerationAttempt } from "@/templates/generation"
import { composeInitialPrompt } from "@/templates/prompts/initial"
import { composeRetryPrompt } from "@/templates/prompts/retry"
import { typeCheckSource } from "@/templates/type-checker"
import type { TypeScriptDiagnostic } from "@/templates/types"
import {
	validateNoNonNullAssertions,
	validateNoThrowStatements,
	validateNoTypeAssertions,
	validateTemplateWidgets
} from "@/templates/widget-validation"
import type { Ai } from "@/utils/ai"
import { TEMPLATE_GENERATION_MODEL } from "@/utils/ai"

const MAX_RETRIES = 10

export type GenerateTemplateOptions = {
	sourceContext: string
	allowedWidgets: readonly string[]
	outputFilePath: string
	debugArtifacts: boolean
}

export type GenerationResult =
	| {
			success: true
			filePath: string
			iterations: number
			model: string
	  }
	| {
			success: false
			iterations: number
			model: string
			diagnostics: TypeScriptDiagnostic[]
	  }

export async function generateTemplate(
	logger: Logger,
	ai: Ai,
	options: GenerateTemplateOptions
): Promise<GenerationResult> {
	const { sourceContext, allowedWidgets, outputFilePath, debugArtifacts } =
		options
	if (allowedWidgets.length > 1) {
		logger.error("allowed widgets must contain at most one entry", {
			allowedWidgets
		})
		throw errors.new("at most one widget type may be specified")
	}
	const model = TEMPLATE_GENERATION_MODEL
	const absoluteOutputPath = path.resolve(outputFilePath)
	const outputDir = path.dirname(absoluteOutputPath)

	await fs.mkdir(outputDir, { recursive: true })
	logger.info("prepared output directory", { outputDir })

	const existingFinal = await errors.try(fs.stat(absoluteOutputPath))
	if (!existingFinal.error) {
		logger.error("output file already exists", { file: absoluteOutputPath })
		throw errors.new(
			"output file already exists; choose a different path or remove it"
		)
	}

	let lastCode = ""
	let lastDiagnostics: TypeScriptDiagnostic[] = []
	let iteration = 0

	while (iteration < MAX_RETRIES) {
		iteration += 1
		logger.info("generation iteration starting", { iteration })

		let systemPrompt: string
		let userPrompt: string
		if (lastDiagnostics.length === 0 && lastCode.length === 0) {
			const initial = composeInitialPrompt(
				logger,
				allowedWidgets,
				sourceContext
			)
			systemPrompt = initial.systemPrompt
			userPrompt = initial.userPrompt
		} else {
			const retry = composeRetryPrompt(
				logger,
				allowedWidgets,
				sourceContext,
				lastCode,
				lastDiagnostics
			)
			systemPrompt = retry.systemPrompt
			userPrompt = retry.userPrompt
		}

		const iterationLabel = iteration.toString().padStart(2, "0")

		if (debugArtifacts) {
			const promptPath = `${absoluteOutputPath}.iteration-${iterationLabel}.prompt.txt`
			logger.debug("persisting prompt to disk", {
				iteration,
				file: promptPath,
				length: userPrompt.length
			})
			await fs.writeFile(promptPath, userPrompt)
		}

		const code = await runGenerationAttempt({
			logger,
			ai,
			model,
			systemPrompt,
			userPrompt
		})

		if (debugArtifacts) {
			const responsePath = `${absoluteOutputPath}.iteration-${iterationLabel}.response.ts`
			await fs.writeFile(responsePath, code)
			logger.debug("persisted openai response to disk", {
				iteration,
				file: responsePath,
				length: code.length
			})
		}

		const diagnostics = await typeCheckSource(logger, code)
		lastCode = code
		lastDiagnostics = diagnostics

		if (diagnostics.length === 0) {
			const widgetDiagnostic = validateTemplateWidgets(code, allowedWidgets)
			if (widgetDiagnostic) {
				logger.warn("widget tuple validation failed", {
					message: widgetDiagnostic.message
				})
				lastDiagnostics = [widgetDiagnostic]
				continue
			}

			const nonNullDiagnostic = validateNoNonNullAssertions(code)
			if (nonNullDiagnostic) {
				logger.warn("non-null assertion detected", {
					message: nonNullDiagnostic.message
				})
				lastDiagnostics = [nonNullDiagnostic]
				continue
			}

			const typeAssertionDiagnostic = validateNoTypeAssertions(code)
			if (typeAssertionDiagnostic) {
				logger.warn("type assertion detected", {
					message: typeAssertionDiagnostic.message
				})
				lastDiagnostics = [typeAssertionDiagnostic]
				continue
			}

			const throwDiagnostic = validateNoThrowStatements(code)
			if (throwDiagnostic) {
				logger.warn("throw statement detected", {
					message: throwDiagnostic.message
				})
				lastDiagnostics = [throwDiagnostic]
				continue
			}
			logger.info("typecheck succeeded", { iteration })
			await fs.writeFile(absoluteOutputPath, code)
			logger.info("final template written", { file: absoluteOutputPath })

			return {
				success: true as const,
				filePath: absoluteOutputPath,
				iterations: iteration,
				model
			}
		}

		logger.warn("typecheck failed", {
			iteration,
			diagnosticsCount: diagnostics.length
		})
	}

	logger.error("max retries reached, generation failed", {
		maxRetries: MAX_RETRIES
	})
	return {
		success: false as const,
		iterations: iteration,
		model,
		diagnostics: lastDiagnostics
	}
}
