"use client";

import { useActionState } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMPTY_ACTION_STATE } from "@/features/utils/to-action-state";
import { signin } from "../actions/signin-action";

const SignUpForm = () => {
  const [state, action] = useActionState(signin, EMPTY_ACTION_STATE);

  return (
    <Form action={action} state={state}>
      <Label htmlFor="email">Email</Label>
      <Input
        name="email"
        placeholder="email"
        id="email"
        defaultValue={state.payload?.get("email") as string}
      />
      <FieldError actionState={state} name="email" />
      <Label htmlFor="password">Password</Label>
      <Input
        type="password"
        name="password"
        placeholder="password"
        id="password"
        defaultValue={state.payload?.get("password") as string}
      />
      <FieldError actionState={state} name="password" />

      <SubmitButton label={"Sign in"} />
    </Form>
  );
};

export default SignUpForm;
