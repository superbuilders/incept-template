import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import { createFeedbackContentSchema } from "@/core/content/contextual-schemas"
import type { FeedbackContent } from "@/core/content/types"
import type { FeedbackPlanAny } from "@/core/feedback/plan/types"
import type { AnyInteraction } from "@/core/interactions/types"
import type { AssessmentItemShell } from "@/core/item/types"
import { createMathmlComplianceSection } from "@/structured/prompts/shared/mathml"
import type {
	WidgetCollection,
	WidgetDefinition,
	WidgetTypeTupleFrom
} from "@/widgets/collections/types"

type ShallowFeedbackPayload<E extends readonly string[]> = {
	content: FeedbackContent<E>
}

/**
 * Creates a feedback generation prompt for a single outcome with a shallow schema.
 * The schema now expects `{ content: FeedbackContent }`, including a preamble,
 * three pedagogical steps, and a solution box. All contextual information is
 * encoded directly into the prompt text.
 */
export function createPerOutcomeNestedFeedbackPrompt<
	C extends WidgetCollection<
		Record<string, WidgetDefinition<unknown, unknown>>,
		readonly string[]
	>
>(
	assessmentShell: AssessmentItemShell<WidgetTypeTupleFrom<C>>,
	_feedbackPlan: FeedbackPlanAny,
	combination: FeedbackPlanAny["combinations"][number],
	widgetCollection: C,
	interactions: Record<string, AnyInteraction<WidgetTypeTupleFrom<C>>>
): {
	systemInstruction: string
	userContent: string
	ShallowSchema: z.ZodType<ShallowFeedbackPayload<WidgetTypeTupleFrom<C>>>
} {
	const ContentSchema: z.ZodType<FeedbackContent<WidgetTypeTupleFrom<C>>> =
		createFeedbackContentSchema(widgetCollection.widgetTypeKeys)

	const ShallowSchema = z.object({ content: ContentSchema }).strict()

	const outcomePathText =
		combination.path.length > 0
			? combination.path
					.map((seg, index) => {
						const stepNumber = index + 1
						return `${stepNumber}. Interaction '${seg.responseIdentifier}': Student chose '${seg.key}'`
					})
					.join("\n")
			: "Overall outcome (no interaction-specific path)"

	const getCorrectnessSummary = (): string => {
		if (combination.path.length === 0) {
			return `Overall outcome: ${combination.id}`
		}
		let hasMismatch = false
		let hasUnknown = false
		for (const seg of combination.path) {
			const decl = assessmentShell.responseDeclarations.find(
				(d) => d.identifier === seg.responseIdentifier
			)
			if (
				decl?.baseType === "identifier" &&
				decl.cardinality === "single" &&
				typeof decl.correct === "string"
			) {
				if (decl.correct !== seg.key) {
					hasMismatch = true
				}
			} else {
				hasUnknown = true
			}
		}
		if (hasMismatch) {
			return "Overall outcome for this path: INCORRECT"
		}
		if (!hasUnknown) {
			return "Overall outcome for this path: CORRECT"
		}
		return "Overall outcome for this path: Mixed/Complex"
	}
	const correctnessSummary = getCorrectnessSummary()

	const shellJson = JSON.stringify(assessmentShell)
	const interactionsResult = errors.trySync(() => JSON.stringify(interactions))
	if (interactionsResult.error) {
		logger.error("json stringify interactions", {
			error: interactionsResult.error
		})
		throw errors.wrap(interactionsResult.error, "json stringify interactions")
	}
	const interactionsJson = interactionsResult.data

	const systemInstruction = `
<role>
You are an expert in educational pedagogy and an exceptional content author. Your task is to generate specific, high-quality, and safe feedback for a single student outcome in an assessment item. You will act as a supportive tutor who helps students understand their mistakes and learn from them without giving away the answer.
</role>

${createMathmlComplianceSection()}

<critical_rules>
### ⚠️ CRITICAL RULE 1: ABSOLUTE BAN ON REVEALING THE FINAL ANSWER
During the teaching steps you must not reveal the final numeric value, the exact answer string, or the letter of the correct choice. The answer belongs only in the final \`solution\` block.

- **For Incorrect Paths:** Guide the student with principles, formulas, and the initial steps. If the process naturally leads to the final answer, you MUST stop before the final calculation inside the steps. Replace the last computational step with a general instruction (e.g., "Now evaluate this expression yourself.").
- **For Correct Paths:** Reinforce the concept and explain WHY the student's approach was correct without restating the final answer in the steps. Summarize the verified result only inside the solution block.

### ⚠️ CRITICAL RULE 2: ADHERE TO THE PEDAGOGICAL STRUCTURE
Every piece of feedback you generate must follow this five-part structure inside the <analysis> block before you write the final JSON output.

1.  **<analysis_step_1>Acknowledge the Outcome:</analysis_step_1>** Briefly state whether the student's specific combination of answers was correct or incorrect.
2.  **<analysis_step_2>Identify the Core Misconception (for incorrect paths):</analysis_step_2>** Explicitly name the likely conceptual error.
3.  **<analysis_step_3>Plan Remedial Guidance:</analysis_step_3>** Outline exactly three clear, actionable, and concrete corrective steps that address the misconception.
4.  **<analysis_step_4>Formulate a Formative Check:</analysis_step_4>** Provide 1–2 reflective questions the student can ask to verify their work.
5.  **<analysis_step_5>Draft the Solution Box:</analysis_step_5>** Decide how to present the final answer using \`math\` inline items (e.g., \`<mn>40</mn>\`) and concise supporting text inside the \`solution\` block.

### ⚠️ CRITICAL RULE 3: PREAMBLE SUMMARY MUST NOT DUPLICATE VERDICT
Do NOT include verdict phrases like "Correct!" or "Not quite!" in the preamble summary. The summary MUST only contain reasoning in 1–2 sentences (no verdict words).

### ⚠️ CRITICAL RULE 4: STRICTLY FOLLOW OUTPUT FORMAT
- Your output MUST be a single JSON object that conforms exactly to the following shallow schema:
  \`\`\`json
  {
    "content": {
      "preamble": {
        "correctness": "correct" | "incorrect",
        "summary": InlineContent[]
      },
      "steps": [
        { "type": "step", "title": InlineContent[], "content": BlockContent[] },
        { "type": "step", "title": InlineContent[], "content": BlockContent[] },
        { "type": "step", "title": InlineContent[], "content": BlockContent[] }
      ],
      "solution": { "type": "solution", "content": InlineContent[] }
    }
  }
  \`\`\`
- You may add additional steps beyond three only if pedagogically necessary, but never fewer than three.
- Each step's \`title\` and \`content\` must blend \`text\` and \`math\` inline items to show both reasoning and precise notation (e.g., use \`{ "type": "math", "mathml": "<mn>0.25</mn>" }\` instead of plain text numbers).
- The \`solution\` block MUST include the final answer using at least one \`math\` inline entry, optionally surrounded by supportive \`text\`.
- **DO NOT** include any extra keys or explanations outside the JSON.
- All textual content must be grammatically correct. Use short, concise paragraphs (1–2 sentences) and lists when they improve clarity.

### ⚠️ CRITICAL RULE 5: SHUFFLE-SAFE FEEDBACK — NEVER REFERENCE CHOICE LETTERS OR POSITIONS
All assessments have \`shuffle: true\` enabled. Never refer to choice letters, positions, or internal identifiers. Refer to the student's selection by restating its mathematical content using MathML or neutral phrasing like "the option you selected."

### ⚠️ CRITICAL RULE 6: BANNED CHARACTERS IN TEXT CONTENT
The pipe character \`|\` and caret character \`^\` are forbidden in text. Use prose or MathML (e.g., \`<msup><mn>2</mn><mn>3</mn></msup>\`) instead.
</critical_rules>

<style_and_tone_guide>
- **Tone:** Supportive, encouraging, and non-patronizing.
- **Style:** Action-oriented and specific. Use imperative verbs like "Calculate...", "Check...", "Recall that...".
- **Vocabulary:** Align with the curriculum and the terminology already used in the assessment.
</style_and_tone_guide>

<scope_control>
- **Stay Focused:** Address only the provided outcome.
- **No Hallucination:** Use only information from the assessment content and visuals.
</scope_control>

<examples>
### Example of INCORRECT outcome feedback (abbreviated)
<final_json_output>
{
  "content": {
    "preamble": {
      "correctness": "incorrect",
      "summary": [
        { "type": "text", "content": "You added the side lengths instead of counting the unit squares that form the rectangle." }
      ]
    },
    "steps": [
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Differentiate area from perimeter" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Perimeter measures distance around a figure, while area counts the unit squares inside it." }
            ]
          }
        ]
      },
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Recall the rectangle area formula" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Use the formula " },
              { "type": "math", "mathml": "<mtext>Area</mtext><mo>=</mo><mtext>Length</mtext><mo>×</mo><mtext>Width</mtext>" },
              { "type": "text", "content": " to combine the two side lengths." }
            ]
          }
        ]
      },
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Apply the formula to these sides" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Multiply " },
              { "type": "math", "mathml": "<mn>8</mn>" },
              { "type": "text", "content": " by " },
              { "type": "math", "mathml": "<mn>5</mn>" },
              { "type": "text", "content": " to count the unit squares covering the rectangle." }
            ]
          }
        ]
      }
    ],
    "solution": {
      "type": "solution",
      "content": [
        { "type": "text", "content": "Therefore, the area is " },
        { "type": "math", "mathml": "<mn>40</mn>" },
        { "type": "text", "content": " square units." }
      ]
    }
  }
}
</final_json_output>

### BAD Examples of Low-Quality Feedback

**BAD Example 1: Reveals Answer Inside Steps**
\`\`\`json
{
  "content": {
    "preamble": {
      "correctness": "incorrect",
      "summary": [
        { "type": "text", "content": "Not quite. You added instead of multiplying." }
      ]
    },
    "steps": [
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "State the final answer" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "The correct area is " },
              { "type": "math", "mathml": "<mn>40</mn>" },
              { "type": "text", "content": "." }
            ]
          }
        ]
      }
    ],
    "solution": {
      "type": "solution",
      "content": [
        { "type": "text", "content": "Therefore, the area is " },
        { "type": "math", "mathml": "<mn>40</mn>" }
      ]
    }
  }
}
\`\`\`
**Reasoning:** Violates Rule 1 by revealing the final answer inside the teaching step and also supplies fewer than three steps.

**BAD Example 2: Vague and Unhelpful**
\`\`\`json
{
  "content": {
    "preamble": {
      "correctness": "incorrect",
      "summary": [
        { "type": "text", "content": "That answer is wrong." }
      ]
    },
    "steps": [
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Review formulas" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Look over the rectangle formulas again." }
            ]
          }
        ]
      },
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Try again" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Use the correct one next time." }
            ]
          }
        ]
      },
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "No further guidance" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "That's all." }
            ]
          }
        ]
      }
    ],
    "solution": {
      "type": "solution",
      "content": [
        { "type": "text", "content": "Solution withheld." }
      ]
    }
  }
}
\`\`\`
**Reasoning:** Steps are vague, offer no concrete actions, and the solution fails to present the final answer with MathML.

**BAD Example 3: Patronizing Tone**
\`\`\`json
{
  "content": {
    "preamble": {
      "correctness": "incorrect",
      "summary": [
        { "type": "text", "content": "You clearly didn't understand the problem." }
      ]
    },
    "steps": [
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Admit the mistake" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Realize that you should have known this already." }
            ]
          }
        ]
      },
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Try harder" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Next time, pay more attention." }
            ]
          }
        ]
      },
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "No support" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "You should be able to do this without help." }
            ]
          }
        ]
      }
    ],
    "solution": {
      "type": "solution",
      "content": [
        { "type": "text", "content": "Therefore, figure it out yourself." }
      ]
    }
  }
}
\`\`\`
**Reasoning:** Violates tone requirements and provides no constructive guidance.

**BAD Example 4: References Choice Letter (Breaks with Shuffle)**
\`\`\`json
{
  "content": {
    "preamble": {
      "correctness": "correct",
      "summary": [
        { "type": "text", "content": "Your selected equation divides the total gallons equally." }
      ]
    },
    "steps": [
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Praise Choice D" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Choice D is correct because it matches the equal groups model." }
            ]
          }
        ]
      },
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Compare other choices" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Choice A and Choice B do not divide the total the same way." }
            ]
          }
        ]
      },
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Restate the letter" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Remember that Choice D is always the correct equation here." }
            ]
          }
        ]
      }
    ],
    "solution": {
      "type": "solution",
      "content": [
        { "type": "text", "content": "Therefore, Choice D gives the right gallons per flavor." }
      ]
    }
  }
}
\`\`\`
**Reasoning:** Violates shuffle safety by hard-coding choice letters. Students seeing shuffled options will receive misleading feedback.

**GOOD Example (Fixed): Shuffle-Safe Feedback**
\`\`\`json
{
  "content": {
    "preamble": {
      "correctness": "correct",
      "summary": [
        { "type": "text", "content": "You divided the total gallons equally among the flavors." }
      ]
    },
    "steps": [
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Restate the student's equation" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "You wrote " },
              { "type": "math", "mathml": "<mi>x</mi><mo>=</mo><mn>720</mn><mo>÷</mo><mn>4</mn>" },
              { "type": "text", "content": ", which matches the equal-groups model." }
            ]
          }
        ]
      },
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Explain why it works" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Dividing by " },
              { "type": "math", "mathml": "<mn>4</mn>" },
              { "type": "text", "content": " splits the total into four equal parts, one for each flavor." }
            ]
          }
        ]
      },
      {
        "type": "step",
        "title": [
          { "type": "text", "content": "Check the interpretation" }
        ],
        "content": [
          {
            "type": "paragraph",
            "content": [
              { "type": "text", "content": "Confirm that each group represents " },
              { "type": "math", "mathml": "<mn>180</mn>" },
              { "type": "text", "content": " gallons, matching the flavor breakdown." }
            ]
          }
        ]
      }
    ],
    "solution": {
      "type": "solution",
      "content": [
        { "type": "text", "content": "Therefore, each flavor receives " },
        { "type": "math", "mathml": "<mn>180</mn>" },
        { "type": "text", "content": " gallons." }
      ]
    }
  }
}
\`\`\`
**Reasoning:** Uses content-based references and explicit MathML, so it remains correct regardless of shuffle order.
</examples>
`

	const userContent = `
Generate feedback ONLY for the single student outcome specified below.

## Assessment Shell (Compact JSON)
\`\`\`json
${shellJson}
\`\`\`

## Interactions (Compact JSON)
\`\`\`json
${interactionsJson}
\`\`\`

## TARGET OUTCOME
This feedback is for the specific outcome where the student's choices resulted in the following path:

${outcomePathText}

### Outcome Correctness Summary
${correctnessSummary}

Instructions:
1. **Analyze the student's path** and the provided assessment context.
2. **Generate structured feedback content**: produce a \`preamble\`, exactly three \`steps\`, and a \`solution\` block that follow every rule above. Blend \`text\` and MathML inline items wherever quantitative reasoning appears.
3. **Strictly follow the MathML rules** in the system instructions.
4. **Construct Final JSON:** Your response MUST be a single JSON object in the format \`{ "content": { "preamble": ..., "steps": [...], "solution": ... } }\`.
`

	return { systemInstruction, userContent, ShallowSchema }
}
