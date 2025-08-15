"use server";
import { cache } from "react";
import { auth } from "@/app/auth";

export const getAuth = cache(async () => {
  const session = await auth();
  
  return {
    user: session?.user ?? null,
    session: session,
  };
});
