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
    
    try {
      // Use redirect: true to let Auth.js handle the redirect properly
      await signIn("credentials", {
        email,
        password,
        redirect: true,
        redirectTo: ticketsPath(),
      });
      
      // If we get here, it means the sign-in was successful
      console.log("✅ Sign-in successful");
    } catch (error) {
      console.log("📊 Sign-in result:", error);
      console.log("📊 Error type:", typeof error);
      console.log("📊 Error constructor:", error?.constructor?.name);
      
      // Check if this is a successful redirect (not an error)
      if (error && typeof error === 'object' && 'digest' in error) {
        const digest = error.digest as string;
        console.log("📊 Error digest:", digest);
        if (digest.includes('NEXT_REDIRECT')) {
          console.log("✅ Sign-in successful - redirect detected");
          console.log("🔄 Returning early due to redirect");
          // This is a successful redirect, not an error
          return;
        }
      }
      
      console.log("❌ Sign-in failed:", error);
      console.log("❌ Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : "No stack trace"
      });
      return toActionState("Incorrect email or password", "ERROR", formData);
    }
  } catch (err) {
    console.log("💥 Error during sign-in process:", err);
    console.log("💥 Error type:", typeof err);
    console.log("💥 Error message:", err instanceof Error ? err.message : String(err));
    console.log("💥 Error stack:", err instanceof Error ? err.stack : "No stack trace");
    return fromErrorToActionState(err, formData);
  }

  console.log("⚠️ Unexpected end of sign-in process");
  return toActionState("An error occurred", "ERROR", formData);
};

export { signin };
