import * as logger from "@superbuilders/slog"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/db"
import { templates } from "@/db/schema"
import { env } from "@/env"

type RouteParams = {
	templateId: string
}

const TemplateIdSchema = z.uuid()

export async function GET(
	_request: Request,
	context: { params: Promise<RouteParams> }
) {
	const params = await context.params

	const templateIdResult = TemplateIdSchema.safeParse(params.templateId.trim())
	if (!templateIdResult.success) {
		logger.error("template source route received invalid template id", {
			templateId: params.templateId
		})
		return NextResponse.json({ error: "invalid template id" }, { status: 400 })
	}
	const templateId = templateIdResult.data

	const templateRecord = await db
		.select({
			id: templates.id,
			source: templates.source,
			createdGitCommitSha: templates.createdGitCommitSha
		})
		.from(templates)
		.where(eq(templates.id, templateId))
		.limit(1)
		.then((rows) => rows[0])

	if (!templateRecord) {
		logger.error("template source route could not find template", {
			templateId
		})
		return NextResponse.json({ error: "template not found" }, { status: 404 })
	}

	if (!templateRecord.source) {
		logger.error("template source route encountered empty source", {
			templateId
		})
		return NextResponse.json(
			{ error: "template source unavailable" },
			{ status: 404 }
		)
	}

	const response = new NextResponse(templateRecord.source, {
		status: 200,
		headers: {
			"Content-Type": "text/plain; charset=utf-8"
		}
	})

	if (templateRecord.createdGitCommitSha) {
		response.headers.set(
			"X-Template-Commit-SHA",
			templateRecord.createdGitCommitSha
		)
	}
	if (env.VERCEL_GIT_COMMIT_SHA) {
		response.headers.set("X-Execution-Commit-SHA", env.VERCEL_GIT_COMMIT_SHA)
	}

	return response
}
