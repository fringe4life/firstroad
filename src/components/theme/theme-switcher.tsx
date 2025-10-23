"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import type { MouseEventHandler } from "react";
import { Button } from "../ui/button";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <Button
      className="cursor-pointer"
      onClick={handleClick}
      size="icon"
      variant="outline"
    >
      <Moon className="absolute aspect-square w-4 rotate-90 scale-0 transition-transform duration-150 dark:rotate-0 dark:scale-110" />

      <Sun className="aspect-square w-4 rotate-0 scale-110 transition-all duration-150 dark:rotate-90 dark:scale-0" />
    </Button>
  );
};

export { ThemeSwitcher };
