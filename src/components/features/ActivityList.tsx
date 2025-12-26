'use client';

import React, { useState } from 'react';
import { ActivitySuggestion } from '@/types';
import { ActivityCard } from './ActivityCard';
import { ScrollableTabs, EmptyState } from '@/components/ui';
import { ACTIVITY_CATEGORIES } from '@/constants';
import { filterActivitiesByCategory } from '@/utils';

interface ActivityListProps {
  suggestions: ActivitySuggestion[];
  isOutdoorWeather: boolean;
}

export function ActivityList({ suggestions, isOutdoorWeather }: ActivityListProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredActivities = filterActivitiesByCategory(suggestions, activeCategory);

  return (
    <div>
      {/* Category tabs */}
      <ScrollableTabs
        tabs={ACTIVITY_CATEGORIES}
        activeTab={activeCategory}
        onChange={setActiveCategory}
        className="mb-6"
      />

      {/* Weather context banner */}
      <div
        className={`mb-6 p-4 rounded-2xl ${
          isOutdoorWeather
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
        }`}
      >
        <p
          className={`text-sm font-medium ${
            isOutdoorWeather
              ? 'text-green-700 dark:text-green-300'
              : 'text-blue-700 dark:text-blue-300'
          }`}
        >
          {isOutdoorWeather
            ? '☀️ Great weather for outdoor activities!'
            : '🏠 Weather suggests indoor activities today.'}
        </p>
      </div>

      {/* Activity grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map((suggestion) => (
            <ActivityCard key={suggestion.activity.id} suggestion={suggestion} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="🔍"
          title="No activities found"
          description="Try selecting a different category."
        />
      )}
    </div>
  );
}
