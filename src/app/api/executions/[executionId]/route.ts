import * as logger from "@superbuilders/slog"
import { NextResponse } from "next/server"
import {
	ExecutionIdSchema,
	fetchExecutionRecord
} from "@/app/api/executions/shared"

type RouteParams = { executionId: string }

export async function GET(
	_request: Request,
	context: { params: Promise<RouteParams> }
) {
	const { executionId } = await context.params
	const parsedId = ExecutionIdSchema.safeParse(executionId)
	if (!parsedId.success) {
		logger.error("execution request received invalid id", {
			executionId
		})
		return NextResponse.json({ error: "invalid execution id" }, { status: 400 })
	}

	const record = await fetchExecutionRecord(parsedId.data)
	if (!record) {
		return NextResponse.json({ error: "execution not found" }, { status: 404 })
	}

	return NextResponse.json({
		id: record.id,
		templateId: record.templateId,
		attempt: record.attempt,
		seed: record.seed.toString(),
		createdAt: record.createdAt.toISOString(),
		body: record.body
	})
}
