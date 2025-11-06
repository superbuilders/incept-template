# Feedback Bundle Normalization & Type Enforcement Proposal

## Overview

We want every feedback author (human or AI) to produce the same canonical structure:

```ts
type FeedbackBundle<P extends FeedbackPlan, E extends readonly string[]> = {
	shared: FeedbackSharedPedagogy<E>
	preambles: Record<FeedbackCombinationId<P>, FeedbackPreamble<E>>
}
```

- **Shared pedagogy** (`steps` + `solution`) is authored exactly once per item.
- **Preambles** hold outcome-specific verdict copy (correctness + summary) for every cartesian combination in the active feedback plan.
- **No code path** can smuggle per-combination steps or omit required preamble keys—both the type system and runtime helpers will enforce the shape.

This document explains how to achieve that with simpler types that are ergonomic for template authors and deterministic for the LLM pipeline.

## Design Goals

- **Single canonical format**: every template, generator, compiler, and runtime uses the same `FeedbackBundle`.
- **Compile-time guard rails**: when a plan is declared `as const`, TypeScript exposes the literal union of combination IDs. That union becomes the key space for `preambles`, helping authors (and the AI) catch missing or misspelled paths during authoring.
- **Runtime certainty**: even if a plan was assembled dynamically (and the literal union collapses to `string`), a helper verifies that `preambles` covers the entire cartesian product before the compiler proceeds.
- **Uniform plan semantics**: all dimensions participate in the cartesian product. Non-enumerated interactions are treated as binary (`"CORRECT"` and `"INCORRECT"`), so we never special-case fallback plans. The same bundle contract applies everywhere.
- **LLM-friendly**: The shape is a shallow object with predictable property names (`shared`, `preambles`, combo IDs). No nested `content` objects per combination.
- **No backwards compatibility**: legacy `FeedbackContent`-per-combination payloads disappear. The bundle is the only supported format; migration is immediate, with no adapters or dual-path logic left behind.

## Updated Core Types

```ts
export type FeedbackCombinationId<P extends FeedbackPlan> =
	P["combinations"][number]["id"]

export type FeedbackSharedPedagogy<
	E extends readonly string[] = readonly string[]
> = {
	steps: StepBlock<E>[]
	solution: SolutionBlock<E>
}

export type FeedbackBundle<
	P extends FeedbackPlan,
	E extends readonly string[] = readonly string[]
> = {
	shared: FeedbackSharedPedagogy<E>
	preambles: Record<FeedbackCombinationId<P>, FeedbackPreamble<E>>
}

export type AssessmentItem<
	E extends readonly string[],
	P extends FeedbackPlan
> = {
	// ...existing fields...
	feedbackPlan: P
	feedback: {
		FEEDBACK__OVERALL: FeedbackBundle<P, E>
	}
}
```

- `FeedbackPlan` keeps its current structure, but the builder treats opaque/binary interactions as enumerated with keys `["CORRECT", "INCORRECT"]`.
- `FeedbackCombinationId<P>` pulls the literal union of IDs when `P` is declared with `as const`. If the plan is dynamic, the type falls back to `string`, and runtime validation takes over.

## Runtime Helper for Strict Validation

To catch mistakes when types widen at runtime (e.g., structured generation), every authoring surface calls `createFeedbackBundle`:

```ts
export function createFeedbackBundle<
	P extends FeedbackPlan,
	E extends readonly string[],
	Map extends Partial<Record<FeedbackCombinationId<P>, FeedbackPreamble<E>>>
>(
	plan: P,
	shared: FeedbackSharedPedagogy<E>,
	preambles: Map
): FeedbackBundle<P, E> {
	const expected = new Set(plan.combinations.map((combo) => combo.id))
	const provided = new Set(Object.keys(preambles))

	if (expected.size !== provided.size) {
		const missing = [...expected].filter((id) => !provided.has(id))
		const extra = [...provided].filter((id) => !expected.has(id))
		logger.error("invalid preamble map", { missing, extra })
		throw errors.new("invalid feedback preamble map")
	}

	return {
		shared,
		preambles: preambles as Record<FeedbackCombinationId<P>, FeedbackPreamble<E>>
	}
}
```

- **Templates** pass their `feedbackPlan` (declared `as const`), the shared pedagogy, and a literal object of preambles. TypeScript confirms the keys; runtime ensures completeness.
- **Structured pipeline** calls the same helper after fetching the shared steps once and collecting per-combo preambles from shards.
- **Compiler/renderer** expands a `FeedbackBundle` into full `FeedbackContent` blocks only when needed (e.g., XML rendering, widget collection), ensuring no downstream system needs to understand the new format deeply.

