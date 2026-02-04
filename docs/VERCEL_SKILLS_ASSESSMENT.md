# Vercel Skills Assessment

This document describes the two Vercel-derived agent skills available in this repo and how they fit the codebase.

**Location in this project:** `.agents/skills/`

- `vercel-composition-patterns/` — component architecture and composition
- `vercel-react-best-practices/` — React/Next.js performance and patterns

---

## 1. Vercel Composition Patterns

**Skill:** `vercel-composition-patterns`  
**Source:** Vercel Engineering  
**Focus:** Component architecture, state placement, and API design so components stay flexible and maintainable as they scale.

### Purpose

- Reduce **boolean prop proliferation** (e.g. `isThread`, `isEditing`, `showAttachments`) that leads to exponential states and hard-to-follow conditionals.
- Prefer **composition** (compound components, children, explicit variant components) over many props and render branches.
- Make shared **state and actions** available via providers so siblings (e.g. a submit button outside the main form UI) can access them without prop drilling or ref hacks.

### When to Use

- Refactoring components with many boolean or mode props.
- Designing or evolving reusable component APIs.
- Introducing or refining compound components and context providers.
- Aligning with React 19 patterns (e.g. `use()` instead of `useContext()`, avoiding `forwardRef` where the skill suggests).

### Rule Categories (by priority)

| Priority | Category              | Impact | Prefix            | Rule count |
|----------|------------------------|--------|-------------------|------------|
| 1        | Component Architecture | HIGH   | `architecture-`   | 2          |
| 2        | State Management       | MEDIUM | `state-`          | 3          |
| 3        | Implementation Patterns| MEDIUM | `patterns-`       | 2          |
| 4        | React 19 APIs          | MEDIUM | `react19-`        | 1          |

### Rules Summary

- **architecture-avoid-boolean-props** — Avoid stacking booleans; use composition and explicit variant components.
- **architecture-compound-components** — Structure complex UIs as compound components with a shared context; consumers compose the pieces they need.
- **state-lift-state** — Put state in provider components so siblings (e.g. dialog actions) can use it without prop drilling or refs.
- **state-context-interface** — Define a clear context shape (state, actions, meta) for dependency injection.
- **state-decouple-implementation** — Keep “how state is stored” inside the provider; consumers only see the interface.
- **patterns-explicit-variants** — Prefer explicit variant subcomponents over boolean “modes.”
- **patterns-children-over-render-props** — Prefer `children` and composition over `renderX` props.
- **react19-no-forwardref** — Prefer React 19 patterns; use `use()` instead of `useContext()` where applicable; avoid `forwardRef` when the skill recommends it.

### Relevance to This Project

- **Forms and cards:** Accept/reject invitation, profile, password, and other flows can be reviewed for boolean props and replaced with composition or explicit variants where it simplifies the API.
- **Layout and modals:** Any place where “a button outside the main block needs to trigger or read form/state” is a good fit for the state-lift-state and compound-component patterns.
- **Design system / shared UI:** As shared components grow, the architecture and patterns rules help keep APIs stable and easier for both humans and tools to use.

---

## 2. Vercel React Best Practices

**Skill:** `vercel-react-best-practices`  
**Source:** Vercel Engineering  
**Focus:** Performance and correctness for React and Next.js (data fetching, bundles, server/client boundaries, re-renders, rendering, and JS micro-optimizations).

### Purpose

- **Remove waterfalls:** Parallelize independent async work, defer awaits, use Suspense where appropriate.
- **Control bundle size:** Direct imports, dynamic imports, conditional loading, preload on interaction.
- **Server-side discipline:** Auth in server actions, caching (React cache, LRU), serialization and dedup, parallel fetching, `after()` for non-blocking work.
- **Client-side discipline:** SWR/dedup, event listener and passive listener usage, localStorage schema.
- **Re-render and rendering:** Memo/derived state/transitions, event handlers instead of effects for user actions, loading state via `useTransition` or equivalent, hydration and conditional render patterns.
- **JS and advanced patterns:** Caching, early exits, Set/Map for lookups, refs for handlers where the skill recommends it.

### When to Use

