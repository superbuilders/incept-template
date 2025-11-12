import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { escapeXmlAttribute } from "@/compiler/utils/xml-utils"
import type { FeedbackContent } from "@/core/feedback/content"
import type { FeedbackDimension, FeedbackPlanAny } from "@/core/feedback/plan"
import type { AssessmentItem } from "@/core/item"

// Internal type for compilation after nested feedback has been flattened
type AssessmentItemWithFeedbackBlocks<E extends readonly string[]> = Omit<
	AssessmentItem<E, FeedbackPlanAny>,
	"feedback"
> & {
	feedbackBlocks: Record<string, FeedbackContent<E>>
}

export type CombinationEncoding = {
	choiceWeights: Record<string, number>
	keyMasks: Record<string, number>
	maxMask: number
}

export function deriveCombinationEncodings(
	feedbackPlan: FeedbackPlanAny
): Map<string, CombinationEncoding> {
	const encodings = new Map<string, CombinationEncoding>()

	for (const dimension of feedbackPlan.dimensions) {
		if (dimension.kind !== "combination") continue

		const choiceWeights: Record<string, number> = {}
		let maxMask = 0
		dimension.choices.forEach((choiceId, index) => {
			const weight = 1 << index
			choiceWeights[choiceId] = weight
			maxMask += weight
		})

		const keyMasks: Record<string, number> = {}
		for (const key of dimension.keys) {
			const choiceIds = parseCombinationKey(key, dimension.responseIdentifier)
			let mask = 0
			for (const choiceId of choiceIds) {
				const weight = choiceWeights[choiceId]
				if (weight === undefined) {
					logger.error("combination key references unknown choice", {
						responseIdentifier: dimension.responseIdentifier,
						key,
						choiceId
					})
					throw errors.new(
						`combination key '${key}' references unknown choice '${choiceId}'`
					)
				}
				mask += weight
			}
			keyMasks[key] = mask
		}
		encodings.set(dimension.responseIdentifier, {
			choiceWeights,
			keyMasks,
			maxMask
		})
	}

	return encodings
}

function buildMultipleIdentifierMatch(
	responseIdentifier: string,
	choiceIds: readonly string[]
): string {
	const escapedId = escapeXmlAttribute(responseIdentifier)
	const baseValues = choiceIds
		.map(
			(choiceId) => `
                    <qti-base-value base-type="identifier">${escapeXmlAttribute(choiceId)}</qti-base-value>`
		)
		.join("")

	return `
            <qti-match>
                <qti-variable identifier="${escapedId}"/>
                <qti-multiple>${baseValues}
                </qti-multiple>
            </qti-match>`
}

