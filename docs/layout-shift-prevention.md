# Layout Shift Prevention Pattern

This document explains how we prevent Cumulative Layout Shift (CLS) when using React Suspense boundaries and dynamic layouts.

## The Problem

When using `<Suspense fallback={...}>`, React replaces suspended components with fallback UI. If the fallback doesn't match the actual component's dimensions, the layout shifts when the component loads, creating a jarring user experience.

## The Solution: CSS Variables + Dynamic Calculations

CSS variables are parsed and applied by the browser **before React renders**. By defining layout-critical dimensions as CSS variables and using CSS calculations, we can:
- Reserve space even when `fallback={null}` or before components hydrate
- Dynamically adjust layout to prevent content overlap
- Avoid layout shifts during interactive state changes (hover, focus)

## Implementation Patterns

### 1. Define Base CSS Variables in `globals.css`

Define static dimensions in `@theme inline`:

```css
@theme inline {
  /* Layout dimensions - base values */
  --side-width: 0;                    /* Sidebar collapsed width (set at HTML level) */
  --expanded-sidebar-width: 0;        /* Sidebar expanded width (set at HTML level) */
  --auth-nav-width: 10.5rem;          /* Auth navigation width */
  --padding-inline-main: 2rem;        /* Main content horizontal padding */
  --max-content-width: 30rem;         /* Maximum content width */
  --header-height: calc(...);         /* Calculated header height */
}
```

### 2. Dynamic Calculations in `@layer base`

Place reactive calculations in `@layer base` so they update when HTML-level variables change:

```css
@layer base {
  html {
    /* Dynamic sidebar calculations - react to HTML class overrides */
    --sidebar-current-width: max(var(--side-width), var(--expanded-sidebar-width));
    --sidebar-expansion: calc(var(--sidebar-current-width) - var(--side-width));
    
    /* Check if sidebar + content would overflow viewport */
    --main-content-area: calc(var(--max-content-width) + 2 * var(--padding-inline-main));
    --scrollbar-width: 17px;
    --safety-margin: 8px;
    --total-width-needed: calc(
      var(--sidebar-current-width) + 
      var(--main-content-area) + 
      var(--scrollbar-width) + 
      var(--safety-margin) + 
      1px
    );
    --viewport-overflow: calc(var(--total-width-needed) - 100svw);
    
    /* Translation: shift by overflow, capped at sidebar expansion */
    --sidebar-translation: clamp(0px, var(--viewport-overflow), var(--sidebar-expansion));
  }
}
```

### 3. Update Variables at HTML Level for State Changes

Use Tailwind's `has-[]` variant to update variables based on component state:

```tsx
<html
  className="
    md:[--side-width:4.875rem]
    has-[.sidebar:hover]:[--expanded-sidebar-width:15rem]
    has-[.sidebar:focus-within]:[--expanded-sidebar-width:15rem]
  "
>
```

### 4. Create Matching Skeleton Components

Skeletons should use the same CSS variables:

```tsx
const SidebarSkeleton = () => (
  <div className="w-(--side-width) h-screen" />
);
```

### 5. Apply to Suspense Boundaries

```tsx
<Suspense fallback={<SidebarSkeleton />}>
  <Sidebar />
</Suspense>
```

## Current Implementations

### Sidebar with Dynamic Content Translation

**Files**: `src/app/layout.tsx`, `src/app/_navigation/sidebar/components/sidebar.tsx`, `src/app/globals.css`

**CSS Variables**:
- `--side-width: 4.875rem` (collapsed, set at `md:` breakpoint)
- `--expanded-sidebar-width: 15rem` (expanded on hover/focus)
- `--sidebar-current-width: max(var(--side-width), var(--expanded-sidebar-width))`
- `--sidebar-translation: clamp(0px, var(--viewport-overflow), var(--sidebar-expansion))`

**Layout Structure**:
```tsx
<html className="
  md:[--side-width:4.875rem]
  has-[.sidebar:hover]:[--expanded-sidebar-width:15rem]
">
  <div className="group/sidebar-parent grid grid-flow-col grid-cols-[var(--side-width)_1fr]">
    <Suspense fallback={<SidebarSkeleton />}>
      <Sidebar />
    </Suspense>
    <main className="
      col-span-2 md:col-start-2
      transition-transform duration-200
      group-has-[.sidebar:hover]/sidebar-parent:translate-x-(--sidebar-translation)
    ">
      {children}
    </main>
  </div>
</html>
```

