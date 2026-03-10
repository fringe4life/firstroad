import type { Route } from "next";

export interface NavItem {
  href: Route;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  seperator?: boolean;
  title: string;
}
