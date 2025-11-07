export const IDENTIFIER_GUIDANCE_SECTION = `### IDENTIFIER_POLICY
<identifiers>
- **Response Identifiers:** Every interaction response identifier **must** be a valid \`ResponseIdentifier\` from \`src/core/identifiers.ts\`, e.g. \`RESP\`, \`RESP_A\`, \`RESP_B\`, \`RESP_DROP_1\`. Do **not** invent other prefixes.
- **Feedback Plan:** The \`feedbackPlan.dimensions[*].responseIdentifier\` values must exactly match the interaction response identifiers and use the same \`RESP*\` spellings.
- **Consistency:** When referencing these identifiers anywhere (interactions, response declarations, feedback paths), use the exact same string literal.
</identifiers>`
