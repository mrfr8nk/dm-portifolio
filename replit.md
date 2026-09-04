# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Darrell Mucheri's portfolio + admin panel with custom JWT API backend.

## Artifacts

### `artifacts/darrellm` — Portfolio Frontend (React + Vite)
- Ultra-pro dark glassmorphism theme (dark by default, toggleable to light)
- All sections: Hero, Skills, Projects, WhatIBuild, Journey/Milestones, CurrentlyBuilding, Synapex, LanguageGlobe, Blog, Education, Certifications, Testimonials, Contact, Footer
- Admin panel at `/admin` with JWT auth — manages all content via custom REST API
- Synapex section with logo + link to https://synapex.gleeze.com
- LanguageGlobe: 3D WebGL globe with auto-fallback to 2D glassmorphism tag-cloud when no GPU

### `artifacts/api-server` — REST API (Express 5 + MongoDB)
- JWT auth (`/api/auth/login`, `/api/auth/register`, `/api/auth/me`)
- Full CRUD for: projects, milestones, currently-building, social-links, what-i-build, footer-links, blog-posts, skills, testimonials, certifications, education, contact-messages, site-settings
- File upload at `/api/upload` → `/api/media/:filename`
- Runtime database: MongoDB via the `MONGODB_URI` secret
- Authentication secrets: `JWT_SECRET` and `ADMIN_SECRET` must be configured as Replit Secrets

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: MongoDB collections (one collection per content resource)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Auth**: JWT (bcryptjs + jsonwebtoken)
- **Build**: esbuild (API), Vite (frontend)

## MongoDB Collections
`siteSettings`, `projects`, `milestones`, `currentlyBuilding`, `socialLinks`, `whatIBuild`, `footerLinks`, `blogPosts`, `skills`, `testimonials`, `certifications`, `education`, `contactMessages`, `adminUsers`

## Theme
- Dark glassmorphism is the TRUE default (`:root` carries dark CSS vars)
- Light mode applied via `.light` class override
- Theme toggle persisted in localStorage key `dm-theme`
- index.html inline script applies class before React mounts (no flash)

## Key Commands

- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/api-server run migrate:postgres` — one-time read-only migration from legacy PostgreSQL when its tables exist
- `pnpm --filter @workspace/darrellm run dev` — run frontend locally

All data goes through `artifacts/darrellm/src/lib/api.ts` → Express API → MongoDB.
