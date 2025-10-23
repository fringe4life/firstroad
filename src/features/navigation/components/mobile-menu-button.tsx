"use client";

import clsx from "clsx";
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
      onClick={toggle}
      size="icon"
      type="button"
      variant="ghost"
    >
      <X
        className={clsx(
          "aspect-square h-5 transition-transform duration-150",
          isOpen ? "rotate-0 scale-110" : "rotate-90 scale-0",
        )}
      />
      <Menu
        className={clsx(
          "absolute aspect-square h-5 transition-transform duration-150",
          isOpen ? "rotate-90 scale-0" : "rotate-0 scale-110",
        )}
      />
      <span aria-live="polite" className="sr-only">
        {isOpen ? "Close" : "Open"} navigation menu
      </span>
    </Button>
  );
};

export default MobileMenuButton;
