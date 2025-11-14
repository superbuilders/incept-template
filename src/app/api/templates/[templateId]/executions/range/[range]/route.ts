import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { regex } from "arkregex"
import { NextResponse } from "next/server"
import { z } from "zod"
import { executeTemplatesToXml } from "@/app/api/templates/[templateId]/executions/[seed]/execution"
import { env } from "@/env"
import { ErrTemplateExecutionFailed, ErrTemplateNotValidated } from "@/errors"

type RouteParams = {
	templateId: string
	range: string
}

const TemplateIdSchema = z.uuid()

const RangePattern = regex("^(?<start>[0-9]+)-(?<end>[0-9]+)$")

const MAX_RANGE_SIZE = 1000n

export async function GET(
	_request: Request,
	context: { params: Promise<RouteParams> }
) {
	const params = await context.params

	const templateIdResult = TemplateIdSchema.safeParse(params.templateId.trim())
	if (!templateIdResult.success) {
		logger.error(
			"template execution range route received invalid template id",
			{
				templateId: params.templateId
			}
		)
		return NextResponse.json({ error: "invalid template id" }, { status: 400 })
	}
	const templateId = templateIdResult.data

	const rangeValue = params.range.trim()
	const rangeMatch = RangePattern.exec(rangeValue)
	if (!rangeMatch) {
		logger.error("template execution range route received invalid range", {
			templateId,
			range: params.range
		})
		return NextResponse.json(
			{
				error:
					'range must match pattern "<start>-<end>" with non-negative integers'
			},
			{ status: 400 }
		)
	}

	const startSeed = BigInt(rangeMatch.groups.start)
	const endSeed = BigInt(rangeMatch.groups.end)

	if (startSeed > endSeed) {
		logger.error("template execution range start greater than end", {
			templateId,
			range: params.range
		})
		return NextResponse.json(
			{ error: "range start must be less than or equal to range end" },
			{ status: 400 }
		)
	}

	const rangeSize = endSeed - startSeed + 1n
	if (rangeSize > MAX_RANGE_SIZE) {
		logger.error("template execution range exceeds allowed size", {
			templateId,
			range: params.range,
			maxRangeSize: MAX_RANGE_SIZE.toString()
		})
		return NextResponse.json(
			{
				error: `range size must not exceed ${MAX_RANGE_SIZE.toString()} seeds`
			},
			{ status: 400 }
		)
	}

	const seeds: string[] = []
	for (let current = startSeed; current <= endSeed; current += 1n) {
		seeds.push(current.toString())
	}

	const executionsResult = await errors.try(
		executeTemplatesToXml({
			logger,
			templateId,
			seeds
		})
	)

	if (executionsResult.error) {
		const failure = executionsResult.error
		if (errors.is(failure, ErrTemplateNotValidated)) {
			return NextResponse.json(
				{ error: "template not validated" },
				{ status: 404 }
			)
		}
		if (errors.is(failure, ErrTemplateExecutionFailed)) {
			const reason = failure.toString()
			logger.error("template execution range failed", {
				templateId,
				range: params.range,
				reason
			})
			return NextResponse.json({ status: "failed", reason }, { status: 500 })
		}
		logger.error("template execution range encountered unexpected error", {
			templateId,
			range: params.range,
			error: failure
		})
		return NextResponse.json(
			{ error: "unexpected error resolving template execution range" },
			{ status: 500 }
		)
	}

	const executions = executionsResult.data

	const formData = new FormData()

	for (const { seed, xml } of executions) {
		const blob = new Blob([xml], {
			type: "application/xml; charset=utf-8"
		})
		formData.append(seed, blob)
	}

	const firstExecution = executions[0]?.execution
	const response = new NextResponse(formData, {
		status: 200
	})

	if (firstExecution?.createdGitCommitSha) {
		response.headers.set(
			"X-Template-Commit-SHA",
			firstExecution.createdGitCommitSha
		)
	}
	if (env.VERCEL_GIT_COMMIT_SHA) {
		response.headers.set("X-Execution-Commit-SHA", env.VERCEL_GIT_COMMIT_SHA)
	}

	return response
}
