"use client";

import { useActionState, useId } from "react";
import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { EMPTY_ACTION_STATE } from "@/utils/to-action-state";
import type { verifyEmailVerificationOTP } from "../actions/verify-otp-action";

interface OTPVerifyFormProps {
  verifyOTPAction: typeof verifyEmailVerificationOTP;
  submitLabel: string;
  email?: string;
}

const OTPVerifyForm = ({
  verifyOTPAction,
  submitLabel,
  email,
}: OTPVerifyFormProps) => {
  const [state, action] = useActionState(verifyOTPAction, EMPTY_ACTION_STATE);
  const otpId = useId();

  return (
    <Form action={action} state={state || EMPTY_ACTION_STATE}>
      <div className="space-y-4">
        {Boolean(email) && (
          <p className="text-muted-foreground text-sm">
            Code sent to: <span className="font-medium">{email}</span>
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor={otpId}>Verification Code</Label>
          <InputOTP maxLength={6} name="otp" required>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <FieldError actionState={state || EMPTY_ACTION_STATE} name="otp" />
        </div>

        {/* Hidden email field for form submission */}
        {Boolean(email) && <input name="email" type="hidden" value={email} />}

        <SubmitButton label={submitLabel} />
      </div>
    </Form>
  );
};

export default OTPVerifyForm;
