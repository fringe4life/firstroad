"use client";

import { cloneElement, useActionState, useEffect, useState } from "react";
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
import {
  type ActionState,
  EMPTY_ACTION_STATE,
} from "@/features/utils/to-action-state";

type UseConfirmDialogProps = {
  action: () => Promise<ActionState>;
  trigger: React.ReactElement | ((isPending: boolean) => React.ReactElement);
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

  // Handle both React element and callback function triggers
  const getTriggerElement = (isPending: boolean) => {
    const triggerElement =
      typeof trigger === "function" ? trigger(isPending) : trigger;
    return cloneElement(triggerElement, {
      onClick: () => setIsOpen((prevOpen) => !prevOpen),
    } as React.HTMLAttributes<HTMLElement>);
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

  // Track isPending changes and call onIsPending callback
  useEffect(() => {
    console.log("🔧 useConfirmDialog - isPending changed to:", isPending);
    console.log("🔧 useConfirmDialog - actionState:", actionState);

    // Close dialog when action starts (isPending becomes true) if closeOnSubmit is true
    if (isPending && closeOnSubmit) {
      setIsOpen(false);
    }

    onIsPending?.(isPending);

    // Cleanup function to handle component unmount (e.g., redirects)
    return () => {
      console.log("🧹 useConfirmDialog - Component unmounting, cleaning up");
      // If component unmounts while action is pending, we should clean up any ongoing operations
      // This prevents memory leaks and ensures toasts are properly dismissed
      if (isPending) {
        console.log(
          "🧹 useConfirmDialog - Action was pending, triggering cleanup",
        );
        // Call onIsPending with false to signal cleanup
        onIsPending?.(false);
      }
    };
  }, [isPending, onIsPending, actionState, closeOnSubmit]);

  const dialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
              state={actionState}
              onSuccessState={handleSuccess}
              onErrorState={handleError}
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
