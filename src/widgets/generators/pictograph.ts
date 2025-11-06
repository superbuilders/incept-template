import { z } from "zod"
import type { WidgetGenerator } from "@/widgets/types"
import { theme } from "@/widgets/utils/theme"

const Key = z
	.object({
		icon: z
			.string()
			.describe(
				"The emoji or symbol used to represent data (e.g., '🍎' for apple, '🚗' for car, '⭐' for star). Single emoji recommended."
			),
		label: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"What each icon represents with its value (e.g., '= 10 apples', '= 5 cars', '= 100 votes', null). Shows the scale/multiplier. Null means no label."
			)
	})
	.strict()

const Row = z
	.object({
		category: z
			.string()
			.describe(
				"The category name for this row (e.g., 'Red Apples', 'Monday', 'Grade 3', 'Team A'). Displayed as row label on the left."
			),
		iconCount: z
			.number()
			.describe(
				"Number of icons to display in this row (e.g., 3, 5.5, 0, 2.25). Can be fractional - partial icons show as partial emoji."
			)
	})
	.strict()

export const PictographPropsSchema = z
	.object({
		type: z
			.literal("pictograph")
			.describe(
				"Identifies this as a pictograph widget using icons to represent quantities."
			),
		title: z
			.string()
			.nullable()
			.transform((val) =>
				val === "null" || val === "NULL" || val === "" ? null : val
			)
			.describe(
				"Title displayed above the pictograph (e.g., 'Fruit Sales This Week', 'Favorite Pets', null). Null means no title."
			),
		key: Key.describe(
			"Defines what each icon represents. The key is essential for interpreting the pictograph correctly."
		),
		data: z
			.array(Row)
			.describe(
				"Rows of data to display. Each row shows a category with its icon count. Order determines top-to-bottom display. Can be empty for blank pictograph."
			)
	})
	.strict()
	.describe(
		"Creates a pictograph (picture graph) where quantities are represented by repeated icons/emojis. Each icon represents a specific value shown in the key. Supports fractional icons for precise values. Perfect for elementary data visualization, making abstract numbers concrete and engaging through visual representation."
	)

export type PictographProps = z.infer<typeof PictographPropsSchema>

/**
 * This template generates a pictograph, a type of chart that uses icons or images
 * (often emojis) to represent data quantities, making it visually engaging and
 * easy to understand at a glance.
 */
export const generatePictograph: WidgetGenerator<
	typeof PictographPropsSchema
> = async (data) => {
	const { title, key, data: pictographData } = data
	let html = `<div style="font-family: ${theme.font.family.sans}; border: 1px solid ${theme.colors.border}; padding: ${theme.table.padding}; border-radius: 5px;">`

	// Render title only if it's non-empty
	if (title !== null) {
		html += `<h3 style="text-align: center; margin-top: 0;">${title}</h3>`
	}

	html += `<table style="width: 100%; border-collapse: collapse;">`
	html += "<tbody>"
	for (const d of pictographData) {
		html += "<tr>"
		html += `<td style="padding: ${theme.table.padding}; width: 30%; font-weight: ${theme.font.weight.bold}; text-align: right; border-right: 1px solid ${theme.colors.gridMajor};">${d.category}</td>`
		html += `<td style="padding: ${theme.table.padding}; font-size: 1.5em; letter-spacing: 0.2em;">`

		// Handle fractional icon counts
		const wholeIcons = Math.floor(d.iconCount)
		const fractionalPart = d.iconCount - wholeIcons

		// Render whole icons
		for (let i = 0; i < wholeIcons; i++) {
			html += key.icon
		}

		// Render fractional icon if needed
		if (fractionalPart > 0) {
			html += `<span style="opacity: ${fractionalPart};">${key.icon}</span>`
		}

		html += "</td>"
		html += "</tr>"
	}
	html += "</tbody>"
	html += "</table>"

	// Render key section only if label is provided
	if (key.label) {
		html += `<div style="text-align: center; margin-top: 15px; padding-top: 10px; border-top: 1px solid #ccc;">`
		html += `<span style="font-size: 1.5em;">${key.icon}</span> ${key.label}`
		html += "</div>"
	}

	html += "</div>"
	return html
}
