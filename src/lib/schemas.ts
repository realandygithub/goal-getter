import { z } from "zod";
import type { InferSelectModel } from "drizzle-orm";
import type { goals, activities } from "~/server/db/schema";

// Use Drizzle's type inference for database models
export type DbGoal = InferSelectModel<typeof goals>;
export type DbActivity = InferSelectModel<typeof activities>;

// Goal progress analysis schema (for AI responses)
export const goalProgressSchema = z.object({
  goal: z.string(),
  impact: z.enum(["High", "Medium", "Low"]),
  analysis: z.string(),
});

export type GoalProgress = z.infer<typeof goalProgressSchema>;

// Journal analysis schema (for AI responses)
export const journalAnalysisSchema = z.object({
  summary: z.string(),
  goalProgress: z.array(goalProgressSchema),
  insights: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export type JournalAnalysis = z.infer<typeof journalAnalysisSchema>;

// Journal entry schema (for API requests)
export const journalEntrySchema = z.object({
  content: z.string().min(1, "Journal entry content is required"),
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;

// API response schemas
export const journalAnalysisResponseSchema = z.object({
  success: z.boolean(),
  analysis: journalAnalysisSchema,
});

export const errorResponseSchema = z.object({
  error: z.string(),
});

export type JournalAnalysisResponse = z.infer<
  typeof journalAnalysisResponseSchema
>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
