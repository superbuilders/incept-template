import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import type {
	Canvas,
	CanvasOptions,
	Extents2D,
	FinalizedSvg
} from "@/widgets/utils/layout"
import type { Path2D } from "@/widgets/utils/path-builder"
import { estimateWrappedTextDimensions } from "@/widgets/utils/text"

// A lightweight, internal-only canvas for collecting clipped content.
// It shares the main canvas's extents for proper bounding box calculation but writes to its own buffer.
class ClippedCanvas implements Canvas {
	private internalSvgBody = ""
	private mainCanvas: CanvasImpl

	constructor(mainCanvas: CanvasImpl) {
		this.mainCanvas = mainCanvas
	}

	// Delegate all drawing methods to the main canvas, but collect the output locally.
	// This ensures extents are updated on the main canvas instance.
	private drawAndCapture(drawFn: () => void): void {
		const originalBody = this.mainCanvas.getSvgBody()
		drawFn()
		const newContent = this.mainCanvas
			.getSvgBody()
			.substring(originalBody.length)
		this.internalSvgBody += newContent
	}

	// Implement all draw methods by delegating and capturing output
	drawText(opts: {
		x: number
		y: number
		text: string
		anchor?: "start" | "middle" | "end"
		dominantBaseline?: "hanging" | "middle" | "baseline"
		fontPx?: number
		fontWeight?:
			| "100"
			| "200"
			| "300"
			| "400"
			| "500"
			| "600"
			| "700"
			| "800"
			| "900"
		paintOrder?: "stroke fill"
		stroke?: string
		strokeWidth?: number | string
		fill?: string
		opacity?: number
		strokeOpacity?: number
		fillOpacity?: number
		transform?: string
		rotate?: { angle: number; cx: number; cy: number }
	}): void {
		this.drawAndCapture(() => this.mainCanvas.drawText(opts))
	}

	drawWrappedText(opts: {
		x: number
		y: number
		text: string
		className?: string
		maxWidthPx: number
		anchor?: "start" | "middle" | "end"
		fontPx?: number
		lineHeight?: number
		fontWeight?:
			| "100"
			| "200"
			| "300"
			| "400"
			| "500"
			| "600"
			| "700"
			| "800"
			| "900"
		paintOrder?: "stroke fill"
		stroke?: string
		strokeWidth?: number | string
		fill?: string
		opacity?: number
		strokeOpacity?: number
		fillOpacity?: number
		transform?: string
		rotate?: { angle: number; cx: number; cy: number }
		dominantBaseline?:
			| "auto"
			| "alphabetic"
			| "hanging"
			| "ideographic"
			| "mathematical"
			| "middle"
	}): void {
		this.drawAndCapture(() => this.mainCanvas.drawWrappedText(opts))
	}

	drawLine(...args: Parameters<Canvas["drawLine"]>): void {
		this.drawAndCapture(() => this.mainCanvas.drawLine(...args))
	}

	drawCircle(...args: Parameters<Canvas["drawCircle"]>): void {
		this.drawAndCapture(() => this.mainCanvas.drawCircle(...args))
	}

	drawRect(...args: Parameters<Canvas["drawRect"]>): void {
		this.drawAndCapture(() => this.mainCanvas.drawRect(...args))
	}

	drawEllipse(...args: Parameters<Canvas["drawEllipse"]>): void {
		this.drawAndCapture(() => this.mainCanvas.drawEllipse(...args))
	}

	drawPath(
		path: Parameters<Canvas["drawPath"]>[0],
		style: Parameters<Canvas["drawPath"]>[1]
	): void {
		this.drawAndCapture(() => this.mainCanvas.drawPath(path, style))
	}

	drawPolygon(...args: Parameters<Canvas["drawPolygon"]>): void {
		this.drawAndCapture(() => this.mainCanvas.drawPolygon(...args))
	}

	drawPolyline(...args: Parameters<Canvas["drawPolyline"]>): void {
		this.drawAndCapture(() => this.mainCanvas.drawPolyline(...args))
	}

	drawForeignObject(opts: Parameters<Canvas["drawForeignObject"]>[0]): void {
		this.drawAndCapture(() => this.mainCanvas.drawForeignObject(opts))
	}

	drawImage(opts: Parameters<Canvas["drawImage"]>[0]): void {
		this.drawAndCapture(() => this.mainCanvas.drawImage(opts))
	}

	drawLegendBlock(opts: Parameters<Canvas["drawLegendBlock"]>[0]): void {
		this.drawAndCapture(() => this.mainCanvas.drawLegendBlock(opts))
	}

	public getContent(): string {
		return this.internalSvgBody
	}

	// Prohibit calling methods that don't make sense on a sub-canvas
	public get clipId(): string {
		return this.mainCanvas.clipId
	}

	drawInClippedRegion(): void {
		logger.error("attempted to nest drawInClippedRegion calls")
		throw errors.new("cannot nest drawInClippedRegion calls")
	}

	addDef(): void {
		logger.error("attempted to add def to clipped canvas")
		throw errors.new("defs must be added to the main canvas")
	}

	addStyle(): void {
		logger.error("attempted to add style to clipped canvas")
		throw errors.new("styles must be added to the main canvas")
	}

	withTransform(): void {
		logger.error("attempted to apply transform to clipped canvas")
		throw errors.new("transforms must be applied on the main canvas")
	}

	addHatchPattern(): void {
		logger.error("attempted to add hatch pattern to clipped canvas")
		throw errors.new("patterns must be added to the main canvas")
	}

	addLinearGradient(): void {
		logger.error("attempted to add linear gradient to clipped canvas")
		throw errors.new("gradients must be added to the main canvas")
	}

	addRadialGradient(): void {
		logger.error("attempted to add radial gradient to clipped canvas")
		throw errors.new("gradients must be added to the main canvas")
	}

	finalize(): FinalizedSvg {
		logger.error("attempted to finalize clipped canvas")
		throw errors.new("cannot finalize a clipped canvas")
	}
}

