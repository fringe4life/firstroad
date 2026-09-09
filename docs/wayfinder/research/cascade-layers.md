# Tailwind v4 + Astryx/StyleX cascade layers

Ticket: [#70](https://github.com/fringe4life/firstroad/issues/70) (map [#64](https://github.com/fringe4life/firstroad/issues/64))

**Question:** canonical `@layer` / `@import` order in `apps/web/src/app/globals.css` so Astryx primitives keep non-zero padding and leftover Tailwind utilities still win during migrate.

**Answer:** declare the full layer list once, in its own `layers.css`, imported first. Then split Tailwind so Preflight lands in `base` and utilities land last. Insert Astryx reset/base/theme (and the Tailwind token bridge) between Preflight and utilities. Put app StyleX in `product` (or `stylex.*`) after `astryx-theme` and before `utilities`. Do not apply this in the main checkout from this ticket.

## Why layer order is the whole bug

CSS cascade layers decide the winner **before** specificity. Unlayered styles beat every named layer. Among named layers, the **last declared name** wins. First appearance of a name locks its position; later `@layer` blocks only append rules ([CSS Cascade 5 §6.4.3](https://www.w3.org/TR/css-cascade-5/#layer-ordering); [MDN `@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)).

In an unlayered sheet, `* { padding: 0 }` loses to any class. Once that same reset sits in a layer **after** `astryx-base`, the zero-specificity reset wins against every Button/Card/Input padding. Silent, app-wide, no warning ([Astryx migration — Cascade Layer Safety](https://astryx.atmeta.com/docs/migration); [facebook/astryx#3755](https://github.com/facebook/astryx/issues/3755)).

Same trap from the other side: if Astryx layers are created **after** Tailwind’s `theme, base, components, utilities`, Astryx component CSS outranks leftover utilities, so `className="p-4"` on an Astryx primitive does nothing ([example-nextjs-tailwind `globals.css` comment](https://github.com/facebook/astryx/blob/main/apps/example-nextjs-tailwind/src/app/globals.css)).

Tailwind Preflight itself is `* { margin: 0; padding: 0 }` inside `@layer base` ([Tailwind Preflight](https://tailwindcss.com/docs/preflight)). That is safe **only** while `base` stays **before** `astryx-base`. Unlayered Preflight beats `astryx-theme` and zeroes padding ([Astryx migration](https://astryx.atmeta.com/docs/migration); #3755 citing #3374).

## Canonical order (lowest → highest)

| Layer | Source | Role |
| --- | --- | --- |
| `reset` | `@astryxdesign/core/reset.css` | Astryx `:where()` reset. Lowest. Any leftover app reset must join **this** layer, never a later one. |
| `theme` | `tailwindcss/theme.css` | Tailwind theme variables. |
| `base` | `tailwindcss/preflight.css` **and** this app’s existing `@layer base { … }` | Preflight + firstroad layout tokens (`html` sidebar calc, `body` bg, `* { border-border }`). |
| `astryx-base` | `@astryxdesign/core/astryx.css` (dist) or `@astryxdesign/build` library pass (source) | Primitive padding/color/type. Must beat reset + Preflight. |
| `astryx-theme` | `@astryxdesign/theme-neutral/theme.css` | Theme overrides on primitives. |
| `product` | App-authored StyleX (`x` prefix) from source compile | Product `stylex.create` / `xstyle`. Beats Astryx defaults. **Loses** to leftover Tailwind utilities during migrate. |
| `components` | Tailwind component classes (if any) | Reserved by Tailwind v4. |
| `utilities` | `tailwindcss/utilities.css` + Tailwind `@utility` from `tw-animate-css` / `shadcn/tailwind.css` | Leftover utility classes **win** over all named layers above. |
| _(unlayered)_ | Current view-transition / keyframe CSS in `globals.css` | Beats every named layer. Fine for VT chrome. Fatal if a reset lands here. |

Astryx’s with-Tailwind list is `reset, theme, base, astryx-base, astryx-theme, components, utilities` ([migration](https://astryx.atmeta.com/docs/migration), [styling](https://astryx.atmeta.com/docs/styling), [styling-libraries](https://astryx.atmeta.com/docs/styling-libraries)). This app’s map destination is **source-compiled** Astryx + app StyleX ([#64](https://github.com/fringe4life/firstroad/issues/64)), so insert `product` **between** `astryx-theme` and `components`. Empty `product` is harmless until StyleX emits into it. If `product` is omitted and the compiler later introduces that name, CSS appends it **after** `utilities` and leftover Tailwind stops winning ([CSS Cascade 5 §6.4.3](https://www.w3.org/TR/css-cascade-5/#layer-ordering)).

## Exact snippet for this app

Current `globals.css` (dirty tree at research time) already starts with:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

then `@custom-variant`, `@theme`, `@layer base`, then unlayered view-transition CSS. Next 16.3, Tailwind 4.3, `@tailwindcss/postcss` only (`apps/web/postcss.config.ts`). Root layout imports `./globals.css`.

### 1. `apps/web/src/app/layers.css` (required, own file)

```css
/* First occurrence of each name locks order. Import this file first. */
@layer reset, theme, base, astryx-base, astryx-theme, product, components, utilities;
```

Astryx: *“Declare the canonical `@layer` order once, before any `@import`. With webpack-based bundlers (including Next.js) the order declaration must live in its own CSS file imported first, such as `layers.css`, because webpack hoists `@import` content above the inline CSS that follows it.”* ([migration — Cascade Layer Safety](https://astryx.atmeta.com/docs/migration); [`@astryxdesign/build` README](https://github.com/facebook/astryx/blob/main/packages/build/README.md))

If the list sits in `globals.css` after `@import "tailwindcss"`, webpack/css-loader emits Tailwind’s `@layer theme, base, components, utilities` **first**. New names `reset` / `astryx-base` / `astryx-theme` then append **after** `utilities`. That is the “Astryx beats `p-4`” failure, or worse, a late reset zeroes padding.

CSS allows an empty `@layer` statement **before** `@import` ([Cascade 5 §2](https://www.w3.org/TR/css-cascade-5/#at-import): `@import` must precede other rules except `@charset` and empty `@layer` statements). The separate file is for the bundler, not the CSS grammar.

### 2. `apps/web/src/app/globals.css` (migrate window)

Canonical Astryx-with-Tailwind form, adapted to keep `tw-animate-css`, `shadcn/tailwind.css`, and the rest of the current file:

```css
@import "./layers.css";

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "@astryxdesign/core/reset.css";
@import "@astryxdesign/core/astryx.css";
@import "@astryxdesign/theme-neutral/theme.css";
@import "@astryxdesign/core/tailwind-theme.css";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "tailwindcss/utilities.css" layer(utilities);

@custom-variant dark (&:is(.dark *));
@custom-variant detail (&:where([data-detail="true"] *));
@custom-variant owner (&:where([data-owner="true"] *));
@custom-variant item (&:where([data-item="true"] *));
@custom-variant unsuccessful (&:where([data-unsuccessful="true"] *));
@custom-variant card (&:where([data-slot="card"] *));

/* … existing @theme, @custom-variant supports-scroll-timeline, @layer base,
   unlayered view-transition keyframes: leave in place … */
```

When source-compile + app StyleX is wired (see [#65](https://github.com/fringe4life/firstroad/issues/65) / [#66](https://github.com/fringe4life/firstroad/issues/66)), add `@stylex;` after the Astryx CSS imports (dist+StyleX example) **or** let `@astryxdesign/build/postcss` inject library CSS into `astryx-base` and product CSS into `product` ([build README](https://github.com/facebook/astryx/blob/main/packages/build/README.md)). Do not duplicate `astryx.css` if the source plugin already emits library rules.

### Barrel alternative (acceptable on this app)

`@import "tailwindcss"` is the documented expansion of the three split files ([Tailwind Preflight](https://tailwindcss.com/docs/preflight)):

```css
@layer theme, base, components, utilities;
@import "./theme.css" layer(theme);
@import "./preflight.css" layer(base);
@import "./utilities.css" layer(utilities);
```

Astryx host-aligned guidance: keep the host barrel if it already exists, and put the expanded `@layer` list **above** it ([host-aligned.md](https://github.com/facebook/astryx/blob/main/internal/vibe-tests/setup-test/guidance/host-aligned.md)). This app already uses the barrel + `@tailwindcss/postcss`, which inlines those `@layer` **blocks** at PostCSS time.

Barrel form (less churn, still correct **if** `layers.css` is first):

```css
@import "./layers.css";

@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@astryxdesign/core/reset.css";
@import "@astryxdesign/core/astryx.css";
@import "@astryxdesign/theme-neutral/theme.css";
@import "@astryxdesign/core/tailwind-theme.css";

/* existing @custom-variant / @theme / @layer base / VT CSS unchanged */
```

Layer position, not source order, makes utilities win. Prefer **split** when first applying Astryx (matches [migration](https://astryx.atmeta.com/docs/migration) / [styling](https://astryx.atmeta.com/docs/styling) copy-paste). Prefer **barrel** if Turbopack is observed stripping `@import … layer()` attributes (see below). **Verify the emitted CSS**, not the source ([host-aligned.md](https://github.com/facebook/astryx/blob/main/internal/vibe-tests/setup-test/guidance/host-aligned.md)).

## What stays from current `globals.css`

| Existing | Layer fate | Notes |
| --- | --- | --- |
| `@import "tw-animate-css"` | Tailwind `@theme` / `@utility` (utilities) | No reset. Keep next to other Tailwind CSS. |
| `@import "shadcn/tailwind.css"` | `@theme`, `@custom-variant`, `@utility` | No `* { padding: 0 }`. Keep. |
| `@custom-variant dark/detail/owner/…` | n/a (Tailwind variant registration) | Keep. |
| `@theme` / `@theme inline` (oklch tokens, layout vars, shadows) | theme | Keep during migrate. Collides with `@astryxdesign/core/tailwind-theme.css` on shared names (`primary`, `background`, …). Bridge is the paved migrate path ([styling-libraries](https://astryx.atmeta.com/docs/styling-libraries)); host-aligned says **omit** the bridge if the host must keep its own Tailwind vocabulary. Token clash is a later #64 decision, not a layer-order decision. |
| `@layer base { * { @apply border-border } … html/body/nav }` | `base` (before `astryx-base`) | Keep. Astryx padding still wins. Do **not** move a padding reset here. |
| Unlayered `::view-transition-*` and `@keyframes --*` | unlayered (highest) | Keep. Ticket [#71](https://github.com/fringe4life/firstroad/issues/71) owns whether these move into StyleX. |

`tw-animate-css@1.4.0` and `shadcn@4.18.0` `tailwind.css` are theme/utility/variant CSS, not universal resets (package CSS inspected for this note).

## StyleX compiler CSS

Two emission shapes; both must sit in the locked list **before** `utilities`.

**Dist Astryx + app StyleX** ([example-nextjs-stylex README](https://github.com/facebook/astryx/blob/main/apps/example-nextjs-stylex/README.md), [StyleX unplugin `useCSSLayers`](https://stylexjs.com/docs/api/configuration/unplugin/)):

```js
useCSSLayers: {
  before: ["reset", "theme", "base", "astryx-base", "astryx-theme"],
  after: ["components", "utilities"],
  prefix: "stylex",
},
```

Emits `@layer reset, theme, base, astryx-base, astryx-theme, stylex.priority1, …, components, utilities`. `after: ['utilities']` is load-bearing during migrate: without it, new `stylex.*` names append after `utilities` and leftover Tailwind loses. The dist example only sets `before` because that app has **no Tailwind**.

**Source compile** (map destination, [`@astryxdesign/build`](https://github.com/facebook/astryx/blob/main/packages/build/README.md)):

```
reset < astryx-base (library, astryx prefix) < astryx-theme < product (app, x prefix)
```

PostCSS defaults: `layers.library = 'astryx-base'`, `layers.product = 'product'`. `layers.css` already names `product`. Do not also emit unprefixed StyleX `priorityN` layers unless they are listed in the **first** `@layer` statement.

Compiler choice (SWC vs Babel, `next/font`) is [#65](https://github.com/fringe4life/firstroad/issues/65). Layer **names** stay the same regardless of compiler.

## Next / webpack hoist (and Turbopack)

1. **Webpack/css-loader hoist:** `@import` content is lifted above later inline CSS. An in-file `@layer reset, theme, …` after `@import "tailwindcss"` is too late. Fix: `layers.css` imported first ([Astryx migration](https://astryx.atmeta.com/docs/migration); [build README](https://github.com/facebook/astryx/blob/main/packages/build/README.md)).

2. **This app defaults to Turbopack** (`apps/web/next.config.ts`: `turbopackFileSystemCacheForDev/ForBuild`). Some Next Turbopack versions stripped `@import … layer()` attributes in dev ([vercel/next.js#85029](https://github.com/vercel/next.js/issues/85029), [#88533](https://github.com/vercel/next.js/issues/88533)). If split `layer(base)` on Preflight is stripped, Preflight becomes **unlayered** and zeroes Astryx padding in dev only. Mitigation: keep `@import "tailwindcss"` so `@tailwindcss/postcss` emits `@layer` **blocks** before the bundler; still use `layers.css`; confirm in the built CSS that Preflight is inside `@layer base` and the first `@layer` list is the expanded Astryx list.

3. **Do not** wrap Astryx imports in `@import "…" layer(astryx-base)`. Nested `@import` inside a layered file **inherits** that layer ([migration](https://astryx.atmeta.com/docs/migration)). Astryx packages already wrap themselves (`reset.css` → `@layer reset`, `astryx.css` → `@layer astryx-base`; [Distribution wiki](https://github.com/facebook/astryx/wiki/Distribution)). Re-layering them into a consumer layer after `astryx-base` is the #3755 padding bug.

## Foundation check (run before migrating a route)

Astryx’s assertion ([migration — Foundation Smoke Test](https://astryx.atmeta.com/docs/migration)):

```ts
const button = document.querySelector<HTMLButtonElement>(
  "[data-foundation-check] button",
);
if (!button) {
  throw new Error("Foundation check page did not render a button.");
}
if (getComputedStyle(button).paddingInline === "0px") {
  throw new Error(
    "Foundation broken: an unlayered reset or a later cascade layer is " +
      "overriding component styles. Check that no app reset sits outside " +
      "the reset layer.",
  );
}
```

Also confirm a leftover utility still wins: e.g. `<Button className="p-0" />` should compute `paddingInline === "0px"` while the un-classed Button does not.

## Out of scope here

- No `globals.css` / `layers.css` edits in this research branch (map: research tickets do not ship app CSS).
- Color-mode owner (`next-themes` vs Astryx `Theme`), token clash with `tailwind-theme.css`, view-transition island → other #64 children.
- Dropping Tailwind / `cn` / `cva` after the migrate window.

## Sources

- [Astryx Migration Guide](https://astryx.atmeta.com/docs/migration) — Tailwind v4 snippet, hoist warning, reset audit, foundation check
- [Astryx Styling](https://astryx.atmeta.com/docs/styling) — same Tailwind snippet; StyleX compiler vs dist
- [Astryx Styling Libraries](https://astryx.atmeta.com/docs/styling-libraries) — pre-declare every layer; `tailwind-theme.css` bridge
- [example-nextjs-tailwind `globals.css`](https://github.com/facebook/astryx/blob/main/apps/example-nextjs-tailwind/src/app/globals.css)
- [example-nextjs-stylex README](https://github.com/facebook/astryx/blob/main/apps/example-nextjs-stylex/README.md)
- [`@astryxdesign/build` README](https://github.com/facebook/astryx/blob/main/packages/build/README.md) — `layers.css` + `product`
- [host-aligned.md](https://github.com/facebook/astryx/blob/main/internal/vibe-tests/setup-test/guidance/host-aligned.md) — keep `@import "tailwindcss"`; verify emitted CSS
- [facebook/astryx#3755](https://github.com/facebook/astryx/issues/3755)
- [Tailwind v4 Preflight](https://tailwindcss.com/docs/preflight) — barrel expansion; Preflight in `base`; `padding: 0`
- [StyleX unplugin `useCSSLayers`](https://stylexjs.com/docs/api/configuration/unplugin/) — `before` / `after` / `prefix`
- [CSS Cascade 5 — `@import` and layer ordering](https://www.w3.org/TR/css-cascade-5/#layer-ordering)
- [MDN `@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- App: `apps/web/src/app/globals.css`, `apps/web/postcss.config.ts`, `apps/web/next.config.ts`, `apps/web/package.json` (Next 16.3.3, Tailwind 4.3.3)
