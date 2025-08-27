"use server";

import { headers } from "next/headers";
import { z } from "zod/v4";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { auth } from "@/lib/auth";

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }).max(191),
    email: z.email().min(1, { message: "Email is required" }).max(191),
    password: z.string().min(6).max(191),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // This will show the error on the confirmPassword field
  });

const signup = async (_state: ActionState | undefined, formData: FormData) => {
  console.log("🚀 Sign-up process started");
  console.log("📅 Timestamp:", new Date().toISOString());

  try {
    console.log("📝 Parsing form data...");
    const formDataObj = Object.fromEntries(formData);
    console.log("📋 Form data received:", {
      name: formDataObj.name,
      email: formDataObj.email,
      hasPassword: !!formDataObj.password,
      hasConfirmPassword: !!formDataObj.confirmPassword,
      formDataKeys: Array.from(formData.keys()),
    });

    const { name, email, password } = signUpSchema.parse(formDataObj);
    console.log("✅ Form data validation passed");
    console.log("👤 Name:", name);
    console.log("📧 Email:", email);
    console.log("🔐 Password length:", password.length);

    console.log("🔑 Attempting to sign up with Better Auth...");

    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    });

    console.log("✅ Sign-up completed successfully");
    return toActionState(
      "Account created successfully. Please check your email to verify your account.",
      "SUCCESS",
    );
  } catch (err: unknown) {
    console.log("💥 Error during sign-up process:", err);
    console.log("💥 Error type:", typeof err);
    console.log(
      "💥 Error message:",
      err instanceof Error ? err.message : String(err),
    );

    return fromErrorToActionState(err, formData);
  }
};

export { signup };
