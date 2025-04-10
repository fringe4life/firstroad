"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { MouseEventHandler } from "react";
import { Button } from "../ui/button";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <Button
      className="cursor-pointer "
      size="icon"
      variant="outline"
      onClick={handleClick}
    >
      <Moon className="duration-150 absolute rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-110 size-4" />

      <Sun className="duration-150 size-4 rotate-0 scale-110 transition-all dark:rotate-90 dark:scale-0" />
      <span className="sr-only">
        {theme === "light" ? "switch to dark theme" : "switch to light theme"}
      </span>
    </Button>
  );
};

export { ThemeSwitcher };
