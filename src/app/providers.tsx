'use client';

import React, { useEffect } from 'react';
import { ThemeProvider, AppProvider, SettingsProvider } from '@/contexts';
import { QueryProvider } from '@/providers';

function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration.scope);
        })
        .catch((error) => {
          console.log('SW registration failed:', error);
        });
    }
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <SettingsProvider>
          <AppProvider>
            <ServiceWorkerRegistration />
            {children}
          </AppProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
