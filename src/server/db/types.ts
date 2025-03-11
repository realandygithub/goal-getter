import {
  type InferSelectModel,
  type InferInsertModel,
  type Table,
} from "drizzle-orm";
import type * as schema from "./schema";

// Automatically generate select types
type SelectSchema<T extends Record<string, Table>> = {
  [K in keyof T]: InferSelectModel<T[K]>;
};

// Automatically generate insert types
type InsertSchema<T extends Record<string, Table>> = {
  [K in keyof T]: InferInsertModel<T[K]>;
};

// Export all types at once
export type DB = SelectSchema<Omit<typeof schema, "createTable">>;
export type InsertDB = InsertSchema<Omit<typeof schema, "createTable">>;

// Individual type exports (optional)
export type Chat = DB["chat"];
export type Message = DB["message"];
