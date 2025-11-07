import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { regex } from "arkregex"
import type {
	ChoiceIdentifier,
	FeedbackCombinationIdentifier,
	ResponseIdentifier,
	SlotIdentifier
} from "@/core/identifiers/types"

export const CHOICE_IDENTIFIER_PATTERN = "^[A-Z][A-Z0-9_]*$" as const
export const RESPONSE_IDENTIFIER_PATTERN =
	"^RESP(?:_[A-Z][A-Z0-9_]*)?$" as const
export const FEEDBACK_COMBINATION_PATTERN =
	"^FB__[A-Z][A-Z0-9_]*(?:__[A-Z][A-Z0-9_]*)*$" as const
export const SLOT_IDENTIFIER_PATTERN = "^[a-z][a-z0-9_]*$" as const

const choiceIdentifierRegex = regex(CHOICE_IDENTIFIER_PATTERN)
const responseIdentifierRegex = regex(RESPONSE_IDENTIFIER_PATTERN)
const feedbackCombinationRegex = regex(FEEDBACK_COMBINATION_PATTERN)
const slotIdentifierRegex = regex(SLOT_IDENTIFIER_PATTERN)

export const isChoiceIdentifier = (value: string): value is ChoiceIdentifier =>
	choiceIdentifierRegex.test(value)

export const isResponseIdentifier = (
	value: string
): value is ResponseIdentifier => responseIdentifierRegex.test(value)

export const isFeedbackCombinationIdentifier = (
	value: string
): value is FeedbackCombinationIdentifier =>
	feedbackCombinationRegex.test(value)

export const isSlotIdentifier = (value: string): value is SlotIdentifier =>
	slotIdentifierRegex.test(value)

export function assertChoiceIdentifier(value: string): ChoiceIdentifier {
	if (!isChoiceIdentifier(value)) {
		logger.error("invalid choice identifier", { value })
		throw errors.new("invalid choice identifier")
	}
	return value
}

export function assertResponseIdentifier(value: string): ResponseIdentifier {
	if (!isResponseIdentifier(value)) {
		logger.error("invalid response identifier", { value })
		throw errors.new("invalid response identifier")
	}
	return value
}

export function assertFeedbackCombinationIdentifier(
	value: string
): FeedbackCombinationIdentifier {
	if (!isFeedbackCombinationIdentifier(value)) {
		logger.error("invalid feedback combination identifier", { value })
		throw errors.new("invalid feedback combination identifier")
	}
	return value
}

export function assertSlotIdentifier(value: string): SlotIdentifier {
	if (!isSlotIdentifier(value)) {
		logger.error("invalid slot identifier", { value })
		throw errors.new("invalid slot identifier")
	}
	return value
}
