import { z } from "zod"
import {
	SVG_DIAGRAM_HEIGHT_MAX,
	SVG_DIAGRAM_HEIGHT_MIN,
	SVG_DIAGRAM_WIDTH_MAX,
	SVG_DIAGRAM_WIDTH_MIN
} from "@/utils/constants"

/**
 * Creates a width schema for SVG diagrams with standard constraints.
 * Returns a fresh schema instance on each call to avoid $ref issues in OpenAI JSON Schema.
 */
export const createWidthSchema = () =>
	z
		.number()
		.min(SVG_DIAGRAM_WIDTH_MIN)
		.max(SVG_DIAGRAM_WIDTH_MAX)
		.describe(
			`The total width of the SVG diagram in pixels. Must be between ${SVG_DIAGRAM_WIDTH_MIN} and ${SVG_DIAGRAM_WIDTH_MAX} pixels to ensure proper visibility and fit within standard layouts.`
		)

/**
 * Creates a height schema for SVG diagrams with standard constraints.
 * Returns a fresh schema instance on each call to avoid $ref issues in OpenAI JSON Schema.
 */
export const createHeightSchema = () =>
	z
		.number()
		.min(SVG_DIAGRAM_HEIGHT_MIN)
		.max(SVG_DIAGRAM_HEIGHT_MAX)
		.describe(
			`The total height of the SVG diagram in pixels. Must be between ${SVG_DIAGRAM_HEIGHT_MIN} and ${SVG_DIAGRAM_HEIGHT_MAX} pixels to ensure proper visibility and fit within standard layouts.`
		)
