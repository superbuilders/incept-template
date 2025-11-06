export const TYPE_ASSERTION_BANS_SECTION = [
	"### TYPE_ASSERTION_POLICY",
	"<type_assertion_policy>",
	"- Do not use `as` (except `as const` when preserving literal tuples).",
	"- Prefer runtime guards, `satisfies`, or structural checks instead of forced casts.",
	"- Add helper functions that validate data before use.",
	"</type_assertion_policy>"
].join("\n")
