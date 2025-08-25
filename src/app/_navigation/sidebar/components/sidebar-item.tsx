import Link from "next/link";
import { cloneElement } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { closedClassName } from "../constants";
import type { NavItem } from "../types";

type SidebarItemProps = {
  isOpen: boolean;
  navItem: NavItem;
  isActive: boolean;
};

const SidebarItem = ({ isOpen, navItem, isActive }: SidebarItemProps) => {
  return (
    <>
      {navItem.seperator && <Separator />}
      <Link
        href={navItem.href}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "group relative flex h-12 justify-start",
          isActive && "bg-muted font-bold hover:bg-muted",
        )}
      >
        {cloneElement(navItem.icon, {
          className: "w-5 aspect-square",
        } as React.HTMLAttributes<HTMLElement>)}
        <span
          className={cn(
            "absolute left-12 text-base duration-200",
            isOpen ? "hidden md:block" : "w-19.5",
            !isOpen && closedClassName,
          )}
        >
          {navItem.title}
        </span>
      </Link>
    </>
  );
};

export default SidebarItem;
