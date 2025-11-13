import { sql } from "drizzle-orm"
import {
	check,
	customType,
	foreignKey,
	index,
	integer,
	jsonb,
	pgSchema,
	text,
	timestamp,
	uniqueIndex,
	uuid
} from "drizzle-orm/pg-core"

/**
 * Drizzle schema for the template generation service.
 *
 * The schema currently models the template catalog that powers the generator
 * service. Tables live under the `generator` Postgres schema to keep the
 * application footprint isolated.
 */
export const generatorSchema = pgSchema("template")

export const exemplarQuestions = generatorSchema.table(
	"exemplar_questions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		allowedWidgets: text("allowed_widgets").array().notNull(),
		exampleAssessmentItemHash: text("example_assessment_item_hash").notNull(),
		exampleAssessmentItemBody: jsonb("example_assessment_item_body").notNull(),
		metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow()
	},
	(table) => [
		uniqueIndex("templates_example_assessment_item_hash_idx").on(
			table.exampleAssessmentItemHash
		)
	]
)

export const templates = generatorSchema.table(
	"templates",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		questionId: uuid("question_id").notNull(),
		source: text("source").notNull(),
		gitCommitSha: text("git_commit_sha"), // when in prod make this not null
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		typescriptRanAt: timestamp("typescript_ran_at", { withTimezone: true })
	},
	(table) => [
		index("templates_exemplar_question_created_idx").on(
			table.questionId,
			table.createdAt
		),
		foreignKey({
			name: "templates_exemplar_question_fk",
			columns: [table.questionId],
			foreignColumns: [exemplarQuestions.id]
		})
	]
)

export const annotatorRuns = generatorSchema.table(
	"annotator_runs",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		templateId: uuid("template_id").notNull(),
		notes: text("notes").notNull(),
		imageUrl: text("image_url").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow()
	},
	(table) => [
		index("annotator_runs_template_created_idx").on(
			table.templateId,
			table.createdAt
		),
		uniqueIndex("annotator_runs_template_unique").on(table.templateId),
		foreignKey({
			name: "annotator_runs_candidate_fk",
			columns: [table.templateId],
			foreignColumns: [templates.id]
		}).onDelete("cascade")
	]
)

const bigintText = customType<{ data: bigint; driverData: string }>({
	dataType() {
		return "text"
	},
	toDriver(value) {
		return value.toString()
	},
	fromDriver(value) {
		return BigInt(value)
	}
})

export const templateExecutions = generatorSchema.table(
	"template_executions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		templateId: uuid("template_id").notNull(),
		seed: bigintText("seed").notNull(),
		body: jsonb("body").notNull(),
		gitCommitSha: text("git_commit_sha"), // when in prod make this not null
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow()
	},
	(table) => [
		index("template_executions_template_idx").on(table.templateId),
		uniqueIndex("template_executions_seed_idx").on(
			table.templateId,
			table.seed
		),
		foreignKey({
			name: "template_executions_template_fk",
			columns: [table.templateId],
			foreignColumns: [templates.id]
		}).onDelete("cascade"),
		check("template_executions_seed_digits", sql`${table.seed} ~ '^[0-9]+$'`)
	]
)

export const typescriptDiagnostics = generatorSchema.table(
	"typescript_diagnostics",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		templateId: uuid("template_id").notNull(),
		message: text("message").notNull(),
		line: integer("line").notNull(),
		column: integer("column").notNull(),
		tsCode: integer("ts_code").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow()
	},
	(table) => [
		index("typescript_diagnostics_template_idx").on(table.templateId),
		foreignKey({
			name: "typescript_diagnostics_template_fk",
			columns: [table.templateId],
			foreignColumns: [templates.id]
		}).onDelete("cascade"),
		check("typescript_diagnostics_line_positive", sql`${table.line} >= 1`),
		check("typescript_diagnostics_column_positive", sql`${table.column} >= 1`),
		check(
			"typescript_diagnostics_ts_code_nonnegative",
			sql`${table.tsCode} >= 0`
		)
	]
)

export type TemplateExecutionRecord = typeof templateExecutions.$inferSelect
export type ExemplarQuestionRecord = typeof exemplarQuestions.$inferSelect
export type TemplateRecord = typeof templates.$inferSelect
export type TypeScriptDiagnosticRecord =
	typeof typescriptDiagnostics.$inferSelect
export type AnnotatorRunRecord = typeof annotatorRuns.$inferSelect
