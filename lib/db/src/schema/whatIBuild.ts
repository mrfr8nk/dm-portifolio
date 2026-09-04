import { pgTable, text, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const whatIBuildTable = pgTable("what_i_build", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  purpose: text("purpose").notNull(),
  impact: text("impact"),
  iconName: text("icon_name"),
  tech: json("tech").$type<string[]>(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertWhatIBuildSchema = createInsertSchema(whatIBuildTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWhatIBuild = z.infer<typeof insertWhatIBuildSchema>;
export type WhatIBuild = typeof whatIBuildTable.$inferSelect;
