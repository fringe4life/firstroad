"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileSidebar } from "../context/context";

const MobileMenuButton = () => {
  const { open } = useMobileSidebar();
  return (
    <Button
      aria-label="Open navigation menu"
      className="md:hidden"
      onClick={open}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Menu className="aspect-square h-5" />
    </Button>
  );
};

export { MobileMenuButton };
