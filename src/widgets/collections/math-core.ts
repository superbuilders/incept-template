import type { WidgetCollection } from "@/widgets/collections/types"
import { allWidgetDefinitions } from "@/widgets/definitions"

export const mathCoreCollection: WidgetCollection<
	Pick<
		typeof allWidgetDefinitions,
		| "threeDIntersectionDiagram"
		| "quadrantDiagram"
		| "angleDiagram"
		| "radiallyConstrainedAngleDiagram"
		| "barChart"
		| "boxGrid"
		| "boxPlot"
		| "circleDiagram"
		| "compositeShapeDiagram"
		| "coordinatePlane"
		| "discreteObjectRatioDiagram"
		| "dotPlot"
		| "doubleNumberLine"
		| "emojiImage"
		| "figureComparisonDiagram"
		| "functionPlotGraph"
		| "geometricSolidDiagram"
		| "hangerDiagram"
		| "histogram"
		| "inequalityNumberLine"
		| "marbleDiagram"
		| "lineEquationGraph"
		| "numberLine"
		| "numberLineWithAction"
		| "numberLineWithFractionGroups"
		| "numberSetDiagram"
		| "parallelogramTrapezoidDiagram"
		| "partitionedShape"
		| "pentagonIntersectionDiagram"
		| "pictograph"
		| "integerChipModel"
		| "integerChipLegend"
		| "pointPlotGraph"
		| "polygonGraph"
		| "polyhedronDiagram"
		| "polyhedronNetDiagram"
		| "probabilitySpinner"
		| "pythagoreanProofDiagram"
		| "ratioBoxDiagram"
		| "rectangularFrameDiagram"
		| "scaleCopiesSlider"
		| "scatterPlot"
		| "shapeTransformationGraph"
		| "stackedItemsDiagram"
		| "tapeDiagram"
		| "transformationDiagram"
		| "treeDiagram"
		| "triangleDiagram"
		| "unitBlockDiagram"
		| "vennDiagram"
		| "verticalArithmeticSetup"
		| "nPolygon"
	>,
	readonly [
		"threeDIntersectionDiagram",
		"quadrantDiagram",
		"angleDiagram",
		"radiallyConstrainedAngleDiagram",
		"barChart",
		"boxGrid",
		"boxPlot",
		"circleDiagram",
		"compositeShapeDiagram",
		"coordinatePlane",
		"discreteObjectRatioDiagram",
		"dotPlot",
		"doubleNumberLine",
		"emojiImage",
		"figureComparisonDiagram",
		"functionPlotGraph",
		"geometricSolidDiagram",
		"hangerDiagram",
		"histogram",
		"inequalityNumberLine",
		"marbleDiagram",
		"lineEquationGraph",
		"numberLine",
		"numberLineWithAction",
		"numberLineWithFractionGroups",
		"numberSetDiagram",
		"parallelogramTrapezoidDiagram",
		"partitionedShape",
		"pentagonIntersectionDiagram",
		"pictograph",
		"integerChipModel",
		"integerChipLegend",
		"pointPlotGraph",
		"polygonGraph",
		"polyhedronDiagram",
		"polyhedronNetDiagram",
		"probabilitySpinner",
		"pythagoreanProofDiagram",
		"ratioBoxDiagram",
		"rectangularFrameDiagram",
		"scaleCopiesSlider",
		"scatterPlot",
		"shapeTransformationGraph",
		"stackedItemsDiagram",
		"tapeDiagram",
		"transformationDiagram",
		"treeDiagram",
		"triangleDiagram",
		"unitBlockDiagram",
		"vennDiagram",
		"verticalArithmeticSetup",
		"nPolygon"
	]
