/**
 * Creates a comprehensive, reusable prompt section for ensuring strict MathML compliance.
 * This module serves as the single source of truth for all MathML-related rules and examples.
 */
export function createMathmlComplianceSection(): string {
	return `
## 📐 CRITICAL MathML COMPLIANCE RULES (ZERO TOLERANCE)

You MUST adhere to the following rules for all mathematical and chemical notation. Any deviation will result in rejection.

### Banned Patterns (DO NOT OUTPUT)
- **NO LaTeX:** Absolutely no LaTeX commands (e.g., \`\\frac\`, \`\\sqrt\`) or dollar-sign delimiters (\`$...$\`).
- **NO Raw Currency/Percent in Text:** The dollar sign \`$\` and percent sign \`%\` are banned from all plain text. They MUST be rendered using MathML.
- **NO \`<mfenced>\` Element:** The \`<mfenced>\` MathML element is deprecated and BANNED. Use \`<mrow>\` with explicit parenthesis characters like \`<mo>(</mo>\` and \`<mo>)</mo>\` instead.
- **NO Outer \`<math>\` Wrapper:** All MathML must be **inner MathML** suitable for embedding inside a parent \`<math>\` tag. Do not include your own \`<math>\` or \`</math>\` wrapper in the \`mathml\` string.

### Correct Usage
- All mathematical notation MUST be placed inside a \`{ "type": "math", "mathml": "..." }\` inline item.
- Use the examples below as a definitive guide for correct formatting.

---

### ✅ GOOD vs. ❌ BAD Examples

#### 1. Fractions and Ratios
// BAD (text): "4/9", "a/b", "a:b"
// GOOD (math):
{ "type": "math", "mathml": "<mfrac><mn>4</mn><mn>9</mn></mfrac>" }
{ "type": "math", "mathml": "<mfrac><mi>a</mi><mi>b</mi></mfrac>" }
{ "type": "math", "mathml": "<mi>a</mi><mo>:</mo><mi>b</mi>" }

#### 2. Cross Multiplication
// BAD (text): "9 × a = 4 × b"
// GOOD (math):
{ "type": "math", "mathml": "<mn>9</mn><mo>×</mo><mi>a</mi><mo>=</mo><mn>4</mn><mo>×</mo><mi>b</mi>" }

#### 3. Percent and Currency
// BAD (text): "75%", "$5", "$1,234.56", "-$5", "5%–10%"
// GOOD (math):
{ "type": "math", "mathml": "<mn>75</mn><mo>%</mo>" }
{ "type": "math", "mathml": "<mo>$</mo><mn>5</mn>" }
{ "type": "math", "mathml": "<mo>$</mo><mn>1,234.56</mn>" }
{ "type": "math", "mathml": "<mo>−</mo><mo>$</mo><mn>5</mn>" }

// Currency examples (comprehensive):
// ❌ WRONG: { "type": "text", "content": "The cost is $5.50." }
// ✅ CORRECT:
[
  { "type": "text", "content": "The cost is " },
  { "type": "math", "mathml": "<mo>$</mo><mn>5.50</mn>" },
  { "type": "text", "content": "." }
]

// ❌ WRONG: { "type": "text", "content": "The discount is 25%!" }
// ✅ CORRECT:
[
  { "type": "text", "content": "The discount is " },
  { "type": "math", "mathml": "<mn>25</mn><mo>%</mo>" },
  { "type": "text", "content": "!" }
]

// ❌ WRONG: "You paid $1,234.56 for it"
// ✅ CORRECT:
[
  { "type": "text", "content": "You paid " },
  { "type": "math", "mathml": "<mo>$</mo><mn>1,234.56</mn>" },
  { "type": "text", "content": " for it" }
]

// ❌ WRONG: "Your balance is -$5"
// ✅ CORRECT:
[
  { "type": "text", "content": "Your balance is " },
  { "type": "math", "mathml": "<mo>−</mo><mo>$</mo><mn>5</mn>" }
]

// ❌ WRONG: "A discount of 5%–10%"
// ✅ CORRECT:
[
  { "type": "text", "content": "A discount of " },
  { "type": "math", "mathml": "<mn>5</mn><mo>%</mo>" },
  { "type": "text", "content": "–" },
  { "type": "math", "mathml": "<mn>10</mn><mo>%</mo>" }
]

**CRITICAL**: Before finalizing, SCAN ALL text nodes for "$" or "%" and rewrite by splitting the text.

#### 4. Expressions and Functions
// BAD (text): "Area = Length × Width", "f(x)"
// GOOD (math):
{ "type": "math", "mathml": "<mtext>Area</mtext><mo>=</mo><mtext>Length</mtext><mo>×</mo><mtext>Width</mtext>" }
{ "type": "math", "mathml": "<mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo>" }

#### 5. Chemistry (Subscripts, Charges, Reactions, Phase Labels)
// BAD (text): "NH4Cl", "Ca2+", "2H2 + O2 -> 2H2O", "NaCl(aq)"
// GOOD (math):
{ "type": "math", "mathml": "<mi>N</mi><msub><mi>H</mi><mn>4</mn></msub><mi>Cl</mi>" }
{ "type": "math", "mathml": "<msup><mi>Ca</mi><mrow><mn>2</mn><mo>+</mo></mrow></msup>" }
{ "type": "math", "mathml": "<mn>2</mn><msub><mi>H</mi><mn>2</mn></msub><mo>+</mo><msub><mi>O</mi><mn>2</mn></msub><mo>→</mo><mn>2</mn><msub><mi>H</mi><mn>2</mn></msub><mi>O</mi>" }

// Phase labels (aqueous, solid, liquid, gas):
{ "type": "math", "mathml": "<mi>NaCl</mi><mo>(</mo><mtext>aq</mtext><mo>)</mo>" }
{ "type": "math", "mathml": "<msub><mi>H</mi><mn>2</mn></msub><mi>O</mi><mo>(</mo><mtext>l</mtext><mo>)</mo>" }

// Equilibrium reactions:
{ "type": "math", "mathml": "<msub><mi>N</mi><mn>2</mn></msub><mo>+</mo><mn>3</mn><msub><mi>H</mi><mn>2</mn></msub><mo>⇌</mo><mn>2</mn><mi>N</mi><msub><mi>H</mi><mn>3</mn></msub>" }

Chemistry notation details:
- Subscripts: Use <msub> for element counts (H₂ → <msub><mi>H</mi><mn>2</mn></msub>)
- Superscripts: Use <msup> for ion charges (Ca²⁺ → <msup><mi>Ca</mi><mrow><mn>2</mn><mo>+</mo></mrow></msup>)
- Coefficients: Use <mn> for reaction coefficients (2H₂ → <mn>2</mn><msub><mi>H</mi><mn>2</mn></msub>)
- Arrows: <mo>→</mo> for irreversible, <mo>⇌</mo> for equilibrium
- Phase labels: Wrap in <mtext> with parenthesis tokens: <mo>(</mo><mtext>aq</mtext><mo>)</mo>
- BANNED: Plain text formulas, HTML <sub>/<sup>, ASCII arrows like "->"

#### 6. Exponents and Roots
// BAD (text): "x^2", "sqrt(x)", "cube root of 8", "nth root"
// GOOD (math):
{ "type": "math", "mathml": "<msup><mi>x</mi><mn>2</mn></msup>" }
{ "type": "math", "mathml": "<msqrt><mi>x</mi></msqrt>" }
{ "type": "math", "mathml": "<mroot><mn>8</mn><mn>3</mn></mroot>" }
{ "type": "math", "mathml": "<mroot><mi>x</mi><mi>n</mi></mroot>" }

#### 7. Linear Equations and Inequalities
// BAD (text): "2x + 3 = 7", "x <= 5", "x < 10", "y >= 2", "y != 2"
// GOOD (math):
{ "type": "math", "mathml": "<mn>2</mn><mi>x</mi><mo>+</mo><mn>3</mn><mo>=</mo><mn>7</mn>" }
{ "type": "math", "mathml": "<mi>x</mi><mo>≤</mo><mn>5</mn>" }
{ "type": "math", "mathml": "<mi>x</mi><mo>&lt;</mo><mn>10</mn>" }
{ "type": "math", "mathml": "<mi>y</mi><mo>≥</mo><mn>2</mn>" }
{ "type": "math", "mathml": "<mi>y</mi><mo>≠</mo><mn>2</mn>" }

Note: Use HTML entities for < and > inside MathML: &lt; and &gt;

#### 8. Absolute Value & Parentheses (no <mfenced>)
// BAD (text): "|x|", "(a+b)"
// GOOD (math):
{ "type": "math", "mathml": "<mo>|</mo><mi>x</mi><mo>|</mo>" }
{ "type": "math", "mathml": "<mo>(</mo><mi>a</mi><mo>+</mo><mi>b</mi><mo>)</mo>" }

#### 9. Mixed Numbers and Ratios
// BAD (text): "3 1/2", "a:b = c:d"
// GOOD (math):
{ "type": "math", "mathml": "<mn>3</mn><mfrac><mn>1</mn><mn>2</mn></mfrac>" }
{ "type": "math", "mathml": "<mi>a</mi><mo>:</mo><mi>b</mi><mo>=</mo><mi>c</mi><mo>:</mo><mi>d</mi>" }

#### 10. Scientific Notation
// BAD (text): "3.2 x 10^5"
// GOOD (math):
{ "type": "math", "mathml": "<mn>3.2</mn><mo>×</mo><msup><mn>10</mn><mn>5</mn></msup>" }

#### 11. Trigonometry, Degrees, and Angles
// BAD (text): "sin(pi/2) = 1", "90°", "∠ABC"
// GOOD (math):
{ "type": "math", "mathml": "<mi>sin</mi><mo>(</mo><mfrac><mi>π</mi><mn>2</mn></mfrac><mo>)</mo><mo>=</mo><mn>1</mn>" }
{ "type": "math", "mathml": "<mn>90</mn><mo>°</mo>" }
{ "type": "math", "mathml": "<mo>∠</mo><mtext>ABC</mtext>" }

#### 12. Logs, Summations, and Matrices
// BAD (text): "log_2 8", "sum_{i=1 to n} i", "[[1,2],[3,4]]"
// GOOD (math):
{ "type": "math", "mathml": "<msub><mi>log</mi><mn>2</mn></msub><mn>8</mn>" }
{ "type": "math", "mathml": "<munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><mi>i</mi>" }
{ "type": "math", "mathml": "<mo>[</mo><mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr><mtr><mtd><mn>3</mn></mtd><mtd><mn>4</mn></mtd></mtr></mtable><mo>]</mo>" }

#### 13. Units and Probability
// BAD (text): "cm^2", "P(A|B)"
// GOOD (math):
{ "type": "math", "mathml": "<msup><mtext>cm</mtext><mn>2</mn></msup>" }
{ "type": "math", "mathml": "<mi>P</mi><mo>(</mo><mi>A</mi><mo>|</mo><mi>B</mi><mo>)</mo>" }

#### 14. Polynomial Factors
// BAD (text): "(x+3)(x-2)"
// GOOD (math):
{ "type": "math", "mathml": "<mo>(</mo><mi>x</mi><mo>+</mo><mn>3</mn><mo>)</mo><mo>(</mo><mi>x</mi><mo>−</mo><mn>2</mn><mo>)</mo>" }

#### 15. Mixed Text and Math
// BAD (text only): "Compute 3/4 of 20."
// GOOD (mixed content array):
[
  { "type": "text", "content": "Compute " },
  { "type": "math", "mathml": "<mfrac><mn>3</mn><mn>4</mn></mfrac>" },
  { "type": "text", "content": " of " },
  { "type": "math", "mathml": "<mn>20</mn>" },
  { "type": "text", "content": "." }
]

#### 16. Spacing Between Text and Math (Units and Adjacent Math)
// ❌ BAD: Missing spaces around units yields hard-to-read output like "4km20m"
[
  { "type": "text", "content": "Keira walks " },
  { "type": "math", "mathml": "<mn>4</mn>" },
  { "type": "text", "content": "km" },
  { "type": "math", "mathml": "<mn>20</mn>" },
  { "type": "text", "content": "m during those three days." }
]

// ✅ GOOD: Insert spaces in surrounding text (preferred)
[
  { "type": "text", "content": "Keira walks " },
  { "type": "math", "mathml": "<mn>4</mn>" },
  { "type": "text", "content": " km " },
  { "type": "math", "mathml": "<mn>20</mn>" },
  { "type": "text", "content": " m during those three days." }
]

// ❌ BAD: Number glued to unit, e.g., "12miles"
[
  { "type": "text", "content": "The total distance is " },
  { "type": "math", "mathml": "<mn>12</mn>" },
  { "type": "text", "content": "miles." }
]

// ✅ GOOD: Ensure a space before the unit text
[
  { "type": "text", "content": "The total distance is " },
  { "type": "math", "mathml": "<mn>12</mn>" },
  { "type": "text", "content": " miles." }
]

// ❌ BAD: Missing space after colon before math ("Use the area formula:")
[
  { "type": "text", "content": "Use the area formula:" },
  { "type": "math", "mathml": "<mi>A</mi><mo>=</mo><mi>l</mi><mo>×</mo><mi>w</mi>" }
]

// ✅ GOOD: Add a space after the colon before math
[
  { "type": "text", "content": "Use the area formula: " },
  { "type": "math", "mathml": "<mi>A</mi><mo>=</mo><mi>l</mi><mo>×</mo><mi>w</mi>" }
]

// ❌ BAD: Missing space after colon before math ("Substitute the length and your width from Step 1:")
[
  { "type": "text", "content": "Substitute the length and your width from Step 1:" },
  { "type": "math", "mathml": "<mi>A</mi><mo>=</mo><mn>23</mn><mo>×</mo><mi>w</mi>" }
]

// ✅ GOOD: Add a space after the colon before math
[
  { "type": "text", "content": "Substitute the length and your width from Step 1: " },
  { "type": "math", "mathml": "<mi>A</mi><mo>=</mo><mn>23</mn><mo>×</mo><mi>w</mi>" }
]

// ❌ BAD: Missing trailing space before math at phrase boundary ("by checking")
[
  { "type": "text", "content": "Verify that the dimensions satisfy the given perimeter by checking" },
  { "type": "math", "mathml": "<mn>2</mn><mo>(</mo><mi>l</mi><mo>+</mo><mi>w</mi><mo>)</mo><mo>=</mo><mn>80</mn>" },
  { "type": "text", "content": "." }
]

// ✅ GOOD: Include a trailing space before math
[
  { "type": "text", "content": "Verify that the dimensions satisfy the given perimeter by checking " },
  { "type": "math", "mathml": "<mn>2</mn><mo>(</mo><mi>l</mi><mo>+</mo><mi>w</mi><mo>)</mo><mo>=</mo><mn>80</mn>" },
  { "type": "text", "content": "." }
]

// ❌ BAD: Missing leading space in text after math
[
  { "type": "math", "mathml": "<mi>A</mi><mo>=</mo><mn>23</mn><mo>×</mo><mi>w</mi>" },
  { "type": "text", "content": "Evaluate this expression to confirm it matches the value you selected, in square feet." }
]

// ✅ GOOD: Start the following text with a leading space
[
  { "type": "math", "mathml": "<mi>A</mi><mo>=</mo><mn>23</mn><mo>×</mo><mi>w</mi>" },
  { "type": "text", "content": " Evaluate this expression to confirm it matches the value you selected, in square feet." }
]

// ❌ BAD: Missing space before math after "to write"
[
  { "type": "text", "content": "to write" },
  { "type": "math", "mathml": "<mi>w</mi><mo>=</mo><mfrac><mn>80</mn><mn>2</mn></mfrac><mo>−</mo><mn>23</mn>" }
]

// ✅ GOOD: Include a trailing space before math after "to write"
[
  { "type": "text", "content": "to write " },
  { "type": "math", "mathml": "<mi>w</mi><mo>=</mo><mfrac><mn>80</mn><mn>2</mn></mfrac><mo>−</mo><mn>23</mn>" }
]

**MANDATORY RULE:** Whenever a text item is adjacent to a math item, include necessary leading/trailing spaces in the text items so the rendered sentence has natural spacing. Do NOT rely on the renderer to insert spaces.

---

### Pattern Recognition Checklist

Before finalizing your output, SCAN ALL text nodes for these patterns and convert them to MathML:

- **Dollar before number**: \`/$(?=\\s*\\d)/\` → Split text and insert \`<mo>$</mo><mn>amount</mn>\`
- **Number before percent**: \`/\\d\\s*%/\` → Split text and insert \`<mn>number</mn><mo>%</mo>\`
- **Fraction slash**: \`/\\d+\\/\\d+/\` or \`/[a-z]\\/[a-z]/i\` → Use \`<mfrac>\`
- **Exponent caret**: \`/\\^/\` → Use \`<msup>\`
- **Scientific notation**: \`/x\\s*10\\^/\` → Use \`<mo>×</mo><msup><mn>10</mn><mn>exp</mn></msup>\`
- **Chemistry subscripts**: \`/H2|O2|CO2|NH4/\` etc. → Use \`<msub>\`
- **Chemistry superscripts**: \`/Ca2\\+|Fe3\\+/\` etc. → Use \`<msup>\`
- **Arrows**: \`/->/\` or \`/→/\` in reactions → Use \`<mo>→</mo>\` inside math inline item
- **Angle symbols**: \`/∠/\` → Use \`<mo>∠</mo>\` inside math inline item
- **Degree symbols**: \`/°/\` → Use \`<mo>°</mo>\` inside math inline item
- **Absolute value bars**: \`/\\|[^|]+\\|/\` → Use \`<mo>|</mo>...<mo>|</mo>\` inside math inline item

**ZERO TOLERANCE**: If ANY of these patterns appear in plain text nodes, your output will be REJECTED.
`
}
