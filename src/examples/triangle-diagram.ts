import type { TriangleDiagramProps } from "@/widgets/generators/triangle-diagram"

// Valid examples for the Triangle Diagram widget
export const triangleDiagramExamples: TriangleDiagramProps[] = [
	// Reworked example using constraint-first v2 schema
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A", label: "A" },
			B: { id: "pt_tri_B", label: "B" },
			C: { id: "pt_tri_C", label: "C" }
		},
		extraPoints: [{ id: "pt_tri_D", label: "D" }],
		lines: [["pt_tri_D", "pt_tri_A", "pt_tri_C"]],
		angleArcs: [
			{
				vertex: "pt_tri_A",
				from: "pt_tri_D",
				to: "pt_tri_B",
				value: { type: "numeric", value: 114 },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_B",
				from: "pt_tri_A",
				to: "pt_tri_C",
				value: { type: "numeric", value: 56 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_C",
				from: "pt_tri_A",
				to: "pt_tri_B",
				value: { type: "symbolic", symbol: "x" },
				color: "#7854ab",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: { AB: null, BC: null, CA: null },
		constructionLines: null,
		rightAngleMarks: null,
		altitudes: null
	},
	// Exterior helper with dashed perpendicular reference at left of base
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A10", label: "A" },
			B: { id: "pt_tri_B10", label: "B" },
			C: { id: "pt_tri_C10", label: "C" }
		},
		extraPoints: [{ id: "pt_tri_D10", label: "D" }],
		// Place D on the base line to the left of B; draw dashed helper lines
		lines: [["pt_tri_D10", "pt_tri_B10", "pt_tri_C10"]],
		constructionLines: [
			{ points: ["pt_tri_D10", "pt_tri_A10"], style: "dashed" },
			{ points: ["pt_tri_D10", "pt_tri_B10"], style: "dashed" }
		],
		rightAngleMarks: [
			{ vertex: "pt_tri_D10", from: "pt_tri_A10", to: "pt_tri_B10", size: null }
		],
		angleArcs: [
			{
				vertex: "pt_tri_A10",
				from: "pt_tri_B10",
				to: "pt_tri_C10",
				value: { type: "numeric", value: 41 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_C10",
				from: "pt_tri_A10",
				to: "pt_tri_B10",
				value: { type: "numeric", value: 28 },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_B10",
				from: "pt_tri_C10",
				to: "pt_tri_A10",
				value: { type: "symbolic", symbol: "x" },
				color: "#7854ab",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: { type: "symbolic", symbol: "B" },
			BC: { type: "symbolic", symbol: "C" },
			CA: { type: "symbolic", symbol: "A" }
		},
		altitudes: null
	},
	// Right triangle with top horizontal (A), right vertical (B) and dashed segment to right vertex
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A11", label: "A" },
			B: { id: "pt_tri_B11", label: "B" },
			C: { id: "pt_tri_C11", label: "C" }
		},
		extraPoints: [{ id: "pt_tri_D11", label: "D" }],
		// Put D on hypotenuse AC; draw dashed from D to the right-angle vertex B
		lines: [["pt_tri_A11", "pt_tri_D11", "pt_tri_C11"]],
		constructionLines: [
			{ points: ["pt_tri_D11", "pt_tri_B11"], style: "dashed" }
		],
		rightAngleMarks: [
			{ vertex: "pt_tri_B11", from: "pt_tri_A11", to: "pt_tri_C11", size: null }
		],
		angleArcs: [
			{
				vertex: "pt_tri_A11",
				from: "pt_tri_B11",
				to: "pt_tri_C11",
				value: { type: "numeric", value: 30 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_C11",
				from: "pt_tri_A11",
				to: "pt_tri_B11",
				value: { type: "numeric", value: 60 },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_B11",
				from: "pt_tri_A11",
				to: "pt_tri_C11",
				value: { type: "symbolic", symbol: "x" },
				color: "#7854ab",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: { type: "symbolic", symbol: "A" },
			BC: { type: "symbolic", symbol: "B" },
			CA: { type: "symbolic", symbol: "C" }
		},
		altitudes: null
	},
	// New example: B = 69°, C = 66°, exterior at A is x°
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A2", label: "A" },
			B: { id: "pt_tri_B2", label: "B" },
			C: { id: "pt_tri_C2", label: "C" }
		},
		extraPoints: [{ id: "pt_tri_D2", label: "D" }],
		lines: [["pt_tri_D2", "pt_tri_A2", "pt_tri_C2"]],
		angleArcs: [
			{
				vertex: "pt_tri_B2",
				from: "pt_tri_A2",
				to: "pt_tri_C2",
				value: { type: "numeric", value: 69 },
				color: "#7854ab",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_C2",
				from: "pt_tri_A2",
				to: "pt_tri_B2",
				value: { type: "numeric", value: 66 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_A2",
				from: "pt_tri_D2",
				to: "pt_tri_B2",
				value: { type: "symbolic", symbol: "x" },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: { AB: null, BC: null, CA: null },
		constructionLines: null,
		rightAngleMarks: null,
		altitudes: null
	},
	// New example 3: angled quadrilateral-like with 48°, 23°, and exterior x° at left top
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A3", label: "A" },
			B: { id: "pt_tri_B3", label: "B" },
			C: { id: "pt_tri_C3", label: "C" }
		},
		extraPoints: [{ id: "pt_tri_D3", label: "D" }],
		lines: [["pt_tri_D3", "pt_tri_A3", "pt_tri_C3"]],
		angleArcs: [
			{
				vertex: "pt_tri_C3",
				from: "pt_tri_A3",
				to: "pt_tri_B3",
				value: { type: "numeric", value: 23 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_A3",
				from: "pt_tri_B3",
				to: "pt_tri_C3",
				value: { type: "numeric", value: 48 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_A3",
				from: "pt_tri_D3",
				to: "pt_tri_B3",
				value: { type: "symbolic", symbol: "x" },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: { AB: null, BC: null, CA: null },
		constructionLines: null,
		rightAngleMarks: null,
		altitudes: null
	},
	// Interior-angle triangle (from first image): interior at A + C given, solve interior at left-top as x
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A4", label: "A" },
			B: { id: "pt_tri_B4", label: "B" },
			C: { id: "pt_tri_C4", label: "C" }
		},
		angleArcs: [
			{
				vertex: "pt_tri_A4",
				from: "pt_tri_B4",
				to: "pt_tri_C4",
				value: { type: "numeric", value: 48 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_C4",
				from: "pt_tri_A4",
				to: "pt_tri_B4",
				value: { type: "numeric", value: 23 },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_B4",
				from: "pt_tri_C4",
				to: "pt_tri_A4",
				value: { type: "symbolic", symbol: "x" },
				color: "#7854ab",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: { AB: null, BC: null, CA: null },
		constructionLines: null,
		extraPoints: null,
		lines: null,
		rightAngleMarks: null,
		altitudes: null
	},
	// Interior-angle triangle (second image): given 21° at left, 125° at top, find x at right
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A5", label: "A" },
			B: { id: "pt_tri_B5", label: "B" },
			C: { id: "pt_tri_C5", label: "C" }
		},
		angleArcs: [
			{
				vertex: "pt_tri_A5",
				from: "pt_tri_B5",
				to: "pt_tri_C5",
				value: { type: "numeric", value: 21 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_B5",
				from: "pt_tri_A5",
				to: "pt_tri_C5",
				value: { type: "numeric", value: 125 },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_C5",
				from: "pt_tri_B5",
				to: "pt_tri_A5",
				value: { type: "symbolic", symbol: "x" },
				color: "#7854ab",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: { AB: null, BC: null, CA: null },
		constructionLines: null,
		extraPoints: null,
		lines: null,
		rightAngleMarks: null,
		altitudes: null
	},
	// Right triangle with numeric side (third image): legs 3 and x, hypotenuse 5
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A6", label: "A" },
			B: { id: "pt_tri_B6", label: "B" },
			C: { id: "pt_tri_C6", label: "C" }
		},
		angleArcs: [
			{
				vertex: "pt_tri_B6",
				from: "pt_tri_A6",
				to: "pt_tri_C6",
				value: { type: "numeric", value: 37 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_C6",
				from: "pt_tri_B6",
				to: "pt_tri_A6",
				value: { type: "numeric", value: 53 },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_A6",
				from: "pt_tri_B6",
				to: "pt_tri_C6",
				value: { type: "symbolic", symbol: "x" },
				color: "#7854ab",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: { type: "numeric", value: 3 },
			BC: { type: "numeric", value: 5 },
			CA: { type: "symbolic", symbol: "x" }
		},
		constructionLines: null,
		extraPoints: null,
		lines: null,
		rightAngleMarks: null,
		altitudes: [
			// Height from the left vertical leg to the hypotenuse is 8 in the image,
			// but our A,B,C positions are synthetic; we provide an altitude from A to BC.
			{
				vertex: "pt_tri_A6",
				toSide: "BC",
				value: { type: "numeric", value: 8 },
				style: "dashed",
				color: "#777777",
				withRightAngle: true
			}
		]
	},
	// Isosceles-like (fifth image): equal sides 3.3 with base angle 39°, opposite angle 39°, ask interior x
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A7", label: "A" },
			B: { id: "pt_tri_B7", label: "B" },
			C: { id: "pt_tri_C7", label: "C" }
		},
		angleArcs: [
			{
				vertex: "pt_tri_A7",
				from: "pt_tri_B7",
				to: "pt_tri_C7",
				value: { type: "numeric", value: 39 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_C7",
				from: "pt_tri_B7",
				to: "pt_tri_A7",
				value: { type: "numeric", value: 39 },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_B7",
				from: "pt_tri_A7",
				to: "pt_tri_C7",
				value: { type: "symbolic", symbol: "x" },
				color: "#7854ab",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: { type: "numeric", value: 3.3 },
			BC: { type: "numeric", value: 5.1 },
			CA: { type: "numeric", value: 3.3 }
		},
		constructionLines: null,
		extraPoints: null,
		lines: null,
		rightAngleMarks: null,
		altitudes: [
			// Drop height from the right vertical to the base CA (value 21 per image)
			{
				vertex: "pt_tri_B7",
				toSide: "CA",
				value: { type: "numeric", value: 21 },
				style: "dashed",
				color: "#777777",
				withRightAngle: true
			}
		]
	},
	// New: MathML side labels on slanted sides, base numeric, interior altitude with symbolic label x
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A8", label: "A" },
			B: { id: "pt_tri_B8", label: "B" },
			C: { id: "pt_tri_C8", label: "C" }
		},
		angleArcs: [
			// Provide two numeric interior angles so geometry is derivable
			{
				vertex: "pt_tri_A8",
				from: "pt_tri_B8",
				to: "pt_tri_C8",
				value: { type: "numeric", value: 35 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_B8",
				from: "pt_tri_C8",
				to: "pt_tri_A8",
				value: { type: "numeric", value: 35 },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_C8",
				from: "pt_tri_B8",
				to: "pt_tri_A8",
				value: { type: "symbolic", symbol: "x" },
				color: "#7854ab",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: { type: "numeric", value: 8 },
			BC: {
				type: "mathml",
				mathml: "<msqrt><mn>20</mn></msqrt>",
				value: 4.47213595499958
			},
			CA: {
				type: "mathml",
				mathml: "<msqrt><mn>20</mn></msqrt>",
				value: 4.47213595499958
			}
		},
		constructionLines: null,
		extraPoints: null,
		lines: null,
		rightAngleMarks: null,
		altitudes: [
			{
				vertex: "pt_tri_C8",
				toSide: "AB",
				value: null,
				style: "dashed",
				color: "#777777",
				withRightAngle: true
			}
		]
	},
	// New: MathML side labels on slanted sides, known altitude 3 and base symbolic x
	{
		type: "triangleDiagram",
		width: 462,
		height: 300,
		points: {
			A: { id: "pt_tri_A9", label: "A" },
			B: { id: "pt_tri_B9", label: "B" },
			C: { id: "pt_tri_C9", label: "C" }
		},
		angleArcs: [
			{
				vertex: "pt_tri_A9",
				from: "pt_tri_B9",
				to: "pt_tri_C9",
				value: { type: "numeric", value: 40 },
				color: "#11accd",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_B9",
				from: "pt_tri_C9",
				to: "pt_tri_A9",
				value: { type: "numeric", value: 40 },
				color: "#1fab54",
				showArc: true,
				showLabel: true
			},
			{
				vertex: "pt_tri_C9",
				from: "pt_tri_B9",
				to: "pt_tri_A9",
				value: { type: "symbolic", symbol: "x" },
				color: "#7854ab",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: { type: "symbolic", symbol: "x" },
			BC: {
				type: "mathml",
				mathml: "<msqrt><mn>45</mn></msqrt>",
				value: 6.70820393249937
			},
			CA: {
				type: "mathml",
				mathml: "<msqrt><mn>45</mn></msqrt>",
				value: 6.70820393249937
			}
		},
		constructionLines: null,
		extraPoints: null,
		lines: null,
		rightAngleMarks: null,
		altitudes: [
			{
				vertex: "pt_tri_C9",
				toSide: "AB",
				value: { type: "numeric", value: 3 },
				style: "dashed",
				color: "#777777",
				withRightAngle: true
			}
		]
	},
	{
		type: "triangleDiagram",
		lines: [["pt_tri_C", "pt_tri_A", "pt_tri_D"]],
		width: 462,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_B",
				from: "pt_tri_D",
				color: "#1fab54",
				value: {
					type: "numeric",
					value: 123
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#7854ab",
				value: {
					type: "numeric",
					value: 58
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: [
			{
				id: "pt_tri_D",
				label: "D"
			}
		],
		rightAngleMarks: null,
		constructionLines: [
			{
				style: "solid",
				points: ["pt_tri_C", "pt_tri_A", "pt_tri_D"]
			}
		]
	},
	{
		type: "triangleDiagram",
		lines: [["pt_tri_d", "pt_tri_a", "pt_tri_c"]],
		width: 462,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_b",
				from: "pt_tri_d",
				color: "#1fab54",
				value: {
					type: "numeric",
					value: 114
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#7854ab",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: [
			{
				id: "pt_tri_d",
				label: "D"
			}
		],
		rightAngleMarks: null,
		constructionLines: [
			{
				style: "solid",
				points: ["pt_tri_d", "pt_tri_a"]
			}
		]
	},
	{
		type: "triangleDiagram",
		lines: [["pt_tri_D", "pt_tri_A", "pt_tri_C"]],
		width: 462,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_B",
				from: "pt_tri_D",
				color: "#e07d10",
				value: {
					type: "numeric",
					value: 116
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#7854ab",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: [
			{
				id: "pt_tri_D",
				label: "D"
			}
		],
		rightAngleMarks: null,
		constructionLines: [
			{
				style: "solid",
				points: ["pt_tri_D", "pt_tri_C"]
			}
		]
	},
	{
		type: "triangleDiagram",
		lines: [["pt_tri_D1", "pt_tri_A1", "pt_tri_C1"]],
		width: 462,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: "A"
			},
			B: {
				id: "pt_tri_B1",
				label: "B"
			},
			C: {
				id: "pt_tri_C1",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_A1",
				color: "#7854ab",
				value: {
					type: "numeric",
					value: 69
				},
				vertex: "pt_tri_B1",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_B1",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 66
				},
				vertex: "pt_tri_C1",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B1",
				from: "pt_tri_D1",
				color: "#e07d10",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_A1",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: [
			{
				id: "pt_tri_D1",
				label: "D"
			}
		],
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: [["pt_tri_d", "pt_tri_a", "pt_tri_c"]],
		width: 462,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#7854ab",
				value: {
					type: "numeric",
					value: 68
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_d",
				color: "#1fab54",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: [
			{
				id: "pt_tri_d",
				label: "D"
			}
		],
		rightAngleMarks: null,
		constructionLines: [
			{
				style: "solid",
				points: ["pt_tri_d", "pt_tri_a"]
			}
		]
	},
	{
		type: "triangleDiagram",
		lines: [["pt_tri_d", "pt_tri_a", "pt_tri_c"]],
		width: 462,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_b",
				from: "pt_tri_d",
				color: "#1fab54",
				value: {
					type: "numeric",
					value: 128
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#7854ab",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 65
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: [
			{
				id: "pt_tri_d",
				label: "D"
			}
		],
		rightAngleMarks: null,
		constructionLines: [
			{
				style: "solid",
				points: ["pt_tri_d", "pt_tri_a", "pt_tri_c"]
			}
		]
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 31
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 77
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: "A"
			},
			B: {
				id: "pt_tri_B1",
				label: "B"
			},
			C: {
				id: "pt_tri_C1",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_B1",
				from: "pt_tri_C1",
				color: "#1f77b4",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_A1",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_C1",
				from: "pt_tri_A1",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 102
				},
				vertex: "pt_tri_B1",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_B1",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 48
				},
				vertex: "pt_tri_C1",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 41
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#cc0000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 27
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_c",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 98
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 85
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 67
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 20
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 74
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 34
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 48
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 23
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a1",
				label: "A"
			},
			B: {
				id: "pt_tri_b1",
				label: "B"
			},
			C: {
				id: "pt_tri_c1",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_b1",
				color: "#d9534f",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_a1",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b1",
				from: "pt_tri_a1",
				color: "#337ab7",
				value: {
					type: "numeric",
					value: 33
				},
				vertex: "pt_tri_c1",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a1",
				from: "pt_tri_c1",
				color: "#337ab7",
				value: {
					type: "numeric",
					value: 103
				},
				vertex: "pt_tri_b1",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 21
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 125
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 27
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 82
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 31
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 27
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 79
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 73
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a1",
				label: ""
			},
			B: {
				id: "pt_tri_b1",
				label: ""
			},
			C: {
				id: "pt_tri_c1",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_b1",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 27
				},
				vertex: "pt_tri_a1",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a1",
				from: "pt_tri_c1",
				color: "#d62728",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_b1",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b1",
				from: "pt_tri_a1",
				color: "#2ca02c",
				value: {
					type: "numeric",
					value: 68
				},
				vertex: "pt_tri_c1",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: ""
			},
			B: {
				id: "pt_tri_B1",
				label: ""
			},
			C: {
				id: "pt_tri_C1",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 37
				},
				vertex: "pt_tri_A1",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_C1",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_B1",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B1",
				from: "pt_tri_A1",
				color: "#d62728",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C1",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#ff991f",
				value: {
					type: "numeric",
					value: 33
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#28a745",
				value: {
					type: "numeric",
					value: 114
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 96
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 53
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 97
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 98
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 99
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 23
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 124
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#d61e1e",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#1167b1",
				value: {
					type: "numeric",
					value: 42
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#1167b1",
				value: {
					type: "numeric",
					value: 106
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 24
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#2ca02c",
				value: {
					type: "numeric",
					value: 74
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#d62728",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#ff9f00",
				value: {
					type: "numeric",
					value: 47
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#ff5b5b",
				value: {
					type: "numeric",
					value: 97
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 112
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 19
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 29
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 109
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 29
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 44
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#d32f2f",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#1976d2",
				value: {
					type: "numeric",
					value: 37
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#1976d2",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 2.8
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 2.8
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: " "
			},
			B: {
				id: "pt_tri_B",
				label: " "
			},
			C: {
				id: "pt_tri_C",
				label: " "
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 5.6
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 4
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 80
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "mathml",
				value: 4,
				mathml: "<mn>4.0</mn>"
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "mathml",
				value: 8,
				mathml: "<mn>8.0</mn>"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "numeric",
				value: 8.8
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#0000ff",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#0000ff",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#0000ff",
				value: {
					type: "numeric",
					value: 80
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 1.3
			},
			BC: {
				type: "numeric",
				value: 4.1
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a1",
				label: "A"
			},
			B: {
				id: "pt_tri_b1",
				label: "B"
			},
			C: {
				id: "pt_tri_c1",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_b1",
				color: "#555555",
				value: {
					type: "numeric",
					value: 100
				},
				vertex: "pt_tri_a1",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_a1",
				from: "pt_tri_c1",
				color: "#555555",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_b1",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_b1",
				from: "pt_tri_a1",
				color: "#555555",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_c1",
				showArc: true,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "mathml",
				value: 4,
				mathml: "<mn>4.0</mn>"
			},
			CA: {
				type: "mathml",
				value: 2.7,
				mathml: "<mn>2.7</mn>"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "2.5"
			},
			BC: {
				type: "symbolic",
				symbol: "8.0"
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 80
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8.5
			},
			BC: {
				type: "numeric",
				value: 8
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#888",
				value: {
					type: "numeric",
					value: 65
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#888",
				value: {
					type: "numeric",
					value: 65
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#888",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 5.5
			},
			BC: {
				type: "numeric",
				value: 3.2
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#3366cc",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#3366cc",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#3366cc",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "6.0"
			},
			BC: {
				type: "symbolic",
				symbol: "5.8"
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#d62728",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#2ca02c",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "β"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 7
			},
			BC: {
				type: "numeric",
				value: 4
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 22.62
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 67.38
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: {
				type: "numeric",
				value: 13
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#1f77b4",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 9
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 36.87
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 53.13
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 9
			},
			BC: {
				type: "numeric",
				value: 12
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 34
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 5
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 6
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a0",
				label: "A"
			},
			B: {
				id: "pt_tri_b0",
				label: "B"
			},
			C: {
				id: "pt_tri_c0",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_b0",
				from: "pt_tri_c0",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a0",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c0",
				from: "pt_tri_a0",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_b0",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a0",
				from: "pt_tri_b0",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_c0",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 7
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c0",
				from: "pt_tri_b0",
				size: null,
				vertex: "pt_tri_a0"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "y"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 9
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 15
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 14
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 76
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "numeric",
				value: 1
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "6"
			},
			BC: {
				type: "symbolic",
				symbol: "2"
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 71.56505117707799
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 9
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 11
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 10
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 2
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 5
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 3
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 6
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#888888",
				value: {
					type: "numeric",
					value: 16
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#888888",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#888888",
				value: {
					type: "numeric",
					value: 74
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 7
			},
			BC: {
				type: "numeric",
				value: 2
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#555555",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#555555",
				value: {
					type: "numeric",
					value: 26.56505117707799
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#555555",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 4
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 22.62
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 67.38
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 12
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 5
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 76
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "?"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 2
			},
			BC: {
				type: "numeric",
				value: 8
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 32
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "γ"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 35
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 8
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: "A"
			},
			B: {
				id: "pt_tri_B1",
				label: "B"
			},
			C: {
				id: "pt_tri_C1",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C1",
				from: "pt_tri_A1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_B1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_B1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_C1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 4
			},
			CA: {
				type: "numeric",
				value: 2
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				size: null,
				vertex: "pt_tri_A1"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 5
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 12
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 35
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 2.5
			},
			BC: {
				type: "numeric",
				value: 6.5
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 35
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: {
				type: "numeric",
				value: 8
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 6
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 7
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 9
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "numeric",
				value: 10
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 35
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 10
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 36.87
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 53.13
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 1.5
			},
			CA: {
				type: "numeric",
				value: 2.5
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 9
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 2
			},
			CA: {
				type: "numeric",
				value: 6
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 12
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 13
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 53.13
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 36.87
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 12
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 16
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 7
			},
			BC: {
				type: "numeric",
				value: 9
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 4
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: ""
			},
			B: {
				id: "pt_tri_B1",
				label: ""
			},
			C: {
				id: "pt_tri_C1",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_A1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_B1",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_C1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: {
				type: "numeric",
				value: 8
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_A1",
				size: null,
				vertex: "pt_tri_B1"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 7
			},
			CA: {
				type: "numeric",
				value: 2
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: null,
			CA: {
				type: "numeric",
				value: 4
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 4
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#888",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#888",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#888",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 2
				},
				toSide: "CA",
				vertex: "pt_tri_B",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: null,
			BC: {
				type: "numeric",
				value: 3
			},
			CA: {
				type: "numeric",
				value: 6
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 4
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 12
			},
			BC: null,
			CA: {
				type: "numeric",
				value: 9
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 6
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 65
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 21
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 303,
		height: 320,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 15
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 18
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 53.13
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: {
				type: "numeric",
				value: 4
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 2
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 4
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 14
			},
			BC: {
				type: "numeric",
				value: 11
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 2
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 80
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 7
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 6
				},
				toSide: "CA",
				vertex: "pt_tri_B",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: null,
			BC: null,
			CA: {
				type: "numeric",
				value: 18
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 15
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 65
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 10
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "numeric",
				value: 2
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 10
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 80
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 12
			},
			BC: {
				type: "numeric",
				value: 13
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 5
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "numeric",
				value: 7
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 8
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 16
			},
			BC: {
				type: "numeric",
				value: 10
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 26.5650511771
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: {
				type: "numeric",
				value: 3
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 36.87
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 16
			},
			BC: {
				type: "numeric",
				value: 20
			},
			CA: {
				type: "numeric",
				value: 12
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 15
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 12
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 53.13
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#cc0000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 36.87
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: {
				type: "numeric",
				value: 8
			},
			CA: {
				type: "numeric",
				value: 10
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 5
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#888",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#888",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#888",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 2
			},
			BC: null,
			CA: {
				type: "numeric",
				value: 7
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 5
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 80
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 3
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 80
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 12
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 67.38
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 67.38
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#1f77b4",
				value: {
					type: "symbolic",
					symbol: "γ"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 13
			},
			CA: {
				type: "numeric",
				value: 13
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: [["pt_tri_A", "pt_tri_D", "pt_tri_B"]],
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 68
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 68
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#888888",
				value: {
					type: "numeric",
					value: 44
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: {
				type: "numeric",
				value: 8
			},
			CA: {
				type: "numeric",
				value: 8
			}
		},
		extraPoints: [
			{
				id: "pt_tri_D",
				label: ""
			}
		],
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 6
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 80
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: {
				type: "numeric",
				value: 5
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 5
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 68.1985905
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 68.1985905
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 43.602819
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a1",
				label: "A"
			},
			B: {
				id: "pt_tri_b1",
				label: "B"
			},
			C: {
				id: "pt_tri_c1",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				toSide: "AB",
				vertex: "pt_tri_c1",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_b1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 75
				},
				vertex: "pt_tri_a1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a1",
				from: "pt_tri_c1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 75
				},
				vertex: "pt_tri_b1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b1",
				from: "pt_tri_a1",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_c1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "numeric",
				value: 8
			},
			CA: {
				type: "numeric",
				value: 8
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 6
				},
				toSide: "BC",
				vertex: "pt_tri_A",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 4
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 8
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 53.13010235415598
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 53.13010235415598
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#1f77b4",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 10
			},
			CA: {
				type: "numeric",
				value: 10
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 67.38013505195957
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 67.38013505195957
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 10
			},
			BC: {
				type: "numeric",
				value: 13
			},
			CA: {
				type: "numeric",
				value: 13
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 2
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 65
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 65
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "mathml",
				value: 3.6055512755,
				mathml: "<msqrt><mn>13</mn></msqrt>"
			},
			CA: {
				type: "mathml",
				value: 3.6055512755,
				mathml: "<msqrt><mn>13</mn></msqrt>"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 5
				},
				toSide: "BC",
				vertex: "pt_tri_a",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 51.3401917459
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 51.3401917459
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 8
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "numeric",
				value: 8
			},
			CA: {
				type: "numeric",
				value: 8
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 4
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 53.1301023542
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 53.1301023542
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "α"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 7
				},
				toSide: "CA",
				vertex: "pt_tri_b",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 54.462322
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 71.075356
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "?"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "mathml",
				value: 8.602325267,
				mathml: "<msqrt><mn>74</mn></msqrt>"
			},
			BC: {
				type: "mathml",
				value: 8.602325267,
				mathml: "<msqrt><mn>74</mn></msqrt>"
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 12
				},
				toSide: "BC",
				vertex: "pt_tri_A",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 73.73979529168804
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 53.13010235415598
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 53.13010235415598
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 15
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 15
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				toSide: "CA",
				vertex: "pt_tri_b",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 56.30993247402
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 56.30993247402
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "mathml",
				value: 7.211102551,
				mathml: "<msqrt><mn>52</mn></msqrt>"
			},
			BC: {
				type: "mathml",
				value: 7.211102551,
				mathml: "<msqrt><mn>52</mn></msqrt>"
			},
			CA: {
				type: "numeric",
				value: 8
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: ""
			},
			B: {
				id: "pt_tri_B1",
				label: ""
			},
			C: {
				id: "pt_tri_C1",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 12
				},
				toSide: "BC",
				vertex: "pt_tri_A1",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "α"
				},
				vertex: "pt_tri_A1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_C1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 67.38013505195957
				},
				vertex: "pt_tri_B1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B1",
				from: "pt_tri_A1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 67.38013505195957
				},
				vertex: "pt_tri_C1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 10
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				toSide: "CA",
				vertex: "pt_tri_b",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_b",
				from: "pt_tri_c",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 26.565051
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 126.869898
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 26.565051
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "mathml",
				value: 4.472135955,
				mathml: "<msqrt><mn>20</mn></msqrt>"
			},
			BC: {
				type: "mathml",
				value: 4.472135955,
				mathml: "<msqrt><mn>20</mn></msqrt>"
			},
			CA: {
				type: "numeric",
				value: 8
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: ""
			},
			B: {
				id: "pt_tri_B1",
				label: ""
			},
			C: {
				id: "pt_tri_C1",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "8 units"
				},
				toSide: "BC",
				vertex: "pt_tri_A1",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 73.74
				},
				vertex: "pt_tri_A1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C1",
				from: "pt_tri_A1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 53.13
				},
				vertex: "pt_tri_B1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_B1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 53.13
				},
				vertex: "pt_tri_C1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x units"
			},
			BC: {
				type: "symbolic",
				symbol: "12 units"
			},
			CA: {
				type: "symbolic",
				symbol: "x units"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: ""
			},
			B: {
				id: "pt_tri_B1",
				label: ""
			},
			C: {
				id: "pt_tri_C1",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 8
				},
				toSide: "BC",
				vertex: "pt_tri_A1",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 53.1301023542
				},
				vertex: "pt_tri_A1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_C1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 63.4349488229
				},
				vertex: "pt_tri_B1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B1",
				from: "pt_tri_A1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 63.4349488229
				},
				vertex: "pt_tri_C1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "mathml",
				value: 8.94427191,
				mathml: "<msqrt><mn>80</mn></msqrt>"
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "mathml",
				value: 8.94427191,
				mathml: "<msqrt><mn>80</mn></msqrt>"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 3
				},
				toSide: "BC",
				vertex: "pt_tri_A",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "mathml",
				value: 6.7082039325,
				mathml: "<msqrt><mn>45</mn></msqrt>"
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "mathml",
				value: 6.7082039325,
				mathml: "<msqrt><mn>45</mn></msqrt>"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				toSide: "CA",
				vertex: "pt_tri_B",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 35
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 85
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: null,
			BC: null,
			CA: {
				type: "numeric",
				value: 10
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 4
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 10
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 11
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 5
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#2ca02c",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#d62728",
				value: {
					type: "numeric",
					value: 100
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 4
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 306,
		height: 320,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 100
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 4
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				toSide: "CA",
				vertex: "pt_tri_B",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#888",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#888",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#888",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 11
			},
			BC: null,
			CA: {
				type: "numeric",
				value: 10
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 36.87
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "numeric",
				value: 10
			},
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "numeric",
					value: 8
				},
				toSide: "CA",
				vertex: "pt_tri_B",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#0000ff",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#0000ff",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#0000ff",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 9
			},
			BC: null,
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a1",
				label: "A"
			},
			B: {
				id: "pt_tri_b1",
				label: "B"
			},
			C: {
				id: "pt_tri_c1",
				label: "C"
			}
		},
		altitudes: [
			{
				color: "#000000",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				toSide: "AB",
				vertex: "pt_tri_c1",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_b1",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a1",
				from: "pt_tri_c1",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_b1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b1",
				from: "pt_tri_a1",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_c1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: null,
			CA: {
				type: "numeric",
				value: 9
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: "A"
			},
			B: {
				id: "pt_tri_B1",
				label: "B"
			},
			C: {
				id: "pt_tri_C1",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_C1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B1",
				from: "pt_tri_A1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_C1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: null,
			CA: {
				type: "symbolic",
				symbol: "x"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				size: null,
				vertex: "pt_tri_A1"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#333333",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#333333",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#333333",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a1",
				label: "A"
			},
			B: {
				id: "pt_tri_b1",
				label: "B"
			},
			C: {
				id: "pt_tri_c1",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_b1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_a1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a1",
				from: "pt_tri_c1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b1",
				from: "pt_tri_a1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_c1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_a1",
				size: null,
				vertex: "pt_tri_b1"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: ""
			},
			B: {
				id: "pt_tri_B1",
				label: ""
			},
			C: {
				id: "pt_tri_C1",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C1",
				from: "pt_tri_A1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 38
				},
				vertex: "pt_tri_B1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B1",
				from: "pt_tri_A1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 52
				},
				vertex: "pt_tri_C1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: null,
			CA: {
				type: "numeric",
				value: 5
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				size: null,
				vertex: "pt_tri_A1"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#cc0000",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 61
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 61
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6.2
			},
			BC: {
				type: "numeric",
				value: 6
			},
			CA: {
				type: "numeric",
				value: 6.2
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 62
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 62
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#d62728",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 10.4
			},
			BC: {
				type: "numeric",
				value: 12
			},
			CA: {
				type: "numeric",
				value: 12
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 18
			},
			BC: {
				type: "numeric",
				value: 14
			},
			CA: {
				type: "numeric",
				value: 14
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 5
			},
			BC: {
				type: "numeric",
				value: 5.7
			},
			CA: {
				type: "numeric",
				value: 5
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 4
			},
			BC: {
				type: "numeric",
				value: 4.5
			},
			CA: {
				type: "numeric",
				value: 4
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000",
				value: {
					type: "numeric",
					value: 39
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000",
				value: {
					type: "numeric",
					value: 39
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3.3
			},
			BC: {
				type: "numeric",
				value: 5.1
			},
			CA: {
				type: "numeric",
				value: 3.3
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x°"
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3.5
			},
			BC: {
				type: "numeric",
				value: 4
			},
			CA: {
				type: "numeric",
				value: 3.5
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 66
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: true
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 66
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: true
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 7
			},
			BC: {
				type: "numeric",
				value: 7
			},
			CA: {
				type: "numeric",
				value: 5.7
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 80
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "5 units"
			},
			BC: null,
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 30
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: null,
			BC: null,
			CA: {
				type: "mathml",
				value: 10,
				mathml: "<mn>10</mn><mtext> units</mtext>"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "numeric",
				value: 17
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 53.13010235415598
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 1.5
			},
			BC: null,
			CA: {
				type: "numeric",
				value: 2.5
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 67.38
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 67.38
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 45.24
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 10
			},
			BC: {
				type: "numeric",
				value: 13
			},
			CA: {
				type: "numeric",
				value: 13
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 53.130102354156
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 53.130102354156
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 73.739795291688
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 12
			},
			BC: {
				type: "numeric",
				value: 10
			},
			CA: {
				type: "numeric",
				value: 10
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 5
			},
			BC: {
				type: "numeric",
				value: 13
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#28ae7b",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#28ae7b",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#28ae7b",
				value: {
					type: "numeric",
					value: 80
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: {
				type: "numeric",
				value: 5
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: [["pt_tri_a", "pt_tri_p", "pt_tri_b"]],
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#999999",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#999999",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#999999",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: null,
		extraPoints: [
			{
				id: "pt_tri_p",
				label: "P"
			}
		],
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#666666",
				value: {
					type: "numeric",
					value: 49
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#666666",
				value: {
					type: "numeric",
					value: 63
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#666666",
				value: {
					type: "numeric",
					value: 68
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: null,
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_b",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_c",
				showArc: true,
				showLabel: false
			}
		],
		sideLabels: null,
		extraPoints: [
			{
				id: "pt_tri_p",
				label: "P"
			}
		],
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: [["pt_tri_C", "pt_tri_A", "pt_tri_P"]],
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: false
			}
		],
		sideLabels: null,
		extraPoints: [
			{
				id: "pt_tri_P",
				label: "P"
			}
		],
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: {
				type: "numeric",
				value: 4.24
			},
			CA: {
				type: "numeric",
				value: 3
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 33.6900675
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: null,
			CA: {
				type: "numeric",
				value: 4
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 59.0362434679
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 30.9637565321
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: null,
			CA: {
				type: "numeric",
				value: 5
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: "A"
			},
			B: {
				id: "pt_tri_B1",
				label: "B"
			},
			C: {
				id: "pt_tri_C1",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C1",
				from: "pt_tri_A1",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 38.65980825409009
				},
				vertex: "pt_tri_B1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_B1",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 10
			},
			BC: {
				type: "numeric",
				value: 12.8
			},
			CA: {
				type: "numeric",
				value: 8
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				size: null,
				vertex: "pt_tri_A1"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: ""
			},
			B: {
				id: "pt_tri_B1",
				label: ""
			},
			C: {
				id: "pt_tri_C1",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_A1",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_A1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_B1",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_C1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 2
			},
			BC: {
				type: "numeric",
				value: 2
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_A1",
				size: null,
				vertex: "pt_tri_B1"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 22.61986495
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 12
			},
			BC: {
				type: "numeric",
				value: 5
			},
			CA: {
				type: "numeric",
				value: 13
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 7
			},
			BC: {
				type: "numeric",
				value: 8
			},
			CA: {
				type: "numeric",
				value: 4
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 34
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: null,
			CA: {
				type: "numeric",
				value: 12
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 67.38
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 22.62
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 10
			},
			BC: {
				type: "numeric",
				value: 26
			},
			CA: {
				type: "numeric",
				value: 24
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 73.73979529168804
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 24
			},
			BC: {
				type: "numeric",
				value: 7
			},
			CA: {
				type: "numeric",
				value: 25
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 61.9275
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 8
			},
			BC: {
				type: "numeric",
				value: 17
			},
			CA: {
				type: "numeric",
				value: 15
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				size: null,
				vertex: "pt_tri_a"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 63.435
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#11accd",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: {
				type: "numeric",
				value: 6
			},
			CA: {
				type: "numeric",
				value: 6.7
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "A"
			},
			B: {
				id: "pt_tri_B",
				label: "B"
			},
			C: {
				id: "pt_tri_C",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 36.87
				},
				vertex: "pt_tri_B",
				showArc: true,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 53.13
				},
				vertex: "pt_tri_C",
				showArc: true,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 6
			},
			BC: {
				type: "numeric",
				value: 10
			},
			CA: {
				type: "numeric",
				value: 8
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 53.13010235415598
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#11accd",
				value: {
					type: "numeric",
					value: 36.86989764584402
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 3
			},
			BC: {
				type: "numeric",
				value: 4
			},
			CA: {
				type: "numeric",
				value: 5
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_aA",
				label: "A"
			},
			B: {
				id: "pt_tri_aB",
				label: "B"
			},
			C: {
				id: "pt_tri_aC",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_aC",
				from: "pt_tri_aB",
				color: "#888888",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_aA",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_aA",
				from: "pt_tri_aC",
				color: "#888888",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_aB",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_aB",
				from: "pt_tri_aA",
				color: "#888888",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_aC",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "5 units"
			},
			BC: {
				type: "symbolic",
				symbol: "5 units"
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_aC",
				from: "pt_tri_aB",
				size: null,
				vertex: "pt_tri_aA"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_bA",
				label: "A"
			},
			B: {
				id: "pt_tri_bB",
				label: "B"
			},
			C: {
				id: "pt_tri_bC",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_bC",
				from: "pt_tri_bB",
				color: "#888888",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_bA",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_bA",
				from: "pt_tri_bC",
				color: "#888888",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_bB",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_bB",
				from: "pt_tri_bA",
				color: "#888888",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_bC",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "5 units"
			},
			BC: {
				type: "symbolic",
				symbol: "6 units"
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_bC",
				from: "pt_tri_bB",
				size: null,
				vertex: "pt_tri_bA"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_cA",
				label: "A"
			},
			B: {
				id: "pt_tri_cB",
				label: "B"
			},
			C: {
				id: "pt_tri_cC",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_cC",
				from: "pt_tri_cB",
				color: "#888888",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_cA",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_cA",
				from: "pt_tri_cC",
				color: "#888888",
				value: {
					type: "numeric",
					value: 56
				},
				vertex: "pt_tri_cB",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_cB",
				from: "pt_tri_cA",
				color: "#888888",
				value: {
					type: "numeric",
					value: 34
				},
				vertex: "pt_tri_cC",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "4 units"
			},
			BC: {
				type: "symbolic",
				symbol: "6 units"
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_cC",
				from: "pt_tri_cB",
				size: null,
				vertex: "pt_tri_cA"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a1",
				label: "A"
			},
			B: {
				id: "pt_tri_b1",
				label: "B"
			},
			C: {
				id: "pt_tri_c1",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_b1",
				color: "#666",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_a1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c1",
				from: "pt_tri_a1",
				color: "#666",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a1",
				from: "pt_tri_b1",
				color: "#666",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_c1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "10 units"
			},
			BC: {
				type: "symbolic",
				symbol: "15 units"
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_a1",
				size: null,
				vertex: "pt_tri_b1"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a2",
				label: "A"
			},
			B: {
				id: "pt_tri_b2",
				label: "B"
			},
			C: {
				id: "pt_tri_c2",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c2",
				from: "pt_tri_b2",
				color: "#666",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_a2",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c2",
				from: "pt_tri_a2",
				color: "#666",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b2",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a2",
				from: "pt_tri_b2",
				color: "#666",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_c2",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "5 units"
			},
			BC: {
				type: "symbolic",
				symbol: "7.5 units"
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c2",
				from: "pt_tri_a2",
				size: null,
				vertex: "pt_tri_b2"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a3",
				label: "A"
			},
			B: {
				id: "pt_tri_b3",
				label: "B"
			},
			C: {
				id: "pt_tri_c3",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c3",
				from: "pt_tri_b3",
				color: "#666",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_a3",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c3",
				from: "pt_tri_a3",
				color: "#666",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_b3",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a3",
				from: "pt_tri_b3",
				color: "#666",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_c3",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "5 units"
			},
			BC: {
				type: "symbolic",
				symbol: "7.5 units"
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a1",
				label: ""
			},
			B: {
				id: "pt_tri_b1",
				label: ""
			},
			C: {
				id: "pt_tri_c1",
				label: ""
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_a1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c1",
				from: "pt_tri_b1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 16.2602047083
				},
				vertex: "pt_tri_a1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a1",
				from: "pt_tri_b1",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_c1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 24
			},
			BC: {
				type: "numeric",
				value: 7
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_a1",
				size: null,
				vertex: "pt_tri_b1"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "Start"
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: "End"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 35
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 2
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 5
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: [
			{
				style: "dashed",
				points: ["pt_tri_a", "pt_tri_c"]
			}
		]
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: "Anchor"
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: "Platform"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000",
				value: {
					type: "numeric",
					value: 11.5
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000",
				value: {
					type: "numeric",
					value: 78.5
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 198
			},
			BC: {
				type: "numeric",
				value: 40
			},
			CA: null
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: "A"
			},
			B: {
				id: "pt_tri_b",
				label: "B"
			},
			C: {
				id: "pt_tri_c",
				label: "C"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#1f77b4",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#2ca02c",
				value: {
					type: "numeric",
					value: 20
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "mathml",
				value: 2,
				mathml: "<mn>2</mn><mtext> m</mtext>"
			},
			BC: {
				type: "symbolic",
				symbol: "Tree"
			},
			CA: {
				type: "mathml",
				value: 6,
				mathml: "<mtext>Ladder </mtext><mn>6</mn><mtext> m</mtext>"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a1",
				label: "Aurora"
			},
			B: {
				id: "pt_tri_b1",
				label: "Burlington"
			},
			C: {
				id: "pt_tri_c1",
				label: "Clifton"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_a1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c1",
				from: "pt_tri_b1",
				color: "#000000",
				value: {
					type: "numeric",
					value: 40
				},
				vertex: "pt_tri_a1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a1",
				from: "pt_tri_b1",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "y"
				},
				vertex: "pt_tri_c1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 65
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 97
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c1",
				from: "pt_tri_a1",
				size: null,
				vertex: "pt_tri_b1"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 480,
		height: 328,
		points: {
			A: {
				id: "pt_tri_A",
				label: "Abbotsford"
			},
			B: {
				id: "pt_tri_B",
				label: "Kelso"
			},
			C: {
				id: "pt_tri_C",
				label: "Hawick"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 41.2
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "θ"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "numeric",
				value: 17
			},
			BC: {
				type: "symbolic",
				symbol: "x"
			},
			CA: {
				type: "numeric",
				value: 15
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				size: null,
				vertex: "pt_tri_A"
			}
		],
		constructionLines: [
			{
				style: "dashed",
				points: ["pt_tri_B", "pt_tri_C"]
			}
		]
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: "back of truck"
			}
		},
		altitudes: null,
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 31.7
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "?"
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "x"
			},
			BC: {
				type: "numeric",
				value: 83
			},
			CA: {
				type: "numeric",
				value: 158
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 315,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#7854ab",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "C"
				},
				toSide: "AB",
				vertex: "pt_tri_c",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#cccccc",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_c",
				color: "#cccccc",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_b",
				from: "pt_tri_a",
				color: "#cccccc",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "base"
			},
			BC: {
				type: "symbolic",
				symbol: "A"
			},
			CA: {
				type: "symbolic",
				symbol: "B"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#ca337c",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "height"
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#0000ff",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#0000ff",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#0000ff",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "A"
			},
			BC: {
				type: "symbolic",
				symbol: "B"
			},
			CA: {
				type: "symbolic",
				symbol: "C"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A1",
				label: ""
			},
			B: {
				id: "pt_tri_B1",
				label: ""
			},
			C: {
				id: "pt_tri_C1",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#a75a05",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "height"
				},
				toSide: "AB",
				vertex: "pt_tri_C1",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C1",
				from: "pt_tri_B1",
				color: "#8888ff",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A1",
				from: "pt_tri_C1",
				color: "#8888ff",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B1",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B1",
				from: "pt_tri_A1",
				color: "#8888ff",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C1",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "C"
			},
			BC: {
				type: "symbolic",
				symbol: "A"
			},
			CA: {
				type: "symbolic",
				symbol: "B"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: " "
			},
			B: {
				id: "pt_tri_B",
				label: " "
			},
			C: {
				id: "pt_tri_C",
				label: " "
			}
		},
		altitudes: [
			{
				color: "#ca337c",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "height"
				},
				toSide: "CA",
				vertex: "pt_tri_B",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 35
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "A"
			},
			BC: {
				type: "symbolic",
				symbol: "B"
			},
			CA: {
				type: "symbolic",
				symbol: "C"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				size: null,
				vertex: "pt_tri_B"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_a",
				label: ""
			},
			B: {
				id: "pt_tri_b",
				label: ""
			},
			C: {
				id: "pt_tri_c",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#7854ab",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "C"
				},
				toSide: "CA",
				vertex: "pt_tri_b",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				color: "#000000",
				value: {
					type: "numeric",
					value: 90
				},
				vertex: "pt_tri_b",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_c",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 35
				},
				vertex: "pt_tri_a",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_a",
				from: "pt_tri_b",
				color: "#000000",
				value: {
					type: "numeric",
					value: 55
				},
				vertex: "pt_tri_c",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "base"
			},
			BC: {
				type: "symbolic",
				symbol: "B"
			},
			CA: {
				type: "symbolic",
				symbol: "A"
			}
		},
		extraPoints: null,
		rightAngleMarks: [
			{
				to: "pt_tri_c",
				from: "pt_tri_a",
				size: null,
				vertex: "pt_tri_b"
			}
		],
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#0c7f99",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "height"
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#888888",
				value: {
					type: "numeric",
					value: 26.565051
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#888888",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#888888",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "A"
			},
			BC: {
				type: "symbolic",
				symbol: "B"
			},
			CA: {
				type: "symbolic",
				symbol: "C"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 300,
		height: 320,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#ca337c",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "B"
				},
				toSide: "BC",
				vertex: "pt_tri_A",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_C",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "numeric",
					value: 50
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 60
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_B",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 70
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "A"
			},
			BC: {
				type: "symbolic",
				symbol: "base"
			},
			CA: {
				type: "symbolic",
				symbol: "C"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	},
	{
		type: "triangleDiagram",
		lines: null,
		width: 320,
		height: 300,
		points: {
			A: {
				id: "pt_tri_A",
				label: ""
			},
			B: {
				id: "pt_tri_B",
				label: ""
			},
			C: {
				id: "pt_tri_C",
				label: ""
			}
		},
		altitudes: [
			{
				color: "#7854ab",
				style: "dashed",
				value: {
					type: "symbolic",
					symbol: "A"
				},
				toSide: "AB",
				vertex: "pt_tri_C",
				withRightAngle: true
			}
		],
		angleArcs: [
			{
				to: "pt_tri_B",
				from: "pt_tri_C",
				color: "#000000",
				value: {
					type: "numeric",
					value: 26
				},
				vertex: "pt_tri_A",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_C",
				from: "pt_tri_A",
				color: "#000000",
				value: {
					type: "numeric",
					value: 45
				},
				vertex: "pt_tri_B",
				showArc: false,
				showLabel: false
			},
			{
				to: "pt_tri_A",
				from: "pt_tri_B",
				color: "#000000",
				value: {
					type: "symbolic",
					symbol: "x"
				},
				vertex: "pt_tri_C",
				showArc: false,
				showLabel: false
			}
		],
		sideLabels: {
			AB: {
				type: "symbolic",
				symbol: "base"
			},
			BC: {
				type: "symbolic",
				symbol: "B"
			},
			CA: {
				type: "symbolic",
				symbol: "C"
			}
		},
		extraPoints: null,
		rightAngleMarks: null,
		constructionLines: null
	}
]
