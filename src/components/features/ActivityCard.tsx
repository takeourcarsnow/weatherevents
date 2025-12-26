'use client';

import React from 'react';
import { ActivitySuggestion } from '@/types';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/utils/cn';

interface ActivityCardProps {
  suggestion: ActivitySuggestion;
  onClick?: () => void;
}

export function ActivityCard({ suggestion, onClick }: ActivityCardProps) {
  const { activity, reason, matchScore } = suggestion;

  return (
    <Card
      variant="default"
      padding="md"
      hover={!!onClick}
      onClick={onClick}
      className="h-full"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{activity.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {activity.name}
            </h4>
            {matchScore >= 80 && (
              <Badge variant="success" size="sm">
                Great match
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {activity.description}
          </p>
          
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="outline" size="sm">
              ⏱️ {activity.duration}
            </Badge>
            {activity.priceRange && (
              <Badge variant="outline" size="sm">
                {activity.priceRange === 'free' ? '🆓 Free' : `💰 ${activity.priceRange}`}
              </Badge>
            )}
            {activity.indoor ? (
              <Badge variant="primary" size="sm">🏠 Indoor</Badge>
            ) : (
              <Badge variant="success" size="sm">🌳 Outdoor</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {reason}
        </p>
      </div>
    </Card>
  );
}

// Compact version for list views
export function ActivityCardCompact({ suggestion, onClick }: ActivityCardProps) {
  const { activity } = suggestion;

  return (
    <button
      onClick={onClick}
      className={cn(
        `w-full flex items-center gap-3 p-3 rounded-2xl
        bg-white dark:bg-gray-900 shadow-sm
        hover:shadow-md hover:scale-[1.02]
        transition-all duration-200
        text-left`
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
        <span className="text-xl">{activity.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate">
          {activity.name}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {activity.duration} • {activity.indoor ? 'Indoor' : 'Outdoor'}
        </p>
      </div>
      <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
