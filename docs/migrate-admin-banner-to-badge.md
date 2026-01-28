# Migration Guide: Admin Area Banner to Badge Component

## Context

The admin area banner was initially implemented using custom Tailwind styling due to security constraints preventing the installation of shadcn's Badge component. Once shadcn is updated and security issues are resolved, migrate to the proper Badge component for better maintainability.

## Current Implementation

**File:** `src/features/organisation/components/admin-area-banner.tsx`

```tsx
import { ShieldCheck } from "lucide-react";

const AdminAreaBanner = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 pt-6">
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-amber-900 text-sm dark:text-amber-100">
            You're in the Admin Area
          </p>
          <p className="text-amber-700 text-xs dark:text-amber-300">
            Managing organizations requires admin privileges
          </p>
        </div>
      </div>
    </div>
  );
};

export { AdminAreaBanner };
```

## Migration Steps

### Step 1: Install Badge Component

Once security issues are resolved, install the Badge component:

```bash
npx shadcn@latest add badge
```

### Step 2: Create Custom Badge Variant (Option A - Recommended)

If you want to use the Badge component semantically, extend it with a custom variant:

**Update:** `src/components/ui/badge.tsx` (after installation)

Add a new variant to the badge variants:

```tsx
const badgeVariants = cva(
  // ... existing code
  {
    variants: {
      variant: {
        // ... existing variants
        admin: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100",
      },
    },
  }
);
```

**Update:** `src/features/organisation/components/admin-area-banner.tsx`

```tsx
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AdminAreaBanner = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 pt-6">
      <Badge variant="admin" className="flex items-start gap-3 rounded-lg px-4 py-3 w-full">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-sm">
            You're in the Admin Area
          </p>
          <p className="text-xs opacity-90">
            Managing organizations requires admin privileges
          </p>
        </div>
      </Badge>
    </div>
  );
};

export { AdminAreaBanner };
```

### Step 3: Alternative Approach (Option B - Use Alert Component)

If you prefer semantic alert-style components, consider using the Alert component instead:

```bash
npx shadcn@latest add alert
```

**Update:** `src/features/organisation/components/admin-area-banner.tsx`

```tsx
import { ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminAreaBanner = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-8 pt-6">
      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30">
        <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-900 dark:text-amber-100">
          You're in the Admin Area
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          Managing organizations requires admin privileges
        </AlertDescription>
      </Alert>
    </div>
  );
};

export { AdminAreaBanner };
```

## Design Tokens to Preserve

Ensure these color values are maintained for consistency:

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| Background | `bg-amber-50` | `bg-amber-950/30` |
| Border | `border-amber-200` | `border-amber-900/50` |
| Text (Title) | `text-amber-900` | `text-amber-100` |
| Text (Description) | `text-amber-700` | `text-amber-300` |
| Icon | `text-amber-600` | `text-amber-400` |

## Testing Checklist

After migration:

- [ ] Banner appears on `/organisations` page
- [ ] Banner appears on all `/organisations/[id]/(admin)/*` routes
- [ ] Colors match the original design in light mode
- [ ] Colors match the original design in dark mode
- [ ] Shield icon is properly aligned
- [ ] Text hierarchy is maintained (title bold, description muted)
- [ ] Responsive layout works on mobile devices
- [ ] No console errors or warnings

## Recommendation

**Option A (Badge variant)** is recommended if you want a lightweight, badge-style component with custom styling.

**Option B (Alert component)** is recommended if you want semantic HTML and built-in accessibility features for notification/informational messages.

Both options will provide better maintainability than the current custom implementation while preserving the exact visual design.
