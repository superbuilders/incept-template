import type { Properties } from "csstype"

export type IssueSeverity = "info" | "warning" | "error"

export type CssValue = string | number

export type StyleRules = Properties<CssValue>
export type StyleObject = Record<string, StyleRules>

export interface StimulusIssue {
	severity: IssueSeverity
	code: string
	message: string
	details?: Record<string, unknown>
}

export interface StimulusInput {
	html: string
	title?: string
	sourcePath?: string
}

export interface StimulusOptions {
	removeSelectors?: string[]
	strict?: boolean
	inlineStyles?: StyleObject
}

export interface StimulusAsset {
	type: "image" | "iframe" | "link" | "other"
	url: string
}

export type ExtractedVideo = {
	order: number
	youtubeId: string
	titleHint?: string
	contextHtml?: string
}

export interface StimulusBuildResult {
	html: string
	issues: StimulusIssue[]
	assets: StimulusAsset[]
	videos: ExtractedVideo[]
}
