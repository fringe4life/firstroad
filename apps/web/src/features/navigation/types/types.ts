import type { Route } from "next";
import type { IsActive } from "@/types";

export interface NavItemElement {
  href: Route;
  icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  seperator?: boolean;
  title: string;
}

export interface NavItemProps extends IsActive {
  close: () => void;
  item: NavItemElement;
}
