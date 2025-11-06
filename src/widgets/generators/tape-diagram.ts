import { z } from "zod"
// Path2D import no longer needed since curly bracket was removed
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { PADDING } from "@/widgets/utils/constants"
import { CSS_COLOR_PATTERN } from "@/widgets/utils/css-color"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

// -----------------------------
// Unified span-based tape diagram schema
// -----------------------------

// Address spans either by units or percent
function createAddressSpanSchema() {
	return z
		.discriminatedUnion("by", [
			z
				.object({
					by: z
						.literal("units")
						.describe(
							"Indicates this span is addressed by unit indices. Use when you want to specify exact unit positions on the tape."
						),
					startUnit: z
						.number()
						.int()
						.min(0)
						.describe(
							"Starting unit index (inclusive) for the span. Must be a non-negative integer. For a 10-unit tape, valid values are 0-9."
						),
					endUnit: z
						.number()
						.int()
						.min(1)
						.describe(
							"Ending unit index (exclusive) for the span. Must be at least 1. For a span covering units 0-6, use startUnit: 0, endUnit: 7."
						)
				})
				.strict()
				.describe(
					"Address a span using discrete unit indices. Perfect for problems involving counting, whole numbers, or when you need precise unit-level control."
				),
			z
				.object({
					by: z
						.literal("percent")
						.describe(
							"Indicates this span is addressed by percentage of the tape width. Use for proportional relationships."
						),
					startPct: z
						.number()
						.min(0)
						.max(100)
						.describe(
							"Starting percentage (inclusive) of the tape width. 0 means the left edge, 100 means the right edge."
						),
					endPct: z
						.number()
						.min(0)
						.max(100)
						.describe(
							"Ending percentage (exclusive) of the tape width. For a span covering 70% of the tape, use startPct: 0, endPct: 70."
						)
				})
				.strict()
				.describe(
					"Address a span using percentages of the tape width. Ideal for ratio problems, percentages, or when the exact unit count is less important than the proportion."
				)
		])
		.describe(
			"Defines a span (range) on the tape that can be addressed either by discrete unit indices [start,end) or by percentage of tape width [start%,end%). This flexible addressing system allows both precise unit-based specifications (e.g., 'units 0-7 of 10') and proportional specifications (e.g., '0-70% of the tape'). The span is half-open: start is inclusive, end is exclusive."
		)
}

