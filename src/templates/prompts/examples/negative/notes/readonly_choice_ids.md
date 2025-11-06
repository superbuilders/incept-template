### Why this is wrong
- Using `as const` on the choice identifier array narrows it to a readonly tuple.
- APIs such as the feedback plan expect a mutable `string[]` for `keys`.
- TypeScript then reports `readonly ["A", "B", "C", "D"]` is not assignable to `string[]`.

### Fix
- Declare the identifiers as a plain array (e.g., `const choiceIds: string[] = ["A", "B", "C", "D"]`).
- Alternatively, spread into a new array before passing (`[...choiceIds]`), but the simplest fix is to avoid `as const` for arrays that need to flow into mutable consumers.
