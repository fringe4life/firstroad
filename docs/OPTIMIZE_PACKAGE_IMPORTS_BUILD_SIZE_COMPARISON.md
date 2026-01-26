# optimizePackageImports Build Size Comparison

## Overview

This document compares build sizes and performance metrics for Next.js builds with and without `optimizePackageImports: ["valibot"]` enabled. The analysis is based on actual build measurements and research from the Next.js team and community.

## Test Configuration

- **Next.js Version**: 16.1.4 (Turbopack, Cache Components)
- **Package Tested**: `valibot`
- **Build Environment**: Production build (`next build`)
- **Date**: January 24, 2026

## Build Size Results

### With `optimizePackageImports: ["valibot"]` Enabled

```
Total .next directory:     62M
Client-side chunks:        3.2M (JS + CSS)
Server-side chunks:        9.7M
Valibot server chunks:     2.9M
Total JS/CSS files:        353 files
Client JS chunks:          52 files
```

### Without `optimizePackageImports` (Baseline)

```
Total .next directory:     62M
Client-side chunks:        3.2M (JS + CSS)
Server-side chunks:        9.7M
Valibot server chunks:     2.9M
Total JS/CSS files:        353 files
Client JS chunks:          52 files
```

### Size Comparison Summary

| Metric | With Optimization | Without Optimization | Difference |
|--------|-------------------|----------------------|------------|
| Total .next | 62M | 62M | **0%** (no change) |
| Client chunks | 3.2M | 3.2M | **0%** (no change) |
| Server chunks | 9.7M | 9.7M | **0%** (no change) |
| Valibot chunks | 2.9M | 2.9M | **0%** (no change) |

## Analysis

### Why No Measurable Difference?

The build sizes were **identical** in both configurations. This can be explained by several factors:

1. **Server-Side Only Usage**: Valibot is used exclusively in server actions and server-side code in this codebase:
   - `src/features/ticket/actions/upsert-ticket.ts`
   - `src/features/password/actions/*.ts`
   - `src/features/comment/actions/upsert-comment.ts`
   - `src/features/organisation/actions/create-organisation.ts`
   - `src/lib/env.ts`
   - `src/utils/to-action-state.ts`
   - Various event handlers

2. **No Client-Side Bundles**: Since valibot is not imported in any client components (`"use client"`), it doesn't appear in client-side bundles where `optimizePackageImports` would have the most impact.

3. **Already Optimized**: Modern bundlers (including Turbopack) may already be effectively tree-shaking valibot's barrel file exports at the server-side level.

4. **Small Package Size**: Valibot is already a relatively small package (~11kB gzipped), so the optimization impact may be minimal even if applied.

### Valibot Usage Pattern

All valibot imports in this codebase use **named imports from the barrel file**:

```typescript
import {
  maxLength,
  minLength,
  object,
  pipe,
  safeParse,
  string,
} from "valibot";
```

This is the exact pattern that `optimizePackageImports` is designed to optimize, but since these are server-side only, the optimization doesn't affect client bundle size.

## General Performance Benchmarks (from Vercel)

According to [Vercel's official benchmarks](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js), `optimizePackageImports` provides significant improvements for packages with barrel files:

### Overall Improvements
- **40% faster cold boots** in serverless environments
- **28% faster production builds**
- **15-70% faster local development** (depending on library)

### Library-Specific Examples

| Library | Before | After | Improvement |
|---------|--------|-------|-------------|
| `lucide-react` | 5.8s (1583 modules) | 3.0s (333 modules) | **-48%** |
| `@mui/material` | 7.1s (2225 modules) | 2.9s (735 modules) | **-59%** |
| `@material-ui/icons` | 10.2s (11738 modules) | 2.9s (632 modules) | **-72%** |
| `@tabler/icons-react` | 4.5s (4998 modules) | 3.9s (349 modules) | **-13%** |

## Valibot Barrel File Context

### Known Issues

Valibot has a [known barrel file issue (GitHub #425)](https://github.com/fabian-hiller/valibot/issues/425) that was raised in February 2024:

- Valibot uses barrel files that re-export all modules from a single entry point
- This requires the entire module graph to be built during tree-shaking analysis
- Loading from CDN (esm.sh, jsdelivr) loads the entire ~11kB gzipped package
- Bundle size analysis tools like bundlephobia have difficulty measuring actual size

### Why optimizePackageImports Helps

The `optimizePackageImports` feature:
- Automatically analyzes barrel files and maps imports to direct module paths
- Skips the barrel file entirely, preventing loading of unnecessary modules
- Works recursively for nested barrel files
- Is cheaper than tree-shaking since it only scans entry barrel files

## Recommendations

### For This Codebase

1. **Keep `optimizePackageImports: ["valibot"]` Enabled**
   - No negative impact (build sizes identical)
   - Potential future benefits if valibot is used client-side
   - Aligns with Next.js best practices for packages with barrel files
   - Minimal configuration overhead

2. **Monitor for Client-Side Usage**
   - If valibot is ever imported in client components, the optimization will provide immediate benefits
   - Consider adding ESLint rule to prevent barrel file imports: [`eslint-plugin-canonical/no-barrel-import`](https://github.com/gajus/eslint-plugin-canonical#no-barrel-import)

### General Recommendations

1. **Enable for Known Barrel File Packages**
   - Add packages with confirmed barrel file issues to `optimizePackageImports`
   - Check package documentation or GitHub issues for barrel file mentions

2. **Test with Bundle Analyzer**
   - Use `@next/bundle-analyzer` to visualize actual bundle composition
   - Compare before/after for client-side bundles specifically

3. **Focus on Client-Side Impact**
   - `optimizePackageImports` has the most impact on client-side bundles
   - Server-side code may already be optimized by the bundler

## Conclusion

While the build size comparison showed **no measurable difference** for this specific codebase, this is expected because:

1. Valibot is used exclusively server-side
2. `optimizePackageImports` primarily optimizes client-side bundles
3. The package is already relatively small

However, keeping the optimization enabled is still recommended because:
- It has no negative impact
- It provides benefits if valibot is ever used client-side
- It aligns with Next.js best practices
- General benchmarks show significant improvements for packages with barrel files

The feature remains **experimental** but is widely used and recommended by the Next.js team for packages with barrel file issues.

## References

- [Next.js optimizePackageImports Documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports)
- [Vercel Blog: How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
- [Valibot GitHub Issue #425: Avoid barrel files](https://github.com/fabian-hiller/valibot/issues/425)
- [Marvin Hagemeister: The barrel file debacle](https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-7/)
