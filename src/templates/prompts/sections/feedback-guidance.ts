type PreambleExample = {
	id: string
	bad: string
	good: string
	reason: string
}

const renderPreambleExample = (example: PreambleExample): string => {
	const indent = "  "
	const wrap = (tag: string, value: string) =>
		`${indent.repeat(2)}<${tag}>${value}</${tag}>`
	return [
		`${indent}<example id="${example.id}">`,
		wrap("bad", example.bad),
		wrap("good", example.good),
		wrap("reason", example.reason),
		`${indent}</example>`
	].join("\n")
}

const PREAMBLE_EXAMPLES: readonly PreambleExample[] = [
	{
		id: "proofy-benchmark",
		bad: "You chose Less than 1/2. Compare the decimals: 0.47 < 0.50, so the model is smaller.",
		good: "You chose Less than 1/2. You converted <mfrac><mn>47</mn><mn>100</mn></mfrac> to 0.47 and compared it to 0.50 to justify the benchmark, which matches the statement.",
		reason: "Bad version re-proves the inequality instead of naming the learner’s benchmark method."
	},
	{
		id: "proofy-cross-multiply",
		bad: "You chose 3/8. Cross-multiply: 3×12 = 36 and 5×8 = 40, so 3/8 is smaller.",
		good: "You chose <mfrac><mn>3</mn><mn>8</mn></mfrac>. You cross-multiplied 3×12 and 5×8 to compare, which matches the rule for testing smaller fractions.",
		reason: "Bad version lists cross-products to prove the final inequality. Good version names the cross-multiplication step the learner used."
	},
	{
		id: "proofy-equality",
		bad: "You chose 4/6. Simplify to 2/3, and 2/3 = 8/12, so it equals the model.",
		good: "You chose <mfrac><mn>4</mn><mn>6</mn></mfrac>. You simplified it straight to <mfrac><mn>2</mn><mn>3</mn></mfrac>, so your step treats it as equal to the model.",
		reason: "Bad version replays the simplification as a proof; good version highlights the learner’s simplification move."
	},
	{
		id: "baseline-fixed-expense",
		bad: "One category is fixed. Look again.",
		good:
			"You chose **Internet** with **Groceries**. You treated Internet as fixed because it stays <mo>$</mo><mn>120</mn> each month, so that reasoning matches the fixed-expense rule.",
		reason:
			"Bad version names nothing. Good version states the selections, cites the repeated <mo>$</mo><mn>120</mn>, and ties it to the fixed-expense rule."
	},
	{
		id: "correct-coins",
		bad: "You selected <mo>$</mo><mn>31.47</mn>. Check the subtraction again.",
		good:
			"You selected <mo>$</mo><mn>31.47</mn>. You subtracted <mo>$</mo><mn>56.82</mn> − <mo>$</mo><mn>25.35</mn> to confirm <mo>$</mo><mn>31.47</mn>, so your regrouping aligns with the item.",
		reason:
			"Bad version dismisses the answer without evidence. Good version quotes the computation that confirms the learner’s choice."
	},
	{
		id: "incorrect-coins",
		bad: "Your answer is off because you forgot to borrow.",
		good:
			"You selected <mo>$</mo><mn>52.11</mn>. You subtracted <mn>43</mn> − <mn>58</mn> without borrowing 1 dollar, so the regrouping step was skipped.",
		reason:
			"Bad version is vague. Good version names the selection, the faulty subtraction, and the regrouping rule that fixes it."
	},
	{
		id: "fraction-between-quarter-third",
		bad:
			"You selected Between 1/4 and 1/3 of the cookies are left. The amounts given are 5/12 and 2/4, which in 12ths are 5/12 and 6/12. Total given: 11/12; remainder: 1/12. In the same units, 1/4 is 3/12 and 1/3 is 4/12. But 1/12 is not above 3/12, so it is not between 1/4 and 1/3.",
		good:
			"You chose \"Between 1/4 and 1/3 of the cookies are left.\" You tried to set <mfrac><mn>1</mn><mn>12</mn></mfrac> between those benchmarks even though your comparison kept it below <mfrac><mn>1</mn><mn>4</mn></mfrac>.",
		reason:
			"Bad version replays every conversion. Good version cites the precise comparison that overturns the claim."
	},
	{
		id: "fraction-between-third-threequarters",
		bad:
			"You selected Between 1/3 and 3/4 of the cookies are left. The amounts given are 5/12 and 2/4, which in 12ths are 5/12 and 6/12. Total given: 11/12; remainder: 1/12. Convert the benchmarks: 1/3 is 4/12. 3/4 is 9/12. The value 1/12 is not greater than 4/12, so it does not fall between 1/3 and 3/4.",
		good:
			"You chose \"Between 1/3 and 3/4 of the cookies are left.\" You compared <mfrac><mn>1</mn><mn>12</mn></mfrac> to both benchmarks but never raised it above <mfrac><mn>1</mn><mn>3</mn></mfrac>, so the interval check cannot succeed.",
		reason:
			"Bad version floods the learner with conversions. Good version pinpoints the benchmark mismatch."
	},
	{
		id: "fraction-less-than-quarter",
		bad:
			"You selected Less than 1/4 of the cookies are left. The amounts given are 5/12 and 2/4, which in 12ths are 5/12 and 6/12. Total given: 11/12; remainder: 1/12. In the same units, 1/4 is 3/12 and Here 1/12 < 3/12, so the remainder is less than 1/4.",
		good:
			"You chose \"Less than 1/4 of the cookies are left.\" You compared the remainder <mfrac><mn>1</mn><mn>12</mn></mfrac> to <mfrac><mn>1</mn><mn>4</mn></mfrac> and noted it was smaller, so that benchmark check supports the statement.",
		reason:
			"Bad version relitigates the entire solution even though the learner was correct. Good version validates with the key inequality."
	},
	{
		id: "fraction-more-than-threequarters",
		bad:
			"You selected More than 3/4 of the cookies are left. The amounts given are 5/12 and 2/4, which in 12ths are 5/12 and 6/12. Total given: 11/12; remainder: 1/12. 3/4 is 9/12. But 1/12 is not greater than 9/12, so it is not above 3/4.",
		good:
			"You chose \"More than 3/4 of the cookies are left.\" You compared <mfrac><mn>1</mn><mn>12</mn></mfrac> to the <mfrac><mn>3</mn><mn>4</mn></mfrac> benchmark but treated the smaller remainder as larger, so the benchmark reasoning breaks.",
		reason:
			"Bad version narrates every arithmetic step. Good version contrasts the selection with the decisive benchmark."
	},
	{
		id: "fraction-model-equal",
		bad: "You chose <mfrac><mn>10</mn><mn>24</mn></mfrac>, and the products match: <mn>10</mn><mo>×</mo><mn>12</mn><mo>=</mo><mn>120</mn> and <mn>5</mn><mo>×</mo><mn>24</mn><mo>=</mo><mn>120</mn>. That makes it equal to the model <mfrac><mn>5</mn><mn>12</mn></mfrac>, not smaller.",
		good:
			"You chose <mfrac><mn>10</mn><mn>24</mn></mfrac>. You simplified it straight to <mfrac><mn>5</mn><mn>12</mn></mfrac>, so your method equated the model instead of staying smaller.",
		reason: "Bad version drags the learner through both cross-products; good version names the choice, states the simplification, and explains why it fails in a single line."
	},
	{
		id: "parents-double-count-parentheses",
		bad:
			"You selected p = 191 + 12 + 219 and p = 219 − (191 + 12). The subtraction form evaluates to p = 219 − (191 + 12) = 219 − 203 = 16, but the other adds the known groups to the total: p = 191 + 12 + 219 becomes 191 + 12 + 219 = 422, which double-counts people. Parents are the rest, so subtract the students and teachers from the total.",
		good:
			"You chose p = 191 + 12 + 219 with p = 219 − (191 + 12). You added the known groups to the total, so that setup double-counts people before isolating parents.",
		reason:
			"Bad version solves the problem inside the preamble. Good version names the chosen equations and pinpoints the overcount."
	},
	{
		id: "parents-double-count-linear",
		bad:
			"You selected p = 191 + 12 + 219 and p = 219 − 191 − 12. The subtraction form evaluates to p = 219 − 191 − 12 = 16, but the other adds the known groups to the total: p = 191 + 12 + 219 becomes 191 + 12 + 219 = 422, which double-counts people. Parents are the rest, so subtract the students and teachers from the total.",
		good:
			'You chose "p = 191 + 12 + 219" with "p = 219 − 191 − 12". You repeated the addition of known groups to the total, so that structure double-counts people instead of leaving parents.',
		reason:
			"Bad version runs every computation and issues instructions. Good version isolates the structural error in one sentence."
	},
	{
		id: "variable-expenses-placeholder",
		bad:
			"One category you selected does not match the changing pattern. Compare with the variable rows: \${var1Label} → \${var1Math} and \${var2Label} → \${var2Math}.",
		good:
			"You chose Utilities with Groceries. You paired Utilities—which stays the same each month—with a changing row, so the variable-expense rule is not met.",
		reason:
			"Bad version hides the learner’s selections behind placeholders and cites no evidence. Good version names the choices and explains the mismatch."
	}
] as const

