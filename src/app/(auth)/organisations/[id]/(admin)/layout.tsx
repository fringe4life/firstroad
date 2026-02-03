import { AdminAreaBanner } from "@/features/organisation/components/admin-area-banner";

const OrganisationsLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="grid h-full grid-rows-[min-content_1fr] gap-y-8">
    <AdminAreaBanner />
    <div className="grid h-full grid-rows-[min-content_min-content_min-content_1fr] gap-y-8">
      {children}
    </div>
  </div>
);

export default OrganisationsLayout;
