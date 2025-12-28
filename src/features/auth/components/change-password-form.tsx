"use client";

import { useActionState, useId } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { changePassword } from "@/features/password/actions/change-password-action";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

interface ChangePasswordFormProps {
  changePasswordAction: typeof changePassword;
}

const ChangePasswordForm = ({
  changePasswordAction,
}: ChangePasswordFormProps) => {
  const [state, action] = useActionState(
    changePasswordAction,
    EMPTY_ACTION_STATE,
  );
  const currentId = useId();
  const newId = useId();
  const confirmId = useId();
  const revokeId = useId();

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <Label htmlFor={currentId}>Current password</Label>
      <Input
        defaultValue={state?.payload?.get("currentPassword")?.toString() || ""}
        id={currentId}
        name="currentPassword"
        placeholder="••••••••"
        type="password"
      />
      <FieldError
        actionState={state || EMPTY_ACTION_STATE}
        name="currentPassword"
      />

      <Label htmlFor={newId}>New password</Label>
      <Input
        defaultValue={state?.payload?.get("newPassword")?.toString() || ""}
        id={newId}
        name="newPassword"
        placeholder="At least 8 characters"
        type="password"
      />
      <FieldError
        actionState={state || EMPTY_ACTION_STATE}
        name="newPassword"
      />

      <Label htmlFor={confirmId}>Confirm new password</Label>
      <Input
        defaultValue={state?.payload?.get("confirmPassword")?.toString() || ""}
        id={confirmId}
        name="confirmPassword"
        placeholder="Re-enter new password"
        type="password"
      />
      <FieldError
        actionState={state || EMPTY_ACTION_STATE}
        name="confirmPassword"
      />

      <div className="flex items-center space-x-2 py-2">
        <Checkbox id={revokeId} name="revokeOtherSessions" value="on" />
        <Label className="font-normal text-sm" htmlFor={revokeId}>
          Sign out other devices
        </Label>
      </div>

      <SubmitButton label={"Update password"} />
    </Form>
  );
};

export default ChangePasswordForm;
