"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { invitationsPath, membershipsPath } from "@/path";

const AdminTabs = () => {
  const pathname = usePathname();
  const params = useParams();
  const organizationId = params.id as string;

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
