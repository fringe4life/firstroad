import type { Route } from "next";

export type NavItem = {
  title: string;
  icon: React.ReactElement;
  href: Route;
  seperator?: boolean;
};
