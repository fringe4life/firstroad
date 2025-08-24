
import type { Route } from "next";
import type { NavItem } from "./types";
import { LucideBook, LucideCircleUser, LucideLibrary } from "lucide-react";


export const navItems: NavItem[] = [
    {
        title: 'All Tickets',
        icon: <LucideLibrary />,
        href: "/" as Route
    },
    {
        title: 'My Tickets',
        icon: <LucideBook />,
        href: "/tickets" as Route
    },
    {
        seperator: true,
        title: 'Account',
        icon: <LucideCircleUser />,
        href: "/account" as Route
    }
]

export const closedClassName = 'text-background opacity-0 transition-all duration-300 group-hover:z-40 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100'