const UINT64_MAX = (1n << 64n) - 1n
const DOUBLE_PRECISION_RANGE = 2 ** 53

export type SeededRandom = {
	next: () => number
	nextInt: (min: number, maxInclusive: number) => number
	nextBoolean: () => boolean
}

/**
 * Very small deterministic RNG (LCG) seeded from a bigint. Provides helpers for
 * common integer and boolean draws without relying on global Math.random.
 * Callers should pass non-negative integer seed values.
 */
export function createSeededRandom(seed: bigint): SeededRandom {
	// SplitMix64-style 64-bit state evolution keeps behaviour stable across large seeds.
	let state = BigInt.asUintN(64, seed)

	const nextUint64 = () => {
		state = (state + 0x9e3779b97f4a7c15n) & UINT64_MAX
		let z = state
		z = (z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n
		z &= UINT64_MAX
		z = (z ^ (z >> 27n)) * 0x94d049bb133111ebn
		z &= UINT64_MAX
		z ^= z >> 31n
		return z & UINT64_MAX
	}

	const next = () => {
		const value = nextUint64() >> 11n // retain top 53 bits for double precision
		return Number(value) / DOUBLE_PRECISION_RANGE
	}

	const nextInt = (min: number, maxInclusive: number): number => {
		const lower = Math.trunc(min)
		const upper = Math.trunc(maxInclusive)
		const span = upper - lower + 1
		if (!Number.isFinite(span) || span <= 0) {
			return lower
		}
		return lower + Math.floor(next() * span)
	}

	const nextBoolean = () => next() < 0.5

	return { next, nextInt, nextBoolean }
}
