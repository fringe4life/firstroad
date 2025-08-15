"use client";

import { Kanban, LucideLogOut } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/features/auth/actions/signout";
import useAuth from "@/features/auth/hooks/get-auth";
import { homePath, signInPath, signUpPath, ticketsPath } from "@/path";
import SubmitButton from "./form/SubmitButton";
import { ThemeSwitcher } from "./theme/theme-switcher";
import { buttonVariants } from "./ui/button";
const Header = () => {
  const { isFetched, user } = useAuth();

  if (!isFetched) return null;
  const navItems = user ? (
    <>
      <Link
        className={buttonVariants({ variant: "default" })}
        href={ticketsPath()}
      >
        Tickets
      </Link>
      <form action={signOutAction}>
        <SubmitButton label="Sign Out" icon={<LucideLogOut />} />
      </form>
    </>
  ) : (
    <>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={signUpPath()}
      >
        Sign Up
      </Link>
      <Link
        className={buttonVariants({ variant: "default" })}
        href={signInPath()}
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
          href={homePath()}
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
