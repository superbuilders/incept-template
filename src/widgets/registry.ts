import { z } from "zod"

// Import individual schemas and keep their generators defined in their own files
import { ThreeDIntersectionDiagramPropsSchema } from "@/widgets/generators/3d-intersection-diagram"
import { AdditionWithRegroupingPropsSchema } from "@/widgets/generators/addition-with-regrouping"
import { AngleDiagramPropsSchema } from "@/widgets/generators/angle-diagram"
import { AngleTypeDiagramPropsSchema } from "@/widgets/generators/angle-type-diagram"
import { AreaGraphPropsSchema } from "@/widgets/generators/area-graph"
import { AreaModelMultiplicationPropsSchema } from "@/widgets/generators/area-model-multiplication"
import { BarChartPropsSchema } from "@/widgets/generators/bar-chart"
import { BoxGridPropsSchema } from "@/widgets/generators/box-grid"
import { BoxPlotPropsSchema } from "@/widgets/generators/box-plot"
import { CircleAngleDiagramPropsSchema } from "@/widgets/generators/circle-angle-diagram"
import { CircleDiagramPropsSchema } from "@/widgets/generators/circle-diagram"
import { ClockDiagramPropsSchema } from "@/widgets/generators/clock-diagram"
import { CompositeShapeDiagramPropsSchema } from "@/widgets/generators/composite-shape-diagram"
import { ConceptualGraphPropsSchema } from "@/widgets/generators/conceptual-graph"
import { CoordinatePlaneComprehensivePropsSchema } from "@/widgets/generators/coordinate-plane-comprehensive"
import { CustomPolygonDiagramPropsSchema } from "@/widgets/generators/custom-polygon-diagram"
import { DataTablePropsSchema } from "@/widgets/generators/data-table"
import { DecoratedNumberPropsSchema } from "@/widgets/generators/decorated-number"
import { DiscreteObjectRatioDiagramPropsSchema } from "@/widgets/generators/discrete-object-ratio-diagram"
import { DivergentBarChartPropsSchema } from "@/widgets/generators/divergent-bar-chart"
import { DivisionAreaDiagramPropsSchema } from "@/widgets/generators/division-area-diagram"
import { DivisionModelDiagramPropsSchema } from "@/widgets/generators/division-model-diagram"
import { DotPlotPropsSchema } from "@/widgets/generators/dot-plot"
import { DoubleNumberLinePropsSchema } from "@/widgets/generators/double-number-line"
import { EmojiImagePropsSchema } from "@/widgets/generators/emoji-image"
import { EquivalentFractionModelPropsSchema } from "@/widgets/generators/equivalent-fraction-model"
import { FactorizationDiagramPropsSchema } from "@/widgets/generators/factorization-diagram"
import { FigureComparisonDiagramPropsSchema } from "@/widgets/generators/figure-comparison-diagram"
import { FractionFrequencyPlotPropsSchema } from "@/widgets/generators/fraction-frequency-plot"
import { FractionMultiplicationModelPropsSchema } from "@/widgets/generators/fraction-multiplication-model"
import { FractionSumDiagramPropsSchema } from "@/widgets/generators/fraction-sum-diagram"
import { FractionModelDiagramPropsSchema } from "@/widgets/generators/fractional-model-diagram"
import { FreeBodyDiagramPropsSchema } from "@/widgets/generators/free-body-diagram"
import { FunctionPlotGraphPropsSchema } from "@/widgets/generators/function-plot-graph"
import { GeometricPrimitiveDiagramPropsSchema } from "@/widgets/generators/geometric-primitive-diagram"
import { GeometricSolidDiagramPropsSchema } from "@/widgets/generators/geometric-solid-diagram"
import { HangerDiagramPropsSchema } from "@/widgets/generators/hanger-diagram"
import { HistogramPropsSchema } from "@/widgets/generators/histogram"
import { InequalityNumberLinePropsSchema } from "@/widgets/generators/inequality-number-line"
import { IntegerChipLegendPropsSchema } from "@/widgets/generators/integer-chip-legend"
import { IntegerChipModelPropsSchema } from "@/widgets/generators/integer-chip-model"
import { KeelingCurvePropsSchema } from "@/widgets/generators/keeling-curve"
import { LabeledRectangleDiagramPropsSchema } from "@/widgets/generators/labeled-rectangle-diagram"
import { LineDiagramPropsSchema } from "@/widgets/generators/line-diagram"
import { LineEquationGraphPropsSchema } from "@/widgets/generators/line-equation-graph"
import { LineGraphPropsSchema } from "@/widgets/generators/line-graph"
import { MarbleDiagramPropsSchema } from "@/widgets/generators/marble-diagram"
import { NPolygonPropsSchema } from "@/widgets/generators/n-polygon"
import { NumberLinePropsSchema } from "@/widgets/generators/number-line"
import { NumberLineWithActionPropsSchema } from "@/widgets/generators/number-line-with-action"
import { NumberLineWithFractionGroupsPropsSchema } from "@/widgets/generators/number-line-with-fraction-groups"
import { NumberSetDiagramPropsSchema } from "@/widgets/generators/number-set-diagram"
import { ParabolaGraphPropsSchema } from "@/widgets/generators/parabola-graph"
import { ParallelogramTrapezoidDiagramPropsSchema } from "@/widgets/generators/parallelogram-trapezoid-diagram"
import { PartitionedShapePropsSchema } from "@/widgets/generators/partitioned-shape"
import { PatternDiagramPropsSchema } from "@/widgets/generators/pattern-diagram"
import { PentagonIntersectionDiagramPropsSchema } from "@/widgets/generators/pentagon-intersection-diagram"
import { PeriodicTableWidgetPropsSchema } from "@/widgets/generators/periodic-table"
import { PESSpectrumPropsSchema } from "@/widgets/generators/pes-spectrum"
import { PieChartWidgetPropsSchema } from "@/widgets/generators/pi-chart"
import { PictographPropsSchema } from "@/widgets/generators/pictograph"
import { PointPlotGraphPropsSchema } from "@/widgets/generators/point-plot-graph"
import { PolygonGraphPropsSchema } from "@/widgets/generators/polygon-graph"
import { PolyhedronDiagramPropsSchema } from "@/widgets/generators/polyhedron-diagram"
import { PolyhedronNetDiagramPropsSchema } from "@/widgets/generators/polyhedron-net-diagram"
import { PopulationBarChartPropsSchema } from "@/widgets/generators/population-bar-chart"
import { PopulationChangeEventGraphPropsSchema } from "@/widgets/generators/population-change-event-graph"
import { ProbabilitySpinnerPropsSchema } from "@/widgets/generators/probability-spinner"
import { ProtractorAngleDiagramPropsSchema } from "@/widgets/generators/protractor-angle-diagram"
import { PythagoreanProofDiagramPropsSchema } from "@/widgets/generators/pythagorean-proof-diagram"
import { QuadrantDiagramPropsSchema } from "@/widgets/generators/quadrant-diagram"
import { QuantityFractionalDiagramPropsSchema } from "@/widgets/generators/quantity-fractional-diagram"
import { RadiallyConstrainedAngleDiagramPropsSchema } from "@/widgets/generators/radially-constrained-angle-diagram"
import { RatioBoxDiagramPropsSchema } from "@/widgets/generators/ratio-box-diagram"
import { RectangularFrameDiagramPropsSchema } from "@/widgets/generators/rectangular-frame-diagram"
import { ScaleCopiesSliderPropsSchema } from "@/widgets/generators/scale-copies-slider"
import { ScatterPlotPropsSchema } from "@/widgets/generators/scatter-plot"
import { ShapeTransformationGraphPropsSchema } from "@/widgets/generators/shape-transformation-graph"
import { SimpleArrowPropsSchema } from "@/widgets/generators/simple-arrow"
import { SinCosineWidgetPropsSchema } from "@/widgets/generators/sin-cosine-widget"
import { StackedItemsDiagramPropsSchema } from "@/widgets/generators/stacked-items-diagram"
import { StemLeafPlotPropsSchema } from "@/widgets/generators/stem-leaf-plot"
import { StickPlotPropsSchema } from "@/widgets/generators/stick-plot"
import { SubtractionWithRegroupingPropsSchema } from "@/widgets/generators/subtraction-with-regrouping"
import { SymmetryDiagramPropsSchema } from "@/widgets/generators/symmetry-diagram"
import { TapeDiagramPropsSchema } from "@/widgets/generators/tape-diagram"
import { TransformationDiagramPropsSchema } from "@/widgets/generators/transformation-diagram"
import { TransversalAngleDiagramPropsSchema } from "@/widgets/generators/transversal-angle-diagram"
import { TreeDiagramPropsSchema } from "@/widgets/generators/tree-diagram"
import { TriangleDiagramPropsSchema } from "@/widgets/generators/triangle-diagram"
import { UnitBlockDiagramPropsSchema } from "@/widgets/generators/unit-block-diagram"
import { UrlImageWidgetPropsSchema } from "@/widgets/generators/url-image"
import { VectorDiagramPropsSchema } from "@/widgets/generators/vector-diagram"
import { VennDiagramPropsSchema } from "@/widgets/generators/venn-diagram"
import { VerticalArithmeticSetupPropsSchema } from "@/widgets/generators/vertical-arithmetic-setup"
import { VideoPropsSchema } from "@/widgets/generators/video"
import { WheelDiagramPropsSchema } from "@/widgets/generators/wheel-diagram"

