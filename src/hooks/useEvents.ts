'use client';

import { useState, useEffect, useCallback } from 'react';
import { Event, EventFilters, Coordinates } from '@/types';
import { fetchEvents, searchEvents } from '@/services';

interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  filters: EventFilters;
  setFilters: (filters: EventFilters) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refresh: () => Promise<void>;
}

export function useEvents(coordinates: Coordinates | null): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<EventFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const loadEvents = useCallback(async () => {
    if (!coordinates) return;

    setIsLoading(true);
    setError(null);

    try {
      if (searchQuery) {
        const results = await searchEvents(searchQuery, coordinates);
        setEvents(results);
      } else {
        const response = await fetchEvents(coordinates, filters);
        setEvents(response.events);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setIsLoading(false);
    }
  }, [coordinates, filters, searchQuery]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const refresh = useCallback(async () => {
    await loadEvents();
  }, [loadEvents]);

  return {
    events,
    isLoading,
    error,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    refresh,
  };
}
