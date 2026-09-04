import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const footerLinksTable = pgTable("footer_links", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  label: text("label").notNull(),
  href: text("href").notNull(),
  section: text("section").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFooterLinkSchema = createInsertSchema(footerLinksTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFooterLink = z.infer<typeof insertFooterLinkSchema>;
export type FooterLink = typeof footerLinksTable.$inferSelect;