// Master registry of widget schemas for dynamic validation and prompting
export const allWidgetSchemas = {
	threeDIntersectionDiagram: ThreeDIntersectionDiagramPropsSchema,
	quadrantDiagram: QuadrantDiagramPropsSchema,
	clockDiagram: ClockDiagramPropsSchema,
	angleDiagram: AngleDiagramPropsSchema,
	angleTypeDiagram: AngleTypeDiagramPropsSchema,
	circleAngleDiagram: CircleAngleDiagramPropsSchema,
	areaModelMultiplication: AreaModelMultiplicationPropsSchema,
	areaGraph: AreaGraphPropsSchema,
	barChart: BarChartPropsSchema,
	boxGrid: BoxGridPropsSchema,
	boxPlot: BoxPlotPropsSchema,
	circleDiagram: CircleDiagramPropsSchema,
	fractionModelDiagram: FractionModelDiagramPropsSchema,
	fractionMultiplicationModel: FractionMultiplicationModelPropsSchema,
	compositeShapeDiagram: CompositeShapeDiagramPropsSchema,
	conceptualGraph: ConceptualGraphPropsSchema,
	coordinatePlane: CoordinatePlaneComprehensivePropsSchema,
	divergentBarChart: DivergentBarChartPropsSchema,
	functionPlotGraph: FunctionPlotGraphPropsSchema,
	lineEquationGraph: LineEquationGraphPropsSchema,
	pointPlotGraph: PointPlotGraphPropsSchema,
	populationChangeEventGraph: PopulationChangeEventGraphPropsSchema,
	polygonGraph: PolygonGraphPropsSchema,
	protractorAngleDiagram: ProtractorAngleDiagramPropsSchema,
	radiallyConstrainedAngleDiagram: RadiallyConstrainedAngleDiagramPropsSchema,
	shapeTransformationGraph: ShapeTransformationGraphPropsSchema,
	discreteObjectRatioDiagram: DiscreteObjectRatioDiagramPropsSchema,
	dotPlot: DotPlotPropsSchema,
	doubleNumberLine: DoubleNumberLinePropsSchema,
	populationBarChart: PopulationBarChartPropsSchema,
	emojiImage: EmojiImagePropsSchema,
	figureComparisonDiagram: FigureComparisonDiagramPropsSchema,
	fractionSumDiagram: FractionSumDiagramPropsSchema,
	geometricPrimitiveDiagram: GeometricPrimitiveDiagramPropsSchema,
	geometricSolidDiagram: GeometricSolidDiagramPropsSchema,
	hangerDiagram: HangerDiagramPropsSchema,
	histogram: HistogramPropsSchema,
	nPolygon: NPolygonPropsSchema,
	patternDiagram: PatternDiagramPropsSchema,
	inequalityNumberLine: InequalityNumberLinePropsSchema,
	keelingCurve: KeelingCurvePropsSchema,
	lineGraph: LineGraphPropsSchema,
	numberLine: NumberLinePropsSchema,
	numberLineWithAction: NumberLineWithActionPropsSchema,
	numberLineWithFractionGroups: NumberLineWithFractionGroupsPropsSchema,
	numberSetDiagram: NumberSetDiagramPropsSchema,
	parabolaGraph: ParabolaGraphPropsSchema,
	partitionedShape: PartitionedShapePropsSchema,
	pentagonIntersectionDiagram: PentagonIntersectionDiagramPropsSchema,
	pictograph: PictographPropsSchema,
	integerChipModel: IntegerChipModelPropsSchema,
	integerChipLegend: IntegerChipLegendPropsSchema,
	polyhedronDiagram: PolyhedronDiagramPropsSchema,
	probabilitySpinner: ProbabilitySpinnerPropsSchema,
	polyhedronNetDiagram: PolyhedronNetDiagramPropsSchema,
	pythagoreanProofDiagram: PythagoreanProofDiagramPropsSchema,
	quantityFractionalDiagram: QuantityFractionalDiagramPropsSchema,
	ratioBoxDiagram: RatioBoxDiagramPropsSchema,
	rectangularFrameDiagram: RectangularFrameDiagramPropsSchema,
	scaleCopiesSlider: ScaleCopiesSliderPropsSchema,
	simpleArrow: SimpleArrowPropsSchema,
	sinCosineWidget: SinCosineWidgetPropsSchema,
	scatterPlot: ScatterPlotPropsSchema,
	stackedItemsDiagram: StackedItemsDiagramPropsSchema,
	tapeDiagram: TapeDiagramPropsSchema,
	transformationDiagram: TransformationDiagramPropsSchema,
	transversalAngleDiagram: TransversalAngleDiagramPropsSchema,
	treeDiagram: TreeDiagramPropsSchema,
	triangleDiagram: TriangleDiagramPropsSchema,
	unitBlockDiagram: UnitBlockDiagramPropsSchema,
	periodicTable: PeriodicTableWidgetPropsSchema,
	urlImage: UrlImageWidgetPropsSchema,
	vennDiagram: VennDiagramPropsSchema,
	verticalArithmeticSetup: VerticalArithmeticSetupPropsSchema,
	vectorDiagram: VectorDiagramPropsSchema,
	parallelogramTrapezoidDiagram: ParallelogramTrapezoidDiagramPropsSchema,
	pieChart: PieChartWidgetPropsSchema,
	fractionFrequencyPlot: FractionFrequencyPlotPropsSchema,
	freeBodyDiagram: FreeBodyDiagramPropsSchema,
	divisionAreaDiagram: DivisionAreaDiagramPropsSchema,
	divisionModelDiagram: DivisionModelDiagramPropsSchema,
	factorizationDiagram: FactorizationDiagramPropsSchema,
	equivalentFractionModel: EquivalentFractionModelPropsSchema,
	subtractionWithRegrouping: SubtractionWithRegroupingPropsSchema,
	additionWithRegrouping: AdditionWithRegroupingPropsSchema,
	wheelDiagram: WheelDiagramPropsSchema,
	labeledRectangleDiagram: LabeledRectangleDiagramPropsSchema,
	customPolygonDiagram: CustomPolygonDiagramPropsSchema,
	lineDiagram: LineDiagramPropsSchema,
	pesSpectrum: PESSpectrumPropsSchema,
	stickPlot: StickPlotPropsSchema,
	video: VideoPropsSchema,
	marbleDiagram: MarbleDiagramPropsSchema,
	symmetryDiagram: SymmetryDiagramPropsSchema,
	stemLeafPlot: StemLeafPlotPropsSchema,
	dataTable: DataTablePropsSchema,
	decoratedNumber: DecoratedNumberPropsSchema
} as const

