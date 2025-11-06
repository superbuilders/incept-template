import type { WidgetCollection } from "@/widgets/collections/types"
import { allWidgetDefinitions } from "@/widgets/definitions"

export const simpleVisualCollection: WidgetCollection<
	Pick<typeof allWidgetDefinitions, "emojiImage" | "urlImage" | "video">,
	readonly ["emojiImage", "urlImage", "video"]
> = {
	name: "simple-visual",
	widgets: {
		emojiImage: allWidgetDefinitions.emojiImage,
		urlImage: allWidgetDefinitions.urlImage,
		video: allWidgetDefinitions.video
	},
	widgetTypeKeys: ["emojiImage", "urlImage", "video"]
} as const
