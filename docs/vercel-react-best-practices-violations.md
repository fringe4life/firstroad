# Vercel React Best Practices — Codebase Violations

Assessment of this codebase against the rules in `.agents/skills/vercel-react-best-practices/` and `.agents/skills/next-best-practices/` (Vercel next-skills bundle). Each section maps to a rule category or rule and lists concrete violations with file paths and suggested fixes.

**Last reassessed:** After React Doctor report and recent fixes (breadcrumbs compound key, date-picker autoFocus removed, update-organisation-form lazy state, attachment reset callback deferred). Sequential awaits for three pages are acknowledged as intentional; see [react-doctor-report.md](react-doctor-report.md). Rechecked against next-best-practices and vercel-react-best-practices skills; added note on `tryCatch` and sequential awaits.

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
| Package-level barrels | [PACKAGE_BARREL_FILE_ANALYSIS.md](PACKAGE_BARREL_FILE_ANALYSIS.md) notes **valibot** and **@radix-ui/*** as packages with barrel file issues. Imports like `from "valibot"` or `from "@radix-ui/react-dialog"` can pull extra code. | Add `optimizePackageImports` in `next.config` for `valibot` and relevant `@radix-ui/*` packages per the analysis doc; or import from subpaths where the package supports it. |

- No internal `index.ts` barrels under `src/` were found; the main concern is package-level barrels.

---

## 3. server-* (Server-side performance)

### server-auth-actions (CRITICAL)

**Rule:** Authenticate and authorize inside each server action; treat them like API routes.

- **Status:** Server actions checked (invitation-decision, accept-invitation, reject-invitation, create-attachment, create-invitation, cancel-invitation, upsert-ticket, update-status, delete-ticket, toggle-permission, update-member-role, set-active-organisation, update-organisation, signin, github-signin, signout, create-organisation, change-password-action, verify-otp, send-otp, signup, reset-password, forgot-password) either call `getUserOrRedirect()`, `getAdminOwnerOrRedirect()`, or `auth.api.*` with `headers()`. No action was found that performs a mutation without an auth check.
- **Recommendation:** Keep this pattern; for any new server action that mutates data, add an explicit auth/authorization check at the top.

### server-cache-react / server-cache-lru / server-parallel-fetching / server-serialization / server-dedup-props / server-after-nonblocking

- No systematic audit was done for React cache, LRU cache, parallel fetching, serialization size, or dedup. Worth a separate pass when optimizing server data flow and payload size.

---

## 4. rerender-* and rendering-* (Re-renders and rendering)

### rendering-conditional-render (MEDIUM)

**Rule:** Use explicit conditional rendering (e.g. ternary) instead of `condition && <JSX />` to avoid accidentally rendering `0` or other falsy values.

| Location | Issue | Suggestion |
|----------|--------|------------|
| [src/features/invitations/components/accept-invitation-card.tsx](../apps/web/src/features/invitations/components/accept-invitation-card.tsx) | `{invitation.inviterName && (<p>...</p>)}` | Use ternary: `{invitation.inviterName ? <p>...</p> : null}`. |
| [src/components/form/submit-button.tsx](../apps/web/src/components/form/submit-button.tsx) | `{shouldShowLoader && (<LucideLoaderCircle ... />)}` | Use ternary: `{shouldShowLoader ? <LucideLoaderCircle ... /> : null}` (or keep if `shouldShowLoader` is strictly boolean). |
| [src/components/ui/dialog.tsx](../apps/web/src/components/ui/dialog.tsx) | `{Boolean(showCloseButton) && (...)}` | Use ternary: `{showCloseButton ? (...) : null}`. |
| [src/components/skeletons/heading-skeleton.tsx](../apps/web/src/components/skeletons/heading-skeleton.tsx) | `{showTabs && (...)}`, `{showActions && (...)}` | Use ternary: `{showTabs ? (...) : null}`, `{showActions ? (...) : null}`. |
| [src/features/attachments/components/attachments.tsx](../apps/web/src/features/attachments/components/attachments.tsx) | `{isOwner && (...)}` | Use ternary if `isOwner` can be non-boolean; otherwise acceptable. |
| [src/features/navigation/components/nav-items.tsx](../apps/web/src/features/navigation/components/nav-items.tsx) | `{Boolean(item.seperator) && <Separator />}` | Use ternary: `{item.seperator ? <Separator /> : null}`. |
| [src/features/comment/components/comment-create-form.tsx](../apps/web/src/features/comment/components/comment-create-form.tsx) | `{Boolean(commentId) && Boolean(onCancel) && (...)}` | Use ternary: `{commentId && onCancel ? (...) : null}`. |
| [src/features/comment/components/time-ago-client.tsx](../apps/web/src/features/comment/components/time-ago-client.tsx) | `{Boolean(isEdited) && (...)}` | Use ternary: `{isEdited ? (...) : null}`. |
| [src/components/breadcrumbs.tsx](../apps/web/src/components/breadcrumbs.tsx) | `{index < breadcrumbs.length - 1 && (...)}` | Use ternary: `{index < breadcrumbs.length - 1 ? (...) : null}` (avoids rendering `0`). Breadcrumbs key is now compound (`title` + `href`). |
| [src/features/auth/components/otp-verify-form.tsx](../apps/web/src/features/auth/components/otp-verify-form.tsx) | `{Boolean(email) && (...)}` | Use ternary: `{email ? (...) : null}`. |
| [src/components/card-compact.tsx](../apps/web/src/components/card-compact.tsx) | `{Boolean(footer) && <CardFooter>...</CardFooter>}` | Use ternary: `{footer ? <CardFooter>...</CardFooter> : null}`. |
| [src/components/ui/input-otp.tsx](../apps/web/src/components/ui/input-otp.tsx) | `{Boolean(hasFakeCaret) && (...)}` | Use ternary: `{hasFakeCaret ? (...) : null}`. |

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
| async | async-parallel | 3 pages acknowledged (intentional order); 2 optional (edit page, profile page) | — / Low |
| async | tryCatch + sequential await | Hidden source: `tryCatch` awaits one op; multiple `await tryCatch(...)` = sequential. Use `Promise.all([tryCatch(a), tryCatch(b)])` when independent. paginate-items.ts is correct; other call sites are dependency chains. | Watch when adding code |
| async | async-defer-await / async-suspense-boundaries | 0 | — |
| bundle | bundle-barrel-imports | Package barrels (valibot, @radix-ui); optional feature constants barrel | High (packages) |
| server | server-auth-actions | 0 | — |
| rendering | rendering-conditional-render | 12+ files using `&&` for conditionals | Medium |
| rerender | rerender-move-effect-to-event | 0 | — |
| rendering | rendering-usetransition-loading | 0 | — |

Recommended order of work: (1) Add `optimizePackageImports` for valibot and @radix-ui per [PACKAGE_BARREL_FILE_ANALYSIS.md](PACKAGE_BARREL_FILE_ANALYSIS.md). (2) Replace `condition && <JSX />` with `condition ? <JSX /> : null` in the listed files to satisfy rendering-conditional-render. (3) Optionally parallelize edit and profile page awaits if dynamic/params ordering is not required there. (4) When using `tryCatch` for multiple independent operations, use `Promise.all([tryCatch(op1), tryCatch(op2)])` instead of sequential `await tryCatch(...)`.
