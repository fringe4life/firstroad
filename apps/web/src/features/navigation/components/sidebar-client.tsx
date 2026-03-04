"use client";

import { Kanban } from "lucide-react";
import { Activity } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMobileSidebar } from "@/features/navigation/context/context";

const SidebarClient = ({ children }: { children: React.ReactNode }) => {
  const { value: isOpen, close } = useMobileSidebar();
  return (
    <Activity mode={isOpen ? "visible" : "hidden"}>
      <Sheet onOpenChange={close} open={isOpen}>
        <SheetContent className="w-full max-w-84 p-0 md:hidden" side="left">
          <SheetHeader className="ml-11 flex items-center gap-x-2 border-b px-6 py-4.5">
            <Kanban className="aspect-square w-4" />
            <SheetTitle className="font-medium xs:font-semibold text-base xs:text-lg">
              FirstTicket
            </SheetTitle>
          </SheetHeader>
          <nav
            aria-label="Mobile navigation"
            className="space-y-2 px-3 py-2 landscape:space-x-2"
          >
            {children}
          </nav>
        </SheetContent>
      </Sheet>
    </Activity>
  );
};

export { SidebarClient };
