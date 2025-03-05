// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  text,
  boolean,
  date,
  json,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `goal-getter_${name}`);

export const users = createTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  name: varchar("name", { length: 256 }),
  jobTitle: varchar("job_title", { length: 256 }),
  department: varchar("department", { length: 256 }),
  jobLevel: varchar("job_level", { length: 100 }),
  manager: varchar("manager", { length: 256 }),
  startDate: date("start_date"),
  lastReviewDate: date("last_review_date"),
  nextReviewDate: date("next_review_date"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const careerPaths = createTable("career_paths", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  currentJobTitle: varchar("current_job_title", { length: 256 }),
  currentJobDescription: text("current_job_description"),
  currentJobResponsibilities: text("current_job_responsibilities"),
  currentJobSkills: text("current_job_skills"),
  nextLevelJobTitle: varchar("next_level_job_title", { length: 256 }),
  nextLevelJobDescription: text("next_level_job_description"),
  nextLevelJobResponsibilities: text("next_level_job_responsibilities"),
  nextLevelJobSkills: text("next_level_job_skills"),
  gapAnalysis: text("gap_analysis"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const goals = createTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }), // e.g., "Technical", "Leadership", "Communication"
  targetDate: date("target_date"),
  isCompleted: boolean("is_completed").default(false),
  progress: integer("progress").default(0), // 0-100 percentage
  priority: varchar("priority", { length: 50 }), // "High", "Medium", "Low"
  alignmentToPromotion: text("alignment_to_promotion"), // How this goal aligns with promotion criteria
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const activities = createTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  description: text("description").notNull(),
  duration: integer("duration"), // in minutes
  impact: text("impact"), // impact of this activity
  relatedGoalIds: json("related_goal_ids").$type<string[]>(), // Array of goal IDs this activity relates to
  aiAnalysis: text("ai_analysis"), // AI-generated analysis of this activity
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const chatSessions = createTable("chat_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 256 }),
  summary: text("summary"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const chatMessages = createTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => chatSessions.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull(), // "user" or "assistant"
  content: text("content").notNull(),
  metadata: json("metadata").$type<Record<string, unknown>>(), // For storing additional data like references to goals, activities
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const reviews = createTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reviewDate: date("review_date").notNull(),
  reviewPeriodStart: date("review_period_start"),
  reviewPeriodEnd: date("review_period_end"),
  selfAssessment: text("self_assessment"),
  managerFeedback: text("manager_feedback"),
  strengths: text("strengths"),
  areasForImprovement: text("areas_for_improvement"),
  overallRating: varchar("overall_rating", { length: 50 }),
  nextSteps: text("next_steps"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const peerFeedback = createTable("peer_feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  providedBy: varchar("provided_by", { length: 256 }),
  providedByRole: varchar("provided_by_role", { length: 256 }),
  feedback: text("feedback").notNull(),
  strengths: text("strengths"),
  areasForImprovement: text("areas_for_improvement"),
  reviewId: uuid("review_id").references(() => reviews.id), // Optional link to a specific review cycle
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const progressReports = createTable("progress_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reportDate: date("report_date").notNull(),
  periodStart: date("period_start"),
  periodEnd: date("period_end"),
  summary: text("summary").notNull(),
  goalsProgress: json("goals_progress").$type<Record<string, number>>(), // Goal ID to progress percentage
  keyAchievements: text("key_achievements"),
  challenges: text("challenges"),
  nextStepsFocus: text("next_steps_focus"),
  aiInsights: text("ai_insights"), // AI-generated insights about progress
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});
