export const caretBanPromptSection = `
**CRITICAL: CARET (^) IN TEXT IS BANNED — USE PROPER MATHML**

- The caret character '^' MUST NEVER appear in any text content anywhere in the output (body, prompts, feedback, choices, labels, table cells, widget text). Exponents and hats MUST be expressed using MathML.
- For exponents, ALWAYS use <msup>…</msup>.
- For unit expressions like m/s^2, write them in MathML without any caret in text. Prefer either a fraction or multiplied powers form.

Negative example (DO NOT OUTPUT):
\\\`\\\`\\\`json
{
  "body": [
    { "type": "paragraph", "content": [
      { "type": "text", "content": "If the mass is increased to " },
      { "type": "math", "mathml": "<mn>8</mn><mtext> kg</mtext>" },
      { "type": "text", "content": ", the acceleration will be " },
      { "type": "inlineInteractionRef", "interactionId": "numeric_input_1" },
      { "type": "text", "content": " m/s^2." }
    ]}
  ]
}
\\\`\\\`\\\`

Positive examples — CORRECT MathML usage for squared seconds:

1) As a single fraction:
\\\`\\\`\\\`json
[
  { "type": "text", "content": " the acceleration will be " },
  { "type": "inlineInteractionRef", "interactionId": "numeric_input_1" },
  { "type": "text", "content": " " },
  { "type": "math", "mathml": "<mfrac><mi>m</mi><msup><mi>s</mi><mn>2</mn></msup></mfrac>" },
  { "type": "text", "content": "." }
]
\\\`\\\`\\\`

2) As multiplied powers (equivalent form):
\\\`\\\`\\\`json
[
  { "type": "text", "content": " the acceleration will be " },
  { "type": "inlineInteractionRef", "interactionId": "numeric_input_1" },
  { "type": "text", "content": " " },
  { "type": "math", "mathml": "<mi>m</mi><mo>/</mo><msup><mi>s</mi><mn>2</mn></msup>" },
  { "type": "text", "content": "." }
]
\\\`\\\`\\\`

General rules:
- SCAN ALL inline text nodes for '^' and rewrite with MathML.
- Inside MathML, use <msup> for exponents; do NOT encode exponents via raw text with carets.
- This applies to ALL content fields: body, prompts, feedback, choice content, table cells, widget labels, etc.
`
