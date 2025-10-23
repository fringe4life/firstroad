# How to Request a README Update (AI Runnable)

Provide ONLY this file in future sessions to have the AI re-scan and update `README.md` without giving full repo context.

## What the AI will do

- Re-scan these sources: `package.json`, `env.example`, `next.config.ts`, `prisma/schema.prisma`, `prisma/seed.ts`, `prisma.config.ts`, `src/lib/env.ts`, `src/lib/prisma.ts`, `src/app/**/layout.tsx`, `src/app/**/page.tsx`.
- **Scan current folder structure** using these commands:
  - `list_dir` on `src/` to get top-level structure
  - `list_dir` on `src/app/` to get app router structure
  - `list_dir` on `src/features/` to get feature modules
  - `list_dir` on `src/components/` to get component structure
  - `list_dir` on `src/lib/` to get utility libraries
  - `list_dir` on `src/utils/` to get shared utilities
  - `list_dir` on `src/generated/` to get generated files
  - Use `glob_file_search` with patterns like `src/app/**/*.tsx` to find all page/layout files
  - Use `glob_file_search` with patterns like `src/features/**/components/` to find component directories
- Update sections in `README.md`:
  - Tech stack badges (sync versions from `package.json` dependencies)
  - Prerequisites and Getting Started
  - Environment variables block (keep in sync with `env.example` and `src/lib/env.ts`)
  - Database setup commands (Prisma generate, db push, seed)
  - Available scripts from `package.json`
  - Tech stack and configuration notes (Next.js, Turbopack, React Compiler, Neon, Resend)
  - **Project Structure section** - completely regenerate based on current folder structure
- Keep wording concise, match existing style, do not over-explain.
- **Badge versions**: Extract versions from `package.json` and update all badge URLs accordingly.
- **Project Structure**: Must reflect current organization (features/, components/, navigation moved to features/navigation, etc.)

## Rules

- Use Bun commands where possible; prefer `bunx prisma` for CLI tasks.
- Reflect the CSS and linting standards from `biome.json` and Tailwind v4.
- Mention `nuqs` for type-safe search params via Context7.
- Mention centralized auth types in `src/features/auth/types.ts`.
- Keep tech stack badges in sync with `package.json` versions (extract from dependencies).
- Preserve existing README headings and tone, only patch relevant sections.
- Do not change license wording.

## Quick prompt you can paste

Copy this into the chat with this file attached:

```
Please update README.md based on the codebase. Keep sections accurate and concise, sync env vars with env.example and src/lib/env.ts, prefer Bun commands (bunx prisma ...), include Neon adapter and Resend notes, and ensure scripts from package.json are reflected. Keep headings and tone.
```

## Post-update

- Run Biome format: `bun run format`
- Generate commit message: see `git-commit-msg.md` and run AI to produce message under 140 chars.
