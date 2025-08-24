"use client";

import { Kanban } from "lucide-react";
import Link from "next/link";
import useAuth from "@/features/auth/hooks/use-auth";
import AccountDropdown from "@/app/_navigation/account-dropwdown";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { buttonVariants } from "@/components/ui/button";


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
        href="/sign-up"
      >
        Sign Up
      </Link>
      <Link
        className={buttonVariants({ variant: "default" })}
        href="/sign-in"
      >
        Sign In
      </Link>
    </>
  );
  return (
    <nav className="animate-header-from-top px-5 py-2.5 flex justify-between items-center supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/65 backdrop-blur w-full  ">
      <div>
        <Link
          className={buttonVariants({ variant: "ghost", size: "lg" })}
          href="/"
        >
          <Kanban />
          <h1 className="text-lg font-semibold">TicketBounty</h1>
        </Link>
      </div>
      <div className="flex gap-x-1 items-center">
        <ThemeSwitcher />
        {navItems}
      </div>
    </nav>
  );
};

export default Header;
