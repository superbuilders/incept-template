### Why this is wrong
- `BlockContent<TemplateWidgets>` expects every `widgetRef` to declare `widgetType` as the literal `"fractionModelDiagram"`.
- In the template the value is inferred as `string`, so the assessment item fails `AssessmentItemInput<TemplateWidgets, ...>` and `bun typecheck` reports TS2322.

### Fix
- Preserve the literal type by asserting or annotating the property, e.g. `widgetType: "fractionModelDiagram" as const`.
- See `fixed-example.ts` for the corrected template that keeps the literal widget type and passes `bun typecheck`.
