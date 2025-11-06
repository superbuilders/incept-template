export const FEEDBACK_GUIDANCE_SECTION = `### FEEDBACK_POLICY
<feedback>
#### Why Feedback Matters
- Our feedback is a scaffolded tutoring experience, not a grade. It must diagnose the learner’s exact misunderstanding, demonstrate the correct reasoning step-by-step, and land on a clear, confidence-building conclusion.
- Every response must be data-driven: reference computed values, the learner’s actual selection, and the item’s structure. Never guess or invent context.
- Feedback must always be safe to shuffle, resilient to format changes, and reusable as a standalone worked example.

#### Preamble: Diagnose the Outcome
- Call out the learner’s exact choice or computation using the values supplied by the feedback block parameters (e.g., “You chose the fraction whose numerator is <mn>5</mn>, but the correct numerator is <mn>7</mn>.”).
- State why that selection is incorrect or correct by referencing the underlying principle (“Adding the denominators <mn>6</mn> and <mn>4</mn> changed each part’s size.”).
- Keep it focused: 1–2 sentences that set up the steps to come and never echo the verdict (“Correct!”, “Not quite!”).

- #### Steps: Three Actionable Moves
- Provide **exactly three high-impact steps** unless the schema demands more. Each step should advance the learner from misconception to mastery (e.g., *Match the denominators*, *Rewrite each fraction*, *Add and simplify*).
- Step titles must be short, imperative phrases that describe the action, not the error (“Align the denominators” not “Why this is wrong”).
- Step content must interleave narration and MathML:
  - Begin with 'text' snippets that explain *why* the action matters.
  - Embed MathML fragments ('<mn>', '<mfrac>', '<mo>'…) that show the precise computation.
- Example: [ { "type": "text", "content": "Convert the first fraction: " }, { "type": "math", "mathml": "<mfrac><mn>1</mn><mn>6</mn></mfrac><mo>=</mo><mfrac><mn>2</mn><mn>12</mn></mfrac>" } ]
- Keep each step singular in purpose. Avoid lumping multiple operations or narrating the entire solution inside a single step.
- **Never reveal the final answer inside steps.** If the computation naturally reaches it, stop short (“Now evaluate this expression yourself.”).

- #### Solution Box: Reveal and Celebrate
- The 'solution' block is the only place the final answer belongs. State it cleanly with MathML ('<mfrac>', '<mn>', etc.) in one crisp sentence—e.g., “Therefore, the correct sum is <mfrac>…</mfrac>.”
- Do not add extra sentences, new teaching content, or additional coaching; the steps have already covered the explanation.

#### Tone, Voice, and Safety
- Write like an encouraging coach: warm, specific, never patronising. Acknowledge effort (“Great job aligning the pieces—now just simplify.”).
- Stay shuffle-safe. Refer to choices by their mathematical content or the learner’s action, never by letter or position.
- Keep language inclusive and clear; avoid idioms or overly casual remarks.

- #### Technical Requirements
- Use only the allowed feedback inline types: 'text', 'math', and 'inlineWidgetRef' when explicitly supported. No inline interactions or gaps.
- Math must always be MathML. Do not emit TeX, plain ASCII math, or raw HTML entities.
- Ensure widget references in feedback ('widgetRef') exist in the assessment item; orphaned refs break compilation.
- Keep JSON tidy and deterministic—no random phrasing or layout differences between runs.

#### Common Failure Modes (Avoid These)
- Step titles that restate the error (“Why this is wrong”), offer no action (“State the final result”), or repeat the final answer.
- Walls of text without MathML, or MathML with no explanatory text.
- Jumping straight to the final answer in the steps, leaving nothing for the solution box.
- Ignoring the learner’s actual selection or miscomputing the correct value.

#### Quick Checklist Before Emitting Feedback
1. **Preamble** names the exact misconception or confirms success without verdict words.
2. **Three steps** each deliver one concrete action, with interleaved text and MathML, and stop short of the final answer.
3. **Solution box** reveals the answer with MathML and an encouraging wrap-up.
4. Tone is supportive, shuffle-safe, and references computed values.
5. JSON validates against the schema and uses only approved content types.

Follow these rules rigorously—great feedback is as important as a great interaction.
</feedback>`
