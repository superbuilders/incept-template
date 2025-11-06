import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"

export type NumberContent =
	| { type: "whole"; value: number; sign: "+" | "-" }
	| {
			type: "fraction"
			numerator: number
			denominator: number
			sign: "+" | "-"
	  }
	| {
			type: "mixed"
			whole: number
			numerator: number
			denominator: number
			sign: "+" | "-"
	  }

/**
 * Convert a number content union into inner MathML (no outer <math> wrapper).
 * - Whole: optional minus sign + integer
 * - Fraction: optional minus sign + mfrac
 * - Mixed: optional minus sign + whole + thin space + mfrac
 */
export function numberContentToInnerMathML(value: NumberContent): string {
	if (value.type === "whole") {
		const magnitude = Math.abs(value.value)
		const sign = value.sign === "-" && magnitude !== 0 ? "<mo>-</mo>" : ""
		return `${sign}<mn>${magnitude}</mn>`
	}

	if (value.type === "fraction") {
		if (value.denominator <= 0) {
			logger.error("invalid denominator in fraction", {
				denominator: value.denominator
			})
			throw errors.new("invalid denominator")
		}
		if (value.numerator === 0) return "<mn>0</mn>"
		const sign = value.sign === "-" ? "<mo>-</mo>" : ""
		return `${sign}<mfrac><mn>${value.numerator}</mn><mn>${value.denominator}</mn></mfrac>`
	}

	// mixed
	if (value.denominator <= 0) {
		logger.error("invalid denominator in mixed number", {
			denominator: value.denominator
		})
		throw errors.new("invalid denominator")
	}
	const isZero = value.whole === 0 && value.numerator === 0
	if (isZero) return "<mn>0</mn>"
	const sign = value.sign === "-" ? "<mo>-</mo>" : ""
	const whole = value.whole > 0 ? `<mn>${value.whole}</mn>` : ""
	// Use a very small non-breaking space between whole and fraction for tighter layout
	const space =
		value.whole > 0 && value.numerator > 0 ? `<mspace width="0.15em"/>` : ""
	const frac =
		value.numerator > 0
			? `<mfrac><mn>${value.numerator}</mn><mn>${value.denominator}</mn></mfrac>`
			: ""
	return `${sign}${whole}${space}${frac}`
}
