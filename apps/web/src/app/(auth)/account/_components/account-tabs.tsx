"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { accountPasswordPath, accountProfilePath } from "@/path";

const AccountTabs = () => {
  const pathname = usePathname();

  return (
    <Tabs className="justify-self-start" value={pathname.split("/").at(-1)}>
      <TabsList>
        <TabsTrigger asChild value="profile">
          <Link href={accountProfilePath()}>Profile</Link>
        </TabsTrigger>
        <TabsTrigger asChild value="password">
          <Link href={accountPasswordPath()}>Password</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export { AccountTabs };
