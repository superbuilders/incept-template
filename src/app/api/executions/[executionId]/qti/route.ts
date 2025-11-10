import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { NextResponse } from "next/server"
import {
	ExecutionIdSchema,
	fetchExecutionRecord,
	widgetCollection
} from "@/app/api/executions/shared"
import { compile } from "@/compiler/compiler"
import type { FeedbackPlanAny } from "@/core/feedback/plan"
import type { AssessmentItemInput } from "@/core/item"
import type { WidgetTypeTupleFrom } from "@/widgets/collections/types"

type RouteParams = { executionId: string }

export async function GET(
	_request: Request,
	context: { params: Promise<RouteParams> }
) {
	const { executionId } = await context.params
	const parsedId = ExecutionIdSchema.safeParse(executionId)
	if (!parsedId.success) {
		logger.error("execution qti request received invalid id", {
			executionId
		})
		return NextResponse.json({ error: "invalid execution id" }, { status: 400 })
	}

	const record = await fetchExecutionRecord(parsedId.data)
	if (!record) {
		return NextResponse.json({ error: "execution not found" }, { status: 404 })
	}

	// @ts-expect-error: this is ok, stuff in here should have already been validated
	const body: AssessmentItemInput<
		WidgetTypeTupleFrom<typeof widgetCollection>,
		FeedbackPlanAny
	> = record.body

	const xmlResult = await errors.try(compile(body, widgetCollection))
	if (xmlResult.error) {
		logger.error("execution compilation failed", {
			executionId: record.id,
			error: xmlResult.error,
			stack: xmlResult.error instanceof Error ? xmlResult.error.stack : null
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
