export const SEED_GUIDANCE_SECTION = `### SEED_GUIDANCE
<seed_guidance>
1. Instantiate \`const random = createSeededRandom(seed)\` at the top of \`generateTemplate\`.
2. Use helper methods such as \`random.nextInt\`, \`random.nextBoolean\`, and \`random.next()\` to derive numbers, phrase variants, and branching logic.
3. Drive every computed value that can vary between runs (numbers, textual adjectives, order of distractors) from the \`random\` instance.
4. Never discard or ignore the seed. Any template that does not call a method on \`random\` is unacceptable.
</seed_guidance>`
