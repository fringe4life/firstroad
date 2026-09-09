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
        <TabsTrigger
          render={<Link href={accountProfilePath()} />}
          value="profile"
        >
          Profile
        </TabsTrigger>
        <TabsTrigger
          render={<Link href={accountPasswordPath()} />}
          value="password"
        >
          Password
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export { AccountTabs };
