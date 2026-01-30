"use client";

import { LucideUserCog } from "lucide-react";
import { useActionState, useOptimistic, useRef, useTransition } from "react";
import { Form } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/generated/prisma/enums";
import type { ActionState } from "@/utils/to-action-state";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { updateMemberRole } from "../actions/update-member-role";
import type { MembershipsMoreMenuProps } from "../types";

const MembershipsMoreMenu = ({
  organizationId,
  memberId,
  role,
}: MembershipsMoreMenuProps) => {
  // Ref to capture selected role for the action
  const nextRoleRef = useRef<MemberRole>(role);

  // 1. useActionState first to get action result
  const [state, action] = useActionState(
    async (prevState: ActionState<MemberRole>) => {
      return await updateMemberRole(
        organizationId,
        memberId,
        nextRoleRef.current,
        prevState,
      );
    },
    EMPTY_ACTION_STATE as ActionState<MemberRole>,
  );

  const [isPending, startTransition] = useTransition();

  // 2. Derive current value from action state if success, otherwise from prop
  const currentRole =
    state.status === "SUCCESS" && state.data ? state.data : role;

  // 3. useOptimistic uses the derived current value
  const [optimisticRole, setOptimisticRole] = useOptimistic(
    currentRole,
    (_current, newRole: MemberRole) => newRole,
  );

  const isOwner = optimisticRole === MemberRole.owner;

  const handleRoleChange = (nextRole: string) => {
    if (nextRole === optimisticRole) {
      return;
    }

    const newRole = nextRole as MemberRole;
    nextRoleRef.current = newRole;

    startTransition(async () => {
      setOptimisticRole(newRole);
      await action();
    });
  };

  return (
    <Form action={action} state={state}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={isPending ? "opacity-75" : ""}
            size="icon"
            variant="outline"
          >
            <LucideUserCog className="aspect-square w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            onValueChange={handleRoleChange}
            value={optimisticRole}
          >
            <DropdownMenuRadioItem disabled={isOwner} value={MemberRole.admin}>
              Admin
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem disabled={isOwner} value={MemberRole.member}>
              Member
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Form>
  );
};

export { MembershipsMoreMenu };
