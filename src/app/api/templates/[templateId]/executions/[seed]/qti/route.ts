import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { NextResponse } from "next/server"
import { widgetCollection } from "@/app/api/templates/execution-shared"
import {
	SeedSchema,
	TemplateIdSchema,
	TemplateNotValidatedError
} from "@/app/api/templates/shared"
import { compile } from "@/compiler/compiler"
import type { FeedbackPlanAny } from "@/core/feedback/plan"
import type { AssessmentItemInput } from "@/core/item"
import type { WidgetTypeTupleFrom } from "@/widgets/collections/types"
import {
	ensureExecutionForSeed,
	TemplateExecutionFailedError
} from "../execution"

type RouteParams = {
	templateId: string
	seed: string
}

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
		if (failure instanceof TemplateNotValidatedError) {
			return NextResponse.json(
				{ error: "template not validated" },
				{ status: 404 }
			)
		}
		if (failure instanceof TemplateExecutionFailedError) {
			logger.error("template execution qti failed", {
				templateId,
				seed,
				reason: failure.reason,
				extra: failure.extra
			})
			return NextResponse.json(
				{ status: "failed", reason: failure.reason, extra: failure.extra },
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
			executionId: record.id,
			error: xmlResult.error
		})
		return NextResponse.json(
			{ error: "failed to compile assessment item" },
			{ status: 500 }
		)
	}

	return new NextResponse(xmlResult.data, {
		status: 200,
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Content-Disposition": `attachment; filename="${record.id}.xml"`
		}
	})
}
