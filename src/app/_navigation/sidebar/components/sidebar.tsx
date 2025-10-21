import AuthSection from "./auth-section";
import { NavItems } from "./nav-items";
import { SidebarClient } from "./sidebar-client";

const Sidebar = () => (
  <>
    {/* Desktop sidebar - uses CSS peer hover for expansion */}
    <nav
      aria-label="Main navigation"
      aria-live="polite"
      className="sidebar group peer/sidebar z-20 mt-(--header-height) hidden h-screen w-(--sidebar-current-width) border-r px-3 py-2 transition-all duration-200 md:block"
    >
      <div className="space-y-2">
        <NavItems isCollapsed />
      </div>
    </nav>

    {/* Mobile sidebar - Sheet with context-based state */}
    <SidebarClient authSection={<AuthSection />} />
  </>
);

export default Sidebar;
