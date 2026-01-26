# Comment List Review (React Compiler)

Review target: `src/features/comment/components/comment-list.tsx`

## Scope

Focused on re-render optimization and React/Next.js performance best practices,
with the assumption that React Compiler is enabled.

## Findings

1. **Unused ref + effect**
   - `editingCommentIdRef` is set in an effect but never read.
   - This adds unnecessary state syncing work without benefit.

2. **`startTransition` used with async callback**
   - `startTransition` should wrap synchronous state updates.
   - Passing an async function means React does not await the work, which can
     make the transition boundary misleading.

## Recommendations

- Remove `editingCommentIdRef` and its `useEffect` if it is truly unused.
- Refactor `handleLoadMore` to use a sync `startTransition` wrapper and run
  async work inside it (e.g., an async IIFE).

## Notes

No clear violations of re-render best practices beyond the items above. The
component already uses derived state appropriately and avoids heavy work in
render.