export const typedSchemas = allWidgetSchemas

// Re-export all individual schemas for use in collections
export {
	ThreeDIntersectionDiagramPropsSchema,
	QuadrantDiagramPropsSchema,
	AdditionWithRegroupingPropsSchema,
	AngleDiagramPropsSchema,
	AngleTypeDiagramPropsSchema,
	AreaGraphPropsSchema,
	AreaModelMultiplicationPropsSchema,
	BarChartPropsSchema,
	BoxGridPropsSchema,
	BoxPlotPropsSchema,
	CircleDiagramPropsSchema,
	CircleAngleDiagramPropsSchema,
	CompositeShapeDiagramPropsSchema,
	ConceptualGraphPropsSchema,
	CoordinatePlaneComprehensivePropsSchema,
	DiscreteObjectRatioDiagramPropsSchema,
	DivergentBarChartPropsSchema,
	DivisionAreaDiagramPropsSchema,
	DivisionModelDiagramPropsSchema,
	DotPlotPropsSchema,
	DoubleNumberLinePropsSchema,
	EmojiImagePropsSchema,
	EquivalentFractionModelPropsSchema,
	FactorizationDiagramPropsSchema,
	FigureComparisonDiagramPropsSchema,
	FractionFrequencyPlotPropsSchema,
	FractionMultiplicationModelPropsSchema,
	FractionSumDiagramPropsSchema,
	FractionModelDiagramPropsSchema,
	FreeBodyDiagramPropsSchema,
	FunctionPlotGraphPropsSchema,
	GeometricPrimitiveDiagramPropsSchema,
	GeometricSolidDiagramPropsSchema,
	HangerDiagramPropsSchema,
	HistogramPropsSchema,
	InequalityNumberLinePropsSchema,
	KeelingCurvePropsSchema,
	LineEquationGraphPropsSchema,
	LineGraphPropsSchema,
	NPolygonPropsSchema,
	PatternDiagramPropsSchema,
	NumberLinePropsSchema,
	NumberLineWithActionPropsSchema,
	NumberLineWithFractionGroupsPropsSchema,
	NumberSetDiagramPropsSchema,
	ParabolaGraphPropsSchema,
	ParallelogramTrapezoidDiagramPropsSchema,
	PartitionedShapePropsSchema,
	PentagonIntersectionDiagramPropsSchema,
	PeriodicTableWidgetPropsSchema,
	PieChartWidgetPropsSchema,
	PictographPropsSchema,
	IntegerChipModelPropsSchema,
	IntegerChipLegendPropsSchema,
	PointPlotGraphPropsSchema,
	PolygonGraphPropsSchema,
	PolyhedronDiagramPropsSchema,
	PolyhedronNetDiagramPropsSchema,
	PopulationBarChartPropsSchema,
	PopulationChangeEventGraphPropsSchema,
	ProbabilitySpinnerPropsSchema,
	ProtractorAngleDiagramPropsSchema,
	RadiallyConstrainedAngleDiagramPropsSchema,
	PythagoreanProofDiagramPropsSchema,
	QuantityFractionalDiagramPropsSchema,
	RatioBoxDiagramPropsSchema,
	RectangularFrameDiagramPropsSchema,
	ScaleCopiesSliderPropsSchema,
	ScatterPlotPropsSchema,
	ShapeTransformationGraphPropsSchema,
	SimpleArrowPropsSchema,
	SinCosineWidgetPropsSchema,
	StackedItemsDiagramPropsSchema,
	SubtractionWithRegroupingPropsSchema,
	TapeDiagramPropsSchema,
	TransformationDiagramPropsSchema,
	TransversalAngleDiagramPropsSchema,
	TreeDiagramPropsSchema,
	TriangleDiagramPropsSchema,
	UnitBlockDiagramPropsSchema,
	UrlImageWidgetPropsSchema,
	VectorDiagramPropsSchema,
	VennDiagramPropsSchema,
	VerticalArithmeticSetupPropsSchema,
	ClockDiagramPropsSchema,
	WheelDiagramPropsSchema,
	LabeledRectangleDiagramPropsSchema,
	CustomPolygonDiagramPropsSchema,
	LineDiagramPropsSchema,
	PESSpectrumPropsSchema,
	StickPlotPropsSchema,
	VideoPropsSchema,
	MarbleDiagramPropsSchema,
	SymmetryDiagramPropsSchema,
	StemLeafPlotPropsSchema,
	DataTablePropsSchema,
	DecoratedNumberPropsSchema
}

