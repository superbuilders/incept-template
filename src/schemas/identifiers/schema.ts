import { z } from "zod"
import type {
	ChoiceIdentifier,
	FeedbackCombinationIdentifier,
	ResponseIdentifier,
	SlotIdentifier
} from "@/core/identifiers/types"
import {
	CHOICE_IDENTIFIER_PATTERN,
	FEEDBACK_COMBINATION_PATTERN,
	RESPONSE_IDENTIFIER_PATTERN,
	SLOT_IDENTIFIER_PATTERN
} from "@/schemas/identifiers/runtime"

const buildIdentifierSchema = <T>(
	pattern: string,
	message: string
): z.ZodType<T> =>
	// biome-ignore lint: this is ok
	z.string().regex(new RegExp(pattern), message) as unknown as z.ZodType<T>

export const ChoiceIdentifierSchema = buildIdentifierSchema<ChoiceIdentifier>(
	CHOICE_IDENTIFIER_PATTERN,
	"Invalid choice identifier"
)

export const ResponseIdentifierSchema =
	buildIdentifierSchema<ResponseIdentifier>(
		RESPONSE_IDENTIFIER_PATTERN,
		"Invalid response identifier"
	)

export const FeedbackCombinationIdentifierSchema =
	buildIdentifierSchema<FeedbackCombinationIdentifier>(
		FEEDBACK_COMBINATION_PATTERN,
		"Invalid feedback combination identifier"
	)

export const SlotIdentifierSchema = buildIdentifierSchema<SlotIdentifier>(
	SLOT_IDENTIFIER_PATTERN,
	"Invalid slot identifier"
)
