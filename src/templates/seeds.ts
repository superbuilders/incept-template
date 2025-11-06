import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"

const UINT32_MAX = 0xffffffff
const UINT32_MAX_PLUS_ONE = UINT32_MAX + 1

export type SeededRandom = {
	next: () => number
	nextInt: (min: number, maxInclusive: number) => number
	nextBoolean: () => boolean
}

/**
 * Very small deterministic RNG (LCG) seeded from a bigint. Provides helpers for
 * common integer and boolean draws without relying on global Math.random.
 */
export function createSeededRandom(seed: bigint): SeededRandom {
	if (seed < 0n) {
		logger.error("seed must be nonnegative", { seed: seed.toString() })
		throw errors.new("seed must be nonnegative")
	}

	// Reduce big seed to 32-bit state while keeping determinism for large inputs.
	let state = Number(seed & BigInt(UINT32_MAX)) >>> 0

	const next = () => {
		state = (state * 1664525 + 1013904223) >>> 0
		return state / UINT32_MAX_PLUS_ONE
	}

	const nextInt = (min: number, maxInclusive: number): number => {
		if (!Number.isFinite(min) || !Number.isFinite(maxInclusive)) {
			logger.error("nextInt bounds must be finite numbers", {
				min,
				maxInclusive
			})
			throw errors.new("nextInt bounds must be finite numbers")
		}
		if (Math.floor(min) !== min || Math.floor(maxInclusive) !== maxInclusive) {
			logger.error("nextInt bounds must be integers", {
				min,
				maxInclusive
			})
			throw errors.new("nextInt bounds must be integers")
		}
		if (maxInclusive < min) {
			logger.error("nextInt maxInclusive must be >= min", {
				min,
				maxInclusive
			})
			throw errors.new("nextInt maxInclusive must be >= min")
		}
		const span = maxInclusive - min + 1
		return min + Math.floor(next() * span)
	}

	const nextBoolean = () => next() < 0.5

	return { next, nextInt, nextBoolean }
}