function buildCorrectComparison<E extends readonly string[]>(
	item: AssessmentItemWithFeedbackBlocks<E>,
	responseIdentifier: string
): string {
	const escapedId = escapeXmlAttribute(responseIdentifier)
	const decl = item.responseDeclarations.find(
		(d) => d.identifier === responseIdentifier
	)

	if (!decl) {
		logger.error("response declaration not found for comparison", {
			responseIdentifier
		})
		return `<qti-match><qti-variable identifier="${escapedId}"/><qti-correct identifier="${escapedId}"/></qti-match>`
	}

	if (decl.cardinality === "multiple" && decl.baseType === "identifier") {
		if (!Array.isArray(decl.correct)) {
			logger.error(
				"multiple identifier response missing array of correct values",
				{
					identifier: decl.identifier
				}
			)
			throw errors.new(
				`multiple response '${decl.identifier}' must list correct identifiers`
			)
		}

		const choiceIds = decl.correct.map((value) => {
			if (typeof value !== "string" || value.trim() === "") {
				logger.error("invalid correct identifier for multiple response", {
					identifier: decl.identifier,
					value
				})
				throw errors.new(
					`correct identifiers for '${decl.identifier}' must be non-empty strings`
				)
			}
			return value.trim()
		})

		const uniqueIds = new Set(choiceIds)
		if (uniqueIds.size !== choiceIds.length) {
			logger.error("duplicate identifiers in multiple correct response", {
				identifier: decl.identifier,
				choiceIds
			})
			throw errors.new(
				`correct response for '${decl.identifier}' must not repeat identifiers`
			)
		}

		return buildMultipleIdentifierMatch(decl.identifier, choiceIds)
	}

	if (decl.cardinality === "single") {
		if (decl.baseType === "float") {
			const { rounding } = decl
			const roundingMode =
				rounding.strategy === "decimalPlaces"
					? "decimalPlaces"
					: "significantFigures"
			const figures = String(rounding.figures)
			return `<qti-equal-rounded rounding-mode="${escapeXmlAttribute(roundingMode)}" figures="${escapeXmlAttribute(figures)}">
                <qti-variable identifier="${escapedId}"/>
                <qti-correct identifier="${escapedId}"/>
            </qti-equal-rounded>`
		}

		if (decl.baseType === "integer") {
			return `<qti-equal>
                <qti-variable identifier="${escapedId}"/>
                <qti-correct identifier="${escapedId}"/>
            </qti-equal>`
		}
	}

	return `<qti-match><qti-variable identifier="${escapedId}"/><qti-correct identifier="${escapedId}"/></qti-match>`
}

function parseCombinationKey(
	key: string,
	responseIdentifier: string
): readonly string[] {
	if (key === "NONE") {
		return [] as const
	}

	const rawSegments = key.split("__")
	if (rawSegments.length === 0) {
		logger.error("empty combination key encountered", {
			responseIdentifier
		})
		throw errors.new(
			`combination key for '${responseIdentifier}' must contain at least one choice`
		)
	}

	const segments: string[] = []
	for (const segment of rawSegments) {
		const trimmed = segment.trim()
		if (!trimmed) {
			logger.error("invalid blank segment in combination key", {
				responseIdentifier,
				key
			})
			throw errors.new(
				`combination key '${key}' for '${responseIdentifier}' contains an empty segment`
			)
		}
		segments.push(trimmed)
	}

	return segments
}

function buildCombinationBitmaskPredicate(
	responseIdentifier: string,
	key: string,
	encoding: CombinationEncoding
): string {
	const escapedId = escapeXmlAttribute(responseIdentifier)
	const mask = encoding.keyMasks[key]
	if (mask === undefined) {
		logger.error("missing combination mask for key", {
			responseIdentifier,
			key
		})
		throw errors.new(
			`internal error: missing combination mask for '${responseIdentifier}' key '${key}'`
		)
	}

	return `
            <qti-equal>
                <qti-map-response identifier="${escapedId}"/>
                <qti-base-value base-type="float">${mask.toString()}</qti-base-value>
            </qti-equal>`
}

