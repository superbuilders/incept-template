/**
 * QTI-related constants and patterns
 * This file contains constants that are shared across the QTI generation modules.
 * It's kept separate to avoid circular dependencies.
 */

// Response identifier pattern: RESPONSE or RESPONSE_<suffix>
// Enforces consistent naming for response declarations and interactions
export const RESPONSE_IDENTIFIER_REGEX = /^RESPONSE(?:_[A-Za-z0-9_]+)?$/

// Outcome identifier pattern: strictly FEEDBACK__OVERALL
// Per-interaction feedback outcomes are now forbidden.
export const OUTCOME_IDENTIFIER_REGEX = /^FEEDBACK__OVERALL$/

// Feedback block identifier pattern: CORRECT, INCORRECT, or the new derived format 'FB__...'
// This supports both fallback mode and the combinatorial feedback model.
export const FEEDBACK_BLOCK_IDENTIFIER_REGEX =
	/^(CORRECT|INCORRECT|FB(__[A-Z0-9_]+)+)$/

// Choice/Gap/Item identifier pattern: uppercase alphanumeric with underscores
// Used for choice options, gap IDs, draggable items, etc.
export const CHOICE_IDENTIFIER_REGEX = /^[A-Z][A-Z0-9_]*$/

// Widget/Interaction slot identifier pattern: lowercase with underscores
// Used for slot IDs that reference widgets and interactions
export const SLOT_IDENTIFIER_REGEX = /^[a-z][a-z0-9_]*$/
