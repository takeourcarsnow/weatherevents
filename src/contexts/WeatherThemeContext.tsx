'use client';

import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { WeatherType } from '@/types';

interface WeatherThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  gradientFrom: string;
  gradientTo: string;
}

interface WeatherThemeContextType {
  colors: WeatherThemeColors;
  weatherType: WeatherType;
  isDaytime: boolean;
}

const defaultColors: WeatherThemeColors = {
  primary: '#3b82f6',
  secondary: '#60a5fa',
  accent: '#f59e0b',
  background: '#f0f9ff',
  gradientFrom: '#3b82f6',
  gradientTo: '#1d4ed8',
};

const WeatherThemeContext = createContext<WeatherThemeContextType>({
  colors: defaultColors,
  weatherType: 'clear',
  isDaytime: true,
});

const weatherThemes: Record<WeatherType, { day: WeatherThemeColors; night: WeatherThemeColors }> = {
  clear: {
    day: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      accent: '#3b82f6',
      background: '#fef3c7',
      gradientFrom: '#f59e0b',
      gradientTo: '#ea580c',
    },
    night: {
      primary: '#1e3a8a',
      secondary: '#3b82f6',
      accent: '#fbbf24',
      background: '#1e293b',
      gradientFrom: '#1e3a8a',
      gradientTo: '#312e81',
    },
  },
  clouds: {
    day: {
      primary: '#64748b',
      secondary: '#94a3b8',
      accent: '#3b82f6',
      background: '#f1f5f9',
      gradientFrom: '#64748b',
      gradientTo: '#475569',
    },
    night: {
      primary: '#334155',
      secondary: '#475569',
      accent: '#60a5fa',
      background: '#1e293b',
      gradientFrom: '#334155',
      gradientTo: '#1e293b',
    },
  },
  rain: {
    day: {
      primary: '#0ea5e9',
      secondary: '#38bdf8',
      accent: '#6366f1',
      background: '#e0f2fe',
      gradientFrom: '#0ea5e9',
      gradientTo: '#0284c7',
    },
    night: {
      primary: '#0369a1',
      secondary: '#0284c7',
      accent: '#a5b4fc',
      background: '#0c4a6e',
      gradientFrom: '#0369a1',
      gradientTo: '#1e3a8a',
    },
  },
  drizzle: {
    day: {
      primary: '#06b6d4',
      secondary: '#22d3ee',
      accent: '#8b5cf6',
      background: '#ecfeff',
      gradientFrom: '#06b6d4',
      gradientTo: '#0891b2',
    },
    night: {
      primary: '#0e7490',
      secondary: '#0891b2',
      accent: '#c4b5fd',
      background: '#164e63',
      gradientFrom: '#0e7490',
      gradientTo: '#155e75',
    },
  },
  thunderstorm: {
    day: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
      accent: '#f59e0b',
      background: '#ede9fe',
      gradientFrom: '#7c3aed',
      gradientTo: '#5b21b6',
    },
    night: {
      primary: '#5b21b6',
      secondary: '#6d28d9',
      accent: '#fbbf24',
      background: '#2e1065',
      gradientFrom: '#5b21b6',
      gradientTo: '#4c1d95',
    },
  },
  snow: {
    day: {
      primary: '#e0f2fe',
      secondary: '#bae6fd',
      accent: '#06b6d4',
      background: '#f8fafc',
      gradientFrom: '#e0f2fe',
      gradientTo: '#bae6fd',
    },
    night: {
      primary: '#cbd5e1',
      secondary: '#94a3b8',
      accent: '#22d3ee',
      background: '#334155',
      gradientFrom: '#475569',
      gradientTo: '#334155',
    },
  },
  mist: {
    day: {
      primary: '#9ca3af',
      secondary: '#d1d5db',
      accent: '#6366f1',
      background: '#f3f4f6',
      gradientFrom: '#9ca3af',
      gradientTo: '#6b7280',
    },
    night: {
      primary: '#4b5563',
      secondary: '#6b7280',
      accent: '#a5b4fc',
      background: '#374151',
      gradientFrom: '#4b5563',
      gradientTo: '#374151',
    },
  },
  fog: {
    day: {
      primary: '#9ca3af',
      secondary: '#d1d5db',
      accent: '#8b5cf6',
      background: '#f9fafb',
      gradientFrom: '#d1d5db',
      gradientTo: '#9ca3af',
    },
    night: {
      primary: '#4b5563',
      secondary: '#6b7280',
      accent: '#c4b5fd',
      background: '#1f2937',
      gradientFrom: '#4b5563',
      gradientTo: '#374151',
    },
  },
  haze: {
    day: {
      primary: '#d97706',
      secondary: '#fbbf24',
      accent: '#0ea5e9',
      background: '#fef3c7',
      gradientFrom: '#d97706',
      gradientTo: '#b45309',
    },
    night: {
      primary: '#92400e',
      secondary: '#b45309',
      accent: '#38bdf8',
      background: '#451a03',
      gradientFrom: '#92400e',
      gradientTo: '#78350f',
    },
  },
  dust: {
    day: {
      primary: '#a16207',
      secondary: '#ca8a04',
      accent: '#0284c7',
      background: '#fef9c3',
      gradientFrom: '#a16207',
      gradientTo: '#854d0e',
    },
    night: {
      primary: '#713f12',
      secondary: '#854d0e',
      accent: '#0ea5e9',
      background: '#422006',
      gradientFrom: '#713f12',
      gradientTo: '#451a03',
    },
  },
  sand: {
    day: {
      primary: '#b45309',
      secondary: '#d97706',
      accent: '#3b82f6',
      background: '#fef3c7',
      gradientFrom: '#b45309',
      gradientTo: '#92400e',
    },
    night: {
      primary: '#78350f',
      secondary: '#92400e',
      accent: '#60a5fa',
      background: '#451a03',
      gradientFrom: '#78350f',
      gradientTo: '#451a03',
    },
  },
  ash: {
    day: {
      primary: '#57534e',
      secondary: '#78716c',
      accent: '#dc2626',
      background: '#e7e5e4',
      gradientFrom: '#57534e',
      gradientTo: '#44403c',
    },
    night: {
      primary: '#292524',
      secondary: '#44403c',
      accent: '#ef4444',
      background: '#1c1917',
      gradientFrom: '#292524',
      gradientTo: '#1c1917',
    },
  },
  squall: {
    day: {
      primary: '#0369a1',
      secondary: '#0284c7',
      accent: '#7c3aed',
      background: '#e0f2fe',
      gradientFrom: '#0369a1',
      gradientTo: '#075985',
    },
    night: {
      primary: '#0c4a6e',
      secondary: '#075985',
      accent: '#a78bfa',
      background: '#082f49',
      gradientFrom: '#0c4a6e',
      gradientTo: '#082f49',
    },
  },
  tornado: {
    day: {
      primary: '#374151',
      secondary: '#4b5563',
      accent: '#dc2626',
      background: '#d1d5db',
      gradientFrom: '#374151',
      gradientTo: '#1f2937',
    },
    night: {
      primary: '#111827',
      secondary: '#1f2937',
      accent: '#ef4444',
      background: '#030712',
      gradientFrom: '#111827',
      gradientTo: '#030712',
    },
  },
};

