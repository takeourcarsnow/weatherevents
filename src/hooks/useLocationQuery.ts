'use client';

import { useQuery } from '@tanstack/react-query';
import { Coordinates, GeocodingResult } from '@/types';

async function searchLocations(query: string): Promise<GeocodingResult[]> {
  const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}&limit=5`);
  if (!response.ok) throw new Error('Failed to search locations');
  return response.json();
}

async function reverseGeocode(coords: Coordinates): Promise<GeocodingResult[]> {
  const response = await fetch(`/api/geocode?lat=${coords.latitude}&lon=${coords.longitude}`);
  if (!response.ok) throw new Error('Failed to reverse geocode');
  return response.json();
}

export function useLocationSearchQuery(query: string) {
  return useQuery({
    queryKey: ['locationSearch', query],
    queryFn: () => searchLocations(query),
    enabled: query.length >= 2,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}

export function useReverseGeocodeQuery(coords: Coordinates | null) {
  return useQuery({
    queryKey: ['reverseGeocode', coords?.latitude, coords?.longitude],
    queryFn: async () => {
      if (!coords) throw new Error('No coordinates');
      return reverseGeocode(coords);
    },
    enabled: !!coords,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
