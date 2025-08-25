"use client";

import { useActionState, useId } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/features/auth/actions/signup-action";
import { EMPTY_ACTION_STATE } from "@/features/utils/to-action-state";

const SignUpForm = () => {
  const [state, action] = useActionState(signup, EMPTY_ACTION_STATE);
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <Label htmlFor={nameId}>Name</Label>
      <Input
        name="name"
        placeholder="Enter your name"
        id={nameId}
        defaultValue={state?.payload?.get("name")?.toString() || ""}
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="name" />

      <Label htmlFor={emailId}>Email</Label>
      <Input
        name="email"
        placeholder="Enter your email"
        id={emailId}
        defaultValue={state?.payload?.get("email")?.toString() || ""}
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="email" />

      <Label htmlFor={passwordId}>Password</Label>
      <Input
        type="password"
        name="password"
        placeholder="Enter your password"
        id={passwordId}
        defaultValue={state?.payload?.get("password")?.toString() || ""}
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="password" />

      <SubmitButton label="Sign up" />
    </Form>
  );
};

export default SignUpForm;
