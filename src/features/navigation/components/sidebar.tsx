import { Suspense } from "react";
import AuthSection from "@/features/auth/components/auth-section";
import { NavItems } from "./nav-items";
import { SidebarClient } from "./sidebar-client";

const Sidebar = () => (
  <>
    {/* Desktop sidebar - uses CSS peer hover for expansion */}
    <nav
      aria-label="Main navigation"
      aria-live="polite"
      className="sidebar group peer/sidebar fixed top-(--header-height) bottom-0 left-0 z-20 hidden w-(--sidebar-current-width) border-r px-3 py-2 transition-all duration-200 md:block"
    >
      <div className="space-y-2">
        <Suspense fallback={<div className="h-8" />}>
          <NavItems />
        </Suspense>
      </div>
    </nav>

    {/* Mobile sidebar - Sheet with context-based state */}
    <SidebarClient authSection={<AuthSection />} />
  </>
);

export default Sidebar;
