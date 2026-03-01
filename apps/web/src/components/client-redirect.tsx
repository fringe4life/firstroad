"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent } from "react";

/**
 * Client-side redirect. Uses useEffectEvent so the effect only re-runs when
 * `to` changes, not when router or replace identity changes.
 */
export function ClientRedirect({ to }: { to: string }) {
  const router = useRouter();
  const replace = useEffectEvent((to: string) => {
    router.replace(to as Route);
  });

  useEffect(() => {
    replace(to);
  }, [to]);

  return null;
}
