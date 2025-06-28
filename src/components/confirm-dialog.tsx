"use client";

import { cloneElement, useActionState, useState } from "react";
import {
  ActionState,
  EMPTY_ACTION_STATE,
} from "../features/utils/to-action-state";
import Form from "./form/form";
import SubmitButton from "./form/SubmitButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type UseConfirmDialogProps = {
  action: () => Promise<ActionState>;
  trigger: React.ReactElement;
  title?: string;
  description?: string;
};

const useConfirmDialog = ({
  action,
  trigger,
  title = "Are you absolutely sure?",
  description = `This action cannot be undone. Make sure you understand the consequence
            account and remove your data from our servers.`,
}: UseConfirmDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogTrigger = cloneElement(trigger, {
    onClick: () => setIsOpen((prevOpen) => !prevOpen),
  });

  const handleSuccess = () => {
    setIsOpen(false);
  };

  const [actionState, formAction] = useActionState(action, EMPTY_ACTION_STATE);
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
            >
              <SubmitButton label="Confirm" />
            </Form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
  return [dialogTrigger, dialog];
};

export default useConfirmDialog;
