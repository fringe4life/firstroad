# Elysia API Setup Evaluation

Evaluation of `apps/web/src/app/api` against the Elysia Next.js integration skill (`.agents/skills/elysiajs/integrations/nextjs.md`), Better Auth skill (`better-auth.md`), and the Elysia reference in `llms-full.txt`. Last evaluated from the current codebase and skills.

---

## 1. Structure and Layout

| Aspect | Current | Skill / Reference | Status |
|--------|---------|-------------------|--------|
| Route file | `app/api/[[...slugs]]/route.ts` | Create `app/api/[[...slugs]]/route.ts` | ✅ Match |
| Prefix | `new Elysia({ prefix: '/api' })` in `@/lib/app` | Prefix `/api` when in `app/api/` | ✅ Match |
| App instance | Central `app` in `@/lib/app.ts`, extended in `route.ts` | Define Elysia in route or import | ✅ Reasonable |

The catch-all route and `/api` prefix match the recommended Next.js + Elysia setup.

---

## 2. Next.js Route Handler Export (WinterCG)

| Aspect | Current | Skill / Reference | Status |
|--------|---------|-------------------|--------|
| Export | `export const GET = app.handle` (and POST, PUT, DELETE, OPTIONS) | Next.js integration docs: `app.fetch`; Elysia type defs: prefer **`app.handle`** | ✅ Match (handle) |

The Next.js integration docs and `llms-full.txt` show exporting **`app.fetch`** for WinterCG. The **Elysia type definitions** (JSDoc in the library) recommend the opposite for normal use:

- **`handle`**: *"Use handle can be either sync or async to save performance. Beside benchmark purpose, please use 'handle' instead."*
- **`fetch`**: Documented as *"Custom handle written by adapter"* and intended for benchmark/adapter use.

Current code correctly uses **`app.handle`** per the library’s own guidance. Both accept a Web `Request` and return a `Promise<Response>`; use **handle** for production, **fetch** only when you need the WinterCG/adapter API.

---

## 3. Better Auth Integration

| Aspect | Current | Skill / Reference | Status |
|--------|---------|-------------------|--------|
| Mount | `app.mount(auth.handler, { detail: { tags, description } })` | `.mount(auth.handler)` or `.mount('/auth', auth.handler)` | ✅ Match |
| OpenAPI | `better-auth-openapi.ts`: `getPaths`, `components`, prefix `/auth/api`; merged into Elysia OpenAPI | Better Auth skill: generate schema, merge paths/components | ✅ Match |
| CORS | Applied before mount; origin from `NEXT_PUBLIC_APP_URL`, methods, credentials, allowedHeaders | CORS then mount; same options | ✅ Match |

Better Auth is mounted and documented in OpenAPI as in the skill; CORS configuration aligns with the recommended pattern.

---

## 4. CORS and Plugin Order

| Aspect | Current | Skill / Reference | Status |
|--------|---------|-------------------|--------|
| CORS config | `origin`, `methods`, `credentials`, `allowedHeaders` | Same options in skill | ✅ Match |
| Order | OpenAPI → CORS → mount(auth) → ticket routes → Inngest | Better-auth skill: CORS then mount | ✅ CORS before auth |

OpenAPI is applied first (for documentation), then CORS, then auth and routes. CORS still runs before the auth handler, which is what the Better Auth skill suggests.

---

## 5. Ticket API Endpoints

| Endpoint | Current | Notes |
|----------|---------|--------|
| `GET /tickets` | Query: `search`, `sortKey`, `sortValue`, `page`, `limit`; uses `getTicketsApi` | ✅ Implemented |
| `GET /tickets/:slug` | Params: `slug`; uses `getTicketBySlugApi` | ✅ Implemented |

**Schema gap:** In `route.ts`, `sortKey` is:

```ts
sortKey: t.String({
  enum: ["bounty", "createdAt"],
  default: "createdAt",
}),
```

The app and `getTicketsApi` also support **`deadline`** (e.g. "Due soon"). The API schema does not, so clients cannot request `sortKey=deadline` via the public API.

**Recommendation:** Add `"deadline"` to the `sortKey` enum in `route.ts` so the API matches the DAL and UI.

---

## 6. Inngest Plugin

| Aspect | Current | Status |
|--------|---------|--------|
| Registration | `app.use(inngestHandler)` in `route.ts` | ✅ Correct |
| Handler | `inngestHandler = app.all('/inngest', ({ request }) => handler(request))` with `serve()` from `inngest/bun` | ✅ Inngest served at `/api/inngest` |

Inngest is registered as an Elysia route under the same `app` and prefix, so `/api/inngest` is correctly handled.

---

## 7. OpenAPI Plugin

| Aspect | Current | Status |
|--------|---------|--------|
| Usage | `app.use(openapi({ documentation: { components, paths } }))` with Better Auth paths/components | ✅ Configured |
| Known issue | README notes: OpenAPI plugin can cause "Maximum call stack size exceeded" at `specPath`, likely from circular references when introspecting mounted routes (e.g. Better Auth). OpenAPI generation may be disabled or fragile. | ⚠️ Documented |

If the OpenAPI plugin is disabled or fails in production, consider keeping it only for local docs or fixing introspection of mounted handlers.

---

## 8. Eden (End-to-End Type Safety)

The Next.js skill describes **Eden Treaty** for isomorphic, type-safe API calls (server: direct call, client: fetch). The current setup does not export the Elysia app type or use Eden.

**Recommendation (optional):** If you want type-safe API clients from the same codebase:

1. Export the app type: `export type AppRoutes = typeof app` (already in `@/lib/app.ts`; ensure the full app with routes is exported from the route file if needed).
2. Add a Treaty client (e.g. in `lib/eden.ts`) using `treaty` and the app type, with server vs client branching as in the skill (e.g. `typeof process` for SSR safety).

---

## 9. Summary and Recommendations

| Priority | Item | Action |
|----------|------|--------|
| High | Tickets API schema | Add `"deadline"` to the `sortKey` enum in `GET /tickets` so it matches the DAL and UI. |
| Medium | OpenAPI | Resolve or document the "Maximum call stack size exceeded" issue; consider disabling in production if needed. |
| Low | Eden | Consider introducing Eden Treaty for type-safe API access from server and client. |

Overall, the layout (catch-all route, prefix, auth mount, CORS, Inngest) matches the Elysia and Better Auth skills. The route handler correctly uses **`app.handle`** per Elysia’s type definitions. Remaining adjustments: align the **tickets `sortKey`** enum with supported behavior (including `deadline`) and address OpenAPI if needed.
