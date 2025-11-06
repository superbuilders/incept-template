# Static Feedback Plan Enforcement Proposal

## Overview

Our intent is for every authored item to declare its feedback plan as a literal `const` so TypeScript can derive the exact cartesian combination IDs. However, the current type definitions still allow authors (human or AI) to widen the plan back to the generic `FeedbackPlan`, which erases the literal ID union. Once widened, both compile-time guarantees and strict feedback typing disappear—exactly the kind of silent “fallback” behaviour we committed to eliminating.

This proposal removes those escape hatches by branding static plans, tightening generics across the core item types, and splitting the runtime pipeline into an explicit, separately typed path.

## Root Cause

- `FeedbackPlan` (see `src/core/feedback/plan/types.ts`) has optional generic defaults and no brand. Assigning a literal const to `FeedbackPlan` widens `combination.id` to `string`.
- `AssessmentItemInput` in `src/core/item/types.ts` accepts any `P extends FeedbackPlan`, so templates can pass the widened plan without error.
- Authoring helpers (`src/core/feedback/authoring/schema.ts`, `src/core/content/bundles.ts`) bank on `FeedbackCombinationId<P>` being literal but fall back gracefully once that union collapses.
- Several type aliases (`FeedbackBundle`, `FeedbackSharedPedagogy`, etc.) provide default generic parameters (e.g., `E extends readonly string[] = readonly string[]`), meaning callers can omit the widget tuple and still compile with a widened `string` union.

The combination of these defaults means the dependent-type story only works *when authors choose to keep their plan literal*. Nothing prevents fallbacks today.

## Goals

1. **Branded static plans**: A literal plan declaration should produce a distinct `StaticFeedbackPlan` type that carries the exact combination ID union.
2. **Mandatory static path for authoring**: All authoring APIs—including `AssessmentItemInput`, schema helpers, bundle creators—must reject unbranded `FeedbackPlan` instances.
3. **Explicit runtime path**: Structured generation (which necessarily creates plans at runtime) should opt into a separate `RuntimeFeedbackPlan` path with dedicated helpers that continue to run runtime validation.
4. **No default generics**: Remove fallback default parameters that silently widen key unions.
5. **Migration guidance**: Provide a clear sequence to update templates, negative examples, and structured code.

## Proposed Design

### 1. Introduce branded plan types

In `src/core/feedback/plan/types.ts`:

```ts
declare const staticPlanBrand: unique symbol

export type StaticFeedbackPlan<
	Dims extends readonly FeedbackDimension[],
	Combos extends readonly FeedbackCombination[]
> = {
	dimensions: Dims
	combinations: Combos
	readonly [staticPlanBrand]: true
}

export type RuntimeFeedbackPlan = FeedbackPlan
```

- `FeedbackCombinationId<StaticFeedbackPlan<…>>` remains a literal union.
- `FeedbackCombinationId<RuntimeFeedbackPlan>` widens to `string`.

### 2. Literal constructor

Add `defineFeedbackPlan` (e.g., `src/core/feedback/plan/static.ts`) that accepts a literal object, computes the cartesian metadata, and returns `StaticFeedbackPlan`.

All manual templates and authoring code must call this helper; there should be no public constructor returning plain `FeedbackPlan`.

### 3. Split authoring types

- Update `src/core/item/types.ts` so `AssessmentItemInput<E, P>` requires `P extends StaticFeedbackPlan<any, any>` for authoring.
- Provide `AssessmentItemRuntime<E>` (or similar) for structured outputs that still carry `FeedbackPlan`.
- Remove default generic parameters for widget tuples; call sites must pass the tuple explicitly.

### 4. Update helpers and schemas

- Overload `createFeedbackBundle`, `createFeedbackObjectSchema`, `buildEmptyNestedFeedback`, etc., with distinct signatures for `StaticFeedbackPlan` vs `RuntimeFeedbackPlan`.
- Static overloads must only accept `StaticFeedbackPlan` and return strictly typed records keyed by `FeedbackCombinationId<P>`.
- Runtime overloads continue to accept `FeedbackPlan` and return `Record<string, …>`, but the brand prevents accidental mixing.

### 5. Template & fixture migration

