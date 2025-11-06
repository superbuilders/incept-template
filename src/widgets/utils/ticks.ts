import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"

const ErrUnsupportedInterval = errors.new(
	"unsupported non-terminating tick interval"
)
const MAX_TICKS = 10_000

const EPSILON = 1e-12

/**
 * Checks if a number has a finite decimal representation within a given precision.
 */
function isFiniteDecimal(n: number, maxDigits = 12): boolean {
	if (!Number.isFinite(n)) return false
	let scaled = n
	for (let i = 0; i < maxDigits; i++) {
		if (Math.abs(scaled - Math.round(scaled)) < EPSILON) {
			return true
		}
		scaled *= 10
	}
	return Math.abs(scaled - Math.round(scaled)) < EPSILON
}

/**
 * Checks if an interval is a multiple of a base fraction (e.g., 1/3 or 1/6).
 * @returns The integer multiplier `k` if it is a multiple, otherwise null.
 */
function isMultipleOf(interval: number, baseDenominator: 3 | 6): number | null {
	const ratio = interval * baseDenominator
	const k = Math.round(ratio)
	if (Math.abs(ratio - k) < EPSILON && k !== 0) {
		return k
	}
	return null
}

/**
 * Converts a number to a BigInt in a scaled integer space and validates grid alignment.
 */
function toGridInt(n: number, D: bigint): bigint {
	const scaled = n * Number(D)
	const rounded = Math.round(scaled)
	if (Math.abs(scaled - rounded) > EPSILON) {
		logger.error("value is not aligned to the tick grid", { n, D })
		throw errors.new(`value ${n} is not aligned to the tick grid`)
	}
	return BigInt(rounded)
}

/**
 * Formats a rational number (numerator/denominator) into a decimal string with limited precision.
 */
function formatRational(p: bigint, D: bigint, maxDigits = 12): string {
	if (D === BigInt(0)) {
		logger.error("invalid denominator", { denominator: D })
		throw errors.new("denominator cannot be zero")
	}
	if (p === BigInt(0)) return "0"

	const sign = p < BigInt(0) ? "-" : ""
	const absP = p < BigInt(0) ? -p : p

	const integerPart = absP / D
	let remainder = absP % D

	if (remainder === BigInt(0)) {
		return `${sign}${integerPart}`
	}

	let fractionalPart = ""
	for (let i = 0; i < maxDigits && remainder !== BigInt(0); i++) {
		remainder *= BigInt(10)
		fractionalPart += String(remainder / D)
		remainder %= D
	}

	return `${sign}${integerPart}.${fractionalPart.replace(/0+$/, "")}`
}

/**
 * Computes a decimal scale factor (power of 10) sufficient to represent all input numbers as integers.
 * Handles scientific notation and fractional parts.
 */
export function computeDecimalScale(...nums: number[]): number {
	let maxFractionalDigits = 0
	for (const n of nums) {
		if (!Number.isFinite(n)) continue
		const s = String(n)
		let fractionalDigits = 0
		if (s.includes("e-")) {
			const parts = s.split("e-")
			const basePart = parts[0] || ""
			const expPart = parts[1] || "0"
			const baseFrac = basePart.includes(".")
				? (basePart.split(".")[1] || "").length
				: 0
			fractionalDigits = baseFrac + Number.parseInt(expPart, 10)
		} else if (s.includes(".")) {
			fractionalDigits = (s.split(".")[1] || "").length
		}
		if (fractionalDigits > maxFractionalDigits) {
			maxFractionalDigits = fractionalDigits
		}
	}
	return 10 ** maxFractionalDigits
}

/**
 * Performs integer ceiling division, correctly handling negative numbers.
 */
export function ceilDiv(a: number, b: number): number {
	return Math.ceil(a / b)
}

/**
 * Generates ticks by performing calculations in a scaled integer space to avoid floating-point drift.
 * Now supports exact rational intervals for multiples of 1/3 and 1/6.
 */
