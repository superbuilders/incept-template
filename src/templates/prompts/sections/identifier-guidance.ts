export const IDENTIFIER_GUIDANCE_SECTION = `### IDENTIFIER_POLICY
<identifiers>
- **Response Identifiers:** Every interaction response identifier **must** start with \`RESPONSE\`. Examples: \`RESPONSE_A\`, \`RESPONSE_DROP_1\`.
- **Feedback Plan:** The \`feedbackPlan.dimensions[*].responseIdentifier\` values must exactly match the interaction response identifiers and follow the same \`RESPONSE\` prefix rule.
- **Consistency:** When referencing these identifiers anywhere (interactions, response declarations, feedback paths), use the exact same string.
</identifiers>`
