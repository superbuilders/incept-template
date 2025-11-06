import type { AngleTypeDiagramProps } from "@/widgets/generators/angle-type-diagram"

// Valid examples for the Angle Type Diagram widget
export const angleTypeDiagramExamples: AngleTypeDiagramProps[] = [
	{
		// Full angle (360°)
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "full", value: 360 },
		rotation: 0,
		labels: { ray1Point: "A", vertex: "B", ray2Point: "C" },
		showAngleArc: true,
		sectorColor: "#4aa3ff"
	},
	{
		// Question 4, Diagram 'b' - Obtuse Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 135 },
		rotation: 270,
		labels: { ray1Point: "P", vertex: "Q", ray2Point: "R" },
		showAngleArc: true,
		sectorColor: "#f1c40f"
	},
	{
		// Question 4, Diagram 'c' - Right Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "right", value: 90 },
		rotation: 0,
		labels: { ray1Point: "P", vertex: "Q", ray2Point: "R" },
		showAngleArc: true,
		sectorColor: "#f1c40f"
	},
	{
		// Question 4, Diagram 'd' - Straight Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "straight", value: 180 },
		rotation: 180,
		labels: { ray1Point: "P", vertex: "Q", ray2Point: "R" },
		showAngleArc: true,
		sectorColor: "#f1c40f"
	},
	{
		// Question 4, Diagram 'e' - Reflex Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "reflex", value: 270 },
		rotation: 135,
		labels: { ray1Point: "P", vertex: "Q", ray2Point: "R" },
		showAngleArc: true,
		sectorColor: "#f1c40f"
	},
	{
		// Question 4, Explanation Diagram - Obtuse Angle (Same as diagram 'b')
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 135 },
		rotation: 270,
		labels: { ray1Point: "P", vertex: "Q", ray2Point: "R" },
		showAngleArc: true,
		sectorColor: "#f1c40f"
	},
	{
		// Question 3, Diagram 'a' - Right Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "right", value: 90 },
		rotation: 0,
		labels: { ray1Point: "A", vertex: "B", ray2Point: "C" },
		showAngleArc: true,
		sectorColor: "#9b59b6"
	},
	{
		// Question 3, Diagram 'b' - Obtuse Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 135 },
		rotation: 0,
		labels: { ray1Point: "A", vertex: "B", ray2Point: "C" },
		showAngleArc: true,
		sectorColor: "#9b59b6"
	},
	{
		// Question 3, Diagram 'c' - Straight Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "straight", value: 180 },
		rotation: 0,
		labels: { ray1Point: "A", vertex: "B", ray2Point: "C" },
		showAngleArc: true,
		sectorColor: "#9b59b6"
	},
	{
		// Question 3, Diagram 'd' - Acute Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "acute", value: 45 },
		rotation: 0,
		labels: { ray1Point: "A", vertex: "B", ray2Point: "C" },
		showAngleArc: true,
		sectorColor: "#9b59b6"
	},
	{
		// Question 3, Explanation Diagram - Obtuse Angle (Same as diagram 'b')
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 135 },
		rotation: 0,
		labels: { ray1Point: "A", vertex: "B", ray2Point: "C" },
		showAngleArc: true,
		sectorColor: "#9b59b6"
	},
	// Question 6 (angle of 20°)
	{
		// Diagram (a): Obtuse Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 110 },
		rotation: 120,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#C8A2C8"
	},
	{
		// Diagram (b): Obtuse Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 140 },
		rotation: -30,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#D27D2D"
	},
	{
		// Diagram (c): Acute Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "acute", value: 35 },
		rotation: 110,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#D27D2D"
	},
	{
		// Diagram (d): The Correct Acute Angle (20°)
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "acute", value: 20 },
		rotation: 115,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#87CEEB"
	},
	{
		// Diagram (e): Obtuse Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 155 },
		rotation: 20,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#FFD700"
	},
	{
		// Explanation Diagram
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "acute", value: 20 },
		rotation: 115,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: false,
		sectorColor: "#87CEEB"
	},
	// Question 5 (angle of 155°)
	{
		// Diagram (a): Obtuse Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 105 },
		rotation: 125,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#D27D2D"
	},
	{
		// Diagram (b): The Correct Obtuse Angle (155°)
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 155 },
		rotation: 145,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#C8A2C8"
	},
	{
		// Diagram (c): Acute Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "acute", value: 60 },
		rotation: 120,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#87CEEB"
	},
	{
		// Diagram (d): Obtuse Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 130 },
		rotation: 30,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#FFD700"
	},
	{
		// Diagram (e): Right Angle
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "right", value: 90 },
		rotation: 135,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#90EE90"
	},
	{
		// Explanation Diagram
		type: "angleTypeDiagram",
		width: 300,
		height: 300,
		angleType: { type: "obtuse", value: 155 },
		rotation: 145,
		labels: { ray1Point: "", vertex: "", ray2Point: "" },
		showAngleArc: true,
		sectorColor: "#C8A2C8"
	}
]
