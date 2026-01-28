import { AdminAreaBanner } from "@/features/organisation/components/admin-area-banner";

const OrganisationsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid gap-y-8">
      <AdminAreaBanner />
      {children}
    </div>
  );
};

export default OrganisationsLayout;
