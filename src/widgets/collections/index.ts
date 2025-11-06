import { allWidgetsCollection } from "@/widgets/collections/all"
import { fourthGradeMathCollection } from "@/widgets/collections/fourth-grade-math"
import { mathCoreCollection } from "@/widgets/collections/math-core"
import { scienceCollection } from "@/widgets/collections/science"
import { simpleVisualCollection } from "@/widgets/collections/simple-visual"
import { teksMath4Collection } from "@/widgets/collections/teks-math-4"

export const widgetCollections: {
	readonly all: typeof allWidgetsCollection
	readonly science: typeof scienceCollection
	readonly "simple-visual": typeof simpleVisualCollection
	readonly "fourth-grade-math": typeof fourthGradeMathCollection
	readonly "teks-math-4": typeof teksMath4Collection
	readonly "math-core": typeof mathCoreCollection
} = {
	all: allWidgetsCollection,
	science: scienceCollection,
	"simple-visual": simpleVisualCollection,
	"fourth-grade-math": fourthGradeMathCollection,
	"teks-math-4": teksMath4Collection,
	"math-core": mathCoreCollection
}

export type { WidgetCollection } from "@/widgets/collections/types"
