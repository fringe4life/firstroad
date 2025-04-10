import { Kanban } from "lucide-react";
import Link from "next/link";
import { homePath, ticketsPath } from "@/path";
import { ThemeSwitcher } from "./theme/theme-switcher";
import { buttonVariants } from "./ui/button";

const Header = () => {
  return (
    <nav className="flex justify-between items-center supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/65 backdrop-blur w-full  ">
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
        <Link
          className={buttonVariants({ variant: "default" })}
          href={ticketsPath()}
        >
          Tickets
        </Link>
      </div>
    </nav>
  );
};

export default Header;
