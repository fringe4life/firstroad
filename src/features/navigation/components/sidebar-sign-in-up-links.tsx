"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { signInPath, signUpPath } from "@/path";
import { useMobileSidebar } from "../context/context";

const SidebarSignInUpLinks = () => {
  const { close } = useMobileSidebar();

  return (
    <>
      <Separator />
      <div className="grid gap-2">
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "relative flex h-12 w-full justify-start",
          )}
          href={signUpPath()}
          onNavigate={close}
        >
          Sign Up
        </Link>
        <Link
          className={cn(
            buttonVariants({ variant: "default" }),
            "relative flex h-12 w-full justify-start",
          )}
          href={signInPath()}
          onNavigate={close}
        >
          Sign In
        </Link>
      </div>
    </>
  );
};

export { SidebarSignInUpLinks };
