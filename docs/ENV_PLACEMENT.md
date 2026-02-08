# Environment variables by app/package

Per Turborepo best practices, `.env` files belong in the **application package** that uses them, not at the repo root. This keeps which package needs which variables explicit and avoids leakage.

## apps/web

**Location:** `apps/web/.env`  
**Used by:** Next.js app (dev/build/start), Prisma (generate + scripts), Resend scripts.

| Variable | Required | Used for |
|----------|----------|----------|
| `BETTER_AUTH_SECRET` | Yes | Better Auth session signing (validated in `src/lib/env.ts`) |
| `DATABASE_URL` | Yes | Postgres connection (Prisma, app, seed/scripts) |
| `NEXT_PUBLIC_APP_URL` | Yes | App URL for auth redirects, emails, API origin |
| `RESEND_API_KEY` | Yes | Sending transactional email (Resend) |
| `NEXT_PUBLIC_RESEND_FROM` | Yes | From address for sent emails |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth (Better Auth) |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth (Better Auth) |
| `DIRECT_URL` | No | Optional Prisma direct URL (currently commented in schema) |
| `RESEND_FULL_ACCESS` | No* | Resend **Full Access** API key; only for `resend:list` / `resend:download` scripts (template management). Not the same as `RESEND_API_KEY`. |
| `S3_ACCESS_KEY_ID` | If using attachments | Bun.s3 presign/upload/delete for ticket attachments (Bun runtime only; not on Vercel) |
| `S3_SECRET_ACCESS_KEY` | If using attachments | |
| `S3_REGION` | If using attachments | e.g. `us-east-1` |
| `S3_BUCKET` | If using attachments | Bucket name |
| `S3_ENDPOINT` | Optional | For non-AWS S3 (e.g. MinIO, R2) |

Copy from `apps/web/env.example` and fill in values. Use **`BETTER_AUTH_SECRET`** (not `AUTH_SECRET`) for Better Auth.

---

## apps/inngest

**Location:** No `.env` needed.  
**Used by:** `inngest-cli dev` only; it talks to `http://localhost:3000/api/inngest`. No env vars are read by this package. The Inngest **dev server** runs in this app; the **API and events** run in `apps/web`, which has its own env.

---

## packages/emails

**Location:** No `.env` needed for normal use.  
**Used by:** `email dev` / `email build` (React Email preview). The preview server (`.react-email/`) uses internal env set by the CLI (`REACT_EMAIL_INTERNAL_*`, `NEXT_PUBLIC_IS_BUILDING`, etc.). Optional: if you use Resend integration from the preview UI, you could add a `.env` with `RESEND_API_KEY` (or whatever the React Email preview expects); check React Email docs. For local template preview only, no env is required.

---

## Root

**Do not** keep app secrets in a root `.env`. If you still have a root `.env` (e.g. during migration), `apps/web` loads it explicitly via `next.config.ts` so the web app keeps working until you move everything to `apps/web/.env`.

**Recommended:** Copy (or move) root `.env` into `apps/web/.env`, then remove or stop relying on the root file.

---

## Summary

| Where | .env file | Notes |
|-------|-----------|--------|
| **apps/web** | `apps/web/.env` | All app + DB + Resend + Auth + optional S3 and Resend Full Access for scripts. |
| **apps/inngest** | None | CLI only; no env. |
| **packages/emails** | None (or optional for Resend in preview) | Preview only. |
| **Repo root** | Avoid | Use only for migration; prefer app-level. |
