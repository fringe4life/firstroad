"use client";

import { LucideArrowLeftRight } from "lucide-react";
import { useActionState, useOptimistic, useTransition } from "react";
import { Form } from "@/components/form/form";
import { Button } from "@/components/ui/button";
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

  const currentIsActive =
    state.status === "SUCCESS" && typeof state.data === "string"
      ? state.data === organizationId
      : isActive;

  const [optimisticIsActive, setOptimisticIsActive] = useOptimistic(
    currentIsActive,
    (_current, newValue: boolean) => newValue,
  );

  const handleClick = () => {
    startTransition(async () => {
      setOptimisticIsActive(true);
      await action();
    });
  };

  return (
    <Form className={isPending ? "opacity-75" : ""} state={state}>
      <Button
        disabled={optimisticIsActive}
        onClick={handleClick}
        size="icon"
        type="button"
        variant="outline"
      >
        <LucideArrowLeftRight className="aspect-square w-4" />
      </Button>
    </Form>
  );
};

export { SwitchOrgButton };
