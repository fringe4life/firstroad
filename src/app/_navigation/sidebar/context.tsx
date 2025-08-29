"use client";

import { createContext, use } from "react";
import { useToggle } from "@/hooks/use-toggle";

type MobileSidebarContextType = ReturnType<typeof useToggle>;

const MobileSidebarContext = createContext<MobileSidebarContextType | null>(
  null,
);

export function MobileSidebarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggleState = useToggle(false);

  return (
    <MobileSidebarContext value={toggleState}>
      {children}
    </MobileSidebarContext>
  );
}

export function useMobileSidebar() {
  const context = use(MobileSidebarContext);
  if (!context) {
    throw new Error(
      "useMobileSidebar must be used within MobileSidebarProvider",
    );
  }
  return context;
}
