import { Kanban } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import { homePath } from "@/path";
import AuthNavSkeleton from "./auth-nav-skeleton";
import MobileMenuButton from "./mobile-menu-button";
import AuthNav from "./sidebar/components/auth-nav";

// Cached static shell - header wrapper and logo
// biome-ignore lint/suspicious/useAwait: needed for use cache
const HeaderShell = async ({ children }: { children: React.ReactNode }) => {
  "use cache";
  cacheLife("weeks");

  return (
    <nav className="fixed top-0 right-0 left-0 z-20 flex animate-header-from-top items-center justify-between border-b bg-background/65 px-5 py-2.5 backdrop-blur supports-backdrop-blur:bg-background/60">
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
        <Suspense fallback={<div className="size-10" />}>
          <ThemeSwitcher />
        </Suspense>
        {children}
      </div>
      <div className="flex items-center gap-x-1 md:hidden">
        <Suspense fallback={<div className="size-10" />}>
          <ThemeSwitcher />
        </Suspense>
      </div>
    </nav>
  );
};

const Header = () => (
  <HeaderShell>
    <Suspense fallback={<AuthNavSkeleton />}>
      <AuthNav />
    </Suspense>
  </HeaderShell>
);

export default Header;
