"use client";

import { useActionState, useId } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { signin } from "@/features/password/actions/signin-action";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

interface SignInFormProps {
  signinAction: typeof signin;
}

const SignInForm = ({ signinAction }: SignInFormProps) => {
  const [state, action] = useActionState(signinAction, EMPTY_ACTION_STATE);
  const emailId = useId();
  const passwordId = useId();

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <Label htmlFor={emailId}>Email</Label>
      <Input
        defaultValue={state?.payload?.get("email")?.toString() || ""}
        id={emailId}
        name="email"
        placeholder="email"
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="email" />
      <Label htmlFor={passwordId}>Password</Label>
      <Input
        defaultValue={state?.payload?.get("password")?.toString() || ""}
        id={passwordId}
        name="password"
        placeholder="password"
        type="password"
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="password" />

      <SubmitButton label="Sign in" />
    </Form>
  );
};

export { SignInForm };