// Fill visual style
function createFillStyleSchema() {
	return z
		.discriminatedUnion("kind", [
			z
				.object({
					kind: z
						.literal("solid")
						.describe(
							"Renders the span as a solid filled rectangle. This is the most common style for showing shaded portions."
						),
					fill: z
						.string()
						.regex(CSS_COLOR_PATTERN, "invalid css color")
						.describe(
							"CSS color for the solid fill. Use hex colors (e.g., '#7854ab', '#FF0000'). Choose colors that contrast well with white text if labels will be placed inside."
						),
					fillOpacity: z
						.number()
						.min(0)
						.max(1)
						.nullable()
						.describe(
							"Opacity of the fill from 0 (transparent) to 1 (opaque). Null uses default opacity of 1. Use 0.5 for semi-transparent overlays."
						)
				})
				.strict()
				.describe(
					"Solid fill style for showing shaded or colored regions. Use this for the most common tape diagram scenarios where you need to show filled portions (e.g., '7 out of 10 units shaded')."
				),
			z
				.object({
					kind: z
						.literal("outline")
						.describe(
							"Renders the span as an empty rectangle with only a border. Perfect for showing 'unfilled' or 'remaining' portions."
						),
					stroke: z
						.string()
						.regex(CSS_COLOR_PATTERN, "invalid css color")
						.describe(
							"CSS color for the outline stroke. Typically matches the grid color or uses black ('#000000') for emphasis."
						),
					strokeWidth: z
						.number()
						.min(0)
						.describe(
							"Width of the outline stroke in pixels. Use 1-2 for thin lines, 3-4 for bold emphasis. Must be non-negative."
						)
				})
				.strict()
				.describe(
					"Outline-only style showing just the border of a span. Use this to represent empty, unfilled, or 'remaining' portions in part-whole relationships."
				),
			z
				.object({
					kind: z
						.literal("hatch")
						.describe(
							"Renders the span with a hatched (diagonal line) pattern. Useful for distinguishing regions when color alone isn't sufficient."
						),
					color: z
						.string()
						.regex(CSS_COLOR_PATTERN, "invalid css color")
						.describe(
							"CSS color for the hatch lines. Often black or a dark color for visibility."
						),
					strokeWidth: z
						.number()
						.min(0)
						.describe(
							"Width of each hatch line in pixels. Typically 1-2 pixels. Thicker lines create a bolder pattern."
						),
					spacing: z
						.number()
						.positive()
						.nullable()
						.describe(
							"Distance between hatch lines in pixels. Null uses default spacing of 4. Larger values create a sparser pattern."
						),
					angleDeg: z
						.number()
						.nullable()
						.describe(
							"Angle of hatch lines in degrees. Null uses default 45°. Use 45° for standard diagonal, 0° for horizontal, 90° for vertical."
						)
				})
				.strict()
				.describe(
					"Hatched pattern fill using diagonal lines. Use when you need to distinguish regions beyond what solid colors provide, or for black-and-white printing compatibility."
				)
		])
		.describe(
			"Visual style for rendering filled regions within a tape. Supports three distinct styles: solid fills (most common for shaded portions), outline-only (for unfilled/remaining portions), and hatched patterns (for special emphasis or print-friendly diagrams). The choice of style helps convey different mathematical concepts - solid for 'taken/used', outline for 'remaining/available', and hatch for special categories."
		)
}

function createLabelPlacementSchema() {
	return z
		.enum(["inside", "above", "below"])
		.describe(
			"Position of labels relative to their associated element. 'inside' places text centered within the element (requires sufficient space and contrasting colors). 'above' places text above the element with a small gap. 'below' places text below the element. Choose based on available space and visual clarity."
		)
}

function createFillSpanSchema() {
	return z
		.object({
			span: createAddressSpanSchema().describe(
				"The range of units or percentage that this fill covers. Defines where on the tape this visual element appears."
			),
			style: createFillStyleSchema().describe(
				"Visual appearance of this filled region. Choose solid for standard fills, outline for unfilled portions, or hatch for special emphasis."
			),
			label: z
				.object({
					text: z
						.string()
						.describe(
							"Label text to display for this span. Keep concise to fit within or near the span. Examples: '7', '70%', 'Used', 'x + 3'. Plain text only, no HTML/markdown."
						),
					placement: createLabelPlacementSchema().describe(
						"Where to position the label relative to the span. Inside works well for solid fills with contrasting text. Above/below avoid overlap issues."
					)
				})
				.nullable()
				.describe(
					"Optional label for this filled span. Labels help identify what each region represents. Null means no label. Use labels to show values, percentages, or descriptions of each part."
				)
		})
		.strict()
		.describe(
			"Defines a visually distinct region within a tape, specified by a span (range) and a visual style. Each fill span represents one semantic part of your tape diagram - like the 'shaded portion' in a percentage problem or individual addends in an addition model. Multiple fills can be layered to create complex representations. Fills are drawn in array order, allowing later fills to overlay earlier ones if spans overlap."
		)
}

