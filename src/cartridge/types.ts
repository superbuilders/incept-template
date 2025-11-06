export type ResourceArticle = {
	id: string
	title: string
	type: "article"
	path: string
}
export type ResourceVideo = {
	id: string
	title: string
	type: "video"
	path: string
	youtubeId: string
	durationSeconds: number
	description: string
}
export type QuestionRef = { number: number; xml: string; json: string }
export type ResourceQuiz = {
	id: string
	title: string
	type: "quiz"
	path: string
	questionCount: number
	questions: QuestionRef[]
}
export type Resource = ResourceArticle | ResourceVideo | ResourceQuiz

export type Lesson = {
	id: string
	unitId: string
	lessonNumber: number
	title: string
	resources: Array<ResourceArticle | ResourceVideo | ResourceQuiz>
}

export type UnitTest = {
	id: string
	title: string
	path: string
	questionCount: number
	questions: QuestionRef[]
}

export type Unit = {
	id: string
	unitNumber: number
	title: string
	lessons: Array<{
		id: string
		lessonNumber: number
		title: string
		path: string
	}>
	unitTest?: UnitTest
	counts: { lessonCount: number; resourceCount: number; questionCount: number }
}

export type IndexV1 = {
	version: 1
	generatedAt: string
	generator: { name: string; version: string; commit?: string }
	course: { title: string; subject: string }
	units: Array<{ id: string; unitNumber: number; title: string; path: string }>
}

export type IntegrityEntry = { size: number; sha256: string }
export type IntegrityManifest = {
	algorithm: "sha256"
	files: Record<string, IntegrityEntry>
}
