### Why this is wrong
- Prompt fragments are concatenated directly by the player—no extra whitespace is inserted.
- The follow-up instruction `"Select one answer."` lacks a leading space, so
  learners see `"wording.Select one answer."`.

### Fix
- Include intentional spacing in the second fragment (e.g., `" Select one answer."`) or
  wrap both sentences inside a single text node so punctuation and spacing render correctly.
