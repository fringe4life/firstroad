"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { consumeCookieByKey } from "@/features/utils/cookies";

const RedirectToast = () => {
  //   const pathname = usePathname();
  //   console.log(pathname);
  useEffect(() => {
    const showCookieToast = async () => {
      const message = await consumeCookieByKey("toast");
      if (message) {
        toast.success(message);
      }
    };
    showCookieToast();
  }, []);
  return null;
};
export { RedirectToast };
