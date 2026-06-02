"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useAppStore } from "@/store/useAppStore";

export function ThemeProvider({ children, ...props }: any) {
  const { accentColor } = useAppStore();

  React.useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", accentColor);
  }, [accentColor]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