function createBracketStyleSchema() {
	return z
		.discriminatedUnion("kind", [
			z
				.object({
					kind: z
						.literal("straight")
						.describe(
							"Traditional bracket style with straight horizontal line and vertical end marks. Most common in mathematics textbooks."
						),
					stroke: z
						.string()
						.regex(CSS_COLOR_PATTERN, "invalid css color")
						.nullable()
						.describe(
							"Color of the bracket lines. Null uses default black. Consider matching or contrasting with tape colors."
						),
					strokeWidth: z
						.number()
						.min(0)
						.nullable()
						.describe(
							"Width of bracket lines in pixels. Null uses default width. Use 1-2 for standard, 3-4 for emphasis."
						)
				})
				.strict()
				.describe(
					"Straight bracket style using horizontal line with perpendicular end marks. This is the standard mathematical notation for indicating a span or total."
				),
			z
				.object({
					kind: z
						.literal("curly")
						.describe(
							"Decorative curly brace style. Often used in advanced mathematics or when straight brackets might be confused with other notation."
						),
					stroke: z
						.string()
						.regex(CSS_COLOR_PATTERN, "invalid css color")
						.nullable()
						.describe(
							"Color of the curly brace. Null uses default black. Often kept black for clarity."
						),
					strokeWidth: z
						.number()
						.min(0)
						.nullable()
						.describe(
							"Width of the brace curves in pixels. Null uses default width. Thicker braces are more visually prominent."
						)
				})
				.strict()
				.describe(
					"Curly brace style creating an elegant curved bracket. Less common but useful for special emphasis or when avoiding confusion with other linear elements."
				)
		])
		.describe(
			"Visual style for brackets that indicate spans or groupings. Straight brackets are standard in elementary mathematics and provide clear, simple delineation. Curly braces add visual interest and are often used in more advanced contexts. The choice is primarily aesthetic unless specific mathematical conventions apply."
		)
}

function createBracketSchema() {
	return z
		.object({
			tape: z
				.enum(["top", "bottom"])
				.describe(
					"Which tape this bracket annotates. 'top' for the upper tape, 'bottom' for the lower tape. Brackets can only reference existing tapes."
				),
			span: createAddressSpanSchema().describe(
				"The portion of the tape this bracket covers. Can bracket the entire tape, a subset of units, or any specific range. The bracket will be positioned to clearly indicate this span."
			),
			labelTop: z
				.string()
				.nullable()
				.transform((v) => (v === "" || v === "null" || v === "NULL" ? null : v))
				.describe(
					"Label displayed above the bracket. Typically shows sums, totals, or descriptions (e.g., '91', 'Total', 'Part A + Part B'). Null means no top label. Plain text only."
				),
			labelBottom: z
				.string()
				.nullable()
				.transform((v) => (v === "" || v === "null" || v === "NULL" ? null : v))
				.describe(
					"Label displayed below the bracket. Often shows alternative representations (e.g., '70%', '7/10', 'Unknown'). Null means no bottom label. Allows showing two related values for the same span."
				),
			style: createBracketStyleSchema().describe(
				"Visual appearance of the bracket. Choose based on convention or visual clarity."
			)
		})
		.strict()
		.describe(
			"Defines a bracket that annotates a specific span of a tape, typically used to show totals, sums, or to label portions. Brackets can display labels both above and below, making them perfect for showing equivalent representations (like '91' and '70%' for the same span). Unlike the old total-only brackets, these can cover any portion of a tape, enabling partial sums, differences, or any other mathematical relationship. Multiple brackets can be added to show different groupings or hierarchical relationships."
		)
}

