// A strict CSS color regex limited to hex forms only.
// Supports:
// - Hex colors: #RGB, #RRGGBB, #RRGGBBAA
// Named colors and functional notations (rgb/hsl) are intentionally excluded.

// Hex: #RGB | #RRGGBB | #RRGGBBAA
const HEX = "#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})"

const PATTERN = `^${HEX}$`

export const CSS_COLOR_PATTERN = new RegExp(PATTERN, "i")
