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
  <Breadcrumb className="min-w-0 overflow-hidden">
    <BreadcrumbList>
      {breadcrumbs.map((breadcrumb, index) => {
        let breadcrumbItem = (
          <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
        );

        if (breadcrumb.href) {
          breadcrumbItem = (
            <BreadcrumbLink asChild>
              <Link className="inline-block" href={breadcrumb.href}>
                {breadcrumb.title}
              </Link>
            </BreadcrumbLink>
          );
        }

        return (
          <Fragment key={`${breadcrumb.title}-${index}`}>
            <BreadcrumbItem>{breadcrumbItem}</BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator>
                <LucideSlash className="h-4 shrink-0" />
              </BreadcrumbSeparator>
            )}
          </Fragment>
        );
      })}
    </BreadcrumbList>
  </Breadcrumb>
);

export { Breadcrumbs };
