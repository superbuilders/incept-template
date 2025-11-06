{
	const choiceSpecs: Array<{ label: string; isCorrect: boolean }> = [
		{ label: "correct", isCorrect: true },
		{ label: "tens as ones", isCorrect: false },
		{ label: "compressed", isCorrect: false },
		{ label: "wrong unit", isCorrect: false }
	]
	const buildFeedback = (choice: {
		label: string
		isCorrect: boolean
	}): unknown => ({ choice })

	const perm = [0, 1, 2, 3]
	for (let i = perm.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[perm[i], perm[j]] = [perm[j], perm[i]]
	}

	const shuffled = perm.map((index) => choiceSpecs[index])
	const choiceIds = ["A", "B", "C", "D"] as const
	const correctIndex = shuffled.findIndex((c) => c.isCorrect)
	const correctChoiceIdentifier =
		correctIndex >= 0 ? choiceIds[correctIndex] : "A"

	const _assessmentItem = {
		interactions: {
			choice_interaction: {
				shuffle: true,
				choices: shuffled.map((choice, idx) => ({
					identifier: choiceIds[idx],
					content: [{ type: "text", content: choice.label }]
				}))
			}
		},
		responseDeclarations: [
			{
				identifier: "RESPONSE",
				cardinality: "single",
				baseType: "identifier",
				correct: correctChoiceIdentifier
			}
		],
		feedback: {
			FEEDBACK__OVERALL: {
				RESPONSE: Object.fromEntries(
					choiceIds.map((id, idx) => [
						id,
						{ content: buildFeedback(shuffled[idx]) }
					])
				)
			}
		}
	}
	void _assessmentItem
}
