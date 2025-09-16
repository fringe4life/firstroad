"use client";

import { useActionState, useId } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/features/password/actions/reset-password-action";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

type ResetPasswordFormProps = {
  token: string;
};

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const [state, action] = useActionState(resetPassword, EMPTY_ACTION_STATE);
  const passwordId = useId();
  const confirmPasswordId = useId();

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <input name="token" type="hidden" value={token} />

      <Label htmlFor={passwordId}>New Password</Label>
      <Input
        defaultValue={state?.payload?.get("password")?.toString() || ""}
        id={passwordId}
        name="password"
        placeholder="Enter your new password"
        type="password"
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="password" />

      <Label htmlFor={confirmPasswordId}>Confirm New Password</Label>
      <Input
        defaultValue={state?.payload?.get("confirmPassword")?.toString() || ""}
        id={confirmPasswordId}
        name="confirmPassword"
        placeholder="Confirm your new password"
        type="password"
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
