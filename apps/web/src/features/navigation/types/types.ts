import type { Route } from "next";

export interface NavItem {
  title: string;
  icon: React.ReactElement;
  href: Route;
  seperator?: boolean;
}
