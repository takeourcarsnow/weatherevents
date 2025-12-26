'use client';

import React, { useState, useCallback } from 'react';
import { useApp, useSettings } from '@/contexts';
import { useActivities, useAirQualityQuery, useRefreshWeather } from '@/hooks';
import {
  WeatherDisplay,
  WeatherDetails,
  HourlyForecastDisplay,
  DailyForecastDisplay,
  ActivityCard,
  EventCardCompact,
  AirQualityDisplay,
  WeatherTimeline,
  BestDayRecommendation,
  WeatherAlerts,
  getMockWeatherAlerts,
  RainRadar,
  FavoriteActivities,
  PWAInstallPrompt,
  OfflineIndicator,
  ActivityFavoriteButton,
} from '@/components/features';
import { PageContainer, Section, HScroll } from '@/components/layout';
import { SkeletonWeather, SkeletonCard, Button, PullToRefresh, ErrorBoundary } from '@/components/ui';
import { Event } from '@/types';
import { fetchEvents } from '@/services';
import { ACTIVITIES } from '@/constants/activities';
import { motion, AnimatePresence } from 'framer-motion';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { weather, forecast, location, isLoading, error, useDemoMode } = useApp();
  const { suggestions, isOutdoorWeather } = useActivities();
  const { preferences } = useSettings();
  const refreshWeather = useRefreshWeather();
  
  const [events, setEvents] = React.useState<Event[]>([]);
  const [weatherAlerts, setWeatherAlerts] = useState(getMockWeatherAlerts());

  // Air quality query
  const { data: airQuality } = useAirQualityQuery(location.coordinates);

  // Fetch events
  React.useEffect(() => {
    if (location.coordinates) {
      fetchEvents(location.coordinates, { isIndoor: !isOutdoorWeather })
        .then((res) => setEvents(res.events.slice(0, 6)))
        .catch(console.error);
    }
  }, [location.coordinates, isOutdoorWeather]);

  // Pull to refresh handler
  const handleRefresh = useCallback(async () => {
    refreshWeather();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, [refreshWeather]);

  // Dismiss alert
  const handleDismissAlert = (id: string) => {
    setWeatherAlerts((alerts) => alerts.filter((a) => a.id !== id));
  };

  // Loading state
  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <SkeletonWeather />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </PageContainer>
    );
  }

  // Error state with demo mode option
  if (error && !weather) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="text-5xl mb-4">⚠️</span>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Weather
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
            {error}
          </p>
          <Button onClick={useDemoMode}>
            Use Demo Mode
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (!weather || !forecast) return null;

  const topActivities = suggestions.slice(0, 4);
  
  // Get precipitation data for rain radar
  const precipitationData = forecast.hourly.slice(0, 6).map((h) => Math.round(h.pop * 100));

  return (
    <>
      <OfflineIndicator />
      <PullToRefresh onRefresh={handleRefresh}>
        <PageContainer>
          {/* Demo mode banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
              >
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  📌 {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weather Alerts */}
          <ErrorBoundary>
            <WeatherAlerts
              alerts={weatherAlerts}
              onDismiss={handleDismissAlert}
              className="mb-6"
            />
          </ErrorBoundary>

          {/* Weather Card */}
          <ErrorBoundary>
            <Section>
              <WeatherDisplay weather={weather} />
            </Section>
          </ErrorBoundary>

          {/* Activity Timeline */}
          <ErrorBoundary>
            <Section>
              <WeatherTimeline
                hourlyForecast={forecast.hourly}
                sunrise={weather.sunrise}
                sunset={weather.sunset}
              />
            </Section>
          </ErrorBoundary>

          {/* Hourly Forecast */}
          <ErrorBoundary>
            <Section>
              <HourlyForecastDisplay hourly={forecast.hourly} />
            </Section>
          </ErrorBoundary>

          {/* Air Quality */}
          {airQuality && (
            <ErrorBoundary>
              <Section>
                <AirQualityDisplay data={airQuality} />
              </Section>
            </ErrorBoundary>
          )}

          {/* Favorite Activities */}
          {preferences.favoriteActivities.length > 0 && (
            <ErrorBoundary>
              <Section>
                <FavoriteActivities activities={ACTIVITIES} />
              </Section>
            </ErrorBoundary>
          )}

          {/* Suggested Activities */}
          <ErrorBoundary>
            <Section
              title="Suggested Activities"
              subtitle={isOutdoorWeather ? 'Perfect for outdoor fun!' : 'Best indoor options for today'}
              action={
                <button
                  onClick={() => onNavigate('activities')}
                  className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                  aria-label="See all activities"
                >
                  See all
                </button>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topActivities.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <ActivityCard suggestion={suggestion} />
                    <div className="absolute top-3 right-3">
                      <ActivityFavoriteButton activityId={suggestion.activity.id} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Section>
          </ErrorBoundary>

          {/* Best Day This Week */}
          <ErrorBoundary>
            <Section>
              <BestDayRecommendation dailyForecast={forecast.daily} />
            </Section>
          </ErrorBoundary>

          {/* Rain Radar */}
          {precipitationData.some((p) => p > 0) && (
            <ErrorBoundary>
              <Section>
                <RainRadar precipitationData={precipitationData} />
              </Section>
            </ErrorBoundary>
          )}

          {/* Events */}
          {events.length > 0 && (
            <ErrorBoundary>
              <Section
                title="Events Near You"
                action={
                  <button
                    onClick={() => onNavigate('events')}
                    className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                    aria-label="See all events"
                  >
                    See all
                  </button>
                }
              >
                <HScroll>
                  {events.map((event) => (
                    <EventCardCompact key={event.id} event={event} />
                  ))}
                </HScroll>
              </Section>
            </ErrorBoundary>
          )}

          {/* Weather Details */}
          <ErrorBoundary>
            <Section>
              <WeatherDetails weather={weather} />
            </Section>
          </ErrorBoundary>

          {/* 5-Day Forecast */}
          <ErrorBoundary>
            <Section>
              <DailyForecastDisplay daily={forecast.daily} />
            </Section>
          </ErrorBoundary>
        </PageContainer>
      </PullToRefresh>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </>
  );
}
