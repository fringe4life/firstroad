import { LucideSlash } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface BreadcrumbItemProps {
  title: string;
  href?: Route;
}

interface BreadcrumbsProps<T> {
  breadcrumbs: T[];
}

const Breadcrumbs = <T extends BreadcrumbItemProps>({
  breadcrumbs,
}: BreadcrumbsProps<T>) => (
  <Breadcrumb className="self-start">
    <BreadcrumbList>
      {breadcrumbs.map((breadcrumb, index) => {
        let breadcrumbItem = (
          <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
        );

        if (breadcrumb.href) {
          breadcrumbItem = (
            <BreadcrumbLink asChild>
              <Link className="flex items-center gap-1" href={breadcrumb.href}>
                {breadcrumb.title}
              </Link>
            </BreadcrumbLink>
          );
        }

        return (
          <Fragment key={breadcrumb.title}>
            <BreadcrumbItem>{breadcrumbItem}</BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator>
                <LucideSlash className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </Fragment>
        );
      })}
    </BreadcrumbList>
  </Breadcrumb>
);

export { Breadcrumbs };
