"use client";

import { useActionState } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMPTY_ACTION_STATE } from "@/features/utils/to-action-state";
import { signin } from "../actions/signin-action";

const SignInForm = () => {
  const [state, action] = useActionState(signin, EMPTY_ACTION_STATE);

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <Label htmlFor="email">Email</Label>
      <Input
        name="email"
        placeholder="email"
        id="email"
        defaultValue={state?.payload?.get("email")?.toString() || ""}
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="email" />
      <Label htmlFor="password">Password</Label>
      <Input
        type="password"
        name="password"
        placeholder="password"
        id="password"
        defaultValue={state?.payload?.get("password")?.toString() || ""}
      />
      <FieldError actionState={state || EMPTY_ACTION_STATE} name="password" />

      <SubmitButton label={"Sign in"} />
    </Form>
  );
};

export default SignInForm;
