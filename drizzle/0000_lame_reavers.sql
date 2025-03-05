CREATE TABLE IF NOT EXISTS "goal-getter_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"date" date NOT NULL,
	"description" text NOT NULL,
	"duration" integer,
	"impact" text,
	"related_goal_ids" json,
	"ai_analysis" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-getter_career_paths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"current_job_title" varchar(256),
	"current_job_description" text,
	"current_job_responsibilities" text,
	"current_job_skills" text,
	"next_level_job_title" varchar(256),
	"next_level_job_description" text,
	"next_level_job_responsibilities" text,
	"next_level_job_skills" text,
	"gap_analysis" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-getter_chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"role" varchar(20) NOT NULL,
	"content" text NOT NULL,
	"metadata" json,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-getter_chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar(256),
	"summary" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-getter_goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" text,
	"category" varchar(100),
	"target_date" date,
	"is_completed" boolean DEFAULT false,
	"progress" integer DEFAULT 0,
	"priority" varchar(50),
	"alignment_to_promotion" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-getter_peer_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"provided_by" varchar(256),
	"provided_by_role" varchar(256),
	"feedback" text NOT NULL,
	"strengths" text,
	"areas_for_improvement" text,
	"review_id" uuid,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-getter_progress_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"report_date" date NOT NULL,
	"period_start" date,
	"period_end" date,
	"summary" text NOT NULL,
	"goals_progress" json,
	"key_achievements" text,
	"challenges" text,
	"next_steps_focus" text,
	"ai_insights" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-getter_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"review_date" date NOT NULL,
	"review_period_start" date,
	"review_period_end" date,
	"self_assessment" text,
	"manager_feedback" text,
	"strengths" text,
	"areas_for_improvement" text,
	"overall_rating" varchar(50),
	"next_steps" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-getter_users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar(256),
	"job_title" varchar(256),
	"department" varchar(256),
	"job_level" varchar(100),
	"manager" varchar(256),
	"start_date" date,
	"last_review_date" date,
	"next_review_date" date,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "goal-getter_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-getter_activities" ADD CONSTRAINT "goal-getter_activities_user_id_goal-getter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."goal-getter_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-getter_career_paths" ADD CONSTRAINT "goal-getter_career_paths_user_id_goal-getter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."goal-getter_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-getter_chat_messages" ADD CONSTRAINT "goal-getter_chat_messages_session_id_goal-getter_chat_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."goal-getter_chat_sessions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-getter_chat_sessions" ADD CONSTRAINT "goal-getter_chat_sessions_user_id_goal-getter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."goal-getter_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-getter_goals" ADD CONSTRAINT "goal-getter_goals_user_id_goal-getter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."goal-getter_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-getter_peer_feedback" ADD CONSTRAINT "goal-getter_peer_feedback_user_id_goal-getter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."goal-getter_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-getter_peer_feedback" ADD CONSTRAINT "goal-getter_peer_feedback_review_id_goal-getter_reviews_id_fk" FOREIGN KEY ("review_id") REFERENCES "public"."goal-getter_reviews"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-getter_progress_reports" ADD CONSTRAINT "goal-getter_progress_reports_user_id_goal-getter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."goal-getter_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-getter_reviews" ADD CONSTRAINT "goal-getter_reviews_user_id_goal-getter_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."goal-getter_users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
