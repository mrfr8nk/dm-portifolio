import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import { collection, withoutMongoId } from "../lib/mongo";

const router = Router();

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type RecordValue = Record<string, unknown>;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return secret;
}

function toSnake(key: string): string {
  return key.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
}

function toCamel(key: string): string {
  return key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

function snakify(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(snakify);
  if (value instanceof Date) return value;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as RecordValue).map(([key, item]) => [toSnake(key), snakify(item)]),
    );
  }
  return value;
}

function camelify(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(camelify);
  if (value && typeof value === "object" && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value as RecordValue).map(([key, item]) => [toCamel(key), camelify(item)]),
    );
  }
  return value;
}

function response(value: unknown): unknown {
  return snakify(value);
}

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    req.user = jwt.verify(auth.slice(7), getJwtSecret()) as AuthRequest["user"];
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

const upload = multer({ dest: "/tmp/uploads/", limits: { fileSize: 25 * 1024 * 1024 } });

const CDN_BASE_URL = (process.env.CDN_BASE_URL || "https://mrfranko-cdn.hf.space").replace(/\/+$/, "");
const CDN_DEFAULT_PATH = process.env.CDN_DEFAULT_PATH || "ice/";

function getCdnApiKey(): string {
  const key = process.env.CDN_API_KEY;
  if (!key) throw new Error("CDN_API_KEY environment variable is required for uploads");
  return key;
}

function getCdnPath(folder: unknown): string {
  const safeFolder = typeof folder === "string"
    ? folder.trim().replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "")
    : "uploads";
  const base = CDN_DEFAULT_PATH.replace(/^\/+|\/+$/g, "");
  return `${base}/${safeFolder || "uploads"}/`;
}

function normalizeCdnFilename(originalName: string): string {
  const original = path.basename(originalName || "");
  const extension = path.extname(original).toLowerCase();
  const stem = path.basename(original, extension)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `${stem || `upload-${randomUUID()}`}${extension}`;
}

async function uploadToCdn(file: Express.Multer.File, folder: unknown): Promise<string> {
  const fileBuffer = await fs.promises.readFile(file.path);
  const form = new FormData();
  form.append(
    "file",
    new Blob([fileBuffer], { type: file.mimetype || "application/octet-stream" }),
    normalizeCdnFilename(file.originalname),
  );
  form.append("path", getCdnPath(folder));

  const response = await fetch(`${CDN_BASE_URL}/upload`, {
    method: "POST",
    headers: { "X-API-Key": getCdnApiKey() },
    body: form,
  });
  const payload = await response.json().catch(() => ({})) as {
    success?: boolean;
    message?: string;
    cdnUrl?: string;
    url?: string;
  };

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || `CDN upload failed with status ${response.status}`);
  }

  const url = payload.cdnUrl || payload.url;
  if (!url) throw new Error("CDN upload returned no file URL");
  return url;
}

router.post("/upload", requireAuth, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file" }); return; }

  try {
    const url = await uploadToCdn(req.file, req.body.folder);
    res.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "CDN upload failed";
    res.status(message.includes("CDN_API_KEY") ? 503 : 502).json({ error: message });
  } finally {
    await fs.promises.unlink(req.file.path).catch(() => undefined);
  }
});

router.get("/media/:filename", (req: Request, res: Response) => {
  const filename = Array.isArray(req.params.filename) ? req.params.filename[0] : req.params.filename;
  const file = path.join("/tmp/media", filename);
  if (!fs.existsSync(file)) { res.status(404).json({ error: "Not found" }); return; }
  res.sendFile(file);
});

type Sort = Record<string, 1 | -1>;

const resources: Record<string, { collection: string; sort?: Sort }> = {
  projects: { collection: "projects", sort: { sortOrder: 1 } },
  milestones: { collection: "milestones", sort: { sortOrder: 1 } },
  "currently-building": { collection: "currentlyBuilding", sort: { sortOrder: 1 } },
  "social-links": { collection: "socialLinks", sort: { sortOrder: 1 } },
  "what-i-build": { collection: "whatIBuild", sort: { sortOrder: 1 } },
  "footer-links": { collection: "footerLinks", sort: { sortOrder: 1 } },
  "blog-posts": { collection: "blogPosts", sort: { publishedAt: -1 } },
  devlogs: { collection: "devlogs", sort: { publishedAt: -1 } },
  friends: { collection: "friends", sort: { sortOrder: 1 } },
  skills: { collection: "skills", sort: { category: 1, sortOrder: 1 } },
  testimonials: { collection: "testimonials", sort: { sortOrder: 1 } },
  certifications: { collection: "certifications", sort: { sortOrder: 1 } },
  education: { collection: "education", sort: { sortOrder: 1 } },
  "contact-messages": { collection: "contactMessages", sort: { createdAt: -1 } },
};

