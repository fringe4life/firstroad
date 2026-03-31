import {
  LucideBook,
  LucideBookCopy,
  LucideCircleUser,
  LucideLibrary,
  LucideUsers,
} from "lucide-react";
import {
  accountProfilePath,
  homePath,
  organisationsPath,
  ticketsByOrganisationPath,
  ticketsPath,
} from "@/path";
import type { NavItemElement } from "../types/types";

const navItems: NavItemElement[] = [
  {
    title: "All Tickets",
    icon: <LucideLibrary />,
    href: homePath(),
  },
  {
    title: "Our Tickets",
    icon: <LucideBookCopy />,
    href: ticketsByOrganisationPath(),
  },
  {
    title: "My Tickets",
    icon: <LucideBook />,
    href: ticketsPath(),
  },
  {
    seperator: true,
    title: "Account",
    icon: <LucideCircleUser />,
    href: accountProfilePath(),
  },
  {
    title: "Organisation",
    icon: <LucideUsers />,
    href: organisationsPath(),
  },
];

const closedClassName =
  "text-background opacity-0 transition-all duration-300 group-hover:z-40 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100";

export { closedClassName, navItems };
