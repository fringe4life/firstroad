# Vercel React Best Practices — Codebase Violations

Assessment of this codebase against the **versioned** Vercel React Best Practices (Vercel Engineering, January 2026). Rules are maintained at [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) in `skills/react-best-practices/`. The full guide (AGENTS.md, ~57 rules across 8 categories) can be fetched for detailed examples:

- Full guide: `https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-best-practices/AGENTS.md`
- Individual rule: `https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-best-practices/rules/{rule-name}.md`

Each section below maps to a rule category and lists concrete violations with file paths and suggested fixes.

**Last reassessed:** March 2026 — Re-examined against current versioned skills (AGENTS.md v1.0.0). Previous assessment: React Doctor report and fixes (breadcrumbs compound key, date-picker autoFocus removed, update-organisation-form lazy state, attachment reset callback deferred). Sequential awaits for three pages remain intentional; see [react-doctor-report.md](react-doctor-report.md).

---

## 1. async-* (Eliminating Waterfalls)

### async-parallel — Promise.all() for independent operations (CRITICAL)

**Rule:** When async operations have no interdependencies, run them concurrently with `Promise.all()`.

**Acknowledged (intentional order, no change):** The following three pages keep a strict sequence by design: `connection()` first (dynamic rendering), then `await params` (PPR/cache shell), then auth or data that depends on `id`. Do not parallelize these. See [react-doctor-report.md § Performance](react-doctor-report.md#performance-4).

| Location | Status |
|----------|--------|
| [src/app/(password)/accept-invitation/[id]/page.tsx](../apps/web/src/app/(password)/accept-invitation/[id]/page.tsx) | Intentional: connection → params → getUser → getInvitation. |
| [src/app/(auth)/organisations/[id]/invitations/page.tsx](../apps/web/src/app/(auth)/organisations/[id]/invitations/page.tsx) | Intentional: connection → params → getAdminOwnerOrRedirect(id). |
| [src/app/(auth)/organisations/[id]/memberships/page.tsx](../apps/web/src/app/(auth)/organisations/[id]/memberships/page.tsx) | Intentional: same pattern. |

**Optional improvements** (independent work could be parallelized):

| Location | Issue | Suggestion |
|----------|--------|------------|
| [src/app/(auth)/tickets/[slug]/edit/page.tsx](../apps/web/src/app/(auth)/tickets/[slug]/edit/page.tsx) | Sequential: `connection()`, then `getUserOrRedirect()`, then `params`, then `itemWithPermissions(...)`. | Optional: `const [user, { slug }] = await Promise.all([getUserOrRedirect(), params]);` then await ticket; keep `connection()` first if dynamic shell is required. |
| [src/app/(auth)/account/profile/page.tsx](../apps/web/src/app/(auth)/account/profile/page.tsx) | Sequential: `connection()`, then `getUserOrRedirect()`. | Optional: `Promise.all([connection(), getUserOrRedirect()])`; keep stats fetch in child (depends on user). |
| [src/app/(auth)/tickets/[slug]/page.tsx](../apps/web/src/app/(auth)/tickets/[slug]/page.tsx) | Ticket and comments parallelized; attachments after. | Attachments depend on `ticket.id`; current pattern acceptable. |

### async-defer-await — Defer await until needed (CRITICAL)

**Rule:** Move `await` into branches where the value is actually used to avoid unnecessary serialization.

- No clear violations found: awaits are generally in the branch that uses the result. When adding new async code, keep awaits as close as possible to usage.

### async-suspense-boundaries (CRITICAL)

**Rule:** Use Suspense to stream content and avoid blocking the shell.

- The app already uses `Suspend` (Suspense) on profile, organisations, select-active-organisation, tickets, and comments. No systematic violation. Continue wrapping async UI in Suspense where appropriate.

### tryCatch util and sequential awaits (async-parallel)

**Rule:** Use `Promise.all()` for independent async work; avoid sequential `await` when operations do not depend on each other.

**[src/utils/try-catch.ts](../apps/web/src/utils/try-catch.ts)** wraps a single async `operation()` and awaits it. So any caller that does:

- `await tryCatch(() => op1()); await tryCatch(() => op2());`  
  runs **sequentially**. That is a hidden source of sequential awaits when `op1` and `op2` are independent.

**Good pattern (already in codebase):** [src/features/pagination/dal/paginate-items.ts](../apps/web/src/features/pagination/dal/paginate-items.ts) runs two independent operations in parallel:

- `const [{ data: items }, { data: itemsCount }] = await Promise.all([tryCatch(() => getItems()), tryCatch(() => getItemsCount())]);`

**Audit:** Call sites that use multiple `tryCatch` in sequence (e.g. upsert-comment, verify-otp-action, event-email-otp, auth events) were reviewed. In those flows each step depends on the previous (e.g. parse then send, userExists then auth.api, findTicket then createComment then createAttachments), so sequential `await tryCatch(...)` is correct. No change required there.

**Recommendation:** When adding or refactoring code that uses `tryCatch`, avoid sequential `await tryCatch(op1); await tryCatch(op2);` when `op1` and `op2` are independent; use `Promise.all([tryCatch(op1), tryCatch(op2)])` instead. When operations depend on earlier results, sequential awaits are appropriate.

---

## 2. bundle-* (Bundle size)

### bundle-barrel-imports (CRITICAL)

**Rule:** Import directly from package entry points; avoid barrel files that pull in unused code.

| Location | Issue | Suggestion |
|----------|--------|------------|
| Package-level barrels | [PACKAGE_BARREL_FILE_ANALYSIS.md](PACKAGE_BARREL_FILE_ANALYSIS.md) notes **valibot** and **@radix-ui/*** as packages with barrel file issues. Imports like `from "valibot"` or `from "@radix-ui/react-dialog"` can pull extra code. | **Current:** `next.config` sets `optimizePackageImports: ["valibot"]` only when `!isDev` (production). In dev, valibot is not optimized. Consider adding `"valibot"` in dev as well if dev bundle/start is slow, or document why dev is excluded. For **@radix-ui/\***, add to `optimizePackageImports` per the analysis doc if measuring shows benefit. |
| lucide-react | Many files import from `lucide-react`. | Next.js optimizes `lucide-react` by default; no change required per PACKAGE_BARREL_FILE_ANALYSIS.md. |

- No internal `index.ts` barrels under `src/` were found; the main concern is package-level barrels.

---

## 3. server-* (Server-side performance)

### server-auth-actions (CRITICAL)

**Rule:** Authenticate and authorize inside each server action; treat them like API routes.

- **Status:** Server actions checked (invitation-decision, accept-invitation, reject-invitation, create-attachment, create-invitation, cancel-invitation, upsert-ticket, update-status, delete-ticket, toggle-permission, update-member-role, set-active-organisation, update-organisation, signin, github-signin, signout, create-organisation, change-password-action, verify-otp, send-otp, signup, reset-password, forgot-password) either call `getUserOrRedirect()`, `getAdminOwnerOrRedirect()`, or `auth.api.*` with `headers()`. No action was found that performs a mutation without an auth check.
- **Recommendation:** Keep this pattern; for any new server action that mutates data, add an explicit auth/authorization check at the top.

### server-cache-react / server-cache-lru / server-parallel-fetching / server-serialization / server-dedup-props / server-after-nonblocking

- **React.cache():** Used in `apps/web/src/features/auth/queries/get-user.ts` for per-request deduplication of `getUser()`. Good.
- **server-after-nonblocking:** No use of `after()` from `next/server` was found. Consider using `after()` for logging, analytics, or other non-blocking work in API routes or server actions so the response is not delayed.
- **server-serialization / server-dedup-props:** See [RSC_SERIALIZATION_AUDIT.md](RSC_SERIALIZATION_AUDIT.md). Detail-page ticket actions already receive minimal props at the client boundary (`TicketDetailActionsDesktop` passes only `{ id, slug, status }` to client). List page still serializes full ticket to `TicketListItem` (client) for card display; actions already get minimal. Comments list from server to `Comments` (client) still sends full comment objects; `CommentOwnerButtons` receives minimal `{ id, content }` when rendered from client `CommentList`.
- **LRU cache / parallel fetching / dedup:** No systematic audit. Worth a targeted pass when optimizing server data flow and payload size.

---

## 4. rerender-* and rendering-* (Re-renders and rendering)

### rendering-conditional-render (MEDIUM)

**Rule (6.8 in AGENTS.md):** Use explicit conditional rendering (e.g. ternary) instead of `condition && <JSX />` to avoid accidentally rendering `0` or other falsy values.

| Location | Issue | Suggestion |
|----------|--------|------------|
| [src/features/invitations/components/accept-invitation-card.tsx](../apps/web/src/features/invitations/components/accept-invitation-card.tsx) | `{invitation.inviterName && (<p>...</p>)}` | Use ternary: `{invitation.inviterName ? <p>...</p> : null}`. |
| [src/components/form/submit-button.tsx](../apps/web/src/components/form/submit-button.tsx) | `{shouldShowLoader && (<LucideLoaderCircle ... />)}`, `{shouldShowIcon && cloneElement(...)}` | Use ternary: `{shouldShowLoader ? <LucideLoaderCircle ... /> : null}`; `shouldShowLoader` is boolean (pending \|\| showLoader) but ternary avoids any falsy edge case. |
| [src/components/ui/dialog.tsx](../apps/web/src/components/ui/dialog.tsx) | `{Boolean(showCloseButton) && (...)}` | Use ternary: `{showCloseButton ? (...) : null}`. |
| [src/components/skeletons/heading-skeleton.tsx](../apps/web/src/components/skeletons/heading-skeleton.tsx) | `{showTabs && <TabsSkeleton />}`, `{showActions && <ActionsSkeleton />}` | Use ternary: `{showTabs ? <TabsSkeleton /> : null}`, `{showActions ? <ActionsSkeleton /> : null}`. |
| [src/features/attachments/components/attachments.tsx](../apps/web/src/features/attachments/components/attachments.tsx) | `{isOwner && (<AttachmentCreateForm ... />)}` | Use ternary: `{isOwner ? <AttachmentCreateForm ... /> : null}`. |
| [src/features/navigation/components/nav-items.tsx](../apps/web/src/features/navigation/components/nav-items.tsx) | `{Boolean(item.seperator) && <Separator />}` | Use ternary: `{item.seperator ? <Separator /> : null}`. |
| [src/features/comment/components/comment-create-form.tsx](../apps/web/src/features/comment/components/comment-create-form.tsx) | `{Boolean(commentId) && Boolean(onCancel) && (...)}` | Use ternary: `{commentId && onCancel ? (...) : null}`. |
| [src/features/comment/components/time-ago-client.tsx](../apps/web/src/features/comment/components/time-ago-client.tsx) | `{Boolean(isEdited) && (...)}` | Use ternary: `{isEdited ? (...) : null}`. |
| [src/components/breadcrumbs.tsx](../apps/web/src/components/breadcrumbs.tsx) | `{index < breadcrumbs.length - 1 && (...)}` | Use ternary: `{index < breadcrumbs.length - 1 ? (...) : null}` (avoids rendering `0`). Breadcrumbs key is compound (`title` + `href`). |
| [src/features/auth/components/otp-verify-form.tsx](../apps/web/src/features/auth/components/otp-verify-form.tsx) | `{Boolean(email) && (...)}` | Use ternary: `{email ? (...) : null}`. |
| [src/components/card-compact.tsx](../apps/web/src/components/card-compact.tsx) | `{Boolean(footer) && <CardFooter>...</CardFooter>}` | Use ternary: `{footer ? <CardFooter>...</CardFooter> : null}`. |
| [src/components/ui/input-otp.tsx](../apps/web/src/components/ui/input-otp.tsx) | `{Boolean(hasFakeCaret) && (...)}` | Use ternary: `{hasFakeCaret ? (...) : null}`. |
| [src/features/ticket/components/ticket-owner-options.tsx](../apps/web/src/features/ticket/components/ticket-owner-options.tsx) | `{isDetail && <IconButtonSkeleton />}` | Use ternary: `{isDetail ? <IconButtonSkeleton /> : null}`. |
| [src/features/ticket/components/ticket-more-menu.tsx](../apps/web/src/features/ticket/components/ticket-more-menu.tsx) | `{canUpdate && radioOptions}` | Use ternary: `{canUpdate ? radioOptions : null}`. |
| [src/features/memberships/components/membership-item.tsx](../apps/web/src/features/memberships/components/membership-item.tsx) | `{isCurrentUser && " (you)"}` | Use ternary: `{isCurrentUser ? " (you)" : null}` (avoids rendering `0`). |

### rerender-move-effect-to-event (MEDIUM)

**Rule:** Put interaction logic (e.g. submit, click) in event handlers, not in state + useEffect.

- No violation found: form submission and confirm flows use actions and event-driven handlers. The previous accept/reject race was fixed with a single form and no useEffect.

### rendering-usetransition-loading (LOW)

**Rule:** Prefer `useTransition` or framework-provided pending state over manual loading state.

- **Status:** Forms use `useFormStatus()` for pending; confirm dialogs pass `isPending` from action state. No manual `useState` loading flags were found for form/dialog flows. For other loading UI, prefer `useTransition` or `useFormStatus` where applicable.

### rerender-* (other)

- No audit was done for memo, derived state, effect dependencies, or lazy state init. Worth a targeted pass on hot components if re-renders become a concern.

---

## 5. client-* (Client-side data fetching and events)

- **client-swr-dedup / client-event-listeners / client-passive-event-listeners / client-localstorage-schema:** Not audited. Consider when adding or refactoring client data fetching, global listeners, scroll handlers, or localStorage.

---

## 6. js-* (JavaScript performance)

- **js-early-exit / js-set-map-lookups / js-index-maps / js-cache-* / js-combine-iterations / js-length-check-first / js-hoist-regexp / js-min-max-loop / js-tosorted-immutable / js-batch-dom-css:** No systematic scan. No `.sort()` usage was found in `src/` (no js-tosorted-immutable violation). Apply these rules when optimizing hot paths or list operations.

---

## 7. advanced-* (Advanced patterns)

- **advanced-event-handler-refs / advanced-init-once / advanced-use-latest:** Not audited. Consider when stabilizing callbacks or avoiding re-initialization on mount.

---

## Summary

| Category | Rule | Violations | Priority |
|----------|------|------------|----------|
| async | async-parallel | 3 pages acknowledged (intentional order); 2 optional (edit page, profile page). Ticket detail page already uses `Promise.all` for ticket + comments. | — / Low |
| async | tryCatch + sequential await | Hidden source: `tryCatch` awaits one op; multiple `await tryCatch(...)` = sequential. Use `Promise.all([tryCatch(a), tryCatch(b)])` when independent. paginate-items.ts is correct; other call sites are dependency chains. | Watch when adding code |
| async | async-defer-await / async-suspense-boundaries | 0 | — |
| bundle | bundle-barrel-imports | valibot in `optimizePackageImports` only when `!isDev`. Consider @radix-ui per [PACKAGE_BARREL_FILE_ANALYSIS.md](PACKAGE_BARREL_FILE_ANALYSIS.md). lucide-react optimized by Next by default. | Medium |
| server | server-auth-actions | 0 | — |
| server | server-cache-react | `getUser` uses `React.cache()`. | — |
| server | server-after-nonblocking | No `after()` usage; consider for logging/analytics. | Low |
| server | server-serialization | See [RSC_SERIALIZATION_AUDIT.md](RSC_SERIALIZATION_AUDIT.md). Detail actions already minimal; list ticket + comments list still send full objects at boundary. | Medium |
| rendering | rendering-conditional-render | 15 files using `&&` for conditionals (see table above). | Medium |
| rerender | rerender-move-effect-to-event | 0 | — |
| rendering | rendering-usetransition-loading | 0 | — |

Recommended order of work: (1) Replace `condition && <JSX />` with `condition ? <JSX /> : null` in the 15 listed files to satisfy rendering-conditional-render (rule 6.8). (2) Consider adding `optimizePackageImports` for valibot in dev if dev build is slow; consider @radix-ui per [PACKAGE_BARREL_FILE_ANALYSIS.md](PACKAGE_BARREL_FILE_ANALYSIS.md). (3) Optionally use `after()` from `next/server` for non-blocking work in API routes or server actions. (4) Optionally parallelize edit and profile page awaits if dynamic/params ordering is not required. (5) When using `tryCatch` for multiple independent operations, use `Promise.all([tryCatch(op1), tryCatch(op2)])` instead of sequential `await tryCatch(...)`.