## Authoring Shape Adjustments

- `AuthoringNestedLeaf` now carries `{ preamble: FeedbackPreamble }` instead of `content`.
- `buildEmptyNestedFeedback` seeds each leaf with an empty preamble, not empty steps/solution.
- `convertAuthoringFeedbackToBundle` hydrates the bundle: it reads `shared` once (from the top-level authoring object) and then applies each leaf preamble, yielding canonical blocks for the compiler. Legacy code that expects `Record<string, FeedbackContent>` keeps working, but the source of truth remains the bundle.
- Manual templates replace per-choice `FeedbackContent` builders with a single `shared` block plus a literal `preambles` object, passed to `createFeedbackBundle`.

## Structured Pipeline Updates

1. **Plan phase**: run the existing cartesian builder (now with binary treatment for non-enumerated dimensions) to get the full combination list.
2. **Shared pedagogy call**: a single model call produces the `shared` section. It is cached or persisted for retries.
3. **Shard calls**: each combination request asks only for the preamble text. The schema for shards becomes:

	```ts
	type FeedbackPreambleShard<E extends readonly string[]> = {
		preamble: FeedbackPreamble<E>
	}
	```

4. **Assembly**: after collecting all preamble shards, call `createFeedbackBundle(plan, shared, map)`. Any missing shard triggers a structured retry before we attempt to compile.

## Enforcement Summary

- **Compile-time**: `Record<FeedbackCombinationId<P>, FeedbackPreamble<E>>` requires authors to enumerate every combination ID when the plan is a literal `const`.
- **Runtime**: `createFeedbackBundle` throws if there are missing or extra preambles, closing any gap left by widened type parameters.
- **Downstream**: only the renderer converts `FeedbackBundle` → `FeedbackContent`, so legacy consumers stay unchanged while new code avoids duplication.
- **Zero tech debt**: partial migrations or compatibility shims are explicitly out of scope. Any remaining call sites that expect the old structure must be rewritten or deleted during the transition.

## Implementation Roadmap

1. Add the new type aliases (`FeedbackCombinationId`, `FeedbackSharedPedagogy`, `FeedbackBundle`) and the helper `createFeedbackBundle`.
2. Update `FeedbackPlan` builder to treat all non-enumerated dimensions as `{ kind: "enumerated"; keys: ["CORRECT", "INCORRECT"] }` so every plan is cartesian.
3. Evolve authoring schemas and nested authoring types to carry `preamble` leaves and a top-level `shared`.
4. Adjust structured prompts, validator schemas, and collectors to use the bundle semantics.
5. Rewrite manual templates to the new helper pattern.
6. Update compiler + runtime rendering so they expand bundles into `FeedbackContent` on demand.
7. Refresh fixtures/tests to exercise the helper and ensure missing keys are caught early.

## Open Questions

- **Template ergonomics**: should we expose a thin `defineFeedback` helper that combines plan construction, shared pedagogy declaration, and bundle creation to reduce boilerplate?
- **Detection tooling**: do we want lint rules to flag repeated `steps`/`solution` arrays in templates as a migration aid?
- **Partial retries**: the structured pipeline retrier should understand that only preambles can be regenerated; we need to finish the story on how those retries merge with an existing `FeedbackBundle`.

With these changes, the types stay approachable for AI-generated code, authors cannot omit or duplicate branches, and we stop burning tokens on redundant pedagogy while keeping the compiler’s expectations tight.

## Why the Fallback Branch Must Disappear

Today we bifurcate plans into `"combo"` versus `"fallback"` modes. Fallback gets triggered whenever a dimension isn't explicitly enumerated, forcing the rest of the stack to branch on that flag. This design backfires in several ways:

- **Type divergence**: In fallback mode everything contracts to a two-key object (`CORRECT`/`INCORRECT`). Everywhere else (`combo`) expects the full cartesian map. Every schema, helper, and template has to special-case both paths, doubling the surface area for bugs.
- **LLM confusion**: The model has to learn two shapes. For items like [`fraction-addition.ts`](src/templates/prompts/examples/positive/templates/fraction-addition.ts) it already struggles to maintain the duplicated `steps` array for each choice (e.g. lines 343-1113), but fallback adds yet another "if/else" branch the AI could misapply.
- **Complex runtime logic**: `convertAuthoringFeedbackToBundle`, `buildEmptyNestedFeedback`, and the compiler each maintain fallback-specific validation. This leads to code like the "leaf node found at root" guard, making the authoring pipeline harder to reason about.
- **Binary plans aren't special**: Most "fallback" situations are effectively binary correctness checks. Declaring them as `"enumerated"` with keys `["CORRECT", "INCORRECT"]` produces the same behavior without hidden branches. The plan still enumerates two combos; only the type story simplifies.

