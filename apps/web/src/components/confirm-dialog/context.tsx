import { createContext, use } from "react";
import type { Maybe } from "@/types";
import type { ConfirmDialogContextValue } from "./types";

// Follow MobileSidebar pattern - extend useToggle return type

const ConfirmDialogContext =
  createContext<Maybe<ConfirmDialogContextValue>>(null);

const useConfirmDialogContext = () => {
  const context = use(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      "useConfirmDialogContext must be used within ConfirmDialog",
    );
  }
  return context;
};

export { ConfirmDialogContext, useConfirmDialogContext };
