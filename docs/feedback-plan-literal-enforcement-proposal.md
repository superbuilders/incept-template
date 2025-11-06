# Feedback Plan Literal Enforcement Proposal

## Overview

We already converged on a canonical `FeedbackBundle` shape (`{ shared, preambles }`). Runtime helpers ensure every cartesian path is populated, but manual authors and template code can still accidentally omit keys and only find out when validation runs. We want the compiler itself to reject those mistakes: when a template declares its plan as `const`, the TypeScript type system should know *exactly* which combination ids exist and force the author to provide a matching preamble for each one—no runtime guardrails required.

The core idea mirrors dependent-typed systems: derive a literal tuple of combination ids from a plan, map that tuple into the feedback authoring type, and let TypeScript’s structural typing enforce completeness. Runtime‑generated plans (e.g., structured inference) continue to rely on the existing guardrails, but anything authored statically becomes “correct by construction”.

## Design Goals

- **Literal Plans**: Provide a const-friendly helper so manual authors can declare feedback plans with literal tuples. That literal structure becomes the compiler’s source of truth.
- **Compile-time Enforced Preambles**: For const plans, the feedback shape must be `{ preambles: { [k in CombinationId]: … } }`. Missing keys = type errors.
- **Dynamic Plans Still Work**: Structured generation still produces plans at runtime; the broader runtime validation path stays in place for those scenarios.
- **Zero runtime branching**: The same `FeedbackBundle` shape continues to flow everywhere; only the type signatures acquire overloads/utility types.
- **Template Ergonomics**: Introduce helpers that minimise boilerplate for CONST authors (plan definition + bundle creation) so the compiler owns the coverage check, not humans.

## Literal Plan Contracts

Manual templates already hardcode their plans as `const` objects. Rather than letting each template (or the AI) reimplement complex conditional types, we introduce a single helper that preserves the literal structure and brands the plan as “static”. The helper does not provide a fallback path—it exists purely to capture the cartesian product in the type system.

```ts
const feedbackPlan = defineFeedbackPlan({
	dimensions: [
		{
			responseIdentifier: "RESPONSE",
			keys: ["CHOICE_0", "CHOICE_1", "CHOICE_2", "CHOICE_3"]
		}
	] as const
})
```

### Type-level behaviour

- Using variadic tuple types, `defineFeedbackPlan` computes the full cartesian product of the literal `dimensions` tuple at **compile time**.
- The helper exposes that cartesian set as a literal tuple:

	```ts
	type CombinationIds = typeof feedbackPlan.combinationIds[number]
	// "response_choice_0" | "response_choice_1" | "response_choice_2" | "response_choice_3"
	```

- The actual implementation can continue to return the `plan.combinations` array we already need at runtime, but the important piece is the branded literal tuple that we can map into other types.

### Normalisation

- Binary dimensions default to canonical keys (`["CORRECT", "INCORRECT"]`).
- Combination ids are formatted consistently (e.g., `response_choice_0`).
- Plans with no dimensions still produce a deterministic synthetic axis (`["CORRECT","INCORRECT"]`), so templates that only distinguish overall correctness are handled without special cases.

```ts
const feedbackPlan = defineFeedbackPlan({
	dimensions: [
		{
			responseIdentifier: "RESPONSE",
			keys: ["CHOICE_0", "CHOICE_1", "CHOICE_2", "CHOICE_3"]
		}
	] as const
})
```

### What the helper actually does

- **Type-level**: computes the cartesian product and exposes `combinationIds` as a literal tuple.
- **Runtime-level**: returns the same `FeedbackPlan` object we already needed; there is no new logic path or fallback here.
- **Branding**: marks the returned object so other helpers can discriminate between compile-time-safe plans and runtime plans.
- **Ergonomics**: prevents every template (or AI author) from copy/pasting intricate conditional-type machinery incorrectly.

## Static Feedback Types

With literal plans available, we elevate the bundle authoring types.

```ts
type StaticAuthoringFeedback<
	P extends StaticFeedbackPlan,
	E extends readonly string[]
> = {
	shared: FeedbackSharedPedagogy<E>
	preambles: { [K in P["combinationIds"][number]]: FeedbackPreamble }
}

type DynamicAuthoringFeedback = {
	shared: FeedbackSharedPedagogy
	preambles: Record<string, FeedbackPreamble>
}
```

Once plans are branded, we can overload the bundle helpers:

```ts
function createFeedbackBundle<P extends StaticFeedbackPlan, E extends readonly string[]>(
	plan: P,
	shared: FeedbackSharedPedagogy<E>,
	preambles: StaticAuthoringFeedback<P, E>["preambles"]
): FeedbackBundle<E>

function createFeedbackBundle<E extends readonly string[]>(
	plan: FeedbackPlan,
	shared: FeedbackSharedPedagogy<E>,
	preambles: Record<string, FeedbackPreamble>
): FeedbackBundle<E>
```

Templates hit the first overload and get compile-time coverage; dynamic flows hit the second and keep runtime validation.

## Compile-time Bundle Factories

Templates can reduce boilerplate by leaning on a typed bundle factory:

