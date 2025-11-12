import { z } from "zod"
import type {
	BinaryFeedbackDimension,
	CombinationFeedbackDimension,
	EnumeratedFeedbackDimension,
	FeedbackCombination
} from "@/core/feedback/plan"
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
			.strict(),
		z
			.object({
				responseIdentifier: ResponseIdentifierSchema,
				kind: z.literal("combination"),
				minSelections: z.number().int().min(0),
				maxSelections: z.number().int().min(0),
				choices: z.array(ChoiceIdentifierSchema).min(1),
				keys: z.array(z.string()).min(1)
			})
			.strict()
			.superRefine(({ choices, minSelections, maxSelections }, ctx) => {
				if (minSelections > maxSelections) {
					ctx.addIssue({
						code: "custom",
						message:
							"Combination dimension requires minSelections <= maxSelections.",
						path: ["minSelections", "maxSelections"]
					})
				}
				const maxValid = choices.length
				if (minSelections > maxValid || maxSelections > maxValid) {
					ctx.addIssue({
						code: "custom",
						message:
							"Combination dimension selections must satisfy 0 <= minSelections <= maxSelections <= choices.length.",
						path: ["minSelections", "maxSelections"]
					})
				}
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
						key: z.string()
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

type SchemaFeedbackDimension = z.infer<typeof FeedbackDimensionSchema>
type SchemaFeedbackCombination = z.infer<typeof FeedbackCombinationSchema>

type ToReadonly<T> = T extends (infer U)[]
	? readonly ToReadonly<U>[]
	: T extends object
		? { readonly [K in keyof T]: ToReadonly<T[K]> }
		: T

type SchemaDimensionReadonly = ToReadonly<SchemaFeedbackDimension>
type SchemaCombinationReadonly = ToReadonly<SchemaFeedbackCombination>

type EnumeratedSchemaCoverage = EnumeratedFeedbackDimension<
	"RESP",
	readonly ["A", "B"]
> extends SchemaDimensionReadonly
	? true
	: never
type BinarySchemaCoverage =
	BinaryFeedbackDimension<"RESP"> extends SchemaDimensionReadonly ? true : never
type CombinationSchemaCoverage = CombinationFeedbackDimension<
	"RESP",
	0,
	1,
	readonly ["A", "B"],
	readonly ["A"]
> extends SchemaDimensionReadonly
	? true
	: never

type SampleCombinationDimensions = readonly [
	CombinationFeedbackDimension<
		"RESP",
		0,
		1,
		readonly ["A", "B"],
		readonly ["A"]
	>
]

type CombinationPathSchemaCoverage = FeedbackCombination<
	"FB__RESP_A",
	SampleCombinationDimensions
> extends SchemaCombinationReadonly
	? true
	: never

const _enumeratedSchemaCoverage: EnumeratedSchemaCoverage = true
const _binarySchemaCoverage: BinarySchemaCoverage = true
const _combinationSchemaCoverage: CombinationSchemaCoverage = true
const _combinationPathSchemaCoverage: CombinationPathSchemaCoverage = true
void _enumeratedSchemaCoverage
void _binarySchemaCoverage
void _combinationSchemaCoverage
void _combinationPathSchemaCoverage
