import { pgTable, text, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const currentlyBuildingTable = pgTable("currently_building", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  category: text("category").notNull(),
  iconName: text("icon_name"),
  items: json("items").$type<string[]>(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCurrentlyBuildingSchema = createInsertSchema(currentlyBuildingTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCurrentlyBuilding = z.infer<typeof insertCurrentlyBuildingSchema>;
export type CurrentlyBuilding = typeof currentlyBuildingTable.$inferSelect;
