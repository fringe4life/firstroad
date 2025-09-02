"use client";

import { useActionState, useId } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/features/auth/actions/change-password-action";
import { EMPTY_ACTION_STATE } from "@/features/utils/to-action-state";

const ChangePasswordForm = () => {
  const [state, action] = useActionState(changePassword, EMPTY_ACTION_STATE);
  const currentId = useId();
  const newId = useId();
  const confirmId = useId();
  const revokeId = useId();

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <Label htmlFor={currentId}>Current password</Label>
      <Input
        id={currentId}
        name="currentPassword"
        type="password"
        placeholder="••••••••"
        defaultValue={state?.payload?.get("currentPassword")?.toString() || ""}
      />
      <FieldError
        actionState={state || EMPTY_ACTION_STATE}
        name="currentPassword"
      />

      <Label htmlFor={newId}>New password</Label>
      <Input
        id={newId}
        name="newPassword"
        type="password"
        placeholder="At least 8 characters"
        defaultValue={state?.payload?.get("newPassword")?.toString() || ""}
      />
      <FieldError
        actionState={state || EMPTY_ACTION_STATE}
        name="newPassword"
      />

      <Label htmlFor={confirmId}>Confirm new password</Label>
      <Input
        id={confirmId}
        name="confirmPassword"
        type="password"
        placeholder="Re-enter new password"
        defaultValue={state?.payload?.get("confirmPassword")?.toString() || ""}
      />
      <FieldError
        actionState={state || EMPTY_ACTION_STATE}
        name="confirmPassword"
      />

      <div className="flex items-center gap-x-2 py-2">
        <input id={revokeId} name="revokeOtherSessions" type="checkbox" />
        <label htmlFor={revokeId} className="text-sm">
          Sign out other devices
        </label>
      </div>

      <SubmitButton label={"Update password"} />
    </Form>
  );
};

export default ChangePasswordForm;
