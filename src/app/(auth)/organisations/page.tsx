import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { buttonVariants } from "@/components/ui/button";
import { OrganisationList } from "@/features/organisation/components/organisation-list";
import { onboardingPath } from "@/path";

const OrganisationsPage = () => {
  return (
    <>
      <Heading
        actions={
          <Link className={buttonVariants()} href={onboardingPath()}>
            <LucidePlus className="aspect-square w-4" />
            Create Organisation
          </Link>
        }
        description="All your Organisations"
        title="Organisations"
      />
      <OrganisationList />
    </>
  );
};

export default OrganisationsPage;
