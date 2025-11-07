import * as errors from "@superbuilders/errors"
import { and, desc, eq, isNotNull } from "drizzle-orm"
import type { Logger } from "inngest"
import { db } from "@/db"
import { templateCandidates } from "@/db/schema"
import { inngest } from "@/inngest/client"

type TemplateCandidateLookup = {
	attempt: number
	validatedAt: Date
}

async function findLatestValidatedCandidate(
	logger: Logger,
	templateId: string
): Promise<TemplateCandidateLookup | null> {
	const candidates = await db
		.select({
			attempt: templateCandidates.attempt,
			validatedAt: templateCandidates.validatedAt
		})
		.from(templateCandidates)
		.where(
			and(
				eq(templateCandidates.templateId, templateId),
				isNotNull(templateCandidates.validatedAt)
			)
		)
		.orderBy(desc(templateCandidates.validatedAt))
		.limit(1)

	const record = candidates[0]
	if (!record) {
		logger.error("no validated template candidates available for execution", {
			templateId
		})
		return null
	}

	if (!record.validatedAt) {
		logger.error("validated candidate missing validatedAt timestamp", {
			templateId,
			attempt: record.attempt
		})
		throw errors.new("validated template candidate missing timestamp")
	}

	return {
		attempt: record.attempt,
		validatedAt: record.validatedAt
	}
}

export const executeTemplate = inngest.createFunction(
	{
		id: "template-execution",
		name: "Template Execution",
		idempotency: "event",
		concurrency: [{ scope: "fn", key: "event.data.templateId", limit: 1 }]
	},
	{ event: "template/template.execution.requested" },
	async ({ event, step, logger }) => {
		const { templateId, seed } = event.data
		const baseEventId = event.id
		logger.info("template execution requested", { templateId, seed })

		const candidate = await findLatestValidatedCandidate(logger, templateId)
		if (!candidate) {
			const reason = "no validated template candidate available"
			const lastAttemptRow = await db
				.select({ attempt: templateCandidates.attempt })
				.from(templateCandidates)
				.where(eq(templateCandidates.templateId, templateId))
				.orderBy(desc(templateCandidates.attempt))
				.limit(1)
				.then((rows) => rows[0])
			let failureAttempt = 0
			if (lastAttemptRow) {
				failureAttempt = lastAttemptRow.attempt
			} else {
				logger.warn(
					"no candidate attempts recorded for template execution failure",
					{
						templateId
					}
				)
			}
			const failureEventResult = await errors.try(
				step.sendEvent("template-execution-failed-no-candidate", {
					id: `${baseEventId}-template-execution-no-candidate`,
					name: "template/template.execution.failed",
					data: { templateId, attempt: failureAttempt, seed, reason }
				})
			)
			if (failureEventResult.error) {
				logger.error("failed to emit template execution failure event", {
					templateId,
					attempt: failureAttempt,
					seed,
					reason,
					error: failureEventResult.error
				})
				throw errors.wrap(
					failureEventResult.error,
					"emit template execution failure event"
				)
			}
			return { status: "failed" as const, reason }
		}

		logger.info("dispatching candidate execution", {
			templateId,
			attempt: candidate.attempt,
			seed
		})
		const dispatchResult = await errors.try(
			step.sendEvent("template-execution-dispatch", {
				id: `${baseEventId}-candidate-execution-request-${candidate.attempt}-${seed}`,
				name: "template/candidate.execution.requested",
				data: { templateId, attempt: candidate.attempt, seed }
			})
		)
		if (dispatchResult.error) {
			logger.error("failed to dispatch candidate execution", {
				templateId,
				attempt: candidate.attempt,
				seed,
				error: dispatchResult.error
			})
			throw errors.wrap(
				dispatchResult.error,
				"dispatch template candidate execution"
			)
		}

		const waitForCompletion = step
			.waitForEvent("wait-template-execution-completed", {
				event: "template/candidate.execution.completed",
				timeout: "30m",
				if: `async.data.templateId == "${templateId}" && async.data.attempt == ${candidate.attempt} && async.data.seed == "${seed}"`
			})
			.then((evt) => ({ kind: "completed" as const, evt }))
		const waitForFailure = step
			.waitForEvent("wait-template-execution-failed", {
				event: "template/candidate.execution.failed",
				timeout: "30m",
				if: `async.data.templateId == "${templateId}" && async.data.attempt == ${candidate.attempt} && async.data.seed == "${seed}"`
			})
			.then((evt) => ({ kind: "failed" as const, evt }))

		const outcome = await Promise.race([waitForCompletion, waitForFailure])

		if (!outcome.evt) {
			const reason = "template candidate execution timeout"
			logger.error("candidate execution did not produce an event", {
				templateId,
				attempt: candidate.attempt,
				seed
			})
			const failureEventResult = await errors.try(
				step.sendEvent("template-execution-timeout", {
					id: `${baseEventId}-template-execution-timeout-${candidate.attempt}-${seed}`,
					name: "template/template.execution.failed",
					data: { templateId, seed, reason, attempt: candidate.attempt }
				})
			)
			if (failureEventResult.error) {
				logger.error("failed to emit template execution timeout", {
					templateId,
					attempt: candidate.attempt,
					seed,
					error: failureEventResult.error
				})
				throw errors.wrap(
					failureEventResult.error,
					"emit template execution timeout"
				)
			}
			return { status: "failed" as const, reason }
		}

		if (outcome.kind === "completed") {
			const executionId = outcome.evt.data.executionId
			const completionEventResult = await errors.try(
				step.sendEvent("template-execution-completed", {
					id: `${baseEventId}-template-execution-completed-${candidate.attempt}-${seed}`,
					name: "template/template.execution.completed",
					data: {
						templateId,
						attempt: candidate.attempt,
						seed,
						executionId
					}
				})
			)
			if (completionEventResult.error) {
				logger.error("failed to emit template execution completion", {
					templateId,
					attempt: candidate.attempt,
					seed,
					executionId,
					error: completionEventResult.error
				})
				throw errors.wrap(
					completionEventResult.error,
					"emit template execution completion"
				)
			}
			return {
				status: "completed" as const,
				attempt: candidate.attempt,
				executionId
			}
		}

		let reason = "template candidate execution failed"
		const executionFailureData = outcome.evt.data
		if (
			executionFailureData &&
			typeof executionFailureData.reason === "string"
		) {
			reason = executionFailureData.reason
		} else {
			logger.warn("template execution failure reason missing", {
				templateId,
				attempt: candidate.attempt,
				seed
			})
		}
		const failureEventResult = await errors.try(
			step.sendEvent("template-execution-failed", {
				id: `${baseEventId}-template-execution-failed-${candidate.attempt}-${seed}`,
				name: "template/template.execution.failed",
				data: { templateId, seed, reason, attempt: candidate.attempt }
			})
		)
		if (failureEventResult.error) {
			logger.error("failed to emit template execution failure", {
				templateId,
				attempt: candidate.attempt,
				seed,
				reason,
				error: failureEventResult.error
			})
			throw errors.wrap(
				failureEventResult.error,
				"emit template execution failure"
			)
		}

		return { status: "failed" as const, reason }
	}
)
