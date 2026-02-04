"use client";

import {
  useActionState,
  useEffect,
  useEffectEvent,
  useOptimistic,
  useTransition,
} from "react";
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
import { useToggle } from "@/hooks/use-toggle";
import { type ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import {
  ConfirmDialogContext,
  type ConfirmDialogContextValue,
} from "./context";

interface ConfirmDialogProps {
  action: () => Promise<ActionState>;
  children:
    | React.ReactNode
    | ((context: ConfirmDialogContextValue) => React.ReactNode);
  title?: string;
  description?: string;
  closeOnSubmit?: boolean;
  onSuccess?: (result: ActionState) => void;
  onError?: (result: ActionState) => void;
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
  const { isOpen, close } = toggleState;

  // 2. Action state
  const [actionState, formAction, actionIsPending] = useActionState(
    action,
    EMPTY_ACTION_STATE,
  );

  // 3. Transition for optimistic updates
  const [isPending, startTransition] = useTransition();

  // 4. Optimistic dialog state - closes immediately on submit
  const [optimisticIsOpen, setOptimisticIsOpen] = useOptimistic(
    isOpen,
    (_current, newValue: boolean) => newValue,
  );

  // 5. Wrap callbacks in useEffectEvent to avoid dependency issues
  const handleSuccess = useEffectEvent((result: ActionState) => {
    onSuccess?.(result);
    // If not closing on submit, close after success
    if (!closeOnSubmit) {
      close();
    }
  });

  const handleError = useEffectEvent((result: ActionState) => {
    onError?.(result);
    // Note: We don't reopen the dialog on error
    // Error is shown via toast, reopening would be jarring UX
  });

  // 6. Handle success/error - useEffectEvent ensures callbacks are stable
  useEffect(() => {
    if (actionState.status === "SUCCESS") {
      handleSuccess(actionState);
    } else if (actionState.status === "ERROR") {
      handleError(actionState);
    }
  }, [actionState]);

  // 7. Handle optimistic close on form submit
  const handleFormSubmit = () => {
    if (closeOnSubmit) {
      startTransition(() => {
        setOptimisticIsOpen(false);
      });
    }
  };

  // 8. Context value - spread toggle state + add isPending
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

          <Form
            action={formAction}
            onErrorState={handleError}
            onSubmit={handleFormSubmit}
            onSuccessState={handleSuccess}
            state={actionState}
          >
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

export { ConfirmDialog };