// Deterministic yet unique clip ids within a single compilation run.
// A module-scoped counter is reset by callers (e.g., compiler) per run to keep outputs stable.
// Removed unused canvasIdCounter variable
export function resetCanvasIdCounter(): void {
	// no-op; retained for compatibility
}

export class CanvasImpl implements Canvas {
	public readonly clipId: string
	private extents: Extents2D
	private svgBody = ""
	private defs = ""
	private readonly options: CanvasOptions
	private nextLocalClipId = 0

	constructor(options: CanvasOptions) {
		// Validate parameters according to PRD constraints
		if (!Number.isFinite(options.fontPxDefault) || options.fontPxDefault <= 0) {
			logger.error("invalid fontPxDefault", {
				fontPxDefault: options.fontPxDefault
			})
			throw errors.new("fontPxDefault must be finite and > 0")
		}
		if (
			!Number.isFinite(options.lineHeightDefault) ||
			options.lineHeightDefault <= 0
		) {
			logger.error("invalid lineHeightDefault", {
				lineHeightDefault: options.lineHeightDefault
			})
			throw errors.new("lineHeightDefault must be finite and > 0")
		}

		this.options = options
		// Deterministic per-instance clip id (starts at 0 for each SVG document)
		this.clipId = `clip-${this.nextLocalClipId++}`

		// Initialize extents with the chart area bounds
		this.extents = {
			minX: options.chartArea.left,
			maxX: options.chartArea.left + options.chartArea.width,
			minY: options.chartArea.top,
			maxY: options.chartArea.top + options.chartArea.height
		}
	}

	// Expose a getter for ClippedCanvas to read the current body
	public getSvgBody(): string {
		return this.svgBody
	}

	// Implementation of the scoped clipping method.
	drawInClippedRegion(renderFn: (clippedCanvas: Canvas) => void): void {
		const originalBody = this.svgBody
		// Save extents so off-clip drawings do not expand the final viewBox
		const savedExtents = { ...this.extents }
		const clippedCanvas = new ClippedCanvas(this)

		// Execute the user's drawing function. All drawing calls inside will
		// delegate to the main canvas (for extent tracking) and the clippedCanvas
		// will capture the generated SVG string fragments.
		renderFn(clippedCanvas)

		// Reset the main svgBody to its state before the clipped drawing began.
		this.svgBody = originalBody
		// Restore extents to ignore any out-of-bounds geometry drawn inside the clip
		this.extents = savedExtents

		// Get the final concatenated string of all clipped elements.
		const clippedContent = clippedCanvas.getContent()

		// If any content was generated, wrap it in a clipped group.
		if (clippedContent) {
			this.svgBody += `<g clip-path="url(#${this.clipId})">${clippedContent}</g>`
		}
	}