**Sidebar Component**: Uses `position: fixed` with dynamic width
```tsx
<nav className="
  sidebar
  fixed top-(--header-height) left-0
  w-(--sidebar-current-width)
  transition-all duration-200
  md:block hidden
" />
```

**Key Features**:
- ✅ No layout shift on Suspense load
- ✅ No content overlap when sidebar expands
- ✅ Smooth translation only when needed (viewport overflow)
- ✅ CSS-driven calculations (no JavaScript)

### Header AuthNav (Auth Buttons)

**File**: `src/app/_navigation/header.tsx`

**CSS Variable**: `--auth-nav-width: 10.5rem`

**Skeleton**: Empty div reserving horizontal space
```tsx
<Suspense fallback={<AuthNavSkeleton />}>
  <AuthNav />
</Suspense>
```

### Spinner (Content Areas)

**File**: `src/components/spinner.tsx`

**Pattern**: Uses `flex-1` to match parent container dimensions
```tsx
const Spinner = () => (
  <div className="flex flex-1 items-center justify-center">
    <LoaderCircle className="size-10 animate-spin" />
  </div>
);
```

**Usage**: Works automatically when parent has `flex flex-1`
```tsx
<div className="flex flex-1 flex-col">
  <Suspense fallback={<Spinner />}>
    <Content />
  </Suspense>
</div>
```

## Why This Works

### CSS Variables vs Tailwind Classes

**Tailwind Classes** (e.g., `w-19.5`):
- ❌ Compiled to CSS at build time
- ❌ Only apply when component renders
- ❌ Disappear with `fallback={null}`

**CSS Variables** (e.g., `w-(--side-width)`):
- ✅ Available in CSS cascade immediately
- ✅ Work before JavaScript/React loads
- ✅ Persist even with empty fallbacks
- ✅ Can be dynamically calculated in CSS
- ✅ Update reactively when overridden at HTML level

### The @theme vs @layer base Pattern

**Variables in `@theme inline`** (static base values):
- Set initial values (often 0 for dynamic dimensions)
- Define at md: breakpoint for responsive behavior
- Provide fallback values

**Calculations in `@layer base html`** (reactive calculations):
- Re-evaluate when HTML-level variables change
- Use `max()`, `min()`, `calc()`, `clamp()` for dynamic values
- React to state changes via `has-[]` at HTML level

**Example**:
```css
/* Static base (doesn't react) */
@theme inline {
  --side-width: 0;
}

/* Reactive calculations (re-evaluate on HTML class changes) */
@layer base {
  html {
    --sidebar-current-width: max(var(--side-width), var(--expanded-sidebar-width));
  }
}
```

When HTML gets `md:[--side-width:4.875rem]` or `has-[.sidebar:hover]:[--expanded-sidebar-width:15rem]`, the calculations in `@layer base` automatically update.

### SSR and Hydration Benefits

1. **Server-Side Rendering**: CSS variables ensure SSR HTML has correct dimensions
2. **Hydration**: No mismatch between server and client layouts
3. **Selective Hydration**: Layout remains stable even with lazy hydration
4. **State Changes**: Layout adjusts without JavaScript (pure CSS)

## Best Practices

### When to Use This Pattern

Use CSS variables for:
- ✅ Layout-critical components (sidebars, headers, footers)
- ✅ Fixed-dimension UI elements
- ✅ Components with `fallback={null}`
- ✅ Elements affecting document flow
- ✅ Interactive elements that change dimensions (expandable sidebars)
- ✅ Preventing content overlap on state changes

### When NOT to Use

Skip this pattern for:
- ❌ Inline content that flows naturally
- ❌ Dynamic content with unknown dimensions
- ❌ Components that don't affect layout (modals, tooltips)

### Additional Techniques

1. **Use `flex-1` for content areas** - Automatically matches parent dimensions
2. **Explicit dimensions for media** - Always set width/height on images/video
3. **Reserve space for dynamic content** - Use `min-height`/`min-width`
4. **Match skeleton animations** - Use CSS animations, not JavaScript
5. **Use `position: fixed` for sticky components** - Prevents scroll-induced layout shifts
6. **Calculate overflow with `clamp()`** - Conditional translations without JavaScript
7. **Add safety margins** - Account for scrollbar width and sub-pixel rendering

