import type { NumberLineProps } from "@/widgets/generators/number-line"

type NumberLineWithoutNulls = Omit<NumberLineProps, "segments" | "model"> &
	Partial<Pick<NumberLineProps, "segments" | "model">>

const RAW_NUMBER_LINE_EXAMPLES: NumberLineWithoutNulls[] = [
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: 0,
		max: 10,
		tickInterval: { type: "whole", interval: 1 },
		secondaryTickInterval: null,
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "whole",
				position: 3,
				color: "#4285F4",
				style: "dot",
				value: 3,
				sign: "+"
			},
			{
				type: "mixed",
				position: 7.5,
				color: "#FF6B6B",
				style: "dot",
				whole: 7,
				numerator: 1,
				denominator: 2,
				sign: "+"
			}
		]
	},
	{
		type: "numberLine",
		width: 400,
		height: 300,
		orientation: "horizontal",
		min: -5,
		max: 5,
		tickInterval: { type: "whole", interval: 1 },
		secondaryTickInterval: null,
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "whole",
				position: -2,
				color: "#34A853",
				style: "dot",
				value: 2,
				sign: "-"
			},
			{
				type: "whole",
				position: 4,
				color: "#FF6B6B",
				style: "dot",
				value: 4,
				sign: "+"
			}
		]
	},
	// Example mirroring the provided diagram: two blue dots and an unknown box, label 125 on right dot
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: 0,
		max: 200,
		tickInterval: { type: "whole", interval: 25 },
		secondaryTickInterval: { type: "whole", interval: 5 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "whole",
				position: 80,
				color: "#1E40AF",
				style: "dot",
				value: 80,
				sign: "+"
			},
			{
				type: "whole",
				position: 125,
				color: "#1E40AF",
				style: "dot",
				value: 125,
				sign: "+"
			},
			{
				type: "mathml",
				position: 60,
				color: "#111111",
				style: "dot",
				mathml: "<mo>?</mo>"
			}
		],
		segments: null,
		model: null
	},
	// Example: labeled variables s, t, u at -8.5, -6.5, -5 respectively with halves as minor ticks
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: -9,
		max: -4,
		tickInterval: { type: "whole", interval: 1 },
		secondaryTickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				position: -8.5,
				color: "#5B8FF9",
				style: "dot",
				mathml: "<mi>s</mi>"
			},
			{
				type: "mathml",
				position: -6.5,
				color: "#5B8FF9",
				style: "dot",
				mathml: "<mi>t</mi>"
			},
			{
				type: "mathml",
				position: -5,
				color: "#5B8FF9",
				style: "dot",
				mathml: "<mi>u</mi>"
			}
		]
	},
	// Example: single variable a to the left of 0 (variant 1)
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: -6,
		max: 6,
		tickInterval: { type: "whole", interval: 1 },
		secondaryTickInterval: null,
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				position: -3,
				color: "#5B8FF9",
				style: "dot",
				mathml: "<mi>a</mi>"
			}
		]
	},
	// Example: single variable a to the left of 0 (variant 2)
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: -6,
		max: 6,
		tickInterval: { type: "whole", interval: 1 },
		secondaryTickInterval: null,
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				position: -2,
				color: "#5B8FF9",
				style: "dot",
				mathml: "<mi>a</mi>"
			}
		],
		segments: null,
		model: null
	},
	// Example: fractional points -5/2 and 2/3 with distinct colors
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: -5,
		max: 2,
		tickInterval: { type: "whole", interval: 1 },
		secondaryTickInterval: null,
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "fraction",
				position: -2.5,
				color: "#D946EF",
				style: "dot",
				numerator: 5,
				denominator: 2,
				sign: "-"
			},
			{
				type: "fraction",
				position: -2 / 3,
				color: "#7C3AED",
				style: "dot",
				numerator: 2,
				denominator: 3,
				sign: "+"
			}
		],
		segments: null,
		model: null
	},
	// New: Thirds with labeled points a, b, c
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: -2 / 3,
		max: 1 / 3,
		tickInterval: { type: "fraction", denominator: 3 },
		secondaryTickInterval: null,
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				position: -0.5,
				color: "#2CA6DF",
				style: "dot",
				mathml: "<mi>a</mi>"
			},
			{
				type: "mathml",
				position: -0.28,
				color: "#C2185B",
				style: "dot",
				mathml: "<mi>b</mi>"
			},
			{
				type: "mathml",
				position: -0.2,
				color: "#2E7D32",
				style: "dot",
				mathml: "<mi>c</mi>"
			}
		],
		segments: null,
		model: null
	},
	// New: Thirds with model bar of 5 cells and segment from 0 to 1
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: 0,
		max: 5 / 3,
		tickInterval: { type: "fraction", denominator: 3 },
		secondaryTickInterval: null,
		showTickLabels: true,
		highlightedPoints: null,
		segments: [{ start: 0, end: 1, color: "#6EC6FF" }],
		model: {
			totalCells: 5,
			cellGroups: [{ count: 3, color: "#A7D8EB" }],
			bracketLabel: ""
		}
	},
	// New: Halves across 0..5 with 10-cell model and segment 0..1
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: 0,
		max: 5,
		tickInterval: { type: "fraction", denominator: 2 },
		secondaryTickInterval: null,
		showTickLabels: true,
		highlightedPoints: null,
		segments: [{ start: 0, end: 1, color: "#6EC6FF" }],
		model: {
			totalCells: 10,
			cellGroups: [{ count: 3, color: "#A7D8EB" }],
			bracketLabel: ""
		}
	},
	// New: Fifths across 0..2 with 10-cell model and segment 0..1
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: 0,
		max: 2,
		tickInterval: { type: "fraction", denominator: 5 },
		secondaryTickInterval: null,
		showTickLabels: true,
		highlightedPoints: null,
		segments: [{ start: 0, end: 1, color: "#6EC6FF" }],
		model: {
			totalCells: 10,
			cellGroups: [{ count: 6, color: "#A7D8EB" }],
			bracketLabel: ""
		}
	},
	// Extracted from question: x0af75497ef49eb7f
	// Question: Change in temperature from Wednesday to Thursday
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -20,
		max: 0,
		tickInterval: { type: "whole", interval: 5 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>Friday</mtext><mo>:</mo><mo>-</mo><mn>18</mn><mo>°</mo><mi>C</mi></mrow>",
				position: -18
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>Wednesday</mtext><mo>:</mo><mo>-</mo><mn>13</mn><mo>°</mo><mi>C</mi></mrow>",
				position: -13
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>Tuesday</mtext><mo>:</mo><mo>-</mo><mn>11</mn><mo>°</mo><mi>C</mi></mrow>",
				position: -11
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>Thursday</mtext><mo>:</mo><mo>-</mo><mn>8</mn><mo>°</mo><mi>C</mi></mrow>",
				position: -8
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>Monday</mtext><mo>:</mo><mo>-</mo><mn>4</mn><mo>°</mo><mi>C</mi></mrow>",
				position: -4
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xf74910c2ce997c62
	// Question: Identify the city 3 °C colder than Williston
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -50,
		max: -40,
		tickInterval: { type: "whole", interval: 5 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mtext>Bowman: </mtext><mo>-</mo><mn>47</mn><mo>°</mo><mi>C</mi>",
				position: -47
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mtext>Williston: </mtext><mo>-</mo><mn>44</mn><mo>°</mo><mi>C</mi>",
				position: -44
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mtext>Minot: </mtext><mo>-</mo><mn>42</mn><mo>°</mo><mi>C</mi>",
				position: -42
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mtext>Bismarck: </mtext><mo>-</mo><mn>41</mn><mo>°</mo><mi>C</mi>",
				position: -41
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mtext>Jamestown: </mtext><mo>-</mo><mn>40</mn><mo>°</mo><mi>C</mi>",
				position: -40
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xb242080383738fde
	// Question: Identify the city 1 °C colder than Bismarck
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -50,
		max: -40,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>Bowman: </mtext><mo>-</mo><mn>47</mn><mo>°</mo><mi>C</mi></mrow>",
				position: -47
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>Williston: </mtext><mo>-</mo><mn>44</mn><mo>°</mo><mi>C</mi></mrow>",
				position: -44
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>Minot: </mtext><mo>-</mo><mn>42</mn><mo>°</mo><mi>C</mi></mrow>",
				position: -42
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>Bismarck: </mtext><mo>-</mo><mn>41</mn><mo>°</mo><mi>C</mi></mrow>",
				position: -41
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>Jamestown: </mtext><mo>-</mo><mn>40</mn><mo>°</mo><mi>C</mi></mrow>",
				position: -40
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xc52a5aa891289c50
	// Question: Change in temperature from Monday to Wednesday
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -20,
		max: 0,
		tickInterval: { type: "whole", interval: 5 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>Friday: negative 18 degrees Celsius</mtext>",
				position: -18
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>Wednesday: negative 13 degrees Celsius</mtext>",
				position: -13
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>Tuesday: negative 11 degrees Celsius</mtext>",
				position: -11
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>Thursday: negative 8 degrees Celsius</mtext>",
				position: -8
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>Monday: negative 4 degrees Celsius</mtext>",
				position: -4
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x45dbfd7b60c55ec8
	// Question: What will the penguin find after diving deeper?
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -90,
		max: 10,
		tickInterval: { type: "whole", interval: 10 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>krill: negative </mtext><mn>86</mn><mtext> meters</mtext></mrow>",
				position: -86
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>adult penguin: negative </mtext><mn>59</mn><mtext> meters</mtext></mrow>",
				position: -59
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>sardine: negative </mtext><mn>32</mn><mtext> meters</mtext></mrow>",
				position: -32
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>anchovy: negative </mtext><mn>22</mn><mtext> meters</mtext></mrow>",
				position: -22
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>surface of water: </mtext><mn>0</mn><mtext> meters</mtext></mrow>",
				position: 0
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml:
					"<mrow><mtext>penguin chick: </mtext><mn>5</mn><mtext> meters</mtext></mrow>",
				position: 5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x2823d70029fc1298
	// Question: Find an item on a vertical number line after moving up
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -90,
		max: 10,
		tickInterval: { type: "whole", interval: 10 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>krill: negative 86 meters</mtext>",
				position: -86
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>adult penguin: negative 59 meters</mtext>",
				position: -59
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>sardine: negative 32 meters</mtext>",
				position: -32
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>anchovy: negative 22 meters</mtext>",
				position: -22
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>surface of water: 0 meters</mtext>",
				position: 0
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>penguin chick: 5 meters</mtext>",
				position: 5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x0a03f1a2a926bffa
	// Question: Match values to their meanings on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -100,
		max: 20,
		tickInterval: { type: "whole", interval: 20 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#a75a05",
				style: "dot",
				mathml: "<mtext>Carbon dioxide</mtext>",
				position: -78
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>Water</mtext>",
				position: 0
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x3439ba4c308f386b
	// Question: True statements about positions on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 380,
		height: 300,
		orientation: "horizontal",
		min: -10,
		max: 10,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#a75a05",
				style: "dot",
				mathml: "<mtext>Kendra</mtext>",
				position: -6
			},
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>Jamal</mtext>",
				position: 0
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x663e2f4f73d9ee79
	// Question: Interpret a positive temperature on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -10,
		max: 10,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#a75a05",
				style: "dot",
				mathml: "<mtext>Temuco</mtext>",
				position: 7
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x4bfd696981b7127c
	// Question: Interpret a negative bill amount and absolute value
	// Widget key: image_1
	{
		type: "numberLine",
		width: 380,
		height: 300,
		orientation: "horizontal",
		min: -400,
		max: 400,
		tickInterval: { type: "whole", interval: 100 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "whole",
				sign: "-",
				color: "#a75a05",
				style: "dot",
				value: 250,
				position: -250
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x78e22152b5909760
	// Question: Interpret a number line for a gas bill
	// Widget key: image_1
	{
		type: "numberLine",
		width: 380,
		height: 300,
		orientation: "horizontal",
		min: -100,
		max: 100,
		tickInterval: { type: "whole", interval: 25 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#a75a05",
				style: "dot",
				mathml: "<mtext>Carrie's bill</mtext>",
				position: 75
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xfe3aa964c3345520
	// Question: Average temperature in Ulaanbaatar (March) on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 500,
		orientation: "vertical",
		min: -12,
		max: 4,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "whole",
				sign: "-",
				color: "#a75a05",
				style: "dot",
				value: 8,
				position: -8
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x8b9e8ddc0e6e073b
	// Question: True statements about Lhasa's elevation
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -4000,
		max: 4000,
		tickInterval: { type: "whole", interval: 1000 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mtext>sea level</mtext>",
				position: 0
			},
			{
				type: "mathml",
				color: "#a75a05",
				style: "dot",
				mathml: "<mtext>Lhasa</mtext>",
				position: 3656
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xfdbe9b42922b9edf
	// Question: Match values to their meanings on a vertical number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -3,
		max: 3,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>sea level</mtext>",
				position: 0
			},
			{
				type: "mathml",
				color: "#a75a05",
				style: "dot",
				mathml: "<mtext>New Orleans</mtext>",
				position: -2
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x85500f36b27c686e
	// Question: Bean bag location and distance on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 380,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>hole</mtext>",
				position: 0
			},
			{
				type: "mathml",
				color: "#a75a05",
				style: "dot",
				mathml: "<mtext>bean bag</mtext>",
				position: -4
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xffe2d25563b2334c
	// Question: Match values to meanings: credit card balance on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 380,
		height: 300,
		orientation: "horizontal",
		min: -200,
		max: 1000,
		tickInterval: { type: "whole", interval: 200 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "whole",
				sign: "+",
				color: "#a75a05",
				style: "dot",
				value: 600,
				position: 600
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x0ddc47203b87395f
	// Question: Elevation of Lima: absolute value and position relative to sea level
	// Widget key: image_1
	{
		type: "numberLine",
		width: 300,
		height: 325,
		orientation: "vertical",
		min: -200,
		max: 200,
		tickInterval: { type: "whole", interval: 50 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mtext>Lima</mtext>",
				position: 154
			},
			{
				type: "mathml",
				color: "#333333",
				style: "dot",
				mathml: "<mtext>sea level</mtext>",
				position: 0
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x3fbc546d5ef83967
	// Question: Whose statement about the marble is true?
	// Widget key: image_1
	{
		type: "numberLine",
		width: 380,
		height: 300,
		orientation: "horizontal",
		min: -5,
		max: 5,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#0c7f99",
				style: "dot",
				mathml: "<mtext>Hole</mtext>",
				position: 0
			},
			{
				type: "mathml",
				color: "#a75a05",
				style: "dot",
				mathml: "<mtext>Marble</mtext>",
				position: 3
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xe6ce0ba1a0c0daa5
	// Question: Choose the graph of x > -2
	// Widget key: choice_c_graph
	{
		type: "numberLine",
		width: 360,
		height: 300,
		orientation: "horizontal",
		min: -5,
		max: 5,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "whole",
				sign: "-",
				color: "#7854AB",
				style: "dot",
				value: 2,
				position: -2
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x0ea6ddf2623b5753
	// Question: Choose the graph of x > -4
	// Widget key: choice_b_nl
	{
		type: "numberLine",
		width: 500,
		height: 300,
		orientation: "horizontal",
		min: -5,
		max: 5,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "whole",
				sign: "-",
				color: "#000000",
				style: "dot",
				value: 4,
				position: -4
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xac4daf3ec3b769cb
	// Question: Choose the inequality that matches the number line
	// Widget key: choice_b_visual
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -5,
		max: 5,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "whole",
				sign: "+",
				color: "#29abca",
				style: "dot",
				value: 2,
				position: 2
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x6d35fcf1b7fa9959
	// Question: Locate −C on a number line
	// Widget key: number_line_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#ffa500",
				style: "dot",
				mathml: "<mo>-</mo><mi>C</mi>",
				position: 0.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x6d35fcf1b7fa9959
	// Question: Locate −C on a number line
	// Widget key: number_line_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#ffa500",
				style: "dot",
				mathml: "<mo>-</mo><mi>C</mi>",
				position: -0.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x6d35fcf1b7fa9959
	// Question: Locate −C on a number line
	// Widget key: number_line_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#ffa500",
				style: "dot",
				mathml: "<mo>-</mo><mi>C</mi>",
				position: -1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x9bdd37009fb0e6e0
	// Question: Value of -C on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -4,
		max: 4,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#1f77b4",
				style: "dot",
				mathml: "<mi>C</mi>",
				position: 0
			}
		],
		secondaryTickInterval: { type: "fraction", denominator: 2 }
	},
	// Extracted from question: x6260dd813b89d59e
	// Question: Place −A on a number line
	// Widget key: nl_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>A</mi>",
				position: 3
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x6260dd813b89d59e
	// Question: Place −A on a number line
	// Widget key: nl_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#ffa500",
				style: "dot",
				mathml: "<mo>-</mo><mi>A</mi>",
				position: -3
			},
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>A</mi>",
				position: 3
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x6260dd813b89d59e
	// Question: Place −A on a number line
	// Widget key: nl_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#ffa500",
				style: "dot",
				mathml: "<mo>-</mo><mi>A</mi>",
				position: 3
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xf24d398f5541a761
	// Question: Locate the opposite of a number on a number line
	// Widget key: nl_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ED",
				style: "dot",
				mathml: "<mo>-</mo><mi>F</mi>",
				position: 0.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xf24d398f5541a761
	// Question: Locate the opposite of a number on a number line
	// Widget key: nl_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ED",
				style: "dot",
				mathml: "<mo>-</mo><mi>F</mi>",
				position: -0.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xf24d398f5541a761
	// Question: Locate the opposite of a number on a number line
	// Widget key: nl_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ED",
				style: "dot",
				mathml: "<mo>-</mo><mi>F</mi>",
				position: 1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xbaadddeb
	// Question: Point representing -(-10) on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -5,
		max: 10,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>A</mi>",
				position: -4
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>B</mi>",
				position: -2
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>C</mi>",
				position: 6
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>D</mi>",
				position: 7
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>E</mi>",
				position: 10
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x57b35c359b98a3f4
	// Question: Find −D on the number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>D</mi>",
				position: -1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xc527646af4c9351b
	// Question: Find the opposite on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -0.6,
		max: 0.6,
		tickInterval: { type: "whole", interval: 0.2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>F</mi>",
				position: -0.4
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x4258e7f78f578111
	// Question: Place the point for -(-B) on a number line
	// Widget key: number_line_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#F39C12",
				style: "dot",
				mathml:
					"<mo>-</mo><mrow><mo>(</mo><mo>-</mo><mi>B</mi><mo>)</mo></mrow>",
				position: 3
			}
		],
		secondaryTickInterval: { type: "whole", interval: 1 }
	},
	// Extracted from question: x4258e7f78f578111
	// Question: Place the point for -(-B) on a number line
	// Widget key: number_line_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#F39C12",
				style: "dot",
				mathml:
					"<mo>-</mo><mrow><mo>(</mo><mo>-</mo><mi>B</mi><mo>)</mo></mrow>",
				position: -3
			}
		],
		secondaryTickInterval: { type: "whole", interval: 1 }
	},
	// Extracted from question: x4258e7f78f578111
	// Question: Place the point for -(-B) on a number line
	// Widget key: number_line_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#F39C12",
				style: "dot",
				mathml:
					"<mo>-</mo><mrow><mo>(</mo><mo>-</mo><mi>B</mi><mo>)</mo></mrow>",
				position: 0
			}
		],
		secondaryTickInterval: { type: "whole", interval: 1 }
	},
	// Extracted from question: xf3d9cc00e32d464f
	// Question: Find the opposite of a labeled point on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>A</mi>",
				position: 5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xb258023ca47a4510
	// Question: Find the value of -(-D) from the number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>D</mi>",
				position: -1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xc1ac295ed6fa5fa1
	// Question: Locate the opposite number on a number line
	// Widget key: nl_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mi>A</mi>",
				position: 0
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xc1ac295ed6fa5fa1
	// Question: Locate the opposite number on a number line
	// Widget key: nl_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#0066CC",
				style: "dot",
				mathml: "<mi>A</mi>",
				position: 0
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xc1ac295ed6fa5fa1
	// Question: Locate the opposite number on a number line
	// Widget key: nl_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#8E44AD",
				style: "dot",
				mathml: "<mo>-</mo><mi>A</mi>",
				position: 3
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x0a5a1f1a80352070
	// Question: Locate −E on a number line
	// Widget key: nl_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -4,
		max: 4,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mi>E</mi>",
				position: 2.5
			}
		],
		secondaryTickInterval: { type: "fraction", denominator: 2 }
	},
	// Extracted from question: x0a5a1f1a80352070
	// Question: Locate −E on a number line
	// Widget key: nl_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -4,
		max: 4,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mi>E</mi>",
				position: -2.5
			}
		],
		secondaryTickInterval: { type: "fraction", denominator: 2 }
	},
	// Extracted from question: x0a5a1f1a80352070
	// Question: Locate −E on a number line
	// Widget key: nl_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -4,
		max: 4,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mi>E</mi>",
				position: -3
			}
		],
		secondaryTickInterval: { type: "fraction", denominator: 2 }
	},
	// Extracted from question: xbccdde0de8c444be
	// Question: Select the position of -(-B) on a number line
	// Widget key: number_line_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml:
					"<mo>-</mo><mrow><mo>(</mo><mo>-</mo><mi>B</mi><mo>)</mo></mrow>",
				position: 0
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xbccdde0de8c444be
	// Question: Select the position of -(-B) on a number line
	// Widget key: number_line_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml:
					"<mo>-</mo><mrow><mo>(</mo><mo>-</mo><mi>B</mi><mo>)</mo></mrow>",
				position: 1
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xbccdde0de8c444be
	// Question: Select the position of -(-B) on a number line
	// Widget key: number_line_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml:
					"<mo>-</mo><mrow><mo>(</mo><mo>-</mo><mi>B</mi><mo>)</mo></mrow>",
				position: -1
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x5c584447c7fbea75
	// Question: Find −E on the number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -0.6,
		max: 0.6,
		tickInterval: { type: "whole", interval: 0.2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>E</mi>",
				position: 0.2
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xf70235524a56eeb0
	// Question: Locate -(-D) on a number line
	// Widget key: number_line_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mo>(</mo><mo>-</mo><mi>D</mi><mo>)</mo>",
				position: -0.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xf70235524a56eeb0
	// Question: Locate -(-D) on a number line
	// Widget key: number_line_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mo>(</mo><mo>-</mo><mi>D</mi><mo>)</mo>",
				position: 0.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xf70235524a56eeb0
	// Question: Locate -(-D) on a number line
	// Widget key: number_line_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mo>(</mo><mo>-</mo><mi>D</mi><mo>)</mo>",
				position: 1
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xd2a3d7af
	// Question: Identify the point representing -(-2) on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -5,
		max: 10,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>A</mi>",
				position: -5
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>B</mi>",
				position: -4
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>C</mi>",
				position: -2
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>D</mi>",
				position: 2
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>E</mi>",
				position: 5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x8aa5a97c4a23bc52
	// Question: Locate -(-E) on a number line
	// Widget key: nl_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -4,
		max: 4,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>•</mo>",
				position: -3.5
			}
		],
		secondaryTickInterval: { type: "fraction", denominator: 2 }
	},
	// Extracted from question: x8aa5a97c4a23bc52
	// Question: Locate -(-E) on a number line
	// Widget key: nl_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -4,
		max: 4,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>•</mo>",
				position: 3.5
			}
		],
		secondaryTickInterval: { type: "fraction", denominator: 2 }
	},
	// Extracted from question: x8aa5a97c4a23bc52
	// Question: Locate -(-E) on a number line
	// Widget key: nl_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -4,
		max: 4,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>•</mo>",
				position: 2.5
			}
		],
		secondaryTickInterval: { type: "fraction", denominator: 2 }
	},
	// Extracted from question: x48c1bee527871e57
	// Question: Identify −D on the number line
	// Widget key: choice_a_number_line
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#ffa500",
				style: "dot",
				mathml: "<mo>-</mo><mi>D</mi>",
				position: -1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x48c1bee527871e57
	// Question: Identify −D on the number line
	// Widget key: choice_b_number_line
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#ffa500",
				style: "dot",
				mathml: "<mo>-</mo><mi>D</mi>",
				position: 1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x48c1bee527871e57
	// Question: Identify −D on the number line
	// Widget key: choice_c_number_line
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#ffa500",
				style: "dot",
				mathml: "<mo>-</mo><mi>D</mi>",
				position: 0.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x71fd721566a5360d
	// Question: Value of negative C on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>C</mi>",
				position: 0.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x8fa3e41ee11413a6
	// Question: Locate −(−A) on a number line
	// Widget key: number_line_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mo>(</mo><mo>-</mo><mi>A</mi><mo>)</mo>",
				position: 5
			}
		],
		secondaryTickInterval: { type: "whole", interval: 1 }
	},
	// Extracted from question: x8fa3e41ee11413a6
	// Question: Locate −(−A) on a number line
	// Widget key: number_line_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mo>(</mo><mo>-</mo><mi>A</mi><mo>)</mo>",
				position: -5
			}
		],
		secondaryTickInterval: { type: "whole", interval: 1 }
	},
	// Extracted from question: x8fa3e41ee11413a6
	// Question: Locate −(−A) on a number line
	// Widget key: number_line_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mo>(</mo><mo>-</mo><mi>A</mi><mo>)</mo>",
				position: 0
			}
		],
		secondaryTickInterval: { type: "whole", interval: 1 }
	},
	// Extracted from question: xa3c11a88943b406b
	// Question: Locate -(-C) on a number line
	// Widget key: number_line_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mo>(</mo><mo>-</mo><mi>C</mi><mo>)</mo>",
				position: 1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xa3c11a88943b406b
	// Question: Locate -(-C) on a number line
	// Widget key: number_line_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mo>(</mo><mo>-</mo><mi>C</mi><mo>)</mo>",
				position: -1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xa3c11a88943b406b
	// Question: Locate -(-C) on a number line
	// Widget key: number_line_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml: "<mo>-</mo><mo>(</mo><mo>-</mo><mi>C</mi><mo>)</mo>",
				position: 0.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x8fb40438b7f86b03
	// Question: Evaluate a double negative on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -8,
		max: 8,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>A</mi>",
				position: 6
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x86b2a3e066427391
	// Question: Evaluate a double negative on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>C</mi>",
				position: 1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x62c748d6
	// Question: Identify the point representing -(-7) on a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -7,
		max: 7,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>A</mi>",
				position: -7
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>B</mi>",
				position: -2
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>C</mi>",
				position: 3
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>D</mi>",
				position: 4
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>E</mi>",
				position: 7
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: xec3627429af7b5ea
	// Question: Evaluate -(-E) from a number line
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -0.6,
		max: 0.6,
		tickInterval: { type: "whole", interval: 0.2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#6495ed",
				style: "dot",
				mathml: "<mi>E</mi>",
				position: 0.6
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x2d9a73dec8936789
	// Question: Locate -(-F) on a number line
	// Widget key: number_line_choice_a
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml:
					"<mo>-</mo><mrow><mo>(</mo><mo>-</mo><mi>F</mi><mo>)</mo></mrow>",
				position: -1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x2d9a73dec8936789
	// Question: Locate -(-F) on a number line
	// Widget key: number_line_choice_b
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml:
					"<mo>-</mo><mrow><mo>(</mo><mo>-</mo><mi>F</mi><mo>)</mo></mrow>",
				position: 1.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x2d9a73dec8936789
	// Question: Locate -(-F) on a number line
	// Widget key: number_line_choice_c
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -2,
		max: 2,
		tickInterval: { type: "fraction", denominator: 2 },
		showTickLabels: true,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#E67E22",
				style: "dot",
				mathml:
					"<mo>-</mo><mrow><mo>(</mo><mo>-</mo><mi>F</mi><mo>)</mo></mrow>",
				position: -0.5
			}
		],
		secondaryTickInterval: null
	},
	// Extracted from question: x11099043
	// Question: Identify the point representing the opposite of negative four
	// Widget key: image_1
	{
		type: "numberLine",
		width: 460,
		height: 300,
		orientation: "horizontal",
		min: -5,
		max: 10,
		tickInterval: { type: "whole", interval: 1 },
		showTickLabels: false,
		highlightedPoints: [
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>A</mi>",
				position: -4
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>B</mi>",
				position: -2
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>C</mi>",
				position: 4
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>D</mi>",
				position: 7
			},
			{
				type: "mathml",
				color: "#000000",
				style: "dot",
				mathml: "<mi>E</mi>",
				position: 9
			}
		],
		secondaryTickInterval: null
	}
]

export const numberLineExamples: NumberLineProps[] =
	RAW_NUMBER_LINE_EXAMPLES.map((ex) => ({
		...ex,
		segments: ex.segments ?? null,
		model: ex.model ?? null
	}))