- Adding or changing React components or Next.js pages.
- Implementing or refactoring data fetching (client or server).
- Reviewing or fixing performance issues (LCP, waterfalls, bundle size, unnecessary re-renders).
- Optimizing server actions, API routes, or RSC payloads.

### Rule Categories (by priority)

| Priority | Category                   | Impact      | Prefix         | Rule count |
|----------|----------------------------|-------------|----------------|------------|
| 1        | Eliminating Waterfalls     | CRITICAL    | `async-`       | 5          |
| 2        | Bundle Size Optimization   | CRITICAL    | `bundle-`      | 5          |
| 3        | Server-Side Performance    | HIGH        | `server-`      | 7          |
| 4        | Client-Side Data Fetching  | MEDIUM–HIGH | `client-`      | 4          |
| 5        | Re-render Optimization     | MEDIUM      | `rerender-`    | 12         |
| 6        | Rendering Performance      | MEDIUM      | `rendering-`   | 9          |
| 7        | JavaScript Performance     | LOW–MEDIUM  | `js-`          | 12         |
| 8        | Advanced Patterns          | LOW         | `advanced-`    | 3          |

**Total:** 57 rules across 8 categories.

### High-Impact Areas (summary)

- **async-:** Defer await, `Promise.all` for independent work, Suspense boundaries, start promises early in API routes.
- **bundle-:** Avoid barrel imports where they hurt, `next/dynamic`, defer third-party, conditional load, preload on hover/focus.
- **server-:** Auth inside server actions, React cache, LRU cache, dedup/serialization, parallel fetching, `after()`.
- **rerender- / rendering-:** Prefer event handlers over effects for user actions; prefer `useTransition` (or form-status) for loading; memo/derived state/transitions; hydration and conditional render patterns.

### Relevance to This Project

- **Server actions:** Align with `server-auth-actions` (e.g. invitation accept/reject, profile, password) and other server-* rules for caching and serialization.
- **Data loading and redirects:** Use async-* and server-* rules to avoid waterfalls and redirects inside streaming/Suspense when possible (e.g. auth and data at page/layout level).
- **Forms and loading:** Use framework-provided pending state (`useFormStatus`, `useTransition`) instead of manual loading state where applicable (`rerender-move-effect-to-event`, `rendering-usetransition-loading`).
- **Bundles and imports:** Apply bundle-* rules when adding features or trimming size (e.g. direct imports, dynamic load).

---

## How the Two Skills Relate

| Dimension        | Vercel Composition Patterns      | Vercel React Best Practices        |
|-----------------|-----------------------------------|------------------------------------|
| **Primary focus** | API design, structure, state placement | Performance, correctness, resource use |
| **“How”**        | Compose components; avoid booleans; lift state into providers | Parallelize work; shrink bundles; optimize server/client and re-renders |
| **Overlap**      | Both favor clear boundaries and fewer hidden branches | Both favor event-driven logic and framework primitives over ad-hoc state/effects |
| **Use together** | Refactor a component’s API (composition) then apply performance rules (async, bundle, server, rerender) on the resulting structure |

Neither skill replaces the other: composition improves maintainability and clarity; best practices improve performance and correctness. They are complementary.

---

## How to Use These Skills in This Repo

- **Skill definitions and rules:**  
  - Composition: `.agents/skills/vercel-composition-patterns/SKILL.md` and `rules/*.md`  
  - Best practices: `.agents/skills/vercel-react-best-practices/SKILL.md` and `rules/*.md`  
  Full expanded text is in each skill’s `AGENTS.md`.

- **When implementing or reviewing:**
  - **New or changing UI/components** — Check composition patterns for prop design and state placement; check best practices for data loading, server actions, and re-render/rendering.
  - **Server actions and auth** — Apply `server-auth-actions` and related server-* rules.
  - **Forms and pending state** — Prefer single-form + `useFormStatus` or `useTransition` where it fits; avoid manual loading state and effects for submit (per best practices).
  - **Refactors** — Use composition skill to simplify APIs first; then apply async/bundle/server/rerender rules as needed.

This assessment is a snapshot of the skills as present under `.agents/skills/`. For exact rule text and examples, use the linked `SKILL.md` and `rules/` files in each skill folder.
