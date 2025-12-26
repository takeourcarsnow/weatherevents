'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ActivityHistoryEntry } from '@/types';
import { Card, Button } from '@/components/ui';
import { useSettings } from '@/contexts/SettingsContext';
import { format } from 'date-fns';

interface FavoriteActivitiesProps {
  activities: Activity[];
  className?: string;
}

export function FavoriteActivities({ activities, className = '' }: FavoriteActivitiesProps) {
  const { preferences, toggleFavoriteActivity, isFavoriteActivity } = useSettings();

  const favoriteActivities = activities.filter((a) =>
    preferences.favoriteActivities.includes(a.id)
  );

  if (favoriteActivities.length === 0) {
    return (
      <Card variant="default" padding="md" className={className}>
        <div className="text-center py-6">
          <span className="text-4xl mb-3 block">⭐</span>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            No Favorite Activities
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tap the heart icon on activities to add them here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="md" className={className}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Your Favorites
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {favoriteActivities.slice(0, 6).map((activity, index) => (
          <motion.div
            key={activity.id}
            className="relative p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <button
              onClick={() => toggleFavoriteActivity(activity.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-600"
              aria-label="Remove from favorites"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            <span className="text-2xl">{activity.icon}</span>
            <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
              {activity.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {activity.duration}
            </p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

interface ActivityHistoryDisplayProps {
  activities: Activity[];
  className?: string;
}

export function ActivityHistoryDisplay({
  activities,
  className = '',
}: ActivityHistoryDisplayProps) {
  const { preferences, getActivityHistory } = useSettings();
  const history = getActivityHistory();

  if (history.length === 0) {
    return (
      <Card variant="default" padding="md" className={className}>
        <div className="text-center py-6">
          <span className="text-4xl mb-3 block">📋</span>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            No Activity History
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your completed activities will appear here
          </p>
        </div>
      </Card>
    );
  }

  const getActivity = (id: string) => activities.find((a) => a.id === id);

  return (
    <Card variant="default" padding="md" className={className}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Activity History
      </h3>

      <div className="space-y-3">
        {history.slice(0, 10).map((entry, index) => {
          const activity = getActivity(entry.activityId);
          if (!activity) return null;

          return (
            <motion.div
              key={`${entry.activityId}-${entry.date}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {activity.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(entry.date), 'MMM d, yyyy')} • {entry.weatherCondition} • {entry.temperature}°
                </p>
              </div>
              {entry.rating && (
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < entry.rating! ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

interface ActivityFavoriteButtonProps {
  activityId: string;
  size?: 'sm' | 'md';
}

export function ActivityFavoriteButton({
  activityId,
  size = 'md',
}: ActivityFavoriteButtonProps) {
  const { toggleFavoriteActivity, isFavoriteActivity } = useSettings();
  const isFavorite = isFavoriteActivity(activityId);

  const sizeClasses = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavoriteActivity(activityId);
      }}
      className={`transition-colors ${
        isFavorite
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={sizeClasses}
        fill={isFavorite ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
