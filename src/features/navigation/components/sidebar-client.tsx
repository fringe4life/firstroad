"use client";

import type { ReactNode } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMobileSidebar } from "../context/context";
import { NavItems } from "./nav-items";

type SidebarClientProps = {
  authSection: ReactNode;
};

export const SidebarClient = ({ authSection }: SidebarClientProps) => {
  const { isOpen, close } = useMobileSidebar();

  return (
    <Sheet onOpenChange={close} open={isOpen}>
      <SheetContent className="w-80 p-0 md:hidden" side="left">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile navigation" className="space-y-2 px-3 py-2">
          <NavItems />
          {authSection}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
