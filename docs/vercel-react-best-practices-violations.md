# Vercel React Best Practices — Codebase Violations

Assessment of this codebase against the rules in `.agents/skills/vercel-react-best-practices/`. Each section maps to a rule category or rule and lists concrete violations with file paths and suggested fixes.

---

## 1. async-* (Eliminating Waterfalls)

### async-parallel — Promise.all() for independent operations (CRITICAL)

**Rule:** When async operations have no interdependencies, run them concurrently with `Promise.all()`.

| Location | Issue | Suggestion |
|----------|--------|------------|
| [src/app/(auth)/tickets/[slug]/edit/page.tsx](../src/app/(auth)/tickets/[slug]/edit/page.tsx) | Sequential: `user = await getUserOrRedirect()`, then `{ slug } = await params`, then `ticket = await itemWithOwnership(...)`. `params` and `getUserOrRedirect()` are independent. | Start both early: `const [user, { slug }] = await Promise.all([getUserOrRedirect(), params]);` then await `itemWithOwnership(getTicketBySlug(slug), user)`. |
| [src/app/(auth)/account/profile/page.tsx](../src/app/(auth)/account/profile/page.tsx) | Sequential: `await connection()`, then `await getUserOrRedirect()`, then (in child) `await getUserTicketStats(user.id)`. `connection()` and `getUserOrRedirect()` are independent. | Use `Promise.all([connection(), getUserOrRedirect()])` at page level; keep stats fetch in child (it depends on user). |
| [src/app/(password)/accept-invitation/[id]/page.tsx](../src/app/(password)/accept-invitation/[id]/page.tsx) | Sequential: `await connection()`, then `await params`, then `getUser()`, then `getInvitation(id)`. After params, `getUser()` and `getInvitation(id)` are independent. | After `const { id } = await params`, run `const [userResult, invitation] = await Promise.all([getUser(), getInvitation(id)]);` (then handle redirect if !hasUser). |
| [src/app/(auth)/tickets/[slug]/page.tsx](../src/app/(auth)/tickets/[slug]/page.tsx) | Ticket and comments are already parallelized with `Promise.all`. Attachments are fetched after: `await getAttachmentsByTicket(ticket.id)`. | Attachments depend on `ticket.id`; optional improvement: start `getAttachmentsByTicket(ticket.id)` only after ticket resolves, or pass a promise from the same parallel batch if the API allows. Current pattern is acceptable. |

### async-defer-await — Defer await until needed (CRITICAL)

**Rule:** Move `await` into branches where the value is actually used to avoid unnecessary serialization.

- No clear violations found: awaits are generally in the branch that uses the result. When adding new async code, keep awaits as close as possible to usage.

### async-suspense-boundaries (CRITICAL)

**Rule:** Use Suspense to stream content and avoid blocking the shell.

- The app already uses `Suspend` (Suspense) on profile, organisations, select-active-organisation, tickets, and comments. No systematic violation. Continue wrapping async UI in Suspense where appropriate.

---

## 2. bundle-* (Bundle size)

### bundle-barrel-imports (CRITICAL)

**Rule:** Import directly from package entry points; avoid barrel files that pull in unused code.

