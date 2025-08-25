"use client";

import { useSession } from "next-auth/react";

const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    session: session,
    isFetched: status !== "loading",
    isLoading: status === "loading",
  };
};

export default useAuth;
