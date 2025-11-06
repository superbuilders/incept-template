/**
 * Standard padding in pixels to be applied around the content of non-axis-based
 * SVG diagrams. This ensures consistent whitespace and prevents content from
 * touching the edges of the SVG container.
 */
export const PADDING = 20

// Default padding for the dynamic viewBox calculation for coordinate plane widgets.
export const AXIS_VIEWBOX_PADDING = 8

// AXIS HARDWARE CONSTANTS
export const TICK_LENGTH_PX = 5
export const AXIS_STROKE_WIDTH_PX = 1.5
export const GRID_STROKE_WIDTH_PX = 1

// LAYOUT AND PADDING CONSTANTS
export const CHART_TITLE_TOP_PADDING_PX = 20
export const CHART_TITLE_BOTTOM_PADDING_PX = 15
export const TICK_LABEL_PADDING_PX = 8
export const AXIS_TITLE_PADDING_PX = 25
export const X_AXIS_TITLE_PADDING_PX = 22
export const ESTIMATED_BOTTOM_MARGIN_PX = 60

// FONT AND TEXT CONSTANTS
export const CHART_TITLE_FONT_PX = 18
export const AXIS_TITLE_FONT_PX = 16
export const TICK_LABEL_FONT_PX = 12
export const LABEL_AVG_CHAR_WIDTH_PX = 7

// New constants for numeric axis label thinning
export const X_AXIS_MIN_LABEL_PADDING_PX = 10
export const Y_AXIS_MIN_LABEL_GAP_PX = 4

// SVG diagram dimension constraints
export const SVG_DIAGRAM_WIDTH_MIN = 50
export const SVG_DIAGRAM_WIDTH_MAX = 500
export const SVG_DIAGRAM_HEIGHT_MIN = 50
export const SVG_DIAGRAM_HEIGHT_MAX = 500
