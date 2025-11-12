import type { BlockContent } from "@/core/content"

type TemplateWidgets = readonly ["fractionModelDiagram"]

const widgetId = "fraction_model"

// The literal widget type is widened to `string`, so we lose the narrow type.
const widgetType: string = "fractionModelDiagram"

const body = [
	{
		type: "paragraph" as const,
		content: []
	},
	{
		type: "widgetRef" as const,
		widgetId,
		// @ts-expect-error: The literal widget type is widened to `string`, so we lose the narrow type.
		widgetType
	}
] satisfies BlockContent<TemplateWidgets>

void body
