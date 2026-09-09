# How Astryx source-compile wires into `apps/web`

Research for [How does Astryx source-compile wire into apps/web?](https://github.com/fringe4life/firstroad/issues/66) (map: [Migrate to astryx + stylex](https://github.com/fringe4life/firstroad/issues/64)).

**Plan only.** No app migration in this ticket.

Sources: Astryx docs/CLI (v0.5.4), `@astryxdesign/build` + `apps/example-nextjs-source` on `facebook/astryx` `main`, and the **live dirty** `apps/web` tree (not HEAD).

---

## Answer

Official Astryx source-compile for Next App Router is: install `@astryxdesign/core` + `@astryxdesign/theme-neutral` + `@stylexjs/stylex`, wrap Next with `withAstryx`, compile StyleX through **Babel + PostCSS** (`@astryxdesign/build`), import **reset + theme CSS** (not `astryx.css`), and mount client `Theme` with `neutralTheme`. Color mode is `data-theme` / `data-astryx-theme` on `<html>`, not `.dark`.

That official path **disables SWC** (custom `babel.config.js` + `next/babel`). It is also **webpack-scoped** (`withAstryx` only mutates `webpack`). Live `apps/web` is Next 16.3 with Turbopack caches, React Compiler, and `next/font`. Map Notes already forbid adding `@stylexjs/babel-plugin` in a way that disables SWC. Official source-compile and those Notes collide. Dist CSS (`astryx.css`) needs no StyleX compiler.

---

## Live `apps/web` (dirty worktree, 2026-09-09)

No `@astryxdesign/*` or `@stylexjs/*` in `apps/web/package.json`.

| Surface | Current wiring |
| --- | --- |
| `src/app/layout.tsx` | `import "./globals.css"`. `<html suppressHydrationWarning>` (no `data-theme`). `next/font` Geist + Inter. Client `ThemeProvider` then `ThemeTransition`. |
| `src/components/theme/theme-provider.tsx` | `next-themes` `attribute="class"` `defaultTheme="system"` `enableSystem`. |
| `src/components/theme/theme-switcher.tsx` | `useTheme()` from `next-themes`. Tailwind `dark:` utilities. |
| `src/app/globals.css` | `@import "tailwindcss"` + `tw-animate-css` + `shadcn/tailwind.css`. `@custom-variant dark (&:is(.dark *))`. Token block on `.dark`. |
| `postcss.config.ts` | `@tailwindcss/postcss` only. |
| `next.config.ts` | `reactCompiler`, Turbopack FS caches, `next/font` (via layout). No `transpilePackages` for Astryx. |
| `tsconfig.json` | `"moduleResolution": "bundler"` (required for CSS subpaths). |

Astryx `Theme` does not read `.dark`. Replacing `next-themes` without retargeting `@custom-variant dark` and leftover `dark:` classes leaves firstroad tokens stuck on light.

---

## Packages

Install in `apps/web` (React 19 peers already satisfied).

**Runtime**

```bash
bun add @astryxdesign/core @astryxdesign/theme-neutral @stylexjs/stylex
```

**CLI (dev)**

```bash
bun add -D @astryxdesign/cli
```

**Source-compile extra (dev)** — only if compiling `@astryxdesign/core` from TypeScript + StyleX:

```bash
bun add -D @astryxdesign/build @stylexjs/babel-plugin @stylexjs/postcss-plugin @babel/core autoprefixer
```

Peer pins observed in Astryx 0.5.4: `@stylexjs/stylex` `^0.19.0`, `@stylexjs/babel-plugin` `>=0.18.0`, `@astryxdesign/core` / `theme-neutral` / `cli` / `build` all `0.5.4`.

Component imports are **per-subpath**, not the barrel:

```ts
import {Button} from '@astryxdesign/core/Button';
import {Theme} from '@astryxdesign/core/theme';
import {colorVars} from '@astryxdesign/core/theme/tokens.stylex';
```

Core `package.json` publishes a `"source"` condition on those subpaths (`./src/...ts`). Dist consumers hit `"default": "./dist/..."`. `astryx.css` is dist-only (`./dist/astryx.css`). `reset.css` and `tailwind-theme.css` point at `src` CSS.

`@astryxdesign/theme-neutral` has **no** `"source"` export. Subpaths: `.` (runtime `defineTheme` object), `./built` ( `__built: true` object), `./theme.css` (`dist/theme.css`).

Optional published themes: `theme-butter`, `theme-chocolate`, `theme-gothic`, `theme-matcha`, `theme-stone`, `theme-y2k`. Map destination is `theme-neutral`.

Add a reliable CLI script (Astryx working-with-ai):

```json
"astryx": "node node_modules/@astryxdesign/cli/clients/cli/bin/astryx.mjs"
```

Bare `npx astryx` is an unrelated package until `@astryxdesign/cli` is a dependency. Prefer `npx @astryxdesign/cli …` or the script above.

---

## `astryx init` footprint

Non-interactive. No CSS, no `Theme`, no `next.config`, no PostCSS. Idempotent.

Default (`astryx init` / `--features agents`): writes a **managed block** into an agent doc file.

| Flag | Writes |
| --- | --- |
| default / `--features agents` | Managed block in `AGENTS.md` if none of the agent-doc files exist. If one already exists, **updates in place**. |
| `--agent claude` | `.claude/CLAUDE.md` (or root `CLAUDE.md` if present). |
| `--agent cursor` | `.cursorrules` (falls back to `AGENTS.md`). |
| `--agent all` | `AGENTS.md` + `.claude/CLAUDE.md`. |
| `--agent-docs-path <file>` | Explicit path (Cursor user-rule recipe uses `~/.cursor/rules/xds.mdc`). |
| `--features theme` | `theme.template.ts` in cwd. **Skipped** if the file already exists. |
| `--features template` | Prints page-template workflow (optional scaffold via programmatic `templateName`). |
| `--all` | `agents` + `theme` + `template`. |
| `--remove-agents` | Strips the managed block only. |

Markers: `<!-- ASTRYX:START -->` … `<!-- ASTRYX:END -->` (legacy `<!-- XDS:START -->` still counts as initialized).

**firstroad:** repo-root `AGENTS.md` already exists (Ultracite). Running init from the **repo root** injects the Astryx block into that file; it does not replace the rest. Running from `apps/web` would create `apps/web/AGENTS.md` unless `--agent-docs-path` points at the root file. `cwd` is `process.cwd()`.

`init` does not install npm packages. Install first, then init.

---

## Two CSS paths

### A. Precompiled dist (no StyleX compiler for Astryx)

Simplest. Components ship compiled CSS. App-authored `stylex.create` still needs a compiler (see collision below).

```css
@import '@astryxdesign/core/reset.css';      /* @layer reset */
@import '@astryxdesign/core/astryx.css';     /* @layer astryx-base — ALL components ~77KB */
@import '@astryxdesign/theme-neutral/theme.css'; /* @layer astryx-theme */
```

Tailwind v4 coexistence (migration docs / styling docs). Declare `@layer` **before** any `@import`. On webpack/Next, put the `@layer` line in its **own file imported first** (`layers.css`) because webpack hoists `@import` above following CSS.

```css
@layer reset, theme, base, astryx-base, astryx-theme, components, utilities;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "@astryxdesign/core/reset.css";
@import "@astryxdesign/core/astryx.css";
@import "@astryxdesign/theme-neutral/theme.css";
@import "@astryxdesign/core/tailwind-theme.css";
@import "tailwindcss/utilities.css" layer(utilities);
```

Live `globals.css` uses a single `@import "tailwindcss"` plus unlayered `tw-animate-css` and `shadcn/tailwind.css`. Unlayered CSS beats every named layer. That is the migration “silent padding:0” failure mode. Dist+Tailwind is the documented coexistence path. There is **no** official source-compile + Tailwind example.

### B. TypeScript + StyleX source (bundle-lean)

Reference: `apps/example-nextjs-source`. Do **not** import `astryx.css`. PostCSS compiles only imported component StyleX.

Claimed CSS: **~22KB** imported components vs **~77KB** full `astryx.css`. Slower builds (Astryx source through Babel).

```css
/* src/app/layers.css — must be a separate first file */
@layer reset, astryx-base, astryx-theme, product;
```

```css
/* src/app/globals.css */
@import './layers.css';
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/theme-neutral/theme.css';

@stylex;
```

`@stylex;` is the PostCSS extraction sink. Missing compiler → unstyled components, **no error**.

---

## Source-build Next wiring (official)

Current example (`facebook/astryx` `main`, packages `0.5.4`):

**`babel.config.js`** (disables SWC):

```js
const {babel} = require('@astryxdesign/build');
module.exports = babel(__dirname);
```

That helper emits `presets: [['next/babel', {'preset-typescript': {allowDeclareFields: true}}]]` and plugin `@astryxdesign/build/babel` wrapping `@stylexjs/babel-plugin`. Library files get class prefix `astryx`; app files get `x`. Dual prefix is why theme layers can override library atoms without collisions.

**`postcss.config.js`:**

```js
const {postcss} = require('@astryxdesign/build');
module.exports = postcss(__dirname);
```

Compiles library + app StyleX in two passes, wraps library in `@layer astryx-base` and app in `@layer product`. Adds `autoprefixer`. **Replaces** firstroad’s `@tailwindcss/postcss` unless composed by hand (undocumented).

**`next.config`:**

```js
import {withAstryx} from '@astryxdesign/build/next';

export default withAstryx({
  // existing firstroad nextConfig
});
```

`withAstryx` (source: `packages/build/src/next.js`):

1. Merges `transpilePackages`: `@astryxdesign/core`, `@astryxdesign/theme-neutral`, `@astryxdesign/lab`.
2. Webpack rule: requests **from** `node_modules/@astryxdesign/` resolve `"source"` then `'...'`.
3. Webpack aliases: app-issued `@astryxdesign/*` specifiers → each export’s `"source"` file. Without this, app imports hit `dist` while PostCSS compiles `src` → disjoint class names, **unstyled, no error** (fixed in build 0.5.3).
4. `resolve.symlinks = false` so pnpm/Bun symlink layouts still match `transpilePackages`.
5. Does **not** touch `turbopack`, `experimental`, or Babel. Webpack-only.

**`browserslist`:** `["last 1 Chrome version"]` so LightningCSS/autoprefixer do not lower `light-dark()`.

Gotchas from the example README: missing `source` resolution → dist classes; missing StyleX `aliases` → `defineVars` fail; inline `@layer` (not a separate file) → layer order ignored under webpack hoist.

---

## Theme + `theme-neutral` (replaces `next-themes`)

`Theme` is `'use client'` (`packages/core/src/theme/Theme.tsx`).

**SSR / production (recommended for Next):**

```tsx
'use client';
import Link from 'next/link';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <Theme theme={neutralTheme} mode={mode}>
      <LinkProvider component={Link}>{children}</LinkProvider>
    </Theme>
  );
}
```

Pair `/built` with `@import '@astryxdesign/theme-neutral/theme.css'` (globals or the JS import). `/built` sets `__built: true` so `Theme` **skips** `useInsertionEffect` injection.

**Runtime / source object** (`from '@astryxdesign/theme-neutral'`, no `/built`): injects `<style>` at hydration. Tokens mostly OK on SSR; **component overrides flash**. The source example uses this import; theme docs say do not use it for production SSR.

Custom themes: `astryx theme build ./src/themes/ocean.ts` → `ocean.css` + `ocean.js` (`__built: true`) + d.ts. Same mount pattern.

### `data-theme` vs `.dark`

Root `Theme` (no parent Theme) syncs `document.documentElement`:

| Attribute | Value | Role |
| --- | --- | --- |
| `data-theme` | `"light"` \| `"dark"` | `reset.css` maps to `color-scheme`. Native chrome + `light-dark()`. |
| `data-astryx-theme` | theme name (`neutral`) | `@scope` theme CSS, including portals/toasts. |

`mode="system"` (default): **removes** `data-theme`. `reset.css`: `html:not([data-theme]) { color-scheme: light dark; }`.

Wrapper is `display: contents` plus `data-astryx-theme` / `data-theme` (omitted when system).

SSR FOUC avoidance (Theme.tsx + reset.css): set the attribute on the **server** `<html>`:

```tsx
<html lang="en" data-theme="dark" suppressHydrationWarning>
```

firstroad currently uses `suppressHydrationWarning` for `next-themes` class injection, not `data-theme`.

`next-themes` today: `attribute="class"` → `<html class="dark">`. firstroad CSS:

```css
@custom-variant dark (&:is(.dark *));
.dark { /* shadcn tokens */ }
```

Astryx does not add `.dark`. Migration coexistence, if Tailwind stays even briefly:

```css
@custom-variant dark (&:is([data-theme="dark"] *));
```

Or drop `.dark` tokens and use Astryx `var(--color-*)` / `light-dark()`. Map destination: Astryx `Theme` owns mode; drop `next-themes`. Keep view-transitions (`ThemeTransition` today keys `next-themes` `theme`) and layout tokens (`--header-height`, `--side-width`) as custom StyleX or a small CSS island.

`Theme` does **not** persist mode. `next-themes` does (localStorage). App state must own persistence if the toggle should survive reload. Pass `mode` into `Theme`; do not toggle isolated body classes (migration docs).

`useTheme()` from `@astryxdesign/core/theme` is token/mode **read**. It is not `setTheme`. Toggle lives in app state.

---

## Collision with map Notes (SWC / Turbopack)

Map Notes: source-compile `@astryxdesign/core`, author `stylex.create` / `xstyle`, keep SWC (`next/font`, React Compiler, Turbopack). Do not add `@stylexjs/babel-plugin` in a way that disables SWC.

| Path | Compiles Astryx source? | App `stylex.create`? | Keeps SWC? | Official? |
| --- | --- | --- | --- | --- |
| Dist CSS only | No | No | Yes | Getting started / core README |
| Dist + Tailwind bridge | No | No | Yes | styling + migration |
| Dist + `@stylexjs/babel-plugin` (`example-nextjs-stylex`) | No | Yes | **No** (`next/babel`) | example-nextjs-stylex |
| Source + `@astryxdesign/build` (`example-nextjs-source`) | Yes | Yes (prefix `x`) | **No** | example-nextjs-source + build README |
| `@stylexswc/nextjs-plugin` (styling docs) | Docs: app/swizzled source only | Yes | Yes (claimed) | styling.md “Next.js note” |

Styling docs: do **not** add `@stylexjs/babel-plugin` to App Router; it disables SWC and breaks `next/font`. Suggested SWC plugin is community `@stylexswc/nextjs-plugin`. That plugin is **not** `@astryxdesign/build`. It does not implement dual `astryx`/`x` prefixes or `withAstryx` `source` aliases. Using it to compile Astryx `source` exports is **undocumented**.

`@astryxdesign/build/vite` uses `@stylexjs/unplugin` (Vite). There is no Turbopack/SWC export for Next.

**Implication for later tickets (not decided here):** official source-compile for Next is Babel+webpack. Meeting both “source-compile core” and “keep SWC/Turbopack” needs a path Astryx does not ship as a first-class Next example. Dist Astryx + SWC app StyleX is the documented SWC-safe split, but it is not source-compile of core.

---

## Suggested drop-in map for `apps/web` (not executed)

1. Install packages above in `apps/web`.
2. `astryx init --features agents` from repo root (inject managed block into existing `AGENTS.md`) and add the `astryx` script.
3. Choose path:
   - **Dist (SWC-safe, fatter CSS):** CSS imports in `globals.css` with explicit layers; client `Providers` with `Theme` + `/built` + `LinkProvider`; set `data-theme` on `<html>`; retire `next-themes`.
   - **Source (official, SWC-off):** `babel.config.js` + `postcss` from `@astryxdesign/build`, `withAstryx(nextConfig)`, `layers.css` + `@stylex;`, **omit** `astryx.css`. Conflicts with current Turbopack/React Compiler/`next/font` setup.
4. Keep firstroad layout tokens and view-transition CSS as a layered island until they move to StyleX.
5. Foundation smoke test (migration docs) before replacing Header/Sidebar.

---

## Sources

- [Astryx getting started](https://astryx.atmeta.com/docs/getting-started)
- [Styling](https://astryx.atmeta.com/docs/styling) — Tailwind bridge, StyleX/`xstyle`, Next SWC warning
- [Theme](https://astryx.atmeta.com/docs/theme) — `/built` vs runtime, `mode`, `astryx theme build`
- [Migration](https://astryx.atmeta.com/docs/migration) — Theme at root, layer order, `data-theme` vs body classes
- [How Astryx works](https://astryx.atmeta.com/blog/how-astryx-works) — dist vs source-compile
- [Working with AI](https://astryx.atmeta.com/docs/working-with-ai) — `init` files, CLI script
- [`@astryxdesign/core` README](https://github.com/facebook/astryx/blob/main/packages/core/README.md)
- [`@astryxdesign/build` README + `src/next.js` + `src/config.js`](https://github.com/facebook/astryx/tree/main/packages/build)
- [`apps/example-nextjs-source`](https://github.com/facebook/astryx/tree/main/apps/example-nextjs-source)
- [`apps/example-nextjs-stylex`](https://github.com/facebook/astryx/tree/main/apps/example-nextjs-stylex)
- [`Theme.tsx`](https://github.com/facebook/astryx/blob/main/packages/core/src/theme/Theme.tsx)
- [`reset.css` color-scheme rules](https://github.com/facebook/astryx/blob/main/packages/core/src/reset.css)
- CLI 0.5.4: `api/init/init.doc.mjs`, `foundation/agent-docs/agent-doc-state.mjs`
- Live: `apps/web/src/app/layout.tsx`, `globals.css`, `theme-provider.tsx`, `next.config.ts`, `postcss.config.ts`, `package.json`
