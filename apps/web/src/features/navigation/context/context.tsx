"use client";

import { createContext, use } from "react";
import { useToggle } from "@/hooks/use-toggle";
import type { Maybe } from "@/types";

type MobileSidebarContextType = ReturnType<typeof useToggle>;

const MobileSidebarContext =
  createContext<Maybe<MobileSidebarContextType>>(null);

export const MobileSidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const toggleState = useToggle(false);

  return (
    <MobileSidebarContext value={toggleState}>{children}</MobileSidebarContext>
  );
};

export const useMobileSidebar = () => {
  const context = use(MobileSidebarContext);
  if (!context) {
    throw new Error(
      "useMobileSidebar must be used within MobileSidebarProvider",
    );
  }
  return context;
};
