## Issue: Unit Formatting

**What went wrong**
- The example writes `km` inside the MathML payload (`<mn>42</mn><mi>km</mi>`) and omits the required space between the value and the unit.
- Screen readers treat the entire payload as one math expression, so the unit is spoken as a variable instead of plain language.
- Learners also see “42km” jammed together, violating our spacing guidelines for measurements.
- Our content style guide requires units to appear in standalone text nodes with a leading space so they can be localized and styled consistently.

**How to fix it**
- Keep the numeric value inside MathML, but render the unit as a separate `{ type: "text", content: " km" }` node immediately afterward (note the leading space).
- Only use MathML for the mathematical part of the expression—numbers, operators, and variables—not measurement units.
