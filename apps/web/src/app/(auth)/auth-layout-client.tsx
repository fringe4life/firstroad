"use client";

import { usePathname } from "next/navigation";
import { ClientRedirect } from "@/components/client-redirect";
import { RedirectToast } from "@/components/redirect-toast";
import { selectActiveOrganisationPath } from "@/path";

const SELECT_ACTIVE_ORG_PATH = selectActiveOrganisationPath();

export function AuthLayoutClient({
  hasActiveOrg,
  children,
}: {
  hasActiveOrg: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (!hasActiveOrg && pathname !== SELECT_ACTIVE_ORG_PATH) {
    return <ClientRedirect to={SELECT_ACTIVE_ORG_PATH} />;
  }

  return (
    <>
      {children}
      <RedirectToast />
    </>
  );
}
