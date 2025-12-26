'use client';

import React, { useState } from 'react';
import { useApp } from '@/contexts';
import { ThemeToggle, LocationSearch } from '@/components/features';
import { IconButton } from '@/components/ui';
import { getGreeting } from '@/utils';

export function Header() {
  const { location, refreshWeather } = useApp();
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const greeting = getGreeting();

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Greeting and location */}
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {greeting} 👋
              </h1>
              <button
                onClick={() => setShowLocationSearch(true)}
                className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{location.displayName}</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <IconButton
                onClick={refreshWeather}
                variant="filled"
                aria-label="Refresh weather"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </IconButton>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Location search modal */}
      {showLocationSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <LocationSearch onClose={() => setShowLocationSearch(false)} />
          </div>
        </div>
      )}
    </>
  );
}
