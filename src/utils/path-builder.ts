import type { Extents2D } from "@/utils/layout"

/**
 * A typesafe, chainable builder for SVG paths that tracks its own bounding box.
 */
export class Path2D {
	private d = ""
	private extents: Extents2D | null = null
	private currentX = 0
	private currentY = 0

	private updateExtents(x: number, y: number): void {
		if (!this.extents) {
			this.extents = { minX: x, maxX: x, minY: y, maxY: y }
		} else {
			this.extents.minX = Math.min(this.extents.minX, x)
			this.extents.maxX = Math.max(this.extents.maxX, x)
			this.extents.minY = Math.min(this.extents.minY, y)
			this.extents.maxY = Math.max(this.extents.maxY, y)
		}
		this.currentX = x
		this.currentY = y
	}

	moveTo(x: number, y: number): this {
		this.d += `M ${x} ${y} `
		this.updateExtents(x, y)
		return this
	}

	lineTo(x: number, y: number): this {
		this.d += `L ${x} ${y} `
		this.updateExtents(x, y)
		return this
	}

	quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this {
		this.d += `Q ${cpx} ${cpy} ${x} ${y} `
		// For bounding box, we need to consider the control point and endpoints
		this.updateExtents(cpx, cpy)
		this.updateExtents(x, y)
		return this
	}

	bezierCurveTo(
		cp1x: number,
		cp1y: number,
		cp2x: number,
		cp2y: number,
		x: number,
		y: number
	): this {
		this.d += `C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${y} `
		// For bounding box, we need to consider both control points and endpoint
		this.updateExtents(cp1x, cp1y)
		this.updateExtents(cp2x, cp2y)
		this.updateExtents(x, y)
		return this
	}

	// For arc commands, we must track the bounding box of the curve itself.
	// For simplicity in this implementation, we will track the start and end points
	// of the arc segment as a reasonable approximation. A more advanced implementation
	// would calculate the true bounding box of the elliptical arc.
	arcTo(
		rx: number,
		ry: number,
		xAxisRotation: number,
		largeArcFlag: 0 | 1,
		sweepFlag: 0 | 1,
		endX: number,
		endY: number
	): this {
		const startX = this.currentX
		const startY = this.currentY

		// Update extents with start and end points of the arc
		this.updateExtents(startX, startY)
		this.updateExtents(endX, endY)

		// A more robust solution would calculate the arc's extrema, but for now this is a safe minimum.

		this.d += `A ${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${endX} ${endY} `
		this.currentX = endX
		this.currentY = endY
		return this
	}

	closePath(): this {
		this.d += "Z "
		return this
	}

	getPathData(): string {
		return this.d.trim()
	}
	getExtents(): Extents2D | null {
		return this.extents
	}
}
