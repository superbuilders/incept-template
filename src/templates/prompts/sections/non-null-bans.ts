export const NON_NULL_BANS_SECTION = [
	"### NON_NULL_ASSERTION_POLICY",
	"<non_null_policy>",
	"- Never use the `!` non-null assertion operator.",
	"- Guard values with runtime checks or throw explicit errors when an invariant fails.",
	"- Prefer helper functions that return early if a lookup fails.",
	"</non_null_policy>"
].join("\n")
