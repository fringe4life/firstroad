import { AdminAreaBanner } from "@/features/organisation/components/admin-area-banner";

/**
 * Layout for the organisation admin area.
 * @param children - The child components to render.
 * @param tabs - The tabs to render.
 * @returns The layout for the organisation admin area.
 */
const OrganisationsAdminLayout = ({
  children,
  tabs,
}: LayoutProps<"/organisations/[id]">) => (
  <div className="grid h-full grid-rows-[min-content_1fr] gap-y-8">
    <AdminAreaBanner />
    <div className="grid h-full grid-rows-[min-content_min-content_min-content_1fr] gap-y-8">
      {tabs}
      {children}
    </div>
  </div>
);

export default OrganisationsAdminLayout;
