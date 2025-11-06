import type { StyleObject } from "@/stimulus/types"

export const defaultStimulusStyles: StyleObject = {
	article: {
		fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
		color: "#24292e",
		lineHeight: 1.6,
		fontSize: "16px",
		maxWidth: "720px",
		margin: "0 auto",
		padding: "0 16px 32px"
	},
	h1: {
		fontSize: "2.2em",
		marginTop: "32px",
		marginBottom: "16px",
		fontWeight: 600,
		lineHeight: 1.2
	},
	h2: {
		fontSize: "1.8em",
		marginTop: "28px",
		marginBottom: "16px",
		fontWeight: 600,
		lineHeight: 1.25,
		borderBottom: "1px solid #eaecef",
		paddingBottom: "0.3em"
	},
	h3: {
		fontSize: "1.5em",
		marginTop: "24px",
		marginBottom: "12px",
		fontWeight: 600,
		lineHeight: 1.3
	},
	h4: {
		fontSize: "1.3em",
		marginTop: "20px",
		marginBottom: "12px",
		fontWeight: 600,
		lineHeight: 1.3
	},
	h5: {
		fontSize: "1.1em",
		marginTop: "16px",
		marginBottom: "8px",
		fontWeight: 600,
		lineHeight: 1.3,
		color: "#586069"
	},
	p: {
		marginTop: 0,
		marginBottom: "16px"
	},
	"ul, ol": {
		paddingLeft: "24px",
		marginTop: 0,
		marginBottom: "16px"
	},
	li: {
		marginBottom: "0.5em"
	},
	a: {
		color: "#0366d6",
		textDecoration: "underline",
		textDecorationThickness: "2px"
	},
	strong: {
		fontWeight: 600
	},
	em: {
		fontStyle: "italic"
	},
	blockquote: {
		borderLeft: "4px solid #dfe2e5",
		margin: "16px 0",
		padding: "0 16px",
		color: "#6a737d"
	},
	code: {
		fontFamily:
			'"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
		backgroundColor: "#f6f8fa",
		padding: "0.2em 0.4em",
		borderRadius: "3px",
		fontSize: "0.95em"
	},
	pre: {
		backgroundColor: "#f6f8fa",
		padding: "16px",
		borderRadius: "6px",
		overflowX: "auto",
		fontFamily:
			'"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace'
	}
}
