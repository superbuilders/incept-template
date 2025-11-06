// Utilities for thinning axis/category labels to avoid overlap and transforming labels

/**
 * Transform full month names to 3-letter abbreviations.
 * Case-insensitive matching, preserves original case style in abbreviation.
 */
export function abbreviateMonth(text: string): string {
	const monthMap: Record<string, string> = {
		january: "Jan",
		february: "Feb",
		march: "Mar",
		april: "Apr",
		may: "May",
		june: "Jun",
		july: "Jul",
		august: "Aug",
		september: "Sep",
		october: "Oct",
		november: "Nov",
		december: "Dec"
	} as const

	const lowerText = text.toLowerCase().trim()
	const abbreviation = monthMap[lowerText]

	if (abbreviation) {
		// Preserve case style: if original was all caps, return all caps; if mixed/title case, return title case
		if (text === text.toUpperCase()) {
			return abbreviation.toUpperCase()
		}
		if (text === text.toLowerCase()) {
			return abbreviation.toLowerCase()
		}
		return abbreviation // Default to title case
	}

	return text // Return original if not a month
}

/**
 * Compute label indices using smart interval selection.
 * Prefers clean intervals (every 2nd, 3rd, etc.) over rigid label count limits.
 */
export function computeEquallySpacedIndices(
	totalCount: number,
	maxCount: number
): number[] {
	if (totalCount <= 0) return []
	if (maxCount <= 1) return [0]
	if (totalCount <= maxCount)
		return Array.from({ length: totalCount }, (_, i) => i)

	// Try clean intervals, allowing slight tolerance over maxCount for better spacing
	const tolerance = Math.max(1, Math.ceil(maxCount * 0.2)) // Allow 20% more labels for clean intervals

	for (let interval = 1; interval <= totalCount; interval++) {
		const indices: number[] = []
		for (let i = 0; i < totalCount; i += interval) {
			indices.push(i)
		}

		// Accept clean intervals that are within tolerance of maxCount
		if (indices.length <= maxCount + tolerance) {
			return indices
		}
	}

	// Fallback to endpoint-aware fractional spacing only if no clean interval works
	const lastIndex = totalCount - 1
	if (maxCount >= 2) {
		// Always include first and last, distribute others in between
		const indices = [0]
		const remainingSlots = maxCount - 2

		if (remainingSlots > 0) {
			const step = (lastIndex - 1) / (remainingSlots + 1)
			for (let k = 1; k <= remainingSlots; k++) {
				const idx = Math.round(k * step)
				indices.push(idx)
			}
		}

		indices.push(lastIndex)
		return Array.from(new Set(indices)).sort((a, b) => a - b)
	}

	// Final fallback for maxCount === 1
	return [0]
}

/**
 * Compute a set of label indices to render given total slots, a set of candidates
 * (e.g., non-empty labels), available width and minimum pixel spacing.
 * Uses equal-interval ideal positions, mapped to nearest available candidates.
 */
export function computeLabelSelection(
	totalCount: number,
	candidates: number[],
	chartWidthPx: number,
	minLabelSpacingPx: number
): Set<number> {
	const maxLabels = Math.max(
		1,
		Math.floor(chartWidthPx / Math.max(1, minLabelSpacingPx))
	)
	const ideal = computeEquallySpacedIndices(totalCount, maxLabels)
	if (candidates.length === 0) {
		return new Set<number>(ideal)
	}
	// Map each ideal index to the nearest available candidate to favor equal spacing
	const remaining = new Set<number>(candidates)
	const chosen: number[] = []
	for (const idx of ideal) {
		let best: number | null = null
		let bestDist = Number.POSITIVE_INFINITY
		for (const c of remaining) {
			const d = Math.abs(c - idx)
			if (d < bestDist) {
				bestDist = d
				best = c
			}
			if (bestDist === 0) break
		}
		if (best !== null) {
			chosen.push(best)
			remaining.delete(best)
		}
	}
	// Fill if needed
	if (chosen.length < Math.min(maxLabels, candidates.length)) {
		for (const c of remaining) {
			chosen.push(c)
			if (chosen.length >= Math.min(maxLabels, candidates.length)) break
		}
	}
	return new Set<number>(chosen)
}
