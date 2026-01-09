import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Heading } from "@/components/heading";
import { Spinner } from "@/components/spinner";
import { buttonVariants } from "@/components/ui/button";
import { Organisations } from "@/features/organisation/components/organisations";
import { onboardingPath } from "@/path";

const OrganisationsPage = () => {
  return (
    <div className="grid h-full grid-rows-[min-content_min-content_1fr] gap-y-8">
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
      <Suspense fallback={<Spinner />}>
        <Organisations />
      </Suspense>
    </div>
  );
};

export default OrganisationsPage;
