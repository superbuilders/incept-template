# Core Feedback Tightening Follow-up

## Why this addendum exists

We tightened the feedback bundle pipeline, but a few remaining defaults still let plans or widget tuples widen silently. Before migrating `src/structured` or `src/templates`, we should finish locking down core/compiler typing so literal plans stay literal and runtime guardrails stay explicit.

## Remaining gaps

- **Fallback generics in content types**  
  `src/core/content/types.ts` still exposes defaults such as `InlineContent<E extends readonly string[] = readonly string[]>` and `FeedbackSharedPedagogy<E extends readonly string[] = readonly string[]>`. When call sites omit the widget tuple, TypeScript widens it back to `string[]`, undermining the compile‑time guarantee we just restored.
- **Item & authoring aliases mirror the same defaults**  
  `AssessmentItem`, `AssessmentItemInput`, and the authoring helpers (`src/core/item/types.ts`, `src/core/feedback/authoring/types.ts`) also default the widget tuple. The compiler currently relies on those defaults in a handful of places.
- **Docs lag the implemented design**  
  `docs/static-feedback-plan-enforcement-proposal.md` still describes a branded-plan system we deliberately abandoned in favour of literal plans + Zod coverage. Leaving it untouched invites regressions.

## Proposed actions

1. **Remove generic defaults across core types**  
   - Update all content/feedback/item type aliases to require an explicit widget tuple.  
   - Fix compiler call sites (`src/compiler/compiler.ts`, `src/compiler/content-renderer.ts`, tests) by threading `E` through explicitly.  
   - Re-run `bun typecheck` to confirm no implicit widenings remain.
2. **Refresh documentation**  
   - Rewrite `docs/static-feedback-plan-enforcement-proposal.md` to explain the current literal-plan + Zod strategy and note that structured/runtime plans keep runtime validation.  
   - Cross-link this follow-up so future migrations know the intended path.
3. **(Optional) add a literal helper**  
   Provide a tiny `defineFeedbackPlan` passthrough in `src/core/feedback/plan` that simply preserves literal inference. This keeps template code DRY when we migrate them later, but it must not widen the types or reintroduce branding.

Once these are done, the core/compiler surface will be ready for the larger structured/template migration without reopening the door to widened plans or widget tuples.
