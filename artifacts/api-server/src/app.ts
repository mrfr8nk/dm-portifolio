import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// In the combined Render service, Express serves the Vite build after the API.
// Keeping this conditional preserves the separate frontend/API development workflows.
const frontendDistCandidates = [
  path.resolve(process.cwd(), "artifacts/darrellm/dist/public"),
  path.resolve(process.cwd(), "../darrellm/dist/public"),
  path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../../darrellm/dist/public",
  ),
  path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../darrellm/dist/public",
  ),
];
const frontendDist =
  frontendDistCandidates.find((candidate) =>
    fs.existsSync(path.join(candidate, "index.html")),
  ) ?? frontendDistCandidates[0];
const frontendIndex = path.join(frontendDist, "index.html");

if (fs.existsSync(frontendIndex)) {
  app.use(express.static(frontendDist));
  app.use((req, res, next) => {
    if (req.method === "GET" && req.accepts("html")) {
      res.sendFile(frontendIndex);
      return;
    }
    next();
  });
} else {
  const message = `Frontend build not found at ${frontendIndex}. Run the combined Render build before starting the production server.`;
  logger.error({ frontendDist, frontendDistCandidates }, message);

  if (process.env.NODE_ENV === "production") {
    throw new Error(message);
  }
}

export default app;
