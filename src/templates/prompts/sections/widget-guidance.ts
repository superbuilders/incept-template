export function createWidgetGuidance(
	allowedWidgets: readonly string[]
): string {
	if (allowedWidgets.length === 0) {
		return `### WIDGET_POLICY
<widgets>
- Allowed widgets: none.
- \`TemplateWidgets\` must be declared as \`readonly []\`.
- Set \`assessmentItem.widgets\` to \`null\` and avoid instantiating widget manifests.
</widgets>`
	}
	const widget = allowedWidgets[0]
	return `### WIDGET_POLICY
<widgets>
- Allowed widget types: ["${widget}"].
- Declare \`TemplateWidgets = readonly ["${widget}"]\` and ensure the generated item only references this widget.
- When constructing \`widgets\`, use the canonical helper for "${widget}" and populate it with seed-driven values.
</widgets>`
}
