# React Doctor Report

Generated from [React Doctor](https://www.react.doctor) (skill: `.agents/react-doctor`). Run after React changes to catch issues early.

**Scan:** `apps/web` (Next.js, React ^19, TypeScript, React Compiler)  
**Source files:** 379  
**Score:** **89 / 100** (Great)  
**Summary:** 3 errors, 115 warnings across 81 files (full scan). Use `--diff` to scan only changed files.

---

## How to re-run

```bash
# Full scan (from repo root)
npx -y react-doctor@latest apps/web --verbose

# Scan only uncommitted changes (e.g. to verify a single-file fix)
npx -y react-doctor@latest . --verbose --diff
```

Fix errors first, then re-run to verify the score improved.

---

## Errors (fix first)

These prevent React Compiler from optimizing the code and can cause correctness or performance issues.

### 1. ~~setState in effect (cascading renders)~~ — **Resolved**

**Rule:** `react-hooks-js/set-state-in-effect`  
**File:** `src/components/client-date.tsx`

**Solution implemented:** Replaced `useState(false)` + `useEffect(() => setMounted(true), [])` with a small external store and `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`. The store is `false` on server and first client render (placeholder), then flips to `true` in a microtask so the date renders client-only without setState-in-effect. React Doctor on the changed file reports no issues (100/100 with `--diff`).

**Ref:** [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

### 2. ~~Refs during render~~ — **Resolved**

**Rule:** `react-hooks-js/refs`  
**File:** `src/features/attachments/components/attachment-input-with-previews.tsx`

**Solution implemented:** Removed ref write during render (`resetRef.current = reset`). Reset is now implemented with `useEffectEvent` and exposed via `useImperativeHandle(ref, () => ({ reset }), [])` so no ref sync effect is needed. `onPreviewsChange` is invoked from the event handlers (handleFilesChange, handleRemovePreview) and from reset via `useEffectEvent`, so the previous `useEffect` was removed. React Doctor on changed files reports no issues (100/100 with `--diff`).

**Ref:** [useRef](https://react.dev/reference/react/useRef)

### 3. ~~React Compiler reorder (JSX expression)~~ — **Resolved**

**Rule:** `react-hooks-js/todo`  
**File:** `src/components/placeholder.tsx`

**Solution implemented:** The compiler could not reorder a JSX element used as a default parameter (`icon = <MessageSquareWarning />`). Default was moved into the component body: `const resolvedIcon = icon ?? <MessageSquareWarning />`, and `resolvedIcon` is used in the render. React Doctor on changed files reports no issues (100/100 with `--diff`).

---

## Warnings by category

### Next.js — SEO (13)

**Rule:** `nextjs-missing-metadata`

Pages without `metadata` or `generateMetadata` hurt SEO. Add:

```ts
export const metadata = { title: '...', description: '...' }
// or
export async function generateMetadata() { ... }
```

**Files:**

- `src/app/(password)/sign-in/otp/verify/page.tsx`
- `src/app/(password)/sign-in/otp/send/page.tsx`
- `src/app/(password)/reset-password/success/page.tsx`
- `src/app/(password)/accept-invitation/[id]/page.tsx`
- `src/app/onboarding/page.tsx`
- `src/app/onboarding/select-active-organisation/page.tsx`
- `src/app/@auth/[...catchAll]/page.tsx`
- `src/app/@auth/(.)sign-up/page.tsx`
- `src/app/@auth/(.)sign-in/page.tsx`
- `src/app/@auth/(.)forgot-password/page.tsx`
- `src/app/(password)/verify-email/otp/verify/page.tsx`
- `src/app/(password)/verify-email/otp/send/page.tsx`
- `src/app/(password)/sign-out/page.tsx`

### Performance (4)

**Sequential awaits (3)** — `react-doctor/async-parallel` — **Acknowledged (intentional order)**

React Doctor suggests `Promise.all()` for the three pages that use sequential `await`. The order is intentional and should not be parallelized:

1. **`await connection()`** — Ensures dynamic rendering (no static shell) so the route is not cached incorrectly.
2. **`const { id } = await params`** — Next.js needs params to be awaited so it can determine the PPR/cache shell when `cacheLifecycle` (or similar) is enabled.
3. **Auth / data** — `getUser()`, `getAdminOwnerOrRedirect(id)`, or `getInvitation(id)` depend on `id` and/or must run after the above.

So the sequence is required; no change.

**Files (order kept as-is):**

- `src/app/(password)/accept-invitation/[id]/page.tsx:19`
- `src/app/(auth)/organisations/[id]/memberships/page.tsx:12`
- `src/app/(auth)/organisations/[id]/invitations/page.tsx:12`

**Hydration flash (1)** — `react-doctor/rendering-hydration-no-flicker`

`src/components/client-date.tsx:18` — `useEffect(setState, [])` on mount can cause a flash. Consider `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)` or `suppressHydrationWarning` on the element.

### State & effects (1)

**Derived state in useState** — `react-doctor/no-derived-useState` — **Fixed**

**File:** `src/features/organisation/components/update-organisation-form.tsx:29`

Fixed by using a lazy initializer: `useState(() => organizationName)` so the initial value is derived once at mount; the input remains a controlled field for editing.

### Correctness (2)

**Array index as key** — `react-doctor/no-array-index-as-key`

Use a stable id (e.g. `item.id`, `item.slug`) instead of index; index keys break on reorder/filter.

**Fix implemented:** `breadcrumbs.tsx` now uses a compound key (`title` + `href`) so keys are stable when the list changes. Skeleton components (e.g. `attachment-list-skeleton.tsx`) will continue using index as key; the list is static and not reordered, so index is acceptable there.

### Accessibility (1)

**autoFocus** — `jsx-a11y/no-autofocus` — **Fixed**

**File:** `src/components/date-picker.tsx:58`

Fixed: `autoFocus` removed from the date-picker.

### Dead code

**Unused files (25)** — `knip/files`

Files not imported anywhere. Consider removing or wiring up.

- `src/components/confirm-dialog.tsx`
- `src/components/spinner.tsx`
- `src/components/streamable.tsx`
- `src/shims/kysely-adapter.ts`
- `src/utils/get-active-path.ts`
- `src/utils/slug.ts`
- `src/components/confirm-dialog/use-confirm-dialog.tsx`
- `src/components/skeletons/heading-skeleton.tsx`
- `src/components/ui/button-group.tsx`
- `src/components/ui/sonner.tsx`
- `src/components/ui/tooltip.tsx`
- `src/features/auth/components/change-password-form.tsx`
- `src/features/auth/components/require-auth.tsx`
- `src/features/auth/components/sign-out-form.tsx`
- `src/features/auth/dto/items-with-ownership.ts`
- `src/features/auth/dto/items-with-permissions.ts`
- `src/features/comment/components/comment-attachments.tsx`
- `src/features/memberships/queries/get-attachments-by-ticket.ts`
- `src/features/memberships/utils/permission.ts`
- `src/features/password/actions/github-signin.ts`
- `src/features/password/emails/send-password-reset-email.tsx`
- `src/features/ticket/components/ticket-filter-dropdown.tsx`
- `src/features/ticket/components/ticket-owner-options.tsx`
- `src/features/ticket/hooks/use-ticket-optimistic.ts`
- `src/features/ticket/utils/detail-element.tsx`

**Unused exports (39)** — `knip/exports`

Exports that are never used (e.g. `resetPasswordPath` in `src/path.ts`). Trim or use.

**Unused types (30)** — `knip/types`

TypeScript types that are never referenced. Remove or use.

For full scan (all 379 files): add `apps/web/react-doctor.config.json` with `{ "diff": false }` and run `npx -y react-doctor@latest apps/web --verbose`. Without that, React Doctor only scans uncommitted changes. Full diagnostics are also written to a temp path (e.g. `/tmp/react-doctor-*.`) when run with `--verbose`.

---

## Best-practice checklist

- [x] ~~Fix setState in effect~~ — `client-date.tsx` now uses `useSyncExternalStore` (see Errors §1).
- [x] ~~Fix ref in render~~ — `attachment-input-with-previews.tsx` now uses `useEffectEvent` and callback-in-handlers (see Errors §2).
- [x] ~~Fix placeholder reorder~~ — `placeholder.tsx` now resolves default icon in the body (see Errors §3).
- [ ] Add `metadata` or `generateMetadata` to the 13 pages missing it.
- [x] ~~Sequential awaits~~ — Intentional: `connection()` → `params` → auth/data; order required for dynamic/PPR and dependent work (see Performance above).
- [ ] Fix date hydration in `client-date.tsx` (e.g. `useSyncExternalStore` or `suppressHydrationWarning`).
- [x] ~~Derive `organizationName` in render~~ — Fixed with lazy initializer `useState(() => organizationName)` (see State & effects above).
- [x] ~~Use stable keys~~ — Breadcrumbs use compound key (`title` + `href`). Skeletons keep index keys (static list, no reorder); see Correctness above.
- [x] ~~Remove `autoFocus` from `date-picker.tsx`~~ — Removed (see Accessibility above).
- [ ] Periodically remove or use unused files, exports, and types (knip findings).

---

## References

- [React Doctor](https://www.react.doctor)
- [React: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React: useRef](https://react.dev/reference/react/useRef)
- [Next.js: Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- Skill: `.agents/react-doctor` (run after React changes)
