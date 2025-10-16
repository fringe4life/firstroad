"use client";

import { useActionState, useEffect, useEffectEvent, useState } from "react";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type ActionState, EMPTY_ACTION_STATE } from "@/utils/to-action-state";

type UseConfirmDialogProps = {
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
};

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
  const [isOpen, setIsOpen] = useState(false);

  // Render prop pattern: pass onClick and isPending to the trigger function
  const getTriggerElement = (isPendingArg: boolean) => {
    const handleClick = () => setIsOpen((prevOpen) => !prevOpen);
    return trigger({ isPending: isPendingArg, onClick: handleClick });
  };

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

  // Track isPending changes and call onIsPending callback
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffectEvent functions don't need to be in dependency array
  useEffect(() => {
    // Close dialog when action starts (isPending becomes true) if closeOnSubmit is true
    if (isPending && closeOnSubmit) {
      setIsOpen(false);
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
  }, [isPending, closeOnSubmit]); // ✅ onIsPending no longer in dependencies

  const dialog = (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Form
              action={formAction}
              onErrorState={handleError}
              onSuccessState={handleSuccess}
              state={actionState}
            >
              <SubmitButton label="Confirm" />
            </Form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // Return a function that takes isPending to render the trigger, and the dialog
  return [getTriggerElement, dialog, isPending] as const;
};

export default useConfirmDialog;
