## Why this template is harmful

### Filler masquerading as a step
- `shared.steps[2]` is titled `"Sanity-check your result"` and never performs math—exactly the filler we ban in `### FEEDBACK_POLICY → Steps: Three Actionable Moves`.
- The copy burns two paragraphs on “your answer should be less than … add your result to the cost,” but the computation is already done; the learner needed the final subtraction, not cheerleading.
- Because the solution block still states the answer, this “step” contributes nothing toward solving the problem and destroys the throughline from inputs to final result.

### Overstuffed steps instead of real sequencing
- `shared.steps[0].content` runs through counting bills, converting dimes, converting pennies, and announcing the starting total—four distinct operations welded into one blob because the author refused to write more than three steps.
- `shared.steps[1].content` mixes writing the subtraction, handling the borrow, and explaining regrouping all at once. The template author clearly needed a separate “Regroup the dollars and cents” step but hid it inside prose.
- Our feedback plan allows any number of steps; clinging to the minimum of three means learners never see a clean ladder from start to finish.

### Vague, non-diagnostic preambles
- `preambles.FB__D.summary` says the learner “treats the cents as 37−78 without regrouping” without naming the actual digits they should compare (e.g., 37 cents vs. 78 cents, needing to swap a dollar). Reviewers and students have to guess the intended arithmetic.
- `preambles.FB__C.summary` claims “coins were swapped” but never states that the learner treated each dime as \$0.01 and each penny as \$0.10. We demand explicit identification of the misvalued coins.
- Even the “correct” branch hides the numbers behind variable names—if the purpose is diagnosis, we have to surface the concrete values produced by the seed.
