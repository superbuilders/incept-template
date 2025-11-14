import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { regex } from "arkregex"
import { NextResponse } from "next/server"
import { z } from "zod"
import { executeTemplateToXml } from "@/app/api/templates/[templateId]/executions/[seed]/execution"
import { env } from "@/env"
import { ErrTemplateExecutionFailed, ErrTemplateNotValidated } from "@/errors"

type RouteParams = {
	templateId: string
	seed: string
}

const TemplateIdSchema = z.uuid()
const SeedPattern = regex("^[0-9]+$")

export async function GET(
	_request: Request,
	context: { params: Promise<RouteParams> }
) {
	const params = await context.params

	const templateIdResult = TemplateIdSchema.safeParse(params.templateId.trim())
	if (!templateIdResult.success) {
		logger.error("template execution route received invalid template id", {
			templateId: params.templateId
		})
		return NextResponse.json({ error: "invalid template id" }, { status: 400 })
	}
	const templateId = templateIdResult.data

	const seedValue = params.seed.trim()
	if (!SeedPattern.test(seedValue)) {
		logger.error("template execution route received invalid seed", {
			templateId,
			seed: params.seed
		})
		return NextResponse.json(
			{ error: "seed must be a non-negative integer string" },
			{ status: 400 }
		)
	}
	const seed = BigInt(seedValue)

	const executionResult = await errors.try(
		executeTemplateToXml({
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
			logger.error("template execution failed", {
				templateId,
				seed: seedValue,
				reason: failure.message
			})
			return NextResponse.json(
				{ status: "failed", reason: failure.message },
				{ status: 500 }
			)
		}
		logger.error("template execution encountered unexpected error", {
			templateId,
			seed: seedValue,
			error: failure
		})
		return NextResponse.json(
			{ error: "unexpected error resolving template execution" },
			{ status: 500 }
		)
	}

	const { execution, xml } = executionResult.data

	const response = new NextResponse(xml, {
		status: 200,
		headers: {
			"Content-Type": "application/xml; charset=utf-8"
		}
	})

	if (execution.createdGitCommitSha) {
		response.headers.set("X-Template-Commit-SHA", execution.createdGitCommitSha)
	}
	if (env.VERCEL_GIT_COMMIT_SHA) {
		response.headers.set("X-Execution-Commit-SHA", env.VERCEL_GIT_COMMIT_SHA)
	}

	return response
}
