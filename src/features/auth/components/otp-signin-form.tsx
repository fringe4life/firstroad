"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export const OTPSignInForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendOTP = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      setStep("otp");
      setMessage("OTP sent to your email!");
    } catch (_error) {
      setMessage("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!(email && otp)) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp,
      });

      if (error) {
        setMessage("Invalid OTP. Please try again.");
      } else {
        setMessage("Successfully signed in!");
        // Redirect or handle successful login
        window.location.href = "/tickets";
      }
    } catch (_error) {
      setMessage("Failed to verify OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setMessage("");
  };

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In with OTP</CardTitle>
        <CardDescription>
          {step === "email"
            ? "Enter your email to receive a verification code"
            : "Enter the 6-digit code sent to your email"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "email" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                type="email"
                value={email}
              />
            </div>
            <Button
              className="w-full"
              disabled={isLoading || !email}
              onClick={handleSendOTP}
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                type="text"
                value={otp}
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={isLoading || !otp}
                onClick={handleVerifyOTP}
              >
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </Button>
              <Button
                disabled={isLoading}
                onClick={handleBackToEmail}
                variant="outline"
              >
                Back
              </Button>
            </div>
          </>
        )}

        {message && (
          <div
            className={`rounded p-3 text-sm ${
              message.includes("Successfully") || message.includes("sent")
                ? "border border-green-200 bg-green-50 text-green-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
