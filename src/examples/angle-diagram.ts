import type { AngleDiagramProps } from "@/widgets/generators/angle-diagram"

// Valid examples for the Angle Diagram widget
export const angleDiagramExamples: AngleDiagramProps[] = [
	// Example 1: Find x from a diagram with intersecting lines
	{
		type: "angleDiagram",
		width: 400,
		height: 300,
		points: [
			{ x: 80, y: 120, id: "A", label: "A", shape: "circle" },
			{ x: 320, y: 120, id: "B", label: "B", shape: "circle" },
			{ x: 87.237, y: 161.042, id: "C", label: "C", shape: "circle" },
			{ x: 312.763, y: 78.958, id: "D", label: "D", shape: "circle" },
			{ x: 200, y: 120, id: "E", label: "E", shape: "circle" },
			{ x: 143.431, y: 63.431, id: "F", label: "F", shape: "circle" },
			{ x: 256.569, y: 176.569, id: "G", label: "G", shape: "circle" }
		],
		rays: [
			{ from: "E", to: "A" },
			{ from: "E", to: "B" },
			{ from: "E", to: "C" },
			{ from: "E", to: "D" },
			{ from: "E", to: "F" },
			{ from: "E", to: "G" }
		],
		angles: [
			{
				type: "arc",
				vertex: "E",
				pointOnFirstRay: "A",
				pointOnSecondRay: "F",
				label: "x°",
				color: "#11accd",
				radius: 42.23
			},
			{
				type: "arc",
				vertex: "E",
				pointOnFirstRay: "F",
				pointOnSecondRay: "D",
				label: "115°",
				color: "#1fab54",
				radius: 29.656
			},
			{
				type: "arc",
				vertex: "E",
				pointOnFirstRay: "C",
				pointOnSecondRay: "B",
				label: "160°",
				color: "#e07d10",
				radius: 36.519
			}
		]
	},

	// Example 2: Find x using angles on a straight line
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 150, y: 112.5, id: "A", label: "A", shape: "circle" },
			{ x: 60, y: 112.5, id: "D", label: "D", shape: "circle" },
			{ x: 240, y: 112.5, id: "F", label: "F", shape: "circle" },
			{ x: 185, y: 173.1, id: "C", label: "C", shape: "circle" },
			{ x: 115, y: 51.9, id: "E", label: "E", shape: "circle" },
			{ x: 96.4, y: 157.5, id: "B", label: "B", shape: "circle" }
		],
		rays: [
			{ from: "E", to: "A" },
			{ from: "A", to: "C" },
			{ from: "D", to: "A" },
			{ from: "A", to: "F" },
			{ from: "A", to: "B" }
		],
		angles: [
			{
				type: "arc",
				vertex: "A",
				pointOnFirstRay: "D",
				pointOnSecondRay: "B",
				label: "x°",
				color: "#7854ab",
				radius: 25
			},
			{
				type: "arc",
				vertex: "A",
				pointOnFirstRay: "B",
				pointOnSecondRay: "C",
				label: "80°",
				color: "#1fab54",
				radius: 30
			},
			{
				type: "arc",
				vertex: "A",
				pointOnFirstRay: "C",
				pointOnSecondRay: "F",
				label: "60°",
				color: "#11accd",
				radius: 38
			}
		]
	},

	// Example 3: Find x using vertical angles
	{
		type: "angleDiagram",
		width: 400,
		height: 300,
		points: [
			{ x: 80, y: 120, id: "A", label: "A", shape: "circle" },
			{ x: 320, y: 120, id: "B", label: "B", shape: "circle" },
			{ x: 87.237, y: 161.042, id: "C", label: "C", shape: "circle" },
			{ x: 312.763, y: 78.958, id: "D", label: "D", shape: "circle" },
			{ x: 200, y: 120, id: "E", label: "E", shape: "circle" },
			{ x: 220.706, y: 42.726, id: "F", label: "F", shape: "circle" },
			{ x: 179.294, y: 197.274, id: "G", label: "G", shape: "circle" }
		],
		rays: [
			{ from: "A", to: "E" },
			{ from: "E", to: "B" },
			{ from: "C", to: "E" },
			{ from: "E", to: "D" },
			{ from: "F", to: "E" },
			{ from: "E", to: "G" }
		],
		angles: [
			{
				type: "arc",
				vertex: "E",
				pointOnFirstRay: "F",
				pointOnSecondRay: "D",
				label: "50°",
				color: "#1fab54",
				radius: 29
			},
			{
				type: "arc",
				vertex: "E",
				pointOnFirstRay: "D",
				pointOnSecondRay: "B",
				label: "20°",
				color: "#11accd",
				radius: 64
			},
			{
				type: "arc",
				vertex: "E",
				pointOnFirstRay: "A",
				pointOnSecondRay: "G",
				label: "x°",
				color: "#e07d10",
				radius: 40
			}
		]
	},

	// Example 4: Find x using vertical and right angles
	{
		type: "angleDiagram",
		width: 360,
		height: 360,
		points: [
			{ x: 30, y: 180, id: "A", label: "A", shape: "circle" },
			{ x: 330, y: 180, id: "B", label: "B", shape: "circle" },
			{ x: 180, y: 30, id: "C", label: "C", shape: "circle" },
			{ x: 180, y: 330, id: "D", label: "D", shape: "circle" },
			{ x: 240, y: 30, id: "E", label: "E", shape: "circle" },
			{ x: 120, y: 330, id: "F", label: "F", shape: "circle" },
			{ x: 180, y: 180, id: "G", label: "G", shape: "circle" }
		],
		rays: [
			{ from: "G", to: "A" },
			{ from: "G", to: "B" },
			{ from: "G", to: "C" },
			{ from: "G", to: "D" },
			{ from: "G", to: "E" },
			{ from: "G", to: "F" }
		],
		angles: [
			{
				type: "arc",
				vertex: "G",
				pointOnFirstRay: "A",
				pointOnSecondRay: "F",
				label: "73°",
				color: "#1fab54",
				radius: 36
			},
			{
				type: "right",
				vertex: "G",
				pointOnFirstRay: "A",
				pointOnSecondRay: "C",
				label: null,
				color: "#000000"
			},
			{
				type: "arc",
				vertex: "G",
				pointOnFirstRay: "C",
				pointOnSecondRay: "E",
				label: "x°",
				color: "#11accd",
				radius: 54
			}
		]
	},

	// Example 5: Find x from supplementary angles
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 81.818, y: 81.818, id: "A", label: "A", shape: "circle" },
			{ x: 163.636, y: 81.818, id: "P", label: "P", shape: "circle" },
			{ x: 245.455, y: 81.818, id: "B", label: "B", shape: "circle" },
			{ x: 108.889, y: 142.621, id: "C", label: "C", shape: "circle" },
			{ x: 218.383, y: 21.015, id: "D", label: "D", shape: "circle" }
		],
		rays: [
			{ from: "A", to: "P" },
			{ from: "P", to: "B" },
			{ from: "C", to: "P" },
			{ from: "P", to: "D" }
		],
		angles: [
			{
				type: "arc",
				vertex: "P",
				pointOnFirstRay: "C",
				pointOnSecondRay: "B",
				label: "133°",
				color: "#11accd",
				radius: 42
			},
			{
				type: "arc",
				vertex: "P",
				pointOnFirstRay: "D",
				pointOnSecondRay: "B",
				label: "x",
				color: "#1fab54",
				radius: 28
			}
		]
	},

	// Example 6: Right angle with complementary angles
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 18, y: 138, id: "Q", label: "Q", shape: "circle" },
			{ x: 59.042, y: 25.237, id: "P", label: "P", shape: "circle" },
			{ x: 117.485, y: 70.897, id: "R", label: "R", shape: "circle" },
			{ x: 130.763, y: 179.042, id: "S", label: "S", shape: "circle" }
		],
		rays: [
			{ from: "Q", to: "P" },
			{ from: "Q", to: "R" },
			{ from: "Q", to: "S" }
		],
		angles: [
			{
				type: "arc",
				vertex: "Q",
				pointOnFirstRay: "P",
				pointOnSecondRay: "R",
				label: "36°",
				color: "#11accd",
				radius: 28
			},
			{
				type: "arc",
				vertex: "Q",
				pointOnFirstRay: "R",
				pointOnSecondRay: "S",
				label: "x°",
				color: "#ff8800",
				radius: 42
			},
			{
				type: "right",
				vertex: "Q",
				pointOnFirstRay: "P",
				pointOnSecondRay: "S",
				label: "right angle",
				color: "#000000"
			}
		]
	},

	// Example 7: Find x using parallel lines and a transversal
	{
		type: "angleDiagram",
		width: 478,
		height: 365,
		points: [
			{ x: 59.4, y: 324, id: "A", label: "A", shape: "circle" },
			{ x: 98.28, y: 69.12, id: "J", label: "J", shape: "circle" },
			{ x: 83.7, y: 166.86, id: "H", label: "H", shape: "circle" },
			{ x: 380.7, y: 281.07, id: "K", label: "K", shape: "circle" },
			{ x: 258.66, y: 297.81, id: "I", label: "I", shape: "circle" }
		],
		rays: [
			{ from: "A", to: "J" },
			{ from: "A", to: "K" },
			{ from: "H", to: "I" },
			{ from: "J", to: "K" }
		],
		angles: [
			{
				type: "arc",
				vertex: "A",
				pointOnFirstRay: "H",
				pointOnSecondRay: "I",
				label: "x",
				color: "#7854ab",
				radius: 27
			},
			{
				type: "arc",
				vertex: "H",
				pointOnFirstRay: "A",
				pointOnSecondRay: "I",
				label: "56°",
				color: "#1fab54",
				radius: 27
			},
			{
				type: "arc",
				vertex: "K",
				pointOnFirstRay: "A",
				pointOnSecondRay: "J",
				label: "60°",
				color: "#11accd",
				radius: 20
			}
		]
	},

	// Example 8: Compare angle x to 73 degrees
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 126, y: 90, id: "V", label: " ", shape: "circle" },
			{ x: 231.954, y: 33.663, id: "A", label: " ", shape: "circle" },
			{ x: 11.243, y: 125.085, id: "B", label: " ", shape: "circle" },
			{ x: 126, y: 0, id: "U", label: " ", shape: "circle" },
			{ x: 126, y: 180, id: "D", label: " ", shape: "circle" }
		],
		rays: [
			{ from: "U", to: "D" },
			{ from: "V", to: "A" },
			{ from: "V", to: "B" }
		],
		angles: [
			{
				type: "arc",
				vertex: "V",
				pointOnFirstRay: "U",
				pointOnSecondRay: "A",
				label: "x",
				color: "#1fab54",
				radius: 17
			},
			{
				type: "arc",
				vertex: "V",
				pointOnFirstRay: "B",
				pointOnSecondRay: "D",
				label: "73°",
				color: "#11accd",
				radius: 15
			}
		]
	},

	// Example 9: Compare angle x to 100 degrees
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 126, y: 90, id: "V", label: " ", shape: "circle" },
			{ x: 6, y: 90, id: "L", label: " ", shape: "circle" },
			{ x: 246, y: 90, id: "R", label: " ", shape: "circle" },
			{ x: 206, y: 40, id: "UR", label: " ", shape: "circle" },
			{ x: 46, y: 140, id: "LL", label: " ", shape: "circle" }
		],
		rays: [
			{ from: "V", to: "L" },
			{ from: "V", to: "R" },
			{ from: "V", to: "UR" },
			{ from: "V", to: "LL" }
		],
		angles: [
			{
				type: "arc",
				vertex: "V",
				pointOnFirstRay: "R",
				pointOnSecondRay: "UR",
				label: "x°",
				color: "#11accd",
				radius: 28
			},
			{
				type: "arc",
				vertex: "V",
				pointOnFirstRay: "L",
				pointOnSecondRay: "LL",
				label: "100°",
				color: "#1fab54",
				radius: 28
			}
		]
	},

	// Example 10: Compare angle x to 60°
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 6, y: 90, id: "L", label: " ", shape: "circle" },
			{ x: 246, y: 90, id: "R", label: " ", shape: "circle" },
			{ x: 126, y: 90, id: "O", label: " ", shape: "circle" },
			{ x: 167.042, y: -22.763, id: "U", label: " ", shape: "circle" },
			{ x: 66, y: 193.923, id: "D", label: " ", shape: "circle" }
		],
		rays: [
			{ from: "O", to: "L" },
			{ from: "O", to: "R" },
			{ from: "O", to: "U" },
			{ from: "O", to: "D" }
		],
		angles: [
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "R",
				pointOnSecondRay: "U",
				label: "x°",
				color: "#1fab54",
				radius: 15.617
			},
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "L",
				pointOnSecondRay: "D",
				label: "60°",
				color: "#11accd",
				radius: 17.552
			}
		]
	},

	// Example 11: Star figure angle measurement
	{
		type: "angleDiagram",
		width: 500,
		height: 425,
		points: [
			{ x: 50, y: 125, id: "A", label: "A", shape: "circle" },
			{ x: 250, y: 25, id: "B", label: "B", shape: "circle" },
			{ x: 450, y: 125, id: "C", label: "C", shape: "circle" },
			{ x: 100, y: 400, id: "D", label: "D", shape: "circle" },
			{ x: 400, y: 400, id: "E", label: "E", shape: "circle" },
			{ x: 330, y: 200, id: "H", label: "H", shape: "circle" }
		],
		rays: [
			{ from: "A", to: "C" },
			{ from: "C", to: "D" },
			{ from: "D", to: "B" },
			{ from: "B", to: "E" },
			{ from: "E", to: "A" },
			{ from: "H", to: "C" },
			{ from: "H", to: "E" }
		],
		angles: [
			{
				type: "arc",
				vertex: "B",
				pointOnFirstRay: "D",
				pointOnSecondRay: "E",
				label: "47°",
				color: "#ca337c",
				radius: 25
			},
			{
				type: "arc",
				vertex: "D",
				pointOnFirstRay: "A",
				pointOnSecondRay: "B",
				label: "31°",
				color: "#1fab54",
				radius: 32.5
			},
			{
				type: "arc",
				vertex: "H",
				pointOnFirstRay: "C",
				pointOnSecondRay: "E",
				label: "x",
				color: "#11accd",
				radius: 25
			}
		]
	},

	// Example 12: Find angle with parallel lines
	{
		type: "angleDiagram",
		width: 490,
		height: 350,
		points: [
			{ x: 35, y: 105, id: "D", label: "D", shape: "circle" },
			{ x: 455, y: 105, id: "E", label: "E", shape: "circle" },
			{ x: 35, y: 245, id: "F", label: "F", shape: "circle" },
			{ x: 455, y: 245, id: "G", label: "G", shape: "circle" },
			{ x: 210, y: 35, id: "K", label: "K", shape: "circle" },
			{ x: 210, y: 315, id: "L", label: "L", shape: "circle" },
			{ x: 140, y: 35, id: "I", label: "I", shape: "circle" },
			{ x: 420, y: 315, id: "J", label: "J", shape: "circle" },
			{ x: 210, y: 105, id: "A", label: "A", shape: "circle" },
			{ x: 210, y: 245, id: "B", label: "B", shape: "circle" },
			{ x: 350, y: 245, id: "C", label: "C", shape: "circle" }
		],
		rays: [
			{ from: "D", to: "A" },
			{ from: "A", to: "E" },
			{ from: "F", to: "B" },
			{ from: "B", to: "C" },
			{ from: "C", to: "G" },
			{ from: "K", to: "A" },
			{ from: "A", to: "L" },
			{ from: "I", to: "A" },
			{ from: "A", to: "C" },
			{ from: "C", to: "J" }
		],
		angles: [
			{
				type: "arc",
				vertex: "A",
				pointOnFirstRay: "I",
				pointOnSecondRay: "K",
				label: "x",
				color: "#1fab54",
				radius: 35
			},
			{
				type: "arc",
				vertex: "C",
				pointOnFirstRay: "G",
				pointOnSecondRay: "J",
				label: "59°",
				color: "#11accd",
				radius: 26.25
			}
		]
	},

	// Example 13: Corresponding angles with parallel lines
	{
		type: "angleDiagram",
		width: 360,
		height: 300,
		points: [
			{ x: 120, y: 50, id: "T1", label: " ", shape: "circle" },
			{ x: 240, y: 100, id: "V1", label: " ", shape: "circle" },
			{ x: 360, y: 150, id: "T2", label: " ", shape: "circle" },
			{ x: 40, y: 130, id: "B1", label: " ", shape: "circle" },
			{ x: 160, y: 180, id: "V2", label: " ", shape: "circle" },
			{ x: 280, y: 230, id: "B2", label: " ", shape: "circle" },
			{ x: 320, y: 20, id: "S1", label: " ", shape: "circle" },
			{ x: 80, y: 260, id: "S2", label: " ", shape: "circle" }
		],
		rays: [
			{ from: "T1", to: "V1" },
			{ from: "V1", to: "T2" },
			{ from: "B1", to: "V2" },
			{ from: "V2", to: "B2" },
			{ from: "S2", to: "V2" },
			{ from: "V2", to: "V1" },
			{ from: "V1", to: "S1" }
		],
		angles: [
			{
				type: "arc",
				vertex: "V1",
				pointOnFirstRay: "T1",
				pointOnSecondRay: "S1",
				label: "x",
				color: "#28ae7b",
				radius: 24
			},
			{
				type: "arc",
				vertex: "V2",
				pointOnFirstRay: "B1",
				pointOnSecondRay: "V1",
				label: "116°",
				color: "#6495ed",
				radius: 24
			}
		]
	},

	// Example 14: Angle comparison with labeled angles
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 31.237, y: 167.042, id: "W", label: "W", shape: "circle" },
			{ x: 144, y: 126, id: "X", label: "X", shape: "circle" },
			{ x: 73.466, y: 28.918, id: "Y", label: "Y", shape: "circle" },
			{ x: 256.763, y: 84.958, id: "Z", label: "Z", shape: "circle" }
		],
		rays: [
			{ from: "X", to: "W" },
			{ from: "X", to: "Y" },
			{ from: "X", to: "Z" }
		],
		angles: [
			{
				type: "arc",
				vertex: "X",
				pointOnFirstRay: "Y",
				pointOnSecondRay: "Z",
				label: "106°",
				color: "#0066CC",
				radius: 36
			},
			{
				type: "arc",
				vertex: "X",
				pointOnFirstRay: "Y",
				pointOnSecondRay: "W",
				label: "x°",
				color: "#00AA00",
				radius: 28
			}
		]
	},

	// Example 15: Right angle with complementary angles
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 30, y: 138, id: "O", label: "O", shape: "circle" },
			{ x: 30, y: 18, id: "X", label: "X", shape: "circle" },
			{ x: 150, y: 138, id: "Z", label: "Z", shape: "circle" },
			{ x: 88.177, y: 33.046, id: "Y", label: "Y", shape: "circle" }
		],
		rays: [
			{ from: "O", to: "X" },
			{ from: "O", to: "Z" },
			{ from: "O", to: "Y" }
		],
		angles: [
			{
				type: "right",
				vertex: "O",
				pointOnFirstRay: "X",
				pointOnSecondRay: "Z",
				label: "90°",
				color: "#000000"
			},
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "X",
				pointOnSecondRay: "Y",
				label: "29°",
				color: "#0066CC",
				radius: 34
			},
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "Y",
				pointOnSecondRay: "Z",
				label: "x°",
				color: "#CC0000",
				radius: 48
			}
		]
	},

	// Example 16: Adjacent angles on a straight line
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 24, y: 126, id: "A", label: "A", shape: "circle" },
			{ x: 144, y: 126, id: "O", label: "O", shape: "circle" },
			{ x: 264, y: 126, id: "C", label: "C", shape: "circle" },
			{ x: 41.14, y: 64.195, id: "B", label: "B", shape: "circle" }
		],
		rays: [
			{ from: "O", to: "A" },
			{ from: "O", to: "C" },
			{ from: "O", to: "B" }
		],
		angles: [
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "A",
				pointOnSecondRay: "B",
				label: "x°",
				color: "#0066CC",
				radius: 28
			},
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "B",
				pointOnSecondRay: "C",
				label: "149°",
				color: "#CC3300",
				radius: 44
			}
		]
	},

	// Example 17: Vertical angles diagram
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 150, y: 120, id: "O", label: "O", shape: "circle" },
			{ x: 60, y: 40, id: "A", label: "A", shape: "circle" },
			{ x: 240, y: 200, id: "C", label: "C", shape: "circle" },
			{ x: 240, y: 50, id: "B", label: "B", shape: "circle" },
			{ x: 60, y: 190, id: "D", label: "D", shape: "circle" }
		],
		rays: [
			{ from: "O", to: "A" },
			{ from: "O", to: "C" },
			{ from: "O", to: "B" },
			{ from: "O", to: "D" }
		],
		angles: [
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "B",
				pointOnSecondRay: "C",
				label: "100°",
				color: "#11accd",
				radius: 36
			},
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "A",
				pointOnSecondRay: "D",
				label: "x°",
				color: "#1fab54",
				radius: 36
			}
		]
	},

	// Example 18: Complementary angles with expressions
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 10, y: 210, id: "V", label: " ", shape: "circle" },
			{ x: 10, y: 10, id: "U", label: " ", shape: "circle" },
			{ x: 210, y: 210, id: "R", label: " ", shape: "circle" },
			{ x: 183.205, y: 110, id: "D", label: " ", shape: "circle" }
		],
		rays: [
			{ from: "V", to: "U" },
			{ from: "V", to: "R" },
			{ from: "V", to: "D" }
		],
		angles: [
			{
				type: "arc",
				vertex: "V",
				pointOnFirstRay: "R",
				pointOnSecondRay: "D",
				label: "5x°",
				color: "#11accd",
				radius: 26.33
			},
			{
				type: "arc",
				vertex: "V",
				pointOnFirstRay: "D",
				pointOnSecondRay: "U",
				label: "35°",
				color: "#e07d10",
				radius: 52.18
			},
			{
				type: "right",
				vertex: "V",
				pointOnFirstRay: "H",
				pointOnSecondRay: "V",
				label: " ",
				color: "#000000"
			}
		]
	},

	// Example 19: Vertical angles with expressions
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 150, y: 75, id: "O", label: "O", shape: "circle" },
			{ x: 20, y: 75, id: "L", label: "L", shape: "circle" },
			{ x: 280, y: 75, id: "R", label: "R", shape: "circle" },
			{ x: 80, y: 20, id: "U", label: "U", shape: "circle" },
			{ x: 220, y: 130, id: "D", label: "D", shape: "circle" }
		],
		rays: [
			{ from: "O", to: "L" },
			{ from: "O", to: "R" },
			{ from: "O", to: "U" },
			{ from: "O", to: "D" }
		],
		angles: [
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "R",
				pointOnSecondRay: "U",
				label: "150°",
				color: "#11accd",
				radius: 38
			},
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "L",
				pointOnSecondRay: "D",
				label: "10x°",
				color: "#e07d10",
				radius: 38
			}
		]
	},

	// Example 20: Complex angle relationships
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 150, y: 95, id: "O", label: "O", shape: "circle" },
			{ x: 280, y: 95, id: "A", label: "A", shape: "circle" },
			{ x: 150, y: 20, id: "B", label: "B", shape: "circle" },
			{ x: 235, y: 40, id: "C", label: "C", shape: "circle" }
		],
		rays: [
			{ from: "O", to: "A" },
			{ from: "O", to: "B" },
			{ from: "O", to: "C" }
		],
		angles: [
			{
				type: "right",
				vertex: "O",
				pointOnFirstRay: "A",
				pointOnSecondRay: "B",
				label: "90°",
				color: "#1fab54"
			},
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "A",
				pointOnSecondRay: "C",
				label: "x°",
				color: "#e07d10",
				radius: 35
			},
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "C",
				pointOnSecondRay: "B",
				label: "28°",
				color: "#11accd",
				radius: 50
			}
		]
	},

	// Example 21: Angle naming example
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 150, y: 180, id: "A", label: "A", shape: "circle" },
			{ x: 262.763, y: 138.958, id: "B", label: "B", shape: "circle" },
			{ x: 200.714, y: 71.243, id: "C", label: "C", shape: "circle" },
			{ x: 118.942, y: 64.089, id: "D", label: "D", shape: "circle" },
			{ x: 31.823, y: 159.162, id: "E", label: "E", shape: "circle" }
		],
		rays: [
			{ from: "A", to: "B" },
			{ from: "A", to: "C" },
			{ from: "A", to: "D" },
			{ from: "A", to: "E" }
		],
		angles: [
			{
				type: "arc",
				vertex: "A",
				pointOnFirstRay: "E",
				pointOnSecondRay: "D",
				label: " ",
				color: "#1fab54",
				radius: 45
			}
		]
	},

	// Example 22: Simple angle comparison
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 12, y: 78, id: "L", label: " ", shape: "circle" },
			{ x: 132, y: 78, id: "O", label: " ", shape: "circle" },
			{ x: 252, y: 78, id: "R", label: " ", shape: "circle" },
			{ x: 194.2, y: 20, id: "U", label: " ", shape: "circle" },
			{ x: 65.5, y: 140, id: "D", label: " ", shape: "circle" }
		],
		rays: [
			{ from: "L", to: "O" },
			{ from: "O", to: "R" },
			{ from: "U", to: "O" },
			{ from: "O", to: "D" }
		],
		angles: [
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "R",
				pointOnSecondRay: "U",
				label: "43°",
				color: "#6495ed",
				radius: 24
			},
			{
				type: "arc",
				vertex: "O",
				pointOnFirstRay: "L",
				pointOnSecondRay: "D",
				label: "x",
				color: "#28ae7b",
				radius: 24
			}
		]
	},

	// Example 23: Angle addition with labeled angles
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 40, y: 220, id: "P", label: "P", shape: "circle" },
			{ x: 220, y: 220, id: "S", label: "S", shape: "circle" },
			{
				x: 46.2819094064502,
				y: 40.10965113656276,
				id: "Q",
				label: "Q",
				shape: "circle"
			},
			{
				x: 158.09062521829134,
				y: 84.15227555990106,
				id: "R",
				label: "R",
				shape: "circle"
			}
		],
		rays: [
			{ from: "P", to: "Q" },
			{ from: "P", to: "R" },
			{ from: "P", to: "S" }
		],
		angles: [
			{
				type: "arc",
				vertex: "P",
				pointOnFirstRay: "Q",
				pointOnSecondRay: "R",
				label: "∠QPR",
				color: "#6495ed",
				radius: 40
			},
			{
				type: "arc",
				vertex: "P",
				pointOnFirstRay: "R",
				pointOnSecondRay: "S",
				label: "∠RPS",
				color: "#28ae7b",
				radius: 40
			},
			{
				type: "arc",
				vertex: "P",
				pointOnFirstRay: "Q",
				pointOnSecondRay: "S",
				label: "∠QPS",
				color: "#800080",
				radius: 48
			}
		]
	},

	// Example 24: Angle relationship identification
	{
		type: "angleDiagram",
		width: 300,
		height: 300,
		points: [
			{ x: 150, y: 110, id: "A", label: "A", shape: "circle" },
			{ x: 70, y: 150, id: "E", label: "E", shape: "circle" },
			{ x: 230, y: 70, id: "C", label: "C", shape: "circle" },
			{ x: 100, y: 40, id: "B", label: "B", shape: "circle" },
			{ x: 180, y: 180, id: "D", label: "D", shape: "circle" }
		],
		rays: [
			{ from: "A", to: "E" },
			{ from: "A", to: "D" },
			{ from: "A", to: "B" },
			{ from: "A", to: "C" }
		],
		angles: [
			{
				type: "right",
				vertex: "A",
				pointOnFirstRay: "E",
				pointOnSecondRay: "B",
				label: "N",
				color: "#1fab54"
			},
			{
				type: "arc",
				vertex: "A",
				pointOnFirstRay: "E",
				pointOnSecondRay: "D",
				label: "M",
				color: "#11accd",
				radius: 28
			}
		]
	}
]
