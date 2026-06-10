"use client";

import { ThemeProvider } from 'next-themes';
import { ReactNode, useEffect } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  // next-themes handles system preference automatically
  useEffect(() => {
    // No extra logic needed for now
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}
