'use client';

import React from 'react';
import { useTheme, useApp } from '@/contexts';
import { PageContainer, Section } from '@/components/layout';
import { Card, Button } from '@/components/ui';

export function SettingsView() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { location, useDemoMode } = useApp();

  const themeOptions = [
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
    { id: 'system', label: 'System', icon: '💻' },
  ] as const;

  return (
    <PageContainer>
      <Section title="Settings">
        {/* Theme Selection */}
        <Card variant="default" padding="md" className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                  theme === option.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                    : 'bg-gray-50 dark:bg-gray-800 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <span
                  className={`text-sm font-medium ${
                    theme === option.id
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Current: {resolvedTheme === 'dark' ? 'Dark' : 'Light'} mode
          </p>
        </Card>

        {/* Location Info */}
        <Card variant="default" padding="md" className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Location
          </h3>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {location.displayName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </Card>

        {/* Data Options */}
        <Card variant="default" padding="md" className="mb-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Data
          </h3>
          <div className="space-y-3">
            <Button variant="secondary" onClick={useDemoMode} className="w-full justify-start">
              <span className="mr-3">🎮</span>
              Use Demo Mode
            </Button>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Demo mode uses sample data for testing without an API key.
            </p>
          </div>
        </Card>

        {/* About */}
        <Card variant="default" padding="md">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            About
          </h3>
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🌤️</div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              WeatherPlanner
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Version 1.0.0
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 max-w-xs mx-auto">
              Plan your day based on weather conditions. Get activity suggestions and find local events.
            </p>
          </div>
        </Card>
      </Section>
    </PageContainer>
  );
}
