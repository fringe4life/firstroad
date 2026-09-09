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
    href: homePath(),
    icon: <LucideLibrary />,
    title: "All Tickets",
  },
  {
    href: ticketsByOrganisationPath(),
    icon: <LucideBookCopy />,
    title: "Our Tickets",
  },
  {
    href: ticketsPath(),
    icon: <LucideBook />,
    title: "My Tickets",
  },
  {
    href: accountProfilePath(),
    icon: <LucideCircleUser />,
    seperator: true,
    title: "Account",
  },
  {
    href: organisationsPath(),
    icon: <LucideUsers />,
    title: "Organisation",
  },
];

export { navItems };
