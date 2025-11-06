import type { TapeDiagramProps } from "@/widgets/generators/tape-diagram"

export const tapeDiagramExamples: TapeDiagramProps[] = [
	// Example 1: Classic additive model with proportional comparison
	{
		type: "tapeDiagram",
		width: 500,
		height: 300,
		referenceUnitsTotal: 35,
		topTape: {
			label: "Total",
			unitsTotal: 35,
			extent: null,
			grid: { show: false },
			roundedCaps: null,
			fills: [
				{
					span: { by: "units", startUnit: 0, endUnit: 15 },
					style: { kind: "solid", fill: "#4285F4", fillOpacity: null },
					label: { text: "15", placement: "inside" }
				},
				{
					span: { by: "units", startUnit: 15, endUnit: 27 },
					style: { kind: "solid", fill: "#0F9D58", fillOpacity: null },
					label: { text: "12", placement: "inside" }
				},
				{
					span: { by: "units", startUnit: 27, endUnit: 35 },
					style: { kind: "solid", fill: "#F4B400", fillOpacity: null },
					label: { text: "8", placement: "inside" }
				}
			]
		},
		bottomTape: {
			label: "Parts",
			unitsTotal: 35,
			extent: null,
			grid: { show: false },
			roundedCaps: null,
			fills: [
				{
					span: { by: "units", startUnit: 0, endUnit: 15 },
					style: { kind: "solid", fill: "#34A853", fillOpacity: null },
					label: { text: "Part A", placement: "inside" }
				},
				{
					span: { by: "units", startUnit: 15, endUnit: 27 },
					style: { kind: "solid", fill: "#34A853", fillOpacity: null },
					label: { text: "Part B", placement: "inside" }
				},
				{
					span: { by: "units", startUnit: 27, endUnit: 35 },
					style: { kind: "solid", fill: "#34A853", fillOpacity: null },
					label: { text: "Part C", placement: "inside" }
				}
			]
		},
		brackets: [
			{
				tape: "top",
				span: { by: "units", startUnit: 0, endUnit: 35 },
				labelTop: "35",
				labelBottom: null,
				style: { kind: "straight", stroke: null, strokeWidth: null }
			}
		]
	},
	// Example 2: Percentage representation with unit grid
	{
		type: "tapeDiagram",
		width: 500,
		height: 300,
		referenceUnitsTotal: null,
		topTape: {
			label: "Value",
			unitsTotal: 10,
			extent: null,
			grid: { show: true },
			roundedCaps: null,
			fills: [
				{
					span: { by: "units", startUnit: 0, endUnit: 7 },
					style: { kind: "solid", fill: "#7854ab", fillOpacity: null },
					label: null
				}
			]
		},
		bottomTape: null,
		brackets: [
			{
				tape: "top",
				span: { by: "units", startUnit: 0, endUnit: 7 },
				labelTop: "91",
				labelBottom: "70%",
				style: { kind: "curly", stroke: null, strokeWidth: null }
			}
		]
	},
	// Example 3: Comparative quantities with different extents
	{
		type: "tapeDiagram",
		width: 400,
		height: 300,
		referenceUnitsTotal: 7,
		topTape: {
			label: "Sarah's Money",
			unitsTotal: 7,
			extent: { by: "units", startUnit: 0, endUnit: 7 },
			grid: { show: false },
			roundedCaps: null,
			fills: [
				{
					span: { by: "units", startUnit: 0, endUnit: 4 },
					style: { kind: "solid", fill: "#FF6B6B", fillOpacity: null },
					label: { text: "$20", placement: "inside" }
				},
				{
					span: { by: "units", startUnit: 4, endUnit: 7 },
					style: { kind: "solid", fill: "#FF6B6B", fillOpacity: 0.7 },
					label: { text: "$15", placement: "inside" }
				}
			]
		},
		bottomTape: {
			label: "Tom's Money",
			unitsTotal: 2,
			extent: { by: "units", startUnit: 0, endUnit: 2 },
			grid: { show: false },
			roundedCaps: null,
			fills: [
				{
					span: { by: "units", startUnit: 0, endUnit: 2 },
					style: { kind: "solid", fill: "#FFD93D", fillOpacity: null },
					label: { text: "?", placement: "inside" }
				}
			]
		},
		brackets: []
	},
	// Example 4: Mixed filled and unfilled regions
	{
		type: "tapeDiagram",
		width: 500,
		height: 300,
		referenceUnitsTotal: null,
		topTape: {
			label: "Container",
			unitsTotal: 12,
			extent: null,
			grid: { show: true },
			roundedCaps: true,
			fills: [
				{
					span: { by: "units", startUnit: 0, endUnit: 8 },
					style: { kind: "solid", fill: "#2196F3", fillOpacity: null },
					label: { text: "Filled", placement: "above" }
				},
				{
					span: { by: "units", startUnit: 8, endUnit: 12 },
					style: { kind: "outline", stroke: "#666666", strokeWidth: 2 },
					label: { text: "Empty", placement: "above" }
				}
			]
		},
		bottomTape: null,
		brackets: [
			{
				tape: "top",
				span: { by: "percent", startPct: 0, endPct: 66.67 },
				labelTop: "8 L",
				labelBottom: "2/3",
				style: { kind: "straight", stroke: null, strokeWidth: null }
			}
		]
	},
	// Example 5: Canonical percent tape (10 units, first 7 shaded) with straight brackets
	{
		type: "tapeDiagram",
		width: 500,
		height: 300,
		referenceUnitsTotal: null,
		topTape: {
			label: null,
			unitsTotal: 10,
			extent: null,
			grid: { show: true },
			roundedCaps: true,
			fills: [
				{
					span: { by: "units", startUnit: 0, endUnit: 7 },
					style: { kind: "solid", fill: "#7854ab", fillOpacity: null },
					label: null
				}
			]
		},
		bottomTape: null,
		brackets: [
			{
				tape: "top",
				span: { by: "units", startUnit: 0, endUnit: 7 },
				labelTop: "91",
				labelBottom: "70%",
				style: { kind: "straight", stroke: null, strokeWidth: null }
			}
		]
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#0c7f99",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 4,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 4,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "240",
				labelBottom: "100 percent"
			}
		],
		bottomTape: null,
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 6,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#7854ab",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 6,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 6,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "132",
				labelBottom: "150 percent"
			}
		],
		bottomTape: null,
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#0c7f99",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: null,
			extent: null,
			unitsTotal: 5,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 3,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "12",
				labelBottom: "60 percent"
			}
		],
		bottomTape: null,
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#7854ab",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 5,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 2,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "40",
				labelBottom: "100 percent"
			}
		],
		bottomTape: null,
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 10,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#7854ab",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Time (minutes)",
			extent: null,
			unitsTotal: 11,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 10,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 1.5
				},
				labelTop: "120",
				labelBottom: "100 percent"
			}
		],
		bottomTape: null,
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 10,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#0c7f99",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: null,
			extent: null,
			unitsTotal: 10,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 10,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 1.5
				},
				labelTop: "70",
				labelBottom: null
			},
			{
				span: {
					by: "units",
					endUnit: 10,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 1.5
				},
				labelTop: null,
				labelBottom: "100 percent"
			}
		],
		bottomTape: null,
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#7854ab",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 6,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 5,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "155",
				labelBottom: "100 percent"
			}
		],
		bottomTape: null,
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 10,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#0c7f99",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 10,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 10,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "90",
				labelBottom: "100 percent"
			}
		],
		bottomTape: null,
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 7,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#7854ab",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Time (minutes)",
			extent: null,
			unitsTotal: 10,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 7,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "91",
				labelBottom: "70 percent"
			}
		],
		bottomTape: null,
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 7,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#7854ab",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 7,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 7,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "14",
				labelBottom: "350 percent"
			}
		],
		bottomTape: null,
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [],
			label: null,
			extent: {
				by: "units",
				endUnit: 7,
				startUnit: 0
			},
			unitsTotal: 7,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 7,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Fruit mass",
				labelBottom: null
			},
			{
				span: {
					by: "units",
					endUnit: 5,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: null,
				labelBottom: "Biscuit mass"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [],
			label: null,
			extent: {
				by: "units",
				endUnit: 5,
				startUnit: 0
			},
			unitsTotal: 5,
			roundedCaps: false
		},
		referenceUnitsTotal: 7
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [],
			label: "Winning spaces",
			extent: {
				by: "units",
				endUnit: 5,
				startUnit: 0
			},
			unitsTotal: 5,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 5,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Winning spaces",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 6,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: " ",
				labelBottom: "Non-winning spaces"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [],
			label: "Non-winning spaces",
			extent: null,
			unitsTotal: 6,
			roundedCaps: false
		},
		referenceUnitsTotal: 6
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Prisms",
			extent: {
				by: "units",
				endUnit: 4,
				startUnit: 0
			},
			unitsTotal: 4,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 4,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "Prisms",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 1,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: " ",
				labelBottom: "Pyramids"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#aa87ff",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Pyramids",
			extent: {
				by: "units",
				endUnit: 1,
				startUnit: 0
			},
			unitsTotal: 1,
			roundedCaps: false
		},
		referenceUnitsTotal: 5
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 4,
				startUnit: 0
			},
			unitsTotal: 4,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 4,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "Luna's spells",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 5,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: " ",
				labelBottom: "Ginny's spells"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#aa87ff",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 5,
				startUnit: 0
			},
			unitsTotal: 5,
			roundedCaps: false
		},
		referenceUnitsTotal: 5
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: null,
			extent: {
				by: "percent",
				endPct: 60,
				startPct: 0
			},
			unitsTotal: 3,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "percent",
					endPct: 100,
					startPct: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Blue pieces",
				labelBottom: null
			},
			{
				span: {
					by: "percent",
					endPct: 100,
					startPct: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: null,
				labelBottom: "Purple pieces"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: null,
					style: {
						fill: "#aa87ff",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: null,
			extent: {
				by: "percent",
				endPct: 100,
				startPct: 0
			},
			unitsTotal: 5,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#ff9c39",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Cheese pizzas",
			extent: {
				by: "units",
				endUnit: 3,
				startUnit: 0
			},
			unitsTotal: 3,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 3,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "Cheese pizzas",
				labelBottom: null
			},
			{
				span: {
					by: "units",
					endUnit: 1,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: null,
				labelBottom: "Pepperoni pizzas"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#f9685d",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Pepperoni pizzas",
			extent: {
				by: "units",
				endUnit: 1,
				startUnit: 0
			},
			unitsTotal: 1,
			roundedCaps: false
		},
		referenceUnitsTotal: 3
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: null,
					style: {
						fill: "#ed5fa6",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Teeth per larger gear",
			extent: {
				by: "units",
				endUnit: 6,
				startUnit: 0
			},
			unitsTotal: 6,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "percent",
					endPct: 100,
					startPct: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Teeth per larger gear",
				labelBottom: "Teeth per larger gear"
			},
			{
				span: {
					by: "percent",
					endPct: 100,
					startPct: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Teeth per smaller gear",
				labelBottom: "Teeth per smaller gear"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Teeth per smaller gear",
			extent: {
				by: "units",
				endUnit: 1,
				startUnit: 0
			},
			unitsTotal: 1,
			roundedCaps: false
		},
		referenceUnitsTotal: 6
	},
	{
		type: "tapeDiagram",
		width: 300,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [],
			label: null,
			extent: null,
			unitsTotal: 3,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 3,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Flies",
				labelBottom: null
			},
			{
				span: {
					by: "units",
					endUnit: 7,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: null,
				labelBottom: "Mosquitoes"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [],
			label: null,
			extent: null,
			unitsTotal: 7,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#a75a05",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Text area",
			extent: {
				by: "units",
				endUnit: 3,
				startUnit: 0
			},
			unitsTotal: 3,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 3,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: 2
				},
				labelTop: "Text area",
				labelBottom: null
			},
			{
				span: {
					by: "units",
					endUnit: 2,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: 2
				},
				labelTop: null,
				labelBottom: "Illustration area"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#f9685d",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Illustration area",
			extent: {
				by: "units",
				endUnit: 2,
				startUnit: 0
			},
			unitsTotal: 2,
			roundedCaps: false
		},
		referenceUnitsTotal: 3
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [],
			label: '"',
			extent: {
				by: "units",
				endUnit: 5,
				startUnit: 0
			},
			unitsTotal: 5,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 5,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Brown notebooks",
				labelBottom: '"'
			},
			{
				span: {
					by: "units",
					endUnit: 3,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: '"',
				labelBottom: "Red notebooks"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [],
			label: '"',
			extent: {
				by: "units",
				endUnit: 3,
				startUnit: 0
			},
			unitsTotal: 3,
			roundedCaps: false
		},
		referenceUnitsTotal: 5
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [],
			label: null,
			extent: {
				by: "units",
				endUnit: 3,
				startUnit: 0
			},
			unitsTotal: 3,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "percent",
					endPct: 100,
					startPct: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 1.5
				},
				labelTop: "Kazoos",
				labelBottom: null
			},
			{
				span: {
					by: "percent",
					endPct: 100,
					startPct: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 1.5
				},
				labelTop: null,
				labelBottom: "Whistles"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [],
			label: null,
			extent: null,
			unitsTotal: 5,
			roundedCaps: false
		},
		referenceUnitsTotal: 5
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 0
					},
					label: null,
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				}
			],
			label: "Ducklings",
			extent: null,
			unitsTotal: 5,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 5,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Ducklings",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 1,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: " ",
				labelBottom: "Adult ducks"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: null,
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				}
			],
			label: "Adult ducks",
			extent: {
				by: "units",
				endUnit: 1,
				startUnit: 0
			},
			unitsTotal: 5,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: null,
					style: {
						fill: "#aa87ff",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 4,
				startUnit: 0
			},
			unitsTotal: 4,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 4,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 1.5
				},
				labelTop: "Solid balloons",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 3,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 1.5
				},
				labelTop: " ",
				labelBottom: "Striped balloons"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 3,
				startUnit: 0
			},
			unitsTotal: 3,
			roundedCaps: false
		},
		referenceUnitsTotal: 4
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: null,
					style: {
						fill: "#aa87ff",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Sugar",
			extent: {
				by: "units",
				endUnit: 3,
				startUnit: 0
			},
			unitsTotal: 3,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 3,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "Sugar",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 2,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: " ",
				labelBottom: "Cinnamon"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Cinnamon",
			extent: {
				by: "units",
				endUnit: 2,
				startUnit: 0
			},
			unitsTotal: 2,
			roundedCaps: false
		},
		referenceUnitsTotal: 3
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [],
			label: " ",
			extent: {
				by: "units",
				endUnit: 2,
				startUnit: 0
			},
			unitsTotal: 2,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 2,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Oil",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 1,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: " ",
				labelBottom: "Vinegar"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [],
			label: " ",
			extent: {
				by: "units",
				endUnit: 1,
				startUnit: 0
			},
			unitsTotal: 2,
			roundedCaps: false
		},
		referenceUnitsTotal: 2
	},
	{
		type: "tapeDiagram",
		width: 300,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Grandparents",
			extent: {
				by: "units",
				endUnit: 4,
				startUnit: 0
			},
			unitsTotal: 4,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 4,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Grandparents",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 6,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: " ",
				labelBottom: "Cousins"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 6,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#f9685d",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Cousins",
			extent: {
				by: "units",
				endUnit: 6,
				startUnit: 0
			},
			unitsTotal: 6,
			roundedCaps: false
		},
		referenceUnitsTotal: 6
	},
	{
		type: "tapeDiagram",
		width: 500,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Plantains",
			extent: {
				by: "units",
				endUnit: 4,
				startUnit: 0
			},
			unitsTotal: 4,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 4,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Plantains",
				labelBottom: "Plantains"
			},
			{
				span: {
					by: "units",
					endUnit: 12,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Spices, grams",
				labelBottom: "Spices, grams"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 12,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#f9685d",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Spices, grams",
			extent: null,
			unitsTotal: 12,
			roundedCaps: false
		},
		referenceUnitsTotal: 12
	},
	{
		type: "tapeDiagram",
		width: 300,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 10,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Blue volume",
			extent: null,
			unitsTotal: 10,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 10,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "Blue volume",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 6,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: " ",
				labelBottom: "Red volume"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 6,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#f9685d",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Red volume",
			extent: {
				by: "units",
				endUnit: 6,
				startUnit: 0
			},
			unitsTotal: 6,
			roundedCaps: false
		},
		referenceUnitsTotal: 10
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 8,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Days Zayn bikes",
			extent: {
				by: "units",
				endUnit: 8,
				startUnit: 0
			},
			unitsTotal: 8,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 8,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "Days Zayn bikes",
				labelBottom: null
			},
			{
				span: {
					by: "units",
					endUnit: 6,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: null,
				labelBottom: "Days Zayn walks"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 6,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#f9685d",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: "Days Zayn walks",
			extent: {
				by: "units",
				endUnit: 6,
				startUnit: 0
			},
			unitsTotal: 6,
			roundedCaps: false
		},
		referenceUnitsTotal: 8
	},
	{
		type: "tapeDiagram",
		width: 300,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 6,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 6,
				startUnit: 0
			},
			unitsTotal: 6,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 6,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Puzzles started",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 9,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: " ",
				labelBottom: "Puzzles not started"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 9,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#f9685d",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 9,
				startUnit: 0
			},
			unitsTotal: 9,
			roundedCaps: false
		},
		referenceUnitsTotal: 9
	},
	{
		type: "tapeDiagram",
		width: 300,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#63d9ea",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 3,
				startUnit: 0
			},
			unitsTotal: 3,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 3,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "Cats",
				labelBottom: " "
			},
			{
				span: {
					by: "units",
					endUnit: 9,
					startUnit: 0
				},
				tape: "bottom",
				style: {
					kind: "curly",
					stroke: null,
					strokeWidth: null
				},
				labelTop: " ",
				labelBottom: "Fish"
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 9,
						startUnit: 0
					},
					label: null,
					style: {
						fill: "#f9685d",
						kind: "solid",
						fillOpacity: 0.3
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 9,
				startUnit: 0
			},
			unitsTotal: 9,
			roundedCaps: false
		},
		referenceUnitsTotal: 9
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: {
						text: "19",
						placement: "inside"
					},
					style: {
						fill: "#e6e6e6",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 19,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 85,
						startPct: 0
					},
					label: {
						text: "16",
						placement: "inside"
					},
					style: {
						fill: "#cfe8ff",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 85
					},
					label: {
						text: "f",
						placement: "inside"
					},
					style: {
						fill: "#ffe6bf",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 19,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 65,
						startPct: 0
					},
					label: {
						text: "15 units",
						placement: "inside"
					},
					style: {
						fill: "#cfe8ff",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 65
					},
					label: {
						text: "x units",
						placement: "inside"
					},
					style: {
						fill: "#e6f5d0",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 100,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: {
						text: "23 units",
						placement: "inside"
					},
					style: {
						fill: "#f6d5d5",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 100,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 8,
						startUnit: 0
					},
					label: {
						text: "8 units",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				},
				{
					span: {
						by: "units",
						endUnit: 12,
						startUnit: 8
					},
					label: {
						text: "q units",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				}
			],
			label: null,
			extent: null,
			unitsTotal: 12,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 12,
						startUnit: 0
					},
					label: {
						text: "12 units",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				}
			],
			label: null,
			extent: null,
			unitsTotal: 12,
			roundedCaps: false
		},
		referenceUnitsTotal: 12
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 16,
						startUnit: 0
					},
					label: {
						text: "h",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				},
				{
					span: {
						by: "units",
						endUnit: 42,
						startUnit: 16
					},
					label: {
						text: "26",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				}
			],
			label: null,
			extent: null,
			unitsTotal: 42,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 42,
						startUnit: 0
					},
					label: {
						text: "42",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				}
			],
			label: null,
			extent: null,
			unitsTotal: 42,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 17,
						startUnit: 0
					},
					label: {
						text: "17",
						placement: "inside"
					},
					style: {
						fill: "#d0e6fa",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: "Top",
			extent: null,
			unitsTotal: 17,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 0
					},
					label: {
						text: "4",
						placement: "inside"
					},
					style: {
						fill: "#ffd89e",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "units",
						endUnit: 17,
						startUnit: 4
					},
					label: {
						text: "k",
						placement: "inside"
					},
					style: {
						fill: "#b7f0b1",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: "Bottom",
			extent: null,
			unitsTotal: 17,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "y",
						placement: "inside"
					},
					style: {
						fill: "#b3d3f2",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "y",
						placement: "inside"
					},
					style: {
						fill: "#b3d3f2",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 2
					},
					label: {
						text: "y",
						placement: "inside"
					},
					style: {
						fill: "#b3d3f2",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 3,
				startUnit: 0
			},
			unitsTotal: 3,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "24",
						placement: "inside"
					},
					style: {
						fill: "#f9d47a",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 3,
				startUnit: 0
			},
			unitsTotal: 1,
			roundedCaps: false
		},
		referenceUnitsTotal: 3
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [],
			label: " ",
			extent: null,
			unitsTotal: 25,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "percent",
					endPct: 100,
					startPct: 0
				},
				tape: "top",
				style: {
					kind: "straight",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "25 units",
				labelBottom: " "
			}
		],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 52,
						startPct: 0
					},
					label: {
						text: "x units",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				},
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 52
					},
					label: {
						text: "13 units",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 25,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [],
			label: " ",
			extent: null,
			unitsTotal: 5,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 5,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "straight",
					stroke: "#000000",
					strokeWidth: 2
				},
				labelTop: "35 units",
				labelBottom: " "
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "d units",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 1.5
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "d units",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 1.5
					}
				},
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 2
					},
					label: {
						text: "d units",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 1.5
					}
				},
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 3
					},
					label: {
						text: "d units",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 1.5
					}
				},
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 4
					},
					label: {
						text: "d units",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 1.5
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 5,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#FFFFFF",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#FFFFFF",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 2
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#FFFFFF",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 3
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#FFFFFF",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 4
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#FFFFFF",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 6,
						startUnit: 5
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#FFFFFF",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 6,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "36",
						placement: "inside"
					},
					style: {
						fill: "#FFFFFF",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 1,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: {
						text: "24",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 8,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "q",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "q",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 2
					},
					label: {
						text: "q",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 3
					},
					label: {
						text: "q",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 4
					},
					label: {
						text: "q",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 6,
						startUnit: 5
					},
					label: {
						text: "q",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 7,
						startUnit: 6
					},
					label: {
						text: "q",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 8,
						startUnit: 7
					},
					label: {
						text: "q",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 8,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "s",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "s",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 2
					},
					label: {
						text: "s",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 3
					},
					label: {
						text: "s",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 4,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "20",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 1,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [],
			label: " ",
			extent: null,
			unitsTotal: 7,
			roundedCaps: false
		},
		brackets: [
			{
				span: {
					by: "units",
					endUnit: 7,
					startUnit: 0
				},
				tape: "top",
				style: {
					kind: "straight",
					stroke: null,
					strokeWidth: null
				},
				labelTop: "63",
				labelBottom: " "
			}
		],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "m",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "m",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 2
					},
					label: {
						text: "m",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 3
					},
					label: {
						text: "m",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 4
					},
					label: {
						text: "m",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 6,
						startUnit: 5
					},
					label: {
						text: "m",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 7,
						startUnit: 6
					},
					label: {
						text: "m",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 7,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 16,
						startUnit: 0
					},
					label: {
						text: "16",
						placement: "inside"
					},
					style: {
						fill: "#e6f2ff",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 16,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "y",
						placement: "inside"
					},
					style: {
						fill: "#d9ead3",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "y",
						placement: "inside"
					},
					style: {
						fill: "#d9ead3",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 2
					},
					label: {
						text: "y",
						placement: "inside"
					},
					style: {
						fill: "#d9ead3",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 3
					},
					label: {
						text: "y",
						placement: "inside"
					},
					style: {
						fill: "#d9ead3",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 4,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 480,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "y",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "y",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 2,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 0
					},
					label: {
						text: "7",
						placement: "inside"
					},
					style: {
						kind: "outline",
						stroke: "#000000",
						strokeWidth: 2
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 2,
			roundedCaps: false
		},
		referenceUnitsTotal: 2
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 28,
						startPct: 0
					},
					label: {
						text: "1/4",
						placement: "inside"
					},
					style: {
						fill: "#11accd",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 28
					},
					label: {
						text: "m",
						placement: "inside"
					},
					style: {
						fill: "#ffd05b",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 10,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: {
						text: "2/3",
						placement: "inside"
					},
					style: {
						fill: "#c1e3f3",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 10,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: {
						text: "25",
						placement: "inside"
					},
					style: {
						fill: "#d0e8ff",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 10,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 40,
						startPct: 0
					},
					label: {
						text: "10",
						placement: "inside"
					},
					style: {
						fill: "#ffe0b2",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 40
					},
					label: {
						text: "w",
						placement: "inside"
					},
					style: {
						fill: "#d5f5d5",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 10,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 52,
						startPct: 0
					},
					label: {
						text: "a",
						placement: "inside"
					},
					style: {
						fill: "#b3d9ff",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 52
					},
					label: {
						text: "17",
						placement: "inside"
					},
					style: {
						fill: "#f2f2f2",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: "Top",
			extent: null,
			unitsTotal: 100,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: {
						text: "35",
						placement: "inside"
					},
					style: {
						fill: "#e6f5d6",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: "Bottom",
			extent: null,
			unitsTotal: 100,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: {
						text: "20",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 1,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 50,
						startPct: 0
					},
					label: {
						text: "g",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 50
					},
					label: {
						text: "g",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 2,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 13,
						startUnit: 0
					},
					label: {
						text: "13",
						placement: "inside"
					},
					style: {
						fill: "#cce5ff",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "units",
						endUnit: 17,
						startUnit: 13
					},
					label: {
						text: "t",
						placement: "inside"
					},
					style: {
						fill: "#ffd6a5",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 17,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 17,
						startUnit: 0
					},
					label: {
						text: "17",
						placement: "inside"
					},
					style: {
						fill: "#e8f5e9",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 17,
			roundedCaps: false
		},
		referenceUnitsTotal: 17
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 2
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 3
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 4
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 6,
						startUnit: 5
					},
					label: {
						text: "p",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 6,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "120",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 1,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "t",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "t",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 2
					},
					label: {
						text: "t",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 3
					},
					label: {
						text: "t",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 4
					},
					label: {
						text: "t",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 6,
						startUnit: 5
					},
					label: {
						text: "t",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 6,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "9",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 1,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "1.75 units",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 1,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 1,
						startUnit: 0
					},
					label: {
						text: "n units",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 2,
						startUnit: 1
					},
					label: {
						text: "n units",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 3,
						startUnit: 2
					},
					label: {
						text: "n units",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 4,
						startUnit: 3
					},
					label: {
						text: "n units",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				},
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 4
					},
					label: {
						text: "n units",
						placement: "inside"
					},
					style: {
						fill: "#ffffff",
						kind: "solid",
						fillOpacity: 0
					}
				}
			],
			label: " ",
			extent: null,
			unitsTotal: 5,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 480,
		height: 300,
		topTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 60,
						startPct: 0
					},
					label: {
						text: "w",
						placement: "inside"
					},
					style: {
						fill: "#cfe8ff",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 60
					},
					label: {
						text: "1.3",
						placement: "inside"
					},
					style: {
						fill: "#ffd1a9",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: "Top",
			extent: null,
			unitsTotal: 10,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: false },
			fills: [
				{
					span: {
						by: "percent",
						endPct: 100,
						startPct: 0
					},
					label: {
						text: "2.7",
						placement: "inside"
					},
					style: {
						fill: "#d5f5e3",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: "Bottom",
			extent: null,
			unitsTotal: 10,
			roundedCaps: false
		},
		referenceUnitsTotal: null
	},
	{
		type: "tapeDiagram",
		width: 320,
		height: 300,
		topTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 11,
						startUnit: 0
					},
					label: {
						text: "11",
						placement: "inside"
					},
					style: {
						fill: "#dbe9ff",
						kind: "solid",
						fillOpacity: 1
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 11,
				startUnit: 0
			},
			unitsTotal: 11,
			roundedCaps: false
		},
		brackets: [],
		bottomTape: {
			grid: { show: true },
			fills: [
				{
					span: {
						by: "units",
						endUnit: 5,
						startUnit: 0
					},
					label: {
						text: "5",
						placement: "inside"
					},
					style: {
						fill: "#cbb7f7",
						kind: "solid",
						fillOpacity: 1
					}
				},
				{
					span: {
						by: "units",
						endUnit: 11,
						startUnit: 5
					},
					label: {
						text: "b",
						placement: "inside"
					},
					style: {
						kind: "hatch",
						color: "#000000",
						spacing: 4,
						angleDeg: 45,
						strokeWidth: 1
					}
				}
			],
			label: " ",
			extent: {
				by: "units",
				endUnit: 11,
				startUnit: 0
			},
			unitsTotal: 11,
			roundedCaps: false
		},
		referenceUnitsTotal: 11
	}
]
