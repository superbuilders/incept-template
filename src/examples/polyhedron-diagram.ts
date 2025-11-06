import type { PolyhedronDiagramProps } from "@/widgets/generators/polyhedron-diagram"

export const polyhedronDiagramExamples: PolyhedronDiagramProps[] = [
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [
			{
				text: "4 units",
				target: "length"
			},
			{
				text: "3 units",
				target: "width"
			},
			{
				text: "h units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [
			{
				label: "√34",
				toVertexIndex: 6,
				fromVertexIndex: 0
			}
		],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 300,
		labels: [
			{
				text: "8",
				target: "length"
			},
			{
				text: "2",
				target: "width"
			},
			{
				text: "5",
				target: "height"
			}
		],
		segments: null,
		diagonals: [
			{
				label: "d",
				toVertexIndex: 7,
				fromVertexIndex: 0
			}
		],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: [
			{
				to: {
					a: 0,
					b: 1,
					t: 0.85,
					type: "edgePoint"
				},
				from: {
					a: 0,
					b: 1,
					t: 0.15,
					type: "edgePoint"
				},
				label: "8"
			},
			{
				to: {
					a: 1,
					b: 2,
					t: 0.85,
					type: "edgePoint"
				},
				from: {
					a: 1,
					b: 2,
					t: 0.15,
					type: "edgePoint"
				},
				label: "5"
			},
			{
				to: {
					a: 0,
					b: 1,
					type: "edgeMidpoint"
				},
				from: {
					type: "vertex",
					index: 2
				},
				label: "h"
			}
		],
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: [
			{
				at: {
					a: 0,
					b: 1,
					type: "edgeMidpoint"
				},
				to: {
					type: "vertex",
					index: 2
				},
				from: {
					type: "vertex",
					index: 0
				},
				type: "right",
				sizePx: 10
			}
		],
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 300,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [
			{
				label: "d",
				toVertexIndex: 6,
				fromVertexIndex: 0
			}
		],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "h",
				target: "height"
			},
			{
				text: "6",
				target: "baseFace"
			},
			{
				text: "3√2",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 400,
		height: 360,
		labels: [
			{
				text: "6 cm",
				target: "width"
			},
			{
				text: "7 cm",
				target: "height"
			},
			{
				text: "4 cm",
				target: "length"
			},
			{
				text: "s",
				target: "frontFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "60",
				target: "length"
			},
			{
				text: "60",
				target: "width"
			},
			{
				text: "60",
				target: "height"
			}
		],
		segments: null,
		diagonals: [
			{
				label: "d",
				toVertexIndex: 7,
				fromVertexIndex: 1
			}
		],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 350,
		labels: [
			{
				text: "2",
				target: "length"
			},
			{
				text: "3",
				target: "width"
			},
			{
				text: "6",
				target: "height"
			}
		],
		segments: null,
		diagonals: [
			{
				label: "d",
				toVertexIndex: 6,
				fromVertexIndex: 0
			}
		],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 300,
		height: 350,
		labels: [
			{
				text: "17 units",
				target: "slantHeight"
			},
			{
				text: "15 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "rightFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "12",
				target: "length"
			},
			{
				text: "15",
				target: "height"
			},
			{
				text: "s",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "4",
				target: "length"
			},
			{
				text: "5",
				target: "height"
			},
			{
				text: "S",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "10",
				target: "length"
			},
			{
				text: "h",
				target: "height"
			},
			{
				text: "8",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 400,
		height: 320,
		labels: [
			{
				text: "4 units",
				target: "length"
			},
			{
				text: "4 units",
				target: "width"
			},
			{
				text: "3 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 400,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 300,
		labels: [
			{
				text: "4 units",
				target: "length"
			},
			{
				text: "2 units",
				target: "width"
			},
			{
				text: "1 unit",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "2 units",
				target: "length"
			},
			{
				text: "1 unit",
				target: "height"
			},
			{
				text: "6 units",
				target: "frontFace"
			},
			{
				text: "4 units",
				target: "leftFace"
			},
			{
				text: "4 units",
				target: "rightFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 320,
		labels: [
			{
				text: "5 units",
				target: "length"
			},
			{
				text: "3 units",
				target: "width"
			},
			{
				text: "2 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 320,
		height: 320,
		labels: [
			{
				text: "7 units",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 380,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "3 units",
				target: "length"
			},
			{
				text: "5 units",
				target: "width"
			},
			{
				text: "6 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "5 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "2 units",
				target: "length"
			},
			{
				text: "3 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: ",  ",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 360,
		labels: [
			{
				text: "4 units",
				target: "length"
			},
			{
				text: "4 units",
				target: "width"
			},
			{
				text: "5 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "6 units",
				target: "length"
			},
			{
				text: "5 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 380,
		height: 360,
		labels: [
			{
				text: "11 units",
				target: "length"
			},
			{
				text: "8 units",
				target: "width"
			},
			{
				text: "2 units",
				target: "height"
			},
			{
				text: "5 units",
				target: "leftFace"
			},
			{
				text: "5 units",
				target: "rightFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "10 units",
				target: "length"
			},
			{
				text: "10 units",
				target: "width"
			},
			{
				text: "8 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "9 units",
				target: "width"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "4 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 380,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "4 units",
				target: "length"
			},
			{
				text: "8 units",
				target: "width"
			},
			{
				text: "7 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 320,
		height: 320,
		labels: [
			{
				text: "8 units",
				target: "width"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace:
			"]}'}  } }}}} }}}} } }  } }  } } } } } } }  } } } }}}  } } }  }  } } } } } } }  }  } }  }}",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "3 units",
				target: "length"
			},
			{
				text: "2 units",
				target: "width"
			},
			{
				text: "5 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "type",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 300,
		labels: [
			{
				text: "3.5 m",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "1 meter",
				target: "length"
			},
			{
				text: "0.4 meter",
				target: "width"
			},
			{
				text: "0.8 meter",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "80 centimeters",
				target: "length"
			},
			{
				text: "3 centimeters",
				target: "width"
			},
			{
				text: "200 centimeters",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "13 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "20 cm",
				target: "length"
			},
			{
				text: "8 cm",
				target: "width"
			},
			{
				text: "30 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 380,
		height: 360,
		labels: [
			{
				text: "30 cm",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "3 m",
				target: "length"
			},
			{
				text: "2 m",
				target: "baseFace"
			},
			{
				text: "1.7 m",
				target: "baseFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 400,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "70 cm",
				target: "length"
			},
			{
				text: "70 cm",
				target: "width"
			},
			{
				text: "140 cm",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 360,
		labels: [
			{
				text: "0.4 m",
				target: "length"
			},
			{
				text: "0.4 m",
				target: "width"
			},
			{
				text: "0.6 m",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 360,
		labels: [
			{
				text: "25 cm",
				target: "length"
			},
			{
				text: "25 cm",
				target: "width"
			},
			{
				text: "30 cm",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "6 cm",
				target: "length"
			},
			{
				text: "6 cm",
				target: "width"
			},
			{
				text: "15 cm",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "40 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 350,
		labels: [
			{
				text: "10 cm",
				target: "length"
			},
			{
				text: "10 cm",
				target: "width"
			},
			{
				text: "90 cm",
				target: "height"
			}
		],
		segments: [],
		diagonals: [],
		shadedFace: "shapeRectangularPrism",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "1.3 m",
				target: "length"
			},
			{
				text: "0.8 m",
				target: "width"
			},
			{
				text: "1.1 m",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "square base",
				target: "topFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "hexagonal base",
				target: "topFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "pentagonal base",
				target: "topFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "triangular base",
				target: "topFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 400,
		height: 340,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "1/4 cm",
				target: "length"
			},
			{
				text: "1 cm",
				target: "width"
			},
			{
				text: "2 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 320,
		labels: [
			{
				text: "7 halves centimeters",
				target: "length"
			},
			{
				text: "5 centimeters",
				target: "width"
			},
			{
				text: "7 fifths centimeters",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 440,
		height: 333,
		labels: [
			{
				text: "3/2 cm",
				target: "length"
			},
			{
				text: "3/2 cm",
				target: "width"
			},
			{
				text: "3/2 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 320,
		labels: [
			{
				text: "15/4 cm",
				target: "length"
			},
			{
				text: "8/3 cm",
				target: "width"
			},
			{
				text: "6/5 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 370,
		height: 320,
		labels: [
			{
				text: "5/2 cm",
				target: "length"
			},
			{
				text: "5/3 cm",
				target: "width"
			},
			{
				text: "5/4 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 300,
		labels: [
			{
				text: "3 cm",
				target: "length"
			},
			{
				text: "4/3 cm",
				target: "width"
			},
			{
				text: "3/5 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "1/2 cm",
				target: "length"
			},
			{
				text: "1/2 cm",
				target: "width"
			},
			{
				text: "3 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "3/4 cm",
				target: "length"
			},
			{
				text: "1/3 cm",
				target: "width"
			},
			{
				text: "5/2 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "length = 1/2 cm",
				target: "length"
			},
			{
				text: "width = 4 cm",
				target: "width"
			},
			{
				text: "height = 5/2 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "rightFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 350,
		labels: [
			{
				text: "1/5 cm",
				target: "length"
			},
			{
				text: "4/5 cm",
				target: "width"
			},
			{
				text: "10/3 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "height",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [
			{
				text: "6 centimeters",
				target: "length"
			},
			{
				text: "5 centimeters",
				target: "width"
			},
			{
				text: "two-thirds centimeter",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 426,
		height: 320,
		labels: [
			{
				text: "5/3 cm",
				target: "length"
			},
			{
				text: "3/2 cm",
				target: "width"
			},
			{
				text: "4/5 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 480,
		height: 360,
		labels: [
			{
				text: "5/4 cm",
				target: "length"
			},
			{
				text: "4/3 cm",
				target: "width"
			},
			{
				text: "3/5 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 333,
		height: 320,
		labels: [
			{
				text: "7/4 cm",
				target: "length"
			},
			{
				text: "3 cm",
				target: "width"
			},
			{
				text: "2 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 420,
		height: 360,
		labels: [
			{
				text: "1/3 cm",
				target: "length"
			},
			{
				text: "1/2 cm",
				target: "width"
			},
			{
				text: "1/4 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 370,
		height: 320,
		labels: [
			{
				text: "2 cm",
				target: "length"
			},
			{
				text: "7/3 cm",
				target: "width"
			},
			{
				text: "2 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 420,
		height: 320,
		labels: [
			{
				text: "3/2 cm",
				target: "length"
			},
			{
				text: "1/4 cm",
				target: "width"
			},
			{
				text: "5/3 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 470.0944444444445,
		height: 349.34444444444443,
		labels: [
			{
				text: "4/3 cm",
				target: "length"
			},
			{
				text: "4/3 cm",
				target: "width"
			},
			{
				text: "4/3 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "3 halves centimeters",
				target: "length"
			},
			{
				text: "4 centimeters",
				target: "width"
			},
			{
				text: "1 half centimeter",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 420,
		height: 360,
		labels: [
			{
				text: "2/5 cm",
				target: "length"
			},
			{
				text: "2/5 cm",
				target: "width"
			},
			{
				text: "2/5 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 420,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 420,
		labels: [],
		segments: [],
		diagonals: [],
		shadedFace: "rightFace",
		angleMarkers: [],
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 420,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 400,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 320,
		labels: [
			{
				text: "5 units",
				target: "length"
			},
			{
				text: "5 units",
				target: "width"
			},
			{
				text: "4 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "7 units",
				target: "length"
			},
			{
				text: "4 units",
				target: "height"
			},
			{
				text: "6 units",
				target: "width"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "3 units",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 320,
		height: 320,
		labels: [
			{
				text: "2 units",
				target: "length"
			},
			{
				text: "2 units",
				target: "width"
			},
			{
				text: "2 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 400,
		height: 300,
		labels: [
			{
				text: "11",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 380,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "2 units",
				target: "length"
			},
			{
				text: "2 units",
				target: "width"
			},
			{
				text: "2 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "3 units",
				target: "baseFace"
			},
			{
				text: "4 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "4 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 380,
		height: 320,
		labels: [
			{
				text: "5 units",
				target: "length"
			},
			{
				text: "2 units",
				target: "width"
			},
			{
				text: "2 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "3 units",
				target: "length"
			},
			{
				text: "4 units",
				target: "width"
			},
			{
				text: "2 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 380,
		height: 340,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 340,
		height: 300,
		labels: [
			{
				text: "2 units",
				target: "width"
			},
			{
				text: "3 units",
				target: "height"
			},
			{
				text: "5 units",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "5 units",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "4 units",
				target: "length"
			},
			{
				text: "4 units",
				target: "width"
			},
			{
				text: "3 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 300,
		labels: [
			{
				text: "50 cm",
				target: "length"
			},
			{
				text: "20 cm",
				target: "width"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "40 cm",
				target: "length"
			},
			{
				text: "25 cm",
				target: "width"
			},
			{
				text: "8 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "1.5 m",
				target: "frontFace"
			},
			{
				text: "3 m",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 320,
		labels: [
			{
				text: "4 cm",
				target: "length"
			},
			{
				text: "2 cm",
				target: "width"
			},
			{
				text: "0.5 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "1.5 m",
				target: "length"
			},
			{
				text: "0.5 m",
				target: "width"
			},
			{
				text: "0.75 m",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 360,
		labels: [
			{
				text: "Top view consists of two rectangles: 30 cm by 10 cm and 12 cm by 10 cm.",
				target: "topFace"
			},
			{
				text: "Height: 5 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 300,
		labels: [
			{
				text: "1 m",
				target: "frontFace"
			},
			{
				text: "0.5 m",
				target: "frontFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "30 cm",
				target: "length"
			},
			{
				text: "30 cm",
				target: "width"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 300,
		labels: [
			{
				text: "21/2 square units",
				target: "frontFace"
			},
			{
				text: "8/3 units",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [
			{
				text: "9/5 square units",
				target: "topFace"
			},
			{
				text: "2/3 unit",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [
			{
				text: "4 1/2 square units",
				target: "bottomFace"
			},
			{
				text: "1 1/3 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "bottomFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [
			{
				text: "2 1/8 square units",
				target: "rightFace"
			},
			{
				text: "4 units",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "rightFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [
			{
				text: "23/4",
				target: "rightFace"
			},
			{
				text: "4/3",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "rightFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 380,
		height: 320,
		labels: [
			{
				text: "9 square units",
				target: "topFace"
			},
			{
				text: "3 2/3 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 300,
		labels: [
			{
				text: "3 and 3 eighths square units",
				target: "baseFace"
			},
			{
				text: "2 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "27/5 square units",
				target: "frontFace"
			},
			{
				text: "5/2 units",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 320,
		labels: [
			{
				text: "3/20 square units",
				target: "backFace"
			},
			{
				text: "2/3 unit",
				target: "length"
			}
		],
		segments: [],
		diagonals: [],
		shadedFace: "backFace",
		angleMarkers: [],
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 340,
		labels: [
			{
				text: "25 fourths square units",
				target: "backFace"
			},
			{
				text: "8 fifths units",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "backFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [
			{
				text: "8 units",
				target: "width"
			},
			{
				text: "5 and 1 fourth square units",
				target: "rightFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "rightFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 380,
		height: 320,
		labels: [
			{
				text: "16 1/4 square units",
				target: "topFace"
			},
			{
				text: "1/2 unit",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 380,
		height: 320,
		labels: [
			{
				text: "3 1/3 square units",
				target: "backFace"
			},
			{
				text: "1 2/5 units",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "backFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "1/2 square units",
				target: "baseFace"
			},
			{
				text: "1 3/4 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "bottomFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "7 1/3 square units",
				target: "frontFace"
			},
			{
				text: "2 units",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "3 m",
				target: "length"
			},
			{
				text: "2 m",
				target: "width"
			},
			{
				text: "1.7 m",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 350,
		height: 300,
		labels: [
			{
				text: "2 thirds unit",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 320,
		height: 320,
		labels: [
			{
				text: "12 units",
				target: "length"
			},
			{
				text: "12 units",
				target: "width"
			},
			{
				text: "8 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "7 units",
				target: "length"
			},
			{
				text: "6 units",
				target: "bottomFace"
			},
			{
				text: "5 units",
				target: "leftFace"
			},
			{
				text: "5 units",
				target: "rightFace"
			},
			{
				text: "4 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "bottomFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 350,
		height: 300,
		labels: [
			{
				text: "2.5 units",
				target: "length"
			},
			{
				text: "4 units",
				target: "width"
			},
			{
				text: "2 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [
			{
				text: "15 cm",
				target: "length"
			},
			{
				text: "4 cm",
				target: "width"
			},
			{
				text: "25 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [
			{
				text: "15 cm",
				target: "length"
			},
			{
				text: "15 cm",
				target: "width"
			},
			{
				text: "15 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 304,
		height: 320,
		labels: [
			{
				text: "20 cm",
				target: "length"
			},
			{
				text: "5 cm",
				target: "width"
			},
			{
				text: "30 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 350,
		height: 350,
		labels: [
			{
				text: "10 units",
				target: "length"
			},
			{
				text: "7 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 320,
		labels: [
			{
				text: "2 1/2 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 320,
		height: 320,
		labels: [
			{
				text: "20 cm",
				target: "length"
			},
			{
				text: "20 cm",
				target: "width"
			},
			{
				text: "20 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 380,
		height: 320,
		labels: [
			{
				text: "11 units",
				target: "length"
			},
			{
				text: "4 units",
				target: "width"
			},
			{
				text: "3 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "bottomFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 300,
		labels: [
			{
				text: "5 units",
				target: "length"
			},
			{
				text: "4 units",
				target: "width"
			},
			{
				text: "1.5 units",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 380,
		height: 360,
		labels: [
			{
				text: "10 centimeters",
				target: "length"
			},
			{
				text: "3 centimeters",
				target: "width"
			},
			{
				text: "20 centimeters",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 340,
		height: 340,
		labels: [
			{
				text: "4 units",
				target: "length"
			}
		],
		segments: [
			{
				to: {
					a: 0,
					b: 1,
					type: "edgeMidpoint"
				},
				from: {
					type: "vertex",
					index: 4
				},
				label: "3 units"
			}
		],
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: [
			{
				at: {
					a: 0,
					b: 1,
					type: "edgeMidpoint"
				},
				to: {
					type: "vertex",
					index: 1
				},
				from: {
					type: "vertex",
					index: 4
				},
				type: "right",
				sizePx: 10
			}
		],
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 400,
		height: 320,
		labels: [
			{
				text: "3 m",
				target: "width"
			},
			{
				text: "2.6 m",
				target: "height"
			},
			{
				text: "5 m",
				target: "length"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 350,
		height: 350,
		labels: [
			{
				text: "8 units",
				target: "length"
			},
			{
				text: "8 units",
				target: "width"
			},
			{
				text: "5 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 380,
		labels: [
			{
				text: "8 units",
				target: "length"
			},
			{
				text: "6 units",
				target: "slantHeight"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 320,
		height: 320,
		labels: [
			{
				text: "14 units",
				target: "length"
			},
			{
				text: "12 units",
				target: "width"
			},
			{
				text: "8 units",
				target: "height"
			},
			{
				text: "10 units",
				target: "leftFace"
			},
			{
				text: "10 units",
				target: "rightFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 360,
		labels: [
			{
				text: "10 cm",
				target: "length"
			},
			{
				text: "10 cm",
				target: "width"
			},
			{
				text: "20.5 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 420,
		labels: [
			{
				text: "8 cm",
				target: "length"
			},
			{
				text: "8 cm",
				target: "width"
			},
			{
				text: "30 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 480,
		height: 360,
		labels: [
			{
				text: "3 cm",
				target: "length"
			},
			{
				text: "2 cm",
				target: "width"
			},
			{
				text: "3.1 cm",
				target: "height"
			},
			{
				text: "3.7 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 320,
		labels: [
			{
				text: "7 cm",
				target: "length"
			},
			{
				text: "4.5 cm",
				target: "width"
			},
			{
				text: "8.8 cm",
				target: "frontFace"
			},
			{
				text: "9.2 cm",
				target: "rightFace"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 420,
		height: 360,
		labels: [
			{
				text: "15 cm",
				target: "length"
			},
			{
				text: "10 1/2 cm",
				target: "width"
			},
			{
				text: "20 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 420,
		height: 320,
		labels: [
			{
				text: "10 cm",
				target: "length"
			},
			{
				text: "10 cm",
				target: "width"
			},
			{
				text: "13.5 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges”: true",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 420,
		height: 360,
		labels: [
			{
				text: "8 cm",
				target: "length"
			},
			{
				text: "8 cm",
				target: "width"
			},
			{
				text: "20 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges”: true",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 420,
		height: 360,
		labels: [
			{
				text: "10 1/2 cm",
				target: "width"
			},
			{
				text: "20 cm",
				target: "length"
			},
			{
				text: "30 cm",
				target: "height"
			}
		],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 440,
		height: 360,
		labels: [
			{
				text: "3 cm",
				target: "length"
			},
			{
				text: "2 cm",
				target: "width"
			}
		],
		segments: [
			{
				to: {
					a: 1,
					b: 5,
					t: 0.9411764706,
					type: "edgePoint"
				},
				from: {
					a: 0,
					b: 4,
					t: 0.9411764706,
					type: "edgePoint"
				},
				label: "4 cm"
			},
			{
				to: {
					a: 1,
					b: 5,
					t: 1,
					type: "edgePoint"
				},
				from: {
					a: 0,
					b: 4,
					t: 1,
					type: "edgePoint"
				},
				label: "4.25 cm"
			}
		],
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPyramid"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPyramid"
		},
		width: 380,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 380,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPyramid"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 340,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 420,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 420,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPyramid"
		},
		width: 420,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 420,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 320,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 380,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 380,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 380,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 380,
		height: 340,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 380,
		height: 340,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 380,
		height: 340,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "topFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 360,
		height: 420,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "showHiddenEdges",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPyramid"
		},
		width: 400,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "baseFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "triangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 440,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: null,
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 360,
		height: 360,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	},
	{
		type: "polyhedronDiagram",
		shape: {
			type: "rectangularPrism"
		},
		width: 400,
		height: 300,
		labels: [],
		segments: null,
		diagonals: [],
		shadedFace: "frontFace",
		angleMarkers: null,
		showHiddenEdges: true
	}
]
