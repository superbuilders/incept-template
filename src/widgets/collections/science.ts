import type { WidgetCollection } from "@/widgets/collections/types"
import { allWidgetDefinitions } from "@/widgets/definitions"

export const scienceCollection: WidgetCollection<
	Pick<
		typeof allWidgetDefinitions,
		| "emojiImage"
		| "urlImage"
		| "vennDiagram"
		| "periodicTable"
		| "video"
		| "lineGraph"
		| "conceptualGraph"
		| "coordinatePlane"
		| "populationChangeEventGraph"
		| "populationBarChart"
		| "areaGraph"
		| "divergentBarChart"
		| "keelingCurve"
		| "histogram"
		| "parabolaGraph"
		| "scatterPlot"
		| "freeBodyDiagram"
		| "pieChart"
		| "functionPlotGraph"
		| "pesSpectrum"
		| "stickPlot"
	>,
	readonly [
		"emojiImage",
		"urlImage",
		"vennDiagram",
		"periodicTable",
		"video",
		"lineGraph",
		"conceptualGraph",
		"coordinatePlane",
		"populationChangeEventGraph",
		"populationBarChart",
		"areaGraph",
		"divergentBarChart",
		"keelingCurve",
		"histogram",
		"parabolaGraph",
		"scatterPlot",
		"freeBodyDiagram",
		"pieChart",
		"functionPlotGraph",
		"pesSpectrum",
		"stickPlot"
	]
> = {
	name: "science",
	widgets: {
		emojiImage: allWidgetDefinitions.emojiImage,
		urlImage: allWidgetDefinitions.urlImage,
		vennDiagram: allWidgetDefinitions.vennDiagram,
		periodicTable: allWidgetDefinitions.periodicTable,
		video: allWidgetDefinitions.video,
		lineGraph: allWidgetDefinitions.lineGraph,
		conceptualGraph: allWidgetDefinitions.conceptualGraph,
		coordinatePlane: allWidgetDefinitions.coordinatePlane,
		populationChangeEventGraph: allWidgetDefinitions.populationChangeEventGraph,
		populationBarChart: allWidgetDefinitions.populationBarChart,
		areaGraph: allWidgetDefinitions.areaGraph,
		divergentBarChart: allWidgetDefinitions.divergentBarChart,
		keelingCurve: allWidgetDefinitions.keelingCurve,
		histogram: allWidgetDefinitions.histogram,
		parabolaGraph: allWidgetDefinitions.parabolaGraph,
		scatterPlot: allWidgetDefinitions.scatterPlot,
		freeBodyDiagram: allWidgetDefinitions.freeBodyDiagram,
		pieChart: allWidgetDefinitions.pieChart,
		functionPlotGraph: allWidgetDefinitions.functionPlotGraph,
		pesSpectrum: allWidgetDefinitions.pesSpectrum,
		stickPlot: allWidgetDefinitions.stickPlot
	},
	widgetTypeKeys: [
		"emojiImage",
		"urlImage",
		"vennDiagram",
		"periodicTable",
		"video",
		"lineGraph",
		"conceptualGraph",
		"coordinatePlane",
		"populationChangeEventGraph",
		"populationBarChart",
		"areaGraph",
		"divergentBarChart",
		"keelingCurve",
		"histogram",
		"parabolaGraph",
		"scatterPlot",
		"freeBodyDiagram",
		"pieChart",
		"functionPlotGraph",
		"pesSpectrum",
		"stickPlot"
	]
} as const