// NEW: Input types for each schema
export type ThreeDIntersectionDiagramProps = z.input<
	typeof ThreeDIntersectionDiagramPropsSchema
>
export type QuadrantDiagramProps = z.input<typeof QuadrantDiagramPropsSchema>
export type AdditionWithRegroupingProps = z.input<
	typeof AdditionWithRegroupingPropsSchema
>
export type AngleDiagramProps = z.input<typeof AngleDiagramPropsSchema>
export type AngleTypeDiagramProps = z.input<typeof AngleTypeDiagramPropsSchema>
export type AreaGraphProps = z.input<typeof AreaGraphPropsSchema>
export type AreaModelMultiplicationProps = z.input<
	typeof AreaModelMultiplicationPropsSchema
>
export type BarChartProps = z.input<typeof BarChartPropsSchema>
export type BoxGridProps = z.input<typeof BoxGridPropsSchema>
export type BoxPlotProps = z.input<typeof BoxPlotPropsSchema>
export type CircleDiagramProps = z.input<typeof CircleDiagramPropsSchema>
export type CircleAngleDiagramProps = z.input<
	typeof CircleAngleDiagramPropsSchema
>
export type CompositeShapeDiagramProps = z.input<
	typeof CompositeShapeDiagramPropsSchema
>
export type ConceptualGraphProps = z.input<typeof ConceptualGraphPropsSchema>
export type CoordinatePlaneComprehensiveProps = z.input<
	typeof CoordinatePlaneComprehensivePropsSchema
