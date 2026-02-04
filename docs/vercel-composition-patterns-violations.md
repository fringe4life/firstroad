# Vercel Composition Patterns — Codebase Violations

Assessment of this codebase against the rules in `.agents/skills/vercel-composition-patterns/`. Each section maps to a rule and lists concrete violations with file paths and suggested fixes.

---

## 1. architecture-avoid-boolean-props (CRITICAL)

**Rule:** Don’t add boolean props to customize behavior; use composition or explicit variant components.

### Violations

| Location | Issue | Suggestion |
|----------|--------|------------|
| [src/components/heading-skeleton.tsx](../src/components/heading-skeleton.tsx) | `showTabs?: boolean` and `showActions?: boolean` control which skeleton blocks render. | Prefer composition: e.g. `<HeadingSkeleton><HeadingSkeleton.Tabs /><HeadingSkeleton.Actions /></HeadingSkeleton>` or separate `HeadingTabsSkeleton` / `HeadingActionsSkeleton` components that callers compose. |
| [src/components/ui/dialog.tsx](../src/components/ui/dialog.tsx) | `showCloseButton?: boolean` toggles the close button. | Optional: expose a slot or child (e.g. `Dialog.CloseButton`) so the consumer composes the close control when needed, or keep a single default that can be overridden via children. |


### Low priority / acceptable

- **SubmitButton** `disabled`, **ConfirmDialog** `isPending` in trigger: `disabled` is a standard HTML-like prop; `isPending` is a render-prop callback argument, not a long-lived boolean API.
- **Organisation-item** `isActive`: derived from data for styling; not a “mode” that doubles API surface.
- **List components** `isError` (e.g. organisation-list, invitation-list): derived from `!items` for empty/error state; acceptable unless you refactor to explicit error/empty subcomponents.

---

## 2. patterns-children-over-render-props (MEDIUM)

**Rule:** Prefer composing children over `renderX` or function-as-child props.

### Violations

| Location | Issue | Suggestion |
|----------|--------|------------|
| [src/components/generic-component.tsx](../src/components/generic-component.tsx) | `renderProps: (item: T, index: number) => P` is a render-prop API. Used to map each item to props for a single `Component`. | Prefer a children-based API: e.g. `items.map(item => <Component key={item.id} {...getProps(item)} />)` at the call site, or a compound list that accepts `children` / `itemRenderer` as a child component receiving item via context. |
| [src/features/attachments/components/attachment-list.tsx](../src/features/attachments/components/attachment-list.tsx) | Passes `renderProps={(item) => ({ attachment: item })}` into `GenericComponent`. | Refactor to a list component that composes children or an explicit item component (e.g. `<AttachmentList items={…}><AttachmentListItem /></AttachmentList>`). |
| [src/features/ticket/components/ticket-list.tsx](../src/features/ticket/components/ticket-list.tsx) | Passes `renderProps={(ticket) => ({…})}` into the generic list. | Same as above: move to children-based or compound list + item component. |
| [src/features/comment/components/comment-list.tsx](../src/features/comment/components/comment-list.tsx) | Passes `renderProps={(item) => ({…})}` into the generic list. | Same as above. |


---

## 3. architecture-compound-components (HIGH)

**Rule:** Structure complex components as compound components with shared context; consumers compose the pieces they need.

### Observations (opportunities, not strict violations)

| Location | Observation | Suggestion |
|----------|-------------|------------|

No other components were flagged as clear compound-component opportunities in this pass.

---

## 4. state-lift-state (HIGH)

**Rule:** Move state into provider components so siblings (e.g. dialog actions) can access it without prop drilling or refs.

### Status

- No clear violations found: no cases where state was obviously “trapped” inside a component while a sibling needed to trigger or read it.
- Confirm-dialog state (open/close, pending) is already lifted into the hook; converting to compound components would align with the same idea.

---

## 5. state-context-interface / state-decouple-implementation (MEDIUM)

**Rule:** Define a clear context interface (state, actions, meta) and keep implementation details inside the provider.

### Status

- No custom context providers were found that expose implementation details.
- When introducing compound components (e.g. for TicketItem or ConfirmDialog), define a small context interface (state, actions, meta) and keep storage/implementation inside the provider.

---

## 6. patterns-explicit-variants (MEDIUM)

**Rule:** Prefer explicit variant components over boolean “modes.”

### Violations

- Same as **architecture-avoid-boolean-props**: `HeadingSkeleton` (showTabs / showActions), `Dialog` (showCloseButton), `TicketItem` (isDetail), `DetailElement` (isDetail). Fix by introducing explicit variants or composable pieces as above.

---

## 7. react19-no-forwardref (MEDIUM, React 19+)

**Rule:** Don’t use `forwardRef`; use ref forwarding patterns and `use()` instead of `useContext()` where applicable.

### Status

- **forwardRef:** No usages of `forwardRef` in `src/` — no violation.
- **useContext:** No usages of `useContext` in `src/` — no violation. When adding new context, prefer React 19’s `use()` in consumers if the codebase targets React 19.

---

## Summary

| Rule | Violations | Priority |
|------|------------|----------|
| architecture-avoid-boolean-props | 4 (heading-skeleton, dialog, ticket-item, detail-element) | High |
| patterns-children-over-render-props | 5 (generic-component, attachment-list, ticket-list, comment-list, confirm-dialog) | Medium |
| architecture-compound-components | 2 opportunities (ticket-item, confirm-dialog) | High |
| patterns-explicit-variants | Same as avoid-boolean-props | Medium |
| state-lift-state | 0 | — |
| state-context-interface / state-decouple-implementation | 0 | — |
| react19-no-forwardref | 0 | — |

Recommended order of work: (1) Replace boolean props with composition or explicit variants (heading-skeleton, ticket-item, detail-element, dialog). (2) Replace render-props with children or compound components (generic-component and its callers, confirm-dialog). (3) Introduce compound components where they simplify API and state (ticket-item, confirm-dialog).
