import { Router } from "express";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { collection } from "../lib/mongo";

const router = Router();

function getSecret(name: "JWT_SECRET" | "ADMIN_SECRET"): string {
  const secret = process.env[name];
  if (!secret) throw new Error(`${name} environment variable is required`);
  return secret;
}

router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });
  try {
    const user = await (await collection("adminUsers")).findOne({ email });
    if (!user || typeof user.passwordHash !== "string" || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: "admin" }, getSecret("JWT_SECRET"), { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/auth/register", async (req: Request, res: Response) => {
  const { email, password, secret } = req.body as { email?: string; password?: string; secret?: string };
  try {
    if (secret !== getSecret("ADMIN_SECRET")) return res.status(403).json({ error: "Invalid admin secret" });
  } catch {
    return res.status(503).json({ error: "Admin registration is not configured on this server" });
  }
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });
  try {
    const users = await collection("adminUsers");
    if (await users.findOne({ email })) return res.status(409).json({ error: "User already exists" });
    const user = { id: randomUUID(), email, passwordHash: await bcrypt.hash(password, 12), createdAt: new Date(), updatedAt: new Date() };
    await users.insertOne(user);
    const token = jwt.sign({ id: user.id, email, role: "admin" }, getSecret("JWT_SECRET"), { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, email } });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.get("/auth/me", (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(auth.slice(7), getSecret("JWT_SECRET")) as { id: string; email: string; role: string };
    return res.json({ user: { id: payload.id, email: payload.email, role: payload.role } });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
});

export default router;