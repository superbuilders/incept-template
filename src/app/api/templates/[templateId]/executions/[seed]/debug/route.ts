import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { NextResponse } from "next/server"
import { z } from "zod"
import { executeTemplate } from "@/app/api/templates/[templateId]/executions/[seed]/execution"
import { env } from "@/env"
import { ErrTemplateExecutionFailed, ErrTemplateNotValidated } from "@/errors"

type RouteParams = {
	templateId: string
	seed: string
}

const TemplateIdSchema = z.uuid()
const SeedSchema = z
	.string()
	.regex(/^[0-9]+$/, "seed must be a non-negative integer string")

export async function GET(
	_request: Request,
	context: { params: Promise<RouteParams> }
) {
	const params = await context.params

	const templateIdResult = TemplateIdSchema.safeParse(params.templateId.trim())
	if (!templateIdResult.success) {
		logger.error(
			"template execution debug route received invalid template id",
			{
				templateId: params.templateId
			}
		)
		return NextResponse.json({ error: "invalid template id" }, { status: 400 })
	}
	const templateId = templateIdResult.data

	const seedResult = SeedSchema.safeParse(params.seed.trim())
	if (!seedResult.success) {
		logger.error("template execution debug route received invalid seed", {
			templateId,
			seed: params.seed
		})
		return NextResponse.json(
			{ error: "seed must be a non-negative integer string" },
			{ status: 400 }
		)
	}
	const seed = seedResult.data

	const executionResult = await errors.try(
		executeTemplate({
			logger,
			templateId,
			seed
		})
	)

	if (executionResult.error) {
		const failure = executionResult.error
		if (errors.is(failure, ErrTemplateNotValidated)) {
			return NextResponse.json(
				{ error: "template not validated" },
				{ status: 404 }
			)
		}
		if (errors.is(failure, ErrTemplateExecutionFailed)) {
			logger.error("template execution debug payload failed", {
				templateId,
				seed,
				reason: failure.message
			})
			return NextResponse.json(
				{ status: "failed", reason: failure.message },
				{ status: 500 }
			)
		}

		logger.error(
			"template execution debug route encountered unexpected error",
			{
				templateId,
				seed,
				error: failure
			}
		)
		return NextResponse.json(
			{ error: "unexpected error resolving template execution" },
			{ status: 500 }
		)
	}

	const execution = executionResult.data

	const headers = new Headers()
	if (execution.createdGitCommitSha) {
		headers.set("X-Template-Commit-SHA", execution.createdGitCommitSha)
	}
	if (env.VERCEL_GIT_COMMIT_SHA) {
		headers.set("X-Execution-Commit-SHA", env.VERCEL_GIT_COMMIT_SHA)
	}

	return NextResponse.json(
		{
			debug: true,
			templateId: execution.templateId,
			seed: execution.seed.toString(),
			body: execution.body
		},
		{ headers }
	)
}
