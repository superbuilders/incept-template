export const FEEDBACK_PLAN_GUARDRAILS_SECTION = `### FEEDBACK_PLAN_GUARDRAILS
<feedback_plan_guardrails>
- **Combination IDs:** Use the keyspace enforced by \`FeedbackCombinationIdentifier\`: \`FB__{ChoiceIdentifier}(__{ChoiceIdentifier})*\`. Stick to concise segments such as \`FB__A\`, \`FB__A_B\`, \`FB__C_D_E\`. Avoid prose names like \`FB__ALL_CORRECT\`.
- **Path Coverage:** Each combination path must include one segment per dimension in the declared order. Binary dimensions only admit \`CORRECT\` or \`INCORRECT\`; enumerated dimensions must use one of their declared keys.
- **Cross-References:** Make sure every identifier used in combination paths matches a dimension declared in \`feedbackPlan.dimensions\` and the corresponding interaction response identifier.
</feedback_plan_guardrails>`
