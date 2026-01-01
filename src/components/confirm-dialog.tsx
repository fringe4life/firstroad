"use client";

import { useActionState, useEffect, useEffectEvent } from "react";
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

interface UseConfirmDialogProps {
  action: () => Promise<ActionState>;
  trigger: (props: {
    isPending: boolean;
    onClick: () => void;
  }) => React.ReactElement;
  title?: string;
  description?: string;
  closeOnSubmit?: boolean; // Optional flag to close dialog immediately on submit
  onSuccess?: (result: ActionState) => void;
  onError?: (result: ActionState) => void;
  onIsPending?: (isPending: boolean) => void;
}

const useConfirmDialog = ({
  action,
  trigger,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. Make sure you understand the consequences.",
  closeOnSubmit = false, // Default to false for backward compatibility
  onSuccess,
  onError,
  onIsPending,
}: UseConfirmDialogProps) => {
  const { isOpen, toggle, close } = useToggle(false);

  // Render prop pattern: pass onClick and isPending to the trigger function
  const getTriggerElement = (isPendingArg: boolean) =>
    trigger({ isPending: isPendingArg, onClick: toggle });

  const handleSuccess = (result: ActionState) => {
    onSuccess?.(result);
  };

  const handleError = (result: ActionState) => {
    onError?.(result);
  };

  const [actionState, formAction, isPending] = useActionState(
    action,
    EMPTY_ACTION_STATE,
  );

  // Wrap callback in useEffectEvent to prevent effect re-runs when it changes
  const handleIsPending = useEffectEvent((pending: boolean) => {
    onIsPending?.(pending);
  });

  const handleClose = useEffectEvent(() => {
    close();
  });

  // Track isPending changes and call onIsPending callback

  useEffect(() => {
    // Close dialog when action starts (isPending becomes true) if closeOnSubmit is true
    if (isPending && closeOnSubmit) {
      handleClose();
    }

    handleIsPending(isPending);

    // Cleanup function to handle component unmount (e.g., redirects)
    return () => {
      // If component unmounts while action is pending, we should clean up any ongoing operations
      // This prevents memory leaks and ensures toasts are properly dismissed
      if (isPending) {
        // Call onIsPending with false to signal cleanup
        handleIsPending(false);
      }
    };
  }, [isPending, closeOnSubmit]);

  const dialog = (
    <Dialog onOpenChange={close} open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={close} variant="outline">
            Cancel
          </Button>
          <Form
            action={formAction}
            onErrorState={handleError}
            onSuccessState={handleSuccess}
            state={actionState}
          >
            <SubmitButton label="Confirm" />
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Return a function that takes isPending to render the trigger, and the dialog
  return [getTriggerElement, dialog, isPending] as const;
};

export { useConfirmDialog };