	drawText(opts: {
		x: number
		y: number
		text: string
		anchor?: "start" | "middle" | "end"
		dominantBaseline?: "hanging" | "middle" | "baseline"
		fontPx?: number
		fontWeight?:
			| "100"
			| "200"
			| "300"
			| "400"
			| "500"
			| "600"
			| "700"
			| "800"
			| "900"
		paintOrder?: "stroke fill"
		stroke?: string
		strokeWidth?: number | string
		fill?: string
		opacity?: number
		strokeOpacity?: number
		fillOpacity?: number
		transform?: string
		rotate?: { angle: number; cx: number; cy: number }
		maxWidth?: number // NEW: Maximum width before wrapping
		lineHeight?: number // NEW: Line height multiplier (default 1.2)
	}): void {
		// Validate parameters
		if (
			opts.fontPx !== undefined &&
			(!Number.isFinite(opts.fontPx) || opts.fontPx <= 0)
		) {
			logger.error("invalid fontPx", { fontPx: opts.fontPx })
			throw errors.new("fontPx must be finite and > 0")
		}
		if (opts.strokeWidth !== undefined) {
			if (typeof opts.strokeWidth === "number") {
				if (!Number.isFinite(opts.strokeWidth) || opts.strokeWidth < 0) {
					logger.error("invalid strokeWidth", { strokeWidth: opts.strokeWidth })
					throw errors.new("strokeWidth must be finite and >= 0")
				}
			} else if (typeof opts.strokeWidth === "string") {
				// Allow CSS units like em; basic sanity check to disallow empty strings
				if (opts.strokeWidth.trim() === "") {
					logger.error("invalid strokeWidth string", {
						strokeWidth: opts.strokeWidth
					})
					throw errors.new("strokeWidth string must be non-empty")
				}
			}
		}
		if (opts.opacity !== undefined && (opts.opacity < 0 || opts.opacity > 1)) {
			logger.error("invalid opacity", { opacity: opts.opacity })
			throw errors.new("opacity must be within [0, 1]")
		}
		if (
			opts.strokeOpacity !== undefined &&
			(opts.strokeOpacity < 0 || opts.strokeOpacity > 1)
		) {
			logger.error("invalid strokeOpacity", {
				strokeOpacity: opts.strokeOpacity
			})
			throw errors.new("strokeOpacity must be within [0, 1]")
		}
		if (
			opts.fillOpacity !== undefined &&
			(opts.fillOpacity < 0 || opts.fillOpacity > 1)
		) {
			logger.error("invalid fillOpacity", { fillOpacity: opts.fillOpacity })
			throw errors.new("fillOpacity must be within [0, 1]")
		}
		if (
			opts.maxWidth !== undefined &&
			(!Number.isFinite(opts.maxWidth) || opts.maxWidth <= 0)
		) {
			logger.error("invalid maxWidth", { maxWidth: opts.maxWidth })
			throw errors.new("maxWidth must be finite and > 0")
		}
		if (
			opts.lineHeight !== undefined &&
			(!Number.isFinite(opts.lineHeight) || opts.lineHeight <= 0)
		) {
			logger.error("invalid lineHeight", { lineHeight: opts.lineHeight })
			throw errors.new("lineHeight must be finite and > 0")
		}
		if (
			opts.rotate &&
			(!Number.isFinite(opts.rotate.angle) ||
				!Number.isFinite(opts.rotate.cx) ||
				!Number.isFinite(opts.rotate.cy))
		) {
			logger.error("invalid rotate parameters", { rotate: opts.rotate })
			throw errors.new(
				"rotate.angle, rotate.cx, rotate.cy must be finite numbers"
			)
		}
		if (opts.paintOrder && opts.paintOrder !== "stroke fill") {
			logger.error("invalid paintOrder", { paintOrder: opts.paintOrder })
			throw errors.new(
				"paintOrder, when provided, must be exactly 'stroke fill'"
			)
		}

		const fontPx = opts.fontPx || this.options.fontPxDefault
		const anchor = opts.anchor || "start"
		const dominantBaseline = opts.dominantBaseline || "baseline"
		const lineHeight = opts.lineHeight || 1.2

		const { maxWidth: textWidth } = estimateWrappedTextDimensions(
			opts.text,
			Number.POSITIVE_INFINITY,
			fontPx,
			lineHeight
		) // Use shared estimation for single-line width
		const textHeight = fontPx

		// Check if we need to wrap text
		let lines: string[] = [opts.text]
		let actualTextHeight = textHeight

		if (opts.maxWidth && textWidth > opts.maxWidth) {
			lines = this.wrapText(opts.text, opts.maxWidth, fontPx)
			actualTextHeight = lines.length * textHeight * lineHeight
		}

		// Calculate max line width for bounding box
		const maxLineWidth = Math.max(
			...lines.map((line) => this.estimateTextWidth(line, fontPx))
		)

		// Calculate initial bounding box corners before rotation
		let minX = opts.x
		if (anchor === "middle") minX -= maxLineWidth / 2
		if (anchor === "end") minX -= maxLineWidth

		let minY = opts.y
		if (dominantBaseline === "middle") minY -= actualTextHeight / 2
		if (dominantBaseline === "hanging") minY = opts.y

		const corners = [
			{ x: minX, y: minY },
			{ x: minX + maxLineWidth, y: minY },
			{ x: minX + maxLineWidth, y: minY + actualTextHeight },
			{ x: minX, y: minY + actualTextHeight }
		]

		// If rotated, transform corners and find the new bounding box
		if (opts.rotate) {
			const { angle, cx, cy } = opts.rotate
			const rad = (angle * Math.PI) / 180
			const cos = Math.cos(rad)
			const sin = Math.sin(rad)

			const rotatedCorners = corners.map((p) => {
				const translatedX = p.x - cx
				const translatedY = p.y - cy
				return {
					x: translatedX * cos - translatedY * sin + cx,
					y: translatedX * sin + translatedY * cos + cy
				}
			})
			const finalMinX = Math.min(...rotatedCorners.map((p) => p.x))
			const finalMaxX = Math.max(...rotatedCorners.map((p) => p.x))
			const finalMinY = Math.min(...rotatedCorners.map((p) => p.y))
			const finalMaxY = Math.max(...rotatedCorners.map((p) => p.y))

			// Expand extents by stroke if present
			const strokeExpansion =
				typeof opts.strokeWidth === "number" ? opts.strokeWidth : 0
			this.updateExtents(
				finalMinX - strokeExpansion,
				finalMaxX + strokeExpansion,
				finalMinY - strokeExpansion,
				finalMaxY + strokeExpansion
			)
		} else {
			// Expand extents by stroke if present
			const strokeExpansion =
				typeof opts.strokeWidth === "number" ? opts.strokeWidth : 0
			this.updateExtents(
				minX - strokeExpansion,
				minX + maxLineWidth + strokeExpansion,
				minY - strokeExpansion,
				minY + actualTextHeight + strokeExpansion
			)
		}

		// Build SVG attributes
		let attrs = `x="${opts.x}" y="${opts.y}" font-size="${fontPx}"`
		if (anchor !== "start") attrs += ` text-anchor="${anchor}"`
		if (dominantBaseline !== "baseline")
			attrs += ` dominant-baseline="${dominantBaseline}"`
		if (opts.fontWeight) attrs += ` font-weight="${opts.fontWeight}"`
		if (opts.fill) attrs += ` fill="${opts.fill}"`
		if (opts.stroke) attrs += ` stroke="${opts.stroke}"`
		if (opts.strokeWidth !== undefined)
			attrs += ` stroke-width="${opts.strokeWidth}"`
		if (opts.paintOrder) attrs += ` paint-order="${opts.paintOrder}"`
		if (opts.opacity !== undefined) attrs += ` opacity="${opts.opacity}"`
		if (opts.strokeOpacity !== undefined)
			attrs += ` stroke-opacity="${opts.strokeOpacity}"`
		if (opts.fillOpacity !== undefined)
			attrs += ` fill-opacity="${opts.fillOpacity}"`

		let transformAttr = ""
		if (opts.rotate) {
			transformAttr += `rotate(${opts.rotate.angle}, ${opts.rotate.cx}, ${opts.rotate.cy})`
		}
		if (opts.transform) {
			transformAttr += transformAttr ? ` ${opts.transform}` : opts.transform
		}
		if (transformAttr) attrs += ` transform="${transformAttr}"`

		// Generate SVG text element
		let textContent = opts.text
		if (lines.length > 1) {
			// Multi-line text with tspans
			const tspans = lines
				.map((line, index) => {
					const dy = index === 0 ? "0" : `${lineHeight}em`
					const x = anchor === "start" ? undefined : opts.x.toString()
					let tspanAttrs = `dy="${dy}"`
					if (x !== undefined) {
						tspanAttrs += ` x="${x}"`
					}
					return `<tspan ${tspanAttrs}>${this.escapeHtml(line)}</tspan>`
				})
				.join("")
			textContent = tspans
		} else {
			// Single line text
			textContent = this.escapeHtml(opts.text)
		}

		this.svgBody += `<text ${attrs}>${textContent}</text>`
	}

