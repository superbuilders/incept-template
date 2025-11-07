import * as errors from "@superbuilders/errors"
import * as logger from "@superbuilders/slog"
import { compile } from "@/compiler/compiler"
import generateQuestion, {
	type TemplateWidgets
} from "@/templates/prompts/examples/positive/templates/fraction-addition"
import { allWidgetsCollection } from "@/widgets/collections/all"
import { createSubsetCollection } from "@/widgets/collections/subset"

async function main() {
	// Create a subset collection containing only the widgets used by this template
	const templateWidgetTypes: TemplateWidgets = ["partitionedShape"]
	const templateCollection = createSubsetCollection(
		allWidgetsCollection,
		templateWidgetTypes
	)
	logger.info("starting template poc test")

	const exampleSeeds = [
		123n,
		456n,
		789n,
		101112n,
		131415n,
		161718n,
		192021n,
		222324n,
		252627n
	]

	for (const seed of exampleSeeds) {
		logger.info("generating example from seed", { seed: seed.toString() })

		const itemInputResult = errors.trySync(() => generateQuestion(seed))
		if (itemInputResult.error) {
			logger.error("template function failed", {
				seed: seed.toString(),
				error: itemInputResult.error
			})
			throw errors.wrap(itemInputResult.error, "template generation")
		}
		const assessmentItemInput = itemInputResult.data
		logger.info("generated assessmentiteminput", {
			seed: seed.toString(),
			identifier: assessmentItemInput.identifier,
			title: assessmentItemInput.title
		})

		const compileResult = await errors.try(
			compile(assessmentItemInput, templateCollection)
		)
		if (compileResult.error) {
			logger.error("qti compilation failed", {
				seed: seed.toString(),
				error: compileResult.error
			})
			throw errors.wrap(compileResult.error, "compilation")
		}
		const qtiXml = compileResult.data
		logger.info("successfully compiled qti xml", { seed: seed.toString() })
		logger.info("generated qti xml", {
			seed: seed.toString(),
			xml: qtiXml,
			separator: "========================================"
		})
	}

	logger.info("template poc succeeded for all seeds")
}

// Execute the main function and handle potential errors at the top level.
const result = await errors.try(main())
if (result.error) {
	logger.error("template poc script failed", { error: result.error })
	process.exit(1)
}
