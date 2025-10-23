"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { navItems } from "./constants";

type NavItemsProps = {
  isCollapsed?: boolean;
};

export const NavItems = ({ isCollapsed }: NavItemsProps) => {
  const pathname = usePathname();

  return (
    <>
      {navItems.map((item) => {
        const isAccountItem = item.href.startsWith("/account");
        const isActive = isAccountItem
          ? pathname.startsWith("/account")
          : pathname === item.href;

        return (
          <div key={item.title}>
            {item.seperator && <Separator />}
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "group relative flex h-12 w-full justify-start",
                isActive && "bg-muted font-bold hover:bg-muted",
              )}
              href={item.href}
            >
              {cloneElement(item.icon, {
                className: "w-5 aspect-square",
              } as React.HTMLAttributes<HTMLElement>)}
              <span
                className={cn(
                  "text-base transition-opacity duration-200",
                  isCollapsed
                    ? "absolute left-12 opacity-0 hover:opacity-100 group-hover:opacity-75"
                    : "ml-3 opacity-100",
                )}
              >
                {item.title}
              </span>
            </Link>
          </div>
        );
      })}
    </>
  );
};
