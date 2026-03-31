"use client";

import { usePathname } from "next/navigation";
import { navItems } from "@/features/navigation/components/constants";
import { useMobileSidebar } from "../context/context";
import { NavItem } from "./nav-item";

const NavItems = () => {
  const pathname = usePathname();
  const { close } = useMobileSidebar();

  return (
    <>
      {navItems.map((item) => {
        const isAccountItem = item.href.startsWith("/account");
        const isActive = isAccountItem
          ? pathname.startsWith("/account")
          : pathname === item.href;

        return (
          <div key={item.title}>
            <NavItem close={close} isActive={isActive} item={item} />
          </div>
        );
      })}
    </>
  );
};

export { NavItems };