export function buildTicks(
	min: number,
	max: number,
	interval: number
): { values: number[]; labels: string[] } {
	if (min > max || interval <= 0) {
		logger.error("invalid tick parameters", { min, max, interval })
		return { values: [], labels: [] }
	}

	// PATH 1: Finite Decimal Intervals (existing logic)
	if (isFiniteDecimal(interval)) {
		const scale = computeDecimalScale(min, max, interval)
		const minI = Math.round(min * scale)
		const maxI = Math.round(max * scale)
		const stepI = Math.round(interval * scale)

		if (stepI === 0) return { values: [], labels: [] }

		const startI = ceilDiv(minI, stepI) * stepI
		const values: number[] = []
		const labels: string[] = []

		for (
			let vI = startI;
			vI <= maxI && values.length < MAX_TICKS;
			vI += stepI
		) {
			values.push(vI / scale)
			labels.push(formatTickInt(vI, scale))
		}
		return { values, labels }
	}

	// PATH 2: Exact Rational Intervals (1/3 and 1/6)
	const k3 = isMultipleOf(interval, 3)
	const k6 = isMultipleOf(interval, 6)

	if (k3 !== null || k6 !== null) {
		const baseDenominator = k6 !== null ? 6 : 3
		const k = k6 !== null ? k6 : (k3 ?? 0)

		const decimalScaleForMinMax =
			10 **
			Math.max(
				(String(min).split(".")[1] || "").length,
				(String(max).split(".")[1] || "").length
			)
		const D = BigInt(baseDenominator * decimalScaleForMinMax)

		const minBI = toGridInt(min, D)
		const maxBI = toGridInt(max, D)
		const stepBI = BigInt(k * decimalScaleForMinMax)

		if (stepBI === BigInt(0)) return { values: [], labels: [] }

		const startBI = ((minBI + stepBI - BigInt(1)) / stepBI) * stepBI

		const values: number[] = []
		const labels: string[] = []

		for (
			let vBI = startBI;
			vBI <= maxBI && values.length < MAX_TICKS;
			vBI += stepBI
		) {
			values.push(Number(vBI) / Number(D))
			// Render fractions for non-terminating decimals (denominators with primes other than 2 or 5)
			const g = gcdBigInt(vBI < BigInt(0) ? -vBI : vBI, D)
			const pRed = vBI / g
			const dRed = D / g
			const dNoTwoFive = stripTwoFiveFactors(dRed)
			if (dNoTwoFive !== BigInt(1)) {
				labels.push(formatFractionLabel(pRed, dRed))
			} else {
				labels.push(formatRational(vBI, D))
			}
		}
		return { values, labels }
	}

	// PATH 2b: Pi-based Intervals (rational multiples of π, e.g., π/2)
	// Detect if interval ≈ (p/q) * π for small integers p, q
	// This enables common math axes like tickInterval = π/2
	{
		const rationalPairs: Array<{ p: number; q: number }> = [
			{ p: 1, q: 1 }, // π
			{ p: 1, q: 2 }, // π/2
			{ p: 1, q: 3 }, // π/3
			{ p: 1, q: 4 }, // π/4
			{ p: 1, q: 6 }, // π/6
			{ p: 2, q: 1 }, // 2π
			{ p: 3, q: 2 } // 3π/2
		]

		let isPiMultiple = false
		let matchedInterval = interval
		let matchedP = 1
		let matchedQ = 1
		for (const { p, q } of rationalPairs) {
			const candidate = (p * Math.PI) / q
			if (Math.abs(interval - candidate) < EPSILON) {
				isPiMultiple = true
				matchedInterval = candidate
				matchedP = p
				matchedQ = q
				break
			}
		}

		if (isPiMultiple) {
			const values: number[] = []
			const labels: string[] = []

			// Work in integer step space using k such that tick = k * matchedInterval
			// Guard with MAX_TICKS and tolerance to avoid drift
			const startK = Math.ceil(min / matchedInterval - EPSILON)
			const endK = Math.floor(max / matchedInterval + EPSILON)

			for (let k = startK; k <= endK && values.length < MAX_TICKS; k++) {
				const v = k * matchedInterval
				if (v < min - 1e-9 || v > max + 1e-9) continue
				values.push(v)
				labels.push(
					formatPiMultipleLabel(BigInt(k), BigInt(matchedP), BigInt(matchedQ))
				)
			}

			return { values, labels }
		}
	}

	// PATH 3: Unsupported non-terminating interval
	logger.error("unsupported non-terminating tick interval", { interval })
	throw errors.wrap(ErrUnsupportedInterval, `interval: ${interval}`)
}

/**
 * Formats a scaled integer tick value into a clean string representation.
 * Avoids floating point tails and ensures no "-0".
 * Kept as internal helper for finite-decimal path.
 */
function formatTickInt(vI: number, scale: number): string {
	if (vI === 0) return "0"

	const sign = vI < 0 ? "-" : ""
	const absVI = Math.abs(vI)
	const d = Math.round(Math.log10(scale))

	const q = Math.floor(absVI / scale)
	const r = absVI % scale

	if (r === 0) {
		return sign + String(q)
	}

	let frac = r.toString().padStart(d, "0")
	frac = frac.replace(/0+$/, "") // Strip trailing zeros

	return `${sign}${q}.${frac}`
}

/**
 * Formats a floating value into a decimal string with limited precision,
 * stripping trailing zeros and the decimal point when unnecessary.
 */
// Removed unused function formatDecimalLabel

// --- Helpers for fraction/π labeling ---
function gcdBigInt(a: bigint, b: bigint): bigint {
	let x = a < BigInt(0) ? -a : a
	let y = b < BigInt(0) ? -b : b
	while (y !== BigInt(0)) {
		const t = y
		y = x % y
		x = t
	}
	return x
}

function stripTwoFiveFactors(n: bigint): bigint {
	let d = n
	while (d % BigInt(2) === BigInt(0)) d /= BigInt(2)
	while (d % BigInt(5) === BigInt(0)) d /= BigInt(5)
	return d
}

function formatFractionLabel(p: bigint, q: bigint): string {
	if (q === BigInt(0)) return ""
	const sign = p < BigInt(0) ? "-" : ""
	const ap = p < BigInt(0) ? -p : p
	const g = gcdBigInt(ap, q)
	const num = ap / g
	const den = q / g
	if (den === BigInt(1)) return `${sign}${num}`
	return `${sign}${num}/${den}`
}

function formatPiMultipleLabel(k: bigint, p: bigint, q: bigint): string {
	// value = (k * p / q) * π
	const numRaw = k * p
	if (numRaw === BigInt(0)) return "0"
	const sign = numRaw < BigInt(0) ? "-" : ""
	const anum = numRaw < BigInt(0) ? -numRaw : numRaw
	const g = gcdBigInt(anum, q)
	const num = anum / g
	const den = q / g
	if (den === BigInt(1)) {
		if (num === BigInt(1)) return `${sign}π`
		return `${sign}${num}π`
	}
	// For numerator 1, prefer "π/den" over "1π/den"
	const coef = num === BigInt(1) ? "" : `${num}`
	return `${sign}${coef}π/${den}`
}
