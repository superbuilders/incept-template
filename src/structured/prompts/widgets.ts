import type { Interaction } from "@/core/interactions/types"
import type { AssessmentItemShell } from "@/core/item/types"
import { caretBanPromptSection } from "@/structured/prompts/caret"
import {
	createWidgetSelectionPromptSection,
	formatUnifiedContextSections
} from "@/structured/prompts/shared"
import type { AiContextEnvelope, ImageContext } from "@/structured/types"
import { createSubsetCollection } from "@/widgets/collections/subset"
import type {
	WidgetCollection,
	WidgetDefinition
} from "@/widgets/collections/types"

export function createWidgetContentPrompt<
	E extends readonly string[],
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		E
	>
>(
	envelope: AiContextEnvelope,
	assessmentShell: AssessmentItemShell<E>,
	widgetMapping: Record<string, E[number]>,
	generatedInteractions: Record<string, Interaction<E>>,
	widgetCollection: C,
	imageContext: ImageContext
): {
	systemInstruction: string
	userContent: string
} {
	// Extract unique widget types from the mapping to create a minimal subset
	const uniqueWidgetTypes = new Set<E[number]>()
	for (const typeName of Object.values(widgetMapping)) {
		uniqueWidgetTypes.add(typeName)
	}
	const neededWidgetTypes: ReadonlyArray<E[number]> =
		Array.from(uniqueWidgetTypes)
	const subsetCollection = createSubsetCollection(
		widgetCollection,
		neededWidgetTypes
	)

	const systemInstruction = `You are an expert in educational content conversion with vision capabilities, focused on generating widget content for QTI assessments. Your task is to generate ONLY the widget content objects based on the original Perseus JSON, an assessment shell, a mapping that specifies the exact widget type for each slot, and accompanying visual context.

**Vision Capability**: You may be provided with raster images (PNG, JPG) as multimodal input. Use your vision to analyze these images. For SVG images, their raw XML content will be provided directly in the text prompt.

**⚠️ CRITICAL: GRAMMATICAL ERROR CORRECTION ⚠️**
WE MUST correct any grammatical errors found in the source Perseus content. This includes:
- Spelling mistakes in words and proper nouns
- Incorrect punctuation, capitalization, and sentence structure
- Subject-verb disagreement and other grammatical issues
- Awkward phrasing that impacts clarity
- Missing or incorrect articles (a, an, the)

The goal is to produce clean, professional educational content that maintains the original meaning while fixing any language errors present in the source material.

You must generate a JSON object where:
- Each key is a widget slot name from the mapping.
- Each value is a fully-formed widget object of the specified type.
- All widget properties must conform to their respective schemas.

⚠️ ABSOLUTELY BANNED CONTENT - ZERO TOLERANCE ⚠️
The following are CATEGORICALLY FORBIDDEN in ANY part of your output:

1. **NO LATEX COMMANDS** - ANY backslash followed by letters is FORBIDDEN:
   - NO: \\sqrt, \\dfrac, \\frac, \\(, \\), \\blueD, \\text, etc.
   - If you output ANY LaTeX command, you have FAILED.

2. **NO LATEX DOLLAR SIGNS** - The $ character for LaTeX is BANNED:
   - NO math delimiters: $x$, $$y$$
   - NEVER use HTML for currency symbols. Currency and percent MUST be MathML, NOT HTML, NOT raw text.
   - For currency, ALWAYS use MathML: '<mo>$</mo><mn>amount</mn>'. For percent: '<mn>number</mn><mo>%</mo>'.

3. **NO DEPRECATED MATHML** - NEVER use:
   - <mfenced> elements (use <mrow> with <mo> delimiters instead)

4. **NO CDATA SECTIONS** - Never use '<![CDATA[ ... ]]>'. All content must be properly XML-encoded within elements.

5. **NO INVALID XML CHARACTERS** - Do not include control characters or non-characters:
   - Disallowed: U+0000–U+001F (except TAB U+0009, LF U+000A, CR U+000D), U+FFFE, U+FFFF, and unpaired surrogates.

**Currency: Comprehensive Examples**

SCAN ALL text content in widgets (labels, captions, content) for '$' - these MUST be converted to MathML.

**Single values:**
- ❌ WRONG: 'Price: $5.50'
  ✅ CORRECT: [{ 'type': 'text', 'content': 'Price: ' }, { 'type': 'math', 'mathml': '<mo>$</mo><mn>5.50</mn>' }]

// intentionally omit percent examples in widget prompts

**Complex examples:**
- ❌ WRONG: '$10–$20'
  ✅ CORRECT: [{ 'type': 'math', 'mathml': '<mo>$</mo><mn>10</mn>' }, { 'type': 'text', 'content': '–' }, { 'type': 'math', 'mathml': '<mo>$</mo><mn>20</mn>' }]

- ❌ WRONG: 'Cost: -$5'
  ✅ CORRECT: [{ 'type': 'text', 'content': 'Cost: ' }, { 'type": 'math', 'mathml': '<mo>-</mo><mo>$</mo><mn>5</mn>' }]

**Pattern checklist:**
- /$(?=s*d)/ - dollar before number
- NEVER use HTML spans for currency

**VIDEO WIDGET GENERATION**
When generating a \`video\` widget from a Perseus source:
- The \`url\` property must be a full, valid embed URL.
- The Perseus \`video\` widget has an \`options.location\` property which is a unique identifier.
- You MUST construct a standard YouTube embed URL using this location identifier: \`https://www.youtube.com/embed/\${location}\`
- Example: If Perseus \`location\` is "dQw4w9WgXcQ", the output \`url\` MUST be "https://www.youtube.com/embed/dQw4w9WgXcQ".

  **DEDICATED RULE: ANSWER LEAKAGE IS STRICTLY PROHIBITED**
  Widgets must NEVER reveal, hint at, or encode the correct answer in any way.
  - Do not pre-label target values (angles, lengths, coordinates, categories) with the correct answer
  - Do not pre-highlight the correct region, tick, or element
  - Do not include explanatory text that states or implies the answer
  - When a label field could reveal the answer, set it to null

6. **NO ANSWER LEAKAGE IN WIDGETS** - CRITICAL: Widgets MUST NEVER reveal the correct answer:
   - NEVER label diagrams with the answer (e.g., angle labeled 'EAF' when asking for angle name)
   - NEVER highlight or mark the correct value in visualizations
   - NEVER include text, labels, or visual indicators that give away the answer
   - The widget should present the problem visually WITHOUT showing the solution
   - **ABSOLUTE RULE**: Answers are ONLY allowed in feedback fields. HARD STOP. NO EXCEPTIONS.`

	const userContent = `Generate widget content based on the following inputs. Use the provided context, including raster images for vision and vector images as text, to understand the content fully.

${formatUnifiedContextSections(envelope, imageContext)}

## Assessment Shell (for context):
\`\`\`json
${JSON.stringify(assessmentShell, null, 2)}
\`\`\`

## Interaction Content (for context):
This is the full content of the interaction(s) in the item. Use this to understand the question being asked, which is essential for creating correct widget data (e.g., correct tick marks on a number line for a choice).
\`\`\`json
${JSON.stringify(generatedInteractions, null, 2)}
\`\`\`

## Widget Mapping:
This mapping tells you the required output type for each widget.
\`\`\`json
${JSON.stringify(widgetMapping, null, 2)}
\`\`\`

${createWidgetSelectionPromptSection(subsetCollection)}

## Instructions:
- **Analyze Images**: Use the raster images provided to your vision and the raw SVG content above to understand the visual components of widgets.
- For each entry in the widget mapping, generate a fully-formed widget object of the specified type.
- **Note on Widget Usage**: Some widgets may be used only in feedback (nested) rather than the main body. Generate these widgets identically to body widgets - the same quality standards and no-answer-leakage rules apply.
- **Use Interaction Context**: You MUST use the "Interaction Content" object to understand the full question. This context is critical for generating correct data for widgets that appear within choices. For example, the interaction's prompt will tell you what the correct values on a number line widget should be.
- Extract all relevant data from the Perseus JSON to populate the widget properties.
- **CRITICAL: PRESERVE ALL LABELS AND VALUES FROM PERSEUS EXACTLY** - When Perseus describes labels, markers, values, or any visual properties (in alt text, descriptions, or widget options), you MUST copy them EXACTLY. Missing or changing labels can make questions impossible to answer.
- Ensure all required properties for each widget type are included.
  - **MANDATORY: HONOR CHOICE-LEVEL SLOT NAMING**: Each choice should have at most one visual. Generate a widget for each choice-level slot ID **that was actually used** in the final interaction content. If the interaction mistakenly contains multiple \`widgetRef\`s for a single choice, generate content for **only the one canonical slot declared by the shell** and completely IGNORE the others. Do not generate content for invented or hallucinated slot IDs.
- Return ONLY a JSON object with widget slot names as keys and widget objects as values.

Example output structure:
{
  "widget_1": { "type": "doubleNumberLine", "width": 400, ... },
  "chart_1": { "type": "barChart", "data": [...], ... }
}

## NEGATIVE EXAMPLES FROM REAL ERRORS (DO NOT OUTPUT THESE)

**LaTeX Commands BANNED:**
WRONG: \`\\sqrt{25}\` --> CORRECT: \`<msqrt><mn>25</mn></msqrt>\`
WRONG: \`\\dfrac{x}{y}\` --> CORRECT: \`<mfrac><mi>x</mi><mi>y</mi></mfrac>\`
WRONG: \`\\(\` or \`\\)\` --> CORRECT: Remove entirely, use proper MathML tags
WRONG: \`\\blueD{text}\` --> CORRECT: Just use the text content without color commands

**LaTeX Dollar Signs BANNED:**
WRONG: \`$x + y$\` --> CORRECT: \`<math><mi>x</mi><mo>+</mo><mi>y</mi></math>\`
WRONG: \`$$equation$$\` --> CORRECT: \`<mathdisplay="block">...</math>\`
WRONG: \`costs $5\` (bare dollar) --> CORRECT: \`costs <math><mo>$</mo><mn>5</mn></math>\` (currency in MathML)

**Deprecated MathML BANNED:**
WRONG: \`<mfenced open="|" close="|"><mi>x</mi></mfenced>\` --> CORRECT: \`<mrow><mo>|</mo><mi>x</mi><mo>|</mo></mrow>\`
WRONG: \`<mfenced open="(" close=")">content</mfenced>\` --> CORRECT: \`<mrow><mo>(</mo>content<mo>)</mo></mrow>\`

${caretBanPromptSection}

**Pipes in Text BANNED — Use proper structured content instead of textual pipes:**
WRONG (pseudo-table using pipes in widget content):
\`\`\`
{
  "some_widget": {
    "type": "emojiImage",
    "columns": [
      { "key": "c1", "label": [{ "type": "text", "content": "Seconds | Meters" }], "isNumeric": false }
    ],
    "data": [
      [{ "type": "inline", "content": [{ "type": "text", "content": "8 | 225" }] }]
    ]
  }
}
\`\`\`

CORRECT (proper widget without pipes):
\`\`\`
{
  "some_widget": {
    "type": "emojiImage",
    "emojis": ["⏱️", "📏"],
    "description": "Time and distance data: 8 seconds corresponds to 225 meters"
  }
}
\`\`\`

**QTI Content Model Violations:**

**Prompt Fields Must Use Structured Inline Content:**
WRONG: \`prompt: 'Select the double number line...'\` (plain string)
CORRECT: \`prompt: [{ "type": "text", "content": "Select the double number line that shows the other values of distance and elevation." }]\`

WRONG: \`prompt: '<p>Arrange the cards to make a true comparison.</p>'\` (HTML string)
CORRECT: \`prompt: [{ "type": "text", "content": "Arrange the cards to make a true comparison." }]\`

**Example with Math in Prompt:**
CORRECT: \`prompt: [{ "type": "text", "content": "What is the value of " }, { "type": "math", "mathml": "<mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo>" }, { "type": "text", "content": " at each point?" }]\`

**General Rule for Prompts:** Prompt fields MUST be arrays of inline content objects. No raw strings or HTML allowed.

**Choice Content - DEPENDS ON INTERACTION TYPE:**

**For Standard Choice Interactions (choiceInteraction, orderInteraction):**
WRONG: \`{ identifier: "A", content: "<p>above</p>" }\` (HTML string)
CORRECT: \`{ identifier: "A", content: [{ "type": "paragraph", "content": [{ "type": "text", "content": "above" }] }] }\`

**For Inline Choice Interactions (inlineChoiceInteraction):**
WRONG: \`{ identifier: "ABOVE", content: "above" }\` (plain string)
CORRECT: \`{ identifier: "ABOVE", content: [{ "type": "text", "content": "above" }] }\`

**Choice Feedback - ALWAYS INLINE CONTENT:**
WRONG: \`feedback: 'Correct! This rectangle has...'\` (plain string)
CORRECT: \`feedback: [{ "type": "text", "content": "Correct! This rectangle has..." }]\`

WRONG: \`feedback: '<p>Incorrect. Try again.</p>'\` (HTML string)
CORRECT: \`feedback: [{ "type": "text", "content": "Incorrect. Try again." }]\`

**LaTeX in Widget Properties BANNED:**
WRONG (e.g., in any widget): \`"label": "Value of $$x$$"\`
CORRECT: \`"label": "Value of <math><mi>x</mi></math>"\`

**Answer Leakage in Widgets BANNED:**
WRONG (angle diagram with answer label):
\`{
  "angle_diagram": {
    "type": "angleDiagram",
    "angles": [{
      "label": "EAF",  // ❌ BANNED: Labels the angle with the answer!
      "vertices": ["E", "A", "F"]
    }]
  }
}\`
CORRECT (angle diagram without answer):
\`{
  "angle_diagram": {
    "type": "angleDiagram",
    "angles": [{
        "label": null,  // ✅ CORRECT: No label revealing the answer
      "vertices": ["E", "A", "F"],
      "color": "#11accd"  // Visual marking without giving away answer
    }]
  }
}\`

WRONG (triangle diagram question with angle labeled):
\`{
  "triangle_widget": {
    "type": "triangleDiagram",
    "triangles": [{
      "vertices": ["B", "A", "C"],
      "angles": [{
        "vertex": "A",
        "label": "BAC"  // ❌ BANNED: When asking "Which angle is ∠BAC?", don't label it!
      }]
    }]
  }
}\`
CORRECT (triangle diagram without revealing labels):
\`{
  "triangle_widget": {
    "type": "triangleDiagram",
    "triangles": [{
      "vertices": ["B", "A", "C"],
      "angles": [{
        "vertex": "A",
        "label": null  // ✅ CORRECT: Let students identify which angle is ∠BAC
      }]
    }]
  }
}\`

**Duplicate Choice Visuals BANNED (Every Option Must Be Distinct):**
Every widget-driven choice is a teaching opportunity. When several answers rely on visuals, each option MUST surface a different conceptual cue so the student demonstrates understanding. Our shorthand rule of thumb — **no two answers should be the same** — exists to enforce that pedagogy. Even if duplicate visuals technically align with the answer key, they read as lazy authoring and rob the student of feedback signals. If multiple answers legitimately share the same measurement (for example, several right angles), vary the orientation (\`startingReading\`) or other non-answer properties so learners compare distinct scenarios instead of staring at clones.

WRONG (three right-angle visuals reuse the same protractor orientation, so the question never tests different misconceptions):
\`\`\`json
{
  "identifier": "angles-not-right-multiselect",
  "title": "Identify angles that are not right angles",
  "responseDeclarations": [
    {
      "identifier": "RESPONSE",
      "cardinality": "multiple",
      "baseType": "identifier",
      "correct": ["A", "C"]
    }
  ],
  "body": [
    { "type": "interactionRef", "interactionId": "choice_interaction" }
  ],
  "interactions": {
    "choice_interaction": {
      "type": "choiceInteraction",
      "responseIdentifier": "RESPONSE",
      "prompt": [
        { "type": "text", "content": "Which angles appear not to have a measure of " },
        { "type": "math", "mathml": "<mn>90</mn><mo>°</mo>" },
        { "type": "text", "content": "? Select all that apply." }
      ],
      "choices": [
        {
          "identifier": "A",
          "content": [
            {
              "type": "widgetRef",
              "widgetId": "repl__choice_interaction__choice__a__visual__0",
              "widgetType": "protractorAngleDiagram"
            }
          ]
        },
        {
          "identifier": "B",
          "content": [
            {
              "type": "widgetRef",
              "widgetId": "repl__choice_interaction__choice__b__visual__0",
              "widgetType": "protractorAngleDiagram"
            }
          ]
        },
        {
          "identifier": "C",
          "content": [
            {
              "type": "widgetRef",
              "widgetId": "repl__choice_interaction__choice__c__visual__0",
              "widgetType": "protractorAngleDiagram"
            }
          ]
        },
        {
          "identifier": "D",
          "content": [
            {
              "type": "widgetRef",
              "widgetId": "repl__choice_interaction__choice__d__visual__0",
              "widgetType": "protractorAngleDiagram"
            }
          ]
        },
        {
          "identifier": "E",
          "content": [
            {
              "type": "widgetRef",
              "widgetId": "repl__choice_interaction__choice__e__visual__0",
              "widgetType": "protractorAngleDiagram"
            }
          ]
        }
      ],
      "shuffle": true,
      "minChoices": 2,
      "maxChoices": 2
    }
  },
  "widgets": {
    "repl__choice_interaction__choice__a__visual__0": {
      "type": "protractorAngleDiagram",
      "width": 380,
      "height": 380,
      "startingReading": 0,
      "angleDegrees": 60
    },
    "repl__choice_interaction__choice__b__visual__0": {
      "type": "protractorAngleDiagram",
      "width": 380,
      "height": 380,
      "startingReading": 0,
      "angleDegrees": 90
    },
    "repl__choice_interaction__choice__c__visual__0": {
      "type": "protractorAngleDiagram",
      "width": 380,
      "height": 380,
      "startingReading": 0,
      "angleDegrees": 120
    },
    "repl__choice_interaction__choice__d__visual__0": {
      "type": "protractorAngleDiagram",
      "width": 380,
      "height": 380,
      "startingReading": 0,
      "angleDegrees": 90
    },
    "repl__choice_interaction__choice__e__visual__0": {
      "type": "protractorAngleDiagram",
      "width": 380,
      "height": 380,
      "startingReading": 0,
      "angleDegrees": 90
    }
  }
}
\`\`\`

CORRECT (same stem, answer key, and widget slots—only the right angles rotate so students analyze distinct visuals instead of clones. Widget payload shown; other fields stay the same):
\`\`\`json
{
  "widgets": {
    "repl__choice_interaction__choice__a__visual__0": {
      "type": "protractorAngleDiagram",
      "width": 380,
      "height": 380,
      "startingReading": 0,
      "angleDegrees": 60
    },
    "repl__choice_interaction__choice__b__visual__0": {
      "type": "protractorAngleDiagram",
      "width": 380,
      "height": 380,
      "startingReading": 0,
      "angleDegrees": 90
    },
    "repl__choice_interaction__choice__c__visual__0": {
      "type": "protractorAngleDiagram",
      "width": 380,
      "height": 380,
      "startingReading": 0,
      "angleDegrees": 120
    },
    "repl__choice_interaction__choice__d__visual__0": {
      "type": "protractorAngleDiagram",
      "width": 380,
      "height": 380,
      "startingReading": 30,
      "angleDegrees": 90
    },
    "repl__choice_interaction__choice__e__visual__0": {
      "type": "protractorAngleDiagram",
      "width": 380,
      "height": 380,
      "startingReading": 60,
      "angleDegrees": 90
    }
  }
}
\`\`\`

**Construction-Mode Protractor (do NOT draw the solution angle):**
If the source shows a protractor with only the baseline ray drawn (e.g., ray PQ) and labeled tick points (e.g., V, T, S, R), configure the widget so it does not reveal the completed angle. Use:
- \`hideSector: true\` — no interior shading
- \`hideEndRay: true\` — do not draw the second ray
- Provide labels for the vertex/baseline endpoint, and tick labels with \`arcLabels\` at the degree marks from the baseline.

Example (baseline PQ at 0°, target 85° labeled “S”):
\`\`\`json
{
  "widgets": {
    "protractor_diagram_1": {
      "type": "protractorAngleDiagram",
      "width": 490,
      "height": 284,
      "startingReading": 0,
      "angleDegrees": 85,
      "hideSector": true,
      "hideEndRay": true,
      "centerPointLabel": "P",
      "startPointLabel": "Q",
      "endPointLabel": "",
      "arcLabels": [
        { "label": "V", "degrees": 50 },
        { "label": "T", "degrees": 75 },
        { "label": "S", "degrees": 85 },
        { "label": "R", "degrees": 105 }
      ]
    }
  }
}
\`\`\`

**CRITICAL: Missing Essential Widget Data BANNED:**
WRONG (triangle with missing side labels that are needed for the question):
\`{
  "image_1": {
    "type": "triangleDiagram",
    "sides": [
      {"label": " ", "vertices": ["L", "R"]},  // ❌ BANNED: Side should be labeled "A" per Perseus!
      {"label": " ", "vertices": ["R", "T"]},  // ❌ BANNED: Side should be labeled "B" per Perseus!
      {"label": " ", "vertices": ["T", "L"]}   // ❌ BANNED: Side should be labeled "C" per Perseus!
    ]
  }
}\`
*Perseus had: "The base is labeled A. The other two sides are labeled, in clockwise order, B and C."*
*Question asks: "Which line segment shows the base?" with choices A, B, C*
*Without the labels, the question is IMPOSSIBLE to answer!*

CORRECT (preserving all essential labels from Perseus):
\`{
  "image_1": {
    "type": "triangleDiagram",
    "sides": [
      {"label": "A", "vertices": ["L", "R"]},  // ✅ CORRECT: Label preserved from Perseus
      {"label": "B", "vertices": ["R", "T"]},  // ✅ CORRECT: Label preserved from Perseus
      {"label": "C", "vertices": ["T", "L"]}   // ✅ CORRECT: Label preserved from Perseus
    ]
  }
}\`

**GENERAL RULE: COPY WIDGET DATA FROM PERSEUS EXACTLY**
When Perseus describes labels, values, or visual properties in the widget (via alt text, descriptions, or widget options), you MUST preserve ALL of them exactly. Missing labels or values makes questions unsolvable!

**⚠️ CRITICAL: WIDGET DIMENSION CONSISTENCY ⚠️**

When generating multiple widgets of the same type or purpose within a single question, maintain dimensional consistency unless the question explicitly requires different sizes:

1. **GEOMETRIC PRIMITIVES IN DRAGGABLE/CHOICE CONTEXTS**:
   - For line, ray, and segment widgets used as draggable choices: Use consistent dimensions (e.g., width: 300, height: 50 for horizontal orientation)
   - For point widgets: Use square dimensions (e.g., width: 50, height: 50)
   - Length parameter should be consistent across similar primitives (e.g., all use length: 225)

2. **GROUPED VISUAL COMPARISONS**:
   - When widgets appear together for comparison (e.g., multiple angles, shapes, or diagrams in choices), use identical width/height
   - This ensures fair visual comparison and professional appearance

3. **ORIENTATION-BASED SIZING**:
   - Horizontal primitives (rotation near 0°): Consider "skinny" format (width >> height, e.g., 300x50)
   - Vertical primitives (rotation near 90°): Consider tall format (height >> width, e.g., 50x300)
   - Diagonal/varied orientations: Use square format (e.g., 300x300)

**Example: Consistent dimensions for draggable geometric primitives**
CORRECT (consistent sizing for similar widgets):
\`{
  "line_diagram": {
    "type": "geometricPrimitiveDiagram",
    "width": 300,
    "height": 50,
    "primitive": {
      "type": "line",
      "rotation": 0,
      "length": 225
    }
  },
  "ray_diagram": {
    "type": "geometricPrimitiveDiagram",
    "width": 300,  // ✅ Same width as line
    "height": 50,   // ✅ Same height as line
    "primitive": {
      "type": "ray",
      "rotation": 0,
      "length": 225  // ✅ Same length as line
    }
  },
  "point_diagram": {
    "type": "geometricPrimitiveDiagram",
    "width": 50,    // ✅ Square format for point
    "height": 50,   // ✅ Square format for point
    "primitive": {
      "type": "point"
    }
  }
}\`

WRONG (inconsistent dimensions without justification):
\`{
  "line_diagram": {
    "width": 400,   // ❌ Different from ray
    "height": 100   // ❌ Different from ray
  },
  "ray_diagram": {
    "width": 250,   // ❌ Inconsistent
    "height": 75    // ❌ Inconsistent
  }
}\`

**⚠️ CRITICAL: GEOMETRIC DIMENSION EXTRACTION FOR AREA/PERIMETER QUESTIONS ⚠️**

When generating geometric widgets (nPolygon, triangleDiagram, rectangleDiagram, etc.) for questions about area, perimeter, or dimensions:

1. **ANALYZE THE SCREENSHOT CAREFULLY**: Use your vision to identify ALL dimension labels on shapes
2. **EXTRACT DIMENSIONS FROM TEXT**: Look for dimension references in:
   - The question prompt (e.g., "A floor is 12 feet by 8 feet")
   - Alt text or image descriptions
   - Text content near the image
   - Answer choices (often reveal the scale of dimensions)
3. **APPLY DIMENSIONS TO WIDGETS**: Use \`sideLabels\` arrays to mark dimensions on shapes

**Example: Rectangle with missing dimensions**
WRONG (area question with no dimensions shown):
\`{
  "floor_diagram": {
    "type": "nPolygon",
    "width": 400,
    "height": 300,
    "polygons": [{
      "shape": "rectangle",
      "fillColor": "#8ECAE6",
      "sideLabels": null  // ❌ BANNED: Area questions need dimensions!
    }]
  }
}\`
*Question asks: "What is the area of the floor in square feet?"*
*Without dimensions, this question is IMPOSSIBLE to answer!*

CORRECT (dimensions extracted from screenshot or inferred from answer choices):
\`{
  "floor_diagram": {
    "type": "nPolygon",
    "width": 400,
    "height": 300,
    "polygons": [{
      "shape": "rectangle",
      "fillColor": "#8ECAE6",
      "sideLabels": [
        { "sideIndex": 0, "label": { "value": 20, "unit": "ft" } },  // top
        { "sideIndex": 1, "label": { "value": 12, "unit": "ft" } },  // right
        { "sideIndex": 2, "label": { "value": 20, "unit": "ft" } },  // bottom
        { "sideIndex": 3, "label": { "value": 12, "unit": "ft" } }   // left
      ]
    }]
  }
}\`

**Example: Multiple rectangles (composite floor plan)**
WRONG (composite area question with missing dimensions):
\`{
  "floor_plan": {
    "type": "nPolygon",
    "polygons": [
      { "shape": "rectangle", "fillColor": "#8ECAE6", "sideLabels": null },  // ❌ BANNED
      { "shape": "rectangle", "fillColor": "#A3D9A5", "sideLabels": null }   // ❌ BANNED
    ]
  }
}\`

CORRECT (dimensions extracted and applied to both rectangles):
\`{
  "floor_plan": {
    "type": "nPolygon",
    "width": 500,
    "height": 350,
    "polygons": [
      {
        "shape": "rectangle",
        "fillColor": "#8ECAE6",
        "sideLabels": [
          { "sideIndex": 0, "label": { "value": 20, "unit": "ft" } },
          { "sideIndex": 1, "label": { "value": 12, "unit": "ft" } }
          // Only label adjacent sides for clarity
        ]
      },
      {
        "shape": "rectangle",
        "fillColor": "#A3D9A5",
        "sideLabels": [
          { "sideIndex": 0, "label": { "value": 14, "unit": "ft" } },
          { "sideIndex": 1, "label": { "value": 11, "unit": "ft" } }
        ]
      }
    ]
  }
}\`

**DIMENSION INFERENCE STRATEGY:**
When dimensions are not explicitly visible but the question requires them:
1. Analyze answer choices - they reveal the scale (e.g., "240 sq ft", "312 sq ft" suggests dimensions in the 10-20 ft range)
2. Look for ratios or relationships mentioned in the text
3. Ensure your chosen dimensions produce ONE of the answer choices as correct
4. Apply realistic measurements for the context (floors: feet; gardens: feet/meters; paper: inches/cm)

**MANDATORY CHECK**: Before finalizing ANY geometric widget for an area/perimeter question, ask yourself:
- "Can a student calculate the answer using the information shown in my widget?"
- "Are all necessary dimensions visible on the diagram?"
- If NO to either question, ADD THE MISSING DIMENSIONS using sideLabels!

**Ensure all text content within widget properties is properly escaped and follows content rules.**

**Critical Rules:**
- **Standard choice interactions** (choiceInteraction, orderInteraction): Choice content MUST be arrays of block content objects
- **Inline choice interactions** (inlineChoiceInteraction): Choice content MUST be arrays of inline content objects
- **ALL choice feedback**: MUST be arrays of inline content objects regardless of interaction type
- **ALL prompts**: MUST be arrays of inline content objects

⚠️ FINAL WARNING: Your output will be AUTOMATICALLY REJECTED if it contains:
- ANY LaTeX commands (backslash followed by letters)
- ANY dollar sign used as LaTeX delimiter (e.g., $x$, $$y$$)
- ANY raw text "$" in text nodes - currency MUST be in MathML: \`<mo>$</mo><mn>amount</mn>\`
- ANY <mfenced> element
- ANY widget that labels or visually indicates the correct answer (e.g., angle labeled "EAF" when answer is ∠EAF)
- ANY block-level elements in prompt fields (prompts must contain only inline content)
- ANY \`<p>\` tags in choice feedback (feedback must be inline text only)
- ANY \`<p>\` tags in inline choice interaction content (must be inline text only)

**REMEMBER: Answers are ONLY allowed in feedback fields. HARD STOP. NO EXCEPTIONS.**
Double-check EVERY string in your output. ZERO TOLERANCE for these violations.`

	return { systemInstruction, userContent }
}
