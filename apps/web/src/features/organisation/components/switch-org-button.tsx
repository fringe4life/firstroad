"use client";

import { LucideArrowLeftRight } from "lucide-react";
import type { SubmitEventHandler } from "react";
import { useActionState, useOptimistic, useTransition } from "react";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import type { ActionState } from "@/utils/to-action-state";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { setActiveOrganisation } from "../actions/set-active-organisation";
import type { SwitchOrgButtonProps } from "../types";

const SwitchOrgButton = ({
  organizationId,
  isActive,
}: SwitchOrgButtonProps) => {
  // 1. useActionState first to get action result
  const [state, action] = useActionState(
    async (prevState: ActionState<string>) => {
      return await setActiveOrganisation(organizationId, prevState);
    },
    EMPTY_ACTION_STATE as ActionState<string>,
  );

  const [isPending, startTransition] = useTransition();

  // 2. Derive current value from action state if success, otherwise from prop
  const currentIsActive =
    state.status === "SUCCESS" && typeof state.data === "string"
      ? state.data === organizationId
      : isActive;

  // 3. useOptimistic uses the derived current value
  const [optimisticIsActive, setOptimisticIsActive] = useOptimistic(
    currentIsActive,
    (_current, newValue: boolean) => newValue,
  );

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    startTransition(async () => {
      setOptimisticIsActive(true);
      await action();
    });
  };

  return (
    <Form
      action={action}
      className={isPending ? "opacity-75" : ""}
      onSubmit={handleSubmit}
      state={state}
    >
      <SubmitButton
        disabled={optimisticIsActive}
        icon={<LucideArrowLeftRight />}
        showLoader={false}
        size="icon"
        variant="outline"
      />
    </Form>
  );
};

export { SwitchOrgButton };
