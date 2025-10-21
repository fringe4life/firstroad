# Layout Shift Prevention Pattern

This document explains how we prevent Cumulative Layout Shift (CLS) when using React Suspense boundaries.

## The Problem

When using `<Suspense fallback={...}>`, React replaces suspended components with fallback UI. If the fallback doesn't match the actual component's dimensions, the layout shifts when the component loads, creating a jarring user experience.

## The Solution: CSS Variables

CSS variables are parsed and applied by the browser **before React renders**. By defining layout-critical dimensions as CSS variables, we can reserve space even when `fallback={null}` or before components hydrate.

## Implementation Pattern

### 1. Define CSS Variables in `globals.css`

```css
:root {
  /* Layout-critical dimensions */
  --side-width: 4.875rem;        /* Sidebar collapsed width */
  --auth-nav-width: 10.5rem;     /* Auth navigation width */
  --header-height: 6rem;         /* Header height */
}
```

### 2. Use Variables in Tailwind Classes

Use arbitrary values to reference CSS variables:

```tsx
<nav className="w-(--side-width) h-screen" />
```

### 3. Create Matching Skeleton Components

Skeletons should use the same CSS variables:

```tsx
const SidebarSkeleton = () => (
  <div className="w-(--side-width) h-screen" />
);
```

### 4. Apply to Suspense Boundaries

```tsx
<Suspense fallback={<SidebarSkeleton />}>
  <Sidebar />
</Suspense>
```

## Current Implementations

### Sidebar (Layout Component)

**File**: `src/app/layout.tsx`

**CSS Variable**: `--side-width: 4.875rem`

**Skeleton**: Empty div matching width and height
```tsx
<Suspense fallback={<SidebarSkeleton />}>
  <Sidebar />
</Suspense>
```

**Component**: Uses `w-[var(--side-width)]` when collapsed
```tsx
<nav className={cn(
  "hidden h-screen border-r md:block",
  isOpen ? "w-60" : "w-(--side-width)"
)} />
```

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

**CSS Variables** (e.g., `w-[var(--side-width)]`):
- ✅ Available in CSS cascade immediately
- ✅ Work before JavaScript/React loads
- ✅ Persist even with empty fallbacks

### SSR and Hydration Benefits

1. **Server-Side Rendering**: CSS variables ensure SSR HTML has correct dimensions
2. **Hydration**: No mismatch between server and client layouts
3. **Selective Hydration**: Layout remains stable even with lazy hydration

## Best Practices

### When to Use This Pattern

Use CSS variables for:
- ✅ Layout-critical components (sidebars, headers, footers)
- ✅ Fixed-dimension UI elements
- ✅ Components with `fallback={null}`
- ✅ Elements affecting document flow

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

## Performance Benefits

1. **Zero CLS**: No Cumulative Layout Shift in Core Web Vitals
2. **Instant Stability**: Users see stable layouts immediately
3. **Smooth Transitions**: No jarring jumps during loading
4. **Better UX**: Perceived performance improvement

## Related Concepts

- **React Suspense**: Declarative loading states
- **React Activity**: Selective hydration and visibility control
- **ViewTransition**: Animated transitions between states
- **CSS Cascade**: How CSS variables work independently of React

## References

- [Web.dev: Optimize CLS](https://web.dev/articles/optimize-cls)
- [React Docs: Suspense](https://react.dev/reference/react/Suspense)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

