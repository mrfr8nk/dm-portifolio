import { pgTable, text, timestamp, boolean, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const educationTable = pgTable("education", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  school: text("school").notNull(),
  level: text("level").notNull(),
  period: text("period").notNull(),
  description: text("description"),
  status: text("status"),
  iconName: text("icon_name"),
  isHighlight: boolean("is_highlight").default(false),
  results: json("results"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEducationSchema = createInsertSchema(educationTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof educationTable.$inferSelect;