```ts
export function defineFeedbackBundle<
	P extends StaticFeedbackPlan,
	E extends readonly string[]
>(
	plan: P,
	shared: FeedbackSharedPedagogy<E>,
	preambles: StaticAuthoringFeedback<P, E>["preambles"]
) {
	return createFeedbackBundle(plan, shared, preambles)
}
```

Editors/AI authors just call `defineFeedbackPlan` once, then `defineFeedbackBundle`. If they omit a key or include an extra one, TypeScript emits an error before compilation or validation.

## Schema Enhancements

`createFeedbackObjectSchema` should accept a branded plan and produce a Zod schema with literal keys. For dynamic plans, it still returns a record schema with runtime checks.

```ts
export function createFeedbackObjectSchema<
	P extends StaticFeedbackPlan,
	const E extends readonly string[]
>(plan: P, widgetTypes: E): z.ZodType<StaticAuthoringFeedback<P, E>>

export function createFeedbackObjectSchema<const E extends readonly string[]>(
	plan: FeedbackPlan,
	widgetTypes: E
): z.ZodType<DynamicAuthoringFeedback>
```

## Template & Test Updates

1. Replace hand-authored plan objects with `defineFeedbackPlan`. This ensures the literal combination tuple is preserved.
2. Author shared pedagogy once per template; use `defineFeedbackBundle(plan, shared, preambles)` to construct the bundle.
3. Update tests/fixtures to expect the new helper pattern.
4. Provide codemods or lint rules to rewrite `Object.fromEntries`/`Record<string, FeedbackContent>` patterns.

### Example

```ts
const feedbackPlan = defineFeedbackPlan({
	dimensions: [
		{ responseIdentifier: "RESPONSE", keys: ["CHOICE_0", "CHOICE_1"] }
	] as const
})

const shared = { steps: [...], solution: {...} }

const preambles = {
	response_choice_0: { correctness: "correct", summary: [...] },
	response_choice_1: { correctness: "incorrect", summary: [...] }
} satisfies StaticAuthoringFeedback<typeof feedbackPlan, TemplateWidgets>["preambles"]

const feedback = defineFeedbackBundle(feedbackPlan, shared, preambles)
```

Drop one of the `response_choice_*` keys and TypeScript fails immediately.

## Structured Pipeline Considerations

Structured generation builds plans dynamically from interactions, so it can’t benefit from literal typing. We simply:

- Keep the runtime overload of `createFeedbackBundle` that accepts `Record<string, FeedbackPreamble>`.
- Optionally brand runtime plans differently (e.g., `type RuntimeFeedbackPlan = { _runtime: true } & FeedbackPlan`), so helper overloads discriminate cleanly.
- If structured flows ever derive static metadata (e.g., tasks with known combinations), they can gradually opt into the static path.

## Implementation Roadmap

1. **Plan Utilities**
	- Implement `defineFeedbackPlan` that returns both runtime data and a branded `StaticFeedbackPlan`.
	- Provide utilities (`feedbackPlan.combinationIds`, `feedbackPlan.combinations`) for existing code to consume.
2. **Type Reshaping**
	- Introduce `StaticAuthoringFeedback` / `DynamicAuthoringFeedback`.
	- Adjust `FeedbackBundle` to drop the unused plan generic.
3. **Helper Overloads**
	- Overload `createFeedbackBundle`, `validateFeedbackObject`, `buildEmptyNestedFeedback`, etc., to support static vs dynamic plans.
	- Add `defineFeedbackBundle` (optional ergonomic wrapper).
4. **Schema Upgrade**
	- `createFeedbackObjectSchema` builds literal-key Zod objects for static plans, `record` schemas for dynamic plans.
5. **Template Migration**
	- Update manual templates (positive/negative examples) to use the new helpers.
	- Enforce the pattern via lint rules or template generators so AI output conforms automatically.
6. **Structured Pipeline Alignment**
	- Replace imports of removed legacy helpers with runtime-friendly variants.
	- Continue to rely on runtime validation where plans are inferred dynamically.
7. **Testing**
	- Add compile-time (`tsd`) tests verifying omission/extra preambles cause type errors.
	- Update runtime tests to exercise both static and dynamic code paths.

## Open Questions

- **Synthetic Naming**: Should the auto-inserted overall axis use a canonical identifier? (e.g., `RESPONSE__OVERALL` vs `OVERALL`).
- **Diagnostic UX**: Mapped-type errors can be opaque—should we provide a friendly helper or custom lint that highlights exactly which keys are missing?
- **Structured Hints**: Can structured workflows expose metadata ahead of time so they, too, can benefit from static typing?
- **Extensibility**: Do we need to support more complex representations (e.g., multi-level preamble trees) or is the flat record sufficient?

## Summary

By lifting the cartesian product into TypeScript’s type system (via literal plans and mapped preamble records), manual authors get instant feedback when they miss a combination. Runtime generation continues to rely on validation, but code authored with `defineFeedbackPlan` becomes provably correct by construction—aligning with the goal of a “dependent-type” feel inside plain TypeScript.