for (const [route, config] of Object.entries(resources)) {
  router.get(`/${route}`, async (req: Request, res: Response) => {
    const query = ["blogPosts", "devlogs", "friends"].includes(config.collection) && req.query.published === "true"
      ? { isPublished: true }
      : {};
    const rows = await (await collection(config.collection)).find(query).sort(config.sort ?? {}).toArray();
    res.json(response(rows.map(withoutMongoId)));
  });

  router.post(`/${route}`, requireAuth, async (req: Request, res: Response) => {
    const document = { ...(camelify(req.body) as RecordValue), id: randomUUID(), createdAt: new Date(), updatedAt: new Date() };
    await (await collection(config.collection)).insertOne(document);
    res.json(response(document));
  });

  router.put(`/${route}/:id`, requireAuth, async (req: Request, res: Response) => {
    const updates = { ...(camelify(req.body) as RecordValue), updatedAt: new Date() };
    const result = await (await collection(config.collection)).findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { returnDocument: "after" },
    );
    if (!result) { res.status(404).json({ error: "Not found" }); return; }
    res.json(response(withoutMongoId(result)));
  });

  router.delete(`/${route}/:id`, requireAuth, async (req: Request, res: Response) => {
    await (await collection(config.collection)).deleteOne({ id: req.params.id });
    res.json({ ok: true });
  });
}

router.post("/newsletter-subscribe", async (req: Request, res: Response) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    res.status(400).json({ error: "Enter a valid email address" });
    return;
  }

  const target = await collection("newsletterSubscriptions");
  const existing = await target.findOne({ email });
  const now = new Date();
  if (existing) {
    await target.updateOne(
      { id: existing.id },
      { $set: { status: "active", updatedAt: now, lastSubscribedAt: now } },
    );
    res.json({ subscribed: true, alreadySubscribed: existing.status === "active" });
    return;
  }

  const document = {
    id: randomUUID(),
    email,
    status: "active",
    subscribedAt: now,
    lastSubscribedAt: now,
    createdAt: now,
    updatedAt: now,
  };
  await target.insertOne(document);
  res.status(201).json({ subscribed: true, alreadySubscribed: false });
});

router.get("/newsletter-subscriptions", requireAuth, async (_req: Request, res: Response) => {
  const rows = await (await collection("newsletterSubscriptions"))
    .find({})
    .sort({ subscribedAt: -1 })
    .toArray();
  res.json(response(rows.map(withoutMongoId)));
});

router.put("/newsletter-subscriptions/:id", requireAuth, async (req: Request, res: Response) => {
  const status = req.body?.status === "unsubscribed" ? "unsubscribed" : "active";
  const result = await (await collection("newsletterSubscriptions")).findOneAndUpdate(
    { id: req.params.id },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  if (!result) { res.status(404).json({ error: "Subscriber not found" }); return; }
  res.json(response(withoutMongoId(result)));
});

router.delete("/newsletter-subscriptions/:id", requireAuth, async (req: Request, res: Response) => {
  await (await collection("newsletterSubscriptions")).deleteOne({ id: req.params.id });
  res.json({ ok: true });
});

router.get("/site-settings", async (_req: Request, res: Response) => {
  const rows = await (await collection("siteSettings")).find({}).toArray();
  res.json(Object.fromEntries(rows.map((row) => [row.key, row.value])));
});

router.put("/site-settings", requireAuth, async (req: Request, res: Response) => {
  const target = await collection("siteSettings");
  for (const [key, value] of Object.entries(req.body as Record<string, string>)) {
    await target.updateOne({ key }, { $set: { key, value, updatedAt: new Date() } }, { upsert: true });
  }
  res.json({ ok: true });
});

router.get("/blog-posts/:slug", async (req: Request, res: Response) => {
  const row = await (await collection("blogPosts")).findOne({ slug: req.params.slug });
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(response(withoutMongoId(row)));
});

export default router;