type MathContent = { type: "math"; mathml: string }
type TextContent = { type: "text"; content: string }

const distance: MathContent = {
	type: "math",
	mathml: "<mn>42</mn><mi>km</mi>"
}

const prompt: (MathContent | TextContent)[] = [
	{ type: "text", content: "The race distance is " },
	distance,
	{ type: "text", content: "." }
]

void prompt

// Units such as "km" must be rendered as plain text blocks, not embedded inside MathML.
// Keeping the unit inside the math payload prevents AT from announcing it correctly and
// violates the content style guide for units.
