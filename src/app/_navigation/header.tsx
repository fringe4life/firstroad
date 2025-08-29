"use client";

import { Kanban, Menu } from "lucide-react";
import Link from "next/link";
import AccountDropdown from "@/app/_navigation/account-dropwdown";
import { useMobileSidebar } from "@/app/_navigation/sidebar/context";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Button, buttonVariants } from "@/components/ui/button";
import useAuth from "@/features/auth/hooks/use-auth";
import { homePath, signInPath, signUpPath } from "@/path";

const Header = () => {
  const { isFetched, user } = useAuth();
  const { open } = useMobileSidebar();

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
      <div className="flex items-center gap-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={open}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
        <Link
          className={buttonVariants({ variant: "ghost", size: "lg" })}
          href={homePath}
        >
          <Kanban />
          <h1 className="font-semibold text-lg">TicketBounty</h1>
        </Link>
      </div>
      <div className="hidden md:flex items-center gap-x-1">
        <ThemeSwitcher />
        {navItems}
      </div>
      <div className="flex md:hidden items-center gap-x-1">
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default Header;
