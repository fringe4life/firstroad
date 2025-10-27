import { Kanban } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import AuthNav from "src/features/auth/components/auth-nav";
import AuthNavSkeleton from "src/features/auth/components/auth-nav-skeleton";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import MobileMenuButton from "@/features/navigation/components/mobile-menu-button";
import { homePath } from "@/path";

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
      <Suspense fallback={<AuthNavSkeleton />}>
        <AuthNav />
      </Suspense>
    </div>
    <div className="flex items-center gap-x-1 md:hidden">
      <Suspense fallback={<div className="size-9" />}>
        <ThemeSwitcher />
      </Suspense>
    </div>
  </nav>
);

export default Header;
