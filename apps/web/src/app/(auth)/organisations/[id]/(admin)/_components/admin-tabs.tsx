"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { invitationsPath, membershipsPath } from "@/path";

interface AdminTabsProps {
  organizationId: string;
}

const AdminTabs = ({ organizationId }: AdminTabsProps) => {
  const pathname = usePathname();

  return (
    <Tabs className="justify-self-start" value={pathname.split("/").at(-1)}>
      <TabsList>
        <TabsTrigger asChild value="memberships">
          <Link href={membershipsPath(organizationId)}>Members</Link>
        </TabsTrigger>
        <TabsTrigger asChild value="invitations">
          <Link href={invitationsPath(organizationId)}>Invitations</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export { AdminTabs };
