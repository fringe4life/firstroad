"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { navItems } from "./constants";

export const NavItems = () => {
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
                "relative flex h-12 w-full justify-start",
                isActive && "bg-muted font-bold hover:bg-muted-foreground",
              )}
              href={item.href}
            >
              {cloneElement(item.icon, {
                className: "w-5 aspect-square",
              } as React.HTMLAttributes<HTMLElement>)}
              <span className="absolute left-12 text-base opacity-0 transition-opacity duration-200 hover:opacity-100 group-has-[.sidebar:focus-within]/sidebar-parent:opacity-75 group-has-[.sidebar:hover]/sidebar-parent:opacity-75">
                {item.title}
              </span>
            </Link>
          </div>
        );
      })}
    </>
  );
};
