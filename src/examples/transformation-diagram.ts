import type { TransformationDiagramProps } from "@/widgets/registry"

// Examples for transformationDiagram widget
// Extracted from real-world questions to ensure realistic coverage
export const transformationDiagramExamples: TransformationDiagramProps[] = [
	// Extracted from question: x0f909223c9cac4e5
	// Question: Determine the angle of rotation about a point
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 325,
		height: 300,
		preImage: {
			label: null,
			vertices: [
				{ x: 93.75, y: 118.75 },
				{ x: 150, y: 81.25 },
				{ x: 206.25, y: 43.75 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#b3b3b3",
			vertexLabels: ["A'", "P", "A"]
		},
		transformation: {
			type: "rotation",
			angle: 0,
			centerOfRotation: { x: 150, y: 81.25 }
		}
	},
	// Extracted from question: x64eedd0feaf0a4e9
	// Question: Determine angles of rotation for a rotated quadrilateral
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABCD",
			vertices: [
				{ x: 85.714, y: 150 },
				{ x: 128.571, y: 128.571 },
				{ x: 42.857, y: 42.857 },
				{ x: 42.857, y: 107.143 }
			],
			fillColor: "#A7E8F3",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C", "D"]
		},
		transformation: {
			type: "rotation",
			angle: -90,
			centerOfRotation: { x: 150, y: 150 }
		}
	},
	// Extracted from question: x1c6f03f93e701299
	// Question: Determine angles of rotation from a rotated triangle
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 325,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 131.25, y: 62.5 },
				{ x: 150, y: 100 },
				{ x: 187.5, y: 25 }
			],
			fillColor: "#ca337c33",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#ca337c",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "rotation",
			angle: 90,
			centerOfRotation: { x: 150, y: 100 }
		}
	},
	// Extracted from question: x42fd94585aa7869b
	// Question: Determine the angle of rotation from a diagram
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 325,
		height: 306.25,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 93.75, y: 231.25 },
				{ x: 75, y: 193.75 },
				{ x: 37.5, y: 250 }
			],
			fillColor: "#FFFFFF00",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "rotation",
			angle: 180,
			centerOfRotation: { x: 150, y: 156.25 }
		}
	},
	// Extracted from question: x297abd97564f5023
	// Question: Determine angles of rotation from a rotated quadrilateral
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 325,
		height: 300,
		preImage: {
			label: "ABCD",
			vertices: [
				{ x: 93.75, y: 175 },
				{ x: 75, y: 137.5 },
				{ x: 187.5, y: 43.75 },
				{ x: 168.75, y: 212.5 }
			],
			fillColor: "#f6d1e2",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#ca337c",
			vertexLabels: ["A", "B", "C", "D"]
		},
		transformation: {
			type: "rotation",
			angle: -90,
			centerOfRotation: { x: 150, y: 137.5 }
		}
	},
	// Extracted from question: x6d4dfb26a3b44a3e
	// Question: Identify the image after a 90° clockwise rotation
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 325,
		height: 300,
		preImage: {
			label: "center",
			vertices: [
				{ x: 243.75, y: 175 },
				{ x: 249.94, y: 123.101 },
				{ x: 187.5, y: 43.75 },
				{ x: 56.25, y: 100 },
				{ x: 50.06, y: 151.899 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#00000000",
			vertexLabels: ["A", "B", "P", "C", "D"]
		},
		transformation: {
			type: "rotation",
			angle: 0,
			centerOfRotation: { x: 150, y: 137.5 }
		}
	},
	// Extracted from question: x014b6ef7252c3176
	// Question: Identify the image after a 270° clockwise rotation
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: null,
			vertices: [
				{ x: 25, y: 125 },
				{ x: 96.967, y: 198.744 },
				{ x: 273.744, y: 128.033 },
				{ x: 275, y: 25 },
				{ x: 200, y: 200 },
				{ x: 150, y: 75 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#00000000",
			vertexLabels: ["A", "B", "R", "D", "C", "center"]
		},
		transformation: {
			type: "rotation",
			angle: -270,
			centerOfRotation: { x: 150, y: 75 }
		}
	},
	// Extracted from question: x02d283b3a5235279
	// Question: Length of a corresponding segment after rotation
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 350,
		height: 350,
		preImage: {
			label: "ABCD",
			vertices: [
				{ x: 116.667, y: 262.5 },
				{ x: 230.417, y: 291.667 },
				{ x: 87.5, y: 320.833 },
				{ x: 29.167, y: 262.5 }
			],
			fillColor: "#E0F2FA",
			angleMarks: [
				{ label: "123°", radius: 18, vertexIndex: 2, labelDistance: 22 }
			],
			sideLengths: [
				{ value: "4", offset: 12, position: "outside" },
				{ value: "5", offset: 12, position: "outside" },
				{ value: "2.8", offset: 12, position: "outside" },
				{ value: "3", offset: 12, position: "outside" }
			],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C", "D"]
		},
		transformation: {
			type: "rotation",
			angle: 55,
			centerOfRotation: { x: 58.333, y: 87.5 }
		}
	},
	// Extracted from question: xfe0e823a7ded0a83
	// Question: Measure of an angle after rotation
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 350,
		height: 318,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 41.486, y: 27.555 },
				{ x: 147.445, y: 162.212 },
				{ x: 140.061, y: 47.727 }
			],
			fillColor: "#00000000",
			angleMarks: [
				{ label: "40°", radius: 12.5, vertexIndex: 2, labelDistance: 18 }
			],
			sideLengths: [],
			strokeColor: "#000000",
			vertexLabels: ["B", "C", "A"]
		},
		transformation: {
			type: "rotation",
			angle: -120,
			centerOfRotation: { x: 222.727, y: 95.455 }
		}
	},
	// Extracted from question: xf613edebe37981e4
	// Question: Length of a segment under reflection
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 323.077,
		height: 350,
		preImage: {
			label: "ABCD",
			vertices: [
				{ x: 269.231, y: 188.462 },
				{ x: 188.462, y: 215.385 },
				{ x: 161.538, y: 323.077 },
				{ x: 296.154, y: 269.231 }
			],
			fillColor: "#CCE7FF",
			angleMarks: [
				{ label: "90°", radius: 18, vertexIndex: 0, labelDistance: 12 },
				{ label: "93°", radius: 18, vertexIndex: 3, labelDistance: 12 }
			],
			sideLengths: [
				{ value: "32", offset: 12, position: "outside" },
				{ value: "", offset: 12, position: "outside" },
				{ value: "54", offset: 12, position: "outside" },
				{ value: "", offset: 12, position: "outside" }
			],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C", "D"]
		},
		transformation: {
			type: "reflection",
			lineOfReflection: {
				to: { x: 322.203, y: 81.352 },
				from: { x: 0, y: 296.154 },
				color: "#000000",
				style: "solid"
			}
		}
	},
	// Extracted from question: x0611b8bfc546e264
	// Question: Measure of angle B in a translated triangle
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 350,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 58.333, y: 145.833 },
				{ x: 29.167, y: 204.167 },
				{ x: 175, y: 233.333 }
			],
			fillColor: "#E0F3FA",
			angleMarks: [
				{ label: "80°", radius: 16, vertexIndex: 0, labelDistance: 20 },
				{ label: "26°", radius: 16, vertexIndex: 2, labelDistance: 20 }
			],
			sideLengths: [],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "translation",
			vector: { x: 100, y: -80 }
		}
	},
	// Extracted from question: x1ff6a2dddffe92c6
	// Question: Perimeter of a translated quadrilateral
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 350,
		height: 318,
		preImage: {
			label: "ABCD",
			vertices: [
				{ x: 127.273, y: 63.636 },
				{ x: 159.091, y: 127.273 },
				{ x: 286.364, y: 63.636 },
				{ x: 95.454, y: 31.818 }
			],
			fillColor: "#ADD8E655",
			angleMarks: [
				{ label: "90°", radius: 18, vertexIndex: 1, labelDistance: 14 },
				{ label: "36°", radius: 18, vertexIndex: 2, labelDistance: 14 },
				{ label: "36°", radius: 18, vertexIndex: 3, labelDistance: 14 }
			],
			sideLengths: [
				{ value: "2.2", offset: 8, position: "inside" },
				{ value: "4.5", offset: 8, position: "inside" },
				{ value: "6.1", offset: 8, position: "inside" },
				{ value: "1.4", offset: 8, position: "inside" }
			],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C", "D"]
		},
		transformation: {
			type: "translation",
			vector: { x: -63.637, y: 159.091 }
		}
	},
	// Extracted from question: x28a540bb2db4835d
	// Question: Find the measure of angle C in a reflected triangle
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 350,
		height: 303.333,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 23.333, y: 256.667 },
				{ x: 140, y: 210 },
				{ x: 46.667, y: 116.667 }
			],
			fillColor: "#00000000",
			angleMarks: [
				{ label: "67°", radius: 18, vertexIndex: 1, labelDistance: 20 },
				{ label: "59°", radius: 18, vertexIndex: 0, labelDistance: 20 }
			],
			sideLengths: [],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "reflection",
			lineOfReflection: {
				to: { x: 221.667, y: 303.333 },
				from: { x: 70, y: 0 },
				color: "#000000",
				style: "solid"
			}
		}
	},
	// Extracted from question: xbbbde7ff25ddf0ae
	// Question: Area of a rectangle after a rotation
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 300,
		height: 350,
		preImage: {
			label: "ABCD",
			vertices: [
				{ x: 60, y: 120 },
				{ x: 180, y: 120 },
				{ x: 180, y: 160 },
				{ x: 60, y: 160 }
			],
			fillColor: "#6aa9ff33",
			angleMarks: [],
			sideLengths: [
				{ value: "", offset: 8, position: "outside" },
				{ value: "2", offset: 10, position: "inside" },
				{ value: "6", offset: 10, position: "inside" },
				{ value: "", offset: 8, position: "outside" }
			],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C", "D"]
		},
		transformation: {
			type: "rotation",
			angle: 95,
			centerOfRotation: { x: 120, y: 60 }
		}
	},
	// Extracted from question: x1a7907dab800f3a1
	// Question: Perimeter of a triangle after a rotation
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 300,
		height: 350,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 33.418, y: 198.371 },
				{ x: 104.758, y: 315.66 },
				{ x: 155.357, y: 297.244 }
			],
			fillColor: "#A7C7E780",
			angleMarks: [
				{ label: "20°", radius: 18, vertexIndex: 0, labelDistance: 14 }
			],
			sideLengths: [
				{ value: "5.1", offset: 10, position: "outside" },
				{ value: "2", offset: 10, position: "outside" },
				{ value: "5.8", offset: 10, position: "outside" }
			],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "rotation",
			angle: 135,
			centerOfRotation: { x: 134.615, y: 161.538 }
		}
	},
	// Extracted from question: xce360a6f42b7c514
	// Question: Area of a translated right triangle
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 350,
		height: 318.182,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 318.182, y: 63.636 },
				{ x: 222.727, y: 254.545 },
				{ x: 286.364, y: 286.364 }
			],
			fillColor: "#CCE5FF",
			angleMarks: [
				{ label: "18°", radius: 20, vertexIndex: 0, labelDistance: 12 }
			],
			sideLengths: [
				{ value: "6.1 units", offset: 10, position: "outside" },
				{ value: "2 units", offset: 10, position: "outside" },
				{ value: "", offset: 10, position: "outside" }
			],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "translation",
			vector: { x: -190.909, y: -31.818 }
		}
	},
	// Extracted from question: x49bbe652d98dba9b
	// Question: Area of a reflected triangle
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 300,
		height: 350,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 159.091, y: 127.273 },
				{ x: 31.818, y: 127.273 },
				{ x: 159.091, y: 31.818 }
			],
			fillColor: "#CCE5FF80",
			angleMarks: [
				{ label: "90°", radius: 12, vertexIndex: 0, labelDistance: 16 }
			],
			sideLengths: [
				{ value: "4", offset: 10, position: "outside" },
				{ value: "", offset: 10, position: "outside" },
				{ value: "3", offset: 10, position: "outside" }
			],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "reflection",
			lineOfReflection: {
				to: { x: 286.364, y: 148.485 },
				from: { x: 0.996, y: 243.607 },
				color: "#000000",
				style: "solid"
			}
		}
	},
	// Extracted from question: xfebb6b0033d5b89b
	// Question: Length of a segment after a translation
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 350,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 202.632, y: 128.947 },
				{ x: 313.158, y: 92.105 },
				{ x: 257.895, y: 202.632 }
			],
			fillColor: "#ADD8E633",
			angleMarks: [],
			sideLengths: [
				{ value: "8", offset: 12, position: "outside" },
				{ value: "9", offset: 12, position: "outside" },
				{ value: "6", offset: 12, position: "outside" }
			],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "translation",
			vector: { x: -165.79, y: -55.263 }
		}
	},
	// Extracted from question: x889f3d155d57ca53
	// Question: Perimeter of a reflected quadrilateral
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 350,
		height: 300,
		preImage: {
			label: "ABCD",
			vertices: [
				{ x: 95.454, y: 222.727 },
				{ x: 31.818, y: 190.909 },
				{ x: 31.818, y: 127.273 },
				{ x: 127.273, y: 127.273 }
			],
			fillColor: "#ADD8E680",
			angleMarks: [],
			sideLengths: [
				{ value: "22", offset: 12, position: "outside" },
				{ value: "20", offset: 12, position: "outside" },
				{ value: "30", offset: 12, position: "outside" },
				{ value: "32", offset: 12, position: "outside" }
			],
			strokeColor: "#000000",
			vertexLabels: ["A", "B", "C", "D"]
		},
		transformation: {
			type: "reflection",
			lineOfReflection: {
				to: { x: 212.121, y: 254.545 },
				from: { x: 127.273, y: 0 },
				color: "#000000",
				style: "solid"
			}
		}
	},
	// Extracted from question: x47365ede15825ef1
	// Question: Identify a dilation image with scale factor 3/2
	// Widget key: choice_a_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 119, y: 51 },
				{ x: 119, y: 119 },
				{ x: 68, y: 85 }
			],
			fillColor: "#ffffff",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.75,
			centerOfDilation: { x: 119, y: 85 }
		}
	},
	// Extracted from question: x47365ede15825ef1
	// Question: Identify a dilation image with scale factor 3/2
	// Widget key: choice_b_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 119, y: 51 },
				{ x: 119, y: 119 },
				{ x: 68, y: 85 }
			],
			fillColor: "#ffffff",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 1.5,
			centerOfDilation: { x: 119, y: 85 }
		}
	},
	// Extracted from question: x47365ede15825ef1
	// Question: Identify a dilation image with scale factor 3/2
	// Widget key: choice_c_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 119, y: 51 },
				{ x: 119, y: 119 },
				{ x: 68, y: 85 }
			],
			fillColor: "#ffffff",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 1.5,
			centerOfDilation: { x: 68, y: 85 }
		}
	},
	// Extracted from question: x47365ede15825ef1
	// Question: Identify a dilation image with scale factor 3/2
	// Widget key: choice_d_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 119, y: 51 },
				{ x: 119, y: 119 },
				{ x: 68, y: 85 }
			],
			fillColor: "#ffffff",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.75,
			centerOfDilation: { x: 68, y: 85 }
		}
	},
	// Extracted from question: x604c7c450eb40990
	// Question: Identify the image of a triangle under dilation
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 102, y: 51 },
				{ x: 136, y: 102 },
				{ x: 51, y: 136 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 1,
			centerOfDilation: { x: 102, y: 102 }
		}
	},
	// Extracted from question: x604c7c450eb40990
	// Question: Identify the image of a triangle under dilation
	// Widget key: choice_a_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 102, y: 51 },
				{ x: 136, y: 102 },
				{ x: 51, y: 136 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.6666666667,
			centerOfDilation: { x: 102, y: 102 }
		}
	},
	// Extracted from question: x604c7c450eb40990
	// Question: Identify the image of a triangle under dilation
	// Widget key: choice_b_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 102, y: 51 },
				{ x: 136, y: 102 },
				{ x: 51, y: 136 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 1.3333333333,
			centerOfDilation: { x: 102, y: 102 }
		}
	},
	// Extracted from question: x604c7c450eb40990
	// Question: Identify the image of a triangle under dilation
	// Widget key: choice_c_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 102, y: 51 },
				{ x: 136, y: 102 },
				{ x: 51, y: 136 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 1.3333333333,
			centerOfDilation: { x: 136, y: 102 }
		}
	},
	// Extracted from question: x604c7c450eb40990
	// Question: Identify the image of a triangle under dilation
	// Widget key: choice_d_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 102, y: 51 },
				{ x: 136, y: 102 },
				{ x: 51, y: 136 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.6666666667,
			centerOfDilation: { x: 136, y: 102 }
		}
	},
	// Extracted from question: xc0c504fedb55ca58
	// Question: Identify the image of a triangle after a dilation
	// Widget key: image_1
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 145.714, y: 48.571 },
				{ x: 145.714, y: 113.333 },
				{ x: 48.571, y: 32.381 }
			],
			fillColor: "#E6F7FB",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 1,
			centerOfDilation: { x: 145.714, y: 80.952 }
		}
	},
	// Extracted from question: xc0c504fedb55ca58
	// Question: Identify the image of a triangle after a dilation
	// Widget key: choice_a_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 145.714, y: 48.571 },
				{ x: 145.714, y: 113.333 },
				{ x: 48.571, y: 32.381 }
			],
			fillColor: "#E6F7FB",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.75,
			centerOfDilation: { x: 145.714, y: 80.952 }
		}
	},
	// Extracted from question: xc0c504fedb55ca58
	// Question: Identify the image of a triangle after a dilation
	// Widget key: choice_b_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 145.714, y: 48.571 },
				{ x: 145.714, y: 113.333 },
				{ x: 48.571, y: 32.381 }
			],
			fillColor: "#E6F7FB",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.25,
			centerOfDilation: { x: 145.714, y: 80.952 }
		}
	},
	// Extracted from question: xc0c504fedb55ca58
	// Question: Identify the image of a triangle after a dilation
	// Widget key: choice_c_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 145.714, y: 48.571 },
				{ x: 145.714, y: 113.333 },
				{ x: 48.571, y: 32.381 }
			],
			fillColor: "#E6F7FB",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.25,
			centerOfDilation: { x: 145.714, y: 48.571 }
		}
	},
	// Extracted from question: xc0c504fedb55ca58
	// Question: Identify the image of a triangle after a dilation
	// Widget key: choice_d_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 145.714, y: 48.571 },
				{ x: 145.714, y: 113.333 },
				{ x: 48.571, y: 32.381 }
			],
			fillColor: "#E6F7FB",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.75,
			centerOfDilation: { x: 145.714, y: 48.571 }
		}
	},
	// Extracted from question: x6654329a81441075
	// Question: Identify a dilated triangle with a given center and scale factor
	// Widget key: choice_a_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 119, y: 34 },
				{ x: 102, y: 136 },
				{ x: 34, y: 85 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.4,
			centerOfDilation: { x: 119, y: 34 }
		}
	},
	// Extracted from question: x6654329a81441075
	// Question: Identify a dilated triangle with a given center and scale factor
	// Widget key: choice_b_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 119, y: 34 },
				{ x: 102, y: 136 },
				{ x: 34, y: 85 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.75,
			centerOfDilation: { x: 119, y: 34 }
		}
	},
	// Extracted from question: x6654329a81441075
	// Question: Identify a dilated triangle with a given center and scale factor
	// Widget key: choice_c_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 119, y: 34 },
				{ x: 102, y: 136 },
				{ x: 34, y: 85 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.75,
			centerOfDilation: { x: 110.5, y: 46.75 }
		}
	},
	// Extracted from question: x6654329a81441075
	// Question: Identify a dilated triangle with a given center and scale factor
	// Widget key: choice_d_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 119, y: 34 },
				{ x: 102, y: 136 },
				{ x: 34, y: 85 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.4,
			centerOfDilation: { x: 110.5, y: 46.75 }
		}
	},
	// Extracted from question: x42af57ec523a07d4
	// Question: Identify the image of a triangle under dilation (scale factor 1/3)
	// Widget key: choice_a_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 17, y: 34 },
				{ x: 136, y: 68 },
				{ x: 68, y: 153 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.75,
			centerOfDilation: { x: 85, y: 85 }
		}
	},
	// Extracted from question: x42af57ec523a07d4
	// Question: Identify the image of a triangle under dilation (scale factor 1/3)
	// Widget key: choice_b_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 17, y: 34 },
				{ x: 136, y: 68 },
				{ x: 68, y: 153 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.3333333333,
			centerOfDilation: { x: 85, y: 85 }
		}
	},
	// Extracted from question: x42af57ec523a07d4
	// Question: Identify the image of a triangle under dilation (scale factor 1/3)
	// Widget key: choice_c_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 17, y: 34 },
				{ x: 136, y: 68 },
				{ x: 68, y: 153 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.3333333333,
			centerOfDilation: { x: 42.5, y: 93.5 }
		}
	},
	// Extracted from question: x42af57ec523a07d4
	// Question: Identify the image of a triangle under dilation (scale factor 1/3)
	// Widget key: choice_d_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 17, y: 34 },
				{ x: 136, y: 68 },
				{ x: 68, y: 153 }
			],
			fillColor: "#00000000",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.75,
			centerOfDilation: { x: 42.5, y: 93.5 }
		}
	},
	// Extracted from question: xbc50b5a72210c4cc
	// Question: Dilation of a triangle with center P and scale factor 2/3
	// Widget key: choice_a_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 51, y: 34 },
				{ x: 102, y: 34 },
				{ x: 51, y: 136 }
			],
			fillColor: "#FFFFFF",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.3333333,
			centerOfDilation: { x: 136, y: 136 }
		}
	},
	// Extracted from question: xbc50b5a72210c4cc
	// Question: Dilation of a triangle with center P and scale factor 2/3
	// Widget key: choice_b_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 51, y: 34 },
				{ x: 102, y: 34 },
				{ x: 51, y: 136 }
			],
			fillColor: "#FFFFFF",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.6666667,
			centerOfDilation: { x: 136, y: 136 }
		}
	},
	// Extracted from question: xbc50b5a72210c4cc
	// Question: Dilation of a triangle with center P and scale factor 2/3
	// Widget key: choice_c_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 51, y: 34 },
				{ x: 102, y: 34 },
				{ x: 51, y: 136 }
			],
			fillColor: "#FFFFFF",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.6666667,
			centerOfDilation: { x: 102, y: 34 }
		}
	},
	// Extracted from question: xbc50b5a72210c4cc
	// Question: Dilation of a triangle with center P and scale factor 2/3
	// Widget key: choice_d_figure
	{
		type: "transformationDiagram",
		width: 300,
		height: 300,
		preImage: {
			label: "ABC",
			vertices: [
				{ x: 51, y: 34 },
				{ x: 102, y: 34 },
				{ x: 51, y: 136 }
			],
			fillColor: "#FFFFFF",
			angleMarks: [],
			sideLengths: [],
			strokeColor: "#11accd",
			vertexLabels: ["A", "B", "C"]
		},
		transformation: {
			type: "dilation",
			scaleFactor: 0.3333333,
			centerOfDilation: { x: 102, y: 34 }
		}
	}
]
