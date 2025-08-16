"use server";
import { hash } from "@node-rs/argon2";
import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { signIn } from "@/app/auth";
import {
  type ActionState,
  fromErrorToActionState,
  toActionState,
} from "@/features/utils/to-action-state";
import { prisma } from "@/lib/prisma";
import { ticketsPath } from "@/path";

const signUpSchema = z
  .object({
    username: z
      .string()
      .min(1)
      .max(191)
      .refine(
        (value) => !value.includes(" "),
        "Username cannot contain spaces"
      ),
    email: z.email().min(1, { message: "Is required" }).max(191),
    password: z.string().min(6).max(191),
    confirmPassword: z.string().min(6).max(191),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords must match",
    path: ["confirmPassword"],
  });

export const signUp = async (_actionState: ActionState, formData: FormData) => {
  console.log("🚀 Sign-up process started");
  
  try {
    console.log("📝 Parsing form data...");
    const formDataObj = Object.fromEntries(formData);
    console.log("📋 Form data received:", { 
      username: formDataObj.username, 
      email: formDataObj.email,
      hasPassword: !!formDataObj.password,
      hasConfirmPassword: !!formDataObj.confirmPassword
    });

    const { username, email, password } = signUpSchema.parse(formDataObj);
    console.log("✅ Form data validation passed");

    // Check if user already exists
    console.log("🔍 Checking if user already exists...");
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("❌ User already exists:", { email });
      return toActionState("User already exists", "ERROR", formData);
    }
    console.log("✅ User does not exist, proceeding with creation");

    // Create user
    console.log("🔐 Hashing password...");
    const hashedPassword = await hash(password);
    console.log("✅ Password hashed successfully");

    console.log("👤 Creating user in database...");
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
      },
    });
    console.log("✅ User created successfully:", { id: user.id, email: user.email });

    // Create UserInfo for the new user
    console.log("📋 Creating UserInfo for new user...");
    const userInfo = await prisma.userInfo.create({
      data: {
        userId: user.id,
      },
    });
    console.log("✅ UserInfo created successfully:", { userId: userInfo.userId });

    // Sign in the user
    console.log("🔑 Attempting to sign in user...");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("📊 Sign-in result:", result);

    if (result?.error) {
      console.log("❌ Sign-in failed after registration:", result.error);
      return toActionState("Failed to sign in after registration", "ERROR", formData);
    }

    if (result?.ok) {
      console.log("✅ Sign-in successful, redirecting to tickets");
      redirect(ticketsPath());
    }
  } catch (err) {
    console.log("💥 Error during sign-up process:", err);
    return fromErrorToActionState(err, formData);
  }

  console.log("⚠️ Unexpected end of sign-up process");
  return toActionState("An error occurred", "ERROR", formData);
};
