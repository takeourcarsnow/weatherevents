'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      {icon && (
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <span className="text-3xl">{icon}</span>
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}

// Pre-built empty states
export function NoResultsState({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="No results found"
      description="Try adjusting your search or filters to find what you're looking for."
      action={
        onReset && (
          <button
            onClick={onReset}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Clear filters
          </button>
        )
      }
    />
  );
}

export function NoEventsState() {
  return (
    <EmptyState
      icon="🎉"
      title="No events nearby"
      description="Check back later for upcoming events in your area."
    />
  );
}

export function LocationErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon="📍"
      title="Location access needed"
      description="Enable location services to get weather and events for your area."
      action={
        onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
          >
            Enable Location
          </button>
        )
      }
    />
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon="⚠️"
      title="Something went wrong"
      description={message || 'An error occurred. Please try again.'}
      action={
        onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        )
      }
    />
  );
}
