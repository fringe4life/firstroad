"use client";

import { useActionState, useId } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/features/password/actions/forgot-password-action";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

const ForgotPasswordForm = () => {
  const [state, action] = useActionState(forgotPassword, EMPTY_ACTION_STATE);
  const emailId = useId();

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <Label htmlFor={emailId}>Email</Label>
      <Input
        name="email"
        placeholder="Enter your email address"
        id={emailId}
        type="email"
        defaultValue={state?.payload?.get("email")?.toString() || ""}
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="email" />

      <SubmitButton label="Send Reset Link" />
    </Form>
  );
};

export default ForgotPasswordForm;
