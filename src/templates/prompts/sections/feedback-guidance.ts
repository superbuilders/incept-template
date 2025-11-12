export const FEEDBACK_GUIDANCE_SECTION = `### FEEDBACK_POLICY
<feedback>
#### Why Feedback Matters
- Our feedback is a scaffolded tutoring experience, not a grade. It must diagnose the learner’s exact misunderstanding, demonstrate the correct reasoning step-by-step, and land on a clear, confidence-building conclusion.
- Every response must be data-driven: reference computed values, the learner’s actual selection, and the item’s structure. Never guess or invent context.
- Feedback must always be safe to shuffle, resilient to format changes, and reusable as a standalone worked example.

#### Mission: Teach the Solution
- Feedback must communicate the complete solving procedure with precision. Every sentence should push the learner toward reconstructing the method, not drift into generic study-habit chatter.
- Filler instructions like "reflect," "sanity check," or "double-check" are the hallmark of watered-down platforms that bury the math. They waste working memory, erode trust, and break the replay value of the template.
- Allowing filler steps obliterates the educational value of the item: the learner walks away with vague pep talk instead of the algorithm, and the question fails its purpose.
- This is not a journaling or self-reflection exercise—it is a scripted walk through the correct procedure. Anything less than that clarity is malpractice.
- Replace that noise with computation: each line of feedback should expose a concrete numerical or symbolic move so the learner can replay the exact reasoning.
- Treat the feedback as the canonical answer key delivered aloud. If a line does not measurably advance the solution, it does not belong.

#### Preamble: Diagnose the Outcome
- Open every preamble with the learner’s exact selections (“You chose **Internet** and **Utilities** …”). No placeholders, no coy references to “one category.”
- In the very next clause, restate the specific evidence that makes the selection right or wrong. Quote the key numbers, symbols, or structural facts from the item (e.g., “Internet stays <mo>$</mo><mn>120</mn> each month”).
- Close with the rule that interprets that evidence (“…so it’s fixed and cannot be a variable expense”). One clear sentence is enough; do not relitigate the entire solution in the preamble.
- Never echo verdict words (“Correct!”, “Not quite!”) or fluff (“Look again”). The preamble is a targeted reminder of what was chosen and why it succeeds or fails.

**Preamble Checklist — fail any item and the feedback is rejected**
1. **Exactly what the learner chose** (values drawn from the interaction parameters).
2. **The concrete evidence** (the numbers, expressions, or structure pulled from those same parameters).
3. **The rule-based conclusion** matching that evidence to correctness.

**Bad preamble**
“One category is fixed. Look again.”

**Good preamble**
“You chose **Internet** with **Groceries**. Internet keeps <mo>$</mo><mn>120</mn> in September, October, and November, so it is fixed—variable expenses are the rows whose amounts change.”

#### Steps: Three Actionable Moves

- Provide **at least three high-impact steps** unless the schema demands more. Each step should advance the learner from misconception to mastery (e.g., *Match the denominators*, *Rewrite each fraction*, *Add and simplify*).
- Step titles must be short, imperative phrases that describe the action, not the error (“Align the denominators” not “Why this is wrong”).
- The steps section is strictly the straightest path to solve the problem—describe the required computations in sequence without detours, reflections, or study-skills filler.
- ABSOLUTE BAN: if a step does not produce a necessary intermediate computation or transformation, it is prohibited. "Check your work," "Reflect on your answer," and similar filler instantly fail review.
- Step content must interleave narration and MathML:
  - Begin with 'text' snippets that explain *why* the action matters.
  - Embed MathML fragments ('<mn>', '<mfrac>', '<mo>'…) that show the precise computation.
- Example: [ { "type": "text", "content": "Convert the first fraction: " }, { "type": "math", "mathml": "<mfrac><mn>1</mn><mn>6</mn></mfrac><mo>=</mo><mfrac><mn>2</mn><mn>12</mn></mfrac>" } ]
- Keep each step singular in purpose. Avoid lumping multiple operations or narrating the entire solution inside a single step.

#### Pedagogy: Steps Teach the Procedure

- Drive the learner through the actual solution path: each step should compute a concrete intermediate result that moves directly toward the answer.
- Keep the story linear—identify the quantities in play, transform them with the required operation, then carry the result forward.
- Ban filler: no “sanity checks,” “reflect,” or “study tip” language. If a verification is essential, weave it into the computation (e.g., regrouping before subtraction) rather than tacking on a reminder.
- Use seeded values and MathML to show exactly what changes from one step to the next so the learner sees the full worked example.

#### Solution Box: Reveal and Celebrate

- Do not add extra sentences, new teaching content, or additional coaching; the steps have already covered the explanation.

#### Tone, Voice, and Safety

- Write like an encouraging coach: warm, specific, never patronising. Acknowledge effort (“Great job aligning the pieces—now just simplify.”).
- Stay shuffle-safe. Refer to choices by their mathematical content or the learner’s action, never by letter or position.
- Keep language inclusive and clear; avoid idioms or overly casual remarks.

#### Technical Requirements

- Use only the allowed feedback inline types: 'text', 'math', and 'inlineWidgetRef' when explicitly supported. No inline interactions or gaps.
- Math must always be MathML. Do not emit TeX, plain ASCII math, or raw HTML entities.
- Ensure widget references in feedback ('widgetRef') exist in the assessment item; orphaned refs break compilation.
- Keep JSON tidy and deterministic—no random phrasing or layout differences between runs.

#### Common Failure Modes (Avoid These)

- Step titles that restate the error ("Why this is wrong"), offer no action ("State the final result"), or repeat the final answer.
- Walls of text without MathML, or MathML with no explanatory text.
- Ignoring the learner's actual selection or miscomputing the correct value.
- Steps that drift into meta-advice ("Sanity-check your work", "Reflect on your answer") instead of advancing the calculation—this filler destroys the instructional value and triggers automatic rejection.

#### Quick Checklist Before Emitting Feedback

1. **Preamble** names the exact misconception or confirms success without verdict words.
2. **At least three steps** each deliver one concrete action, with interleaved text and MathML, and keep the learner moving through the actual computations—zero filler tolerated.
3. **Solution box** reveals the answer with MathML and an encouraging wrap-up.
4. Tone is supportive, shuffle-safe, and references computed values.
5. JSON validates against the schema and uses only approved content types.

Follow these rules rigorously—great feedback is as important as a great interaction.
</feedback>`
