import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import { createFeedbackBundle } from "@/core/content/bundles"
import {
	createFeedbackPreambleSchema,
	createFeedbackSharedPedagogySchema
} from "@/core/content/contextual-schemas"
import type {
	FeedbackBundle,
	FeedbackCombinationId,
	FeedbackPreamble,
	FeedbackPreambleMap,
	FeedbackSharedPedagogy
} from "@/core/content/types"
import type {
	AuthoringFeedbackOverall,
	NestedFeedbackAuthoring
} from "@/core/feedback/authoring/types"
import { buildFeedbackPlanFromInteractions } from "@/core/feedback/plan/builder"
import type { FeedbackPlan } from "@/core/feedback/plan/types"
import type { AnyInteraction } from "@/core/interactions/types"
import type { ResponseDeclaration } from "@/core/item/types"

function isCombinationId<P extends FeedbackPlan>(
	plan: P,
	id: string
): id is FeedbackCombinationId<P> {
	return plan.combinations.some((combo) => combo.id === id)
}

export function createFeedbackObjectSchema<const E extends readonly string[]>(
	feedbackPlan: FeedbackPlan,
	widgetTypeKeys: E
): z.ZodType<AuthoringFeedbackOverall<E>> {
	const SharedSchema = createFeedbackSharedPedagogySchema(widgetTypeKeys)
	const PreambleSchema: z.ZodType<FeedbackPreamble<E>> =
		createFeedbackPreambleSchema(widgetTypeKeys)

	const expectedIds = feedbackPlan.combinations.map((combo) => combo.id)
	const expectedSet = new Set(expectedIds)

	const PreamblesSchema: z.ZodType<FeedbackPreambleMap<E>> = z
		.record(z.string(), PreambleSchema)
		.superRefine((value, ctx) => {
			for (const key of Object.keys(value)) {
				if (!expectedSet.has(key)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `unexpected feedback preamble key '${key}'`,
						path: [key]
					})
				}
			}
			for (const expectedId of expectedIds) {
				if (!(expectedId in value)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `missing feedback preamble for '${expectedId}'`,
						path: [expectedId]
					})
				}
			}
		})
		.transform((value) => {
			const entries: Array<[string, FeedbackPreamble<E>]> = []
			for (const expectedId of expectedIds) {
				if (!isCombinationId(feedbackPlan, expectedId)) {
					continue
				}
				const preamble = value[expectedId]
				if (!preamble) {
					continue
				}
				entries.push([expectedId, preamble])
			}
			return Object.fromEntries(entries)
		})

	return z
		.object({
			shared: SharedSchema,
			preambles: PreamblesSchema
		})
		.strict()
}

export function validateFeedbackObject<const E extends readonly string[]>(
	feedbackObject: unknown,
	feedbackPlan: FeedbackPlan,
	widgetTypeKeys: E
): AuthoringFeedbackOverall<E> {
	const schema = createFeedbackObjectSchema(feedbackPlan, widgetTypeKeys)
	const result = schema.safeParse(feedbackObject)

	if (!result.success) {
		logger.error("feedback object validation", { error: result.error })
		throw errors.wrap(result.error, "feedback object validation")
	}

	return result.data
}

export function convertAuthoringFeedbackToBundle<
	P extends FeedbackPlan,
	E extends readonly string[]
>(feedback: AuthoringFeedbackOverall<E>, feedbackPlan: P): FeedbackBundle<E> {
	return createFeedbackBundle(feedbackPlan, feedback.shared, feedback.preambles)
}

export function buildEmptyNestedFeedback<
	const E extends readonly string[] = readonly string[]
>(feedbackPlan: FeedbackPlan): NestedFeedbackAuthoring<E> {
	const shared: FeedbackSharedPedagogy<E> = {
		steps: [],
		solution: { type: "solution", content: [] }
	}

	const defaultPreamble: FeedbackPreamble<E> = {
		correctness: "incorrect",
		summary: []
	}

	const preambleEntries = new Map<string, FeedbackPreamble<E>>(
		feedbackPlan.combinations.map((combo) => [combo.id, { ...defaultPreamble }])
	)

	return {
		feedback: {
			shared,
			preambles: Object.fromEntries(preambleEntries.entries())
		}
	}
}

export function buildFeedbackFromNestedForTemplate<
	const E extends readonly string[]
>(
	interactions: Record<string, AnyInteraction<E>>,
	responseDeclarations: ResponseDeclaration[],
	feedbackObject: AuthoringFeedbackOverall<E>,
	widgetTypeKeys: E
): {
	feedbackPlan: FeedbackPlan
	feedback: FeedbackBundle<E>
} {
	const plan = buildFeedbackPlanFromInteractions(
		interactions,
		responseDeclarations
	)
	const validated = validateFeedbackObject(feedbackObject, plan, widgetTypeKeys)
	const bundle = convertAuthoringFeedbackToBundle(validated, plan)
	return { feedbackPlan: plan, feedback: bundle }
}
