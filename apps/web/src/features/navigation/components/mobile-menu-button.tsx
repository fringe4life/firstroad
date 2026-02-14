"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileSidebar } from "../context/context";

const MobileMenuButton = () => {
  const { isOpen, toggle } = useMobileSidebar();

  return (
    <Button
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-live="polite"
      className="md:hidden"
      data-open={isOpen}
      onClick={toggle}
      size="icon"
      type="button"
      variant="ghost"
    >
      <X className="aspect-square h-5 rotate-90 scale-0 transition-transform duration-150 open:rotate-0 open:scale-110" />
      <Menu className="absolute aspect-square h-5 rotate-0 scale-110 transition-transform duration-150 open:rotate-90 open:scale-0" />
      <span aria-live="polite" className="sr-only">
        {isOpen ? "Close" : "Open"} navigation menu
      </span>
    </Button>
  );
};

export { MobileMenuButton };
