"use cache: remote";
import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { ResponsiveLabel } from "@/components/responsive-label";
import { buttonVariants } from "@/components/ui/button";
import { organisationsCreatePath } from "@/path";

const OrganisationsHeading = async () => (
  <Heading
    actions={
      <ResponsiveLabel
        fullLabel="Create Organisation"
        icon={<LucidePlus className="aspect-square w-4" />}
        shortLabel="Create"
      >
        <Link className={buttonVariants()} href={organisationsCreatePath()} />
      </ResponsiveLabel>
    }
    description="All your Organisations"
    title="Organisations"
  />
);

export { OrganisationsHeading };