export function compileResponseDeclarations<E extends readonly string[]>(
	decls: AssessmentItem<E, FeedbackPlanAny>["responseDeclarations"],
	combinationEncodings: Map<string, CombinationEncoding> = new Map()
): string {
	return decls
		.map((decl): string => {
			const formatCorrectValue = (value: unknown): string => {
				if (decl.baseType === "integer" || decl.baseType === "float") {
					if (typeof value !== "number") {
						logger.error("numeric response has non-number correct value", {
							identifier: decl.identifier,
							baseType: decl.baseType,
							value
						})
						throw errors.new(
							`numeric response correct value must be a number for ${decl.identifier}`
						)
					}
					return value.toString()
				}

				return String(value)
			}

			// Handle directedPair base type separately
			if (decl.baseType === "directedPair") {
				// Type narrowing: when baseType is "directedPair", correct is an array of {source, target} objects
				// Using type guard to safely access the correct property structure
				if (!Array.isArray(decl.correct)) {
					logger.error("directedPair response missing array", {
						identifier: decl.identifier,
						correctType: typeof decl.correct
					})
					throw errors.new(
						"directedPair response must have array of correct values"
					)
				}
				const pairs = decl.correct
				const correctXml = pairs
					.map((p: unknown): string => {
						if (typeof p !== "object" || p === null) {
							logger.error("invalid directedPair correct value", {
								identifier: decl.identifier,
								value: p
							})
							throw errors.new("invalid directedPair correct value structure")
						}
						const sourceDesc = Object.getOwnPropertyDescriptor(p, "source")
						const targetDesc = Object.getOwnPropertyDescriptor(p, "target")
						if (!sourceDesc || !targetDesc) {
							logger.error("invalid directedPair correct value", {
								identifier: decl.identifier,
								value: p
							})
							throw errors.new("invalid directedPair correct value structure")
						}
						const source = String(sourceDesc.value)
						const target = String(targetDesc.value)
						return `<qti-value>${escapeXmlAttribute(source)} ${escapeXmlAttribute(target)}</qti-value>`
					})
					.join("\n            ")

				// Add mapping for partial credit (1 point per correct association)
				const mappingXml = pairs
					.map((p: unknown): string => {
						if (typeof p !== "object" || p === null) {
							logger.error("invalid directedPair value for mapping", {
								identifier: decl.identifier,
								value: p
							})
							throw errors.new("invalid directedPair correct value for mapping")
						}
						const sourceDesc = Object.getOwnPropertyDescriptor(p, "source")
						const targetDesc = Object.getOwnPropertyDescriptor(p, "target")
						if (!sourceDesc || !targetDesc) {
							logger.error("invalid directedPair value for mapping", {
								identifier: decl.identifier,
								value: p
							})
							throw errors.new("invalid directedPair correct value for mapping")
						}
						const source = String(sourceDesc.value)
						const target = String(targetDesc.value)
						return `\n            <qti-map-entry map-key="${escapeXmlAttribute(source)} ${escapeXmlAttribute(target)}" mapped-value="1"/>`
					})
					.join("")

				return `\n    <qti-response-declaration identifier="${escapeXmlAttribute(
					decl.identifier
				)}" cardinality="${escapeXmlAttribute(decl.cardinality)}" base-type="directedPair">
        <qti-correct-response>
            ${correctXml}
        </qti-correct-response>
        <qti-mapping lower-bound="0" upper-bound="${pairs.length}" default-value="0">${mappingXml}
        </qti-mapping>
    </qti-response-declaration>`
			}

			// Handle other base types (original code)
			const correctValues = Array.isArray(decl.correct)
				? decl.correct
				: [decl.correct]

			// Directly map the provided correct values without generating any alternatives.
			const correctXml = correctValues
				.map(
					(v: unknown): string =>
						`<qti-value>${formatCorrectValue(v)
							.replace(/&/g, "&amp;")
							.replace(/</g, "&lt;")
							.replace(/>/g, "&gt;")}</qti-value>`
				)
				.join("\n            ")

			let xml = `\n    <qti-response-declaration identifier="${escapeXmlAttribute(
				decl.identifier
			)}" cardinality="${escapeXmlAttribute(decl.cardinality)}" base-type="${escapeXmlAttribute(decl.baseType)}">
        <qti-correct-response>
            ${correctXml}
        </qti-correct-response>`

			const combinationEncoding = combinationEncodings.get(decl.identifier)
			if (
				combinationEncoding &&
				decl.cardinality === "multiple" &&
				decl.baseType === "identifier"
			) {
				const mappingEntries = Object.entries(combinationEncoding.choiceWeights)
					.map(
						([choiceId, weight]) =>
							`\n            <qti-map-entry map-key="${escapeXmlAttribute(choiceId)}" mapped-value="${weight.toString()}"/>`
					)
					.join("")
				xml += `\n        <qti-mapping default-value="0" lower-bound="0" upper-bound="${combinationEncoding.maxMask.toString()}">${mappingEntries}
        </qti-mapping>`
			}

			// For single-cardinality responses, also emit a mapping that awards 1 point.
			const isSingleResponse =
				decl.cardinality === "single" &&
				(decl.baseType === "string" ||
					decl.baseType === "integer" ||
					decl.baseType === "float")
			if (isSingleResponse) {
				const mappingXml = correctValues
					.map((v: unknown): string => {
						const key =
							typeof v === "string" || typeof v === "number"
								? formatCorrectValue(v)
								: ""
						return `\n            <qti-map-entry map-key="${escapeXmlAttribute(key)}" mapped-value="1"/>`
					})
					.join("")

				xml += `\n        <qti-mapping default-value="0">${mappingXml}\n        </qti-mapping>`
			}

			xml += "\n    </qti-response-declaration>"
			return xml
		})
		.join("")
}

