"use server";

import { headers } from "next/headers";
import { z } from "zod/v4";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/utils/to-action-state";
import { auth } from "@/lib/auth";
import { ticketsPath } from "@/path";

const signInSchema = z.object({
  email: z.email().min(1, { message: "Email is required" }).max(191),
  password: z.string().min(6).max(191),
});

const signin = async (_state: ActionState | undefined, formData: FormData) => {
  console.log("🚀 Sign-in process started");
  console.log("📅 Timestamp:", new Date().toISOString());

  try {
    console.log("📝 Parsing form data...");
    const formDataObj = Object.fromEntries(formData);
    console.log("📋 Form data received:", {
      email: formDataObj.email,
      hasPassword: !!formDataObj.password,
      formDataKeys: Array.from(formData.keys()),
    });

    const { email, password } = signInSchema.parse(formDataObj);
    console.log("✅ Form data validation passed");
    console.log("📧 Email being used:", email);
    console.log("🔐 Password length:", password.length);

    console.log("🔑 Attempting to sign in with Better Auth...");
    console.log("🎯 Redirect target:", ticketsPath);

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    console.log("✅ Sign-in completed successfully");
    return toActionState("Signed in successfully", "SUCCESS");
  } catch (err: unknown) {
    console.log("💥 Error during sign-in process:", err);
    console.log("💥 Error type:", typeof err);
    console.log(
      "💥 Error message:",
      err instanceof Error ? err.message : String(err),
    );

    return fromErrorToActionState(err, formData);
  }
};

export { signin };
