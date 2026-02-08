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
            {Boolean(item.seperator) && <Separator />}
            <Link
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "relative flex h-12 w-full justify-start",
                Boolean(isActive) &&
                  "bg-muted font-bold hover:bg-muted-foreground",
              )}
              href={item.href}
              onNavigate={close}
            >
              {cloneElement(item.icon, {
                className: "w-5 aspect-square",
              } as React.HTMLAttributes<HTMLElement>)}
              <span className="absolute left-14 text-base opacity-75 transition-opacity duration-200 hover:opacity-100 md:opacity-0 md:group-hover:opacity-75">
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
