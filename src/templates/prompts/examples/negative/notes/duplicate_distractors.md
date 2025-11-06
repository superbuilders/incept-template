### Why this is wrong
- The prefill loop only `pushIfValid` values that are distinct from the correct answer.
- When it runs out of candidates, the fallback branch synthesises a value via modulo arithmetic without checking for duplicates.
- In this example the fallback produces `2`, which already exists in `candidateCounts`; two choices now point at indistinguishable widgets.
- Learners see duplicate distractors and we lose coverage of the intended misconceptions.

### Fix
- Reuse the same uniqueness guard for fallback values (loop until `pushIfValid` succeeds).
- Alternatively, derive the remaining counts from a vetted pool that is filtered against `candidateCounts` before insertion.
