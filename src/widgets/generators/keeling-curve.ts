import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { CanvasImpl } from "@/widgets/utils/canvas-impl"
import { AXIS_VIEWBOX_PADDING } from "@/widgets/utils/constants"
import { setupCoordinatePlaneBaseV2 } from "@/widgets/utils/coordinate-plane-utils"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { theme } from "@/widgets/utils/theme"

const AnnotationSchema = z.object({
	year: z
		.number()
		.describe(
			"The year on the x-axis that the annotation arrow should point to."
		),
	text: z
		.array(z.string())
		.describe(
			"The annotation text, with each string in the array representing a new line."
		)
})

export const KeelingCurvePropsSchema = z
	.object({
		type: z.literal("keelingCurve"),
		width: createWidthSchema(),
		height: createHeightSchema(),
		xAxisLabel: z.string().describe("Label for the horizontal axis."),
		yAxisLabel: z
			.string()
			.describe("Label for the vertical axis, including units."),
		annotations: z
			.array(AnnotationSchema)
			.describe(
				"An array of declarative annotations pointing to specific years on the curve."
			)
	})
	.strict()
	.describe(
		"Renders a scientifically accurate, non-interactive graph of historical CO2 levels with declarative annotations."
	)

export type KeelingCurveProps = z.infer<typeof KeelingCurvePropsSchema>

// Hardcoded CO2 data for consistency and accuracy.
const CO2_DATA = [
	// Pre-industrial stable period (ice core data approximations)
	{ year: 1, ppm: 277 },
	{ year: 200, ppm: 278 },
	{ year: 400, ppm: 277 },
	{ year: 600, ppm: 278 },
	{ year: 800, ppm: 279 },
	{ year: 1000, ppm: 280 },
	{ year: 1100, ppm: 279 },
	{ year: 1200, ppm: 280 },
	{ year: 1300, ppm: 279 },
	{ year: 1400, ppm: 278 }, // Little Ice Age begins
	{ year: 1500, ppm: 279 },
	{ year: 1600, ppm: 277 },
	{ year: 1650, ppm: 277 },
	{ year: 1700, ppm: 278 },
	{ year: 1750, ppm: 278 },
	{ year: 1775, ppm: 279 },
	{ year: 1800, ppm: 280 },
	{ year: 1825, ppm: 281 },
	{ year: 1850, ppm: 285 }, // Industrial Revolution accelerating
	{ year: 1875, ppm: 289 },
	{ year: 1900, ppm: 295 },
	{ year: 1910, ppm: 299 },
	{ year: 1920, ppm: 303 },
	{ year: 1930, ppm: 307 },
	{ year: 1940, ppm: 310 },
	{ year: 1950, ppm: 312 },
	{ year: 1955, ppm: 314 },
	// Modern NOAA Data (Mauna Loa)
	{ year: 1959, ppm: 315.98 },
	{ year: 1960, ppm: 316.91 },
	{ year: 1961, ppm: 317.64 },
	{ year: 1962, ppm: 318.45 },
	{ year: 1963, ppm: 318.99 },
	{ year: 1964, ppm: 319.62 },
	{ year: 1965, ppm: 320.04 },
	{ year: 1966, ppm: 321.37 },
	{ year: 1967, ppm: 322.18 },
	{ year: 1968, ppm: 323.05 },
	{ year: 1969, ppm: 324.62 },
	{ year: 1970, ppm: 325.68 },
	{ year: 1971, ppm: 326.32 },
	{ year: 1972, ppm: 327.46 },
	{ year: 1973, ppm: 329.68 },
	{ year: 1974, ppm: 330.19 },
	{ year: 1975, ppm: 331.13 },
	{ year: 1976, ppm: 332.03 },
	{ year: 1977, ppm: 333.84 },
	{ year: 1978, ppm: 335.41 },
	{ year: 1979, ppm: 336.84 },
	{ year: 1980, ppm: 338.76 },
	{ year: 1981, ppm: 340.12 },
	{ year: 1982, ppm: 341.48 },
	{ year: 1983, ppm: 343.15 },
	{ year: 1984, ppm: 344.87 },
	{ year: 1985, ppm: 346.35 },
	{ year: 1986, ppm: 347.61 },
	{ year: 1987, ppm: 349.31 },
	{ year: 1988, ppm: 351.69 },
	{ year: 1989, ppm: 353.2 },
	{ year: 1990, ppm: 354.45 },
	{ year: 1991, ppm: 355.7 },
	{ year: 1992, ppm: 356.54 },
	{ year: 1993, ppm: 357.21 },
	{ year: 1994, ppm: 358.96 },
	{ year: 1995, ppm: 360.97 },
	{ year: 1996, ppm: 362.74 },
	{ year: 1997, ppm: 363.88 },
	{ year: 1998, ppm: 366.84 },
	{ year: 1999, ppm: 368.54 },
	{ year: 2000, ppm: 369.71 },
	{ year: 2001, ppm: 371.32 },
	{ year: 2002, ppm: 373.45 },
	{ year: 2003, ppm: 375.98 },
	{ year: 2004, ppm: 377.7 },
	{ year: 2005, ppm: 379.98 },
	{ year: 2006, ppm: 382.09 },
	{ year: 2007, ppm: 384.02 },
	{ year: 2008, ppm: 385.83 },
	{ year: 2009, ppm: 387.64 },
	{ year: 2010, ppm: 390.1 },
	{ year: 2011, ppm: 391.85 },
	{ year: 2012, ppm: 394.06 },
	{ year: 2013, ppm: 396.74 },
	{ year: 2014, ppm: 398.81 },
	{ year: 2015, ppm: 401.01 },
	{ year: 2016, ppm: 404.41 },
	{ year: 2017, ppm: 406.76 },
	{ year: 2018, ppm: 408.72 },
	{ year: 2019, ppm: 411.65 },
	{ year: 2020, ppm: 414.21 },
	{ year: 2021, ppm: 416.41 },
	{ year: 2022, ppm: 418.53 },
	{ year: 2023, ppm: 421.08 },
	{ year: 2024, ppm: 424.61 }
]

