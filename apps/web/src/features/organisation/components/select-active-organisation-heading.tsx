"use cache: remote";
import { LucidePlus } from "lucide-react";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { ResponsiveLabel } from "@/components/responsive-label";
import { buttonVariants } from "@/components/ui/button";
import { onboardingPath } from "@/path";

const SelectActiveOrganisationHeading = async () => (
  <Heading
    actions={
      <ResponsiveLabel
        fullLabel="Create Organisation"
        icon={<LucidePlus className="aspect-square w-4" />}
        shortLabel="Create"
      >
        <Link className={buttonVariants()} href={onboardingPath()} />
      </ResponsiveLabel>
    }
    description="Select your active organisation"
    title="Select Active Organisation"
  />
);

export { SelectActiveOrganisationHeading };
