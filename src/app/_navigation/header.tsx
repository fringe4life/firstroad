"use client";

import { Kanban } from "lucide-react";
import Link from "next/link";
import AccountDropdown from "@/app/_navigation/account-dropwdown";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import useAuth from "@/features/auth/hooks/use-auth";
import { homePath, signInPath, signUpPath } from "@/path";

export const dynamic = "force-dynamic";

const Header = () => {
  const { isFetched, user } = useAuth();

  if (!isFetched) return null;

  const navItems = user ? (
    <AccountDropdown user={user} />
  ) : (
    <>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={signUpPath}
      >
        Sign Up
      </Link>
      <Link
        className={buttonVariants({ variant: "default" })}
        href={signInPath}
      >
        Sign In
      </Link>
    </>
  );
  return (
    <nav className="fixed top-0 right-0 left-0 z-20 flex w-full animate-header-from-top items-center justify-between border-b bg-background/65 px-5 py-2.5 backdrop-blur supports-backdrop-blur:bg-background/60">
      <div>
        <Link
          className={buttonVariants({ variant: "ghost", size: "lg" })}
          href={homePath}
        >
          <Kanban />
          <h1 className="font-semibold text-lg">TicketBounty</h1>
        </Link>
      </div>
      <div className="flex items-center gap-x-1">
        <ThemeSwitcher />
        {navItems}
      </div>
    </nav>
  );
};

export default Header;