By treating every dimension uniformly—either enumerated keys provided by the interaction or the canonical `["CORRECT", "INCORRECT"]`—we collapse the branch. The plan builder still captures the correct metadata, but all downstream code now works with a single shape. No more `isFallbackPlan` conditionals.

## Why Preambles Must Be a Map, Not an Array

It’s tempting to store preambles as an array of `{ id, preamble }` pairs or rely on order, but that breaks our enforcement story:

- **Key coverage**: An array can omit a combination silently. With `Record<FeedbackCombinationId<P>, FeedbackPreamble<E>>` the type checker flags missing literal keys when the plan is `as const`.
- **Runtime validation**: Our `createFeedbackBundle` helper can compare the plan’s combination ID set against the map’s keys. Arrays require O(n²) scans or conversion back into a map before validation.
- **Authoring ergonomics**: Templates like [`fraction-addition.ts`](src/templates/prompts/examples/positive/templates/fraction-addition.ts) currently collapse into a giant `Object.fromEntries` because the array-based pattern offers no structure. A literal object keyed by the combination IDs is easier to read, diff, and lint—the duplication problem in that template is a direct consequence of the array-first mindset.
- **LLM determinism**: Asking the AI to produce a keyed object with known property names leads to much cleaner generations. When forced to emit arrays, we’ve seen models reorder entries or skip IDs, which then cascade into missing feedback at runtime.

Keeping `preambles` as a strict object map is the only way to encode the cartesian coverage rule in both TypeScript and runtime verification.

## FeedbackPlan Stays the Same

We do **not** need to redesign `FeedbackPlan`. It already carries everything we need:

```ts
export type FeedbackPlan = {
	mode: "combo" | "fallback"
	dimensions: FeedbackDimension[]
	combinations: FeedbackCombination[]
}
```

- The combinations array is the authoritative list of cartesian IDs. That is exactly what the bundle uses for its key space.
- For ergonomics we can normalize binary dimensions to mimic enumerated ones:

	```ts
	type EnumeratedDim<K extends readonly string[]> = {
		responseIdentifier: string
		kind: "enumerated"
		keys: K
	}

	type BinaryDim = EnumeratedDim<readonly ["CORRECT", "INCORRECT"]>
	```

	This tweak removes the `"fallback"` branch without changing how `combinations` are stored.

- `FeedbackPlan` remains the structural metadata; no feedback content lives on the plan.

## Bundles Replace Repetition

Instead of storing a full `FeedbackContent` per combination, authors produce:

```ts
type FeedbackBundle<P extends FeedbackPlan, E extends readonly string[]> = {
	shared: FeedbackSharedPedagogy<E>
	preambles: Record<FeedbackCombinationId<P>, FeedbackPreamble<E>>
}
```

- `shared` contains the single copy of steps/solution.
- `preambles` provides verdict/summary for every combination enumerated in the plan.

Whenever legacy code needs a materialized `FeedbackContent`, we expand on demand:

```ts
export function expandBundleEntry<
	P extends FeedbackPlan,
	E extends readonly string[]
>(bundle: FeedbackBundle<P, E>, id: FeedbackCombinationId<P>): FeedbackContent<E> {
	const preamble = bundle.preambles[id]
	if (!preamble) throw errors.new(`missing preamble for ${id}`)
	return {
		preamble,
		steps: bundle.shared.steps,
		solution: bundle.shared.solution
	}
}
```

- The compiler, renderer, and collectors call `expandBundleEntry` (or its batched variant) when they need the legacy `FeedbackContent` shape.
- Authors never recreate steps per combination, because the bundle type leaves them nowhere to put those duplicates.

**Bottom line:** `FeedbackPlan` continues to model structure; `FeedbackBundle` models content. The link between them is the combination ID union enforced at the type level and double-checked by `createFeedbackBundle`.

## No Backwards Compatibility Policy

This migration intentionally removes the old per-combination `FeedbackContent` model outright:

- We will not ship adapters, toggles, or environment flags. Once the bundle lands, the old path is gone.
- Any remaining code that consumes `Record<string, FeedbackContent>` must be ported immediately to call `expandBundleEntry` (or equivalent) or deleted.
- Tests, fixtures, templates, and structured prompts that still emit the legacy shape must fail CI; keeping them alive prolongs confusion.
- Documentation will be updated in lockstep. Contributors should treat references to the retired shape as dead links to be cleaned up, not maintained.

This strict stance keeps the codebase free of dual logic and ensures the new constraints stay easy to reason about long term.
