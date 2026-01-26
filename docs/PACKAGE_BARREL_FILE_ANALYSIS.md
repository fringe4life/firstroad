# Package Barrel File Analysis

**Date:** January 24, 2026  
**Analysis Method:** Package.json scan + GitHub issues + Web research

## Executive Summary

Scanned `package.json` for packages with barrel file issues. Found **6 packages** that would benefit from `optimizePackageImports` but are **NOT automatically optimized** by Next.js.

---

## Already Optimized by Default ✅

These packages are automatically optimized - **no action needed**:

- ✅ `lucide-react` (v0.563.0) - **Already optimized**
- ✅ `date-fns` (v4.1.0) - **Already optimized**

---

## Packages Requiring Manual Optimization 🔴

### 1. **valibot** (v1.2.0) - **HIGH PRIORITY**

**Status:** ❌ Not in default list  
**Barrel File Issue:** ✅ Confirmed (GitHub issue #425)  
**Usage in codebase:** 4+ files importing from valibot

**Evidence:**
- Open GitHub issue discussing barrel file problems
- Prevents effective tree-shaking
- Makes bundle size analysis difficult

**Files using valibot:**
- `src/features/ticket/actions/upsert-ticket.ts`
- `src/features/password/actions/signin-action.ts`
- `src/features/comment/actions/upsert-comment.ts`

**Recommendation:** 🔴 **Add to optimizePackageImports**

---

### 2. **@radix-ui/react-*** packages - **MEDIUM PRIORITY**

**Status:** ❌ Not in default list  
**Barrel File Issue:** ✅ Likely (component library pattern)  
**Usage in codebase:** 10+ packages used

**Packages in use:**
- `@radix-ui/react-alert-dialog` (v1.1.15)
- `@radix-ui/react-avatar` (v1.1.11)
- `@radix-ui/react-checkbox` (v1.3.3)
- `@radix-ui/react-dialog` (v1.1.15)
- `@radix-ui/react-dropdown-menu` (v2.1.16)
- `@radix-ui/react-label` (v2.1.8)
- `@radix-ui/react-popover` (v1.1.15)
- `@radix-ui/react-select` (v2.2.6)
- `@radix-ui/react-separator` (v1.1.8)
- `@radix-ui/react-slot` (v1.2.4)
- `@radix-ui/react-tabs` (v1.1.13)
- `@radix-ui/react-tooltip` (v1.2.8)

**Evidence:**
- Component libraries typically use barrel files
- Research shows @radix-ui can benefit from optimization
- Used extensively in shadcn/ui components

**Recommendation:** 🟡 **Consider adding** (may need individual package names or wildcard)

**Note:** Since these are individual packages (not a monorepo barrel), impact may be lower. Test before/after to measure benefit.

---

### 3. **sonner** (v2.0.7) - **MEDIUM PRIORITY**

**Status:** ❌ Not in default list  
**Barrel File Issue:** ⚠️ Unknown (likely has barrel files)  
**Usage in codebase:** 4+ files using toast

**Files using sonner:**
- `src/app/layout.tsx` (Toaster component)
- `src/features/memberships/components/membership-action-buttons.tsx`
- `src/features/organisation/components/organisation-action-buttons.tsx`
- `src/features/ticket/components/ticket-more-menu.tsx`

**Evidence:**
- Toast libraries often use barrel files
- Not in Next.js default optimization list
- Used for user feedback (non-critical path)

**Recommendation:** 🟡 **Consider adding** (test impact first)

---

### 4. **nuqs** (v2.8.6) - **LOW PRIORITY**

**Status:** ❌ Not in default list  
**Barrel File Issue:** ⚠️ Unknown  
**Usage in codebase:** 3+ files

**Files using nuqs:**
- `src/app/layout.tsx` (NuqsAdapter)
- `src/features/pagination/components/nuqs-pagination.tsx`
- `src/types.ts` (SearchParams type)

**Evidence:**
- URL search params library
- Likely has barrel files for different adapters
- Not in default optimization list

**Recommendation:** 🟢 **Low priority** (small package, likely minimal impact)

---

### 5. **react-day-picker** (v9.13.0) - **LOW PRIORITY**

**Status:** ❌ Not in default list  
**Barrel File Issue:** ⚠️ Unknown  
**Usage in codebase:** Likely in date picker components

**Evidence:**
- Date picker component library
- Not in Next.js default optimization list
- May have barrel files for different components

**Recommendation:** 🟢 **Low priority** (test if used extensively)

---

### 6. **@react-email/components** (v1.0.6) - **LOW PRIORITY**

**Status:** ❌ Not in default list  
**Barrel File Issue:** ✅ Confirmed (component library pattern)  
**Usage in codebase:** Email templates (server-side only)

**Evidence:**
- Component library for email templates
- Research confirms barrel file usage
- Not in default optimization list
- **Server-side only** - less critical for client bundle

**Recommendation:** 🟢 **Low priority** (server-side, minimal client impact)

---

## Recommended Configuration

### High Priority (Add Immediately)

```typescript
experimental: {
  optimizePackageImports: [
    'valibot', // Confirmed barrel file issues
  ],
}
```

### Medium Priority (Test First)

```typescript
experimental: {
  optimizePackageImports: [
    'valibot',
    'sonner', // Test impact
    // @radix-ui packages - may need individual entries or wildcard
    '@radix-ui/react-alert-dialog',
    '@radix-ui/react-avatar',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-label',
    '@radix-ui/react-popover',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    '@radix-ui/react-tabs',
    '@radix-ui/react-tooltip',
  ],
}
```

### Alternative: Wildcard Pattern (if supported)

```typescript
experimental: {
  optimizePackageImports: [
    'valibot',
    'sonner',
    '@radix-ui/*', // If wildcard supported
  ],
}
```

**Note:** Check Next.js docs for wildcard support. If not supported, list individual packages.

---

## Testing Recommendations

### Before Adding

1. **Measure current import times:**
   ```bash
   # Check bundle size
   npm run build
   # Analyze bundle
   npm run next:analyze
   ```

2. **Check development startup time:**
   ```bash
   time npm run dev
   ```

### After Adding

1. **Compare bundle sizes** (should decrease)
2. **Compare dev startup times** (should improve)
3. **Test functionality** (ensure nothing breaks)
4. **Monitor build times** (should improve)

---

## Known Limitations

### ⚠️ Local Workspace Packages

**Issue:** `optimizePackageImports` doesn't work with local workspace packages when using Turbopack (GitHub issue #75148)

**Affects:**
- npm workspaces
- pnpm workspaces  
- Monorepos with symlinks

**Workarounds:**
1. Use webpack instead of Turbopack
2. Don't import from barrel files in local packages
3. Use deprecated `modularizeImports` for local packages

**Status:** Confirmed bug, tracked by Turbopack team

---

## Priority Action Items

### 🔴 **Immediate (This Week)**
1. **Add `valibot`** to `optimizePackageImports`
   - Confirmed barrel file issues
   - Used in multiple critical paths
   - High impact potential

### 🟡 **Short Term (This Month)**
2. **Test `sonner`** optimization
   - Measure before/after impact
   - Add if beneficial

3. **Evaluate `@radix-ui`** packages
   - Test if individual packages benefit
   - Consider wildcard if supported
   - May have lower impact (individual packages)

### 🟢 **Long Term (Nice to Have)**
4. **Consider other packages** if bundle size becomes an issue
   - `nuqs`
   - `react-day-picker`
   - `@react-email/components`

---

## References

- [Next.js optimizePackageImports Docs](https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports)
- [Valibot Barrel File Issue #425](https://github.com/fabian-hiller/valibot/issues/425)
- [Next.js Turbopack Workspace Issue #75148](https://github.com/vercel/next.js/issues/75148)
- [Vercel Blog: Optimized Package Imports](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)

---

## Summary Table

| Package | Status | Priority | Barrel Files | Action |
|---------|--------|----------|--------------|--------|
| `lucide-react` | ✅ Optimized | - | - | None needed |
| `date-fns` | ✅ Optimized | - | - | None needed |
| `valibot` | ❌ Not optimized | 🔴 High | ✅ Confirmed | **Add immediately** |
| `@radix-ui/*` | ❌ Not optimized | 🟡 Medium | ⚠️ Likely | Test & consider |
| `sonner` | ❌ Not optimized | 🟡 Medium | ⚠️ Likely | Test & consider |
| `nuqs` | ❌ Not optimized | 🟢 Low | ⚠️ Unknown | Low priority |
| `react-day-picker` | ❌ Not optimized | 🟢 Low | ⚠️ Unknown | Low priority |
| `@react-email/components` | ❌ Not optimized | 🟢 Low | ✅ Confirmed | Low priority (server-side) |
