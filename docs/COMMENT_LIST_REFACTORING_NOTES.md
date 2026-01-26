# Comment List Refactoring Notes

Target: `src/features/comment/components/comment-list.tsx`

## Do the Vercel skills mention refactoring large components?

The Vercel React Best Practices skill is primarily performance-focused (async,
bundling, rendering, re-rendering). It does not explicitly prescribe splitting
large components for readability. It does imply separation where it improves
rendering efficiency (e.g., hoisting static JSX, memoizing expensive subtrees),
but the guidance is not about naming or component structure.

For structure and maintainability, this project already follows a split pattern
in `src/features/organisation/components` (e.g., `organisation-item.tsx`,
action buttons), which is a stronger precedent for refactoring than the Vercel
performance rules themselves.

## Why this component feels too broad

`comment-list.tsx` currently owns:
- Form card (create/edit) UI and state
- List rendering and item actions
- Pagination/load-more behavior

The name suggests a list-only component, but it includes create/edit and
pagination logic, which makes it harder to reason about and reuse.

## Suggested split (consistent with existing patterns)

1. **`comment-form-card.tsx`**
   - Owns the `CardCompact` + `CommentCreateForm` section
   - Exposes `editingState`, callbacks, and action state props

2. **`comment-list.tsx`**
   - Owns list rendering only (`GenericComponent` + `CommentItem`)
   - Accepts `items`, `userId`, and action handlers as props

3. **`comment-pagination.tsx`**
   - Owns the load-more button and pending state UI
   - Receives `isPending`, `hasNextPage`, and `onLoadMore`

This mirrors the organisation feature layout, where list and item rendering are
separate files and action buttons are split into their own components.

## React Compiler considerations

React Compiler can reduce the need for manual memoization, but it does not
remove the value of smaller, focused components for clarity and testability.
Splitting here is about responsibility boundaries, not micro-optimizations.
