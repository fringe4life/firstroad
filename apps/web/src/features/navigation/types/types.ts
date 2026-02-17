import type { Route } from "next";

export interface NavItem {
  href: Route;
  icon: React.ReactElement;
  seperator?: boolean;
  title: string;
}
