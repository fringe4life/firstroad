# Can Next 16 compile StyleX and Astryx source?

**Ticket:** [fringe4life/firstroad#65](https://github.com/fringe4life/firstroad/issues/65)
**Map:** [fringe4life/firstroad#64](https://github.com/fringe4life/firstroad/issues/64)
**Question:** What StyleX compiler path works with this repo's Next.js 16.3 App Router + Turbopack + React Compiler + Bun + `next/font`, such that we can both **source-compile** `@astryxdesign/core` and author `stylex.create` / `xstyle` in `apps/web` without disabling SWC?

**Verdict:** Yes. The path that keeps SWC, Turbopack, `next/font`, and this repo's Rust React Compiler flag is community `@stylexswc/nextjs-plugin/turbopack` plus `@stylexswc/postcss-plugin`. Official `@stylexjs/babel-plugin` + `@stylexjs/postcss-plugin` compiles StyleX on Next 16 Turbopack but is the wrong fit here. `@astryxdesign/build` / `example-nextjs-source` / `withAstryx` are webpack+Babel source-compile helpers and do **not** apply as-is.

This note is research only. It does not migrate `apps/web`.

## Repo facts (live dirty tree)

Read from `/home/cc/Programming/roadtonext/firstroad` (dirty `main`), not this worktree:

| Fact | Evidence |
| --- | --- |
| Next `16.3.3`, App Router | `apps/web/package.json` `"next": "16.3.3"` |
| Turbopack default | `next dev` / `next build` with no `--webpack` ([Next 16 default bundler](https://nextjs.org/blog/next-16)) |
| Bun as Next runtime | `"dev": "bun --bun run next dev"`, `"build": "bun --bun --production run next build"`; root `"packageManager": "bun@1.3.14"` |
| React Compiler on, Rust port on | `reactCompiler: true` and `experimental.turbopackRustReactCompiler: true` in `apps/web/next.config.ts` |
| `next/font` in use | `apps/web/src/app/layout.tsx` imports `Geist, Inter` from `next/font/google` |
| Current CSS pipeline | `apps/web/postcss.config.ts` is only `"@tailwindcss/postcss"`; `globals.css` starts with `@import "tailwindcss"` |
| Cache Components already on | `cacheComponents: true` in `next.config.ts` (same flag Astryx's own docsite enabled on Next 16.3) |

## Answer in one paragraph

Keep Turbopack. Do not add `babel.config.js`. Wrap `next.config.ts` with `withStylexTurbopack` from `@stylexswc/nextjs-plugin/turbopack`, extract CSS with `@stylexswc/postcss-plugin` (coexist with `@tailwindcss/postcss` during migration), `transpilePackages` `@astryxdesign/core` and `@astryxdesign/theme-neutral`, and point StyleX `aliases` / Turbopack `resolveAlias` at Astryx **source** exports. That is the only combination that matches Astryx's own Next+SWC guidance, StyleX's "no official Turbopack compiler plugin" stance, and this repo's `turbopackRustReactCompiler` flag (Turbopack-only; webpack throws).

## Recommended packages

Install (when executing, not now):

```bash
bun add @stylexjs/stylex
bun add -d @stylexswc/nextjs-plugin @stylexswc/postcss-plugin
```

- Runtime: [`@stylexjs/stylex`](https://stylexjs.com/docs/learn/installation/nextjs) (official).
- JS/TS transform under Turbopack: [`@stylexswc/nextjs-plugin/turbopack`](https://github.com/Dwlad90/stylex-swc-plugin/blob/develop/packages/nextjs-plugin/README.md). Community NAPI-RS/SWC compiler. Not affiliated with Meta. Tracks StyleX **v0.19.0**, Next.js 15+, Node 20+.
- CSS extraction under Turbopack: [`@stylexswc/postcss-plugin`](https://github.com/Dwlad90/stylex-swc-plugin/blob/develop/packages/nextjs-plugin/README.md#using-with-turbopack). Required because Turbopack has no webpack-plugin hook, so the loader compiles StyleX in JS but **does not extract CSS**.

Do **not** install `@stylexjs/babel-plugin` as the Next compiler. Astryx styling docs: "Do NOT add `@stylexjs/babel-plugin` to a Next.js App Router app; it disables SWC and breaks `next/font`." ([astryx.atmeta.com/docs/styling](https://astryx.atmeta.com/docs/styling)) Official StyleX Next install still documents that Babel plugin ([stylexjs.com Next.js](https://stylexjs.com/docs/learn/installation/nextjs)). Both statements are true in different bundler modes; see [Known breakages](#known-breakages).

## `next.config.ts` shape

Compose the existing `@firstroad/web` config. Do not replace Cache Components / React Compiler / Turbopack FS cache flags.

```ts
import path from "node:path";
import type { NextConfig } from "next";
import withStylexTurbopack from "@stylexswc/nextjs-plugin/turbopack";

const rootDir = import.meta.dirname;

const nextConfig = {
  cacheComponents: true,
  experimental: {
    mcpServer: true,
    optimizePackageImports: ["valibot"],
    serverActions: {
      bodySizeLimit: "4mb",
    },
    turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true,
    turbopackRustReactCompiler: true,
    typedEnv: true,
    useTypeScriptCli: true,
  },
  logging: {
    browserToTerminal: true,
  },
  partialPrefetching: true,
  reactCompiler: true,
  serverExternalPackages: [
    "pg",
    "@neondatabase/serverless",
    "@prisma/orm-postgres",
  ],
  transpilePackages: ["@astryxdesign/core", "@astryxdesign/theme-neutral"],
  typedRoutes: true,
  turbopack: {
    // withAstryx does this via webpack resolve.alias + a scoped `source`
    // conditionNames rule. Turbopack ignores `webpack()`. Point the same
    // specifiers at each package's `source` export (see @astryxdesign/build/next).
    resolveAlias: {
      // Fill from installed package.json "exports"[key].source once packages
      // are added. Shape is the Turbopack equivalent of withAstryx aliases.
    },
  },
} satisfies NextConfig;

export default withStylexTurbopack({
  rsOptions: {
    aliases: {
      "@/*": [path.join(rootDir, "*")],
      "@astryxdesign/core/*": [
        path.join(rootDir, "node_modules/@astryxdesign/core/*"),
      ],
      "@astryxdesign/core": [
        path.join(rootDir, "node_modules/@astryxdesign/core"),
      ],
    },
    dev: process.env.NODE_ENV !== "production",
    // Compile app StyleX *and* Astryx library source.
    include: [
      "src/**/*.{ts,tsx,js,jsx}",
      "node_modules/@astryxdesign/core/**/*.{js,jsx,ts,tsx}",
      "node_modules/@astryxdesign/theme-neutral/**/*.{js,jsx,ts,tsx}",
    ],
    unstable_moduleResolution: { type: "commonJS" },
  },
  stylexImports: ["@stylexjs/stylex"],
})(nextConfig);
```

Sources for this shape:

- Turbopack export, ignored options (`useCSSLayers`, `nextjsMode`, `transformCss`, `extractCSS`), `transpilePackages` allowlisting library StyleX: [@stylexswc/nextjs-plugin README](https://github.com/Dwlad90/stylex-swc-plugin/blob/develop/packages/nextjs-plugin/README.md).
- `experimental.turbo` is gone; use top-level `turbopack` ([Next 16 changelog](https://nextjs.org/blog/next-16), [turbopack config](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)).
- Astryx StyleX `aliases` for `tokens.stylex` / `defineVars`: [@astryxdesign/build README](https://github.com/facebook/astryx/blob/main/packages/build/README.md) and [astryx styling](https://astryx.atmeta.com/docs/styling).
- `transpilePackages` for local/`node_modules` TS: [Next.js Compiler — Module Transpilation](https://nextjs.org/docs/architecture/nextjs-compiler).
- `turbopackRustReactCompiler` is Turbopack-only and errors on webpack: [turbopackRustReactCompiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackRustReactCompiler).

Plugin notes that matter for this repo:

- The `/turbopack` wrapper injects one `turbopack.rules` loader per `js`/`jsx`/`mjs`/`cjs`/`ts`/`tsx`/`mts`/`cts`. If we later add our own rule for the same glob, merge into that rule; Turbopack treats a list of rules as alternatives and keeps the first matching one ([plugin README](https://github.com/Dwlad90/stylex-swc-plugin/blob/develop/packages/nextjs-plugin/README.md)).
- `rsOptions.include` / `exclude` are Rust-compiler-only, not in official Babel options ([same README](https://github.com/Dwlad90/stylex-swc-plugin/blob/develop/packages/nextjs-plugin/README.md)).

## PostCSS shape

Turbopack CSS extraction is PostCSS, not a webpack plugin ([Next: Turbopack does not support webpack plugins](https://nextjs.org/docs/app/api-reference/turbopack); [stylexswc Turbopack section](https://github.com/Dwlad90/stylex-swc-plugin/blob/develop/packages/nextjs-plugin/README.md#using-with-turbopack)).

Current `apps/web/postcss.config.ts`:

```ts
const config = {
  plugins: ["@tailwindcss/postcss"],
};
export default config;
```

Target during coexistence (map allows Tailwind while the frame migrates):

```ts
import path from "node:path";

const config = {
  plugins: {
    "@stylexswc/postcss-plugin": {
      include: [
        "src/**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}",
        "node_modules/@astryxdesign/core/**/*.{js,jsx,ts,tsx}",
        "node_modules/@astryxdesign/theme-neutral/**/*.{js,jsx,ts,tsx}",
      ],
      rsOptions: {
        aliases: {
          "@/*": [path.join(import.meta.dirname, "*")],
          "@astryxdesign/core/*": [
            path.join(
              import.meta.dirname,
              "node_modules/@astryxdesign/core/*",
            ),
          ],
          "@astryxdesign/core": [
            path.join(import.meta.dirname, "node_modules/@astryxdesign/core"),
          ],
        },
        dev: process.env.NODE_ENV === "development",
        unstable_moduleResolution: { type: "commonJS" },
      },
    },
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

Keep `rsOptions` in sync between `next.config.ts` and PostCSS ([stylexswc example](https://github.com/Dwlad90/stylex-swc-plugin/blob/develop/packages/nextjs-plugin/README.md); official StyleX makes the same "share config" demand for Babel+PostCSS: [stylexjs.com Next.js](https://stylexjs.com/docs/learn/installation/nextjs)).

CSS entry: official StyleX requires a root stylesheet with `@stylex;` so the PostCSS plugin can splice generated atomic CSS ([stylexjs.com Next.js](https://stylexjs.com/docs/learn/installation/nextjs)). Astryx layer order for Tailwind coexistence is declared **before** any `@import` ([migration guide](https://astryx.atmeta.com/docs/migration), [styling](https://astryx.atmeta.com/docs/styling)):

```css
@layer reset, theme, base, astryx-base, astryx-theme, components, utilities;

@import "@astryxdesign/core/reset.css";
@import "@astryxdesign/core/astryx.css"; /* omit if truly source-compiling all component CSS */
@import "@astryxdesign/theme-neutral/theme.css";

@stylex;
```

Missing compiler symptom: StyleX/`xstyle` source compiles as JS but renders **unstyled**, no error ([astryx styling](https://astryx.atmeta.com/docs/styling)).

## Why this path (constraint matrix)

| Constraint | What the sources say | Fit |
| --- | --- | --- |
| Do not disable SWC | Custom Babel config opts Next **webpack** out of the SWC compiler ([Next.js Compiler](https://nextjs.org/docs/architecture/nextjs-compiler)). `next/font` requires that compiler ([babel-font-loader-conflict](https://nextjs.org/docs/messages/babel-font-loader-conflict)). | `@stylexswc` never adds `.babelrc` ([plugin FAQ](https://github.com/Dwlad90/stylex-swc-plugin/blob/develop/packages/nextjs-plugin/README.md)). |
| Turbopack is default | Next 16: Turbopack default; `webpack()` ignored; no webpack plugins ([Next 16](https://nextjs.org/blog/next-16), [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)). | Must use `/turbopack` + PostCSS, not default webpack export of stylexswc, not `@stylexjs` webpack plugin. |
| React Compiler (Rust) | `experimental.turbopackRustReactCompiler` runs the compiler **inside Turbopack**. Webpack throws. No `babel-plugin-react-compiler` required when this flag is on ([docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackRustReactCompiler)). This repo already sets the flag. | Adding `--webpack` to make Astryx's Babel source-build work would **break** this flag. |
| `next/font` | Root layout uses `next/font/google`. | Stay on SWC/Turbopack internals. |
| Author `stylex.create` / `xstyle` | Astryx: `xstyle` must come from `stylex.create()`; needs a build-time StyleX compiler ([styling](https://astryx.atmeta.com/docs/styling)). Typed tokens: `@astryxdesign/core/theme/tokens.stylex` ([styling-libraries](https://astryx.atmeta.com/docs/styling-libraries)). | Compiler in the app build is mandatory. Dist CSS alone is not enough for app StyleX. |
| Source-compile `@astryxdesign/core` | Astryx ships pre-compiled CSS **or** TypeScript+StyleX source ([how Astryx works](https://astryx.atmeta.com/blog/how-astryx-works)). Source needs `transpilePackages` + resolve `source` exports. | `transpilePackages` is bundler-agnostic. Source **resolution** in `@astryxdesign/build/next` is webpack-only (see below). |
| Bun | App scripts use `bun --bun` to run Next. stylexswc is NAPI-RS, not `experimental.swcPlugins` WASM. | No first-party Bun+StyleX guide. Native NAPI is the same class of binary Next's own SWC uses; still a prototype smoke item. |

## Known breakages

### Babel vs SWC (the sharp edge)

Two different Next bundlers, two different Babel meanings:

1. **Webpack** (`next dev --webpack` / `next build --webpack`): a `babel.config.js` / `.babelrc` **disables** the Next.js SWC compiler for JS/TS ([Next.js Compiler](https://nextjs.org/docs/architecture/nextjs-compiler)). That is the historic `next/font` hard fail ([babel-font-loader-conflict](https://nextjs.org/docs/messages/babel-font-loader-conflict)). Astryx styling still describes this as the Next 15 App Router trap and points at `@stylexswc/nextjs-plugin` ([styling](https://astryx.atmeta.com/docs/styling)).

2. **Turbopack (Next 16+)**: Babel is **supported**. If a Babel config file exists, Turbopack runs `babel-loader` automatically. **Unlike webpack, SWC is always used for Next.js internal transforms and downleveling** ([Turbopack supported features](https://nextjs.org/docs/app/api-reference/turbopack)). Next 16 changelog: "Automatically enables Babel if a babel config is found (previously exited with hard error)" ([Next 16](https://nextjs.org/blog/next-16)). Official StyleX docs: Babel + PostCSS "works with both Webpack and Turbopack" since **Next.js 16.0.3** ([stylexjs.com Next.js](https://stylexjs.com/docs/learn/installation/nextjs)).

So on Next 16.3 **Turbopack**, `@stylexjs/babel-plugin` does not necessarily kill SWC internals or `next/font`. It still:

- Pulls Babel across app files (Turbopack's `next/babel` standalone mode disables redundant transforms but still pays Babel parse; see [vercel/next.js#82676](https://github.com/vercel/next.js/pull/82676)).
- Fights the map rule: "Do **not** add `@stylexjs/babel-plugin` in a way that disables SWC" ([#64](https://github.com/fringe4life/firstroad/issues/64)).
- Contradicts Astryx's current styling page ("Do NOT add `@stylexjs/babel-plugin`").
- Does not give `@astryxdesign/build`'s webpack `source` resolution.
- Leaves `turbopackRustReactCompiler` on the Rust path while adding a second (Babel) pipeline. Next merged babel-loader + React Compiler config so Babel does not run **twice** for the Babel compiler ([vercel/next.js#83502](https://github.com/vercel/next.js/pull/83502)); that merge is about the **Babel** React Compiler, not a documented guarantee for the **Rust** compiler plus a custom StyleX Babel plugin.

**Do not take the official StyleX Babel Next example as the firstroad path.** It is valid StyleX-on-Next-16-Turbopack. It is not valid for "keep SWC / keep Rust React Compiler / follow Astryx SWC guidance."

### Turbopack vs webpack plugins

- Turbopack: no webpack plugins; loaders only; `webpack()` in `next.config` ignored ([Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)).
- Official StyleX has **no** first-party Turbopack compiler plugin. Maintainer: "We only support a Babel plugin and a PostCSS plugin which can be used with NextJS." Community SWC reimplementation named: [facebook/stylex#1140](https://github.com/facebook/stylex/issues/1140).
- stylexswc webpack export extracts CSS in-bundler; `/turbopack` does **not**. PostCSS is mandatory. Ignored turbopack options listed above.

### `@astryxdesign/build` prefix split vs stylexswc

`@astryxdesign/build` exists because StyleX atomic class names collide if library and product share a prefix. It runs **two** Babel StyleX instances (`classNamePrefix: 'astryx'` vs `'x'`) and wraps CSS in `@layer astryx-base` vs `@layer product` ([packages/build/README](https://github.com/facebook/astryx/blob/main/packages/build/README.md)). Quote: "Without separate prefixes, library and product classes collide and can't be placed in independent CSS layers, which breaks theme overrides."

`@astryxdesign/build` exports ([packages/build/package.json](https://github.com/facebook/astryx/blob/main/packages/build/package.json)):

| Export | Engine | Next 16 Turbopack? |
| --- | --- | --- |
| `@astryxdesign/build/babel` | Wraps `@stylexjs/babel-plugin` | Needs `babel.config.js` |
| `@astryxdesign/build/postcss` | Two Babel StyleX passes + layers | PostCSS yes; still Babel |
| `@astryxdesign/build/vite` | Wraps `@stylexjs/unplugin` | Vite only |
| `@astryxdesign/build/next` (`withAstryx`) | `transpilePackages` + **webpack** `conditionNames` + `resolve.alias` + `symlinks: false` | **No.** `webpack()` is ignored under Turbopack. Source: [packages/build/src/next.js](https://github.com/facebook/astryx/blob/main/packages/build/src/next.js) |

There is **no** `@astryxdesign/build` SWC or Turbopack export. Dual prefix is a Babel-wrapper feature, not something stylexswc documents.

**Prototype risk:** source-compiling `@astryxdesign/core` through stylexswc without the dual prefix may mix library and app atoms in one namespace. Mitigations to try in the prototype ticket (not here): (a) consume prebuilt `@astryxdesign/core/astryx.css` for components and only compile **app** `stylex.create` / `xstyle` (Astryx dist+StyleX model); (b) accept one prefix and verify theme overrides; (c) later ask Astryx for an SWC-aware prefix split. Map destination still wants source-compile — treat (a) as a fallback if (b) breaks theme layers.

### Astryx examples vs Astryx styling docs

| Artifact | What it actually is | Next | Compiler |
| --- | --- | --- | --- |
| [astryx styling "Next.js (App Router, SWC)"](https://astryx.atmeta.com/docs/styling) | Documents `@stylexswc/nextjs-plugin` and says see `apps/example-nextjs-stylex` | — | SWC (documented) |
| [`apps/example-nextjs-stylex`](https://github.com/facebook/astryx/tree/main/apps/example-nextjs-stylex) | **Dist** Astryx CSS + **app-only** StyleX. README: "Astryx component CSS comes pre-built; there is no need to compile Astryx source." Empty `next.config.mjs`. **Babel** `@stylexjs/babel-plugin` + `@stylexjs/postcss-plugin`. `next` `^15.5.21`. | 15 | Babel. **Not** stylexswc. **Not** source-compile. |
| [`apps/example-nextjs-source`](https://github.com/facebook/astryx/tree/main/apps/example-nextjs-source) | Source-compile via `@astryxdesign/build` (`babel(__dirname)`, `postcss(__dirname)`, `withAstryx({})`) | 15 | Babel + webpack `withAstryx` |
| Astryx docsite Next 16.3 | Cache Components migration. Scripts add `--webpack` "**since the StyleX Babel setup doesn't run under Turbopack**" ([facebook/astryx#3433](https://github.com/facebook/astryx/pull/3433)). Same PR drops a global webpack `conditionNames` override because it broke React resolution during prerender. | 16.3 | Babel **on webpack**, not Turbopack |

**`example-nextjs-stylex` does not apply** as a copy-paste for firstroad: wrong compiler (Babel), wrong Astryx consumption (dist), Next 15, no `transpilePackages`, no SWC plugin. Steal from it: `useCSSLayers.before: ['reset', 'astryx-base', 'astryx-theme']` if we stay on dist CSS for components; `@stylex;` in `globals.css`; Theme + `LinkProvider` wiring.

**`example-nextjs-source` / `@astryxdesign/build` do not apply** as a copy-paste either: webpack `withAstryx`, Babel dual plugin, `--webpack` would kill `turbopackRustReactCompiler`. Steal from it: `transpilePackages` list, `source` export aliases, StyleX `aliases` for `@astryxdesign/core`, separate `layers.css` if webpack is ever used, browserslist so `light-dark()` is not downleveled.

The styling page's SWC snippet **does** apply as the intended Next App Router recipe, even though the example app it names does not match that snippet.

### React Compiler

- Default Next 16 React Compiler is a Babel plugin, applied only to relevant files via an SWC prefilter ([reactCompiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)). This repo already depends on `babel-plugin-react-compiler@1.0.0`.
- `turbopackRustReactCompiler: true` switches that work into Turbopack native code and says you do **not** need the Babel plugin ([docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackRustReactCompiler)). Introduced in **16.3.0**.
- Webpack + this flag = error. Official Astryx Next 16.3 docsite chose webpack for StyleX Babel. firstroad cannot follow that without dropping the Rust compiler flag.

### `next/font`

Stay off webpack+Babel. Turbopack Next 16 keeps SWC internals even with a Babel config, but Astryx and the map still treat Babel-as-compiler as the `next/font` footgun. stylexswc avoids the footgun entirely.

### Bun

No primary StyleX or Astryx doc covers `bun --bun` as the Next runtime. stylexswc is NAPI-RS (`@stylexswc/rs-compiler`), same native-addon family as `@next/swc-*` (already in `apps/web/bunfig.toml` `minimumReleaseAgeExcludes`). Prototype should run `bun --bun run next dev` and `next build` once; if NAPI fails, fall back to `bun run` (Node) for Next only.

Do not use Next `experimental.swcPlugins` WASM for StyleX. stylexswc's Next integration is a Turbopack **loader**, not an SWC WASM plugin ([plugin README](https://github.com/Dwlad90/stylex-swc-plugin/blob/develop/packages/nextjs-plugin/README.md)).

## Does `@astryxdesign/build` apply?

**Not as the Next 16 Turbopack compiler.** It is the official **source-build** toolkit for Babel/webpack/Vite. firstroad's bundler is Turbopack; firstroad's React Compiler port is Turbopack-only; firstroad's map forbids disabling SWC.

Reusable pieces without taking the Babel compiler:

1. `transpilePackages: ['@astryxdesign/core', '@astryxdesign/theme-neutral']` — same list `withAstryx` merges ([next.js](https://github.com/facebook/astryx/blob/main/packages/build/src/next.js)).
2. Per-subpath `source` export aliases — reimplement with `turbopack.resolveAlias` (Turbopack has no `conditionNames` API; `resolveAlias` is the documented substitute ([turbopack config](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack))). `withAstryx` comments why a global `source` condition is dangerous (third-party packages like `lexical` also ship `source`; it also broke React on the docsite, [#3433](https://github.com/facebook/astryx/pull/3433)).
3. StyleX `aliases` for `@astryxdesign/core` so `tokens.stylex` / `defineVars` resolve ([build README](https://github.com/facebook/astryx/blob/main/packages/build/README.md)).
4. Layer names `reset < astryx-base < astryx-theme < product` ([build README](https://github.com/facebook/astryx/blob/main/packages/build/README.md)).

Not reusable without Babel/webpack: `@astryxdesign/build/babel`, `@astryxdesign/build/postcss` (Babel passes), `withAstryx`'s webpack `conditionNames` rule and `resolve.symlinks = false`.

## Dist vs source (decision for later tickets)

Astryx documents two distributions ([how Astryx works](https://astryx.atmeta.com/blog/how-astryx-works), [core README via astryx.atmeta.com styling](https://astryx.atmeta.com/docs/styling)):

- **Dist:** import `reset.css` + `astryx.css` + theme CSS. No StyleX compiler for Astryx itself. App `stylex.create` still needs a compiler. This is `example-nextjs-stylex`.
- **Source:** compile library StyleX in the app bundler; CSS only for imported components. This is `example-nextjs-source` + `@astryxdesign/build`.

Map #64 wants source-compile **and** app-authored StyleX. Compiler path above can attempt both (`transpilePackages` + `include` globs). If prefix/layer collision appears, fallback is dist CSS for Astryx + stylexswc for app styles only — still SWC, still `xstyle`, not full source-compile.

Pure `defineTheme` / `astryx theme build` needs **no** StyleX compiler ([styling](https://astryx.atmeta.com/docs/styling)). That does not satisfy app `stylex.create`.

## What not to do

- Do not copy StyleX's `examples/example-nextjs` Babel config into `apps/web` as the primary path ([stylexjs.com](https://stylexjs.com/docs/learn/installation/nextjs)).
- Do not `next dev --webpack` to make `@astryxdesign/build` work while `turbopackRustReactCompiler` is true.
- Do not expect `@astryxdesign/build/next` to source-resolve under Turbopack.
- Do not treat `example-nextjs-stylex` as an SWC or source-compile sample; the styling page's pointer is stale relative to the example README.
- Do not skip PostCSS under Turbopack (unstyled output, silent).
- Do not use [tailwind-stylex](https://github.com/aidenybai/tailwind-stylex) as the token source (map out of scope). Tokens: `@astryxdesign/core/theme/tokens.stylex`.

## Prototype checks (out of scope here)

When #73 (or the prototype child) runs:

1. `bun --bun` `next dev` + `next build` with the wrapper; confirm NAPI loads.
2. `next/font/google` still emits in root layout.
3. `reactCompiler` + `turbopackRustReactCompiler` still on; webpack not used.
4. One `stylex.create` + one Astryx `xstyle` override visible in computed CSS.
5. If source-compiling core: button padding non-zero (Astryx foundation check, [migration](https://astryx.atmeta.com/docs/migration)); inspect whether class prefixes mix.
6. Tailwind utilities still win on leftover surfaces (`utilities` last in `@layer`).

## Sources

- [Astryx styling — StyleX build setup / Next SWC](https://astryx.atmeta.com/docs/styling)
- [Astryx migration](https://astryx.atmeta.com/docs/migration)
- [Astryx styling-libraries](https://astryx.atmeta.com/docs/styling-libraries)
- [How Astryx works](https://astryx.atmeta.com/blog/how-astryx-works)
- [@astryxdesign/build README](https://github.com/facebook/astryx/blob/main/packages/build/README.md)
- [@astryxdesign/build/next source](https://github.com/facebook/astryx/blob/main/packages/build/src/next.js)
- [example-nextjs-stylex README](https://github.com/facebook/astryx/blob/main/apps/example-nextjs-stylex/README.md)
- [example-nextjs-source README](https://github.com/facebook/astryx/blob/main/apps/example-nextjs-source/README.md)
- [facebook/astryx#3433](https://github.com/facebook/astryx/pull/3433) (docsite Next 16.3 + `--webpack` for StyleX Babel)
- [StyleX Next.js install](https://stylexjs.com/docs/learn/installation/nextjs)
- [facebook/stylex#1140](https://github.com/facebook/stylex/issues/1140) (no official Turbopack plugin; points at stylex-swc-plugin)
- [@stylexswc/nextjs-plugin README](https://github.com/Dwlad90/stylex-swc-plugin/blob/develop/packages/nextjs-plugin/README.md)
- [Next.js Compiler (SWC vs Babel)](https://nextjs.org/docs/architecture/nextjs-compiler)
- [babel-font-loader-conflict](https://nextjs.org/docs/messages/babel-font-loader-conflict)
- [Turbopack](https://nextjs.org/docs/app/api-reference/turbopack)
- [turbopack config](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)
- [reactCompiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)
- [turbopackRustReactCompiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackRustReactCompiler)
- [Next.js 16 blog](https://nextjs.org/blog/next-16)
- Live app: `apps/web/next.config.ts`, `apps/web/package.json`, `apps/web/postcss.config.ts`, `apps/web/src/app/layout.tsx`
