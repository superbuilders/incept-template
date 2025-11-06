import {
	CHART_TITLE_FONT_PX,
	CHART_TITLE_TOP_PADDING_PX
} from "@/widgets/utils/constants"
import type { Canvas } from "@/widgets/utils/layout"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"
import { theme } from "@/widgets/utils/theme"

export type ChartFrame = {
	left: number
	top: number
	width: number
	height: number
}

export function drawChartTitle(
	canvas: Canvas,
	frame: ChartFrame,
	title: string,
	options: {
		fontPx?: number
		topPaddingPx?: number
		maxWidthPolicy?: "frame" | "full"
		fill?: string
	}
): { usedTopHeightPx: number } {
	const fontPx = options.fontPx ?? CHART_TITLE_FONT_PX
	const topPaddingPx = options.topPaddingPx ?? CHART_TITLE_TOP_PADDING_PX
	// const maxWidthPolicy = options.maxWidthPolicy ?? "frame" // Unused variable
	const fill = options.fill ?? theme.colors.title

	// Horizontal centering uses the provided frame. Y is absolute (floating above chart area)
	const titleX = frame.left + frame.width / 2
	const titleY = topPaddingPx
	const maxWidthPx = frame.width // Note: 'full' policy is deprecated; always use frame width.

	canvas.drawWrappedText({
		x: titleX,
		y: titleY,
		text: title,
		maxWidthPx,
		fontPx,
		anchor: "middle",
		fill
	})

	const { height } = estimateWrappedTextDimensions(title, maxWidthPx, fontPx)
	return { usedTopHeightPx: topPaddingPx + height }
}
