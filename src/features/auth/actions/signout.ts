"use server";

import { redirect } from "next/navigation";
import { signOut } from "@/app/auth";
import { signInPath } from "@/path";

export const signOutAction = async () => {
  await signOut({ redirect: false });
  redirect(signInPath());
};