	drawWrappedText(opts: {
		x: number
		y: number
		text: string
		className?: string
		maxWidthPx: number
		anchor?: "start" | "middle" | "end"
		fontPx?: number
		lineHeight?: number
		fontWeight?:
			| "100"
			| "200"
			| "300"
			| "400"
			| "500"
			| "600"
			| "700"
			| "800"
			| "900"
		paintOrder?: "stroke fill"
		stroke?: string
		strokeWidth?: number | string
		fill?: string
		opacity?: number
		strokeOpacity?: number
		fillOpacity?: number
		transform?: string
		rotate?: { angle: number; cx: number; cy: number }
		dominantBaseline?:
			| "auto"
			| "alphabetic"
			| "hanging"
			| "ideographic"
			| "mathematical"
			| "middle"
	}): void {
		// Validate parameters
		if (
			opts.fontPx !== undefined &&
			(!Number.isFinite(opts.fontPx) || opts.fontPx <= 0)
		) {
			logger.error("invalid fontPx", { fontPx: opts.fontPx })
			throw errors.new("fontPx must be finite and > 0")
		}
		if (
			opts.lineHeight !== undefined &&
			(!Number.isFinite(opts.lineHeight) || opts.lineHeight <= 0)
		) {
			logger.error("invalid lineHeight", { lineHeight: opts.lineHeight })
			throw errors.new("lineHeight must be finite and > 0")
		}
		if (opts.strokeWidth !== undefined) {
			if (typeof opts.strokeWidth === "number") {
				if (!Number.isFinite(opts.strokeWidth) || opts.strokeWidth < 0) {
					logger.error("invalid strokeWidth", { strokeWidth: opts.strokeWidth })
					throw errors.new("strokeWidth must be finite and >= 0")
				}
			} else if (typeof opts.strokeWidth === "string") {
				if (opts.strokeWidth.trim() === "") {
					logger.error("invalid strokeWidth string", {
						strokeWidth: opts.strokeWidth
					})
					throw errors.new("strokeWidth string must be non-empty")
				}
			}
		}

		const fontPx = opts.fontPx || this.options.fontPxDefault
		const lineHeight = opts.lineHeight || this.options.lineHeightDefault
		const anchor = opts.anchor || "start"

		const lines = this.wrapText(opts.text, opts.maxWidthPx, fontPx)

		// Create a single text element with tspans for each line
		// When dominant-baseline is "middle", vertically center the entire block
		// by offsetting the first line upward by half the block height in em units.
		const totalLines = lines.length
		const firstLineDyEm =
			opts.dominantBaseline === "middle" && totalLines > 1
				? -((totalLines - 1) * lineHeight) / 2
				: 0
		const tspans = lines
			.map((line, i) => {
				const dy = i === 0 ? `${firstLineDyEm}em` : `${lineHeight}em`
				return `<tspan x="${opts.x}" dy="${dy}">${this.escapeHtml(line)}</tspan>`
			})
			.join("")

		let attrs = `x="${opts.x}" y="${opts.y}" font-size="${fontPx}"`
		if (anchor !== "start") attrs += ` text-anchor="${anchor}"`
		if (opts.fontWeight) attrs += ` font-weight="${opts.fontWeight}"`
		if (opts.fill) attrs += ` fill="${opts.fill}"`
		if (opts.stroke) attrs += ` stroke="${opts.stroke}"`
		if (opts.strokeWidth) attrs += ` stroke-width="${opts.strokeWidth}"`
		if (opts.paintOrder) attrs += ` paint-order="${opts.paintOrder}"`
		if (opts.opacity !== undefined) attrs += ` opacity="${opts.opacity}"`
		if (opts.strokeOpacity !== undefined)
			attrs += ` stroke-opacity="${opts.strokeOpacity}"`
		if (opts.fillOpacity !== undefined)
			attrs += ` fill-opacity="${opts.fillOpacity}"`
		if (opts.dominantBaseline && opts.dominantBaseline !== "auto")
			attrs += ` dominant-baseline="${opts.dominantBaseline}"`

		let transformAttr = ""
		if (opts.rotate) {
			transformAttr += `rotate(${opts.rotate.angle}, ${opts.rotate.cx}, ${opts.rotate.cy})`
		}
		if (opts.transform) {
			transformAttr += transformAttr ? ` ${opts.transform}` : opts.transform
		}
		if (transformAttr) attrs += ` transform="${transformAttr}"`

		this.svgBody += `<text ${attrs}>${tspans}</text>`

		// Update extents based on the entire block
		const totalHeight = lines.length * fontPx * lineHeight
		const maxLineWidth = Math.max(
			...lines.map((line) => this.estimateTextWidth(line, fontPx))
		)

		let textMinX = opts.x
		if (anchor === "middle") textMinX -= maxLineWidth / 2
		else if (anchor === "end") textMinX -= maxLineWidth

		// Determine the block's top based on dominantBaseline semantics.
		// - hanging: y is the block's top
		// - middle: y is vertical center
		// - default (alphabetic/auto/...): y is baseline; approximate top with 0.15em ascent adjustment
		let textMinY: number
		if (opts.dominantBaseline === "hanging") {
			textMinY = opts.y
		} else if (opts.dominantBaseline === "middle") {
			textMinY = opts.y - totalHeight / 2
		} else {
			textMinY = opts.y - fontPx * 0.15
		}

		// Only expand extents for numeric strokeWidth (not em units)
		const strokeExpansion =
			typeof opts.strokeWidth === "number" ? opts.strokeWidth / 2 : 0

		const corners = [
			{ x: textMinX - strokeExpansion, y: textMinY - strokeExpansion },
			{
				x: textMinX + maxLineWidth + strokeExpansion,
				y: textMinY - strokeExpansion
			},
			{
				x: textMinX + maxLineWidth + strokeExpansion,
				y: textMinY + totalHeight + strokeExpansion
			},
			{
				x: textMinX - strokeExpansion,
				y: textMinY + totalHeight + strokeExpansion
			}
		]

		if (opts.rotate) {
			const { angle, cx, cy } = opts.rotate
			const rad = (angle * Math.PI) / 180
			const cos = Math.cos(rad)
			const sin = Math.sin(rad)

			const rotatedCorners = corners.map((p) => {
				const translatedX = p.x - cx
				const translatedY = p.y - cy
				return {
					x: translatedX * cos - translatedY * sin + cx,
					y: translatedX * sin + translatedY * cos + cy
				}
			})
			this.updateExtents(
				Math.min(...rotatedCorners.map((p) => p.x)),
				Math.max(...rotatedCorners.map((p) => p.x)),
				Math.min(...rotatedCorners.map((p) => p.y)),
				Math.max(...rotatedCorners.map((p) => p.y))
			)
		} else {
			this.updateExtents(
				textMinX - strokeExpansion,
				textMinX + maxLineWidth + strokeExpansion,
				textMinY - strokeExpansion,
				textMinY + totalHeight + strokeExpansion
			)
		}
	}

