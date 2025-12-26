'use client';

import React from 'react';
import { useApp } from '@/contexts';
import { useActivities } from '@/hooks';
import {
  WeatherDisplay,
  WeatherDetails,
  HourlyForecastDisplay,
  DailyForecastDisplay,
  ActivityCard,
  EventCardCompact,
} from '@/components/features';
import { PageContainer, Section, HScroll } from '@/components/layout';
import { SkeletonWeather, SkeletonCard, Button } from '@/components/ui';
import { Event } from '@/types';
import { fetchEvents } from '@/services';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const { weather, forecast, location, isLoading, error, useDemoMode } = useApp();
  const { suggestions, isOutdoorWeather } = useActivities();
  const [events, setEvents] = React.useState<Event[]>([]);

  // Fetch events
  React.useEffect(() => {
    if (location.coordinates) {
      fetchEvents(location.coordinates, { isIndoor: !isOutdoorWeather })
        .then((res) => setEvents(res.events.slice(0, 6)))
        .catch(console.error);
    }
  }, [location.coordinates, isOutdoorWeather]);

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

  return (
    <PageContainer>
      {/* Demo mode banner */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            📌 {error}
          </p>
        </div>
      )}

      {/* Weather Card */}
      <Section>
        <WeatherDisplay weather={weather} />
      </Section>

      {/* Hourly Forecast */}
      <Section>
        <HourlyForecastDisplay hourly={forecast.hourly} />
      </Section>

      {/* Suggested Activities */}
      <Section
        title="Suggested Activities"
        subtitle={isOutdoorWeather ? 'Perfect for outdoor fun!' : 'Best indoor options for today'}
        action={
          <button
            onClick={() => onNavigate('activities')}
            className="text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            See all
          </button>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topActivities.map((suggestion) => (
            <ActivityCard key={suggestion.activity.id} suggestion={suggestion} />
          ))}
        </div>
      </Section>

      {/* Events */}
      {events.length > 0 && (
        <Section
          title="Events Near You"
          action={
            <button
              onClick={() => onNavigate('events')}
              className="text-sm text-blue-500 hover:text-blue-600 font-medium"
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
      )}

      {/* Weather Details */}
      <Section>
        <WeatherDetails weather={weather} />
      </Section>

      {/* 5-Day Forecast */}
      <Section>
        <DailyForecastDisplay daily={forecast.daily} />
      </Section>
    </PageContainer>
  );
}
