{
	type ChoiceSpec = {
		steps: number
		widgetId: string
	}

	const denom = 5
	const adjustedNumer = 3

	const baseWidgetPrefix = "nlwa__seed_123"
	const makeWidgetId = (suffix: string) => `${baseWidgetPrefix}__${suffix}`

	// Guards reject duplicates when we push, so we exit the prefill loop with only two values.
	const candidateCounts = [2, 4]

	const finalChoices: ChoiceSpec[] = []
	let distractorIdx = 0

	const addChoice = (label: string, steps: number) => {
		finalChoices.push({
			steps,
			widgetId: makeWidgetId(`choice_${label.toLowerCase()}_visual`)
		})
	}

	// First two distractors read directly from `candidateCounts`.
	const firstSteps = candidateCounts[distractorIdx]
	if (firstSteps !== undefined) {
		addChoice("B", firstSteps)
		distractorIdx++
	}

	const secondSteps = candidateCounts[distractorIdx]
	if (secondSteps !== undefined) {
		addChoice("C", secondSteps)
		distractorIdx++
	}

	// The fallback branch never checks whether the synthetic value is unique.
	const fallbackSteps = Math.max(
		1,
		(adjustedNumer + distractorIdx + 1) % (denom - 1) || 1
	) // -> 2

	// We now insert a third distractor that duplicates choice B.
	addChoice("D", candidateCounts[distractorIdx] ?? fallbackSteps)

	const duplicateSteps = finalChoices
		.map((choice) => choice.steps)
		.filter((steps, index, all) => all.indexOf(steps) !== index)

	// -> true: fallback produced 2, matching choice B instead of a new misconception.
	const hasDuplicate = duplicateSteps.length > 0
	void hasDuplicate
}