>
export type DiscreteObjectRatioDiagramProps = z.input<
	typeof DiscreteObjectRatioDiagramPropsSchema
>
export type DivergentBarChartProps = z.input<
	typeof DivergentBarChartPropsSchema
>
export type DivisionAreaDiagramProps = z.input<
	typeof DivisionAreaDiagramPropsSchema
>
export type DivisionModelDiagramProps = z.input<
	typeof DivisionModelDiagramPropsSchema
>
export type DotPlotProps = z.input<typeof DotPlotPropsSchema>
export type DoubleNumberLineProps = z.input<typeof DoubleNumberLinePropsSchema>
export type EmojiImageProps = z.input<typeof EmojiImagePropsSchema>
export type EquivalentFractionModelProps = z.input<
	typeof EquivalentFractionModelPropsSchema
>
export type FactorizationDiagramProps = z.input<
	typeof FactorizationDiagramPropsSchema
>
export type FigureComparisonDiagramProps = z.input<
	typeof FigureComparisonDiagramPropsSchema
>
export type FractionFrequencyPlotProps = z.input<
	typeof FractionFrequencyPlotPropsSchema
>
export type FractionMultiplicationModelProps = z.input<
	typeof FractionMultiplicationModelPropsSchema
>
export type FractionSumDiagramProps = z.input<
	typeof FractionSumDiagramPropsSchema
