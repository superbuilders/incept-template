/**
 * Creates a comprehensive, reusable prompt section for ensuring equations and expressions
 * in choices are correctly represented as inline MathML, not widgets.
 * This module serves as the single source of truth for this rule across all generation steps.
 */
export function createEquationsInChoicesSection(): string {
	return `
## CRITICAL: Equations and expressions inside choices are NOT widgets

When a choice option contains ONLY mathematical notation (equations, expressions, numeric forms), you MUST represent it with inline MathML inside paragraph content. Do NOT create widget slots for math-only choices.

### ✅ CORRECT: Inline MathML in choices

**Context:** A question asks "Which equation can be used to find the number of gallons?"
**Correct choice structure:**
\`\`\`json
{
  "identifier": "A",
  "content": [
    {
      "type": "paragraph",
      "content": [
        { "type": "math", "mathml": "<mn>720</mn><mo>÷</mo><mn>4</mn><mo>=</mo><mi>x</mi>" }
      ]
    }
  ]
}
\`\`\`
**Why this is correct:** The choice is a pure equation. It must render as accessible MathML, not an image.

---

### ❌ WRONG: Widget slots for equation choices (from real failures)

**Context (from question_29):** A question asks about equations for equal shares.
**Incorrect choice structure:**
\`\`\`json
{
  "identifier": "A",
  "content": [
    {
      "type": "widgetRef",
      "widgetId": "repl__choice_interaction__choice__a__visual__0",
      "widgetType": "nPolygon"
    }
  ]
}
\`\`\`
**Why this is WRONG:** The choice should be an equation like \`720 ÷ 4 = x\`, not a polygon diagram. Using \`widgetRef\` turns the equation into a meaningless image.

**Context (from question_23):** A question asks for a representation to find a variable.
**Incorrect choice structure:**
\`\`\`json
{
  "identifier": "D",
  "content": [
    {
      "type": "widgetRef",
      "widgetId": "reponse__d__v1",
      "widgetType": "nPolygon"
    }
  ]
}
\`\`\`
**Why this is WRONG:** The choice should be an equation like \`p = 187 - 152 - 11\`, not a generic polygon. This misclassification makes the question unsolvable.

---

### RULES FOR CHOICE CONTENT

**Math-only content (equations, expressions, single numbers):**
- Use inline MathML: \`{ "type": "paragraph", "content": [{ "type": "math", "mathml": "..." }] }\`
- Do NOT use \`widgetRef\` or \`inlineWidgetRef\`.

**Diagrams, charts, or visual models:**
- Use \`widgetRef\`: \`{ "type": "widgetRef", "widgetId": "...", "widgetType": "..." }\`
- Examples: number lines, bar charts, geometric figures, tape diagrams.

**Mixed content (text + equation):**
- Use a paragraph with inline text and math nodes.
- Example: \`[{ "type": "text", "content": "The equation " }, { "type": "math", "mathml": "..." }]\`

**Edge Case Clarification:** If a choice contains a diagram that includes mathematical labels (e.g., a number line with points labeled, a geometric figure with side lengths), it is still considered a **diagram** and MUST use a \`widgetRef\`. The math-only rule applies only when the choice content consists *exclusively* of an equation or expression.
`
}
