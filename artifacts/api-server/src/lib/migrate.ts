import pg from "pg";
import { collection } from "./mongo";

const { Pool } = pg;

const tables = [
  "site_settings",
  "projects",
  "milestones",
  "currently_building",
  "social_links",
  "what_i_build",
  "footer_links",
  "blog_posts",
  "devlogs",
  "friends",
  "newsletter_subscriptions",
  "skills",
  "testimonials",
  "certifications",
  "education",
  "contact_messages",
  "admin_users",
] as const;

function toCamel(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toCamel);
  if (value instanceof Date) return value;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [
        key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase()),
        toCamel(item),
      ]),
    );
  }
  return value;
}

function collectionName(table: string): string {
  return table.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

async function migrate(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL is not configured; nothing to migrate.");
    return;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    for (const table of tables) {
      let result;
      try {
        result = await pool.query(`SELECT * FROM "${table}"`);
      } catch (error) {
        if ((error as { code?: string }).code === "42P01") {
          console.log(`Skipping ${table}; table does not exist in PostgreSQL.`);
          continue;
        }
        throw error;
      }
      const target = await collection(collectionName(table));
      for (const row of result.rows) {
        const document = toCamel(row) as Record<string, unknown>;
        const id = String(document.id ?? crypto.randomUUID());
        await target.replaceOne({ id }, { ...document, id }, { upsert: true });
      }
      console.log(`Migrated ${result.rowCount ?? 0} rows from ${table}.`);
    }
  } finally {
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error("PostgreSQL to MongoDB migration failed:", error);
  process.exitCode = 1;
});