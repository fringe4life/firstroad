import {
  LucideBook,
  LucideCircleUser,
  LucideLibrary,
  LucideUsers,
} from "lucide-react";
import { accountProfilePath, homePath, organisationsPath } from "@/path";
import { createTicketScopeLink } from "@/utils/typed-links";
import type { NavItem } from "../types/types";

// Create typed links for ticket scope navigation
const allTicketsLink = createTicketScopeLink(homePath);
const myTicketsLink = createTicketScopeLink(homePath);

const navItems: NavItem[] = [
  {
    title: "All Tickets",
    icon: <LucideLibrary />,
    href: allTicketsLink({ scope: "all" }),
  },
  {
    title: "My Tickets",
    icon: <LucideBook />,
    href: myTicketsLink({ scope: "mine" }),
  },
  {
    seperator: true,
    title: "Account",
    icon: <LucideCircleUser />,
    href: accountProfilePath,
  },
  {
    title: "Organisation",
    icon: <LucideUsers />,
    href: organisationsPath,
  },
];

const closedClassName =
  "text-background opacity-0 transition-all duration-300 group-hover:z-40 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100";
export { navItems, closedClassName };
