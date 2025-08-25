"use client";

import { useEffect, useState } from "react";
import type { ClientSession } from "@/features/auth/types";
import { authClient } from "@/lib/auth-client";

const useAuth = () => {
  const [session, setSession] = useState<ClientSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch {
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  return {
    user: session?.user ?? null,
    session: session,
    isFetched: !isLoading,
    isLoading,
  };
};

export default useAuth;
