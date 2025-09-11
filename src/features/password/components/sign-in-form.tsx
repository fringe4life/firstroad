"use client";

import { useActionState, useId } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signin } from "@/features/password/actions/signin-action";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";

const SignInForm = () => {
	const [state, action] = useActionState(signin, EMPTY_ACTION_STATE);
	const emailId = useId();
	const passwordId = useId();

	return (
		<Form action={action} state={state || EMPTY_ACTION_STATE}>
			<Label htmlFor={emailId}>Email</Label>
			<Input
				name="email"
				placeholder="email"
				id={emailId}
				defaultValue={state?.payload?.get("email")?.toString() || ""}
			/>
			<FieldError actionState={state || EMPTY_ACTION_STATE} name="email" />
			<Label htmlFor={passwordId}>Password</Label>
			<Input
				type="password"
				name="password"
				placeholder="password"
				id={passwordId}
				defaultValue={state?.payload?.get("password")?.toString() || ""}
			/>
			<FieldError actionState={state || EMPTY_ACTION_STATE} name="password" />

			<SubmitButton label="Sign in" />
		</Form>
	);
};

export default SignInForm;
