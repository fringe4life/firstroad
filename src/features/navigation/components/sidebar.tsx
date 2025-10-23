import { cacheLife } from "next/cache";
import { Suspense } from "react";
import AuthSection from "@/features/auth/components/auth-section";
import { NavItems } from "./nav-items";
import { SidebarClient } from "./sidebar-client";

// Cached static shell - desktop sidebar wrapper
// biome-ignore lint/suspicious/useAwait: needed for use cache
const SidebarShell = async ({ children }: { children: React.ReactNode }) => {
  "use cache";
  cacheLife("weeks");

  return (
    <nav
      aria-label="Main navigation"
      aria-live="polite"
      className="sidebar group peer/sidebar fixed top-(--header-height) bottom-0 left-0 z-20 hidden w-(--sidebar-current-width) border-r px-3 py-2 transition-all duration-200 md:block"
    >
      <div className="space-y-2">{children}</div>
    </nav>
  );
};

const Sidebar = () => (
  <>
    {/* Desktop sidebar - uses CSS peer hover for expansion */}
    <SidebarShell>
      <Suspense fallback={<div className="h-8" />}>
        <NavItems isCollapsed />
      </Suspense>
    </SidebarShell>

    {/* Mobile sidebar - Sheet with context-based state */}
    <SidebarClient authSection={<AuthSection />} />
  </>
);

export default Sidebar;