>
export type FractionModelDiagramProps = z.input<
	typeof FractionModelDiagramPropsSchema
>
export type FreeBodyDiagramProps = z.input<typeof FreeBodyDiagramPropsSchema>
export type FunctionPlotGraphProps = z.input<
	typeof FunctionPlotGraphPropsSchema
>
export type GeometricPrimitiveDiagramProps = z.input<
	typeof GeometricPrimitiveDiagramPropsSchema
>
export type GeometricSolidDiagramProps = z.input<
	typeof GeometricSolidDiagramPropsSchema
>
export type HangerDiagramProps = z.input<typeof HangerDiagramPropsSchema>
export type HistogramProps = z.input<typeof HistogramPropsSchema>
export type InequalityNumberLineProps = z.input<
	typeof InequalityNumberLinePropsSchema
>
export type IntegerChipModelProps = z.input<typeof IntegerChipModelPropsSchema>
export type IntegerChipLegendProps = z.input<
	typeof IntegerChipLegendPropsSchema
>
export type KeelingCurveProps = z.input<typeof KeelingCurvePropsSchema>
export type LineEquationGraphProps = z.input<
	typeof LineEquationGraphPropsSchema
>
export type LineGraphProps = z.input<typeof LineGraphPropsSchema>
export type NPolygonProps = z.input<typeof NPolygonPropsSchema>
export type PatternDiagramProps = z.input<typeof PatternDiagramPropsSchema>
export type NumberLineProps = z.input<typeof NumberLinePropsSchema>
export type NumberLineWithActionProps = z.input<
	typeof NumberLineWithActionPropsSchema
>
export type NumberLineWithFractionGroupsProps = z.input<
	typeof NumberLineWithFractionGroupsPropsSchema
>
export type NumberSetDiagramProps = z.input<typeof NumberSetDiagramPropsSchema>
export type ParabolaGraphProps = z.input<typeof ParabolaGraphPropsSchema>
export type ParallelogramTrapezoidDiagramProps = z.input<
	typeof ParallelogramTrapezoidDiagramPropsSchema
>
export type PartitionedShapeProps = z.input<typeof PartitionedShapePropsSchema>
export type PentagonIntersectionDiagramProps = z.input<
	typeof PentagonIntersectionDiagramPropsSchema
>
export type PeriodicTableWidgetProps = z.input<
	typeof PeriodicTableWidgetPropsSchema
>
export type PieChartWidgetProps = z.input<typeof PieChartWidgetPropsSchema>
export type PictographProps = z.input<typeof PictographPropsSchema>
export type PointPlotGraphProps = z.input<typeof PointPlotGraphPropsSchema>
export type PolygonGraphProps = z.input<typeof PolygonGraphPropsSchema>
export type PolyhedronDiagramProps = z.input<
	typeof PolyhedronDiagramPropsSchema
