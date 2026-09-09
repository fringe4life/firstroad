"use client";

import { useTheme } from "next-themes";
import { ViewTransition } from "react";

const ThemeTransition = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return (
    <ViewTransition
      enter={{
        "dark-to-light": "circle-in-bottom-center",
        default: "auto",
        "light-to-dark": "circle-in-top-center",
      }}
      key={theme}
    >
      {children}
    </ViewTransition>
  );
};

export { ThemeTransition };
