import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { and, eq, sql } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { ensureExecutionForSeed } from "@/app/api/templates/[templateId]/executions/[seed]/execution"
import { compile } from "@/compiler/compiler"
import type { FeedbackPlanAny } from "@/core/feedback/plan"
import type { AssessmentItemInput } from "@/core/item"
import { db } from "@/db"
import { templateExecutions } from "@/db/schema"
import { env } from "@/env"
import { ErrTemplateExecutionFailed, ErrTemplateNotValidated } from "@/errors"
import { widgetCollections } from "@/widgets/collections"
import type { WidgetTypeTupleFrom } from "@/widgets/collections/types"

type RouteParams = {
	templateId: string
	seed: string
}

const TemplateIdSchema = z.uuid()
const SeedSchema = z
	.string()
	.regex(/^[0-9]+$/, "seed must be a non-negative integer string")
const widgetCollection = widgetCollections.all

export async function GET(
	_request: Request,
	context: { params: Promise<RouteParams> }
) {
	const params = await context.params

	const templateIdResult = TemplateIdSchema.safeParse(params.templateId.trim())
	if (!templateIdResult.success) {
		logger.error("template execution qti route received invalid template id", {
			templateId: params.templateId
		})
		return NextResponse.json({ error: "invalid template id" }, { status: 400 })
	}
	const templateId = templateIdResult.data

	const seedResult = SeedSchema.safeParse(params.seed.trim())
	if (!seedResult.success) {
		logger.error("template execution qti route received invalid seed", {
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
		ensureExecutionForSeed({
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
			logger.error("template execution qti failed", {
				templateId,
				seed,
				reason: failure.message
			})
			return NextResponse.json(
				{ status: "failed", reason: failure.message },
				{ status: 500 }
			)
		}
		logger.error("template execution qti encountered unexpected error", {
			templateId,
			seed,
			error: failure
		})
		return NextResponse.json(
			{ error: "unexpected error resolving template execution" },
			{ status: 500 }
		)
	}

	const record = executionResult.data
	const executionReference = `${record.templateId}-${record.seed.toString()}`

	if (record.xml) {
		logger.debug("template execution qti served from cache", {
			templateId,
			seed,
			execution: executionReference
		})
		return new NextResponse(record.xml, {
			status: 200,
			headers: {
				"Content-Type": "application/xml; charset=utf-8",
				"Content-Disposition": `attachment; filename="${executionReference}.xml"`
			}
		})
	}

	// @ts-expect-error: record.body originates from validated template execution
	const body: AssessmentItemInput<
		WidgetTypeTupleFrom<typeof widgetCollection>,
		FeedbackPlanAny
	> = record.body

	const xmlResult = await errors.try(compile(body, widgetCollection))
	if (xmlResult.error) {
		logger.error("template execution qti compilation failed", {
			templateId,
			seed,
			execution: executionReference,
			error: xmlResult.error
		})
		return NextResponse.json(
			{ error: "failed to compile assessment item" },
			{ status: 500 }
		)
	}

	const xml = xmlResult.data

	const persistXmlResult = await errors.try(
		db
			.update(templateExecutions)
			.set({
				xml,
				xmlGeneratedAt: sql`now()`,
				xmlGeneratedGitCommitSha: env.VERCEL_GIT_COMMIT_SHA ?? null
			})
			.where(
				and(
					eq(templateExecutions.templateId, record.templateId),
					eq(templateExecutions.seed, record.seed)
				)
			)
	)

	if (persistXmlResult.error) {
		logger.error("template execution xml persistence failed", {
			templateId,
			seed,
			execution: executionReference,
			error: persistXmlResult.error
		})
		return NextResponse.json(
			{ error: "failed to persist execution xml" },
			{ status: 500 }
		)
	}

	return new NextResponse(xml, {
		status: 200,
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Content-Disposition": `attachment; filename="${executionReference}.xml"`
		}
	})
}
