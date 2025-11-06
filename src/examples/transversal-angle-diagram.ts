import type { TransversalAngleDiagramProps } from "@/widgets/generators/transversal-angle-diagram"

export const transversalAngleDiagramExamples: TransversalAngleDiagramProps[] = [
	{
		type: "transversalAngleDiagram",
		width: 500,
		height: 450,
		points: {
			transversalRayA: { id: "pt_ray_E", label: "E" },
			intersection1: { id: "pt_cycle_M", label: "M" },
			intersection2: { id: "pt_cycle_N", label: "N" },
			transversalRayB: { id: "pt_ray_F", label: "F" },
			line1RayA: { id: "pt_ray_C", label: "C" },
			line1RayB: { id: "pt_ray_D", label: "D" },
			line2RayA: { id: "pt_ray_A", label: "A" },
			line2RayB: { id: "pt_ray_B", label: "B" }
		},
		line1Angle: 0,
		line2Angle: 0,
		transversalAngle: -70,
		intersection1Cycle: {
			nextClockwiseFromTransversalA: "line1RayA"
		},
		intersection2Cycle: {
			nextClockwiseFromIntersection1: "line2RayA"
		},
		angles: [
			{
				label: "1",
				color: "#5DADE2",
				vertex: "pt_cycle_M",
				from: "pt_ray_E",
				to: "pt_ray_C"
			},
			{
				label: "2",
				color: "#F5B041",
				vertex: "pt_cycle_M",
				from: "pt_ray_E",
				to: "pt_ray_D"
			},
			{
				label: "3",
				color: "#F7DC6F",
				vertex: "pt_cycle_N",
				from: "pt_cycle_M",
				to: "pt_ray_A"
			},
			{
				label: "4",
				color: "#58D68D",
				vertex: "pt_cycle_N",
				from: "pt_cycle_M",
				to: "pt_ray_B"
			},
			{
				label: "5",
				color: "#AF601A",
				vertex: "pt_cycle_N",
				from: "pt_ray_B",
				to: "pt_ray_F"
			}
		]
	},
	{
		type: "transversalAngleDiagram",
		width: 500,
		height: 450,
		points: {
			transversalRayA: { id: "pt_ray_E", label: "E" },
			intersection1: { id: "pt_cycle_G", label: "G" },
			intersection2: { id: "pt_cycle_H", label: "H" },
			transversalRayB: { id: "pt_ray_F", label: "F" },
			line1RayA: { id: "pt_ray_C", label: "C" },
			line1RayB: { id: "pt_ray_D", label: "D" },
			line2RayA: { id: "pt_ray_A", label: "A" },
			line2RayB: { id: "pt_ray_B", label: "B" }
		},
		line1Angle: 20,
		line2Angle: 10,
		transversalAngle: -30,
		intersection1Cycle: {
			nextClockwiseFromTransversalA: "line1RayB"
		},
		intersection2Cycle: {
			nextClockwiseFromIntersection1: "line2RayB"
		},
		angles: [
			{
				label: "1",
				color: "#5DADE2",
				vertex: "pt_cycle_G",
				from: "pt_ray_E",
				to: "pt_ray_C"
			},
			{
				label: "2",
				color: "#F5B041",
				vertex: "pt_cycle_G",
				from: "pt_ray_E",
				to: "pt_ray_D"
			},
			{
				label: "6",
				color: "#C39BD3",
				vertex: "pt_cycle_G",
				from: "pt_ray_D",
				to: "pt_cycle_H"
			},
			{
				label: "5",
				color: "#F7DC6F",
				vertex: "pt_cycle_H",
				from: "pt_cycle_G",
				to: "pt_ray_A"
			},
			{
				label: "4",
				color: "#58D68D",
				vertex: "pt_cycle_H",
				from: "pt_ray_A",
				to: "pt_ray_F"
			},
			{
				label: "3",
				color: "#AF601A",
				vertex: "pt_cycle_H",
				from: "pt_ray_B",
				to: "pt_ray_F"
			}
		]
	}
]
