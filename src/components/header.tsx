import { Kanban } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import AuthNavSkeleton from "src/features/auth/components/auth-nav-skeleton";
import { HasAuthSuspense } from "src/features/auth/components/has-auth";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import AccountDropdown from "@/features/auth/components/account-dropwdown";
import MobileMenuButton from "@/features/navigation/components/mobile-menu-button";
import { homePath, signInPath, signUpPath } from "@/path";

const Header = () => (
  <nav className="fixed top-0 right-0 left-0 z-20 grid grid-flow-col items-center justify-between border-b bg-background/65 px-5 py-2.5 backdrop-blur supports-backdrop-blur:bg-background/60">
    <div className="flex items-center gap-x-2">
      <Suspense fallback={<div className="size-10" />}>
        <MobileMenuButton />
      </Suspense>
      <Link
        className={buttonVariants({ variant: "ghost", size: "lg" })}
        href={homePath}
      >
        <Kanban />
        <h1 className="font-semibold text-lg">TicketBounty</h1>
      </Link>
    </div>
    <div className="hidden items-center gap-x-1 md:flex">
      <Suspense fallback={<div className="size-9" />}>
        <ThemeSwitcher />
      </Suspense>
      <HasAuthSuspense fallback={<AuthNavSkeleton />}>
        {(session) => {
          const user = session?.user ?? null;

          if (user) {
            return <AccountDropdown user={user} />;
          }

          return (
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
        }}
      </HasAuthSuspense>
    </div>
    <div className="flex items-center gap-x-1 md:hidden">
      <Suspense fallback={<div className="size-9" />}>
        <ThemeSwitcher />
      </Suspense>
    </div>
  </nav>
);

export default Header;