> = {
	name: "math-core",
	widgets: {
		threeDIntersectionDiagram: allWidgetDefinitions.threeDIntersectionDiagram,
		quadrantDiagram: allWidgetDefinitions.quadrantDiagram,
		angleDiagram: allWidgetDefinitions.angleDiagram,
		radiallyConstrainedAngleDiagram:
			allWidgetDefinitions.radiallyConstrainedAngleDiagram,
		barChart: allWidgetDefinitions.barChart,
		boxGrid: allWidgetDefinitions.boxGrid,
		boxPlot: allWidgetDefinitions.boxPlot,
		circleDiagram: allWidgetDefinitions.circleDiagram,
		compositeShapeDiagram: allWidgetDefinitions.compositeShapeDiagram,
		coordinatePlane: allWidgetDefinitions.coordinatePlane,
		discreteObjectRatioDiagram: allWidgetDefinitions.discreteObjectRatioDiagram,
		dotPlot: allWidgetDefinitions.dotPlot,
		doubleNumberLine: allWidgetDefinitions.doubleNumberLine,
		emojiImage: allWidgetDefinitions.emojiImage,
		figureComparisonDiagram: allWidgetDefinitions.figureComparisonDiagram,
		functionPlotGraph: allWidgetDefinitions.functionPlotGraph,
		geometricSolidDiagram: allWidgetDefinitions.geometricSolidDiagram,
		hangerDiagram: allWidgetDefinitions.hangerDiagram,
		histogram: allWidgetDefinitions.histogram,
		inequalityNumberLine: allWidgetDefinitions.inequalityNumberLine,
		marbleDiagram: allWidgetDefinitions.marbleDiagram,
		lineEquationGraph: allWidgetDefinitions.lineEquationGraph,
		numberLine: allWidgetDefinitions.numberLine,
		numberLineWithAction: allWidgetDefinitions.numberLineWithAction,
		numberLineWithFractionGroups:
			allWidgetDefinitions.numberLineWithFractionGroups,
		numberSetDiagram: allWidgetDefinitions.numberSetDiagram,
		parallelogramTrapezoidDiagram:
			allWidgetDefinitions.parallelogramTrapezoidDiagram,
		partitionedShape: allWidgetDefinitions.partitionedShape,
		pentagonIntersectionDiagram:
			allWidgetDefinitions.pentagonIntersectionDiagram,
		pictograph: allWidgetDefinitions.pictograph,
		integerChipModel: allWidgetDefinitions.integerChipModel,
		integerChipLegend: allWidgetDefinitions.integerChipLegend,
		pointPlotGraph: allWidgetDefinitions.pointPlotGraph,
		polygonGraph: allWidgetDefinitions.polygonGraph,
		polyhedronDiagram: allWidgetDefinitions.polyhedronDiagram,
		polyhedronNetDiagram: allWidgetDefinitions.polyhedronNetDiagram,
		probabilitySpinner: allWidgetDefinitions.probabilitySpinner,
		pythagoreanProofDiagram: allWidgetDefinitions.pythagoreanProofDiagram,
		ratioBoxDiagram: allWidgetDefinitions.ratioBoxDiagram,
		rectangularFrameDiagram: allWidgetDefinitions.rectangularFrameDiagram,
		scaleCopiesSlider: allWidgetDefinitions.scaleCopiesSlider,
		scatterPlot: allWidgetDefinitions.scatterPlot,
		shapeTransformationGraph: allWidgetDefinitions.shapeTransformationGraph,
		stackedItemsDiagram: allWidgetDefinitions.stackedItemsDiagram,
		tapeDiagram: allWidgetDefinitions.tapeDiagram,
		transformationDiagram: allWidgetDefinitions.transformationDiagram,
		treeDiagram: allWidgetDefinitions.treeDiagram,
		triangleDiagram: allWidgetDefinitions.triangleDiagram,
		unitBlockDiagram: allWidgetDefinitions.unitBlockDiagram,
		vennDiagram: allWidgetDefinitions.vennDiagram,
		verticalArithmeticSetup: allWidgetDefinitions.verticalArithmeticSetup,
		nPolygon: allWidgetDefinitions.nPolygon
	},
	widgetTypeKeys: [
		"threeDIntersectionDiagram",
		"quadrantDiagram",
		"angleDiagram",
		"radiallyConstrainedAngleDiagram",
		"barChart",
		"boxGrid",
		"boxPlot",
		"circleDiagram",
		"compositeShapeDiagram",
		"coordinatePlane",
		"discreteObjectRatioDiagram",
		"dotPlot",
		"doubleNumberLine",
		"emojiImage",
		"figureComparisonDiagram",
		"functionPlotGraph",
		"geometricSolidDiagram",
		"hangerDiagram",
		"histogram",
		"inequalityNumberLine",
		"marbleDiagram",
		"lineEquationGraph",
		"numberLine",
		"numberLineWithAction",
		"numberLineWithFractionGroups",
		"numberSetDiagram",
		"parallelogramTrapezoidDiagram",
		"partitionedShape",
		"pentagonIntersectionDiagram",
		"pictograph",
		"integerChipModel",
		"integerChipLegend",
		"pointPlotGraph",
		"polygonGraph",
		"polyhedronDiagram",
		"polyhedronNetDiagram",
		"probabilitySpinner",
		"pythagoreanProofDiagram",
		"ratioBoxDiagram",
		"rectangularFrameDiagram",
		"scaleCopiesSlider",
		"scatterPlot",
		"shapeTransformationGraph",
		"stackedItemsDiagram",
		"tapeDiagram",
		"transformationDiagram",
		"treeDiagram",
		"triangleDiagram",
		"unitBlockDiagram",
		"vennDiagram",
		"verticalArithmeticSetup",
		"nPolygon"
	] as const
} as const
