import Link from "next/link";
import { cloneElement } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { NavItemProps } from "../types/types";

const NavItem = ({ item, isActive, close }: NavItemProps) => (
  <>
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
      <span className="absolute left-14 text-base transition-opacity duration-200 focus-within:opacity-100 hover:opacity-100 focus-visible:opacity-100 md:opacity-0 md:group-focus-visible:opacity-75 md:group-hover:opacity-75 md:group-focus-within:opacity-75">
        {item.title}
      </span>
    </Link>
  </>
);

export { NavItem };