function generateComboModeProcessing<E extends readonly string[]>(
	item: AssessmentItemWithFeedbackBlocks<E>,
	combinationEncodings: Map<string, CombinationEncoding>
): string {
	const { dimensions, combinations } = item.feedbackPlan

	function buildConditionTree(
		dims: readonly FeedbackDimension[],
		pathSegments: Array<{ responseIdentifier: string; key: string }>
	): string {
		if (dims.length === 0) {
			const matchingCombo = combinations.find((combo) => {
				if (combo.path.length !== pathSegments.length) return false
				return combo.path.every(
					(seg, index) =>
						seg.responseIdentifier === pathSegments[index].responseIdentifier &&
						seg.key === pathSegments[index].key
				)
			})
			if (!matchingCombo) {
				logger.error("no combination found for path", { pathSegments })
				throw errors.new("no combination found for path")
			}
			return `
            <qti-set-outcome-value identifier="FEEDBACK__OVERALL">
                <qti-base-value base-type="identifier">${escapeXmlAttribute(matchingCombo.id)}</qti-base-value>
            </qti-set-outcome-value>`
		}

		const [currentDim] = dims
		if (!currentDim) {
			logger.error("unexpected empty dimension in condition tree")
			throw errors.new("unexpected empty dimension")
		}
		const restDims = dims.slice(1)
		const responseId = escapeXmlAttribute(currentDim.responseIdentifier)

		switch (currentDim.kind) {
			case "enumerated": {
				const conditions = currentDim.keys
					.map((key, index): string => {
						const tag = index === 0 ? "qti-response-if" : "qti-response-else-if"
						const choiceId = escapeXmlAttribute(key)
						const newPathSegments = [
							...pathSegments,
							{ responseIdentifier: currentDim.responseIdentifier, key }
						]
						const innerContent = buildConditionTree(restDims, newPathSegments)

						return `
        <${tag}>
            <qti-match>
                <qti-variable identifier="${responseId}"/>
                <qti-base-value base-type="identifier">${choiceId}</qti-base-value>
            </qti-match>${innerContent}
        </${tag}>`
					})
					.join("")
				return `
    <qti-response-condition>${conditions}
    </qti-response-condition>`
			}
			case "combination": {
				const encoding = combinationEncodings.get(currentDim.responseIdentifier)
				if (!encoding) {
					logger.error("missing combination encoding", {
						responseIdentifier: currentDim.responseIdentifier
					})
					throw errors.new(
						`internal error: missing combination encoding for '${currentDim.responseIdentifier}'`
					)
				}

				const allowedChoices = new Set<string>(currentDim.choices)
				const conditions = currentDim.keys
					.map((key, index) => {
						const tag = index === 0 ? "qti-response-if" : "qti-response-else-if"
						const choiceIds = parseCombinationKey(
							key,
							currentDim.responseIdentifier
						)
						const uniqueChoiceCount = new Set(choiceIds).size
						if (uniqueChoiceCount !== choiceIds.length) {
							logger.error("combination key includes duplicate choices", {
								responseIdentifier: currentDim.responseIdentifier,
								key,
								choiceIds
							})
							throw errors.new(
								`combination key '${key}' contains duplicate choices for '${currentDim.responseIdentifier}'`
							)
						}
						if (
							choiceIds.length < currentDim.minSelections ||
							choiceIds.length > currentDim.maxSelections
						) {
							logger.error("combination key outside selection bounds", {
								responseIdentifier: currentDim.responseIdentifier,
								key,
								length: choiceIds.length,
								minSelections: currentDim.minSelections,
								maxSelections: currentDim.maxSelections
							})
							throw errors.new(
								`combination key '${key}' violates selection bounds for '${currentDim.responseIdentifier}'`
							)
						}
						for (const choiceId of choiceIds) {
							if (!allowedChoices.has(choiceId)) {
								logger.error("combination key references unknown choice", {
									responseIdentifier: currentDim.responseIdentifier,
									key,
									choiceId
								})
								throw errors.new(
									`combination key '${key}' references unknown choice '${choiceId}' for '${currentDim.responseIdentifier}'`
								)
							}
						}
						const predicate = buildCombinationBitmaskPredicate(
							currentDim.responseIdentifier,
							key,
							encoding
						)
						const newPathSegments = [
							...pathSegments,
							{ responseIdentifier: currentDim.responseIdentifier, key }
						]
						const innerContent = buildConditionTree(restDims, newPathSegments)

						return `
        <${tag}>${predicate}${innerContent}
        </${tag}>`
					})
					.join("")
				return `
    <qti-response-condition>${conditions}
    </qti-response-condition>`
			}
			case "binary": {
				const correctPath = [
					...pathSegments,
					{ responseIdentifier: currentDim.responseIdentifier, key: "CORRECT" }
				]
				const incorrectPath = [
					...pathSegments,
					{
						responseIdentifier: currentDim.responseIdentifier,
						key: "INCORRECT"
					}
				]
				const correctBranch = buildConditionTree(restDims, correctPath)
				const incorrectBranch = buildConditionTree(restDims, incorrectPath)
				const correctComparison = buildCorrectComparison(
					item,
					currentDim.responseIdentifier
				)

				return `
    <qti-response-condition>
        <qti-response-if>
            ${correctComparison}${correctBranch}
        </qti-response-if>
        <qti-response-else>${incorrectBranch}
        </qti-response-else>
    </qti-response-condition>`
			}
		}
	}

	return buildConditionTree(dimensions, [])
}