interface WeatherThemeProviderProps {
  children: ReactNode;
  weatherType: WeatherType;
  isDaytime?: boolean;
}

export function WeatherThemeProvider({
  children,
  weatherType,
  isDaytime = true,
}: WeatherThemeProviderProps) {
  const colors = useMemo(() => {
    const theme = weatherThemes[weatherType] || weatherThemes.clear;
    return isDaytime ? theme.day : theme.night;
  }, [weatherType, isDaytime]);

  return (
    <WeatherThemeContext.Provider value={{ colors, weatherType, isDaytime }}>
      {children}
    </WeatherThemeContext.Provider>
  );
}

export function useWeatherTheme() {
  return useContext(WeatherThemeContext);
}

// CSS custom property styles generator
export function getWeatherThemeStyles(colors: WeatherThemeColors): React.CSSProperties {
  return {
    '--weather-primary': colors.primary,
    '--weather-secondary': colors.secondary,
    '--weather-accent': colors.accent,
    '--weather-background': colors.background,
    '--weather-gradient-from': colors.gradientFrom,
    '--weather-gradient-to': colors.gradientTo,
  } as React.CSSProperties;
}

// Utility to get gradient class based on weather
export function getWeatherGradientClass(weatherType: WeatherType, isDaytime: boolean): string {
  const gradients: Record<string, string> = {
    'clear-day': 'from-amber-400 to-orange-500',
    'clear-night': 'from-blue-900 to-indigo-900',
    'clouds-day': 'from-slate-400 to-slate-600',
    'clouds-night': 'from-slate-700 to-slate-900',
    'rain-day': 'from-cyan-500 to-blue-600',
    'rain-night': 'from-blue-800 to-blue-950',
    'thunderstorm-day': 'from-purple-600 to-purple-800',
    'thunderstorm-night': 'from-purple-900 to-indigo-950',
    'snow-day': 'from-slate-100 to-blue-200',
    'snow-night': 'from-slate-600 to-slate-800',
  };

  const key = `${weatherType}-${isDaytime ? 'day' : 'night'}`;
  return gradients[key] || gradients['clear-day'];
}