- Convert every template in `src/templates` to call `defineFeedbackPlan`. Any vestigial fields (`mode`, `FEEDBACK__OVERALL`) should be deleted during migration.
- Update negative fixtures under `src/templates/prompts/examples/negative` to reflect the new errors (or drop stale ones if they no longer make sense).

### 6. Structured pipeline updates

- Replace imports of the removed helpers (e.g., `createComboFeedbackObjectSchema`) with the runtime-specific variants.
- Ensure collectors/validators explicitly acknowledge they’re using `RuntimeFeedbackPlan`, so the absence of compile-time enforcement is intentional and guarded by runtime validation.

### 7. Remove default generics

- Eliminate constructs like `E extends readonly string[] = readonly string[]` across content and feedback types. Callers must choose the widget tuple; leaving it unspecified should no longer compile.
- Audit other modules for similar defaults (e.g., interaction types, authoring utilities) and remove any that mask missing type information.

## Implementation Steps

1. **Type definitions**  
   - Create `static.ts` with `defineFeedbackPlan`.  
   - Add branded `StaticFeedbackPlan` and `RuntimeFeedbackPlan` aliases.  
   - Update `FeedbackCombinationId`, `FeedbackCombinationKeyspace`, etc., to respect the new brand.

2. **Core item / content updates**  
   - Tighten `AssessmentItem` and `AssessmentItemInput` generics.  
   - Adjust `FeedbackBundle`, `FeedbackSharedPedagogy`, and related types to remove default generics.  
   - Ensure `createFeedbackBundle` and `expandFeedbackBundle` overloads discriminate on `StaticFeedbackPlan` vs runtime.

3. **Schema migration** ( `src/core/feedback/authoring/schema.ts` )  
   - Replace the current plan parameter with the branded type.  
   - Offer a separate runtime helper (e.g., `createRuntimeFeedbackObjectSchema`) for structured flows.

4. **Template sweep**  
   - Update all templates to import and call `defineFeedbackPlan`.  
   - Replace `feedback` objects with the new `{ shared, preambles }` bundle structure.  
   - Remove legacy fields (`mode`, `FEEDBACK__OVERALL`, etc.).

5. **Structured pipeline changes**  
   - Update `src/structured/client.ts`, `src/structured/validator.ts`, `src/structured/utils/collector.ts`, etc., to import the runtime helper set.  
   - Replace references to removed exports (`ComboPlan`, `createComboFeedbackObjectSchema`) with the new API.  
   - Explicitly document that runtime plans skip compile-time enforcement but are validated via `createFeedbackBundle` before use.

6. **Negative fixtures & tests**  
   - Refresh or remove outdated examples under `src/templates/prompts/examples/negative`.  
   - Add compile-time tests (`tsd` or type-only fixtures) proving that omitting a combination now fails.

7. **Lint & tooling**  
   - Extend lint rules (if needed) to forbid importing plain `FeedbackPlan` in authoring code.  
   - Ensure our “no fallback” rules cover default generics and enforced plan branding.

## Risks & Mitigations

- **Mass refactor churn**: Touching every template and structured file is invasive. Mitigate with scripted codemods and staged PRs.
- **Runtime regressions**: Structured pipeline still needs a valid path; ensure comprehensive runtime tests remain.
- **AI prompt drift**: Update template scaffolding and documentation so generated templates automatically use `defineFeedbackPlan`.

## Open Questions

- Should we provide a single `defineAssessmentItem` helper that threads the static plan + bundle creation to minimize template boilerplate?
- Do we need lint rules (or codemods) to catch lingering imports of `FeedbackPlan` in authoring code?
- Can the structured pipeline ever produce literal plans (e.g., from metadata)? If so, can we promote them to `StaticFeedbackPlan` mid-flight?

## Next Steps

1. Implement the branded plan types and the `defineFeedbackPlan` helper.
2. Tighten `AssessmentItemInput` and related generics to require `StaticFeedbackPlan`.
3. Refactor schema and content helpers to split static vs runtime paths.
4. Migrate templates and structured code, updating fixtures/tests along the way.
5. Drop default generic parameters and add lint coverage for the new constraints.

Once complete, no authoring pathway will be able to “fall back” to an unbranded plan—the type checker will enforce complete cartesian coverage every time.
