// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  timestamp,
  varchar,
  json,
  uuid,
  text,
} from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `goal-getter_${name}`);

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
);

export const chat = createTable("chat", {
  id: varchar("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => nanoid()),
  title: text("title").notNull(),
  userId: varchar("userId").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const message = createTable("message", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: varchar("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});
