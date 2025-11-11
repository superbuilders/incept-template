import * as logger from "@superbuilders/slog"
import { NextResponse } from "next/server"
import {
	fetchLatestValidatedAttempt,
	SeedSchema,
	TemplateIdSchema,
	TemplateNotValidatedError
} from "@/app/api/template/shared"

type RouteParams = {
	templateId: string
	seed: string
}

export async function GET(
	request: Request,
	context: { params: Promise<RouteParams> }
) {
	const params = await context.params

	const templateIdResult = TemplateIdSchema.safeParse(params.templateId.trim())
	if (!templateIdResult.success) {
		logger.error("template seed redirect route received invalid template id", {
			templateId: params.templateId
		})
		return NextResponse.json({ error: "invalid template id" }, { status: 400 })
	}
	const templateId = templateIdResult.data

	const seedResult = SeedSchema.safeParse(params.seed.trim())
	if (!seedResult.success) {
		logger.error("template seed redirect route received invalid seed", {
			templateId,
			seed: params.seed
		})
		return NextResponse.json(
			{ error: "seed must be a non-negative integer string" },
			{ status: 400 }
		)
	}
	const seed = seedResult.data

	const latestAttempt = await fetchLatestValidatedAttempt(templateId)
	if (latestAttempt === null) {
		logger.error("template seed redirect route found no validated attempts", {
			templateId
		})
		return NextResponse.json(
			{ error: new TemplateNotValidatedError(templateId).message },
			{ status: 404 }
		)
	}

	const redirectUrl = new URL(
		`/api/template/${templateId}/attempt/${latestAttempt}/seed/${seed}`,
		request.url
	)

	return NextResponse.redirect(redirectUrl, { status: 307 })
}
