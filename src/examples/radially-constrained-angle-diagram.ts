import type { RadiallyConstrainedAngleDiagramProps } from "@/widgets/generators/radially-constrained-angle-diagram"

/**
 * Examples for the Radially Constrained Angle Diagram widget.
 *
 * This file contains both VALID examples and ERROR examples:
 * - radiallyConstrainedAngleDiagramExamples: Working examples that render correctly
 * - radiallyConstrainedAngleDiagramErrorExamples: Examples that demonstrate validation errors
 *
 * The error examples will throw runtime errors when used with generateWidget().
 * They are provided for documentation and testing purposes to show what NOT to do.
 */

// Valid examples that work correctly
export const radiallyConstrainedAngleDiagramExamples: RadiallyConstrainedAngleDiagramProps[] =
	[
		{
			type: "radiallyConstrainedAngleDiagram",
			width: 400,
			height: 400,
			centerLabel: "O",
			rayLabels: ["A", "B", "C"],
			angles: [
				{ fromRayLabel: "A", toRayLabel: "B", value: 60, color: "#ff6b6b" },
				{ fromRayLabel: "B", toRayLabel: "C", value: 120, color: "#4ecdc4" }
			]
		},
		{
			type: "radiallyConstrainedAngleDiagram",
			width: 500,
			height: 500,
			centerLabel: null,
			rayLabels: ["P", "Q", "R", "S"],
			angles: [
				{ fromRayLabel: "P", toRayLabel: "Q", value: 90, color: "#e74c3c" },
				{ fromRayLabel: "Q", toRayLabel: "R", value: 170, color: "#3498db" },
				{ fromRayLabel: "R", toRayLabel: "S", value: 90, color: "#2ecc71" }
			]
		},
		{
			type: "radiallyConstrainedAngleDiagram",
			width: 300,
			height: 300,
			centerLabel: "X",
			rayLabels: ["M", "N"],
			angles: [
				{ fromRayLabel: "M", toRayLabel: "N", value: 45, color: "#9b59b6" }
			]
		},
		{
			type: "radiallyConstrainedAngleDiagram",
			width: 500,
			height: 500,
			centerLabel: "O",
			rayLabels: ["A", "B", "C", "D", "E"],
			angles: [
				{ fromRayLabel: "A", toRayLabel: "B", value: 48, color: "#4A90E2" },
				{ fromRayLabel: "B", toRayLabel: "C", value: 72, color: "#F5A623" },
				{ fromRayLabel: "C", toRayLabel: "D", value: 63, color: "#7ED321" },
				{ fromRayLabel: "D", toRayLabel: "E", value: 47, color: "#50E3C2" },
				{ fromRayLabel: "A", toRayLabel: "C", value: 120, color: "#E91E63" }
			]
		},
		// Diagram matching: center A, rays B C D E, primaries 60-50-50, secondaries 110 and 160
		{
			type: "radiallyConstrainedAngleDiagram",
			width: 500,
			height: 420,
			centerLabel: "A",
			rayLabels: ["B", "C", "D", "E"],
			angles: [
				// primary filled sectors
				{ fromRayLabel: "B", toRayLabel: "C", value: 60, color: "#f1c40f" },
				{ fromRayLabel: "C", toRayLabel: "D", value: 50, color: "#2ecc71" },
				{ fromRayLabel: "D", toRayLabel: "E", value: 50, color: "#9b59b6" },
				// stacked secondary arcs
				{ fromRayLabel: "B", toRayLabel: "D", value: 110, color: "#3498db" },
				{ fromRayLabel: "B", toRayLabel: "E", value: 160, color: "#E91E63" }
			]
		}
	]

// Examples that demonstrate validation errors - these will throw when used
export const radiallyConstrainedAngleDiagramErrorExamples = {
	// ERROR: Invalid fromRayLabel - "X" is not in rayLabels
	invalidFromRayLabel: {
		type: "radiallyConstrainedAngleDiagram" as const,
		width: 400,
		height: 400,
		centerLabel: "O",
		rayLabels: ["A", "B", "C"],
		angles: [
			{ fromRayLabel: "X", toRayLabel: "B", value: 60, color: "#ff6b6b" } // "X" doesn't exist!
		]
	},

	// ERROR: Invalid toRayLabel - "Z" is not in rayLabels
	invalidToRayLabel: {
		type: "radiallyConstrainedAngleDiagram" as const,
		width: 400,
		height: 400,
		centerLabel: "O",
		rayLabels: ["A", "B", "C"],
		angles: [
			{ fromRayLabel: "A", toRayLabel: "Z", value: 60, color: "#ff6b6b" } // "Z" doesn't exist!
		]
	},

	// ERROR: Invalid ray order - "C" comes after "A" in rayLabels array
	invalidRayOrder: {
		type: "radiallyConstrainedAngleDiagram" as const,
		width: 400,
		height: 400,
		centerLabel: "O",
		rayLabels: ["A", "B", "C"],
		angles: [
			{ fromRayLabel: "C", toRayLabel: "A", value: 60, color: "#ff6b6b" } // C->A is backwards!
		]
	},

	// ERROR: Total angles exceed 360 degrees
	totalAngleExceeds360: {
		type: "radiallyConstrainedAngleDiagram" as const,
		width: 400,
		height: 400,
		centerLabel: "O",
		rayLabels: ["A", "B", "C"],
		angles: [
			{ fromRayLabel: "A", toRayLabel: "B", value: 200, color: "#ff6b6b" },
			{ fromRayLabel: "B", toRayLabel: "C", value: 200, color: "#4ecdc4" } // 200 + 200 = 400 > 360!
		]
	},

	// ERROR: Multiple validation errors at once
	multipleErrors: {
		type: "radiallyConstrainedAngleDiagram" as const,
		width: 400,
		height: 400,
		centerLabel: "O",
		rayLabels: ["A", "B", "C"],
		angles: [
			{ fromRayLabel: "X", toRayLabel: "Y", value: 200, color: "#ff6b6b" }, // Both ray labels invalid
			{ fromRayLabel: "C", toRayLabel: "A", value: 200, color: "#4ecdc4" } // Wrong order + total > 360
		]
	}
} as const
