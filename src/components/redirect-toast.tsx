"use client";

import { useEffect, useEffectEvent } from "react";
import { toast } from "sonner";
import { consumeCookieByKey } from "@/utils/cookies";

const RedirectToast = () => {
  const showCookieToast = useEffectEvent(async () => {
    const message = await consumeCookieByKey("toast");
    if (message) {
      toast.success(message);
    }
  });

  useEffect(() => {
    showCookieToast();
  }, []);
  return null;
};
export { RedirectToast };
