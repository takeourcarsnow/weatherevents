'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-3xl transition-all duration-300';

  const variants = {
    default: `
      bg-white dark:bg-gray-900
      shadow-sm
    `,
    glass: `
      bg-white/70 dark:bg-gray-900/70
      backdrop-blur-xl
      border border-white/20 dark:border-gray-700/30
      shadow-lg
    `,
    elevated: `
      bg-white dark:bg-gray-900
      shadow-xl shadow-black/5 dark:shadow-black/20
    `,
    bordered: `
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-800
    `,
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const hoverStyles = hover
    ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer active:scale-[0.98]'
    : '';

  return (
    <div
      className={cn(baseStyles, variants[variant], paddings[padding], hoverStyles, className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Card subcomponents
export function CardHeader({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-sm text-gray-600 dark:text-gray-400 mt-1', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-gray-100 dark:border-gray-800', className)} {...props}>
      {children}
    </div>
  );
}
