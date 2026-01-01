"use client";

import { useActionState, useId } from "react";
import { FieldError } from "@/components/form/field-error";
import { Form } from "@/components/form/form";
import { SubmitButton } from "@/components/form/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import type { sendEmailVerificationOTP } from "../actions/send-otp-action";

interface OTPSendFormProps {
  sendOTPAction: typeof sendEmailVerificationOTP;
  title: string;
  description: string;
  submitLabel: string;
}

const OTPSendForm = ({
  sendOTPAction,
  title,
  description,
  submitLabel,
}: OTPSendFormProps) => {
  const [state, action] = useActionState(sendOTPAction, EMPTY_ACTION_STATE);
  const emailId = useId();

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <div className="space-y-4">
        <div>
          <h1 className="font-semibold text-2xl">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={emailId}>Email</Label>
          <Input
            defaultValue={state?.payload?.get("email")?.toString() || ""}
            id={emailId}
            name="email"
            placeholder="Enter your email"
            required
            type="email"
          />
          <FieldError actionState={state || EMPTY_ACTION_STATE} name="email" />
        </div>

        <SubmitButton label={submitLabel} />
      </div>
    </Form>
  );
};

export { OTPSendForm };
