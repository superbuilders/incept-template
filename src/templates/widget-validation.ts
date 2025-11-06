import * as ts from "typescript"
import type { TypeScriptDiagnostic } from "@/templates/types"

function createDiagnostic(
	sourceFile: ts.SourceFile,
	node: ts.Node | undefined,
	message: string
): TypeScriptDiagnostic {
	const pos = node ? node.getStart(sourceFile) : 0
	const { line, character } = sourceFile.getLineAndCharacterOfPosition(pos)
	return {
		message,
		line: line + 1,
		column: character + 1,
		tsCode: 9001
	}
}

function extractTupleStrings(typeNode: ts.TypeNode): string[] | null {
	let tuple: ts.TupleTypeNode | null = null
	if (
		ts.isTypeOperatorNode(typeNode) &&
		typeNode.operator === ts.SyntaxKind.ReadonlyKeyword
	) {
		if (ts.isTupleTypeNode(typeNode.type)) {
			tuple = typeNode.type
		}
	} else if (ts.isTupleTypeNode(typeNode)) {
		tuple = typeNode
	}

	if (!tuple) return null

	const values: string[] = []
	for (const element of tuple.elements) {
		if (
			!ts.isLiteralTypeNode(element) ||
			!ts.isStringLiteral(element.literal)
		) {
			return null
		}
		values.push(element.literal.text)
	}
	return values
}

export function validateTemplateWidgets(
	source: string,
	allowedWidgets: readonly string[]
): TypeScriptDiagnostic | null {
	const sourceFile = ts.createSourceFile(
		"template.ts",
		source,
		ts.ScriptTarget.ESNext,
		true,
		ts.ScriptKind.TS
	)

	const expectedSet = new Set(allowedWidgets)
	let aliasDeclaration: ts.TypeAliasDeclaration | undefined

	for (const statement of sourceFile.statements) {
		if (
			ts.isTypeAliasDeclaration(statement) &&
			statement.name.text === "TemplateWidgets"
		) {
			aliasDeclaration = statement
			break
		}
	}

	if (!aliasDeclaration) {
		return createDiagnostic(
			sourceFile,
			sourceFile,
			"Template must declare `export type TemplateWidgets = readonly [...]` matching the allowed widgets."
		)
	}

	const tupleValues = extractTupleStrings(aliasDeclaration.type)
	if (!tupleValues) {
		return createDiagnostic(
			sourceFile,
			aliasDeclaration.type,
			'TemplateWidgets must be a readonly tuple of string literals (e.g., readonly ["partitionedShape"]).'
		)
	}

	const actualSet = new Set(tupleValues)

	const missing = Array.from(expectedSet).filter(
		(value) => !actualSet.has(value)
	)
	if (missing.length > 0) {
		return createDiagnostic(
			sourceFile,
			aliasDeclaration.type,
			`TemplateWidgets is missing required widget types: ${missing.join(", ")}`
		)
	}

	const extra = Array.from(actualSet).filter((value) => !expectedSet.has(value))
	if (extra.length > 0) {
		return createDiagnostic(
			sourceFile,
			aliasDeclaration.type,
			`TemplateWidgets includes unsupported widget types: ${extra.join(", ")}`
		)
	}

	return null
}

export function validateNoNonNullAssertions(
	source: string
): TypeScriptDiagnostic | null {
	const sourceFile = ts.createSourceFile(
		"template.ts",
		source,
		ts.ScriptTarget.ESNext,
		true,
		ts.ScriptKind.TS
	)

	let violation: ts.NonNullExpression | undefined

	const visit = (node: ts.Node): void => {
		if (violation) return
		if (ts.isNonNullExpression(node)) {
			violation = node
			return
		}
		node.forEachChild(visit)
	}

	visit(sourceFile)

	if (!violation) return null

	return createDiagnostic(
		sourceFile,
		violation,
		"Avoid non-null assertions (`!`). Use runtime guards or explicit error handling instead."
	)
}

export function validateNoTypeAssertions(
	source: string
): TypeScriptDiagnostic | null {
	const sourceFile = ts.createSourceFile(
		"template.ts",
		source,
		ts.ScriptTarget.ESNext,
		true,
		ts.ScriptKind.TS
	)

	let violation: ts.AsExpression | ts.TypeAssertion | undefined

	const visit = (node: ts.Node): void => {
		if (violation) return

		if (ts.isTypeAssertionExpression(node)) {
			violation = node
			return
		}

		if (ts.isAsExpression(node)) {
			const typeText = node.type.getText(sourceFile)
			if (typeText !== "const") {
				violation = node
				return
			}
		}

		node.forEachChild(visit)
	}

	visit(sourceFile)

	if (!violation) return null

	return createDiagnostic(
		sourceFile,
		violation,
		"Avoid type assertions (`as`). Use runtime guards or `satisfies` instead."
	)
}
