/**
 * Creates a comprehensive, reusable prompt section for enforcing single-visual-per-choice discipline.
 * This module provides explicit negative and positive examples to prevent widgetRef duplication.
 */
export function createChoiceVisualsDisciplineSection(): string {
	return `
## 🚫 WRONG vs ✅ RIGHT: Choice-Level Visuals Discipline

### ❌ WRONG: Multiple widgetRefs per choice and invented slot IDs
\`\`\`json
{
  "choice_interaction": {
    "type": "choiceInteraction",
    "responseIdentifier": "RESPONSE",
    "prompt": [ { "type": "text", "content": "Select the diagram that..." } ],
    "choices": [
      {
        "identifier": "A",
        "content": [
          { "type": "widgetRef", "widgetId": "repl__choice_interaction__choice__a__visual__0" },
          { "type": "widgetRef", "widgetId": "choice_interaction_1__choice__a__visual__1" }
        ]
      },
      {
        "identifier": "B",
        "content": [
          { "type": "widgetRef", "widgetId": "repl__choice_interaction__choice__b__visual__0" },
          { "type": "widgetRef", "widgetId": "choice_interaction_1__choice__b__visual__2" }
        ]
      }
    ]
  }
}
\`\`\`

### ✅ RIGHT: Exactly one widgetRef per choice, using only canonical shell-declared ids
\`\`\`json
{
  "choice_interaction": {
    "type": "choiceInteraction",
    "responseIdentifier": "RESPONSE",
    "prompt": [ { "type": "text", "content": "Select the diagram that..." } ],
    "choices": [
      {
        "identifier": "A",
        "content": [
          { "type": "widgetRef", "widgetId": "repl__choice_interaction__choice__a__visual__0" }
        ]
      },
      {
        "identifier": "B",
        "content": [
          { "type": "widgetRef", "widgetId": "repl__choice_interaction__choice__b__visual__0" }
        ]
      }
    ]
  }
}
\`\`\`

### HARD RULES (ZERO TOLERANCE)
- For a \`choiceInteraction\`, each choice MUST contain **exactly one** \`widgetRef\` if the shell declares a visual for that choice; otherwise, it must contain **zero**.
- **NEVER** include more than one \`widgetRef\` in a single choice's \`content\` array.
- **NEVER** invent, derive, or hallucinate \`widgetId\`s from patterns. Use only the **exact** \`widgetId\`s present in the shell's widget list.
- Math-only choices (e.g., a choice containing just an equation) MUST use inline MathML and MUST NOT use a \`widgetRef\`.
- **Output is INVALID** if any choice contains more than one \`widgetRef\` or references a \`widgetId\` not present in the shell's widgets list. If this occurs in your draft, correct it before returning the final output.
`
}
