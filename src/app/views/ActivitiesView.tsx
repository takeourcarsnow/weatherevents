'use client';

import React, { useState, useMemo } from 'react';
import { useActivities } from '@/hooks';
import { useSettings, useApp } from '@/contexts';
import { ActivityList, ActivityFavoriteButton, FavoriteActivities } from '@/components/features';
import { PageContainer, Section } from '@/components/layout';
import { Card, Button, ErrorBoundary } from '@/components/ui';
import { ACTIVITIES, ACTIVITY_CATEGORIES } from '@/constants/activities';
import { motion } from 'framer-motion';

export function ActivitiesView() {
  const { suggestions, isOutdoorWeather, weatherType } = useActivities();
  const { preferences, addActivityToHistory } = useSettings();
  const { weather } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredSuggestions = useMemo(() => {
    let filtered = suggestions;

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter((s) =>
        preferences.favoriteActivities.includes(s.activity.id)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'indoor') {
        filtered = filtered.filter((s) => s.activity.indoor);
      } else if (selectedCategory === 'outdoor') {
        filtered = filtered.filter((s) => !s.activity.indoor);
      } else {
        filtered = filtered.filter((s) => s.activity.category === selectedCategory);
      }
    }

    return filtered;
  }, [suggestions, selectedCategory, showFavoritesOnly, preferences.favoriteActivities]);

  const handleMarkComplete = (activityId: string) => {
    if (weather) {
      addActivityToHistory({
        activityId,
        weatherCondition: weatherType,
        temperature: weather.temperature,
      });
    }
  };

  return (
    <PageContainer>
      {/* Favorite Activities Section */}
      {preferences.favoriteActivities.length > 0 && (
        <ErrorBoundary>
          <Section>
            <FavoriteActivities activities={ACTIVITIES} />
          </Section>
        </ErrorBoundary>
      )}

      {/* Filters */}
      <Section>
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            size="sm"
            variant={showFavoritesOnly ? 'primary' : 'secondary'}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex-shrink-0"
          >
            ❤️ Favorites
          </Button>
          {ACTIVITY_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? 'primary' : 'secondary'}
              onClick={() => setSelectedCategory(category.id)}
              className="flex-shrink-0"
            >
              {category.icon} {category.label}
            </Button>
          ))}
        </div>
      </Section>

      {/* Results Count */}
      <div className="px-4 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filteredSuggestions.length} activit{filteredSuggestions.length === 1 ? 'y' : 'ies'} found
          {showFavoritesOnly && ' in favorites'}
          {selectedCategory !== 'all' && ` in ${ACTIVITY_CATEGORIES.find((c) => c.id === selectedCategory)?.label}`}
        </p>
      </div>

      {/* Empty State */}
      {filteredSuggestions.length === 0 ? (
        <Section>
          <Card variant="default" padding="md" className="text-center py-8">
            <span className="text-4xl mb-3 block">🔍</span>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              No activities found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {showFavoritesOnly
                ? 'Add some activities to your favorites first!'
                : 'Try selecting a different category'}
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setShowFavoritesOnly(false);
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        </Section>
      ) : (
        <Section
          title="Activities for Today"
          subtitle={`Based on ${weatherType} weather conditions`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="default" padding="md" className="relative">
                  {/* Favorite Button */}
                  <div className="absolute top-3 right-3">
                    <ActivityFavoriteButton activityId={suggestion.activity.id} />
                  </div>

                  {/* Activity Content */}
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{suggestion.activity.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white pr-8">
                        {suggestion.activity.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {suggestion.activity.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                          {suggestion.activity.duration}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          suggestion.activity.indoor
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300'
                        }`}>
                          {suggestion.activity.indoor ? '🏠 Indoor' : '🌳 Outdoor'}
                        </span>
                        {suggestion.activity.priceRange && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300">
                            {suggestion.activity.priceRange}
                          </span>
                        )}
                      </div>

                      {/* Match Score */}
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${suggestion.matchScore}%` }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {suggestion.matchScore}%
                        </span>
                      </div>

                      {/* Reason */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        💡 {suggestion.reason}
                      </p>

                      {/* Mark Complete Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkComplete(suggestion.activity.id)}
                        className="mt-3"
                      >
                        ✓ Mark as Done
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>
      )}
    </PageContainer>
  );
}
