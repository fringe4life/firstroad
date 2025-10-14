import { Kanban } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Spinner from "@/components/spinner";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { buttonVariants } from "@/components/ui/button";
import { homePath } from "@/path";
import MobileMenuButton from "./mobile-menu-button";
import AuthNav from "./sidebar/components/auth-nav";

// biome-ignore lint/suspicious/useAwait: "needed for 'use cache'"
const HeaderContent = async () => {
  "use cache";
  return (
    <div className="flex items-center gap-x-2">
      <MobileMenuButton />
      <Link
        className={buttonVariants({ variant: "ghost", size: "lg" })}
        href={homePath}
      >
        <Kanban />
        <h1 className="font-semibold text-lg">TicketBounty</h1>
      </Link>
    </div>
  );
};

const Header = () => (
  <nav className="fixed top-0 right-0 left-0 z-20 flex w-full animate-header-from-top items-center justify-between border-b bg-background/65 px-5 py-2.5 backdrop-blur supports-backdrop-blur:bg-background/60">
    <HeaderContent />
    <div className="hidden items-center gap-x-1 md:flex">
      <ThemeSwitcher />
      <Suspense fallback={<Spinner />}>
        <AuthNav />
      </Suspense>
    </div>
    <div className="flex items-center gap-x-1 md:hidden">
      <ThemeSwitcher />
    </div>
  </nav>
);

export default Header;
