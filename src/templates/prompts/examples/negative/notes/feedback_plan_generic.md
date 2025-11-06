## Why this example is harmful

- It aliases `TemplateModule` so the feedback plan always resolves to the broad `FeedbackPlan` type, hiding when the template actually returns a more specific plan shape.
- Because the second generic is lost, reviewers can’t tell whether `feedbackPlan` matches the schema the template emits—TypeScript will accept nearly any structure and subtle mismatches slip through.
- The feedback authoring tree is equally untyped: every branch is treated as `FeedbackPlan`, so the compiler can’t confirm that each response path provides the required content.
- This pattern also advertises a “shortcut” for other authors, encouraging them to reintroduce default generics we explicitly removed to improve safety.

Treat this file as a legacy caution. Always supply both generic parameters to `TemplateModule`, and use a dedicated `ReturnType` helper (e.g., `typeof buildFeedbackPlan`) so the template’s contract stays tightly coupled to its actual feedback plan.
