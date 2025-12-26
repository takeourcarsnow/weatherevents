'use client';

import React from 'react';
import { cn } from '@/utils/cn';

// Loading spinner
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={cn('animate-spin text-blue-500', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// Full page loading
export function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-950 z-50">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900" />
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">{message}</p>
    </div>
  );
}

// Loading overlay
export function LoadingOverlay({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-40 rounded-3xl">
      <Spinner size="lg" />
    </div>
  );
}

// Pull to refresh indicator
export function PullToRefreshIndicator({ progress }: { progress: number }) {
  const rotation = Math.min(progress * 360, 360);
  const opacity = Math.min(progress, 1);

  return (
    <div
      className="flex items-center justify-center py-4 transition-opacity"
      style={{ opacity }}
    >
      <svg
        className="w-6 h-6 text-blue-500"
        style={{ transform: `rotate(${rotation}deg)` }}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 12a9 9 0 11-6.219-8.56" />
      </svg>
    </div>
  );
}

// Dots loading animation
export function DotsLoading() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
