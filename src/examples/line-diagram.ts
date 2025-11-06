import type { z } from "zod"
import type { LineDiagramPropsSchema } from "@/widgets/generators/line-diagram"

type LineDiagramProps = z.infer<typeof LineDiagramPropsSchema>

export const lineDiagramExamples: LineDiagramProps[] = [
	{
		type: "lineDiagram",
		width: 320,
		height: 300,
		gridBounds: { minX: -5, maxX: 5, minY: -4, maxY: 4 },
		lines: [
			{
				id: "line_r",
				from: { x: -5, y: -2 },
				to: { x: 5, y: 2 },
				style: "solid",
				label: "r",
				labelPosition: "middle",
				color: "#1F6FB2"
			},
			{
				id: "line_q",
				from: { x: -2, y: -4 },
				to: { x: 2, y: 4 },
				style: "dotted",
				label: "q",
				labelPosition: "middle",
				color: "#C06C84"
			}
		],
		perpendicularIndicators: []
	},
	{
		type: "lineDiagram",
		width: 320,
		height: 300,
		gridBounds: { minX: -6, maxX: 6, minY: -4, maxY: 4 },
		lines: [
			{
				id: "line_m",
				from: { x: -6, y: 0 },
				to: { x: 6, y: 0 },
				style: "solid",
				label: "m",
				labelPosition: "end",
				color: "#2E7D32"
			},
			{
				id: "line_n",
				from: { x: 0, y: -4 },
				to: { x: 0, y: 4 },
				style: "solid",
				label: "n",
				labelPosition: "start",
				color: "#2E7D32"
			}
		],
		perpendicularIndicators: [
			{ line1Id: "line_m", line2Id: "line_n", size: 8, color: "#2E7D32" }
		]
	},
	{
		type: "lineDiagram",
		width: 400,
		height: 300,
		gridBounds: { minX: -5, maxX: 5, minY: -4, maxY: 4 },
		lines: [
			{
				id: "line_r",
				from: { x: -5, y: 2 },
				to: { x: 5, y: 2 },
				style: "solid",
				label: "r",
				labelPosition: "end",
				color: "#0077C0"
			},
			{
				id: "line_s",
				from: { x: -5, y: -1 },
				to: { x: 5, y: -1 },
				style: "solid",
				label: "s",
				labelPosition: "end",
				color: "#0077C0"
			},
			{
				id: "line_q",
				from: { x: -2, y: -4 },
				to: { x: -2, y: 4 },
				style: "solid",
				label: "q",
				labelPosition: "end",
				color: "#0077C0"
			},
			{
				id: "line_m",
				from: { x: -4, y: -4 },
				to: { x: 4, y: 4 },
				style: "dotted",
				label: "m",
				labelPosition: "end",
				color: "#A0C8E0"
			},
			{
				id: "line_n",
				from: { x: -2.5, y: -4 },
				to: { x: 5.5, y: 4 },
				style: "dotted",
				label: "n",
				labelPosition: "end",
				color: "#A0C8E0"
			}
		],
		perpendicularIndicators: [
			{ line1Id: "line_q", line2Id: "line_r", size: 12, color: "#FDB813" },
			{ line1Id: "line_q", line2Id: "line_s", size: 12, color: "#FDB813" }
		]
	},
	{
		type: "lineDiagram",
		width: 400,
		height: 300,
		gridBounds: { minX: -5, maxX: 5, minY: -4, maxY: 4 },
		lines: [
			{
				id: "line_r",
				from: { x: -5, y: 2 },
				to: { x: 5, y: 2 },
				style: "solid",
				label: "r",
				labelPosition: "end",
				color: "#4285F4"
			},
			{
				id: "line_s",
				from: { x: -5, y: -1 },
				to: { x: 5, y: -1 },
				style: "solid",
				label: "s",
				labelPosition: "end",
				color: "#4285F4"
			},
			{
				id: "line_q",
				from: { x: -2, y: -4 },
				to: { x: -2, y: 4 },
				style: "solid",
				label: "q",
				labelPosition: "end",
				color: "#4285F4"
			},
			{
				id: "line_m",
				from: { x: -4, y: -4 },
				to: { x: 4, y: 4 },
				style: "solid",
				label: "m",
				labelPosition: "end",
				color: "#4285F4"
			},
			{
				id: "line_n",
				from: { x: -2.5, y: -4 },
				to: { x: 5.5, y: 4 },
				style: "solid",
				label: "n",
				labelPosition: "end",
				color: "#4285F4"
			}
		],
		perpendicularIndicators: [
			{ line1Id: "line_q", line2Id: "line_r", size: 12, color: "#FDB813" },
			{ line1Id: "line_q", line2Id: "line_s", size: 12, color: "#FDB813" }
		]
	},
	{
		type: "lineDiagram",
		width: 400,
		height: 300,
		gridBounds: { minX: -5, maxX: 5, minY: -4, maxY: 4 },
		lines: [
			{
				id: "line_r",
				from: { x: -5, y: 0 },
				to: { x: 5, y: 0 },
				style: "solid",
				label: "r",
				labelPosition: "end",
				color: "#0077C0"
			},
			{
				id: "line_s",
				from: { x: 0, y: -4 },
				to: { x: 0, y: 4 },
				style: "solid",
				label: "s",
				labelPosition: "end",
				color: "#0077C0"
			},
			{
				id: "line_v",
				from: { x: -2, y: -4 },
				to: { x: 2, y: 4 },
				style: "dotted",
				label: "v",
				labelPosition: "end",
				color: "#A0C8E0"
			},
			{
				id: "line_t",
				from: { x: -1, y: -4 },
				to: { x: 3, y: 4 },
				style: "dotted",
				label: "t",
				labelPosition: "end",
				color: "#A0C8E0"
			}
		],
		perpendicularIndicators: [
			{ line1Id: "line_s", line2Id: "line_r", size: 12, color: "#FDB813" }
		]
	},
	{
		type: "lineDiagram",
		width: 400,
		height: 300,
		gridBounds: { minX: -5, maxX: 5, minY: -4, maxY: 4 },
		lines: [
			{
				id: "line_r",
				from: { x: -5, y: 0 },
				to: { x: 5, y: 0 },
				style: "solid",
				label: "r",
				labelPosition: "end",
				color: "#4285F4"
			},
			{
				id: "line_s",
				from: { x: 0, y: -4 },
				to: { x: 0, y: 4 },
				style: "solid",
				label: "s",
				labelPosition: "end",
				color: "#4285F4"
			},
			{
				id: "line_v",
				from: { x: -2, y: -4 },
				to: { x: 2, y: 4 },
				style: "solid",
				label: "v",
				labelPosition: "end",
				color: "#4285F4"
			},
			{
				id: "line_t",
				from: { x: -1, y: -4 },
				to: { x: 3, y: 4 },
				style: "solid",
				label: "t",
				labelPosition: "end",
				color: "#4285F4"
			}
		],
		perpendicularIndicators: []
	},
	{
		type: "lineDiagram",
		width: 300,
		height: 300,
		gridBounds: { minX: -2.5, maxX: 2.5, minY: -2.5, maxY: 2.5 },
		lines: [
			{
				id: "line_h",
				from: { x: 2, y: 0.5 },
				to: { x: -2, y: 0.5 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			},
			{
				id: "line_v",
				from: { x: -0.5, y: -2 },
				to: { x: -0.5, y: 2 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			}
		],
		perpendicularIndicators: [
			{ line1Id: "line_h", line2Id: "line_v", size: 15, color: "#FDB813" }
		]
	},
	{
		type: "lineDiagram",
		width: 300,
		height: 300,
		gridBounds: { minX: -2.5, maxX: 2.5, minY: -2.5, maxY: 2.5 },
		lines: [
			{
				id: "line_a",
				from: { x: -2.5, y: -2.5 },
				to: { x: 2.5, y: 2.5 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			},
			{
				id: "line_b",
				from: { x: -2.5, y: 2.5 },
				to: { x: 2.5, y: -2.5 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			}
		],
		perpendicularIndicators: []
	},
	{
		type: "lineDiagram",
		width: 300,
		height: 300,
		gridBounds: { minX: -2.5, maxX: 2.5, minY: -2.5, maxY: 2.5 },
		lines: [
			{
				id: "line_a",
				from: { x: -1, y: -2.5 },
				to: { x: -1, y: 2.5 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			},
			{
				id: "line_b",
				from: { x: 1, y: -2.5 },
				to: { x: 1, y: 2.5 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			}
		],
		perpendicularIndicators: []
	},
	{
		type: "lineDiagram",
		width: 300,
		height: 300,
		gridBounds: { minX: -2.5, maxX: 2.5, minY: -2.5, maxY: 2.5 },
		lines: [
			{
				id: "line_a",
				from: { x: -2.5, y: 1 },
				to: { x: 2.5, y: 1 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			},
			{
				id: "line_b",
				from: { x: -2.5, y: -1 },
				to: { x: 2.5, y: -1 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			}
		],
		perpendicularIndicators: []
	},
	{
		type: "lineDiagram",
		width: 300,
		height: 300,
		gridBounds: { minX: -2.5, maxX: 2.5, minY: -2.5, maxY: 2.5 },
		lines: [
			{
				id: "line_a",
				from: { x: -1.5, y: -2.5 },
				to: { x: -1.5, y: 2.5 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			},
			{
				id: "line_b",
				from: { x: -2.5, y: 1 },
				to: { x: 2.5, y: -1.5 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			}
		],
		perpendicularIndicators: []
	},
	{
		type: "lineDiagram",
		width: 300,
		height: 300,
		gridBounds: { minX: -2.5, maxX: 2.5, minY: -2.5, maxY: 2.5 },
		lines: [
			{
				id: "line_h",
				from: { x: 2.5, y: 0 },
				to: { x: -2.5, y: 0 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			},
			{
				id: "line_v",
				from: { x: 0, y: -2.5 },
				to: { x: 0, y: 2.5 },
				style: "solid",
				label: null,
				labelPosition: "middle",
				color: "#4285F4"
			}
		],
		perpendicularIndicators: [
			{ line1Id: "line_h", line2Id: "line_v", size: 15, color: "#FDB813" }
		]
	}
]