function createTapeSchema() {
	return z
		.object({
			label: z
				.string()
				.nullable()
				.transform((v) => (v === "" || v === "null" || v === "NULL" ? null : v))
				.describe(
					"Label displayed to the left of this tape bar. Use to identify what this tape represents (e.g., 'Total', 'Parts', 'Box A', 'Time (minutes)'). Null means no label. Keep concise as space is limited. Plain text only."
				),
			unitsTotal: z
				.number()
				.int()
				.min(1)
				.describe(
					"Total number of equal-sized units that make up this tape's coordinate system. This defines the resolution of your tape - use 10 for percentages/decimals, 12 for dozens, or any value that matches your problem context. All spans within this tape are measured against this total."
				),
			extent: createAddressSpanSchema()
				.nullable()
				.describe(
					"Optional constraint on the visible width of this tape within the diagram. When null, tape uses full available width. When specified, tape occupies only this span within the diagram's reference coordinate system. Useful for showing proportional comparisons between tapes (e.g., one tape is 70% the width of another)."
				),
			grid: z
				.object({
					show: z
						.boolean()
						.describe(
							"Whether to display grid lines separating each unit. True shows unit boundaries making discrete units visible. False creates a continuous bar without internal divisions."
						)
				})
				.strict()
				.describe(
					"Controls the appearance of unit separation lines within the tape. Grid lines are always rendered in black at the theme default thickness to ensure contrast and consistency. The grid makes individual units visible, essential for counting problems, unit fractions, or when you need to emphasize the discrete nature of the quantities. Hide the grid for continuous quantities or when units are purely conceptual."
				),
			roundedCaps: z
				.boolean()
				.nullable()
				.describe(
					"Whether to render the tape with rounded ends (capsule shape) instead of rectangular. Null or false uses rectangular shape. Rounded caps provide a softer, more modern appearance but may not align with traditional textbook styles."
				),
			fills: z
				.array(createFillSpanSchema())
				.describe(
					"Array of filled/outlined regions within this tape. Each fill targets a specific span and can have its own visual style and label. Fills are drawn in order, allowing for overlapping effects if needed. Use multiple fills to show different parts, quantities, or to create complex shading patterns. Empty array means no fills (blank tape)."
				)
		})
		.strict()
		.describe(
			"Defines a single tape (bar) in the diagram with its own unit-based coordinate system. Each tape is independently configurable with its own total units, visual styling, and filled regions. The tape's unit system provides the reference frame for all spans within it - whether you're showing 7 out of 10 units, 50% of the bar, or three segments of lengths 3, 4, and 5. Tapes can be styled with grids to show discrete units or without grids for continuous quantities. Multiple fills within a tape enable complex part-whole visualizations."
		)
}

export const TapeDiagramPropsSchema = z
	.object({
		type: z
			.literal("tapeDiagram")
			.describe(
				"Identifies this as a tape diagram widget. Always use exactly 'tapeDiagram'."
			),
		width: createWidthSchema(),
		height: createHeightSchema(),
		referenceUnitsTotal: z
			.number()
			.int()
			.min(1)
			.nullable()
			.describe(
				"Optional shared reference coordinate system for comparing tape widths. When provided, each tape's extent (if specified) is measured against this total. For example, with referenceUnitsTotal: 10, a tape with extent {by: 'units', startUnit: 0, endUnit: 7} would occupy 70% of the diagram width. When null, each tape uses the full available width unless constrained by its own extent. Use this for proportional comparisons between tapes."
			),
		topTape: createTapeSchema().describe(
			"The primary (upper) tape in the diagram. Always required. Typically represents the whole, total, or reference quantity in part-whole relationships. In comparison problems, represents the first quantity."
		),
		bottomTape: createTapeSchema()
			.nullable()
			.describe(
				"Optional secondary (lower) tape. When null, diagram shows only one tape. When provided, appears below the top tape with appropriate spacing. Use for comparisons, showing parts vs whole, or representing a second quantity. Both tapes share the same width unless individually constrained by extent."
			),
		brackets: z
			.array(createBracketSchema())
			.describe(
				"Array of brackets that annotate spans on either tape. Brackets can show totals, partial sums, differences, or label any meaningful span. Multiple brackets can overlap or be nested to show hierarchical relationships. Empty array means no brackets. Order matters only for rendering (later brackets appear on top if they overlap)."
			)
	})
	.strict()
	.describe(
		"Creates a tape diagram (also called bar model or strip diagram) for visualizing mathematical relationships through spatial representation. This unified span-based design supports multiple use cases: part-whole relationships (fractions, percentages), addition/subtraction models, ratio comparisons, and algebraic expressions. Each tape has its own unit-based coordinate system, with fills representing different quantities and brackets providing annotations. The flexible addressing system (units or percentages) combined with multiple visual styles (solid, outline, hatch) enables precise mathematical communication. Common uses include: showing 70% as 7 of 10 shaded units, comparing quantities proportionally, breaking addition into visual parts, or representing unknown values in equations."
	)

