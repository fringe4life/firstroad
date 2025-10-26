import { LucideBook, LucideCircleUser, LucideLibrary } from "lucide-react";
import { createTicketScopeLink } from "src/utils/typed-links";
import { accountProfilePath, homePath } from "@/path";
import type { NavItem } from "../types/types";

// Create typed links for ticket scope navigation
const allTicketsLink = createTicketScopeLink(homePath);
const myTicketsLink = createTicketScopeLink(homePath);

export const navItems: NavItem[] = [
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
];

export const closedClassName =
  "text-background opacity-0 transition-all duration-300 group-hover:z-40 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100";
