"use client";

import { useOptimistic, useTransition } from "react";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActionStateWithFeedback } from "@/hooks/use-action-state-with-feedback";
import { useToggle } from "@/hooks/use-toggle";
import { type ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { ConfirmDialogContext } from "./context";
import type { ConfirmDialogContextValue } from "./types";

interface ConfirmDialogProps {
  action: (
    prevState?: ActionState,
    formData?: FormData,
  ) => Promise<ActionState>;
  children:
    | React.ReactNode
    | ((context: ConfirmDialogContextValue) => React.ReactNode);
  closeOnSubmit?: boolean;
  description?: string;
  onError?: (result: ActionState) => void;
  onSuccess?: (result: ActionState) => void;
  title?: string;
}

const ConfirmDialog = ({
  action,
  children,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Make sure you understand the consequences.",
  closeOnSubmit = true,
  onSuccess,
  onError,
}: ConfirmDialogProps) => {
  // 1. Use toggle hook (same pattern as MobileSidebarProvider)
  const toggleState = useToggle(false);
  const { value: isOpen, close } = toggleState;

  // 2. Action state
  const [_actionState, formAction, actionIsPending] =
    useActionStateWithFeedback(action, EMPTY_ACTION_STATE, {
      onSuccess: (result) => {
        onSuccess?.(result);
        if (!closeOnSubmit) {
          close();
        }
      },
      onError: (result) => {
        onError?.(result);
      },
    });

  // 3. Transition for optimistic updates
  const [isPending, startTransition] = useTransition();

  // 4. Optimistic dialog state - closes immediately on submit
  const [optimisticIsOpen, setOptimisticIsOpen] = useOptimistic(
    isOpen,
    (_current, newValue: boolean) => newValue,
  );

  // 5. Handle optimistic close on form submit
  const handleFormSubmit = () => {
    if (closeOnSubmit) {
      startTransition(() => {
        setOptimisticIsOpen(false);
      });
    }
  };

  // 6. Context value - spread toggle state + add isPending
  const contextValue: ConfirmDialogContextValue = {
    ...toggleState,
    isPending: isPending || actionIsPending,
  };

  return (
    <ConfirmDialogContext value={contextValue}>
      {typeof children === "function" ? children(contextValue) : children}

      <Dialog onOpenChange={close} open={optimisticIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <Form action={formAction} onSubmit={handleFormSubmit}>
            <DialogFooter>
              <Button onClick={close} type="button" variant="outline">
                Cancel
              </Button>
              <SubmitButton label="Confirm" />
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </ConfirmDialogContext>
  );
};

export { ConfirmDialog as Root };
