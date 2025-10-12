import {
  ThemeProvider as BaseThemeProvider,
  type ThemeProviderProps,
} from "next-themes";

const ThemeProvider = ({ children }: ThemeProviderProps) => (
  <BaseThemeProvider attribute="class" defaultTheme="system" enableSystem>
    {children}
  </BaseThemeProvider>
);

export { ThemeProvider };
