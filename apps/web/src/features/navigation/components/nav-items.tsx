"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { navItems } from "@/features/navigation/components/constants";
import { cn } from "@/lib/utils";
import { useMobileSidebar } from "../context/context";

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
            {item.seperator ? <Separator /> : null}
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "relative flex h-12 w-full justify-start",
                isActive && "bg-primary/50 font-bold",
              )}
              href={item.href}
              onNavigate={close}
            >
              {cloneElement(item.icon, {
                className: "w-5 aspect-square",
              })}
              <span className="absolute left-14 text-base opacity-75 transition-opacity duration-200 focus-within:opacity-100 hover:opacity-100 focus-visible:opacity-100 md:opacity-0 md:group-focus-visible:opacity-75 md:group-hover:opacity-75 md:group-focus-within:opacity-75">
                {item.title}
              </span>
            </Link>
          </div>
        );
      })}
    </>
  );
};
export { NavItems };
