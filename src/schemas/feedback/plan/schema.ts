import { z } from "zod"
import {
	ChoiceIdentifierSchema,
	FeedbackCombinationIdentifierSchema,
	ResponseIdentifierSchema
} from "@/schemas/identifiers/schema"

export const FeedbackDimensionSchema = z
	.discriminatedUnion("kind", [
		z
			.object({
				responseIdentifier: ResponseIdentifierSchema,
				kind: z.literal("enumerated"),
				keys: z.array(ChoiceIdentifierSchema).min(1)
			})
			.strict(),
		z
			.object({
				responseIdentifier: ResponseIdentifierSchema,
				kind: z.literal("binary")
			})
			.strict()
	])
	.describe(
		"Defines a single dimension for feedback evaluation, linked to a response."
	)

export const FeedbackCombinationSchema = z
	.object({
		id: FeedbackCombinationIdentifierSchema,
		path: z
			.array(
				z
					.object({
						responseIdentifier: ResponseIdentifierSchema,
						key: z.union([
							z.literal("CORRECT"),
							z.literal("INCORRECT"),
							ChoiceIdentifierSchema
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
					code: "custom",
					message:
						"Each feedback combination path must include exactly one segment per feedback dimension.",
					path: ["combinations"]
				})
				break
			}
			for (const segment of combination.path) {
				if (!dimensionIds.includes(segment.responseIdentifier)) {
					ctx.addIssue({
						code: "custom",
						message: `Combination references unknown response identifier '${segment.responseIdentifier}'.`,
						path: ["combinations"]
					})
					break
				}
			}
		}
	})
	.describe("The explicit contract for feedback evaluation.")
