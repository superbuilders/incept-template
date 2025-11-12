export const FEEDBACK_DIMENSION_SELECTION_SECTION = `### FEEDBACK_DIMENSION_SELECTION
<feedback_dimensions>
- **Multi-select interactions** (\`choiceInteraction\` with \`cardinality: "multiple"\`, drag/drop sets, ordering that records several identifiers): derive a \`CombinationFeedbackDimension\`. Use the interaction's concrete \`minChoices\` / \`maxChoices\` (or inferred bounds) and the literal choice identifiers. Materialise the complete keyspace—every admissible selection string must appear in \`keys\`.
- **Dropdowns / inline choices with a single selection and more than two options** (\`inlineChoiceInteraction\`, single-select \`choiceInteraction\`): author an \`EnumeratedFeedbackDimension\` whose \`keys\` exactly match the interaction identifiers in their declared order.
- **Binary verdicts** (true/false, yes/no, correct/incorrect toggles, unenumerated numeric or text responses graded as right/wrong): use a \`BinaryFeedbackDimension\`. These paths always branch on \`CORRECT\` vs. \`INCORRECT\`.
- **Two-option dropdowns**: choose the dimension that matches the pedagogy—pick \`BinaryFeedbackDimension\` for yes/no style judgments; stick with \`EnumeratedFeedbackDimension\` if each option needs bespoke feedback.
- **Free-response fields**: unless you can cite multiple graded categories, default to a binary dimension keyed by correctness; do not fake enumerated keys when the runtime only emits correct/incorrect.
- Always align \`feedbackPlan.dimensions[*].responseIdentifier\` with the corresponding interaction and keep the dimension order consistent with the combination paths. When in doubt, inspect the interaction's \`cardinality\` and allowed answer space before selecting the dimension type.
</feedback_dimensions>`
