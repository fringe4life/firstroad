## Inngest TypeScript SDK v4 migration

This document tracks how `@firstroad/web` migrated from **Inngest TypeScript SDK v3** to the **v4 beta** while keeping the existing Bun/Elysia integration and adding Valibot‑based runtime validation for events.

### Packages and tooling

- **SDK dependency**
  - `apps/web/package.json` now uses the v4 beta via the npm `beta` tag:
    - `"inngest": "beta"`
  - The rest of the stack (Next.js 16, Bun runtime, Better Auth, Valibot) remains unchanged.

- **Dev server / CLI**
  - `docker-compose.yml` runs the Inngest dev server container:
    - `image: inngest/inngest:v1.17.1`
    - `command: inngest dev -u http://host.docker.internal:3000/api/inngest`
  - `apps/inngest/package.json` provides a local CLI dev script:
    - `"dev": "bun x inngest-cli dev -u http://localhost:3000/api/inngest"`
  - Both flows are compatible with the v4 SDK and continue to target the same `/api/inngest` endpoint.

- **Environment**
  - Local dev: `apps/web/.env.local` sets `INNGEST_DEV=1` so the v4 client runs in dev mode.
  - Production (Vercel): use `INNGEST_SIGNING_KEY` and `INNGEST_EVENT_KEY` (do **not** set `INNGEST_DEV`); v4 defaults to cloud mode.

---

## Client changes (`apps/web/src/lib/inngest.ts`)

- **Before (v3)**
  - Imported `EventSchemas` and built a centralized `Events` type mapping event names to payload types.
  - Constructed the client with:
    - `schemas: new EventSchemas().fromRecord<Events>()`
    - `checkpointing: true`

- **After (v4)**
  - The client is now a simple v4 `Inngest` instance:
    - `export const inngest = new Inngest({ id: "firstroad", checkpointing: true });`
  - `EventSchemas` and the centralized `Events` registry have been removed; event typing and validation are defined alongside each event via `eventType()` (see below).
  - Any future options like `signingKey`, `signingKeyFallback`, `baseUrl`, custom `fetch`, or `logger` should be passed directly to this client per the v4 docs.

---

## Event definitions and runtime validation

All event modules under `apps/web/src/features/**/events` already used **Valibot** to describe payloads and manually parsed `event.data`. With v4 we:

1. **Define v4 event types with Valibot schemas.**
   - Each event now defines a v4 `eventType()` using the existing Valibot schema, e.g.:
     - `const passwordReset = eventType("password.reset", { schema: passwordResetSchema });`
   - Valibot implements the Standard Schema spec, so Inngest can use these schemas directly for **runtime validation**.

2. **Use `triggers` instead of v3 `event` options.**
   - v3 code used the second argument to `createFunction` to specify `{ event: "name" }`.
   - v4 moves triggers into the options object, and event types are passed as triggers:
     - `inngest.createFunction({ id: "event-password-reset", triggers: [passwordReset] }, async ({ event }) => { ... });`
   - Where functions had additional options (e.g. retries, step delay), those remain in the same options object, alongside `triggers`.

3. **Let Inngest + Valibot handle payload validation.**
   - Manual `parse(schema, event.data)` calls have been removed where Inngest already guarantees the shape via `eventType()`:
     - Handlers now destructure directly from `event.data`, e.g.:
       - `const { email, resetUrl, userName } = event.data;`
   - For some handlers we still wrap the business logic in small `try` / `tryCatch` blocks to convert low‑level errors into higher‑level messages (e.g. “Invalid ... event data”), but **schema validation itself is performed by Inngest using the Valibot schema**.

### Updated event modules

The following modules have been migrated to v4 `eventType()` with Valibot:

- Password:
  - `apps/web/src/features/password/events/event-password-reset.ts`
  - `apps/web/src/features/password/events/event-password-changed.ts`
- Auth:
  - `apps/web/src/features/auth/events/event-email-otp.ts`
  - `apps/web/src/features/auth/events/event-email-verification.ts`
  - `apps/web/src/features/auth/events/event-welcome-email.ts`
- Invitations:
  - `apps/web/src/features/invitations/events/event-organization-invitation.ts`

Any new events should follow the same pattern:

1. Define a Valibot schema.
2. Export a `...EventData` type via `InferOutput`.
3. Create an `eventType("name", { schema })`.
4. Use that event type in `triggers` when calling `inngest.createFunction`.

This ensures:

- **Compile‑time types** (via TypeScript + Valibot’s `InferOutput`).
- **Runtime validation** for all entry points:
  - Event triggers.
  - `step.waitForEvent` (if used).
  - `inngest.send` calls when using `eventType.create(...)`.

---

## Serving functions: Bun + Elysia + `/api/inngest`

We continue to serve Inngest functions using **Bun + Elysia**, not `inngest/next`:

- The integration lives in:
  - `apps/web/src/app/api/[[...slugs]]/inngest-plugin.ts`
- It:
  - Imports `serve` from `"inngest/bun"`.
  - Imports all event functions into a `functions` array.
  - Calls `serve({ client: inngest, functions })`.
  - Exposes the handler via the Elysia `app` at `/inngest` (mapped to `/api/inngest`).

No structural changes are required for v4 here; the only requirement is that the functions passed in are defined using the new v4 `eventType` + `triggers` pattern and that the client is the v4 `Inngest` instance from `lib/inngest`.

---

## Local development and testing

### Local dev flows

- **App‑centric dev (recommended)**
  - Start Postgres + Inngest dev server:
    - `docker compose --env-file apps/web/.env up -d postgres inngest`
  - Ensure `INNGEST_DEV=1` is set in `apps/web/.env.local`.
  - Run the web app:
    - `cd apps/web && bun run dev`

- **CLI‑centric dev (optional)**
  - From `apps/inngest`:
    - `bun x inngest-cli dev -u http://localhost:3000/api/inngest`
  - Run the web app as usual with `INNGEST_DEV=1`.

In both cases, the v4 client will run in dev mode and communicate with the dev server at `/api/inngest`.

### What to test after migration

1. **Type‑checking**
   - From `apps/web`:
     - `bun run type`
   - Confirms `Inngest`, `eventType`, and all handler signatures are type‑correct.

2. **Key event flows**
   - Password reset (emits `password.reset`).
   - Password changed (emits `password.changed`).
   - OTP / email verification (`email.otp`, `email.verification`).
   - Welcome email (`user.welcome`).
   - Organisation invitation (`organization.invitation`).

3. **Validation behavior**
   - Trigger events with invalid payloads (e.g. missing email, malformed URL) and verify that:
     - Inngest/Valibot reject the payload.
     - Errors are surfaced in logs and/or function failures in the Inngest dashboard.

4. **Production smoke test**
   - After deploying to Vercel with the v4 SDK:
     - Confirm the Inngest dashboard shows functions registered under app ID `firstroad`.
     - Verify events reach `/api/inngest` and functions succeed.
     - Ensure no errors about missing signing keys or dev mode misconfiguration.

