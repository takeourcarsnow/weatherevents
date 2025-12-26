'use client';

import { useQuery } from '@tanstack/react-query';
import { Event, EventFilters, Coordinates } from '@/types';
import { fetchEvents, searchEvents as searchEventsService } from '@/services/eventsService';

export function useEventsQuery(coords: Coordinates | null, filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', coords?.latitude, coords?.longitude, filters],
    queryFn: async () => {
      if (!coords) throw new Error('No coordinates');
      return fetchEvents(coords, filters);
    },
    enabled: !!coords,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
}

export function useEventSearchQuery(query: string, coords: Coordinates | null) {
  return useQuery({
    queryKey: ['eventSearch', query, coords?.latitude, coords?.longitude],
    queryFn: async () => {
      if (!coords || !query.trim()) return [];
      return searchEventsService(query, coords);
    },
    enabled: !!coords && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
}
