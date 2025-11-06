import { collectAssets } from "@/stimulus/assets"
import { createDocument } from "@/stimulus/dom"
import { normalizeStructure } from "@/stimulus/normalizers"
import { sanitizeDocument } from "@/stimulus/sanitizers"
import { serializeArticle } from "@/stimulus/serializer"
import { applyInlineStyles } from "@/stimulus/styler"
import type {
	StimulusBuildResult,
	StimulusInput,
	StimulusIssue,
	StimulusOptions
} from "@/stimulus/types"
import { validateHtml } from "@/stimulus/validator"
import { extractYouTubeVideos } from "@/stimulus/video-extractor"

export type {
	StimulusAsset,
	StimulusBuildResult,
	StimulusIssue,
	StimulusOptions
} from "@/stimulus/types"

export interface CanvasPageData {
	title?: string
	mainContent?: {
		html?: string
		text?: string
	}
}

export function buildStimulusFromHtml(
	input: StimulusInput,
	options?: StimulusOptions
): StimulusBuildResult {
	const issues: StimulusIssue[] = []
	const sourceDocument = createDocument(input.html)
	sanitizeDocument(sourceDocument, issues, options)
	const root = normalizeStructure(sourceDocument, issues)

	applyInlineStyles(root, options)
	const videos = extractYouTubeVideos(root)
	const html = serializeArticle(root)
	const validationIssues = validateHtml(html)
	const assets = collectAssets(root)
	return {
		html,
		issues: [...issues, ...validationIssues],
		assets,
		videos
	}
}

export function buildStimulusFromPageData(
	page: CanvasPageData,
	options?: StimulusOptions
): StimulusBuildResult | undefined {
	const html = page.mainContent?.html
	if (!html || html.trim().length === 0) {
		return undefined
	}
	return buildStimulusFromHtml({ html, title: page.title }, options)
}
