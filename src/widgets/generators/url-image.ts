import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { createHeightSchema, createWidthSchema } from "@/widgets/utils/schemas"
import { stripMarkdownToPlaintext } from "@/widgets/utils/text"
import { theme } from "@/widgets/utils/theme"
import {
	escapeXmlAttribute,
	sanitizeXmlAttributeValue
} from "@/widgets/utils/xml-utils"

export const UrlImageWidgetPropsSchema = z
	.object({
		type: z.literal("urlImage"),
		url: z
			.string()
			.regex(
				/^https:\/\/.+\.(?:svg|png|jpe?g|gif)$/,
				"url must start with https:// and end with .svg, .png, .jpg, .jpeg, or .gif"
			)
			.describe(
				"The direct HTTPS URL to the image resource (must end with .svg, .png, .jpg, .jpeg, or .gif)."
			),
		alt: z
			.string()
			.describe(
				"Required alternative text describing the image for accessibility. Plaintext only; no markdown or HTML."
			),
		width: createWidthSchema().nullable(),
		height: createHeightSchema().nullable(),
		caption: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"An optional descriptive caption to display below the image. This should describe what the image shows or provide context. Plaintext only; no markdown or HTML."
			),
		attribution: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Optional attribution or source credit. Use this to provide image source, creator, or licensing details. Keep the caption strictly descriptive and place attribution here instead. Plaintext only; no markdown or HTML."
			)
	})
	.strict()
	.describe(
		"Static image widget rendered from a direct HTTPS URL. Use 'alt' for accessibility, optional 'width'/'height' for sizing, 'caption' for descriptive figure text, and 'attribution' for source/credit/licensing. Keep captions strictly descriptive; place any credits or licensing details in 'attribution'."
	)

export const generateUrlImage: WidgetGenerator<
	typeof UrlImageWidgetPropsSchema
> = async (props) => {
	const { url, alt, width, height, caption: _caption } = props
	// Temporarily disable caption rendering: we deliberately do not render captions right now.
	// We still accept the field in the schema, but force it to be ignored at generation time
	// to reduce downstream processing and minimize blast radius. Similar to attribution.
	const caption: string | null = null
	// Note: attribution is intentionally not destructured or rendered
	// The attribution field exists in the schema to encourage LLMs to separate
	// attribution/source info from the caption, but we don't display it

	const stripWrappingDelimiters = (input: string): string => {
		let text = input.trim()
		for (;;) {
			let changed = false
			if (text.startsWith("*") && text.endsWith("*") && text.length >= 2) {
				text = text.slice(1, -1).trim()
				changed = true
			}
			if (text.startsWith("[") && text.endsWith("]") && text.length >= 2) {
				text = text.slice(1, -1).trim()
				changed = true
			}
			if (!changed) break
		}
		return text
	}

	// Validate URL at compile time
	const urlValidationResult = errors.trySync((): void => {
		new URL(url)
	})
	if (urlValidationResult.error) {
		logger.error("invalid url provided to urlImage widget", {
			url,
			error: urlValidationResult.error
		})
		throw errors.new("invalid url")
	}

	const containerStyles = "display: inline-block; text-align: center;"
	const imgStyles = [
		"display: block;",
		width ? `width: ${width}px;` : "",
		height ? `height: ${height}px;` : ""
	]
		.filter(Boolean)
		.join(" ")
	const captionStyles = `font-size: 0.9em; color: ${theme.colors.text}; margin-top: 8px;`

	// Escape helpers for XML contexts
	const escapeXmlText = (text: string): string =>
		sanitizeXmlAttributeValue(text)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")

	const sanitizedAlt = stripMarkdownToPlaintext(alt)
	const normalizedAlt = stripWrappingDelimiters(sanitizedAlt)
	const sanitizedCaption = caption ? stripMarkdownToPlaintext(caption) : ""
	const normalizedCaption = sanitizedCaption
		? stripWrappingDelimiters(sanitizedCaption)
		: null
	// Normalize attribution even though we don't render it yet to avoid leaking artifacts if usage changes
	// Note: do not keep an unused variable; normalize inline when/if rendering changes

	const imgTag = `<img src="${escapeXmlAttribute(url)}" alt="${escapeXmlAttribute(normalizedAlt)}" style="${escapeXmlAttribute(imgStyles)}" />`
	const captionTag = normalizedCaption
		? `<div style="${escapeXmlAttribute(captionStyles)}">${escapeXmlText(normalizedCaption)}</div>`
		: ""

	return `<div style="${containerStyles}">${imgTag}${captionTag}</div>`
}
