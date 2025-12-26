'use client';

import React, { useState } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { geocodeCity } from '@/services';
import { useApp } from '@/contexts';

interface LocationSearchProps {
  onClose?: () => void;
}

export function LocationSearch({ onClose }: LocationSearchProps) {
  const { setManualLocation, refreshLocation } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Array<{
    name: string;
    country: string;
    state?: string;
    lat: number;
    lon: number;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const data = await geocodeCity(searchQuery);
      if (data.length === 0) {
        setError('No locations found. Try a different search.');
      } else {
        setResults(data);
      }
    } catch (err) {
      setError('Failed to search. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (result: typeof results[0]) => {
    setManualLocation(
      { latitude: result.lat, longitude: result.lon },
      result.name,
      result.country
    );
    onClose?.();
  };

  const handleUseCurrentLocation = async () => {
    await refreshLocation();
    onClose?.();
  };

  return (
    <Card variant="glass" padding="lg" className="max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Change Location
      </h3>

      {/* Search input */}
      <div className="flex gap-2 mb-4">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter city name..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} isLoading={isSearching}>
          Search
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {/* Search results */}
      {results.length > 0 && (
        <div className="space-y-2 mb-4">
          {results.map((result, index) => (
            <button
              key={`${result.lat}-${result.lon}-${index}`}
              onClick={() => handleSelectLocation(result)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {result.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {result.state ? `${result.state}, ` : ''}{result.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Use current location button */}
      <Button
        variant="secondary"
        onClick={handleUseCurrentLocation}
        className="w-full"
        leftIcon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM12 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" />
          </svg>
        }
      >
        Use Current Location
      </Button>

      {/* Close button */}
      {onClose && (
        <Button variant="ghost" onClick={onClose} className="w-full mt-2">
          Cancel
        </Button>
      )}
    </Card>
  );
}