| Location | Issue | Suggestion |
|----------|--------|------------|
| Package-level barrels | [PACKAGE_BARREL_FILE_ANALYSIS.md](PACKAGE_BARREL_FILE_ANALYSIS.md) notes **valibot** and **@radix-ui/*** as packages with barrel file issues. Imports like `from "valibot"` or `from "@radix-ui/react-dialog"` can pull extra code. | Add `optimizePackageImports` in `next.config` for `valibot` and relevant `@radix-ui/*` packages per the analysis doc; or import from subpaths where the package supports it. |
| [src/features/ticket/components/*](../src/features/ticket/components/) | Several files import from `@/features/constants` (e.g. `TICKET_ICONS`, `TICKET_STATUS_LABELS`, `TICKET_SORT_OPTIONS`). | If `@/features/constants` is a barrel that re-exports many constants, consider importing from feature-specific constant files (e.g. `@/features/ticket/constants`) to improve tree-shaking. |

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
| [src/features/invitations/components/accept-invitation-card.tsx](../src/features/invitations/components/accept-invitation-card.tsx) | `{invitation.inviterName && (<p>...</p>)}` | Use ternary: `{invitation.inviterName ? <p>...</p> : null}`. |
| [src/components/form/submit-button.tsx](../src/components/form/submit-button.tsx) | `{shouldShowLoader && (<LucideLoaderCircle ... />)}` | Use ternary: `{shouldShowLoader ? <LucideLoaderCircle ... /> : null}` (or keep if `shouldShowLoader` is strictly boolean). |
| [src/components/ui/dialog.tsx](../src/components/ui/dialog.tsx) | `{Boolean(showCloseButton) && (...)}` | Use ternary: `{showCloseButton ? (...) : null}`. |
| [src/components/heading-skeleton.tsx](../src/components/heading-skeleton.tsx) | `{showTabs && (...)}`, `{showActions && (...)}` | Use ternary: `{showTabs ? (...) : null}`, `{showActions ? (...) : null}`. |
| [src/features/attachments/components/attachments.tsx](../src/features/attachments/components/attachments.tsx) | `{isOwner && (...)}` | Use ternary if `isOwner` can be non-boolean; otherwise acceptable. |
| [src/features/navigation/components/nav-items.tsx](../src/features/navigation/components/nav-items.tsx) | `{Boolean(item.seperator) && <Separator />}` | Use ternary: `{item.seperator ? <Separator /> : null}`. |
| [src/features/comment/components/comment-create-form.tsx](../src/features/comment/components/comment-create-form.tsx) | `{Boolean(commentId) && Boolean(onCancel) && (...)}` | Use ternary: `{commentId && onCancel ? (...) : null}`. |
| [src/features/comment/components/time-ago-client.tsx](../src/features/comment/components/time-ago-client.tsx) | `{Boolean(isEdited) && (...)}` | Use ternary: `{isEdited ? (...) : null}`. |
| [src/components/breadcrumbs.tsx](../src/components/breadcrumbs.tsx) | `{index < breadcrumbs.length - 1 && (...)}` | Use ternary: `{index < breadcrumbs.length - 1 ? (...) : null}` (avoids rendering `0`). |
| [src/features/auth/components/otp-verify-form.tsx](../src/features/auth/components/otp-verify-form.tsx) | `{Boolean(email) && (...)}` | Use ternary: `{email ? (...) : null}`. |
| [src/components/card-compact.tsx](../src/components/card-compact.tsx) | `{Boolean(footer) && <CardFooter>...</CardFooter>}` | Use ternary: `{footer ? <CardFooter>...</CardFooter> : null}`. |
| [src/components/ui/input-otp.tsx](../src/components/ui/input-otp.tsx) | `{Boolean(hasFakeCaret) && (...)}` | Use ternary: `{hasFakeCaret ? (...) : null}`. |

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
| async | async-parallel | 3 (edit ticket page, profile page, accept-invitation page) | High |
| async | async-defer-await / async-suspense-boundaries | 0 | — |
| bundle | bundle-barrel-imports | Package barrels (valibot, @radix-ui); optional feature constants barrel | High (packages) |
| server | server-auth-actions | 0 | — |
| rendering | rendering-conditional-render | 12+ files using `&&` for conditionals | Medium |
| rerender | rerender-move-effect-to-event | 0 | — |
| rendering | rendering-usetransition-loading | 0 | — |

Recommended order of work: (1) Add parallel awaits where independent (edit page, profile page, accept-invitation page). (2) Add `optimizePackageImports` for valibot and @radix-ui per existing analysis. (3) Replace `condition && <JSX />` with `condition ? <JSX /> : null` in the listed files to satisfy rendering-conditional-render and avoid rendering falsy values.
