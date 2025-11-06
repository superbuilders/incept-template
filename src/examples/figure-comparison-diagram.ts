import type { FigureComparisonDiagramProps } from "@/widgets/generators/figure-comparison-diagram"

export const figureComparisonDiagramExamples: FigureComparisonDiagramProps[] = [
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 60,
						y: 20
					},
					{
						x: 60,
						y: 140
					},
					{
						x: 45,
						y: 140
					},
					{
						x: 45,
						y: 90
					},
					{
						x: 20,
						y: 20
					}
				],
				fillColor: "#00000000",
				sideLabels: ["AB", "BC", "CD", "DE", "EA"],
				figureLabel: {
					text: "Figure 1",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 20,
						y: 140
					},
					{
						x: 20,
						y: 20
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 80,
						y: 0
					},
					{
						x: 80,
						y: 140
					}
				],
				fillColor: "#00000000",
				sideLabels: ["MN", "NO", "OP", "PQ", "QM"],
				figureLabel: {
					text: "Figure 2",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 120
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 135,
						y: 165
					},
					{
						x: 135,
						y: 255
					},
					{
						x: 120,
						y: 210
					},
					{
						x: 45,
						y: 165
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure 1",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 60,
						y: 60
					},
					{
						x: 240,
						y: 60
					},
					{
						x: 240,
						y: 240
					},
					{
						x: 210,
						y: 150
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure 2",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 95.454
					},
					{
						x: 40.909,
						y: 68.182
					},
					{
						x: 27.272,
						y: 13.636
					},
					{
						x: 81.818,
						y: 0
					},
					{
						x: 81.818,
						y: 95.454
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure 1",
					offset: 10,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 12
			},
			{
				vertices: [
					{
						x: 54.545,
						y: 27.273
					},
					{
						x: 81.818,
						y: 136.364
					},
					{
						x: 0,
						y: 190.91
					},
					{
						x: 163.636,
						y: 190.91
					},
					{
						x: 163.636,
						y: 0
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure 2",
					offset: 10,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 12
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 160,
						y: 0
					},
					{
						x: 130,
						y: 200
					}
				],
				fillColor: "#00000000",
				sideLabels: [null, null, null],
				figureLabel: {
					text: "Figure 1",
					offset: 10,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 12
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 96,
						y: 0
					},
					{
						x: 78,
						y: 120
					}
				],
				fillColor: "#00000000",
				sideLabels: [null, null, null],
				figureLabel: {
					text: "Figure 2",
					offset: 10,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 12
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 90,
						y: 60
					},
					{
						x: 90,
						y: 30
					},
					{
						x: 270,
						y: 30
					},
					{
						x: 270,
						y: 120
					},
					{
						x: 180,
						y: 180
					}
				],
				fillColor: "#FFFFFF",
				sideLabels: ["AB", "BC", "CD", "DE", "EA"],
				figureLabel: {
					text: "Figure 1",
					offset: 12,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 120,
						y: 195
					},
					{
						x: 120,
						y: 240
					},
					{
						x: 75,
						y: 270
					},
					{
						x: 30,
						y: 210
					},
					{
						x: 30,
						y: 195
					}
				],
				fillColor: "#FFFFFF",
				sideLabels: ["HI", "IJ", "JK", "KL", "LH"],
				figureLabel: {
					text: "Figure 2",
					offset: 12,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 120
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 90,
						y: 0
					},
					{
						x: 90,
						y: 45
					},
					{
						x: 240,
						y: 45
					},
					{
						x: 240,
						y: 120
					}
				],
				fillColor: "#00000000",
				sideLabels: ["AB", "BC", "CD", "DF", "FG", "GA"],
				figureLabel: {
					text: "Figure 1",
					offset: 10,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 0,
						y: 80
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 60,
						y: 0
					},
					{
						x: 60,
						y: 40
					},
					{
						x: 120,
						y: 40
					},
					{
						x: 120,
						y: 80
					}
				],
				fillColor: "#00000000",
				sideLabels: ["HI", "IJ", "JK", "KL", "LM", "HM"],
				figureLabel: {
					text: "Figure 2",
					offset: 10,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 120
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 160,
						y: 0
					},
					{
						x: 160,
						y: 120
					}
				],
				fillColor: "#00000000",
				sideLabels: ["AB", "BC", "CD", "DA"],
				figureLabel: {
					text: "Figure 1",
					offset: 12,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: -12
			},
			{
				vertices: [
					{
						x: 0,
						y: 80
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 80,
						y: 0
					},
					{
						x: 80,
						y: 80
					}
				],
				fillColor: "#00000000",
				sideLabels: ["HI", "IJ", "JK", "HK"],
				figureLabel: {
					text: "Figure 2",
					offset: 12,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: -12
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 320,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 50
					},
					{
						x: 50,
						y: 0
					},
					{
						x: 25,
						y: 75
					}
				],
				fillColor: "#1FAB544D",
				sideLabels: ["14", "16", "7"],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1FAB54",
				strokeWidth: 2,
				sideLabelOffset: 12
			},
			{
				vertices: [
					{
						x: 0,
						y: 200
					},
					{
						x: 200,
						y: 0
					},
					{
						x: 100,
						y: 300
					}
				],
				fillColor: "#11ACCD4D",
				sideLabels: ["56", "64", "28"],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11ACCD",
				strokeWidth: 2,
				sideLabelOffset: 16
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 0,
						y: -100
					},
					{
						x: -50,
						y: -75
					},
					{
						x: -25,
						y: -75
					}
				],
				fillColor: "#1fab544D",
				sideLabels: ["22", "40", "32", "10"],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 16
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 0,
						y: -200
					},
					{
						x: -100,
						y: -150
					},
					{
						x: -50,
						y: -150
					}
				],
				fillColor: "#11accd4D",
				sideLabels: ["44", "80", "64", "20"],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 16
			}
		],
		spacing: 120
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 100,
						y: 0
					},
					{
						x: 150,
						y: 100
					},
					{
						x: 0,
						y: 100
					}
				],
				fillColor: "#1fab5480",
				sideLabels: ["4", "4.4", "6", "4"],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 25,
						y: 0
					},
					{
						x: 37.5,
						y: 25
					},
					{
						x: 0,
						y: 25
					}
				],
				fillColor: "#11accd80",
				sideLabels: ["1", "1.1", "1.5", "1"],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 37.5,
						y: 0
					},
					{
						x: 56.25,
						y: 37.5
					}
				],
				fillColor: "#1fab544D",
				sideLabels: ["10", "11", "18"],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 150,
						y: 0
					},
					{
						x: 225,
						y: 150
					}
				],
				fillColor: "#11accd4D",
				sideLabels: ["40", "44", "72"],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 360,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: -100,
						y: 0
					},
					{
						x: 100,
						y: 0
					},
					{
						x: 45,
						y: 150
					},
					{
						x: -45,
						y: 150
					}
				],
				fillColor: "#1FAB544D",
				sideLabels: ["33 units", "33 units", "15 units", "33 units"],
				figureLabel: {
					text: "Figure A",
					offset: 18,
					position: "bottom"
				},
				strokeColor: "#1FAB54",
				strokeWidth: 2,
				sideLabelOffset: 16
			},
			{
				vertices: [
					{
						x: -50,
						y: 0
					},
					{
						x: 50,
						y: 0
					},
					{
						x: 22.5,
						y: 75
					},
					{
						x: -22.5,
						y: 75
					}
				],
				fillColor: "#11ACCD4D",
				sideLabels: ["11 units", "11 units", "5 units", "11 units"],
				figureLabel: {
					text: "Figure B",
					offset: 18,
					position: "bottom"
				},
				strokeColor: "#11ACCD",
				strokeWidth: 2,
				sideLabelOffset: 16
			}
		],
		spacing: 120
	},
	{
		type: "figureComparisonDiagram",
		width: 300,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 35.294,
						y: 94.118
					},
					{
						x: 152.941,
						y: 35.294
					},
					{
						x: 94.118,
						y: 94.118
					},
					{
						x: 152.941,
						y: 152.941
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "",
					offset: 0,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 50
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 70.667,
						y: 88.333
					},
					{
						x: 194.333,
						y: 17.667
					},
					{
						x: 141.333,
						y: 176.667
					},
					{
						x: 17.667,
						y: 247.333
					}
				],
				fillColor: "#00000000",
				sideLabels: ["x units", null, null, null],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 194.333,
						y: 159
					},
					{
						x: 249.296,
						y: 127.593
					},
					{
						x: 225.741,
						y: 198.259
					},
					{
						x: 170.778,
						y: 229.667
					}
				],
				fillColor: "#00000000",
				sideLabels: ["16 units", null, null, null],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 60
					},
					{
						x: 0,
						y: 20
					},
					{
						x: 120,
						y: 0
					},
					{
						x: 120,
						y: 80
					}
				],
				fillColor: "#00000000",
				sideLabels: ["20", null, null, "60"],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 0,
						y: 72
					},
					{
						x: 0,
						y: 24
					},
					{
						x: 144,
						y: 0
					},
					{
						x: 144,
						y: 96
					}
				],
				fillColor: "#00000000",
				sideLabels: ["24", null, null, "x"],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 120
	},
	{
		type: "figureComparisonDiagram",
		width: 325,
		height: 325,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 160,
						y: 0
					},
					{
						x: 160,
						y: 100
					},
					{
						x: 0,
						y: 100
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 128,
						y: 0
					},
					{
						x: 128,
						y: 80
					},
					{
						x: 0,
						y: 80
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 60
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 60,
						y: 0
					},
					{
						x: 60,
						y: 120
					},
					{
						x: 0,
						y: 120
					}
				],
				fillColor: "#FFFFFF",
				sideLabels: ["6", "12", null, null],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 90,
						y: 0
					},
					{
						x: 90,
						y: 180
					},
					{
						x: 0,
						y: 180
					}
				],
				fillColor: "#FFFFFF",
				sideLabels: ["9", "x", null, null],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 100
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 122.308,
						y: 0
					},
					{
						x: 142.692,
						y: 61.153
					},
					{
						x: 0,
						y: 81.539
					}
				],
				fillColor: "#00000000",
				sideLabels: ["10.5", null, null],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 12
			},
			{
				vertices: [
					{
						x: 81.538,
						y: 0
					},
					{
						x: 95.128,
						y: 40.77
					},
					{
						x: 0,
						y: 54.359
					}
				],
				fillColor: "#00000000",
				sideLabels: ["x", null, null],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 12
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: -40,
						y: 30
					},
					{
						x: 0,
						y: -45
					},
					{
						x: 40,
						y: 30
					}
				],
				fillColor: "#00000000",
				sideLabels: ["4", " ", "x"],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: -100,
						y: 75
					},
					{
						x: 0,
						y: -112.5
					},
					{
						x: 100,
						y: 75
					}
				],
				fillColor: "#00000000",
				sideLabels: ["10", " ", "11"],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 400,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 50
					},
					{
						x: 40,
						y: 0
					},
					{
						x: 140,
						y: 0
					},
					{
						x: 100,
						y: 50
					}
				],
				fillColor: "#FFFFFF",
				sideLabels: ["10", "16", " ", " "],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 16
			},
			{
				vertices: [
					{
						x: 0,
						y: 62.5
					},
					{
						x: 50,
						y: 0
					},
					{
						x: 175,
						y: 0
					},
					{
						x: 125,
						y: 62.5
					}
				],
				fillColor: "#FFFFFF",
				sideLabels: ["12.5", "x", " ", " "],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 16
			}
		],
		spacing: 60
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 60
					},
					{
						x: 20,
						y: 0
					},
					{
						x: 80,
						y: 0
					},
					{
						x: 100,
						y: 60
					}
				],
				fillColor: "#00000000",
				sideLabels: [" ", "3", " ", " "],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 0,
						y: 105
					},
					{
						x: 35,
						y: 0
					},
					{
						x: 140,
						y: 0
					},
					{
						x: 175,
						y: 105
					}
				],
				fillColor: "#00000000",
				sideLabels: [" ", "x", " ", " "],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 100
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 20,
						y: 140
					},
					{
						x: 220,
						y: 140
					},
					{
						x: 190,
						y: 40
					},
					{
						x: 80,
						y: 40
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 10,
						y: 100
					},
					{
						x: 130,
						y: 100
					},
					{
						x: 110,
						y: 60
					},
					{
						x: 60,
						y: 60
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 350,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 14.384,
						y: 47.945
					},
					{
						x: 43.15,
						y: 9.59
					},
					{
						x: 119.862,
						y: 9.59
					}
				],
				fillColor: "#00000000",
				sideLabels: [null, "x", null],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 12
			},
			{
				vertices: [
					{
						x: 112.671,
						y: 95.89
					},
					{
						x: 196.575,
						y: 23.973
					},
					{
						x: 340.411,
						y: 23.973
					}
				],
				fillColor: "#00000000",
				sideLabels: [null, "5", null],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 12
			}
		],
		spacing: 50
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 150,
						y: 150
					},
					{
						x: 0,
						y: 116.667
					},
					{
						x: 83.333,
						y: 100
					},
					{
						x: 100,
						y: 0
					}
				],
				fillColor: "#00000000",
				sideLabels: ["45", null, null, "x"],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 16
			},
			{
				vertices: [
					{
						x: 266.667,
						y: 116.667
					},
					{
						x: 176.667,
						y: 96.667
					},
					{
						x: 226.667,
						y: 86.667
					},
					{
						x: 236.667,
						y: 26.667
					}
				],
				fillColor: "#00000000",
				sideLabels: ["27", null, null, "18"],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 16
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 0,
						y: -80
					},
					{
						x: 160,
						y: 0
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: ["2", " ", " "],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: -12
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 0,
						y: -120
					},
					{
						x: 240,
						y: 0
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: ["x", " ", " "],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: -12
			}
		],
		spacing: 100
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 120
					},
					{
						x: 100,
						y: 0
					},
					{
						x: 100,
						y: 120
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 0,
						y: 180
					},
					{
						x: 180,
						y: 0
					},
					{
						x: 180,
						y: 180
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 180,
						y: 60
					},
					{
						x: 180,
						y: 120
					},
					{
						x: 0,
						y: 120
					}
				],
				fillColor: "#FFFFFF",
				sideLabels: [" ", " ", "x units", " "],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 45,
						y: 15
					},
					{
						x: 45,
						y: 30
					},
					{
						x: 0,
						y: 30
					}
				],
				fillColor: "#FFFFFF",
				sideLabels: [" ", " ", "1.5 units", " "],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 69.231
					},
					{
						x: 40,
						y: 0
					},
					{
						x: 240,
						y: 0
					},
					{
						x: 200,
						y: 69.231
					}
				],
				fillColor: "#00000000",
				sideLabels: [null, "10", null, null],
				figureLabel: {
					text: "Figure A",
					offset: 16,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: -12
			},
			{
				vertices: [
					{
						x: 0,
						y: 57.692
					},
					{
						x: 30,
						y: 0
					},
					{
						x: 180,
						y: 0
					},
					{
						x: 150,
						y: 57.692
					}
				],
				fillColor: "#00000000",
				sideLabels: [null, "x", null, null],
				figureLabel: {
					text: "Figure B",
					offset: 16,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: -12
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 200
					},
					{
						x: 0,
						y: 40
					},
					{
						x: 170,
						y: 80
					},
					{
						x: 220,
						y: 200
					}
				],
				fillColor: "#11accd1A",
				sideLabels: ["4", " ", " ", "7.2"],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 0,
						y: 150
					},
					{
						x: 0,
						y: 30
					},
					{
						x: 127.5,
						y: 60
					},
					{
						x: 165,
						y: 150
					}
				],
				fillColor: "#1fab541A",
				sideLabels: ["3", " ", " ", "x"],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 49.688
					},
					{
						x: 49.687,
						y: 115.938
					},
					{
						x: 66.25,
						y: 0
					},
					{
						x: 33.124,
						y: 16.563
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 0,
						y: 38.646
					},
					{
						x: 38.646,
						y: 90.173
					},
					{
						x: 51.528,
						y: 0
					},
					{
						x: 25.764,
						y: 12.882
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 82.813,
						y: 0
					},
					{
						x: 0,
						y: 33.124
					},
					{
						x: 0,
						y: 66.25
					},
					{
						x: 33.126,
						y: 66.25
					}
				],
				fillColor: "#00000000",
				sideLabels: ["30", null, "x", null],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 69.01,
						y: 0
					},
					{
						x: 0,
						y: 27.604
					},
					{
						x: 0,
						y: 55.208
					},
					{
						x: 27.604,
						y: 55.208
					}
				],
				fillColor: "#00000000",
				sideLabels: ["25", null, "10", null],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 100
	},
	{
		type: "figureComparisonDiagram",
		width: 300,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: -80
					},
					{
						x: 69,
						y: -40
					},
					{
						x: 69,
						y: 40
					},
					{
						x: 0,
						y: 80
					},
					{
						x: -69,
						y: 40
					},
					{
						x: -69,
						y: -40
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [null, null, null, null, null, null],
				figureLabel: {
					text: "Figure",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 50
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 103.846,
						y: 0
					},
					{
						x: 86.538,
						y: 69.23
					},
					{
						x: 0,
						y: 138.461
					},
					{
						x: 34.615,
						y: 34.615
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [],
				figureLabel: {
					text: "A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 12
			},
			{
				vertices: [
					{
						x: 138.461,
						y: 0
					},
					{
						x: 115.385,
						y: 92.307
					},
					{
						x: 0,
						y: 184.615
					},
					{
						x: 46.153,
						y: 46.154
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [],
				figureLabel: {
					text: "B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 12
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 300,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 59.35,
						y: 38.535
					},
					{
						x: 130.015,
						y: 239.216
					},
					{
						x: 13.195,
						y: 118.476
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [],
				figureLabel: {
					text: "A",
					offset: 10,
					position: "top"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 276.923,
						y: 46.154
					},
					{
						x: 138.462,
						y: 207.692
					},
					{
						x: 184.615,
						y: 46.154
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [],
				figureLabel: {
					text: "B",
					offset: 10,
					position: "top"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 50
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 281.25,
						y: 140.625
					},
					{
						x: 46.874,
						y: 187.5
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [" ", " ", " "],
				figureLabel: {
					text: "A",
					offset: 12,
					position: "top"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 140.625,
						y: 70.313
					},
					{
						x: 23.437,
						y: 93.75
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [" ", " ", " "],
				figureLabel: {
					text: "B",
					offset: 12,
					position: "top"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 100
	},
	{
		type: "figureComparisonDiagram",
		width: 300,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 105.882,
						y: 35.294
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 52.94,
						y: 105.882
					},
					{
						x: 52.94,
						y: 52.941
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 0,
						y: 35.294
					},
					{
						x: 105.882,
						y: 0
					},
					{
						x: 52.941,
						y: 105.882
					},
					{
						x: 52.941,
						y: 52.941
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 50
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 60,
						y: 0
					},
					{
						x: 120,
						y: 100
					},
					{
						x: 140,
						y: 160
					},
					{
						x: 0,
						y: 60
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "A",
					offset: 10,
					position: "top"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 60,
						y: 0
					},
					{
						x: 120,
						y: 100
					},
					{
						x: 140,
						y: 160
					},
					{
						x: 0,
						y: 60
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "B",
					offset: 10,
					position: "top"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 10,
						y: 130
					},
					{
						x: 130,
						y: 170
					},
					{
						x: 70,
						y: 30
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [" ", " ", " "],
				figureLabel: {
					text: "A",
					offset: 0,
					position: "center"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 12
			},
			{
				vertices: [
					{
						x: 130,
						y: 130
					},
					{
						x: 10,
						y: 170
					},
					{
						x: 70,
						y: 30
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: [" ", " ", " "],
				figureLabel: {
					text: "B",
					offset: 0,
					position: "center"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 12
			}
		],
		spacing: 100
	},
	{
		type: "figureComparisonDiagram",
		width: 300,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 60,
						y: 60
					},
					{
						x: 120,
						y: 75
					},
					{
						x: 30,
						y: 165
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "A",
					offset: 10,
					position: "top"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 210,
						y: 30
					},
					{
						x: 270,
						y: 45
					},
					{
						x: 180,
						y: 135
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "B",
					offset: 10,
					position: "top"
				},
				strokeColor: "#000000",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 176.471
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 66.667,
						y: 0
					},
					{
						x: 66.667,
						y: 132.353
					},
					{
						x: 100,
						y: 132.353
					},
					{
						x: 100,
						y: 176.471
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: ["6", null, null, "2", null, "8"],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 0,
						y: 88.236
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 33.333,
						y: 0
					},
					{
						x: 33.333,
						y: 66.177
					},
					{
						x: 50,
						y: 66.177
					},
					{
						x: 50,
						y: 88.236
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: ["3", null, null, "1", null, "4"],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 230.77
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 85.714,
						y: 173.077
					},
					{
						x: 85.714,
						y: 230.77
					}
				],
				fillColor: "#00000000",
				sideLabels: ["40 units", "10 units", "36 units", "20 units"],
				figureLabel: {
					text: "Figure A",
					offset: 20,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 16
			},
			{
				vertices: [
					{
						x: 0,
						y: 115.385
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 42.857,
						y: 86.538
					},
					{
						x: 42.857,
						y: 115.385
					}
				],
				fillColor: "#00000000",
				sideLabels: ["20 units", "5 units", "18 units", "10 units"],
				figureLabel: {
					text: "Figure B",
					offset: 20,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 16
			}
		],
		spacing: 120
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 65.218
					},
					{
						x: 0,
						y: 13.044
					},
					{
						x: 26.087,
						y: 0
					},
					{
						x: 52.174,
						y: 13.044
					},
					{
						x: 52.174,
						y: 65.218
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 12
			},
			{
				vertices: [
					{
						x: 0,
						y: 195.652
					},
					{
						x: 0,
						y: 39.13
					},
					{
						x: 78.261,
						y: 0
					},
					{
						x: 156.522,
						y: 39.13
					},
					{
						x: 156.522,
						y: 195.652
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 12
			}
		],
		spacing: 120
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 0,
						y: 120
					},
					{
						x: 200,
						y: 120
					},
					{
						x: 120,
						y: 30
					}
				],
				fillColor: "#00000000",
				sideLabels: ["9", "9", "7.3", " "],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 0,
						y: 60
					},
					{
						x: 100,
						y: 60
					},
					{
						x: 60,
						y: 20
					}
				],
				fillColor: "#00000000",
				sideLabels: ["3", "3", "2.2", " "],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 100
	},
	{
		type: "figureComparisonDiagram",
		width: 325,
		height: 325,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 200
					},
					{
						x: 60,
						y: 30
					},
					{
						x: 120,
						y: 200
					}
				],
				fillColor: "#00000000",
				sideLabels: ["10", "10", "5"],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 16
			},
			{
				vertices: [
					{
						x: 0,
						y: 120
					},
					{
						x: 30,
						y: 30
					},
					{
						x: 60,
						y: 120
					}
				],
				fillColor: "#00000000",
				sideLabels: ["2", "2", "1"],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 16
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: -40,
						y: 80
					},
					{
						x: 0,
						y: 15
					},
					{
						x: 40,
						y: 80
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: ["2.8", "2.8", "4"],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 16
			},
			{
				vertices: [
					{
						x: -90,
						y: 150
					},
					{
						x: 0,
						y: 30
					},
					{
						x: 90,
						y: 150
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: ["10", "10", "16"],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 16
			}
		],
		spacing: 150
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 110
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 60,
						y: 0
					},
					{
						x: 60,
						y: 80
					},
					{
						x: 30,
						y: 80
					},
					{
						x: 30,
						y: 110
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "top"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 0,
						y: 30
					},
					{
						x: 0,
						y: 0
					},
					{
						x: 20,
						y: 0
					},
					{
						x: 20,
						y: 20
					},
					{
						x: 10,
						y: 20
					},
					{
						x: 10,
						y: 30
					}
				],
				fillColor: "#00000000",
				sideLabels: [],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "top"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 100
	},
	{
		type: "figureComparisonDiagram",
		width: 325,
		height: 325,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 2,
						y: 0
					},
					{
						x: 2,
						y: 2
					},
					{
						x: 0,
						y: 2
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: ["2", "2", "2", "2"],
				figureLabel: {
					text: "Figure A",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 15
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 9,
						y: 0
					},
					{
						x: 9,
						y: 7
					},
					{
						x: 0,
						y: 7
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: ["9", "7", "9", "7"],
				figureLabel: {
					text: "Figure B",
					offset: 10,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 15
			}
		],
		spacing: 80
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 150,
						y: 0
					},
					{
						x: 45,
						y: -130
					}
				],
				fillColor: "#FFFFFF",
				sideLabels: ["4", "11.3", "8.9"],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 75,
						y: 0
					},
					{
						x: 22,
						y: -65
					}
				],
				fillColor: "#FFFFFF",
				sideLabels: ["2", "5", "3.6"],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 14
			}
		],
		spacing: 120
	},
	{
		type: "figureComparisonDiagram",
		width: 500,
		height: 300,
		layout: "horizontal",
		figures: [
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 60,
						y: -24
					},
					{
						x: 60,
						y: 24
					},
					{
						x: 0,
						y: 48
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: ["6.4", "4", "6", "2"],
				figureLabel: {
					text: "Figure A",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#11accd",
				strokeWidth: 2,
				sideLabelOffset: 14
			},
			{
				vertices: [
					{
						x: 0,
						y: 0
					},
					{
						x: 140,
						y: -72.581
					},
					{
						x: 140,
						y: 72.581
					},
					{
						x: 0,
						y: 145.161
					}
				],
				fillColor: "#FFFFFF00",
				sideLabels: ["15.2", "12", "14", "6"],
				figureLabel: {
					text: "Figure B",
					offset: 12,
					position: "bottom"
				},
				strokeColor: "#1fab54",
				strokeWidth: 2,
				sideLabelOffset: 16
			}
		],
		spacing: 100
	}
]
