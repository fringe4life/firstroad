import { createContext, use } from "react";
import type { useToggle } from "@/hooks/use-toggle";
import type { Maybe } from "@/types";

// Follow MobileSidebar pattern - extend useToggle return type
type ToggleState = ReturnType<typeof useToggle>;

interface ConfirmDialogContextValue extends ToggleState {
  isPending: boolean;
}

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
export type { ConfirmDialogContextValue };
