import { sql } from "drizzle-orm"
import {
	check,
	customType,
	foreignKey,
	index,
	integer,
	jsonb,
	pgSchema,
	primaryKey,
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

export const templates = generatorSchema.table(
	"templates",
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

export const templateCandidates = generatorSchema.table(
	"template_candidates",
	{
		templateId: uuid("template_id").notNull(),
		attempt: integer("attempt").notNull(),
		source: text("source").notNull(),
		validatedAt: timestamp("validated_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow()
	},
	(table) => [
		primaryKey({
			name: "template_candidates_pk",
			columns: [table.templateId, table.attempt]
		}),
		index("template_candidates_template_created_idx").on(
			table.templateId,
			table.createdAt
		),
		check(
			"template_candidates_attempt_nonnegative",
			sql`${table.attempt} >= 0`
		),
		foreignKey({
			name: "template_candidates_template_fk",
			columns: [table.templateId],
			foreignColumns: [templates.id]
		})
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

export const templateCandidateExecutions = generatorSchema.table(
	"template_candidate_executions",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		templateId: uuid("template_id").notNull(),
		attempt: integer("attempt").notNull(),
		seed: bigintText("seed").notNull(),
		body: jsonb("body").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow()
	},
	(table) => [
		index("template_candidate_executions_template_attempt_idx").on(
			table.templateId,
			table.attempt
		),
		uniqueIndex("template_candidate_executions_seed_idx").on(
			table.templateId,
			table.attempt,
			table.seed
		),
		foreignKey({
			name: "template_candidate_executions_candidate_fk",
			columns: [table.templateId, table.attempt],
			foreignColumns: [
				templateCandidates.templateId,
				templateCandidates.attempt
			]
		}).onDelete("cascade"),
		check(
			"template_candidate_executions_seed_digits",
			sql`${table.seed} ~ '^[0-9]+$'`
		)
	]
)

export const candidateDiagnostics = generatorSchema.table(
	"template_candidate_diagnostics",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		templateId: uuid("template_id").notNull(),
		attempt: integer("attempt").notNull(),
		message: text("message").notNull(),
		line: integer("line").notNull(),
		column: integer("column").notNull(),
		tsCode: integer("ts_code").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow()
	},
	(table) => [
		index("template_candidate_diagnostics_template_attempt_idx").on(
			table.templateId,
			table.attempt
		),
		foreignKey({
			name: "template_candidate_diagnostics_candidate_fk",
			columns: [table.templateId, table.attempt],
			foreignColumns: [
				templateCandidates.templateId,
				templateCandidates.attempt
			]
		}).onDelete("cascade"),
		check(
			"template_candidate_diagnostics_line_positive",
			sql`${table.line} >= 1`
		),
		check(
			"template_candidate_diagnostics_column_positive",
			sql`${table.column} >= 1`
		),
		check(
			"template_candidate_diagnostics_ts_code_nonnegative",
			sql`${table.tsCode} >= 0`
		)
	]
)

export type TemplateCandidateExecutionRecord =
	typeof templateCandidateExecutions.$inferSelect
export type TemplateRecord = typeof templates.$inferSelect
export type TemplateCandidateRecord = typeof templateCandidates.$inferSelect
export type CandidateDiagnosticRecord = typeof candidateDiagnostics.$inferSelect
