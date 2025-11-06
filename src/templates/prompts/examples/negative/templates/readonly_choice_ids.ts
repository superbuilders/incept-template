{
	type FeedbackDimension = {
		responseIdentifier: string
		kind: "enumerated"
		keys: string[]
	}

	type FeedbackPlan = {
		mode: "combo"
		dimensions: FeedbackDimension[]
	}

	const choiceIds = ["A", "B", "C", "D"] as const

	const feedbackPlan = {
		mode: "combo",
		dimensions: [
			{
				responseIdentifier: "RESPONSE",
				kind: "enumerated",
				// @ts-expect-error readonly tuple is not assignable to string[]
				keys: choiceIds
			}
		]
	} satisfies FeedbackPlan
	void feedbackPlan
}
