"use client";

import { useActionState, useId } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { signin } from "@/features/password/actions/signin-action";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import { withActionFeedback } from "@/utils/with-action-feedback";

interface SignInFormProps {
  signinAction: typeof signin;
}

const SignInForm = ({ signinAction }: SignInFormProps) => {
  const [state, action] = useActionState(
    withActionFeedback(signinAction),
    EMPTY_ACTION_STATE,
  );
  const emailId = useId();
  const passwordId = useId();

  return (
    <Form action={action}>
      <Label htmlFor={emailId}>Email</Label>
      <Input
        defaultValue={state?.payload?.email ?? ""}
        id={emailId}
        name="email"
        placeholder="email"
      />
      <FieldError actionState={state} name="email" />
      <Label htmlFor={passwordId}>Password</Label>
      <Input
        defaultValue={state?.payload?.password ?? ""}
        id={passwordId}
        name="password"
        placeholder="password"
        type="password"
      />
      <FieldError actionState={state} name="password" />

      <SubmitButton label="Sign in" />
    </Form>
  );
};

export { SignInForm };
