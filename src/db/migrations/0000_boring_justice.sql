CREATE SCHEMA "template";
--> statement-breakpoint
CREATE TABLE "template"."annotator_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"notes" text NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template"."exemplar_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"allowed_widgets" text[] NOT NULL,
	"example_assessment_item_hash" text NOT NULL,
	"example_assessment_item_body" jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template"."templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exemplar_question_id" uuid NOT NULL,
	"source" text NOT NULL,
	"created_git_commit_sha" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"typescript_passed_with_zero_diagnostics_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "template"."typescript_diagnostics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"message" text NOT NULL,
	"line" integer NOT NULL,
	"column" integer NOT NULL,
	"ts_code" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "typescript_diagnostics_line_positive" CHECK ("template"."typescript_diagnostics"."line" >= 1),
	CONSTRAINT "typescript_diagnostics_column_positive" CHECK ("template"."typescript_diagnostics"."column" >= 1),
	CONSTRAINT "typescript_diagnostics_ts_code_nonnegative" CHECK ("template"."typescript_diagnostics"."ts_code" >= 0)
);
--> statement-breakpoint
ALTER TABLE "template"."annotator_runs" ADD CONSTRAINT "annotator_runs_candidate_fk" FOREIGN KEY ("template_id") REFERENCES "template"."templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template"."templates" ADD CONSTRAINT "templates_exemplar_question_fk" FOREIGN KEY ("exemplar_question_id") REFERENCES "template"."exemplar_questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template"."typescript_diagnostics" ADD CONSTRAINT "typescript_diagnostics_template_fk" FOREIGN KEY ("template_id") REFERENCES "template"."templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "annotator_runs_template_created_idx" ON "template"."annotator_runs" USING btree ("template_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "annotator_runs_template_unique" ON "template"."annotator_runs" USING btree ("template_id");--> statement-breakpoint
CREATE UNIQUE INDEX "templates_example_assessment_item_hash_idx" ON "template"."exemplar_questions" USING btree ("example_assessment_item_hash");--> statement-breakpoint
CREATE INDEX "templates_exemplar_question_created_idx" ON "template"."templates" USING btree ("exemplar_question_id","created_at");--> statement-breakpoint
CREATE INDEX "typescript_diagnostics_template_idx" ON "template"."typescript_diagnostics" USING btree ("template_id");
