'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({
  children,
  className,
  noPadding = false,
}: PageContainerProps) {
  return (
    <main
      className={cn(
        'min-h-screen pb-24', // pb-24 for bottom nav
        !noPadding && 'px-4 py-6',
        className
      )}
    >
      <div className="max-w-4xl mx-auto">{children}</div>
    </main>
  );
}

// Section wrapper for content sections
interface SectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function Section({
  title,
  subtitle,
  children,
  className,
  action,
}: SectionProps) {
  return (
    <section className={cn('mb-8', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

// Grid container
interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Grid({ children, cols = 2, gap = 'md', className }: GridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div className={cn('grid', colClasses[cols], gapClasses[gap], className)}>
      {children}
    </div>
  );
}

// Horizontal scroll container
interface HScrollProps {
  children: React.ReactNode;
  className?: string;
}

export function HScroll({ children, className }: HScrollProps) {
  return (
    <div className={cn('overflow-x-auto scrollbar-hide -mx-4 px-4', className)}>
      <div className="flex gap-4 pb-2 min-w-max">{children}</div>
    </div>
  );
}

// Divider
export function Divider({ className }: { className?: string }) {
  return (
    <hr
      className={cn(
        'border-t border-gray-200 dark:border-gray-800 my-6',
        className
      )}
    />
  );
}
