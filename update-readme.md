# How to Request a README Update (AI Runnable)

Provide ONLY this file in future sessions to have the AI re-scan and update `README.md` without giving full repo context.

## Repo layout (Turborepo monorepo)

- **Root**: `package.json` (workspaces, scripts), `turbo.json`, `bun.lock`
- **apps/web**: Next.js app — `package.json`, `env.example`, `next.config.ts`, `vercel.json`, `src/` (app, features, lib, components)
- **apps/inngest**: Inngest dev tooling
- **packages/database**: Prisma — `package.json`, `prisma/` (schema, migrations, models, seed), `prisma.config.ts`, `src/` (client)
- **packages/emails**: React Email templates. The dev server (`bun dev:email`) may show “Could not find index file” for `.react-email/src/app/fonts` and `.../toolbar`, `.../topbar`; this is a known React Email bug, not something to fix in this repo.

## What the AI will do

- Re-scan these sources:
  - **Root**: `package.json`, `turbo.json`
  - **apps/web**: `package.json`, `env.example`, `next.config.ts`, `vercel.json`, `src/lib/env.ts`, `src/app/**/layout.tsx`, `src/app/**/page.tsx`
  - **packages/database**: `package.json`, `prisma/schema.prisma`, `prisma/seed.ts`, `prisma.config.ts`
- **Check Bun version**: Run `bun -v` to get current Bun version for the badge.
- **Scan current folder structure** using these commands:
  - `list_dir` on repo root, `apps/`, `packages/`
  - `list_dir` on `apps/web/`, `apps/web/src/`, `apps/web/src/app/`, `apps/web/src/features/`, `apps/web/src/components/`, `apps/web/src/lib/`
  - `list_dir` on `packages/database/`, `packages/database/prisma/`, `packages/emails/`
  - Use `glob_file_search` with patterns like `apps/web/src/app/**/*.tsx` for page/layout files
  - Use `glob_file_search` with patterns like `apps/web/src/features/**/components/` for feature components
- Update sections in `README.md`:
  - Tech stack badges (sync versions from `apps/web/package.json` and root `package.json` where relevant)
  - Prerequisites and Getting Started (Bun, monorepo clone, install from root)
  - Environment variables block (keep in sync with `apps/web/env.example` and `apps/web/src/lib/env.ts`)
  - Database setup: Prisma lives in `packages/database` — `bunx turbo run db:generate --filter=@firstroad/db`, migrations, seed from root or package
  - Available scripts from **root** `package.json` (turbo-based: dev, build, type, deploy:prod, etc.) and note that Next.js app is in `apps/web`
  - Tech stack and configuration (Next.js, Turbopack, Turborepo, Prisma in packages/database, Neon, Resend, Vercel)
  - **Project structure** — reflect monorepo: root → apps/web (Next app), apps/inngest, packages/database (Prisma), packages/emails; under `apps/web/src/` show features/, components/, lib/, app/
- Keep wording concise, match existing style, do not over-explain.
- **Badge versions**: Use full major.minor.patch from `apps/web/package.json` (and root if needed) for the badge area. Elsewhere use major.minor only.
- **Project structure**: Must reflect current organization (monorepo roots, apps/web as the main app, features under apps/web/src/features/, etc.)

## Rules

- Use Bun commands; from repo root use `bun` / `bunx turbo run ...` for workspace tasks.
- Reflect CSS and linting from `biome.jsonc` and Tailwind v4 (in apps/web).
- Mention `nuqs` for type-safe search params if present in apps/web.
- Mention centralized auth types in `apps/web/src/features/auth/types.ts` if present.
- Keep tech stack badges in sync with `apps/web/package.json` (and root where relevant).
- Keep Bun badge in sync with `bun -v` output.
- Preserve existing README headings and tone; only patch relevant sections.
- Do not change license wording.
- **Turborepo**: Scripts run from root; `dev`/`build`/`type` use turbo with filters; deploy is `deploy:prod` (cd apps/web && vercel deploy --prod). Env vars used by build must be listed in `turbo.json` under the `build` task `env` array.

## Quick prompt you can paste

Copy this into the chat with this file attached:

```
Please update README.md based on the codebase. This is a Turborepo monorepo: Next.js app in apps/web, Prisma in packages/database, emails in packages/emails. Keep sections accurate and concise, sync env vars with apps/web/env.example and apps/web/src/lib/env.ts, prefer Bun and turbo commands from root, include Neon/Resend/Vercel notes, and ensure root package.json scripts and turbo.json are reflected. Keep headings and tone.
```

## Post-update

- Run Biome format: `bun fix`
- Generate commit message: see `git-commit-msg.md` and run AI to produce message based on the instructions.