// Removed unused function renderMultiLineText

export const generateKeelingCurve: WidgetGenerator<
	typeof KeelingCurvePropsSchema
> = async (props) => {
	const { width, height, xAxisLabel, yAxisLabel, annotations } = props

	// Helper to find PPM for a given year via linear interpolation
	const getPpmForYear = (year: number): number => {
		const p1 = CO2_DATA.filter((p) => p.year <= year).pop()
		const p2 = CO2_DATA.find((p) => p.year > year)
		const firstPoint = CO2_DATA[0]
		if (!firstPoint) return 240
		if (!p1) return firstPoint.ppm
		if (!p2) return p1.ppm
		const t = (year - p1.year) / (p2.year - p1.year)
		return p1.ppm + t * (p2.ppm - p1.ppm)
	}

	const canvas = new CanvasImpl({
		chartArea: { left: 0, top: 0, width, height },
		fontPxDefault: 12,
		lineHeightDefault: 1.2
	})

	const baseInfo = setupCoordinatePlaneBaseV2(
		{
			width,
			height,
			title: null, // No title for this widget
			xAxis: {
				xScaleType: "numeric",
				label: xAxisLabel,
				min: 1,
				max: 2021,
				tickInterval: 500, // Custom intervals for years
				showGridLines: false,
				showTickLabels: true,
				labelFormatter: (val: number) => {
					if (
						val === 1 ||
						val === 500 ||
						val === 1000 ||
						val === 1500 ||
						val === 2021
					) {
						return String(Math.round(val))
					}
					return ""
				}
			},
			yAxis: {
				label: yAxisLabel,
				min: 240,
				max: 420,
				tickInterval: 20,
				showGridLines: true,
				showTickLabels: true
			}
		},
		canvas
	)

	// Add arrow marker
	canvas.addDef(
		`<marker id="co2-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${theme.colors.black}"/></marker>`
	)

	// Data line content using Canvas API
	const points = CO2_DATA.map((p) => ({
		x: baseInfo.toSvgX(p.year),
		y: baseInfo.toSvgY(p.ppm)
	}))
	canvas.drawPolyline(points, {
		stroke: theme.colors.black,
		strokeWidth: theme.stroke.width.xthick
	})

	// Annotations (text outside clip, arrows outside clip)
	annotations.forEach((anno, index) => {
		const ppm = getPpmForYear(anno.year)
		const targetX = baseInfo.toSvgX(anno.year)
		const targetY = baseInfo.toSvgY(ppm)
		const textX = baseInfo.chartArea.left + 40
		const textY = baseInfo.chartArea.top + 40 + index * 60
		canvas.drawLine(textX, textY + 20, targetX, targetY, {
			stroke: theme.colors.black,
			strokeWidth: theme.stroke.width.base,
			markerEnd: "url(#co2-arrow)"
		})

		// Draw annotation text (multi-line)
		const fullText = anno.text.join("\n")
		canvas.drawText({
			x: textX,
			y: textY,
			text: fullText,
			anchor: "start",
			fontPx: 12,
			maxWidth: 150, // Reasonable width for annotation text
			lineHeight: 1.2
		})
	})

	// NEW: Finalize the canvas and construct the root SVG element
	const {
		svgBody,
		vbMinX,
		vbMinY,
		width: finalWidth,
		height: finalHeight
	} = canvas.finalize(AXIS_VIEWBOX_PADDING)

	return `<svg width="${finalWidth}" height="${finalHeight}" viewBox="${vbMinX} ${vbMinY} ${finalWidth} ${finalHeight}" xmlns="http://www.w3.org/2000/svg" font-family="${theme.font.family.sans}" font-size="${theme.font.size.medium}">${svgBody}</svg>`
}