>
export type PolyhedronNetDiagramProps = z.input<
	typeof PolyhedronNetDiagramPropsSchema
>
export type PopulationBarChartProps = z.input<
	typeof PopulationBarChartPropsSchema
>
export type PopulationChangeEventGraphProps = z.input<
	typeof PopulationChangeEventGraphPropsSchema
>
export type ProbabilitySpinnerProps = z.input<
	typeof ProbabilitySpinnerPropsSchema
>
export type ProtractorAngleDiagramProps = z.input<
	typeof ProtractorAngleDiagramPropsSchema
>
export type RadiallyConstrainedAngleDiagramProps = z.input<
	typeof RadiallyConstrainedAngleDiagramPropsSchema
>
export type PythagoreanProofDiagramProps = z.input<
	typeof PythagoreanProofDiagramPropsSchema
>
export type QuantityFractionalDiagramProps = z.input<
	typeof QuantityFractionalDiagramPropsSchema
>
export type RatioBoxDiagramProps = z.input<typeof RatioBoxDiagramPropsSchema>
export type RectangularFrameDiagramProps = z.input<
	typeof RectangularFrameDiagramPropsSchema
>
export type ScaleCopiesSliderProps = z.input<
	typeof ScaleCopiesSliderPropsSchema
>
export type ScatterPlotProps = z.input<typeof ScatterPlotPropsSchema>
export type ShapeTransformationGraphProps = z.input<
	typeof ShapeTransformationGraphPropsSchema
>
export type SimpleArrowProps = z.input<typeof SimpleArrowPropsSchema>
export type SinCosineWidgetProps = z.input<typeof SinCosineWidgetPropsSchema>
export type StackedItemsDiagramProps = z.input<
	typeof StackedItemsDiagramPropsSchema
>
export type SubtractionWithRegroupingProps = z.input<
	typeof SubtractionWithRegroupingPropsSchema
>
export type TapeDiagramProps = z.input<typeof TapeDiagramPropsSchema>
export type TransformationDiagramProps = z.input<
	typeof TransformationDiagramPropsSchema
>
export type TransversalAngleDiagramProps = z.input<
	typeof TransversalAngleDiagramPropsSchema
>
export type TreeDiagramProps = z.input<typeof TreeDiagramPropsSchema>
export type TriangleDiagramProps = z.input<typeof TriangleDiagramPropsSchema>
export type UnitBlockDiagramProps = z.input<typeof UnitBlockDiagramPropsSchema>
export type UrlImageWidgetProps = z.input<typeof UrlImageWidgetPropsSchema>
export type VectorDiagramProps = z.input<typeof VectorDiagramPropsSchema>
export type VennDiagramProps = z.input<typeof VennDiagramPropsSchema>
export type VerticalArithmeticSetupProps = z.input<
	typeof VerticalArithmeticSetupPropsSchema
>
export type ClockDiagramProps = z.input<typeof ClockDiagramPropsSchema>
export type WheelDiagramProps = z.input<typeof WheelDiagramPropsSchema>
export type LabeledRectangleDiagramProps = z.input<
	typeof LabeledRectangleDiagramPropsSchema
>
export type CustomPolygonDiagramProps = z.input<
	typeof CustomPolygonDiagramPropsSchema
>
export type LineDiagramProps = z.input<typeof LineDiagramPropsSchema>
export type PESSpectrumProps = z.input<typeof PESSpectrumPropsSchema>
export type StickPlotProps = z.input<typeof StickPlotPropsSchema>
export type VideoProps = z.input<typeof VideoPropsSchema>
export type MarbleDiagramProps = z.input<typeof MarbleDiagramPropsSchema>
export type StemLeafPlotProps = z.input<typeof StemLeafPlotPropsSchema>
export type DataTableProps = z.input<typeof DataTablePropsSchema>
export type DecoratedNumberProps = z.input<typeof DecoratedNumberPropsSchema>

