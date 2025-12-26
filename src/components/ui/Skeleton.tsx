'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'shimmer' | 'none';
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const baseStyles = 'bg-gray-200 dark:bg-gray-700';

  const variants = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-2xl',
  };

  const animations = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], animations[animation], className)}
      style={style}
      {...props}
    />
  );
}

// Common skeleton patterns
export function SkeletonCard() {
  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-gray-900 shadow-sm">
      <Skeleton variant="rounded" height={120} className="mb-4" />
      <Skeleton className="w-3/4 mb-2" />
      <Skeleton className="w-1/2" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1">
            <Skeleton className="w-3/4 mb-2" />
            <Skeleton className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonWeather() {
  return (
    <div className="space-y-4">
      <Skeleton variant="circular" width={80} height={80} className="mx-auto" />
      <Skeleton className="w-24 h-10 mx-auto" />
      <Skeleton className="w-32 mx-auto" />
    </div>
  );
}
