// lib/widgets/utils/theme.ts
export const theme = {
	// FONT TOKENS
	font: {
		family: {
			sans: "sans-serif",
			serif: "serif",
			mono: "'Courier New', monospace"
		},
		size: {
			small: 11,
			base: 12,
			medium: 14,
			large: 16,
			xlarge: 18
		},
		weight: {
			thin: "100",
			extraLight: "200",
			light: "300",
			normal: "400",
			medium: "500",
			semiBold: "600",
			bold: "700",
			extraBold: "800",
			heavy: "900"
		}
	},

	// COLOR TOKENS
	colors: {
		// Roles
		text: "#333333",
		textSecondary: "#555555",
		axis: "#333333",
		axisLabel: "#333333",
		title: "#333333",
		annotation: "#333333",
		border: "#e0e0e0",
		background: "#fafafa",
		gridMajor: "#e0e0e0",
		gridMinor: "#cccccc",
		hiddenEdge: "#aaaaaa",
		// Palettes
		actionPrimary: "#007acc",
		actionSecondary: "#ff6b35",
		highlightPrimary: "#4472c4",
		highlightSecondary: "#ff6b6b",
		// Base Colors
		white: "#ffffff",
		black: "#000000"
	},

	// OPACITY TOKENS
	opacity: {
		overlayLow: 0.4,
		overlay: 0.6,
		overlayHigh: 0.9
	},

	// STROKE AND LINE TOKENS
	stroke: {
		width: {
			thin: 1,
			base: 1.5,
			thick: 2,
			xthick: 2.5,
			xxthick: 3,
			xxxthick: 4
		},
		dasharray: {
			dotted: "2 6",
			dashedShort: "4 2",
			dashed: "5 3",
			dashedLong: "8 6",
			gridMinor: "2",
			backEdge: "3 2"
		}
	},

	// GEOMETRY AND SIZING TOKENS
	geometry: {
		pointRadius: {
			small: 3,
			base: 4,
			large: 5
		},
		tickLength: {
			minor: 4,
			major: 8
		}
	},

	// TABLE STYLING
	table: {
		borderColor: "#000000",
		headerBackground: "#f2f2f2",
		padding: "8px"
	}
} as const

export type Theme = typeof theme
