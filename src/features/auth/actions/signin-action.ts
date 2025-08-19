"use server";
import { z } from "zod";
import { signIn } from "@/app/auth";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { ticketsPath } from "@/path";

const signInSchema = z.object({
  email: z.string().min(1, { message: "Is required" }).max(191).email(),
  password: z.string().min(6).max(191),
});

const signin = async (state: ActionState | undefined, formData: FormData) => {
  console.log("🚀 Sign-in process started");
  console.log("📅 Timestamp:", new Date().toISOString());
  
  try {
    console.log("📝 Parsing form data...");
    const formDataObj = Object.fromEntries(formData);
    console.log("📋 Form data received:", { 
      email: formDataObj.email,
      hasPassword: !!formDataObj.password,
      formDataKeys: Array.from(formData.keys())
    });

    const { email, password } = signInSchema.parse(formDataObj);
    console.log("✅ Form data validation passed");
    console.log("📧 Email being used:", email);
    console.log("🔐 Password length:", password.length);

    console.log("🔑 Attempting to sign in with Auth.js...");
    console.log("🎯 Redirect target:", ticketsPath());

    // Let Auth.js/Next.js handle the redirect by not catching NEXT_REDIRECT
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: ticketsPath(),
    });

    // If signIn does not redirect (unlikely), return a generic success
    console.log("✅ Sign-in completed without redirect");
    return toActionState("Signed in", "SUCCESS");
  } catch (err: unknown) {
    // If this is the NEXT_REDIRECT, rethrow so Next.js handles navigation
    if (err && typeof err === "object" && "digest" in err) {
      const digest = (err as any).digest as string | undefined;
      if (typeof digest === "string" && digest.includes("NEXT_REDIRECT")) {
        console.log("✅ Redirect detected; rethrowing to let Next.js navigate");
        throw err;
      }
    }

    console.log("💥 Error during sign-in process:", err);
    console.log("💥 Error type:", typeof err);
    console.log("💥 Error message:", err instanceof Error ? err.message : String(err));
    console.log("💥 Error stack:", err instanceof Error ? err.stack : "No stack trace");
    return fromErrorToActionState(err, formData);
  }
};

export { signin };
