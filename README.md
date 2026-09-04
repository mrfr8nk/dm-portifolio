# Darrell Mucheri Portfolio

A modern, responsive developer portfolio with a public React site, a protected admin panel, an Express API, and MongoDB persistence.

## Project structure

This repository is a pnpm workspace:

```text
artifacts/
  darrellm/       React + Vite portfolio and admin UI
  api-server/     Express API and MongoDB data layer
lib/
  api-client-react/
  api-spec/
  api-zod/
  db/             Legacy PostgreSQL schema retained only for reference/migration
```

## Local development

Requirements:

- Node.js 24
- pnpm 10+
- MongoDB connection string

Install dependencies:

```bash
pnpm install
```

Set these Replit Secrets or local environment variables for the API:

```text
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=a-long-random-secret-for-login-tokens
ADMIN_SECRET=a-long-random-secret-for-admin-registration
```

Start the API:

```bash
PORT=8080 pnpm --filter @workspace/api-server run dev
```

Start the frontend in a second terminal:

```bash
PORT=24839 BASE_PATH=/ pnpm --filter @workspace/darrellm run dev
```

The API is available at `http://localhost:8080/api` and the portfolio at the Vite URL printed in the terminal.

## Database

The live API uses MongoDB only. Each resource has its own collection:

```text
siteSettings, projects, milestones, currentlyBuilding, socialLinks,
whatIBuild, footerLinks, blogPosts, skills, testimonials, certifications,
education, contactMessages, adminUsers
```

The legacy PostgreSQL schema is not used at runtime. If a populated PostgreSQL database is available, run the read-only migration once:

```bash
DATABASE_URL=your-postgres-url \
pnpm --filter @workspace/api-server run migrate:postgres
```

The migration upserts rows by their existing IDs. Missing PostgreSQL tables are skipped. It never deletes PostgreSQL data.

## Deploying on Render as one Web Service

The frontend and backend now deploy together as a single Render Web Service. The API serves the built React app and all API routes from the same origin, so no `VITE_API_URL`, CORS configuration, static-site rewrite, or second Render service is required.

### Create the service

In Render, choose **New → Web Service**, connect this repository, and use:

```text
Name: darrellm-portfolio
Runtime: Node
Root Directory: `.`
Build Command: pnpm install --frozen-lockfile && pnpm run build:render
Start Command: pnpm run start:render
Health Check Path: /api/healthz
```

Render provides `PORT` automatically at runtime. The build uses `/` as the frontend base path and the server uses Render's runtime `PORT`.

Add these environment variables in the Render service:

```text
NODE_ENV=production
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<a long random secret>
ADMIN_SECRET=<a separate long random secret>
CDN_API_KEY=<your CDN API key>
CDN_BASE_URL=https://mrfranko-cdn.hf.space
CDN_DEFAULT_PATH=ice/
```

The same configuration is available in `render.yaml` if you prefer to create the service from a Render Blueprint. After deployment, verify:

```text
https://YOUR-SERVICE.onrender.com/api/healthz
```

It should return:

```json
{"status":"ok"}
```

The portfolio, admin panel, API, uploaded media, and blog routes are all available from the same service. The `/api` prefix remains unchanged for the frontend client.

### If Render shows `Cannot GET /` or a blank white page

If `/api/healthz` returns `{"status":"ok"}` but the homepage returns `Cannot GET /`, the Render service is running the API without the Vite frontend build. Make sure the service is using the repository root, not `artifacts/api-server`, and redeploy the latest commit with these exact values:

```text
Root Directory: .
Build Command: pnpm install --frozen-lockfile && pnpm run build:render
Start Command: pnpm run start:render
```

The build log must contain both a `vite build` step and an `@workspace/api-server` build step. The production server now stops with a clear error if the frontend bundle is missing instead of starting an API-only site. The frontend build uses `BASE_PATH=/`, so do not add a separate static-site service or a `VITE_API_URL` value for this deployment.

### Create the first admin account

Once `ADMIN_SECRET` is configured, use the registration endpoint once:

```bash
curl -X POST https://YOUR-SERVICE.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"use-a-strong-password","secret":"YOUR_ADMIN_SECRET"}'
```

Then open:

```text
https://YOUR-SERVICE.onrender.com/admin/login
```

Do not commit environment variables, passwords, or MongoDB connection strings to the repository.

All admin uploads use the CDN proxy: profile pictures, project and testimonial images, blog covers, certification images, friend avatars, devlog media, and CV/resume files. Upload names are normalized to lowercase kebab-case before they reach the CDN (for example, `darrell mucheri.jpg` becomes `darrell-mucheri.jpg`). Re-upload older assets if their stored URL contains spaces. The CDN API key is read only by the server from `CDN_API_KEY`; it is never sent to the browser. Add that secret in both Replit and the Render service environment when deploying there.

### Devlogs, friends, hiring, and newsletter

The public portfolio now includes:

- **Devlogs** — short, publishable build notes with status, dates, tags, and expandable full updates.
- **Friends** — a curated community section for people you learn from or build with. Only records you publish appear; profile URLs and avatars are optional.
- **Hire Me** — an editable hiring CTA managed under **Admin → Settings**.
- **Newsletter** — a consent-forward subscription form shown on the homepage and individual posts. Subscribers are managed under **Admin → Newsletter**, where you can reactivate, unsubscribe, delete, or export the list as CSV.

The API stores these records in the `devlogs`, `friends`, and `newsletterSubscriptions` MongoDB collections. The newsletter feature stores subscribers and does not send campaigns automatically; connect the exported list to the mailing provider you use.

## Fallback content

The public portfolio includes starter content for every database-backed content section. If a section has no saved records, its starter content is shown. If MongoDB is unavailable while the public site loads, the same starter content keeps the portfolio usable.

When Darrell saves at least one record in a section, that saved content automatically replaces the starter content. The **Admin → Settings → Fallback content** controls can also turn starter content off for individual sections. Turning a fallback off does not delete saved records; it only makes that section stay hidden until real content is added.

## Useful commands

```bash
pnpm run typecheck:libs
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/darrellm run typecheck
pnpm --filter @workspace/darrellm run build
```