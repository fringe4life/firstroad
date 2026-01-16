import { Suspend } from "@/components/suspend";
import { Skeleton } from "@/components/ui/skeleton";
import { NavItems } from "@/features/navigation/components/nav-items";
import { SidebarClient } from "./sidebar-client";

const Sidebar = () => (
  <>
    {/* Desktop sidebar - uses CSS peer hover for expansion */}
    <nav
      aria-label="Main navigation"
      aria-live="polite"
      className="sidebar fixed top-(--header-height) bottom-0 left-0 z-20 hidden w-(--side-width) overflow-x-clip border-r px-3 py-2 transition-all duration-200 hover:w-(--expanded-sidebar-width) md:block"
    >
      <div className="grid gap-y-2">
        <Suspend fallback={<Skeleton className="h-8" />}>
          <NavItems />
        </Suspend>
      </div>
    </nav>

    {/* Mobile sidebar - Sheet with context-based state */}
    <SidebarClient />
  </>
);

export { Sidebar };
