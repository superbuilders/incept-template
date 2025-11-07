# Feedback Plan Type-Safety Overhaul

## Why This Matters

Our goal is for every authored item to be **compile-time safe**: when code constructs a `FeedbackBundle`, TypeScript should prove that every combination id from the feedback plan has a matching preamble entry. Right now we fall short in templates like `fraction-addition.ts`, because the compiler widens the bundle back to `Record<string, FeedbackPreamble>`. Two root causes are responsible:

1. **Default generics on `FeedbackPlan`**  
   `FeedbackPlan` still declares default type parameters:
   ```ts
   export type FeedbackPlan<
     Dimensions extends readonly FeedbackDimension[] = readonly FeedbackDimension[],
     Combinations extends readonly FeedbackCombination[] = readonly FeedbackCombination[]
   > = { ... }
   ```
   When a caller omits the generics (which is the common case), TypeScript silently chooses the defaults. The derived `FeedbackCombinationId<FeedbackPlan>` then collapses to plain `string`, and every mapped type (`FeedbackPreambleMap`, `FeedbackBundle["preambles"]`, etc.) falls back to `Record<string, ...>`.

2. **Plan builders discard literal evidence**  
   Functions like `buildFeedbackPlan` (and the template-specific `buildFeedbackPlan` helper in `fraction-addition.ts`) compute the plan from runtime arrays. Operations such as `.map`, `.sort`, and `Array.prototype.push` produce `string[]`, not a literal tuple. Even if we eliminated the default generics, TypeScript still sees:
   ```ts
   function buildFeedbackPlan(choiceIdentifiers: readonly string[]): {
     dimensions: Array<...>;
     combinations: Array<{ id: string; path: ... }>;
   }
   ```
   Because the IDs are derived dynamically, the type system has no immutable tuple to promote into the plan. Result: the cartesian product collapses to `string` at the type level.

Any template that infers its plan dynamically hits both problems; we end up with the “shitty string map” effect at hover time and lose the compile-time safety net.

## Objectives

1. **Eliminate silent widening**: remove every default generic parameter that lets `FeedbackPlan` (and the dependent aliases) fall back to `string`.
2. **Preserve literal evidence**: ensure that code constructing a supposedly static plan actually produces a literal tuple the compiler can see.
3. **Clearly separate runtime plans**: structured generation still produces plans at runtime; it must use an explicit `RuntimeFeedbackPlan` path so the widening can’t bleed back into static authoring.
4. **Zero type fallbacks**: once a plan is tagged as static, `FeedbackBundle["preambles"]` must be keyed by `FeedbackCombinationId<P>`—no `Record<string, ...>` anywhere in the static surface.

## Proposed Strategy

### 1. Remove default generics in core

- Rewrite `FeedbackPlan` (and `FeedbackCombination`, `EnumeratedFeedbackDimension`, etc.) so the type parameters are mandatory.
- Update aliases that depend on `FeedbackPlan` (`FeedbackCombinationId`, `FeedbackPreambleMap`, `FeedbackBundle`, authoring helpers) to require explicit generics.
- This change will ripple outward; any call site currently relying on defaults will have to pass the literal types or opt into the runtime wrapper.

### 2. Formalize the static vs runtime distinction

- Introduce a pair of branded aliases:
  ```ts
  type StaticFeedbackPlan<
    Dimensions extends readonly FeedbackDimension[],
    Combinations extends readonly FeedbackCombination[]
  > = FeedbackPlan<Dimensions, Combinations>

  type RuntimeFeedbackPlan = FeedbackPlan<
    readonly FeedbackDimension[],
    readonly FeedbackCombination[]
  >
  ```
- Authoring APIs (`AssessmentItemInput`, `FeedbackBundle`, schema helpers) should accept only `StaticFeedbackPlan`. Structured/runtime code intentionally produces `RuntimeFeedbackPlan` and goes through the Zod validators that return the normalized bundle.
- This keeps the widened `string` unions cordoned off from static authoring.

### 3. Provide type-level cartesian utilities

Instead of helper functions, we can lean on pure type machinery:

- Create a type that, given a tuple of enumerated dimensions, computes the cartesian product of combination ids at the type level:
  ```ts
  type CombinationIdsFor<
    Dimensions extends readonly EnumeratedFeedbackDimensionLiteral[]
  > = /* cartesian product producing readonly tuple of IDs */
  ```
