import { regex } from "arkregex"
import type {
	ChoiceIdentifier,
	FeedbackCombinationIdentifier,
	ResponseIdentifier,
	SlotIdentifier
} from "@/core/identifiers/types"

const choiceIdentifierRegex = regex("^[A-Z][A-Z0-9_]*$")
const responseIdentifierRegex = regex("^RESP(?:_[A-Z][A-Z0-9_]*)?$")
const feedbackCombinationRegex = regex(
	"^FB__[A-Z][A-Z0-9_]*(?:__[A-Z][A-Z0-9_]*)*$"
)
const slotIdentifierRegex = regex("^[a-z][a-z0-9_]*$")

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
		throw new TypeError(`Invalid choice identifier: ${value}`)
	}
	return value
}

export function assertResponseIdentifier(value: string): ResponseIdentifier {
	if (!isResponseIdentifier(value)) {
		throw new TypeError(`Invalid response identifier: ${value}`)
	}
	return value
}

export function assertFeedbackCombinationIdentifier(
	value: string
): FeedbackCombinationIdentifier {
	if (!isFeedbackCombinationIdentifier(value)) {
		throw new TypeError(`Invalid feedback combination identifier: ${value}`)
	}
	return value
}

export function assertSlotIdentifier(value: string): SlotIdentifier {
	if (!isSlotIdentifier(value)) {
		throw new TypeError(`Invalid slot identifier: ${value}`)
	}
	return value
}
