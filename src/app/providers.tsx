'use client';

import React from 'react';
import { ThemeProvider, AppProvider } from '@/contexts';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  );
}
