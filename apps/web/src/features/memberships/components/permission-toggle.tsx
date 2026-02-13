"use client";

import { LucideBan, LucideCheck } from "lucide-react";
import type { SubmitEventHandler } from "react";
import { useActionState, useOptimistic, useTransition } from "react";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import type { ActionState } from "@/utils/to-action-state";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { togglePermission } from "../actions/toggle-permission";
import type { PermissionToggleProps } from "../types";

const PermissionToggle = ({
  memberId,
  organizationId,
  resourceType,
  action,
  permissionValue,
}: PermissionToggleProps) => {
  const [state, formAction] = useActionState(
    async (prevState: ActionState<boolean>, formData: FormData) => {
      const newValue = formData.get("permissionValue") === "true";
      return await togglePermission(
        memberId,
        organizationId,
        resourceType,
        action,
        newValue,
        prevState,
      );
    },
    EMPTY_ACTION_STATE as ActionState<boolean>,
  );

  const [isPending, startTransition] = useTransition();

  const currentValue =
    state.status === "SUCCESS" && typeof state.data === "boolean"
      ? state.data
      : permissionValue;

  const [optimisticValue, setOptimisticValue] = useOptimistic(
    currentValue,
    (_current, newValue: boolean) => newValue,
  );

  const nextValue = !optimisticValue;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("permissionValue", nextValue.toString());

    startTransition(async () => {
      setOptimisticValue(nextValue);
      await formAction(formData);
    });
  };

  return (
    <Form
      action={formAction}
      className={isPending ? "opacity-75" : ""}
      onSubmit={handleSubmit}
      state={state}
    >
      <SubmitButton
        icon={optimisticValue ? <LucideCheck /> : <LucideBan />}
        showLoader={false}
        size="icon"
        variant="ghost"
      />
    </Form>
  );
};

export { PermissionToggle };
