import type { DivisionAreaDiagramProps } from "@/widgets/generators/division-area-diagram"

// Example set 1: 51 ÷ 3 (four progressive states)
export const divisionAreaDiagramExamples_51_div_3: DivisionAreaDiagramProps[] =
	[
		{
			type: "divisionAreaDiagram",
			divisor: 3,
			dividend: 51,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		{
			type: "divisionAreaDiagram",
			divisor: 3,
			dividend: 51,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: 30,
					difference: 21,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		{
			type: "divisionAreaDiagram",
			divisor: 3,
			dividend: 51,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: 30,
					difference: 21,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: null,
					difference: 21,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		{
			type: "divisionAreaDiagram",
			divisor: 3,
			dividend: 51,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "value", value: 7, color: null }
			],
			steps: [
				{
					subtrahend: 30,
					difference: 21,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: 21,
					difference: 0,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: true
		}
	]

// Example set 2: 28 ÷ 2 (four progressive states)
export const divisionAreaDiagramExamples_28_div_2: DivisionAreaDiagramProps[] =
	[
		{
			type: "divisionAreaDiagram",
			divisor: 2,
			dividend: 28,
			quotientParts: [{ type: "placeholder" }, { type: "placeholder" }],
			steps: [
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		{
			type: "divisionAreaDiagram",
			divisor: 2,
			dividend: 28,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: 20,
					difference: 8,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		{
			type: "divisionAreaDiagram",
			divisor: 2,
			dividend: 28,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: 20,
					difference: 8,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: null,
					difference: 8,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		{
			type: "divisionAreaDiagram",
			divisor: 2,
			dividend: 28,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "value", value: 4, color: null }
			],
			steps: [
				{
					subtrahend: 20,
					difference: 8,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: 8,
					difference: 0,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: true
		}
	]

// Example set 3: 62 ÷ 4 with digit tokens
export const divisionAreaDiagramExamples_62_div_4: DivisionAreaDiagramProps[] =
	[
		{
			type: "divisionAreaDiagram",
			divisor: 4,
			dividend: 62,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: [
						{ type: "digit", value: 6, color: null },
						{ type: "digit", value: 2, color: null }
					],
					subtrahendTokens: [
						{ type: "boxedDigit", value: 0, color: null },
						{ type: "boxedDigit", value: 0, color: null }
					],
					differenceTokens: [
						{ type: "digit", value: 2, color: "red" },
						{ type: "digit", value: 2, color: "red" }
					],
					rightPanel: {
						tokensTop: [
							{ type: "digit", value: 2, color: "red" },
							{ type: "digit", value: 2, color: "red" }
						],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		{
			type: "divisionAreaDiagram",
			divisor: 4,
			dividend: 62,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "value", value: 5, color: "blue" }
			],
			steps: [
				{
					subtrahend: 40,
					difference: 22,
					differenceColor: "red",
					topTokens: [
						{ type: "digit", value: 6, color: null },
						{ type: "digit", value: 2, color: null }
					],
					subtrahendTokens: [
						{ type: "digit", value: 4, color: null },
						{ type: "digit", value: 0, color: null }
					],
					differenceTokens: [
						{ type: "digit", value: 2, color: "red" },
						{ type: "digit", value: 2, color: "red" }
					],
					rightPanel: {
						tokensTop: [
							{ type: "digit", value: 2, color: "red" },
							{ type: "digit", value: 2, color: "red" }
						],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: 20,
					difference: 2,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: [
						{ type: "digit", value: 2, color: null },
						{ type: "digit", value: 0, color: null }
					],
					differenceTokens: [{ type: "boxedDigit", value: 2, color: null }],
					rightPanel: null
				}
			],
			showFinalRemainderBox: true
		}
	]

// Example set 4: 99 ÷ 6 with digit tokens
export const divisionAreaDiagramExamples_99_div_6: DivisionAreaDiagramProps[] =
	[
		{
			type: "divisionAreaDiagram",
			divisor: 6,
			dividend: 99,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: [
						{ type: "digit", value: 9, color: null },
						{ type: "digit", value: 9, color: null }
					],
					subtrahendTokens: [
						{ type: "boxedDigit", value: 0, color: null },
						{ type: "boxedDigit", value: 0, color: null }
					],
					differenceTokens: [
						{ type: "digit", value: 3, color: "red" },
						{ type: "digit", value: 9, color: "red" }
					],
					rightPanel: {
						tokensTop: [
							{ type: "digit", value: 3, color: "red" },
							{ type: "digit", value: 9, color: "red" }
						],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		{
			type: "divisionAreaDiagram",
			divisor: 6,
			dividend: 99,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "value", value: 6, color: "blue" }
			],
			steps: [
				{
					subtrahend: 60,
					difference: 39,
					differenceColor: "red",
					topTokens: [
						{ type: "digit", value: 9, color: null },
						{ type: "digit", value: 9, color: null }
					],
					subtrahendTokens: [
						{ type: "digit", value: 6, color: null },
						{ type: "digit", value: 0, color: null }
					],
					differenceTokens: [
						{ type: "digit", value: 3, color: "red" },
						{ type: "digit", value: 9, color: "red" }
					],
					rightPanel: {
						tokensTop: [
							{ type: "digit", value: 3, color: "red" },
							{ type: "digit", value: 9, color: "red" }
						],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: 36,
					difference: 3,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: [
						{ type: "digit", value: 3, color: null },
						{ type: "digit", value: 6, color: null }
					],
					differenceTokens: [{ type: "boxedDigit", value: 3, color: null }],
					rightPanel: null
				}
			],
			showFinalRemainderBox: true
		}
	]

// Example set 5: 954 ÷ 9 with digit tokens and right-panel carry
export const divisionAreaDiagramExamples_954_div_9: DivisionAreaDiagramProps[] =
	[
		// State 1: Plan to subtract 900 (9 × 100). Show 954 on top, minus row with boxed 9 0 0, bring 54 to the right.
		{
			type: "divisionAreaDiagram",
			divisor: 9,
			dividend: 954,
			quotientParts: [
				{ type: "value", value: 100, color: "blue" },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: [
						{ type: "digit", value: 9, color: null },
						{ type: "digit", value: 5, color: null },
						{ type: "digit", value: 4, color: null }
					],
					subtrahendTokens: [
						{ type: "boxedDigit", value: 9, color: null },
						{ type: "boxedDigit", value: 0, color: null },
						{ type: "boxedDigit", value: 0, color: null }
					],
					differenceTokens: [
						{ type: "digit", value: 5, color: "red" },
						{ type: "digit", value: 4, color: "red" }
					],
					rightPanel: {
						tokensTop: [
							{ type: "digit", value: 5, color: "red" },
							{ type: "digit", value: 4, color: "red" }
						],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		// State 2: Commit subtraction of 900 and show remainder 54 below.
		{
			type: "divisionAreaDiagram",
			divisor: 9,
			dividend: 954,
			quotientParts: [
				{ type: "value", value: 100, color: "blue" },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: 900,
					difference: 54,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		// State 3: Choose +6 (blue) and subtract 54 (9 × 6), then show boxed 0 remainder inside.
		{
			type: "divisionAreaDiagram",
			divisor: 9,
			dividend: 954,
			quotientParts: [
				{ type: "value", value: 100, color: null },
				{ type: "value", value: 6, color: "blue" }
			],
			steps: [
				{
					subtrahend: 900,
					difference: 54,
					differenceColor: "red",
					topTokens: [
						{ type: "digit", value: 9, color: null },
						{ type: "digit", value: 5, color: null },
						{ type: "digit", value: 4, color: null }
					],
					subtrahendTokens: [
						{ type: "digit", value: 9, color: null },
						{ type: "digit", value: 0, color: null },
						{ type: "digit", value: 0, color: null }
					],
					differenceTokens: [
						{ type: "digit", value: 5, color: "red" },
						{ type: "digit", value: 4, color: "red" }
					],
					rightPanel: {
						tokensTop: [
							{ type: "digit", value: 5, color: "red" },
							{ type: "digit", value: 4, color: "red" }
						],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: 54,
					difference: 0,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: [
						{ type: "digit", value: 5, color: null },
						{ type: "digit", value: 4, color: null }
					],
					differenceTokens: [{ type: "boxedDigit", value: 0, color: null }],
					rightPanel: null
				}
			],
			showFinalRemainderBox: true
		}
	]

// Example set 6: 809 ÷ 4 with digit tokens and remainder 1
export const divisionAreaDiagramExamples_809_div_4: DivisionAreaDiagramProps[] =
	[
		// State 1: Plan to subtract 800 (4 × 200). Show 809 on top, minus row boxed 8 0 0, bring 9 to the right.
		{
			type: "divisionAreaDiagram",
			divisor: 4,
			dividend: 809,
			quotientParts: [
				{ type: "value", value: 200, color: "blue" },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: [
						{ type: "digit", value: 8, color: null },
						{ type: "digit", value: 0, color: null },
						{ type: "digit", value: 9, color: null }
					],
					subtrahendTokens: [
						{ type: "boxedDigit", value: 8, color: null },
						{ type: "boxedDigit", value: 0, color: null },
						{ type: "boxedDigit", value: 0, color: null }
					],
					differenceTokens: [{ type: "digit", value: 9, color: "red" }],
					rightPanel: {
						tokensTop: [{ type: "digit", value: 9, color: "red" }],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		// State 2: Commit subtraction of 800 and show remainder 9 below.
		{
			type: "divisionAreaDiagram",
			divisor: 4,
			dividend: 809,
			quotientParts: [
				{ type: "value", value: 200, color: "blue" },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: 800,
					difference: 9,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		// State 3: Choose +2 (blue) and subtract 8 (4 × 2), remainder 1 boxed.
		{
			type: "divisionAreaDiagram",
			divisor: 4,
			dividend: 809,
			quotientParts: [
				{ type: "value", value: 200, color: null },
				{ type: "value", value: 2, color: "blue" }
			],
			steps: [
				{
					subtrahend: 800,
					difference: 9,
					differenceColor: "red",
					topTokens: [
						{ type: "digit", value: 8, color: null },
						{ type: "digit", value: 0, color: null },
						{ type: "digit", value: 9, color: null }
					],
					subtrahendTokens: [
						{ type: "digit", value: 8, color: null },
						{ type: "digit", value: 0, color: null },
						{ type: "digit", value: 0, color: null }
					],
					differenceTokens: [{ type: "digit", value: 9, color: "red" }],
					rightPanel: {
						tokensTop: [{ type: "digit", value: 9, color: "red" }],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: 8,
					difference: 1,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: [{ type: "digit", value: 8, color: null }],
					differenceTokens: [{ type: "boxedDigit", value: 1, color: null }],
					rightPanel: null
				}
			],
			showFinalRemainderBox: true
		}
	]

// Example set 7: 96 ÷ 6 (with bring-to-right tokens)
export const divisionAreaDiagramExamples_96_div_6: DivisionAreaDiagramProps[] =
	[
		// State 1: Plan to subtract 60 (6 × 10). Show 96 on top, minus row boxed 6 0, bring 36 to the right.
		{
			type: "divisionAreaDiagram",
			divisor: 6,
			dividend: 96,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: [
						{ type: "digit", value: 9, color: null },
						{ type: "digit", value: 6, color: null }
					],
					subtrahendTokens: [
						{ type: "boxedDigit", value: 6, color: null },
						{ type: "boxedDigit", value: 0, color: null }
					],
					differenceTokens: [
						{ type: "digit", value: 3, color: "red" },
						{ type: "digit", value: 6, color: "red" }
					],
					rightPanel: {
						tokensTop: [
							{ type: "digit", value: 3, color: "red" },
							{ type: "digit", value: 6, color: "red" }
						],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		// State 2: Commit subtraction of 60 and show remainder 36 below.
		{
			type: "divisionAreaDiagram",
			divisor: 6,
			dividend: 96,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: 60,
					difference: 36,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		// State 3: Choose +6 (blue) and subtract 36 (6 × 6) → remainder 0 boxed.
		{
			type: "divisionAreaDiagram",
			divisor: 6,
			dividend: 96,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "value", value: 6, color: "blue" }
			],
			steps: [
				{
					subtrahend: 60,
					difference: 36,
					differenceColor: "red",
					topTokens: [
						{ type: "digit", value: 9, color: null },
						{ type: "digit", value: 6, color: null }
					],
					subtrahendTokens: [
						{ type: "digit", value: 6, color: null },
						{ type: "digit", value: 0, color: null }
					],
					differenceTokens: [
						{ type: "digit", value: 3, color: "red" },
						{ type: "digit", value: 6, color: "red" }
					],
					rightPanel: {
						tokensTop: [
							{ type: "digit", value: 3, color: "red" },
							{ type: "digit", value: 6, color: "red" }
						],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: 36,
					difference: 0,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: [
						{ type: "digit", value: 3, color: null },
						{ type: "digit", value: 6, color: null }
					],
					differenceTokens: [{ type: "boxedDigit", value: 0, color: null }],
					rightPanel: null
				}
			],
			showFinalRemainderBox: true
		}
	]

// Example set 8: 54 ÷ 3 (with bring-to-right tokens)
export const divisionAreaDiagramExamples_54_div_3: DivisionAreaDiagramProps[] =
	[
		// State 1: Plan to subtract 30 (3 × 10). Show 54 on top, minus row boxed 3 0, bring 24 to the right.
		{
			type: "divisionAreaDiagram",
			divisor: 3,
			dividend: 54,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: [
						{ type: "digit", value: 5, color: null },
						{ type: "digit", value: 4, color: null }
					],
					subtrahendTokens: [
						{ type: "boxedDigit", value: 3, color: null },
						{ type: "boxedDigit", value: 0, color: null }
					],
					differenceTokens: [
						{ type: "digit", value: 2, color: "red" },
						{ type: "digit", value: 4, color: "red" }
					],
					rightPanel: {
						tokensTop: [
							{ type: "digit", value: 2, color: "red" },
							{ type: "digit", value: 4, color: "red" }
						],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		// State 2: Commit subtraction of 30 and show remainder 24 below.
		{
			type: "divisionAreaDiagram",
			divisor: 3,
			dividend: 54,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "placeholder" }
			],
			steps: [
				{
					subtrahend: 30,
					difference: 24,
					differenceColor: "red",
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				},
				{
					subtrahend: null,
					difference: null,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: null,
					differenceTokens: null,
					rightPanel: null
				}
			],
			showFinalRemainderBox: false
		},
		// State 3: Choose +8 (blue) and subtract 24 (3 × 8) → remainder 0 boxed.
		{
			type: "divisionAreaDiagram",
			divisor: 3,
			dividend: 54,
			quotientParts: [
				{ type: "value", value: 10, color: null },
				{ type: "value", value: 8, color: "blue" }
			],
			steps: [
				{
					subtrahend: 30,
					difference: 24,
					differenceColor: "red",
					topTokens: [
						{ type: "digit", value: 5, color: null },
						{ type: "digit", value: 4, color: null }
					],
					subtrahendTokens: [
						{ type: "digit", value: 3, color: null },
						{ type: "digit", value: 0, color: null }
					],
					differenceTokens: [
						{ type: "digit", value: 2, color: "red" },
						{ type: "digit", value: 4, color: "red" }
					],
					rightPanel: {
						tokensTop: [
							{ type: "digit", value: 2, color: "red" },
							{ type: "digit", value: 4, color: "red" }
						],
						minusTokens: null,
						bottomTokens: null
					}
				},
				{
					subtrahend: 24,
					difference: 0,
					differenceColor: null,
					topTokens: null,
					subtrahendTokens: [
						{ type: "digit", value: 2, color: null },
						{ type: "digit", value: 4, color: null }
					],
					differenceTokens: [{ type: "boxedDigit", value: 0, color: null }],
					rightPanel: null
				}
			],
			showFinalRemainderBox: true
		}
	]
