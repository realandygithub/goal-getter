DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('data', 'user', 'assistant', 'system');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-getter_chat" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"userId" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "goal-getter_message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chatId" varchar NOT NULL,
	"role" "role" NOT NULL,
	"content" json NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "goal-getter_message" ADD CONSTRAINT "goal-getter_message_chatId_goal-getter_chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."goal-getter_chat"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
