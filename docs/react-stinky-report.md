# React Stinky report, repo sweep (`apps/web`)

Holistic maintainability scan of the React/TypeScript UI using [react-stinky](https://github.com/saschb2b/skills/blob/main/skills/engineering/react-stinky/SKILL.md) (catalog 2026-07-17).

**Scope:** `apps/web/src/**/*.tsx` plus hooks (`use-*.ts`) and shared modules. Skipped `node_modules`, build output, generated Better Auth schema, `*.test.*`, `*.stories.*`. Prioritized `components/`, feature `components/` / `hooks/`, and exported UI.

**Deferred (sibling skills not installed):**

- Memoization / re-render churn (`useMemo`, `useCallback`, `React.memo`, inline context `value={{...}}`) → `react-compiler`.
- Color literals: `hover:bg-gray-50` in `comment-create-form.tsx` → `theme-colors`.

shadcn/Base UI primitives with `outline-none` plus `focus-visible:ring-*` were not flagged (focus replacement exists).

---

## Rancid (fix now)

### Cluster: unlabeled icon-only controls (accessibility-props / label-association)

**Smell:** `size="icon"` buttons, icon-only links, and icon-only submit controls ship Lucide icons with no `aria-label`, no visible text, and no `title`. Screen readers announce an empty button.

**Cost:** Keyboard and assistive-tech users cannot tell Edit / Delete / Attach / Switch org / Theme / Pagination apart. WCAG 4.1.2 Name, Role, Value fails.

**Fix:** Require an accessible name. Prefer visible text; otherwise `aria-label` (or `aria-labelledby`). On `SubmitButton` / `PendingIconButton`, make `aria-label` required when `label` is omitted. At the `size="icon"` call sites, pass a verb + object (`aria-label="Delete comment"`).

**Source:** [MDN aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)

Locations (app code; skip `mobile-menu-button.tsx` and `attachment-preview.tsx`, which already label):

| File | Control |
| --- | --- |
| `src/components/theme/theme-switcher.tsx` ~20 | Theme toggle (Sun/Moon only) |
| `src/components/form/submit-button.tsx` ~35 | Icon-only submit when `label` omitted |
| `src/components/pending-icon-button.tsx` ~49 | Icon button API does not require a name |
| `src/features/comment/components/comment-edit-button.tsx` ~13 | Pencil |
| `src/features/comment/components/add-comment-attachment-button.tsx` ~34 | Paperclip |
| `src/features/comment/components/comment-delete-button.tsx` ~23 | Trash via `PendingIconButton` |
| `src/features/attachments/components/attachment-item.tsx` ~74 | Trash submit |
| `src/features/organisation/components/switch-org-button.tsx` ~47 | Switch-org icon |
| `src/features/organisation/components/organisation-action-buttons.tsx` ~62, ~74, ~105, ~128 | Open / edit / leave / delete (and empty disabled spacers) |
| `src/features/memberships/components/membership-action-buttons.tsx` ~53, ~63 | Remove member + empty spacer |
| `src/features/memberships/components/memberships-more-menu.tsx` ~75 | Role cog |
| `src/features/memberships/components/permission-toggle.tsx` ~69 | Ban/Check submit |
| `src/features/invitations/components/invitation-cancel-button.tsx` ~32 | Trash |
| `src/features/ticket/components/ticket-actions-desktop.tsx` ~31, ~49, ~62, ~78 | View / edit links and more-menu trigger |
| `src/features/pagination/components/pagination.tsx` ~63, ~74 | Prev/next chevrons |
| `src/features/auth/components/account-dropwdown.tsx` ~25 | Avatar trigger |
| `src/components/responsive-label.tsx` ~38 | Small breakpoint renders icon only; text spans use `hidden` so they drop out of the a11y tree |

`InviteMemberButton` uses `ResponsiveLabel`, so it is named at medium/large widths and unnamed at the icon-only breakpoint.

---

### `src/features/comment/components/add-comment-attachment-button.tsx` ~50

**[Rancid] accidental-global (correctness)**

**Smell:** `useToggle` is destructured as `{ value: isOpen, open, onOpenChange }` — `close` is not taken. `onSuccess={close}` therefore binds the DOM global `Window.close` (`lib.dom.d.ts`).

**Cost:** Successful upload tries to close the **browser window**, not the dialog. Dialog stays open. In some browsers nothing happens; in others the tab closes.

**Fix:** Destructure `close` from `useToggle` (same pattern as `invite-member-button.tsx` and `organisation-action-buttons.tsx`).

```ts
const { value: isOpen, open, close, onOpenChange } = useToggle(false);
```

**Source:** [MDN Window.close](https://developer.mozilla.org/en-US/docs/Web/API/Window/close)

---

### `src/components/search-input.tsx` ~21

**[Rancid] label-association (a11y markup)**

**Smell:** Shared `SearchInput` renders a bare `<Input>` with `placeholder` as the only name. No `<Label>`, `aria-label`, or `aria-labelledby`. `TicketSearchInput` inherits this (`placeholder="Search tickets ..."`).

**Cost:** Placeholder is a hint, not a name. Once the field has a value, the name disappears. Autofill and SR users get an unlabeled textbox.

**Fix:** Associate a visible label, or pass `aria-label={placeholder}` (and keep placeholder as hint only). Prefer a `label` prop on `SearchInput`.

**Source:** [MDN label](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)

---

### `src/features/comment/components/comments-store.tsx` ~163

**[Rancid] async-handler (async / error handling)**

**Smell:** `handleLoadMore` fires an async IIFE inside `startTransition` with no `try`/`catch` and no error state.

```ts
startTransition(() => {
  (async () => {
    const newData = await loadMoreAction(/* ... */);
    setCommentsState(/* ... */);
  })();
});
```

**Cost:** A failed load-more is an unhandled rejection. UI stays on “Load More” / pending with no explanation. Double-click can overlap requests (no in-flight guard beyond `isPending` from an unrelated upsert transition).

**Fix:** Own the promise: `try`/`catch`, land failure in state the list can render, disable while that request is in flight. Prefer the existing action-state helper over a raw IIFE.

**Source:** [React useActionState](https://react.dev/reference/react/useActionState)

---

### `src/features/ticket/components/ticket-upsert-form.tsx` ~84

**[Rancid] default-values (falsy clobber)**

**Smell:** `ticket?.bounty ? fromCent(ticket?.bounty) : ""` treats `0` as missing.

**Cost:** A ticket with bounty `0` shows an empty bounty field on edit. Same class of bug as `value || 50`.

**Fix:** Test presence (`ticket?.bounty != null`) or always format (`fromCent(ticket.bounty ?? 0)` if zero is a real default).

**Source:** [MDN destructuring defaults](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#default_value)

---

## Funky (should fix)

### `src/components/search-input.tsx` ~6

**[Funky] callback-naming (component API)**

**Smell:** Custom wrapper exposes generic `onChange: (value: string) => void`.

**Cost:** Call sites cannot tell it is a committed string, not a DOM event. Collides with native `onChange` mental model.

**Fix:** Rename to `onValueChange`. Keep native `onChange` only on the inner `<Input>`.

**Source:** [React, naming event-handler props](https://react.dev/learn/responding-to-events#naming-event-handler-props)

---

### `src/components/form/form.tsx` ~5

**[Funky] extending-html (spread order)**

**Smell:** `className="grid gap-y-2"` is set, then `{...formProps}` is spread after it.

**Cost:** A caller `className` silently replaces the layout grid (`CommentCreateForm` already passes `className="grid gap-y-2"` as a workaround). Internal spacing is not merged.

**Fix:** Spread rest first, then set `className={cn("grid gap-y-2", formProps.className)}`. `Omit` internally managed props.

**Source:** [React common components](https://react.dev/reference/react-dom/components/common)

---

### `src/features/comment/components/comments-store.tsx` (whole module)

**[Funky] god-component / context-structure (structure + state)**

**Smell:** One provider owns list paging, optimistic CRUD, editing, form reset registration, and attachment fan-in. The context value is a large bag (`CommentsContextValue`) rebuilt every render. `handleLoadMore` is one of many unrelated handlers.

**Cost:** Any comment interaction re-renders every consumer (`CommentItem`, pagination, form). Hard to test one concern. New features keep landing in the same file.

**Fix:** Split by update pace: list state vs editing vs permissions. Extract `useCommentList`, `useCommentEditor`, `useCommentAttachments`. Keep the provider as a thin composition layer.

**Source:** [React custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks), [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)

---

### `src/features/comment/components/comments-store.tsx` ~117 and `src/features/comment/types.ts` ~117

**[Funky] positional-hook-params (structure)**

**Smell:** `loadMoreAction(ticketSlug, cursor, take, organizationId, userId)` is five positional args (two of them optional ids). Call site in the store passes a magic `3`.

**Cost:** `useThing(a, b, undefined, 0, "custom")` call sites; adding a param shifts every bind.

**Fix:** Options object after the required slug: `loadMoreAction(ticketSlug, { cursor, take, organizationId, userId })`.

**Source:** [React passing props](https://react.dev/learn/passing-props-to-a-component) (prop-organization applied to a function)

---

### `src/features/comment/components/comment-create-form.tsx` ~25–46

**[Funky] reset-with-key / effect-for-event (effects)**

**Smell:** Three effects: register a reset callback on the parent, copy `initialContent` into the textarea, focus when `commentId` is set.

**Cost:** Parent/child handshake via effect. Content can drift from `defaultValue` on the textarea. Focus and reset belong to “we started editing this id”, which `key={commentId}` already models.

**Fix:** Remount the form with `key={commentId ?? "new"}` at the call site. Register reset from the event that succeeds (already called via `formResetRef`). Focus with `autoFocus` on the edit instance.

**Source:** [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes)

---

### `src/features/comment/components/comment-item.tsx` ~12

**[Funky] coupled-view (structure)**

**Smell:** Presentational card reads `useComments()` for `userId`, `deleteAttachmentAction`, and attachment callbacks, while also taking `comment` + `buttons` as props.

**Cost:** Cannot render `CommentItem` in Storybook without the full comments provider. Attachment wiring is hidden inside the view.

**Fix:** Pass `isOwner`, `deleteAttachmentAction`, and `onClientAttachmentDeleted` as props (or fold attachments into the `buttons`/slot already used for owner actions). Keep context for the page container only.

**Source:** [Thinking in React](https://react.dev/learn/thinking-in-react)

---

### `src/features/comment/components/time-ago-client.tsx` ~8

**[Funky] impure-render (rendering)**

**Smell:** `formatDistanceToNow` reads the clock during render. Mitigated with `suppressHydrationWarning` and a Suspense boundary. `ClientDate` already solved the same class of problem with `useSyncExternalStore`.

**Cost:** Relative times are a new string every render; SSR/client can disagree (warning suppressed, not fixed). Two date-formatting strategies in one app.

**Fix:** Drive “now” from an external store with a server snapshot (reuse `ClientDate`’s store, or a 60s tick store), or pass a formatted string from a Server Component.

**Source:** [Keeping Components Pure](https://react.dev/learn/keeping-components-pure)

---

### `src/app/(auth)/tickets/[slug]/page.tsx` ~47, `src/features/password/components/github-login-button.tsx` ~13

**[Funky] any-escape (TypeScript)**

**Smell:** `@ts-expect-error` on `createAttachment.bind(..., "CLIENT", "COMMENT")` / `deleteAttachment.bind` (overload + `.bind` limitation, not a missing `"COMMENT"` — `ResourceType` already includes it) and on `authClient.signIn.social` “promise”.

**Cost:** The comment lies (“not typed for CLIENT/COMMENT”). Real type errors in those lines stay hidden.

**Fix:** Wrap bind in a small typed helper that selects the `CLIENT` overload, or call through a function instead of `.bind`. Type the Better Auth client result instead of expecting an error.

**Source:** [typescript-eslint no-explicit-any](https://typescript-eslint.io/rules/no-explicit-any/)

---

### `src/features/comment/components/comments-store.tsx` ~99, `src/features/memberships/components/memberships-more-menu.tsx` ~29

**[Funky] unsafe-assertion (TypeScript)**

**Smell:** `formData.get("content") as string` and `formData.get("role") as MemberRole` with no runtime check.

**Cost:** A missing field becomes `null as string`. Role radio can submit a string the union does not contain.

**Fix:** Narrow: `typeof content === "string"`. Parse `role` with a type guard / Valibot schema (already used on the server).

**Source:** [TypeScript type assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

---

### `src/features/organisation/components/organisation-action-buttons.tsx` ~46

**[Funky] repeated-markup / semantic-html**

**Smell:** Four empty disabled `<Button size="icon" />` placeholders keep a stable grid when the user lacks permissions. Same spacer in `membership-action-buttons.tsx` ~63.

**Cost:** Extra focusable-looking holes in the DOM (disabled, so skipped, but still noisy). Duplicated button chrome for layout.

**Fix:** CSS grid with empty cells, or `visibility` / a reserved `min-w` slot, not fake buttons. If a control must occupy space, use `aria-hidden` on a non-button element.

**Source:** [MDN HTML elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

---

### `src/features/ticket/components/ticket-actions-desktop.tsx` ~31 and ~47

**[Funky] repeated-markup (rendering)**

**Smell:** The “open ticket” icon `Link` is copy-pasted for `!isOwner && variant === "list"` and `isOwner && variant === "list"`.

**Cost:** Class names and `prefetch` drift independently.

**Fix:** One `viewLink` computed from `variant === "list"`, then branch only on owner for edit/more.

**Source:** [React lists / DRY](https://react.dev/learn/rendering-lists)

---

### `src/app` error boundaries

**[Funky] missing-error-boundary (async / errors)**

**Smell:** Only `src/app/(auth)/tickets/error.tsx` exists. No root `error.tsx` / `global-error.tsx`. Password, account, organisations, and onboarding segments have none.

**Cost:** A render throw outside the tickets segment white-screens the shell.

**Fix:** Add `error.tsx` at `(auth)` and `(password)` (and `global-error.tsx` for root layout failures), reusing `Placeholder` + retry.

**Source:** [React error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

### Optimistic boolean/action trio (extract-custom-hook)

**[Funky] extract-custom-hook (structure)**

**Smell:** Same cluster in three files: `useActionState(withActionFeedback(...))` + derive current from `state.status === "SUCCESS"` else prop + `useOptimistic` + `startTransition` to set optimistic then `await action`.

- `src/features/organisation/components/switch-org-button.tsx`
- `src/features/memberships/components/permission-toggle.tsx`
- `src/features/memberships/components/memberships-more-menu.tsx`

**Cost:** Pending/error/optimistic rules diverge (they already differ slightly). A bug fix in one file misses the others.

**Fix:** Extract `useOptimisticActionState(action, initial, selectValue)` on the second copy — that bar is already met.

**Source:** [Extracting your own custom hook](https://react.dev/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)

---

## Whiff (optional)

### `src/components/heading.tsx` ~3

**[Whiff] children-pattern / prop-specificity**

**Smell:** `title: string` and `description: string` block rich content (badges, inline code).

**Fix:** `ReactNode` slots, or `children` for the title line.

**Source:** [Passing JSX as children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)

### `src/features/auth/components/account-dropwdown.tsx`

**[Whiff] component-naming**

**Smell:** Filename `account-dropwdown.tsx` (typo). Imports already use `AccountDropdown`.

**Fix:** Rename file to `account-dropdown.tsx`.

---

## Cross-file duplication

### Optimistic list reducers

**[Funky] duplicate-implementation**

**Canonical pair:**

- `src/features/comment/hooks/use-comment-optimistic.ts` — `commentReducer`
- `src/features/ticket/hooks/use-ticket-optimistic.ts` — `ticketReducer`

**Smell:** Same discriminated union (`add` / `edit` / `delete`), same `crypto.randomUUID()` + `new Date().toISOString()` on add, same move-to-front on edit.

**Drift risk:** Edit-to-front or id generation changes in tickets and comments silently diverge (comments already inlined a second `crypto.randomUUID()` for attachments in the store).

**Fix:** One generic `listOptimisticReducer<T extends { id: string }>` in e.g. `src/hooks/`, or share `moveToFront`. Keep domain fields in the action payload.

### Ticket status radio group

**[Funky] duplicate-implementation**

**Canonical pair:**

- `src/features/ticket/components/ticket-more-menu.tsx` ~28
- `src/features/ticket/components/ticket-actions-mobile.tsx` ~70

**Smell:** Identical `DropdownMenuRadioGroup` over `TICKET_STATUS_LABELS` plus `statusChangeWithToast.bind`.

**Drift risk:** A new status appears in one menu only.

**Fix:** Extract `TicketStatusRadioGroup({ ticketId, status })` and use it in both menus.

### Empty icon spacers

**[Whiff] duplicate-implementation**

Empty disabled `size="icon"` buttons in organisation and membership action rows (see Funky finding above). One layout primitive would remove both copies.

---

## Intentionally not flagged

- `ClientDate` + `useSyncExternalStore` — correct hydration pattern.
- `SignOutLogic` mount effect — sign-out because the page is displayed, not because of an event.
- `RedirectToast` cookie effect — external sync.
- `AttachmentInputWithPreviews` object-URL revoke cleanup — real resource teardown.
- `useToggle` `open`/`close`/`onOpenChange` — matches dialog library contract.
- Index keys — none found on dynamic lists.
- `dangerouslySetInnerHTML` — none.
- Clickable `div`/`span` without a real control — none found.
- `{count && ...}` leaked `0` — none found.
- Nested component types mounted as `<Child />` — none found.
- Conditional hooks — none found.
- shadcn `outline-none` with `focus-visible` ring.
- `new Date()` / `crypto.randomUUID()` inside reducers and event handlers (not the render path), except `TimeAgoClient` as noted.
- `(preview as any).kind` in the `default` exhaustive branch of `attachment-preview.tsx` — never-check, biome-ignored on purpose.
- Page-level fetching in Server Components (`Tickets`, `Organisations`) — composition layer, not coupled-view.

---

## Summary

| Rating | Count | Notes |
| --- | --- | --- |
| Rancid | 5 | 1 a11y cluster (many files), accidental `window.close`, unlabeled search, silent load-more, bounty `0` |
| Funky | 14 | God comments provider, effects, types, duplication, missing route error boundaries |
| Whiff | 3 | Heading slots, filename typo, spacer duplication |

**Highest leverage:** accessible names on icon controls (one API change on `SubmitButton` / `PendingIconButton` plus labels at call sites); fix `close` in `AddCommentAttachmentButton`; give load-more an error owner.

**Smells fresh in:** hook rules, list keys, XSS sinks, clickable-nonsemantic markup, leaked `&&` zeros.
