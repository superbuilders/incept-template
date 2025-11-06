import { z } from "zod"
import {
	CHOICE_IDENTIFIER_REGEX,
	RESPONSE_IDENTIFIER_REGEX
} from "@/compiler/qti-constants"

export const FeedbackDimensionSchema = z
	.discriminatedUnion("kind", [
		z
			.object({
				responseIdentifier: z
					.string()
					.regex(
						RESPONSE_IDENTIFIER_REGEX,
						"invalid response identifier: must start with RESPONSE"
					),
				kind: z.literal("enumerated"),
				keys: z.array(z.string()).min(1)
			})
			.strict(),
		z
			.object({
				responseIdentifier: z
					.string()
					.regex(
						RESPONSE_IDENTIFIER_REGEX,
						"invalid response identifier: must start with RESPONSE"
					),
				kind: z.literal("binary")
			})
			.strict()
	])
	.describe(
		"Defines a single dimension for feedback evaluation, linked to a response."
	)

export const FeedbackCombinationSchema = z
	.object({
		id: z.string().min(1),
		path: z
			.array(
				z
					.object({
						responseIdentifier: z.string().regex(RESPONSE_IDENTIFIER_REGEX),
						key: z.union([
							z.literal("CORRECT"),
							z.literal("INCORRECT"),
							z.string().regex(CHOICE_IDENTIFIER_REGEX)
						])
					})
					.strict()
			)
			.min(0)
	})
	.strict()

export const FeedbackPlanSchema = z
	.object({
		dimensions: z
			.array(FeedbackDimensionSchema)
			.min(1)
			.describe("Ordered list of dimensions for feedback evaluation."),
		combinations: z
			.array(FeedbackCombinationSchema)
			.min(1)
			.describe("Explicit mapping from paths to FB identifiers.")
	})
	.strict()
	.superRefine((plan, ctx) => {
		const dimensionCount = plan.dimensions.length
		const dimensionIds = plan.dimensions.map((dim) => dim.responseIdentifier)
		for (const combination of plan.combinations) {
			if (combination.path.length !== dimensionCount) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						"Each feedback combination path must include exactly one segment per feedback dimension.",
					path: ["combinations"]
				})
				break
			}
			for (const segment of combination.path) {
				if (!dimensionIds.includes(segment.responseIdentifier)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Combination references unknown response identifier '${segment.responseIdentifier}'.`,
						path: ["combinations"]
					})
					break
				}
			}
		}
	})
	.describe("The explicit contract for feedback evaluation.")