export type TapeDiagramProps = z.infer<typeof TapeDiagramPropsSchema>

// -----------------------------
// Rendering helpers
// -----------------------------

function spanToFraction(
	span: z.infer<ReturnType<typeof createAddressSpanSchema>>,
	denominatorUnits: number
): { start: number; end: number } {
	if (span.by === "percent") {
		const start = Math.max(0, Math.min(100, span.startPct)) / 100
		const end = Math.max(0, Math.min(100, span.endPct)) / 100
		return { start, end }
	}
	// by: units
	const start = span.startUnit / Math.max(1, denominatorUnits)
	const end = span.endUnit / Math.max(1, denominatorUnits)
	return { start, end }
}

function clamp01(v: number): number {
	return Math.max(0, Math.min(1, v))
}

// -----------------------------
// Generator
// -----------------------------
export const generateTapeDiagram: WidgetGenerator<
	typeof TapeDiagramPropsSchema
> = async (props) => {
	const { width, height, referenceUnitsTotal, topTape, bottomTape, brackets } =
		props

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const padding = PADDING
	const chartWidth = width - 2 * padding
	const tapeHeight = 30
	const tapeGap = 40

	type TapeGeom = {
		leftX: number
		width: number
		y: number
		cellWidth: number
	}

	function computeTapeGeometry(
		tape: z.infer<ReturnType<typeof createTapeSchema>>,
		y: number
	): TapeGeom {
		// Determine extent fraction relative to the chart width
		const extentSpan = tape.extent
		let startFrac = 0
		let endFrac = 1
		if (extentSpan != null) {
			const denom =
				referenceUnitsTotal != null ? referenceUnitsTotal : tape.unitsTotal
			const f = spanToFraction(extentSpan, denom)
			startFrac = clamp01(f.start)
			endFrac = clamp01(f.end)
			if (endFrac < startFrac) {
				const t = startFrac
				startFrac = endFrac
				endFrac = t
			}
		}
		// Both tapes must start at the same left position to align visually.
		// We ignore the span's start for positioning and use it only to determine width.
		const tapeLeft = padding
		const tapeW = Math.max(0, (endFrac - startFrac) * chartWidth)
		const cellW = tapeW / tape.unitsTotal
		return { leftX: tapeLeft, width: tapeW, y, cellWidth: cellW }
	}

	function drawGridAndBorder(
		tape: z.infer<ReturnType<typeof createTapeSchema>>,
		geom: TapeGeom
	): void {
		if (!tape.grid.show) return
		// Outer border
		canvas.drawRect(geom.leftX, geom.y, geom.width, tapeHeight, {
			fill: theme.colors.black,
			fillOpacity: 0,
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.base
		})

		let gridInterval = 1
		if (tape.unitsTotal > 20) {
			const targetLines = 10 // Aim for roughly 10-15 grid lines total
			const rawInterval = tape.unitsTotal / targetLines

			if (rawInterval <= 5) {
				gridInterval = 5
			} else if (rawInterval <= 10) {
				gridInterval = 10
			} else if (rawInterval <= 20) {
				gridInterval = 20
			} else if (rawInterval <= 25) {
				gridInterval = 25
			} else if (rawInterval <= 50) {
				gridInterval = 50
			} else {
				gridInterval = Math.ceil(rawInterval / 100) * 100
			}
		}

		for (let i = gridInterval; i < tape.unitsTotal; i += gridInterval) {
			const x = geom.leftX + i * geom.cellWidth
			canvas.drawLine(x, geom.y, x, geom.y + tapeHeight, {
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base
			})
		}
	}

	let topGeom = computeTapeGeometry(topTape, padding + 20)
	let bottomGeom: TapeGeom | null = null
	if (bottomTape) {
		bottomGeom = computeTapeGeometry(
			bottomTape,
			topGeom.y + tapeHeight + tapeGap
		)
	}

	type BracketRange = { x1: number; x2: number }

	function drawFillSpan(
		tape: z.infer<ReturnType<typeof createTapeSchema>>,
		geom: TapeGeom,
		fill: z.infer<ReturnType<typeof createFillSpanSchema>>,
		topBracketRanges: BracketRange[],
		bottomBracketRanges: BracketRange[]
	): void {
		const { start, end } = spanToFraction(fill.span, tape.unitsTotal)
		const s = clamp01(start)
		const e = clamp01(end)
		const x = geom.leftX + s * geom.width
		const w = Math.max(0, (e - s) * geom.width)

		if (w <= 0) return

		if (fill.style.kind === "solid") {
			canvas.drawRect(x, geom.y, w, tapeHeight, {
				fill: fill.style.fill,
				fillOpacity:
					fill.style.fillOpacity == null ? undefined : fill.style.fillOpacity,
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base
			})
		} else if (fill.style.kind === "outline") {
			canvas.drawRect(x, geom.y, w, tapeHeight, {
				fill: theme.colors.black,
				fillOpacity: 0,
				stroke: fill.style.stroke,
				strokeWidth: fill.style.strokeWidth
			})
		} else {
			// hatch
			const id = `hatch_${Math.round(x)}_${Math.round(geom.y)}_${Math.round(w)}`
			canvas.addHatchPattern({
				id,
				color: fill.style.color,
				strokeWidth: fill.style.strokeWidth,
				spacing: fill.style.spacing == null ? undefined : fill.style.spacing,
				angleDeg: fill.style.angleDeg == null ? undefined : fill.style.angleDeg
			})
			canvas.drawRect(x, geom.y, w, tapeHeight, {
				fillPatternId: id,
				stroke: theme.colors.black,
				strokeWidth: theme.stroke.width.base
			})
		}

		if (fill.label) {
			const cx = x + w / 2
			// Ensure fill labels clear bracket lines by adding more margin above/below
			let cy: number
			if (fill.label.placement === "inside") {
				cy = geom.y + tapeHeight / 2
			} else if (fill.label.placement === "above") {
				cy = geom.y - 16
			} else {
				cy = geom.y + tapeHeight + 24
			}
			// Collision avoidance with bracket labels: if a bracket label exists on the same side and overlaps in X, push further away
			const overlaps = (ranges: BracketRange[]): boolean => {
				const x1 = x
				const x2 = x + w
				for (const r of ranges) {
					if (Math.max(x1, r.x1) < Math.min(x2, r.x2)) return true
				}
				return false
			}
			if (fill.label.placement === "above" && overlaps(topBracketRanges)) {
				cy = geom.y - 40
			} else if (
				fill.label.placement === "below" &&
				overlaps(bottomBracketRanges)
			) {
				cy = geom.y + tapeHeight + 40
			}
			// ALWAYS render text in black for accessibility and consistency, regardless of placement
			const labelColor = theme.colors.black
			canvas.drawText({
				x: cx,
				y: cy,
				text: fill.label.text,
				fill: labelColor,
				anchor: "middle",
				dominantBaseline:
					fill.label.placement === "inside" ? "middle" : "baseline",
				fontWeight: theme.font.weight.bold
			})
		}
	}

	// Draw tape labels to the left of the tape and vertically centered to avoid bracket collisions
	if (topTape.label) {
		const x = padding - 10
		const y = topGeom.y + tapeHeight / 2
		canvas.drawText({
			x,
			y,
			text: topTape.label,
			fill: theme.colors.black,
			anchor: "end",
			dominantBaseline: "middle",
			fontWeight: theme.font.weight.bold
		})
	}
	if (bottomTape?.label && bottomGeom) {
		const x = padding - 10
		const y = bottomGeom.y + tapeHeight / 2
		canvas.drawText({
			x,
			y,
			text: bottomTape.label,
			fill: theme.colors.black,
			anchor: "end",
			dominantBaseline: "middle",
			fontWeight: theme.font.weight.bold
		})
	}

	// Precompute bracket label x-ranges for collision avoidance
	const topBracketTopRanges: BracketRange[] = []
	const topBracketBottomRanges: BracketRange[] = []
	const bottomBracketTopRanges: BracketRange[] = []
	const bottomBracketBottomRanges: BracketRange[] = []

	for (const b of brackets) {
		const tape = b.tape === "top" ? topTape : bottomTape || null
		const geom = b.tape === "top" ? topGeom : bottomGeom
		if (!tape || !geom) continue
		const { start, end } = spanToFraction(b.span, tape.unitsTotal)
		const fx = geom.leftX + clamp01(start) * geom.width
		const tx = geom.leftX + clamp01(end) * geom.width
		const x1 = Math.min(fx, tx)
		const x2 = Math.max(fx, tx)
		if (b.tape === "top") {
			if (b.labelTop) topBracketTopRanges.push({ x1, x2 })
			if (b.labelBottom) topBracketBottomRanges.push({ x1, x2 })
		} else {
			if (b.labelTop) bottomBracketTopRanges.push({ x1, x2 })
			if (b.labelBottom) bottomBracketBottomRanges.push({ x1, x2 })
		}
	}

	// Draw fills first so grid lines appear on top
	for (const f of topTape.fills)
		drawFillSpan(
			topTape,
			topGeom,
			f,
			topBracketTopRanges,
			topBracketBottomRanges
		)
	if (bottomTape && bottomGeom)
		for (const f of bottomTape.fills)
			drawFillSpan(
				bottomTape,
				bottomGeom,
				f,
				bottomBracketTopRanges,
				bottomBracketBottomRanges
			)

	// Draw grids and borders
	drawGridAndBorder(topTape, topGeom)
	if (bottomTape && bottomGeom) drawGridAndBorder(bottomTape, bottomGeom)

	function drawStraightBracket(
		x1: number,
		x2: number,
		y: number,
		lbl: string | null,
		placeAbove: boolean
	): void {
		// Adjust label offset so it never overlaps the tape
		const textOffset = placeAbove ? -12 : 20
		canvas.drawLine(x1, y, x2, y, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.base
		})
		canvas.drawLine(x1, y - 5, x1, y + 5, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.base
		})
		canvas.drawLine(x2, y - 5, x2, y + 5, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.base
		})
		if (lbl) {
			canvas.drawText({
				x: (x1 + x2) / 2,
				y: y + textOffset,
				text: lbl,
				fill: theme.colors.black,
				anchor: "middle",
				fontWeight: theme.font.weight.bold
			})
		}
	}

	// Curly bracket rendering removed in favor of straight brackets for clarity.

	// Render brackets (top and/or bottom, straight or curly).
	for (const b of brackets) {
		const tape = b.tape === "top" ? topTape : bottomTape || null
		const geom = b.tape === "top" ? topGeom : bottomGeom
		if (!tape || !geom) continue
		const { start, end } = spanToFraction(b.span, tape.unitsTotal)
		const fx = geom.leftX + clamp01(start) * geom.width
		const tx = geom.leftX + clamp01(end) * geom.width
		const x1 = Math.min(fx, tx)
		const x2 = Math.max(fx, tx)
		if (b.style.kind === "straight") {
			// Keep a consistent clearance from the tape to avoid label collisions
			if (b.labelTop) drawStraightBracket(x1, x2, geom.y - 6, b.labelTop, true)
			if (b.labelBottom)
				drawStraightBracket(
					x1,
					x2,
					geom.y + tapeHeight + 6,
					b.labelBottom,
					false
				)
		} else {
			// Treat curly style as straight for simpler and clearer visuals
			if (b.labelTop) drawStraightBracket(x1, x2, geom.y - 6, b.labelTop, true)
			if (b.labelBottom)
				drawStraightBracket(
					x1,
					x2,
					geom.y + tapeHeight + 6,
					b.labelBottom,
					false
				)
		}
	}

	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(PADDING)
	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.base}">${svgBody}</svg>`
}
