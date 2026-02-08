"use client";

import { useActionState, useId } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { signup } from "@/features/password/actions/signup-action";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

interface SignUpFormProps {
  signupAction: typeof signup;
}

const SignUpForm = ({ signupAction }: SignUpFormProps) => {
  const [state, action] = useActionState(signupAction, EMPTY_ACTION_STATE);
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <Label htmlFor={nameId}>Name</Label>
      <Input
        defaultValue={state?.payload?.name ?? ""}
        id={nameId}
        name="name"
        placeholder="Enter your name"
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="name" />

      <Label htmlFor={emailId}>Email</Label>
      <Input
        defaultValue={state?.payload?.email ?? ""}
        id={emailId}
        name="email"
        placeholder="Enter your email"
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="email" />

      <Label htmlFor={passwordId}>Password</Label>
      <Input
        defaultValue={state?.payload?.password ?? ""}
        id={passwordId}
        name="password"
        placeholder="Enter your password"
        type="password"
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="password" />

      <Label htmlFor={confirmPasswordId}>Confirm Password</Label>
      <Input
        defaultValue={state?.payload?.confirmPassword ?? ""}
        id={confirmPasswordId}
        name="confirmPassword"
        placeholder="Confirm your password"
        type="password"
      />
      <FieldError
        actionState={state || EMPTY_ACTION_STATE}
        name="confirmPassword"
      />

      <SubmitButton label="Sign up" />
    </Form>
  );
};

export { SignUpForm };