const widgetSchemasWithoutSpecialUnions = [
	typedSchemas.threeDIntersectionDiagram,
	typedSchemas.quadrantDiagram,
	typedSchemas.clockDiagram,
	typedSchemas.angleDiagram,
	typedSchemas.angleTypeDiagram,
	typedSchemas.circleAngleDiagram,
	typedSchemas.areaModelMultiplication,
	typedSchemas.areaGraph,
	typedSchemas.barChart,
	typedSchemas.boxGrid,
	typedSchemas.boxPlot,
	typedSchemas.circleDiagram,
	typedSchemas.fractionModelDiagram,
	typedSchemas.fractionMultiplicationModel,
	typedSchemas.compositeShapeDiagram,
	typedSchemas.conceptualGraph,
	typedSchemas.coordinatePlane,
	typedSchemas.dataTable,
	typedSchemas.divergentBarChart,
	typedSchemas.functionPlotGraph,
	typedSchemas.lineEquationGraph,
	typedSchemas.pointPlotGraph,
	typedSchemas.populationChangeEventGraph,
	typedSchemas.polygonGraph,
	typedSchemas.protractorAngleDiagram,
	typedSchemas.radiallyConstrainedAngleDiagram,
	typedSchemas.shapeTransformationGraph,
	typedSchemas.integerChipModel,
	typedSchemas.integerChipLegend,
	typedSchemas.discreteObjectRatioDiagram,
	typedSchemas.dotPlot,
	typedSchemas.doubleNumberLine,
	typedSchemas.populationBarChart,
	typedSchemas.emojiImage,
	typedSchemas.figureComparisonDiagram,
	typedSchemas.fractionSumDiagram,
	typedSchemas.geometricPrimitiveDiagram,
	typedSchemas.geometricSolidDiagram,
	typedSchemas.hangerDiagram,
	typedSchemas.histogram,
	typedSchemas.nPolygon,
	typedSchemas.patternDiagram,
	typedSchemas.inequalityNumberLine,
	typedSchemas.keelingCurve,
	typedSchemas.lineGraph,
	typedSchemas.numberLine,
	typedSchemas.numberLineWithAction,
	typedSchemas.numberLineWithFractionGroups,
	typedSchemas.numberSetDiagram,
	typedSchemas.parabolaGraph,
	typedSchemas.pentagonIntersectionDiagram,
	typedSchemas.pictograph,
	typedSchemas.polyhedronDiagram,
	typedSchemas.probabilitySpinner,
	typedSchemas.pythagoreanProofDiagram,
	typedSchemas.quantityFractionalDiagram,
	typedSchemas.ratioBoxDiagram,
	typedSchemas.rectangularFrameDiagram,
	typedSchemas.scaleCopiesSlider,
	typedSchemas.simpleArrow,
	typedSchemas.sinCosineWidget,
	typedSchemas.scatterPlot,
	typedSchemas.stackedItemsDiagram,
	typedSchemas.tapeDiagram,
	typedSchemas.transformationDiagram,
	typedSchemas.transversalAngleDiagram,
	typedSchemas.treeDiagram,
	typedSchemas.triangleDiagram,
	typedSchemas.unitBlockDiagram,
	typedSchemas.periodicTable,
	typedSchemas.urlImage,
	typedSchemas.vennDiagram,
	typedSchemas.verticalArithmeticSetup,
	typedSchemas.vectorDiagram,
	typedSchemas.parallelogramTrapezoidDiagram,
	typedSchemas.pieChart,
	typedSchemas.fractionFrequencyPlot,
	typedSchemas.freeBodyDiagram,
	typedSchemas.divisionAreaDiagram,
	typedSchemas.divisionModelDiagram,
	typedSchemas.factorizationDiagram,
	typedSchemas.equivalentFractionModel,
	typedSchemas.subtractionWithRegrouping,
	typedSchemas.additionWithRegrouping,
	typedSchemas.wheelDiagram,
	typedSchemas.labeledRectangleDiagram,
	typedSchemas.customPolygonDiagram,
	typedSchemas.lineDiagram,
	typedSchemas.pesSpectrum,
	typedSchemas.stickPlot,
	typedSchemas.video,
	typedSchemas.marbleDiagram,
	typedSchemas.symmetryDiagram,
	typedSchemas.stemLeafPlot,
	typedSchemas.decoratedNumber
] as const

export const WidgetSchema = z.union([
	z.discriminatedUnion("type", widgetSchemasWithoutSpecialUnions),
	typedSchemas.partitionedShape,
	typedSchemas.polyhedronNetDiagram
])
export type Widget = z.infer<typeof WidgetSchema>
export type WidgetInput = z.input<typeof WidgetSchema>
