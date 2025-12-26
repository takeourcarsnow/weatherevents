'use client';

import React, { useState } from 'react';
import { Event, EventCategory, Coordinates } from '@/types';
import { EventCard } from './EventCard';
import { ScrollableTabs, SearchInput, EmptyState, SkeletonCard } from '@/components/ui';
import { getEventCategories } from '@/services';
import { useEvents, useDebounce } from '@/hooks';

interface EventListProps {
  coordinates: Coordinates;
  isOutdoorWeather?: boolean;
}

export function EventList({ coordinates, isOutdoorWeather }: EventListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const { events, isLoading, error, setFilters, setSearchQuery } = useEvents(coordinates);

  // Update filters when category changes
  React.useEffect(() => {
    if (activeCategory === 'all') {
      setFilters({});
    } else {
      setFilters({ category: activeCategory as EventCategory });
    }
  }, [activeCategory, setFilters]);

  // Update search query
  React.useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const categories = [
    { id: 'all', label: 'All Events', icon: '✨' },
    ...getEventCategories(),
  ];

  // Filter events based on weather if needed
  const displayEvents = React.useMemo(() => {
    if (isOutdoorWeather === undefined) return events;
    
    // When weather is bad, prioritize indoor events at the top
    if (!isOutdoorWeather) {
      const indoorEvents = events.filter((e) => !e.tags.includes('outdoor'));
      const outdoorEvents = events.filter((e) => e.tags.includes('outdoor'));
      return [...indoorEvents, ...outdoorEvents];
    }
    
    return events;
  }, [events, isOutdoorWeather]);

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <SearchInput
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search events..."
        />
      </div>

      {/* Category tabs */}
      <ScrollableTabs
        tabs={categories}
        activeTab={activeCategory}
        onChange={setActiveCategory}
        className="mb-6"
      />

      {/* Weather tip */}
      {isOutdoorWeather !== undefined && !isOutdoorWeather && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            🏠 Indoor events shown first due to weather conditions.
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <EmptyState
          icon="⚠️"
          title="Unable to load events"
          description={error}
        />
      )}

      {/* Event grid */}
      {!isLoading && !error && displayEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && displayEvents.length === 0 && (
        <EmptyState
          icon="🎉"
          title="No events found"
          description={
            searchInput
              ? 'Try a different search term.'
              : 'Check back later for upcoming events.'
          }
        />
      )}
    </div>
  );
}