const PREAMBLE_EXAMPLES_SECTION = `### PREAMBLE_EXAMPLES
<examples type="preamble">
${PREAMBLE_EXAMPLES.map((example) => renderPreambleExample(example)).join("\n")}
</examples>`

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
- STATE THE LEARNER’S SELECTION FIRST. Say “You chose …” and repeat the exact numbers or expressions they picked—no placeholders, no letter names.
- CALL OUT THE EXACT MOVE THEY MADE OR SKIPPED. Describe the operation, assumption, or comparison that produced the answer (e.g., “You added the known groups to the total” or “You treated the remainder as larger than the 1/4 benchmark”). Focus on the learner’s reasoning, not the final answer.
- CLOSE WITH THE RULE THAT INTERPRETS THAT MOVE. One clause that ties the cited action to correctness (“…so it stays fixed,” “…so it equals the model,” “…so it cannot be smaller”).
- ABSOLUTE BAN: DO NOT restate the final answer, replay solution steps, hint at other choices, or offer next moves. The preamble delivers the diagnosis only; the steps section handles instruction.
- **DO NOT PROVE OR ARGUE THE RESULT.** The preamble names the learner’s action and the rule it violates or satisfies; any “because 48 < 60” or “this shows it’s too big” proof belongs in the steps.
- **HARD RULE:** IF THE PREAMBLE RESTATES THE FINAL ANSWER, REPLAYS THE SOLUTION STEPS, OR OTHERWISE TEACHES THE PROCEDURE, IT FAILS REVIEW. THAT INSTRUCTION BELONGS IN THE STEP-BY-STEP FEEDBACK, NEVER THE PREAMBLE.

**Preamble Checklist — fail any item and the feedback is rejected**
1. EXACTLY WHAT THE LEARNER CHOSE.
2. THE SPECIFIC ACTION THEY TOOK (OR OMITTED) THAT CREATED THE OUTCOME.
3. THE RULE-BASED CONCLUSION (“…so it’s fixed/greater/equal/etc.”).

Anything beyond those three sentences is disallowed. If it teaches, advises, solves, argues the numerical result, or merely states “that’s wrong,” move it to the steps.

${PREAMBLE_EXAMPLES_SECTION}

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
