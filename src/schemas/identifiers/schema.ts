import { z } from "zod"
import type {
	ChoiceIdentifier,
	FeedbackCombinationIdentifier,
	ResponseIdentifier,
	SlotIdentifier
} from "@/core/identifiers/types"
import {
	assertChoiceIdentifier,
	assertFeedbackCombinationIdentifier,
	assertResponseIdentifier,
	assertSlotIdentifier,
	CHOICE_IDENTIFIER_PATTERN,
	FEEDBACK_COMBINATION_PATTERN,
	RESPONSE_IDENTIFIER_PATTERN,
	SLOT_IDENTIFIER_PATTERN
} from "@/schemas/identifiers/runtime"

const buildIdentifierSchema = <T>(
	pattern: string,
	assertFn: (value: string) => T,
	message: string
): z.ZodType<T> => {
	const schema = z
		.string()
		.regex(new RegExp(pattern), message)
		.superRefine((value, ctx) => {
			try {
				assertFn(value)
			} catch (error) {
				ctx.addIssue({
					code: "custom",
					message:
						error instanceof Error && error.message ? error.message : message
				})
			}
		})

	// biome-ignore lint: this is ok
	return schema as unknown as z.ZodType<T>
}

export const ChoiceIdentifierSchema = buildIdentifierSchema<ChoiceIdentifier>(
	CHOICE_IDENTIFIER_PATTERN,
	assertChoiceIdentifier,
	"Invalid choice identifier"
)

export const ResponseIdentifierSchema =
	buildIdentifierSchema<ResponseIdentifier>(
		RESPONSE_IDENTIFIER_PATTERN,
		assertResponseIdentifier,
		"Invalid response identifier"
	)

export const FeedbackCombinationIdentifierSchema =
	buildIdentifierSchema<FeedbackCombinationIdentifier>(
		FEEDBACK_COMBINATION_PATTERN,
		assertFeedbackCombinationIdentifier,
		"Invalid feedback combination identifier"
	)

export const SlotIdentifierSchema = buildIdentifierSchema<SlotIdentifier>(
	SLOT_IDENTIFIER_PATTERN,
	assertSlotIdentifier,
	"Invalid slot identifier"
)