export function compileResponseProcessing<E extends readonly string[]>(
	item: AssessmentItemWithFeedbackBlocks<E>,
	combinationEncodings: Map<string, CombinationEncoding>
): string {
	const processingRules: string[] = []
	const { feedbackPlan } = item

	logger.info("compiling response processing", {
		itemIdentifier: item.identifier,
		dimensionCount: feedbackPlan.dimensions.length
	})

	processingRules.push(generateComboModeProcessing(item, combinationEncodings))

	const scoreComparisons = item.responseDeclarations.map((decl): string =>
		buildCorrectComparison(item, decl.identifier)
	)

	if (scoreComparisons.length > 0) {
		const rawPredicate =
			scoreComparisons.length === 1
				? scoreComparisons[0]
				: `<qti-and>
                ${scoreComparisons.join("\n                ")}
            </qti-and>`
		const indentedPredicate = rawPredicate
			.trim()
			.split("\n")
			.map((line) => `            ${line}`)
			.join("\n")

		processingRules.push(`
    <qti-response-condition>
        <qti-response-if>
${indentedPredicate}
            <qti-set-outcome-value identifier="SCORE"><qti-base-value base-type="float">1.0</qti-base-value></qti-set-outcome-value>
        </qti-response-if>
        <qti-response-else>
            <qti-set-outcome-value identifier="SCORE"><qti-base-value base-type="float">0.0</qti-base-value></qti-set-outcome-value>
        </qti-response-else>
    </qti-response-condition>`)
	}

	return `
    <qti-response-processing>
        ${processingRules.join("\n")}
    </qti-response-processing>`
}
