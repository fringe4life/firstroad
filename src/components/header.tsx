import { Kanban } from "lucide-react";
import Link from "next/link";
import { ViewTransition } from "react";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import { AccountDropdown } from "@/features/auth/components/account-dropwdown";
import { AuthNavSkeleton } from "@/features/auth/components/auth-nav-skeleton";
import { HasAuthSuspense } from "@/features/auth/components/has-auth";
import { MobileMenuButton } from "@/features/navigation/components/mobile-menu-button";
import { homePath, signInPath, signUpPath } from "@/path";
import { Suspend } from "./suspend";
import { Skeleton } from "./ui/skeleton";

const Header = () => (
  <nav className="fixed top-0 right-0 left-0 z-20 grid grid-flow-col items-center justify-between border-b bg-background/65 px-5 py-2.5 backdrop-blur supports-backdrop-blur:bg-background/60">
    <div className="flex items-center gap-x-2">
      <Suspend fallback={<Skeleton className="aspect-square w-10" />}>
        <MobileMenuButton />
      </Suspend>
      <Link
        className={buttonVariants({ variant: "ghost", size: "lg" })}
        href={homePath()}
      >
        <Kanban />
        <h1 className="font-semibold text-lg">TicketBounty</h1>
      </Link>
    </div>
    <div className="hidden items-center gap-x-1 md:flex">
      <Suspend fallback={<Skeleton className="aspect-square w-9" />}>
        <ThemeSwitcher />
      </Suspend>

      <HasAuthSuspense fallback={<AuthNavSkeleton />}>
        {(user) => {
          if (user) {
            return (
              <ViewTransition>
                <AccountDropdown user={user} />
              </ViewTransition>
            );
          }

          return (
            <ViewTransition>
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
            </ViewTransition>
          );
        }}
      </HasAuthSuspense>
    </div>
    <div className="flex items-center gap-x-1 md:hidden">
      <Suspend fallback={<Skeleton className="aspect-square w-9" />}>
        <ThemeSwitcher />
      </Suspend>
    </div>
  </nav>
);

export { Header };
