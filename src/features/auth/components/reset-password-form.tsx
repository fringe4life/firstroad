"use client";

import { useActionState, useId } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/features/auth/actions/reset-password-action";
import { EMPTY_ACTION_STATE } from "@/features/utils/to-action-state";

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [state, action] = useActionState(resetPassword, EMPTY_ACTION_STATE);
  const passwordId = useId();
  const confirmPasswordId = useId();

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <input type="hidden" name="token" value={token} />

      <Label htmlFor={passwordId}>New Password</Label>
      <Input
        name="password"
        placeholder="Enter your new password"
        id={passwordId}
        type="password"
        defaultValue={state?.payload?.get("password")?.toString() || ""}
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="password" />

      <Label htmlFor={confirmPasswordId}>Confirm New Password</Label>
      <Input
        name="confirmPassword"
        placeholder="Confirm your new password"
        id={confirmPasswordId}
        type="password"
        defaultValue={state?.payload?.get("confirmPassword")?.toString() || ""}
      />
      <FieldError
        actionState={state || EMPTY_ACTION_STATE}
        name="confirmPassword"
      />

      <SubmitButton label="Reset Password" />
    </Form>
  );
};

export default ResetPasswordForm;