	drawLine(
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		style: {
			stroke: string
			strokeWidth: number
			dash?: string
			strokeLinecap?: "butt" | "round" | "square"
			strokeLinejoin?: "miter" | "round" | "bevel"
			strokeMiterlimit?: number
			markerStart?: string
			markerMid?: string
			markerEnd?: string
			opacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void {
		// Validate parameters
		if (!Number.isFinite(style.strokeWidth) || style.strokeWidth < 0) {
			logger.error("invalid strokeWidth", { strokeWidth: style.strokeWidth })
			throw errors.new("strokeWidth must be finite and >= 0")
		}
		if (
			style.opacity !== undefined &&
			(style.opacity < 0 || style.opacity > 1)
		) {
			logger.error("invalid opacity", { opacity: style.opacity })
			throw errors.new("opacity must be within [0, 1]")
		}
		if (
			style.strokeOpacity !== undefined &&
			(style.strokeOpacity < 0 || style.strokeOpacity > 1)
		) {
			logger.error("invalid strokeOpacity", {
				strokeOpacity: style.strokeOpacity
			})
			throw errors.new("strokeOpacity must be within [0, 1]")
		}

		// Calculate line bounds with stroke expansion
		const minX = Math.min(x1, x2)
		const maxX = Math.max(x1, x2)
		const minY = Math.min(y1, y2)
		const maxY = Math.max(y1, y2)

		if (style.strokeWidth > 0) {
			const expansion = style.strokeWidth / 2
			// Additional expansion for round caps
			let capExpansion = 0
			if (style.strokeLinecap === "round" || style.strokeLinecap === "square") {
				capExpansion = style.strokeWidth / 2
			}
			this.updateExtents(
				minX - expansion - capExpansion,
				maxX + expansion + capExpansion,
				minY - expansion - capExpansion,
				maxY + expansion + capExpansion
			)
		} else {
			this.updateExtents(minX, maxX, minY, maxY)
		}

		// Build SVG attributes
		let attrs = `x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${style.stroke}" stroke-width="${style.strokeWidth}"`
		if (style.dash) attrs += ` stroke-dasharray="${style.dash}"`
		if (style.strokeLinecap) attrs += ` stroke-linecap="${style.strokeLinecap}"`
		if (style.strokeLinejoin)
			attrs += ` stroke-linejoin="${style.strokeLinejoin}"`
		if (style.strokeMiterlimit)
			attrs += ` stroke-miterlimit="${style.strokeMiterlimit}"`
		if (style.markerStart) attrs += ` marker-start="${style.markerStart}"`
		if (style.markerMid) attrs += ` marker-mid="${style.markerMid}"`
		if (style.markerEnd) attrs += ` marker-end="${style.markerEnd}"`
		if (style.opacity !== undefined) attrs += ` opacity="${style.opacity}"`
		if (style.strokeOpacity !== undefined)
			attrs += ` stroke-opacity="${style.strokeOpacity}"`
		if (style.transform) attrs += ` transform="${style.transform}"`

		this.svgBody += `<line ${attrs}/>`
	}

	drawCircle(
		cx: number,
		cy: number,
		r: number,
		style: {
			fill?: string
			stroke?: string
			strokeWidth?: number
			dash?: string
			fillPatternId?: string
			opacity?: number
			fillOpacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void {
		// Validate parameters
		if (
			style.strokeWidth !== undefined &&
			(!Number.isFinite(style.strokeWidth) || style.strokeWidth < 0)
		) {
			logger.error("invalid strokeWidth", { strokeWidth: style.strokeWidth })
			throw errors.new("strokeWidth must be finite and >= 0")
		}

		// Calculate circle bounds with stroke expansion
		const strokeWidth = style.strokeWidth || 0
		const expansion = strokeWidth / 2
		this.updateExtents(
			cx - r - expansion,
			cx + r + expansion,
			cy - r - expansion,
			cy + r + expansion
		)

		// Build SVG attributes
		let attrs = `cx="${cx}" cy="${cy}" r="${r}"`
		if (style.fill) attrs += ` fill="${style.fill}"`
		if (style.fillPatternId) attrs += ` fill="url(#${style.fillPatternId})"`
		if (style.stroke) attrs += ` stroke="${style.stroke}"`
		if (style.strokeWidth) attrs += ` stroke-width="${style.strokeWidth}"`
		if (style.dash) attrs += ` stroke-dasharray="${style.dash}"`
		if (style.opacity !== undefined) attrs += ` opacity="${style.opacity}"`
		if (style.fillOpacity !== undefined)
			attrs += ` fill-opacity="${style.fillOpacity}"`
		if (style.strokeOpacity !== undefined)
			attrs += ` stroke-opacity="${style.strokeOpacity}"`
		if (style.transform) attrs += ` transform="${style.transform}"`

		this.svgBody += `<circle ${attrs}/>`
	}

	drawRect(
		x: number,
		y: number,
		w: number,
		h: number,
		style: {
			fill?: string
			stroke?: string
			strokeWidth?: number
			dash?: string
			fillPatternId?: string
			opacity?: number
			fillOpacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void {
		// Validate parameters
		if (
			style.strokeWidth !== undefined &&
			(!Number.isFinite(style.strokeWidth) || style.strokeWidth < 0)
		) {
			logger.error("invalid strokeWidth", { strokeWidth: style.strokeWidth })
			throw errors.new("strokeWidth must be finite and >= 0")
		}

		// Calculate rect bounds with stroke expansion
		const strokeWidth = style.strokeWidth || 0
		const expansion = strokeWidth / 2
		this.updateExtents(
			x - expansion,
			x + w + expansion,
			y - expansion,
			y + h + expansion
		)

		// Build SVG attributes
		let attrs = `x="${x}" y="${y}" width="${w}" height="${h}"`
		if (style.fill) attrs += ` fill="${style.fill}"`
		if (style.fillPatternId) attrs += ` fill="url(#${style.fillPatternId})"`
		if (style.stroke) attrs += ` stroke="${style.stroke}"`
		if (style.strokeWidth) attrs += ` stroke-width="${style.strokeWidth}"`
		if (style.dash) attrs += ` stroke-dasharray="${style.dash}"`
		if (style.opacity !== undefined) attrs += ` opacity="${style.opacity}"`
		if (style.fillOpacity !== undefined)
			attrs += ` fill-opacity="${style.fillOpacity}"`
		if (style.strokeOpacity !== undefined)
			attrs += ` stroke-opacity="${style.strokeOpacity}"`
		if (style.transform) attrs += ` transform="${style.transform}"`

		this.svgBody += `<rect ${attrs}/>`
	}

	drawEllipse(
		cx: number,
		cy: number,
		rx: number,
		ry: number,
		style: {
			fill?: string
			stroke?: string
			strokeWidth?: number
			dash?: string
			fillPatternId?: string
			opacity?: number
			fillOpacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void {
		// Validate parameters
		if (
			style.strokeWidth !== undefined &&
			(!Number.isFinite(style.strokeWidth) || style.strokeWidth < 0)
		) {
			logger.error("invalid strokeWidth", { strokeWidth: style.strokeWidth })
			throw errors.new("strokeWidth must be finite and >= 0")
		}

		// Calculate ellipse bounds with stroke expansion
		const strokeWidth = style.strokeWidth || 0
		const expansion = strokeWidth / 2
		this.updateExtents(
			cx - rx - expansion,
			cx + rx + expansion,
			cy - ry - expansion,
			cy + ry + expansion
		)

		// Build SVG attributes
		let attrs = `cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"`
		if (style.fill) attrs += ` fill="${style.fill}"`
		if (style.fillPatternId) attrs += ` fill="url(#${style.fillPatternId})"`
		if (style.stroke) attrs += ` stroke="${style.stroke}"`
		if (style.strokeWidth) attrs += ` stroke-width="${style.strokeWidth}"`
		if (style.dash) attrs += ` stroke-dasharray="${style.dash}"`
		if (style.opacity !== undefined) attrs += ` opacity="${style.opacity}"`
		if (style.fillOpacity !== undefined)
			attrs += ` fill-opacity="${style.fillOpacity}"`
		if (style.strokeOpacity !== undefined)
			attrs += ` stroke-opacity="${style.strokeOpacity}"`
		if (style.transform) attrs += ` transform="${style.transform}"`

		this.svgBody += `<ellipse ${attrs}/>`
	}

	drawPath(
		path: Path2D,
		style: {
			fill?: string
			stroke?: string
			strokeWidth?: number
			dash?: string
			strokeLinecap?: "butt" | "round" | "square"
			strokeLinejoin?: "miter" | "round" | "bevel"
			strokeMiterlimit?: number
			fillRule?: "nonzero" | "evenodd"
			markerStart?: string
			markerMid?: string
			markerEnd?: string
			opacity?: number
			fillOpacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void {
		const pathExtents = path.getExtents()

		if (pathExtents) {
			const strokeWidth = style.strokeWidth || 0
			const expansion = strokeWidth / 2
			this.updateExtents(
				pathExtents.minX - expansion,
				pathExtents.maxX + expansion,
				pathExtents.minY - expansion,
				pathExtents.maxY + expansion
			)
		}

		let attrs = `d="${path.getPathData()}"`
		if (style.fill) attrs += ` fill="${style.fill}"`
		else attrs += ` fill="none"`
		if (style.stroke) attrs += ` stroke="${style.stroke}"`
		if (style.strokeWidth) attrs += ` stroke-width="${style.strokeWidth}"`
		if (style.dash) attrs += ` stroke-dasharray="${style.dash}"`
		if (style.strokeLinecap) attrs += ` stroke-linecap="${style.strokeLinecap}"`
		if (style.strokeLinejoin)
			attrs += ` stroke-linejoin="${style.strokeLinejoin}"`
		if (style.strokeMiterlimit)
			attrs += ` stroke-miterlimit="${style.strokeMiterlimit}"`
		if (style.fillRule) attrs += ` fill-rule="${style.fillRule}"`
		if (style.markerStart) attrs += ` marker-start="${style.markerStart}"`
		if (style.markerMid) attrs += ` marker-mid="${style.markerMid}"`
		if (style.markerEnd) attrs += ` marker-end="${style.markerEnd}"`
		if (style.opacity !== undefined) attrs += ` opacity="${style.opacity}"`
		if (style.fillOpacity !== undefined)
			attrs += ` fill-opacity="${style.fillOpacity}"`
		if (style.strokeOpacity !== undefined)
			attrs += ` stroke-opacity="${style.strokeOpacity}"`
		if (style.transform) attrs += ` transform="${style.transform}"`

		this.svgBody += `<path ${attrs}/>`
	}

	drawPolygon(
		points: Array<{ x: number; y: number }>,
		style: {
			fill?: string
			stroke?: string
			strokeWidth?: number
			dash?: string
			fillRule?: "nonzero" | "evenodd"
			strokeLinejoin?: "miter" | "round" | "bevel"
			strokeMiterlimit?: number
			opacity?: number
			fillOpacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void {
		if (points.length === 0) return

		// Calculate polygon bounds with stroke expansion
		const minX = Math.min(...points.map((p) => p.x))
		const maxX = Math.max(...points.map((p) => p.x))
		const minY = Math.min(...points.map((p) => p.y))
		const maxY = Math.max(...points.map((p) => p.y))

		const strokeWidth = style.strokeWidth || 0
		const expansion = strokeWidth / 2
		this.updateExtents(
			minX - expansion,
			maxX + expansion,
			minY - expansion,
			maxY + expansion
		)

		// Build points string
		const pointsStr = points.map((p) => `${p.x},${p.y}`).join(" ")

		// Build SVG attributes
		let attrs = `points="${pointsStr}"`
		if (style.fill) attrs += ` fill="${style.fill}"`
		else attrs += ` fill="none"`
		if (style.stroke) attrs += ` stroke="${style.stroke}"`
		if (style.strokeWidth) attrs += ` stroke-width="${style.strokeWidth}"`
		if (style.dash) attrs += ` stroke-dasharray="${style.dash}"`
		if (style.fillRule) attrs += ` fill-rule="${style.fillRule}"`
		if (style.strokeLinejoin)
			attrs += ` stroke-linejoin="${style.strokeLinejoin}"`
		if (style.strokeMiterlimit)
			attrs += ` stroke-miterlimit="${style.strokeMiterlimit}"`
		if (style.opacity !== undefined) attrs += ` opacity="${style.opacity}"`
		if (style.fillOpacity !== undefined)
			attrs += ` fill-opacity="${style.fillOpacity}"`
		if (style.strokeOpacity !== undefined)
			attrs += ` stroke-opacity="${style.strokeOpacity}"`
		if (style.transform) attrs += ` transform="${style.transform}"`

		this.svgBody += `<polygon ${attrs}/>`
	}

	drawPolyline(
		points: Array<{ x: number; y: number }>,
		style: {
			stroke: string
			strokeWidth: number
			dash?: string
			strokeLinecap?: "butt" | "round" | "square"
			strokeLinejoin?: "miter" | "round" | "bevel"
			strokeMiterlimit?: number
			opacity?: number
			strokeOpacity?: number
			transform?: string
		}
	): void {
		if (points.length === 0) return

		// Calculate polyline bounds with stroke expansion
		const minX = Math.min(...points.map((p) => p.x))
		const maxX = Math.max(...points.map((p) => p.x))
		const minY = Math.min(...points.map((p) => p.y))
		const maxY = Math.max(...points.map((p) => p.y))

		const expansion = style.strokeWidth / 2
		// Additional expansion for round caps
		let capExpansion = 0
		if (style.strokeLinecap === "round" || style.strokeLinecap === "square") {
			capExpansion = style.strokeWidth / 2
		}
		this.updateExtents(
			minX - expansion - capExpansion,
			maxX + expansion + capExpansion,
			minY - expansion - capExpansion,
			maxY + expansion + capExpansion
		)

		// Build points string
		const pointsStr = points.map((p) => `${p.x},${p.y}`).join(" ")

		// Build SVG attributes
		let attrs = `points="${pointsStr}" stroke="${style.stroke}" stroke-width="${style.strokeWidth}"`
		if (style.dash) attrs += ` stroke-dasharray="${style.dash}"`
		if (style.strokeLinecap) attrs += ` stroke-linecap="${style.strokeLinecap}"`
		if (style.strokeLinejoin)
			attrs += ` stroke-linejoin="${style.strokeLinejoin}"`
		if (style.strokeMiterlimit)
			attrs += ` stroke-miterlimit="${style.strokeMiterlimit}"`
		if (style.opacity !== undefined) attrs += ` opacity="${style.opacity}"`
		if (style.strokeOpacity !== undefined)
			attrs += ` stroke-opacity="${style.strokeOpacity}"`
		if (style.transform) attrs += ` transform="${style.transform}"`

		this.svgBody += `<polyline ${attrs} fill="none"/>`
	}

	drawForeignObject(opts: {
		x: number
		y: number
		width: number
		height: number
		content: string
		transform?: string
	}): void {
		// Validate content has proper XHTML wrapper
		if (!opts.content.includes('xmlns="http://www.w3.org/1999/xhtml"')) {
			logger.error("invalid XHTML content", {
				content: opts.content.substring(0, 100)
			})
			throw errors.new(
				'drawForeignObject.content must be wrapped in a single root XHTML element with xmlns="http://www.w3.org/1999/xhtml"'
			)
		}

		// Update extents for the foreign object bounds
		this.updateExtents(
			opts.x,
			opts.x + opts.width,
			opts.y,
			opts.y + opts.height
		)

		const transformAttr = opts.transform ? ` transform="${opts.transform}"` : ""
		this.svgBody += `<foreignObject x="${opts.x}" y="${opts.y}" width="${opts.width}" height="${opts.height}"${transformAttr}>${opts.content}</foreignObject>`
	}

	drawImage(opts: {
		x: number
		y: number
		width: number
		height: number
		href: string
		preserveAspectRatio?: string
		opacity?: number
		transform?: string
	}): void {
		// Update extents for the image bounds
		this.updateExtents(
			opts.x,
			opts.x + opts.width,
			opts.y,
			opts.y + opts.height
		)

		// Build SVG attributes
		let attrs = `x="${opts.x}" y="${opts.y}" width="${opts.width}" height="${opts.height}" href="${opts.href}"`
		if (opts.preserveAspectRatio)
			attrs += ` preserveAspectRatio="${opts.preserveAspectRatio}"`
		if (opts.opacity !== undefined) attrs += ` opacity="${opts.opacity}"`
		if (opts.transform) attrs += ` transform="${opts.transform}"`

		this.svgBody += `<image ${attrs}/>`
	}

	drawLegendBlock(opts: {
		startX: number
		startY: number
		rows: Array<{
			sample: {
				stroke: string
				strokeWidth: number
				dash?: string
				marker?: "circle" | "square"
			}
			label: string
		}>
		rowGapPx: number
		labelFontPx?: number
		sampleLengthPx?: number
	}): void {
		const labelFontPx = opts.labelFontPx || this.options.fontPxDefault
		const sampleLengthPx = opts.sampleLengthPx || 20

		let currentY = opts.startY
		let maxWidth = 0

		for (const row of opts.rows) {
			// Draw sample line/marker
			const sampleEndX = opts.startX + sampleLengthPx
			const sampleY = currentY + labelFontPx / 2

			this.drawLine(opts.startX, sampleY, sampleEndX, sampleY, {
				stroke: row.sample.stroke,
				strokeWidth: row.sample.strokeWidth,
				dash: row.sample.dash
			})

			// Draw marker if specified
			if (row.sample.marker === "circle") {
				this.drawCircle(sampleEndX, sampleY, 3, {
					fill: row.sample.stroke,
					stroke: row.sample.stroke,
					strokeWidth: 1
				})
			} else if (row.sample.marker === "square") {
				this.drawRect(sampleEndX - 3, sampleY - 3, 6, 6, {
					fill: row.sample.stroke,
					stroke: row.sample.stroke,
					strokeWidth: 1
				})
			}

			// Draw label
			const labelX = sampleEndX + 8
			this.drawText({
				x: labelX,
				y: currentY + labelFontPx,
				text: row.label,
				fontPx: labelFontPx
			})

			const rowWidth =
				sampleLengthPx + 8 + this.estimateTextWidth(row.label, labelFontPx)
			maxWidth = Math.max(maxWidth, rowWidth)

			currentY += labelFontPx + opts.rowGapPx
		}

		// Update extents for the entire legend block
		this.updateExtents(
			opts.startX,
			opts.startX + maxWidth,
			opts.startY,
			currentY - opts.rowGapPx
		)
	}

	addDef(def: string): void {
		this.defs += def
	}

	addStyle(cssRules: string): void {
		this.defs += `<style>${cssRules}</style>`
	}

	withTransform(transform: string, renderFn: () => void): void {
		this.svgBody += `<g transform="${transform}">`
		renderFn()
		this.svgBody += "</g>"
	}

	addHatchPattern(opts: {
		id: string
		color: string
		strokeWidth: number
		spacing?: number
		angleDeg?: number
	}): void {
		const spacing = opts.spacing || 4
		const angleDeg = opts.angleDeg || 45

		this.defs += `<pattern id="${opts.id}" patternUnits="userSpaceOnUse" width="${spacing}" height="${spacing}" patternTransform="rotate(${angleDeg})">
			<line x1="0" y1="0" x2="0" y2="${spacing}" stroke="${opts.color}" stroke-width="${opts.strokeWidth}"/>
		</pattern>`
	}

	addLinearGradient(opts: {
		id: string
		stops: Array<{ offset: string; color: string }>
		x1?: string
		y1?: string
		x2?: string
		y2?: string
		gradientUnits?: "objectBoundingBox" | "userSpaceOnUse"
	}): void {
		let attrs = `id="${opts.id}"`
		if (opts.x1) attrs += ` x1="${opts.x1}"`
		if (opts.y1) attrs += ` y1="${opts.y1}"`
		if (opts.x2) attrs += ` x2="${opts.x2}"`
		if (opts.y2) attrs += ` y2="${opts.y2}"`
		if (opts.gradientUnits) attrs += ` gradientUnits="${opts.gradientUnits}"`

		const stops = opts.stops
			.map(
				(stop) => `<stop offset="${stop.offset}" stop-color="${stop.color}"/>`
			)
			.join("")
		this.defs += `<linearGradient ${attrs}>${stops}</linearGradient>`
	}

	addRadialGradient(opts: {
		id: string
		stops: Array<{ offset: string; color: string }>
		cx?: string
		cy?: string
		r?: string
		fx?: string
		fy?: string
		gradientUnits?: "objectBoundingBox" | "userSpaceOnUse"
	}): void {
		let attrs = `id="${opts.id}"`
		if (opts.cx) attrs += ` cx="${opts.cx}"`
		if (opts.cy) attrs += ` cy="${opts.cy}"`
		if (opts.r) attrs += ` r="${opts.r}"`
		if (opts.fx) attrs += ` fx="${opts.fx}"`
		if (opts.fy) attrs += ` fy="${opts.fy}"`
		if (opts.gradientUnits) attrs += ` gradientUnits="${opts.gradientUnits}"`

		const stops = opts.stops
			.map(
				(stop) => `<stop offset="${stop.offset}" stop-color="${stop.color}"/>`
			)
			.join("")
		this.defs += `<radialGradient ${attrs}>${stops}</radialGradient>`
	}

	finalize(padPx: number): FinalizedSvg {
		const vbMinX = Math.floor(this.extents.minX - padPx)
		const vbMinY = Math.floor(this.extents.minY - padPx)
		const width = Math.ceil(this.extents.maxX - this.extents.minX + 2 * padPx)
		const height = Math.ceil(this.extents.maxY - this.extents.minY + 2 * padPx)

		let svgBody = ""
		if (this.defs) {
			svgBody += `<defs>${this.defs}</defs>`
		}
		svgBody += this.svgBody

		return { svgBody, vbMinX, vbMinY, width, height }
	}

	private wrapText(text: string, maxWidth: number, fontPx: number): string[] {
		// First check for explicit line breaks
		if (text.includes("\n")) {
			return text.split("\n")
		}

		// Simple word-based wrapping
		const words = text.split(" ")
		const lines: string[] = []
		let currentLine = ""

		for (const word of words) {
			const testLine = currentLine ? `${currentLine} ${word}` : word
			const testWidth = this.estimateTextWidth(testLine, fontPx)

			if (testWidth > maxWidth && currentLine) {
				// Word doesn't fit, start new line
				lines.push(currentLine)
				currentLine = word
			} else {
				// Word fits, add it to current line
				currentLine = testLine
			}
		}

		// Add the last line
		if (currentLine) {
			lines.push(currentLine)
		}

		return lines.length > 0 ? lines : [text]
	}

	private escapeHtml(text: string): string {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;")
	}

	private estimateTextWidth(text: string, fontPx: number): number {
		// Simple heuristic: average character width is about 0.6 * font size
		// This is server-safe and deterministic
		return text.length * fontPx * 0.6
	}

	private updateExtents(
		minX: number,
		maxX: number,
		minY: number,
		maxY: number
	): void {
		this.extents.minX = Math.min(this.extents.minX, minX)
		this.extents.maxX = Math.max(this.extents.maxX, maxX)
		this.extents.minY = Math.min(this.extents.minY, minY)
		this.extents.maxY = Math.max(this.extents.maxY, maxY)
	}
}