- Define a companion utility that materializes the runtime array while preserving the literal type via `as const satisfies`.
  ```ts
  const combinations = buildLiteralCombinations(dimensions)
    satisfies CombinationTupleFor<typeof dimensions>
  ```
  The helper can live purely at the type level (using conditional types) so we stay faithful to the “no runtime helper” preference; runtime code just arranges its data in a `const` structure that satisfies the type.

### 4. Refactor templates to preserve literals

For templates that truly require static checking (e.g., hand-authored items):

- Replace dynamic mutation patterns (`Array.push`, `sort`, `filter`) with immutable literal assembly. If we must compute choice IDs programmatically, constrain them via explicit tuple declarations:
  ```ts
  const choiceIdentifiers = ["CHOICE_0", "CHOICE_1", "CHOICE_2", "CHOICE_3"] as const
  ```
- When a template needs runtime-driven IDs (like the current `fraction-addition.ts` after shuffling), acknowledge that the plan is runtime-only and route it through the runtime path. This keeps the literality story honest: we cannot have dependent typing on data produced by `Math.random`.
- Document this requirement so template authors know they must either keep the plan literal or accept runtime-only validation.

### 5. Update structured pipeline

- We already swapped structured generation to run-time validation; extend that by marking the plan type as `RuntimeFeedbackPlan`. The bundle that emerges from `createFeedbackBundle` becomes the exact shape we need without pretending it’s static.
- No further schema edits are necessary; structured code will continue to rely on Zod for runtime coverage, but the types make the distinction explicit.

## Implementation Plan

1. **Core type cleanup**
   - Remove default generics on `FeedbackPlan` and companions.
   - Update all dependent type aliases and ensure there are no residual defaults (`FeedbackSharedPedagogy`, etc.).
   - Verify `FeedbackCombinationId<FeedbackPlan>` now errors unless the plan carries literal generics.

2. **Static/runtime split**
   - Define `StaticFeedbackPlan` and `RuntimeFeedbackPlan`.
   - Patch authoring surfaces (`AssessmentItemInput`, `FeedbackBundle`, schema helpers) to accept only `StaticFeedbackPlan`.
   - Patch structured runtime code to label its plan as `RuntimeFeedbackPlan`.

3. **Type-level cartesian utilities**
   - Implement the type-level cartesian resolver and the `satisfies` pattern for combinations.
   - Update `feedback/plan/static.ts` (or equivalent) to export the type machinery without runtime helpers.

4. **Template migration**
   - Audit templates. For those with literal plans, upgrade them to the new type-safe pattern (`as const` tuples). For templates that rely on runtime randomness, accept the runtime path explicitly so TypeScript doesn’t pretend it can prove coverage.
   - Remove any lingering uses of `Record<string, FeedbackPreamble>`; they should now be keyed by `FeedbackCombinationId<P>` or be explicitly typed as runtime.

5. **Structured confirmation**
   - Ensure structured generation compiles against `RuntimeFeedbackPlan` and that its Zod schema still produces the normalized bundle.
   - Run `bun typecheck` to confirm no silent widenings remain.

6. **Tooling and docs**
   - Update author documentation: “Static plans must be declared with literal tuples; dynamic plans must be routed through the runtime guard path.”
   - Add lint rules if necessary to forbid importing raw `FeedbackPlan` in authoring code.

## Risks & Mitigations

- **Invasive template changes**: Templates that currently mutate arrays will need a rewrite. Mitigation: stage the work and provide migration examples showing how to preserve literals (e.g., using `const` tuples, immutable copies).
- **Structured/runtime friction**: Structured code now explicitly uses `RuntimeFeedbackPlan`; ensure tests cover this path so nobody tries to treat it as static.
- **Type-level complexity**: The cartesian product utilities can get hairy. Keep the implementation isolated in a single module with tests (e.g., `tsd`) to verify literal inference works as intended.

## Expected Outcome

Once we execute this plan:

- Hovering `feedbackPlan` in a static template will display the literal combination union (e.g., `"FB__RESPONSE_A" | ...`).  
- `FeedbackBundle["preambles"]` becomes `Record<FeedbackCombinationId<P>, FeedbackPreamble>` with no hidden `string` fallback.  
- Any attempt to drop a combination in a static template will fail at compile time.  
- Structured/runtime flows will continue to work via the runtime guard path, but the type system will no longer blur the line between static and dynamic plans.