## Advanced Pattern: Dynamic Content Translation

### Problem

When an element (like a sidebar) expands, it may overlap content if there isn't enough viewport space.

### Solution

Calculate if content would overflow and translate it only when necessary:

```css
/* 1. Calculate how much space is needed */
--total-width-needed: calc(
  var(--sidebar-current-width) + 
  var(--max-content-width) + 
  2 * var(--padding-inline-main) + 
  var(--scrollbar-width) +
  var(--safety-margin)
);

/* 2. Check if viewport is too small */
--viewport-overflow: calc(var(--total-width-needed) - 100svw);

/* 3. Translate only if overflow, capped at sidebar expansion */
--sidebar-translation: clamp(0px, var(--viewport-overflow), var(--sidebar-expansion));
```

**Key insight**: `clamp(0px, overflow, max)` naturally creates a conditional:
- If `overflow < 0` (fits): translation = 0px
- If `overflow > max` (extreme): translation = max
- Otherwise: translation = overflow amount

### Implementation

Apply translation to content using `group-has-[]`:

```tsx
<div className="group/sidebar-parent">
  <nav className="sidebar" /> {/* has hover state */}
  <main className="
    transition-transform
    group-has-[.sidebar:hover]/sidebar-parent:translate-x-(--sidebar-translation)
  " />
</div>
```

### Benefits

- ✅ No JavaScript required
- ✅ Smooth transitions with CSS
- ✅ Responsive to any viewport size
- ✅ Works with browser zoom
- ✅ Accounts for scrollbar width

## Performance Benefits

1. **Zero CLS**: No Cumulative Layout Shift in Core Web Vitals
2. **Instant Stability**: Users see stable layouts immediately
3. **Smooth Transitions**: No jarring jumps during loading or state changes
4. **Better UX**: Perceived performance improvement
5. **No JavaScript Overhead**: CSS variables are resolved during style computation (before rendering)
6. **GPU Acceleration**: `transform` property triggers GPU compositing (smooth 60fps)
7. **Fewer Reflows**: Fixed positioning + transforms avoid expensive layout recalculations

**Note on CSS Variables and GPU**: CSS variables themselves don't affect GPU acceleration—they're resolved during the computed value phase before rendering. It's the `transform` property that triggers GPU compositing. Using `transform: translateX(var(--sidebar-translation))` is just as GPU-accelerated as `transform: translateX(10px)` because the browser resolves the variable first, then the compositor handles the transform.

## Common Pitfalls

### ❌ Variables in @theme Don't React to HTML Changes

```css
/* WRONG - won't update when HTML classes change */
@theme inline {
  --sidebar-current-width: max(var(--side-width), var(--expanded-sidebar-width));
}
```

**Why**: `@theme` variables are static and evaluated once at build time.

**Fix**: Move to `@layer base html` for reactive calculations.

### ❌ Using overflow-x-hidden Creates Unwanted Scrollbar

```tsx
<main className="overflow-x-hidden"> {/* Creates scroll container */}
```

**Fix**: Use `overflow-x-clip` instead - clips without creating scroll container.

### ❌ Forgetting Safety Margins

Pure calculations may fail due to:
- Scrollbar width (~17px)
- Browser rounding differences
- Zoom levels
- Sub-pixel rendering

**Fix**: Add explicit safety margin (8px recommended).

### ❌ Using peer When Not Siblings

```tsx
/* WRONG - peer only works for siblings */
<div>
  <nav className="sidebar peer" />
  <div>
    <main className="peer-hover:..." /> {/* Won't work! */}
  </div>
</div>
```

**Fix**: Use `group-has-[]` pattern for parent-child relationships.

## Related Concepts

- **React Suspense**: Declarative loading states
- **CSS Cascade**: How CSS variables work independently of React
- **CSS Containment**: Layout isolation and performance
- **GPU Compositing**: Hardware-accelerated transforms
- **Tailwind CSS has-[] variant**: State-based styling without JavaScript
- **CSS clamp()**: Responsive values with min/max bounds

## References

- [Web.dev: Optimize CLS](https://web.dev/articles/optimize-cls)
- [React Docs: Suspense](https://react.dev/reference/react/Suspense)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [CSS clamp() (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [Tailwind CSS Arbitrary Values](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)
- [CSS Transforms and Performance](https://web.dev/articles/animations-guide)

