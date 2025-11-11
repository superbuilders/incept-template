import * as logger from "@superbuilders/slog"
import { and, desc, eq, isNotNull } from "drizzle-orm"
import { z } from "zod"
import type { ExecutionRecord } from "@/app/api/executions/shared"
import { fetchExecutionRecord } from "@/app/api/executions/shared"
import { db } from "@/db"
import { templateCandidateExecutions, templateCandidates } from "@/db/schema"
import { performTemplateCandidateExecution } from "@/inngest/functions/candidate/execution"

type ExecutionFailureExtra = Record<string, unknown> | undefined

export const TemplateIdSchema = z.uuid()
export const SeedSchema = z
	.string()
	.regex(/^\d+$/, "seed must be a non-negative integer string")

export class TemplateNotValidatedError extends Error {
	constructor(templateId: string) {
		super(`template ${templateId} has no validated attempts`)
	}
}

export class TemplateExecutionFailedError extends Error {
	constructor(
		public readonly reason: string,
		public readonly extra: ExecutionFailureExtra
	) {
		super(reason)
	}
}

async function fetchLatestValidatedAttempt(
	templateId: string
): Promise<number | null> {
	const rows = await db
		.select({ attempt: templateCandidates.attempt })
		.from(templateCandidates)
		.where(
			and(
				eq(templateCandidates.templateId, templateId),
				isNotNull(templateCandidates.validatedAt)
			)
		)
		.orderBy(desc(templateCandidates.attempt))
		.limit(1)

	if (rows.length === 0) {
		return null
	}

	return rows[0].attempt
}

async function fetchExecutionById(
	executionId: string
): Promise<ExecutionRecord> {
	const record = await fetchExecutionRecord(executionId)
	if (!record) {
		logger.error("template seed execution record missing", { executionId })
		throw new TemplateExecutionFailedError("execution record missing", {
			executionId
		})
	}
	return record
}

export async function ensureExecutionForSeed({
	templateId,
	seed
}: {
	templateId: string
	seed: string
}): Promise<ExecutionRecord> {
	const attempt = await fetchLatestValidatedAttempt(templateId)
	if (attempt === null) {
		logger.error("template seed route missing validated attempt", {
			templateId,
			seed
		})
		throw new TemplateNotValidatedError(templateId)
	}

	const normalizedSeed = BigInt(seed)

	const cachedExecution = await db
		.select({
			id: templateCandidateExecutions.id,
			templateId: templateCandidateExecutions.templateId,
			attempt: templateCandidateExecutions.attempt,
			seed: templateCandidateExecutions.seed,
			body: templateCandidateExecutions.body,
			createdAt: templateCandidateExecutions.createdAt
		})
		.from(templateCandidateExecutions)
		.where(
			and(
				eq(templateCandidateExecutions.templateId, templateId),
				eq(templateCandidateExecutions.attempt, attempt),
				eq(templateCandidateExecutions.seed, normalizedSeed)
			)
		)
		.limit(1)

	if (cachedExecution.length > 0) {
		logger.debug("template seed execution cache hit", {
			templateId,
			attempt,
			seed: normalizedSeed.toString(),
			executionId: cachedExecution[0].id
		})
		return cachedExecution[0]
	}

	const executionResult = await performTemplateCandidateExecution({
		logger,
		templateId,
		attempt,
		seed
	})

	if (executionResult.status === "failed") {
		const existingId = executionResult.extra?.existingExecutionId
		if (
			executionResult.reason ===
				"template candidate execution already exists" &&
			typeof existingId === "string"
		) {
			logger.info("template seed execution reused existing record", {
				templateId,
				attempt,
				seed,
				executionId: existingId
			})
			return fetchExecutionById(existingId)
		}

		logger.error("template seed execution failed before throw", {
			templateId,
			attempt,
			seed,
			reason: executionResult.reason,
			extra: executionResult.extra
		})
		throw new TemplateExecutionFailedError(
			executionResult.reason,
			executionResult.extra
		)
	}

	return fetchExecutionById(executionResult.executionId)
}
