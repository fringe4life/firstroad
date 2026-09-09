# Can view-transitions and layout tokens live in StyleX?

Ticket: [#71](https://github.com/fringe4life/firstroad/issues/71) (map [#64](https://github.com/fringe4life/firstroad/issues/64))

**Answer:** Most of the motion/layout in `apps/web/src/app/globals.css` can move into StyleX. Two pieces cannot: `::view-transition-*`:only-child` rules, and (practically) the scroll-driven `.nav-scroll` block. Tailwind `@utility` / `@custom-variant` / `@theme` wrappers are not StyleX at all; they rewrite as `stylex.create` / `defineVars`, not as a CSS island.

Standing preference is keep this motion/layout. Prototype may leave a CSS island. Spec should treat the island as the two gaps below, not the whole file.

Sources: StyleX docs + compiler (primary), dirty `apps/web/src/app/globals.css` in the main checkout (the file this ticket asked about).

---

## Verdict table

| Current `globals.css` piece | StyleX? | Where it lives |
| --- | --- | --- |
| Theme circle wipe (`circle-in-top-center` / `circle-in-bottom-center`) | **Yes** | `stylex.viewTransitionClass` + `stylex.keyframes` |
| Ticket-card / nav slides **without** `:only-child` (`slide-forward`, `slide-back`, `slide-down`/`slide-up`, `enter-left`/`exit-left`/`enter-right`/`exit-right`) | **Yes** | same |
| Ticket-card / password slides **with** `:only-child` (`ticket-card-enter`/`exit`, `slide-left`, `slide-right-skew`) | **No** (selector) | CSS island. StyleX emits `::view-transition-old(*.hash){…}` only |
| `--nav-animation` + `.nav-scroll` (`animation-timeline: scroll()`, `animation-range-*`) | **Mostly no** | CSS island. `animationTimeline` is allowed; `animation-range-*` is not in StyleX `valid-styles` |
| Layout tokens (`--header-height`, `--side-width`, `--expanded-sidebar-width`, …) | **Yes** | `stylex.defineVars` with `--` keys; typed `--side-width` via `stylex.types.length` |
| `@property --side-width` | **Yes** | `stylex.types.length(...)` inside `defineVars` (emits `@property` with `inherits: true`) |
| Hover/focus expand of `--side-width` | **Yes** | `defineVars` key as style property + `stylex.when.descendant` (or `:hover` on ancestor) |
| `@utility` grid helpers (`layout-grid-cols`, `main-grid-rows`, `max-content-*`) | **Rewrite, not island** | `stylex.create` on the components that use them. StyleX has no `@utility` |
| `@custom-variant supports-scroll-timeline` | **Rewrite, not island** | `'@supports (animation-timeline: scroll())'` condition in `create` / `defineVars` |

Minimum CSS island for a prototype that keeps current motion:

1. `:only-child` view-transition rules (and their keyframes, unless those keyframes are duplicated into StyleX for the non-`:only-child` names).
2. `.nav-scroll` + `@keyframes --nav-animation` (scroll timeline + range).

Everything else in the ticket's list can be StyleX-owned.

---

## 1. View transitions — StyleX owns the API, not every selector

### What StyleX can emit

`stylex.viewTransitionClass` creates one generated class and four optional pseudo rules ([docs](https://stylexjs.com/docs/api/javascript/viewTransitionClass)):

- `group` → `::view-transition-group(*.theGeneratedClass)`
- `imagePair` → `::view-transition-image-pair(*.theGeneratedClass)`
- `old` → `::view-transition-old(*.theGeneratedClass)`
- `new` → `::view-transition-new(*.theGeneratedClass)`

Pass the returned string into React `<ViewTransition default|enter|exit={…} />`, which is exactly how firstroad already wires names (`enter="ticket-card-enter"`, theme `circle-in-top-center`, password `slide-left`, pagination `enter-left`, …).

Compiler output is a class-tied pseudo, no extra combinators ([`stylex-view-transition-class.js`](https://github.com/facebook/stylex/blob/main/packages/@stylexjs/babel-plugin/src/shared/stylex-view-transition-class.js)):

```text
::view-transition-new(*.xhash){animation-name:…;animation-duration:…;}
```

`stylex.keyframes` supplies the animation name ([docs](https://stylexjs.com/docs/api/javascript/keyframes)). Use longhands (`animationName`, `animationDuration`, `animationDelay`, `animationTimingFunction`, `animationFillMode`). The `animation` shorthand is rejected by StyleX `valid-styles` ([`cssProperties.js`](https://github.com/facebook/stylex/blob/main/packages/@stylexjs/eslint-plugin/src/reference/cssProperties.js): "`animation` is not recommended. Please use `animationName`, `animationDuration`, etc. instead").

Documented limits of `viewTransitionClass`:

- No media queries (planned). Nested conditions are dropped: the compiler keeps only string/number declarations after flatten.
- `clip-path` is a valid StyleX property (`clipPath`), so the theme circle wipe keyframes can live in `stylex.keyframes`.

### Theme circle wipe — StyleX

Current CSS (`globals.css` ~321–351):

```css
@keyframes --circle-in-top-center { from { clip-path: circle(0% at top center); } … }
::view-transition-new(.circle-in-top-center) { animation: --circle-in-top-center 0.5s; }
::view-transition-old(.circle-in-top-center),
::view-transition-old(.circle-in-bottom-center) { animation-delay: 0.5s; }
```

Wired in `apps/web/src/components/theme/theme-transition.tsx` as `enter: { "light-to-dark": "circle-in-top-center", … }`.

No `:only-child`. Maps 1:1:

```ts
const circleInTop = stylex.keyframes({
  from: { clipPath: "circle(0% at top center)" },
  to: { clipPath: "circle(150% at top center)" },
});

export const circleInTopCenter = stylex.viewTransitionClass({
  new: { animationName: circleInTop, animationDuration: "0.5s" },
  old: { animationDelay: "0.5s" },
});
```

Then `enter={{ "light-to-dark": circleInTopCenter, … }}`. Hashed class name replaces the stable `.circle-in-top-center` string; React only needs the JS string, not a global CSS class.

### Ticket-card / nav slides without `:only-child` — StyleX

These current rules have no extra combinator:

- `.slide-forward` / `.slide-back`
- `.slide-down` / `.slide-up`
- `.exit-left` / `.enter-left` / `.exit-right` / `.enter-right` (pagination)

Same `viewTransitionClass` + `keyframes` pattern. Pagination already passes those names through `PaginatedTransitions` → `ViewTransition`.

### `:only-child` rules — CSS island (StyleX cannot own)

Current CSS (`globals.css` ~454–472):

```css
::view-transition-old(.ticket-card-exit):only-child { … }
::view-transition-new(.ticket-card-enter):only-child { … }
::view-transition-old(.slide-right-skew):only-child { … }
::view-transition-new(.slide-left):only-child { … }
```

`:only-child` on a view-transition pseudo means “this snapshot has no pair” (enter/exit, not shared-element morph). Ticket cards set `name={\`ticket-${id}\`}` **and** `enter`/`exit` names; without `:only-child`, the scale/fade would also run on morphs.

StyleX has no knob for that combinator. Nested `':only-child'` inside `old`/`new` would be dropped (flatten keeps string/number only). `viewTransitionClass` also hashes the class, so a CSS island cannot target `*.xhash` at author time.

**Keep these four rules (and their keyframes) as a CSS island**, still using the stable React `enter`/`exit` strings (`ticket-card-enter`, `ticket-card-exit`, `slide-left`, `slide-right-skew`).

Do not “fix” this by dropping `:only-child` unless grilling accepts a behavior change.

---

## 2. `--nav-animation` scroll-timeline — CSS island

Current CSS (`globals.css` ~25–32, 302–310):

```css
@keyframes --nav-animation {
  to { box-shadow: var(--shadow-md); border-radius: 100vw; translate: 0 8px; scale: 0.98 1; }
}
.nav-scroll {
  animation: --nav-animation linear both;
  animation-timeline: scroll();
  animation-range-start: 100px;
  animation-range-end: 200px;
  transition: border-radius 750ms, translate 250ms ease-out;
}
```

Applied on the header `<nav className="nav-scroll">`.

What StyleX *does* allow, on a real element via `stylex.create` (not `viewTransitionClass`):

- `stylex.keyframes` for the to-state
- `animationName`, `animationTimingFunction`, `animationFillMode`
- `animationTimeline: "scroll()"` — listed in StyleX `valid-styles` as `isString` ([`cssProperties.js`](https://github.com/facebook/stylex/blob/main/packages/@stylexjs/eslint-plugin/src/reference/cssProperties.js) around `animationTimeline`)
- `transitionProperty` / `transitionDuration` / `transitionTimingFunction` longhands (`transition` shorthand is discouraged, same file)

What StyleX does **not** list:

- `animationRange`, `animationRangeStart`, `animationRangeEnd` — absent from that allowlist (checked against StyleX `main` `cssProperties.js`)

`@supports (animation-timeline: scroll())` *is* expressible: `defineVars` documents `@supports` as a condition ([defining variables](https://stylexjs.com/docs/learn/theming/defining-variables/)); `create` documents “media queries and other `@` rules” ([defining styles](https://stylexjs.com/docs/learn/styling-ui/defining-styles)). That replaces Tailwind `@custom-variant supports-scroll-timeline` on the sidebar (`supports-scroll-timeline:translate-y-2`).

**Spec:** keep `.nav-scroll` + `@keyframes --nav-animation` as one CSS island so the range and timeline stay one rule. Splitting keyframes into StyleX (hashed names) would make the island unable to reference them. Optional later: try `animationRangeStart` in StyleX and only island the range if the compiler/linter rejects it — not required for the prototype.

---

## 3. Layout tokens — StyleX owns them

Current tokens (`globals.css` `@theme inline` ~227–251, plus `@property --side-width` ~272–276, `html --sidebar-current-width` ~296–299):

| Token | Role |
| --- | --- |
| `--header-padding-y`, `--header-content-height`, `--header-border` | inputs to `--header-height` |
| `--header-height` | sidebar `top-(--header-height)` |
| `--sidebar-height` | `calc(100svh - var(--header-height))` |
| `--side-width` | collapsed rail; **registered** `@property` so it can transition |
| `--expanded-sidebar-width` | hover/focus target |
| `--auth-nav-width`, `--max-content-widest`, `--max-content-narrow` | content measure |
| `--heading-height` | heading stack |

`stylex.defineVars` creates global CSS custom properties ([docs](https://stylexjs.com/docs/api/javascript/defineVars)). Keys starting with `--` keep that name (no hash). Must be named exports in a `*.stylex.ts` file.

Typed vars emit `@property` with `inherits: true` ([types docs](https://stylexjs.com/docs/api/javascript/types), compiler [`stylex-define-vars.js`](https://github.com/facebook/stylex/blob/main/packages/@stylexjs/babel-plugin/src/shared/stylex-define-vars.js)):

```js
`@property --${nameHash} { syntax: "${syntax}"; inherits: true; initial-value: ${iv} }`
```

That is the current `--side-width` registration:

```css
@property --side-width {
  syntax: "<length>";
  inherits: true;
  initial-value: 0px;
}
```

Derived tokens use compile-time function leaves ([defining variables](https://stylexjs.com/docs/learn/theming/defining-variables/)):

```ts
export const layout = stylex.defineVars({
  "--header-padding-y": "0.625rem",
  "--header-content-height": "2.5rem",
  "--header-border": "1px",
  "--header-height": () =>
    `calc(var(--header-padding-y) * 2 + var(--header-content-height) + var(--header-border))`,
  "--expanded-sidebar-width": "15rem",
  "--side-width": stylex.types.length("0px"),
});
```

Keep `--` prefixes while any CSS island or leftover Tailwind still reads `var(--header-height)` / `var(--side-width)`. After a full cutover, hashed names are fine if every consumer is StyleX.

### Hover/focus expand — StyleX, not a CSS island

Today (`layout.tsx`):

```txt
md:[--side-width:4.0625rem]
has-[.sidebar:hover]:[--side-width:var(--expanded-sidebar-width)]
has-[.sidebar:focus-within]:[--side-width:var(--expanded-sidebar-width)]
```

StyleX pattern: set a `defineVars` token as a **property** on the ancestor ([descendant styles recipe](https://stylexjs.com/docs/learn/recipes/descendant-styles)). For “child hovered → parent var changes”, use `stylex.when.descendant` ([when docs](https://stylexjs.com/docs/api/javascript/when/)) plus a marker on `.sidebar`:

```ts
[layout["--side-width"]]: {
  default: "0px",
  "@media (min-width: 768px)": "4.0625rem",
  [stylex.when.descendant(":hover", sidebarMarker)]: layout["--expanded-sidebar-width"],
  [stylex.when.descendant(":focus-within", sidebarMarker)]: layout["--expanded-sidebar-width"],
}
```

`when.descendant` compiles to `:has()`, which is the same mechanism as the current Tailwind `has-[…]` utilities.

`transitionProperty` is `isString`, so `transitionProperty: "--side-width"` (or the `defineVars` token string) is valid. That replaces `transition: --side-width 200ms ease-out` on `layout-grid-cols`.

Astryx `Theme` owns color mode ([map #64](https://github.com/fringe4life/firstroad/issues/64)). These layout tokens stay app-authored StyleX, not Astryx color tokens.

---

## 4. `@utility` grid helpers — rewrite in `stylex.create`, not an island

Tailwind v4 `@utility` is not a StyleX feature. StyleX styles components, it does not register global utility classes.

| Utility | Current CSS | StyleX |
| --- | --- | --- |
| `max-content-*` | `inline-size: min(100%, --value(--max-content-*))` | `inlineSize: \`min(100%, ${layout["--max-content-narrow"]})\`` (two namespaces, not a splat) |
| `main-grid-rows` | `grid-template-rows: repeat(2, min-content) 1fr` | `gridTemplateRows: "repeat(2, min-content) 1fr"` — defined in `globals.css`, unused in `apps/web/src` today |
| `layout-grid-cols` | `grid-template-columns: var(--side-width) 1fr` + transition | `gridTemplateColumns: \`${layout["--side-width"]} 1fr\`` + `transitionProperty: "--side-width"` on the layout shell |

Consumers today: `layout-grid-cols` on the root layout grid; `max-content-narrow` / `max-content-widest` on tickets, auth, comments, dialogs, skeletons. Those class names go away with Tailwind; the **behavior** moves onto those components.

Do not keep `@utility` in a CSS island “because StyleX cannot do it”. StyleX can do the declarations. The island is only for the two gaps in §1–§2.

---

## 5. What a prototype CSS island should contain

Leave in CSS (stable class names, so React `enter`/`exit` strings keep working):

```css
@keyframes --ticket-card-enter { … }
@keyframes --ticket-card-exit { … }
@keyframes --slide-left { … }
@keyframes --slide-right-skew { … } /* or the fade/slide-to-right mix used today */

::view-transition-old(.ticket-card-exit):only-child { … }
::view-transition-new(.ticket-card-enter):only-child { … }
::view-transition-old(.slide-right-skew):only-child { … }
::view-transition-new(.slide-left):only-child { … }

@keyframes --nav-animation { … }
.nav-scroll {
  animation: --nav-animation linear both;
  animation-timeline: scroll();
  animation-range-start: 100px;
  animation-range-end: 200px;
  transition: border-radius 750ms, translate 250ms ease-out;
}
```

Move to StyleX:

- Theme circle wipe
- Pagination / list-detail slides that are not `:only-child`
- Layout tokens + `@property --side-width` + hover/focus expand
- Grid helpers as component styles
- `@supports (animation-timeline: scroll())` translate on the sidebar

`@theme` / `@layer base` / shadcn color tokens in the same file are out of this ticket (color mode is Astryx `Theme`; other research covers variants).

---

## Sources

- [stylex.viewTransitionClass](https://stylexjs.com/docs/api/javascript/viewTransitionClass) — selector map, React `ViewTransition`, no media queries
- [stylex.keyframes](https://stylexjs.com/docs/api/javascript/keyframes)
- [stylex.defineVars](https://stylexjs.com/docs/api/javascript/defineVars) — `--` keys keep names
- [stylex.types.*](https://stylexjs.com/docs/api/javascript/types) — `@property` from typed vars
- [Defining variables](https://stylexjs.com/docs/learn/theming/defining-variables/) — `@supports`, derived function values, `.stylex.ts` rules
- [Defining styles](https://stylexjs.com/docs/learn/styling-ui/defining-styles) — `@` rules, pseudo-elements, keyframes, longhands
- [Variables for descendant styles](https://stylexjs.com/docs/learn/recipes/descendant-styles) — ancestor sets a token, child consumes it
- [stylex.when.*](https://stylexjs.com/docs/api/javascript/when/) — `when.descendant` / `:has()`
- Compiler: [`stylex-view-transition-class.js`](https://github.com/facebook/stylex/blob/main/packages/@stylexjs/babel-plugin/src/shared/stylex-view-transition-class.js) — `::view-transition-*(*.class){decls}` only
- Compiler: [`stylex-define-vars.js`](https://github.com/facebook/stylex/blob/main/packages/@stylexjs/babel-plugin/src/shared/stylex-define-vars.js) — `@property --name { syntax; inherits: true; initial-value }`
- Allowlist: [`cssProperties.js`](https://github.com/facebook/stylex/blob/main/packages/@stylexjs/eslint-plugin/src/reference/cssProperties.js) — `animationTimeline` yes; `animation` shorthand no; `animationRange*` absent; `clipPath` yes; `transitionProperty` yes
- Live file: `apps/web/src/app/globals.css` (dirty main checkout, 2026-09-09)
- Call sites: `theme-transition.tsx`, `ticket-card.tsx`, `(password)/layout.tsx`, `paginated-transitions.tsx`, `layout.tsx`, `header.tsx`, `sidebar.tsx`
