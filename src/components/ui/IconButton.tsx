'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

export function IconButton({
  children,
  className,
  variant = 'default',
  size = 'md',
  rounded = true,
  ...props
}: IconButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    transition-all duration-200
    active:scale-90
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
  `;

  const variants = {
    default: `
      text-gray-600 hover:text-gray-900 hover:bg-gray-100
      dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800
    `,
    ghost: `
      text-gray-500 hover:text-gray-700 hover:bg-gray-50
      dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50
    `,
    outline: `
      border border-gray-300 text-gray-600
      hover:bg-gray-50 hover:border-gray-400
      dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800
    `,
    filled: `
      bg-gray-100 text-gray-700
      hover:bg-gray-200
      dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700
    `,
  };

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        rounded ? 'rounded-full' : 'rounded-xl',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
